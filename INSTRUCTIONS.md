# Test technique — Dev Frontend

Salut 👋

Bienvenue sur ce test technique. Tu as devant toi une todo app Nuxt 4 qui fonctionne… mais qui a été écrite avec beaucoup d'amour et zéro bonne pratique. C'est volontaire, promis.

Bonne chance, on est impatients de lire ton analyse.

---

## Objectifs

### 1. Analyse du code existant

Dans un fichier `ANALYSIS.md`, liste :

- Toutes les **mauvaises pratiques** que tu identifies (technologies obsolètes, anti-patterns Vue/Nuxt, problèmes de sécurité, performances, structure…)
- Pour chacune, une **solution concrète** à apporter
- Est-ce que des bugs sont présents. Si oui, lesquels ? Comment les corriger ?

### 2. Plan de migration

Dans un fichier `MIGRATION.md` :

- Propose un **plan de migration** vers une stack moderne et justifie tes choix technologiques
- Décris ta **méthodologie** : par où commencer, comment prioriser, comment migrer sans tout casser d'un coup

### 3. Refactorisation d'un composant

- Choisis **un composant Vue de ton choix** (hors `app.vue`) et réécris-le proprement
- Le reste de l'app doit **continuer à fonctionner**
- Tu es libre d'introduire TypeScript, Pinia, ou toute autre techno que tu juges pertinente
- Ecris au moins un test unitaire sur le composant refactorisé

---

## Livrable

Un **repo Git public** (fork ou clone) contenant :

```
ANALYSIS.md
MIGRATION.md
```

…et le composant refactorisé dans le code.

On s'attend à un **historique Git propre** : au moins un commit par étape logique (analyse, migration plan, refacto), pas tout en un seul commit.

---

## Périmètre

Le test porte principalement sur le **code frontend** (composants, store, structure). Le dossier `server/` est hors scope — pas besoin de le refactoriser, sauf si tu as une remarque à faire dessus dans ton analyse.

---

## Critères d'évaluation

On regarde principalement :

- La **rigueur de l'analyse** — est-ce que tu identifies les vrais problèmes, pas juste les plus visibles
- La **pertinence des choix technologiques** — et ta capacité à les justifier
- La **lisibilité du code produit** — structure, nommage, séparation des responsabilités
- La **qualité du git** — des commits qui racontent quelque chose

---

## Setup

```bash
cd test-tech
npm install
npm run dev
```

L'app tourne sur `http://localhost:3000`.

---

> ⏱️ Durée estimée : **2 à 3h**. On ne s'attend pas à ce que tout soit corrigé — la qualité de l'analyse compte autant que le code produit.
