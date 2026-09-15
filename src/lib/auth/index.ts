/**
 * Point d'entrée de la couche d'authentification.
 *
 * `motDePasse` n'est PAS réexporté : il tire `@node-rs/argon2`, un module natif
 * qu'un composant client ne doit jamais atteindre par inadvertance. Il s'importe
 * explicitement là où l'on hache.
 */

export * from './habilitations';
export * from './session';
export { journaliser } from './journal';
