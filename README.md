# madebymelody — maquette v2

Maquette du futur site de **madebymelody**, créatrice de mode à Nyon : pièces uniques et numérotées, faites main, et atelier sur mesure.
Direction artistique **« Face A / Face B »** : un disquaire rock où chaque pièce devient une piste numérotée, et où la page bascule du *sage* (rose, tulle, dentelle) au *sauvage* (noir, dentelle noire, rouge cerise).

Adresse prévue : https://madebymelody-maquette.vercel.app (non indexée par les moteurs de recherche).

## Pages

| Page | Ouverture | Éléments ludiques |
|---|---|---|
| Accueil | « Le disque » : vinyle WebGL dont l'étiquette est une vraie photo, à faire tourner à la main (élan, flou de vitesse, lumière qui suit la souris), scratché au défilement, qui passe en face B ; le disque de l'intro devient celui-ci | Intro platine, tracklist, bac où l'on feuillette les pochettes une à une (« crate digging »), crossfader Face A / Face B, tampon « 1/1 », bandeau des titres |
| L'univers | « La pochette » : fond crème, le disque sort de la pochette | Mélangeur à trois faders (dentelle ↔ insectes, tulle ↔ paons, silencieux ↔ revendicateur) |
| Sur mesure | « Le voile » : fond rose, très grand titre brodé au fil cerise (une aiguille passe), un tulle ondulant se lève sur la robe bustier rouge | Set-list en quatre temps, prénom brodé sur une étiquette, demande de rendez-vous en trois étapes (préremplie par l'adresse, ex. `?sujet=mariee`) |
| Boutique | « Le bac » : ouverture compacte sur kraft, les pochettes sortent du bac | 29 pièces filtrables (type, face), lecture aléatoire, fiche en pochette double avec son propre lien (`?piece=javanaise`), panier simulé (identique dans tous les onglets) où la pièce ajoutée s'envole en disque |
| Contact | « L'étiquette » : fond cerise, numéro en très grand sur une étiquette de 45 tours | Formulaire simulé, plan schématique, itinéraire, Instagram |
| 404 | « Le diamant a sauté » | — |

Sur toutes les pages : un sillon gravé court dans la marge droite et une pointe le lit au défilement (chaque section est une plage numérotée) ; les titres passent du sage au sauvage en arrivant ; l'intro glisse jusqu'à l'objet d'ouverture de la page puis s'ouvre depuis lui, et les changements de page se font en iris (le voile grandit depuis le clic, puis s'ouvre sur l'objet d'ouverture de la page suivante).

Tout est simulé : aucun formulaire, aucune commande ni aucun paiement n'est envoyé. Le site le dit à chaque envoi.

## À fournir par madebymelody (à compléter)

**Mentions et données légales**
- Mentions légales : nom ou raison sociale, adresse, numéro IDE (CHE-…) si l'entreprise est inscrite, responsable de la publication : **à compléter**.
- Politique de confidentialité conforme à la nLPD (formulaires, lettre d'information, panier) : **à compléter**.
- Assujettissement à la TVA (et mention « TVA comprise » ou non à côté des prix) : **à compléter**.
- Hébergeur : Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis (adresse relevée dans la politique de confidentialité de Vercel).
- Assurances et qualifications à citer, s'il y en a : **à compléter**.

**Boutique**
- Numéro de chaque pièce (« pièces uniques et numérotées » : les numéros ne sont affichés nulle part sur le site actuel).
- Mesures de chaque pièce (les champs « longueur » et « largeur » sont vides sur le site actuel).
- Fiches illisibles sur le site actuel : **HURRICANE** (taille, matière, description), **MARILOU** (taille, matière, description), **PAINT IT BLACK** (taille, matière, description ; la photo montre une robe noire à haut en dentelle).
- Matière de PEACOCK, SUPERNATURE et GHOST ; taille de CLOUDS UP.
- Montant de la livraison gratuite, conditions de retour, moyens de paiement acceptés.
- Classement des pièces en « face A · sage » et « face B · sauvage » : proposition graphique de la maquette, à valider par Melody.

**Atelier et marque**
- Horaires ou modalités de rendez-vous (aucun horaire n'est publié : la maquette n'affiche donc aucun statut « ouvert »).
- Un portrait de Melody : celui du site actuel n'a pas pu être récupéré, et aucune photo de la maquette n'est présentée comme étant elle.
- Les étiquettes brodées de la page Sur mesure sont un aperçu ludique, à définir avec Melody.

**Crédits des illustrations générées** (à garder sur le site final, avec la mention « Illustration générée » sur chaque image)
Images créées avec Grok, sans vêtement, visage ni lieu réel : accueil-ouverture, accueil-sage, accueil-sauvage, accueil-matiere, accueil-atelier, univers-dentelle, univers-insectes, univers-tulle, univers-paon, univers-silence, univers-revendication, univers-musique, surmesure-ouverture, surmesure-mariee, surmesure-confection, surmesure-enfants, surmesure-costumiere, boutique-fond, contact-ouverture, page-404.
Toutes les photos de vêtements, collages et le logo viennent du site actuel de madebymelody.

## Incohérences relevées sur le site actuel

- Bloc Instagram de l'accueil laissé au modèle Wix (« @wix », « Carregar mais », images de démonstration).
- Restes de modèle étranger : « © 2026 por madebymelody », adresses de pages en portugais ou en espagnol qui ne correspondent pas au contenu (MUSTANG est une veste, CLOUDS UP un pull, PAINT IT BLACK une robe).
- Téléphone écrit « +41 076 396 91 74 » dans le pied de page ; adresse sans numéro sur la page Contact.
- « Ma responsabilité envers l'environnement » renvoie vers la page À propos, qui n'en parle pas.
- Coquilles : « du le choix », « 25 ans., », « dur l'épaule » (corrigées dans la maquette).

## Pages du site actuel non reprises (possibles en v2)

- Les 29 fiches produit en pages dédiées (dans la maquette, chaque fiche s'ouvre en fenêtre avec son propre lien).
- La page « Politique de cookies » et l'espace « Login » / panier Wix.
- Une page dédiée aux robes de mariée (aujourd'hui une section de la page Sur mesure).

## À la mise en ligne définitive

- Retirer : la consigne `noindex` (balise robots dans `source/gabarits/commun.mjs` et en-tête `X-Robots-Tag` dans `vercel.json`), les formulaires, le panier et la commande simulés, le classement face A / face B s'il n'est pas validé, toutes les mentions « à compléter ».
- Garder : la mention « Illustration générée » sur les images créées par IA.

## Travailler sur la maquette

- Textes : `donnees/textes/fr.json` ; pièces : `donnees/produits.json` ; réglages : `donnees/site.json`.
- Pages : `source/pages/*.mjs`, gabarit commun : `source/gabarits/commun.mjs`, style : `assets/css/site.css`, effets : `assets/js/site.js` et `assets/js/pages.js`.
- Générer les pages après toute modification : `node outils/generer.mjs` (ne jamais modifier les fichiers `.html` à la main).
- Auditer : `node _audit/audit.mjs` (standard), `--complet` pour la version finale. Documentation du socle : `outils/SOCLE.md`.
- Ajout au socle (v2) : `assets/js/socle/iris.js`, branché dans `transitions.js` et `ouverture.js`. Il ne s'active que si le voile porte `data-forme="iris"` et si le navigateur gère `clip-path` et `mask` ; sinon le voile glisse comme avant. L'objet d'ouverture d'une page porte `data-iris-centre` (`="disque"` quand c'est un disque à reprendre tel quel).
