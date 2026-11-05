/* Sur mesure : ouverture « Le voile » (fond rose uni, très grand titre, bandeau recouvert d'un tulle qui se lève). */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'sur-mesure', fichier: 'sur-mesure', imagePartage: 'site/robe-sur-mesure-1400.webp' };

export default (c) => {
  const I = c.donnees.images.images;
  const P = Object.fromEntries(c.donnees.produits.map((p) => [p.id, p]));
  const piece = (id, k, alt, o = {}) => c.media({ nom: P[id].photos[k].nom, alt, cadrage: P[id].photos[k].cadrage, sizes: o.sizes || '(max-width: 760px) 90vw, 40vw', classe: o.classe || '', attrs: o.attrs || '' });
  const projets = ['mariee', 'demoiselle', 'enfant', 'quotidien', 'scene', 'style'];
  return html`
<section class="sm-tete theme-rose" id="debut">
  <div class="conteneur sm-tete-texte">
    <p class="kicker">${c.t('surmesure.tete.kicker')}</p>
    <h1 class="sm-titre">
      <span class="ligne-masque"><span data-anime="gsap" class="sm-ligne">${c.t('surmesure.tete.titre1')}</span></span>
      <span class="ligne-masque"><span data-anime="gsap" class="sm-ligne sm-ligne--sauvage">${c.t('surmesure.tete.titre2')}</span></span>
    </h1>
    <div class="sm-tete-bas" data-anime="gsap">
      <p class="sm-intro">${c.t('surmesure.tete.texte')}</p>
      <p class="sm-actions"><a class="bouton bouton--noir" href="#rendez-vous" data-action-principale data-survol="magnetique">${c.t('surmesure.tete.action')}</a>
      <span class="sm-info" data-info-cle>${c.t('surmesure.tete.info')}</span></p>
    </div>
  </div>
  <div class="sm-bandeau" data-effet="tulle">
    ${c.media({ nom: 'site/robe-sur-mesure', alt: c.s('surmesure.tete.alt'), priorite: true, classe: 'sm-robe', sizes: '(max-width: 760px) 70vw, 30vw' })}
    ${c.media({ nom: 'grok/surmesure-ouverture', alt: I['grok/surmesure-ouverture'].alt, priorite: true, classe: 'sm-tulle', sizes: '100vw', attrs: 'data-superpose' })}
  </div>
</section>

<section class="sm-conseil" id="atelier">
  <div class="conteneur u-duo">
    ${piece('javanaise', 1, c.s('surmesure.atelier.alt'), { classe: 'sm-conseil-media', attrs: 'data-fx="parallaxe"' })}
    <div><h2 data-anime="lignes">${c.t('surmesure.atelier.titre')}</h2><p class="u-grand" data-anime>${c.t('surmesure.atelier.texte')}</p></div>
  </div>
</section>

<section class="sm-mariees theme-creme" id="mariees">
  <div class="conteneur sm-mariees-grille">
    <div class="sm-mariees-texte">
      <p class="kicker">${c.t('surmesure.mariees.kicker')}</p>
      <h2 data-anime="lignes">${c.t('surmesure.mariees.titre')}</h2>
      <p data-anime>${c.t('surmesure.mariees.texte')}</p>
      <p data-anime>${c.t('surmesure.mariees.demoiselles')}</p>
      <p data-anime>${c.lien('sur-mesure', { ancre: 'rendez-vous', params: 'sujet=mariee', classe: 'bouton bouton--noir', texte: c.t('surmesure.mariees.action') })}</p>
    </div>
    ${c.media({ nom: 'grok/surmesure-mariee', alt: I['grok/surmesure-mariee'].alt, classe: 'sm-mariees-media', sizes: '(max-width: 760px) 90vw, 34vw', attrs: 'data-anime="rideau"' })}
    <div class="sm-matieres">
      ${c.media({ nom: 'grok/surmesure-confection', alt: I['grok/surmesure-confection'].alt, classe: 'sm-matieres-media', sizes: '(max-width: 760px) 70vw, 22vw', attrs: 'data-fx="parallaxe"' })}
      <div><h3 data-anime="lignes">${c.t('surmesure.mariees.matieresT')}</h3><p data-anime>${c.t('surmesure.mariees.matieres')}</p></div>
    </div>
  </div>
</section>

<section class="sm-deroule" id="deroule">
  <div class="conteneur sm-deroule-grille">
    <div>
      <p class="kicker">${c.t('surmesure.deroule.kicker')}</p>
      <h2 data-anime="lignes">${c.t('surmesure.deroule.titre')}</h2>
      <ol class="setlist" data-anime="cascade">
        ${[1, 2, 3, 4].map((n) => html`<li><span class="setlist-num">${String(n).padStart(2, '0')}</span><div><h3>${c.t(`surmesure.deroule.e${n}`)}</h3><p>${c.t(`surmesure.deroule.d${n}`)}</p></div></li>`)}
      </ol>
    </div>
    <div class="sm-deroule-visuel">
      <svg class="sm-sillon" viewBox="0 0 400 400" aria-hidden="true" data-fx="trace">${[0, 1, 2, 3, 4].map((i) => html`<circle cx="200" cy="200" r="${120 + i * 18}" fill="none" stroke="currentColor" stroke-width="1.2" />`)}</svg>
      ${piece('envolez-moi', 1, c.s('surmesure.deroule.alt'), { classe: 'sm-deroule-media', sizes: '(max-width: 760px) 70vw, 28vw' })}
    </div>
  </div>
</section>

<section class="sm-enfants theme-rose" id="enfants">
  <div class="conteneur u-duo u-duo--inverse">
    <div><h2 data-anime="lignes">${c.t('surmesure.enfants.titre')}</h2><p class="u-grand" data-anime>${c.t('surmesure.enfants.texte')}</p></div>
    <div class="sm-enfants-visuels">
      ${c.media({ nom: 'site/collage-enfants', alt: I['site/collage-enfants'].alt, classe: 'sm-enfants-collage', sizes: '(max-width: 760px) 80vw, 30vw', attrs: 'data-fx="zoom"' })}
      ${c.media({ nom: 'grok/surmesure-enfants', alt: I['grok/surmesure-enfants'].alt, classe: 'sm-enfants-nuages', sizes: '(max-width: 760px) 50vw, 16vw', attrs: 'data-fx="parallaxe" data-fx-force="14"' })}
    </div>
  </div>
</section>

<section class="sm-scene" id="costumiere">
  ${c.media({ nom: 'grok/surmesure-costumiere', alt: I['grok/surmesure-costumiere'].alt, classe: 'sm-scene-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="12"' })}
  <div class="conteneur">
    <p class="kicker">${c.t('surmesure.scene.kicker')}</p>
    <h2 data-anime="lignes">${c.t('surmesure.scene.titre')}</h2>
    <ul class="sm-scene-cartes" data-anime="cascade">
      ${[1, 2, 3].map((n) => html`<li><h3>${c.t(`surmesure.scene.t${n}`)}</h3><p>${c.t(`surmesure.scene.d${n}`)}</p></li>`)}
    </ul>
  </div>
</section>

<section class="sm-brode theme-creme" id="etiquette">
  <div class="conteneur sm-brode-grille">
    <div>
      <p class="kicker">${c.t('surmesure.brode.kicker')}</p>
      <h2 data-anime="lignes">${c.t('surmesure.brode.titre')}</h2>
      <p data-anime>${c.t('surmesure.brode.texte')}</p>
      <div class="champ"><label for="prenom-brode">${c.t('surmesure.brode.label')}</label><input id="prenom-brode" type="text" maxlength="14" value="${c.s('surmesure.brode.defaut')}" autocomplete="off"></div>
      <p class="note">${c.t('surmesure.brode.note')}</p>
    </div>
    <div class="etiquette-tissee" data-effet="etiquette-brodee" data-visuel>
      <canvas width="900" height="420" role="img" aria-label="${c.s('surmesure.brode.etiquette')}"></canvas>
    </div>
  </div>
</section>

<section class="sm-rdv" id="rendez-vous">
  <div class="conteneur sm-rdv-grille">
    <div class="sm-rdv-tete">
      <p class="kicker">${c.t('surmesure.rdv.kicker')}</p>
      <h2 data-anime="lignes">${c.t('surmesure.rdv.titre')}</h2>
      <p>${c.t('surmesure.rdv.texte')}</p>
      ${piece('envolez-moi', 3, c.s('surmesure.rdv.alt'), { classe: 'sm-rdv-media', sizes: '(max-width: 760px) 60vw, 24vw', attrs: 'data-fx="zoom"' })}
    </div>
    <form class="etapes" data-formulaire data-etapes novalidate>
      <p class="etapes-compteur" aria-live="polite" data-compteur-etape>${c.t('surmesure.rdv.etape', { n: 1 })}</p>
      <div class="etapes-cadre">
        <fieldset class="etape" data-etape="1">
          <legend>${c.t('surmesure.rdv.q1')}</legend>
          <div class="choix">${projets.map((p, i) => html`<label class="choix-carte"><input type="radio" name="sujet" value="${p}"${i === 0 ? ' required' : ''}><span>${c.t(`surmesure.rdv.o${i + 1}`)}</span></label>`)}</div>
          <div class="champ"><label for="rdv-date">${c.t('surmesure.rdv.date')}</label><input id="rdv-date" name="date" type="date"></div>
        </fieldset>
        <fieldset class="etape" data-etape="2" hidden>
          <legend class="visuellement-cache">${c.t('surmesure.rdv.message')}</legend>
          <div class="champ"><label for="rdv-message">${c.t('surmesure.rdv.message')}</label><textarea id="rdv-message" name="message" rows="6" required placeholder="${c.s('surmesure.rdv.messageAide')}"></textarea></div>
        </fieldset>
        <fieldset class="etape" data-etape="3" hidden>
          <legend class="visuellement-cache">${c.t('surmesure.rdv.prenom')}</legend>
          <div class="champs-2">
            <div class="champ"><label for="rdv-prenom">${c.t('surmesure.rdv.prenom')}</label><input id="rdv-prenom" name="prenom" autocomplete="given-name" required></div>
            <div class="champ"><label for="rdv-nom">${c.t('surmesure.rdv.nom')}</label><input id="rdv-nom" name="nom" autocomplete="family-name" required></div>
          </div>
          <div class="champ"><label for="rdv-email">${c.t('surmesure.rdv.email')}</label><input id="rdv-email" name="email" type="email" autocomplete="email" required></div>
          <div class="champ"><label for="rdv-tel">${c.t('surmesure.rdv.tel')}</label><input id="rdv-tel" name="tel" type="tel" autocomplete="tel"></div>
          <p class="mention-donnees">${c.t('surmesure.rdv.mention')}</p>
        </fieldset>
      </div>
      <div class="etapes-boutons">
        <button type="button" class="bouton bouton--contour" data-precedent hidden>${c.t('surmesure.rdv.precedent')}</button>
        <button type="button" class="bouton bouton--rose" data-suivant>${c.t('surmesure.rdv.suivant')}</button>
        <button type="submit" class="bouton bouton--rose" data-envoyer hidden>${c.t('surmesure.rdv.envoyer')}</button>
      </div>
      <aside class="recap" aria-live="polite"><p class="recap-titre">${c.t('surmesure.rdv.recap')}</p><p data-recap>—</p></aside>
      <p data-message-envoi hidden tabindex="-1"></p>
    </form>
  </div>
</section>
`;
};
