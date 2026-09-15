'use server';

/**
 * Actions de connexion et de déconnexion.
 *
 * Deux exigences gouvernent ce fichier :
 *
 *  1. UN ÉCHEC NE DIT JAMAIS CE QUI EST FAUX. Email inconnu, mot de passe
 *     erroné, compte désactivé, empreinte illisible : un seul et même message.
 *     Distinguer les cas donnerait un oracle d'énumération des comptes.
 *
 *  2. LE TEMPS DE RÉPONSE NE DOIT PAS TRAHIR NON PLUS. Sur un email inconnu, on
 *     vérifie quand même une empreinte factice : sans cela, une réponse immédiate
 *     signalerait « ce compte n'existe pas » aussi sûrement qu'un message.
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { utilisateur } from '@/db/schema';
import { journaliser } from '@/lib/auth/journal';
import { fermerSession, ouvrirSession } from '@/lib/auth/session';
import { hacher, verifier } from '@/lib/auth/motDePasse';

/** Message unique de tout échec de connexion. */
const ECHEC = 'Adresse électronique ou mot de passe incorrect.';

export interface EtatConnexion {
  readonly erreur?: string;
}

/**
 * Empreinte factice, calculée une seule fois par processus, vérifiée quand
 * l'email est inconnu pour égaliser le temps de réponse.
 */
let empreinteFactice: Promise<string> | null = null;
function factice(): Promise<string> {
  empreinteFactice ??= hacher('mot-de-passe-inexistant-pour-egaliser-le-temps');
  return empreinteFactice;
}

/** Chemin de retour après connexion. Refuse toute cible non interne. */
function suiteSure(valeur: FormDataEntryValue | null): string {
  if (typeof valeur !== 'string') return '/';
  // Un chemin interne commence par un seul « / ». « //hote » est une URL
  // protocole-relatif, donc une redirection ouverte.
  if (!valeur.startsWith('/') || valeur.startsWith('//')) return '/';
  return valeur;
}

export async function seConnecter(
  _precedent: EtatConnexion,
  donnees: FormData,
): Promise<EtatConnexion> {
  const email = String(donnees.get('email') ?? '').trim();
  const motDePasse = String(donnees.get('motDePasse') ?? '');
  const suite = suiteSure(donnees.get('suite'));

  const enTetes = await headers();
  const adresseIp =
    enTetes.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const agentUtilisateur = enTetes.get('user-agent') ?? undefined;

  if (email === '' || motDePasse === '') return { erreur: ECHEC };

  // Comparaison insensible à la casse, sans extension propriétaire (citext est
  // exclu par la règle du PostgreSQL nu).
  const [compte] = await db
    .select({
      id: utilisateur.id,
      motDePasseHash: utilisateur.motDePasseHash,
      actif: utilisateur.actif,
      doitChangerMotDePasse: utilisateur.doitChangerMotDePasse,
    })
    .from(utilisateur)
    .where(sql`lower(${utilisateur.email}) = lower(${email})`);

  if (!compte) {
    await verifier(await factice(), motDePasse);
    await journaliser('ECHEC_CONNEXION', { adresseIp, details: { email } });
    return { erreur: ECHEC };
  }

  const bon = await verifier(compte.motDePasseHash, motDePasse);

  // Un compte désactivé échoue comme un mot de passe faux, et pour le même
  // motif : ne rien révéler. Le journal, lui, distingue les deux.
  if (!bon || !compte.actif) {
    await journaliser('ECHEC_CONNEXION', {
      utilisateurId: compte.id,
      adresseIp,
      details: { email, motif: bon ? 'COMPTE_DESACTIVE' : 'MOT_DE_PASSE' },
    });
    return { erreur: ECHEC };
  }

  await ouvrirSession(compte.id, {
    adresseIp: adresseIp ?? undefined,
    agentUtilisateur,
  });
  await journaliser('CONNEXION', { utilisateurId: compte.id, adresseIp });

  // Le changement de mot de passe s'impose avant toute autre page.
  redirect(compte.doitChangerMotDePasse ? '/changer-mot-de-passe' : suite);
}

export async function seDeconnecter(): Promise<void> {
  await fermerSession();
  redirect('/connexion');
}
