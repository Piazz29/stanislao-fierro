// «Il disegno diventa edificio»: la foto cresce dai tratti dello schizzo a mano (WebGL).
// Il campo di crescita è calcolato dal disegno stesso: i tratti di matita arrivano per primi,
// poi la foto si espande a ondate con un bordo d'inchiostro fino ai margini del foglio.
// Una lente (cursore, dito o inclinazione del telefono) mostra di nuovo il disegno dentro l'edificio.

export type HeroSlide = {
  photo: HTMLImageElement; // l'<img> già nella pagina (srcset scelto dal browser)
  sketchSrc: string;
  photoW: number; photoH: number; // misure native
  sketchW: number; sketchH: number;
};
export type Hero = { go(i: number): Promise<void>; ready: Promise<void>; destroy(): void; onPhase?: (i: number, phase: 'drawing' | 'built') => void };

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
uniform vec2 uRes;            // px del canvas
uniform vec4 uRect;           // rettangolo della foto (x, y, w, h) in px, origine in alto a sinistra
uniform vec4 uSk;             // rettangolo dello schizzo dentro la foto, in uv della foto
uniform sampler2D uPhoto, uSketch, uField;
uniform float uP;             // avanzamento della crescita 0..1.6
uniform float uDraw;          // presenza del disegno 0..1 (ingresso)
uniform vec4 uPrevRect; uniform sampler2D uPrev; uniform float uPrevA;
uniform vec3 uLens;           // x, y, raggio in px
uniform float uLensA;
uniform float uDpr;
uniform float uTime;
uniform vec3 uInk;

float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ return n(p)*0.55 + n(p*2.07+3.1)*0.28 + n(p*4.13+7.7)*0.17; }

vec4 drawing(vec2 uv){
  vec2 s = (uv - uSk.xy) / uSk.zw;
  if (s.x < 0.0 || s.y < 0.0 || s.x > 1.0 || s.y > 1.0) return vec4(0.0);
  vec3 c = texture2D(uSketch, s).rgb;
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  float a = clamp((0.84 - l) * 3.0, 0.0, 1.0);   // la carta della scansione resta trasparente
  return vec4(c * a, a); // premoltiplicato: la carta resta trasparente e lascia vedere la griglia
}

void main(){
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec4 col = vec4(0.0);
  // foto precedente che lascia il posto al nuovo disegno
  if (uPrevA > 0.0) {
    vec2 q = (px - uPrevRect.xy) / uPrevRect.zw;
    if (q.x >= 0.0 && q.y >= 0.0 && q.x <= 1.0 && q.y <= 1.0) col = vec4(texture2D(uPrev, q).rgb, 1.0) * uPrevA;
  }
  vec2 uv = (px - uRect.xy) / uRect.zw;
  if (uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0) {
    vec4 d = drawing(uv) * uDraw;
    float t = texture2D(uField, uv).r;                       // 0 sui tratti, 1 lontano dal disegno
    float aspect = uRect.z / uRect.w;
    float g = fbm(uv * vec2(aspect, 1.0) * 6.0) * 0.16 + fbm(uv * vec2(aspect, 1.0) * 38.0) * 0.05;
    float front = uP - (t + g);
    float m = smoothstep(-0.015, 0.05, front);               // dove la foto è già cresciuta
    float rim = smoothstep(-0.015, 0.02, front) * (1.0 - smoothstep(0.02, 0.11, front)) * step(uP, 1.2);
    vec4 ph = vec4(texture2D(uPhoto, uv).rgb, 1.0);
    ph.rgb = mix(ph.rgb, ph.rgb * uInk, rim * 0.55);         // bordo bagnato d'inchiostro
    vec4 cur = mix(d, ph, m);
    // i tratti restano sopra la foto e poi si ritirano
    float linger = (1.0 - smoothstep(1.05, 1.6, uP)) * m;
    cur.rgb = mix(cur.rgb, cur.rgb * mix(vec3(1.0), d.rgb / max(d.a, 0.001), d.a), linger * 0.85);
    col = cur + col * (1.0 - cur.a);

    // lente del progettista: dentro il cerchio torna il foglio da disegno
    if (uLensA > 0.0) {
      float r = uLens.z;
      float dist = distance(px, uLens.xy);
      float inside = (1.0 - smoothstep(r - 1.0 * uDpr, r, dist)) * uLensA;
      if (inside > 0.0) {
        vec3 paper = vec3(0.969, 0.961, 0.941);
        vec2 gp = mod(px - uLens.xy, 10.0 * uDpr);
        float grid = (1.0 - step(1.0 * uDpr, gp.x)) + (1.0 - step(1.0 * uDpr, gp.y));
        vec3 sheet = mix(paper, vec3(0.87, 0.855, 0.82), clamp(grid, 0.0, 1.0) * 0.55);
        sheet = mix(sheet, ph.rgb, 0.1);                       // la foto come velina sotto il disegno
        vec4 dd = drawing(uv);
        sheet = sheet * (1.0 - dd.a) + dd.rgb;
        float cross = (1.0 - step(0.6 * uDpr, abs(px.x - uLens.x))) + (1.0 - step(0.6 * uDpr, abs(px.y - uLens.y)));
        sheet = mix(sheet, vec3(0.56, 0.24, 0.17), clamp(cross, 0.0, 1.0) * step(dist, r * 0.22) * 0.9);
        col = mix(col, vec4(sheet, 1.0), inside);
      }
      float ring = (smoothstep(r - 1.6 * uDpr, r - 0.6 * uDpr, dist) - smoothstep(r + 0.2 * uDpr, r + 1.2 * uDpr, dist)) * uLensA;
      col = mix(col, vec4(0.118, 0.11, 0.098, 1.0), ring);
    }
  }
  gl_FragColor = col;
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
}
const load = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = src; });
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
// crescita: parte subito sui tratti, rallenta verso i margini del foglio
// p 0 → 1.2 è la crescita vera (3/4 del tempo), 1.2 → 1.6 il ritiro delle linee
const grow = (t: number) => (t < 0.75 ? 1.2 * (1 - Math.pow(1 - t / 0.75, 1.5)) / 1.6 : (1.2 + 0.4 * ((t - 0.75) / 0.25)) / 1.6);

// rettangolo dello schizzo dentro la foto (uv), alla stessa scala della foto, mai più grande del foglio
function sketchRect(s: HeroSlide) {
  let w = s.sketchW / s.photoW, h = s.sketchH / s.photoH;
  const k = Math.min(1, 0.92 / w, 0.92 / h);
  w *= k; h *= k;
  return [(1 - w) / 2, (1 - h) / 2, w, h] as const;
}

// campo di crescita: 0 sui tratti, 1 lontano; sfocature a raggi crescenti normalizzate
function growthField(sketch: HTMLImageElement, s: HeroSlide) {
  const W = 220, H = Math.max(40, Math.round(W * s.photoH / s.photoW));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true })!;
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  const [rx, ry, rw, rh] = sketchRect(s);
  x.drawImage(sketch, rx * W, ry * H, rw * W, rh * H);
  const src = x.getImageData(0, 0, W, H).data;
  const d = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) { const l = (src[i * 4] * 0.299 + src[i * 4 + 1] * 0.587 + src[i * 4 + 2] * 0.114) / 255; d[i] = Math.min(1, Math.max(0, (0.88 - l) * 3)); }
  const blur = (a: Float32Array, r: number) => {
    let cur = a.slice();
    const tmp = new Float32Array(W * H);
    for (let it = 0; it < 3; it++) {
      for (let y = 0; y < H; y++) { let acc = 0; const o = y * W; for (let i = -r; i <= r; i++) acc += cur[o + Math.min(W - 1, Math.max(0, i))];
        for (let xx = 0; xx < W; xx++) { tmp[o + xx] = acc / (2 * r + 1); acc += cur[o + Math.min(W - 1, xx + r + 1)] - cur[o + Math.max(0, xx - r)]; } }
      for (let xx = 0; xx < W; xx++) { let acc = 0; for (let i = -r; i <= r; i++) acc += tmp[Math.min(H - 1, Math.max(0, i)) * W + xx];
        for (let y = 0; y < H; y++) { cur[y * W + xx] = acc / (2 * r + 1); acc += tmp[Math.min(H - 1, y + r + 1) * W + xx] - tmp[Math.max(0, y - r) * W + xx]; } }
    }
    let mx = 0; for (const v of cur) mx = Math.max(mx, v);
    if (mx > 0) for (let i = 0; i < cur.length; i++) cur[i] /= mx;
    return cur;
  };
  const layers: [number, number][] = [[1, 1], [2, 0.9], [6, 0.74], [16, 0.56], [40, 0.38]];
  const f = new Float32Array(W * H);
  for (const [r, w] of layers) { const b = blur(d, r); for (let i = 0; i < f.length; i++) f[i] = Math.max(f[i], b[i] * w); }
  // base: dal centro del disegno verso i bordi del foglio
  const cx = (rx + rw / 2) * W, cy = (ry + rh / 2) * H, md = Math.hypot(W, H) / 2;
  let mx = 0;
  for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) { const i = y * W + xx; f[i] = Math.max(f[i], 0.3 * (1 - Math.hypot(xx - cx, y - cy) / md)); mx = Math.max(mx, f[i]); }
  const out = new Uint8Array(W * H);
  for (let i = 0; i < f.length; i++) out[i] = Math.round((1 - f[i] / mx) * 255);
  return { data: out, W, H };
}

export function createHero(canvas: HTMLCanvasElement, stage: HTMLElement, slides: HeroSlide[], opts: { reduce: boolean; coords?: HTMLElement }): Hero | null {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: false });
  if (!gl) return null;
  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  } catch { return null; }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = Object.fromEntries(['uRes', 'uRect', 'uSk', 'uPhoto', 'uSketch', 'uField', 'uP', 'uDraw', 'uPrevRect', 'uPrev', 'uPrevA', 'uLens', 'uLensA', 'uDpr', 'uTime', 'uInk'].map((n) => [n, U(n)]));
  gl.uniform1i(u.uPhoto, 0); gl.uniform1i(u.uSketch, 1); gl.uniform1i(u.uField, 2); gl.uniform1i(u.uPrev, 3);
  gl.uniform3f(u.uInk, 0.42, 0.36, 0.33);

  const tex = (unit: number, source: TexImageSource | null, data?: { data: Uint8Array; W: number; H: number }) => {
    const t = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (data) { gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, data.W, data.H, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data.data); }
    else if (source) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    return t;
  };

  // risorse per slide, caricate su richiesta
  type Res = { photo: WebGLTexture; sketch: WebGLTexture; field: WebGLTexture; sk: readonly number[] };
  const cache = new Map<number, Promise<Res>>();
  const resources = (i: number) => {
    if (!cache.has(i)) cache.set(i, (async () => {
      const s = slides[i];
      if (s.photo.loading === 'lazy') s.photo.loading = 'eager';
      const photoImg = await load(s.photo.currentSrc || s.photo.src);
      const sketchImg = await load(s.sketchSrc);
      return { photo: tex(0, photoImg), sketch: tex(1, sketchImg), field: tex(2, null, growthField(sketchImg, s)), sk: sketchRect(s) };
    })());
    return cache.get(i)!;
  };

  const st = { i: -1, p: 0, draw: 0, prevA: 0, prev: null as Res | null, prevI: -1, lensA: 0, lensT: 0, lx: 0, ly: 0, tx: 0, ty: 0, running: false, visible: true, t0: performance.now() };
  let dpr = Math.min(2, window.devicePixelRatio || 1);
  let tl: { from: number; dur: number; key: 'p' | 'draw' | 'prevA'; a: number; b: number; ease: (t: number) => number }[] = [];

  const rectFor = (i: number) => {
    const s = slides[i];
    const cw = canvas.width, ch = canvas.height, a = s.photoW / s.photoH;
    let w = Math.min(cw, s.photoW * dpr, ch * a);
    let h = w / a;
    return [Math.round((cw - w) / 2), Math.round((ch - h) / 2), Math.round(w), Math.round(h)];
  };
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    kick();
  };

  let cur: Res | null = null;
  const frame = (now: number) => {
    st.running = false;
    if (!cur || st.i < 0) return;
    // linea temporale
    tl = tl.filter((k) => {
      const t = Math.min(1, Math.max(0, (now - k.from) / k.dur));
      if (now >= k.from) st[k.key] = k.a + (k.b - k.a) * k.ease(t);
      return t < 1;
    });
    // lente: insegue il bersaglio
    st.lx += (st.tx - st.lx) * 0.22; st.ly += (st.ty - st.ly) * 0.22;
    st.lensA += (st.lensT - st.lensA) * 0.16;
    if (Math.abs(st.lensT - st.lensA) < 0.002) st.lensA = st.lensT;

    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    const R = rectFor(st.i);
    gl.uniform4f(u.uRect, R[0], R[1], R[2], R[3]);
    gl.uniform4f(u.uSk, cur.sk[0], cur.sk[1], cur.sk[2], cur.sk[3]);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, cur.photo);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, cur.sketch);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, cur.field);
    if (st.prev && st.prevA > 0) {
      const P = rectFor(st.prevI);
      gl.uniform4f(u.uPrevRect, P[0], P[1], P[2], P[3]);
      gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, st.prev.photo);
    }
    gl.uniform1f(u.uPrevA, st.prev ? st.prevA : 0);
    gl.uniform1f(u.uP, st.p);
    gl.uniform1f(u.uDraw, st.draw);
    const lr = Math.max(46, Math.min(110, R[3] / dpr * 0.2)) * dpr;
    gl.uniform3f(u.uLens, st.lx * dpr, st.ly * dpr, lr);
    gl.uniform1f(u.uLensA, st.lensA);
    gl.uniform1f(u.uDpr, dpr);
    gl.uniform1f(u.uTime, (now - st.t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // stato leggibile (verifiche automatiche e debug): avanzamento e lente
    canvas.dataset.p = st.p.toFixed(2);
    canvas.dataset.lens = `${st.lensA.toFixed(2)} ${Math.round(st.lx)} ${Math.round(st.ly)}`;
    if (opts.coords) {
      const show = st.lensA > 0.05 && st.lensT > 0;
      opts.coords.hidden = !show;
      if (show) {
        const x = Math.round(((st.lx * dpr - R[0]) / R[2]) * 1000), y = Math.round(((st.ly * dpr - R[1]) / R[3]) * 1000);
        opts.coords.textContent = `x ${String(Math.max(0, x)).padStart(4, '0')} · y ${String(Math.max(0, y)).padStart(4, '0')}`;
        opts.coords.style.transform = `translate(${st.lx + lr / dpr * 0.75}px, ${st.ly + lr / dpr * 0.75}px)`;
      }
    }
    if (tl.length || Math.abs(st.lx - st.tx) > 0.3 || Math.abs(st.ly - st.ty) > 0.3 || st.lensA !== st.lensT) kick();
  };
  const kick = () => { if (!st.running && st.visible) { st.running = true; requestAnimationFrame(frame); } };

  const hero: Hero = {
    ready: resources(0).then(() => undefined),
    async go(i: number) {
      const res = await resources(i);
      const now = performance.now();
      if (cur && st.i >= 0 && st.i !== i) { st.prev = cur; st.prevI = st.i; st.prevA = 1; }
      cur = res; st.i = i;
      hero.onPhase?.(i, 'drawing');
      if (opts.reduce) { st.p = 1.6; st.draw = 1; st.prevA = 0; tl = []; hero.onPhase?.(i, 'built'); kick(); return; }
      st.p = 0; st.draw = 0;
      tl = [
        { from: now, dur: 900, key: 'draw', a: 0, b: 1, ease: easeOut },
        { from: now, dur: 1000, key: 'prevA', a: st.prev ? 1 : 0, b: 0, ease: easeInOut },
        { from: now + 650, dur: 4300, key: 'p', a: 0, b: 1.6, ease: grow },
      ];
      window.setTimeout(() => { if (st.i === i) hero.onPhase?.(i, 'built'); }, 650 + 1500);
      kick();
      // prepara la successiva
      resources((i + 1) % slides.length);
    },
    destroy() { io.disconnect(); ro.disconnect(); window.removeEventListener('deviceorientation', onTilt); },
  };

  // lente: mouse, dito, inclinazione
  const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  stage.addEventListener('pointermove', (e) => {
    const [x, y] = local(e);
    // con il dito la lente sta sopra il polpastrello, per non essere coperta
    st.tx = x; st.ty = e.pointerType === 'touch' ? y - 70 : y;
    if (st.lensA === 0) { st.lx = st.tx; st.ly = st.ty; }
    st.lensT = 1; kick();
  });
  stage.addEventListener('pointerdown', (e) => {
    const [x, y] = local(e);
    st.tx = st.lx = x; st.ty = st.ly = e.pointerType === 'touch' ? y - 70 : y; st.lensT = 1; kick();
    askTilt();
  });
  const off = () => { st.lensT = 0; kick(); };
  stage.addEventListener('pointerleave', off);
  stage.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') off(); });
  stage.addEventListener('pointercancel', off);

  let base: [number, number] | null = null;
  let stillTimer = 0;
  const onTilt = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null || opts.reduce) return;
    if (!base) base = [e.gamma, e.beta];
    const ox = Math.max(-1, Math.min(1, (e.gamma - base[0]) / 22));
    const oy = Math.max(-1, Math.min(1, (e.beta - base[1]) / 22));
    const mag = Math.hypot(ox, oy);
    if (mag < 0.12) return;
    const r = canvas.getBoundingClientRect();
    st.tx = r.width / 2 + ox * r.width * 0.42;
    st.ty = r.height / 2 + oy * r.height * 0.42;
    if (st.lensA === 0) { st.lx = st.tx; st.ly = st.ty; }
    st.lensT = 1; kick();
    window.clearTimeout(stillTimer);
    stillTimer = window.setTimeout(() => { base = [e.gamma!, e.beta!]; off(); }, 1400);
  };
  // inclinazione: Chrome concede il permesso subito; Safari su iPhone solo dopo un gesto (primo tocco sulla hero)
  let tiltOn = false;
  const attachTilt = () => { if (!tiltOn) { tiltOn = true; window.addEventListener('deviceorientation', onTilt); } };
  const D = (typeof DeviceOrientationEvent !== 'undefined' ? DeviceOrientationEvent : null) as unknown as { requestPermission?: () => Promise<string> } | null;
  const wantTilt = !opts.reduce && !!D && matchMedia('(pointer: coarse)').matches;
  const askTilt = () => {
    if (!wantTilt || tiltOn) return;
    if (typeof D!.requestPermission === 'function') D!.requestPermission().then((s) => { if (s === 'granted') attachTilt(); }).catch(() => {});
    else attachTilt();
  };
  if (wantTilt) {
    if (typeof D!.requestPermission !== 'function') attachTilt();
    else D!.requestPermission().then((s) => { if (s === 'granted') attachTilt(); }).catch(() => { /* iOS: al primo tocco */ });
  }

  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; if (st.visible) kick(); });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => { st.visible = !document.hidden; if (st.visible) kick(); });
  resize();
  return hero;
}
