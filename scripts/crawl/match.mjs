// Confronto pixel tra due immagini per stabilire se una è la stessa (o un ritaglio) dell'altra.
// Restituisce la differenza media assoluta (0-255) del miglior allineamento di `crop` dentro `full`.
import sharp from 'sharp';

const BASE = 200; // larghezza di lavoro dell'immagine intera

async function grey(file, width) {
  const { data, info } = await sharp(file).greyscale().resize({ width }).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

export async function cropMatch(cropFile, fullFile) {
  const full = await grey(fullFile, BASE);
  let best = { mad: Infinity };
  for (let r = 0.6; r <= 1.0001; r += 0.02) {
    const c = await grey(cropFile, Math.round(BASE * r));
    if (c.h > full.h || c.w > full.w) continue;
    for (let dy = 0; dy <= full.h - c.h; dy += 1) {
      for (let dx = 0; dx <= full.w - c.w; dx += 1) {
        let s = 0;
        // campionamento a passo 2 per velocità
        for (let y = 0; y < c.h; y += 2) {
          const fy = (y + dy) * full.w + dx;
          const cy = y * c.w;
          for (let x = 0; x < c.w; x += 2) s += Math.abs(c.data[cy + x] - full.data[fy + x]);
        }
        const mad = s / (Math.ceil(c.h / 2) * Math.ceil(c.w / 2));
        if (mad < best.mad) best = { mad, ratio: +r.toFixed(2), dx, dy };
      }
    }
  }
  return best;
}

export async function dhash(file) {
  const { data } = await sharp(file).greyscale().resize(17, 16, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  const h = [];
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) h.push(data[y * 17 + x] > data[y * 17 + x + 1] ? 1 : 0);
  return h;
}
export const hamming = (a, b) => a.reduce((s, v, i) => s + (v !== b[i]), 0);

// Soglie: una stessa immagine ricompressa/ridimensionata sta sotto queste soglie;
// immagini diverse (controllo negativo misurato) stanno molto sopra.
export const DHASH_SAME = 24;
export const MAD_SAME = 14;

// Correlazione normalizzata (NCC) di un riquadro centrale di `a` cercato dentro `b` a varie scale.
// 1 = identico; immagini non correlate stanno intorno a 0-0.5.
export async function patchNCC(aFile, bFile) {
  const B = 160;
  const b = await grey(bFile, B);
  const aMeta = await sharp(aFile).metadata();
  // riquadro centrale: 50% larghezza, 60% altezza
  const pw = Math.round(aMeta.width * 0.5), ph = Math.round(aMeta.height * 0.6);
  const left = Math.round((aMeta.width - pw) / 2), top = Math.round((aMeta.height - ph) / 2);
  let best = { ncc: -1 };
  for (let s = 0.25; s <= 0.95; s += 0.025) {
    const tw = Math.round(B * s);
    const { data: t, info } = await sharp(aFile).extract({ left, top, width: pw, height: ph }).greyscale().resize({ width: tw }).raw().toBuffer({ resolveWithObject: true });
    const th = info.height;
    if (th > b.h || tw > b.w) continue;
    const n = tw * th; let tm = 0; for (const v of t) tm += v; tm /= n;
    let ts = 0; for (const v of t) ts += (v - tm) ** 2; ts = Math.sqrt(ts);
    if (ts === 0) continue;
    for (let dy = 0; dy <= b.h - th; dy++) for (let dx = 0; dx <= b.w - tw; dx++) {
      let bm = 0; for (let y = 0; y < th; y++) { const o = (y + dy) * b.w + dx; for (let x = 0; x < tw; x++) bm += b.data[o + x]; } bm /= n;
      let cov = 0, bs = 0;
      for (let y = 0; y < th; y++) { const o = (y + dy) * b.w + dx; for (let x = 0; x < tw; x++) { const d = b.data[o + x] - bm; cov += (t[y * tw + x] - tm) * d; bs += d * d; } }
      const ncc = cov / (ts * Math.sqrt(bs) || 1);
      if (ncc > best.ncc) best = { ncc, scale: +s.toFixed(3), dx, dy };
    }
  }
  return best;
}
export const NCC_SAME = 0.9;
