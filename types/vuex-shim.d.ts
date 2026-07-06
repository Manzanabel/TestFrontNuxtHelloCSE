// Les types de vuex ne sont pas résolus correctement par le champ "exports"
// de son package.json avec la résolution de modules actuelle du projet.
// Vuex étant amené à être retiré au profit de Pinia (cf. MIGRATION.md), on se
// contente ici d'une déclaration minimale plutôt que d'investiguer une
// configuration plus poussée pour une dépendance temporaire.
declare module 'vuex';