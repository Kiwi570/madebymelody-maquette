/* Effets des pages intérieures : ouvertures propres (disque-sort, tulle, bac, etiquette) et éléments ludiques
   (melangeur, etiquette-brodee, rendez-vous en étapes, catalogue, fiche, panier). */

export function initPages(o) {
  const { gsap, ST, etat, PAGES, $, $$, clamp } = o;
  const anime = gsap && ST && !etat.calme;
  const fin = (f) => PAGES.finals.push(f);

  /* ---------- L'univers : le disque sort de la pochette ---------- */
  const pochette = $('.u-pochette');
  if (pochette) {
    const d = $('.u-pochette-disque', pochette);
    PAGES.ouvertures.univers = (tl, t0, intro) => {
      tl.fromTo('.u-ligne', { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power4.out' }, t0)
        .fromTo('.u-intro, .u-actions', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, t0 + 0.25)
        .fromTo('.u-pochette-cadre', { y: 40, opacity: intro ? 0 : 1, rotate: -3 }, { y: 0, opacity: 1, rotate: 0, duration: 0.6, ease: 'power3.out' }, t0)
        .fromTo(d, { xPercent: 0, rotate: 0 }, { xPercent: 34, rotate: 200, duration: 0.9, ease: 'power3.out' }, t0 + 0.2);
    };
    fin(() => gsap.set(d, { xPercent: 34, rotate: 0 }));
    if (anime) gsap.fromTo(d, { rotate: 0 }, { rotate: 260, xPercent: 52, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.u-tete', start: 'top top', end: 'bottom top', scrub: 0.5 } });
    else gsap && gsap.set(d, { xPercent: 34 });
  }

  /* ---------- Mélangeur : trois faders, la matière fond dans l'autre, la lettre devient sauvage ---------- */
  $$('.tranche').forEach((t, i) => {
    const r = $('.tranche-fader', t);
    let touche = false;
    const regler = (v) => { t.style.setProperty('--m', v); r.value = v; };
    r.addEventListener('input', () => { touche = true; t.style.setProperty('--m', r.value); });
    if (anime) {
      ST.create({ trigger: t, start: 'top 85%', end: 'bottom 25%', scrub: 0.4,
        onUpdate: (st) => { if (!touche) regler(Math.round(clamp(st.progress * 1.25 - i * 0.06) * 100)); } });
    } else regler(50);
  });

  /* ---------- Sur mesure : le voile de tulle se lève sur la robe ---------- */
  const tulle = $('.sm-tulle');
  if (tulle) {
    PAGES.ouvertures['sur-mesure'] = (tl, t0, intro) => {
      tl.fromTo('.sm-ligne', { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.14, ease: 'power4.out' }, t0)
        .fromTo('.sm-tete-bas', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, t0 + 0.3)
        .fromTo(tulle, { yPercent: -30, opacity: intro ? 0 : 1 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, t0);
    };
    if (anime) gsap.fromTo(tulle, { yPercent: 0, opacity: 1 }, { yPercent: -78, opacity: 0.12, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.sm-bandeau', start: 'top 85%', end: 'bottom 20%', scrub: 0.6 } });
    else gsap && gsap.set(tulle, { yPercent: -60, opacity: 0.25 });
  }

  /* ---------- Étiquette brodée : le prénom se brode point par point ---------- */
  const tissee = $('.etiquette-tissee canvas');
  if (tissee) broderie(tissee, $('#prenom-brode'), o);

  /* ---------- Rendez-vous en étapes ---------- */
  const etapes = $('[data-etapes]');
  if (etapes) rendezVous(etapes, o);

  /* ---------- Boutique ---------- */
  if ($('.bac3d')) boutique(o);

  /* ---------- Contact : l'étiquette tourne puis s'arrête ---------- */
  const geante = $('.etiquette-geante');
  if (geante) {
    const cercle = $('.etiquette-cercle', geante);
    PAGES.ouvertures.contact = (tl, t0, intro) => {
      tl.fromTo('.c-titre', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power4.out' }, t0)
        .fromTo('.c-actions', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, t0 + 0.2)
        .fromTo(geante, { scale: 0.7, rotate: -40, opacity: intro ? 0 : 1 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.9, ease: 'expo.out' }, t0)
        .fromTo(cercle, { rotate: -540 }, { rotate: 0, duration: 1.4, ease: 'expo.out' }, t0);
    };
    if (anime) gsap.fromTo(cercle, { rotate: 0 }, { rotate: 160, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.c-tete', start: 'top top', end: 'bottom top', scrub: 0.6 } });
  }

  /* ---------- 404 ---------- */
  if ($('.introuvable-titre')) PAGES.ouvertures['404'] = (tl, t0) => tl.fromTo('.introuvable-titre', { yPercent: 40, opacity: 0, rotate: -2 }, { yPercent: 0, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(2)' }, t0);

  fin(() => { const els = $$('.u-ligne, .u-intro, .u-actions, .u-pochette-cadre, .sm-ligne, .sm-tete-bas, .c-titre, .c-actions, .etiquette-geante, .etiquette-cercle, .b-titre, .b-intro, .b-actions, .introuvable-titre'); if (gsap && els.length) gsap.set(els, { clearProps: 'transform,opacity' }); });
  fin(() => tulle && gsap.set(tulle, { yPercent: 0, opacity: 1 }));
}

/* ---------- Broderie sur une étiquette tissée (canvas 2D) ---------- */
function broderie(canvas, champ, { gsap, ST, etat, boucle }) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const etat2 = { p: etat.calme ? 1 : 0, nom: champ ? champ.value : '' };
  const motif = document.createElement('canvas'); motif.width = 8; motif.height = 8;
  const m = motif.getContext('2d'); m.fillStyle = '#c8102e'; m.fillRect(0, 0, 8, 8); m.strokeStyle = '#7a0a1c'; m.lineWidth = 1.2; m.beginPath(); m.moveTo(0, 8); m.lineTo(8, 0); m.moveTo(-4, 4); m.lineTo(4, -4); m.moveTo(4, 12); m.lineTo(12, 4); m.stroke();
  m.strokeStyle = 'rgba(255,255,255,.35)'; m.lineWidth = .8; m.beginPath(); m.moveTo(0, 6); m.lineTo(6, 0); m.stroke();
  const fil = ctx.createPattern(motif, 'repeat');
  const dessiner = () => {
    ctx.clearRect(0, 0, W, H);
    /* Ruban tissé : fond crème, trame fine, liseré rose cousu. */
    ctx.fillStyle = '#f7efe2'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(20,17,19,.05)'; ctx.lineWidth = 1;
    for (let y = 0; y < H; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.fillStyle = '#f4c6cf'; ctx.fillRect(0, 0, W, 34); ctx.fillRect(0, H - 34, W, 34);
    ctx.setLineDash([14, 9]); ctx.lineDashOffset = -etat2.p * 120; ctx.strokeStyle = '#b30e29'; ctx.lineWidth = 2.5;
    ctx.strokeRect(22, 50, W - 44, H - 100); ctx.setLineDash([]);
    ctx.fillStyle = '#141113'; ctx.textAlign = 'center';
    ctx.font = '500 22px "DM Mono", monospace'; ctx.fillText('MADEBYMELODY · FAIT MAIN À NYON', W / 2, 26);
    ctx.fillText('PIÈCE UNIQUE · SUR MESURE', W / 2, H - 10);
    /* Le prénom, brodé de gauche à droite. */
    const nom = (etat2.nom || '').trim().slice(0, 14) || ' ';
    let taille = 150; ctx.font = `800 ${taille}px Fraunces, Georgia, serif`;
    while (ctx.measureText(nom).width > W - 140 && taille > 50) { taille -= 6; ctx.font = `800 ${taille}px Fraunces, Georgia, serif`; }
    const largeur = ctx.measureText(nom).width, x0 = (W - largeur) / 2, front = x0 + largeur * etat2.p;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, front, H); ctx.clip();
    const y = H / 2 + taille * 0.34;
    ctx.shadowColor = 'rgba(60,0,10,.45)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#9e0c24'; ctx.fillText(nom, W / 2, y);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = fil; ctx.fillText(nom, W / 2, y);
    ctx.strokeStyle = 'rgba(255,214,222,.55)'; ctx.lineWidth = 1.2; ctx.strokeText(nom, W / 2 - 1, y - 1.5);
    ctx.strokeStyle = '#5c0613'; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]); ctx.lineDashOffset = 0; ctx.strokeText(nom, W / 2, y); ctx.setLineDash([]);
    ctx.restore();
    if (etat2.p > 0 && etat2.p < 1) {
      /* L'aiguille et son fil au front de la broderie. */
      ctx.strokeStyle = '#8a8d93'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(front, H / 2 - taille * 0.7); ctx.lineTo(front + 18, H / 2 + taille * 0.3); ctx.stroke();
      ctx.strokeStyle = '#b30e29'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(front, H / 2 - taille * 0.7); ctx.quadraticCurveTo(front - 60, 40, front - 140, 60); ctx.stroke();
    }
  };
  const pret = document.fonts ? document.fonts.ready : Promise.resolve();
  pret.then(dessiner);
  if (!gsap || !ST || etat.calme) { champ && champ.addEventListener('input', () => { etat2.nom = champ.value; dessiner(); }); return; }
  ST.create({ trigger: canvas, start: 'top 85%', end: 'center 45%', scrub: 0.4, onUpdate: (st) => { if (!etat2.saisie) { etat2.p = st.progress; dessiner(); } } });
  champ && champ.addEventListener('input', () => {
    etat2.nom = champ.value; etat2.saisie = true;
    gsap.fromTo(etat2, { p: 0 }, { p: 1, duration: Math.min(2.2, 0.5 + etat2.nom.length * 0.12), ease: 'none', overwrite: true, onUpdate: dessiner });
  });
}

/* ---------- Formulaire de rendez-vous en trois étapes, récapitulatif en direct ---------- */
function rendezVous(f, { gsap, etat }) {
  const etapes = [...f.querySelectorAll('[data-etape]')];
  const prec = f.querySelector('[data-precedent]'), suiv = f.querySelector('[data-suivant]'), env = f.querySelector('[data-envoyer]');
  const compteur = f.querySelector('[data-compteur-etape]'), recap = f.querySelector('[data-recap]'), cadre = f.querySelector('.etapes-cadre');
  const modele = compteur.textContent.replace(/\d/, '{n}');
  let n = 0;
  const msg = { requis: 'Ce champ est à remplir.', email: 'Adresse e-mail à vérifier (exemple : nom@domaine.ch).' };
  const erreur = (c, m) => {
    const id = 'erreur-' + (c.id || c.name);
    let p = document.getElementById(id);
    if (!m) { if (p) p.textContent = ''; c.removeAttribute('aria-invalid'); return; }
    if (!p) { p = document.createElement('p'); p.id = id; p.className = 'champ-erreur'; p.setAttribute('aria-live', 'polite'); (c.closest('.champ') || c.closest('.choix') || c.parentElement).appendChild(p); c.setAttribute('aria-describedby', id); }
    p.textContent = m; c.setAttribute('aria-invalid', 'true');
  };
  const valider = (fs) => {
    let premier = null;
    fs.querySelectorAll('input, textarea, select').forEach((c) => {
      if (c.type === 'radio') {
        if (!c.required) return;
        const ok = !!fs.querySelector(`[name="${c.name}"]:checked`);
        erreur(c, ok ? '' : msg.requis); if (!ok && !premier) premier = c; return;
      }
      const v = c.value.trim();
      let m = c.required && !v ? msg.requis : '';
      if (!m && v && c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = msg.email;
      erreur(c, m); if (m && !premier) premier = c;
    });
    if (premier) premier.focus();
    return !premier;
  };
  const majRecap = () => {
    const choix = f.querySelector('[name="sujet"]:checked');
    const parts = [choix ? choix.closest('label').textContent.trim() : '', f.date.value, f.prenom.value && `${f.prenom.value} ${f.nom.value}`.trim(), f.email.value].filter(Boolean);
    recap.textContent = parts.length ? parts.join(' · ') : '—';
  };
  const montrer = (k, focus = true) => {
    const h0 = cadre.offsetHeight;
    etapes.forEach((e, i) => { e.hidden = i !== k; });
    n = k;
    prec.hidden = k === 0; suiv.hidden = k === etapes.length - 1; env.hidden = k !== etapes.length - 1;
    compteur.textContent = modele.replace('{n}', k + 1);
    if (gsap && !etat.calme) { const h1 = cadre.offsetHeight; gsap.fromTo(cadre, { height: h0 }, { height: h1, duration: 0.35, ease: 'power2.out', clearProps: 'height' }); gsap.fromTo(etapes[k], { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35 }); }
    if (focus) (etapes[k].querySelector('input, textarea') || etapes[k]).focus({ preventScroll: true });
    window.dispatchEvent(new Event('resize'));
  };
  suiv.addEventListener('click', () => { if (valider(etapes[n])) montrer(n + 1); });
  prec.addEventListener('click', () => montrer(n - 1));
  f.addEventListener('input', majRecap); f.addEventListener('change', majRecap);
  /* Le socle valide tout à l'envoi ; on revient à l'étape qui pose problème. */
  f.addEventListener('submit', () => { const k = etapes.findIndex((e) => !valider(e)); if (k >= 0 && k !== n) montrer(k); }, true);
  majRecap();
}

/* ---------- Boutique : bac d'ouverture, filtres, lecture aléatoire, fiche en pochette double, panier ---------- */
function boutique({ gsap, ST, etat, PAGES, $, $$ }) {
  const anime = gsap && ST && !etat.calme;
  const fin = (f) => PAGES.finals.push(f);
  PAGES.ouvertures.boutique = (tl, t0, intro) => {
    tl.fromTo('.b-titre', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power4.out' }, t0)
      .fromTo('.b-intro, .b-actions', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, t0 + 0.2)
      .fromTo('.bac3d-pochette', { yPercent: 70, opacity: intro ? 0 : 1 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'back.out(1.6)' }, t0);
  };
  fin(() => { const els = $$('.bac3d-pochette'); if (gsap && els.length) gsap.set(els, { clearProps: 'transform,opacity' }); });
  if (anime) {
    $$('.bac3d-pochette').forEach((p, i) => gsap.fromTo(p, { rotateX: -14, y: 0 }, { rotateX: -2 - i * 2, y: -i * 10, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.b-tete', start: 'top top', end: 'bottom top', scrub: 0.5 } }));
  }

  /* Données des pièces lues dans la page (prix, nom, photo). */
  const cartes = $$('.carte-piece');
  const infos = Object.fromEntries(cartes.map((c) => [c.dataset.id, { id: c.dataset.id, nom: $('.carte-piece-nom', c).textContent, prix: parseFloat($('.carte-piece-prix', c).textContent), img: $('img', c).currentSrc || $('img', c).src }]));

  /* Filtres gardés dans l'adresse. */
  const resultat = $('[data-resultat]'), vide = $('[data-vide]');
  const choix = { type: '', face: '' };
  const params = new URLSearchParams(location.search);
  ['type', 'face'].forEach((k) => { if (params.get(k)) choix[k] = params.get(k); });
  const appliquer = (pousser) => {
    let n = 0;
    cartes.forEach((c) => {
      const ok = (!choix.type || c.dataset.type === choix.type) && (!choix.face || c.dataset.face === choix.face);
      const avant = !c.classList.contains('est-cachee');
      c.classList.toggle('est-cachee', !ok);
      if (ok) n++;
      if (ok && !avant && gsap && !etat.calme) gsap.fromTo(c, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, clearProps: 'opacity,transform' });
    });
    $$('[data-filtre]').forEach((g) => $$('.puce', g).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valeur === choix[g.dataset.filtre]))));
    resultat.textContent = n === 1 ? resultat.dataset.un : resultat.dataset.plusieurs.replace('{n}', n);
    vide.hidden = n > 0;
    if (pousser) {
      const u = new URL(location.href);
      ['type', 'face'].forEach((k) => (choix[k] ? u.searchParams.set(k, choix[k]) : u.searchParams.delete(k)));
      history.replaceState(history.state, '', u);
    }
    if (ST) ST.refresh();
  };
  $$('[data-filtre]').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('.puce'); if (!b) return;
    choix[g.dataset.filtre] = b.dataset.valeur;
    appliquer(true);
  }));
  appliquer(false);

  /* Fenêtres : focus gardé dedans, Échap, retour du focus. */
  const ouvrirFenetre = (el, retour) => {
    el.hidden = false; el.__retour = retour || document.activeElement;
    document.documentElement.classList.add('defilement-bloque');
    const pieges = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); el.__fermer(); return; }
      if (e.key !== 'Tab') return;
      const f = [...el.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')].filter((x) => !x.hidden && x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    el.addEventListener('keydown', pieges); el.__pieges = pieges;
  };
  const fermerFenetre = (el) => {
    el.hidden = true; el.removeEventListener('keydown', el.__pieges);
    if (!$('.fiche:not([hidden]), .panier:not([hidden])')) document.documentElement.classList.remove('defilement-bloque');
    if (el.__retour && el.__retour.focus) el.__retour.focus({ preventScroll: true });
  };

  /* Fiche : la pochette s'ouvre en double page ; chaque pièce a son lien (?piece=…). */
  const fiche = $('#fiche'), corps = $('[data-fiche-corps]'), titre = $('[data-fiche-titre]');
  const ordre = cartes.map((c) => c.dataset.id);
  let courante = null;
  const montrerFiche = (id, { pousser = true, retour } = {}) => {
    const src = $(`[data-fiche="${id}"]`); if (!src) return;
    courante = id;
    corps.replaceChildren(src.cloneNode(true));
    titre.textContent = infos[id].nom;
    majPanier();
    if (fiche.hidden) ouvrirFenetre(fiche, retour);
    $('.fiche-fermer', fiche).focus({ preventScroll: true });
    if (gsap && !etat.calme) gsap.fromTo('.fiche-pochette', { rotateY: -24, scale: 0.94, opacity: 0, transformPerspective: 1200 }, { rotateY: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out', clearProps: 'transform' });
    if (pousser) { const u = new URL(location.href); u.searchParams.set('piece', id); history.pushState({ piece: id }, '', u); }
  };
  fiche.__fermer = () => {
    fermerFenetre(fiche); courante = null;
    const u = new URL(location.href); if (u.searchParams.has('piece')) { u.searchParams.delete('piece'); history.replaceState(null, '', u); }
  };
  $$('[data-fermer-fiche]', fiche).forEach((b) => b.addEventListener('click', () => fiche.__fermer()));
  $$('[data-fiche-pas]', fiche).forEach((b) => b.addEventListener('click', () => {
    const i = ordre.indexOf(courante), j = (i + Number(b.dataset.fichePas) + ordre.length) % ordre.length;
    montrerFiche(ordre[j], { pousser: false });
    const u = new URL(location.href); u.searchParams.set('piece', ordre[j]); history.replaceState({ piece: ordre[j] }, '', u);
  }));
  corps.addEventListener('click', (e) => {
    const v = e.target.closest('[data-vue-bouton]'); if (!v) return;
    $$('.fiche-photo', corps).forEach((p) => p.classList.toggle('est-active', p.dataset.vue === v.dataset.vueBouton));
    $$('[data-vue-bouton]', corps).forEach((b) => b.setAttribute('aria-current', String(b === v)));
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-ouvrir-fiche]'); if (!a) return;
    e.preventDefault(); montrerFiche(a.dataset.ouvrirFiche, { retour: a });
  });
  window.addEventListener('popstate', () => {
    const id = new URLSearchParams(location.search).get('piece');
    if (id && infos[id]) montrerFiche(id, { pousser: false }); else if (!fiche.hidden) fermerFenetre(fiche);
  });
  const depart = params.get('piece');
  if (depart && infos[depart]) setTimeout(() => montrerFiche(depart, { pousser: false }), 50);

  /* Lecture aléatoire : le bac s'emballe puis s'arrête sur une pièce. */
  const alea = $('[data-aleatoire]');
  alea && alea.addEventListener('click', () => {
    const visibles = cartes.filter((c) => !c.classList.contains('est-cachee'));
    const c = visibles[Math.floor(Math.random() * visibles.length)] || cartes[0];
    if (gsap && !etat.calme) {
      gsap.fromTo('.bac3d-pochette', { yPercent: 0 }, { yPercent: -18, duration: 0.12, stagger: { each: 0.05, repeat: 1, yoyo: true }, onComplete: () => montrerFiche(c.dataset.id, { retour: alea }) });
    } else montrerFiche(c.dataset.id, { retour: alea });
  });

  /* Panier : une seule source (localStorage), identique dans tous les onglets, donnée abîmée nettoyée. */
  const CLE = 'mbm-panier';
  const lire = () => {
    try { const v = JSON.parse(localStorage.getItem(CLE) || '[]'); return Array.isArray(v) ? v.filter((id) => typeof id === 'string' && infos[id]) : []; }
    catch { try { localStorage.removeItem(CLE); } catch {} return []; }
  };
  let panier = lire();
  const ecrire = () => { try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch {} };
  const panierEl = $('#panier'), liste = $('[data-panier-liste]'), boutons = $$('[data-panier-bouton]');
  const chf = (n) => `${n} CHF`;
  const majPanier = () => {
    const total = panier.reduce((s, id) => s + infos[id].prix, 0);
    $$('[data-panier-compte]').forEach((e) => (e.textContent = panier.length));
    $$('[data-panier-total-court]').forEach((e) => (e.textContent = chf(total)));
    $('[data-panier-total]').textContent = chf(total);
    $('[data-panier-vide]').hidden = panier.length > 0;
    $('[data-commander]').disabled = panier.length === 0;
    liste.replaceChildren(...panier.map((id) => {
      const li = document.createElement('li');
      const img = document.createElement('img'); img.src = infos[id].img; img.alt = ''; img.width = 56; img.height = 70;
      const t = document.createElement('div'); t.innerHTML = `<strong></strong><br><span data-prix></span>`;
      t.querySelector('strong').textContent = infos[id].nom; t.querySelector('span').textContent = chf(infos[id].prix);
      const r = document.createElement('button'); r.type = 'button'; r.textContent = liste.dataset.retirer; r.setAttribute('aria-label', `${liste.dataset.retirer} ${infos[id].nom}`);
      r.addEventListener('click', () => { panier = panier.filter((x) => x !== id); ecrire(); majPanier(); });
      li.append(img, t, r); return li;
    }));
    $$('[data-ajouter]').forEach((b) => {
      const dedans = panier.includes(b.dataset.ajouter);
      b.textContent = dedans ? b.dataset.libelleAjoute : b.dataset.libelleAjouter;
      b.setAttribute('aria-pressed', String(dedans));
    });
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ajouter]'); if (!b) return;
    const id = b.dataset.ajouter;
    /* Pièce unique : une seule fois dans le panier. */
    panier = panier.includes(id) ? panier.filter((x) => x !== id) : [...panier, id];
    ecrire(); majPanier();
    if (gsap && !etat.calme && panier.includes(id)) gsap.fromTo(boutons, { scale: 1 }, { scale: 1.08, duration: 0.16, yoyo: true, repeat: 1, clearProps: 'transform' });
  });
  window.addEventListener('storage', (e) => { if (e.key === CLE) { panier = lire(); majPanier(); } });
  panierEl.__fermer = () => { fermerFenetre(panierEl); boutons.forEach((b) => b.setAttribute('aria-expanded', 'false')); };
  boutons.forEach((bouton) => bouton.addEventListener('click', () => { ouvrirFenetre(panierEl, bouton); bouton.setAttribute('aria-expanded', 'true'); $('.fiche-fermer', panierEl).focus(); $('[data-panier-message]').hidden = true; $('[data-commander]').disabled = panier.length === 0; }));
  $$('[data-fermer-panier]', panierEl).forEach((b) => b.addEventListener('click', () => panierEl.__fermer()));
  $('[data-commander]').addEventListener('click', (e) => {
    e.currentTarget.disabled = true;
    panier = []; ecrire(); majPanier();
    const m = $('[data-panier-message]'); m.hidden = false; m.focus();
  });
  majPanier();
}
