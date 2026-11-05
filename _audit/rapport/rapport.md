# Rapport d’audit

Projet : `madebymelody-maquette` · 05/11/2026 16:42:43 · 7 min · 6 page(s) · audit standard (étapes : fichiers, parcours)

## Résumé

- Échecs : **0**
- À regarder : **0**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), intro accélérable et passable (7), menu (1), clavier (6), liens et boutons (6), liens profonds (10), liens vers la page en cours (5), changements de hauteur (5), mode calme (10), parcours du projet (1)

## Échecs

Aucun.

## À regarder

Rien.

## Non lancé

- **parcours:calme** : elementHandle.click: Timeout 30000ms exceeded.

## Repères

- Numéro de version des fichiers : ?v=1
- Audit standard : étapes lourdes sur /, /boutique, /contact, /sur-mesure, /univers.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --seulement=fichiers,parcours
```
