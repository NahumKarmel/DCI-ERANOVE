/**
 * Formats et taille acceptés pour une pièce jointe (RG-39, HYP-2).
 *
 * La pièce jointe est FACULTATIVE et NON BLOQUANTE (RG-38) : son absence
 * n'empêche ni l'enregistrement, ni la remontée, ni le calcul. En revanche un
 * format non accepté est refusé à l'envoi, avec un message explicite — et non
 * accepté puis silencieusement ignoré.
 */

/** 10 Mo maximum par fichier. */
export const TAILLE_MAXIMALE_OCTETS = Number(
  process.env.STORAGE_TAILLE_MAX_OCTETS ?? '10485760',
);

/**
 * Types MIME acceptés, et l'extension sous laquelle le fichier est rangé.
 *
 * L'extension est déterminée par le type, jamais reprise du nom fourni par
 * l'utilisateur : un nom de fichier est une donnée hostile, une extension
 * recopiée telle quelle ouvrirait une traversée de répertoire.
 */
export const FORMATS_ACCEPTES: Readonly<Record<string, string>> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.ms-powerpoint': 'ppt',
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

/** Liste lisible des formats, pour l'interface et les messages d'erreur. */
export const LIBELLE_FORMATS = 'PDF, Excel, Word, PowerPoint, PNG, JPG';

/** Valeur de l'attribut `accept` d'un champ de fichier. */
export const ATTRIBUT_ACCEPT = Object.keys(FORMATS_ACCEPTES).join(',');

/** Taille maximale en mégaoctets, pour l'affichage. */
export const TAILLE_MAXIMALE_MO = Math.round(TAILLE_MAXIMALE_OCTETS / 1_048_576);

/**
 * Motif de refus d'un fichier, ou `null` s'il est acceptable.
 *
 * Le contrôle porte sur le TYPE et la TAILLE, tous deux vérifiés côté serveur.
 * L'attribut `accept` d'un champ de fichier est un confort d'interface, jamais
 * un contrôle : il se contourne d'un glisser-déposer.
 */
export function motifDeRefusFichier(
  typeMime: string,
  tailleOctets: number,
): string | null {
  if (tailleOctets <= 0) {
    return 'Le fichier est vide.';
  }
  if (tailleOctets > TAILLE_MAXIMALE_OCTETS) {
    const mo = (tailleOctets / 1_048_576).toFixed(1).replace('.', ',');
    return `Le fichier pèse ${mo} Mo, au-delà du maximum de ${TAILLE_MAXIMALE_MO} Mo.`;
  }
  if (!(typeMime in FORMATS_ACCEPTES)) {
    return `Format non accepté. Formats admis : ${LIBELLE_FORMATS}.`;
  }
  return null;
}

/** Extension de rangement d'un type accepté. */
export function extensionDe(typeMime: string): string {
  const extension = FORMATS_ACCEPTES[typeMime];
  if (!extension) throw new Error(`Type MIME non accepté : ${typeMime}`);
  return extension;
}
