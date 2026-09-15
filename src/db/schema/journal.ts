/**
 * Journal d'audit — trace immuable des actions sensibles.
 *
 * Écriture seule : aucune mise à jour, aucune suppression. C'est la réponse
 * au défaut central du fichier Excel d'origine, qui n'offrait aucune
 * traçabilité.
 */

import {
  bigserial,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { utilisateur } from './identite';

export const actionEnum = pgEnum('type_action', [
  'CONNEXION',
  'DECONNEXION',
  'ECHEC_CONNEXION',
  'SAISIE_CREEE',
  'SAISIE_MODIFIEE',
  'COMMENTAIRE_PUBLIE',
  'COMMENTAIRE_MODIFIE',
  'COMMENTAIRE_SUPPRIME',
  'PIECE_JOINTE_AJOUTEE',
  'PIECE_JOINTE_SUPPRIMEE',
  'PERIODE_ROUVERTE',
  'PERIODE_REFERMEE',
  'OBJECTIF_MODIFIE',
  'AFFECTATION_MODIFIEE',
  'COMPTE_CREE',
  'COMPTE_MODIFIE',
  'COMPTE_DESACTIVE',
  'MOT_DE_PASSE_REINITIALISE',
  'EXPORT_GENERE',
]);

export const journalAction = pgTable(
  'journal_action',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    utilisateurId: integer('utilisateur_id').references(() => utilisateur.id),
    action: actionEnum('action').notNull(),
    entite: text('entite'),
    entiteId: integer('entite_id'),
    details: jsonb('details'),
    adresseIp: text('adresse_ip'),
    horodatage: timestamp('horodatage', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('journal_horodatage_idx').on(t.horodatage),
    index('journal_utilisateur_idx').on(t.utilisateurId),
    index('journal_entite_idx').on(t.entite, t.entiteId),
  ],
);
