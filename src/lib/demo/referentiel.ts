/**
 * Référentiel du jeu de démonstration — source unique et figée (RG-46 bis).
 *
 * Porté à l'identique des six maquettes validées du Bloc 3
 * (`docs/prototypes/*.jsx`). Les profils de génération, les objectifs, les
 * brouillons et les réouvertures sont repris sans réinterprétation : c'est
 * cette fidélité qui garantit que les chiffres de l'application coïncident
 * avec ceux des maquettes présentées au commanditaire.
 *
 * DONNÉES ENTIÈREMENT FICTIVES. Aucun nom, aucune adresse et aucun chiffre
 * de contrôle interne réel du groupe ERANOVE n'y figure.
 *
 * Ce fichier ne doit plus être modifié : tout écran s'y adosse.
 */

/** Exercice courant du jeu de démonstration. */
export const EXERCICE_COURANT = 2026;

/** Dernier mois saisi de l'exercice courant : août 2026, période ouverte
 *  jusqu'au 10 septembre à 23h59 heure d'Abidjan (HYP-1).
 *  Les mois 1 à 7 sont donc clos, le mois 8 est ouvert. */
export const DERNIER_MOIS_SAISI = 8;

/** Exercice précédent, complet, qui rend possible la comparaison N-1 (HYP-4). */
export const EXERCICE_PRECEDENT = 2025;

/** Les deux exercices existants. 2024 n'existe pas : la comparaison N-1
 *  est donc désactivée sur 2025 (RG-28 ter). */
export const EXERCICES = [EXERCICE_COURANT, EXERCICE_PRECEDENT] as const;

export const MOIS_COURTS = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
] as const;

export const MOIS_LONGS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
] as const;

/** Nombre de mois attendus pour un exercice donné. */
export const derniersMoisDe = (annee: number): number =>
  annee === EXERCICE_COURANT ? DERNIER_MOIS_SAISI : 12;

/* ------------------------------------------------------------------ */
/*  Les 7 indicateurs du référentiel groupe                            */
/* ------------------------------------------------------------------ */

export type CodeIndicateur =
  | 'PCI' | 'CARTO' | 'AMR' | 'QCI' | 'TCI' | 'RECO_SEM' | 'RECO_CA';

export interface Indicateur {
  readonly code: CodeIndicateur;
  readonly ordre: number;
  readonly libelle: string;
  readonly libelleCourt: string;
  readonly libelleNumerateur: string;
  readonly libelleDenominateur: string;
  /** Objectif groupe, TOUJOURS en fraction — jamais en pourcentage
   *  (choix de modélisation n°3). */
  readonly objectif: number;
  readonly modeCalcul: 'CUMUL' | 'FLUX';
}

export const INDICATEURS: readonly Indicateur[] = [
  {
    code: 'PCI', ordre: 1, libelleCourt: 'Plan de Contrôle Interne',
    libelle: 'Taux de mise en œuvre du Plan de Contrôle Interne',
    libelleNumerateur: 'Nb activités réalisées',
    libelleDenominateur: 'Nb activités planifiées',
    objectif: 1.0, modeCalcul: 'CUMUL',
  },
  {
    code: 'CARTO', ordre: 2, libelleCourt: 'Cartographies de risques',
    libelle: 'Taux de réalisation ou mise à jour des cartographies de risques',
    libelleNumerateur: 'Nb cartos réalisées ou mises à jour',
    libelleDenominateur: 'Nb cartos à réaliser ou mettre à jour',
    objectif: 0.5, modeCalcul: 'CUMUL',
  },
  {
    code: 'AMR', ordre: 3, libelleCourt: 'Actions de maîtrise',
    libelle: 'Taux de mise en œuvre des actions de maîtrise des risques niveaux 1 & 2',
    libelleNumerateur: 'Nb reco. traitées à 100 %',
    libelleDenominateur: 'Nb reco. émises',
    objectif: 0.8, modeCalcul: 'CUMUL',
  },
  {
    code: 'QCI', ordre: 4, libelleCourt: 'QCI',
    libelle: 'Taux de réalisation des Questionnaires de Contrôle Interne planifiés',
    libelleNumerateur: 'Nb QCI administrés',
    libelleDenominateur: 'Nb QCI planifiés',
    objectif: 0.6, modeCalcul: 'CUMUL',
  },
  {
    code: 'TCI', ordre: 5, libelleCourt: 'TCI',
    libelle: 'Taux de réalisation des Tests de Contrôle Interne planifiés',
    libelleNumerateur: 'Nb TCI administrés',
    libelleDenominateur: 'Nb TCI planifiés',
    objectif: 1.0, modeCalcul: 'CUMUL',
  },
  {
    code: 'RECO_SEM', ordre: 6, libelleCourt: 'Reco. séminaires CI',
    libelle: 'Taux de mise en œuvre des recommandations issues des séminaires / journées CI',
    libelleNumerateur: 'Nb reco. traitées à 100 %',
    libelleDenominateur: 'Nb reco. émises',
    objectif: 0.75, modeCalcul: 'CUMUL',
  },
  {
    code: 'RECO_CA', ordre: 7, libelleCourt: "Reco. comités d'audit",
    libelle: "Taux de mise en œuvre des recommandations issues des comités d'audit",
    libelleNumerateur: 'Nb reco. traitées à 100 %',
    libelleDenominateur: 'Nb reco. émises',
    objectif: 1.0, modeCalcul: 'CUMUL',
  },
] as const;

/** Les 7 codes, dans l'ordre d'affichage. */
export const TOUS_INDICATEURS: readonly CodeIndicateur[] =
  INDICATEURS.map((i) => i.code);

export const indicateurParCode = (code: string): Indicateur => {
  const trouve = INDICATEURS.find((i) => i.code === code);
  if (!trouve) throw new Error(`Indicateur inconnu : ${code}`);
  return trouve;
};

/* ------------------------------------------------------------------ */
/*  Les 12 filiales déclarantes et leur profil de génération           */
/* ------------------------------------------------------------------ */

/**
 * Profil de génération d'une filiale.
 *
 * Chaque champ porte un cas limite du jeu de démonstration. Ils ne
 * s'appliquent QU'À L'EXERCICE COURANT : l'exercice précédent est régulier,
 * ce qui rend la comparaison N-1 lisible.
 */
export interface ProfilGeneration {
  /** Performance cible de l'exercice courant. */
  readonly perf: number;
  /** Premier mois saisi. Les mois antérieurs sont des trous (RG-32). */
  readonly debut: number;
  /** Mois sans aucune saisie — trous (RG-32). */
  readonly trous: readonly number[];
  /** Performance cible de l'exercice précédent. `null` = aucun historique
   *  N-1, ce qui désactive la comparaison (RG-28 ter). */
  readonly n1: number | null;
  /** Mois en creux : taux minoré. */
  readonly creux?: readonly number[];
  /** Indicateurs en surperformance à partir de juin — au-delà de 100 %,
   *  affiché tel quel (RG-12). */
  readonly sur?: readonly CodeIndicateur[];
  /** Indicateur dont l'objectif est atteint puis reperdu. */
  readonly reperdu?: CodeIndicateur;
  /** Mois à dénominateur nul par indicateur : taux non calculable,
   *  jamais 0 (RG-13). */
  readonly denZero?: Partial<Record<CodeIndicateur, readonly number[]>>;
  /** Objectif dérogatoire par indicateur, au titre du seul exercice courant.
   *  La dérogation n'est pas un attribut : elle se déduit de l'écart avec
   *  `Indicateur.objectif` (choix de modélisation n°5, RG-24 bis). */
  readonly objSpec?: Partial<Record<CodeIndicateur, number>>;
}

export interface Filiale {
  readonly code: string;
  readonly libelle: string;
  readonly entiteJuridique: string;
  readonly ordre: number;
  /** Correspondant FICTIF de la filiale. */
  readonly correspondant: { readonly prenom: string; readonly nom: string };
  /** L'attribut administrateur ne confère JAMAIS de droit de lecture (D2). */
  readonly attributAdministrateur?: boolean;
  /** Indicateurs affectés. GS2E — SDRM n'en porte que 4. */
  readonly affectes: readonly CodeIndicateur[];
  readonly profil: ProfilGeneration;
}

/**
 * 12 filiales déclarantes pour 11 entités juridiques : GS2E remonte par deux
 * sous-directions traitées comme deux filiales de plein droit (A4, D4).
 *
 * Piège terminologique : `SDRM` désigne ici la Sous-Direction Risk Management
 * de GS2E. Aucun lien avec le projet homonyme.
 */
export const FILIALES: readonly Filiale[] = [
  {
    code: 'GS2E_SDCI', libelle: 'GS2E — SDCI', entiteJuridique: 'GS2E', ordre: 1,
    correspondant: { prenom: 'K.', nom: 'Assamoi' },
    affectes: TOUS_INDICATEURS,
    profil: { perf: 0.72, debut: 1, trous: [], n1: 0.63 },
  },
  {
    code: 'GS2E_SDRM', libelle: 'GS2E — SDRM', entiteJuridique: 'GS2E', ordre: 2,
    correspondant: { prenom: 'H.', nom: 'M.' },
    attributAdministrateur: true,
    // Ne porte ni QCI, ni TCI, ni RECO_CA : 4 indicateurs seulement.
    affectes: ['PCI', 'CARTO', 'AMR', 'RECO_SEM'],
    profil: { perf: 0.70, debut: 1, trous: [], n1: 0.60 },
  },
  {
    code: 'CIE', libelle: 'CIE', entiteJuridique: 'CIE', ordre: 3,
    correspondant: { prenom: 'A.', nom: 'Koffi' },
    affectes: TOUS_INDICATEURS,
    // Surperformance au-delà de 100 % sur RECO_SEM à compter de juin (RG-12).
    profil: { perf: 0.93, debut: 1, trous: [], n1: 0.86, sur: ['RECO_SEM'] },
  },
  {
    code: 'SODECI', libelle: 'SODECI', entiteJuridique: 'SODECI', ordre: 4,
    correspondant: { prenom: 'M.', nom: 'Diomandé' },
    affectes: TOUS_INDICATEURS,
    // Creux au T2, et période de mai rouverte.
    profil: { perf: 0.84, debut: 1, trous: [], n1: 0.79, creux: [4, 5, 6] },
  },
  {
    code: 'KEKELI', libelle: 'KEKELI', entiteJuridique: 'KEKELI', ordre: 5,
    correspondant: { prenom: 'B.', nom: 'Ouattara' },
    affectes: TOUS_INDICATEURS,
    // Dénominateur nul sur TCI en janvier et février (RG-13).
    profil: { perf: 0.66, debut: 1, trous: [], n1: 0.58, denZero: { TCI: [1, 2] } },
  },
  {
    code: 'CIPREL', libelle: 'CIPREL', entiteJuridique: 'CIPREL', ordre: 6,
    correspondant: { prenom: 'S.', nom: "N'Guessan" },
    affectes: TOUS_INDICATEURS,
    profil: { perf: 0.74, debut: 1, trous: [], n1: 0.71 },
  },
  {
    code: 'ATINKOU', libelle: 'ATINKOU', entiteJuridique: 'ATINKOU', ordre: 7,
    correspondant: { prenom: 'R.', nom: 'Bamba' },
    affectes: TOUS_INDICATEURS,
    // Premières saisies en mars, et période de mars rouverte.
    profil: { perf: 0.61, debut: 3, trous: [], n1: 0.52 },
  },
  {
    code: 'ASOKH', libelle: 'ASOKH', entiteJuridique: 'ASOKH', ordre: 8,
    correspondant: { prenom: 'L.', nom: 'Traoré' },
    affectes: TOUS_INDICATEURS,
    // Trou en mai : courbe interrompue, aucune interpolation (RG-32).
    profil: { perf: 0.69, debut: 1, trous: [5], n1: 0.64 },
  },
  {
    code: 'SDER', libelle: 'SDER', entiteJuridique: 'SDER', ordre: 9,
    correspondant: { prenom: 'P.', nom: 'Yao' },
    affectes: TOUS_INDICATEURS,
    // Objectif AMR atteint puis reperdu.
    profil: { perf: 0.47, debut: 1, trous: [], n1: 0.44, reperdu: 'AMR' },
  },
  {
    code: 'OMILAYE', libelle: 'OMILAYE', entiteJuridique: 'OMILAYE', ordre: 10,
    correspondant: { prenom: 'F.', nom: 'Kouassi' },
    affectes: TOUS_INDICATEURS,
    // Non saisie en août, et objectif dérogatoire à 80 % sur PCI au titre du
    // seul exercice 2026 — l'objectif 2025 reste à 100 %, ce qui déclenche
    // RG-28 bis en comparaison N-1.
    profil: { perf: 0.44, debut: 1, trous: [8], n1: 0.41, objSpec: { PCI: 0.8 } },
  },
  {
    code: 'AWALE', libelle: 'AWALE', entiteJuridique: 'AWALE', ordre: 11,
    correspondant: { prenom: 'D.', nom: 'Coulibaly' },
    affectes: TOUS_INDICATEURS,
    // Aucun historique N-1 : la comparaison est désactivée (RG-28 ter).
    profil: { perf: 0.58, debut: 4, trous: [], n1: null },
  },
  {
    code: 'SMART_ENERGY', libelle: 'SMART ENERGY', entiteJuridique: 'SMART ENERGY', ordre: 12,
    correspondant: { prenom: 'N.', nom: 'Aké' },
    affectes: TOUS_INDICATEURS,
    profil: { perf: 0.88, debut: 1, trous: [], n1: 0.81 },
  },
] as const;

export const filialeParCode = (code: string): Filiale => {
  const trouve = FILIALES.find((f) => f.code === code);
  if (!trouve) throw new Error(`Filiale inconnue : ${code}`);
  return trouve;
};

/**
 * Objectif applicable à une affectation : l'objectif dérogatoire de la filiale
 * s'il existe pour cet exercice, sinon l'objectif groupe.
 */
export const objectifDe = (
  filiale: Filiale,
  indicateur: Indicateur,
  annee: number,
): number =>
  (annee === EXERCICE_COURANT ? filiale.profil.objSpec?.[indicateur.code] : undefined)
  ?? indicateur.objectif;

/* ------------------------------------------------------------------ */
/*  Brouillons — liste canonique                                       */
/* ------------------------------------------------------------------ */

/**
 * Les 7 brouillons du jeu de démonstration.
 *
 * Un brouillon porte des valeurs mais AUCUN commentaire de saisie. Sa valeur
 * s'affiche et alimente les calculs, mais il n'est pas compté comme renseigné
 * (RG-37 ter). C'est la SEULE source de mois partiel.
 */
export interface Brouillon {
  readonly filiale: string;
  readonly exercice: number;
  readonly mois: number;
  readonly indicateurs: readonly CodeIndicateur[];
}

export const BROUILLONS: readonly Brouillon[] = [
  { filiale: 'CIPREL', exercice: 2026, mois: 6, indicateurs: ['QCI', 'TCI'] },
  { filiale: 'KEKELI', exercice: 2026, mois: 7, indicateurs: ['RECO_CA'] },
  { filiale: 'GS2E_SDCI', exercice: 2026, mois: 8, indicateurs: ['CARTO', 'QCI', 'RECO_SEM'] },
  { filiale: 'SODECI', exercice: 2026, mois: 8, indicateurs: ['TCI', 'RECO_CA'] },
  { filiale: 'SMART_ENERGY', exercice: 2026, mois: 8, indicateurs: ['RECO_CA'] },
  { filiale: 'SDER', exercice: 2026, mois: 8, indicateurs: ['PCI', 'CARTO', 'AMR', 'QCI'] },
  { filiale: 'CIE', exercice: 2025, mois: 11, indicateurs: ['TCI'] },
] as const;

/** Vrai si cette saisie doit être chargée en brouillon. */
export const estBrouillonAttendu = (
  filialeCode: string,
  indicateurCode: string,
  mois: number,
  exercice: number,
): boolean =>
  BROUILLONS.some(
    (b) =>
      b.filiale === filialeCode &&
      b.exercice === exercice &&
      b.mois === mois &&
      (b.indicateurs as readonly string[]).includes(indicateurCode),
  );

/* ------------------------------------------------------------------ */
/*  Réouvertures de période                                            */
/* ------------------------------------------------------------------ */

/**
 * Les 2 réouvertures du jeu de démonstration. Une période rouverte porte un
 * état visuel DISTINCT de « ouverte » et de « close » (RG-31 ter).
 * Le motif est obligatoire et l'action journalisée (M5a).
 */
export interface Reouverture {
  readonly filiale: string;
  readonly exercice: number;
  readonly mois: number;
  readonly motif: string;
  /** Horodatage de la décision. Abidjan est à UTC+0 sans heure d'été :
   *  l'heure locale et l'heure UTC coïncident toute l'année. */
  readonly ouvertLe: string;
}

export const REOUVERTURES: readonly Reouverture[] = [
  {
    filiale: 'SODECI', exercice: 2026, mois: 5,
    motif:
      'Erreur de dénominateur signalée par le correspondant : le périmètre des '
      + 'activités planifiées avait été sous-estimé de quatre unités.',
    ouvertLe: '2026-06-22T09:00:00Z',
  },
  {
    filiale: 'ATINKOU', exercice: 2026, mois: 3,
    motif:
      'Première remontée de la filiale après intégration au dispositif. Délai '
      + 'supplémentaire accordé pour la saisie initiale.',
    ouvertLe: '2026-04-18T09:00:00Z',
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Commentaires de saisie                                             */
/* ------------------------------------------------------------------ */

/**
 * Trois variantes de commentaire par indicateur. Le commentaire de saisie est
 * OBLIGATOIRE pour qu'un indicateur soit renseigné (D8, RG-37 bis) : le jeu de
 * démonstration en pose donc un sur toute saisie qui n'est pas un brouillon.
 */
export const COMMENTAIRES: Readonly<Record<CodeIndicateur, readonly string[]>> = {
  PCI: [
    'Poursuite du déploiement du plan. Les activités du mois ont été menées conformément au calendrier validé.',
    'Deux activités reportées faute de disponibilité des équipes opérationnelles. Rattrapage engagé sur le mois suivant.',
    'Les activités portant sur le processus achats ont été clôturées. Avancement conforme à la trajectoire.',
  ],
  CARTO: [
    'Mise à jour de la cartographie du processus exploitation achevée et validée en comité de direction.',
    'Atelier de revue des risques tenu avec les métiers. La formalisation reste à finaliser sur deux processus.',
    'Aucune nouvelle cartographie clôturée ce mois. Les travaux sur le processus trésorerie se poursuivent.',
  ],
  AMR: [
    'Traitement des actions de niveau 1 achevé sur le périmètre exploitation. Les niveaux 2 progressent.',
    'Le périmètre a été élargi par de nouvelles recommandations, ce qui ralentit mécaniquement le taux.',
    'Trois actions clôturées à 100 % et documentées. Les preuves ont été versées au dossier.',
  ],
  QCI: [
    'Questionnaires administrés auprès des directions opérationnelles. Dépouillement en cours.',
    'Campagne décalée en raison de l\'indisponibilité de deux directions. Reprogrammation actée.',
    'Taux de retour satisfaisant sur la campagne du mois. Les écarts relevés alimentent le plan d\'action.',
  ],
  TCI: [
    'Tests réalisés sur les contrôles clés du cycle achats. Conclusions consignées dans le rapport joint.',
    'Deux tests planifiés n\'ont pu être menés, les pièces justificatives n\'étant pas disponibles.',
    'L\'ensemble des tests du mois a été exécuté. Aucun contrôle clé défaillant n\'a été identifié.',
  ],
  RECO_SEM: [
    'Recommandations du séminaire annuel traitées à 100 % sur le volet organisation.',
    'Avancement soutenu. Les recommandations restantes dépendent d\'arbitrages en cours à la direction générale.',
    'Deux recommandations supplémentaires ont été clôturées et validées par le référent contrôle interne.',
  ],
  RECO_CA: [
    'Suivi des recommandations du comité d\'audit. Les échéances du trimestre ont été tenues.',
    'Une recommandation reste ouverte dans l\'attente de la refonte du référentiel de délégation.',
    'Clôture de la recommandation relative à la séparation des tâches, preuve à l\'appui.',
  ],
};

/** Commentaire posé sur une saisie à dénominateur nul : il explique
 *  explicitement que la valeur n'est pas assimilée à 0 % (RG-13). */
export const COMMENTAIRE_DEN_ZERO =
  'Aucun test n\'était planifié sur la période. Le dénominateur est nul : la '
  + 'valeur est non calculable et exclue des moyennes, elle n\'est pas '
  + 'assimilée à 0 %.';

/* ------------------------------------------------------------------ */
/*  Comptes du jeu de démonstration                                    */
/* ------------------------------------------------------------------ */

/**
 * Comptes non rattachés à une filiale : Directeur, Lecteur, Administrateur pur.
 * Les 12 correspondants sont dérivés de `FILIALES`.
 *
 * Le domaine `demo.local` est réservé et non routable : aucune adresse réelle
 * du groupe ERANOVE n'est écrite dans le dépôt.
 */
export const COMPTES_HORS_FILIALE = [
  {
    email: 'directeur@demo.local', prenom: 'Le', nom: 'Directeur CI Groupe',
    role: 'DIRECTEUR_CI_GROUPE' as const, attributAdministrateur: true,
  },
  {
    email: 'lecteur@demo.local', prenom: 'Un', nom: 'Lecteur',
    role: 'LECTEUR' as const, attributAdministrateur: false,
  },
  {
    email: 'admin@demo.local', prenom: 'Un', nom: 'Administrateur',
    role: 'ADMINISTRATEUR' as const, attributAdministrateur: true,
  },
] as const;

/** Adresse du correspondant d'une filiale. */
export const emailCorrespondant = (filialeCode: string): string =>
  `correspondant.${filialeCode.toLowerCase().replace(/_/g, '-')}@demo.local`;

/**
 * Empreinte provisoire posée par le chargement. Aucun compte n'est connectable
 * avant l'étape 4.5, qui remplacera cette chaîne par de vrais hachages
 * Argon2id.
 */
export const HACHAGE_PROVISOIRE = 'A_DEFINIR_ETAPE_4_5';

/* ------------------------------------------------------------------ */
/*  Fils de commentaires                                               */
/* ------------------------------------------------------------------ */

/**
 * Un message d'un fil de commentaires.
 *
 * Un message porte son auteur, son rôle et son horodatage, et n'est ni
 * modifiable ni supprimable une fois publié : le fil est une trace d'échange
 * dans un dispositif de contrôle interne, sa mutabilité en détruirait la valeur
 * probante (RG-42).
 *
 * `auteur` désigne un rôle, pas une personne : `DIRECTEUR` résout vers le
 * Directeur CI Groupe, `CORRESPONDANT` vers le correspondant de la filiale du
 * fil. Le cloisonnement par filiale en découle mécaniquement (M1, RG-43,
 * RG-45).
 */
export interface MessageFil {
  readonly auteur: 'DIRECTEUR' | 'CORRESPONDANT';
  /** Abidjan est à UTC+0 sans heure d'été : l'heure locale est l'heure UTC. */
  readonly publieLe: string;
  readonly corps: string;
}

/**
 * Fil de commentaires : un fil par filiale × indicateur × exercice (M2,
 * RG-41) — exactement la clé de `affectation`, ce qui rend le cloisonnement
 * structurel plutôt que déclaratif.
 *
 * Porté à l'identique de la table `FILS` de la maquette V5. Sept fils, quatorze
 * messages. Chacun documente un cas limite du jeu de démonstration, ce qui
 * rend la démonstration lisible : le Directeur qui ouvre un fil y trouve
 * l'explication du chiffre qu'il vient de voir.
 */
export interface FilCommentaires {
  readonly filiale: string;
  readonly indicateur: CodeIndicateur;
  readonly exercice: number;
  readonly messages: readonly MessageFil[];
}

export const FILS_COMMENTAIRES: readonly FilCommentaires[] = [
  {
    // Le cas des trois échanges exigé par le cahier des charges : objectif
    // atteint en avril puis reperdu, parce que le dénominateur a grossi.
    filiale: 'SDER', indicateur: 'AMR', exercice: 2026,
    messages: [
      {
        auteur: 'DIRECTEUR', publieLe: '2026-06-12T09:14:00Z',
        corps:
          "Le taux repasse sous l'objectif depuis juin alors qu'il était atteint "
          + 'en avril. Le dénominateur a-t-il augmenté à la suite du comité de mai ?',
      },
      {
        auteur: 'CORRESPONDANT', publieLe: '2026-06-13T15:02:00Z',
        corps:
          'Confirmé : quatre recommandations supplémentaires ont été émises. Le '
          + 'numérateur progresse mais moins vite que le périmètre. Un plan de '
          + 'rattrapage est engagé sur le troisième trimestre.',
      },
      {
        auteur: 'DIRECTEUR', publieLe: '2026-06-14T08:40:00Z',
        corps:
          'Bien noté. Merci de joindre le plan de rattrapage à la saisie de '
          + 'juillet, avec les échéances par action.',
      },
    ],
  },
  {
    // Objectif dérogatoire : l'avertissement en clair exigé par RG-24 bis
    // existe donc aussi sous forme de trace écrite.
    filiale: 'OMILAYE', indicateur: 'PCI', exercice: 2026,
    messages: [
      {
        auteur: 'DIRECTEUR', publieLe: '2026-03-03T11:25:00Z',
        corps:
          "Objectif spécifique abaissé à 80 % pour l'exercice 2026, compte tenu "
          + 'de la mise en place récente du dispositif de contrôle interne sur '
          + 'cette entité.',
      },
      {
        auteur: 'CORRESPONDANT', publieLe: '2026-03-03T16:48:00Z',
        corps:
          'Bien reçu. La trajectoire est bâtie sur cette cible ; un retour à '
          + "l'objectif groupe est visé à compter de 2027.",
      },
    ],
  },
  {
    // Absence de saisie en août, relancée avant la clôture du 10 septembre.
    filiale: 'OMILAYE', indicateur: 'CARTO', exercice: 2026,
    messages: [
      {
        auteur: 'DIRECTEUR', publieLe: '2026-09-09T07:55:00Z',
        corps:
          "Le mois d'août n'est pas remonté et la période se clôture demain. "
          + 'Merci de régulariser avant le délai.',
      },
    ],
  },
  {
    // Surperformance au-delà de 100 %, assumée sans plafonnement (RG-12).
    filiale: 'CIE', indicateur: 'RECO_SEM', exercice: 2026,
    messages: [
      {
        auteur: 'DIRECTEUR', publieLe: '2026-07-08T10:30:00Z',
        corps:
          "Le taux dépasse 100 %. Aucun plafonnement n'est appliqué, mais je "
          + "souhaite m'assurer de la cohérence entre le numérateur et le "
          + 'dénominateur retenus.',
      },
      {
        auteur: 'CORRESPONDANT', publieLe: '2026-07-08T14:12:00Z',
        corps:
          'Des recommandations issues du séminaire 2025 ont été clôturées cette '
          + 'année et comptabilisées au numérateur, alors que le dénominateur ne '
          + 'porte que les recommandations 2026. Je propose de rebaser le '
          + "dénominateur à l'ouverture de l'exercice 2027.",
      },
    ],
  },
  {
    // Dénominateur nul : la trace écrite dit explicitement que la valeur n'est
    // pas assimilée à 0 % (RG-13).
    filiale: 'KEKELI', indicateur: 'TCI', exercice: 2026,
    messages: [
      {
        auteur: 'CORRESPONDANT', publieLe: '2026-02-06T09:05:00Z',
        corps:
          "Aucun test n'était planifié en janvier ni en février, le programme "
          + 'démarrant en mars. Les saisies sont donc à dénominateur nul.',
      },
      {
        auteur: 'DIRECTEUR', publieLe: '2026-02-07T08:20:00Z',
        corps:
          'Traitement conforme : le taux est non calculable et exclu des '
          + "moyennes, il n'est pas compté comme 0 %.",
      },
    ],
  },
  {
    // Trou de mai : la courbe est interrompue, aucune valeur reportée (RG-32).
    filiale: 'ASOKH', indicateur: 'PCI', exercice: 2026,
    messages: [
      {
        auteur: 'DIRECTEUR', publieLe: '2026-06-15T09:10:00Z',
        corps:
          "Le mois de mai est absent pour l'ensemble de vos indicateurs. La "
          + "courbe est interrompue et aucune valeur n'est reportée. Merci "
          + "d'indiquer la cause.",
      },
      {
        auteur: 'CORRESPONDANT', publieLe: '2026-06-16T11:33:00Z',
        corps:
          'Absence du référent contrôle interne sur la période de saisie. Une '
          + 'demande de réouverture de la période sera adressée.',
      },
    ],
  },
  {
    // Creux du deuxième trimestre.
    filiale: 'SODECI', indicateur: 'PCI', exercice: 2026,
    messages: [
      {
        auteur: 'DIRECTEUR', publieLe: '2026-06-20T16:05:00Z',
        corps:
          "Le creux du deuxième trimestre est marqué sur l'ensemble de vos "
          + 'indicateurs. Est-ce imputable au dénominateur ou à un ralentissement '
          + 'réel des travaux ?',
      },
      {
        auteur: 'CORRESPONDANT', publieLe: '2026-06-21T09:47:00Z',
        corps:
          'Ralentissement réel, lié à la mobilisation des équipes sur le '
          + 'déploiement du nouveau système d\'exploitation. Le redressement est '
          + 'amorcé depuis juillet.',
      },
    ],
  },
] as const;
