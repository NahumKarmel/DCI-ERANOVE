/**
 * Recette du stockage des pièces jointes (RG-38, RG-39, T7).
 *
 * Deux enjeux distincts : la validation des formats, qui est une règle de
 * gestion, et les gardes contre la traversée de répertoire, qui sont de la
 * sécurité. Les secondes méritent des tests même si aucune règle ne les nomme :
 * une clé de stockage vient de la base, donc d'une donnée, donc d'un chemin
 * potentiellement hostile.
 */

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { StockageDisqueLocal } from '../src/lib/storage/disqueLocal';
import {
  FORMATS_ACCEPTES,
  TAILLE_MAXIMALE_OCTETS,
  extensionDe,
  motifDeRefusFichier,
} from '../src/lib/storage/formats';

describe('Formats acceptés (RG-39)', () => {
  it('accepte les familles du cahier des charges', () => {
    for (const type of [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/png',
      'image/jpeg',
    ]) {
      expect(motifDeRefusFichier(type, 1024)).toBeNull();
    }
  });

  it('refuse tout autre format, avec un message explicite', () => {
    const motif = motifDeRefusFichier('application/zip', 1024);
    expect(motif).not.toBeNull();
    expect(motif).toContain('Format non accepté');
    // Le message dit ce qui EST admis, pas seulement ce qui est refusé.
    expect(motif).toContain('PDF');
  });

  it('refuse au-delà de 10 Mo, et accepte pile 10 Mo', () => {
    expect(TAILLE_MAXIMALE_OCTETS).toBe(10 * 1024 * 1024);
    expect(motifDeRefusFichier('application/pdf', TAILLE_MAXIMALE_OCTETS)).toBeNull();
    const motif = motifDeRefusFichier('application/pdf', TAILLE_MAXIMALE_OCTETS + 1);
    expect(motif).toContain('10 Mo');
  });

  it('refuse un fichier vide', () => {
    expect(motifDeRefusFichier('application/pdf', 0)).not.toBeNull();
  });

  it("l'extension vient du TYPE, jamais du nom fourni", () => {
    // Un nom de fichier est une donnée hostile ; recopier son extension
    // ouvrirait une traversée de répertoire.
    expect(extensionDe('application/pdf')).toBe('pdf');
    expect(extensionDe('image/jpeg')).toBe('jpg');
    expect(() => extensionDe('application/zip')).toThrow();
    for (const extension of Object.values(FORMATS_ACCEPTES)) {
      expect(extension).toMatch(/^[a-z0-9]{2,5}$/);
    }
  });
});

describe('Stockage sur disque local', () => {
  let racine: string;
  let stockage: StockageDisqueLocal;

  beforeAll(async () => {
    racine = await mkdtemp(join(tmpdir(), 'dci-stockage-'));
    stockage = new StockageDisqueLocal(racine);
  });

  afterAll(async () => {
    await rm(racine, { recursive: true, force: true });
  });

  it('écrit, relit à l’identique, et rend la taille', async () => {
    const contenu = Buffer.from('%PDF-1.7 justificatif fictif');
    const objet = await stockage.ecrire({
      nomOriginal: 'Suivi_plan_controle_interne.pdf',
      typeMime: 'application/pdf',
      contenu,
    });
    expect(objet.tailleOctets).toBe(contenu.byteLength);
    expect(await stockage.lire(objet.cleStockage)).toEqual(contenu);
    expect(await stockage.existe(objet.cleStockage)).toBe(true);
  });

  it('rend des clés OPAQUES — ni nom de fichier, ni sens (T7)', async () => {
    const objet = await stockage.ecrire({
      nomOriginal: 'Cartographie_risques_SODECI.pdf',
      typeMime: 'application/pdf',
      contenu: Buffer.from('x'),
    });
    expect(objet.cleStockage).not.toContain('Cartographie');
    expect(objet.cleStockage).not.toContain('SODECI');
    expect(objet.cleStockage).toMatch(/^[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{32}\.pdf$/);
  });

  it('rend deux clés différentes pour deux dépôts du même fichier', async () => {
    const fichier = {
      nomOriginal: 'identique.pdf',
      typeMime: 'application/pdf',
      contenu: Buffer.from('contenu identique'),
    };
    const a = await stockage.ecrire(fichier);
    const b = await stockage.ecrire(fichier);
    expect(a.cleStockage).not.toBe(b.cleStockage);
  });

  it('supprime, et la suppression est idempotente', async () => {
    const objet = await stockage.ecrire({
      nomOriginal: 'a-supprimer.pdf',
      typeMime: 'application/pdf',
      contenu: Buffer.from('y'),
    });
    await stockage.supprimer(objet.cleStockage);
    expect(await stockage.existe(objet.cleStockage)).toBe(false);
    // Supprimer deux fois ne lève pas.
    await expect(stockage.supprimer(objet.cleStockage)).resolves.toBeUndefined();
  });

  it('REFUSE toute clé qui tenterait de sortir du périmètre', async () => {
    const hostiles = [
      '../../../etc/passwd',
      '00/00/../../../../etc/passwd.pdf',
      '/etc/passwd',
      `00/00/${'0'.repeat(32)}.pdf${String.fromCharCode(0)}.png`,
      'aa/bb/pas-de-l-hexadecimal.pdf',
      '',
    ];
    for (const cle of hostiles) {
      await expect(stockage.lire(cle)).rejects.toThrow();
      await expect(stockage.supprimer(cle)).rejects.toThrow();
      expect(await stockage.existe(cle)).toBe(false);
    }
  });

  it('ne lit pas un fichier posé hors du schéma de clés', async () => {
    // Un fichier déposé à la main dans la racine n'est pas atteignable : sa
    // « clé » ne satisfait pas le motif.
    await writeFile(join(racine, 'intrus.pdf'), 'contenu intrus');
    await expect(stockage.lire('intrus.pdf')).rejects.toThrow();
    // Il est bien là, simplement inatteignable par l'interface.
    expect((await readFile(join(racine, 'intrus.pdf'))).toString()).toBe('contenu intrus');
  });
});
