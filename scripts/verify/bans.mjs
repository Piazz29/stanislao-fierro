// G7: niente Inter/Space Grotesk, niente lineette lunghe o parole da marketing nel testo,
// prefers-reduced-motion gestito in CSS e JS, focus visibile.
import fs from 'node:fs';
import path from 'node:path';
import { allPages, visibleText, fail, DIST } from './lib.mjs';
// CSS esterno e CSS in linea (build.inlineStylesheets: 'always')
const css = [
  ...fs.readdirSync(path.join(DIST, '_astro')).filter((f) => f.endsWith('.css')).map((f) => fs.readFileSync(path.join(DIST, '_astro', f), 'utf8')),
  ...allPages().map((f) => (fs.readFileSync(f, 'utf8').match(/<style[^>]*>[\s\S]*?<\/style>/g) ?? []).join('\n')),
].join('\n');
const js = fs.readdirSync(path.join(DIST, '_astro')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(DIST, '_astro', f), 'utf8')).join('\n');
const inlineJs = allPages().map((f) => fs.readFileSync(f, 'utf8').match(/<script type="module">[\s\S]*?<\/script>/g)?.join('') ?? '').join('');
const FONT = /font-family:[^;}]*\b(Inter|Space Grotesk)\b/i;
const WORDS = /\b(eccellenza|eccellente|passione|appassionat\w*|Exzellenz|Leidenschaft|excellence|passion(ate)?|best-in-class|world-class)\b/i;
const DASH = /—/;
// autocontrollo: i rilevatori devono scattare su esempi positivi noti
if (!FONT.test('a{font-family:Inter,sans-serif}') || !WORDS.test('con passione') || !DASH.test('a — b')) { console.error('FAIL autocontrollo rilevatori'); process.exit(1); }
if (!css.length) fail('nessun CSS trovato');
if (FONT.test(css)) fail('font vietato nel CSS');
if (!/prefers-reduced-motion:\s*reduce/.test(css)) fail('CSS senza prefers-reduced-motion');
if (!/prefers-reduced-motion/.test(js + inlineJs)) fail('JS senza controllo prefers-reduced-motion');
if (!/:focus-visible/.test(css)) fail('nessuno stile :focus-visible');
let pages = 0;
for (const f of allPages()) {
  const t = visibleText(fs.readFileSync(f, 'utf8'));
  if (DASH.test(t)) fail(`${f}: lineetta lunga «${t.match(/.{30}—.{30}/)?.[0]}»`);
  if (WORDS.test(t)) fail(`${f}: parola vietata «${t.match(WORDS)[0]}»`);
  pages++;
}
console.log(`css ${css.length} byte, pagine ${pages}`);
if (!process.exitCode) console.log('BANS VERIFIED');
