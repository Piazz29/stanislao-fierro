// G2: images-map.json copre ogni file scaricato; ogni attribuzione a un progetto è dimostrata
// dalla lista immagini della scheda, dal link della miniatura o da un confronto pixel rimisurato.
import fs from 'node:fs';
import path from 'node:path';
import { projects } from '../crawl/registry.mjs';
import { dhash, hamming, patchNCC, DHASH_SAME, NCC_SAME } from '../crawl/match.mjs';
const O = 'src/assets/originali';
const map = JSON.parse(fs.readFileSync('images-map.json', 'utf8')).immagini;
const ex = JSON.parse(fs.readFileSync('scripts/crawl/data/extracted.json', 'utf8'));
const fail = (m) => { console.error('FAIL', m); process.exitCode = 1; };
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(O).map((f) => path.relative(O, f));
const pagesOf = Object.fromEntries(projects.map((p) => [p.slug, p.pages.map(String)]));
const lista = fs.readFileSync('scripts/crawl/data/pages/Lista.html', 'latin1') + fs.readFileSync('scripts/crawl/data/pages/Regesto_Schizzi.html', 'latin1') + fs.readFileSync('scripts/crawl/data/pages/Opere_selezionate.html', 'latin1');

let attributed = 0, viaPage = 0, viaThumb = 0, viaPixel = 0;
for (const f of files) {
  const e = map[f];
  if (!e) { fail(`manca in images-map: ${f}`); continue; }
  for (const k of ['pagine', 'progetto', 'tipo']) if (!(k in e)) fail(`${f}: campo ${k} mancante`);
  if (!e.pagine.length) fail(`${f}: nessuna pagina di provenienza`);
  if (!e.progetto) continue;
  attributed++;
  if (!pagesOf[e.progetto]) { fail(`${f}: progetto sconosciuto ${e.progetto}`); continue; }
  if (f.startsWith('pagine/foto/')) {
    const ok = pagesOf[e.progetto].some((p) => (ex[p]?.mainImgs ?? []).includes(`public/${f}`));
    if (!ok) fail(`${f}: non compare in nessuna scheda di ${e.progetto}`); else viaPage++;
  } else if (f.startsWith('tmp/')) {
    const n = path.basename(f).split('_')[0];
    const re = new RegExp(`href="\\?p=${n}"[\\s\\S]{0,200}?public/tmp/${n}_immagine\\.jpg`);
    if (!pagesOf[e.progetto].includes(n) || !re.test(lista)) fail(`${f}: link miniatura → p=${n} non dimostrato per ${e.progetto}`); else viaThumb++;
  } else if (f.startsWith('home/')) {
    // rimisura: dHash o NCC contro un'immagine della scheda del progetto
    const target = e.attribuzione?.match(/(pagine\/foto\/\d+_immagine\.jpg)/)?.[1];
    if (!target || !pagesOf[e.progetto].some((p) => (ex[p]?.mainImgs ?? []).includes(`public/${target}`))) { fail(`${f}: bersaglio del confronto non nella scheda`); continue; }
    const d = hamming(await dhash(path.join(O, f)), await dhash(path.join(O, target)));
    const ok = d <= DHASH_SAME || (await patchNCC(path.join(O, f), path.join(O, target))).ncc >= NCC_SAME;
    if (!ok) fail(`${f}: confronto pixel con ${target} non superato`); else viaPixel++;
  } else fail(`${f}: attribuito ma fuori dalle cartelle attribuibili`);
}
// controllo negativo: due foto diverse della stessa piazza NON devono superare la soglia
const neg = await patchNCC(path.join(O, 'home/1493913394_immagine.jpg'), path.join(O, 'pagine/foto/495_immagine.jpg'));
const negD = hamming(await dhash(path.join(O, 'home/1493913394_immagine.jpg')), await dhash(path.join(O, 'pagine/foto/495_immagine.jpg')));
if (neg.ncc >= NCC_SAME || negD <= DHASH_SAME) fail(`controllo negativo superato per errore (ncc ${neg.ncc}, dhash ${negD})`);
for (const k of Object.keys(map)) if (!files.includes(k)) fail(`voce senza file: ${k}`);
console.log(`file ${files.length}, voci ${Object.keys(map).length}, attribuite ${attributed} (scheda ${viaPage}, miniatura ${viaThumb}, pixel ${viaPixel}); controllo negativo ncc ${neg.ncc.toFixed(3)} dhash ${negD}`);
if (!process.exitCode) console.log('IMAGES MAP VERIFIED');
