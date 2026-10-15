import sharp from 'sharp'; import path from 'node:path';
// usage: contact.mjs out.jpg root file1 file2 ...
const [out,root,...files]=process.argv.slice(2); const W=240,H=180,cols=6;
const rows=Math.ceil(files.length/cols); const comps=[];
for(let i=0;i<files.length;i++){
  const x=(i%cols)*W, y=Math.floor(i/cols)*(H+20);
  try{ const b=await sharp(path.join(root,files[i])).resize(W-6,H-6,{fit:'contain',background:'#ddd'}).toBuffer(); comps.push({input:b,left:x+3,top:y+3}); }catch{}
  const label=Buffer.from(`<svg width="${W}" height="20"><text x="4" y="15" font-size="13" font-family="Arial">${path.basename(files[i]).replace('_immagine.jpg','')}</text></svg>`);
  comps.push({input:label,left:x,top:y+H});
}
await sharp({create:{width:cols*W,height:rows*(H+20),channels:3,background:'#fff'}}).composite(comps).jpeg({quality:70}).toFile(out);
