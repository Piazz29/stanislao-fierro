// G13: comportamento reale sulla build di produzione: trascinamento con mouse e con dito (lo scroll verticale
// resta possibile), tastiera, etichette, ingresso animato una volta, statico a 50% con movimento ridotto.
import { spawn, spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 4412;
spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'ignore' });
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: ['ignore', 'pipe', 'pipe'], detached: true });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'ignore' }); };
process.on('exit', stop);
await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('preview non avviato')), 30000); server.stdout.on('data', (d) => { if (String(d).includes(String(PORT))) { clearTimeout(t); res(); } }); });
const base = `http://localhost:${PORT}`;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const ok = [], bad = [];
const check = (c, m) => (c ? ok : bad).push(m);
const val = (p) => p.evaluate(() => Number(document.querySelector('[data-handle]').getAttribute('aria-valuenow')));
const near = (a, b, tol = 4) => Math.abs(a - b) <= tol;

// desktop, movimento attivo
{
  const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(base + '/opere/centro-formazione-baza/', { waitUntil: 'networkidle' });
  check((await val(page)) >= 90, `prima dell'ingresso la linea è a destra (${await val(page)})`);
  await page.locator('[data-stage]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const mid = await val(page);
  await page.waitForTimeout(2600);
  const end = await val(page);
  check(mid > 52 && mid < 94 && near(end, 50, 1), `ingresso: ${mid} durante, ${end} alla fine`);
  const box = await page.locator('[data-stage]').boundingBox();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.6);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.6, { steps: 5 });
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.6, { steps: 5 });
  await page.mouse.up();
  check(near(await val(page), 80), `trascinamento mouse fino all'80% (${await val(page)})`);
  await page.locator('[data-handle]').focus();
  await page.keyboard.press('Home'); const h = await val(page);
  await page.keyboard.press('End'); const e = await val(page);
  await page.keyboard.press('ArrowLeft'); const l = await val(page);
  await page.keyboard.press('Shift+ArrowLeft'); const sl = await val(page);
  check(h === 0 && e === 100 && l === 98 && sl === 88, `tastiera Home ${h}, End ${e}, ← ${l}, Shift+← ${sl}`);
  const vt = await page.getAttribute('[data-handle]', 'aria-valuetext');
  check(/88%/.test(vt) && /12%/.test(vt), `aria-valuetext «${vt}»`);
  await page.click('.reveal-tag-built');
  await page.waitForTimeout(1100);
  check((await val(page)) === 0, `etichetta «opera costruita» porta a 0 (${await val(page)})`);
}

// mobile, tocco: trascinamento orizzontale con il dito, scroll verticale libero
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(base + '/opere/piazza-tribunale/', { waitUntil: 'networkidle' });
  await page.locator('[data-stage]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2600);
  const cdp = await ctx.newCDPSession(page);
  const box = await page.locator('[data-stage]').boundingBox();
  const touch = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  const y0 = box.y + box.height * 0.5;
  const before = await val(page);
  await touch('touchStart', box.x + box.width * 0.5, y0);
  for (let i = 1; i <= 8; i++) { await touch('touchMove', box.x + box.width * (0.5 + 0.04 * i), y0 + i * 0.5); await page.waitForTimeout(16); }
  await touch('touchEnd');
  const after = await val(page);
  check(after - before >= 25, `dito: da ${before} a ${after}`);
  const s0 = await page.evaluate(() => window.scrollY);
  const x = box.x + box.width * 0.3;
  await touch('touchStart', x, y0 + 60);
  for (let i = 1; i <= 10; i++) { await touch('touchMove', x, y0 + 60 - i * 30); await page.waitForTimeout(16); }
  await touch('touchEnd');
  await page.waitForTimeout(600);
  const s1 = await page.evaluate(() => window.scrollY);
  check(s1 - s0 > 100, `scroll verticale sul confronto: ${s0} → ${s1}`);
  check(near(await val(page), after, 3), `lo scroll verticale non sposta la linea (${await val(page)})`);
  const hb = await page.locator('[data-handle]').boundingBox();
  check(hb.width >= 44 && hb.height >= 44, `maniglia ${hb.width}x${hb.height} px`);
}

// movimento ridotto: nessun ingresso, linea ferma a metà
{
  const page = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const v0 = await val(page);
  await page.locator('[data-stage]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  check(v0 === 50 && (await val(page)) === 50, `movimento ridotto: ${v0} → ${await val(page)}`);
  check(!(await page.locator('[data-reveal][data-played]').count()), 'movimento ridotto: nessuna animazione d’ingresso');
}
await b.close();
stop();
console.log(ok.map((x) => 'ok   ' + x).join('\n'));
if (bad.length) { console.log(bad.map((x) => 'FAIL ' + x).join('\n')); process.exit(1); }
console.log('REVEAL BEHAVIOUR VERIFIED');
process.exit(0);
