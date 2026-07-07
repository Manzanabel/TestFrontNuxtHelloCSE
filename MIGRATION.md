# Plan de migration

## 1. Objectif

Ce plan de migration a pour but de rendre le projet plus sûr, plus léger et plus facile à maintenir, **sans tout réécrire d'un coup** : le site doit continuer à marcher à chaque étape. Cinq chantiers, du plus petit au plus grand, plus un chantier de style :

1. TypeScript
2. Extraction des strings en dur en constantes
3. Retrait de lodash
4. moment → dayjs
5. Vuex → Pinia
6. `vue3-styled-components` → SCSS

## 2. Choix technologiques et justification

### Typescript

Le projet a déjà un `tsconfig.json` et Nuxt 4 génère les types automatiquement (`.nuxt/tsconfig.json`), donc l'outillage est prêt sans configuration supplémentaire. Ça n'enlève pas le travail de typer chaque fichier (définir des interfaces comme `Todo`, ajouter des shims pour certaines libs), mais évite d'avoir à mettre en place TypeScript de zéro.

### Extraire les strings en dur en constantes

Le code utilise les mêmes valeurs à plusieurs endroits sans qu'elles soient définies une seule fois : les valeurs de filtre (`'all'`, `'active'`, `'completed'`), les noms de mutations Vuex (`'ADD_TODO'`, `'TOGGLE_TODO'`...), la route `/api/todos`. Aujourd'hui, une faute de frappe sur une de ces chaînes (ex. `'completd'`) ne serait vue qu'à l'exécution, sans erreur visible. En les mettant dans un fichier de constantes (ou en `enum`/union types une fois TypeScript en place), une faute de frappe devient une erreur au moment de compiler, pas un bug caché.

### Retrait de lodash

Chaque fonction utilisée a un équivalent natif en JavaScript moderne (cf. [audit lodash](docs/lodash_audit.md)). Rien ne justifie de garder la dépendance : pas d'usage avancé (chaînage complexe, currying...). On enlève une dépendance entière pour une solution native équivalente.

### dayjs plutôt que moment

- `moment` est en maintenance depuis 2020 (le projet le dit lui-même) : plus de nouvelles fonctionnalités, assez lourd (~70 Ko), et ses objets peuvent être modifiés par erreur (`.add()` change l'objet d'origine au lieu d'en créer un nouveau), ce qui cause des bugs classiques.
- `dayjs` a une API presque identique, donc le remplacement se fait presque ligne par ligne, sans tout réécrire.
- Beaucoup plus léger (~2 Ko), ses objets ne changent jamais après création, et on n'importe que ce dont on a besoin (`relativeTime`, `localizedFormat`, etc.).

### Pinia plutôt que Vuex

- C'est la solution recommandée officiellement par l'équipe Vue depuis 2022 ; Vuex n'est plus conseillé pour les nouveaux projets.
- Support TypeScript natif (pas besoin de typer `useStore` à la main, pas de `commit('STRING')` sans type).
- Écrit avec la Composition API, comme le reste des composants (`ref`, `computed`). Un seul style dans tout le projet.
- Plus facile à découper en petits modules testables qu'un store Vuex unique.
- Compatible avec le SSR nativement, ce qui sera utile si `ssr: false` est reconsidéré un jour (je l'espère!)

### `vue3-styled-components` → SCSS

`vue3-styled-components` ajoute une dépendance et du travail supplémentaire à l'exécution (lire les templates CSS en JS) pour un résultat que Vue sait déjà faire nativement avec le CSS scoped, sans lib. Passer en SCSS (`<style scoped lang="scss">`) permet de garder les styles proches du composant sans ce coût, avec des variables pour ne plus répéter les mêmes couleurs et espacements en dur (`#007bff`, `12px 15px`...) dans les 3 composants.

## 3. Méthodologie

### Principe : migrer par petits bouts, pas tout en même temps

Plutôt que "je fais tout le Typescript d'abord, puis tout Pinia" sur l'ensemble du projet en une fois, je migre **un composant à la fois** (ou une partie du store à la fois), en gardant l'app fonctionnelle entre chaque commit. Ça limite le risque de casser quelque chose, et chaque étape reste utilisable même si le planning global change.

### Étape 0 : écrire des tests avant de migrer

Avant de toucher au premier fichier, j'écris des tests sur ce que fait le code aujourd'hui (store : ajouter/cocher/supprimer/filtrer une todo ; composants : affichage et interactions de base). Ça remplace la vérification manuelle à chaque étape par une commande (`npm run test`) qui dit en quelques secondes si quelque chose s'est cassé.

Deux conséquences :

- Cette étape passe **avant** le point 1 ci-dessous, pas en même temps : sans elle, chaque changement doit être vérifié à la main dans le navigateur, ce qu'on veut justement éviter sur un projet qui va être modifié plusieurs fois pendant des semaines.
- Les tests vérifient ce que **l'utilisateur voit ou déclenche**, pas comment le code est écrit à l'intérieur (pas de test qui vérifie qu'on appelle bien `_.map`) : sinon ils cassent au moment même où on migre, au lieu de confirmer que ça marche toujours.

### Ordre : du plus petit au plus grand

L'idée est d'étaler l'effort dans le temps en commençant par ce qui est simple et à faible risque, pour garder les gros changements (le store, le style) pour la fin, une fois habitué au rythme de la migration.

1. **Typescript** en premier : c'est la base sur laquelle s'appuient les chantiers suivants (constantes en `enum`/union types plutôt qu'en JS, dayjs et Pinia avec un typage natif dès leur mise en place). Sur un projet de cette taille (un store, trois composants), il est réaliste de typer l'ensemble en une seule fois avant d'attaquer les chantiers suivants. Sur un projet plus large, avec beaucoup plus de fichiers et de dépendances entre eux, je ferais l'inverse : typer fichier par fichier au fil des autres chantiers, plutôt que de bloquer tout le reste du travail le temps d'un typage complet qui prendrait alors beaucoup plus de temps.
2. **Extraction des constantes** juste après : même niveau de risque que lodash (aucune logique changée), et ça se fait naturellement en rouvrant les mêmes fichiers qu'à l'étape 1.
3. **lodash** : chaque appel (`_.map`, `_.trim`, `_.cloneDeep`…) se remplace un par un, fichier par fichier, sans changer la logique. Aucune coordination nécessaire, risque presque nul, et bénéfice immédiat (une dépendance en moins, projet plus léger).
4. **moment → dayjs** : simple (API presque identique), mais ça touche une dépendance externe (installation, réglage de la langue française) plutôt que du JS pur.
5. **Vuex → Pinia** : le premier vrai gros changement, qui touche l'organisation du store. Arriver dessus avec des fichiers déjà nettoyés et typés rend le changement plus lisible et plus facile à relire.
6. **`vue3-styled-components` → SCSS** : gros changement aussi, mais sur l'affichage plutôt que la logique. Je le mets en dernier parce que c'est le changement le plus visible et le plus large (les 3 composants sont concernés), donc celui où je veux le moins d'autres migrations en cours en même temps.

### Migrer en même temps que les fonctionnalités, ou à part ?

Ça dépend du type de changement, donc je ferais deux choses différentes plutôt qu'un seul choix pour tout :

- **lodash, constantes, Typescript et dayjs, fichier par fichier : en même temps que les fonctionnalités.** Ce sont des changements limités à un seul fichier, avec peu de risque de conflit. Règle simple : "si tu ouvres ce fichier pour une fonctionnalité, tu le nettoies au passage". Ça évite de bloquer le développement pour un chantier de nettoyage à part, et ça répartit le travail sur plusieurs semaines sans y consacrer un temps dédié.
- **Vuex → Pinia et le passage à SCSS : à part, chacun sur une courte période dédiée.** Les deux touchent les mêmes composants de façon large, donc les faire en même temps que des fonctionnalités qui touchent le store ou le style multiplie le risque (conflits, bugs difficiles à attribuer à l'un ou à l'autre, relecture plus dure). Je préfère une courte période dédiée pour chacun, en évitant pendant ce temps les nouvelles fonctionnalités qui touchent le state ou le style concerné. Le reste du travail continue sans interruption.

Ce n'est donc pas "tout en même temps" ou "tout à part" : c'est une décision au cas par cas, selon le risque de conflit et la taille du changement.

### Comment ne pas casser l'existant

- **Cohabitation temporaire** : le fichier `vuex.client.js` et un futur store Pinia peuvent exister en même temps le temps du changement ; on migre une action à la fois et on vérifie dans le navigateur avant de supprimer l'ancien code.
- **Un commit par étape claire** : ex. `feat: setup pinia store`, `refactor: migrate TodoFilter to pinia`, `chore: replace moment with dayjs in TodoItem`, `refactor: remove lodash from vuex store`. Un historique qui montre la progression plutôt qu'un seul gros commit.
- **Les tests comme filet de sécurité en continu** : la suite écrite à l'étape 0 tourne à chaque commit de migration. Je proposerais aux devs de lancer les tests systématiquement en local avant tout commit + push pour éviter au maximum les commits de type "fix".
- **Pas de passage à Typescript en bloc** : `allowJs: true` reste actif tant que tous les fichiers ne sont pas migrés, pour ne jamais avoir un état où le projet ne compile plus à cause d'un fichier oublié.

### Risques identifiés

- Le state Vuex est actuellement changé en dehors des mutations (`props.todo.completed = !props.todo.completed` dans `TodoItem.vue` avant même le `commit`) : à corriger _pendant_ la migration Pinia plutôt qu'après, sinon le bug reste après le changement de lib.
- `moment().format()` sans argument dépend de la langue et du fuseau horaire du navigateur : à fixer clairement en passant à dayjs (`dayjs.locale('fr')`) pour ne pas changer l'affichage sans s'en rendre compte.
- **Migrer par petits bouts marche bien si le code est peu lié entre ses parties** : c'est le cas ici, le store tient dans un seul fichier et les 3 composants ne dépendent pas les uns des autres. Typer ou migrer l'un ne force pas à toucher les autres. Sur un code où les mêmes objets passent entre beaucoup de fichiers différents, typer un fichier oblige souvent à typer aussi tous ceux qui lui envoient ou reçoivent des données, et une étape censée être petite peut devenir beaucoup plus longue que prévu. Dans ce cas, mieux vaut typer seulement les quelques champs vraiment utilisés à cet endroit, plutôt que de vouloir tout typer d'un coup, et compléter plus tard.

## 4. Pistes futures (ou bonus)

- i18n : le texte affiché à l'utilisateur (vue-i18n par exemple) si l'app doit un jour gérer plusieurs langues. Rien dans le projet actuel ne montre ce besoin.

- Tailwind : à la place de SCSS, si l'équipe préfère cette approche. C'est un choix de convention à adopter par tout le monde, donc à discuter séparément plutôt qu'à imposer pendant la migration du style.
