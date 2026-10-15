// Mappa statica di Via Montello 3 da tile OpenStreetMap (© OpenStreetMap contributors, ODbL).
// Uso una tantum: node scripts/crawl/static-map.mjs
import sharp from 'sharp';
import fs from 'node:fs';
const LAT = 46.5041488, LON = 11.3422821, Z = 17, W = 1280, H = 880;
const n = 2 ** Z;
const xt = ((LON + 180) / 360) * n;
const yt = ((1 - Math.log(Math.tan((LAT * Math.PI) / 180) + 1 / Math.cos((LAT * Math.PI) / 180)) / Math.PI) / 2) * n;
const px = xt * 256, py = yt * 256;
// centro leggermente spostato perché il segnaposto cada sul terzo sinistro
const cx = px + W * 0.12, cy = py;
const x0 = cx - W / 2, y0 = cy - H / 2;
const comps = [];
for (let tx = Math.floor(x0 / 256); tx <= Math.floor((x0 + W) / 256); tx++)
  for (let ty = Math.floor(y0 / 256); ty <= Math.floor((y0 + H) / 256); ty++) {
    const url = `https://tile.openstreetmap.org/${Z}/${tx}/${ty}.png`;
    const r = await fetch(url, { headers: { 'User-Agent': 'AuralpDigital-demo/1.0 (one-off static map build)' } });
    if (!r.ok) throw new Error(`${url} ${r.status}`);
    comps.push({ input: Buffer.from(await r.arrayBuffer()), left: Math.round(tx * 256 - x0), top: Math.round(ty * 256 - y0) });
  }
const raw = await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } }).composite(comps).png().toBuffer();
// toni pietra: scala di grigi, contrasto ridotto, leggera tinta calda
await sharp(raw).greyscale().linear(0.62, 92).tint({ r: 236, g: 232, b: 224 }).jpeg({ quality: 82 }).toFile('src/assets/mappa-via-montello.jpg');
const marker = { x: (px - x0) / W, y: (py - y0) / H };
fs.writeFileSync('src/data/map.json', JSON.stringify({ lat: LAT, lon: LON, zoom: Z, width: W, height: H, marker }, null, 2));
console.log('ok', marker);
