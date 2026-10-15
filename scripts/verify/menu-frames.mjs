// Fotogrammi dell'apertura e della chiusura del menu.
// Uso: node scripts/verify/menu-frames.mjs <outDir> <baseUrl> <path> [mobile|desktop]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, base, p = '/opere/', mode = 'desktop'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const vp = mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await (await browser.newContext({ viewport: vp, isMobile: mode === 'mobile', hasTouch: mode === 'mobile' })).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(base + p, { waitUntil: 'networkidle' });
await page.waitForTimeout(p === '/' ? 7000 : 600);
const shoot = async (tag, times) => {
  const t0 = Date.now();
  for (const t of times) { const w = t - (Date.now() - t0); if (w > 0) await page.waitForTimeout(w); await page.screenshot({ path: `${out}/${mode}-${tag}-${String(t).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 60 }); }
};
await page.click('[data-menu-toggle]');
await shoot('a-open', [0, 150, 300, 450, 650, 1000]);
const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
await page.click('[data-menu-toggle]');
await shoot('b-close', [0, 150, 300, 450, 650, 1000]);
const hiddenAfter = await page.evaluate(() => getComputedStyle(document.querySelector('[data-menu]')).visibility);
console.log(JSON.stringify({ focused, hiddenAfter }));
console.log(errors.length ? 'ERRORS ' + errors.join('; ') : 'NO ERRORS');
await browser.close();
