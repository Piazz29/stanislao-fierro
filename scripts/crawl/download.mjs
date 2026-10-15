import fs from 'node:fs'; import path from 'node:path';
const [S,DEST]=process.argv.slice(2);
const files=fs.readdirSync(S+'/crawl/pages').map(f=>fs.readFileSync(S+'/crawl/pages/'+f,'latin1'));
const set=new Set();
for(const h of files){
  const c=(h.split('<!--CONTENUTO-->')[1]||'').split('<!--PIE DI PAGINA-->')[0];
  for(const m of c.matchAll(/["'(]\/?(public\/[^"'()\s>]+\.(?:jpe?g|png|gif|webp))/gi)) set.add(m[1]);
}
const list=[...set].filter(p=>!/\/_immagine\./.test(p)).sort();
const res={ok:[],fail:[]};
for(const p of list){
  const rel=p.replace(/^public\//,''); const out=path.join(DEST,rel);
  fs.mkdirSync(path.dirname(out),{recursive:true});
  try{ const r=await fetch('https://www.stanislaofierro.com/'+encodeURI(p),{headers:{'User-Agent':'Mozilla/5.0'}});
    const ct=r.headers.get('content-type')||''; const b=Buffer.from(await r.arrayBuffer());
    if(!r.ok||!ct.startsWith('image')||b.length<500){res.fail.push([p,r.status,ct,b.length]);continue;}
    fs.writeFileSync(out,b); res.ok.push(rel);
  }catch(e){res.fail.push([p,e.message]);}
}
fs.writeFileSync(S+'/crawl/download.json',JSON.stringify({candidates:list,...res},null,1));
console.log('candidates',list.length,'ok',res.ok.length,'fail',res.fail.length); console.log(res.fail);
