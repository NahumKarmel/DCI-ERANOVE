# CLAUDE.md — Tableau de bord Contrôle Interne Groupe ERANOVE

> Ce fichier est chargé automatiquement au démarrage de chaque session Claude Code.
> Il fait autorité sur tout ce qui suit. En cas de contradiction entre une demande
> formulée en séance et une règle écrite ici, **signaler la contradiction avant d'agir**.

---

## 1. Ce que construit ce dépôt

Application web multi-utilisateurs de suivi du contrôle interne du groupe ERANOVE.
**12 filiales déclarantes** remontent chaque mois **7 indicateurs**. Le Directeur
Contrôle Interne Groupe consulte la consolidation en temps réel, commente, pilote les
objectifs. Tout est tracé.

Elle remplace un classeur Excel à macros dont les calculs cumulatifs sont faux.

**Commanditaire réel, données fictives.** Le Directeur CI Groupe est un destinataire
réel. Le jeu de données est entièrement fictif et généré par hachage déterministe.

---

## 2. Règle absolue — aucune donnée réelle

Aucune donnée réelle du groupe ERANOVE n'est écrite dans ce dépôt, ni commitée, ni
hébergée en ligne. Ni extrait du fichier Excel source, ni nom de correspondant réel,
ni chiffre de contrôle interne authentique — **pas même dans un fichier de test**.

Toute donnée affichée provient du générateur déterministe. Un bandeau permanent
« Données fictives — démonstration » figure dans chaque écran.

Si une demande implique d'introduire une donnée réelle, **refuser et le dire**.

---

## 3. Trois règles techniques non négociables

1. **PostgreSQL nu.** Aucune extension propriétaire, aucun service managé spécifique.
   Un `pg_dump` doit suffire à déménager la base.
2. **Le taux n'est jamais stocké.** Il est toujours calculé à partir de
   `numerateur / denominateur`. Aucune colonne `taux` en base, jamais.
3. **Les pièces jointes sont derrière une interface abstraite.** Toute écriture ou
   lecture de fichier passe par `StorageAdapter`. Deux implémentations : disque local
   et S3 compatible. Le passage au stockage interne ERANOVE ne doit toucher qu'un fichier.

---

## 4. Règles de gestion à ne jamais réinterpréter

Ce sont celles qui se perdent le plus souvent. Toute fonction de calcul doit être
lisible à leur lumière. Le cahier des charges complet est dans `docs/`.

| Règle | Énoncé |
|---|---|
| **RG-12** | Aucun plafonnement. Un taux supérieur à 100 % est stocké et affiché tel quel. |
| **RG-13** | Dénominateur nul → taux **non calculable (`NULL`)**, jamais 0. Exclu des moyennes, affiché « n/a ». *C'est l'erreur la plus coûteuse du fichier Excel d'origine.* |
| **RG-15** | Mode `CUMUL` : la valeur de l'exercice est **le taux du dernier mois saisi**, jamais une moyenne des douze mois. |
| **RG-17** | Score d'une filiale = moyenne des taux **calculables** de ses indicateurs **affectés**. Les non affectés et les non calculables sont exclus du numérateur *et* du dénominateur. |
| **RG-18** | Une filiale n'ayant pas saisi est **exclue** de la moyenne groupe. Jamais comptée comme 0. |
| **RG-24 bis** | Objectif dérogatoire → **trois signaux conjoints** : marquage visuel, rappel de l'objectif groupe à proximité, avertissement en clair. Un marquage seul est insuffisant. |
| **RG-27** | Comparaison N-1 sur le **même mois** de l'exercice précédent, jamais sur la clôture N-1. |
| **RG-28 bis** | Objectif différent entre N-1 et N → avertissement propre. L'écart reste affiché, ni masqué ni proratisé. |
| **RG-28 ter** | Pas d'exercice N-1 → fonction de comparaison **désactivée**, pas seulement sans effet. |
| **RG-31 bis** | La réouverture de période a **deux points d'entrée** : fiche filiale (V5) et suivi des remontées (V7). |
| **RG-31 ter** | Une période rouverte porte un état visuel **distinct** de « ouverte » et de « close ». |
| **RG-32** | Mois non saisi = trou. Courbe interrompue, **aucune interpolation**. |
| **RG-37 bis** | Un indicateur est *renseigné* si numérateur **et** dénominateur **et** commentaire sont fournis. |
| **RG-37 ter** | Le **brouillon** a un double statut : sa valeur s'affiche et alimente les calculs, mais il n'est pas compté comme renseigné. C'est la **seule** source de mois partiel. |
| **RG-46 bis** | Le générateur de données est **déterministe** et **partagé par tous les écrans**. Un chiffre qui diffère d'un écran à l'autre détruit la crédibilité de la démonstration entière. |

---

## 5. Cinq choix de modélisation — à implémenter sans réinterprétation

1. **La table `affectation` est le pivot du modèle.** Elle porte simultanément : quels
   indicateurs une filiale remonte, quel objectif s'applique, pour quel exercice. Elle
   règle l'exception GS2E — SDRM sans code conditionnel, et les objectifs différenciés
   sans table supplémentaire.
2. **Le taux n'est jamais stocké**, toujours dérivé.
3. **Les objectifs sont stockés en fraction** (`0.80`), jamais en pourcentage (`80`).
4. **L'état brouillon n'est pas une colonne.** Il se déduit de
   `commentaire_saisie IS NULL` sur une saisie valorisée.
5. **La dérogation d'objectif n'est pas un attribut.** Elle se déduit de l'écart entre
   `affectation.objectif` et `indicateur.objectif_defaut`.

---

## 6. Périmètre

**11 entités juridiques, 12 filiales déclarantes.** GS2E remonte par deux
sous-directions traitées comme deux filiales de plein droit.

`GS2E — SDCI`, `GS2E — SDRM`, `CIE`, `SODECI`, `KEKELI`, `CIPREL`, `ATINKOU`,
`ASOKH`, `SDER`, `OMILAYE`, `AWALE`, `SMART ENERGY`.

> **Piège terminologique.** Dans ce projet, `SDRM` désigne la Sous-Direction Risk
> Management de GS2E, filiale déclarante. Il ne renvoie **pas** au projet homonyme,
> qui est un autre projet, sans lien ni code partagé.

### Les 7 indicateurs

| # | Code | Libellé | Objectif groupe |
|---|---|---|---|
| 1 | `PCI` | Mise en œuvre du Plan de Contrôle Interne | 100 % |
| 2 | `CARTO` | Réalisation / mise à jour des cartographies de risques | 50 % |
| 3 | `AMR` | Actions de maîtrise des risques niveaux 1 & 2 | 80 % |
| 4 | `QCI` | Réalisation des QCI planifiés | 60 % |
| 5 | `TCI` | Réalisation des TCI planifiés | 100 % |
| 6 | `RECO_SEM` | Recommandations séminaires / journées CI | 75 % |
| 7 | `RECO_CA` | Recommandations comités d'audit | 100 % |

Tous en mode `CUMUL`. **L'attribut `mode_calcul` doit exister dès le premier jour** —
certains indicateurs pourront basculer en `FLUX`.

`GS2E — SDRM` ne porte **pas** `QCI`, `TCI` ni `RECO_CA` : 4 indicateurs seulement.
**Total attendu : 81 affectations par exercice** (11 × 7 + 4).

### Rôles

`Correspondant` · `Directeur CI Groupe` · `Lecteur` · `Administrateur pur`

- 1 correspondant = 1 filiale. Exception GS2E : deux profils distincts, SDCI et SDRM.
- L'attribut administrateur ne confère **jamais** de droit de lecture sur les données.
- Un administrateur ne peut pas modifier son propre rattachement de filiale.
- Les lecteurs ne sont **pas** restreints : accès aux 12 filiales en lecture seule.
- Les commentaires sont **cloisonnés au périmètre de la filiale**. Un fil par
  filiale × indicateur × exercice.

### Cycle de saisie

Le mois M ouvre le 1er du mois M+1 et ferme le **10 à 23h59, heure d'Abidjan**
(`Africa/Abidjan`). Aucune saisie anticipée. Réouverture par le Directeur uniquement,
**motif obligatoire, journalisée**.

Commentaire de saisie **obligatoire** par indicateur. Pièce jointe facultative :
PDF, Excel, Word, PowerPoint, images — **10 Mo maximum**.

Aucun email n'est jamais envoyé. Notifications en application uniquement.
Réinitialisation de mot de passe = mot de passe temporaire généré par l'Administrateur.

---

## 7. Six repères chiffrés — verrou de non-régression

Ces six valeurs doivent être reproduites **exactement** après tout développement
touchant au modèle, au générateur ou aux fonctions de calcul.
**Si l'une échoue, on ne construit rien de plus.**

| Contrôle | Valeur attendue |
|---|---|
| Taux de remontée global, exercice 2026 | **90,4 %** — 586 saisies sur 648 |
| Périodes closes incomplètes, 2026 | **8** couples filiale × mois |
| Filiales sans retard, 2026 | **7 sur 12** |
| Score SDER, août 2026 | **50,3 %** |
| Moyenne `AMR`, août 2026 | **72,3 %** sur 11 filiales calculables |
| Filiales atteignant l'objectif `AMR` en août | **3 sur 11** |

Ces contrôles sont implémentés en tests automatisés dès l'étape 4.4 et rejoués à
chaque modification.

---

## 8. Ordre de construction imposé (T5)

```
schéma → jeu de démonstration → recette des six repères → authentification
       → saisie → consultation → administration
```

**La recette des six repères est un verrou bloquant.** Aucun écran n'est construit
avant qu'elle passe.

---

## 9. Pile technique arrêtée

| Couche | Choix |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Base de données | PostgreSQL 16 nu |
| ORM | Drizzle + drizzle-kit, migrations en SQL lisible |
| Authentification | Table `session` applicative, cookie httpOnly SameSite=Lax, hachage **Argon2id** |
| Styles | **CSS Modules + variables CSS.** Pas de Tailwind. |
| Pièces jointes | Interface `StorageAdapter` — disque local et S3 compatible |
| Export Excel | `exceljs` |
| Export PDF | `@react-pdf/renderer` — pas de navigateur headless |
| Graphes | **SVG écrits à la main.** Aucune librairie de charting. |
| Conteneurisation | `Dockerfile` produit pour la transférabilité, vérifié par GitHub Actions |

**Interdits de dépendance** : aucune librairie de charting, aucun service
d'authentification tiers, aucune extension PostgreSQL propriétaire, aucun SDK de
plateforme d'hébergement. Avant d'ajouter une dépendance non listée ici,
**demander**.

---

## 10. Conventions de code

- **Langue** : identifiants de base de données et de domaine en **français**
  (`affectation`, `numerateur`, `denominateur`, `commentaire_saisie`, `objectif`,
  `exercice`, `filiale`, `indicateur`, `saisie`). Mots-clés techniques et API
  framework en anglais, comme il se doit.
- **Commentaires et messages d'interface** : français.
- **Un taux non calculable** se représente par `null` en TypeScript, jamais par `0`,
  jamais par `NaN`.
- **Les montants et taux** circulent en fraction (`0.804`), le formatage en
  pourcentage est une affaire d'affichage.
- **Aucun `any`** en TypeScript sans commentaire justificatif.
- **Toute fonction de calcul est pure et testée**, isolée dans `src/lib/calculs/`.

### Palette ERANOVE

Déclarée en variables CSS dans `src/app/palette.css`, jamais en dur dans un composant.

```
--navy    #16213A   en-têtes, texte principal
--navy-2  #243456   dégradé d'en-tête
--vert    #8DB93F   accent principal, objectif atteint
--vert-f  #4F7B14   texte sur fond vert
--bleu    #2E6DA4   information, surperformance, mise en avant
--ambre   #D9902B   vigilance, écart marqué, brouillon, objectif dérogatoire
--terre   #C15A38   écart critique, absence de saisie
--or      #E8B93C   distinction, attribut administrateur
--violet  #6B3A82   période rouverte
--gris    #8A909B   non calculable, non saisi
--nuage   #D3D8E0   courbes de second plan
```

**Règle chromatique** : une cellule se colore selon **le rapport du taux à son
objectif**, jamais selon le taux brut. C'est la seule façon de comparer visuellement
des indicateurs dont les objectifs vont de 50 % à 100 %.

---

## 11. Structure du dépôt

```
src/
  app/          routes App Router, layouts, pages
  components/   composants d'interface réutilisables
  lib/
    calculs/    fonctions de calcul pures — taux, scores, moyennes
    demo/       générateur déterministe FNV
    auth/       session, hachage, habilitations
    storage/    StorageAdapter et ses implémentations
  db/
    schema/     schéma Drizzle
    migrations/ migrations SQL versionnées — committées
scripts/        scripts d'environnement et d'amorçage
docs/           cahier des charges, note de passation, maquettes de référence
tests/          tests, dont la recette des six repères
```

---

## 12. Commandes

```bash
npm run dev          # serveur de développement
npm run build        # build de production
npm run lint         # vérification statique
npm run test         # tests, dont la recette des six repères
npm run db:generate  # génère une migration à partir du schéma Drizzle
npm run db:migrate   # applique les migrations
npm run db:seed      # charge le jeu de démonstration déterministe
```

---

## 13. Discipline de travail attendue de Claude Code

- **Ne jamais modéliser ce qu'on ne possède pas.** Si une donnée, une spécification
  ou une décision manque, le dire et s'arrêter. Ne pas inventer de valeur par défaut
  plausible.
- **Diagnostic transparent.** Un défaut découvert en chemin se signale, il ne se
  corrige pas en silence.
- **Les décisions métier appartiennent à HM.** Les présenter en options numérotées
  avec une recommandation argumentée. Ne jamais trancher à sa place.
- **Petits commits lisibles**, un objet par commit, message en français à l'impératif.
- **Aucune réécriture d'un fichier validé** sans annonce préalable de ce qui change.
- **Contexte limité** : le Codespace tourne sur 2 cœurs et un quota mensuel. Éviter
  les installations lourdes, les builds redondants et les processus laissés actifs.

### Interdits opérationnels

- Ne jamais commiter un `.env`, une clé, un fichier `.xlsm` ou `.xlsx`.
- Ne jamais introduire de donnée réelle, même à titre d'exemple.
- Ne jamais stocker un taux calculé en base.
- Ne jamais interpoler une courbe sur un mois non saisi.
- Ne jamais plafonner un taux à 100 %.
- Ne jamais transformer un dénominateur nul en 0.

---

## 14. Documents de référence dans `docs/`

| Fichier | Rôle |
|---|---|
| `CDC_v1.5.md` | Cahier des charges — **document de référence**, fait foi sur toute règle non reprise ici |
| `note_passation_v3.md` | Historique du projet, arbitrages, état d'avancement |
| `prototypes/` | Les six maquettes JSX validées du Bloc 3 — référence visuelle et fonctionnelle pour le portage |

En cas de doute sur une règle, **lire le cahier des charges avant de coder**.

---

*Toutes les données de ce dépôt sont fictives. Aucune donnée réelle du groupe ERANOVE n'y figure.*
