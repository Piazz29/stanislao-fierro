// G18: la hero fa crescere ogni foto dal proprio schizzo (WebGL): prima il disegno, poi la foto, che compare
// dove c'è lo schizzo; la lente mostra di nuovo il disegno; coppie schizzo/foto attribuite alla stessa opera.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';
import { load, urlOf, fail, LANGS, startPreview } from './lib.mjs';
const map = JSON.parse(fs.readFileSync('images-map.json', 'utf8')).immagini;
const byName = Object.fromEntries(Object.keys(map).map((k) => [path.basename(k, '.jpg'), k]));
const ok = [];

// 1) coppie nella build: schizzo e foto della stessa opera, tipi corretti
for (const l of LANGS) {
  const p = load(urlOf(l, 'home'));
  const slides = p.doc.querySelectorAll('[data-slide]');
  if (slides.length < 3) fail(`${l}: ${slides.length} slide`);
  for (const s of slides) {
    const sk = byName[path.basename(s.getAttribute('data-sketch-src')).split('.')[0]];
    const ph = byName[path.basename(s.querySelector('img').getAttribute('src')).split('.')[0]];
    if (!sk || !ph) { fail(`${l}: slide non riconducibile (${sk}, ${ph})`); continue; }
    if (!map[sk].progetto || map[sk].progetto !== map[ph].progetto) fail(`${l}: ${sk} e ${ph} di opere diverse`);
    if (map[sk].tipo !== 'schizzo' || !['foto', 'rendering'].includes(map[ph].tipo)) fail(`${l}: tipi ${map[sk].tipo}/${map[ph].tipo}`);
  }
  if (!p.doc.querySelector('canvas[data-hero-canvas]')) fail(`${l}: canvas assente`);
}
ok.push('coppie schizzo/foto della stessa opera in it/de/en');

// 2) comportamento reale, misurato sui pixel
const { base, stop } = await startPreview(4413);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto(base + '/opere/', { waitUntil: 'networkidle' });
await page.goto(base + '/', { waitUntil: 'commit' });
await page.waitForSelector('[data-hero-canvas]');
const t0 = Date.now();
const rectOf = () => page.evaluate(() => {
  const s = document.querySelector('[data-slide="0"]'); const c = document.querySelector('[data-hero-canvas]').getBoundingClientRect();
  const pw = +s.dataset.photoW, ph = +s.dataset.photoH, sw = +s.dataset.sketchW, sh = +s.dataset.sketchH;
  const w = Math.min(c.width, pw, c.height * pw / ph), h = w * ph / pw;
  const x = c.left + (c.width - w) / 2, y = c.top + (c.height - h) / 2;
  let kw = sw / pw, kh = sh / ph; const k = Math.min(1, 0.92 / kw, 0.92 / kh); kw *= k; kh *= k;
  return { x, y, w, h, sk: { x: x + (1 - kw) / 2 * w, y: y + (1 - kh) / 2 * h, w: kw * w, h: kh * h }, gl: document.querySelector('[data-slideshow]').classList.contains('is-gl'), src: s.querySelector('img').currentSrc };
});
const grab = async (r) => sharp(await page.screenshot({ clip: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.w), height: Math.round(r.h) } })).resize(120, Math.round(120 * r.h / r.w), { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
const at = async (ms) => page.waitForTimeout(Math.max(0, ms - (Date.now() - t0)));
const r = await rectOf();
if (!r.gl) { fail('is-gl non attivo: WebGL non usato'); }
const paper = (px) => px > 225;
// campiona la sequenza ogni 150 ms: deve esistere una fase di disegno, una di crescita parziale e una finale
const seq = [];
while (Date.now() - t0 < 6200) { const pv = await page.evaluate(() => Number(document.querySelector('[data-hero-canvas]').dataset.p ?? 0)); seq.push({ t: Date.now() - t0, p: pv, img: await grab(r) }); await page.waitForTimeout(120); }
await at(8000); const end = await grab(r);
const refBuf = Buffer.from(await (await fetch(r.src)).arrayBuffer());
const ref = await sharp(refBuf).resize(end.info.width, end.info.height, { fit: 'fill' }).greyscale().raw().toBuffer();
const ncc = (a, c) => { const n = a.length; let ma = 0, mc = 0; for (let i = 0; i < n; i++) { ma += a[i]; mc += c[i]; } ma /= n; mc /= n; let s = 0, sa = 0, sc = 0; for (let i = 0; i < n; i++) { s += (a[i] - ma) * (c[i] - mc); sa += (a[i] - ma) ** 2; sc += (c[i] - mc) ** 2; } return s / Math.sqrt(sa * sc); };
const isShown = (img, i) => Math.abs(img.data[i] - ref[i]) < 26 && !paper(img.data[i]);
const share = (img) => { let n = 0; for (let i = 0; i < img.data.length; i++) if (isShown(img, i)) n++; return n / img.data.length; };
const paperShare = (img) => img.data.filter(paper).length / img.data.length;
const shares = seq.map((f) => ({ t: f.t, s: share(f.img), p: paperShare(f.img), img: f.img }));
const drawingFrame = shares.find((f) => f.p > 0.7 && f.p < 0.995 && f.s < 0.08); // tratti visibili, foto non ancora
const growing = shares.filter((f) => f.s > 0.12 && f.s < 0.75);
const fEnd = ncc(end.data, ref);
if (!drawingFrame) fail('nessun fotogramma di solo disegno');
// durata della crescita letta dal canvas: da p 0.05 (primi tratti) a p 1.2 (foglio pieno)
const tStart = seq.find((f) => f.p >= 0.05)?.t, tFull = seq.find((f) => f.p >= 1.2)?.t;
const growMs = tStart != null && tFull != null ? tFull - tStart : 0;
if (!growing.length) fail(`nessun fotogramma di crescita parziale (${shares.map((f) => Math.round(f.s * 100)).join(' ')})`);
if (!(growMs >= 2000 && growMs <= 4500)) fail(`crescita di ${growMs} ms (attesa 2-4,5 s)`);
if (!(fEnd > 0.9)) fail(`fine: NCC con la foto ${fEnd.toFixed(3)}`);
// nel primo fotogramma di crescita la foto è comparsa soprattutto dove c'è lo schizzo
const g0 = growing[0];
let inS = 0, tot = 0;
const sx0 = (r.sk.x - r.x) / r.w, sy0 = (r.sk.y - r.y) / r.h, sx1 = sx0 + r.sk.w / r.w, sy1 = sy0 + r.sk.h / r.h;
if (g0) for (let y = 0; y < g0.img.info.height; y++) for (let x = 0; x < g0.img.info.width; x++) {
  const i = y * g0.img.info.width + x;
  if (isShown(g0.img, i)) { tot++; const u = x / g0.img.info.width, v = y / g0.img.info.height; if (u >= sx0 - 0.05 && u <= sx1 + 0.05 && v >= sy0 - 0.08 && v <= sy1 + 0.08) inS++; }
}
const area = Math.min(1, (sx1 - sx0 + 0.1) * (sy1 - sy0 + 0.16));
if (!(tot > 0 && inS / tot > Math.min(0.95, area + 0.25))) fail(`la crescita non parte dallo schizzo (${(inS / Math.max(1, tot) * 100).toFixed(0)}% nell'area dello schizzo, che è ${(area * 100).toFixed(0)}% del riquadro)`);
ok.push(`disegno a ${drawingFrame?.t} ms (${Math.round((drawingFrame?.p ?? 0) * 100)}% carta), crescita di ${growMs} ms (dal canvas), foto parziale da ${g0?.t} a ${growing.at(-1)?.t} ms, all'inizio ${(inS / Math.max(1, tot) * 100).toFixed(0)}% della foto nell'area dello schizzo (${(area * 100).toFixed(0)}% del riquadro), fine NCC ${fEnd.toFixed(3)}`);
// lente: il cerchio sotto il cursore torna carta da disegno, fuori resta la foto
const cx = r.x + r.w * 0.3, cy = r.y + r.h * 0.5;
await page.mouse.move(cx, cy, { steps: 6 });
await page.waitForTimeout(900);
const lensR = 30;
const inside = await sharp(await page.screenshot({ clip: { x: cx - lensR, y: cy - lensR, width: lensR * 2, height: lensR * 2 } })).greyscale().stats();
const outside = await sharp(await page.screenshot({ clip: { x: r.x + r.w * 0.75 - lensR, y: cy - lensR, width: lensR * 2, height: lensR * 2 } })).greyscale().stats();
const before = await sharp(refBuf).extract({ left: Math.round((0.3 - 0.03) * (await sharp(refBuf).metadata()).width), top: Math.round(0.45 * (await sharp(refBuf).metadata()).height), width: 30, height: 30 }).greyscale().stats();
if (!(inside.channels[0].mean > 180 && inside.channels[0].mean - before.channels[0].mean > 40)) fail(`lente: media ${inside.channels[0].mean.toFixed(0)} vs foto ${before.channels[0].mean.toFixed(0)}`);
const coords = await page.locator('[data-hero-coords]').isVisible() ? await page.locator('[data-hero-coords]').innerText() : '';
if (!/^x \d{4} · y \d{4}$/i.test(coords)) fail(`coordinate «${coords}»`);
ok.push(`lente: dentro ${inside.channels[0].mean.toFixed(0)} (foto ${before.channels[0].mean.toFixed(0)}), fuori ${outside.channels[0].mean.toFixed(0)}; coordinate «${coords}»`);
if (errs.length) fail('errori JS: ' + errs.join(' | '));
// telefono: inclinandolo la lente si sposta e mostra il disegno; tenendolo fermo sparisce
{
  const mp = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  await mp.goto(base + '/', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(6500);
  await mp.click('[data-toggle]'); // pausa: lo slideshow non deve cambiare durante la prova
  const c = await mp.evaluate(() => { const r = document.querySelector('[data-hero-canvas]').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const spot = async () => (await sharp(await mp.screenshot({ clip: { x: c.x + c.w * 0.786 - 14, y: c.y + c.h * 0.5 - 14, width: 28, height: 28 } })).greyscale().stats()).channels[0].mean;
  const tilt = (g, bt) => mp.evaluate(([g, bt]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: bt, gamma: g })), [g, bt]);
  const still = await spot();
  await tilt(0, 40); await mp.waitForTimeout(100);
  for (let k = 1; k <= 6; k++) { await tilt(k * 2.5, 40); await mp.waitForTimeout(60); }
  await mp.waitForTimeout(500);
  const tilted = await spot();
  await mp.waitForTimeout(2600);
  const settled = await spot();
  if (!(tilted - still > 40 && Math.abs(settled - still) < 25)) fail(`inclinazione: fermo ${still.toFixed(0)}, inclinato ${tilted.toFixed(0)}, poi ${settled.toFixed(0)}`);
  ok.push(`inclinazione del telefono: luminosità nel punto della lente ${still.toFixed(0)} → ${tilted.toFixed(0)} → ${settled.toFixed(0)} (la lente arriva e poi si ritira)`);
}
await b.close(); stop();
console.log(ok.map((x) => 'ok   ' + x).join('\n'));
if (!process.exitCode) console.log('HERO VERIFIED');
process.exit(process.exitCode ?? 0);
