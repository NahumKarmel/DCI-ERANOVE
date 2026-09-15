/**
 * Point d'entrée du stockage — LE SEUL FICHIER À TOUCHER pour changer de
 * support.
 *
 * Le jour du passage au stockage interne ERANOVE, ou à un S3 compatible, il
 * suffit d'ajouter une implémentation de `StorageAdapter` et une branche dans
 * `stockage()`. Aucun appelant ne change, aucune ligne de base n'est migrée :
 * les clés déjà consignées restent valides puisqu'elles sont opaques.
 */

import 'server-only';

import { StockageDisqueLocal } from './disqueLocal';
import type { StorageAdapter } from './StorageAdapter';

export * from './StorageAdapter';
export * from './formats';

let instance: StorageAdapter | null = null;

/** L'adaptateur de stockage configuré. Instancié une seule fois. */
export function stockage(): StorageAdapter {
  if (instance) return instance;

  const pilote = process.env.STORAGE_DRIVER ?? 'local';

  switch (pilote) {
    case 'local':
      instance = new StockageDisqueLocal(
        process.env.STORAGE_LOCAL_PATH ?? './.data/pieces-jointes',
      );
      return instance;

    case 's3':
      // L'implémentation S3 compatible s'ajoutera ici. Échouer franchement vaut
      // mieux que retomber en silence sur le disque local : un déploiement mal
      // configuré doit s'en apercevoir au démarrage, pas à la première lecture
      // d'une pièce jointe introuvable.
      throw new Error(
        'STORAGE_DRIVER="s3" : l’implémentation S3 compatible n’est pas encore '
        + 'écrite. Utiliser "local" pour l’instant.',
      );

    default:
      throw new Error(`STORAGE_DRIVER inconnu : ${JSON.stringify(pilote)}`);
  }
}
