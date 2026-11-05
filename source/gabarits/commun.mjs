/* Gabarit commun madebymelody : head, en-tête, menu, pied de page, barre fixe du téléphone, voile, platine d'intro.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README). */
import { html, brut } from '../../outils/gabarit.mjs';

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));

/* Disque en SVG : sillons, reflets et étiquette. Sert à l'intro, au voile et au pied de page. */
export function disqueSvg({ classe = '', etiquette = '', texte = '', id = 'd' } = {}) {
  const sillons = Array.from({ length: 16 }, (_, i) => html`<circle cx="100" cy="100" r="${44 + i * 3.4}" />`);
  return html`<svg class="disque-svg ${classe}" viewBox="0 0 200 200" aria-hidden="true" focusable="false" data-audit-ignorer>
  <defs><path id="${id}-arc" d="M100 100 m-26 0 a26 26 0 1 1 52 0 a26 26 0 1 1 -52 0" /></defs>
  <circle cx="100" cy="100" r="98" class="disque-vinyle" />
  <g class="disque-sillons">${sillons}</g>
  <path class="disque-reflet" d="M100 2 A98 98 0 0 1 169 31 L100 100 Z" />
  <path class="disque-reflet" d="M100 198 A98 98 0 0 1 31 169 L100 100 Z" />
  <circle cx="100" cy="100" r="38" class="disque-etiquette" />
  ${texte ? html`<text class="disque-texte"><textPath href="#${id}-arc" startOffset="0">${texte}</textPath></text>` : ''}
  ${etiquette}
  <circle cx="100" cy="100" r="3" class="disque-trou" />
</svg>`;
}

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon-64.png" type="image/png" sizes="64x64">
<link rel="icon" href="/assets/images/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_CH">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

function entete(c) {
  const a = c.site.actionEntete;
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" aria-label="${c.site.nom}, ${c.libelle('accueil')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      <img src="/assets/images/logo-creme.png" alt="${c.site.nom}" width="1200" height="167">
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).filter((k) => k !== 'accueil').map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      ${c.page.cle === 'boutique' ? html`<button type="button" class="bouton bouton--creme entete-panier" data-panier-bouton aria-controls="panier" aria-expanded="false"><span>${c.t('commun.panier')}</span> <b data-panier-compte>0</b></button>` : ''}
      <a class="bouton bouton--rose" href="${c.url(a.page, a.ancre || '')}" data-libelle="${c.libelle(a.page)}" aria-label="${c.s('commun.actionEnteteLong')}">${c.t('commun.actionEntete')}</a>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}"><span class="menu-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
  <p class="menu-actions"><a class="bouton bouton--rose" href="${c.url(a.page, a.ancre || '')}" data-libelle="${c.libelle(a.page)}">${c.t('commun.actionEnteteLong')}</a>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
  <p><a class="lien-externe" href="${c.site.contact.instagram}" target="_blank" rel="noopener">${c.t('commun.instagramLong')} <span class="visuellement-cache">${c.t('commun.nouvelOnglet')}</span></a></p>
  <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
</div>`;
}

function pied(c) {
  return html`<footer class="pied" id="pied" data-masque-barre>
  <div class="conteneur pied-haut">
    <div class="pied-disque" data-effet="face-b">
      ${disqueSvg({ classe: 'pied-disque-svg', texte: c.s('commun.pied.fin').toUpperCase() + ' · MADEBYMELODY · ', id: 'pied' })}
      <span class="pied-face" aria-hidden="true">${c.t('commun.pied.faceB')}</span>
    </div>
    <form class="pied-lettre" data-formulaire novalidate>
      <p class="pied-titre">${c.t('commun.pied.lettre')}</p>
      <p>${c.t('commun.pied.lettreTexte')}</p>
      <div class="champ champ--ligne"><label for="lettre-email">${c.t('commun.pied.email')}</label>
        <span class="champ-rangee"><input id="lettre-email" name="email" type="email" autocomplete="email" required><button class="bouton bouton--rose" type="submit">${c.t('commun.pied.envoyer')}</button></span></div>
      <p class="mention-donnees">${c.t('commun.pied.mention')}</p>
      <p data-message-envoi hidden></p>
    </form>
  </div>
  <div class="conteneur pied-grille">
    <div>
      <p class="pied-titre">${c.t('commun.pied.atelier')}</p>
      <p>${c.site.contact.adresse}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a><br><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
      <p><a class="lien-externe" href="${c.site.contact.instagram}" target="_blank" rel="noopener">${c.t('commun.instagram')} @madebymelody.ch <span class="visuellement-cache">${c.t('commun.nouvelOnglet')}</span></a></p>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas">
    <p>${c.t('commun.mentions')} · ${c.t('commun.confidentialite')}</p>
    <p>${c.t('commun.maquette')}</p>
    <p>© ${c.site.nom}</p>
  </div>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  ${c.page.cle === 'boutique' ? html`<button type="button" class="bouton bouton--creme" data-panier-bouton aria-controls="panier" aria-expanded="false"><span>${c.t('commun.panier')}</span> <b data-panier-compte>0</b> <span data-panier-total-court>0 CHF</span></button>` : html`<a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>`}
  <a class="bouton bouton--rose" href="${c.url(a.page, a.ancre || '')}" data-libelle="${c.libelle(a.page)}" aria-label="${c.s('commun.actionEnteteLong')}">${c.t('commun.actionEnteteCourt')}</a>
</div>`;
}

function voile(c) {
  return html`<div data-voile data-forme="iris" aria-hidden="true"><div class="voile-contenu">
  ${disqueSvg({ classe: 'voile-disque', id: 'voile' })}
  <span data-voile-libelle>${c.libelle(c.page.cle)}</span>
</div></div>`;
}

/* Platine de l'intro : disque, bras de lecture, nom imprimé sur l'étiquette. */
function platine(c) {
  return html`<div class="ouverture-panneau" data-ouverture aria-hidden="true">
  <div class="platine">
    <div class="platine-disque">${disqueSvg({ classe: 'intro-disque', id: 'intro', etiquette: html`<image href="/assets/images/logo-noir.png" x="70" y="96" width="60" height="8.4" class="intro-logo" />` })}</div>
    <svg class="platine-bras" viewBox="0 0 120 220" aria-hidden="true" focusable="false">
      <circle cx="96" cy="22" r="14" class="bras-pivot" /><circle cx="96" cy="22" r="5" class="bras-axe" />
      <path d="M96 22 L92 150 Q90 176 70 192" class="bras-tige" />
      <rect x="56" y="186" width="22" height="12" rx="2" transform="rotate(-38 67 192)" class="bras-tete" />
    </svg>
    <p class="intro-face"><span>${c.t('commun.introLigne')}</span></p>
  </div>
  <p class="intro-passer">${c.t('intro.passer')}</p>
</div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}" data-page="${c.page.cle}"${c.site.curseur ? brut(' data-curseur') : ''}>
${tete(c)}
<body id="haut" class="page-${c.page.cle}">
${voile(c)}
${platine(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}${c.page.sansEffet ? brut(' data-sans-effet') : ''}>
<div class="sillon" data-effet="sillon" aria-hidden="true" data-audit-ignorer><svg class="sillon-svg" focusable="false" width="40" height="10"><path class="sillon-fond" /><path class="sillon-lu-ombre" /><path class="sillon-lu" /><g class="sillon-plages"></g></svg></div>
${contenu}
</main>
<div class="diamant" aria-hidden="true" data-audit-ignorer><svg viewBox="0 0 90 24" focusable="false"><path class="diamant-bras" d="M16 12 C 40 12, 52 4, 90 4" /><rect class="diamant-tete" x="12" y="7" width="16" height="10" rx="2" /><path class="diamant-pointe" d="M3 12 L9 7.5 L15 12 L9 16.5 Z" /></svg></div>
${pied(c)}
${barre(c)}
</body>
</html>`;
}
