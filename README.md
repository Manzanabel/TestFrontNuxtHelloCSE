# Test technique — Dev Frontend

Les objectifs sont listés dans le fichier [INSTRUCTIONS](./INSTRUCTIONS.md)

## Résumé de mon travail

- **Analyse complète** du code existant dans [`ANALYSIS.md`](./ANALYSIS.md) : technologies obsolètes, anti-patterns Vue/Nuxt, failles de sécurité, problèmes de performance et de structure, ainsi que 3 bugs identifiés et expliqués.

- **Plan de migration** vers une stack moderne dans [`MIGRATION.md`](./MIGRATION.md), avec justification des choix technologiques (TypeScript, Pinia, dayjs, SCSS) et méthodologie de migration progressive.

- **Refactorisation** de `components/TodoItem.vue` :
  - TypeScript
  - Retrait de lodash et moment de ce composant (remplacé par dayjs et du JS natif) ; ces deux libs restent utilisées ailleurs dans le projet (store, autres composants), leur retrait complet faisant partie du plan de migration décrit dans `MIGRATION.md`
  - Correction de la faille XSS et du bug de synchronisation avec l'API
  - Retrait de `vue3-styled-components` au profit de SCSS scoped
  - Tests unitaires (logique de formatage + comportement du composant)
  - Vuex volontairement conservé pour ce composant plutôt qu'une migration locale vers Pinia, pour éviter de créer deux sources de vérité désynchronisées avec les autres composants qui partagent le même state

- **Historique Git** : commits atomiques en Conventional Commits, chaque étape logique (fix, refactor, test, chore) séparée pour rester lisible et facile à suivre.
