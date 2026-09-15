/**
 * Schéma complet — point d'entrée unique.
 *
 * Aucune colonne `taux` n'existe dans ce schéma, et il ne doit jamais en
 * apparaître : le taux est toujours calculé (règle technique non négociable n°2).
 */

export * from './referentiel';
export * from './identite';
export * from './donnees';
export * from './journal';
