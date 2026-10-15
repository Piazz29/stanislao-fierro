import fs from 'node:fs';
import path from 'node:path';
const OUT = process.argv[2];
fs.mkdirSync(path.join(OUT,'pages'),{recursive:true});
const BASE='https://www.stanislaofierro.com/index.php';
const seeds=['Home','News','Lista','Opere selezionate','In corso','Allestimenti','Regesto Schizzi','Riqualificazione Urbana','Edifici Pubblici','Residenziali','Scolastici','Studio','Biografia','Pubblicazioni','Premi','Conferenze','Contatti'];
const queue=[...seeds]; const seen=new Set(); const pages={};
const dec=new TextDecoder('iso-8859-1');
while(queue.length){
  const p=queue.shift(); if(seen.has(p)) continue; seen.add(p);
  const url=`${BASE}?p=${encodeURIComponent(p)}&lang=it`;
  let html='';
  try{ const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0'}}); html=dec.decode(await r.arrayBuffer()); }catch(e){ console.error('ERR',p,e.message); continue; }
  fs.writeFileSync(path.join(OUT,'pages',p.replace(/[^\w-]+/g,'_')+'.html'),html);
  const content=(html.split('<!--CONTENUTO-->')[1]||html).split('<!--PIE DI PAGINA-->')[0];
  const imgs=[...content.matchAll(/(?:src|href)\s*=\s*["']?\/?(public\/[^"'\s>]+\.(?:jpe?g|png|gif|webp))/gi)].map(m=>m[1]);
  const bg=[...content.matchAll(/url\(['"]?\/?(public\/[^'")]+)['"]?\)/gi)].map(m=>m[1]);
  const links=[...html.matchAll(/[?&]p=([^"'&>]+)/g)].map(m=>decodeURIComponent(m[1].replace(/\+/g,' ')).trim());
  pages[p]={url,imgs:[...new Set([...imgs,...bg])],links:[...new Set(links)],error:/Fatal error|Warning:|Notice:/.test(html)};
  for(const l of links) if(!seen.has(l)) queue.push(l);
  console.log(p, 'imgs', pages[p].imgs.length, pages[p].error?'PHPERR':'');
}
fs.writeFileSync(path.join(OUT,'pages.json'),JSON.stringify(pages,null,1));
console.log('PAGES',Object.keys(pages).length);
