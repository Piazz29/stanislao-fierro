// G5: ogni immagine resa viene da src/assets/originali (o dalla mappa OSM generata), le foto hanno alt
// descrittivo, sono emessi AVIF e WebP, nessuna larghezza supera l'originale.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { allPages, fail, DIST } from './lib.mjs';
import { parse } from 'node-html-parser';
const O = 'src/assets/originali';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
// larghezza massima per nome base originale (i nomi si ripetono tra cartelle: si usa il massimo, prudente)
const maxW = {};
for (const f of walk(O)) { try { const m = await sharp(f).metadata(); const b = path.basename(f).replace(/\.\w+$/, ''); maxW[b] = Math.max(maxW[b] ?? 0, m.width); } catch {} }
maxW['mappa-via-montello'] = 1280;
const origOf = (u) => { const b = path.basename(u).split('.')[0]; return Object.keys(maxW).find((k) => b === k || b.startsWith(k + '.') ) ?? (b.match(/^(\d+_immagine|mappa-via-montello|studio|biografia|contatti)/)?.[1]); };

let imgs = 0, photos = 0, avif = 0, webp = 0, checkedFiles = new Set(), external = 0;
const dims = {};
async function width(file) { if (!(file in dims)) dims[file] = (await sharp(file).metadata()).width; return dims[file]; }
for (const f of allPages()) {
  const doc = parse(fs.readFileSync(f, 'utf8'));
  for (const s of doc.querySelectorAll('source')) { const t = s.getAttribute('type'); if (t === 'image/avif') avif++; if (t === 'image/webp') webp++; }
  for (const el of [...doc.querySelectorAll('img'), ...doc.querySelectorAll('source')]) {
    const srcs = [el.getAttribute('src'), ...(el.getAttribute('srcset') ?? '').split(',').map((x) => x.trim().split(/\s+/)[0])].filter(Boolean);
    for (const s of srcs) {
      if (/^https?:|^\/\//.test(s)) { external++; fail(`${f}: immagine esterna ${s}`); continue; }
      if (!s.startsWith('/_astro/')) { fail(`${f}: immagine fuori pipeline ${s}`); continue; }
      const file = path.join(DIST, s.split('?')[0]);
      if (!fs.existsSync(file)) { fail(`${f}: file assente ${s}`); continue; }
      const o = origOf(s);
      if (!o || !maxW[o]) { fail(`${f}: immagine non riconducibile a un originale: ${s}`); continue; }
      if (!checkedFiles.has(file)) { checkedFiles.add(file); if ((await width(file)) > maxW[o]) fail(`${s}: ${dims[file]}px oltre l'originale ${maxW[o]}px`); }
    }
    for (const part of (el.getAttribute('srcset') ?? '').split(',')) { const m = part.trim().match(/\s(\d+)w$/); const o = origOf(part.trim().split(/\s+/)[0]); if (m && o && Number(m[1]) > maxW[o]) fail(`${f}: descrittore ${m[1]}w oltre ${maxW[o]}`); }
  }
  for (const img of doc.querySelectorAll('img')) {
    imgs++;
    if (!img.hasAttribute('alt')) { fail(`${f}: img senza alt`); continue; }
    // l'immagine del lightbox è vuota finché non si apre: src e alt arrivano dall'elemento cliccato (data-alt)
    if (!img.getAttribute('src') && img.closest('dialog') && img.hasAttribute('data-lb-img')) continue;
    const decorative = img.getAttribute('aria-hidden') === 'true' || (img.getAttribute('class') ?? '').includes('sketch-mark') || img.closest('[aria-hidden="true"]');
    if (!decorative) { photos++; if ((img.getAttribute('alt') ?? '').trim().length < 12) fail(`${f}: alt non descrittivo «${img.getAttribute('alt')}» ${img.getAttribute('src')}`); }
  }
}
if (!avif || !webp) fail(`sorgenti AVIF ${avif} / WebP ${webp}`);
console.log(`img ${imgs}, informative ${photos}, file immagine verificati ${checkedFiles.size}, sorgenti avif ${avif}, webp ${webp}, esterne ${external}`);
if (!process.exitCode) console.log('DIST IMAGES VERIFIED');
