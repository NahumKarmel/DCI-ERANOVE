/**
 * Chargement du jeu de démonstration déterministe.
 *
 * Rejouable sans risque : le chargement vide les tables puis les réécrit à
 * l'identique. Deux exécutions successives produisent exactement la même base,
 * ce qui est la condition de la recette (RG-46 bis).
 *
 * Aucun taux n'est écrit : seuls `numerateur` et `denominateur` le sont.
 *
 * DONNÉES ENTIÈREMENT FICTIVES. Aucune donnée réelle du groupe ERANOVE.
 */

import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';
import {
  affectation,
  exercice,
  filiale,
  indicateur,
  reouverture,
  saisie,
  utilisateur,
} from './schema';
import { commentaireDe, serie } from '../lib/demo/generateur';
import {
  COMMENTAIRE_DEN_ZERO,
  COMPTES_HORS_FILIALE,
  EXERCICE_COURANT,
  EXERCICE_PRECEDENT,
  FILIALES,
  HACHAGE_PROVISOIRE,
  INDICATEURS,
  REOUVERTURES,
  emailCorrespondant,
  estBrouillonAttendu,
  indicateurParCode,
  objectifDe,
} from '../lib/demo/referentiel';

/** Objectif stocké en fraction, sur 4 décimales — jamais en pourcentage. */
const fraction = (v: number): string => v.toFixed(4);

/** Insère par paquets : une seule requête de 1 500 lignes sature la machine. */
async function parPaquets<T>(
  lignes: readonly T[],
  taille: number,
  inserer: (paquet: T[]) => Promise<unknown>,
): Promise<void> {
  for (let i = 0; i < lignes.length; i += taille) {
    await inserer(lignes.slice(i, i + taille) as T[]);
  }
}

async function principal(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('--- Chargement du jeu de démonstration (données fictives) ---');

  // 1. Table rase. CASCADE suit les clés étrangères, RESTART IDENTITY remet les
  //    séquences à 1 pour que deux chargements donnent les mêmes identifiants.
  await db.execute(sql`
    TRUNCATE TABLE
      journal_action, session, piece_jointe, commentaire, reouverture,
      saisie, affectation, utilisateur, indicateur, filiale, exercice
    RESTART IDENTITY CASCADE
  `);

  // 2. Exercices. 2026 est ouvert, 2025 est clos.
  await db.insert(exercice).values([
    { annee: EXERCICE_PRECEDENT, ouvert: false },
    { annee: EXERCICE_COURANT, ouvert: true },
  ]);

  // 3. Les 12 filiales déclarantes.
  const filialesInserees = await db
    .insert(filiale)
    .values(
      FILIALES.map((f) => ({
        code: f.code,
        libelle: f.libelle,
        entiteJuridique: f.entiteJuridique,
        ordreAffichage: f.ordre,
      })),
    )
    .returning({ id: filiale.id, code: filiale.code });
  const idFiliale = new Map(filialesInserees.map((f) => [f.code, f.id]));

  // 4. Les 7 indicateurs. `objectifDefaut` est l'objectif GROUPE ; l'objectif
  //    applicable est porté par l'affectation.
  const indicateursInseres = await db
    .insert(indicateur)
    .values(
      INDICATEURS.map((i) => ({
        code: i.code,
        libelle: i.libelle,
        libelleCourt: i.libelleCourt,
        objectifDefaut: fraction(i.objectif),
        modeCalcul: i.modeCalcul,
        ordreAffichage: i.ordre,
      })),
    )
    .returning({ id: indicateur.id, code: indicateur.code });
  const idIndicateur = new Map(indicateursInseres.map((i) => [i.code, i.id]));

  // 5. Comptes. Le mot de passe reste à définir : aucun compte n'est
  //    connectable avant l'étape 4.5.
  const comptes = [
    ...FILIALES.map((f) => ({
      email: emailCorrespondant(f.code),
      prenom: f.correspondant.prenom,
      nom: f.correspondant.nom,
      motDePasseHash: HACHAGE_PROVISOIRE,
      doitChangerMotDePasse: true,
      role: 'CORRESPONDANT' as const,
      attributAdministrateur: f.attributAdministrateur ?? false,
      filialeId: idFiliale.get(f.code)!,
    })),
    ...COMPTES_HORS_FILIALE.map((c) => ({
      email: c.email,
      prenom: c.prenom,
      nom: c.nom,
      motDePasseHash: HACHAGE_PROVISOIRE,
      doitChangerMotDePasse: true,
      role: c.role,
      attributAdministrateur: c.attributAdministrateur,
      filialeId: null,
    })),
  ];
  const comptesInseres = await db
    .insert(utilisateur)
    .values(comptes)
    .returning({ id: utilisateur.id, email: utilisateur.email });
  const idCompte = new Map(comptesInseres.map((c) => [c.email, c.id]));
  const idDirecteur = idCompte.get('directeur@demo.local')!;

  // 6. Affectations — le PIVOT du modèle. Une filiale sans historique sur un
  //    exercice n'y est pas affectée : AWALE n'a donc aucune affectation 2025,
  //    ce qui désactive sa comparaison N-1 (RG-28 ter).
  const lignesAffectation: {
    filialeId: number; indicateurId: number; exercice: number; objectif: string;
  }[] = [];
  for (const f of FILIALES) {
    for (const annee of [EXERCICE_COURANT, EXERCICE_PRECEDENT]) {
      if (annee === EXERCICE_PRECEDENT && f.profil.n1 === null) continue;
      for (const code of f.affectes) {
        const ind = indicateurParCode(code);
        lignesAffectation.push({
          filialeId: idFiliale.get(f.code)!,
          indicateurId: idIndicateur.get(code)!,
          exercice: annee,
          objectif: fraction(objectifDe(f, ind, annee)),
        });
      }
    }
  }
  const affectationsInserees = await db
    .insert(affectation)
    .values(lignesAffectation)
    .returning({
      id: affectation.id,
      filialeId: affectation.filialeId,
      indicateurId: affectation.indicateurId,
      exercice: affectation.exercice,
    });
  const idAffectation = new Map(
    affectationsInserees.map((a) => [`${a.filialeId}|${a.indicateurId}|${a.exercice}`, a.id]),
  );

  // 7. Saisies. L'ABSENCE de ligne est le trou lui-même : aucun report, aucune
  //    interpolation (RG-32). Un brouillon porte ses valeurs SANS commentaire
  //    (RG-37 ter) ; une saisie à dénominateur nul en porte un, qui explique
  //    que la valeur n'est pas assimilée à 0 % (RG-13).
  const lignesSaisie: {
    affectationId: number; mois: number; numerateur: number;
    denominateur: number; commentaireSaisie: string | null; saisiPar: number;
  }[] = [];
  for (const f of FILIALES) {
    const saisiPar = idCompte.get(emailCorrespondant(f.code))!;
    for (const annee of [EXERCICE_COURANT, EXERCICE_PRECEDENT]) {
      for (const code of f.affectes) {
        const ind = indicateurParCode(code);
        const cellules = serie(f, ind, annee);
        if (cellules === null) continue;
        const cle = `${idFiliale.get(f.code)}|${idIndicateur.get(code)}|${annee}`;
        const affectationId = idAffectation.get(cle)!;
        for (const c of cellules) {
          const brouillon = estBrouillonAttendu(f.code, code, c.mois, annee);
          const commentaireSaisie = brouillon
            ? null
            : c.denominateur === 0
              ? COMMENTAIRE_DEN_ZERO
              : commentaireDe(f.code, code, c.mois);
          lignesSaisie.push({
            affectationId,
            mois: c.mois,
            numerateur: c.numerateur,
            denominateur: c.denominateur,
            commentaireSaisie,
            saisiPar,
          });
        }
      }
    }
  }
  await parPaquets(lignesSaisie, 500, (paquet) => db.insert(saisie).values(paquet));

  // 8. Réouvertures actives — `refermeLe` reste NULL. Une période rouverte
  //    porte un état visuel distinct d'« ouverte » et de « close » (RG-31 ter).
  await db.insert(reouverture).values(
    REOUVERTURES.map((r) => ({
      filialeId: idFiliale.get(r.filiale)!,
      exercice: r.exercice,
      mois: r.mois,
      motif: r.motif,
      ouvertPar: idDirecteur,
    })),
  );

  console.log(`  exercices     : 2`);
  console.log(`  filiales      : ${filialesInserees.length}`);
  console.log(`  indicateurs   : ${indicateursInseres.length}`);
  console.log(`  comptes       : ${comptesInseres.length}`);
  console.log(`  affectations  : ${affectationsInserees.length}`);
  console.log(`  saisies       : ${lignesSaisie.length}`);
  console.log(`  réouvertures  : ${REOUVERTURES.length}`);
  console.log('--- Chargement terminé ---');

  await pool.end();
}

principal().catch((erreur) => {
  console.error('Échec du chargement :', erreur);
  process.exit(1);
});
