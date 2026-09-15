/**
 * Changement de mot de passe obligatoire à la première connexion, et après toute
 * réinitialisation par l'Administrateur.
 *
 * L'écran reste atteignable hors obligation : un utilisateur peut changer son mot
 * de passe quand il le souhaite. Seul le texte d'accompagnement change.
 */

import Image from 'next/image';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { utilisateurCourant } from '@/lib/auth/session';
import { LONGUEUR_MINIMALE } from '@/lib/auth/motDePasse';

import { Formulaire } from './formulaire';
import styles from './changement.module.css';

export const metadata: Metadata = {
  title: 'Changer le mot de passe — Contrôle Interne Groupe',
};

export default async function PageChangement() {
  const courant = await utilisateurCourant();
  if (!courant) redirect('/connexion');

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
            {courant.doitChangerMotDePasse
              ? 'Choisissez votre mot de passe'
              : 'Changer votre mot de passe'}
          </h1>
          <p className={styles.sousTitre}>
            {courant.doitChangerMotDePasse
              ? 'Votre mot de passe actuel est provisoire. Il doit être remplacé avant d’accéder à l’application.'
              : `Compte ${courant.email}.`}
          </p>
        </div>

        <Formulaire longueurMinimale={LONGUEUR_MINIMALE} />

        <p className={styles.aide}>
          Le mot de passe doit comporter au moins {LONGUEUR_MINIMALE} caractères.
          Changer votre mot de passe ferme vos autres sessions ouvertes.
        </p>
      </div>
    </main>
  );
}
