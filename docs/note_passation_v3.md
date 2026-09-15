# Note de passation — Tableau de bord Contrôle Interne Groupe ERANOVE

**Version** 3 — ouverture du Bloc 4
**Date** 15 septembre 2026
**Remplace** la note de passation du 4 septembre 2026, version 2
**Objet** Reprise du projet dans une nouvelle discussion sans perte d'information
**À lire en premier** avant toute intervention sur ce projet

---

## 1. Comment travailler sur ce projet

### Posture attendue

Expert senior en conseil, avec une double compétence : accompagnement d'entrepreneurs et optimisation ou automatisation des processus par l'IA. Ton professionnel, posture de coach porteur d'une méthodologie et d'une doctrine, accompagnement de bout en bout.

**Signaler à HM lorsque la conversation atteint 90 % du volume de données acceptable**, afin de préparer une passation.

### Doctrine de travail

| Principe | Application |
|---|---|
| **« Ne jamais modéliser ce qu'on ne possède pas »** | Aucune structure de données ni fonctionnalité n'est construite avant que la donnée réelle soit en main |
| **Diagnostic transparent** | HM préfère l'assessment direct des problèmes à la formulation diplomatique. Les défauts découverts en cours de route se signalent, ils ne se corrigent pas en silence |
| **Progression par arbitrages** | Les décisions métier sont présentées sous forme d'options numérotées avec une recommandation argumentée ; HM tranche. Ne jamais trancher un arbitrage métier à sa place |
| **Répartition des rôles** | Les décisions techniques sont déléguées ; les arbitrages métier sont toujours ceux de HM |
| **Blocs séquentiels** | Un bloc se termine par une validation explicite avant le suivant |
| **Actifs possédés** | Architecture choisie pour que l'application soit détenue et transférable, jamais enfermée dans une plateforme tierce |
| **Cohérence numérique entre écrans** | Un chiffre qui diffère d'un écran à l'autre détruit la crédibilité de la démonstration entière. Le générateur est unique et partagé (RG-46 bis) |

### Règle absolue

**Données fictives uniquement.** Aucune donnée réelle du groupe ERANOVE n'est hébergée en ligne. Le commanditaire est réel, mais le jeu de démonstration reste fictif et signalé comme tel par un bandeau permanent dans chaque écran.

Cette règle s'applique également au dépôt GitHub : aucun extrait du fichier Excel réel, aucun nom de correspondant réel, aucun chiffre de contrôle interne authentique ne doit être commité, même dans un fichier de test. Le jeu de démonstration est entièrement généré par la fonction de hachage déterministe, ce qui règle la question à la source.

### Ne pas confondre deux projets distincts

Ce projet **DCI** est **autonome et sans lien** avec le projet SDRM (arbitrage A2, option a). Ils partagent une logique fonctionnelle voisine mais aucun code ni aucune base.

**Piège terminologique** : dans le projet DCI, le sigle `SDRM` désigne la **Sous-Direction Risk Management de GS2E**, l'une des deux sous-directions déclarantes de GS2E. Il ne renvoie pas au projet homonyme.

---

## 2. Le projet en une page

Le Directeur Contrôle Interne Groupe ERANOVE pilote 7 indicateurs remontés mensuellement par 12 filiales déclarantes. Le dispositif actuel est un classeur Excel macro : onglet de saisie unique, TCD masqués à actualiser manuellement, aucune traçabilité, calculs erronés sur les indicateurs cumulatifs.

L'objectif est une application web multi-utilisateurs où chaque correspondant saisit les indicateurs de sa filiale et suit leur évolution, où le Directeur consulte la consolidation en temps réel, commente et pilote les objectifs, et où tout est tracé.

Le **Directeur CI Groupe est un commanditaire réel**. La démonstration doit lui permettre de voir les graphes évoluer et de manipuler tous les paramètres.

---

## 3. État d'avancement

| Bloc | Contenu | Statut |
|---|---|---|
| Bloc 0 | Diagnostic du fichier Excel source | **Terminé** |
| Bloc 1 | Arbitrations fonctionnelles — 25 décisions | **Terminé** |
| Bloc 2 | Cahier des charges et modèle de données | **Terminé — v1.5** |
| Bloc 3 | Maquettes d'interface | **Terminé — 6 écrans livrés et validés** |
| Bloc 4 | Environnement technique et développement | **En cours — étape 4.2 à engager** |
| Bloc 5 | Chargement du jeu de démonstration et recette | À venir |
| Bloc 6 | Présentation au Directeur CI Groupe | À venir |

### Détail du Bloc 3 — clos

| Écran | Objet | Statut |
|---|---|---|
| V1 | Connexion | Non maquetté — sans enjeu ergonomique |
| V2 | Saisie mensuelle (Correspondant) | Livré et validé |
| V3 | Mes indicateurs, évolution (Correspondant) | Livré et validé |
| V4 v2 | Dashboard consolidé (Directeur) | Livré et validé — sélecteur d'exercice ajouté |
| V5 | Détail par filiale, traçabilité complète | Livré et validé — brouillons intégrés |
| V6 | Détail par indicateur, courbes superposées | Livré et validé |
| V7 | Suivi des remontées, réouverture de période | Livré et validé |
| V8 / V9 / V10 | Administration, paramétrage, journal d'audit | Non maquettés — fonctionnellement simples, sans risque ergonomique |

### Détail du Bloc 4 — en cours

| Étape | Contenu | Statut |
|---|---|---|
| 4.1 | Environnement local : compte GitHub, Codespace, Claude Code | **Terminé** |
| **4.2** | Structure du dépôt, `CLAUDE.md`, `.gitignore`, `.env.example` | **Prochaine action** |
| 4.3 | Schéma de données — cinq choix de modélisation | À suivre |
| 4.4 | Générateur de démonstration + recette des six repères | Verrou du bloc |
| 4.5 | Authentification et matrice des habilitations | À suivre |

---

## 4. Périmètre organisationnel

**11 entités juridiques, 12 filiales déclarantes.** GS2E remonte par deux sous-directions, traitées comme deux filiales de plein droit.

| Filiale déclarante | Entité juridique | Indicateurs | Correspondant fictif |
|---|---|---|---|
| GS2E — SDCI | GS2E | 7 | K. Assamoi |
| GS2E — SDRM | GS2E | **4** | H. M. *(porte l'attribut administrateur)* |
| CIE | CIE | 7 | A. Koffi |
| SODECI | SODECI | 7 | M. Diomandé |
| KEKELI | KEKELI | 7 | B. Ouattara |
| CIPREL | CIPREL | 7 | S. N'Guessan |
| ATINKOU | ATINKOU | 7 | R. Bamba |
| ASOKH | ASOKH | 7 | L. Traoré |
| SDER | SDER | 7 | P. Yao |
| OMILAYE | OMILAYE | 7 | F. Kouassi |
| AWALE | AWALE | 7 | D. Coulibaly |
| SMART ENERGY | SMART ENERGY | 7 | N. Aké |

**GS2E — SDRM ne porte pas les indicateurs QCI, TCI et Recommandations comités d'audit.**

**Total : 81 affectations attendues par exercice** (11 × 7 + 4).

### Référentiel des 7 indicateurs

| # | Code | Libellé | Objectif groupe |
|---|---|---|---|
| 1 | `PCI` | Mise en œuvre du Plan de Contrôle Interne | 100 % |
| 2 | `CARTO` | Réalisation / mise à jour des cartographies de risques | 50 % |
| 3 | `AMR` | Actions de maîtrise des risques niveaux 1 & 2 | 80 % |
| 4 | `QCI` | Réalisation des QCI planifiés | 60 % |
| 5 | `TCI` | Réalisation des TCI planifiés | 100 % |
| 6 | `RECO_SEM` | Recommandations séminaires / journées CI | 75 % |
| 7 | `RECO_CA` | Recommandations comités d'audit | 100 % |

Tous en mode `CUMUL`. L'attribut `mode_calcul` doit exister dès le premier jour, HM se réservant le droit de basculer certains indicateurs en `FLUX`.

---

## 5. Les 25 arbitrations du Bloc 1 — référence canonique

### Gouvernance

| # | Décision |
|---|---|
| A1 | Commanditaire réel ; données fictives pour la démonstration |
| A2 | Application **autonome**, indépendante du projet SDRM |
| A3 | 4 rôles : Correspondant, Directeur CI Groupe, Lecteur, Administrateur pur |
| A4 | 1 correspondant = 1 filiale. **Exception GS2E** : deux profils, SDCI et SDRM |

### Méthode de calcul

| # | Décision |
|---|---|
| B5 | **Stock cumulé** pour les 7 indicateurs, révisable |
| B6 | Objectif annuel, comparé en fin d'exercice, avec signalement dès qu'il est atteint |
| B7 | Objectifs spécifiques par filiale possibles, fixés par le Directeur |
| B8 | **Aucun plafonnement** — surperformance affichée telle quelle |
| B9 | Indicateurs à **poids égal**, aucun coefficient |

### Fonctionnel

| # | Décision |
|---|---|
| C10 | Remontée directe, **sans validation hiérarchique**. Commentaires du Directeur visibles immédiatement |
| C11 | Verrouillage J+10 · Suivi du taux de remontée · Fil de commentaires · Comparaison N-1 · Export PDF + Excel · Pièce jointe |

### Micro-arbitrages

| # | Décision |
|---|---|
| M1 | Commentaires **cloisonnés au périmètre de la filiale** |
| M2 | Un fil par **filiale × indicateur × exercice** |
| M3 | Statut reflétant la situation réelle du mois ; date du premier franchissement conservée |
| M4 | GS2E : deux profils nommés SDCI et SDRM, saisies distinctes |
| M5a | Réouverture d'une période close par le Directeur, motif obligatoire, journalisée |
| M5b | Mois non saisi = **trou affiché, aucun report** |

### Décisions ultérieures

| # | Décision |
|---|---|
| D1 | Le Directeur peut créer un **Administrateur pur** externe : gestion des comptes, aucun accès aux données |
| D2 | L'attribut administrateur ne confère **jamais** de droit de lecture sur les données |
| D3 | Un administrateur ne peut pas modifier son propre rattachement de filiale |
| D4 | GS2E consolidée en **deux lignes distinctes** dans la vue du Directeur |
| D5 | Hypothèses HYP-1 à HYP-5 confirmées (voir §9) |
| D6 | Pièces jointes : **PDF, Excel, Word, PowerPoint, images**, 10 Mo maximum |
| D7 | **AWALE et SMART ENERGY intégrées** au périmètre |
| D8 | **Commentaire de saisie obligatoire** par indicateur ; pièce jointe facultative |
| D9 | Vocabulaire unifié : **« filiale »** partout, « unité de remontée » abandonnée |

---

## 6. Les arbitrations du Bloc 3 — à ne pas rouvrir

Ces cinq décisions ont été prises pendant la construction des maquettes et sont intégrées au cahier des charges v1.5.

| # | Décision | Traduction |
|---|---|---|
| **E1** | La **réouverture de période a deux points d'entrée** : fiche filiale (V5) et suivi des remontées (V7) | RG-31 bis |
| **E2** | L'objectif de référence est **toujours l'objectif groupe**. Une dérogation du Directeur exige un **avertissement explicite**, pas seulement un marquage visuel | RG-24 bis, RG-28 bis |
| **E3** | L'historique des saisies en V5 s'ouvre sur les **trois derniers mois**, dépliable sur l'exercice complet | Chapitre 8, V5 |
| **E4** | **Aucun classement en V6.** Le tableau se trie, il n'attribue pas de rang | Chapitre 8, V6 |
| **E5** | Le graphe V6 suit le principe du **nuage avec mise en avant** : toutes les courbes en gris, trois seulement en couleur — extrême haut, extrême bas, filiale sélectionnée | Chapitre 8, V6 |

---

## 7. Les arbitrations du Bloc 4 — pile technique et environnement

| Réf. | Décision |
|---|---|
| **T1.b** | Next.js 15 App Router TypeScript + PostgreSQL 16 nu (aucune extension propriétaire) + Drizzle ORM (migrations en SQL lisible) + authentification applicative (table `session`, cookie httpOnly, hachage Argon2id). Aucune dépendance de plateforme à réversibiliser plus tard. |
| **T2.c** | Déploiement en ligne pour la démonstration, données fictives, assorti d'un **engagement documenté de redéploiement sur infrastructure ERANOVE** avant toute donnée réelle. Une note d'une page est remise en même temps que la démonstration : jeu fictif, hébergement provisoire, bascule conditionnée à l'accord du commanditaire, à la validation DSI et au redéploiement sur infrastructure du groupe. |
| **T3.a** | Email + mot de passe. Réinitialisation **par l'Administrateur**, qui génère un mot de passe temporaire à changer à la première connexion. Aucun email n'est jamais envoyé, HYP-5 est préservée. SSO Microsoft Entra ID écarté du périmètre V1, conformément au chapitre 1.3 du CDC qui exclut toute interface avec un annuaire d'entreprise. |
| **T4** | Environnement distant retenu (scénario b). Poste GS2E verrouillé par la DSI — aucune installation possible, Docker Desktop bloqué. Tout se passe dans le Codespace ; le poste ne sert que de terminal. |
| **T5** | Ordre de construction : schéma → jeu de démonstration → **recette des six repères chiffrés** (verrou bloquant, aucun écran avant validation) → authentification → saisie → consultation → administration. |

### Pile technique arrêtée

| Couche | Choix | Justification au regard de T1.b |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript** | Auto-hébergeable par `next start`, aucune dépendance à une plateforme |
| Base de données | **PostgreSQL 16 nu**, aucune extension propriétaire | Un `pg_dump` suffit à déménager |
| ORM | **Drizzle + drizzle-kit** | Migrations versionnées en SQL lisible, pas en format binaire propriétaire |
| Authentification | **Table `session` applicative**, cookie httpOnly SameSite=Lax, hachage **Argon2id** | Zéro service tiers, cohérent avec T3.a |
| Pièces jointes | Interface `StorageAdapter` à deux implémentations : **disque local** et **S3 compatible** | Le passage au stockage interne ERANOVE ne touche qu'un fichier |
| Export Excel | `exceljs` | — |
| Export PDF | `@react-pdf/renderer` | Écarte la dépendance à un navigateur headless, lourde en environnement d'entreprise |
| Graphes | **SVG écrits à la main**, repris des six prototypes | RG-32, aucune librairie de charting |
| Versionnage | Git, dépôt privé GitHub personnel | Actif possédé |
| Conteneurisation | **Dockerfile produit dès le Bloc 4** | Preuve de transférabilité, vérifiée automatiquement à chaque modification par GitHub Actions — la construction locale n'étant pas possible sans Docker sur le poste |

### Trois règles techniques non négociables

1. **PostgreSQL nu**, sans extension propriétaire.
2. **Le taux n'est jamais stocké**, toujours calculé.
3. **Les pièces jointes sont derrière une interface de stockage abstraite.**

### Environnement de développement — état au 15 septembre 2026

| Élément | Valeur |
|---|---|
| Système du poste | Windows, verrouillé par la DSI, aucun droit d'installation |
| Compte GitHub | Personnel, adresse personnelle — `NahumKarmel` |
| Dépôt | `NahumKarmel/DCI-ERANOVE` — **privé** |
| Environnement | GitHub Codespaces, machine **2 cœurs** |
| Codespace actif | `turbo-journey` |
| Node.js et Git | Présents et vérifiés dans le Codespace |
| Claude Code | **v2.1.271 installé et authentifié** |
| Étape suivante | **4.2 — créer `CLAUDE.md` et la structure du dépôt** |

**Pourquoi un compte personnel.** Ce n'est pas de la dissimulation, c'est de la propriété. Un dépôt rattaché à une adresse professionnelle devient juridiquement discutable le jour où HM quitte le groupe, et administrativement récupérable par la DSI. Un dépôt personnel contenant des données fictives lui appartient sans ambiguïté. Le jour où ERANOVE reprend l'application, le dépôt se transfère par décision, pas par défaut.

**Règle de discipline Codespaces.** Le plan gratuit alloue 120 heures-cœur par mois, soit 60 heures réelles sur machine 2 cœurs, plus 15 Go de stockage. Dès que l'une des deux limites est atteinte, l'usage est suspendu jusqu'au renouvellement du quota.

| Règle | Pourquoi |
|---|---|
| **Arrêter le Codespace en fin de séance** (menu Codespaces → Stop current codespace) | Le compteur tourne tant qu'il est actif, même sans frappe au clavier |
| **N'en garder qu'un seul, et supprimer les anciens** | Un Codespace arrêté ne consomme plus de calcul mais continue de grignoter le quota de stockage |

C'est le stockage qui piège, pas le calcul.

**Solution de repli identifiée.** Si l'accès GitHub devient impraticable, Google Cloud Shell offre une machine Linux gratuite avec Docker et un espace de travail persistant, accessible depuis un compte Google. On y perd l'intégration au dépôt, on garde tout le reste.

---

## 8. Règles structurantes à ne jamais perdre

Les règles sont dans le cahier des charges v1.5. Celles qui sont le plus souvent oubliées ou mal réimplémentées :

| Règle | Énoncé |
|---|---|
| **RG-13** | Dénominateur nul → taux **non calculable (`NULL`)**, jamais 0. Exclu des moyennes, affiché « n/a ». *Corrige l'erreur la plus coûteuse du fichier Excel.* |
| **RG-12** | Aucun plafonnement du taux. Un taux > 100 % est stocké et affiché. |
| **RG-15** | Mode CUMUL : la valeur de l'exercice est **le taux du dernier mois saisi**, jamais une moyenne des 12 mois. |
| **RG-17** | Score d'une filiale = moyenne des taux **calculables** de ses indicateurs **affectés**. Non affectés et non calculables exclus du numérateur *et* du dénominateur. |
| **RG-18** | Une filiale n'ayant pas saisi est **exclue** de la moyenne groupe, jamais comptée comme 0. |
| **RG-24 bis** | Objectif dérogatoire = trois signaux conjoints : marquage visuel, rappel de l'objectif groupe à proximité, avertissement en clair. Un marquage seul est insuffisant. |
| **RG-27** | Comparaison N-1 sur le **même mois** de l'exercice précédent, pas sur la clôture N-1. |
| **RG-28 bis** | Objectif différent entre N-1 et N → avertissement propre. L'écart reste affiché, ni masqué ni proratisé. |
| **RG-28 ter** | Pas d'exercice N-1 → fonction de comparaison **désactivée**, pas seulement sans effet. |
| **RG-31 ter** | Une période rouverte porte un état visuel distinct de « ouverte » et de « close ». |
| **RG-32** | Mois non saisi = trou. Courbe interrompue, **aucune interpolation**. |
| **RG-37 bis** | Un indicateur est *renseigné* si numérateur **et** dénominateur **et** commentaire sont fournis. |
| **RG-37 ter** | Le **brouillon** a un double statut : sa valeur s'affiche et alimente les calculs, mais il n'est pas compté comme renseigné. C'est la **seule** source de mois partiel. |
| **RG-46 bis** | Le générateur de données est **déterministe** et **partagé par tous les écrans**. |

### Cinq choix de modélisation à préserver

Ils s'implémentent directement au Bloc 4, sans réinterprétation.

1. **La table `affectation` est le pivot du modèle.** Elle porte simultanément : quels indicateurs une filiale remonte, quel objectif s'applique, pour quel exercice. Elle règle l'exception GS2E — SDRM sans code conditionnel et les objectifs différenciés sans table supplémentaire.
2. **Le taux n'est jamais stocké**, toujours dérivé de `numerateur / denominateur`.
3. **Les objectifs sont stockés en fraction** (`0.80`), jamais en pourcentage.
4. **L'état brouillon n'est pas une colonne** : il se déduit de `commentaire_saisie IS NULL` sur une saisie valorisée.
5. **La dérogation d'objectif n'est pas un attribut** : elle se déduit de l'écart entre `affectation.objectif` et `indicateur.objectif_defaut`.

---

## 9. Hypothèses confirmées

| Réf. | Décision |
|---|---|
| HYP-1 | Le mois M ouvre le 1er du mois M+1, ferme le 10 à 23h59, heure d'Abidjan. Aucune saisie anticipée. |
| HYP-2 | Pièces jointes : PDF, Excel, Word, PowerPoint, images. 10 Mo maximum. |
| HYP-3 | Lecteurs **non restreints** : accès aux 12 filiales en lecture seule. Table `lecteur_perimetre` supprimée. |
| HYP-4 | Exercice 2025 fictif complet, pour démontrer la comparaison N-1. |
| HYP-5 | Notifications **en application uniquement**, aucun envoi d'email. |

---

## 10. Conventions techniques des prototypes — Bloc 3

Ces conventions ne régissent plus le développement, qui relève du Bloc 4 et de la pile arrêtée au chapitre 7. Elles restent la référence pour toute reprise ou correction des maquettes.

- **Un fichier JSX autonome par écran**, composant React à export par défaut, aucune prop requise.
- **Logos encodés en base64** directement dans le fichier — aucune dépendance à un serveur d'images. Environ 27 Ko pour les 12 logos. Le bloc `const LOGOS = {…}` est identique dans tous les prototypes et se recopie tel quel.
- **Aucune librairie de charting.** Les graphiques sont écrits en SVG à la main. Choix délibéré : contrôle exact de l'interruption des segments sur les mois non saisis (RG-32), que Recharts gère mal, et zéro friction de dépendances.
- **Styles en ligne**, pas de Tailwind, pour la portabilité.
- **Validation systématique** : copier le fichier en `/tmp/x.jsx` puis `npx esbuild --jsx=automatic /tmp/x.jsx --outfile=/tmp/o.js`. La syntaxe doit passer avant livraison. Si `npx` doit télécharger esbuild, l'installer d'abord en tâche de fond (`npm install esbuild`) pour éviter un dépassement de délai.
- **Contrôle numérique** : après chaque écran, rejouer le générateur dans un script Node isolé et vérifier que les valeurs coïncident avec celles des écrans déjà livrés.
- **Sélecteur de démonstration** en haut des écrans, permettant d'incarner chaque filiale ou chaque rôle. Il n'existera pas en production ; il est indispensable pour que le Directeur teste tout depuis un seul écran.
- **Générateur de données déterministe** : hachage FNV sur `code filiale + code indicateur + année`, produisant des cumuls monotones. **Identique dans V3, V4, V5, V6 et V7 — à ne jamais modifier sans reprendre les cinq écrans.**

### Palette ERANOVE

```
NAVY    #16213A   en-têtes, texte principal
NAVY_2  #243456   dégradé d'en-tête
VERT    #8DB93F   accent principal, objectif atteint
VERT_F  #4F7B14   texte sur fond vert
BLEU    #2E6DA4   information, surperformance, mise en avant
AMBRE   #D9902B   vigilance, écart marqué, brouillon, objectif dérogatoire
TERRE   #C15A38   écart critique, absence de saisie
OR      #E8B93C   distinction, attribut administrateur
VIOLET  #6B3A82   période rouverte
GRIS    #8A909B   non calculable, non saisi
NUAGE   #D3D8E0   courbes de second plan en V6
```

**Règle chromatique** : les cellules sont colorées selon **le rapport du taux à son objectif**, jamais selon le taux brut. C'est la seule façon de comparer visuellement des indicateurs dont les objectifs vont de 50 % à 100 %.

HM a demandé de donner plus de vie à l'interface en termes de couleur, tout en comprenant qu'il s'agit de prototypes qui seront personnalisés sous Claude Code.

---

## 11. Jeu de démonstration

Exercice de référence **2026**, janvier à juillet clos, **août ouvert jusqu'au 10 septembre**. Exercice **2025** complet pour la comparaison N-1. Aucun exercice 2024.

| Filiale | Profil | Cas limite porté |
|---|---|---|
| CIE | Performante, régulière | **Surperformance** > 100 % sur `RECO_SEM` à compter de juin |
| SMART ENERGY | Performante, régulière | — |
| SODECI | Bonne, avec un creux au T2 | Décrochage puis redressement · **période de mai rouverte** |
| CIPREL | Régulière, proche des objectifs | — |
| GS2E — SDCI | Moyenne, progression linéaire | — |
| GS2E — SDRM | Moyenne | **4 indicateurs seulement** |
| KEKELI | Moyenne | **Dénominateur nul** sur `TCI` en janvier et février |
| ASOKH | Irrégulière | **Trou en mai** — courbe interrompue |
| ATINKOU | Démarrage tardif | Premières saisies en mars · **période de mars rouverte** |
| AWALE | Entité récente | **Aucun historique N-1** — affichage « n.d. » |
| SDER | En difficulté | **Objectif atteint en avril puis reperdu en juin** sur `AMR` |
| OMILAYE | En difficulté | **Objectif dérogatoire** à 80 % sur `PCI` en 2026 seulement · non saisie en août |

### Saisies en brouillon — liste canonique, partagée entre V5 et V7

Valeurs saisies, commentaire manquant. Seule source de mois partiels. **Toute modification doit être répercutée sur les deux écrans.**

| Filiale | Exercice | Mois | Indicateurs |
|---|---|---|---|
| CIPREL | 2026 | Juin | `QCI`, `TCI` |
| KEKELI | 2026 | Juillet | `RECO_CA` |
| GS2E — SDCI | 2026 | Août | `CARTO`, `QCI`, `RECO_SEM` |
| SODECI | 2026 | Août | `TCI`, `RECO_CA` |
| SMART ENERGY | 2026 | Août | `RECO_CA` |
| SDER | 2026 | Août | `PCI`, `CARTO`, `AMR`, `QCI` |
| CIE | 2025 | Novembre | `TCI` |

### Six repères chiffrés — verrou de non-régression

Ces six valeurs doivent être reproduites exactement après tout développement. **Si l'une échoue, on ne construit rien.**

| Contrôle | Valeur attendue |
|---|---|
| Taux de remontée global, exercice 2026 | **90,4 %** — 586 saisies sur 648 |
| Périodes closes incomplètes, 2026 | **8** couples filiale × mois |
| Filiales sans retard, 2026 | **7 sur 12** |
| Score SDER, août 2026 | **50,3 %** |
| Moyenne `AMR`, août 2026 | **72,3 %** sur 11 filiales calculables |
| Filiales atteignant l'objectif `AMR` en août | **3 sur 11** |

---

## 12. Fichiers du projet

| Fichier | Contenu |
|---|---|
| `CDC_Tableau_de_bord_DCI_ERANOVE_Bloc2_v1.5.md` | **Cahier des charges v1.5** — document de référence. Chapitre 0 bis : journal des huit amendements du Bloc 3 |
| `prototype_dci_v2_saisie.jsx` | V2 — saisie mensuelle du correspondant |
| `prototype_dci_v3_mes_indicateurs.jsx` | V3 — évolution des indicateurs du correspondant |
| `prototype_dci_v4_dashboard_v2.jsx` | V4 v2 — dashboard consolidé, avec sélecteur d'exercice |
| `prototype_dci_v5_detail_filiale.jsx` | V5 — fiche filiale, traçabilité, pièces jointes, fils publiables |
| `prototype_dci_v6_detail_indicateur.jsx` | V6 — comparaison des filiales sur un indicateur |
| `prototype_dci_v7_suivi_remontees.jsx` | V7 — matrice de complétude et réouverture de période |
| `Tableau_de_bord_DCI_2026_withMacro___V3.xlsm` | Fichier Excel source, diagnostiqué au Bloc 0 |
| Logos | `ERANOVE.jpg`, `logogs2e_v2.webp`, `CIE.png`, `SODECI.jpg`, `KEKELI.jpg`, `CIPREL.png`, `ATINKOU.png`, `ASOKH.png`, `SDER.png`, `OMILAYE.webp`, `AWALE.png`, `SMART_ENERGY.png` |

> **Point d'hygiène documentaire.** Vérifier qu'une seule version de chaque écran figure dans la base, que le CDC v1.4 a bien été remplacé par le v1.5, et que `prototype_dci_v7_suivi_remontees.jsx` y est bien présent — ce fichier avait disparu de la base lors de la session du 14 septembre et devait être réimporté.

Les fichiers du projet SDRM présents dans la base documentaire (`prototype_sdrm*.jsx`, `note_passation_sdrm.md`, `Tableau_de_bord_SDRM_2026*.xlsm`, `logo_certifs.webp`) relèvent de l'autre projet et **ne doivent pas être mobilisés ici**.

---

## 13. Questions ouvertes

| Sujet | État |
|---|---|
| **Charge du commentaire obligatoire** | 7 commentaires par mois et par filiale, soit 84 rédactions annuelles par correspondant. Risque connu de remplissage machinal — les brouillons du jeu de démonstration en sont l'illustration délibérée. Variante proposée et non retenue à ce stade : commentaire obligatoire uniquement lorsque l'objectif n'est pas atteint. À réexaminer à l'usage. |
| **GS2E compte pour deux filiales** | Conséquence assumée de l'arbitrage D4 : GS2E pèse deux douzièmes de la moyenne groupe. Le commanditaire le remarquera en démonstration ; l'argumentaire est préparé au chapitre 2.2 du cahier des charges. |
| **Administration déléguée** | Le Directeur porte les droits d'administration, ainsi que le correspondant GS2E — SDRM. La création d'un Administrateur pur externe est prévue mais aucune personne n'est identifiée. |
| **Écrans V8, V9, V10 non maquettés** | Décision assumée : administration des comptes, paramétrage et journal d'audit sont fonctionnellement simples. Si le développement fait apparaître une complexité ergonomique, les maquetter à ce moment-là plutôt que par anticipation. |
| **Stratégie vis-à-vis de la DSI** | Ne pas solliciter la DSI avant la validation du Directeur CI Groupe. Une demande d'exemption pour un projet qui n'existe pas encore se refuse en trois lignes ; la même demande, adossée à une application qu'un directeur réclame, change de nature. Cette carte se joue au Bloc 6. |

---

## 14. Ce qui reste à faire

### Bloc 4 — reste à produire

1. **Étape 4.2** — `CLAUDE.md` à la racine du dépôt, portant la doctrine, les règles RG, les arbitrages et les six repères chiffrés. Puis `.gitignore`, `.env.example`, et la structure `src/{app,components,lib,db}` et `docs/`. À faire **avant** toute initialisation Next.js.
2. **Étape 4.3** — schéma de données, implémentant les cinq choix de modélisation du chapitre 8.
3. **Étape 4.4** — port du générateur FNV, exercices 2025 et 2026, sept brouillons canoniques, deux périodes rouvertes. Puis **recette contre les six repères chiffrés**. Verrou bloquant.
4. **Étape 4.5** — authentification applicative et matrice des habilitations.
5. Écrans, dans l'ordre : saisie, consultation, administration.

### Puis

- **Bloc 5** — chargement du jeu de démonstration et recette, en s'appuyant sur les six repères du chapitre 11.
- **Bloc 6** — présentation au Directeur CI Groupe, accompagnée de la note d'engagement prévue par T2.c.

---

## 15. Message d'amorçage pour la nouvelle discussion

> Nous poursuivons le projet Tableau de bord Contrôle Interne Groupe ERANOVE. La note de passation `note_passation_dci_V3.md` et le cahier des charges `CDC_Tableau_de_bord_DCI_ERANOVE_Bloc2_v1.5.md` sont dans la base documentaire du projet, avec les six prototypes du Bloc 3 déjà validés. Lis la note de passation, puis nous attaquons l'étape **4.2** : création du fichier `CLAUDE.md` à la racine du dépôt `NahumKarmel/DCI-ERANOVE`, structure des dossiers, `.gitignore` et `.env.example`. Claude Code v2.1.271 est installé et authentifié dans le Codespace `turbo-journey`, machine 2 cœurs.

---

*Toutes les données figurant dans les prototypes et le jeu de démonstration sont fictives. Aucune donnée réelle du groupe ERANOVE n'est hébergée.*
