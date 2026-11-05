/* L'univers : ouverture « La pochette » (fond crème, page scindée, le disque sort de la pochette). */
import { html } from '../../outils/gabarit.mjs';
import { disqueSvg } from '../gabarits/commun.mjs';

export const page = { cle: 'univers', fichier: 'univers', imagePartage: 'pieces/supernature-4-1200.webp' };

export default (c) => {
  const I = c.donnees.images.images;
  const P = Object.fromEntries(c.donnees.produits.map((p) => [p.id, p]));
  const piece = (id, k, alt, o = {}) => c.media({ nom: P[id].photos[k].nom, alt, cadrage: P[id].photos[k].cadrage, sizes: o.sizes || '(max-width: 760px) 90vw, 40vw', classe: o.classe || '', attrs: o.attrs || '' });
  const paires = [['dentelle', 'insectes', 'p1'], ['tulle', 'paon', 'p2'], ['silence', 'revendication', 'p3']];
  return html`
<section class="u-tete theme-creme" id="debut" data-plein-ecran>
  <div class="conteneur u-tete-grille">
    <div class="u-tete-texte">
      <p class="kicker">${c.t('univers.tete.kicker')}</p>
      <h1 class="u-titre">
        <span class="ligne-masque"><span data-anime="gsap" class="u-ligne">${c.t('univers.tete.titre1')}</span></span>
        <span class="ligne-masque"><span data-anime="gsap" class="u-ligne u-ligne--sauvage">${c.t('univers.tete.titre2')}</span></span>
      </h1>
      <p class="u-intro" data-anime="gsap">${c.t('univers.tete.texte')}</p>
      <p class="u-actions" data-anime="gsap">${c.lien('boutique', { classe: 'bouton bouton--noir', texte: c.t('univers.tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })}</p>
      <p class="u-info" data-info-cle>${c.t('univers.tete.info')}</p>
    </div>
    <div class="u-pochette" data-effet="disque-sort" data-iris-centre>
      <span class="u-pochette-disque" aria-hidden="true">${disqueSvg({ id: 'u-tete', texte: 'MADEBYMELODY · FACE A · ROCK, FLEURS ET BABY DOLL · ' })}</span>
      <div class="u-pochette-cadre">${c.media({ nom: 'site/collage-portrait', alt: c.s('univers.tete.pochette'), priorite: true, sizes: '(max-width: 760px) 80vw, 40vw' })}</div>
    </div>
  </div>
</section>

<section class="u-univers" id="univers">
  <div class="conteneur u-univers-grille">
    <h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('univers.univers.titre')}</h2>
    <p class="u-univers-texte" data-anime>${c.t('univers.univers.texte')}</p>
  </div>
  <ul class="conteneur u-triptyque" data-anime="cascade">
    <li>${piece('mary-l', 2, c.s('univers.univers.d1'), { sizes: '(max-width: 760px) 90vw, 30vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}<p>${c.t('univers.univers.d1')}</p></li>
    <li>${piece('supernature', 3, c.s('univers.univers.d2'), { sizes: '(max-width: 760px) 90vw, 30vw', attrs: 'data-fx="parallaxe" data-fx-force="14"' })}<p>${c.t('univers.univers.d2')}</p></li>
    <li>${piece('peacock', 2, c.s('univers.univers.d3'), { sizes: '(max-width: 760px) 90vw, 30vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}<p>${c.t('univers.univers.d3')}</p></li>
  </ul>
</section>

<section class="melangeur" id="melangeur" data-effet="melangeur">
  <div class="conteneur">
    <p class="kicker">${c.t('univers.melangeur.kicker')}</p>
    <h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('univers.melangeur.titre')}</h2>
    <p class="melangeur-intro">${c.t('univers.melangeur.texte')}</p>
    <div class="melangeur-pistes">
      ${paires.map(([a, b, k]) => html`<div class="tranche" style="--m:0">
        <div class="tranche-visuel">
          ${c.media({ nom: `grok/univers-${a}`, alt: I[`grok/univers-${a}`].alt, sizes: '(max-width: 760px) 80vw, 28vw', classe: 'tranche-a' })}
          ${c.media({ nom: `grok/univers-${b}`, alt: I[`grok/univers-${b}`].alt, sizes: '(max-width: 760px) 80vw, 28vw', classe: 'tranche-b' })}
        </div>
        <p class="tranche-mots"><span class="tranche-mot">${c.t(`univers.melangeur.${k}a`)}</span> <span class="tranche-fleche" aria-hidden="true">↔</span> <span class="tranche-mot tranche-mot--b">${c.t(`univers.melangeur.${k}b`)}</span></p>
        <label class="visuellement-cache" for="fader-${k}">${c.t('univers.melangeur.fader', { a: c.s(`univers.melangeur.${k}a`), b: c.s(`univers.melangeur.${k}b`) })}</label>
        <input class="tranche-fader" id="fader-${k}" type="range" min="0" max="100" value="0" step="1">
      </div>`)}
    </div>
  </div>
</section>

<section class="u-attitude theme-creme" id="attitude">
  <div class="conteneur u-duo">
    ${piece('ballade', 3, c.s('univers.attitude.alt'), { classe: 'u-duo-media', attrs: 'data-fx="zoom"' })}
    <div><h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('univers.attitude.titre')}</h2><p class="u-grand" data-anime>${c.t('univers.attitude.texte')}</p></div>
  </div>
</section>

<section class="u-concept theme-rose" id="concept">
  <div class="conteneur u-duo u-duo--inverse">
    <div><h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('univers.concept.titre')}</h2><p class="u-grand" data-anime>${c.t('univers.concept.texte')}</p></div>
    ${piece('playground', 1, c.s('univers.concept.alt'), { classe: 'u-duo-media', attrs: 'data-anime="rideau"' })}
  </div>
</section>

<section class="u-designer" id="designer">
  <div class="conteneur u-designer-grille">
    <div class="u-designer-visuels">
      ${c.media({ nom: 'grok/univers-musique', alt: c.s('univers.designer.musique'), classe: 'u-designer-musique', sizes: '(max-width: 760px) 90vw, 36vw', attrs: 'data-fx="parallaxe"' })}
    </div>
    <div>
      <p class="kicker">${c.t('univers.designer.kicker')}</p>
      <h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('univers.designer.titre')}</h2>
      <p data-anime>${c.t('univers.designer.texte1')}</p>
      <p data-anime>${c.t('univers.designer.texte2')}</p>
      <dl class="notes" data-anime="cascade">
        <div><dt>${c.t('accueil.designer.formation')}</dt><dd>${c.t('accueil.designer.formationV')}</dd></div>
        <div><dt>${c.t('accueil.designer.stage')}</dt><dd>${c.t('accueil.designer.stageV')}</dd></div>
        <div><dt>${c.t('accueil.designer.influences')}</dt><dd>${c.t('accueil.designer.influencesV')}</dd></div>
      </dl>
      <p class="note">${c.t('univers.designer.portrait')}</p>
    </div>
  </div>
</section>

<section class="u-fin theme-cerise" id="fin">
  <div class="conteneur u-duo">
    <div>
      <h2 data-anime="lignes" data-effet="sage-sauvage">${c.t('univers.fin.titre')}</h2>
      <p class="u-actions" data-anime>
        ${c.lien('boutique', { classe: 'bouton bouton--creme', texte: c.t('univers.fin.boutique'), attrs: 'data-survol="magnetique"' })}
        ${c.lien('sur-mesure', { ancre: 'rendez-vous', classe: 'bouton bouton--contour', texte: c.t('univers.fin.mesure'), attrs: 'data-survol="magnetique"' })}
      </p>
    </div>
    ${piece('bonnie', 0, c.s('univers.fin.alt'), { classe: 'u-fin-media', attrs: 'data-fx="zoom"' })}
  </div>
</section>
`;
};
