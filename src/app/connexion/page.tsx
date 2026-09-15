/**
 * V1 — Connexion.
 *
 * Aucune maquette n'existe pour cet écran : il reste sobre et s'en tient à la
 * palette ERANOVE.
 */

import Image from 'next/image';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { utilisateurCourant } from '@/lib/auth/session';

import { Formulaire } from './formulaire';
import styles from './connexion.module.css';

export const metadata: Metadata = {
  title: 'Connexion — Contrôle Interne Groupe',
};

/** Chemin de retour, refusé s'il n'est pas interne. */
function suiteSure(valeur: string | string[] | undefined): string {
  if (typeof valeur !== 'string') return '/';
  if (!valeur.startsWith('/') || valeur.startsWith('//')) return '/';
  return valeur;
}

export default async function PageConnexion({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Écarte un visiteur DÉJÀ authentifié — après vérification en base, ce que le
  // middleware ne peut pas faire. Un cookie périmé ou forgé ne produit rien ici,
  // et le formulaire s'affiche normalement : c'est ce qui évite la boucle de
  // redirection entre /connexion et l'accueil.
  const dejaConnecte = await utilisateurCourant();
  if (dejaConnecte) {
    redirect(dejaConnecte.doitChangerMotDePasse ? '/changer-mot-de-passe' : '/');
  }

  const parametres = await searchParams;
  const suite = suiteSure(parametres.suite);
  const modeDemo = process.env.MODE_DEMO === 'true';

  return (
    <main className={styles.page}>
      <div className={styles.carte}>
        <div className={styles.entete}>
          <Image
            src="/logo-eranove.png"
            alt="ERANOVE"
            width={128}
            height={64}
            className={styles.logo}
            priority
          />
          <h1 className={styles.titre}>
            Tableau de bord du Contrôle Interne Groupe
          </h1>
          <p className={styles.sousTitre}>
            Identifiez-vous pour accéder à votre espace.
          </p>
        </div>

        <Formulaire suite={suite} />

        <p className={styles.aide}>
          Vous n’avez pas de mot de passe, ou vous l’avez oublié ? Adressez-vous à
          l’Administrateur de l’application : il vous remettra un mot de passe
          temporaire, à changer à la première connexion. Aucun message
          électronique n’est envoyé par l’application.
        </p>

        {modeDemo && (
          <p className={styles.bandeau}>
            Données fictives — démonstration
          </p>
        )}
      </div>
    </main>
  );
}
