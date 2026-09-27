// Verificación del prototipo del experimento 01 (EXPLORACIÓN).
// Captura las vistas a 1440, 768 y 390 px y ejecuta comprobaciones automáticas:
// errores de consola y recursos, desbordamiento horizontal, banda de
// exploración visible, contraste de texto (WCAG 2.x calculado sobre colores
// computados), nombres accesibles, encabezados, recorrido con Tab y foco
// visible, y movimiento reducido. No sustituye a axe ni a un lector de pantalla.
//
// Uso (desde la raíz de celuma-brand-system, con el servidor estático activo):
//   node labs/experiments/1-frontend-refinement/scripts/verify.mjs ronda-1
// Variables: BASE (por defecto http://localhost:5050/labs/experiments/1-frontend-refinement/)
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const round = process.argv[2] || 'ronda';
const out = path.resolve(here, '../capturas', round);
fs.mkdirSync(out, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:5050/labs/experiments/1-frontend-refinement/';
const QUICK = process.env.QUICK === '1';

const SIZES = [
  { tag: '1440', width: 1440, height: 900 },
  { tag: '768', width: 768, height: 1024 },
  { tag: '390', width: 390, height: 844 },
];
const VIEWS = [
  { id: 'trabajo', url: '#/trabajo' },
  { id: 'orden', url: '#/ordenes/ORD-EJ-0044' },
  { id: 'informe', url: '#/informe?estado=IN_REVIEW&como=revisora' },
  { id: 'componentes', url: '#/componentes', full: true },
  { id: 'direcciones', url: 'direcciones.html', full: true },
];
// Estados extra (solo a algunas anchuras)
const EXTRA = [
  { id: 'trabajo-vacio', url: '#/trabajo?datos=vacio', sizes: ['1440', '390'] },
  { id: 'trabajo-error', url: '#/trabajo?datos=error', sizes: ['1440', '390'] },
  { id: 'trabajo-cargando', url: '#/trabajo?datos=cargando', sizes: ['1440'] },
  { id: 'trabajo-completadas-compacta', url: '#/trabajo?completadas=1&densidad=compacta', sizes: ['1440'] },
  { id: 'trabajo-notas', url: '#/trabajo?notas=1', sizes: ['1440'], full: true },
  { id: 'ordenes-lista', url: '#/ordenes', sizes: ['768', '390'] },
  { id: 'orden-cancelada', url: '#/ordenes/ORD-EJ-0033', sizes: ['1440'] },
  { id: 'orden-muestras', url: '#/ordenes/ORD-EJ-0044?tab=samples', sizes: ['1440', '390'] },
  { id: 'informe-borrador-autora', url: '#/informe?estado=DRAFT&como=patologa', sizes: ['1440'] },
  { id: 'informe-aprobado-revisora', url: '#/informe?estado=APPROVED&como=revisora', sizes: ['1440', '390'], full: true },
  { id: 'informe-aprobado-admin', url: '#/informe?estado=APPROVED&como=admin', sizes: ['1440'] },
  { id: 'informe-publicado', url: '#/informe?estado=PUBLISHED&como=revisora', sizes: ['1440', '768'] },
  { id: 'informe-retractado', url: '#/informe?estado=RETRACTED&como=patologa', sizes: ['1440'] },
];

const browser = await chromium.launch();
const results = { base: BASE, round, at: new Date().toISOString(), pages: [], keyboard: [], motion: null, dialog: null, drawer: null };

// ---------- comprobaciones en página ----------
async function audit(page) {
  return page.evaluate(() => {
    const lum = (rgb) => { const [r, g, b] = rgb.map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const parse = (s) => { const m = s.match(/[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); return { rgb: [r, g, b], a }; };
    const blend = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a));
    function bgOf(el) {
      const layers = [];
      for (let n = el; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('url(')) return { complex: true };
        const c = parse(cs.backgroundColor);
        if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
      }
      let base = [255, 255, 255];
      for (let i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base);
      return { rgb: base };
    }
    const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05; };
    const fails = [];
    let checked = 0; let reference = 0;
    const els = [...document.querySelectorAll('body *')].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
    for (const el of els) {
      if (!visible(el) || el.closest('[aria-hidden="true"]') || el.closest('.sr-only') || el.closest('.doc-watermark')) continue;
      if (el.closest('[data-reference="actual"]')) { reference++; continue; }
      if (el.closest('button:disabled, input:disabled, [aria-disabled="true"], .is-disabled')) continue;
      const cs = getComputedStyle(el);
      const fg = parse(cs.color); const bg = bgOf(el);
      if (!fg || bg.complex) continue;
      const fgc = blend(fg, bg.rgb);
      const [a, b] = [lum(fgc), lum(bg.rgb)].sort((x, y) => y - x);
      const ratio = (a + 0.05) / (b + 0.05);
      const size = parseFloat(cs.fontSize); const bold = Number(cs.fontWeight) >= 700;
      const large = size >= 24 || (bold && size >= 18.66);
      const min = large ? 3 : 4.5;
      checked++;
      if (ratio < min) fails.push({ text: el.textContent.trim().slice(0, 50), ratio: Math.round(ratio * 100) / 100, min, size, sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').join('.') : '') });
    }
    // nombres accesibles
    const unnamed = [...document.querySelectorAll('button, a[href], input, select, [role="switch"], [role="tab"]')].filter((el) => {
      if (!visible(el) && !el.closest('.sidebar')) return false;
      const name = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || '').trim();
      const lab = el.id && document.querySelector(`label[for="${el.id}"]`);
      return !name && !lab && !el.closest('label') && el.type !== 'hidden';
    }).map((el) => el.outerHTML.slice(0, 90));
    const imgsNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
    const h1 = document.querySelectorAll('h1').length;
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const xbar = document.querySelector('.xbar'); const xr = xbar?.getBoundingClientRect();
    const banner = !!xbar && /Exploración · no aprobada/i.test(xbar.textContent) && xr.top >= 0 && xr.top < 5 && visible(xbar);
    return { contrastReferenceSkipped: reference, contrastChecked: checked, contrastFails: fails.slice(0, 25), contrastFailCount: fails.length, unnamed, imgsNoAlt, h1, overflow, banner, lang: document.documentElement.lang };
  });
}

async function openPage(ctx, url) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
  page.on('requestfailed', (r) => { if (!r.url().includes('fonts.g')) errors.push('requestfailed: ' + r.url()); });
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  return { page, errors };
}

async function shoot(view, size) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
  const { page, errors } = await openPage(ctx, view.url);
  const a = await audit(page);
  const file = `${view.id}-${size.tag}.jpg`;
  await page.screenshot({ path: path.join(out, file), fullPage: !!view.full, type: 'jpeg', quality: 82 });
  results.pages.push({ view: view.id, size: size.tag, file, errors, ...a });
  await ctx.close();
}

for (const size of SIZES) for (const v of VIEWS) await shoot(v, size);
if (!QUICK) for (const e of EXTRA) for (const tag of e.sizes) await shoot(e, SIZES.find((s) => s.tag === tag));

// ---------- reajuste (WCAG 1.4.10): 320 px ≈ zoom 400 %, 640 px ≈ zoom 200 % ----------
results.reflow = [];
for (const w of [320, 640]) for (const v of VIEWS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const { page, errors } = await openPage(ctx, v.url);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  results.reflow.push({ view: v.id, width: w, overflow, errors: errors.length });
  await ctx.close();
}

// ---------- teclado: recorrido con Tab y foco visible ----------
async function keyboardWalk(url, size, steps = 45) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, locale: 'es-MX' });
  const { page } = await openPage(ctx, url);
  const seq = [];
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const box = el.closest('.field-box');
      const bcs = box ? getComputedStyle(box) : null;
      const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2) || (bcs && bcs.boxShadow !== 'none');
      const r = el.getBoundingClientRect();
      const inView = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
      const name = (el.getAttribute('aria-label') || el.textContent || el.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      return { tag: el.tagName.toLowerCase(), name, ring, inView, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}` };
    });
    if (info) seq.push(info);
  }
  results.keyboard.push({ url, size: size.tag, steps: seq.length, withoutRing: seq.filter((s) => !s.ring), outOfView: seq.filter((s) => !s.inView), order: seq.map((s) => `${s.tag}:${s.name}`) });
  await ctx.close();
}
await keyboardWalk('#/trabajo', SIZES[0]);
await keyboardWalk('#/ordenes/ORD-EJ-0044', SIZES[0], 40);
await keyboardWalk('#/informe?estado=APPROVED&como=revisora', SIZES[0], 30);
await keyboardWalk('#/trabajo', SIZES[2], 25);

// ---------- pestañas con flechas ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const { page } = await openPage(ctx, '#/ordenes/ORD-EJ-0044');
  await page.focus('#tab-timeline');
  await page.keyboard.press('ArrowRight');
  const sel = await page.evaluate(() => ({ focused: document.activeElement.id, selected: document.querySelector('[role=tab][aria-selected=true]').id, visiblePanel: [...document.querySelectorAll('[role=tabpanel]')].find((p) => !p.hidden)?.id }));
  results.tabs = sel;
  await ctx.close();
}

// ---------- diálogo de confirmación (foco y Escape) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const { page } = await openPage(ctx, '#/informe?estado=APPROVED&como=revisora');
  await page.click('[data-action="sign"]');
  await page.waitForTimeout(200);
  const open = await page.evaluate(() => ({ open: document.querySelector('#dlg').open, focusInside: document.querySelector('#dlg').contains(document.activeElement) }));
  await page.screenshot({ path: path.join(out, 'informe-dialogo-firmar-1440.jpg'), type: 'jpeg', quality: 82 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  const after = await page.evaluate(() => ({ open: document.querySelector('#dlg').open, focusReturned: document.activeElement?.dataset?.action || document.activeElement?.tagName }));
  // Confirmar: estado visual resultante
  await page.click('[data-action="sign"]');
  await page.click('#dlg button[value="ok"]');
  await page.waitForTimeout(250);
  const busy = await page.evaluate(() => document.querySelector('[data-action="sign"]')?.getAttribute('aria-busy'));
  await page.screenshot({ path: path.join(out, 'informe-firmando-1440.jpg'), type: 'jpeg', quality: 82 });
  await page.waitForTimeout(1600);
  const status = await page.evaluate(() => document.querySelector('.page-head .chip')?.textContent.trim());
  results.dialog = { ...open, afterEscape: after, busyDuringSign: busy, statusAfter: status };
  await ctx.close();
}

// ---------- cajón de navegación en móvil ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const { page } = await openPage(ctx, '#/trabajo');
  await page.click('#menu-btn');
  await page.waitForTimeout(350);
  const st = await page.evaluate(() => ({ expanded: document.querySelector('#menu-btn').getAttribute('aria-expanded'), focus: document.activeElement?.textContent?.trim().slice(0, 30), open: document.querySelector('#sidebar').dataset.open }));
  await page.screenshot({ path: path.join(out, 'menu-movil-390.jpg'), type: 'jpeg', quality: 82 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const closed = await page.evaluate(() => ({ open: document.querySelector('#sidebar').dataset.open, focus: document.activeElement?.id }));
  results.drawer = { ...st, afterEscape: closed };
  await ctx.close();
}

// ---------- movimiento reducido ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const { page } = await openPage(ctx, '#/trabajo?datos=cargando');
  results.motion = await page.evaluate(() => ({
    btnTransition: getComputedStyle(document.querySelector('.btn, .next-card')).transitionDuration,
    skelAnimation: getComputedStyle(document.querySelector('.skel')).animationName,
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));
  await ctx.close();
}

await browser.close();

// ---------- resumen ----------
const sum = {
  pages: results.pages.length,
  withErrors: results.pages.filter((p) => p.errors.length).map((p) => `${p.view}@${p.size}: ${p.errors.join(' | ')}`),
  overflow: results.pages.filter((p) => p.overflow > 0).map((p) => `${p.view}@${p.size}: ${p.overflow}px`),
  bannerMissing: results.pages.filter((p) => !p.banner).map((p) => `${p.view}@${p.size}`),
  contrast: results.pages.filter((p) => p.contrastFailCount).map((p) => `${p.view}@${p.size}: ${p.contrastFailCount} (${p.contrastFails.slice(0, 4).map((f) => `"${f.text}" ${f.ratio}`).join('; ')})`),
  contrastChecked: results.pages.reduce((n, p) => n + p.contrastChecked, 0),
  unnamed: results.pages.filter((p) => p.unnamed.length).map((p) => `${p.view}@${p.size}: ${p.unnamed.length}`),
  h1: results.pages.filter((p) => p.h1 !== 1).map((p) => `${p.view}@${p.size}: ${p.h1}`),
  keyboard: results.keyboard.map((k) => `${k.url}@${k.size}: ${k.steps} paradas, sin anillo ${k.withoutRing.length}, fuera de vista ${k.outOfView.length}`),
  reflow: results.reflow.filter((r) => r.overflow > 0 || r.errors).map((r) => `${r.view}@${r.width}: ${r.overflow}px, errores ${r.errors}`),
  reflowChecked: results.reflow.length,
  tabs: results.tabs, dialog: results.dialog, drawer: results.drawer, motion: results.motion,
};
results.summary = sum;
fs.writeFileSync(path.join(out, 'verificacion.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(sum, null, 2));
