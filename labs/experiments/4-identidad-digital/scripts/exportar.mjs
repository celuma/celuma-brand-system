// Céluma · Experimento 04 · Exportador de piezas (B ronda 2 aprobada en el laboratorio el 2026-10-07).
// Renderiza kit/pieza.html con el Chromium de Playwright que ya existe en celuma-frontend
// (no instala nada) y escribe PNG a tamaño de artboard, PDF vectorial con fuentes
// incrustadas y el resultado de las comprobaciones de composición.
//
// Uso (desde la carpeta del experimento):
//   node scripts/exportar.mjs comparacion          → exports/comparacion/<dir>/<pieza>__<formato>.png
//   node scripts/exportar.mjs kit [--pdf]          → exports/kit/<pieza>__<formato>.png (+ pdf/)
//   node scripts/exportar.mjs uno <pieza> <dir> <formato> [--guias]
//   Opción --revision añade guías y el rótulo de estado (vistas de revisión, nunca exports limpios).
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import * as T from './trabajos.mjs';

const E4 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ = path.resolve(E4, '../../..'); // celuma-brand-system
const REL = path.relative(RAIZ, E4).split(path.sep).join('/');
const args = process.argv.slice(2);
const modo = args[0] || 'comparacion';
const conPdf = args.includes('--pdf');
const revision = args.includes('--revision');

const libre = () => new Promise((res) => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });
const puerto = await libre();
const srv = spawn('python3', ['-m', 'http.server', String(puerto), '--bind', '127.0.0.1'], { cwd: RAIZ, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const BASE = `http://127.0.0.1:${puerto}/${REL}`;

let trabajos = [];
// La comparación conserva la B de la ronda 1 (antecedente): se dibuja con 'b1' y se guarda en la carpeta b/.
if (modo === 'comparacion') for (const d of T.DIRS) for (const [p, f] of T.COMPARACION) trabajos.push({ p, d: d === 'b' ? 'b1' : d, f, out: `exports/comparacion/${d}/${p}__${f}.png` });
else if (modo === 'kit') for (const [p, f, d = T.RECOMENDADA] of T.KIT) trabajos.push({ p, d, f, out: `exports/kit/${p}__${f}.png` });
else if (modo === 'ronda2') for (const [p, f] of T.RONDA2) trabajos.push({ p, d: 'b', f, out: `ronda-2/despues/${p}__${f}.png` });
else if (modo === 'uno') trabajos.push({ p: args[1], d: args[2], f: args[3], out: `validacion/tmp/${args[1]}__${args[2]}__${args[3]}${revision ? '__revision' : ''}.png` });

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const informe = [];
let fallos = 0;
for (const t of trabajos) {
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('requestfailed', (r) => errores.push('requestfailed ' + r.url()));
  page.on('response', (r) => { if (r.status() >= 400) errores.push(r.status() + ' ' + r.url()); });
  const q = `p=${t.p}&d=${t.d}&f=${t.f}${revision ? '&guias=1&revision=1' : ''}`;
  await page.setViewportSize({ width: 2000, height: 2000 });
  await page.goto(`${BASE}/kit/pieza.html#${q}`);
  await page.waitForFunction(() => document.body.dataset.listo === '1', null, { timeout: 30000 });
  const r = await page.evaluate(() => window.E4_RESULTADO);
  const pz = await page.$('.pz');
  const bb = await pz.boundingBox();
  const out = path.join(E4, t.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await pz.screenshot({ path: out });
  if (conPdf) {
    const pdf = out.replace(/\/([^/]+)\.png$/, '/pdf/$1.pdf');
    fs.mkdirSync(path.dirname(pdf), { recursive: true });
    await page.addStyleTag({ content: `@page{size:${bb.width}px ${bb.height}px;margin:0} html,body{background:none!important;padding:0!important} .aviso{display:none!important}` });
    await page.pdf({ path: pdf, width: `${bb.width}px`, height: `${bb.height}px`, printBackground: true, pageRanges: '1' });
  }
  const fuentes = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`));
  // Contraste sobre la composición final: cajas de cada línea de texto + un render del mismo lienzo sin texto.
  let textos = null;
  if (t.d === 'b' && (modo === 'kit' || modo === 'ronda2')) {
    textos = await page.evaluate(() => {
      const pz = document.querySelector('.pz'), b = pz.getBoundingClientRect();
      const sel = '.titulo,.display,.texto,.def,.lema,.eyebrow,.cta,.fuente,.cab-serie,.cab-num,.lista li,.valores-lista li,.permisos tr,.pasos-v li,.desliza,.quien,.indice,.destino-et,.destino-url,.nodo .et,.portada-texto,.tabla tr,.tabla-nota,.nota-tracker,.destacado-titulo,.firma-datos p,.serie';
      // Solo nodos de texto: cada tramo real de glifos, sin reglas, bordes ni marcas gráficas vecinas.
      const out = [];
      pz.querySelectorAll(sel).forEach((el) => {
        const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) {
          if (!n.textContent.trim()) continue;
          const host = n.parentElement, cs = getComputedStyle(host); const rg = document.createRange(); rg.selectNodeContents(n);
          [...rg.getClientRects()].filter((r) => r.width > 2 && r.height > 2).forEach((r) => out.push({ el: String(el.className).split(' ')[0] || el.tagName.toLowerCase(), color: cs.color, px: parseFloat(cs.fontSize), peso: +cs.fontWeight, x: Math.round(r.left - b.left), y: Math.round(r.top - b.top), w: Math.round(r.width), h: Math.round(r.height) }));
        }
      });
      return out.filter((o, i, a) => a.findIndex((q) => q.x === o.x && q.y === o.y && q.w === o.w) === i);
    });
    await page.addStyleTag({ content: '.pz, .pz * { color: transparent !important; -webkit-text-fill-color: transparent !important; }' });
    const sinTexto = path.join(E4, 'validacion/tmp/sin-texto', path.basename(out));
    fs.mkdirSync(path.dirname(sinTexto), { recursive: true });
    await pz.screenshot({ path: sinTexto });
  }
  const ok = r.ok && !errores.length;
  if (!ok) fallos++;
  informe.push({ ...t, ancho: bb.width, alto: bb.height, corto: r.corto, lineas: r.lineas, fuera: r.fuera, solapes: r.solapes, microcosmos: r.microcosmos, contraste: r.contraste, proteccion: r.proteccion, textos, errores, fuentesCargadas: [...new Set(fuentes)], ok });
  console.log(`${ok ? 'ok ' : 'XX '} ${t.d} ${t.p} ${t.f} ${bb.width}×${bb.height}${r.corto ? ' (condensada)' : ''}${ok ? '' : ' → ' + JSON.stringify({ l: r.lineas.filter((x) => !x.ok), f: r.fuera, s: r.solapes, m: r.microcosmos, c: (r.contraste || []).filter((x) => !x.ok), p: (r.proteccion || []).filter((x) => !x.ok), e: errores })}`);
  await page.close();
}
await browser.close();
srv.kill();
if (modo !== 'uno') {
  fs.mkdirSync(path.join(E4, 'validacion'), { recursive: true });
  fs.writeFileSync(path.join(E4, `validacion/exportar-${modo}.json`), JSON.stringify({ fecha: new Date().toISOString(), navegador: 'Chromium (Playwright de celuma-frontend), headless, macOS', total: informe.length, fallos, piezas: informe }, null, 1));
}
console.log(`\n${informe.length} piezas · ${fallos} con observaciones`);
