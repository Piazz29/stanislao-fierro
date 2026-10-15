// G3: la build di produzione termina con successo e produce le pagine.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const r = spawnSync('npx', ['astro', 'build'], { encoding: 'utf8', maxBuffer: 1 << 28 });
const out = (r.stdout ?? '') + (r.stderr ?? '');
const m = out.match(/(\d+) page\(s\) built/);
const warn = out.split('\n').filter((l) => /\[(WARN|ERROR)\]|error/i.test(l) && !/0 error/i.test(l));
if (r.status !== 0) { console.error(out.slice(-4000)); console.error('FAIL build exit', r.status); process.exit(1); }
if (!m || Number(m[1]) < 100) { console.error('FAIL pagine generate', m?.[1]); process.exit(1); }
if (!fs.existsSync('dist/index.html')) { console.error('FAIL dist/index.html assente'); process.exit(1); }
if (warn.length) { console.error('FAIL avvisi nella build:\n' + warn.slice(0, 20).join('\n')); process.exit(1); }
console.log(`pagine ${m[1]}`);
console.log('BUILD VERIFIED');
