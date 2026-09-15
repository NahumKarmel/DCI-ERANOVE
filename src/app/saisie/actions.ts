'use server';

/**
 * Enregistrement d'une saisie mensuelle, et dépôt d'un justificatif.
 *
 * TOUT CONTRÔLE EST ICI. L'interface désactive ses champs sur une période close,
 * mais cela n'est qu'un confort : une action serveur reçoit ce qu'on veut bien
 * lui envoyer. Quatre vérifications sont donc faites systématiquement, dans cet
 * ordre, et aucune n'est déductible du formulaire :
 *
 *  1. le rôle est CORRESPONDANT — le Directeur ne saisit pas ;
 *  2. la filiale est celle de la SESSION, jamais celle du formulaire ;
 *  3. la période est ouverte ou rouverte (RG-29, RG-30) ;
 *  4. l'affectation existe — ce qui rend structurellement impossible de saisir
 *     un indicateur non affecté, sans aucun code conditionnel.
 */

import { revalidatePath } from 'next/cache';
import { and, eq, inArray } from 'drizzle-orm';

import { db } from '@/db/client';
import { affectation, pieceJointe, reouverture, saisie } from '@/db/schema';
import { journaliser, peutSaisir, utilisateurCourant } from '@/lib/auth';
import { etatPeriode, saisiePermise } from '@/lib/calculs/periode';
import { maintenant } from '@/lib/instant';
import { motifDeRefusFichier, stockage } from '@/lib/storage';

export interface EtatSaisie {
  readonly erreur?: string;
  readonly message?: string;
}

const EXERCICE = Number(process.env.APP_EXERCICE_COURANT ?? '2026');

/** Refus opposé à qui n'a pas le droit de saisir. */
const REFUS_ROLE = 'Vous n’êtes pas autorisé à saisir des indicateurs.';

/**
 * Une valeur de champ numérique. Chaîne vide ou absente → `null`, ce qui vaut
 * « non saisi ». Le zéro est une valeur, jamais une absence (RG-13).
 */
function entierOuNull(valeur: FormDataEntryValue | null): number | null | 'INVALIDE' {
  if (valeur === null) return null;
  const brut = String(valeur).trim();
  if (brut === '') return null;
  if (!/^\d{1,9}$/.test(brut)) return 'INVALIDE';
  return Number(brut);
}

/** Une réouverture active existe-t-elle pour ce couple filiale × mois ? */
async function reouvertureActive(
  filialeId: number,
  mois: number,
): Promise<boolean> {
  const lignes = await db
    .select({ id: reouverture.id })
    .from(reouverture)
    .where(
      and(
        eq(reouverture.filialeId, filialeId),
        eq(reouverture.exercice, EXERCICE),
        eq(reouverture.mois, mois),
      ),
    );
  // Une réouverture est active tant qu'elle n'a pas été refermée.
  //
  // RÉSERVE — RG-31 prévoit qu'une réouverture « définit une date de fermeture ».
  // Le schéma de l'étape 4.3 n'a pas de colonne d'échéance : `referme_le` est une
  // date de fermeture EFFECTIVE, associée à `referme_par`. Une réouverture est
  // donc ici active sans limite de temps. Le Directeur n'a pas encore d'écran
  // pour poser une échéance — cela vient au lot D — et c'est là qu'il faudra
  // trancher l'ajout d'une colonne. Signalé, non contourné.
  return lignes.length > 0;
}

/**
 * Enregistre les valeurs de tous les indicateurs affectés, pour un mois.
 *
 * L'enregistrement est PARTIEL PAR NATURE : un indicateur valorisé sans
 * commentaire est accepté et conservé en brouillon (RG-37 ter). Le refuser
 * obligerait le correspondant à tout remplir d'un trait, ce que le cahier des
 * charges écarte explicitement.
 */
export async function enregistrerSaisie(
  _precedent: EtatSaisie,
  donnees: FormData,
): Promise<EtatSaisie> {
  const courant = await utilisateurCourant();
  if (!courant) return { erreur: REFUS_ROLE };
  if (courant.filialeId === null || !peutSaisir(courant, courant.filialeId)) {
    return { erreur: REFUS_ROLE };
  }
  const filialeId = courant.filialeId;

  const mois = Number(donnees.get('mois'));
  if (!Number.isInteger(mois) || mois < 1 || mois > 12) {
    return { erreur: 'Mois invalide.' };
  }

  const etat = etatPeriode(
    EXERCICE,
    mois,
    maintenant(),
    await reouvertureActive(filialeId, mois),
  );
  if (!saisiePermise(etat)) {
    return {
      erreur:
        etat === 'NON_OUVERTE'
          ? 'Cette période n’est pas encore ouverte : aucune saisie anticipée n’est possible.'
          : 'Cette période est close. Seul le Directeur CI Groupe peut la rouvrir.',
    };
  }

  // Les affectations font foi sur ce qui est saisissable : un indicateur non
  // affecté n'a pas de ligne ici, donc aucune valeur ne peut lui être attachée.
  const affectations = await db
    .select({ id: affectation.id, indicateurId: affectation.indicateurId })
    .from(affectation)
    .where(
      and(eq(affectation.filialeId, filialeId), eq(affectation.exercice, EXERCICE)),
    );
  if (affectations.length === 0) {
    return { erreur: 'Aucun indicateur ne vous est affecté pour cet exercice.' };
  }

  const existantes = await db
    .select({
      id: saisie.id,
      affectationId: saisie.affectationId,
      numerateur: saisie.numerateur,
      denominateur: saisie.denominateur,
      commentaireSaisie: saisie.commentaireSaisie,
    })
    .from(saisie)
    .where(
      and(
        inArray(saisie.affectationId, affectations.map((a) => a.id)),
        eq(saisie.mois, mois),
      ),
    );
  const parAffectation = new Map(existantes.map((s) => [s.affectationId, s]));

  let creees = 0;
  let modifiees = 0;

  for (const a of affectations) {
    const numerateur = entierOuNull(donnees.get(`num_${a.id}`));
    const denominateur = entierOuNull(donnees.get(`den_${a.id}`));
    if (numerateur === 'INVALIDE' || denominateur === 'INVALIDE') {
      return { erreur: 'Les numérateurs et dénominateurs doivent être des entiers positifs.' };
    }
    const brutCommentaire = String(donnees.get(`com_${a.id}`) ?? '').trim();
    const commentaireSaisie = brutCommentaire === '' ? null : brutCommentaire;

    const ancienne = parAffectation.get(a.id);
    const vide = numerateur === null && denominateur === null && commentaireSaisie === null;

    if (vide) {
      // Rien de fourni : on ne crée pas de ligne. L'absence de ligne EST le
      // trou (RG-32), et une ligne vide serait un faux positif de remontée.
      // Une ligne préexistante n'est pas supprimée pour autant : effacer une
      // saisie déjà faite relève d'une intention explicite, pas d'un champ vidé.
      continue;
    }

    if (!ancienne) {
      const [inseree] = await db
        .insert(saisie)
        .values({
          affectationId: a.id,
          mois,
          numerateur,
          denominateur,
          commentaireSaisie,
          saisiPar: courant.id,
        })
        .returning({ id: saisie.id });
      creees++;
      await journaliser('SAISIE_CREEE', {
        utilisateurId: courant.id,
        entite: 'saisie',
        entiteId: inseree.id,
        details: { mois, exercice: EXERCICE, affectationId: a.id, etatPeriode: etat },
      });
      continue;
    }

    const inchangee =
      ancienne.numerateur === numerateur
      && ancienne.denominateur === denominateur
      && ancienne.commentaireSaisie === commentaireSaisie;
    if (inchangee) continue;

    await db
      .update(saisie)
      .set({
        numerateur,
        denominateur,
        commentaireSaisie,
        modifiePar: courant.id,
        modifieLe: new Date(),
      })
      .where(eq(saisie.id, ancienne.id));
    modifiees++;
    await journaliser('SAISIE_MODIFIEE', {
      utilisateurId: courant.id,
      entite: 'saisie',
      entiteId: ancienne.id,
      details: {
        mois,
        exercice: EXERCICE,
        etatPeriode: etat,
        avant: {
          numerateur: ancienne.numerateur,
          denominateur: ancienne.denominateur,
          commentaireFourni: ancienne.commentaireSaisie !== null,
        },
        apres: {
          numerateur,
          denominateur,
          commentaireFourni: commentaireSaisie !== null,
        },
      },
    });
  }

  revalidatePath('/saisie');

  if (creees === 0 && modifiees === 0) {
    return { message: 'Aucune modification à enregistrer.' };
  }
  const parties: string[] = [];
  if (creees > 0) parties.push(`${creees} saisie${creees > 1 ? 's' : ''} créée${creees > 1 ? 's' : ''}`);
  if (modifiees > 0) parties.push(`${modifiees} modifiée${modifiees > 1 ? 's' : ''}`);
  return { message: `Enregistré : ${parties.join(', ')}.` };
}

/**
 * Dépose un justificatif sur une saisie.
 *
 * La pièce jointe est facultative et NON BLOQUANTE (RG-38) : elle suppose
 * néanmoins une saisie existante, puisqu'elle s'y rattache. Le fichier passe par
 * `StorageAdapter` — aucun chemin physique n'atteint la base (T7).
 */
export async function joindreJustificatif(
  _precedent: EtatSaisie,
  donnees: FormData,
): Promise<EtatSaisie> {
  const courant = await utilisateurCourant();
  if (!courant) return { erreur: REFUS_ROLE };
  if (courant.filialeId === null || !peutSaisir(courant, courant.filialeId)) {
    return { erreur: REFUS_ROLE };
  }

  const affectationId = Number(donnees.get('affectationId'));
  const mois = Number(donnees.get('mois'));
  if (!Number.isInteger(affectationId) || !Number.isInteger(mois)) {
    return { erreur: 'Requête invalide.' };
  }

  // L'affectation doit appartenir à la filiale de la session : sans ce contrôle,
  // un identifiant d'affectation forgé permettrait de déposer une pièce sur la
  // saisie d'une autre filiale.
  const [cible] = await db
    .select({ saisieId: saisie.id })
    .from(saisie)
    .innerJoin(affectation, eq(saisie.affectationId, affectation.id))
    .where(
      and(
        eq(saisie.affectationId, affectationId),
        eq(saisie.mois, mois),
        eq(affectation.filialeId, courant.filialeId),
        eq(affectation.exercice, EXERCICE),
      ),
    );
  if (!cible) {
    return {
      erreur:
        'Enregistrez d’abord une valeur pour cet indicateur : le justificatif '
        + 'se rattache à une saisie existante.',
    };
  }

  const etat = etatPeriode(
    EXERCICE,
    mois,
    maintenant(),
    await reouvertureActive(courant.filialeId, mois),
  );
  if (!saisiePermise(etat)) {
    return { erreur: 'Cette période est close : aucun justificatif ne peut être ajouté.' };
  }

  const fichier = donnees.get('fichier');
  if (!(fichier instanceof File) || fichier.size === 0) {
    return { erreur: 'Aucun fichier sélectionné.' };
  }

  const refus = motifDeRefusFichier(fichier.type, fichier.size);
  if (refus) return { erreur: refus };

  const contenu = Buffer.from(await fichier.arrayBuffer());
  // La taille réelle est recontrôlée après lecture : `File.size` vient du client.
  const refusReel = motifDeRefusFichier(fichier.type, contenu.byteLength);
  if (refusReel) return { erreur: refusReel };

  const objet = await stockage().ecrire({
    nomOriginal: fichier.name,
    typeMime: fichier.type,
    contenu,
  });

  const [inseree] = await db
    .insert(pieceJointe)
    .values({
      saisieId: cible.saisieId,
      nomOriginal: fichier.name,
      cleStockage: objet.cleStockage,
      typeMime: fichier.type,
      tailleOctets: objet.tailleOctets,
      televersePar: courant.id,
    })
    .returning({ id: pieceJointe.id });

  await journaliser('PIECE_JOINTE_AJOUTEE', {
    utilisateurId: courant.id,
    entite: 'piece_jointe',
    entiteId: inseree.id,
    details: { saisieId: cible.saisieId, mois, typeMime: fichier.type, tailleOctets: objet.tailleOctets },
  });

  revalidatePath('/saisie');
  return { message: `Justificatif « ${fichier.name} » déposé.` };
}
