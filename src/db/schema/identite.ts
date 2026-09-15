/**
 * Identité — comptes et sessions applicatives (T3.a).
 *
 * Aucun service d'authentification tiers. Mot de passe haché en Argon2id,
 * session portée par une table applicative et un cookie httpOnly SameSite=Lax.
 * Aucun email n'est jamais envoyé (HYP-5) : la réinitialisation passe par un
 * mot de passe temporaire généré par l'Administrateur.
 */

import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { filiale } from './referentiel';

/** Les 4 rôles de l'arbitrage A3. */
export const roleEnum = pgEnum('role_utilisateur', [
  'CORRESPONDANT',
  'DIRECTEUR_CI_GROUPE',
  'LECTEUR',
  'ADMINISTRATEUR',
]);

/**
 * Compte utilisateur.
 *
 * `attributAdministrateur` est DISTINCT du rôle ADMINISTRATEUR :
 *  - rôle ADMINISTRATEUR  = administrateur pur (D1), aucun accès aux données ;
 *  - attribut sur un autre rôle = droits d'administration en plus du rôle,
 *    cas du Directeur et du correspondant GS2E — SDRM.
 * L'attribut ne confère JAMAIS de droit de lecture sur les données (D2) :
 * la lecture découle du rôle, jamais de l'attribut.
 *
 * `filialeId` n'est renseigné que pour un CORRESPONDANT (1 correspondant =
 * 1 filiale, A4). Il reste NULL pour le Directeur, les Lecteurs — non
 * restreints, HYP-3 — et les administrateurs purs.
 */
export const utilisateur = pgTable(
  'utilisateur',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    nom: text('nom').notNull(),
    prenom: text('prenom').notNull(),
    motDePasseHash: text('mot_de_passe_hash').notNull(),
    doitChangerMotDePasse: boolean('doit_changer_mot_de_passe').notNull().default(false),
    role: roleEnum('role').notNull(),
    attributAdministrateur: boolean('attribut_administrateur').notNull().default(false),
    filialeId: integer('filiale_id').references(() => filiale.id),
    actif: boolean('actif').notNull().default(true),
    derniereConnexionLe: timestamp('derniere_connexion_le', { withTimezone: true }),
    creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
    creePar: integer('cree_par'),
  },
  (t) => [
    // Unicité insensible à la casse, sans extension propriétaire (citext exclu).
    uniqueIndex('utilisateur_email_unique').on(sql`lower(${t.email})`),
    index('utilisateur_filiale_idx').on(t.filialeId),
    // Un correspondant est toujours rattaché à une filiale ; les autres rôles
    // ne le sont jamais. Le cloisonnement des données en dépend (M1).
    check(
      'utilisateur_rattachement_coherent',
      sql`(${t.role} = 'CORRESPONDANT' AND ${t.filialeId} IS NOT NULL)
          OR (${t.role} <> 'CORRESPONDANT' AND ${t.filialeId} IS NULL)`,
    ),
  ],
);

/** Session applicative. L'identifiant est un jeton opaque aléatoire ;
 *  le cookie n'en porte pas d'autre information. */
export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    utilisateurId: integer('utilisateur_id')
      .notNull()
      .references(() => utilisateur.id, { onDelete: 'cascade' }),
    expireLe: timestamp('expire_le', { withTimezone: true }).notNull(),
    adresseIp: text('adresse_ip'),
    agentUtilisateur: text('agent_utilisateur'),
    creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('session_utilisateur_idx').on(t.utilisateurId),
    index('session_expiration_idx').on(t.expireLe),
  ],
);
