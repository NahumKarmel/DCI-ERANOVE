/**
 * Implémentation `StorageAdapter` sur disque local.
 *
 * Destinée au développement et à la démonstration. L'implémentation S3
 * compatible viendra à côté, sans qu'aucun appelant ne change.
 *
 * Les clés sont générées ici et ne portent aucune information : ni nom de
 * fichier, ni filiale, ni indicateur. Le nom original vit en base, pas sur le
 * disque — ce qui évite d'avoir à assainir un nom de fichier fourni par
 * l'utilisateur, et rend les fichiers illisibles à qui parcourrait le
 * répertoire.
 */

import 'server-only';

import { randomBytes } from 'node:crypto';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';

import { extensionDe } from './formats';
import type {
  CleStockage,
  FichierEntrant,
  ObjetStocke,
  StorageAdapter,
} from './StorageAdapter';

/**
 * Forme admise d'une clé : deux segments de deux caractères hexadécimaux, puis
 * 32 caractères hexadécimaux, puis une extension alphanumérique courte.
 *
 * Toute clé lue depuis la base est validée contre ce motif AVANT d'approcher le
 * système de fichiers. C'est la première des deux gardes contre la traversée de
 * répertoire : ni `..`, ni `/`, ni caractère nul ne peuvent satisfaire ce motif.
 */
const MOTIF_CLE = /^[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{32}\.[a-z0-9]{2,5}$/;

export class StockageDisqueLocal implements StorageAdapter {
  readonly nom = 'disque-local';

  /** Racine du stockage, résolue une fois pour toutes. */
  private readonly racine: string;

  constructor(racine: string) {
    this.racine = resolve(racine);
  }

  /**
   * Chemin absolu d'une clé, après validation.
   *
   * SECONDE GARDE — même une clé conforme au motif voit son chemin résolu puis
   * vérifié comme descendant strict de la racine. Deux gardes valent mieux
   * qu'une : la première peut être affaiblie par une évolution du motif, la
   * seconde tient indépendamment.
   */
  private cheminDe(cle: CleStockage): string {
    if (!MOTIF_CLE.test(cle)) {
      throw new Error(`Clé de stockage malformée : ${JSON.stringify(cle)}`);
    }
    const chemin = resolve(join(this.racine, cle));
    if (chemin !== this.racine && !chemin.startsWith(this.racine + sep)) {
      throw new Error('Clé de stockage hors du périmètre de stockage.');
    }
    return chemin;
  }

  /**
   * Nouvelle clé : 16 octets d'aléa, dont les deux premiers octets servent de
   * répertoires intermédiaires. Ce découpage évite un répertoire unique de
   * dizaines de milliers d'entrées, que certains systèmes de fichiers
   * parcourent mal.
   */
  private nouvelleCle(typeMime: string): CleStockage {
    const alea = randomBytes(16).toString('hex');
    return `${alea.slice(0, 2)}/${alea.slice(2, 4)}/${alea}.${extensionDe(typeMime)}`;
  }

  async ecrire(fichier: FichierEntrant): Promise<ObjetStocke> {
    const cle = this.nouvelleCle(fichier.typeMime);
    const chemin = this.cheminDe(cle);
    await mkdir(dirname(chemin), { recursive: true });
    // `wx` échoue si le fichier existe : une collision d'aléa ne doit jamais
    // écraser silencieusement une pièce jointe existante.
    await writeFile(chemin, fichier.contenu, { flag: 'wx' });
    return { cleStockage: cle, tailleOctets: fichier.contenu.byteLength };
  }

  async lire(cle: CleStockage): Promise<Buffer> {
    return readFile(this.cheminDe(cle));
  }

  async supprimer(cle: CleStockage): Promise<void> {
    await rm(this.cheminDe(cle), { force: true });
  }

  async existe(cle: CleStockage): Promise<boolean> {
    try {
      const infos = await stat(this.cheminDe(cle));
      return infos.isFile();
    } catch {
      return false;
    }
  }
}
