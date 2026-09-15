/**
 * Recette de la fenêtre de saisie (RG-29, RG-30, HYP-1).
 *
 * Fonctions pures : aucune base, aucune horloge. L'instant courant est toujours
 * passé en paramètre, ce qui rend chaque borne vérifiable à la milliseconde.
 */

import { describe, expect, it } from 'vitest';

import {
  DERNIER_JOUR_DE_SAISIE,
  dernierMoisOuvert,
  etatPeriode,
  fenetreDeSaisie,
  joursRestants,
  saisiePermise,
} from '../src/lib/calculs/periode';

describe('Hypothèse de fuseau — Africa/Abidjan est à UTC+0', () => {
  it('ne décale jamais, ni en janvier ni en juillet', () => {
    // Toute l'arithmétique de ce module est en UTC. Si Abidjan cessait d'être à
    // UTC+0 — changement légal, ou déplacement du siège — ce test casse, au lieu
    // de laisser toutes les clôtures se décaler en silence.
    // Contrôle numérique plutôt que textuel : le libellé du décalage varie selon
    // la version d'ICU (« GMT », « UTC+00:00 »…), le décalage lui-même non.
    const decalageMinutes = (instant: string): number => {
      const date = new Date(instant);
      const parties = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Abidjan',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
      }).formatToParts(date);
      const v = (type: string) => Number(parties.find((p) => p.type === type)!.value);
      const murLocal = Date.UTC(
        v('year'), v('month') - 1, v('day'), v('hour') % 24, v('minute'), v('second'),
      );
      return (murLocal - date.getTime()) / 60_000;
    };

    // Janvier et juillet : s'il y avait une heure d'été, l'un des deux différerait.
    expect(decalageMinutes('2026-01-15T12:00:00Z')).toBe(0);
    expect(decalageMinutes('2026-07-15T12:00:00Z')).toBe(0);
  });
});

describe('Bornes de la fenêtre de saisie', () => {
  it('août 2026 ouvre le 1er septembre et ferme le 10 septembre à 23h59', () => {
    const { ouvreLe, fermeLe } = fenetreDeSaisie(2026, 8);
    expect(ouvreLe.toISOString()).toBe('2026-09-01T00:00:00.000Z');
    expect(fermeLe.toISOString()).toBe('2026-09-10T23:59:59.999Z');
  });

  it('décembre 2026 ouvre en janvier 2027 — le passage d’année est porté', () => {
    const { ouvreLe, fermeLe } = fenetreDeSaisie(2026, 12);
    expect(ouvreLe.toISOString()).toBe('2027-01-01T00:00:00.000Z');
    expect(fermeLe.toISOString()).toBe('2027-01-10T23:59:59.999Z');
  });

  it('refuse un mois hors bornes', () => {
    expect(() => fenetreDeSaisie(2026, 0)).toThrow();
    expect(() => fenetreDeSaisie(2026, 13)).toThrow();
  });

  it('la fenêtre dure dix jours pleins', () => {
    expect(DERNIER_JOUR_DE_SAISIE).toBe(10);
  });
});

describe('État de la période', () => {
  const aout = (instant: string) => etatPeriode(2026, 8, new Date(instant));

  it('AUCUNE SAISIE ANTICIPÉE — août est fermé pendant le mois d’août', () => {
    expect(aout('2026-08-31T23:59:59Z')).toBe('NON_OUVERTE');
    expect(aout('2026-08-15T12:00:00Z')).toBe('NON_OUVERTE');
  });

  it('ouvre à la première milliseconde du 1er septembre', () => {
    expect(aout('2026-09-01T00:00:00.000Z')).toBe('OUVERTE');
  });

  it('reste ouverte jusqu’à la dernière milliseconde du 10 septembre', () => {
    expect(aout('2026-09-10T23:59:59.999Z')).toBe('OUVERTE');
  });

  it('se clôt à la milliseconde suivante', () => {
    expect(aout('2026-09-11T00:00:00.000Z')).toBe('CLOSE');
  });

  it('une réouverture active rend l’état ROUVERTE, distinct de OUVERTE et CLOSE', () => {
    // Trois états, trois rendus (RG-31 ter).
    expect(etatPeriode(2026, 8, new Date('2026-09-20T12:00:00Z'), true)).toBe('ROUVERTE');
    expect(etatPeriode(2026, 8, new Date('2026-09-20T12:00:00Z'), false)).toBe('CLOSE');
  });

  it('une réouverture ne peut PAS ouvrir une période non encore ouverte', () => {
    // Rouvrir suppose d'avoir clos. Sans cette garde, une réouverture mal datée
    // autoriserait une saisie anticipée.
    expect(etatPeriode(2026, 8, new Date('2026-08-15T12:00:00Z'), true)).toBe('NON_OUVERTE');
  });
});

describe('Saisie permise', () => {
  it('seuls OUVERTE et ROUVERTE autorisent l’écriture', () => {
    expect(saisiePermise('OUVERTE')).toBe(true);
    expect(saisiePermise('ROUVERTE')).toBe(true);
    expect(saisiePermise('CLOSE')).toBe(false);
    expect(saisiePermise('NON_OUVERTE')).toBe(false);
  });
});

describe('Jours restants', () => {
  it('le 4 septembre, il reste 6 jours pour saisir août — compte de la maquette', () => {
    expect(joursRestants(2026, 8, new Date('2026-09-04T09:00:00Z'))).toBe(6);
  });

  it('le dernier jour, il ne reste plus de jour entier', () => {
    expect(joursRestants(2026, 8, new Date('2026-09-10T08:00:00Z'))).toBe(0);
  });

  it('n’a pas de sens hors fenêtre', () => {
    expect(joursRestants(2026, 8, new Date('2026-08-20T12:00:00Z'))).toBeNull();
    expect(joursRestants(2026, 8, new Date('2026-09-11T12:00:00Z'))).toBeNull();
  });
});

describe('Dernier mois ouvert', () => {
  it('au 4 septembre 2026, c’est août', () => {
    expect(dernierMoisOuvert(2026, new Date('2026-09-04T09:00:00Z'))).toBe(8);
  });

  it('au 15 septembre 2026, c’est encore août — septembre n’ouvre qu’en octobre', () => {
    expect(dernierMoisOuvert(2026, new Date('2026-09-15T09:00:00Z'))).toBe(8);
  });

  it('avant toute ouverture de l’exercice, il n’y en a aucun', () => {
    expect(dernierMoisOuvert(2026, new Date('2026-01-15T09:00:00Z'))).toBeNull();
  });
});
