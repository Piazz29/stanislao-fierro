import fs from 'node:fs';
const S=process.argv[2]; const pages=JSON.parse(fs.readFileSync(S+'/crawl/pages.json'));
const strip=s=>s.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const out={};
for(const [p,info] of Object.entries(pages)){
  const html=fs.readFileSync(S+'/crawl/pages/'+p.replace(/[^\w-]+/g,'_')+'.html','utf8');
  const c=(html.split('<!--CONTENUTO-->')[1]||'').split('<!--PIE DI PAGINA-->')[0].replace(/<style[\s\S]*?<\/style>/g,'').replace(/<script[\s\S]*?<\/script>/g,'');
  const t=c.match(/id="titoletto">([\s\S]*?)<\/div>/);
  const pag=c.match(/id="pag">([\s\S]*?)<div id="lista15">/);
  const mainImgs=pag?[...pag[1].matchAll(/src="(public\/[^"]+)"/g)].map(m=>m[1]):[];
  const des=[...c.matchAll(/class="des" id="d(\d+)"[^>]*>([\s\S]*?)<\/div>/g)].map(m=>strip(m[2]));
  out[p]={title:t?strip(t[1]):null, mainImgs, des, text: /^\d+$/.test(p)?null:strip(c).slice(0,4000)};
}
fs.writeFileSync(S+'/crawl/extracted.json',JSON.stringify(out,null,1));
for(const [p,o] of Object.entries(out)) if(/^\d+$/.test(p)) console.log(p,'|',o.title,'| imgs',o.mainImgs.length,'| des',o.des.join(' / ').slice(0,200));
