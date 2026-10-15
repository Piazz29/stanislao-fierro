// G9: Lighthouse mobile (preset predefinito, throttling simulato) >= 95 nelle quattro categorie
// per home, opere e scheda Magnago, sulla build di produzione servita da `astro preview`.
import { spawn, spawnSync } from 'node:child_process';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
const PORT = 4411;
const PAGES = ['/', '/opere/', '/opere/piazza-silvius-magnago/', ...(process.argv.slice(2))];
// Astro tiene un solo preview in background per progetto: si chiude quello eventuale prima di avviare il nostro
spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'ignore' });
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: ['ignore', 'pipe', 'pipe'], detached: true });
const kill = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'ignore' }); };
process.on('exit', kill);
await new Promise((res, rej) => {
  const t = setTimeout(() => rej(new Error('preview non avviato')), 30000);
  server.stdout.on('data', (d) => { if (String(d).includes(String(PORT))) { clearTimeout(t); res(); } });
});
const chrome = await chromeLauncher.launch({ chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', chromeFlags: ['--headless=new', '--no-first-run'] });
let failed = false;
for (const p of PAGES) {
  const r = await lighthouse(`http://localhost:${PORT}${p}`, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
  const c = r.lhr.categories;
  const s = Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const bad = Object.entries(s).filter(([, v]) => v < 95);
  console.log(p, JSON.stringify(s), `LCP ${r.lhr.audits['largest-contentful-paint'].displayValue}, CLS ${r.lhr.audits['cumulative-layout-shift'].displayValue}, TBT ${r.lhr.audits['total-blocking-time'].displayValue}`);
  if (bad.length) {
    failed = true;
    for (const [cat] of bad) {
      const fails = c[cat].auditRefs.map((a) => r.lhr.audits[a.id]).filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable');
      console.log(`  ${cat}:`, fails.map((a) => `${a.id} (${a.displayValue ?? a.score})`).join(', '));
      if (process.env.LH_DETAIL) for (const f of fails) for (const it of (f.details?.items ?? []).slice(0, 6)) console.log('    -', f.id, it.node?.snippet ?? it.node?.selector ?? JSON.stringify(it).slice(0, 160));
    }
  }
}
chrome.kill();
kill();
if (failed) { console.error('FAIL soglia 95 non raggiunta'); process.exit(1); }
console.log('LIGHTHOUSE VERIFIED');
process.exit(0);
