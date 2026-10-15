import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
export const DIST = 'dist';
export const LANGS = ['it', 'de', 'en'];
export const ROUTES = {
  home: { it: '', de: '', en: '' },
  works: { it: 'opere', de: 'werke', en: 'works' },
  competitions: { it: 'concorsi', de: 'wettbewerbe', en: 'competitions' },
  sketches: { it: 'schizzi', de: 'skizzen', en: 'sketches' },
  studio: { it: 'studio', de: 'studio', en: 'studio' },
  contact: { it: 'contatti', de: 'kontakt', en: 'contact' },
};
export const urlOf = (lang, key, slug) => `${lang === 'it' ? '' : `/${lang}`}/${ROUTES[key][lang] ? `${ROUTES[key][lang]}/` : ''}${slug ? `${slug}/` : ''}`;
export const fileOf = (u) => path.join(DIST, u, 'index.html');
export function load(u) {
  const f = fileOf(u);
  if (!fs.existsSync(f)) return null;
  const raw = fs.readFileSync(f, 'utf8');
  return { raw, doc: parse(raw), file: f };
}
export function allPages() {
  const out = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== '_astro' && e.name !== 'fonts') walk(p); } else if (e.name.endsWith('.html')) out.push(p); } };
  walk(DIST);
  return out;
}
// testo visibile: senza script, style, attributi
export function visibleText(raw) {
  return raw.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
}
export const fail = (m) => { console.error('FAIL', m); process.exitCode = 1; };

// avvia `astro preview` sulla build (chiudendo eventuali preview in background) e restituisce base URL e stop()
export async function startPreview(port) {
  const { spawn, spawnSync } = await import('node:child_process');
  spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'ignore' });
  const server = spawn('npx', ['astro', 'preview', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'ignore' }); };
  process.on('exit', stop);
  await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('preview non avviato')), 30000); server.stdout.on('data', (d) => { if (String(d).includes(String(port))) { clearTimeout(t); res(); } }); });
  return { base: `http://localhost:${port}`, stop };
}
