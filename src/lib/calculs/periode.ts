/**
 * Fenêtre de saisie mensuelle — fonctions PURES.
 *
 * RG-29 / HYP-1 — le mois M est saisissable du 1er au 10 du mois M+1 inclus,
 * jusqu'à 23h59 heure d'Abidjan. Au-delà, la période est close. Aucune saisie
 * anticipée pendant le mois courant.
 *
 * FUSEAU — le CDC précise « heure d'Abidjan (UTC+0) ». `Africa/Abidjan` est à
 * UTC+00:00 toute l'année, sans heure d'été : l'arithmétique en UTC est donc
 * exacte, et non une approximation. `tests/periode.test.ts` vérifie cette
 * hypothèse contre la base de fuseaux du système, de sorte qu'un changement de
 * fuseau — ou un déplacement du siège — casse un test au lieu de décaler
 * silencieusement toutes les clôtures.
 *
 * Aucune de ces fonctions ne lit l'horloge : l'instant courant est toujours
 * passé en paramètre. C'est ce qui les rend testables, et ce qui permet à la
 * démonstration de se placer à une date de référence sans altérer la règle.
 */

/** Dernier jour de saisie du mois suivant. */
export const DERNIER_JOUR_DE_SAISIE = 10;

/**
 * État d'une période, du point de vue de la saisie.
 *
 * Quatre états, et non trois : une période rouverte se distingue visuellement
 * d'« ouverte » et de « close » dans tous les écrans (RG-31 ter).
 */
export type EtatPeriode = 'NON_OUVERTE' | 'OUVERTE' | 'CLOSE' | 'ROUVERTE';

/** Bornes de la fenêtre de saisie d'un mois donné. */
export interface FenetreDeSaisie {
  /** Premier instant saisissable : le 1er du mois M+1 à 00h00. */
  readonly ouvreLe: Date;
  /** Dernier instant saisissable : le 10 du mois M+1 à 23h59 59s 999ms. */
  readonly fermeLe: Date;
}

/**
 * Fenêtre de saisie du mois `mois` de l'exercice `exercice`.
 *
 * Le mois 12 ouvre en janvier de l'exercice suivant : le passage d'année est
 * porté par `Date.UTC`, qui normalise un mois 12 en janvier de l'année d'après.
 */
export function fenetreDeSaisie(exercice: number, mois: number): FenetreDeSaisie {
  if (!Number.isInteger(mois) || mois < 1 || mois > 12) {
    throw new Error(`Mois invalide : ${mois}`);
  }
  // `mois` est en base 1 ; l'index du mois M+1 en base 0 vaut donc `mois`.
  return {
    ouvreLe: new Date(Date.UTC(exercice, mois, 1, 0, 0, 0, 0)),
    fermeLe: new Date(
      Date.UTC(exercice, mois, DERNIER_JOUR_DE_SAISIE, 23, 59, 59, 999),
    ),
  };
}

/**
 * État d'une période à un instant donné.
 *
 * `reouvertureActive` fait basculer une période close en « rouverte ». Elle ne
 * peut PAS rouvrir une période non encore ouverte : rouvrir suppose d'avoir
 * clos, et aucune saisie anticipée n'est permise.
 */
export function etatPeriode(
  exercice: number,
  mois: number,
  maintenant: Date,
  reouvertureActive = false,
): EtatPeriode {
  const { ouvreLe, fermeLe } = fenetreDeSaisie(exercice, mois);
  const t = maintenant.getTime();

  if (t < ouvreLe.getTime()) return 'NON_OUVERTE';
  if (t <= fermeLe.getTime()) return 'OUVERTE';
  return reouvertureActive ? 'ROUVERTE' : 'CLOSE';
}

/**
 * La saisie est-elle permise ?
 *
 * Deux états seulement l'autorisent. C'est cette fonction — et elle seule — que
 * le serveur interroge avant d'écrire : l'interface peut désactiver ses champs,
 * cela ne constitue jamais un contrôle.
 */
export function saisiePermise(etat: EtatPeriode): boolean {
  return etat === 'OUVERTE' || etat === 'ROUVERTE';
}

/**
 * Jours restants avant la clôture, en jours calendaires.
 *
 * Le compte est celui de la maquette validée : le 4 septembre, il reste 6 jours
 * pour saisir août, la clôture tombant le 10. On compte donc les jours qui
 * restent APRÈS aujourd'hui, et non la durée exacte jusqu'à 23h59.
 *
 * Retourne `null` hors fenêtre : « jours restants » n'a pas de sens sur une
 * période non ouverte ou close.
 */
export function joursRestants(
  exercice: number,
  mois: number,
  maintenant: Date,
): number | null {
  if (etatPeriode(exercice, mois, maintenant) !== 'OUVERTE') return null;
  return Math.max(0, DERNIER_JOUR_DE_SAISIE - maintenant.getUTCDate());
}

/**
 * Dernier mois dont la période a été ouverte à un instant donné — donc le mois
 * que le correspondant a le plus récemment eu à saisir.
 *
 * Sert à positionner l'écran de saisie sur le bon mois sans le coder en dur.
 * Retourne `null` si l'exercice n'a pas encore commencé à être saisissable.
 */
export function dernierMoisOuvert(exercice: number, maintenant: Date): number | null {
  for (let mois = 12; mois >= 1; mois--) {
    if (etatPeriode(exercice, mois, maintenant) !== 'NON_OUVERTE') return mois;
  }
  return null;
}
