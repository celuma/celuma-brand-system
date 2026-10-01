// Experimento 03 · prueba de la galería en servidores reales (exploración, no aprobada).
// Uso: node page_check.mjs [urlBase ...]
//   Sin argumentos arranca `python3 -m http.server` en un puerto libre desde la raíz de celuma-brand-system.
//   Con argumentos (p. ej. http://localhost:5050 · npx serve, que quita .html e index) prueba también esos servidores.
// Comprueba: entradas directas (carpeta con y sin barra, index.html, consulta y fragmento), clic desde el laboratorio y
// de vuelta, recursos 404, errores de consola, desbordamiento a 1440 y 390 px, controles, pestañas de contexto,
// comparación con 02 y movimiento reducido (sistema emulado y botón). Escribe validation/pagecheck.json y capturas en vistas/.
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const E3 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(E3, '..', '..', '..');
const P03 = '/labs/experiments/3-logo-motion';
const free = () => new Promise((res) => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });

let py = null;
const bases = process.argv.slice(2);
if (!bases.length || bases.includes('--python')) {
  const port = await free();
  py = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 900));
  bases.unshift(`http://127.0.0.1:${port}`);
}
const servers = bases.filter((b) => b !== '--python');
const browser = await chromium.launch();
const out = { date: new Date().toISOString(), servers: {}, notes: [] };
fs.mkdirSync(path.join(E3, 'vistas'), { recursive: true });

async function open(ctx, url) {
  const page = await ctx.newPage();
  const errors = [], missing = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) missing.push(`${r.status()} ${r.url()}`); });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1' || document.getElementById('m-fetch-banner')?.hidden === false, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(700);
  return { page, errors, missing };
}
const state = (page) => page.evaluate(() => ({
  url: location.href, ready: document.documentElement.dataset.ready === '1', title: document.title,
  overflow: document.documentElement.scrollWidth - innerWidth,
  lottieSvgs: document.querySelectorAll('.m-slot > svg, .m-slot svg[preserveAspectRatio]').length,
  shadowHosts: [...document.querySelectorAll('.m-slot')].filter((e) => e.shadowRoot).length,
  running: [...document.querySelectorAll('.m-slot')].reduce((n, e) => n + (e.shadowRoot ? e.shadowRoot.getAnimations().filter((a) => a.playState === 'running').length : 0), 0),
  brokenImgs: [...document.images].filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
  reducedBanner: !document.getElementById('m-reduced-banner').hidden,
}));

for (const base of servers) {
  const R = out.servers[base] = { entries: {}, flows: {}, viewports: {}, reduced: {}, controls: {} };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  // 1 · entradas directas
  for (const [k, u] of Object.entries({ carpeta: `${P03}/`, sinBarra: P03, indexHtml: `${P03}/index.html`, consulta: `${P03}/?fondo=navy#comparar` })) {
    const { page, errors, missing } = await open(ctx, base + u);
    if (u.includes('#')) await page.waitForTimeout(900);     // el ancla se reaplica al terminar de construir (≤ 600 ms)
    const s = await state(page);
    const hashOk = u.includes('#') ? await page.evaluate(() => { const t = document.getElementById('comparar'); const top = t.getBoundingClientRect().top;
      const navy = [...document.querySelectorAll('.m-dir .m-stage')].every((s) => s.dataset.bg === 'navy');
      return location.hash === '#comparar' && location.search === '?fondo=navy' && top >= 0 && top < 260 && navy; }) : null;
    R.entries[k] = { ...s, errors, missing: missing.filter((m) => !/favicon/.test(m)), hashOk };
    await page.close();
  }
  // 2 · recorrido desde el laboratorio y de vuelta, con clics
  {
    const { page, errors, missing } = await open(ctx, base + '/labs/');
    await page.getByRole('link', { name: 'Abrir motion' }).click();
    await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 15000 }).catch(() => {});
    const s1 = await state(page);
    await page.getByRole('link', { name: '← Laboratorio' }).click();
    await page.waitForLoadState('load');
    const back = await page.evaluate(() => ({ url: location.href, h1: document.querySelector('h1')?.textContent, css: getComputedStyle(document.body).backgroundColor }));
    await page.goBack(); await page.waitForTimeout(800);
    await page.getByRole('link', { name: '02 · Motion anterior' }).click();
    await page.waitForLoadState('load'); await page.waitForTimeout(800);
    const to02 = await page.evaluate(() => ({ url: location.href, h1: document.querySelector('h1')?.textContent }));
    R.flows.labTo03 = { landed: s1.url, ready: s1.ready, back, to02, errors, missing };
    await page.close();
  }
  // 3 · escritorio y móvil, controles, pestañas
  for (const [vp, size] of Object.entries({ 1440: { width: 1440, height: 900 }, 390: { width: 390, height: 844 } })) {
    const c2 = await browser.newContext({ viewport: size, deviceScaleFactor: 1 });
    const { page, errors, missing } = await open(c2, base + P03 + '/');
    const s = await state(page);
    await page.screenshot({ path: path.join(E3, 'vistas', `galeria-${vp}.jpg`), fullPage: true, type: 'jpeg', quality: 70 });
    const tabs = {};
    for (const t of ['carga', 'espera', 'acceso', 'bienvenida', 'landing', 'material']) {
      await page.click(`#tab-${t}`); await page.waitForTimeout(t === 'carga' ? 2200 : 1300);
      tabs[t] = await page.evaluate((t) => { const p = document.getElementById('ctx-' + t); return { visible: !p.hidden, h: p.offsetHeight, overflow: document.documentElement.scrollWidth - innerWidth }; }, t);
      if (vp === '1440') await page.locator('#ctx-' + t).screenshot({ path: path.join(E3, 'vistas', `contexto-${t}.jpg`), type: 'jpeg', quality: 72 });
    }
    R.viewports[vp] = { ...s, tabs, errors, missing };
    if (vp === '1440') {
      // controles globales
      const c = {};
      await page.click('[data-bg="navy"]'); await page.waitForTimeout(900);
      c.bgNavy = await page.evaluate(() => [...document.querySelectorAll('.m-dir .m-stage')].every((s) => s.dataset.bg === 'navy'));
      await page.click('[data-subject="lockup-h"]'); await page.waitForTimeout(900);
      c.subjectH = await page.evaluate(() => document.querySelector('#d-brote .m-readout').textContent);
      await page.click('[data-speed="0.5"]'); c.speed = await page.evaluate(() => document.querySelector('[data-speed="0.5"]').getAttribute('aria-pressed'));
      await page.click('[data-act="toggle"]'); await page.waitForTimeout(300);
      const t0 = await page.evaluate(() => document.querySelector('#d-brote .m-readout').textContent); await page.waitForTimeout(600);
      const t1 = await page.evaluate(() => document.querySelector('#d-brote .m-readout').textContent);
      c.pauseHolds = t0 === t1; await page.click('[data-act="toggle"]');
      await page.selectOption('#cmp-b', 'trazo'); await page.waitForTimeout(900);
      c.compare02 = await page.evaluate(() => document.getElementById('cmp-note-b').textContent);
      await page.click('[data-act="reduced"]'); await page.waitForTimeout(1200);
      c.forcedReduced = await state(page);
      await page.screenshot({ path: path.join(E3, 'vistas', 'galeria-reducido-navy.jpg'), type: 'jpeg', quality: 70 });
      R.controls = c;
    }
    await c2.close();
  }
  // 4 · movimiento reducido del sistema
  {
    const c3 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const { page, errors } = await open(c3, base + P03 + '/#d-brote');
    await page.waitForTimeout(1200);
    R.reduced = { ...(await state(page)), errors };
    await c3.close();
  }
  // 5 · reproducción: intervalos de rAF con toda la galería activa (indicativo)
  {
    const c4 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const { page } = await open(c4, base + P03 + '/#direcciones');
    R.raf = await page.evaluate(() => new Promise((res) => { const d = []; let l = performance.now(); const t0 = l;
      const f = (t) => { d.push(t - l); l = t; if (t - t0 < 3000) requestAnimationFrame(f); else { d.sort((a, b) => a - b); res({ frames: d.length, median: +d[d.length >> 1].toFixed(2), p95: +d[Math.floor(d.length * 0.95)].toFixed(2), over20: d.filter((x) => x > 20).length }); } };
      requestAnimationFrame(f); }));
    await c4.close();
  }
  await ctx.close();
}
await browser.close();
if (py) py.kill();
fs.writeFileSync(path.join(E3, 'validation', 'pagecheck.json'), JSON.stringify(out, null, 1));
for (const [b, R] of Object.entries(out.servers)) {
  console.log('==', b);
  for (const [k, e] of Object.entries(R.entries)) console.log(' entrada', k, e.url, 'ready', e.ready, 'overflow', e.overflow, 'err', e.errors.length, 'missing', e.missing.length, e.hashOk ?? '');
  console.log(' lab→03', R.flows.labTo03.landed, R.flows.labTo03.ready, '| volver', R.flows.labTo03.back.url, R.flows.labTo03.back.h1, '| 02', R.flows.labTo03.to02.url);
  for (const [vp, v] of Object.entries(R.viewports)) console.log(' vp', vp, 'overflow', v.overflow, 'lottie', v.lottieSvgs, 'shadow', v.shadowHosts, 'err', v.errors.length, 'missing', v.missing.length, 'tabs', Object.entries(v.tabs).map(([k, t]) => `${k}:${t.visible ? 'ok' : 'NO'}/${t.overflow}`).join(' '));
  console.log(' controles', JSON.stringify({ ...R.controls, forcedReduced: R.controls.forcedReduced && { lottie: R.controls.forcedReduced.lottieSvgs, running: R.controls.forcedReduced.running, banner: R.controls.forcedReduced.reducedBanner } }));
  console.log(' reducido sistema', 'lottie', R.reduced.lottieSvgs, 'running', R.reduced.running, 'banner', R.reduced.reducedBanner, 'err', R.reduced.errors.length);
  console.log(' rAF', JSON.stringify(R.raf));
}
