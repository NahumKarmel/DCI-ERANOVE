# Intégration continue

| Workflow | Rôle |
|---|---|
| `recette.yml` | Rejoue le verrou des six repères chiffrés sur PostgreSQL 16 nu, à chaque *pull request* et à chaque poussée sur `main`. |

La recette est un **verrou bloquant** (T5) : si un repère échoue, la régression
est dans le code, jamais dans le test. `tests/reperes.test.ts` ne se modifie
jamais pour faire passer un test.

## Ce que la CI ne protège pas

Elle protège les chiffres, les règles de calcul et l'absence de colonne `taux`.
Elle ne protège **ni** les habilitations, **ni** la fidélité aux maquettes,
**ni** la signalétique de RG-24 bis, **ni** les états visuels. Ces quatre
familles relèvent du contrôle humain après chaque lot.

## Encore absent

`CLAUDE.md` §9 prévoit un `Dockerfile` « vérifié par GitHub Actions ». Le
`Dockerfile` n'existe pas encore : sa vérification n'est donc pas couverte ici.
