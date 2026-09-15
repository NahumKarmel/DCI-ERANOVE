/**
 * Interface de stockage des pièces jointes.
 *
 * TROISIÈME RÈGLE TECHNIQUE NON NÉGOCIABLE — toute écriture et toute lecture de
 * fichier passe par ici. Le passage au stockage interne ERANOVE, ou à un S3
 * compatible, ne doit toucher qu'un seul fichier : une nouvelle implémentation
 * de cette interface, plus une ligne dans `index.ts`.
 *
 * AUCUN CHEMIN PHYSIQUE NE SORT D'ICI (T7). L'appelant ne manipule que des clés
 * opaques, qui sont ce que la base stocke. Un adaptateur S3 les traduirait en
 * clés d'objet, un adaptateur disque en chemins — l'appelant ne fait pas la
 * différence, et la base n'a pas à être migrée le jour du changement.
 */

/** Clé opaque d'un objet stocké. Générée par le stockage, jamais par l'appelant. */
export type CleStockage = string;

/** Ce que l'appelant sait d'un fichier avant de le confier au stockage. */
export interface FichierEntrant {
  readonly nomOriginal: string;
  readonly typeMime: string;
  readonly contenu: Buffer;
}

/** Ce que le stockage rend en retour, et que la base consigne. */
export interface ObjetStocke {
  readonly cleStockage: CleStockage;
  readonly tailleOctets: number;
}

export interface StorageAdapter {
  /**
   * Écrit un fichier et rend sa clé opaque. La clé est imprévisible : deux
   * dépôts du même fichier produisent deux clés distinctes, et connaître une clé
   * ne permet pas d'en deviner une autre.
   */
  ecrire(fichier: FichierEntrant): Promise<ObjetStocke>;

  /** Relit un objet. Lève si la clé est inconnue ou malformée. */
  lire(cle: CleStockage): Promise<Buffer>;

  /** Supprime un objet. Idempotent : supprimer deux fois ne lève pas. */
  supprimer(cle: CleStockage): Promise<void>;

  existe(cle: CleStockage): Promise<boolean>;

  /** Nom de l'implémentation, pour les journaux et les diagnostics. */
  readonly nom: string;
}
