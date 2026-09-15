/**
 * Hachage et vérification de mot de passe — Argon2id.
 *
 * Aucun service d'authentification tiers (T1.b, T3.a). `@node-rs/argon2` est
 * retenu pour ses binaires précompilés : aucune chaîne de compilation native à
 * installer, ce qui compte sur un Codespace à deux cœurs et pour la
 * transférabilité vers l'infrastructure ERANOVE.
 *
 * Aucun email n'est jamais envoyé (HYP-5) : la réinitialisation passe par un mot
 * de passe temporaire généré par l'Administrateur, et le compte porte alors
 * `doit_changer_mot_de_passe`.
 */

import { randomBytes } from 'node:crypto';

import { hash, verify } from '@node-rs/argon2';

/**
 * Paramètres de coût. Argon2id est la variante recommandée : elle résiste à la
 * fois aux attaques par canal auxiliaire et aux compromis temps-mémoire.
 *
 * 19 Mio et 2 passes suivent les recommandations OWASP. Le parallélisme est
 * laissé à 1 : la machine a deux cœurs et sert aussi la base.
 */
/**
 * Identifiant numérique d'Argon2id dans `@node-rs/argon2`.
 *
 * La bibliothèque n'expose `Algorithm` que comme un `const enum` ambiant, qu'on
 * ne peut pas déréférencer sous `isolatedModules` — contrainte de Next.js. La
 * valeur est donc écrite en clair, et `tests/motDePasse.test.ts` vérifie que
 * l'empreinte produite porte bien le préfixe `$argon2id$` : ce que le type ne
 * garantit plus, le test le tient.
 */
const ARGON2ID = 2;

const PARAMETRES = {
  algorithm: ARGON2ID,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

/** Longueur minimale d'un mot de passe. */
export const LONGUEUR_MINIMALE = 10;

/**
 * Empreinte d'un mot de passe. Le sel est généré par la bibliothèque et intégré
 * à la chaîne retournée : aucune colonne de sel n'est nécessaire en base.
 */
export async function hacher(motDePasse: string): Promise<string> {
  return hash(motDePasse, PARAMETRES);
}

/**
 * Vérifie un mot de passe contre son empreinte.
 *
 * Ne lève JAMAIS : une empreinte illisible — la chaîne provisoire
 * `A_DEFINIR_ETAPE_4_5` posée par le chargement, par exemple — renvoie `false`
 * comme un mot de passe faux. L'appelant ne doit pas pouvoir distinguer les deux
 * cas, ni par le résultat, ni par une exception.
 */
export async function verifier(
  empreinte: string,
  motDePasse: string,
): Promise<boolean> {
  try {
    return await verify(empreinte, motDePasse, PARAMETRES);
  } catch {
    return false;
  }
}

/**
 * Motif de refus d'un mot de passe, ou `null` s'il est acceptable.
 *
 * Volontairement sobre : une longueur minimale et l'interdiction du mot de passe
 * de démonstration. Imposer des classes de caractères produit des mots de passe
 * plus courts et plus prévisibles, pour un gain nul.
 */
export function motifDeRefus(motDePasse: string): string | null {
  if (motDePasse.length < LONGUEUR_MINIMALE) {
    return `Le mot de passe doit comporter au moins ${LONGUEUR_MINIMALE} caractères.`;
  }
  if (motDePasse === MOT_DE_PASSE_DEMONSTRATION) {
    return 'Ce mot de passe est celui de la démonstration. Choisissez-en un autre.';
  }
  return null;
}

/**
 * Mot de passe commun aux comptes du jeu de démonstration.
 *
 * Il n'ouvre que des données fictives. Il n'a pas à être secret, et il est
 * refusé comme nouveau mot de passe par `motifDeRefus`.
 */
export const MOT_DE_PASSE_DEMONSTRATION = 'Demo2026!';

/**
 * Mot de passe temporaire généré par l'Administrateur lors d'une
 * réinitialisation (HYP-5). Il est communiqué hors application, et le compte
 * doit le changer à la connexion suivante.
 */
export function motDePasseTemporaire(): string {
  // base64url sans caractère ambigu : ni +, ni /, ni =.
  return randomBytes(12).toString('base64url');
}
