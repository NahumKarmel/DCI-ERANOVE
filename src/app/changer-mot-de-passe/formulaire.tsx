'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { changerMotDePasse, type EtatChangement } from './actions';
import styles from './changement.module.css';

function Bouton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.bouton} disabled={pending}>
      {pending ? 'Enregistrement…' : 'Changer le mot de passe'}
    </button>
  );
}

export function Formulaire({ longueurMinimale }: { longueurMinimale: number }) {
  const [etat, action] = useActionState<EtatChangement, FormData>(
    changerMotDePasse,
    {},
  );

  return (
    <>
      {etat.erreur && (
        <p className={styles.erreur} role="alert">
          {etat.erreur}
        </p>
      )}
      <form action={action} className={styles.champs}>
        <div className={styles.champ}>
          <label className={styles.etiquette} htmlFor="actuel">
            Mot de passe actuel
          </label>
          <input
            id="actuel"
            name="actuel"
            type="password"
            className={styles.saisie}
            autoComplete="current-password"
            required
            autoFocus
          />
        </div>
        <div className={styles.champ}>
          <label className={styles.etiquette} htmlFor="nouveau">
            Nouveau mot de passe
          </label>
          <input
            id="nouveau"
            name="nouveau"
            type="password"
            className={styles.saisie}
            autoComplete="new-password"
            minLength={longueurMinimale}
            required
          />
        </div>
        <div className={styles.champ}>
          <label className={styles.etiquette} htmlFor="confirmation">
            Confirmation du nouveau mot de passe
          </label>
          <input
            id="confirmation"
            name="confirmation"
            type="password"
            className={styles.saisie}
            autoComplete="new-password"
            minLength={longueurMinimale}
            required
          />
        </div>
        <Bouton />
      </form>
    </>
  );
}
