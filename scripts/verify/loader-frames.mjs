// Fotogrammi del caricamento della home nel tempo.
// Uso: node scripts/verify/loader-frames.mjs <outDir> <baseUrl> [mobile|desktop]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, base, mode = 'desktop'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const vp = mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const ctx = await browser.newContext({ viewport: vp, isMobile: mode === 'mobile', hasTouch: mode === 'mobile' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(base, { waitUntil: 'commit' });
const t0 = Date.now();
const times = [300, 700, 1100, 1500, 1900, 2400, 2900, 3300, 3700, 4100, 4500, 5000, 5600, 6500];
for (const t of times) {
  const wait = t - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${out}/${mode}-${String(t).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 60 });
}
const state = await page.evaluate(() => ({ loading: document.documentElement.classList.contains('is-loading'), y: scrollY }));
console.log(JSON.stringify(state));
console.log(errors.length ? 'ERRORS\n' + errors.join('\n') : 'NO ERRORS');
await browser.close();
