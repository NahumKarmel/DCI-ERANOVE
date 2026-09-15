/**
 * Doublure du module `server-only` de Next.js.
 *
 * `server-only` n'existe qu'à la compilation Next : son rôle est de FAIRE
 * ÉCHOUER le build si un module serveur est importé depuis un composant client.
 * Vitest ne le résout pas.
 *
 * Cette doublure ne désactive rien en production — l'alias ne vit que dans
 * `vitest.config.ts`. La garde reste entière là où elle compte, et les tests
 * peuvent exercer les modules serveur.
 */
export {};
