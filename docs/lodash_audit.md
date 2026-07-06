| Fonction lodash | Équivalent natif JS | Décision |
|---|---|---|
| `_.map` | `Array.prototype.map` | Remplacer: équivalent strict, aucun gain à garder lodash |
| `_.filter` | `Array.prototype.filter` | Remplacer: équivalent strict |
| `_.find` | `Array.prototype.find` | Remplacer: équivalent strict |
| `_.findIndex` | `Array.prototype.findIndex` | Remplacer: équivalent strict |
| `_.each` | `Array.prototype.forEach` | Remplacer: équivalent strict |
| `_.includes` | `Array.prototype.includes` | Remplacer: équivalent strict |
| `_.trim` | `String.prototype.trim` | Remplacer: équivalent strict |
| `_.size` | `.length` | Remplacer: équivalent strict |
| `_.isEmpty` (sur une string) | `!str.trim()` | Remplacer: équivalent strict pour ce cas d'usage |
| `_.cloneDeep` | `structuredClone()` | Remplacer: API native du navigateur, plus rapide que l'implémentation de lodash |
| `_.capitalize` | `str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()` | Remplacer: gain minime, on peut créer une fonction dans utils |
| `_.countBy` | `reduce()` (3-4 lignes) | Garder si on garde lodash: c'est le seul cas où lodash reste plus lisible qu'un équivalent natif |
| `_.uniqueId` | — | Supprimer: génère des IDs côté client non fiables (cf. bug de désynchronisation des IDs, section Bugs) |