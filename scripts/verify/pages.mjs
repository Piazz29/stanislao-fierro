// G4: 7 pagine in 3 lingue + scheda Magnago in 3 lingue, ciascuna con SEO completo.
import fs from 'node:fs';
import path from 'node:path';
import { LANGS, ROUTES, urlOf, load, fail, DIST } from './lib.mjs';
const SITE = 'https://www.stanislaofierro.com';
const HTML_LANG = { it: 'it-IT', de: 'de-IT', en: 'en' };
const targets = [];
for (const l of LANGS) {
  for (const k of Object.keys(ROUTES)) targets.push({ l, k });
  targets.push({ l, k: 'works', slug: 'piazza-silvius-magnago' });
}
let checked = 0;
for (const t of targets) {
  const u = urlOf(t.l, t.k, t.slug);
  const p = load(u);
  if (!p) { fail(`pagina assente ${u}`); continue; }
  const d = p.doc;
  const title = d.querySelector('title')?.text.trim();
  const desc = d.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  const canon = d.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const og = d.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '';
  const lang = d.querySelector('html')?.getAttribute('lang');
  if (!title || title.length < 10) fail(`${u}: title`);
  if (desc.length < 50 || desc.length > 300) fail(`${u}: meta description lunga ${desc.length}`);
  if (canon !== SITE + u) fail(`${u}: canonical ${canon}`);
  if (lang !== HTML_LANG[t.l]) fail(`${u}: html lang ${lang}`);
  const alts = Object.fromEntries(d.querySelectorAll('link[rel="alternate"]').map((a) => [a.getAttribute('hreflang'), a.getAttribute('href')]));
  for (const l of LANGS) if (alts[l] !== SITE + urlOf(l, t.k, t.slug)) fail(`${u}: hreflang ${l} = ${alts[l]}`);
  if (alts['x-default'] !== SITE + urlOf('it', t.k, t.slug)) fail(`${u}: x-default`);
  // ogni alternate deve esistere davvero nella build
  for (const l of LANGS) if (!load(urlOf(l, t.k, t.slug))) fail(`${u}: alternate ${l} non generata`);
  if (!og.startsWith(SITE + '/og/') || !fs.existsSync(path.join(DIST, og.slice(SITE.length)))) fail(`${u}: og:image ${og}`);
  if (!d.querySelector('meta[property="og:title"]') || !d.querySelector('meta[property="og:locale"]')) fail(`${u}: og:title/locale`);
  if (!d.querySelector('h1')) fail(`${u}: nessun h1`);
  checked++;
}
// titoli e descrizioni unici per lingua
const seen = new Map();
for (const t of targets) { const p = load(urlOf(t.l, t.k, t.slug)); if (!p) continue; const k = p.doc.querySelector('title')?.text; if (seen.has(k)) fail(`title duplicato: ${k}`); seen.set(k, 1); }
console.log(`pagine controllate ${checked}/${targets.length}`);
if (!process.exitCode) console.log('PAGES VERIFIED');
