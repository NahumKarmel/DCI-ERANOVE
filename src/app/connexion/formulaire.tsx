'use client';

/**
 * Formulaire de connexion. Composant client pour l'état d'erreur et l'indication
 * d'envoi en cours ; toute la vérification reste côté serveur.
 */

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { seConnecter, type EtatConnexion } from './actions';
import styles from './connexion.module.css';

function Bouton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.bouton} disabled={pending}>
      {pending ? 'Connexion…' : 'Se connecter'}
    </button>
  );
}

export function Formulaire({ suite }: { suite: string }) {
  const [etat, action] = useActionState<EtatConnexion, FormData>(seConnecter, {});

  return (
    <>
      {etat.erreur && (
        <p className={styles.erreur} role="alert">
          {etat.erreur}
        </p>
      )}
      <form action={action} className={styles.champs}>
        <input type="hidden" name="suite" value={suite} />
        <div className={styles.champ}>
          <label className={styles.etiquette} htmlFor="email">
            Adresse électronique
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.saisie}
            autoComplete="username"
            required
            autoFocus
          />
        </div>
        <div className={styles.champ}>
          <label className={styles.etiquette} htmlFor="motDePasse">
            Mot de passe
          </label>
          <input
            id="motDePasse"
            name="motDePasse"
            type="password"
            className={styles.saisie}
            autoComplete="current-password"
            required
          />
        </div>
        <Bouton />
      </form>
    </>
  );
}
