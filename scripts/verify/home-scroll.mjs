// Fotogrammi della home lungo lo scorrimento, con il movimento attivo.
// Uso: node scripts/verify/home-scroll.mjs <outDir> <baseUrl> [mobile|desktop]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, base, mode = 'mobile'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const vp = mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mode === 'mobile', hasTouch: mode === 'mobile' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(base, { waitUntil: 'networkidle' });
// attende la fine del caricamento della home
await page.waitForFunction(() => !document.documentElement.classList.contains('is-loading'), null, { timeout: 15000 });
await page.waitForTimeout(1200);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
const n = +(process.env.FRAMES ?? 22);
for (let i = 0; i <= n; i++) {
  const y = Math.round(((H - vp.height) * i) / n);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${mode}-${String(i).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 60 });
}
const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(`altezza ${H}px, overflow-x ${ov}px`);
console.log(errors.length ? 'ERRORS\n' + errors.join('\n') : 'NO ERRORS');
await browser.close();
