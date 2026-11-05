/* Effets propres à madebymelody (direction « Face A / Face B »). Le socle gère l'ouverture, les transitions,
   l'en-tête, le menu, le mode calme, les boucles, les mesures et la bibliothèque d'effets (posés par attributs).
   Chaque effet propre porte data-effet="nom-du-plan" : vinyle, manifeste, tracklist, pochette, bascule, tampon,
   ruban-vitesse, face-b, disque-sort, melangeur, tulle, etiquette-brodee, bac, etiquette. */
import { demarrer, boucle, etat, rafraichir } from './socle/index.js?v=1';
import { initPages } from './pages.js?v=1';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const telephone = () => matchMedia('(max-width: 760px)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ---------- Vitesse de défilement lissée (scratch du disque, ruban) : aucune mesure de mise en page ---------- */
const defil = { v: 0, cible: 0, y: window.scrollY, t: performance.now() };
window.addEventListener('scroll', () => {
  const t = performance.now(), dt = Math.max(1, t - defil.t);
  defil.cible = clamp(((window.scrollY - defil.y) / dt) * 1000, -4000, 4000);
  defil.y = window.scrollY; defil.t = t;
}, { passive: true });
function vitesse(dt) {
  defil.cible *= Math.exp(-dt * 6);
  defil.v += (defil.cible - defil.v) * (1 - Math.exp(-dt * 10));
  return defil.v;
}

/* ---------- Vinyle (signature) : disque WebGL dont l'étiquette est une vraie photo ; repli CSS ---------- */
const VS = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
const FS = `precision mediump float;
varying vec2 v; uniform sampler2D ta, tb; uniform float ang, mixb, vel, tps;
vec3 etiquette(vec2 q){ vec2 u = q / .76 + .5; u.y = 1. - u.y; return mix(texture2D(ta, u).rgb, texture2D(tb, u).rgb, mixb); }
void main(){
  vec2 p = v * 2. - 1.; float r = length(p);
  float bord = 1. - smoothstep(.985, 1., r);
  if (bord <= 0.) { gl_FragColor = vec4(0.); return; }
  float c = cos(ang), s = sin(ang); vec2 q = mat2(c, -s, s, c) * p;
  float th = atan(p.y, p.x);
  vec3 col;
  if (r < .38) {
    vec3 e = etiquette(q);
    float flou = clamp(abs(vel) * .00035, 0., .22);
    if (flou > .01) { for (int k = 1; k < 5; k++) { float a = flou * float(k) / 4.; float cc = cos(a), ss = sin(a); e += etiquette(mat2(cc, -ss, ss, cc) * q); } e /= 5.; }
    col = e;
    col = mix(col, vec3(.957, .776, .812), smoothstep(.365, .38, r));
  } else {
    float g = sin(r * 520. + sin(r * 37.) * 2.) * .5 + .5;
    float plage = smoothstep(.0, .02, abs(fract(r * 6.2) - .5) - .44);
    col = vec3(.043, .039, .041) + g * .018 - plage * .012;
    float s1 = pow(abs(cos(th - .75)), 26.), s2 = pow(abs(cos(th + 2.35)), 34.);
    float vibre = .65 + .35 * sin(r * 900. + tps * 2.);
    float eclat = (s1 * .42 + s2 * .26) * vibre * (1. + clamp(abs(vel) * .0004, 0., .8));
    col += mix(vec3(1.), vec3(.957, .776, .812), .55) * eclat * smoothstep(.39, .45, r);
    col += vec3(.957, .776, .812) * .06 * smoothstep(.95, .99, r);
  }
  col = mix(col, vec3(.02), 1. - smoothstep(.018, .024, r));
  gl_FragColor = vec4(col * bord, bord);
}`;

function creerGL(canvas, imgs) {
  let gl;
  try { gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: true, alpha: true }); } catch { gl = null; }
  if (!gl) return null;
  const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const lp = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
  const U = Object.fromEntries(['ta', 'tb', 'ang', 'mixb', 'vel', 'tps'].map((n) => [n, gl.getUniformLocation(prog, n)]));
  const tex = imgs.map((img, i) => {
    const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    return t;
  });
  gl.uniform1i(U.ta, 0); gl.uniform1i(U.tb, 1);
  let qualite = telephone() ? 1 : 1.25, lent = 0;
  const taille = () => {
    const w = canvas.clientWidth, d = Math.min(window.devicePixelRatio || 1, qualite);
    canvas.width = Math.round(w * d); canvas.height = Math.round(w * d);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  taille();
  new ResizeObserver(taille).observe(canvas);
  return {
    dessiner(ang, mixb, vel, t, dt) {
      gl.uniform1f(U.ang, ang); gl.uniform1f(U.mixb, mixb); gl.uniform1f(U.vel, vel); gl.uniform1f(U.tps, t);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      /* Qualité qui baisse d'elle-même si les images prennent trop de temps. */
      if (dt > 0.03) { if (++lent > 30 && qualite > 0.75) { qualite -= 0.25; lent = 0; taille(); } } else lent = Math.max(0, lent - 1);
    },
  };
}

const vin = { angle: 0, mix: 0, intro: 0, gl: null, el: null };
/* Les étiquettes sont décodées avant l'ouverture (dans le délai maximal du socle). */
const vinImgs = $$('.vinyle-etiquette img');
const vinPret = Promise.all(vinImgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))
  .then(() => (i.decode ? i.decode().catch(() => {}) : null))));
function vinyle() {
  const el = $('.vinyle'); if (!el) return;
  vin.el = el;
  const canvas = $('.vinyle-gl', el), tourne = $('.vinyle-tourne', el), face = $('[data-face]', el);
  vinPret.then(() => {
    if (!vinImgs.every((i) => i.naturalWidth)) return;
    try { vin.gl = creerGL(canvas, vinImgs); } catch (err) { console.warn('[vinyle] WebGL indisponible', err); vin.gl = null; }
    if (vin.gl) { vin.gl.dessiner(vin.angle, vin.mix, 0, 0, 0); el.classList.add('gl-pret'); }
  });
  /* Face B : le disque change de face à mesure que l'on quitte le premier écran. */
  if (ST && !etat.calme) {
    ST.create({ trigger: '#disque', start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: (st) => { vin.mix = clamp((st.progress - 0.3) / 0.35); const b = vin.mix > 0.5; el.classList.toggle('face-b', b); if (face) face.textContent = b ? 'B' : 'A'; } });
  }
  boucle(el, (dt, t) => {
    const v = vitesse(dt);
    /* 33 tours en douceur, scratch au défilement : en avant comme en arrière. */
    vin.angle += (1.15 + vin.intro * 9 + v * 0.006) * dt;
    if (vin.gl) vin.gl.dessiner(vin.angle, vin.mix, v, t, dt);
    else if (tourne) tourne.style.transform = `rotate(${vin.angle}rad)`;
  });
}

/* ---------- Manifeste : les mots s'allument un à un au défilement ---------- */
function manifeste() {
  const h = $('[data-manifeste]'); if (!h) return;
  const mots = [];
  [...h.childNodes].forEach((n) => {
    if (n.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    n.textContent.split(/( )/).forEach((m) => {
      if (m === ' ') frag.append(' ');
      else if (m) { const s = document.createElement('span'); s.className = 'mot'; s.textContent = m; frag.append(s); mots.push(s); }
    });
    n.replaceWith(frag);
  });
  if (!gsap || !ST || etat.calme) { mots.forEach((m) => (m.style.opacity = 1)); return; }
  gsap.fromTo(mots, { opacity: 0.18 }, { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: h, start: 'top 82%', end: 'bottom 38%', scrub: 0.4 } });
}

/* ---------- Tracklist : la piste au centre de l'écran montre sa pochette, sa barre de lecture avance ---------- */
function tracklist() {
  const liste = $('[data-effet="tracklist"]'); if (!liste || !ST) return;
  const pistes = $$('.piste', liste), photos = $$('[data-pochette]'), num = $('[data-pochette-num]');
  const activer = (li) => {
    pistes.forEach((p) => p.classList.toggle('est-active', p === li));
    photos.forEach((f) => f.classList.toggle('est-active', f.dataset.pochette === li.dataset.piste));
    if (num) num.textContent = $('.piste-num', li).textContent;
  };
  activer(pistes[0]);
  if (etat.calme) { $$('.piste-barre span', liste).forEach((s) => (s.style.transform = 'scaleX(1)')); return; }
  pistes.forEach((li) => {
    gsap.fromTo($('.piste-barre span', li), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: li, start: 'top 62%', end: 'bottom 42%', scrub: true, onToggle: (st) => st.isActive && activer(li) } });
  });
}

/* ---------- Le bac : la photo sort de sa pochette au centre, le fond se teinte d'après la pièce ---------- */
function bac() {
  const section = $('#bac'); if (!section) return;
  const piste = $('[data-galerie]', section), cartes = $$('.pochette', section);
  let pos = [];
  const mesurer = () => { pos = cartes.map((c) => ({ c, x: c.offsetLeft, w: c.offsetWidth, d: $('.pochette-disque', c) })); };
  mesurer();
  window.addEventListener('resize', mesurer); new ResizeObserver(mesurer).observe(piste);
  let derniere = null;
  const appliquer = (decalage) => {
    const vw = document.documentElement.clientWidth;
    let meilleure = null, dmin = Infinity;
    pos.forEach((p) => {
      const centre = p.x + decalage + p.w / 2;
      const d = Math.abs(centre - vw / 2) / (vw / 2);
      if (d < dmin) { dmin = d; meilleure = p.c; }
      if (p.d) p.d.style.transform = `translateX(${(1 - clamp(d * 1.4)) * 46}%) rotate(${(1 - clamp(d)) * 120}deg)`;
    });
    if (meilleure && meilleure !== derniere) { derniere = meilleure; section.style.setProperty('--teinte', meilleure.dataset.teinte); }
  };
  if (etat.calme) { pos.forEach((p) => p.d && (p.d.style.transform = 'translateX(30%)')); return; }
  /* Ordinateur : piste épinglée déplacée par GSAP (valeur lue sans mesure) ; téléphone : défilement au doigt. */
  gsap.ticker.add(() => {
    if (!section.__visible) return;
    appliquer(telephone() ? -piste.scrollLeft : (Number(gsap.getProperty(piste, 'x')) || 0));
  });
  new IntersectionObserver(([e]) => { section.__visible = e.isIntersecting; }).observe(section);
}

/* ---------- Face A / Face B : un crossfader fait passer du sage au sauvage ---------- */
function bascule() {
  const s = $('#bascule'); if (!s || !gsap || !ST || etat.calme) return;
  const b = $('.bascule-b', s), bouton = $('.fader-bouton', s), rail = $('.fader-rail', s);
  const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: 'top top', end: '+=140%', pin: true, scrub: 0.5, invalidateOnRefresh: true } });
  tl.fromTo(b, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: 1 }, 0)
    .fromTo(bouton, { x: 0 }, { x: () => rail.offsetWidth, ease: 'none', duration: 1 }, 0)
    .fromTo($('.bascule-a .bascule-mot', s), { xPercent: 0 }, { xPercent: -18, ease: 'none', duration: 1 }, 0)
    .fromTo($('.bascule-b .bascule-mot', s), { xPercent: 14 }, { xPercent: 0, ease: 'none', duration: 1 }, 0)
    .fromTo($$('.bascule-piece', s), { rotate: -4 }, { rotate: 3, ease: 'none', duration: 1 }, 0)
    .fromTo($('.bascule-a .bascule-contenu', s), { opacity: 1 }, { opacity: 0, ease: 'none', duration: 0.4 }, 0.05)
    .fromTo($('.bascule-b .bascule-contenu', s), { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.4 }, 0.55);
}

/* ---------- Une seule prise : le tampon « 1/1 » s'abat sur la page ---------- */
function tampon() {
  const t = $('[data-effet="tampon"]'); if (!t || !gsap || !ST || etat.calme) return;
  gsap.fromTo(t, { scale: 2.1, rotate: -26, opacity: 0 }, { scale: 1, rotate: -8, opacity: 1, ease: 'back.out(2.2)', duration: 0.7,
    scrollTrigger: { trigger: t, start: 'top 78%', toggleActions: 'play none none none' } });
  gsap.fromTo(t, { y: 0 }, { y: -40, ease: 'none', scrollTrigger: { trigger: t.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------- Ruban des titres : accélère avec le défilement ---------- */
function ruban() {
  const r = $('#ruban p'); if (!r || etat.calme) return;
  const anims = () => r.getAnimations();
  boucle(r.closest('.ruban-section'), (dt) => {
    const v = Math.abs(defil.v);
    anims().forEach((a) => { a.playbackRate = 1 + Math.min(6, v / 300); });
  });
}

/* ---------- Pied de page : l'étiquette « Face B » tourne une dernière fois ---------- */
function faceB() {
  const d = $('.pied-disque-svg'); if (!d) return;
  let a = 0;
  boucle(d, (dt) => { a += (0.5 + Math.abs(defil.v) * 0.004) * dt; d.style.transform = `rotate(${a}rad)`; });
}

/* ---------- Intro commune : la platine, puis l'étiquette s'ouvre en cercle sur la page ---------- */
function introCommune(tl) {
  const panneau = $('.ouverture-panneau'), disque = $('.intro-disque'), bras = $('.platine-bras'), face = $('.intro-face span');
  const rayon = Math.hypot(window.innerWidth, window.innerHeight);
  tl.fromTo(disque, { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0)
    .fromTo(disque, { rotate: 0 }, { rotate: 900, duration: 2.1, ease: 'power2.in' }, 0)
    .fromTo(bras, { rotate: 26 }, { rotate: 0, duration: 0.55, ease: 'back.out(2.6)' }, 0.45)
    .fromTo(face, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' }, 1.0)
    .fromTo(panneau, { '--trou': '0px' }, { '--trou': `${rayon}px`, duration: 0.85, ease: 'power3.in' }, 1.6);
  return tl;
}

/* Ouverture propre à l'accueil : les mots montent, le disque accélère sous le diamant. */
function ouvertureAccueil(tl, t0) {
  if (!$('.hero-ligne')) return;
  tl.fromTo('.hero-mot--a .hero-ligne', { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power4.out' }, t0)
    .fromTo('.hero-mot--b .hero-ligne', { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power4.out' }, t0 + 0.12)
    .fromTo('.hero-bas', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, t0 + 0.25)
    .fromTo('.vinyle-bras', { rotate: 24 }, { rotate: 0, duration: 0.6, ease: 'back.out(2.4)' }, t0 - 0.1)
    .fromTo(vin, { intro: 1 }, { intro: 0, duration: 1.1, ease: 'power2.out' }, t0 - 0.2)
    .fromTo('.vinyle-face', { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, t0 + 0.35);
}

const PAGES = { ouvertures: {}, finals: [] };

demarrer({
  preparer() {
    vinyle();
    manifeste();
    tracklist();
    bac();
    bascule();
    tampon();
    ruban();
    faceB();
    initPages({ gsap, ST, etat, boucle, rafraichir, defil, PAGES, $, $$, clamp, telephone });
  },
  pret: [vinPret],
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline();
    introCommune(tl);
    ouvertureAccueil(tl, 1.75);
    (PAGES.ouvertures[document.documentElement.dataset.page] || (() => {}))(tl, 1.75, true);
    return tl;
  },
  etatFinal() {
    if (!gsap) return;
    const els = $$('.hero-ligne, .hero-bas, .vinyle-bras, .vinyle-face');
    if (els.length) gsap.set(els, { clearProps: 'transform,opacity' });
    vin.intro = 0;
    PAGES.finals.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
  },
  arrivee() {
    if (!gsap) return;
    const tl = gsap.timeline();
    ouvertureAccueil(tl, 0.1);
    (PAGES.ouvertures[document.documentElement.dataset.page] || (() => {}))(tl, 0.1, false);
  },
});
