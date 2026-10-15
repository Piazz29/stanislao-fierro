// Genera src/content/projects/*.yaml e images-map.json a partire dal crawl e dal registro.
// Uso: node scripts/crawl/gen-content.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import YAML from 'yaml';
import { projects, manualTypes, captionTypes, reveals } from './registry.mjs';
import { dhash, hamming, patchNCC, DHASH_SAME, NCC_SAME } from './match.mjs';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'scripts/crawl/data');
const ORIG = path.join(ROOT, 'src/assets/originali');
const OUT = path.join(ROOT, 'src/content/projects');
const pages = JSON.parse(fs.readFileSync(path.join(DATA, 'pages.json'), 'utf8'));
const extracted = JSON.parse(fs.readFileSync(path.join(DATA, 'extracted.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(DATA, 'meta.json'), 'utf8'));
const ALTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/crawl/alts.json'), 'utf8'));
const download = JSON.parse(fs.readFileSync(path.join(DATA, 'download.json'), 'utf8'));

// Il sito dichiara iso-8859-1 ma usa caratteri windows-1252 (virgolette tipografiche).
const CP1252 = { 0x80: '€', 0x85: '…', 0x91: '’', 0x92: '’', 0x93: '“', 0x94: '”', 0x96: '–', 0x97: '–' };
const fix = (s) => s.replace(/[\u0080-\u009f]/g, (c) => CP1252[c.charCodeAt(0)] ?? '').replace(/\\+(["'])/g, '$1').replace(/\s+/g, ' ').trim();
const num = (rel) => Number(path.basename(rel).split('_')[0]);
const siteUrl = (p) => `https://www.stanislaofierro.com/index.php?p=${encodeURIComponent(p)}&lang=it`;

// Pagine di provenienza per ogni file.
const sources = {};
for (const [p, info] of Object.entries(pages)) for (const img of info.imgs) (sources[img.replace(/^public\//, '')] ??= []).push(p);

const pageToProject = {};
for (const pr of projects) for (const p of pr.pages) pageToProject[String(p)] = pr.slug;

// Tipo: manuale > didascalia del sito > euristica (quota di pixel quasi bianchi).
async function whiteShare(file) {
  const { data } = await sharp(file).greyscale().resize(64, 64, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  let w = 0; for (const v of data) if (v > 232) w++;
  return w / data.length;
}
const CAPTIONS = {
  'sezione lungitudinale': { it: 'Sezione longitudinale', de: 'Längsschnitt', en: 'Longitudinal section' },
  'sezione trasversale': { it: 'Sezione trasversale', de: 'Querschnitt', en: 'Cross section' },
  'sezione': { it: 'Sezione', de: 'Schnitt', en: 'Section' },
  'planimetria': { it: 'Planimetria', de: 'Lageplan', en: 'Site plan' },
  'pianta': { it: 'Pianta', de: 'Grundriss', en: 'Plan' },
  'piante': { it: 'Piante', de: 'Grundrisse', en: 'Plans' },
  'planimetria livello 0': { it: 'Planimetria, livello 0', de: 'Lageplan, Ebene 0', en: 'Site plan, level 0' },
  'planimetria alto': { it: 'Planimetria, livello superiore', de: 'Lageplan, obere Ebene', en: 'Site plan, upper level' },
  'fotopiano': { it: 'Fotopiano', de: 'Luftbild', en: 'Aerial photograph' },
  'foto al plastico': { it: 'Foto del plastico', de: 'Modellfoto', en: 'Model photograph' },
  'primo schizzo': { it: 'Primo schizzo', de: 'Erste Skizze', en: 'First sketch' },
  'schizzo di progetto': { it: 'Schizzo di progetto', de: 'Entwurfsskizze', en: 'Design sketch' },
  'vista': { it: 'Vista', de: 'Ansicht', en: 'View' },
};

async function typeOf(rel, caption) {
  const n = num(rel);
  if (rel.startsWith('pagine/foto/') && manualTypes[n]) return { tipo: manualTypes[n], fonte: 'manuale (provino)' };
  if (caption) for (const [re, t] of captionTypes) if (re.test(caption)) return { tipo: t, fonte: `didascalia del sito: «${caption}»` };
  const ws = await whiteShare(path.join(ORIG, rel));
  return ws > 0.45
    ? { tipo: 'disegno', fonte: `euristica: ${(ws * 100).toFixed(0)}% pixel quasi bianchi` }
    : { tipo: 'immagine', fonte: `euristica: foto o rendering non distinguibili (${(ws * 100).toFixed(0)}% pixel bianchi)` };
}

// Estratto dalla relazione di progetto del sito, nella sua lingua originale.
const STOP = {
  it: [' il ', ' della ', ' che ', ' per ', ' una ', ' delle ', ' con ', ' del '],
  de: [' der ', ' die ', ' und ', ' das ', ' mit ', ' wird ', ' den ', ' ist '],
  es: [' el ', ' los ', ' las ', ' del ', ' que ', ' con ', ' una ', ' por '],
};
function detect(s) {
  const t = ` ${s.toLowerCase()} `;
  let best = 'it', score = -1;
  for (const [l, ws] of Object.entries(STOP)) { const c = ws.reduce((a, w) => a + t.split(w).length - 1, 0); if (c > score) { score = c; best = l; } }
  return best;
}
function excerptOf(pr) {
  for (const p of pr.pages) {
    const des = (extracted[String(p)]?.des ?? []).map(fix);
    const para = des.slice(1).find((d) => d.length > 220) ?? null;
    if (!para) continue;
    let t = para.replace(/^(l\s?)?(idea|lettura dei caratteri[^.]*|concetto urbanistico|la idea|projekt|onzept der dorfgestaltung|obiettivi|städtebau)\s+/i, '');
    if (t.length > 640) { const cut = t.slice(0, 640); t = cut.slice(0, Math.max(cut.lastIndexOf('. '), 300) + 1); }
    // niente lineette lunghe: il sito non le usa come incisi, normalizziamo
    t = t.replace(/\s[–—]\s/g, ', ');
    return { lang: detect(t), text: t, source: siteUrl(p) };
  }
  return null;
}

// Varianti ad alta risoluzione dello slideshow home: stessa immagine, misurata.
const HOME = fs.readdirSync(path.join(ORIG, 'home')).map((f) => `home/${f}`);
const homeHashes = {};
for (const h of HOME) homeHashes[h] = await dhash(path.join(ORIG, h));
const homeMatches = {}; // home file -> { target, evidence }

const map = {};
const projectDocs = [];

for (const pr of projects) {
  const gallery = [];
  const seen = new Set();
  const hashesInProject = {};
  for (const p of pr.pages) {
    const ex = extracted[String(p)];
    if (!ex) throw new Error(`pagina ${p} assente dal crawl`);
    for (let i = 0; i < ex.mainImgs.length; i++) {
      const rel = ex.mainImgs[i].replace(/^public\//, '');
      if (seen.has(rel)) continue; seen.add(rel);
      if (!download.ok.includes(rel)) continue;
      const rawCap = fix(ex.des[i] ?? '');
      const cap = rawCap.length < 40 && !/^\d+$/.test(rawCap) ? rawCap.toLowerCase() : '';
      const { tipo, fonte } = await typeOf(rel, cap);
      const m = meta[rel];
      // cerca una versione ad alta risoluzione della stessa immagine nello slideshow
      let src = rel;
      const h = await dhash(path.join(ORIG, rel));
      // stesso file pubblicato due volte nella stessa opera (es. scheda e Regesto Schizzi): una sola volta in galleria
      const dup = Object.entries(hashesInProject).find(([, hh]) => hamming(h, hh) === 0);
      if (dup && meta[dup[0]].w === m.w && meta[dup[0]].h === m.h) {
        map[rel] = { pagine: (sources[rel] ?? []).map(siteUrl), progetto: pr.slug, tipo: map[dup[0]].tipo, tipoFonte: `come ${dup[0]}`, attribuzione: `immagine della scheda ${siteUrl(p)}`, larghezza: m.w, altezza: m.h, note: `duplicato identico di ${dup[0]}: mostrato una sola volta` };
        continue;
      }
      hashesInProject[rel] = h;
      for (const hm of HOME) {
        const d = hamming(h, homeHashes[hm]);
        if (d <= DHASH_SAME && meta[hm].w > m.w) { src = hm; homeMatches[hm] = { target: rel, evidence: `dHash ${d}/256 con ${rel}` }; }
      }
      const item = { image: `../../assets/originali/${src}`, type: tipo };
      if (CAPTIONS[cap]) item.caption = CAPTIONS[cap];
      if (ALTS[String(num(rel))]) item.alt = ALTS[String(num(rel))];
      if (pr.photographer && tipo === 'foto' && !['pagine/foto/498_immagine.jpg'].includes(rel)) item.credit = pr.photographer;
      gallery.push(item);
      map[rel] = {
        pagine: (sources[rel] ?? []).map(siteUrl), progetto: pr.slug, tipo, tipoFonte: fonte,
        attribuzione: `immagine della scheda ${siteUrl(p)}`, larghezza: m.w, altezza: m.h,
        ...(src !== rel ? { versioneUsata: src } : {}),
      };
    }
  }
  projectDocs.push({ pr, gallery });
}

// Render notturno della home: ritaglio di pagine/foto/465 (Magnago), verificato con NCC.
const nightNcc = await patchNCC(path.join(ORIG, 'home/1494000674_immagine.jpg'), path.join(ORIG, 'pagine/foto/465_immagine.jpg'));
if (nightNcc.ncc >= NCC_SAME) homeMatches['home/1494000674_immagine.jpg'] = { target: 'pagine/foto/465_immagine.jpg', evidence: `NCC ${nightNcc.ncc.toFixed(3)} (ritaglio) con pagine/foto/465_immagine.jpg` };

// Copertine: prima foto, poi rendering, poi la prima immagine.
const COVER = { 'piazza-silvius-magnago': 'home/1494000674_immagine.jpg', 'centro-formazione-baza': 'pagine/foto/506_immagine.jpg', 'piazza-tribunale': 'pagine/foto/449_immagine.jpg', 'piazza-universita': 'home/1493912858_immagine.jpg', 'piazza-indipendenza-torre-di-mosto': 'pagine/foto/256_immagine.jpg', 'centro-luson': 'pagine/foto/94_immagine.jpg' };

// Testi descrittivi (brevi, sobri) solo dove i fatti sono documentati.
const TEXTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/crawl/texts.json'), 'utf8'));

fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.yaml')) fs.rmSync(path.join(OUT, f));
for (const { pr, gallery } of projectDocs) {
  // la variante notturna sostituisce 465 nella galleria Magnago
  if (pr.slug === 'piazza-silvius-magnago' && homeMatches['home/1494000674_immagine.jpg']) {
    const g = gallery.find((x) => x.image.endsWith('465_immagine.jpg'));
    if (g) g.image = '../../assets/originali/home/1494000674_immagine.jpg';
    map['pagine/foto/465_immagine.jpg'].versioneUsata = 'home/1494000674_immagine.jpg';
  }
  const pick = (t) => gallery.find((g) => g.type === t);
  const coverRel = COVER[pr.slug];
  const cover = coverRel ? `../../assets/originali/${coverRel}` : (pick('foto') ?? pick('rendering') ?? pick('immagine') ?? gallery[0])?.image;
  const sketch = pick('schizzo')?.image;
  const ex = excerptOf(pr);
  // coppia schizzo/foto: ogni immagine deve essere già nella galleria certa del progetto (eventualmente nella versione ad alta risoluzione)
  let reveal = null;
  if (reveals[pr.slug]) {
    const pick2 = (rel) => {
      const used = map[rel]?.versioneUsata ?? rel;
      if (map[rel]?.progetto !== pr.slug || !gallery.some((g) => g.image.endsWith(used))) throw new Error(`reveal ${pr.slug}: ${rel} non appartiene alla galleria`);
      return { image: `../../assets/originali/${used}`, alt: ALTS[String(num(rel))] };
    };
    const sk = pick2(reveals[pr.slug].sketch), ph = pick2(reveals[pr.slug].photo);
    if (map[reveals[pr.slug].sketch].tipo !== 'schizzo' || map[reveals[pr.slug].photo].tipo !== 'foto') throw new Error(`reveal ${pr.slug}: tipi non validi`);
    reveal = { sketch: sk.image, sketchAlt: sk.alt, photo: ph.image, photoAlt: ph.alt, ...(pr.photographer ? { credit: pr.photographer } : {}) };
  }
  const doc = {
    title: pr.title, ...(pr.subtitle ? { subtitle: pr.subtitle } : {}),
    year: pr.year, place: pr.place, typology: pr.typology, status: pr.status, international: pr.international,
    featured: !!pr.featured, order: pr.order ?? 100,
    ...(pr.competition ? { competition: pr.competition } : {}),
    ...(pr.built ? { built: pr.built } : {}), ...(pr.area ? { area: pr.area } : {}),
    ...(pr.client ? { client: pr.client } : {}),
    ...(pr.partners ? { partners: pr.partners } : {}), ...(pr.collaborators ? { collaborators: pr.collaborators } : {}),
    ...(pr.awards ? { awards: pr.awards } : {}), ...(pr.press ? { press: pr.press } : {}),
    ...(pr.photographer ? { photographer: pr.photographer } : {}),
    ...(TEXTS[pr.slug] ? { text: TEXTS[pr.slug] } : {}),
    ...(ex ? { excerpt: ex } : {}),
    ...(cover ? { cover } : {}), ...(sketch ? { sketch } : {}),
    ...(reveal ? { reveal } : {}),
    sourcePages: pr.pages.map((p) => siteUrl(p)),
    gallery,
  };
  fs.writeFileSync(path.join(OUT, `${pr.slug}.yaml`), `# Fonte: ${pr.pages.length ? pr.pages.map((p) => siteUrl(p)).join(', ') : 'brief del cliente (nessuna scheda sul sito attuale)'}\n` + YAML.stringify(doc, { lineWidth: 0, aliasDuplicateObjects: false }));
}

// Voci non ancora mappate: home, miniature elenchi, news, pagine Info, Regesto Schizzi.
for (const rel of download.ok) {
  if (map[rel]) continue;
  const m = meta[rel] ?? {};
  const base = { pagine: (sources[rel] ?? []).map(siteUrl), larghezza: m.w ?? null, altezza: m.h ?? null };
  if (m.err) { map[rel] = { ...base, progetto: null, tipo: 'file danneggiato', tipoFonte: 'decodifica fallita', attribuzione: null, note: 'JPEG troncato sul server: non usato' }; continue; }
  if (rel.startsWith('home/')) {
    const hm = homeMatches[rel];
    const target = hm && map[hm.target];
    map[rel] = { ...base, progetto: target ? target.progetto : null, tipo: target ? target.tipo : 'foto', tipoFonte: target ? `come ${hm.target}` : 'manuale (provino)', attribuzione: hm ? hm.evidence : null, ...(hm ? {} : { note: 'nessuna corrispondenza in una scheda: solo slideshow home, senza attribuzione' }) };
    continue;
  }
  if (rel.startsWith('tmp/')) {
    const n = String(num(rel)); const slug = pageToProject[n] ?? null;
    map[rel] = { ...base, progetto: slug, tipo: 'miniatura', tipoFonte: 'cartella /public/tmp/ degli elenchi', attribuzione: slug ? `miniatura linkata a ${siteUrl(n)} negli elenchi` : null, ...(slug ? {} : { note: n === '79' ? 'scheda segnaposto «progetto it» senza contenuti' : 'scheda non registrata' }) };
    continue;
  }
  if (rel.startsWith('pagine/foto/')) {
    // immagini delle schede del Regesto Schizzi (pagine schizzo dei progetti già unite) o non registrate
    const pg = (sources[rel] ?? [])[0]; const slug = pageToProject[pg] ?? null;
    const { tipo, fonte } = await typeOf(rel, '');
    map[rel] = { ...base, progetto: slug, tipo, tipoFonte: fonte, attribuzione: slug ? `immagine della scheda ${siteUrl(pg)}` : null };
    continue;
  }
  const fixed = {
    'altro/studio.jpg': ['studio', 'pagina Studio'], 'altro/biografia.jpg': ['ritratto', 'pagina Biografia'], 'altro/contatti.jpg': ['mappa', 'pagina Contatti'],
    'news/10_immagine.jpg': ['copertina', 'news: Premio Barbara Capocchin'], 'news/9_immagine.jpg': ['copertina', 'news: Casabella n. 873'], 'news/8_immagine.jpg': ['locandina', 'news: conferenza «Invarianti»'],
    'pubblicazioni/3_immagine.jpg': ['immagine', 'scheda pubblicazione senza titolo («titolo It»)'], 'premi/5_immagine.jpg': ['schizzo', 'scheda premio senza titolo («titolo It»)'], 'conferenze/6_immagine.jpg': ['immagine', 'scheda conferenza senza titolo («titolo It»): campo giallo uniforme'],
  }[rel];
  map[rel] = { ...base, progetto: null, tipo: fixed ? fixed[0] : 'immagine', tipoFonte: 'manuale (provino)', attribuzione: null, note: fixed ? fixed[1] : 'non classificata' };
}

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b, 'it', { numeric: true })));
fs.writeFileSync(path.join(ROOT, 'images-map.json'), JSON.stringify({
  generato: 'scripts/crawl/gen-content.mjs',
  fonte: 'https://www.stanislaofierro.com (crawl con &lang=it)',
  totale: Object.keys(sorted).length,
  immagini: sorted,
}, null, 2));
const attributed = Object.values(sorted).filter((v) => v.progetto).length;
console.log('progetti', projectDocs.length, 'immagini', Object.keys(sorted).length, 'attribuite', attributed, 'NCC notturna', nightNcc.ncc.toFixed(3));
