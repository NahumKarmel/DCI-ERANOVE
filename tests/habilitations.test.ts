/**
 * Recette de la matrice des habilitations.
 *
 * Fonctions pures : aucune base, aucun serveur. Ces tests couvrent ce que les
 * tests numériques ne verront jamais — un écran qui montrerait à un correspondant
 * les données d'une autre filiale passerait les six repères sans broncher.
 *
 * Le cas décisif est celui du CORRESPONDANT PORTEUR DE L'ATTRIBUT
 * ADMINISTRATEUR : c'est la situation réelle du correspondant GS2E — SDRM, et
 * c'est là que la confusion entre rôle et attribut ferait tomber tout le
 * cloisonnement.
 */

import { describe, expect, it } from 'vitest';

import {
  filialesLisibles,
  peutAccederAuxDonnees,
  peutCommenter,
  peutGererComptes,
  peutLireCommentaires,
  peutLireConsolidation,
  peutLireFiliale,
  peutModifierObjectif,
  peutModifierRattachement,
  peutRouvrirPeriode,
  peutSaisir,
  type Acteur,
} from '../src/lib/auth/habilitations';

/** Identifiants de filiale arbitraires : SDER et une autre. */
const SDER = 9;
const AUTRE = 3;
const TOUTES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const correspondant: Acteur = {
  id: 100, role: 'CORRESPONDANT', attributAdministrateur: false, filialeId: SDER,
};
/** Cas réel de GS2E — SDRM : correspondant ET porteur de l'attribut. */
const correspondantAdmin: Acteur = {
  id: 101, role: 'CORRESPONDANT', attributAdministrateur: true, filialeId: SDER,
};
const directeur: Acteur = {
  id: 102, role: 'DIRECTEUR_CI_GROUPE', attributAdministrateur: true, filialeId: null,
};
const lecteur: Acteur = {
  id: 103, role: 'LECTEUR', attributAdministrateur: false, filialeId: null,
};
const administrateur: Acteur = {
  id: 104, role: 'ADMINISTRATEUR', attributAdministrateur: true, filialeId: null,
};

describe('CORRESPONDANT — cloisonné à sa filiale', () => {
  it('lit et saisit sa filiale', () => {
    expect(peutLireFiliale(correspondant, SDER)).toBe(true);
    expect(peutSaisir(correspondant, SDER)).toBe(true);
    expect(peutLireCommentaires(correspondant, SDER)).toBe(true);
    expect(peutCommenter(correspondant, SDER)).toBe(true);
  });

  it('ne lit ni ne saisit aucune autre filiale', () => {
    expect(peutLireFiliale(correspondant, AUTRE)).toBe(false);
    expect(peutSaisir(correspondant, AUTRE)).toBe(false);
    expect(peutLireCommentaires(correspondant, AUTRE)).toBe(false);
    expect(peutCommenter(correspondant, AUTRE)).toBe(false);
  });

  it('ne voit AUCUNE vue consolidée, pas même agrégée', () => {
    // Une moyenne groupe ne nomme aucune filiale mais reste une donnée des
    // douze : la montrer violerait le cloisonnement (M1).
    expect(peutLireConsolidation(correspondant)).toBe(false);
  });

  it('ne voit qu’une seule filiale sur les douze', () => {
    expect(filialesLisibles(correspondant, TOUTES)).toEqual([SDER]);
  });

  it('ne pilote ni objectif ni réouverture', () => {
    expect(peutModifierObjectif(correspondant)).toBe(false);
    expect(peutRouvrirPeriode(correspondant)).toBe(false);
  });

  it('ne gère pas les comptes sans l’attribut', () => {
    expect(peutGererComptes(correspondant)).toBe(false);
  });
});

describe('CORRESPONDANT porteur de l’attribut administrateur — cas GS2E — SDRM', () => {
  it('gagne la gestion des comptes', () => {
    expect(peutGererComptes(correspondantAdmin)).toBe(true);
  });

  it('RESTE cloisonné à sa filiale — l’attribut ne donne aucune lecture (D2)', () => {
    expect(peutLireFiliale(correspondantAdmin, SDER)).toBe(true);
    expect(peutLireFiliale(correspondantAdmin, AUTRE)).toBe(false);
    expect(peutLireConsolidation(correspondantAdmin)).toBe(false);
    expect(filialesLisibles(correspondantAdmin, TOUTES)).toEqual([SDER]);
  });

  it('ne gagne ni saisie ailleurs, ni objectif, ni réouverture', () => {
    expect(peutSaisir(correspondantAdmin, AUTRE)).toBe(false);
    expect(peutModifierObjectif(correspondantAdmin)).toBe(false);
    expect(peutRouvrirPeriode(correspondantAdmin)).toBe(false);
  });

  it('ne peut pas modifier son PROPRE rattachement (D3)', () => {
    // Sans cette garde, il se rattacherait à la filiale de son choix et
    // contournerait tout le cloisonnement.
    expect(peutModifierRattachement(correspondantAdmin, correspondantAdmin.id)).toBe(false);
    expect(peutModifierRattachement(correspondantAdmin, 999)).toBe(true);
  });
});

describe('DIRECTEUR_CI_GROUPE — lit tout, pilote, ne saisit pas', () => {
  it('lit les douze filiales et les vues consolidées', () => {
    expect(filialesLisibles(directeur, TOUTES)).toEqual(TOUTES);
    expect(peutLireConsolidation(directeur)).toBe(true);
  });

  it('commente les douze filiales', () => {
    expect(peutCommenter(directeur, SDER)).toBe(true);
    expect(peutCommenter(directeur, AUTRE)).toBe(true);
  });

  it('modifie les objectifs et rouvre les périodes', () => {
    expect(peutModifierObjectif(directeur)).toBe(true);
    expect(peutRouvrirPeriode(directeur)).toBe(true);
  });

  it('NE SAISIT PAS — la séparation fonde la valeur probante du dispositif', () => {
    expect(peutSaisir(directeur, SDER)).toBe(false);
    expect(peutSaisir(directeur, AUTRE)).toBe(false);
  });

  it('ne peut pas modifier son propre rattachement (D3)', () => {
    expect(peutModifierRattachement(directeur, directeur.id)).toBe(false);
  });
});

describe('LECTEUR — les douze filiales, aucune écriture (HYP-3)', () => {
  it('n’est pas restreint en lecture', () => {
    expect(filialesLisibles(lecteur, TOUTES)).toEqual(TOUTES);
    expect(peutLireConsolidation(lecteur)).toBe(true);
    expect(peutLireCommentaires(lecteur, AUTRE)).toBe(true);
  });

  it('n’écrit rien, nulle part', () => {
    expect(peutSaisir(lecteur, SDER)).toBe(false);
    expect(peutCommenter(lecteur, SDER)).toBe(false);
    expect(peutModifierObjectif(lecteur)).toBe(false);
    expect(peutRouvrirPeriode(lecteur)).toBe(false);
    expect(peutGererComptes(lecteur)).toBe(false);
  });
});

describe('ADMINISTRATEUR pur — comptes seulement, AUCUNE donnée (D1, D2)', () => {
  it('ne lit AUCUNE filiale, et c’est une règle absolue', () => {
    expect(filialesLisibles(administrateur, TOUTES)).toEqual([]);
    for (const id of TOUTES) expect(peutLireFiliale(administrateur, id)).toBe(false);
    expect(peutLireConsolidation(administrateur)).toBe(false);
    expect(peutAccederAuxDonnees(administrateur)).toBe(false);
  });

  it('ne lit ni ne publie aucun commentaire', () => {
    expect(peutLireCommentaires(administrateur, SDER)).toBe(false);
    expect(peutCommenter(administrateur, SDER)).toBe(false);
  });

  it('gère les comptes', () => {
    expect(peutGererComptes(administrateur)).toBe(true);
  });

  it('ne peut pas modifier son propre rattachement (D3)', () => {
    expect(peutModifierRattachement(administrateur, administrateur.id)).toBe(false);
    expect(peutModifierRattachement(administrateur, 42)).toBe(true);
  });
});

describe('Portée générale', () => {
  it('seul l’administrateur pur est privé de données', () => {
    expect(peutAccederAuxDonnees(correspondant)).toBe(true);
    expect(peutAccederAuxDonnees(correspondantAdmin)).toBe(true);
    expect(peutAccederAuxDonnees(directeur)).toBe(true);
    expect(peutAccederAuxDonnees(lecteur)).toBe(true);
    expect(peutAccederAuxDonnees(administrateur)).toBe(false);
  });

  it('aucun rôle ne peut modifier son propre rattachement', () => {
    for (const acteur of [correspondant, correspondantAdmin, directeur, lecteur, administrateur]) {
      expect(peutModifierRattachement(acteur, acteur.id)).toBe(false);
    }
  });
});
