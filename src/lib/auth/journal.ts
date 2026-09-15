/**
 * Journal d'audit — écriture seule.
 *
 * Aucune mise à jour, aucune suppression : c'est la réponse au défaut central du
 * fichier Excel d'origine, qui n'offrait aucune traçabilité.
 *
 * Une écriture de journal ne doit JAMAIS faire échouer l'action qu'elle trace.
 * Un échec d'insertion est donc avalé et signalé en console, pas propagé : perdre
 * une ligne de journal est regrettable, refuser une connexion parce que le
 * journal est indisponible serait pire.
 */

import 'server-only';

import { db } from '@/db/client';
import { journalAction } from '@/db/schema';

type TypeAction = (typeof journalAction.$inferInsert)['action'];

export async function journaliser(
  action: TypeAction,
  contexte: {
    utilisateurId?: number | null;
    entite?: string;
    entiteId?: number;
    details?: Record<string, unknown>;
    adresseIp?: string | null;
  } = {},
): Promise<void> {
  try {
    await db.insert(journalAction).values({
      action,
      utilisateurId: contexte.utilisateurId ?? null,
      entite: contexte.entite ?? null,
      entiteId: contexte.entiteId ?? null,
      details: contexte.details ?? null,
      adresseIp: contexte.adresseIp ?? null,
    });
  } catch (erreur) {
    console.error(`Journalisation impossible (${action}) :`, erreur);
  }
}
