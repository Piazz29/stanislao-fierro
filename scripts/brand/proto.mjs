// Prototipi del simbolo, renderizzati con Archivo reale (incorporato) da Chrome.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const font = 'data:font/woff2;base64,' + fs.readFileSync('public/fonts/archivo-latin-wdth-normal.woff2').toString('base64');
const C = { calce: '#f7f5f0', carbone: '#1e1c19', porfido: '#8f3e2c' };
const sq = (s, f) => Math.max(2, Math.round(s * f));
const variants = {
  A: (s) => `<div class="m" style="width:${s}px;height:${s}px;background:${C.carbone};color:${C.calce}"><span style="font-size:${s * 0.58}px;font-weight:560;font-stretch:74%;letter-spacing:-0.01em">SF</span></div>`,
  E: (s) => `<div class="m" style="width:${s}px;height:${s}px;background:${C.carbone};color:${C.calce};align-items:flex-end;justify-content:flex-start"><span style="position:absolute;left:${s * 0.13}px;bottom:${s * 0.06}px;font-size:${s * 0.62}px;line-height:1;font-weight:560;font-stretch:72%;letter-spacing:-0.02em">SF</span><i style="position:absolute;right:${s * 0.13}px;top:${s * 0.13}px;width:${sq(s, 0.16)}px;height:${sq(s, 0.16)}px;background:${C.porfido}"></i></div>`,
  F: (s) => `<div class="m" style="width:${s}px;height:${s}px;background:${C.carbone};color:${C.calce}"><span style="font-size:${s * 0.7}px;line-height:1;font-weight:540;font-stretch:80%;margin-left:-${s * 0.06}px">F</span><i style="position:absolute;right:${s * 0.14}px;bottom:${s * 0.17}px;width:${sq(s, 0.17)}px;height:${sq(s, 0.17)}px;background:${C.porfido}"></i></div>`,
  G: (s) => `<div class="m" style="width:${s}px;height:${s}px;background:${C.calce};color:${C.carbone};box-shadow:inset 0 0 0 ${Math.max(1, Math.round(s / 24))}px ${C.carbone}"><span style="font-size:${s * 0.58}px;font-weight:600;font-stretch:72%;letter-spacing:-0.01em">SF</span></div>`,
};
const sizes = [16, 32, 64, 180];
const tab = (f, dark) => `<div class="tab${dark ? ' dark' : ''}">${f(16)}<span>${dark ? 'Stanislao Fierro' : 'Stanislao Fierro Architetto, Bolzano'}</span></div>`;
const html = `<html><head><style>
@font-face{font-family:A;src:url(${font}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
body{margin:0;padding:20px;background:#fff;font-family:A}
.row{display:flex;gap:28px;align-items:flex-end;margin-bottom:30px}
.m{position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}
.lab{font:14px Arial;width:24px}
.tab{background:#dee1e6;padding:9px 12px;display:flex;gap:8px;align-items:center;font:13px Arial;border-radius:8px 8px 0 0;width:210px}
.dark{background:#35363a;color:#e8eaed;width:150px}
</style></head><body>
${Object.entries(variants).map(([k, f]) => `<div class="row"><span class="lab">${k}</span>${sizes.map((s) => f(s)).join('')}${tab(f)}${tab(f, true)}</div>`).join('')}
</body></html>`;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await (await b.newContext({ viewport: { width: 980, height: 900 }, deviceScaleFactor: 2 })).newPage();
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: process.argv[2], fullPage: true });
await b.close();
