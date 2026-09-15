/**
 * Recette du hachage de mot de passe.
 *
 * Ajout délibéré au périmètre du lot A. Motif : `@node-rs/argon2` n'expose
 * `Algorithm` que comme un `const enum` ambiant, inaccessible sous
 * `isolatedModules`. L'algorithme est donc désigné par sa valeur numérique, et le
 * compilateur ne peut plus garantir qu'il s'agit bien d'Argon2id. Ce test tient
 * la garantie que le type a cessé de tenir — sans lui, une erreur d'un chiffre
 * ferait basculer silencieusement l'application sur Argon2d ou Argon2i.
 */

import { describe, expect, it } from 'vitest';

import {
  LONGUEUR_MINIMALE,
  MOT_DE_PASSE_DEMONSTRATION,
  hacher,
  motDePasseTemporaire,
  motifDeRefus,
  verifier,
} from '../src/lib/auth/motDePasse';

describe('Hachage — Argon2id', () => {
  it('produit une empreinte Argon2id, et pas une autre variante', async () => {
    const empreinte = await hacher('un-mot-de-passe-quelconque');
    expect(empreinte.startsWith('$argon2id$')).toBe(true);
  });

  it('sale chaque empreinte : deux hachages du même mot de passe diffèrent', async () => {
    const a = await hacher(MOT_DE_PASSE_DEMONSTRATION);
    const b = await hacher(MOT_DE_PASSE_DEMONSTRATION);
    expect(a).not.toBe(b);
    // Le sel étant intégré à la chaîne, les deux se vérifient malgré tout.
    expect(await verifier(a, MOT_DE_PASSE_DEMONSTRATION)).toBe(true);
    expect(await verifier(b, MOT_DE_PASSE_DEMONSTRATION)).toBe(true);
  });
});

describe('Vérification', () => {
  it('accepte le bon mot de passe et refuse le mauvais', async () => {
    const empreinte = await hacher(MOT_DE_PASSE_DEMONSTRATION);
    expect(await verifier(empreinte, MOT_DE_PASSE_DEMONSTRATION)).toBe(true);
    expect(await verifier(empreinte, 'Demo2026')).toBe(false);
    expect(await verifier(empreinte, '')).toBe(false);
  });

  it('ne lève jamais sur une empreinte illisible — elle renvoie false', async () => {
    // Un appelant ne doit pas pouvoir distinguer « empreinte invalide » de
    // « mot de passe faux », ni par le résultat, ni par une exception.
    expect(await verifier('A_DEFINIR_ETAPE_4_5', 'Demo2026!')).toBe(false);
    expect(await verifier('', 'Demo2026!')).toBe(false);
    expect(await verifier('$argon2id$tronque', 'Demo2026!')).toBe(false);
  });
});

describe('Politique de mot de passe', () => {
  it('refuse en dessous de la longueur minimale', () => {
    expect(motifDeRefus('a'.repeat(LONGUEUR_MINIMALE - 1))).not.toBeNull();
    expect(motifDeRefus('a'.repeat(LONGUEUR_MINIMALE))).toBeNull();
  });

  it('refuse le mot de passe de démonstration comme nouveau mot de passe', () => {
    expect(motifDeRefus(MOT_DE_PASSE_DEMONSTRATION)).not.toBeNull();
  });

  it('rejette la démonstration par sa LONGUEUR — le refus nominatif est redondant', () => {
    // Constat : « Demo2026! » fait 9 caractères, donc la règle de longueur
    // l'écarte avant la règle nominative. Celle-ci n'est jamais atteinte
    // aujourd'hui. Elle est conservée à dessein : elle redeviendrait la seule
    // garde si LONGUEUR_MINIMALE baissait. Ce test rend la redondance visible
    // au lieu de la laisser passer pour une couverture qu'elle n'est pas.
    expect(MOT_DE_PASSE_DEMONSTRATION.length).toBeLessThan(LONGUEUR_MINIMALE);
    expect(motifDeRefus(MOT_DE_PASSE_DEMONSTRATION)).toContain('caractères');

    // La règle nominative, elle, mord sur un mot de passe assez long.
    const assezLong = `${MOT_DE_PASSE_DEMONSTRATION}xx`;
    expect(assezLong.length).toBeGreaterThanOrEqual(LONGUEUR_MINIMALE);
    expect(motifDeRefus(assezLong)).toBeNull();
  });
});

describe('Mot de passe temporaire (HYP-5 — aucun email)', () => {
  it('est aléatoire, acceptable, et sans caractère ambigu', () => {
    const a = motDePasseTemporaire();
    const b = motDePasseTemporaire();
    expect(a).not.toBe(b);
    expect(motifDeRefus(a)).toBeNull();
    // base64url : ni +, ni /, ni = — rien qui se perde à la dictée.
    expect(/^[A-Za-z0-9_-]+$/.test(a)).toBe(true);
  });
});
