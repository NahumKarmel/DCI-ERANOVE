/**
 * V2 — Saisie mensuelle du correspondant.
 * Maquette de référence : docs/prototypes/prototype_dci_v2_saisie.jsx
 *
 * Accessible au seul rôle CORRESPONDANT, sur sa seule filiale. La filiale vient
 * de la SESSION, jamais d'un paramètre : il n'existe donc aucune URL permettant
 * de demander la saisie d'une autre filiale.
 *
 * Le correspondant ne voit que les indicateurs AFFECTÉS à sa filiale, et eux
 * seuls : GS2E — SDRM en voit 4, pas 7. Cela ne demande aucun code conditionnel,
 * c'est la table `affectation` qui le porte.
 */

import { redirect } from 'next/navigation';
import { and, asc, eq, inArray } from 'drizzle-orm';

import { db } from '@/db/client';
import { affectation, indicateur, pieceJointe, reouverture, saisie } from '@/db/schema';
import { peutSaisir, utilisateurCourant } from '@/lib/auth';
import {
  dernierMoisOuvert,
  etatPeriode,
  fenetreDeSaisie,
  joursRestants,
  saisiePermise,
} from '@/lib/calculs/periode';
import { maintenant, surDateDeReference } from '@/lib/instant';
import { MOIS_LONGS } from '@/lib/demo/referentiel';

import { Formulaire, type LigneSaisie } from './formulaire';
import styles from './saisie.module.css';

const EXERCICE = Number(process.env.APP_EXERCICE_COURANT ?? '2026');

export const metadata = { title: 'Saisie mensuelle — Contrôle Interne Groupe' };

function moisDemande(
  brut: string | string[] | undefined,
  plafond: number,
): number {
  const valeur = Number(typeof brut === 'string' ? brut : Number.NaN);
  if (!Number.isInteger(valeur) || valeur < 1 || valeur > 12) return plafond;
  return valeur;
}

export default async function PageSaisie({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const courant = await utilisateurCourant();
  if (!courant) redirect('/connexion');
  if (courant.doitChangerMotDePasse) redirect('/changer-mot-de-passe');

  // Le Directeur, le Lecteur et l'Administrateur n'ont rien à faire ici : le
  // Directeur ne saisit pas, et c'est cette séparation qui donne sa valeur
  // probante au dispositif.
  if (courant.filialeId === null || !peutSaisir(courant, courant.filialeId)) {
    redirect('/');
  }
  const filialeId = courant.filialeId;

  const instant = maintenant();
  const dernierOuvert = dernierMoisOuvert(EXERCICE, instant) ?? 1;
  const parametres = await searchParams;
  const mois = moisDemande(parametres.mois, dernierOuvert);

  const reouvertures = await db
    .select({ id: reouverture.id, motif: reouverture.motif, mois: reouverture.mois })
    .from(reouverture)
    .where(
      and(
        eq(reouverture.filialeId, filialeId),
        eq(reouverture.exercice, EXERCICE),
        eq(reouverture.mois, mois),
      ),
    );
  const reouvertureDuMois = reouvertures[0] ?? null;

  const etat = etatPeriode(EXERCICE, mois, instant, reouvertureDuMois !== null);
  const modifiable = saisiePermise(etat);

  // Indicateurs AFFECTÉS, leur objectif applicable, et la saisie du mois s'il y
  // en a une. Le `leftJoin` est essentiel : une absence de saisie doit rendre une
  // ligne sans valeurs, pas faire disparaître l'indicateur.
  const lignesBrutes = await db
    .select({
      affectationId: affectation.id,
      objectif: affectation.objectif,
      code: indicateur.code,
      libelle: indicateur.libelle,
      ordre: indicateur.ordreAffichage,
      objectifGroupe: indicateur.objectifDefaut,
      saisieId: saisie.id,
      numerateur: saisie.numerateur,
      denominateur: saisie.denominateur,
      commentaireSaisie: saisie.commentaireSaisie,
    })
    .from(affectation)
    .innerJoin(indicateur, eq(affectation.indicateurId, indicateur.id))
    .leftJoin(
      saisie,
      and(eq(saisie.affectationId, affectation.id), eq(saisie.mois, mois)),
    )
    .where(and(eq(affectation.filialeId, filialeId), eq(affectation.exercice, EXERCICE)))
    .orderBy(asc(indicateur.ordreAffichage));

  // Justificatifs déjà déposés, par saisie.
  const identifiantsSaisie = lignesBrutes
    .map((l) => l.saisieId)
    .filter((id): id is number => id !== null);
  const justificatifs = identifiantsSaisie.length
    ? await db
      .select({
        saisieId: pieceJointe.saisieId,
        nomOriginal: pieceJointe.nomOriginal,
        tailleOctets: pieceJointe.tailleOctets,
      })
      .from(pieceJointe)
      .where(inArray(pieceJointe.saisieId, identifiantsSaisie))
    : [];
  const parSaisie = new Map<number, { nomOriginal: string; tailleOctets: number }[]>();
  for (const j of justificatifs) {
    const liste = parSaisie.get(j.saisieId) ?? [];
    liste.push({ nomOriginal: j.nomOriginal, tailleOctets: j.tailleOctets });
    parSaisie.set(j.saisieId, liste);
  }

  const lignes: LigneSaisie[] = lignesBrutes.map((l) => {
    const objectif = Number(l.objectif);
    const objectifGroupe = Number(l.objectifGroupe);
    return {
      affectationId: l.affectationId,
      code: l.code,
      libelle: l.libelle,
      ordre: l.ordre,
      objectif,
      objectifGroupe,
      // La dérogation n'est pas un attribut : elle se DÉDUIT de l'écart
      // (choix de modélisation n°5, RG-24 bis).
      derogatoire: objectif !== objectifGroupe,
      numerateur: l.numerateur,
      denominateur: l.denominateur,
      commentaireSaisie: l.commentaireSaisie,
      justificatifs: l.saisieId !== null ? (parSaisie.get(l.saisieId) ?? []) : [],
    };
  });

  const { fermeLe } = fenetreDeSaisie(EXERCICE, mois);
  const restants = joursRestants(EXERCICE, mois, instant);

  return (
    <Formulaire
      exercice={EXERCICE}
      mois={mois}
      moisLibelle={MOIS_LONGS[mois - 1]}
      dernierMoisOuvert={dernierOuvert}
      etat={etat}
      modifiable={modifiable}
      motifReouverture={reouvertureDuMois?.motif ?? null}
      fermeLeISO={fermeLe.toISOString()}
      joursRestants={restants}
      surDateDeReference={surDateDeReference()}
      instantISO={instant.toISOString()}
      filialeLibelle={courant.filialeLibelle ?? ''}
      correspondant={`${courant.prenom} ${courant.nom}`}
      lignes={lignes}
      modeDemo={process.env.MODE_DEMO === 'true'}
      className={styles.page}
    />
  );
}
