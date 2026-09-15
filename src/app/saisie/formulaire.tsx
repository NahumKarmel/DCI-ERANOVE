'use client';

/**
 * Formulaire de saisie mensuelle. Porté de la maquette V2.
 *
 * Composant client pour une seule raison : le TAUX S'AFFICHE EN TEMPS RÉEL
 * pendant la frappe. Il est calculé par `taux()`, la même fonction pure que le
 * serveur et la recette — il n'est jamais stocké, et l'écran ne recalcule rien
 * à sa façon.
 */

import Link from 'next/link';
import { useActionState, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { taux } from '@/lib/calculs/taux';
import type { EtatPeriode } from '@/lib/calculs/periode';
import {
  ATTRIBUT_ACCEPT,
  LIBELLE_FORMATS,
  TAILLE_MAXIMALE_MO,
} from '@/lib/storage/formats';

import {
  enregistrerSaisie,
  joindreJustificatif,
  type EtatSaisie,
} from './actions';
import styles from './saisie.module.css';

export interface LigneSaisie {
  readonly affectationId: number;
  readonly code: string;
  readonly libelle: string;
  readonly ordre: number;
  /** Objectif applicable, porté par l'affectation. En fraction. */
  readonly objectif: number;
  /** Objectif groupe de l'indicateur. En fraction. */
  readonly objectifGroupe: number;
  /** Déduit de l'écart entre les deux — jamais un attribut stocké. */
  readonly derogatoire: boolean;
  readonly numerateur: number | null;
  readonly denominateur: number | null;
  readonly commentaireSaisie: string | null;
  readonly justificatifs: readonly { nomOriginal: string; tailleOctets: number }[];
}

interface Props {
  readonly exercice: number;
  readonly mois: number;
  readonly moisLibelle: string;
  readonly dernierMoisOuvert: number;
  readonly etat: EtatPeriode;
  readonly modifiable: boolean;
  readonly motifReouverture: string | null;
  readonly fermeLeISO: string;
  readonly joursRestants: number | null;
  readonly surDateDeReference: boolean;
  readonly instantISO: string;
  readonly filialeLibelle: string;
  readonly correspondant: string;
  readonly lignes: readonly LigneSaisie[];
  readonly modeDemo: boolean;
  readonly className?: string;
}

const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

/**
 * Identifiant du formulaire de saisie.
 *
 * POURQUOI IL EXISTE. Chaque carte porte deux formulaires de nature différente :
 * la saisie des valeurs, commune à tous les indicateurs, et le dépôt d'un
 * justificatif, propre à un indicateur et porteur d'un fichier. Les imbriquer
 * serait du HTML invalide — le navigateur supprime alors purement et simplement
 * le formulaire intérieur, et le dépôt ne part jamais.
 *
 * Les champs de saisie sont donc rattachés au formulaire par l'attribut `form`,
 * ce qui les autorise à vivre en dehors de sa balise. Les formulaires de dépôt
 * restent indépendants, et chacun s'envoie seul.
 */
const FORMULAIRE_SAISIE = 'formulaire-saisie';

/** Un taux se formate en pourcentage à l'affichage seulement. */
const pourcent = (valeur: number, decimales = 1): string =>
  `${(valeur * 100).toFixed(decimales).replace('.', ',')} %`;

const dateLisible = (iso: string): string =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Africa/Abidjan',
  }).format(new Date(iso));

/** Valeurs en cours de frappe, par affectation. */
type Brouillon = Record<number, { num: string; den: string; com: string }>;

function valeursInitiales(lignes: readonly LigneSaisie[]): Brouillon {
  const depart: Brouillon = {};
  for (const l of lignes) {
    depart[l.affectationId] = {
      num: l.numerateur === null ? '' : String(l.numerateur),
      den: l.denominateur === null ? '' : String(l.denominateur),
      com: l.commentaireSaisie ?? '',
    };
  }
  return depart;
}

/** Libellé et couleur de l'état de la saisie d'un indicateur. */
function etiquette(
  valeur: number | null,
  vide: boolean,
  objectif: number,
): { libelle: string; classe: string } {
  if (vide) return { libelle: 'Non renseigné', classe: styles.badgeNeutre };
  if (valeur === null) return { libelle: 'Non calculable', classe: styles.badgeNeutre };
  // Aucun plafonnement : au-delà de 100 %, on parle de surperformance (RG-12).
  if (valeur > 1) return { libelle: 'Surperformance', classe: styles.badgeBleu };
  return valeur >= objectif
    ? { libelle: 'Objectif atteint', classe: styles.badgeVert }
    : { libelle: 'En cours', classe: styles.badgeAmbre };
}

function BoutonEnregistrer({ actif }: { actif: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      form={FORMULAIRE_SAISIE}
      className={styles.boutonPrincipal}
      disabled={!actif || pending}
    >
      {pending ? 'Enregistrement…' : 'Enregistrer la saisie'}
    </button>
  );
}

function BoutonJoindre() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.boutonSecondaire} disabled={pending}>
      {pending ? 'Dépôt…' : 'Déposer'}
    </button>
  );
}

/** Dépôt d'un justificatif : formulaire distinct, car il porte un fichier. */
function Justificatif({
  ligne,
  mois,
  modifiable,
}: {
  ligne: LigneSaisie;
  mois: number;
  modifiable: boolean;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [etat, action] = useActionState<EtatSaisie, FormData>(joindreJustificatif, {});

  return (
    <div className={styles.zoneJustificatif}>
      <button
        type="button"
        className={styles.bascule}
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
      >
        {ouvert ? '▾' : '▸'} Justificatif (facultatif)
        {ligne.justificatifs.length > 0 && (
          <span className={styles.compteur}>{ligne.justificatifs.length}</span>
        )}
      </button>

      {ouvert && (
        <div className={styles.deposeJustificatif}>
          {ligne.justificatifs.length > 0 && (
            <ul className={styles.listeJustificatifs}>
              {ligne.justificatifs.map((j) => (
                <li key={j.nomOriginal}>
                  {j.nomOriginal}
                  <span className={styles.taille}>
                    {(j.tailleOctets / 1_048_576).toFixed(1).replace('.', ',')} Mo
                  </span>
                </li>
              ))}
            </ul>
          )}

          {modifiable ? (
            <form action={action} className={styles.formulaireFichier}>
              <input type="hidden" name="affectationId" value={ligne.affectationId} />
              <input type="hidden" name="mois" value={mois} />
              <input
                type="file"
                name="fichier"
                accept={ATTRIBUT_ACCEPT}
                className={styles.champFichier}
                required
              />
              <BoutonJoindre />
            </form>
          ) : (
            <p className={styles.noteDiscrete}>
              Période non modifiable : aucun justificatif ne peut être ajouté.
            </p>
          )}

          <p className={styles.noteDiscrete}>
            {LIBELLE_FORMATS} — {TAILLE_MAXIMALE_MO} Mo maximum.
            <strong> Facultatif — n’empêche jamais l’enregistrement.</strong>
          </p>

          {etat.erreur && <p className={styles.erreurEnLigne} role="alert">{etat.erreur}</p>}
          {etat.message && <p className={styles.succesEnLigne}>{etat.message}</p>}
        </div>
      )}
    </div>
  );
}

export function Formulaire(props: Props) {
  const {
    exercice, mois, moisLibelle, dernierMoisOuvert, etat, modifiable,
    motifReouverture, fermeLeISO, joursRestants, surDateDeReference, instantISO,
    filialeLibelle, correspondant, lignes, modeDemo, className,
  } = props;

  const [valeurs, setValeurs] = useState<Brouillon>(() => valeursInitiales(lignes));
  const [etatAction, action] = useActionState<EtatSaisie, FormData>(enregistrerSaisie, {});

  const majuscule = (id: number, champ: 'num' | 'den' | 'com', valeur: string) =>
    setValeurs((v) => ({ ...v, [id]: { ...v[id], [champ]: valeur } }));

  /**
   * Complétude : un indicateur n'est RENSEIGNÉ que si numérateur, dénominateur
   * ET commentaire sont fournis (RG-37 bis). Un brouillon ne compte pas.
   */
  const renseignes = useMemo(
    () =>
      lignes.filter((l) => {
        const v = valeurs[l.affectationId];
        return v.num.trim() !== '' && v.den.trim() !== '' && v.com.trim() !== '';
      }).length,
    [lignes, valeurs],
  );

  return (
    <main className={className}>
      <header className={styles.entete}>
        <div>
          <h1 className={styles.titre}>Saisie mensuelle</h1>
          <p className={styles.sousTitre}>
            {filialeLibelle} · {correspondant} · exercice {exercice}
          </p>
        </div>
        <Link href="/" className={styles.retour}>Accueil</Link>
      </header>

      {modeDemo && (
        <p className={styles.bandeau}>Données fictives — démonstration</p>
      )}

      <section className={styles.barre}>
        <div className={styles.blocMois}>
          <span className={styles.etiquetteBloc}>Mois</span>
          {/* La navigation est en lien et non en sélecteur : le mois est dans
              l'URL, donc partageable et rechargeable sans perdre l'état. */}
          <div className={styles.moisListe}>
            {MOIS.map((libelle, index) => {
              const numero = index + 1;
              const ouvrable = numero <= dernierMoisOuvert;
              if (!ouvrable) {
                return (
                  <span key={libelle} className={styles.moisInactif} title="Période non ouverte">
                    {libelle.slice(0, 3)}
                  </span>
                );
              }
              return (
                <Link
                  key={libelle}
                  href={`/saisie?mois=${numero}`}
                  className={numero === mois ? styles.moisActif : styles.moisLien}
                >
                  {libelle.slice(0, 3)}
                </Link>
              );
            })}
          </div>
        </div>

        <div className={styles.blocEtat}>
          {etat === 'OUVERTE' && (
            <div className={styles.etatOuverte}>
              <strong>Période ouverte</strong> — la saisie de {moisLibelle.toLowerCase()} est
              possible jusqu’au {dateLisible(fermeLeISO)} à 23h59, heure d’Abidjan.
              {joursRestants !== null && (
                <> <strong>{joursRestants} jour{joursRestants > 1 ? 's' : ''} restant{joursRestants > 1 ? 's' : ''}.</strong></>
              )}
            </div>
          )}
          {etat === 'CLOSE' && (
            <div className={styles.etatClose}>
              <strong>Période close</strong> — {moisLibelle.toLowerCase()} {exercice} est
              verrouillé. Consultation seule. Seul le Directeur CI Groupe peut rouvrir
              cette période.
            </div>
          )}
          {etat === 'NON_OUVERTE' && (
            <div className={styles.etatNonOuverte}>
              <strong>Période non ouverte</strong> — {moisLibelle.toLowerCase()} {exercice} ne
              sera saisissable qu’à partir du 1<sup>er</sup> du mois suivant. Aucune saisie
              anticipée n’est possible.
            </div>
          )}
          {/* RG-31 ter : trois états, trois rendus. Le violet est la couleur de
              la période rouverte dans toute l'application. */}
          {etat === 'ROUVERTE' && (
            <div className={styles.etatRouverte}>
              <strong>Période rouverte</strong> — {moisLibelle.toLowerCase()} {exercice} était
              close et a été rouverte par le Directeur CI Groupe. La saisie est de nouveau
              possible.
              {motifReouverture && (
                <span className={styles.motif}>Motif : {motifReouverture}</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.blocCompletude}>
          <span className={styles.etiquetteBloc}>Complétude</span>
          <div className={styles.jauge}>
            <div
              className={renseignes === lignes.length ? styles.jaugePleine : styles.jaugePartielle}
              style={{ width: `${lignes.length ? (renseignes / lignes.length) * 100 : 0}%` }}
            />
          </div>
          <span className={styles.compte}>{renseignes} / {lignes.length}</span>
          {lignes.length < 7 && (
            <span className={styles.noteDiscrete}>
              {7 - lignes.length} indicateur{7 - lignes.length > 1 ? 's' : ''} non
              affecté{7 - lignes.length > 1 ? 's' : ''} à cette filiale
            </span>
          )}
        </div>
      </section>

      {surDateDeReference && (
        <p className={styles.avertissementHorloge}>
          <strong>Démonstration</strong> — l’application est placée au{' '}
          {dateLisible(instantISO)} pour que la période d’août {exercice} soit ouverte.
          En production, l’horloge réelle s’applique.
        </p>
      )}

      {etatAction.erreur && <p className={styles.erreur} role="alert">{etatAction.erreur}</p>}
      {etatAction.message && <p className={styles.succes} role="status">{etatAction.message}</p>}

      {/* Le formulaire ne contient que son champ caché : les champs de saisie
          lui sont rattachés par leur attribut `form`, de sorte que les
          formulaires de dépôt de justificatif ne soient jamais imbriqués. */}
      <form id={FORMULAIRE_SAISIE} action={action}>
        <input type="hidden" name="mois" value={mois} />
      </form>

      <div className={styles.cartes}>
          {lignes.map((ligne) => {
            const v = valeurs[ligne.affectationId];
            const numVide = v.num.trim() === '';
            const denVide = v.den.trim() === '';
            const vide = numVide && denVide;
            const valeurTaux = vide
              ? null
              : taux(numVide ? null : Number(v.num), denVide ? null : Number(v.den));
            const nonCalculable = !vide && valeurTaux === null;
            const badge = etiquette(valeurTaux, vide, ligne.objectif);
            // Brouillon : valeurs fournies, commentaire manquant (RG-37 ter).
            const brouillon = !numVide && !denVide && v.com.trim() === '';

            return (
              <section
                key={ligne.affectationId}
                className={ligne.derogatoire ? styles.carteDerogatoire : styles.carte}
              >
                <div className={styles.carteEntete}>
                  <span className={styles.numero}>{ligne.ordre}</span>
                  <div className={styles.carteTitre}>
                    <span className={styles.libelle}>{ligne.libelle}</span>
                    <span className={styles.cumul}>CUMUL DEPUIS LE 1<sup>er</sup> JANVIER</span>
                  </div>
                  <span className={badge.classe}>{badge.libelle}</span>
                </div>

                {/* ------------------------------------------------------------
                    RG-24 bis — objectif dérogatoire : TROIS SIGNAUX CONJOINTS.
                    Un marquage seul est insuffisant.
                      1. marquage visuel  : bordure et bandeau ambre (voir la
                         classe carteDerogatoire) ;
                      2. rappel de l'objectif groupe À PROXIMITÉ : dans le bloc
                         des métriques, juste sous l'objectif applicable ;
                      3. avertissement EN CLAIR : le texte ci-dessous.
                    ------------------------------------------------------------ */}
                {ligne.derogatoire && (
                  <p className={styles.avertissementDerogation}>
                    <strong>Objectif dérogatoire</strong> — cet indicateur est évalué contre un
                    objectif de {pourcent(ligne.objectif, 0)} au titre de l’exercice {exercice},
                    et non contre l’objectif groupe de {pourcent(ligne.objectifGroupe, 0)}.
                    L’écart n’est ni masqué ni proratisé : la comparaison avec les autres
                    filiales doit en tenir compte.
                  </p>
                )}

                <div className={styles.ligneChamps}>
                  <label className={styles.champ}>
                    <span className={styles.etiquetteChamp}>Numérateur</span>
                    <input
                      name={`num_${ligne.affectationId}`}
                      form={FORMULAIRE_SAISIE}
                      value={v.num}
                      onChange={(e) => majuscule(ligne.affectationId, 'num', e.target.value)}
                      disabled={!modifiable}
                      inputMode="numeric"
                      pattern="\d*"
                      className={styles.saisieNombre}
                    />
                  </label>
                  <span className={styles.barreOblique}>/</span>
                  <label className={styles.champ}>
                    <span className={styles.etiquetteChamp}>Dénominateur</span>
                    <input
                      name={`den_${ligne.affectationId}`}
                      form={FORMULAIRE_SAISIE}
                      value={v.den}
                      onChange={(e) => majuscule(ligne.affectationId, 'den', e.target.value)}
                      disabled={!modifiable}
                      inputMode="numeric"
                      pattern="\d*"
                      className={styles.saisieNombre}
                    />
                  </label>

                  <div className={styles.metriques}>
                    <div className={styles.metrique}>
                      <span className={styles.etiquetteChamp}>Taux calculé</span>
                      <strong className={styles.valeurTaux}>
                        {vide ? '—' : valeurTaux === null ? 'n/a' : pourcent(valeurTaux)}
                      </strong>
                    </div>
                    <div className={styles.metrique}>
                      <span className={styles.etiquetteChamp}>Objectif</span>
                      <strong>{pourcent(ligne.objectif, 0)}</strong>
                      {/* Signal 2 de RG-24 bis : le rappel est ICI, à proximité
                          immédiate de l'objectif appliqué. */}
                      {ligne.derogatoire && (
                        <span className={styles.rappelObjectifGroupe}>
                          objectif groupe : {pourcent(ligne.objectifGroupe, 0)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {nonCalculable && (
                  <p className={styles.noteNonCalculable}>
                    Dénominateur nul — le taux n’est pas calculable. La saisie est acceptée et
                    signifie qu’aucun objet n’était planifié. Cette valeur est{' '}
                    <strong>exclue des moyennes</strong>, elle n’est pas comptée comme 0 %.
                  </p>
                )}

                {valeurTaux !== null && valeurTaux > 1 && (
                  <p className={styles.noteSurperformance}>
                    Le taux dépasse 100 %. Aucun plafonnement n’est appliqué : la valeur réelle
                    est conservée.
                  </p>
                )}

                <div className={styles.blocCommentaire}>
                  <label className={styles.etiquetteChamp} htmlFor={`com_${ligne.affectationId}`}>
                    Commentaire de saisie
                    <span className={styles.marqueObligatoire}>OBLIGATOIRE</span>
                  </label>
                  <textarea
                    id={`com_${ligne.affectationId}`}
                    name={`com_${ligne.affectationId}`}
                    form={FORMULAIRE_SAISIE}
                    rows={2}
                    value={v.com}
                    onChange={(e) => majuscule(ligne.affectationId, 'com', e.target.value)}
                    disabled={!modifiable}
                    placeholder="Documenter la valeur du mois : contexte, écart à l’objectif, difficulté rencontrée…"
                    className={brouillon ? styles.zoneTexteAlerte : styles.zoneTexte}
                  />
                  {brouillon && (
                    <p className={styles.noteBrouillon}>
                      <strong>Brouillon</strong> — les valeurs sont saisies mais le commentaire
                      manque. Cet indicateur <strong>ne sera pas compté comme renseigné</strong>{' '}
                      dans le taux de remontée, bien que sa valeur s’affiche et alimente les
                      calculs.
                    </p>
                  )}
                </div>

                <Justificatif ligne={ligne} mois={mois} modifiable={modifiable} />
            </section>
          );
        })}
      </div>

      <div className={styles.barreAction}>
          <p className={styles.noteDiscrete}>
            L’enregistrement partiel est autorisé : vous pouvez revenir compléter votre saisie
            tant que la période reste ouverte. Chaque modification est tracée.
          </p>
        <BoutonEnregistrer actif={modifiable} />
      </div>
    </main>
  );
}
