/**
 * Middleware — première barrière d'accès.
 *
 * Il redirige vers /connexion toute requête dépourvue de cookie de session, ce
 * qui évite de rendre une page pour rien. Il tourne en runtime Edge et ne peut
 * donc PAS interroger PostgreSQL.
 *
 * CONSÉQUENCE À NE PAS PERDRE DE VUE : ce middleware n'est pas la frontière de
 * sécurité. Il constate la PRÉSENCE d'un cookie, pas sa validité. Un cookie
 * forgé ou périmé le franchit. La vérification réelle — session existante, non
 * expirée, compte actif — est faite en base par `utilisateurCourant()` dans le
 * layout authentifié, et chaque droit est vérifié par la matrice des
 * habilitations au plus près de la donnée. Aucune habilitation ne doit jamais
 * reposer sur ce fichier.
 */

import { NextResponse, type NextRequest } from 'next/server';

/** Routes accessibles sans session. */
const PUBLIQUES = ['/connexion'];

export function middleware(requete: NextRequest): NextResponse {
  const { pathname } = requete.nextUrl;
  const cookie = requete.cookies.get(process.env.SESSION_COOKIE_NAME ?? 'dci_session');

  const estPublique = PUBLIQUES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Une route publique passe TOUJOURS, même porteuse d'un cookie.
  //
  // Renvoyer vers l'accueil un visiteur déjà « connecté » serait tentant, mais
  // ce middleware ne peut pas savoir si le cookie vaut quelque chose : il
  // tourne en runtime Edge, sans accès à PostgreSQL. Sur un cookie périmé ou
  // forgé, il renverrait vers l'accueil, qui renverrait vers /connexion, qui
  // renverrait vers l'accueil — BOUCLE DE REDIRECTION, et utilisateur enfermé
  // dehors sans recours.
  //
  // C'est donc /connexion qui écarte un visiteur déjà authentifié, en runtime
  // Node, après avoir VÉRIFIÉ la session en base.
  if (estPublique) return NextResponse.next();

  if (!cookie) {
    const cible = new URL('/connexion', requete.url);
    // Mémorise la destination pour y revenir après connexion, en n'acceptant
    // qu'un chemin interne : une URL absolue ouvrirait une redirection ouverte.
    if (pathname !== '/') cible.searchParams.set('suite', pathname);
    return NextResponse.redirect(cible);
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Toutes les routes sauf les ressources statiques et le favicon. Les routes
   * publiques sont traitées dans la fonction, pas exclues ici : le middleware
   * doit aussi pouvoir rediriger un visiteur déjà connecté hors de /connexion.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo-eranove\\.png|.*\\.svg$).*)'],
};
