/**
 * Données — saisies mensuelles, pièces jointes, fils de commentaires,
 * réouvertures de période.
 *
 * RÈGLE ABSOLUE : aucune colonne `taux` (choix de modélisation n°2).
 * Le taux est TOUJOURS dérivé de numerateur / denominateur au moment
 * de la requête. RG-13 : dénominateur nul → taux NULL, jamais 0.
 */

import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { affectation, filiale } from './referentiel';
import { utilisateur } from './identite';

/**
 * Saisie mensuelle.
 *
 * Rattachée à `affectation`, donc au triplet filiale × indicateur × exercice :
 * il devient structurellement impossible de saisir un indicateur non affecté.
 *
 * L'ÉTAT BROUILLON N'EST PAS UNE COLONNE (choix de modélisation n°4) :
 *   brouillon  ⇔  valeurs présentes ET `commentaire_saisie IS NULL`
 *   renseigné  ⇔  numerateur ET denominateur ET commentaire (RG-37 bis)
 * Le brouillon alimente les calculs mais n'est pas compté comme renseigné,
 * et reste la SEULE source de mois partiel (RG-37 ter).
 *
 * L'absence de ligne = mois non saisi = trou. Aucun report, aucune
 * interpolation (M5b, RG-32).
 *
 * Aucun plafonnement : numerateur peut dépasser denominateur (RG-12).
 */
export const saisie = pgTable(
  'saisie',
  {
    id: serial('id').primaryKey(),
    affectationId: integer('affectation_id')
      .notNull()
      .references(() => affectation.id),
    mois: smallint('mois').notNull(),
    numerateur: integer('numerateur'),
    denominateur: integer('denominateur'),
    commentaireSaisie: text('commentaire_saisie'),
    saisiPar: integer('saisi_par')
      .notNull()
      .references(() => utilisateur.id),
    saisiLe: timestamp('saisi_le', { withTimezone: true }).notNull().defaultNow(),
    modifiePar: integer('modifie_par').references(() => utilisateur.id),
    modifieLe: timestamp('modifie_le', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('saisie_unique').on(t.affectationId, t.mois),
    index('saisie_affectation_idx').on(t.affectationId),
    check('saisie_mois_valide', sql`${t.mois} BETWEEN 1 AND 12`),
    check('saisie_numerateur_positif', sql`${t.numerateur} IS NULL OR ${t.numerateur} >= 0`),
    // Le dénominateur NUL est légitime et porteur de sens (RG-13).
    check('saisie_denominateur_positif', sql`${t.denominateur} IS NULL OR ${t.denominateur} >= 0`),
  ],
);

/**
 * Pièce jointe (facultative, D8 / HYP-2).
 *
 * Aucun chemin physique en base : `cleStockage` est un identifiant opaque
 * que `StorageAdapter` résout. Le passage du disque local au stockage S3
 * compatible ne touche donc aucune ligne.
 */
export const pieceJointe = pgTable(
  'piece_jointe',
  {
    id: serial('id').primaryKey(),
    saisieId: integer('saisie_id')
      .notNull()
      .references(() => saisie.id, { onDelete: 'cascade' }),
    nomOriginal: text('nom_original').notNull(),
    cleStockage: text('cle_stockage').notNull(),
    typeMime: text('type_mime').notNull(),
    tailleOctets: integer('taille_octets').notNull(),
    televersePar: integer('televerse_par')
      .notNull()
      .references(() => utilisateur.id),
    televerseLe: timestamp('televerse_le', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('piece_jointe_cle_unique').on(t.cleStockage),
    index('piece_jointe_saisie_idx').on(t.saisieId),
    // 10 Mo maximum (HYP-2).
    check('piece_jointe_taille_max', sql`${t.tailleOctets} > 0 AND ${t.tailleOctets} <= 10485760`),
  ],
);

/**
 * Fil de commentaires.
 *
 * Un fil par filiale × indicateur × exercice (M2) — ce qui est exactement
 * la clé de `affectation`. Cloisonné au périmètre de la filiale (M1).
 * Les commentaires du Directeur sont visibles immédiatement, sans validation
 * hiérarchique (C10).
 *
 * La suppression est logique (`supprimeLe`), jamais physique : la traçabilité
 * prime.
 */
export const commentaire = pgTable(
  'commentaire',
  {
    id: serial('id').primaryKey(),
    affectationId: integer('affectation_id')
      .notNull()
      .references(() => affectation.id),
    auteurId: integer('auteur_id')
      .notNull()
      .references(() => utilisateur.id),
    corps: text('corps').notNull(),
    publieLe: timestamp('publie_le', { withTimezone: true }).notNull().defaultNow(),
    modifieLe: timestamp('modifie_le', { withTimezone: true }),
    supprimeLe: timestamp('supprime_le', { withTimezone: true }),
  },
  (t) => [index('commentaire_affectation_idx').on(t.affectationId, t.publieLe)],
);

/**
 * Réouverture d'une période close (M5a, RG-31 bis, RG-31 ter).
 *
 * L'état d'une période se DÉDUIT : le calendrier donne ouverte ou close
 * (HYP-1 : le mois M ouvre le 1er de M+1 et ferme le 10 à 23h59, Africa/Abidjan),
 * et une ligne active ici — `refermeLe IS NULL` — la fait basculer en
 * « rouverte », état visuellement distinct des deux autres.
 *
 * La période est un couple filiale × mois, tous indicateurs confondus.
 * Le motif est obligatoire. L'action est journalisée.
 */
export const reouverture = pgTable(
  'reouverture',
  {
    id: serial('id').primaryKey(),
    filialeId: integer('filiale_id')
      .notNull()
      .references(() => filiale.id),
    exercice: integer('exercice').notNull(),
    mois: smallint('mois').notNull(),
    motif: text('motif').notNull(),
    ouvertPar: integer('ouvert_par')
      .notNull()
      .references(() => utilisateur.id),
    ouvertLe: timestamp('ouvert_le', { withTimezone: true }).notNull().defaultNow(),
    refermePar: integer('referme_par').references(() => utilisateur.id),
    refermeLe: timestamp('referme_le', { withTimezone: true }),
  },
  (t) => [
    index('reouverture_periode_idx').on(t.filialeId, t.exercice, t.mois),
    check('reouverture_mois_valide', sql`${t.mois} BETWEEN 1 AND 12`),
    check('reouverture_motif_non_vide', sql`length(btrim(${t.motif})) > 0`),
  ],
);
