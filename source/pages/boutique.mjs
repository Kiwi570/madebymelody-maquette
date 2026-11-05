/* Boutique : ouverture compacte « Le bac » sur kraft, catalogue filtrable, fiche en pochette double, panier simulé. */
import { html, brut } from '../../outils/gabarit.mjs';
import { disqueSvg } from '../gabarits/commun.mjs';

export const page = { cle: 'boutique', fichier: 'boutique', imagePartage: 'pieces/peacock-1-1200.webp' };

const TYPES = ['robe', 'haut', 'jupe', 'short', 'veste', 'pantalon', 'autre'];
const famille = (t) => (TYPES.includes(t) ? t : 'autre');
const piste = (n) => String(n).padStart(2, '0');
const BAC = ['javanaise', 'supernature', 'envolez-moi', 'peacock', 'playground'];

export default (c) => {
  const prods = c.donnees.produits;
  const P = Object.fromEntries(prods.map((p) => [p.id, p]));
  const typeTexte = (p) => c.s('boutique.types.' + (p.type || 'piece'));
  const ac = c.s('boutique.fiche.aCompleter');
  return html`
<section class="b-tete" id="debut">
  ${c.media({ nom: 'grok/boutique-fond', alt: c.s('boutique.tete.alt'), priorite: true, classe: 'b-tete-fond', sizes: '100vw' })}
  <div class="conteneur b-tete-grille">
    <div class="b-tete-texte">
      <p class="kicker">${c.t('boutique.tete.kicker')}</p>
      <h1 class="b-titre" data-anime="gsap">${c.t('boutique.tete.titre')}</h1>
      <p data-anime="gsap" class="b-intro">${c.t('boutique.tete.texte')}</p>
      <p class="b-info" data-info-cle>${c.t('boutique.tete.info')}</p>
      <p class="b-actions" data-anime="gsap">
        <button type="button" class="bouton bouton--noir" data-aleatoire data-action-principale>${c.t('boutique.tete.action')}</button>
        <a class="bouton bouton--contour" href="#catalogue">${c.t('boutique.tete.catalogue')}</a>
      </p>
    </div>
    <div class="bac3d" data-effet="bac" aria-hidden="true">
      <div class="bac3d-pochettes">
        ${BAC.map((id, i) => html`<div class="bac3d-pochette" style="--i:${i}">${c.media({ nom: P[id].photos[0].nom, alt: '', cadrage: P[id].photos[0].cadrage, priorite: i > 2, sizes: '(max-width: 760px) 40vw, 18vw' })}</div>`)}
      </div>
      <div class="bac3d-caisse"><span>madebymelody · 29</span></div>
    </div>
  </div>
</section>

<section class="catalogue theme-creme" id="catalogue">
  <div class="conteneur">
    <div class="filtres" role="group" aria-label="${c.s('boutique.filtres.titre')}">
      <div class="filtre-groupe" data-filtre="type">
        <span class="filtre-nom">${c.t('boutique.filtres.type')}</span>
        <button type="button" class="puce" data-valeur="" aria-pressed="true">${c.t('boutique.filtres.tout')}</button>
        ${TYPES.map((t) => html`<button type="button" class="puce" data-valeur="${t}" aria-pressed="false">${c.t('boutique.filtres.' + t)} <small>${prods.filter((p) => famille(p.type) === t).length}</small></button>`)}
      </div>
      <div class="filtre-groupe" data-filtre="face">
        <span class="filtre-nom">${c.t('boutique.filtres.face')}</span>
        <button type="button" class="puce" data-valeur="" aria-pressed="true">${c.t('boutique.filtres.faceTout')}</button>
        <button type="button" class="puce" data-valeur="A" aria-pressed="false">${c.t('boutique.filtres.faceA')}</button>
        <button type="button" class="puce" data-valeur="B" aria-pressed="false">${c.t('boutique.filtres.faceB')}</button>
      </div>
      <p class="filtres-resultat" aria-live="polite" data-resultat data-un="${c.s('boutique.filtres.resultat1')}" data-plusieurs="${c.s('boutique.filtres.resultat')}">${c.t('boutique.filtres.resultat', { n: prods.length })}</p>
    </div>
    <p class="note">${c.t('boutique.filtres.faceNote')}</p>
    <ul class="grille-pieces" data-grille data-anime="cascade">
      ${prods.map((p) => html`<li class="carte-piece" data-id="${p.id}" data-type="${famille(p.type)}" data-face="${p.face}" data-survol="incline" data-survol-force="4">
        <a class="carte-lien" href="${c.url('boutique', '', `piece=${p.id}`)}" data-sans-transition data-ouvrir-fiche="${p.id}" aria-label="${c.s('boutique.carte.voir', { nom: p.nom })}">
          ${c.media({ nom: p.photos[0].nom, alt: `${p.nom}, ${typeTexte(p).toLowerCase()} madebymelody`, cadrage: p.photos[0].cadrage, sizes: '(max-width: 560px) 46vw, (max-width: 1100px) 30vw, 22vw', classe: 'carte-piece-media' })}
        </a>
        <div class="carte-piece-texte">
          <p class="carte-piece-num">${c.t('boutique.carte.piste')} ${piste(p.piste)}</p>
          <h2 class="carte-piece-nom">${p.nom}</h2>
          <p class="carte-piece-meta">${typeTexte(p)} · ${p.taille || c.s('boutique.carte.tailleAC')}</p>
          <p class="carte-piece-bas"><span class="carte-piece-prix" data-prix>${p.prix} CHF</span>
          <button type="button" class="bouton bouton--petit" data-ajouter="${p.id}" data-libelle-ajoute="${c.s('boutique.carte.ajoute')}" data-libelle-ajouter="${c.s('boutique.carte.ajouter')}">${c.t('boutique.carte.ajouter')}</button></p>
        </div>
      </li>`)}
      <li class="carte-mesure">${c.lien('sur-mesure', { ancre: 'rendez-vous', classe: 'carte-mesure-lien', texte: html`<span class="carte-mesure-titre">${c.t('boutique.mesure.titre')}</span><span>${c.t('boutique.mesure.texte')}</span><span class="bouton bouton--rose">${c.t('boutique.mesure.action')}</span>` })}</li>
    </ul>
    <p class="grille-vide" data-vide hidden>${c.t('boutique.filtres.vide')}</p>
  </div>
</section>

<section class="b-infos" id="infos">
  <div class="conteneur u-duo">
    <div>
      <h2 data-anime="lignes">${c.t('boutique.infos.titre')}</h2>
      <p class="u-grand" data-anime>${c.t('boutique.infos.texte')}</p>
      <ul class="b-infos-liste" data-anime="cascade">
        <li>${c.t('univers.experience.d1')}</li><li>${c.t('univers.experience.d2')}</li><li>${c.t('boutique.panier.paiement')}</li><li>${c.t('boutique.panier.prixTva')}</li>
      </ul>
    </div>
    ${c.media({ nom: 'site/robe-rouge-herbe', alt: c.s('boutique.infos.alt'), classe: 'b-infos-media', sizes: '(max-width: 760px) 90vw, 44vw', attrs: 'data-fx="zoom"' })}
  </div>
</section>

<div class="fiches" hidden>
  ${prods.map((p) => html`<article class="fiche-contenu" data-fiche="${p.id}">
    <div class="fiche-photos">
      <div class="fiche-photo-principale">${p.photos.map((ph, k) => c.media({ nom: ph.nom, alt: `${p.nom}, vue ${k + 1}`, cadrage: '50% 50%', sizes: '(max-width: 760px) 92vw, 46vw', classe: 'fiche-photo' + (k === 0 ? ' est-active' : ''), attrs: `data-vue="${k}"` }))}</div>
      ${p.photos.length > 1 ? html`<div class="fiche-vignettes" role="group" aria-label="${c.s('boutique.fiche.photos')}">${p.photos.map((ph, k) => html`<button type="button" class="fiche-vignette" data-vue-bouton="${k}" aria-label="${p.nom}, vue ${k + 1}"${k === 0 ? brut(' aria-current="true"') : ''}>${c.media({ nom: ph.nom, alt: '', cadrage: ph.cadrage, sizes: '80px' })}</button>`)}</div>` : ''}
    </div>
    <div class="fiche-texte">
      <p class="kicker">${c.t('boutique.carte.piste')} ${piste(p.piste)} · Face ${p.face}</p>
      <h2 class="fiche-nom">${p.nom}</h2>
      <p class="fiche-prix" data-prix>${p.prix} CHF</p>
      <p class="fiche-description">${p.description || c.s('boutique.fiche.descriptionACompleter')}</p>
      <dl class="notes">
        <div><dt>${c.t('boutique.fiche.taille')}</dt><dd>${p.taille || ac}</dd></div>
        <div><dt>${c.t('boutique.fiche.matiere')}</dt><dd>${p.matiere || ac}</dd></div>
        <div><dt>${c.t('boutique.fiche.mesures')}</dt><dd>${p.mesures || ac}</dd></div>
      </dl>
      <p class="fiche-unique">${c.t('boutique.fiche.unique')}</p>
      <p class="note">${c.t('boutique.fiche.numero')}</p>
      <p class="fiche-actions"><button type="button" class="bouton bouton--rose" data-ajouter="${p.id}" data-libelle-ajoute="${c.s('boutique.fiche.ajoute')}" data-libelle-ajouter="${c.s('boutique.fiche.ajouter')}">${c.t('boutique.fiche.ajouter')}</button></p>
    </div>
  </article>`)}
</div>

<div class="fiche" id="fiche" role="dialog" aria-modal="true" aria-labelledby="fiche-titre" data-recouvrement hidden>
  <div class="fiche-fond" data-fermer-fiche></div>
  <div class="fiche-pochette">
    <div class="fiche-volet fiche-volet--g" aria-hidden="true">${disqueSvg({ id: 'fiche' })}</div>
    <div class="fiche-corps" data-fiche-corps></div>
    <div class="fiche-nav">
      <button type="button" class="bouton bouton--contour bouton--petit" data-fiche-pas="-1">← ${c.t('boutique.fiche.precedente')}</button>
      <button type="button" class="bouton bouton--contour bouton--petit" data-fiche-pas="1">${c.t('boutique.fiche.suivante')} →</button>
    </div>
    <button type="button" class="fiche-fermer" data-fermer-fiche aria-label="${c.s('boutique.fiche.fermer')}">×</button>
    <h2 id="fiche-titre" class="visuellement-cache" data-fiche-titre></h2>
  </div>
</div>

<aside class="panier" id="panier" role="dialog" aria-modal="true" aria-labelledby="panier-titre" data-recouvrement hidden>
  <div class="panier-fond" data-fermer-panier></div>
  <div class="panier-tiroir">
    <h2 id="panier-titre">${c.t('boutique.panier.titre')}</h2>
    <button type="button" class="fiche-fermer" data-fermer-panier aria-label="${c.s('boutique.panier.fermer')}">×</button>
    <ul class="panier-liste" data-panier-liste data-retirer="${c.s('boutique.panier.retirer')}"></ul>
    <p class="panier-vide" data-panier-vide>${c.t('boutique.panier.vide')}</p>
    <p class="panier-total"><span>${c.t('boutique.panier.total')}</span> <b data-prix data-panier-total aria-live="polite">0 CHF</b></p>
    <p class="note">${c.t('boutique.panier.livraison')}<br>${c.t('boutique.panier.paiement')}<br>${c.t('boutique.panier.prixTva')}</p>
    <button type="button" class="bouton bouton--rose" data-commander>${c.t('boutique.panier.commander')}</button>
    <p class="panier-message" data-panier-message hidden tabindex="-1">${c.t('boutique.panier.simule')}</p>
  </div>
</aside>
`;
};
