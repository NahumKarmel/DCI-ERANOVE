/**
 * Matrice des habilitations — fonctions PURES, testables sans base.
 *
 * C'est le cœur de sécurité de l'application. Toute question « cet utilisateur
 * a-t-il le droit de… » se répond ici, et nulle part ailleurs : un écran ne
 * décide jamais d'un droit, il interroge cette matrice.
 *
 * Deux principes gouvernent tout le fichier, et se perdent facilement :
 *
 *  1. LE RÔLE PORTE LA LECTURE, L'ATTRIBUT PORTE L'ADMINISTRATION (D2).
 *     `attributAdministrateur` confère les droits de gestion de comptes EN PLUS
 *     du rôle. Il ne confère JAMAIS de droit de lecture sur les données de
 *     contrôle interne. Un correspondant porteur de l'attribut reste cloisonné
 *     à sa filiale ; un administrateur pur ne voit aucune donnée, jamais.
 *
 *  2. LE CLOISONNEMENT D'UN CORRESPONDANT EST TOTAL (M1).
 *     Il ne voit aucune autre filiale, nulle part, sous aucune forme, pas même
 *     agrégée. Une moyenne groupe est une donnée des douze filiales : elle lui
 *     est donc refusée, alors qu'elle ne nomme aucune filiale.
 */

/** Les 4 rôles de l'arbitrage A3. */
export type Role =
  | 'CORRESPONDANT'
  | 'DIRECTEUR_CI_GROUPE'
  | 'LECTEUR'
  | 'ADMINISTRATEUR';

/**
 * L'identité dont dépendent les droits. Volontairement réduite : ces quatre
 * champs suffisent, et la matrice reste donc testable sans base.
 *
 * `filialeId` n'est renseigné que pour un CORRESPONDANT — un correspondant est
 * rattaché à une et une seule filiale (A4), et l'exception GS2E se règle par
 * deux comptes distincts, pas par un rattachement multiple (M4).
 */
export interface Acteur {
  readonly id: number;
  readonly role: Role;
  readonly attributAdministrateur: boolean;
  readonly filialeId: number | null;
}

/* ------------------------------------------------------------------ */
/*  Lecture des données de contrôle interne                            */
/* ------------------------------------------------------------------ */

/**
 * Accès en lecture aux données d'une filiale donnée.
 *
 * L'administrateur pur est exclu sans condition : c'est une règle absolue (D1,
 * D2). Le lecteur n'est pas restreint (HYP-3) : les douze filiales, en lecture
 * seule.
 */
export function peutLireFiliale(acteur: Acteur, filialeId: number): boolean {
  switch (acteur.role) {
    case 'DIRECTEUR_CI_GROUPE':
    case 'LECTEUR':
      return true;
    case 'CORRESPONDANT':
      // Jamais une autre filiale, quel que soit l'attribut administrateur.
      return acteur.filialeId === filialeId;
    case 'ADMINISTRATEUR':
      return false;
  }
}

/**
 * Accès aux vues consolidées — tableau croisé, moyennes groupe, classements,
 * suivi des remontées des douze filiales.
 *
 * REFUSÉ AU CORRESPONDANT, y compris sous forme agrégée. Une moyenne groupe ne
 * nomme aucune filiale mais reste une donnée des douze : la lui montrer
 * violerait le cloisonnement (M1).
 */
export function peutLireConsolidation(acteur: Acteur): boolean {
  return acteur.role === 'DIRECTEUR_CI_GROUPE' || acteur.role === 'LECTEUR';
}

/** Filiales dont l'acteur peut lire les données, parmi celles existantes. */
export function filialesLisibles(
  acteur: Acteur,
  toutesLesFiliales: readonly number[],
): number[] {
  return toutesLesFiliales.filter((id) => peutLireFiliale(acteur, id));
}

/* ------------------------------------------------------------------ */
/*  Écriture — saisie, commentaires, objectifs, périodes               */
/* ------------------------------------------------------------------ */

/**
 * Saisir les indicateurs d'une filiale.
 *
 * Le seul rôle qui saisit est le CORRESPONDANT, sur sa seule filiale. Le
 * Directeur ne saisit pas : il consulte, commente et pilote. Cette séparation
 * est ce qui donne sa valeur probante au dispositif.
 *
 * NOTE — cette fonction ne dit RIEN de l'ouverture de la période. Le calendrier
 * (HYP-1 : le mois M ouvre le 1er de M+1 et ferme le 10 à 23h59 heure
 * d'Abidjan) et les réouvertures sont une autre condition, vérifiée séparément
 * côté serveur. Avoir le droit de saisir n'est pas avoir une période ouverte.
 */
export function peutSaisir(acteur: Acteur, filialeId: number): boolean {
  return acteur.role === 'CORRESPONDANT' && acteur.filialeId === filialeId;
}

/**
 * Publier dans un fil de commentaires.
 *
 * Le Directeur publie sur les douze filiales, immédiatement visible et sans
 * validation hiérarchique (C10, RG-44). Le correspondant publie dans le fil de
 * sa seule filiale.
 *
 * INFÉRENCE ASSUMÉE — la matrice du lot A ne dit du correspondant que « lit les
 * commentaires de sa filiale ». Deux sources établissent qu'il y répond aussi :
 * la maquette V5, validée par le commanditaire, dont la table `FILS` contient
 * des messages d'auteur CORRESPONDANT ; et RG-42, qui fait porter à chaque
 * message « son auteur, son rôle », ce qui n'aurait pas de sens si un seul rôle
 * pouvait écrire. Signalé pour confirmation.
 */
export function peutCommenter(acteur: Acteur, filialeId: number): boolean {
  if (acteur.role === 'DIRECTEUR_CI_GROUPE') return true;
  if (acteur.role === 'CORRESPONDANT') return acteur.filialeId === filialeId;
  // Le lecteur n'écrit rien (HYP-3), l'administrateur pur ne voit rien (D2).
  return false;
}

/** Lire un fil de commentaires : même périmètre que les données (M1, RG-43). */
export function peutLireCommentaires(acteur: Acteur, filialeId: number): boolean {
  return peutLireFiliale(acteur, filialeId);
}

/**
 * Modifier l'objectif porté par une affectation — donc créer ou lever une
 * dérogation (B7, RG-24 bis). Le Directeur seul.
 */
export function peutModifierObjectif(acteur: Acteur): boolean {
  return acteur.role === 'DIRECTEUR_CI_GROUPE';
}

/**
 * Rouvrir une période close. Le Directeur seul, motif obligatoire, journalisé
 * (M5a). Deux points d'entrée, V5 et V7, mais un seul droit (RG-31 bis).
 */
export function peutRouvrirPeriode(acteur: Acteur): boolean {
  return acteur.role === 'DIRECTEUR_CI_GROUPE';
}

/* ------------------------------------------------------------------ */
/*  Administration des comptes                                        */
/* ------------------------------------------------------------------ */

/**
 * Gérer les comptes : création, modification, désactivation, réinitialisation
 * de mot de passe par mot de passe temporaire (HYP-5, aucun email).
 *
 * Deux voies y mènent : le rôle ADMINISTRATEUR pur, et l'attribut porté par un
 * autre rôle. C'est la seule capacité que l'attribut confère.
 */
export function peutGererComptes(acteur: Acteur): boolean {
  return acteur.role === 'ADMINISTRATEUR' || acteur.attributAdministrateur;
}

/**
 * Modifier le rattachement de filiale d'un compte.
 *
 * D3 — un administrateur ne peut pas modifier SON PROPRE rattachement. Sans
 * cette règle, un correspondant porteur de l'attribut administrateur se
 * rattacherait à la filiale de son choix et contournerait tout le
 * cloisonnement. C'est la garde qui rend l'attribut inoffensif.
 */
export function peutModifierRattachement(
  acteur: Acteur,
  compteCibleId: number,
): boolean {
  if (!peutGererComptes(acteur)) return false;
  return compteCibleId !== acteur.id;
}

/* ------------------------------------------------------------------ */
/*  Portée générale                                                   */
/* ------------------------------------------------------------------ */

/**
 * L'acteur a-t-il accès à au moins une donnée de contrôle interne ?
 *
 * Faux pour l'administrateur pur, et pour lui seul. Sert à l'orientation après
 * connexion : un administrateur pur n'est jamais dirigé vers un écran de
 * données.
 */
export function peutAccederAuxDonnees(acteur: Acteur): boolean {
  return acteur.role !== 'ADMINISTRATEUR';
}
