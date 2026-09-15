'use server';

/**
 * Changement de mot de passe obligatoire à la première connexion, et après toute
 * réinitialisation par l'Administrateur (HYP-5 — aucun email n'est envoyé, le mot
 * de passe temporaire est communiqué hors application).
 *
 * Le mot de passe actuel est exigé même quand le changement est imposé : sans
 * cela, un poste laissé ouvert permettrait de s'approprier le compte.
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { utilisateur } from '@/db/schema';
import { journaliser } from '@/lib/auth/journal';
import {
  fermerToutesLesSessions,
  ouvrirSession,
  utilisateurCourant,
} from '@/lib/auth/session';
import { hacher, motifDeRefus, verifier } from '@/lib/auth/motDePasse';

export interface EtatChangement {
  readonly erreur?: string;
}

export async function changerMotDePasse(
  _precedent: EtatChangement,
  donnees: FormData,
): Promise<EtatChangement> {
  const courant = await utilisateurCourant();
  if (!courant) redirect('/connexion');

  const actuel = String(donnees.get('actuel') ?? '');
  const nouveau = String(donnees.get('nouveau') ?? '');
  const confirmation = String(donnees.get('confirmation') ?? '');

  const [compte] = await db
    .select({ motDePasseHash: utilisateur.motDePasseHash })
    .from(utilisateur)
    .where(eq(utilisateur.id, courant.id));

  if (!compte || !(await verifier(compte.motDePasseHash, actuel))) {
    return { erreur: 'Le mot de passe actuel est incorrect.' };
  }

  if (nouveau !== confirmation) {
    return { erreur: 'Les deux saisies du nouveau mot de passe diffèrent.' };
  }

  if (nouveau === actuel) {
    return { erreur: 'Le nouveau mot de passe doit différer de l’actuel.' };
  }

  const refus = motifDeRefus(nouveau);
  if (refus) return { erreur: refus };

  const empreinte = await hacher(nouveau);
  await db
    .update(utilisateur)
    .set({ motDePasseHash: empreinte, doitChangerMotDePasse: false })
    .where(eq(utilisateur.id, courant.id));

  const enTetes = await headers();
  const adresseIp = enTetes.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;

  await journaliser('MOT_DE_PASSE_REINITIALISE', {
    utilisateurId: courant.id,
    entite: 'utilisateur',
    entiteId: courant.id,
    adresseIp,
    details: { parLuiMeme: true },
  });

  // Un mot de passe changé invalide les sessions ouvertes ailleurs. On en
  // rouvre une immédiatement pour ne pas déconnecter l'auteur du changement.
  await fermerToutesLesSessions(courant.id);
  await ouvrirSession(courant.id, {
    adresseIp: adresseIp ?? undefined,
    agentUtilisateur: enTetes.get('user-agent') ?? undefined,
  });

  redirect('/');
}
