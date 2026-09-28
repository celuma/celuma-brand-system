// Verificación de la exploración de estados (EXPLORACIÓN, no aprobada).
// - Capturas 1:1 (DPR 1) de cada contexto por variante → capturas/contextos/
// - Vista móvil real a 390 × 844 por variante → capturas/movil-390/
// - Página completa a 1440 y 390; contextos en color, grises y deuteranopía
// - Recortes de chips a 3× para medición en píxeles → capturas/chips/ (los mide measure.py)
// - Errores de consola y recursos, desbordamiento, contraste y consistencia (de la página)
// Uso (desde la raíz de celuma-brand-system, con el servidor estático activo):
//   node labs/experiments/1-frontend-refinement/exploraciones/estados/scripts/verify-estados.mjs
import { chromium } from '../../../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cap = path.resolve(here, '../capturas');
for (const d of ['contextos', 'movil-390', 'chips', 'pagina']) fs.mkdirSync(path.join(cap, d), { recursive: true });
const BASE = process.env.BASE || 'http://localhost:5050/labs/experiments/1-frontend-refinement/exploraciones/estados/';
const VARS = ['r2', 'r3', 'v1', 'v2', 'v3', 'v4', 'v5', 'rec'];
const CTX = ['tabla', 'trabajo', 'ficha', 'movil'];
const res = { base: BASE, at: new Date().toISOString(), errors: [], pages: [], movil: [], dense: [], checks: null };

const browser = await chromium.launch();
async function open(url, { width = 1440, height = 900, dpr = 1 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, locale: 'es-MX' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(`${m.type()}: ${m.text().slice(0, 160)}`); });
  page.on('response', (r) => { if (r.status() >= 400) errs.push(`http ${r.status()} ${r.url()}`); });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  return { ctx, page, errs };
}
// En recortes de elementos, la banda y la barra fijas se superpondrían: se vuelven estáticas.
// Las capturas de página completa las conservan (la banda queda arriba).
async function unstick(page) {
  await page.addStyleTag({ content: '.xbar, .x-bar { position: static !important; }' });
}

// 1) Página completa y comprobaciones calculadas por la propia página
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const { ctx, page, errs } = await open('#izq=r3&der=rec&vista=color', { width: w, height: h });
  const info = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, banner: /Exploración · no aprobada/.test(document.querySelector('.xbar')?.textContent || '') }));
  if (w === 1440) res.checks = await page.evaluate(() => window.__estadosChecks);
  await page.screenshot({ path: path.join(cap, 'pagina', `pagina-${w}.jpg`), fullPage: true, type: 'jpeg', quality: 80 });
  res.pages.push({ width: w, ...info, errors: errs });
  await ctx.close();
}

// 2) Contextos 1:1 por variante (lado derecho de la comparación), en color
for (const v of VARS) {
  const { ctx, page, errs } = await open(`#izq=r3&der=${v}&vista=color`);
  await unstick(page);
  for (const c of CTX) {
    const el = page.locator(`#${c} [data-side="der"] .x-frame > *`).first();
    await el.screenshot({ path: path.join(cap, 'contextos', `${c}-${v}.png`) });
  }
  // Tabla densa: alto de filas y ancho de la columna «Informe»
  res.dense.push({ v, ...(await page.evaluate(() => {
    const t = document.querySelector('#tabla [data-side="der"] table');
    const rows = [...t.querySelectorAll('tbody tr')].map((r) => Math.round(r.getBoundingClientRect().height));
    const col = t.querySelector('thead th:last-child').getBoundingClientRect().width;
    const frame = document.querySelector('#tabla [data-side="der"] .x-frame');
    return { rowHeights: rows, maxRow: Math.max(...rows), informeCol: Math.round(col), tableScroll: frame.scrollWidth - frame.clientWidth };
  })) });
  if (errs.length) res.errors.push(`${v}: ${errs.join(' | ')}`);
  await ctx.close();
}

// 3) Filtros de visión: la comparación R3 | V2+ en grises y deuteranopía
for (const vista of ['gris', 'deut', 'prot']) {
  const { ctx, page } = await open(`#izq=r3&der=rec&vista=${vista}`);
  await unstick(page);
  for (const c of ['tabla', 'ficha']) await page.locator(`#${c} .x-duo`).screenshot({ path: path.join(cap, 'pagina', `${c}-r3-vs-rec-${vista}.png`) });
  await page.locator('#matrix').screenshot({ path: path.join(cap, 'pagina', `matriz-${vista}.png`) });
  await ctx.close();
}
{
  const { ctx, page } = await open('#izq=r3&der=rec&vista=color');
  await unstick(page);
  await page.locator('#matrix').screenshot({ path: path.join(cap, 'pagina', 'matriz-color.png') });
  for (const c of ['tabla', 'ficha']) await page.locator(`#${c} .x-duo`).screenshot({ path: path.join(cap, 'pagina', `${c}-r3-vs-rec-color.png`) });
  await ctx.close();
}

// 4) Móvil real a 390 × 844 por variante
for (const v of VARS) {
  const { ctx, page, errs } = await open(`#solo=movil&v=${v}`, { width: 390, height: 844 });
  const m = await page.evaluate(() => {
    const els = [document.documentElement, ...document.querySelectorAll('.phone, .phone *')];
    const worst = els.reduce((acc, el) => { const o = el.scrollWidth - el.clientWidth; return o > acc.o ? { o, el: el.className?.baseVal ?? el.className } : acc; }, { o: 0, el: '' });
    const chips = [...document.querySelectorAll('.chip')].map((c) => c.getBoundingClientRect());
    const vw = document.documentElement.clientWidth;
    return { pageOverflow: document.documentElement.scrollWidth - vw, worstInner: worst, chipsOutside: chips.filter((r) => r.right > vw + 0.5).length, banner: !!document.querySelector('.xbar-tag') };
  });
  await page.screenshot({ path: path.join(cap, 'movil-390', `movil-${v}.png`), fullPage: true });
  res.movil.push({ v, ...m, errors: errs });
  await ctx.close();
}

// 5) Chips a 3× para medición en píxeles (fila de la matriz)
{
  const { ctx, page } = await open('#izq=r3&der=rec&vista=color', { dpr: 3 });
  await unstick(page);
  for (const v of VARS) {
    for (const [d, s, n] of [['report', 'APPROVED', 'aprobado'], ['report', 'PUBLISHED', 'publicado'], ['sample', 'READY', 'lista'], ['order', 'RELEASED', 'liberada']]) {
      await page.locator(`#matrix tr[data-v="${v}"] [data-domain="${d}"][data-status="${s}"]`).screenshot({ path: path.join(cap, 'chips', `${v}-${n}.png`) });
    }
  }
  await ctx.close();
}

await browser.close();
fs.writeFileSync(path.join(cap, 'verificacion.json'), JSON.stringify(res, null, 2));
console.log(JSON.stringify({
  pages: res.pages.map((p) => `${p.width}: overflow ${p.overflow}px, banda ${p.banner}, errores ${p.errors.length}`),
  errors: res.errors,
  movil: res.movil.map((m) => `${m.v}: página ${m.pageOverflow}px, interior ${m.worstInner.o}px, chips fuera ${m.chipsOutside}, errores ${m.errors.length}`),
  dense: res.dense.map((d) => `${d.v}: fila máx ${d.maxRow}px, col. Informe ${d.informeCol}px, scroll ${d.tableScroll}px`),
  checks: res.checks?.map((c) => `${c.id}: texto ${c.minText.toFixed(2)} icono ${c.minGlyph.toFixed(2)} incoherente [${c.incoherent}] móvil ${c.phoneOverflow} ancho Aprobado ${Math.round(c.aprLabel)}`),
}, null, 2));
