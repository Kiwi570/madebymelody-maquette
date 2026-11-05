/* Accueil madebymelody, direction « Face A / Face B ».
   Ordre : le disque (signature), manifeste, tracklist, bac, bascule A/B, une seule prise, designer, sur mesure, atelier. */
import { html } from '../../outils/gabarit.mjs';
import { disqueSvg } from '../gabarits/commun.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'site/etiquette-b-1200.webp' };

const chf = (n) => `${n} CHF`;
const piste = (n) => String(n).padStart(2, '0');
const TRACKLIST = ['peacock', 'supernature', 'fever', 'envolez-moi', 'javanaise', 'mary-l', 'bonnie', 'clouds-up'];
const BAC = ['sunshine', 'cminor', 'ballade', 'mustang', 'madly', 'juliette', 'grapevine', 'playground'];

export default (c) => {
  const P = Object.fromEntries(c.donnees.produits.map((p) => [p.id, p]));
  const photo = (p, k = 0, o = {}) => c.media({ nom: p.photos[k].nom, alt: o.alt ?? `${p.nom}, ${c.s('boutique.types.' + (p.type || 'piece')).toLowerCase()} madebymelody`, cadrage: p.photos[k].cadrage, sizes: o.sizes || '(max-width: 760px) 70vw, 30vw', classe: o.classe || '', attrs: o.attrs || '' });
  return html`
<section class="hero-disque" id="disque" data-plein-ecran>
  ${c.media({ nom: 'grok/accueil-ouverture', alt: c.s('accueil.hero.disque'), priorite: true, classe: 'hero-fond', sizes: '100vw', attrs: 'data-audit-ignorer' })}
  <div class="hero-scene">
    <h1 class="hero-titre">
      <span class="hero-mot hero-mot--a"><span class="ligne-masque"><span data-anime="gsap" class="hero-ligne">${c.t('accueil.hero.titre1')}</span></span></span>
      <span class="hero-mot hero-mot--b"><span class="ligne-masque"><span data-anime="gsap" class="hero-ligne">${c.t('accueil.hero.titre2')}</span></span></span>
    </h1>
    <div class="vinyle" data-effet="vinyle" data-superpose data-iris-centre="disque" data-souris role="img" aria-label="${c.s('accueil.hero.disque')}">
      <div class="vinyle-css" aria-hidden="true">
        <div class="vinyle-tourne">
          <span class="vinyle-sillons"></span>
          <span class="vinyle-etiquette">${c.media({ nom: 'site/etiquette-a', alt: '', cadrage: '50% 50%', priorite: true, sizes: '(max-width: 760px) 40vw, 22vw', classe: 'etiquette-a' })}${c.media({ nom: 'site/etiquette-b', alt: '', cadrage: '50% 50%', sizes: '(max-width: 760px) 40vw, 22vw', classe: 'etiquette-b' })}</span>
          <span class="vinyle-trou"></span>
        </div>
        <span class="vinyle-reflet"></span>
      </div>
      <canvas class="vinyle-gl" aria-hidden="true"></canvas>
      <svg class="vinyle-bras" viewBox="0 0 120 220" aria-hidden="true" focusable="false">
        <circle cx="96" cy="22" r="14" class="bras-pivot" /><circle cx="96" cy="22" r="5" class="bras-axe" />
        <path d="M96 22 L92 150 Q90 176 70 192" class="bras-tige" />
        <rect x="56" y="186" width="22" height="12" rx="2" transform="rotate(-38 67 192)" class="bras-tete" />
      </svg>
      <p class="vinyle-face" aria-hidden="true"><span>${c.t('accueil.hero.face')}</span> <b data-face>A</b></p>
      <p class="vinyle-indice" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v4h-4" /></svg>${c.t('accueil.hero.indice')}</p>
    </div>
    <div class="hero-bas" data-anime="gsap">
      <p class="hero-texte">${c.t('accueil.hero.texte')}</p>
      <p class="hero-actions">
        <a class="bouton bouton--rose" href="#tracklist" data-action-principale data-survol="magnetique">${c.t('accueil.hero.action')}</a>
        ${c.lien('sur-mesure', { ancre: 'rendez-vous', classe: 'bouton bouton--contour', texte: c.t('accueil.hero.rdv'), attrs: 'data-survol="magnetique"' })}
      </p>
      <p class="hero-info" data-info-cle>${c.t('accueil.hero.info')}</p>
    </div>
  </div>
</section>

<section class="manifeste theme-creme" id="manifeste">
  <svg class="sillons" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true" data-fx="trace">
    ${[0, 1, 2, 3, 4, 5].map((i) => html`<path d="M-20 ${240 - i * 26} C 300 ${140 - i * 22}, 900 ${330 - i * 28}, 1220 ${200 - i * 24}" fill="none" stroke="currentColor" stroke-width="1.2" />`)}
  </svg>
  <div class="conteneur manifeste-grille">
    <h2 class="manifeste-titre" data-effet="manifeste" data-manifeste>${c.t('accueil.manifeste.titre')}</h2>
    <div class="manifeste-texte">
      <p data-anime>${c.t('accueil.manifeste.texte')}</p>
      <p data-anime>${c.lien('univers', { classe: 'lien-fleche', texte: c.t('accueil.manifeste.lien') })}</p>
    </div>
  </div>
  ${c.media({ nom: 'site/collage-marque', alt: c.donnees.images.images['site/collage-marque'].alt, classe: 'manifeste-collage conteneur', sizes: '(max-width: 760px) 100vw, 1240px', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
</section>

<section class="tracklist" id="tracklist">
  <div class="conteneur tracklist-tete">
    <p class="kicker">${c.t('accueil.tracklist.kicker')}</p>
    <h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('accueil.tracklist.titre')}</h2>
    <p>${c.t('accueil.tracklist.texte')}</p>
  </div>
  <div class="conteneur tracklist-grille">
    <ol class="pistes" data-effet="tracklist">
      ${TRACKLIST.map((id) => { const p = P[id]; return html`<li class="piste" data-piste="${id}">
        <a href="${c.url('boutique', '', `piece=${id}`)}" data-libelle="${c.libelle('boutique')}" class="piste-lien">
          <span class="piste-num">${piste(p.piste)}</span>
          <span class="piste-nom">${p.nom}</span>
          <span class="piste-type">${c.t('boutique.types.' + (p.type || 'piece'))}${p.taille ? ` · ${p.taille}` : ''}</span>
          <span class="piste-prix" data-prix>${chf(p.prix)}</span>
          <span class="piste-barre" aria-hidden="true"><span></span></span>
        </a>
        ${photo(p, 0, { classe: 'piste-vignette', sizes: '30vw' })}
      </li>`; })}
    </ol>
    <div class="pochette-active" aria-hidden="true">
      ${TRACKLIST.map((id, i) => photo(P[id], 0, { classe: `pochette-photo${i === 0 ? ' est-active' : ''}`, sizes: '(max-width: 760px) 1px, 34vw', attrs: `data-pochette="${id}"` }))}
      <span class="pochette-num" data-pochette-num>${piste(P[TRACKLIST[0]].piste)}</span>
    </div>
  </div>
  <p class="conteneur tracklist-pied">${c.lien('boutique', { classe: 'bouton bouton--contour', texte: c.t('accueil.tracklist.tout'), attrs: 'data-survol="magnetique"' })}</p>
</section>

<section class="bac ecran epingle" id="bac" data-entete-cache style="--teinte:${P[BAC[0]].teinte}">
  <div class="conteneur bac-grille">
    <div class="bac-tete">
      <h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('accueil.bac.titre')}</h2>
      <p>${c.t('accueil.bac.texte')} <span class="indice-tactile">${c.t('accueil.bac.glisser')}</span></p>
      <p class="bac-compteur" aria-hidden="true"><b data-bac-num>01</b><span> / ${String(BAC.length).padStart(2, '0')}</span></p>
      <div class="galerie-progres" aria-hidden="true"><span></span></div>
    </div>
    <div class="bac-caisse" data-effet="caisse">
      <div class="piste bac-piste" data-bac-pile data-tient tabindex="0" role="region" aria-label="${c.s('accueil.bac.region')}">
        ${BAC.map((id, i) => { const p = P[id]; return html`<article class="pochette" data-effet="pochette" data-teinte="${p.teinte}" style="--i:${i}">
          <div class="pochette-cadre">
            <span class="pochette-disque" aria-hidden="true">${disqueSvg({ id: 'bac-' + id })}</span>
            ${photo(p, 0, { classe: 'pochette-media', sizes: '(max-width: 760px) 70vw, 40vh' })}
          </div>
          <div class="pochette-legende">
            <h3><a href="${c.url('boutique', '', `piece=${id}`)}" data-libelle="${c.libelle('boutique')}"><span class="pochette-num">${piste(p.piste)}</span> ${p.nom}</a></h3>
            <p><span data-prix>${chf(p.prix)}</span>${p.taille ? ` · ${p.taille}` : ''}</p>
          </div>
        </article>`; })}
      </div>
      <div class="bac-bois" aria-hidden="true" data-audit-ignorer></div>
    </div>
  </div>
</section>

<section class="bascule" id="bascule" data-effet="bascule">
  <div class="bascule-scene" data-plein-ecran>
    <div class="bascule-face bascule-a">
      ${c.media({ nom: 'grok/accueil-sage', alt: c.donnees.images.images['grok/accueil-sage'].alt, classe: 'bascule-fond', sizes: '100vw', attrs: 'data-audit-ignorer' })}
      <div class="bascule-contenu" data-superpose>
        <p class="kicker">${c.t('accueil.bascule.faceA')}</p>
        <p class="bascule-mot">${c.t('accueil.bascule.sage')}</p>
        <p class="bascule-texte">${c.t('accueil.bascule.texteA')}</p>
      </div>
      ${photo(P['love-me-two'], 0, { classe: 'bascule-piece', sizes: '(max-width: 760px) 50vw, 26vw' })}
    </div>
    <div class="bascule-face bascule-b">
      ${c.media({ nom: 'grok/accueil-sauvage', alt: c.donnees.images.images['grok/accueil-sauvage'].alt, classe: 'bascule-fond', sizes: '100vw', attrs: 'data-audit-ignorer' })}
      <div class="bascule-contenu" data-superpose>
        <p class="kicker">${c.t('accueil.bascule.faceB')}</p>
        <p class="bascule-mot">${c.t('accueil.bascule.sauvage')}</p>
        <p class="bascule-texte">${c.t('accueil.bascule.texteB')}</p>
      </div>
      ${photo(P['flash'], 0, { classe: 'bascule-piece', sizes: '(max-width: 760px) 50vw, 26vw' })}
    </div>
    <div class="fader" aria-hidden="true"><span class="fader-a">A</span><span class="fader-rail"><span class="fader-bouton"></span></span><span class="fader-b">B</span></div>
  </div>
</section>

<section class="unique theme-creme" id="unique">
  ${c.media({ nom: 'grok/accueil-matiere', alt: c.donnees.images.images['grok/accueil-matiere'].alt, classe: 'unique-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="12"' })}
  <div class="conteneur unique-grille">
    <div class="unique-tampon" data-effet="tampon" aria-hidden="true"><span>${c.t('accueil.unique.chiffre')}</span></div>
    <div class="unique-texte">
      <p class="kicker">${c.t('accueil.unique.kicker')}</p>
      <blockquote><p data-anime="lignes">${c.t('accueil.unique.citation')}</p><footer>${c.t('accueil.unique.auteur')}</footer></blockquote>
      <ul class="unique-faits" data-anime="cascade">
        <li>${c.t('accueil.unique.f1')}</li><li>${c.t('accueil.unique.f2')}</li><li>${c.t('accueil.unique.f3')}</li>
      </ul>
      <p class="note">${c.t('accueil.unique.numero')}</p>
    </div>
    ${c.media({ nom: P['mary-l'].photos[2].nom, alt: c.s('accueil.unique.detail'), cadrage: P['mary-l'].photos[2].cadrage, classe: 'unique-detail', sizes: '(max-width: 760px) 60vw, 22vw', attrs: 'data-fx="zoom"' })}
  </div>
</section>

<section class="designer" id="designer">
  <div class="conteneur designer-grille">
    ${c.media({ nom: 'grok/univers-musique', alt: c.donnees.images.images['grok/univers-musique'].alt, classe: 'designer-collage', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-anime="rideau"' })}
    <div>
      <p class="kicker">${c.t('accueil.designer.kicker')}</p>
      <h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('accueil.designer.titre')}</h2>
      <p data-anime>${c.t('accueil.designer.texte')}</p>
      <dl class="notes" data-anime="cascade">
        <div><dt>${c.t('accueil.designer.formation')}</dt><dd>${c.t('accueil.designer.formationV')}</dd></div>
        <div><dt>${c.t('accueil.designer.stage')}</dt><dd>${c.t('accueil.designer.stageV')}</dd></div>
      </dl>
      <p class="note">${c.t('accueil.designer.portrait')}</p>
      <p data-anime>${c.lien('univers', { ancre: 'designer', classe: 'lien-fleche', texte: c.t('accueil.designer.lien') })}</p>
    </div>
  </div>
</section>

<section class="teaser-mesure theme-rose" id="sur-mesure">
  <div class="conteneur teaser-grille">
    <div class="teaser-texte">
      <p class="kicker">${c.t('accueil.surmesure.kicker')}</p>
      <h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('accueil.surmesure.titre')}</h2>
      <p data-anime>${c.t('accueil.surmesure.texte')}</p>
      <p data-anime>${c.lien('sur-mesure', { ancre: 'rendez-vous', classe: 'bouton bouton--noir', texte: c.t('accueil.surmesure.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
    ${c.media({ nom: 'site/robe-sur-mesure', alt: c.donnees.images.images['site/robe-sur-mesure'].alt, classe: 'teaser-robe', sizes: '(max-width: 760px) 90vw, 36vw', attrs: 'data-fx="onde"' })}
  </div>
  <ul class="conteneur teaser-cartes" data-anime="cascade">
    <li>${c.lien('sur-mesure', { ancre: 'mariees', classe: 'teaser-carte', texte: html`${c.media({ nom: 'grok/surmesure-mariee', alt: '', sizes: '(max-width: 760px) 80vw, 28vw' })}<strong>${c.t('accueil.surmesure.mariees')}</strong><span>${c.t('accueil.surmesure.mariees2')}</span>`, attrs: 'data-survol="incline"' })}</li>
    <li>${c.lien('sur-mesure', { ancre: 'enfants', classe: 'teaser-carte', texte: html`${c.media({ nom: 'site/collage-enfants', alt: '', sizes: '(max-width: 760px) 80vw, 28vw' })}<strong>${c.t('accueil.surmesure.enfants')}</strong><span>${c.t('accueil.surmesure.enfants2')}</span>`, attrs: 'data-survol="incline"' })}</li>
    <li>${c.lien('sur-mesure', { ancre: 'costumiere', classe: 'teaser-carte', texte: html`${c.media({ nom: 'grok/surmesure-costumiere', alt: '', sizes: '(max-width: 760px) 80vw, 28vw' })}<strong>${c.t('accueil.surmesure.costumes')}</strong><span>${c.t('accueil.surmesure.costumes2')}</span>`, attrs: 'data-survol="incline"' })}</li>
  </ul>
</section>

<section class="atelier-accueil" id="atelier">
  ${c.media({ nom: 'grok/accueil-atelier', alt: c.donnees.images.images['grok/accueil-atelier'].alt, classe: 'atelier-fond', sizes: '100vw', attrs: 'data-fx="zoom" data-fx-force="14"' })}
  <div class="ruban-section" data-effet="ruban-vitesse">
    <div class="ruban" id="ruban" data-ruban data-boucle-css><p><span>${c.t('accueil.atelier.ruban')}</span> <span aria-hidden="true">${c.t('accueil.atelier.ruban')}</span></p></div>
    <button type="button" class="ruban-pause" data-pause-pour="ruban" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button>
  </div>
  <div class="conteneur atelier-texte">
    <h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('accueil.atelier.titre')}</h2>
    <p data-anime>${c.t('accueil.atelier.texte')}</p>
    <p class="atelier-actions" data-anime>
      ${c.lien('sur-mesure', { ancre: 'rendez-vous', classe: 'bouton bouton--rose', texte: c.t('accueil.atelier.action'), attrs: 'data-survol="magnetique"' })}
      ${c.lien('contact', { ancre: 'acces', classe: 'bouton bouton--contour', texte: c.t('accueil.atelier.acces') })}
    </p>
  </div>
</section>
`;
};
