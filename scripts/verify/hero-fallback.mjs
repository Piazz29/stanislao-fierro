// G19: senza WebGL lo slideshow di foto funziona; con movimento ridotto la foto compare subito, senza crescita.
import sharp from 'sharp';
import { chromium } from 'playwright-core';
import { fail, startPreview } from './lib.mjs';
const { base, stop } = await startPreview(4414);
const exe = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ok = [];
// senza WebGL
{
  const b = await chromium.launch({ executablePath: exe, args: ['--disable-webgl', '--disable-3d-apis'] });
  const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const st = await page.evaluate(() => ({ gl: document.querySelector('[data-slideshow]').classList.contains('is-gl'), o: [...document.querySelectorAll('[data-slide]')].map((s) => getComputedStyle(s).opacity), img: document.querySelector('[data-slide="0"] img').complete && document.querySelector('[data-slide="0"] img').naturalWidth }));
  if (st.gl || st.o[0] !== '1' || !st.img) fail(`senza WebGL: ${JSON.stringify(st)}`);
  await page.click('[data-next]');
  await page.waitForTimeout(2200);
  const o2 = await page.evaluate(() => [...document.querySelectorAll('[data-slide]')].map((s) => getComputedStyle(s).opacity));
  if (o2[1] !== '1' || o2[0] !== '0') fail(`senza WebGL, dopo «successiva»: ${o2}`);
  if (errs.length) fail('errori JS senza WebGL: ' + errs.join(' | '));
  ok.push(`senza WebGL: foto visibile, slideshow ${st.o.join('/')} → ${o2.join('/')}`);
  await b.close();
}
// movimento ridotto: la foto è subito intera
{
  const b = await chromium.launch({ executablePath: exe });
  const page = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => { const s = document.querySelector('[data-slide="0"]'); const c = document.querySelector('[data-hero-canvas]').getBoundingClientRect(); const pw = +s.dataset.photoW, ph = +s.dataset.photoH; const w = Math.min(c.width, pw, c.height * pw / ph), h = w * ph / pw; return { x: c.left + (c.width - w) / 2, y: c.top + (c.height - h) / 2, w, h, src: s.querySelector('img').currentSrc, gl: document.querySelector('[data-slideshow]').classList.contains('is-gl') }; });
  const shot = await sharp(await page.screenshot({ clip: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.w), height: Math.round(r.h) } })).resize(120, 50, { fit: 'fill' }).greyscale().raw().toBuffer();
  const ref = await sharp(Buffer.from(await (await fetch(r.src)).arrayBuffer())).resize(120, 50, { fit: 'fill' }).greyscale().raw().toBuffer();
  let ma = 0, mb = 0; for (let i = 0; i < ref.length; i++) { ma += shot[i]; mb += ref[i]; } ma /= ref.length; mb /= ref.length;
  let s = 0, sa = 0, sb = 0; for (let i = 0; i < ref.length; i++) { s += (shot[i] - ma) * (ref[i] - mb); sa += (shot[i] - ma) ** 2; sb += (ref[i] - mb) ** 2; }
  const n = s / Math.sqrt(sa * sb);
  if (!(n > 0.9)) fail(`movimento ridotto: a 0,9 s la foto non è intera (NCC ${n.toFixed(3)}, gl ${r.gl})`);
  ok.push(`movimento ridotto: foto intera a 0,9 s (NCC ${n.toFixed(3)})`);
  await b.close();
}
stop();
console.log(ok.map((x) => 'ok   ' + x).join('\n'));
if (!process.exitCode) console.log('HERO FALLBACK VERIFIED');
process.exit(process.exitCode ?? 0);
