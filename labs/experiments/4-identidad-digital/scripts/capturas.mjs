// Céluma · Experimento 04 · Capturas de la galería a 1440 y 390 px. Uso: node scripts/capturas.mjs [carpeta]
// Sin carpeta escribe en validacion/vistas (capturas de la ronda 2). El cierre usa validacion/vistas/cierre y guarda capturas.json.
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const E4 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ = path.resolve(E4, '../../..');
import { spawn } from 'node:child_process';
const srv=spawn('python3',['-m','http.server','8775','--bind','127.0.0.1'],{cwd:RAIZ,stdio:'ignore'});
await new Promise(r=>setTimeout(r,700));
const b=await chromium.launch();
const dir=process.argv[2]||'validacion/vistas'; fs.mkdirSync(path.join(E4,dir),{recursive:true});
const out=E4+'/'+dir+'/'; const medidas={fecha:new Date().toISOString(),navegador:'Chromium (Playwright de celuma-frontend) headless, macOS',servidor:'python3 -m http.server',vistas:{}};
for (const [w,h] of [[1440,900],[390,844]]) {
  const pg=await b.newPage({viewport:{width:w,height:h}});
  const err=[]; pg.on('pageerror',e=>err.push(String(e))); pg.on('console',m=>{if(m.type()==='error')err.push(m.text())}); pg.on('response',r=>{if(r.status()>=400)err.push(r.status()+' '+r.url())});
  await pg.goto('http://127.0.0.1:8775/labs/experiments/4-identidad-digital/');
  await pg.waitForFunction(()=>document.body.dataset.listo==='1');
  // forzar carga de imágenes lazy
  await pg.evaluate(async()=>{ for (let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,30));} window.scrollTo(0,0); });
  await pg.waitForTimeout(1500);
  const r=await pg.evaluate(()=>({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, rotas:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')), imgs:document.images.length, h:document.body.scrollHeight, anchos:[...document.querySelectorAll('section, .g-controles, table')].filter(e=>e.getBoundingClientRect().right>document.documentElement.clientWidth+1).map(e=>e.id||e.className).slice(0,8)}));
  console.log(w, JSON.stringify(r), 'errores', err); medidas.vistas[w]={...r, errores:err};
  await pg.screenshot({path: out+`galeria-${w}-inicio.png`});
  for (const id of ['direcciones','alternativas','recomendacion','refinamiento','r2-biblioteca','r2-aplicaciones','r2-antes-despues','r2-reglas','sistema','usos','kit','motion','evidencias','archivos','plan']) { await pg.evaluate((id)=>{document.documentElement.style.scrollBehavior='auto'; document.getElementById(id).scrollIntoView();}, id); await pg.waitForTimeout(400); await pg.screenshot({path: out+`galeria-${w}-${id}.png`}); }
  await pg.close();
}
await b.close(); srv.kill();
if (process.argv[2]) fs.writeFileSync(out+'capturas.json', JSON.stringify(medidas,null,1));
