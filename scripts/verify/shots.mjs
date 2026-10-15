// Screenshot di pagine a viewport esatte con Chrome di sistema.
// Uso: node scripts/verify/shots.mjs <outDir> <baseUrl> <path>[,<path>...] [desktop|mobile|both] [full]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, base, paths, mode = 'both', full = ''] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const vps = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2, hasTouch: true } };
const errors = [];
for (const m of mode === 'both' ? ['desktop', 'mobile'] : [mode]) {
  const ctx = await browser.newContext({ viewport: { width: vps[m].width, height: vps[m].height }, deviceScaleFactor: vps[m].deviceScaleFactor ?? 1, isMobile: !!vps[m].isMobile, hasTouch: !!vps[m].hasTouch, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`${m} ${msg.text()}`); });
  page.on('pageerror', (e) => errors.push(`${m} pageerror ${e.message}`));
  for (const p of paths.split(',')) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    // forza il caricamento delle immagini lazy per lo screenshot a pagina intera
    if (full) { await page.evaluate(async () => { for (const i of document.querySelectorAll('img[loading=lazy]')) i.loading = 'eager'; await new Promise((r) => setTimeout(r, 800)); }); }
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (ov > 0) errors.push(`${m} ${p} overflow-x ${ov}px`);
    const name = `${m}-${p.replace(/\W+/g, '_') || 'home'}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: !!full });
    console.log('shot', name);
  }
  await ctx.close();
}
await browser.close();
console.log(errors.length ? 'ERRORS\n' + errors.join('\n') : 'NO CONSOLE ERRORS, NO OVERFLOW');
