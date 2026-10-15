// Fotogrammi dell'ingresso orchestrato della home (movimento attivo).
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const [base = 'http://localhost:4321', out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(base + '/opere/', { waitUntil: 'networkidle' }); // cache calda per font e CSS
await p.goto(base + '/', { waitUntil: 'commit' });
const t0 = Date.now(); const shots = [];
for (const ms of [150, 500, 900, 1600]) { await p.waitForTimeout(Math.max(0, ms - (Date.now() - t0))); shots.push(await p.screenshot()); }
await b.close();
const c = []; for (let i = 0; i < 4; i++) c.push({ input: await sharp(shots[i]).resize(720).toBuffer(), left: (i % 2) * 730, top: Math.floor(i / 2) * 460 });
await sharp({ create: { width: 1450, height: 910, channels: 3, background: '#777' } }).composite(c).png().toFile(out);
console.log('ok');
