/**
 * Instant courant de l'application.
 *
 * POURQUOI CE FICHIER EXISTE. La fenêtre de saisie est calculée à partir de
 * l'horloge (RG-29 : le mois M est saisissable du 1er au 10 du mois M+1). Le jeu
 * de démonstration, lui, est bâti sur un exercice 2026 dont août est le dernier
 * mois saisi et la période ouverte. Les deux ne concordent que pendant dix jours
 * par mois : passé le 10 septembre 2026, août est clos et l'écran de saisie
 * devient partout en lecture seule — la démonstration ne montre plus rien.
 *
 * La maquette V2 avait déjà tranché ce point, et son en-tête le dit :
 * « Date de référence du prototype : 4 septembre 2026 → Août 2026 ouvert,
 * 6 jours restants. » Cette date de référence est donc reprise, pas inventée.
 *
 * CE QUE CE FICHIER NE FAIT PAS. Il ne modifie aucune règle. `periode.ts` reste
 * pur et reçoit l'instant en paramètre ; seule la SOURCE de cet instant change.
 * En production, `MODE_DEMO` valant autre chose que « true », l'horloge réelle
 * est utilisée et la date de référence est structurellement inatteignable.
 */

/**
 * Instant de référence de la démonstration, ou `null` hors mode démonstration.
 *
 * Lève sur une valeur illisible : une date de référence silencieusement ignorée
 * ferait retomber la démonstration sur l'horloge réelle, donc sur un écran vide,
 * sans que personne comprenne pourquoi.
 */
function instantDeDemonstration(): Date | null {
  if (process.env.MODE_DEMO !== 'true') return null;

  const brut = process.env.DATE_REFERENCE_DEMO;
  if (!brut || brut.trim() === '') return null;

  const date = new Date(brut);
  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `DATE_REFERENCE_DEMO illisible : ${JSON.stringify(brut)}. `
      + 'Attendu : un instant ISO 8601, par exemple 2026-09-04T09:00:00Z.',
    );
  }
  return date;
}

/**
 * L'instant à partir duquel toute règle de calendrier est évaluée.
 *
 * En mode démonstration avec `DATE_REFERENCE_DEMO` renseignée, c'est cet
 * instant ; sinon l'horloge du système.
 */
export function maintenant(): Date {
  return instantDeDemonstration() ?? new Date();
}

/**
 * Vrai si l'application tourne sur une date de référence figée.
 *
 * L'interface le signale : un correspondant qui verrait « 6 jours restants » un
 * 15 septembre doit comprendre pourquoi, sinon il doute de tout le reste.
 */
export function surDateDeReference(): boolean {
  return instantDeDemonstration() !== null;
}
