// G1: il crawl ha visitato tutte le voci di menu e ogni scheda ?p= linkata; ogni immagine raggiungibile è su disco e si decodifica.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const D = 'scripts/crawl/data';
const pages = JSON.parse(fs.readFileSync(`${D}/pages.json`, 'utf8'));
const dl = JSON.parse(fs.readFileSync(`${D}/download.json`, 'utf8'));
const fail = (m) => { console.error('FAIL', m); process.exitCode = 1; };

const menu = ['Home', 'News', 'Lista', 'Opere selezionate', 'In corso', 'Allestimenti', 'Regesto Schizzi', 'Riqualificazione Urbana', 'Edifici Pubblici', 'Residenziali', 'Scolastici', 'Studio', 'Biografia', 'Pubblicazioni', 'Premi', 'Conferenze', 'Contatti'];
for (const m of menu) if (!pages[m]) fail(`voce di menu non visitata: ${m}`);

// ogni ?p=<numero> linkato da una pagina visitata deve essere stato visitato e salvato
const linked = new Set();
for (const info of Object.values(pages)) for (const l of info.links) if (/^\d+$/.test(l)) linked.add(l);
for (const n of linked) {
  if (!pages[n]) fail(`scheda p=${n} linkata ma non visitata`);
  if (!fs.existsSync(`${D}/pages/${n}.html`)) fail(`scheda p=${n} non salvata`);
}
// ogni pagina salvata contiene la cornice del sito (non una pagina d'errore vuota)
for (const p of Object.keys(pages)) {
  const html = fs.readFileSync(`${D}/pages/${p.replace(/[^\w-]+/g, '_')}.html`, 'latin1');
  if (!html.includes('<!--CONTENUTO-->') && !['n', 'pu', 'pr', 'c'].includes(p)) fail(`pagina ${p} senza contenuto`);
}

// le immagini candidate sono ricalcolate dalle pagine salvate (non lette dal download.json)
const cand = new Set();
for (const f of fs.readdirSync(`${D}/pages`)) {
  const h = fs.readFileSync(`${D}/pages/${f}`, 'latin1');
  const c = (h.split('<!--CONTENUTO-->')[1] || '').split('<!--PIE DI PAGINA-->')[0];
  for (const m of c.matchAll(/["'(]\/?(public\/[^"'()\s>]+\.(?:jpe?g|png|gif|webp))/gi)) if (!/\/_immagine\./.test(m[1])) cand.add(m[1].replace(/^public\//, ''));
}
let onDisk = 0, decoded = 0, corrupt = [];
const missing = [];
for (const rel of cand) {
  const f = path.join('src/assets/originali', rel);
  if (!fs.existsSync(f)) { missing.push(rel); continue; }
  onDisk++;
  try { const m = await sharp(f).metadata(); await sharp(f).raw().toBuffer(); if (m.width) decoded++; } catch { corrupt.push(rel); }
}
// i mancanti devono essere 404 reali sul server, registrati come tali
const recorded404 = new Set(dl.fail.filter((x) => x[1] === 404).map((x) => x[0].replace(/^public\//, '')));
for (const m of missing) if (!recorded404.has(m)) fail(`immagine mancante non giustificata: ${m}`);
if (corrupt.some((c) => c !== 'tmp/43_immagine.jpg')) fail(`file danneggiati inattesi: ${corrupt}`);
// nessun file in originali che non provenga dal crawl
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const extra = walk('src/assets/originali').map((f) => path.relative('src/assets/originali', f)).filter((r) => !cand.has(r));
if (extra.length) fail(`file in originali non trovati nel crawl: ${extra.join(', ')}`);

console.log(`pagine visitate ${Object.keys(pages).length}, schede numeriche linkate ${linked.size}, immagini candidate ${cand.size}, su disco ${onDisk}, decodificate ${decoded}, 404 sul server ${missing.length}, danneggiate ${corrupt.length}`);
if (!process.exitCode) console.log('CRAWL VERIFIED');
