// G6: fatti presenti nell'output: credito nel footer di ogni pagina, credito fotografico Baza,
// contatti completi con mappa statica, JSON-LD con indirizzo e premi, registro concorsi internazionale.
import fs from 'node:fs';
import { LANGS, urlOf, load, allPages, visibleText, fail } from './lib.mjs';
const CREDIT = { 'it-IT': 'Demo realizzata da AuralpDigital', 'de-IT': 'Demo erstellt von AuralpDigital', en: 'Demo by AuralpDigital' };
let pages = 0;
for (const f of allPages()) {
  const raw = fs.readFileSync(f, 'utf8');
  const lang = raw.match(/<html lang="([^"]+)"/)?.[1];
  const footer = raw.split('<footer')[1] ?? '';
  if (!footer.includes(CREDIT[lang])) fail(`${f}: credito demo assente nel footer`);
  pages++;
}
for (const l of LANGS) {
  const baza = load(urlOf(l, 'works', 'centro-formazione-baza'));
  const t = visibleText(baza.raw);
  if (!/Fernando Alda/.test(t)) fail(`Baza ${l}: credito Fernando Alda assente`);
  // il credito accompagna le foto, non i disegni
  const credited = (t.match(/Fernando Alda/g) ?? []).length;
  if (credited < 10) fail(`Baza ${l}: credito su sole ${credited} didascalie`);

  const c = load(urlOf(l, 'contact'));
  const ct = visibleText(c.raw);
  for (const s of ['0471 973896', 'stanislao.fierro@libero.it', 'stanislao.fierro@archiworldpec.it', '39100', '01639010212']) if (!ct.includes(s)) fail(`contatti ${l}: manca ${s}`);
  if (!/Via Montello 3|Montellostraße 3/.test(ct)) fail(`contatti ${l}: indirizzo`);
  if (!c.raw.includes('mappa-via-montello') || !/OpenStreetMap/.test(ct)) fail(`contatti ${l}: mappa statica o attribuzione OSM`);
  if (!c.raw.includes('href="tel:+390471973896"') || !c.raw.includes('href="mailto:stanislao.fierro@libero.it"')) fail(`contatti ${l}: link tel/mailto`);

  const h = load(urlOf(l, 'home'));
  const ld = [...h.raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const graph = ld.flatMap((x) => x['@graph'] ?? [x]);
  const svc = graph.find((x) => [].concat(x['@type']).includes('ProfessionalService'));
  const person = graph.find((x) => x['@type'] === 'Person');
  if (!svc?.address?.streetAddress || svc.address.postalCode !== '39100' || svc.address.addressCountry !== 'IT') fail(`json-ld ${l}: indirizzo`);
  if (!(svc?.award?.length >= 5) || !svc.award.some((a) => /2019/.test(a))) fail(`json-ld ${l}: premi`);
  if (!person?.name || !person.award?.length) fail(`json-ld ${l}: Person`);
  if (svc?.telephone !== '+390471973896') fail(`json-ld ${l}: telefono`);
}
// registro concorsi: le città internazionali del brief sono presenti con un esito
const reg = load(urlOf('it', 'competitions'));
const rows = reg.doc.querySelectorAll('tbody tr');
const cities = ['Lipsia', 'Erfurt', 'Hildesheim', 'Monaco di Baviera', 'Starnberg', 'San Gallo', 'Cordova', 'Puerto Real', 'Siviglia', 'Roma'];
for (const c of cities) if (!rows.some((r) => r.text.includes(c))) fail(`concorsi: manca ${c}`);
const intl = rows.filter((r) => r.getAttribute('data-intl') === '1');
const withResult = rows.filter((r) => /premio|Finalista|classificato|Partecipazione/.test(r.text));
if (intl.length < 15) fail(`concorsi internazionali solo ${intl.length}`);
if (withResult.length !== rows.length) fail(`righe senza esito: ${rows.length - withResult.length}`);
const firsts = rows.filter((r) => /1° premio/.test(r.text)).length;
console.log(`pagine con credito ${pages}, righe registro ${rows.length}, internazionali ${intl.length}, primi premi ${firsts}`);
if (!process.exitCode) console.log('CONTENT VERIFIED');
