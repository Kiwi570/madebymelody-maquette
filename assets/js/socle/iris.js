/* Voile en iris (extension du socle, propre à madebymelody) : actif quand le voile porte data-forme="iris".
   - couvrir : un disque de la couleur du voile grandit depuis le point du clic jusqu'à couvrir l'écran ;
   - découvrir : un trou s'ouvre dans le voile, centré sur l'objet d'ouverture de la page ([data-iris-centre])
     ou sur le centre de l'écran.
   Sans prise en charge de clip-path ou de mask : les fonctions renvoient null et le voile glisse comme avant. */
const pointClic = { x: null, y: null };

export function retenirPoint(e, a) {
  if (e && e.detail !== 0 && Number.isFinite(e.clientX)) { pointClic.x = e.clientX; pointClic.y = e.clientY; return; }
  /* Clavier : centre du lien activé. */
  const r = a && a.getBoundingClientRect ? a.getBoundingClientRect() : null;
  pointClic.x = r ? r.left + r.width / 2 : null;
  pointClic.y = r ? r.top + r.height / 2 : null;
}

const W = () => document.documentElement.clientWidth || window.innerWidth, H = () => window.innerHeight;
const rayonDepuis = (x, y) => Math.ceil(Math.max(Math.hypot(x, y), Math.hypot(W() - x, y), Math.hypot(x, H() - y), Math.hypot(W() - x, H() - y))) + 2;

function prisEnCharge() {
  return !!(window.CSS && CSS.supports && CSS.supports('clip-path', 'circle(10px at 10px 10px)')
    && (CSS.supports('mask-image', 'radial-gradient(#000, #000)') || CSS.supports('-webkit-mask-image', 'radial-gradient(#000, #000)')));
}

export function estIris(v) { return !!(v && v.dataset.forme === 'iris' && prisEnCharge()); }

/* Centre de l'objet d'ouverture s'il est à l'écran, sinon centre de l'écran. */
export function centreOuverture() {
  const el = document.querySelector('[data-iris-centre]');
  if (el) {
    const r = el.getBoundingClientRect();
    const g = Math.max(r.left, 0), d = Math.min(r.right, W()), h = Math.max(r.top, 0), b = Math.min(r.bottom, H());
    if (d - g > 60 && b - h > 60) return { x: (g + d) / 2, y: (h + b) / 2, r: Math.min(d - g, b - h) / 2 };
  }
  return { x: W() / 2, y: H() / 2, r: 0 };
}

export function irisCouvrir(v, duree) {
  const x = pointClic.x ?? W() / 2, y = pointClic.y ?? H() / 2;
  const R = rayonDepuis(x, y);
  v.style.setProperty('--iris-x', `${x}px`); v.style.setProperty('--iris-y', `${y}px`);
  const a = v.animate([
    { transform: 'none', clipPath: `circle(0px at ${x}px ${y}px)` },
    { transform: 'none', clipPath: `circle(${R}px at ${x}px ${y}px)` },
  ], { duration: duree * 1.15, easing: 'cubic-bezier(.7,0,.25,1)', fill: 'forwards' });
  return a.finished.catch(() => {});
}

/* Le trou grandit image par image (variable --trou du masque), sans dépendre d'@property. */
export function irisDecouvrir(v, duree) {
  const { x, y } = centreOuverture();
  const R = rayonDepuis(x, y);
  v.getAnimations().forEach((a) => a.cancel());
  v.style.visibility = 'visible';
  v.style.transform = 'none';
  v.style.setProperty('--cx', `${x}px`); v.style.setProperty('--cy', `${y}px`); v.style.setProperty('--trou', '-2px');
  v.classList.add('iris-ouvre');
  const d = duree * 1.5, t0 = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let fini = false;
  return new Promise((ok) => {
    const finir = () => { if (!fini) { fini = true; ok(); } };
    const pas = (t) => {
      if (fini) return;
      const p = Math.min(1, Math.max(0, (t - t0) / d));
      v.style.setProperty('--trou', `${(ease(p) * R).toFixed(1)}px`);
      if (p < 1) requestAnimationFrame(pas); else finir();
    };
    requestAnimationFrame(pas);
    /* Onglet en arrière-plan : requestAnimationFrame s'arrête, la promesse se résout quand même. */
    setTimeout(finir, d + 400);
  });
}

/* À appeler après avoir posé voile-leve sur html (le voile est alors caché par le style critique). */
export function irisNettoyer(v) {
  if (!v) return;
  v.classList.remove('iris-ouvre');
  ['--cx', '--cy', '--trou', '--iris-x', '--iris-y', 'transform', 'visibility'].forEach((p) => v.style.removeProperty(p));
}
