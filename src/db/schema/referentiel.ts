/**
 * Référentiel — exercices, filiales, indicateurs, affectations.
 *
 * La table `affectation` est le PIVOT du modèle (choix de modélisation n°1) :
 * elle porte simultanément quels indicateurs une filiale remonte, quel objectif
 * s'applique, et pour quel exercice. Elle règle l'exception GS2E — SDRM
 * (4 indicateurs au lieu de 7) sans aucun code conditionnel, et les objectifs
 * différenciés sans table supplémentaire.
 */

import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

/** Mode de calcul d'un indicateur. Tous en CUMUL au démarrage (RG-15),
 *  l'attribut existe dès le premier jour pour permettre la bascule en FLUX. */
export const modeCalculEnum = pgEnum('mode_calcul', ['CUMUL', 'FLUX']);

/** Exercice annuel. Sa seule existence conditionne la comparaison N-1 :
 *  pas d'exercice N-1 → fonction de comparaison désactivée (RG-28 ter). */
export const exercice = pgTable('exercice', {
  annee: integer('annee').primaryKey(),
  ouvert: boolean('ouvert').notNull().default(true),
  creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
});

/** Filiale déclarante. 12 lignes : 11 entités juridiques, GS2E remontant par
 *  deux sous-directions traitées comme deux filiales de plein droit (D4). */
export const filiale = pgTable(
  'filiale',
  {
    id: serial('id').primaryKey(),
    code: text('code').notNull(),
    libelle: text('libelle').notNull(),
    entiteJuridique: text('entite_juridique').notNull(),
    ordreAffichage: smallint('ordre_affichage').notNull().default(0),
    actif: boolean('actif').notNull().default(true),
    creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('filiale_code_unique').on(t.code)],
);

/** Indicateur du référentiel groupe. 7 lignes.
 *  `objectifDefaut` est stocké en FRACTION (0.8000), jamais en pourcentage
 *  (choix de modélisation n°3). */
export const indicateur = pgTable(
  'indicateur',
  {
    id: serial('id').primaryKey(),
    code: text('code').notNull(),
    libelle: text('libelle').notNull(),
    libelleCourt: text('libelle_court').notNull(),
    objectifDefaut: numeric('objectif_defaut', { precision: 5, scale: 4 }).notNull(),
    modeCalcul: modeCalculEnum('mode_calcul').notNull().default('CUMUL'),
    ordreAffichage: smallint('ordre_affichage').notNull().default(0),
    actif: boolean('actif').notNull().default(true),
    creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('indicateur_code_unique').on(t.code),
    check('indicateur_objectif_positif', sql`${t.objectifDefaut} > 0`),
  ],
);

/**
 * PIVOT DU MODÈLE.
 *
 * Une ligne = « cette filiale remonte cet indicateur, cet exercice, avec cet
 * objectif ». 81 lignes attendues par exercice (11 × 7 + 4).
 *
 * La DÉROGATION D'OBJECTIF N'EST PAS UN ATTRIBUT (choix de modélisation n°5) :
 * elle se déduit de l'écart entre `affectation.objectif` et
 * `indicateur.objectif_defaut`. Aucune colonne `est_derogatoire`.
 */
export const affectation = pgTable(
  'affectation',
  {
    id: serial('id').primaryKey(),
    filialeId: integer('filiale_id')
      .notNull()
      .references(() => filiale.id),
    indicateurId: integer('indicateur_id')
      .notNull()
      .references(() => indicateur.id),
    exercice: integer('exercice')
      .notNull()
      .references(() => exercice.annee),
    objectif: numeric('objectif', { precision: 5, scale: 4 }).notNull(),
    creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
    modifieLe: timestamp('modifie_le', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('affectation_unique').on(t.filialeId, t.indicateurId, t.exercice),
    index('affectation_exercice_idx').on(t.exercice),
    index('affectation_filiale_idx').on(t.filialeId, t.exercice),
    check('affectation_objectif_positif', sql`${t.objectif} > 0`),
  ],
);
