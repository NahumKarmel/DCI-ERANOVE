/**
 * RECETTE DES SIX REPÈRES CHIFFRÉS — verrou de non-régression (T5).
 *
 * Ces valeurs doivent être reproduites EXACTEMENT après tout développement
 * touchant au modèle, au générateur ou aux fonctions de calcul. Si l'une
 * échoue, on ne construit rien de plus.
 *
 * La recette lit la BASE, pas le générateur : elle valide la chaîne complète
 * — génération, chargement, puis calcul — et non la seule cohérence interne du
 * générateur avec lui-même.
 *
 * Valeurs arrêtées par l'arbitrage T8.b : le taux quantifié
 * `numerateur / denominateur` fait foi.
 *
 * CE FICHIER NE SE MODIFIE JAMAIS POUR FAIRE PASSER UN TEST. Si un repère
 * casse, c'est le code qui est faux.
 */

import 'dotenv/config';
import { and, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import * as schema from '../src/db/schema';
import { affectation, filiale, indicateur, saisie } from '../src/db/schema';
import {
  estBrouillon,
  estRenseigne,
  moyenneCalculable,
  objectifAtteint,
  taux,
  type Taux,
} from '../src/lib/calculs/taux';

const EXERCICE = 2026;
/** Août 2026 est la période ouverte : les mois 1 à 7 sont clos (HYP-1). */
const MOIS_OUVERT = 8;
const DERNIER_MOIS_CLOS = 7;

/** Une ligne de la base, telle que la recette la lit. */
interface Ligne {
  filiale: string;
  indicateur: string;
  mois: number;
  numerateur: number | null;
  denominateur: number | null;
  commentaireSaisie: string | null;
  objectif: number;
}

let pool: Pool;
/** Saisies de l'exercice 2026. */
let lignes: Ligne[];
/** Affectations de 2026 : filiale → codes indicateurs affectés. */
let affectes: Map<string, string[]>;

const arrondi1 = (v: number): number => Number((v * 100).toFixed(1));

/** Taux quantifié d'une ligne — la seule valeur qui fait foi (T8.b). */
const tauxDe = (l: Ligne): Taux => taux(l.numerateur, l.denominateur);

const cle = (filialeCode: string, indicateurCode: string, mois: number): string =>
  `${filialeCode}|${indicateurCode}|${mois}`;
let parCle: Map<string, Ligne>;

beforeAll(async () => {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  const brutes = await db
    .select({
      filiale: filiale.code,
      indicateur: indicateur.code,
      mois: saisie.mois,
      numerateur: saisie.numerateur,
      denominateur: saisie.denominateur,
      commentaireSaisie: saisie.commentaireSaisie,
      objectif: affectation.objectif,
    })
    .from(saisie)
    .innerJoin(affectation, eq(saisie.affectationId, affectation.id))
    .innerJoin(filiale, eq(affectation.filialeId, filiale.id))
    .innerJoin(indicateur, eq(affectation.indicateurId, indicateur.id))
    .where(eq(affectation.exercice, EXERCICE));

  lignes = brutes.map((l) => ({ ...l, objectif: Number(l.objectif) }));
  parCle = new Map(lignes.map((l) => [cle(l.filiale, l.indicateur, l.mois), l]));

  const aff = await db
    .select({ filiale: filiale.code, indicateur: indicateur.code })
    .from(affectation)
    .innerJoin(filiale, eq(affectation.filialeId, filiale.id))
    .innerJoin(indicateur, eq(affectation.indicateurId, indicateur.id))
    .where(eq(affectation.exercice, EXERCICE));

  affectes = new Map();
  for (const a of aff) {
    const liste = affectes.get(a.filiale) ?? [];
    liste.push(a.indicateur);
    affectes.set(a.filiale, liste);
  }
});

afterAll(async () => {
  await pool.end();
});

/* ================================================================== */
/*  Les six repères chiffrés                                           */
/* ================================================================== */

describe('Six repères chiffrés — verrou de non-régression', () => {
  it('R1 — taux de remontée global 2026 : 90,4 %, soit 586 saisies sur 648', () => {
    let attendues = 0;
    for (const [, codes] of affectes) attendues += codes.length * MOIS_OUVERT;

    const renseignees = lignes.filter((l) => estRenseigne(l)).length;

    expect(attendues).toBe(648);
    expect(renseignees).toBe(586);
    expect(arrondi1(renseignees / attendues)).toBe(90.4);
  });

  it('R2 — périodes closes incomplètes en 2026 : 8 couples filiale × mois', () => {
    let incompletes = 0;
    for (const [filialeCode, codes] of affectes) {
      for (let mois = 1; mois <= DERNIER_MOIS_CLOS; mois++) {
        const complet = codes.every((code) => {
          const ligne = parCle.get(cle(filialeCode, code, mois));
          return ligne !== undefined && estRenseigne(ligne);
        });
        if (!complet) incompletes++;
      }
    }
    expect(incompletes).toBe(8);
  });

  it('R3 — filiales sans retard en 2026 : 7 sur 12', () => {
    const enRetard = new Set<string>();
    for (const [filialeCode, codes] of affectes) {
      for (let mois = 1; mois <= DERNIER_MOIS_CLOS; mois++) {
        const complet = codes.every((code) => {
          const ligne = parCle.get(cle(filialeCode, code, mois));
          return ligne !== undefined && estRenseigne(ligne);
        });
        if (!complet) enRetard.add(filialeCode);
      }
    }
    expect(affectes.size).toBe(12);
    expect(affectes.size - enRetard.size).toBe(7);
  });

  it('R4 — score SDER en août 2026 : 50,3 %', () => {
    // RG-17 : moyenne des taux CALCULABLES des indicateurs AFFECTÉS. Les
    // brouillons de SDER en août alimentent bien le calcul (RG-37 ter).
    const valeurs = affectes.get('SDER')!.map((code) => {
      const ligne = parCle.get(cle('SDER', code, MOIS_OUVERT));
      return ligne === undefined ? null : tauxDe(ligne);
    });
    const score = moyenneCalculable(valeurs);
    expect(score).not.toBeNull();
    expect(arrondi1(score!)).toBe(50.3);
  });

  it('R5 — moyenne AMR en août 2026 : 72,4 % sur 11 filiales calculables', () => {
    // RG-18 : OMILAYE n'a pas saisi en août. Elle est EXCLUE de la moyenne,
    // jamais comptée comme 0 — d'où 11 filiales et non 12.
    const valeurs: Taux[] = [];
    for (const [filialeCode, codes] of affectes) {
      if (!codes.includes('AMR')) continue;
      const ligne = parCle.get(cle(filialeCode, 'AMR', MOIS_OUVERT));
      if (ligne === undefined) continue;
      valeurs.push(tauxDe(ligne));
    }
    const calculables = valeurs.filter((v) => v !== null);
    expect(calculables).toHaveLength(11);

    const moyenne = moyenneCalculable(valeurs);
    expect(moyenne).not.toBeNull();
    expect(arrondi1(moyenne!)).toBe(72.4);
  });

  it("R6 — filiales atteignant l'objectif AMR en août 2026 : 4 sur 11", () => {
    let calculables = 0;
    let atteintes = 0;
    for (const [filialeCode, codes] of affectes) {
      if (!codes.includes('AMR')) continue;
      const ligne = parCle.get(cle(filialeCode, 'AMR', MOIS_OUVERT));
      if (ligne === undefined) continue;
      const valeur = tauxDe(ligne);
      if (valeur === null) continue;
      calculables++;
      if (objectifAtteint(valeur, ligne.objectif)) atteintes++;
    }
    expect(calculables).toBe(11);
    expect(atteintes).toBe(4);
  });
});

/* ================================================================== */
/*  Les six règles de gestion les plus coûteuses                       */
/* ================================================================== */

describe('Règles de gestion — cas limites du jeu de démonstration', () => {
  it('RG-13 — KEKELI / TCI en janvier : dénominateur nul, taux non calculable', () => {
    const ligne = parCle.get(cle('KEKELI', 'TCI', 1));
    expect(ligne).toBeDefined();
    expect(ligne!.denominateur).toBe(0);
    // Non calculable, et surtout PAS zéro.
    expect(tauxDe(ligne!)).toBeNull();
    // La ligne porte un commentaire : elle est renseignée malgré son
    // dénominateur nul, et compte donc dans le taux de remontée.
    expect(estRenseigne(ligne!)).toBe(true);
  });

  it('RG-12 — CIE / RECO_SEM en août : taux supérieur à 100 %, aucun plafonnement', () => {
    const ligne = parCle.get(cle('CIE', 'RECO_SEM', MOIS_OUVERT));
    expect(ligne).toBeDefined();
    expect(ligne!.numerateur).toBeGreaterThan(ligne!.denominateur!);
    const valeur = tauxDe(ligne!);
    expect(valeur).not.toBeNull();
    expect(valeur!).toBeGreaterThan(1);
  });

  it('RG-32 — ASOKH en mai : aucune ligne en base, le trou reste un trou', () => {
    const codes = affectes.get('ASOKH')!;
    expect(codes).toHaveLength(7);
    for (const code of codes) {
      expect(parCle.get(cle('ASOKH', code, 5))).toBeUndefined();
    }
    // Les mois qui encadrent le trou existent : la courbe est interrompue,
    // pas décalée.
    expect(parCle.get(cle('ASOKH', 'PCI', 4))).toBeDefined();
    expect(parCle.get(cle('ASOKH', 'PCI', 6))).toBeDefined();
  });

  it('RG-37 ter — SDER / AMR en août : brouillon, non renseigné, mais taux calculable', () => {
    const ligne = parCle.get(cle('SDER', 'AMR', MOIS_OUVERT));
    expect(ligne).toBeDefined();
    expect(ligne!.commentaireSaisie).toBeNull();
    expect(estBrouillon(ligne!)).toBe(true);
    expect(estRenseigne(ligne!)).toBe(false);
    // Double statut : sa valeur alimente les calculs.
    expect(tauxDe(ligne!)).not.toBeNull();
  });

  it("RG-24 bis — OMILAYE / PCI : objectif dérogatoire à 80 %, déduit de l'écart", () => {
    const pool2 = new Pool({ connectionString: process.env.DATABASE_URL });
    return (async () => {
      const db = drizzle(pool2, { schema });
      const [ligne] = await db
        .select({
          objectifAffectation: affectation.objectif,
          objectifGroupe: indicateur.objectifDefaut,
        })
        .from(affectation)
        .innerJoin(filiale, eq(affectation.filialeId, filiale.id))
        .innerJoin(indicateur, eq(affectation.indicateurId, indicateur.id))
        .where(
          and(
            eq(filiale.code, 'OMILAYE'),
            eq(indicateur.code, 'PCI'),
            eq(affectation.exercice, EXERCICE),
          ),
        );
      await pool2.end();

      expect(Number(ligne.objectifAffectation)).toBe(0.8);
      expect(Number(ligne.objectifGroupe)).toBe(1);
      // La dérogation n'est pas un attribut : elle se déduit de l'écart.
      expect(Number(ligne.objectifAffectation)).not.toBe(Number(ligne.objectifGroupe));
    })();
  });

  it("Modélisation — aucune colonne « taux » dans le catalogue PostgreSQL", async () => {
    const pool2 = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool2, { schema });
    const resultat = await db.execute<{ table_name: string; column_name: string }>(sql`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND (column_name = 'taux' OR column_name LIKE 'taux%' OR column_name LIKE '%_taux')
    `);
    await pool2.end();
    expect(resultat.rows).toEqual([]);
  });
});
