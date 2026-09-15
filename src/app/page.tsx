/**
 * Accueil PROVISOIRE.
 *
 * C'est ici que se fait la VÉRIFICATION RÉELLE de la session : le middleware ne
 * constate que la présence d'un cookie, jamais sa validité. Un cookie forgé ou
 * périmé franchit le middleware et échoue ici.
 *
 * L'orientation selon le rôle relève du lot F. Cet écran se borne à confirmer
 * l'identité, le rôle et le périmètre effectifs — ce qui suffit à vérifier à
 * l'œil que les habilitations sont bien celles attendues.
 */

import { redirect } from 'next/navigation';

import { seDeconnecter } from './connexion/actions';
import {
  peutAccederAuxDonnees,
  peutGererComptes,
  peutLireConsolidation,
  peutSaisir,
  utilisateurCourant,
} from '@/lib/auth';
import styles from './accueil.module.css';

const LIBELLE_ROLE: Record<string, string> = {
  CORRESPONDANT: 'Correspondant',
  DIRECTEUR_CI_GROUPE: 'Directeur CI Groupe',
  LECTEUR: 'Lecteur',
  ADMINISTRATEUR: 'Administrateur',
};

export default async function PageAccueil() {
  const courant = await utilisateurCourant();

  // Cookie absent, périmé, inconnu, ou compte désactivé.
  if (!courant) redirect('/connexion');

  // Le mot de passe provisoire doit être remplacé avant tout accès.
  if (courant.doitChangerMotDePasse) redirect('/changer-mot-de-passe');

  const modeDemo = process.env.MODE_DEMO === 'true';

  return (
    <main className={styles.page}>
      <div className={styles.carte}>
        <h1 className={styles.titre}>Tableau de bord du Contrôle Interne Groupe</h1>
        <p className={styles.identite}>
          {courant.prenom} {courant.nom} — {courant.email}
        </p>

        <table className={styles.tableau}>
          <tbody>
            <tr>
              <th scope="row">Rôle</th>
              <td>
                {LIBELLE_ROLE[courant.role] ?? courant.role}
                {courant.attributAdministrateur && (
                  <>
                    {' '}
                    <span className={styles.marque}>attribut administrateur</span>
                  </>
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">Filiale de rattachement</th>
              <td>{courant.filialeLibelle ?? 'Aucune'}</td>
            </tr>
            <tr>
              <th scope="row">Accès aux données de contrôle interne</th>
              <td>{peutAccederAuxDonnees(courant) ? 'Oui' : 'Non'}</td>
            </tr>
            <tr>
              <th scope="row">Vues consolidées des 12 filiales</th>
              <td>{peutLireConsolidation(courant) ? 'Oui' : 'Non'}</td>
            </tr>
            <tr>
              <th scope="row">Saisie</th>
              <td>
                {courant.filialeId !== null && peutSaisir(courant, courant.filialeId)
                  ? `Oui, sur ${courant.filialeLibelle} uniquement`
                  : 'Non'}
              </td>
            </tr>
            <tr>
              <th scope="row">Gestion des comptes</th>
              <td>{peutGererComptes(courant) ? 'Oui' : 'Non'}</td>
            </tr>
          </tbody>
        </table>

        <p className={styles.avertissement}>
          Écran provisoire de l’étape 4.5. Les écrans de saisie et de consultation
          arrivent aux lots suivants. L’attribut administrateur ne confère aucun
          droit de lecture sur les données : seul le rôle en décide.
        </p>

        <form action={seDeconnecter}>
          <button type="submit" className={styles.deconnexion}>
            Se déconnecter
          </button>
        </form>

        {modeDemo && (
          <p className={styles.bandeau}>Données fictives — démonstration</p>
        )}
      </div>
    </main>
  );
}
