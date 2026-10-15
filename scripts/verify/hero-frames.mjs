// Fotogrammi della hero: disegno, crescita, foto piena, lente, cambio slide (desktop e mobile).
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const [base = 'http://localhost:4321', out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu'] });
const frames = []; const errs = [];
for (const [vp, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  const page = await (await b.newContext(opts)).newPage();
  page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(base + '/opere/', { waitUntil: 'networkidle' });
  await page.goto(base + '/', { waitUntil: 'commit' });
  const t0 = Date.now();
  const sel = '[data-stage-photo]';
  await page.waitForSelector(sel);
  for (const ms of [500, 1100, 1700, 2400, 3300, 5000]) {
    await page.waitForTimeout(Math.max(0, ms - (Date.now() - t0)));
    frames.push([`${vp} ${ms}ms`, await page.locator(sel).screenshot()]);
  }
  const gl = await page.evaluate(() => document.querySelector('[data-slideshow]').classList.contains('is-gl'));
  frames.push([`${vp} is-gl=${gl} cartiglio`, await page.locator('[data-caption]').screenshot()]);
  const box = await page.locator(sel).boundingBox();
  const cdp = vp === 'mobile' ? await page.context().newCDPSession(page) : null;
  if (vp === 'desktop') {
    await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5, { steps: 8 });
  } else {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width * 0.5, y: box.y + box.height * 0.65 }] });
  }
  await page.waitForTimeout(700);
  frames.push([`${vp} lente`, await page.locator(sel).screenshot()]);
  if (cdp) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.mouse.move(5, 5);
  await page.click('[data-next]');
  for (const ms of [400, 1400, 3200]) { await page.waitForTimeout(ms === 400 ? 400 : ms === 1400 ? 1000 : 1800); frames.push([`${vp} slide 2 +${ms}ms`, await page.locator(sel).screenshot()]); }
}
await b.close();
const W = 560; const comp = []; const cols = 4;
for (let i = 0; i < frames.length; i++) {
  const [label, buf] = frames[i];
  const img = await sharp(buf).resize({ width: W, height: 330, fit: 'contain', background: '#888' }).toBuffer();
  const lab = Buffer.from(`<svg width="${W}" height="20"><rect width="100%" height="100%" fill="#222"/><text x="6" y="15" font-size="13" fill="#fff" font-family="Arial">${label}</text></svg>`);
  const x = (i % cols) * (W + 6), y = Math.floor(i / cols) * 356;
  comp.push({ input: lab, left: x, top: y }, { input: img, left: x, top: y + 22 });
}
await sharp({ create: { width: cols * (W + 6), height: Math.ceil(frames.length / cols) * 356, channels: 3, background: '#555' } }).composite(comp).png().toFile(out);
console.log('frames', frames.length, errs.length ? 'ERRORS ' + errs.join(' | ') : 'no errors');
