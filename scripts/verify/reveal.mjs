// G12: il confronto schizzo/costruito è nelle quattro schede in tre lingue (la home racconta il processo a parte), costruito solo con
// immagini attribuite a quell'opera (schizzo e foto), esposto come slider etichettato da tastiera.
import fs from 'node:fs';
import path from 'node:path';
import { urlOf, load, fail, LANGS } from './lib.mjs';
import { reveals } from '../crawl/registry.mjs';
const map = JSON.parse(fs.readFileSync('images-map.json', 'utf8')).immagini;
const expected = { 'centro-formazione-baza': reveals['centro-formazione-baza'], 'piazza-tribunale': reveals['piazza-tribunale'], 'piazza-universita': reveals['piazza-universita'], 'centro-luson': reveals['centro-luson'] };
const usedName = (rel) => path.basename(map[rel]?.versioneUsata ?? rel).replace(/\.jpg$/, '');
let checked = 0;
function inspect(u, slug) {
  const p = load(u);
  if (!p) return fail(`assente ${u}`);
  const figs = p.doc.querySelectorAll('[data-reveal]');
  if (figs.length !== 1) return fail(`${u}: ${figs.length} confronti invece di 1`);
  const f = figs[0];
  const h = f.querySelector('[role="slider"]');
  if (!h || h.getAttribute('tabindex') !== '0' || !h.getAttribute('aria-label') || h.getAttribute('aria-valuemin') !== '0' || h.getAttribute('aria-valuemax') !== '100' || !h.getAttribute('aria-valuetext')) fail(`${u}: slider senza attributi ARIA completi`);
  const imgs = f.querySelectorAll('img');
  if (imgs.length !== 2) return fail(`${u}: ${imgs.length} immagini`);
  const pair = expected[slug];
  const names = imgs.map((i) => path.basename(i.getAttribute('src')).split('.')[0]);
  const want = [usedName(pair.photo), usedName(pair.sketch)];
  if (names.join() !== want.join()) fail(`${u}: immagini ${names} invece di ${want}`);
  if (map[pair.sketch].progetto !== slug || map[pair.photo].progetto !== slug) fail(`${u}: coppia non attribuita a ${slug}`);
  if (map[pair.sketch].tipo !== 'schizzo' || map[pair.photo].tipo !== 'foto') fail(`${u}: tipi ${map[pair.sketch].tipo}/${map[pair.photo].tipo}`);
  for (const i of imgs) if ((i.getAttribute('alt') ?? '').length < 20) fail(`${u}: alt corto`);
  for (const s of f.querySelectorAll('source')) if (!/^\/_astro\//.test(s.getAttribute('srcset'))) fail(`${u}: sorgente fuori pipeline`);
  checked++;
}
for (const l of LANGS) {
  for (const slug of Object.keys(expected)) inspect(urlOf(l, 'works', slug), slug);
  // controllo negativo: una scheda senza coppia non deve averne
  const m = load(urlOf(l, 'works', 'piazza-silvius-magnago'));
  if (m.doc.querySelectorAll('[data-reveal]').length) fail(`${l}: Magnago non dovrebbe avere il confronto`);
}
console.log(`confronti verificati ${checked}`);
if (!process.exitCode) console.log('REVEAL MARKUP VERIFIED');
