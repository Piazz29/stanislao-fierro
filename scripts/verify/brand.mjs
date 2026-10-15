// G16: simbolo e immagini di condivisione: favicon/icone corrette, nessun residuo del template Astro,
// ogni pagina punta alla propria tavola 1200x630 (lingua giusta, < 300 KB, più recente del contenuto).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { allPages, fail, DIST } from './lib.mjs';
import { parse } from 'node-html-parser';
const SITE = 'https://www.stanislaofierro.com';
// favicon.ico: tre PNG 16/32/48
const ico = fs.readFileSync(path.join(DIST, 'favicon.ico'));
const n = ico.readUInt16LE(4);
const dims = [...Array(n)].map((_, i) => ico.readUInt8(6 + i * 16));
if (ico.readUInt16LE(2) !== 1 || dims.join() !== '16,32,48') fail(`favicon.ico: ${n} immagini ${dims}`);
for (const [f, s] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512], ['favicon-32.png', 32]]) {
  const m = await sharp(path.join(DIST, f)).metadata();
  if (m.width !== s || m.height !== s) fail(`${f}: ${m.width}x${m.height}`);
}
// il simbolo è scuro (carbone) con il quadratino porfido: campione dei pixel della 512
const { data } = await sharp(path.join(DIST, 'icon-512.png')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const px = (x, y) => [...data.subarray((y * 512 + x) * 3, (y * 512 + x) * 3 + 3)];
const bg = px(8, 8), sq = px(512 - 0.13 * 512 - 0.08 * 512 | 0, 0.13 * 512 + 0.08 * 512 | 0);
if (!(bg.every((v) => v < 50))) fail(`fondo del simbolo non carbone: ${bg}`);
if (!(sq[0] > 110 && sq[1] < 80 && sq[2] < 70)) fail(`quadratino non porfido: ${sq}`);
if (fs.existsSync(path.join(DIST, 'favicon.svg'))) fail('favicon.svg del template ancora presente');
const man = JSON.parse(fs.readFileSync(path.join(DIST, 'site.webmanifest'), 'utf8'));
for (const i of man.icons) if (!fs.existsSync(path.join(DIST, i.src))) fail(`manifest: manca ${i.src}`);

const seen = new Map();
let pages = 0;
for (const f of allPages()) {
  const raw = fs.readFileSync(f, 'utf8');
  const d = parse(raw);
  const href = (sel, attr = 'href') => d.querySelector(sel)?.getAttribute(attr);
  if (href('link[rel="icon"][href="/favicon.ico"]') == null || href('link[rel="apple-touch-icon"]') == null || href('link[rel="manifest"]') == null) fail(`${f}: link icone mancanti`);
  const og = href('meta[property="og:image"]', 'content') ?? '';
  const tw = href('meta[name="twitter:image"]', 'content');
  if (!og.startsWith(SITE + '/og/') || tw !== og) { fail(`${f}: og:image ${og}`); continue; }
  if (href('meta[property="og:image:width"]', 'content') !== '1200' || href('meta[property="og:image:height"]', 'content') !== '630') fail(`${f}: dimensioni dichiarate`);
  const file = path.join(DIST, og.slice(SITE.length));
  if (!fs.existsSync(file)) { fail(`${f}: tavola assente ${og}`); continue; }
  const m = await sharp(file).metadata();
  if (m.format !== 'jpeg' || m.width !== 1200 || m.height !== 630) fail(`${og}: ${m.format} ${m.width}x${m.height}`);
  if (fs.statSync(file).size > 300_000) fail(`${og}: ${fs.statSync(file).size} byte`);
  const lang = (d.querySelector('html').getAttribute('lang') ?? '').slice(0, 2);
  if (!og.includes(`/og/${lang}/`)) fail(`${f}: tavola in lingua diversa (${og})`);
  // freschezza: la tavola di un'opera è più recente del suo file di contenuto
  const slug = og.match(/\/og\/\w\w\/[^/]+\/([^/]+)\.jpg$/)?.[1];
  if (slug) { const y = `src/content/projects/${slug}.yaml`; if (fs.existsSync(y) && fs.statSync(path.join('public', og.slice(SITE.length))).mtimeMs < fs.statSync(y).mtimeMs) fail(`${og}: più vecchia di ${y}`); }
  if (!f.endsWith('404.html')) { if (seen.has(og) && seen.get(og) !== f) fail(`tavola condivisa da ${f} e ${seen.get(og)}`); seen.set(og, f); }
  pages++;
}
console.log(`pagine ${pages}, tavole distinte ${seen.size}, favicon ${dims.join('/')}`);
if (!process.exitCode) console.log('BRAND VERIFIED');
