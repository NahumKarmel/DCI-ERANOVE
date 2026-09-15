# Tableau de bord Contrôle Interne Groupe ERANOVE
## Cahier des charges fonctionnel — Bloc 2

**Version** 1.5 — amendements issus de la validation du Bloc 3
**Date** 4 septembre 2026
**Version précédente** 1.4 — vocabulaire unifié : « filiale » remplace « unité de remontée »
**Commanditaire** Directeur Contrôle Interne Groupe, ERANOVE
**Source** `Tableau de bord DCI 2026_withMacro _ V3.xlsm`
**Destination** Document d'entrée pour développement sous Claude Code

---

## 0. Avertissement de lecture

Ce document est la spécification de référence. Toute règle y est numérotée (`RG-xx`) et doit être implémentée telle qu'écrite. Les règles marquées **[HYP]** sont des hypothèses de travail à confirmer avant développement ; elles sont regroupées au chapitre 11.

**Point de vigilance terminologique.** Le sigle `SDRM` désigne ici la **Sous-Direction Risk Management de GS2E**, l'une des deux sous-directions par lesquelles GS2E remonte ses indicateurs. Il ne renvoie pas au projet homonyme, qui est une application distincte et sans lien avec celle-ci.

---

## 0 bis. Journal des amendements — version 1.5

Cette version intègre les décisions prises pendant la construction et la validation des maquettes du Bloc 3. Toutes ont été arbitrées par le commanditaire du projet.

| Réf. | Objet de l'amendement | Chapitre |
|---|---|---|
| **A-01** | L'objectif de référence est **toujours** celui du référentiel groupe. Toute dérogation décidée par le Directeur doit être signalée par un avertissement explicite, en plus du marquage visuel. Nouvelle règle **RG-24 bis**. | 5.6 |
| **A-02** | Lorsque l'objectif applicable diffère entre N-1 et N, la comparaison porte un avertissement propre. Nouvelle règle **RG-28 bis**. | 5.8 |
| **A-03** | La réouverture d'une période dispose de **deux points d'entrée** : la fiche filiale (V5) et le suivi des remontées (V7). Règle **RG-31** complétée. | 6.1, 8 |
| **A-04** | **Suppression du classement des filiales en V6.** L'écran compare sans hiérarchiser : tableau triable, aucun rang attribué. | 8 |
| **A-05** | L'historique des saisies en V5 s'ouvre sur les **trois derniers mois**, avec dépliage sur l'exercice complet. | 8 |
| **A-06** | Le jeu de démonstration comporte une liste canonique de **saisies en brouillon**, seule source de mois partiels. Nouveau chapitre 10.5. | 10.5 |
| **A-07** | Correction de défauts de rédaction hérités d'un remplacement global de vocabulaire en version 1.4 (chapitres 0, 1.1, 2.1, 2.2). | 0, 1, 2 |
| **A-08** | Mise en cohérence du chapitre 10 avec les maquettes livrées : profils de performance, cas limites, pièces jointes. | 10.2, 10.3 |

---

## 1. Contexte et objet

### 1.1 Situation actuelle

Le Contrôle Interne Groupe pilote sept indicateurs de performance remontés mensuellement par douze filiales déclarantes. Le dispositif repose aujourd'hui sur un classeur Excel macro comportant un onglet de saisie unique, quatre tableaux croisés dynamiques masqués et un onglet de statistiques bâti sur des formules `AVERAGEIFS`.

Limites constatées à l'audit du fichier :

| Constat | Effet |
|---|---|
| Liste de validation « Filiales » pointant sur `#REF!` | Aucun contrôle de saisie, risque de doublons orthographiques |
| Fichier unique partagé | Pas de saisie simultanée, versions concurrentes |
| Actualisation manuelle des TCD | Le tableau de bord affiche des données périmées sans le signaler |
| Moyennes mensuelles sur ratios cumulatifs | Résultats annuels mathématiquement faux |
| `AVERAGEIF(...;">0")` | Les mois à performance nulle réelle sont exclus du calcul, biais à la hausse |
| `MIN(1;num/dén)` | Surperformance invisible |
| Aucune traçabilité | Impossible de savoir qui a saisi quoi et quand |
| Aucune preuve | Les valeurs ne sont adossées à aucun justificatif |

### 1.2 Objet de l'application

Remplacer ce dispositif par une application web multi-utilisateurs permettant :

1. à chaque correspondant de saisir les indicateurs de son entité et de suivre leur évolution ;
2. au Directeur CI Groupe de consulter en temps réel la consolidation des douze filiales, de piloter les objectifs et de commenter ;
3. de tracer intégralement les saisies, modifications et réouvertures de période.

### 1.3 Ce qui n'est pas dans le périmètre

- Aucun circuit de validation hiérarchique des saisies (arbitrage C10).
- Aucune pondération des indicateurs (arbitrage B9).
- Aucune interface avec un système tiers (ERP, GRC, annuaire d'entreprise).
- Aucune reprise de l'historique Excel : le fichier source ne contient que 28 lignes renseignées sur 756.

---

## 2. Périmètre organisationnel

### 2.1 Entités juridiques

Onze entités juridiques : **GS2E, CIE, SODECI, KEKELI, CIPREL, ATINKOU, ASOKH, SDER, OMILAYE, AWALE, SMART ENERGY**.

> AWALE et SMART ENERGY ne figuraient pas au fichier Excel source. Leur absence était une omission ; elles sont intégrées au périmètre en version 1.3.

### 2.2 Filiales déclarantes

**Vocabulaire retenu.** L'application ne connaît qu'un seul terme : **filiale**. La notion d'« unité de remontée » est abandonnée, en interface comme en base de données.

Conséquence assumée : GS2E, qui remonte par deux sous-directions, compte pour **deux filiales déclarantes** dans l'application — GS2E — SDCI et GS2E — SDRM. C'est cohérent avec l'arbitrage retenu au chapitre 2.3 (option a, deux lignes distinctes, aucune consolidation). L'entité juridique de rattachement reste consultable via l'attribut `entite_juridique`, mais elle ne pilote aucun calcul.

**Simplification obtenue** : l'entité `unite_remontee` disparaît du modèle. Une table de moins, une jointure de moins, un chemin d'autorisation de moins à tester.

| Filiale déclarante | Entité juridique | Indicateurs portés |
|---|---|---|
| GS2E — SDCI | GS2E | 7 |
| GS2E — SDRM | GS2E | 4 |
| CIE | CIE | 7 |
| SODECI | SODECI | 7 |
| KEKELI | KEKELI | 7 |
| CIPREL | CIPREL | 7 |
| ATINKOU | ATINKOU | 7 |
| ASOKH | ASOKH | 7 |
| SDER | SDER | 7 |
| OMILAYE | OMILAYE | 7 |
| AWALE | AWALE | 7 |
| SMART ENERGY | SMART ENERGY | 7 |

**Total : 12 filiales déclarantes pour 11 entités juridiques.**

**RG-01** — Un correspondant est rattaché à exactement une filiale. GS2E — SDCI et GS2E — SDRM ont chacune leur correspondant.

**RG-02** — La vue consolidée du Directeur affiche **douze lignes**, une par filiale déclarante. GS2E apparaît deux fois. Conséquence assumée : GS2E contribue à hauteur de deux filiales sur douze à la moyenne groupe.

### 2.3 Affectation des indicateurs

La filiale **GS2E — SDRM** ne porte pas les indicateurs QCI, TCI et Recommandations comités d'audit.

| Indicateur | GS2E — SDRM | Toutes les autres filiales |
|---|---|---|
| 1. Plan de Contrôle Interne | Oui | Oui |
| 2. Cartographies de risques | Oui | Oui |
| 3. Actions de maîtrise des risques | Oui | Oui |
| 4. QCI | **Non** | Oui |
| 5. TCI | **Non** | Oui |
| 6. Recommandations séminaires / journées CI | Oui | Oui |
| 7. Recommandations comités d'audit | **Non** | Oui |

**RG-03** — L'affectation d'un indicateur à une filiale est portée par l'entité `affectation` et paramétrable par exercice. Un indicateur non affecté est invisible en saisie et **exclu du dénominateur** de tous les calculs de score et de taux de remontée de cette filiale.

**Nombre d'affectations attendues par exercice : 11 × 7 + 4 = 81.**

---

## 3. Référentiel des indicateurs

| # | Code | Libellé | Numérateur | Dénominateur | Objectif groupe |
|---|---|---|---|---|---|
| 1 | `PCI` | Taux de mise en œuvre du Plan de Contrôle Interne | Nb activités réalisées | Nb activités planifiées | 100 % |
| 2 | `CARTO` | Taux de réalisation ou mise à jour des cartographies de risques | Nb cartos réalisées ou mises à jour | Nb cartos à réaliser ou mettre à jour | 50 % |
| 3 | `AMR` | Taux de mise en œuvre des actions de maîtrise des risques niveaux 1 & 2 | Nb reco. traitées à 100 % | Nb reco. émises | 80 % |
| 4 | `QCI` | Taux de réalisation des Questionnaires de Contrôle Interne planifiés | Nb QCI administrés | Nb QCI planifiés | 60 % |
| 5 | `TCI` | Taux de réalisation des Tests de Contrôle Interne planifiés | Nb TCI administrés | Nb TCI planifiés | 100 % |
| 6 | `RECO_SEM` | Taux de mise en œuvre des recommandations issues des séminaires du cercle CI / journées CI | Nb reco. traitées à 100 % | Nb reco. émises | 75 % |
| 7 | `RECO_CA` | Taux de mise en œuvre des recommandations issues des comités d'audit | Nb reco. traitées à 100 % | Nb reco. émises | 100 % |

**RG-04** — Les sept indicateurs sont en mode de calcul `CUMUL` (arbitrage B5). Le numérateur et le dénominateur saisis un mois M représentent le cumul depuis le 1er janvier de l'exercice.

**RG-05** — L'attribut `mode_calcul` est porté par l'indicateur et prend les valeurs `CUMUL` ou `FLUX`. Il est modifiable par le Directeur CI Groupe. Le moteur de calcul doit implémenter les deux modes dès la première version, même si aucun indicateur n'est en `FLUX` aujourd'hui. Cette exigence est structurante : elle évite toute reprise de données le jour où l'arbitrage B5 est révisé.

**RG-06** — Les sept indicateurs ont un poids égal (arbitrage B9). Aucun coefficient n'est modélisé.

---

## 4. Rôles et habilitations

### 4.1 Les quatre rôles

| Rôle | Périmètre de données | Peut saisir | Gère les comptes |
|---|---|---|---|
| **Correspondant** | Son filiale uniquement | Oui | Non, sauf attribut administrateur |
| **Directeur CI Groupe** | Toutes les filiales | Non | Oui, sans restriction |
| **Lecteur** | Toutes les filiales, en lecture seule | Non | Non |
| **Administrateur pur** | **Aucun** | Non | Oui |

### 4.2 L'attribut administrateur

**RG-07** — `est_administrateur` est un attribut booléen cumulable avec un rôle métier, et non un rôle exclusif. Il confère uniquement des droits de gestion des comptes utilisateurs. **Il ne confère aucun droit de lecture sur les données d'indicateurs.**

**RG-08** — Un administrateur ne peut pas modifier son propre rattachement de filiale, ni s'auto-attribuer un périmètre de données élargi. Seul le Directeur CI Groupe peut modifier un rattachement de filiale.

**RG-09** — Seul le Directeur CI Groupe peut créer un compte de rôle « Administrateur pur ». Ce compte n'a aucun rattachement de filiale et aucun accès aux écrans de données.

**Porteurs de l'attribut administrateur à l'ouverture du service :**

| Utilisateur | Rôle métier | Administrateur | Périmètre données |
|---|---|---|---|
| Directeur CI Groupe | Directeur | Oui | 12 filiales |
| Correspondant GS2E — SDRM | Correspondant | Oui | GS2E — SDRM |
| Administrateur externe *(optionnel)* | — | Oui | Aucun |

### 4.3 Matrice des habilitations par écran

| Écran | Correspondant | Directeur | Lecteur | Admin pur |
|---|---|---|---|---|
| V1 Connexion | ● | ● | ● | ● |
| V2 Saisie mensuelle | ● sa filiale | — | — | — |
| V3 Mes indicateurs (évolution) | ● sa filiale | — | — | — |
| V4 Dashboard consolidé | — | ● | ● lecture | — |
| V5 Détail par filiale | — | ● | ● lecture | — |
| V6 Détail par indicateur | — | ● | ● lecture | — |
| V7 Suivi des remontées | ● sa filiale | ● | ● lecture | — |
| V8 Administration des comptes | ● si attribut | ● | — | ● |
| V9 Paramétrage référentiel et objectifs | — | ● | — | — |
| V10 Journal d'audit | — | ● | — | — |

**RG-10** — Le cloisonnement des données est appliqué au niveau de la couche d'accès aux données, jamais uniquement au niveau de l'affichage. Toute requête portant sur les saisies, commentaires ou pièces jointes filtre par `filiale_id` selon le contexte de l'utilisateur authentifié.

---

## 5. Règles de calcul

### 5.1 Taux élémentaire

**RG-11** — `taux = numerateur / denominateur`

**RG-12** — Aucun plafonnement (arbitrage B8). Un taux supérieur à 100 % est stocké et affiché tel quel, avec un marquage visuel distinct de l'état « objectif atteint ».

**RG-13** — Si `denominateur = 0`, le taux est **non calculable** (`NULL`). Il n'est pas assimilé à 0. Une saisie à dénominateur nul est acceptée — elle signifie légitimement « rien n'était planifié ce mois-ci » — mais elle est exclue des moyennes et signalée dans l'interface par la mention « n/a ». *Ce point corrige une erreur du fichier Excel source, qui retournait 0 et faisait chuter artificiellement les moyennes.*

**RG-14** — `numerateur` et `denominateur` sont des entiers positifs ou nuls. Le numérateur peut dépasser le dénominateur (surperformance).

### 5.2 Valeur annuelle

**RG-15** — Mode `CUMUL` : la valeur de l'exercice pour un couple filiale × indicateur est le **taux du dernier mois saisi**. Aucune moyenne n'est calculée sur les douze mois.

**RG-16** — Mode `FLUX` : la valeur de l'exercice est `Σ numérateurs / Σ dénominateurs` sur les mois saisis. Jamais la moyenne des taux mensuels.

### 5.3 Score d'une filiale

**RG-17** — Le score d'une filiale pour un mois donné est la **moyenne arithmétique des taux calculables** de ses indicateurs affectés pour ce mois. Les indicateurs non affectés et les taux non calculables sont exclus du numérateur **et** du dénominateur de la moyenne.

> Illustration : GS2E — SDRM porte 4 indicateurs. Si l'un d'eux présente un dénominateur nul en mars, son score de mars est la moyenne de 3 taux, pas de 4, et surtout pas de 7.

### 5.4 Moyenne groupe

**RG-18** — La moyenne groupe pour un mois est la moyenne arithmétique des scores des douze filiales ayant un score calculable ce mois-là. Une filiale n'ayant pas saisi est exclue du calcul et signalée dans le suivi des remontées ; elle n'est jamais comptée comme 0.

### 5.5 Statut par rapport à l'objectif

**RG-19** — Trois statuts :

| Statut | Condition |
|---|---|
| `ATTEINT` | `taux >= objectif` au mois considéré |
| `EN_COURS` | `taux < objectif` |
| `NON_CALCULABLE` | dénominateur nul ou absence de saisie |

**RG-20** — Le statut reflète la situation réelle du mois courant (arbitrage M3). Un indicateur cumulé peut repasser en `EN_COURS` après avoir été `ATTEINT`, si le dénominateur augmente en cours d'exercice.

**RG-21** — La date du **premier franchissement** de l'objectif est conservée par couple filiale × indicateur × exercice. Elle est affichée en information sur la fiche détail, y compris si le statut est redevenu `EN_COURS`.

**RG-22** — La comparaison à l'objectif est **informative en cours d'exercice** et **conclusive en fin d'exercice** (arbitrage B6, option b). Aucune proratisation mensuelle de l'objectif n'est calculée.

### 5.6 Objectifs

**RG-23** — L'objectif est porté par l'affectation, donc par le triplet filiale × indicateur × exercice. À la création d'un exercice, chaque affectation est initialisée avec l'objectif groupe défini au référentiel.

**RG-24** — Le Directeur CI Groupe peut modifier l'objectif d'une affectation donnée (arbitrage B7). Toute modification est journalisée avec valeur avant, valeur après, auteur et horodatage.

**RG-24 bis** *(amendement A-01)* — **L'objectif de référence présenté à l'utilisateur est toujours celui du référentiel groupe.** Lorsqu'une affectation porte un objectif modifié par le Directeur, dit *objectif dérogatoire*, l'interface doit produire trois signaux conjoints :

1. un **marquage visuel** de la valeur concernée, distinct de tout autre marquage ;
2. le **rappel de l'objectif groupe** à proximité immédiate — ligne de référence sur les graphiques d'évolution, mention en tête de colonne sur les tableaux ;
3. un **avertissement en clair**, nommant l'objectif groupe, l'objectif retenu, l'affectation concernée et l'exercice concerné, et précisant que le statut, le score de la filiale et le code couleur sont calculés sur l'objectif dérogatoire.

Un marquage visuel seul est insuffisant. Un objectif abaissé change la lecture de la performance : il doit être lu comme une décision de gouvernance, jamais confondu avec un résultat.

Cette règle s'applique aux écrans V3, V4, V5 et V6.

### 5.7 Taux de remontée

**RG-25** — `taux de remontée d'une filiale pour un mois = nb saisies renseignées / nb affectations actives`. Pour GS2E — SDRM, le dénominateur est 4 ; pour les autres, 7.

**RG-26** — `taux de remontée groupe pour un mois = nb saisies renseignées toutes filiales / 81`.

### 5.8 Comparaison N-1

**RG-27** — La comparaison avec l'exercice précédent porte sur le **même mois** de l'exercice N-1, et non sur la valeur de clôture N-1. L'écart est exprimé en points de pourcentage.

**RG-28** — Si l'exercice N-1 n'existe pas ou si le mois correspondant n'est pas saisi, la comparaison affiche « non disponible ». Aucune valeur n'est extrapolée.

**RG-28 bis** *(amendement A-02)* — Lorsque l'objectif applicable à une affectation **diffère entre l'exercice N-1 et l'exercice N**, la comparaison porte un avertissement propre, indiquant les deux objectifs et précisant que l'écart en points compare deux taux et non deux niveaux d'exigence identiques. L'écart reste affiché : il n'est ni masqué, ni corrigé, ni proratisé.

**RG-28 ter** — Si l'exercice N-1 n'existe pas dans le dispositif, la fonction de comparaison est **désactivée** dans l'interface, et non simplement laissée sans effet. Une filiale intégrée en cours de dispositif, sans historique N-1, affiche « n.d. » sur l'ensemble de ses indicateurs et reste exclue des moyennes.

---

## 6. Cycle de saisie

### 6.1 Fenêtre de saisie

**RG-29** — Le mois M est saisissable du **1er au 10 du mois M+1 inclus**, jusqu'à 23h59 heure d'Abidjan (UTC+0). Au-delà, la période est close.

**RG-30** — Une période close est en lecture seule pour le correspondant. Les valeurs restent visibles.

**RG-31** — Le Directeur CI Groupe peut rouvrir une période close (arbitrage M5a). La réouverture porte sur un couple filiale × mois, exige un motif textuel obligatoire, et est journalisée. Elle définit une date de fermeture de la réouverture.

**RG-31 bis** *(amendement A-03)* — La réouverture dispose de **deux points d'entrée**, qui déclenchent la même action et la même journalisation :

- depuis la **fiche filiale (V5)**, avec sélection du mois — le Directeur qui constate un trou en consultant une fiche agit sans changer d'écran ;
- depuis le **suivi des remontées (V7)**, sur la cellule sélectionnée — le mois est alors déterminé par la cellule.

Le correspondant ne dispose d'aucun de ces deux points d'entrée. L'écran V7 lui indique explicitement que seul le Directeur peut rouvrir une période, et que les valeurs déjà saisies restent visibles sans être modifiables.

**RG-31 ter** — Une période rouverte porte un état visuel distinct de « ouverte » et de « close », dans tous les écrans où elle apparaît. Le motif de la réouverture est consultable depuis cet état.

**RG-32** — Un mois non saisi reste un **trou** (arbitrage M5b). Aucun report de la dernière valeur connue. Dans les graphiques d'évolution, la courbe est interrompue ; aucune interpolation n'est tracée.

### 6.2 Saisie

**RG-33** — La saisie s'effectue par filiale, exercice et mois. Le correspondant renseigne le numérateur et le dénominateur ; le taux est calculé et affiché en temps réel, jamais saisi.

**RG-34** — Une saisie est identifiée de façon unique par le quadruplet `(filiale_id, indicateur_id, exercice, mois)`. Contrainte d'unicité en base.

**RG-35** — Chaque saisie enregistre l'auteur de la création et, le cas échéant, l'auteur et la date de la dernière modification.

**RG-36** — Le correspondant peut modifier ses saisies tant que la période est ouverte. Chaque modification produit une entrée au journal d'audit avec valeur avant et valeur après.

**RG-37** — Un **commentaire de saisie est obligatoire** pour chaque indicateur renseigné. Une saisie dont le numérateur et le dénominateur sont fournis mais dont le commentaire est vide est enregistrable en brouillon, mais n'est **pas comptée comme renseignée** dans le taux de complétude ni dans le taux de remontée. Ce commentaire est distinct du fil de commentaires du chapitre 7 : il documente la valeur du mois, là où le fil porte la discussion sur l'exercice.

**RG-37 bis** — Un indicateur est considéré comme *renseigné* si et seulement si le numérateur, le dénominateur **et** le commentaire de saisie sont fournis. Cette définition s'applique à RG-25 et RG-26.

**RG-37 ter** *(amendement A-06)* — Une saisie en brouillon a un double statut qu'il faut assumer dans toute l'interface : **sa valeur existe et s'affiche**, donc elle alimente les taux, les courbes, les scores et les moyennes ; **elle n'est pas renseignée**, donc elle est exclue du taux de complétude et du taux de remontée. Les écrans de suivi doivent la distinguer explicitement d'un mois non saisi :

| État | Valeur affichée | Comptée comme renseignée | Représentation attendue |
|---|---|---|---|
| Renseigné | Oui | Oui | État normal |
| **Brouillon** | **Oui** | **Non** | Mention « commentaire manquant — saisie en brouillon » |
| Non saisi | Non | Non | Trou, courbe interrompue |
| Non calculable | « n/a » | Oui — la saisie existe | Exclu des moyennes |

Le brouillon est la **seule** source de complétude partielle sur un mois : une filiale qui ne saisit pas ne saisit rien, un mois partiel résulte donc toujours d'un ou plusieurs commentaires manquants.

### 6.3 Pièces jointes

**RG-38** — Une saisie peut porter zéro à N pièces jointes justificatives. La pièce jointe est **facultative et non bloquante** — contrairement au commentaire de saisie (RG-37) : son absence n'empêche ni l'enregistrement, ni la remontée, ni le calcul.

**RG-39** — Formats acceptés : **PDF**, **Excel (XLSX, XLS)**, **Word (DOCX, DOC)**, **PowerPoint (PPTX, PPT)**, **images (PNG, JPG, JPEG)**. Taille maximale par fichier : **10 Mo**. Tout autre format est refusé à l'envoi avec un message explicite.

**RG-40** — Les pièces jointes suivent le cloisonnement de leur saisie : seuls les acteurs habilités sur la filiale concernée y accèdent.

---

## 7. Commentaires

**RG-41** — Un fil de commentaires existe par triplet **filiale × indicateur × exercice** (arbitrage M2). Il est accessible depuis la fiche détail de l'indicateur.

**RG-42** — Chaque message porte son auteur, son rôle et son horodatage. Les messages ne sont ni modifiables ni supprimables une fois publiés. *Le fil constitue une trace d'échange dans un dispositif de contrôle interne ; sa mutabilité en détruirait la valeur probante.*

**RG-43** — Le fil est visible de tous les acteurs habilités **sur cette filiale** : ses correspondants, le Directeur CI Groupe, les lecteurs (arbitrage M1). Un correspondant ne voit jamais le fil d'une autre filiale.

**RG-44** — Un commentaire publié par le Directeur est immédiatement visible par le correspondant concerné, sans action de sa part, et signalé par une notification dans l'application (arbitrage C10).

**RG-45** — Les deux correspondants de GS2E partagent les fils de leur propre filiale uniquement. GS2E — SDCI ne voit pas les fils de GS2E — SDRM, et réciproquement, conformément au principe de cloisonnement par filiale déclarante.

---

## 8. Écrans

### V1 — Connexion
Authentification par email et mot de passe. Redirection selon le rôle : Correspondant → V2 ; Directeur → V4 ; Lecteur → V4 en lecture seule ; Administrateur pur → V8.

### V2 — Saisie mensuelle *(Correspondant)*
- Sélecteur d'exercice et de mois, positionné par défaut sur la dernière période ouverte.
- Un bloc par indicateur affecté : libellé, mode de calcul en clair, champs numérateur et dénominateur avec leurs libellés métier, taux calculé en direct, objectif de la filiale, statut.
- Indicateur visuel de la fenêtre de saisie : période ouverte, jours restants, ou période close.
- Champ de commentaire **obligatoire** par indicateur, et zone de dépôt de pièces jointes facultative.
- Bandeau de complétude : « 5 / 7 indicateurs renseignés ».
- Enregistrement partiel autorisé : le correspondant n'est jamais contraint de tout saisir en une fois.

### V3 — Mes indicateurs *(Correspondant)*
- Courbes d'évolution mensuelle des indicateurs de sa filiale, avec ligne d'objectif en référence.
- Trous affichés comme tels, courbe interrompue.
- Comparaison N-1 activable.
- Accès aux fils de commentaires de sa filiale.
- Export PDF et Excel de son périmètre.

### V4 — Dashboard consolidé *(Directeur, Lecteur)*
- Sélecteur d'exercice et de mois. Le sélecteur d'exercice conditionne le nombre de mois ouverts, l'état de la période et la disponibilité de la comparaison N-1 (RG-28 ter).
- Cartouche de synthèse : moyenne des filiales, taux de remontée groupe, nombre de filiales ayant atteint l'ensemble de leurs objectifs, nombre de filiales en retard de saisie.
- Tableau de douze lignes × sept colonnes d'indicateurs, taux et statut par cellule, cellules grisées pour les indicateurs non affectés.
- Colonne de score par filiale, ligne de moyenne par indicateur.
- Classement des filiales par score.
- Filtres : filiale, indicateur, statut.
- Export PDF et Excel.

### V5 — Détail par filiale *(Directeur, Lecteur)*
- Sélecteur d'exercice, sélecteur de filiale, mois de référence, comparaison N-1.
- Fiche d'identité : entité juridique, correspondant, nombre d'indicateurs affectés, mention de périmètre réduit le cas échéant.
- Cartouche de synthèse : score au mois de référence, position dans le groupe, objectifs atteints, complétude du mois.
- Une carte par indicateur affecté : courbe d'évolution, ligne d'objectif appliqué, ligne d'objectif groupe en cas de dérogation, trous, comparaison N-1, date de premier franchissement.
- Avertissement d'objectif dérogatoire conforme à **RG-24 bis**, et avertissement de comparaison conforme à **RG-28 bis**.
- Trois panneaux de traçabilité par indicateur :
  - **Historique des saisies** — numérateur, dénominateur, taux, commentaire de saisie, auteur, horodatage, mention de modification, mention de période rouverte, et mention « commentaire manquant — saisie en brouillon » (RG-37 ter). *(amendement A-05)* L'historique s'ouvre sur les **trois derniers mois**, avec une commande de dépliage sur l'exercice complet et un compteur des mois masqués. Le dépliage est indépendant pour chaque indicateur.
  - **Pièces jointes** — regroupées par mois, avec déposant et date.
  - **Fil de commentaires** — publiable par le Directeur, avec mention de la notification au correspondant.
- Journal des événements de la filiale : ouverture d'exercice, modifications d'objectif avec valeur avant et après, réouvertures avec motif, modifications de saisie.
- Action de **réouverture de période** conforme à RG-31 bis.

### V6 — Détail par indicateur *(Directeur, Lecteur)*
- Sélecteur d'indicateur, d'exercice et de mois de référence.
- Fiche de l'indicateur : libellé complet, mode de calcul en clair, libellés numérateur et dénominateur, objectif groupe, nombre de filiales porteuses et rappel des filiales non affectées.
- Cartouche : moyenne au mois de référence, nombre de filiales au-dessus de leur objectif appliqué, dispersion entre les extrêmes, taux de remontée sur l'indicateur.
- **Graphique de comparaison.** Les courbes de toutes les filiales porteuses sont superposées. Le nuage est tracé en gris neutre ; **trois courbes seulement sont mises en avant** : le taux le plus élevé au mois de référence, le taux le plus bas, et la filiale sélectionnée. La sélection se fait au clic sur une courbe ou sur une ligne du tableau, et se retire de la même façon. Une courbe de **moyenne groupe** est superposée, activable, calculée en excluant les filiales non saisies (RG-18).
- **Aucun classement n'est produit** *(amendement A-04)*. Le tableau comparatif se trie sur demande — nom, taux, atteinte, écart N-1 — mais n'attribue aucun rang, aucune position et aucune distinction visuelle de tête ou de queue de liste autres que les deux extrêmes du graphique.
- Le tableau affiche côte à côte le **taux brut** et l'**atteinte**, cette dernière rapportant le taux à l'objectif réellement applicable à la filiale. Les deux mesures ne produisent pas le même ordre dès qu'une dérogation existe ; c'est précisément ce que l'écran doit rendre visible plutôt que de trancher à la place du Directeur.
- Objectifs dérogatoires visibles et signalés conformément à RG-24 bis.

### V7 — Suivi des remontées *(tous, périmètre variable)*
- Sélecteur d'exercice. Périmètre déterminé par le rôle : douze filiales pour le Directeur et le Lecteur, une seule pour le Correspondant.
- Cartouche : taux de remontée de l'exercice, nombre de périodes closes incomplètes, nombre de filiales sans retard, nombre de réouvertures accordées.
- Matrice filiales × mois, une cellule par couple, portant le compteur `renseignés / attendus` et un code couleur : complet, partiel, absent, période rouverte, période non ouverte. La période en cours de saisie porte un état visuel distinct et **n'est jamais comptée comme un retard**.
- Ligne de synthèse : taux de remontée groupe par mois et nombre de filiales complètes.
- Détail au survol. Au clic, un panneau détaille le couple filiale × mois en trois colonnes : indicateurs **renseignés**, indicateurs **en brouillon** et indicateurs **non saisis**, chacune assortie de l'explication de son statut (RG-37 ter).
- Pour le Directeur : action de **réouverture de période** avec motif obligatoire (RG-31, RG-31 bis), et journal des réouvertures de l'exercice avec auteur, date et motif.
- Pour le Correspondant : matrice réduite à sa filiale, aucune action de réouverture, message explicite indiquant que seul le Directeur peut rouvrir une période.

### V8 — Administration des comptes *(Directeur, porteurs de l'attribut administrateur, Administrateur pur)*
- Liste des utilisateurs, avec rôle, filiale de rattachement, statut actif ou désactivé.
- Création, modification, désactivation. Aucune suppression physique.
- Le rattachement de filiale n'est modifiable que par le Directeur (RG-08).
- La création d'un Administrateur pur n'est possible que pour le Directeur (RG-09).

### V9 — Paramétrage *(Directeur)*
- Référentiel des indicateurs : libellés, modes de calcul, libellés numérateur et dénominateur, objectif groupe, activation.
- Ouverture d'un exercice : génération des 81 affectations avec objectifs initialisés.
- Modification d'un objectif par affectation.
- Gestion des filiales et de leur rattachement juridique.

### V10 — Journal d'audit *(Directeur)*
- Consultation filtrable de toutes les actions journalisées : saisies, modifications, réouvertures, changements d'objectif, mouvements de comptes.
- Export.

---

## 9. Modèle de données

### 9.1 Entités

```
filiale
  id                    PK
  code                  unique, ex. "GS2E_SDRM", "CIE"
  libelle               ex. "GS2E — SDRM"
  entite_juridique      ex. "GS2E" — information de rattachement, ne pilote aucun calcul
  logo                  chemin ou données
  ordre_affichage       int
  actif                 bool

indicateur
  id                    PK
  code                  unique, ex. "QCI"
  libelle
  mode_calcul_texte     ex. "Nb QCI administrés / Nb QCI planifiés"
  libelle_numerateur
  libelle_denominateur
  mode_calcul           enum { CUMUL, FLUX }
  objectif_defaut       decimal(6,4)   -- fraction, 0.60 = 60 %
  ordre_affichage       int
  actif                 bool

exercice
  annee                 PK, int
  statut                enum { OUVERT, CLOS }
  cree_le, cree_par

affectation
  id                    PK
  filiale_id              FK -> filiale
  indicateur_id         FK -> indicateur
  exercice              FK -> exercice
  objectif              decimal(6,4)   NOT NULL
  actif                 bool
  UNIQUE (filiale_id, indicateur_id, exercice)

saisie
  id                    PK
  filiale_id              FK -> filiale
  indicateur_id         FK -> indicateur
  exercice              FK -> exercice
  mois                  int 1..12
  numerateur            int >= 0, nullable
  denominateur          int >= 0, nullable
  commentaire_saisie    text, nullable   -- NULL avec num/den renseignes = brouillon (RG-37 ter)
  cree_par              FK -> utilisateur
  cree_le               timestamp
  modifie_par           FK -> utilisateur, nullable
  modifie_le            timestamp, nullable
  UNIQUE (filiale_id, indicateur_id, exercice, mois)

piece_jointe
  id                    PK
  saisie_id             FK -> saisie
  nom_fichier
  chemin_stockage
  type_mime
  taille_octets
  depose_par            FK -> utilisateur
  depose_le             timestamp

commentaire
  id                    PK
  filiale_id              FK -> filiale
  indicateur_id         FK -> indicateur
  exercice              FK -> exercice
  auteur_id             FK -> utilisateur
  corps                 text
  cree_le               timestamp
  lu_par                -- table de liaison pour la notification

franchissement_objectif
  id                    PK
  filiale_id, indicateur_id, exercice
  mois_premier_franchissement   int
  date_enregistrement           timestamp
  UNIQUE (filiale_id, indicateur_id, exercice)

utilisateur
  id                    PK
  email                 unique
  nom, prenom
  mot_de_passe_hash
  role                  enum { CORRESPONDANT, DIRECTEUR, LECTEUR, ADMIN_PUR }
  filiale_id              FK -> filiale, nullable
  est_administrateur    bool
  actif                 bool
  cree_par, cree_le
  derniere_connexion

reouverture_periode
  id                    PK
  filiale_id              FK -> filiale
  exercice, mois
  motif                 text NOT NULL
  ouvert_par            FK -> utilisateur
  ouvert_le             timestamp
  ferme_le              timestamp, nullable

journal_audit
  id                    PK
  utilisateur_id        FK -> utilisateur
  action                enum { CREATION_SAISIE, MODIF_SAISIE, REOUVERTURE,
                               MODIF_OBJECTIF, CREATION_COMPTE, MODIF_COMPTE,
                               DESACTIVATION_COMPTE, MODIF_REFERENTIEL,
                               DEPOT_PIECE_JOINTE, PUBLICATION_COMMENTAIRE }
  entite                varchar
  entite_id             int
  valeur_avant          json, nullable
  valeur_apres          json, nullable
  horodatage            timestamp
```

### 9.2 Contraintes d'intégrité

| Code | Contrainte |
|---|---|
| CI-01 | `saisie` ne peut exister que si l'`affectation` correspondante existe et est active |
| CI-02 | Unicité stricte de `(filiale_id, indicateur_id, exercice, mois)` sur `saisie` |
| CI-03 | Un `utilisateur` de rôle `CORRESPONDANT` a obligatoirement un `filiale_id` |
| CI-04 | Un `utilisateur` de rôle `ADMIN_PUR` a obligatoirement `filiale_id = NULL` et `est_administrateur = true` |
| CI-05 | Un `utilisateur` de rôle `DIRECTEUR` a `filiale_id = NULL` et accède aux douze filiales |
| CI-09 | Un `utilisateur` de rôle `LECTEUR` a `filiale_id = NULL` et accède aux douze filiales en lecture seule |
| CI-06 | `numerateur >= 0` et `denominateur >= 0` |
| CI-07 | Aucune suppression physique d'utilisateur, de saisie ou de commentaire — désactivation uniquement |
| CI-08 | `objectif` sur `affectation` est NOT NULL, initialisé depuis `indicateur.objectif_defaut` |

### 9.3 Choix de modélisation à retenir

Cinq points méritent d'être soulignés à l'attention du développement :

1. **La table `affectation` porte trois responsabilités simultanées** : quels indicateurs une filiale doit remonter, quel objectif s'applique, et pour quel exercice. C'est elle qui permet de gérer l'exception GS2E — SDRM sans code conditionnel, et les objectifs différenciés sans table supplémentaire. Elle est le pivot du modèle.

2. **Le taux n'est jamais stocké.** Il est toujours dérivé de `numerateur / denominateur`. Un taux stocké est un taux qui finit par diverger de ses composantes.

3. **Les objectifs sont stockés en fraction** (`0.80`), jamais en pourcentage (`80`). Le formatage est une affaire d'affichage.

4. **L'état « brouillon » n'est pas une colonne.** Il se déduit de `commentaire_saisie IS NULL` sur une saisie dont le numérateur et le dénominateur sont renseignés (RG-37 bis, RG-37 ter). Ajouter un attribut `statut` créerait une seconde source de vérité susceptible de diverger de la donnée qu'elle est censée décrire. La règle est la même que pour le taux : ce qui se déduit ne se stocke pas.

5. **La dérogation d'objectif n'est pas un attribut de la filiale.** Elle se déduit de la comparaison entre `affectation.objectif` et `indicateur.objectif_defaut`. C'est ce qui permet à une dérogation d'exister sur un exercice et pas sur un autre, sans table de versionnement, et c'est ce qui rend RG-24 bis et RG-28 bis calculables à l'affichage.

---

## 10. Jeu de données de démonstration

Le Directeur CI Groupe doit pouvoir manipuler l'application avec des graphes vivants et tester tous les paramètres. Le jeu de données est **fictif** et doit être identifié comme tel dans l'interface par un bandeau permanent.

### 10.1 Volumétrie

| Exercice | Période | Statut |
|---|---|---|
| 2025 | Janvier à décembre, complet | Clos — sert de référence N-1 |
| 2026 | Janvier à juillet clos, août ouvert | En cours |

Août 2026 étant saisissable jusqu'au 10 septembre, la démonstration permet de tester en conditions réelles la fenêtre de saisie, la complétude partielle et le verrouillage.

### 10.2 Profils de performance

| Filiale | Profil |
|---|---|
| CIE | Performante, régulière, objectifs atteints tôt |
| SODECI | Performante avec un décrochage au deuxième trimestre puis redressement |
| GS2E — SDCI | Moyenne, progression linéaire |
| GS2E — SDRM | Moyenne, 4 indicateurs seulement — teste l'exclusion du calcul |
| KEKELI | Moyenne — dénominateur nul sur `TCI` en janvier et février |
| CIPREL | Régulière, proche des objectifs sans les atteindre |
| ATINKOU | Démarrage tardif, premières saisies en mars — teste les trous |
| ASOKH | Irrégulière, un mois manquant en mai — teste la courbe interrompue |
| SDER | En difficulté, écart marqué à l'objectif, objectif `AMR` atteint en avril puis reperdu |
| OMILAYE | En difficulté, non saisie sur août, objectif dérogatoire sur `PCI` — teste le suivi des remontées et RG-24 bis |
| AWALE | Entité récente, premières saisies en avril 2026, pas d'historique N-1 |
| SMART ENERGY | Performante et régulière |

### 10.3 Cas limites à couvrir obligatoirement

| Cas | Où le placer |
|---|---|
| Surperformance, taux > 100 % | CIE, indicateur `RECO_SEM`, à compter de juin |
| Dénominateur nul | KEKELI, indicateur `TCI`, en janvier et février |
| Mois entièrement non saisi | ASOKH, mai 2026 · OMILAYE, août 2026 |
| Démarrage tardif | ATINKOU à compter de mars · AWALE à compter d'avril |
| Absence totale d'historique N-1 | AWALE sur l'exercice 2025 — affichage « n.d. », exclusion des moyennes (RG-28 ter) |
| Saisie partielle sur un mois | Produite exclusivement par les brouillons du chapitre 10.5 |
| Commentaire de saisie manquant | Voir la liste canonique du chapitre 10.5 |
| Objectif atteint puis reperdu | SDER, indicateur `AMR` : atteint en avril, dénominateur augmenté en juin |
| Objectif dérogatoire | OMILAYE sur `PCI`, abaissé à 80 % au lieu de 100 %, **au titre du seul exercice 2026** — l'objectif 2025 reste à 100 %, ce qui déclenche RG-28 bis |
| Deux saisies concurrentes GS2E | Les deux filiales GS2E renseignent `PCI` et `CARTO` avec des valeurs distinctes |
| Fil de commentaires actif | Directeur → SDER sur `AMR`, trois échanges. Également OMILAYE, CIE, KEKELI, ASOKH et SODECI |
| Pièce jointe déposée | Réparties sur environ un mois sur deux, un à deux fichiers, formats variés. Aucune pièce sur une saisie en brouillon |
| Période rouverte | SODECI, mai 2026 · ATINKOU, mars 2026 |

### 10.4 Cohérence des cumuls

**RG-46** — Les données de démonstration doivent respecter la nature cumulative des indicateurs : sur une même année, le numérateur et le dénominateur sont **croissants ou stables** d'un mois sur l'autre. Un générateur produisant des valeurs aléatoires indépendantes par mois créerait des courbes en dents de scie qui décrédibiliseraient immédiatement la démonstration.

**RG-46 bis** — Le générateur est **déterministe** : une fonction de hachage appliquée au triplet `code filiale + code indicateur + exercice` produit toujours les mêmes valeurs. Cette exigence n'est pas technique mais démonstrative — un chiffre qui diffère d'un écran à l'autre détruit la crédibilité de l'ensemble. Tous les écrans partagent le même générateur, sans exception.

### 10.5 Saisies en brouillon — liste canonique

*(amendement A-06)*

Ces couples portent un numérateur et un dénominateur valides mais **aucun commentaire de saisie**. Ils sont donc affichés avec leur valeur, et exclus des taux de complétude et de remontée (RG-37, RG-37 bis, RG-37 ter). Ils constituent la **seule** source de mois partiels du jeu de démonstration.

| Filiale | Exercice | Mois | Indicateurs en brouillon | Effet attendu |
|---|---|---|---|---|
| CIPREL | 2026 | Juin | `QCI`, `TCI` | Période close et partielle — candidate à réouverture |
| KEKELI | 2026 | Juillet | `RECO_CA` | Période close et partielle |
| GS2E — SDCI | 2026 | Août | `CARTO`, `QCI`, `RECO_SEM` | Période ouverte, saisie en cours — jamais signalée en retard |
| SODECI | 2026 | Août | `TCI`, `RECO_CA` | Période ouverte, saisie en cours |
| SMART ENERGY | 2026 | Août | `RECO_CA` | Période ouverte, saisie en cours |
| SDER | 2026 | Août | `PCI`, `CARTO`, `AMR`, `QCI` | Période ouverte, remontée très partielle |
| CIE | 2025 | Novembre | `TCI` | Partiel sur un exercice clos |

**Cette liste est partagée entre les écrans V5 et V7.** Toute modification doit être répercutée sur les deux, sous peine de contradiction entre la fiche filiale et le suivi des remontées.

Aucun taux n'est modifié par cette liste : les brouillons n'ont d'effet que sur la complétude.

---

## 11. Hypothèses — statut confirmé

L'ensemble des hypothèses de la version 1.0 a été arbitré. Elles sont désormais des règles fermes.

| Réf. | Objet | Décision |
|---|---|---|
| HYP-1 | Fenêtre de saisie | **Confirmée.** Le mois M ouvre le 1er du mois M+1 et se ferme le 10 du mois M+1 à 23h59. Aucune saisie anticipée pendant le mois courant. RG-29 inchangée. |
| HYP-2 | Pièces jointes | **Précisée et étendue.** PDF, Excel, Word, PowerPoint et images, 10 Mo maximum par fichier. Voir RG-39 révisée. |
| HYP-3 | Périmètre des lecteurs | **Confirmée sans restriction.** Tout lecteur accède aux douze filiales en lecture seule. La table `lecteur_perimetre` est supprimée du modèle. |
| HYP-4 | Exercice 2025 fictif | **Confirmée.** Douze mois complets, servant de référence pour la comparaison N-1. |
| HYP-5 | Notifications | **Confirmée.** Notification en application uniquement. Aucun envoi d'email, aucune configuration SMTP. |

## 12. Ce que l'application apporte au-delà d'Excel

Argumentaire à l'attention du commanditaire, à conserver pour la présentation.

| Apport | Impossible dans le fichier actuel |
|---|---|
| Saisie simultanée par douze filiales | Fichier unique, verrouillage exclusif |
| Cloisonnement des données par filiale | Tout le monde voit tout |
| Traçabilité complète des saisies | Aucune |
| Justificatifs adossés aux valeurs | Aucun |
| Verrouillage automatique à J+10 | Aucune contrainte de délai |
| Suivi du taux de remontée en temps réel | Comptage manuel |
| Calculs corrects sur indicateurs cumulés | Moyennes mensuelles erronées |
| Distinction entre zéro réel et absence de donnée | Confondus |
| Surperformance visible | Plafonnée à 100 % |
| Objectifs différenciés par entité | Objectif unique groupe |
| Historique pluriannuel et comparaison N-1 | Un fichier par exercice |
| Dashboard toujours à jour | Actualisation manuelle des TCD |
| Échanges tracés entre Directeur et correspondants | Emails hors système |

---

## 13. Suite du projet

| Bloc | Contenu | Statut |
|---|---|---|
| Bloc 0 | Diagnostic du fichier Excel source | Terminé |
| Bloc 1 | Arbitrations fonctionnelles | Terminé — 25 décisions actées |
| Bloc 2 | Cahier des charges et modèle de données | **Ce document — version 1.5** |
| Bloc 3 | Maquette d'interface et validation ergonomique | **Terminé** — V2, V3, V4 v2, V5, V6 et V7 livrées et validées. V1 et V8 à V10 volontairement non maquettés, sans enjeu ergonomique |
| Bloc 4 | Environnement technique et développement sous Claude Code | À venir |
| Bloc 5 | Chargement du jeu de démonstration et recette | À venir |
| Bloc 6 | Présentation au Directeur CI Groupe | À venir |

---

*Document produit dans le cadre du projet Tableau de bord Contrôle Interne Groupe ERANOVE. Toutes les données figurant dans le jeu de démonstration sont fictives.*
