// Fotogrammi del confronto schizzo/costruito a varie posizioni, desktop e mobile.
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const [base = 'http://localhost:4321', out, ...paths] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const frames = [];
for (const [vp, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  const page = await (await b.newContext(opts)).newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    const stage = page.locator('[data-stage]').first();
    await stage.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -120));
    await page.waitForTimeout(500);
    frames.push([`${vp} ${p} sweep`, await page.locator('[data-reveal]').first().screenshot()]);
    await page.waitForTimeout(2200);
    frames.push([`${vp} ${p} 50`, await page.locator('[data-reveal]').first().screenshot()]);
    await page.locator('[data-handle]').first().focus();
    await page.keyboard.press('End');
    frames.push([`${vp} ${p} schizzo`, await page.locator('[data-reveal]').first().screenshot()]);
    await page.keyboard.press('Home');
    frames.push([`${vp} ${p} foto`, await page.locator('[data-reveal]').first().screenshot()]);
  }
}
await b.close();
const W = 700; const tiles = [];
for (const [label, buf] of frames) {
  const img = await sharp(buf).resize({ width: W, height: 420, fit: 'contain', background: '#999' }).toBuffer();
  const lab = Buffer.from(`<svg width="${W}" height="22"><rect width="100%" height="100%" fill="#222"/><text x="6" y="16" font-size="14" fill="#fff" font-family="Arial">${label}</text></svg>`);
  tiles.push(img, lab);
}
const cols = 4, rows = Math.ceil(frames.length / cols);
const comp = [];
frames.forEach((_, i) => { const x = (i % cols) * (W + 8), y = Math.floor(i / cols) * 450; comp.push({ input: tiles[i * 2 + 1], left: x, top: y }, { input: tiles[i * 2], left: x, top: y + 24 }); });
await sharp({ create: { width: cols * (W + 8), height: rows * 450, channels: 3, background: '#666' } }).composite(comp).png().toFile(out);
console.log('frames', frames.length);
