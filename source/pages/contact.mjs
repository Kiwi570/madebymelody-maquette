/* Contact : ouverture « L'étiquette » (fond cerise, numéro en très grand sur une étiquette de 45 tours qui tourne puis s'arrête). */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'pieces/javanaise-1-1200.webp' };

export default (c) => {
  const k = c.site.contact;
  const I = c.donnees.images.images;
  return html`
<section class="c-tete theme-cerise" id="debut">
  <div class="conteneur c-tete-grille">
    <div class="c-tete-texte">
      <p class="kicker">${c.t('contact.tete.kicker')}</p>
      <h1 class="c-titre" data-anime="gsap">${c.t('contact.tete.titre')}</h1>
      <p class="c-info" data-info-cle>${c.t('contact.tete.info')}</p>
      <p class="c-actions" data-anime="gsap">
        <a class="bouton bouton--creme" href="tel:${k.telephoneLien}" data-action-principale>${c.t('contact.tete.action')}</a>
        <a class="bouton bouton--contour" href="mailto:${k.email}">${k.email}</a>
      </p>
    </div>
    <div class="etiquette-geante" data-effet="etiquette">
      <svg class="etiquette-cercle" viewBox="0 0 400 400" aria-hidden="true" focusable="false" data-audit-ignorer>
        <defs><path id="c-arc" d="M200 200 m-160 0 a160 160 0 1 1 320 0 a160 160 0 1 1 -320 0" /></defs>
        <circle cx="200" cy="200" r="196" class="etiquette-fond" />
        ${[0, 1, 2].map((i) => html`<circle cx="200" cy="200" r="${186 - i * 6}" class="etiquette-filet" />`)}
        <text class="etiquette-texte"><textPath href="#c-arc" textLength="1000" lengthAdjust="spacing">${c.t('contact.tete.cercle')}</textPath></text>
        <circle cx="200" cy="200" r="5" class="disque-trou" />
      </svg>
      <a class="etiquette-numero" href="tel:${k.telephoneLien}"><span>${c.t('contact.tete.numero1')}</span><span>${c.t('contact.tete.numero2')}</span></a>
    </div>
  </div>
  ${c.media({ nom: 'grok/contact-ouverture', alt: c.s('contact.tete.alt'), classe: 'c-bandeau', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="12"' })}
</section>

<section class="c-canaux theme-creme" id="message">
  <div class="conteneur c-canaux-grille">
    <div>
      <h2 data-anime="lignes">${c.t('contact.canaux.titre')}</h2>
      <p data-anime>${c.t('contact.canaux.texte')}</p>
      <dl class="notes notes--clair" data-anime="cascade">
        <div><dt>${c.t('contact.canaux.adresse')}</dt><dd>${k.adresse}</dd></div>
        <div><dt>${c.t('contact.canaux.telephone')}</dt><dd><a href="tel:${k.telephoneLien}">${k.telephone}</a></dd></div>
        <div><dt>${c.t('contact.canaux.email')}</dt><dd><a href="mailto:${k.email}">${k.email}</a></dd></div>
        <div><dt>${c.t('contact.canaux.horaires')}</dt><dd>${c.t('contact.canaux.horairesV')}</dd></div>
      </dl>
      ${c.media({ nom: c.donnees.produits.find((p) => p.id === 'supernature').photos[1].nom, alt: c.s('contact.canaux.alt'), cadrage: c.donnees.produits.find((p) => p.id === 'supernature').photos[1].cadrage, classe: 'c-canaux-media', sizes: '(max-width: 760px) 90vw, 40vw', attrs: 'data-anime="rideau"' })}
    </div>
    <form class="c-form" data-formulaire novalidate>
      <h2 class="c-form-titre">${c.t('contact.form.titre')}</h2>
      <div class="champs-2">
        <div class="champ"><label for="c-prenom">${c.t('contact.form.prenom')}</label><input id="c-prenom" name="prenom" autocomplete="given-name" required></div>
        <div class="champ"><label for="c-nom">${c.t('contact.form.nom')}</label><input id="c-nom" name="nom" autocomplete="family-name" required></div>
      </div>
      <div class="champ"><label for="c-email">${c.t('contact.form.email')}</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
      <div class="champ"><label for="c-sujet">${c.t('contact.form.sujet')}</label><select id="c-sujet" name="sujet"><option value="boutique">${c.t('contact.form.s1')}</option><option value="sur-mesure">${c.t('contact.form.s2')}</option><option value="autre">${c.t('contact.form.s3')}</option></select></div>
      <div class="champ"><label for="c-message">${c.t('contact.form.message')}</label><textarea id="c-message" name="message" rows="6" required></textarea></div>
      <p class="mention-donnees">${c.t('contact.form.mention')}</p>
      <p><button type="submit" class="bouton bouton--noir">${c.t('contact.form.envoyer')}</button></p>
      <p data-message-envoi hidden tabindex="-1"></p>
    </form>
  </div>
</section>

<section class="c-acces" id="acces">
  <div class="conteneur c-acces-grille">
    <div>
      <h2 data-anime="lignes">${c.t('contact.acces.titre')}</h2>
      <p data-anime>${c.t('contact.acces.texte')}</p>
      <p data-anime><a class="bouton bouton--rose" href="https://www.google.com/maps/search/?api=1&amp;query=Ch.%20de%20Cr%C3%A8ve-C%C5%93ur%203%2C%201260%20Nyon" target="_blank" rel="noopener">${c.t('contact.acces.itineraire')} <span class="visuellement-cache">${c.t('commun.nouvelOnglet')}</span></a></p>
      <div class="c-insta">
        ${c.media({ nom: 'site/rayures-tennis', alt: c.s('contact.insta.alt'), classe: 'c-insta-media', sizes: '(max-width: 760px) 40vw, 14vw' })}
        <div><h3>${c.t('contact.insta.titre')}</h3><p>${c.t('contact.insta.texte')}</p>
        <p><a class="lien-fleche" href="${k.instagram}" target="_blank" rel="noopener">@madebymelody.ch <span class="visuellement-cache">${c.t('commun.nouvelOnglet')}</span></a></p></div>
      </div>
    </div>
    <figure class="plan" data-visuel>
      <svg viewBox="0 0 600 440" role="img" aria-label="${c.s('contact.acces.plan')}" data-fx="trace">
        <path class="plan-lac" d="M0 300 C 90 280, 160 330, 250 300 S 420 250, 600 210 L 600 440 L 0 440 Z" />
        <path class="plan-rive" d="M0 300 C 90 280, 160 330, 250 300 S 420 250, 600 210" fill="none" />
        <path class="plan-route" d="M30 120 C 160 150, 260 190, 340 205 S 500 190, 590 150" fill="none" />
        <path class="plan-route plan-route--fine" d="M300 40 C 300 110, 290 170, 270 250" fill="none" />
        <path class="plan-chemin" d="M244 224 C 252 232, 260 238, 266 242" fill="none" />
        <circle class="plan-ville" cx="270" cy="246" r="7" data-repere />
        <text class="plan-texte" x="286" y="262">${c.t('contact.acces.nyon')}</text>
        <text class="plan-texte plan-texte--lac" x="380" y="360">${c.t('contact.acces.lac')}</text>
        <g class="plan-epingle" data-repere><path d="M244 160 c-14 0 -24 10 -24 24 c0 18 24 40 24 40 s24 -22 24 -40 c0 -14 -10 -24 -24 -24 z" /><circle cx="244" cy="184" r="8" /></g>
        <text class="plan-texte plan-texte--atelier" x="120" y="152">${c.t('contact.acces.atelier')}</text>
      </svg>
    </figure>
  </div>
</section>
`;
};
