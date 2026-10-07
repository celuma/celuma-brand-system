// Céluma · Experimento 04 · Biblioteca de recursos (CANDIDATA): SVG autónomos + PNG de trabajo.
// Los recursos salen de las mismas funciones que dibujan las piezas (kit/piezas.js), con los colores
// resueltos a hexadecimal para que el SVG no dependa de hojas de estilo, fuentes ni rutas externas.
// Ningún recurso contiene partes del logo: el logo se usa siempre completo desde kit/marca/.
// Uso: node scripts/recursos.mjs
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const E4 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const f of ['formatos.js', 'contenido.js', 'microcosmos.js', 'piezas.js']) vm.runInThisContext(fs.readFileSync(path.join(E4, 'kit', f), 'utf8'), { filename: f });
const { E4: M } = globalThis;

// Colores del sistema candidato (kit/sistema.css)
const css = fs.readFileSync(path.join(E4, 'kit', 'sistema.css'), 'utf8');
const VARS = Object.fromEntries([...css.matchAll(/--(e4-[\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
const resolver = (s) => s.replace(/var\(--(e4-[\w-]+)\)/g, (_, k) => VARS[k]);
const ESTADO = 'Recurso candidato del experimento 04 · pendiente de aprobación de Rafael · no es un asset canónico.';
const envolver = (svg, titulo, desc) => svg.replace(/^<svg ([^>]*)>/, (_, a) => `<svg xmlns="http://www.w3.org/2000/svg" ${a.replace(/ ?aria-hidden="true"/, '').replace(/ ?class="[^"]*"/, '')} role="img"><title>${titulo}</title><desc>${desc} ${ESTADO}</desc>`);

const DIR = path.join(E4, 'recursos');
const SVG = path.join(DIR, 'svg'), PNG = path.join(DIR, 'png');
for (const d of [SVG, PNG, path.join(SVG, 'iconos'), path.join(PNG, 'iconos')]) fs.mkdirSync(d, { recursive: true });
const lista = [];
const guardar = (rel, svg, uso, png = { ancho: 2048 }) => { fs.writeFileSync(path.join(SVG, rel), svg); lista.push({ rel, uso, png }); };

// 1 · Cuadrícula Orden (módulo de B): crema y navy, varias proporciones
const navy = (s) => s.replace(new RegExp(VARS['e4-menta-suave'], 'g'), '#16283A');
for (const [cols, filas, foco, nombre] of [[10, 3, 13, 'cuadricula-orden-10x3'], [6, 5, 14, 'cuadricula-orden-6x5'], [8, 2, 5, 'cuadricula-orden-8x2']]) {
  const base = resolver(M.cuadricula(cols, filas, foco));
  const desc = `Cuadrícula de células ordenadas (${cols} × ${filas}); una sola célula foco en salmón. Diagrama decorativo derivado de «Orden» (03), nunca micrografía.`;
  guardar(`${nombre}-crema.svg`, envolver(base, `Céluma · cuadrícula Orden ${cols}×${filas} · para fondo crema`, desc), 'Módulo visual de la dirección Ficha sobre crema o blanco.');
  guardar(`${nombre}-navy.svg`, envolver(navy(base), `Céluma · cuadrícula Orden ${cols}×${filas} · para fondo navy`, desc), 'Módulo visual sobre navy (portadas, cierres, anuncios).');
}
// 2 · Regla salmón (eco del borde del PageHeader de la app)
guardar('regla-salmon-vertical.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 300" width="10" height="300" role="img"><title>Céluma · regla salmón vertical</title><desc>Regla de borde que marca el bloque del mensaje principal. Grosor = S × 0,0095. ${ESTADO}</desc><rect width="10" height="300" fill="${VARS['e4-nucleo']}"/></svg>`, 'Borde izquierdo del bloque principal; una por pieza.', { ancho: 40 });
// 3 · Rastreador de pasos sin rótulos (los rótulos se escriben en la pieza)
const rastreador = (n, actual) => {
  const g = 200, r = 22, w = n * g, h = 60, y = 30;
  let s = `<line x1="${g / 2}" y1="${y}" x2="${w - g / 2}" y2="${y}" stroke="${VARS['e4-membrana']}" stroke-width="4"/>`;
  for (let i = 1; i <= n; i++) {
    const cx = (i - 0.5) * g;
    if (i === actual) s += `<circle cx="${cx}" cy="${y}" r="${r * 1.25}" fill="${VARS['e4-nucleo']}"/>`;
    else s += `<circle cx="${cx}" cy="${y}" r="${r}" fill="${i < actual ? VARS['e4-membrana'] : VARS['e4-menta-suave']}" stroke="${VARS['e4-membrana']}" stroke-width="4.5"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"><title>Céluma · rastreador de ${n} pasos · paso actual ${actual || 'ninguno'}</title><desc>Indica en qué paso de un flujo está la lámina. Sin colores de estado de la app: teal = hecho, salmón = actual, menta = pendiente. ${ESTADO}</desc>${s}</svg>`;
};
for (const a of [0, 1, 2, 3, 4]) guardar(`rastreador-4-pasos-${a}.svg`, rastreador(4, a), 'Rastreador de pasos para carruseles y flujos; los rótulos se escriben en la pieza.');
// 4 · Iconos de contorno (retícula 24, trazo 2, extremos redondeados)
for (const [n, d] of Object.entries(M.ICONOS)) {
  guardar(`iconos/icono-${n}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${VARS['e4-tinta']}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img"><title>Céluma · icono ${n}</title><desc>Icono de contorno candidato. Un concepto = un icono; no usar emoji. ${ESTADO}</desc>${d}</svg>`, `Icono «${n}».`, { ancho: 512 });
}

// ---------------- Ronda 2 · fondos rescatados y biblioteca Microcosmos ----------------
const MC = globalThis.E4MC;
const FON = path.join(DIR, 'fondos'), MIC = path.join(DIR, 'microcosmos');
for (const d of [path.join(FON, 'svg'), path.join(FON, 'png'), path.join(MIC, 'svg'), path.join(MIC, 'png')]) fs.mkdirSync(d, { recursive: true });
const ESTADO2 = 'Ronda 2 del experimento 04 · candidato pendiente de aprobación de Rafael · no es un asset canónico.';
const listaR2 = [];
const FMT = { '1x1': [1080, 1080], '4x5': [1080, 1350], '9x16': [1080, 1920], '16x9': [1920, 1080] };
for (const f of ['papel', 'papel-suave', 'navy', 'navy-suave']) for (const [fid, [W, H]] of Object.entries(FMT)) {
  const nombre = `fondo-${f}-${fid}`;
  const svg = MC.svgFondo(f, W, H, nombre.replace(/[^a-z0-9]/g, '')).replace('<svg class="fondo" ', '<svg ').replace(' aria-hidden="true">', ` role="img"><title>Céluma · fondo ${MC.FONDOS[f].nombre} · ${fid}</title><desc>Versión local de ${f.startsWith('navy') ? '«02 · Navy» (PatternNavy)' : '«01 · Papel cream» (PatternCream)'} con el perfil de CelBlob, adaptada a ${W} × ${H}. ${ESTADO2}</desc>`);
  fs.writeFileSync(path.join(FON, 'svg', nombre + '.svg'), svg);
  listaR2.push({ tipo: 'fondo', id: nombre, svg: path.join(FON, 'svg', nombre + '.svg'), png: path.join(FON, 'png', nombre + '.png'), W, H, transparente: false, uso: `Fondo ${MC.FONDOS[f].nombre} para ${fid}.` });
}
const tamR = [2400, 1800];
for (const rec of MC.CATALOGO) for (const tono of ['claro', 'oscuro']) {
  const [W, H] = tamR; const d = rec.dibujar(W, H, tono);
  const nombre = `${rec.id}-${tono}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><title>Céluma · Microcosmos · ${rec.nombre} · ${tono === 'claro' ? 'para fondos claros' : 'para fondos navy'}</title><desc>${rec.intencion} Reglas: ${rec.reglas} Fondos: ${rec.fondos} ${ESTADO2}</desc>${d.svg}</svg>`;
  fs.writeFileSync(path.join(MIC, 'svg', nombre + '.svg'), svg);
  listaR2.push({ tipo: 'microcosmos', id: nombre, recurso: rec.id, familia: rec.familia, svg: path.join(MIC, 'svg', nombre + '.svg'), png: path.join(MIC, 'png', nombre + '.png'), muestra: path.join(MIC, 'png', nombre + '-muestra.png'), W, H, tono, transparente: true, uso: rec.intencion, exclusion: d.excl.map((r) => r.map((v) => Math.round(v))) });
}
fs.writeFileSync(path.join(MIC, 'catalogo.json'), JSON.stringify({ estado: ESTADO2, peso_base: 'S × 0,0055', paleta: MC.C, tonos: MC.TONOS, recursos: MC.CATALOGO.map(({ dibujar, ...r }) => r) }, null, 1));

// PNG de trabajo con Chromium (fondo transparente)
const browser = await chromium.launch();
const page = await browser.newPage();
for (const it of lista) {
  const svg = fs.readFileSync(path.join(SVG, it.rel), 'utf8');
  const vb = svg.match(/viewBox="([\d.\s-]+)"/)[1].split(/\s+/).map(Number);
  const W = it.png.ancho, H = Math.round(W * vb[3] / vb[2]);
  await page.setViewportSize({ width: W, height: Math.max(H, 1) });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${W}" height="${H}"`)}</body></html>`);
  const out = path.join(PNG, it.rel.replace(/\.svg$/, '.png'));
  await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
  it.pngArchivo = path.relative(E4, out); it.pngTam = [W, H];
}
// Ronda 2: PNG de fondos y microcosmos; comprobación de que el SVG autónomo (como <img>) coincide con el render en línea.
const fidelidad = [];
for (const it of listaR2) {
  const svg = fs.readFileSync(it.svg, 'utf8');
  await page.setViewportSize({ width: it.W, height: it.H });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  const enLinea = await page.screenshot({ omitBackground: it.transparente, clip: { x: 0, y: 0, width: it.W, height: it.H } });
  fs.writeFileSync(it.png, enLinea);
  if (it.tipo === 'microcosmos') {
    // Muestra de previsualización a 1200 × 900 sobre su fondo (el recurso se redibuja a ese tamaño)
    const fondo = it.tono === 'oscuro' ? 'navy' : 'papel'; const rec = MC.CATALOGO.find((r) => r.id === it.recurso);
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.setContent(`<html><body style="margin:0">${MC.svgFondo(fondo, 1200, 900, 'm').replace('</svg>', rec.dibujar(1200, 900, it.tono).svg + '</svg>')}</body></html>`);
    await page.screenshot({ path: it.muestra, clip: { x: 0, y: 0, width: 1200, height: 900 } });
    await page.setViewportSize({ width: it.W, height: it.H });
  }
  // Como archivo (<img>): misma imagen que en línea → el SVG no depende de la página
  await page.setContent(`<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" width="${it.W}" height="${it.H}" style="display:block"></body></html>`);
  await page.waitForFunction(() => document.images[0].complete);
  const comoImg = await page.screenshot({ omitBackground: it.transparente, clip: { x: 0, y: 0, width: it.W, height: it.H } });
  fidelidad.push({ id: it.id, identico: Buffer.compare(enLinea, comoImg) === 0 });
}
await browser.close();
for (const it of listaR2) { it.svg = path.relative(E4, it.svg); it.png = path.relative(E4, it.png); if (it.muestra) it.muestra = path.relative(E4, it.muestra); }
const problemasR2 = listaR2.filter((it) => { const t = fs.readFileSync(path.join(E4, it.svg), 'utf8'); return /href=|<image|<text|var\(|url\((?!#)/.test(t); }).map((x) => x.id);
fs.writeFileSync(path.join(DIR, 'ronda-2.json'), JSON.stringify({ estado: ESTADO2, recursos: listaR2, problemas: problemasR2, img_igual_a_en_linea: { total: fidelidad.length, identicos: fidelidad.filter((x) => x.identico).length, distintos: fidelidad.filter((x) => !x.identico).map((x) => x.id) } }, null, 1));
console.log(`ronda 2: ${listaR2.length} recursos · problemas: ${problemasR2.length ? problemasR2.join(', ') : 'ninguno'} · <img> = en línea: ${fidelidad.filter((x) => x.identico).length}/${fidelidad.length}`);
// Comprobación: sin referencias externas, sin <image>, sin <text>, sin var(
const problemas = lista.filter((it) => /href=|<image|<text|var\(|url\(/.test(fs.readFileSync(path.join(SVG, it.rel), 'utf8'))).map((x) => x.rel);
fs.writeFileSync(path.join(DIR, 'recursos.json'), JSON.stringify({ estado: ESTADO, colores: VARS, recursos: lista.map((x) => ({ svg: 'recursos/svg/' + x.rel, png: x.pngArchivo, pngTam: x.pngTam, uso: x.uso })), problemas }, null, 1));
console.log(`${lista.length} recursos · problemas: ${problemas.length ? problemas.join(', ') : 'ninguno'}`);
