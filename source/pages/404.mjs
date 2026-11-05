/* Page 404 : le diamant a sauté. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
<section class="introuvable" id="debut">
  ${c.media({ nom: 'grok/page-404', alt: c.donnees.images.images['grok/page-404'].alt, priorite: true, classe: 'introuvable-media', sizes: '100vw', attrs: 'data-fx="zoom"' })}
  <div class="conteneur introuvable-texte">
    <p class="kicker">404 · Face Z</p>
    <h1 class="introuvable-titre" data-anime="gsap">${c.t('introuvable.titre')}</h1>
    <p>${c.t('introuvable.texte')}</p>
    <p class="introuvable-actions">${c.lien('accueil', { classe: 'bouton bouton--rose', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })}
    ${c.lien('boutique', { classe: 'bouton bouton--contour', texte: c.t('introuvable.boutique') })}</p>
    <p class="hero-info" data-info-cle>madebymelody · Nyon</p>
  </div>
</section>
`;
