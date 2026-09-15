/**
 * Fonctions de calcul pures — taux, états de saisie, moyennes.
 *
 * Toutes sont pures et testées. Aucune n'accède à la base, aucune ne met en
 * forme : les taux circulent en fraction (0.804), le pourcentage est une
 * affaire d'affichage.
 *
 * Les trois pièges du fichier Excel d'origine sont traités ici, et nulle part
 * ailleurs :
 *   — un dénominateur nul ne devient jamais 0 (RG-13) ;
 *   — un taux n'est jamais plafonné à 100 % (RG-12) ;
 *   — une valeur non calculable est exclue des moyennes, numérateur ET
 *     dénominateur (RG-17, RG-18).
 */

/** Un taux non calculable se représente par `null`, jamais par 0, jamais NaN. */
export type Taux = number | null;

/** Les trois champs d'une saisie dont dépendent son taux et son état. */
export interface SaisieLue {
  readonly numerateur: number | null;
  readonly denominateur: number | null;
  readonly commentaireSaisie: string | null;
}

/**
 * Taux d'une saisie : `numerateur / denominateur`.
 *
 * RG-13 — dénominateur nul ou absent → `null`, non calculable. Jamais 0 :
 * c'est l'erreur la plus coûteuse du fichier Excel d'origine, qui comptait
 * « aucun test planifié » comme « aucun test réussi ».
 *
 * RG-12 — AUCUN PLAFONNEMENT. Un numérateur supérieur au dénominateur produit
 * un taux supérieur à 1, retourné tel quel.
 */
export function taux(numerateur: number | null, denominateur: number | null): Taux {
  if (numerateur === null || denominateur === null) return null;
  if (denominateur === 0) return null;
  return numerateur / denominateur;
}

/** Une saisie est valorisée dès que numérateur et dénominateur sont fournis. */
export function estValorisee(saisie: SaisieLue): boolean {
  return saisie.numerateur !== null && saisie.denominateur !== null;
}

/**
 * RG-37 bis — une saisie est *renseignée* si le numérateur, le dénominateur ET
 * le commentaire sont fournis. Le commentaire est obligatoire (D8).
 *
 * ATTENTION — « fourni » veut dire NON NUL AU SENS DE `null`, pas « non
 * falsy ». Un dénominateur à 0 est une valeur fournie, légitime et porteuse de
 * sens (RG-13) : la saisie est renseignée, même si son taux est non calculable.
 * Un test de véracité JavaScript (`numerateur && denominateur`) écarterait à
 * tort ces lignes et ferait tomber le taux de remontée global sous sa valeur
 * attendue.
 */
export function estRenseigne(saisie: SaisieLue): boolean {
  return (
    estValorisee(saisie)
    && saisie.commentaireSaisie !== null
    && saisie.commentaireSaisie.trim().length > 0
  );
}

/**
 * RG-37 ter — le brouillon a un double statut : valorisé, donc sa valeur
 * s'affiche et alimente les calculs, mais sans commentaire, donc non renseigné.
 * C'est la SEULE source de mois partiel.
 *
 * L'état brouillon n'est pas une colonne : il se déduit (choix de modélisation
 * n°4).
 */
export function estBrouillon(saisie: SaisieLue): boolean {
  return estValorisee(saisie) && !estRenseigne(saisie);
}

/**
 * Moyenne des taux CALCULABLES. Les `null` sont exclus du numérateur ET du
 * dénominateur de la moyenne (RG-17, RG-18) — jamais comptés comme 0.
 *
 * Retourne `null` si aucun taux n'est calculable : la moyenne est alors
 * elle-même non calculable, et s'affiche « n/a ».
 */
export function moyenneCalculable(valeurs: readonly Taux[]): Taux {
  const calculables = valeurs.filter((v): v is number => v !== null);
  if (calculables.length === 0) return null;
  return calculables.reduce((somme, v) => somme + v, 0) / calculables.length;
}

/**
 * Un objectif n'est atteint que si le taux est calculable et l'atteint ou le
 * dépasse. Un taux non calculable n'atteint pas l'objectif, et ne le manque pas
 * non plus : il est exclu du décompte par l'appelant.
 */
export function objectifAtteint(valeur: Taux, objectif: number): boolean {
  return valeur !== null && valeur >= objectif;
}
