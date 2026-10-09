// Céluma · Experimento 04 · Prueba de navegación y controles con clics reales (Chromium headless).
// Uso: node scripts/navegacion.mjs [http://localhost:5050 ...]
//   Siempre prueba un python3 -m http.server propio; añada otros servidores (p. ej. el preview 5050) como argumentos.
// Escribe validacion/navegacion.json.
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const E4 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ = path.resolve(E4, '../../..');
const libre = () => new Promise((res) => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });
const puerto = await libre();
const srv = spawn('python3', ['-m', 'http.server', String(puerto), '--bind', '127.0.0.1'], { cwd: RAIZ, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const servidores = [`http://127.0.0.1:${puerto}`, ...process.argv.slice(2)];
const EXP = '/labs/experiments/4-identidad-digital';
const browser = await chromium.launch();
const resultado = { fecha: new Date().toISOString(), navegador: 'Chromium (Playwright de celuma-frontend) headless, macOS', servidores: {} };

async function nueva(ctx, errores) {
  const pg = await ctx.newPage();
  pg.on('pageerror', (e) => errores.push('pageerror ' + e));
  pg.on('console', (m) => { if (m.type() === 'error') errores.push('console ' + m.text()); });
  return pg;
}
const listo = (pg) => pg.waitForFunction(() => document.body.dataset.listo === '1', null, { timeout: 20000 });

for (const base of servidores) {
  const R = []; const errores = []; const notas = [];
  const ok = (nombre, cond, extra = '') => R.push({ prueba: nombre, ok: !!cond, extra });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const respuestas = [];
  ctx.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base)) respuestas.push(r.status() + ' ' + r.url().replace(base, '')); });
  // 1 · Laboratorio → tarjeta del 04 (pestaña nueva)
  let pg = await nueva(ctx, errores);
  await pg.goto(base + '/labs/');
  const tarjeta = pg.locator('a', { hasText: 'Abrir identidad digital' });
  ok('Lab: la tarjeta del 04 existe', await tarjeta.count() === 1);
  const [pestana] = await Promise.all([ctx.waitForEvent('page'), tarjeta.click()]);
  pestana.on('pageerror', (e) => errores.push('pageerror ' + e));
  await listo(pestana);
  ok('Lab → 04 abre pestaña nueva y carga la galería', (await pestana.title()).includes('Experimento 04'), pestana.url().replace(base, ''));
  ok('Barra de recorrido: aria-current en «Identidad digital»', await pestana.locator('.g-ruta [aria-current="page"]').innerText() === 'Identidad digital');
  // 2 · Volver al laboratorio desde la barra
  await pestana.locator('.g-ruta a', { hasText: 'Laboratorio' }).click();
  await pestana.waitForLoadState('load');
  ok('04 → «Laboratorio» vuelve al lab', /Laboratorio visual/.test(await pestana.title()), pestana.url().replace(base, ''));
  await pestana.close();
  // 3 · Entradas directas
  for (const ruta of [EXP + '/', EXP, EXP + '/index.html', EXP + '/?formato=9x16&contexto=oscuro#direcciones']) {
    const p = await nueva(ctx, errores);
    await p.goto(base + ruta);
    await listo(p);
    await p.waitForTimeout(500);
    const info = await p.evaluate(() => ({ url: location.pathname + location.search + location.hash, rotas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length, css: getComputedStyle(document.querySelector('.g-ruta')).display, f: document.querySelector('[data-cf][aria-pressed="true"]').dataset.cf, oscuro: !!document.querySelector('.g-feed.oscuro'), top: Math.round(document.getElementById('direcciones').getBoundingClientRect().top) }));
    let cond = info.css === 'flex' && info.rotas === 0;
    if (ruta.includes('formato=9x16')) cond = cond && info.f === '9x16' && info.oscuro && Math.abs(info.top) < 200;
    ok(`Entrada directa ${ruta}`, cond, JSON.stringify(info));
    await p.close();
  }
  // 4 · Controles con clic y teclado
  pg = await nueva(ctx, errores);
  await pg.goto(base + EXP + '/');
  await listo(pg);
  await pg.click('[data-cf="9x16"]');
  ok('Comparación: 9:16 cambia las piezas', await pg.locator('#comparacion img[src*="valor-claridad__9x16"]').count() === 3);
  await pg.click('[data-cc="claro"]');
  ok('Comparación: feed claro', await pg.locator('.g-feed.claro').count() === 12);
  await pg.focus('[data-cc="lienzo"]'); await pg.keyboard.press('Enter');
  ok('Teclado: Enter activa «Pieza»', await pg.getAttribute('[data-cc="lienzo"]', 'aria-pressed') === 'true');
  await pg.click('[data-kg="Carrusel"]');
  ok('Kit: filtro Carrusel = 7 piezas', await pg.locator('#kit-grid .g-ficha').count() === 7);
  await pg.click('[data-kv="movil"]');
  ok('Kit: vista Teléfono 390 px', await pg.locator('#kit-grid.movil').count() === 1);
  await pg.click('[data-mv="estatico"]');
  ok('Motion: versión estática', await pg.locator('#motion-lista img').count() === 2);
  await pg.click('[data-mv="video"]');
  const v = await pg.evaluate(async () => { const el = document.querySelector('#motion-lista video'); el.muted = true; try { await el.play(); await new Promise((r) => setTimeout(r, 600)); el.pause(); return { t: el.currentTime, src: el.currentSrc.split('/').pop() }; } catch (e) { return { error: String(e) }; } });
  ok('Motion: el vídeo reproduce y pausa', v.t > 0.2, JSON.stringify(v));
  // Ronda 2 · refinamiento
  ok('Ronda 2: capítulo y recorrido propio', await pg.locator('#refinamiento .g-subindice a').count() === 6);
  ok('Ronda 2: 4 fondos con descargas', await pg.locator('#r2-fondos-lista .g-fondo-ficha a[download]').count() >= 32);
  ok('Ronda 2: biblioteca de 9 recursos', await pg.locator('#r2-biblioteca-lista .g-recurso').count() === 9);
  await pg.click('[data-ad="despues"]');
  ok('Ronda 2: antes/después muestra solo la ronda 2', await pg.locator('#r2-pares.despues').count() === 1 && await pg.locator('#r2-pares .antes').first().isHidden());
  await pg.click('[data-ad="ambas"]');
  ok('Ronda 2: 10 pares antes/después', await pg.locator('#r2-pares figure').count() === 10);
  // Cierre (2026-10-07): rótulos activos coherentes con DECISION.md; A y C accesibles como alternativas
  const cierre = await pg.evaluate(() => ({
    aviso: document.querySelector('.lab-notice strong').textContent, ceja: document.querySelector('.lab-eyebrow').textContent, pie: document.querySelector('.g-pie span').textContent,
    sellos: ['a', 'b', 'c'].map((d) => document.querySelector('#d-' + d + ' .g-sello').textContent), cap3: document.getElementById('t-rec').textContent,
    contradice: (document.body.innerText.match(/pendiente de (la )?aprobaci[oó]n|Decisión \(pendiente\)|no aprobad[ao]|Recomendación candidata|Candidat[ao] · |Exploración · /g) || []) }));
  ok('Cierre: aviso, ceja y pie con el estado aprobado', /Cerrado/.test(cierre.aviso) && /2026-10-07/.test(cierre.aviso) && /cerrado/.test(cierre.ceja) && /cerrado/.test(cierre.pie), JSON.stringify([cierre.aviso, cierre.ceja, cierre.pie]));
  ok('Cierre: sellos A/C alternativas y B ronda 1 antecedente', cierre.sellos[0] === 'Alternativa conservada' && cierre.sellos[2] === 'Alternativa conservada' && /antecedente/.test(cierre.sellos[1]), JSON.stringify(cierre.sellos));
  ok('Cierre: capítulo 3 = dirección elegida', /^Dirección elegida: B · Ficha/.test(cierre.cap3), cierre.cap3);
  ok('Cierre: sin rótulos de estado contradictorios en la galería', !cierre.contradice.length, cierre.contradice.join(' | '));
  await pg.click('.lab-notice a[href="#alternativas"]');
  // El desplazamiento es suave (celuma-tokens): esperar a que termine antes de medir.
  await pg.waitForFunction(() => Math.abs(document.getElementById('alternativas').getBoundingClientRect().top) < 300, null, { timeout: 8000, polling: 100 }).catch(() => {});
  await pg.waitForTimeout(300);
  const alt = await pg.evaluate(() => { const n = document.getElementById('alternativas'), r = n.getBoundingClientRect(), x = r.left + 20, y = r.top + 8; return { top: Math.round(r.top), visible: n.contains(document.elementFromPoint(x, y)) }; });
  ok('Aviso → «capítulo 2» lleva a las alternativas, visibles', Math.abs(alt.top) < 300 && alt.visible, JSON.stringify(alt));
  // 5 · Enlaces locales de la galería (incluidos .md y descargas)
  const hrefs = await pg.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => !/^(https?:|mailto:|#)/.test(h)))]);
  const malos = [];
  for (const h of hrefs) { const u = new URL(h, pg.url()); const r = await pg.request.get(u.href); if (r.status() >= 400) malos.push(r.status() + ' ' + h); }
  ok(`Enlaces locales de la galería (${hrefs.length})`, !malos.length, malos.join(', '));
  const anclas = await pg.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => h.length > 1 && !document.getElementById(h.slice(1))));
  ok('Anclas internas existentes', !anclas.length, anclas.join(', '));
  // 6 · Editor desde la barra y vuelta
  await pg.locator('.g-ruta a', { hasText: 'Editor de piezas' }).click();
  await pg.waitForSelector('#aviso:not(:empty)', { timeout: 20000 });
  ok('Galería → Editor (aria-current)', await pg.locator('.ruta [aria-current="page"]').innerText() === 'Editor de piezas', pg.url().replace(base, ''));
  await pg.selectOption('#pieza', 'novedad-131'); await pg.selectOption('#formato', '9x16');
  await pg.waitForTimeout(800);
  ok('Editor: cambiar pieza y formato', /Dentro de presupuesto/.test(await pg.textContent('#aviso')), (await pg.textContent('#aviso')).slice(0, 80));
  await pg.selectOption('#pieza', 'identidad-nombre'); await pg.selectOption('#formato', '4x5'); await pg.selectOption('#fondo', 'navy');
  await pg.waitForTimeout(800);
  ok('Editor: fondo Navy en vista', await pg.locator('#escala .pz.fondo-navy').count() === 1, await pg.evaluate(() => location.hash));
  await pg.selectOption('#micro', '0'); await pg.waitForTimeout(800);
  ok('Editor: sin Microcosmos', await pg.locator('#escala .pz .mc-modulo').count() === 0 && /micro=0/.test(await pg.evaluate(() => location.hash)));
  await pg.selectOption('#dir', 'b1'); await pg.waitForTimeout(800);
  ok('Editor: B ronda 1 disponible', await pg.locator('#escala .pz.d-b:not(.r2)').count() === 1);
  await pg.selectOption('#dir', 'a'); await pg.waitForTimeout(800);
  const ac = await pg.evaluate(() => ({ a: document.querySelectorAll('#escala .pz.d-a').length, opciones: [...document.querySelectorAll('#dir option')].map((o) => o.textContent), estado: document.querySelector('.estado').textContent }));
  await pg.selectOption('#dir', 'c'); await pg.waitForTimeout(800);
  ac.c = await pg.locator('#escala .pz.d-c').count();
  ok('Editor: A y C disponibles como alternativas conservadas', ac.a === 1 && ac.c === 1 && ac.opciones.filter((o) => /· alternativa$/.test(o)).length === 2 && /elegida/.test(ac.opciones[0]), JSON.stringify(ac.opciones));
  ok('Editor: rótulo de estado aprobado', /aprobada en el laboratorio/.test(ac.estado), ac.estado);
  await pg.selectOption('#dir', 'b'); await pg.selectOption('#fondo', ''); await pg.selectOption('#micro', '');
  await pg.locator('.ruta a', { hasText: 'Identidad digital' }).click();
  await listo(pg);
  ok('Editor → galería', (await pg.title()).includes('Experimento 04'));
  // 7 · Pieza y motion por enlace directo
  for (const ruta of [EXP + '/kit/pieza.html#p=valor-claridad&d=b&f=4x5', EXP + '/kit/pieza.html#p=valor-claridad&d=b&f=4x5&guias=1', EXP + '/kit/pieza.html#p=demo&d=b&f=4x5&fondo=navy-suave&micro=0', EXP + '/kit/pieza.html#p=valor-claridad&d=b1&f=4x5', EXP + '/motion/motion.html#m=paso-a-paso&t=3']) {
    const p = await nueva(ctx, errores); await p.goto(base + ruta); await listo(p);
    let cond = await p.locator('.pz').count() >= 1;
    if (ruta.includes('fondo=navy-suave')) cond = cond && await p.locator('.pz[data-fondo="navy-suave"]').count() === 1 && await p.locator('.pz .mc-modulo').count() === 0;
    if (ruta.includes('d=b1')) cond = cond && await p.locator('.pz.r2').count() === 0;
    ok(`Directa ${ruta}`, cond, p.url().replace(base, ''));
    await p.close();
  }
  // Espécimen Microcosmos y ancla directa al capítulo de la ronda 2
  { const p = await nueva(ctx, errores); await p.goto(base + EXP + '/kit/microcosmos.html'); await listo(p);
    ok('Espécimen Microcosmos: 9 recursos', await p.locator('.rec').count() === 9); await p.close(); }
  { const p = await nueva(ctx, errores); await p.goto(base + EXP + '/#refinamiento'); await listo(p); await p.waitForTimeout(700);
    const top = await p.evaluate(() => Math.round(document.getElementById('refinamiento').getBoundingClientRect().top));
    ok('Ancla #refinamiento a la vista', Math.abs(top) < 200, 'top=' + top); await p.close(); }
  { const p = await nueva(ctx, errores); await p.goto(base + '/labs/');
    ok('Lab: enlace a la ronda 2 en la tarjeta del 04', await p.locator('a[href$="4-identidad-digital/index.html#refinamiento"]').count() === 1);
    const t04 = p.locator('.lab-card', { hasText: '04 · Identidad y materiales digitales' });
    const est = await t04.locator('.lab-status').innerText();
    ok('Lab: tarjeta del 04 cerrada, con alternativas, decisión y plan de migración', /Cerrado/i.test(est) && await t04.locator('a[href$="#alternativas"]').count() === 1 && await t04.locator('a[href$="DECISION.md"]').count() === 1 && await t04.locator('a[href$="MIGRATION-PLAN.md"]').count() === 1, est);
    await p.close(); }
  // Editor abierto directamente con una alternativa (enlace de la galería)
  { const p = await nueva(ctx, errores); await p.goto(base + EXP + '/kit/editor.html#p=valor-claridad&d=c&f=4x5'); await p.waitForSelector('#aviso:not(:empty)', { timeout: 20000 }); await p.waitForTimeout(500);
    ok('Editor directo con C · Membrana (alternativa)', await p.locator('#escala .pz.d-c').count() === 1 && await p.inputValue('#dir') === 'c'); await p.close(); }
  await pg.close(); await ctx.close();
  // 8 · Móvil 390 y movimiento reducido
  const cm = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  pg = await nueva(cm, errores);
  await pg.goto(base + EXP + '/#kit'); await listo(pg);
  const m = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, est: document.querySelectorAll('#motion-lista img').length, vid: document.querySelectorAll('#motion-lista video').length }));
  ok('390 px: sin desplazamiento horizontal', m.sw === 390, JSON.stringify(m));
  ok('Movimiento reducido: motion estático por defecto', m.est === 2 && m.vid === 0);
  await pg.goto(base + EXP + '/kit/editor.html'); await pg.waitForSelector('#aviso:not(:empty)');
  ok('Editor a 390 px sin desbordes', await pg.evaluate(() => document.documentElement.scrollWidth) === 390);
  await cm.close();
  // Peticiones especulativas del preview que quita la barra final: el escáner de precarga pide los recursos
  // relativos a la carpeta superior antes de que la normalización con history.replaceState actúe (efecto
  // documentado en 02 y 03). Son 404 fuera de la carpeta del experimento; la página carga después todo bien.
  const especulativas = [...new Set(respuestas)].filter((r) => !r.includes(EXP + '/'));
  const reales = [...new Set(respuestas)].filter((r) => r.includes(EXP + '/'));
  if (especulativas.length) {
    notas.push(`${especulativas.length} peticiones especulativas 404 al entrar sin barra final (efecto conocido de la normalización): ` + especulativas.join(' · '));
    for (let i = errores.length - 1; i >= 0; i--) if (/Failed to load resource: .*404/.test(errores[i]) && !reales.length) errores.splice(i, 1);
  }
  if (reales.length) errores.push('404 dentro del experimento: ' + reales.join(' · '));
  resultado.servidores[base] = { ok: R.every((x) => x.ok) && !errores.length, pruebas: R, errores: [...new Set(errores)], notas };
  console.log(`\n${base}: ${R.filter((x) => x.ok).length}/${R.length}`);
  R.filter((x) => !x.ok).forEach((x) => console.log('  XX', x.prueba, x.extra));
  if (errores.length) console.log('  errores', [...new Set(errores)]);
  notas.forEach((n) => console.log('  nota', n));
}
await browser.close(); srv.kill();
const todos = Object.values(resultado.servidores);
resultado.ok = todos.every((s) => s.ok);
resultado.resumen = Object.entries(resultado.servidores).map(([b, s]) => `${b.replace(/http:\/\/127\.0\.0\.1:\d+/, 'http.server')}: ${s.pruebas.filter((x) => x.ok).length}/${s.pruebas.length}`).join(' · ');
resultado.limites = 'Chromium headless; la pestaña nueva se comprobó con el evento de página. Sin Safari, Firefox ni dispositivos.';
fs.writeFileSync(path.join(E4, 'validacion', 'navegacion.json'), JSON.stringify(resultado, null, 1));
console.log('\n' + resultado.resumen);
