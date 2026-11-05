# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v2 — plus vivante

Comparaison de l'archive v1 et de la v2 (fichiers sources, pages générées, polices).

- **L'intro devient la page** : le disque de la platine glisse jusqu'à l'objet d'ouverture de chaque page (le disque du héros sur l'accueil, la pochette de L'univers, le bandeau du Sur mesure, le bac de la Boutique, l'étiquette du Contact) puis l'écran s'ouvre en cercle depuis lui. Sur l'accueil, le disque de l'intro est remplacé exactement par le vinyle du héros.
- **Changements de page en iris** : le voile rose grandit en disque depuis le point du clic, puis s'ouvre en cercle sur l'objet d'ouverture de la page suivante (ajout au socle : `assets/js/socle/iris.js`, repli sur l'ancien voile si le navigateur ne gère pas `clip-path` et `mask`).
- **Disque à faire tourner** (accueil) : on l'attrape et on le fait tourner à la main dans les deux sens, il garde son élan au lâcher, l'étiquette se floute avec la vitesse ; la lumière des sillons tourne vers la souris ; étiquette plus grande ; indice « Faites tourner le disque ».
- **Le bac en « crate digging »** (accueil) : la rangée horizontale est remplacée par une pile de pochettes dans une caisse en bois ; au défilement, la pochette de devant bascule vers soi et révèle la suivante, son disque sort à moitié, une étiquette de prix est collée dessus, le fond prend la teinte de la pièce, compteur 01 / 08. Repli : rangée à faire défiler (mode calme, sans JavaScript).
- **Le sillon et le diamant** (toutes les pages) : un sillon gravé court dans la marge droite, une pointe le lit au défilement ; chaque section est une plage numérotée qui s'allume au passage. En mode calme, le sillon est entièrement tracé et la pointe disparaît.
- **Titres du sage au sauvage** : les grands titres passent des formes douces aux formes « sauvages » de Fraunces à mesure qu'ils montent dans l'écran (graisse inchangée, rien ne bouge dans la mise en page).
- **Sur mesure** : le titre se brode au fil cerise en point satin, une aiguille passe devant ; le tulle ondule (WebGL) pendant qu'il se lève.
- **Boutique** : la pièce ajoutée au panier s'arrondit en disque et s'envole en arc jusqu'au bouton Panier, qui rebondit (l'en-tête caché redescend pour la recevoir).
- **Allègement** : police Fraunces italique retirée (150 Ko, inutilisée).
- Version des fichiers passée à 2 (les navigateurs rechargent tout).

## v1 — la base

- **Direction « Face A / Face B »** : disquaire rock, pièces présentées en pistes numérotées, bascule du sage (rose, tulle) au sauvage (noir, dentelle). Polices Fraunces (titres, axes « doux » et « sauvage »), DM Sans et DM Mono, hébergées avec le site.
- **Six pages** : Accueil, L'univers, Sur mesure, Boutique, Contact, 404, chacune avec son ouverture propre (disque, pochette, voile de tulle, bac, étiquette, disque qui saute).
- **Intro** à chaque arrivée : platine, bras qui pose le diamant, puis l'étiquette s'ouvre en cercle sur la page (moins de 3 s, passable au clic). Changements de page sous un voile rose avec une étiquette qui tourne.
- **Effets propres** : vinyle WebGL scratché au défilement (repli CSS), manifeste allumé mot à mot, tracklist à barre de lecture, bac de pochettes épinglé dont le fond se teinte, crossfader Face A / Face B, tampon « 1/1 », bandeau des titres qui accélère, étiquette « Face B » du pied de page, mélangeur à trois faders, prénom brodé, pochettes du bac, étiquette du contact.
- **Fonctionnalités** : boutique de 29 pièces filtrables (type, face) avec lecture aléatoire, fiche en fenêtre avec son lien, panier simulé partagé entre onglets ; demande de rendez-vous en trois étapes préremplie ; formulaires et lettre d'information simulés avec mention nLPD ; mode calme.
- **Images** : 117 photos du site actuel analysées (pièces, collages, logo), 20 illustrations générées avec Grok (mention « Illustration générée »), variantes WebP ordinateur et téléphone.
- **Mise en ligne** : site statique pour Vercel, `noindex`, en-têtes de sécurité, images de partage 1200 × 630 par page, données structurées ClothingStore.
