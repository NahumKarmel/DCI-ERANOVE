/**
 * Session applicative — création, lecture, destruction.
 *
 * Aucun service d'authentification tiers, aucun JWT : une table `session` et un
 * cookie qui ne porte qu'un jeton opaque (T1.b, T3.a). Le cookie ne contient ni
 * identifiant d'utilisateur, ni rôle, ni filiale — rien qui puisse être lu ou
 * forgé côté client. Toute information de session est relue en base à chaque
 * requête.
 *
 * Ce module s'exécute en runtime Node : il touche la base et doit donc rester
 * hors du middleware, qui tourne en runtime Edge.
 */

import 'server-only';

import { randomBytes } from 'node:crypto';

import { eq, lt } from 'drizzle-orm';
import { cookies } from 'next/headers';

import { db } from '@/db/client';
import { filiale, session, utilisateur } from '@/db/schema';
import { journaliser } from './journal';
import type { Acteur, Role } from './habilitations';

/** Nom du cookie de session. */
const NOM_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'dci_session';

/** Durée de vie d'une session, en heures. */
const TTL_HEURES = Number(process.env.SESSION_TTL_HEURES ?? '12');

/**
 * L'utilisateur connecté, tel que les écrans le consomment.
 *
 * Étend `Acteur` — les fonctions d'habilitation s'appliquent donc directement,
 * sans conversion.
 */
export interface Utilisateur extends Acteur {
  readonly email: string;
  readonly prenom: string;
  readonly nom: string;
  readonly role: Role;
  readonly doitChangerMotDePasse: boolean;
  /** Libellé de la filiale de rattachement, pour l'affichage. */
  readonly filialeLibelle: string | null;
}

/** Jeton de session : 32 octets d'aléa, base64url. Opaque et non devinable. */
function nouveauJeton(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Ouvre une session et pose le cookie.
 *
 * `httpOnly` — inaccessible au JavaScript de la page, donc au vol par XSS.
 * `sameSite: 'lax'` — le cookie ne part pas sur une requête inter-site
 * déclenchée par un tiers, ce qui coupe le CSRF sur les mutations.
 * `secure` en production seulement : en développement, l'application tourne en
 * HTTP et un cookie `secure` ne serait jamais posé.
 */
export async function ouvrirSession(
  utilisateurId: number,
  contexte: { adresseIp?: string; agentUtilisateur?: string } = {},
): Promise<void> {
  const id = nouveauJeton();
  const expireLe = new Date(Date.now() + TTL_HEURES * 3_600_000);

  await db.insert(session).values({
    id,
    utilisateurId,
    expireLe,
    adresseIp: contexte.adresseIp ?? null,
    agentUtilisateur: contexte.agentUtilisateur ?? null,
  });

  await db
    .update(utilisateur)
    .set({ derniereConnexionLe: new Date() })
    .where(eq(utilisateur.id, utilisateurId));

  const magasin = await cookies();
  magasin.set(NOM_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expireLe,
  });
}

/**
 * L'utilisateur de la session courante, ou `null`.
 *
 * Une session expirée est traitée comme absente ET supprimée : la table ne
 * conserve pas de jetons morts. Un compte désactivé ne rend jamais
 * d'utilisateur, même si sa session est encore valide — la désactivation prend
 * effet immédiatement.
 */
export async function utilisateurCourant(): Promise<Utilisateur | null> {
  const magasin = await cookies();
  const jeton = magasin.get(NOM_COOKIE)?.value;
  if (!jeton) return null;

  const [ligne] = await db
    .select({
      sessionId: session.id,
      expireLe: session.expireLe,
      id: utilisateur.id,
      email: utilisateur.email,
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      role: utilisateur.role,
      attributAdministrateur: utilisateur.attributAdministrateur,
      filialeId: utilisateur.filialeId,
      doitChangerMotDePasse: utilisateur.doitChangerMotDePasse,
      actif: utilisateur.actif,
      filialeLibelle: filiale.libelle,
    })
    .from(session)
    .innerJoin(utilisateur, eq(session.utilisateurId, utilisateur.id))
    .leftJoin(filiale, eq(utilisateur.filialeId, filiale.id))
    .where(eq(session.id, jeton));

  if (!ligne) return null;

  if (ligne.expireLe.getTime() <= Date.now()) {
    await db.delete(session).where(eq(session.id, ligne.sessionId));
    return null;
  }

  if (!ligne.actif) return null;

  return {
    id: ligne.id,
    email: ligne.email,
    prenom: ligne.prenom,
    nom: ligne.nom,
    role: ligne.role,
    attributAdministrateur: ligne.attributAdministrateur,
    filialeId: ligne.filialeId,
    doitChangerMotDePasse: ligne.doitChangerMotDePasse,
    filialeLibelle: ligne.filialeLibelle,
  };
}

/**
 * Ferme la session courante : ligne supprimée en base ET cookie effacé.
 *
 * La suppression en base est ce qui compte — un cookie conservé par un client
 * hostile ne rouvrirait rien.
 */
export async function fermerSession(): Promise<void> {
  const magasin = await cookies();
  const jeton = magasin.get(NOM_COOKIE)?.value;

  if (jeton) {
    const [ligne] = await db
      .select({ utilisateurId: session.utilisateurId })
      .from(session)
      .where(eq(session.id, jeton));
    await db.delete(session).where(eq(session.id, jeton));
    if (ligne) await journaliser('DECONNEXION', { utilisateurId: ligne.utilisateurId });
  }

  magasin.delete(NOM_COOKIE);
}

/**
 * Ferme toutes les sessions d'un compte. Appelé après un changement de mot de
 * passe : un mot de passe changé doit invalider les sessions ouvertes ailleurs.
 */
export async function fermerToutesLesSessions(utilisateurId: number): Promise<void> {
  await db.delete(session).where(eq(session.utilisateurId, utilisateurId));
}

/** Purge les sessions expirées. Sans effet fonctionnel, garde la table propre. */
export async function purgerSessionsExpirees(): Promise<void> {
  await db.delete(session).where(lt(session.expireLe, new Date()));
}

export { NOM_COOKIE };
