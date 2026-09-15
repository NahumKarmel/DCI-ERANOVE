/**
 * Générateur déterministe du jeu de démonstration — UNIQUE et FIGÉ (RG-46 bis).
 *
 * Tous les écrans s'alimentent d'ici, via le chargement en base. Un chiffre qui
 * différerait d'un écran à l'autre détruirait la crédibilité de la
 * démonstration entière.
 *
 * Porté à l'identique de la fonction `serie()` des six maquettes validées du
 * Bloc 3, à une seule différence assumée : LE TAUX NE FAIT PAS PARTIE DU
 * RETOUR. Les maquettes exposaient le taux brut `t` à côté de `num` et `den` ;
 * l'application ne stocke jamais de taux et l'arbitrage T8.b a tranché que le
 * taux quantifié `numerateur / denominateur` fait foi. Exposer `t` créerait une
 * seconde source de vérité, dont l'écart d'arrondi est précisément ce qui avait
 * faussé deux des six repères.
 *
 * Ce fichier ne doit plus être modifié.
 *
 * DONNÉES ENTIÈREMENT FICTIVES.
 */

import {
  COMMENTAIRES,
  EXERCICE_COURANT,
  type CodeIndicateur,
  type Filiale,
  type Indicateur,
  derniersMoisDe,
} from './referentiel';

/**
 * Hachage FNV-1a 32 bits, normalisé dans [0, 1].
 *
 * `Math.imul` garantit la multiplication 32 bits, et `>>> 0` la lecture non
 * signée : le résultat est identique dans Node et dans un navigateur, ce qui
 * est la condition du déterminisme.
 */
export function hash(chaine: string): number {
  let h = 2166136261;
  for (let i = 0; i < chaine.length; i++) {
    h ^= chaine.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/**
 * Une saisie générée. Le taux est absent par construction : il se calcule à la
 * lecture, par `src/lib/calculs/taux.ts`.
 *
 * `denominateur` à 0 est légitime et porteur de sens : le taux est alors non
 * calculable, jamais 0 (RG-13).
 */
export interface SaisieGeneree {
  readonly mois: number;
  readonly numerateur: number;
  readonly denominateur: number;
}

/**
 * Série mensuelle d'une filiale sur un indicateur, pour un exercice.
 *
 * Retourne `null` quand la filiale n'a aucun historique sur cet exercice — cas
 * d'AWALE en 2025, qui désactive la comparaison N-1 (RG-28 ter).
 *
 * Les mois non saisis — antérieurs au premier mois de remontée, ou trous
 * déclarés — ne produisent AUCUNE ligne. L'absence de ligne est le trou
 * lui-même : aucun report, aucune interpolation (RG-32, M5b). La série est donc
 * creuse, et son indice ne vaut pas le mois : chaque élément porte son `mois`.
 *
 * Les cas limites ne s'appliquent qu'à l'exercice courant ; l'exercice
 * précédent reste régulier, ce qui rend la comparaison N-1 lisible.
 */
export function serie(
  filiale: Filiale,
  indicateur: Indicateur,
  annee: number,
): SaisieGeneree[] | null {
  const p = filiale.profil;
  const nMois = derniersMoisDe(annee);
  const courant = annee === EXERCICE_COURANT;
  const base = courant ? p.perf : p.n1;
  if (base === null || base === undefined) return null;

  const jitter = (hash(filiale.code + indicateur.code + annee) - 0.5) * 0.16;
  const cible = Math.max(0.12, Math.min(1.18, base + jitter));
  const sortie: SaisieGeneree[] = [];

  for (let m = 1; m <= nMois; m++) {
    // Trous : aucune ligne produite (RG-32).
    if (courant && m < p.debut) continue;
    if (courant && p.trous.includes(m)) continue;

    // Dénominateur nul : la ligne EXISTE, elle porte 0 / 0. Le taux sera non
    // calculable, et la saisie reste renseignée dès lors qu'elle porte un
    // commentaire (RG-13).
    if (courant && p.denZero?.[indicateur.code]?.includes(m)) {
      sortie.push({ mois: m, numerateur: 0, denominateur: 0 });
      continue;
    }

    const avance = m / nMois;
    let t = cible * (0.34 + 0.66 * avance);

    if (courant && p.creux?.includes(m)) t *= 0.72;

    // Surperformance : au-delà de 100 %, aucun plafonnement (RG-12).
    if (courant && p.sur?.includes(indicateur.code) && m >= 6) {
      t = Math.min(1.35, t * 1.32);
    }

    // Objectif atteint jusqu'en mai, puis reperdu et décroissant.
    if (courant && p.reperdu === indicateur.code) {
      t = m <= 5
        ? Math.max(t, indicateur.objectif + 0.04)
        : indicateur.objectif - 0.13 - 0.01 * m;
    }

    const den = Math.max(
      2,
      Math.round(4 + 9 * hash(filiale.code + indicateur.code + 'd') + m * 0.55),
    );
    sortie.push({
      mois: m,
      numerateur: Math.round(Math.max(0, t) * den),
      denominateur: den,
    });
  }

  return sortie;
}

/**
 * Commentaire de saisie, choisi de façon déterministe parmi les trois variantes
 * de l'indicateur. Stable d'un chargement à l'autre.
 */
export function commentaireDe(
  filialeCode: string,
  indicateurCode: CodeIndicateur,
  mois: number,
): string {
  const variantes = COMMENTAIRES[indicateurCode];
  return variantes[
    Math.floor(hash(filialeCode + indicateurCode + mois + 'c') * variantes.length)
      % variantes.length
  ];
}
