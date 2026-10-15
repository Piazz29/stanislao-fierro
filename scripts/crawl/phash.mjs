import sharp from 'sharp'; import fs from 'node:fs'; import path from 'node:path';
const root='src/assets/originali';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
async function dhash(f){const {data}=await sharp(f).greyscale().resize(17,16,{fit:'fill'}).raw().toBuffer({resolveWithObject:true});let h=[];for(let y=0;y<16;y++)for(let x=0;x<16;x++)h.push(data[y*17+x]>data[y*17+x+1]?1:0);return h;}
const all={}; for(const f of walk(root)){try{all[path.relative(root,f)]=await dhash(f);}catch{}}
const dist=(a,b)=>a.reduce((s,v,i)=>s+(v!==b[i]),0);
const queries=process.argv.slice(2);
for(const q of queries){const r=Object.entries(all).filter(([k])=>k!==q&&k.startsWith('pagine')).map(([k,h])=>[k,dist(all[q],h)]).sort((a,b)=>a[1]-b[1]).slice(0,3);console.log(q,JSON.stringify(r));}
