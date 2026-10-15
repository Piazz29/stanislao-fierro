import sharp from 'sharp'; import fs from 'node:fs'; import path from 'node:path';
const root=process.argv[2]; const out={};
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for(const f of walk(root)){ try{const m=await sharp(f).metadata(); out[path.relative(root,f)]={w:m.width,h:m.height,fmt:m.format,kb:Math.round(fs.statSync(f).size/1024)};}catch(e){out[path.relative(root,f)]={err:e.message}} }
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));
const by={}; for(const [k,v] of Object.entries(out)){const d=path.dirname(k); (by[d]??=[]).push(v.w);}
for(const [d,ws] of Object.entries(by)) console.log(d, ws.length, 'w min/med/max', Math.min(...ws), ws.sort((a,b)=>a-b)[ws.length>>1], Math.max(...ws));
console.log(Object.entries(out).filter(([k,v])=>v.err));
