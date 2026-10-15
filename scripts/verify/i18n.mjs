// G8: le pagine DE/EN hanno interfaccia e testo Magnago tradotti; nessuna etichetta italiana residua.
import { ROUTES, urlOf, load, visibleText, fail } from './lib.mjs';
import { parse } from 'node-html-parser';
// etichette dell'interfaccia italiana che non devono comparire in DE/EN
const IT_UI = ['Opere in evidenza', 'Tutte le opere', 'Indice delle opere', 'Committente', 'Realizzazione', 'Riconoscimenti', 'Precedente', 'Successiva', 'Tipologia', 'Spazi pubblici', 'Edifici pubblici', 'Concorsi', 'Schizzi', 'Contatti', 'Opera successiva', 'Opera precedente', 'Rendering di concorso', 'Luogo', 'Anno', 'Esito', 'Indirizzo', 'Telefono', 'Vai al contenuto', 'Demo realizzata da', 'Dalla relazione di progetto', 'Partecipazione', 'Finalista', 'premio'];
// i blocchi dichiarati in italiano (titoli di libri, estratti originali) sono esclusi
function textOutsideItalian(raw) {
  const doc = parse(raw);
  for (const el of doc.querySelectorAll('[lang="it"], [lang="es"]')) if (el.tagName !== 'HTML') el.remove();
  for (const el of doc.querySelectorAll('[hreflang]')) el.remove();
  return visibleText(doc.toString());
}
let n = 0;
for (const l of ['de', 'en']) {
  const targets = [...Object.keys(ROUTES).map((k) => [k]), ['works', 'piazza-silvius-magnago'], ['works', 'centro-formazione-baza'], ['works', 'piazza-tribunale']];
  for (const [k, slug] of targets) {
    const u = urlOf(l, k, slug);
    const p = load(u);
    if (!p) { fail(`assente ${u}`); continue; }
    const t = textOutsideItalian(p.raw);
    for (const s of IT_UI) if (new RegExp(`(^|[^\\p{L}])${s}([^\\p{L}]|$)`, 'u').test(t)) fail(`${u}: etichetta italiana «${s}»`);
    const it = load(urlOf('it', k, slug));
    if (p.doc.querySelector('h1')?.text === it.doc.querySelector('h1')?.text && !['studio', 'works', 'home'].includes(k) && !slug) fail(`${u}: h1 uguale all'italiano`);
    n++;
  }
}
// controllo positivo: lo stesso rilevatore deve trovare le etichette nella pagina italiana
const itHome = textOutsideItalian(load(urlOf('it', 'home')).raw);
if (!IT_UI.filter((s) => itHome.includes(s)).length) fail('controllo positivo: nessuna etichetta trovata nella home italiana');
// testo Magnago tradotto
const mDe = visibleText(load(urlOf('de', 'works', 'piazza-silvius-magnago')).raw);
const mEn = visibleText(load(urlOf('en', 'works', 'piazza-silvius-magnago')).raw);
if (!mDe.includes('Silvius-Magnago-Platz') || !mDe.includes('Landhaus') || !mDe.includes('Publikumspreis')) fail('Magnago DE non tradotta');
if (!mEn.includes('provincial government building') || !mEn.includes('Public Choice')) fail('Magnago EN non tradotta');
if (!/Bozen/.test(mDe)) fail('DE: Bozen assente');
console.log(`pagine DE/EN controllate ${n}`);
if (!process.exitCode) console.log('I18N VERIFIED');
