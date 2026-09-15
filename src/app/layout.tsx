/**
 * Coquille de l'application.
 *
 * `palette.css` est importée ici, avant tout module de style : la palette
 * ERANOVE est la source unique de vérité chromatique et doit être disponible
 * pour chaque composant.
 *
 * Aucune police distante n'est chargée. Une pile de polices système évite une
 * dépendance réseau au build, ce qui compte pour la transférabilité vers
 * l'infrastructure ERANOVE et pour un Codespace à deux cœurs.
 */

import type { Metadata } from 'next';

import './palette.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tableau de bord — Contrôle Interne Groupe ERANOVE',
  description:
    'Suivi mensuel des indicateurs de contrôle interne des filiales du groupe. '
    + 'Données fictives de démonstration.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
