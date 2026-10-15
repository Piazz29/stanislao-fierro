// Genera simbolo (favicon, icone) e immagini di condivisione Open Graph 1200x630 per ogni pagina e lingua.
// Le immagini sono impaginate come una tavola del sito: calce, griglia, cartiglio, quadratino porfido.
// Uso: node scripts/brand/og.mjs            (tutto)
//      node scripts/brand/og.mjs --only it/home,de/werke/centro-formazione-baza   (prova)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import YAML from 'yaml';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public');
const oi = process.argv.indexOf('--only');
const only = (oi > -1 ? process.argv[oi + 1] ?? '' : (process.argv.find((a) => a.startsWith('--only=')) ?? '').slice(7)).split(',').filter(Boolean);

const C = { calce: '#f7f5f0', carbone: '#1e1c19', porfido: '#8f3e2c', grigio: '#6b665e', linea: '#e3dfd6' };
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(OUT, 'fonts/archivo-latin-wdth-normal.woff2')).toString('base64');
const fontExt = 'data:font/woff2;base64,' + fs.readFileSync(path.join(OUT, 'fonts/archivo-latin-ext-wdth-normal.woff2')).toString('base64');
const uri = async (rel, max = 1240) => {
  const f = path.join(ROOT, 'src/assets/originali', rel);
  const buf = await sharp(f).resize({ width: max, withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer();
  const m = await sharp(buf).metadata();
  return { src: `data:image/jpeg;base64,${buf.toString('base64')}`, w: m.width, h: m.height };
};
const relOf = (p) => (p ? p.replace('../../assets/originali/', '') : null);

const T = {
  role: { it: 'Architetto · Bolzano', de: 'Architekt · Bozen', en: 'Architect · Bolzano' },
  studio: { it: 'Stanislao Fierro Architetto', de: 'Stanislao Fierro Architekt', en: 'Stanislao Fierro Architect' },
  sections: {
    works: { it: 'Opere', de: 'Werke', en: 'Works' },
    competitions: { it: 'Concorsi', de: 'Wettbewerbe', en: 'Competitions' },
    sketches: { it: 'Schizzi', de: 'Skizzen', en: 'Sketches' },
    studio: { it: 'Studio', de: 'Studio', en: 'Studio' },
    contact: { it: 'Contatti', de: 'Kontakt', en: 'Contact' },
  },
  sub: {
    home: { it: 'Piazze, basamenti, vuoti urbani.', de: 'Plätze, Sockel, städtische Leerräume.', en: 'Squares, plinths, urban voids.' },
    works: { it: '54 opere e progetti, 2000–2017', de: '54 Werke und Projekte, 2000–2017', en: '54 works and projects, 2000–2017' },
    competitions: { it: 'Registro dei concorsi dal 1992', de: 'Wettbewerbsverzeichnis seit 1992', en: 'Register of competitions since 1992' },
    sketches: { it: 'Dallo schizzo alla costruzione', de: 'Von der Skizze zum Bau', en: 'From sketch to construction' },
    studio: { it: 'IUAV Venezia · Bolzano', de: 'IUAV Venedig · Bozen', en: 'IUAV Venice · Bolzano' },
    contact: { it: 'Via Montello 3, 39100 Bolzano', de: 'Montellostraße 3, 39100 Bozen', en: 'Via Montello 3, 39100 Bolzano' },
  },
  photo: { it: 'Foto', de: 'Foto', en: 'Photo' },
  render: { it: 'Rendering di concorso', de: 'Wettbewerbsvisualisierung', en: 'Competition rendering' },
  sketch: { it: 'Schizzo', de: 'Skizze', en: 'Sketch' },
  type: {
    'spazi-pubblici': { it: 'Spazi pubblici', de: 'Öffentliche Räume', en: 'Public spaces' },
    'edifici-pubblici': { it: 'Edifici pubblici', de: 'Öffentliche Bauten', en: 'Public buildings' },
    residenziale: { it: 'Residenziale', de: 'Wohnbau', en: 'Housing' },
    scuole: { it: 'Scuole', de: 'Schulen', en: 'Schools' },
    allestimenti: { it: 'Allestimenti', de: 'Ausstellungen', en: 'Exhibitions' },
  },
};
const SEG = { works: { it: 'opere', de: 'werke', en: 'works' }, competitions: { it: 'concorsi', de: 'wettbewerbe', en: 'competitions' }, sketches: { it: 'schizzi', de: 'skizzen', en: 'sketches' }, studio: { it: 'studio', de: 'studio', en: 'studio' }, contact: { it: 'contatti', de: 'kontakt', en: 'contact' } };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// simbolo: «SF» in basso a sinistra come il nome nella home, quadratino porfido in alto a destra
const mark = (s) => `<div style="position:relative;width:${s}px;height:${s}px;background:${C.carbone};overflow:hidden;flex:none">
  <span style="position:absolute;left:${s * 0.13}px;bottom:${s * 0.06}px;font-size:${s * 0.62}px;line-height:1;font-weight:560;font-stretch:72%;letter-spacing:-0.02em;color:${C.calce}">SF</span>
  <i style="position:absolute;right:${s * 0.13}px;top:${s * 0.13}px;width:${Math.max(2, Math.round(s * 0.16))}px;height:${Math.max(2, Math.round(s * 0.16))}px;background:${C.porfido}"></i></div>`;

const css = `
@font-face{font-family:Archivo;src:url(${font}) format('woff2');font-weight:100 900;font-stretch:62% 125%;unicode-range:U+0000-00FF,U+2000-206F,U+20AC}
@font-face{font-family:Archivo;src:url(${fontExt}) format('woff2');font-weight:100 900;font-stretch:62% 125%;unicode-range:U+0100-02BA,U+1E00-1E9F}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:${C.calce};font-family:Archivo;color:${C.carbone};position:relative;overflow:hidden}
.grid{position:absolute;inset:0 48px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:20px}
.grid span{border-left:1px solid ${C.linea};height:100%}.grid span:last-child{border-right:1px solid ${C.linea}}
.data{font-stretch:68%;font-weight:520;font-size:15px;letter-spacing:.06em;text-transform:uppercase}
.top{position:absolute;left:48px;right:48px;top:36px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:14px}
.brand b{font-weight:540;font-size:21px;letter-spacing:-.01em}
.sk{position:absolute;mix-blend-mode:multiply;opacity:.16}
.photo{position:absolute;display:block;object-fit:contain;outline:1px solid #cfcac0}
.box{position:absolute;border:1px solid #b9b3a8;background:${C.calce}}
.box .r{display:grid;grid-template-columns:150px 1fr;border-top:1px solid #d6d1c7}
.box .r:first-child{border-top:0}
.box .r>*{padding:8px 12px}
.box .r>:first-child{border-right:1px solid #d6d1c7;color:${C.grigio}}
.v{font-stretch:74%;font-weight:460;font-size:17px;letter-spacing:.01em}
.pin{display:inline-block;width:12px;height:12px;background:${C.porfido};margin-right:10px;vertical-align:1px}
`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="grid">${'<span></span>'.repeat(12)}</div>${body}</body></html>`;
const top = (lang, right = '') => `<div class="top"><div class="brand">${mark(40)}<b>Stanislao Fierro</b><span class="data" style="color:${C.grigio};margin-left:6px">${esc(T.role[lang])}</span></div><span class="data" style="color:${C.grigio}">${esc(right)}</span></div>`;

// immagine sulla destra della tavola, alla sua misura (mai ingrandita), allineata in basso
function placeRight(img, box = { x: 560, y: 108, w: 592, h: 474 }) {
  const s = Math.min(box.w / img.w, box.h / img.h, 1);
  const w = Math.round(img.w * s), h = Math.round(img.h * s);
  return { x: box.x + box.w - w, y: box.y + box.h - h, w, h };
}

async function cardHome(lang, img, sketch) {
  const p = placeRight(img);
  return page(`
    <img class="sk" src="${sketch.src}" style="left:30px;top:120px;width:560px">
    ${top(lang)}
    <img class="photo" src="${img.src}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px">
    <div style="position:absolute;left:48px;bottom:118px;font-weight:300;font-size:118px;line-height:.9;letter-spacing:-.035em">Stanislao<br>Fierro</div>
    <div class="data" style="position:absolute;left:52px;bottom:52px"><span class="pin"></span>${esc(T.sub.home[lang])}</div>
    <div class="data" style="position:absolute;right:48px;bottom:24px;color:${C.grigio};font-size:13px">Edificio de Formación y Empleo, Baza · ${T.photo[lang]} Fernando Alda</div>`);
}

async function cardSection(lang, key, img, caption, blend) {
  const p = placeRight(img);
  return page(`
    ${top(lang)}
    <img class="photo" src="${img.src}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;${blend ? 'mix-blend-mode:multiply;outline:0' : ''}">
    <div style="position:absolute;left:48px;bottom:118px;font-weight:300;font-size:112px;line-height:.92;letter-spacing:-.035em;max-width:540px">${esc(T.sections[key][lang])}</div>
    <div class="data" style="position:absolute;left:52px;bottom:52px"><span class="pin"></span>${esc(T.sub[key][lang])}</div>
    ${caption ? `<div class="data" style="position:absolute;right:48px;bottom:24px;color:${C.grigio};font-size:13px">${esc(caption)}</div>` : ''}`);
}

async function cardProject(lang, d, img) {
  const rows = [];
  rows.push([{ it: 'Luogo', de: 'Ort', en: 'Location' }[lang], d.place[lang]]);
  rows.push([{ it: 'Anno', de: 'Jahr', en: 'Year' }[lang], d.built ?? String(d.year)]);
  const rec = d.awards?.length ? d.awards[0][lang].split(',')[0] : d.competition?.result ? `${d.competition.result[lang]} ${d.competition.year}` : null;
  if (rec) rows.push([{ it: 'Riconoscimento', de: 'Auszeichnung', en: 'Recognition' }[lang], rec, true]);
  if (d.partners?.length) rows.push([{ it: 'Con', de: 'Mit', en: 'With' }[lang], d.partners[0].replace(/ \(.*\)$/, '')]);
  const title = d.title[lang];
  const size = title.length > 46 ? 46 : title.length > 30 ? 56 : 68;
  const box = { x: 520, y: 108, w: 632, h: 474 };
  const p = img ? placeRight(img.meta, box) : null;
  const credit = img?.credit ? ` · ${T.photo[lang]} ${img.credit}` : img?.kind === 'rendering' ? ` · ${T.render[lang]}` : '';
  return page(`
    ${top(lang, T.type[d.typology][lang])}
    ${p ? `<img class="photo" src="${img.meta.src}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;${img.kind === 'schizzo' ? 'mix-blend-mode:multiply;outline:0' : ''}">` : ''}
    <div style="position:absolute;left:48px;top:150px;width:${p ? 440 : 760}px;height:${rows.length > 3 ? 210 : 250}px" data-fit-box>
      <div lang="${lang}" data-fit style="font-weight:400;font-size:${size}px;line-height:1.02;letter-spacing:-.025em;hyphens:manual;overflow-wrap:normal">${esc(title)}</div>
    </div>
    <div class="box" style="left:48px;bottom:48px;width:${p ? 440 : 520}px">
      ${rows.map(([k, v, pin]) => `<div class="r"><span class="data">${esc(k)}</span><span class="v">${pin ? '<span class="pin" style="width:9px;height:9px;margin-right:8px"></span>' : ''}${esc(v)}</span></div>`).join('')}
    </div>
    ${p ? `<div class="data" style="position:absolute;right:48px;bottom:24px;color:${C.grigio};font-size:13px">${esc(d.place[lang] + credit)}</div>` : ''}`);
}

// ---------- elenco delle tavole ----------
const projects = fs.readdirSync(path.join(ROOT, 'src/content/projects')).filter((f) => f.endsWith('.yaml'))
  .map((f) => ({ slug: f.replace('.yaml', ''), d: YAML.parse(fs.readFileSync(path.join(ROOT, 'src/content/projects', f), 'utf8')) }));
const jobs = [];
const imgs = {
  home: await uri('home/1493912194_immagine.jpg'),
  sketch: await uri('pagine/foto/453_immagine.jpg'),
  works: await uri('pagine/foto/454_immagine.jpg'),
  competitions: await uri('pagine/foto/329_immagine.jpg'),
  sketches: await uri('pagine/foto/497_immagine.jpg'),
  studio: await uri('altro/biografia.jpg'),
  contact: await uri('../mappa-via-montello.jpg'),
};
const captions = {
  works: { it: `Piazza Silvius Magnago · ${T.render.it}`, de: `Silvius-Magnago-Platz · ${T.render.de}`, en: `Piazza Silvius Magnago · ${T.render.en}` },
  competitions: { it: 'Mausoleo di Augusto, Roma · schizzo di concorso', de: 'Augustusmausoleum, Rom · Wettbewerbsskizze', en: 'Mausoleum of Augustus, Rome · competition sketch' },
  sketches: { it: 'Baza, schizzo di sezione', de: 'Baza, Schnittskizze', en: 'Baza, section sketch' },
  studio: { it: 'Stanislao Fierro', de: 'Stanislao Fierro', en: 'Stanislao Fierro' },
  contact: { it: '© OpenStreetMap contributors', de: '© OpenStreetMap contributors', en: '© OpenStreetMap contributors' },
};
for (const lang of ['it', 'de', 'en']) {
  jobs.push({ key: `${lang}/home`, html: () => cardHome(lang, imgs.home, imgs.sketch) });
  for (const k of Object.keys(SEG)) jobs.push({ key: `${lang}/${SEG[k][lang]}`, html: () => cardSection(lang, k, imgs[k], captions[k][lang], k === 'competitions' || k === 'sketches') });
  for (const { slug, d } of projects) {
    jobs.push({
      key: `${lang}/${SEG.works[lang]}/${slug}`,
      html: async () => {
        const rel = relOf(d.cover) ?? relOf(d.sketch);
        if (!rel) return cardProject(lang, d, null);
        const g = d.gallery.find((x) => x.image.endsWith(rel));
        return cardProject(lang, d, { meta: await uri(rel), credit: g?.credit, kind: d.cover ? g?.type : 'schizzo' });
      },
    });
  }
}

const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const ctx = await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const pg = await ctx.newPage();
let n = 0;
for (const j of jobs) {
  if (only.length && !only.includes(j.key)) continue;
  await pg.setContent(await j.html(), { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  // riduce il corpo finché il titolo sta nella sua colonna (parole lunghe tedesche comprese)
  await pg.evaluate(() => {
    const t = document.querySelector('[data-fit]');
    if (!t) return;
    const box = t.parentElement;
    let fs = parseFloat(getComputedStyle(t).fontSize);
    const fits = () => t.scrollWidth <= box.clientWidth + 1 && t.scrollHeight <= box.clientHeight + 1 && [...t.getClientRects()].every((r) => r.right <= box.getBoundingClientRect().right + 1);
    while (!fits() && fs > 30) { fs -= 2; t.style.fontSize = fs + 'px'; }
  });
  const png = await pg.screenshot({ type: 'png' });
  const file = path.join(OUT, 'og', `${j.key}.jpg`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // sotto i 300 KB per l'anteprima di WhatsApp
  let q = 84, buf;
  do { buf = await sharp(png).jpeg({ quality: q, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer(); q -= 6; } while (buf.length > 280_000 && q > 50);
  fs.writeFileSync(file, buf);
  n++;
}

// ---------- simbolo: favicon e icone ----------
if (!only.length || only.includes('icons')) {
  const icon = async (s) => {
    await pg.setViewportSize({ width: s, height: s });
    await pg.setContent(`<!doctype html><html><head><style>@font-face{font-family:Archivo;src:url(${font}) format('woff2');font-weight:100 900;font-stretch:62% 125%}*{margin:0}body{font-family:Archivo}</style></head><body>${mark(s)}</body></html>`);
    await pg.evaluate(() => document.fonts.ready);
    return pg.screenshot({ type: 'png', clip: { x: 0, y: 0, width: s, height: s } });
  };
  const sizes = { 16: null, 32: null, 48: null };
  for (const s of Object.keys(sizes)) sizes[s] = await icon(Number(s));
  // ICO con immagini PNG incorporate (16, 32, 48)
  const entries = Object.entries(sizes);
  const head = Buffer.alloc(6 + 16 * entries.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(entries.length, 4);
  let offset = head.length;
  entries.forEach(([s, png], i) => {
    const o = 6 + i * 16;
    head.writeUInt8(Number(s) % 256, o); head.writeUInt8(Number(s) % 256, o + 1);
    head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3); head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
    head.writeUInt32LE(png.length, o + 8); head.writeUInt32LE(offset, o + 12); offset += png.length;
  });
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), Buffer.concat([head, ...entries.map(([, p]) => p)]));
  fs.writeFileSync(path.join(OUT, 'favicon-32.png'), sizes[32]);
  fs.writeFileSync(path.join(OUT, 'apple-touch-icon.png'), await icon(180));
  fs.writeFileSync(path.join(OUT, 'icon-192.png'), await icon(192));
  fs.writeFileSync(path.join(OUT, 'icon-512.png'), await icon(512));
  fs.writeFileSync(path.join(OUT, 'site.webmanifest'), JSON.stringify({
    name: 'Stanislao Fierro Architetto', short_name: 'S. Fierro', start_url: '/', display: 'browser',
    background_color: C.calce, theme_color: C.calce,
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  }, null, 2));
}
await b.close();
console.log('tavole og', n);
