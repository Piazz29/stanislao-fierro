// Movimenti della home, guidati dallo scorrimento. Senza JS o con «riduci movimento» ogni sezione
// resta nel suo stato finale: video a tutto schermo, testi leggibili, schede in fila.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

type Win = Window & { lenis?: { on(e: string, f: () => void): void }; updateHeader?: () => void };
const win = window as Win;

export function initHome() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector<HTMLElement>('[data-header]');

  if (reduce) {
    document.querySelectorAll<HTMLElement>('[data-num-card]').forEach((c) => c.setAttribute('data-active', ''));
    initFeatureSlider(false);
    return;
  }

  // Lenis muove la pagina: ScrollTrigger deve saperlo a ogni passo
  const hook = () => win.lenis?.on('scroll', ScrollTrigger.update);
  if (win.lenis) hook(); else requestAnimationFrame(hook);

  initLoader(header);
  initCompose();
  initFeature();
  initNight();
  initNumbers();
  initParallax();
  document.fonts.ready.then(() => { initReveals(); ScrollTrigger.refresh(); });
}

/* ---------------- caricamento ---------------- */
// Il nome dello studio si apre in due, le miniature delle opere passano nel varco, si raccolgono
// in una sola immagine che cresce fino a diventare la hero; il nome si richiude e sale nella testata.
function initLoader(header: HTMLElement | null) {
  const root = document.documentElement;
  const loader = document.querySelector<HTMLElement>('[data-loader]');
  if (!loader || !root.classList.contains('is-loading')) return;
  const tiles = [...loader.querySelectorAll<HTMLElement>('[data-tile]')];
  const media = loader.querySelector<HTMLElement>('[data-ld-media]')!;
  const shade = loader.querySelector<HTMLElement>('[data-ld-shade]')!;
  const name = loader.querySelector<HTMLElement>('[data-ld-name]')!;
  const [w1, w2] = [...loader.querySelectorAll<HTMLElement>('[data-ld-word]')];
  const count = loader.querySelector<HTMLElement>('[data-ld-count]')!;
  const foot = loader.querySelector<HTMLElement>('[data-ld-foot]')!;
  const lines = loader.querySelectorAll('.ld-grid, .ld-axis');
  const target = header?.querySelector<HTMLElement>('.wordmark');
  const heroImg = document.querySelector<HTMLImageElement>('[data-hero] img, [data-hero] video');

  header?.setAttribute('data-intro', '');
  const lenis = () => (window as unknown as { lenis?: { stop(): void; start(): void } }).lenis;
  let done = false;
  const stopScroll = () => { if (done) return; if (lenis()) lenis()!.stop(); else requestAnimationFrame(stopScroll); };
  stopScroll();
  const finish = () => {
    if (done) return;
    done = true;
    loader.style.display = 'none';
    root.classList.remove('is-loading');
    header?.removeAttribute('data-intro');
    lenis()?.start();
    win.updateHeader?.();
    gsap.fromTo('[data-hero-line]', { yPercent: 105 }, { yPercent: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out' });
    gsap.fromTo('[data-hero-fade]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, delay: 0.25, ease: 'power2.out' });
    ScrollTrigger.refresh();
  };
  window.setTimeout(finish, 12000); // in ogni caso la pagina non resta bloccata

  // geometria: due file sfalsate attorno all'asse, poi una striscia, poi un solo quadrato
  const vw = window.innerWidth, vh = window.innerHeight;
  const n1 = vw < 768 ? 5 : 7;
  const s = vw < 768 ? Math.min(40, (vw - 32) / 12.6) : Math.min(58, Math.max(42, vw * 0.04));
  const g = s * 0.12, step = s * 2.2;
  type Pos = { x: number; y: number; sx: number; hero?: boolean };
  const all: Pos[] = [];
  for (let i = 0; i < n1; i++) all.push({ x: (i - (n1 - 1) / 2) * step, y: -(s + g) / 2, sx: 0, hero: i === (n1 - 1) / 2 });
  for (let j = 0; j <= n1; j++) all.push({ x: (j - n1 / 2) * step, y: (s + g) / 2, sx: 0 });
  [...all].sort((a, b) => a.x - b.x).forEach((p, k, arr) => (p.sx = (k - (arr.length - 1) / 2) * (s + g)));
  const heroPos = all.find((p) => p.hero)!;
  const slots = all.filter((p) => !p.hero);
  tiles.forEach((t, i) => (t.style.display = i < slots.length ? '' : 'none'));
  const used = tiles.slice(0, slots.length);
  const slot = (i: number) => slots[i];

  // le misure del nome valgono solo con il carattere definitivo: si parte quando è pronto
  const build = () => {
    // il nome: misure per dividerlo in due e per farlo arrivare esattamente sul logo della testata
    gsap.set(name, { xPercent: -50, yPercent: -50 });
    const nr = name.getBoundingClientRect();
    const r1 = w1.getBoundingClientRect(), r2 = w2.getBoundingClientRect();
    const cx = nr.left + nr.width / 2;
    const wordH = r1.height;
    const open = (s + g) + s * 0.9 + wordH / 2;   // varco ampio, con le due file di miniature dentro
    const close = s / 2 + s * 0.55 + wordH / 2;   // varco stretto, attorno alla striscia
    const dx1 = cx - (r1.left + r1.width / 2), dx2 = cx - (r2.left + r2.width / 2);
    const tr = target?.getBoundingClientRect();
    const fs = tr ? tr.width / nr.width : 0.2;
    const fx = tr ? tr.left + tr.width / 2 - cx : 0;
    const fy = tr ? tr.top + tr.height / 2 - (nr.top + nr.height / 2) : -vh / 2;

    const chars = loader.querySelectorAll('[data-ld-split]');
    const split = [...chars].flatMap((el) => SplitText.create(el as HTMLElement, { type: 'chars' }).chars);
    const sign = loader.querySelector('.ld-sign');

    gsap.set(media, { xPercent: -50, yPercent: -50, x: heroPos.x, y: heroPos.y, opacity: 1, scale: 0 });
    gsap.set(used, { x: (i) => slot(i).x, y: (i) => slot(i).y, opacity: 1, scale: 0 });

    // pronto quando ci sono i caratteri e la prima immagine
    const imgReady = heroImg instanceof HTMLImageElement
      ? (heroImg.complete ? Promise.resolve() : new Promise<void>((r) => { heroImg.addEventListener('load', () => r(), { once: true }); heroImg.addEventListener('error', () => r(), { once: true }); }))
      : Promise.resolve();
    const ready = Promise.race([Promise.all([document.fonts.ready, imgReady]), new Promise((r) => setTimeout(r, 4000))]);

    const counter = { v: 0 };
    const show = () => (count.textContent = String(Math.round(counter.v)).padStart(3, '0'));

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: finish });
    tl.from(split, { yPercent: 115, duration: 0.9, stagger: 0.035, ease: 'power3.out' }, 0.1)
      .from(sign, { scale: 0, rotate: -90, duration: 0.7, ease: 'back.out(2)' }, 0.1)
      .to(counter, { v: 86, duration: 3.3, ease: 'power1.inOut', onUpdate: show }, 0)
      // il nome si apre: lo spazio tra le due parole è il vuoto in cui passano le opere
      .to(w1, { x: dx1, y: -open, duration: 0.9 }, 0.95)
      .to(w2, { x: dx2, y: open, duration: 0.9 }, 0.95)
      .to([...used, media], { scale: 1, duration: 0.55, stagger: { each: 0.03, from: 'center' }, ease: 'back.out(1.7)' }, 1.3)
      // le file diventano una striscia; il nome si stringe attorno
      .to(used, { x: (i) => slot(i).sx, y: 0, duration: 0.8 }, 2.05)
      .to(media, { x: heroPos.sx, y: 0, duration: 0.8 }, 2.05)
      .to(w1, { y: -close, duration: 0.8 }, 2.05)
      .to(w2, { y: close, duration: 0.8 }, 2.05)
      // la striscia si raccoglie nel quadrato centrale
      .to(used, { x: 0, duration: 0.5, ease: 'power3.in' }, 2.9)
      .to(used, { opacity: 0, duration: 0.12 }, 3.3)
      .addPause(3.42, () => { ready.then(() => tl.play()); })
      .to(counter, { v: 100, duration: 0.35, ease: 'power2.out', onUpdate: show }, 3.45)
      .addLabel('open', 3.6)
      // l'immagine cresce fino a riempire lo schermo: è la hero
      .to(media, { width: () => window.innerWidth, height: () => window.innerHeight, duration: 1.15, ease: 'expo.inOut' }, 'open')
      .to(shade, { opacity: 1, duration: 0.9 }, 'open+=0.2')
      .to([foot, ...lines], { opacity: 0, duration: 0.4 }, 'open')
      // il nome si richiude in una riga e sale nella testata, chiaro sulla foto
      .to([w1, w2], { x: 0, y: 0, duration: 0.7 }, 'open')
      .to(name, { x: fx, y: fy, scale: fs, color: 'oklch(0.958 0.011 78)', duration: 1.0, ease: 'expo.inOut' }, 'open+=0.3')
      .to(loader, { opacity: 0, duration: 0.3, ease: 'none' }, '>-0.05');

    // un clic o un tasto accorciano l'attesa
    const hurry = () => tl.timeScale(3.5);
    loader.addEventListener('pointerdown', hurry);
    window.addEventListener('keydown', hurry, { once: true });
    gsap.set(name, { visibility: 'visible' });
  };
  Promise.race([document.fonts.load('400 1em "Instrument Serif"'), new Promise((r) => setTimeout(r, 1200))]).then(build, build);
}

/* ---------------- metodo: immagini a velocità diverse ---------------- */
function initCompose() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1100px)', () => {
    document.querySelectorAll<HTMLElement>('.float-img').forEach((el) => {
      const speed = Number(el.dataset.speed ?? -30);
      gsap.fromTo(el, { y: 0 }, {
        y: () => (speed / 100) * window.innerHeight * 1.3,
        ease: 'none',
        scrollTrigger: { trigger: '[data-compose]', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
    });
    // i testi scendono con lo scorrimento fino al bordo della sezione successiva e lì si
    // allineano su una riga: titolo al centro, i due paragrafi ai lati, con il fondo in comune
    const pin = document.querySelector<HTMLElement>('.compose-pin');
    const texts = [...document.querySelectorAll<HTMLElement>('.compose-head, .compose-left, .compose-right')];
    if (!pin || !texts.length) return;
    const shift = (i: number) => {
      const t = texts[i];
      const line = pin.clientHeight - window.innerHeight * 0.08;
      return Math.max(0, line - (t.offsetTop + t.offsetHeight));
    };
    gsap.fromTo(texts, { y: 0 }, {
      y: (i: number) => shift(i),
      ease: 'none',
      scrollTrigger: { trigger: '[data-compose]', start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
    });
  });
}

/* ---------------- opere in evidenza ---------------- */
function initFeature() {
  const sec = document.querySelector<HTMLElement>('[data-feature]');
  if (!sec) return;
  const media = sec.querySelector<HTMLElement>('[data-feature-media]')!;
  const shade = sec.querySelector<HTMLElement>('[data-feature-shade]')!;
  const counter = sec.querySelector<HTMLElement>('[data-feature-counter]')!;
  const bar = sec.querySelector<HTMLElement>('.feature-bar')!;
  sec.classList.add('is-anim');
  const slider = initFeatureSlider(true);

  const start = () => (window.innerWidth < 768 ? 'inset(24% 5% 34% 5%)' : 'inset(18% 17.5% 17% 17.5%)');
  gsap.timeline({
    scrollTrigger: {
      trigger: sec,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (st) => slider.setActive(st.progress > 0.55),
      onLeave: () => slider.setActive(false),
      onLeaveBack: () => slider.setActive(false),
    },
  })
    .fromTo(media, { clipPath: start }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 })
    .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 1 }, 0)
    .fromTo([counter, bar], { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.8)
    .to({}, { duration: 0.8 });
}

// cinque opere: avanzano da sole quando la foto è aperta, con la barra che si riempie
function initFeatureSlider(auto: boolean) {
  const sec = document.querySelector<HTMLElement>('[data-feature]');
  const noop = { setActive: (_: boolean) => {} };
  if (!sec) return noop;
  const slides = [...sec.querySelectorAll<HTMLElement>('[data-feature-slide]')];
  const titles = [...sec.querySelectorAll<HTMLElement>('[data-feature-title]')];
  const metas = [...sec.querySelectorAll<HTMLElement>('[data-feature-meta]')];
  const links = [...sec.querySelectorAll<HTMLElement>('[data-feature-link]')];
  const index = sec.querySelector<HTMLElement>('[data-feature-index]')!;
  const bar = sec.querySelector<HTMLElement>('[data-feature-bar]')!;
  let i = 0;
  let active = false;
  let tween: gsap.core.Tween | null = null;

  const run = () => {
    tween?.kill();
    gsap.set(bar, { width: '0%' });
    if (!auto || !active) return;
    tween = gsap.to(bar, { width: '100%', duration: 6, ease: 'none', onComplete: () => go(i + 1) });
  };
  const go = (n: number) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.style.opacity = k === i ? '1' : '0';
      s.toggleAttribute('aria-hidden', k !== i);
      s.querySelector<HTMLVideoElement>('video')?.[k === i ? 'play' : 'pause']?.();
    });
    titles.forEach((t, k) => (t.hidden = k !== i));
    metas.forEach((t, k) => (t.hidden = k !== i));
    links.forEach((t, k) => (t.hidden = k !== i));
    index.textContent = String(i + 1).padStart(2, '0');
    run();
  };
  sec.querySelector('[data-feature-prev]')?.addEventListener('click', () => go(i - 1));
  sec.querySelector('[data-feature-next]')?.addEventListener('click', () => go(i + 1));
  return {
    setActive(on: boolean) {
      if (on === active) return;
      active = on;
      if (on) run(); else { tween?.kill(); }
    },
  };
}

/* ---------------- notte: le schede scorrono in orizzontale ---------------- */
function initNight() {
  const sec = document.querySelector<HTMLElement>('[data-night]');
  if (!sec) return;
  const track = sec.querySelector<HTMLElement>('[data-night-track]')!;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1100px)', () => {
    sec.classList.add('is-anim');
    const size = () => {
      sec.style.height = `${window.innerHeight + track.scrollWidth}px`;
    };
    size();
    ScrollTrigger.addEventListener('refreshInit', size);
    gsap.fromTo(track, { x: () => window.innerWidth }, {
      x: () => window.innerWidth - track.scrollWidth,
      ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true },
    });
    sec.querySelectorAll<HTMLElement>('.ns').forEach((el, k) => {
      gsap.fromTo(el, { y: 60 * (k + 1) }, { y: -60 * (k + 1), ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    return () => {
      sec.classList.remove('is-anim');
      sec.style.height = '';
      ScrollTrigger.removeEventListener('refreshInit', size);
    };
  });
}

/* ---------------- cifre: una scheda alla volta ---------------- */
function initNumbers() {
  const sec = document.querySelector<HTMLElement>('[data-numbers]');
  if (!sec) return;
  const cards = [...sec.querySelectorAll<HTMLElement>('[data-num-card]')];
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1100px)', () => {
    sec.classList.add('is-anim');
    const st = ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => {
        const k = Math.min(cards.length - 1, Math.floor(s.progress * cards.length * 1.05));
        cards.forEach((c, j) => c.toggleAttribute('data-active', j === k));
      },
    });
    return () => { sec.classList.remove('is-anim'); st.kill(); };
  });
  mm.add('(max-width: 1099px)', () => {
    cards.forEach((c) => c.setAttribute('data-active', ''));
  });
  // le cifre contano da zero la prima volta che entrano nello schermo
  sec.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el, i) => {
    const to = Number(el.dataset.countTo);
    const n = { v: 0 };
    el.textContent = '0';
    gsap.to(n, {
      v: to, duration: 1.6, delay: i * 0.12, ease: 'power2.out',
      onUpdate: () => (el.textContent = String(Math.round(n.v))),
      scrollTrigger: { trigger: sec.querySelector('.numbers-grid'), start: 'top 85%', once: true },
    });
  });
}

/* ---------------- parallax interno: l'immagine scorre dentro la sua cornice ---------------- */
function initParallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((frame) => {
    const img = frame.querySelector<HTMLElement>('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, {
      yPercent: 7, scale: 1.16, ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ---------------- testi che si scuriscono leggendo ---------------- */
function initReveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal-chars]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words,chars' });
    // lo stato sbiadito si applica solo quando il titolo entra nello schermo: fuori vista resta leggibile
    gsap.fromTo(split.chars, { opacity: 0.14 }, {
      opacity: 1, stagger: 0.06, ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 50%', scrub: true },
    });
  });
  document.querySelectorAll<HTMLElement>('[data-reveal-lines]').forEach((el) => {
    // righe intere: il testo resta leggibile ai lettori di schermo senza etichette aggiunte
    const split = SplitText.create(el, { type: 'lines', aria: 'none' });
    gsap.fromTo(split.lines, { opacity: 0.22 }, {
      opacity: 1, stagger: 0.2, ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 62%', scrub: true },
    });
  });
}
