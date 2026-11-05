/* Effets propres à madebymelody (direction « Face A / Face B »). Le socle gère l'ouverture, les transitions,
   l'en-tête, le menu, le mode calme, les boucles, les mesures et la bibliothèque d'effets (posés par attributs).
   Chaque effet propre porte data-effet="nom-du-plan" : vinyle, manifeste, tracklist, pochette, bascule, tampon,
   ruban-vitesse, face-b, disque-sort, melangeur, tulle, etiquette-brodee, bac, etiquette. */
import { demarrer, boucle, etat, rafraichir } from './socle/index.js?v=2';
import { initPages } from './pages.js?v=2';

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
varying vec2 v; uniform sampler2D ta, tb; uniform float ang, mixb, vel, tps, lum, lumf;
vec3 etiquette(vec2 q){ vec2 u = q / .92 + .5; u.y = 1. - u.y; return mix(texture2D(ta, u).rgb, texture2D(tb, u).rgb, mixb); }
void main(){
  vec2 p = v * 2. - 1.; float r = length(p);
  float bord = 1. - smoothstep(.985, 1., r);
  if (bord <= 0.) { gl_FragColor = vec4(0.); return; }
  float c = cos(ang), s = sin(ang); vec2 q = mat2(c, -s, s, c) * p;
  float th = atan(p.y, p.x);
  vec3 col;
  if (r < .46) {
    vec3 e = etiquette(q);
    float flou = clamp(abs(vel) * .00035, 0., .22);
    if (flou > .01) { for (int k = 1; k < 5; k++) { float a = flou * float(k) / 4.; float cc = cos(a), ss = sin(a); e += etiquette(mat2(cc, -ss, ss, cc) * q); } e /= 5.; }
    col = e;
    col *= 1. + lumf * .16 * pow(max(0., cos(th - lum)), 3.) * smoothstep(.0, .45, r);
    col = mix(col, vec3(.957, .776, .812), smoothstep(.445, .46, r));
  } else {
    float g = sin(r * 520. + sin(r * 37.) * 2.) * .5 + .5;
    float plage = smoothstep(.0, .02, abs(fract(r * 6.2) - .5) - .44);
    col = vec3(.043, .039, .041) + g * .018 - plage * .012;
    float s1 = pow(abs(cos(th - lum)), 26.), s2 = pow(abs(cos(th - lum - 3.1)), 34.);
    float vibre = .65 + .35 * sin(r * 900. + tps * 2.);
    float eclat = (s1 * (.42 + lumf * .3) + s2 * .26) * vibre * (1. + clamp(abs(vel) * .0004, 0., .8));
    col += mix(vec3(1.), vec3(.957, .776, .812), .55) * eclat * smoothstep(.47, .53, r);
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
  const U = Object.fromEntries(['ta', 'tb', 'ang', 'mixb', 'vel', 'tps', 'lum', 'lumf'].map((n) => [n, gl.getUniformLocation(prog, n)]));
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
    dessiner(ang, mixb, vel, t, dt, lum = 0.75, lumf = 0) {
      gl.uniform1f(U.ang, ang); gl.uniform1f(U.mixb, mixb); gl.uniform1f(U.vel, vel); gl.uniform1f(U.tps, t);
      gl.uniform1f(U.lum, lum); gl.uniform1f(U.lumf, lumf);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      /* Qualité qui baisse d'elle-même si les images prennent trop de temps. */
      if (dt > 0.03) { if (++lent > 30 && qualite > 0.75) { qualite -= 0.25; lent = 0; taille(); } } else lent = Math.max(0, lent - 1);
    },
  };
}

const vin = { angle: 0, mix: 0, intro: 0, gl: null, el: null, w: 0, tenu: false, lum: 0.75, lumCible: 0.75, lumf: 0, lumfCible: 0 };
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
  scratch(el);
  boucle(el, (dt, t) => {
    const v = vitesse(dt);
    /* 33 tours en douceur, scratch au défilement et à la main : en avant comme en arrière, avec de l'élan. */
    if (!vin.tenu) {
      vin.angle += (1.15 + vin.intro * 9 + v * 0.006 + vin.w) * dt;
      vin.w *= Math.exp(-dt * 1.4);
    }
    /* La lumière suit le pointeur (amortie : immobile dès que la souris s'arrête). */
    let dl = vin.lumCible - vin.lum; dl = Math.atan2(Math.sin(dl), Math.cos(dl));
    vin.lum += dl * (1 - Math.exp(-dt * 6));
    vin.lumf += (vin.lumfCible - vin.lumf) * (1 - Math.exp(-dt * 5));
    const vel = clamp(v + vin.w / 0.006, -6000, 6000);
    if (vin.gl) vin.gl.dessiner(vin.angle, vin.mix, vel, t, dt, vin.lum, vin.lumf);
    else if (tourne) tourne.style.transform = `rotate(${vin.angle}rad)`;
  });
}

/* Disque scratchable : on l'attrape, on le fait tourner (dans les deux sens), il garde son élan au lâcher. */
function scratch(el) {
  if (etat.calme) return;
  const indice = $('.vinyle-indice', el);
  let a0 = 0, t0 = 0, w = 0, id = null;
  const centre = () => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 }; };
  const angle = (e, c) => Math.atan2(e.clientY - c.y, e.clientX - c.x);
  el.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const c = centre();
    if (Math.hypot(e.clientX - c.x, e.clientY - c.y) > c.r) return;
    id = e.pointerId; vin.tenu = true; a0 = angle(e, c); t0 = performance.now(); w = 0;
    el.setPointerCapture && el.setPointerCapture(id);
    el.classList.add('est-tenu');
    if (indice) indice.classList.add('est-vu');
  });
  /* Lumière : elle tourne vers le pointeur, partout dans le premier écran (repère du shader, y vers le haut). */
  const scene = el.closest('section') || el;
  scene.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const c = centre();
    vin.lumCible = Math.atan2(-(e.clientY - c.y), e.clientX - c.x);
    vin.lumfCible = 1;
  });
  scene.addEventListener('pointerleave', () => { vin.lumCible = 0.75; vin.lumfCible = 0; });
  el.addEventListener('pointermove', (e) => {
    if (!vin.tenu || e.pointerId !== id) return;
    const c = centre();
    const a = angle(e, c), t = performance.now();
    let d = a - a0; d = Math.atan2(Math.sin(d), Math.cos(d));
    vin.angle += d;
    const dt = Math.max(1, t - t0) / 1000;
    w += (d / dt - w) * 0.35;
    a0 = a; t0 = t;
  });
  const lacher = (e) => {
    if (!vin.tenu || (e && e.pointerId !== id)) return;
    vin.tenu = false; id = null;
    /* Élan : vitesse de la main moins la rotation normale ; arrêt net si la main était immobile. */
    vin.w = performance.now() - t0 > 120 ? -1.15 * 0.6 : clamp(w - 1.15, -40, 40);
    el.classList.remove('est-tenu');
  };
  el.addEventListener('pointerup', lacher);
  el.addEventListener('pointercancel', lacher);
}

/* ---------- Le sillon et le diamant : un sillon gravé court dans la marge droite de chaque page,
   la pointe le lit au défilement (déjà lu : tracé plein ; à lire : pointillé) ; chaque section est une plage. ---------- */
function sillon() {
  const boite = $('.sillon'), main = $('main'), diamant = $('.diamant');
  if (!boite || !main) return;
  const svg = $('svg', boite), fond = $('.sillon-fond', svg), lu = $('.sillon-lu', svg), ombre = $('.sillon-lu-ombre', svg), plagesG = $('.sillon-plages', svg);
  const PAS = 8;
  let xs = [], ls = [], L = 0, H = 0, plages = [], gauche = 0, haut = 0, dernierY = -1, petit = false;
  const construire = () => {
    petit = telephone();
    const w = petit ? 14 : 40, cx = petit ? 8 : 22, A = petit ? 1.6 : 4.2;
    haut = main.getBoundingClientRect().top + window.scrollY;
    H = Math.max(10, Math.round(main.offsetHeight));
    svg.setAttribute('width', w); svg.setAttribute('height', H);
    /* Plages : le haut de chaque section (ou de la place qu'elle réserve quand elle est épinglée). */
    const sections = $$('main > section, main > .pin-spacer > section').filter((x) => x.offsetHeight > 120);
    const ym = sections.slice(1).map((x) => {
      const b = x.parentElement.classList.contains('pin-spacer') ? x.parentElement : x;
      return Math.round(b.getBoundingClientRect().top + window.scrollY - haut);
    }).filter((y) => y > 80 && y < H - 40);
    plages = ym.map((y, i) => ({ y, n: i + 2, el: null }));
    xs = []; ls = []; L = 0;
    let d = '', px = 0, py = 0;
    for (let i = 0, y = 0; y <= H; i++, y += PAS) {
      let f = 1;
      for (const m of ym) f = Math.min(f, clamp((Math.abs(y - m) - 14) / 70));
      const x = cx + A * Math.sin(y / 64) * f * f;
      if (i) L += Math.hypot(x - px, y - py);
      xs.push(x); ls.push(L);
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y;
      px = x; py = y;
    }
    [fond, lu, ombre].forEach((p) => p.setAttribute('d', d));
    [lu, ombre].forEach((p) => { p.style.strokeDasharray = `${L.toFixed(1)} ${(L + 20).toFixed(1)}`; });
    plagesG.textContent = '';
    plages.forEach((p) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'sillon-plage');
      const x = cx;
      g.innerHTML = `<circle cx="${x}" cy="${p.y}" r="${petit ? 3 : 6}" /><text x="${x}" y="${p.y - 13}">${String(p.n).padStart(2, '0')}</text>`;
      plagesG.appendChild(g); p.el = g;
    });
    gauche = boite.getBoundingClientRect().left;
    dernierY = -1;
    lire(true);
  };
  const lire = (force) => {
    const vh = window.innerHeight;
    const yv = Math.round(vh * 0.62);
    const y = clamp(window.scrollY + yv - haut, 0, H);
    if (!force && Math.abs(y - dernierY) < 0.5) return;
    dernierY = y;
    const i = Math.min(xs.length - 2, Math.floor(y / PAS)), f = y / PAS - i;
    const x = xs[i] + (xs[i + 1] - xs[i]) * f, l = ls[i] + (ls[i + 1] - ls[i]) * f;
    const off = etat.calme ? 0 : (L - l);
    lu.style.strokeDashoffset = off.toFixed(1); ombre.style.strokeDashoffset = off.toFixed(1);
    plages.forEach((p) => { const v = etat.calme || y >= p.y; if (p.el && p.lue !== v) { p.lue = v; p.el.classList.toggle('est-lue', v); } });
    if (diamant && !etat.calme) {
      /* La pointe tremble un peu avec la vitesse du défilement. */
      const vib = clamp(defil.v / 3000, -1, 1) * 6;
      diamant.style.transform = `translate3d(${(gauche + x - 3).toFixed(1)}px, ${yv - (petit ? 8 : 12)}px, 0) rotate(${vib.toFixed(2)}deg)`;
    }
  };
  construire();
  let attente = 0;
  const plusTard = () => { clearTimeout(attente); attente = setTimeout(construire, 120); };
  if (ST) ST.addEventListener('refresh', construire);
  new ResizeObserver(plusTard).observe(main);
  window.addEventListener('resize', plusTard);
  /* Mode calme : aucune boucle, une simple lecture au défilement. */
  if (gsap && !etat.calme) gsap.ticker.add(() => lire(false)); else window.addEventListener('scroll', () => lire(false), { passive: true });
}

/* ---------- Titres : du sage au sauvage (SOFT 100 → 0, WONK 0 → 1) à mesure qu'ils montent dans l'écran ---------- */
function sageSauvage() {
  if (!ST || etat.calme) return;
  $$('[data-effet="sage-sauvage"]').forEach((h) => {
    let dernier = '';
    const appliquer = (p) => {
      const v = `"SOFT" ${Math.round(100 - p * 100)}, "WONK" ${p > 0.55 ? 1 : 0}`;
      if (v !== dernier) { dernier = v; h.style.fontVariationSettings = v; }
    };
    ST.create({
      trigger: h, start: 'top 90%', end: 'top 38%',
      onUpdate: (st) => appliquer(st.progress),
      onRefresh: (st) => appliquer(st.progress),
    });
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
  const pile = $('[data-bac-pile]', section), cartes = $$('.pochette', section);
  const n = cartes.length, num = $('[data-bac-num]', section), barre = $('.galerie-progres span', section);
  if (!n || etat.calme || !gsap || !ST) return;
  /* La pile n'est plus une rangée à faire défiler : elle sort de la tabulation (chaque pochette garde son lien). */
  ['tabindex', 'role', 'aria-label'].forEach((a) => pile.removeAttribute(a));
  section.classList.add('caisse-active');
  const els = cartes.map((c) => ({ c, d: $('.pochette-disque', c) })), bois = $('.bac-bois', section);
  let p = 0, cible = 0, devant = -1, dernierRendu = -1;
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  /* Par crans : la pochette reste droite sur la plus grande partie du défilement, puis bascule d'un coup. */
  const cran = (x) => { const b = Math.floor(x); return Math.min(n - 1, b + smooth(0.3, 0.7, x - b)); };
  const rendre = () => {
    els.forEach(({ c, d }, i) => {
      const k = i - p;
      let tr, op = 1, ombre = 0;
      if (k >= 0) {
        /* Derrière : chaque pochette un peu plus haut, plus loin, plus sombre ; la cinquième s'efface. */
        tr = `translate3d(0, ${(-k * 5.5).toFixed(2)}%, ${(-k * 70).toFixed(1)}px) rotateX(${Math.min(k, 4) * 3}deg)`;
        op = 1 - smooth(3.6, 4.6, k);
        ombre = Math.min(0.62, k * 0.2);
      } else {
        /* Devant : elle bascule vers soi, depuis le bas de la caisse, puis s'efface. */
        const t = Math.min(1, -k);
        tr = `translate3d(0, ${(t * 6).toFixed(2)}%, ${(t * 90).toFixed(1)}px) rotateX(${(-t * 64).toFixed(2)}deg)`;
        op = 1 - smooth(0.4, 0.88, t);
      }
      c.style.transform = tr;
      c.style.opacity = op.toFixed(3);
      /* Celle qui bascule passe devant le bois de la caisse. */
      c.style.zIndex = String(k < -0.12 ? 60 + i : n - i);
      c.style.setProperty('--ombre', ombre.toFixed(3));
      /* Le disque de la pochette de devant sort à moitié en tournant. */
      if (d) { const f = 1 - clamp(Math.abs(k) * 1.6); d.style.transform = `translateX(${(f * 44).toFixed(1)}%) rotate(${(f * 140 + p * 30).toFixed(1)}deg)`; }
    });
    const i = clamp(Math.round(p), 0, n - 1);
    if (i !== devant) {
      devant = i;
      cartes.forEach((c, j) => c.classList.toggle('est-devant', j === i));
      section.style.setProperty('--teinte', cartes[i].dataset.teinte);
      if (num) num.textContent = String(i + 1).padStart(2, '0');
    }
    if (barre) barre.style.transform = `scaleX(${(p / (n - 1)).toFixed(4)})`;
    /* La caisse tressaute quand une pochette bascule. */
    if (bois) bois.style.transform = `translate(-50%, ${(Math.sin((p % 1) * Math.PI) * 4).toFixed(2)}px) rotate(${(Math.sin((p % 1) * Math.PI * 2) * 0.6).toFixed(2)}deg)`;
  };
  const st = ST.create({
    trigger: section, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 0.45 * (n - 1)),
    pin: true, anticipatePin: 1, invalidateOnRefresh: true,
    onUpdate: (x) => { cible = cran(x.progress * (n - 1)); },
  });
  cible = cran(st.progress * (n - 1)); p = cible;
  rendre();
  gsap.ticker.add((t, dms) => {
    const dt = Math.min(0.05, (dms || 16) / 1000);
    if (Math.abs(cible - p) < 0.0005) { if (dernierRendu !== p) { p = cible; rendre(); dernierRendu = p; } return; }
    p += (cible - p) * (1 - Math.exp(-dt * 9));
    rendre(); dernierRendu = p;
  });
  /* Au clavier : la pochette qui reçoit le focus passe devant. */
  pile.addEventListener('focusin', (e) => {
    const i = cartes.findIndex((c) => c.contains(e.target));
    if (i < 0) return;
    window.scrollTo({ top: Math.round(st.start + (i / (n - 1)) * (st.end - st.start)) + 1, behavior: 'instant' });
    cible = p = i; rendre();
  });
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
  const panneau = $('.ouverture-panneau'), platine = $('.platine'), disque = $('.intro-disque'), bras = $('.platine-bras');
  const face = $('.intro-face span'), passer = $('.intro-passer');
  const W = document.documentElement.clientWidth, H = window.innerHeight;
  /* L'intro devient la page : le disque glisse jusqu'à l'objet d'ouverture ([data-iris-centre]),
     puis le trou s'ouvre depuis lui. Sur l'accueil, il prend la place exacte du disque du héros. */
  const p = platine.getBoundingClientRect();
  let cx = W / 2, cy = H / 2, s = 1, r0 = -2;
  const cible = $('[data-iris-centre]');
  if (cible) {
    /* Partie visible de l'objet (il peut dépasser en bas de l'écran). */
    const r = cible.getBoundingClientRect();
    const g = Math.max(r.left, 0), dr = Math.min(r.right, W), h = Math.max(r.top, 0), b = Math.min(r.bottom, H);
    if (dr - g > 60 && b - h > 60) {
      const d = Math.min(dr - g, b - h);
      cx = (g + dr) / 2; cy = (h + b) / 2;
      s = clamp(d / p.width, 0.3, 1.3);
      if (cible.dataset.irisCentre === 'disque' && b - h >= r.height - 1) r0 = d / 2 + 1;
    }
  }
  const dx = cx - (p.left + p.width / 2), dy = cy - (p.top + p.height / 2);
  const rayon = Math.ceil(Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy))) + 2;
  gsap.set(panneau, { '--cx': `${cx}px`, '--cy': `${cy}px`, '--trou': '-2px' });
  tl.fromTo(disque, { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0)
    .fromTo(disque, { rotate: 0 }, { rotate: 900, duration: 2.1, ease: 'power2.in' }, 0)
    .fromTo(bras, { rotate: 26 }, { rotate: 0, duration: 0.55, ease: 'back.out(2.6)' }, 0.4)
    .fromTo(face, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' }, 0.8)
    .to(passer ? [face, passer] : face, { opacity: 0, duration: 0.25, ease: 'power1.in' }, 1.2)
    .fromTo(platine, { x: 0, y: 0, scale: 1 }, { x: dx, y: dy, scale: s, duration: 0.5, ease: 'power3.inOut' }, 1.15)
    .set(panneau, { '--trou': `${r0}px` }, 1.66)
    .to(panneau, { '--trou': `${rayon}px`, duration: 0.8, ease: 'power3.in' }, 1.66);
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
    sillon();
    sageSauvage();
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
