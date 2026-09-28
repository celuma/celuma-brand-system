// Fase 3 · automated check of the gallery (index.html) in Chromium. Aprobado en el experimento 02 · incorporación pendiente.
// Opens the page the two ways Rafael can: as a file (file://) and served over http (routed from disk,
// same as `python3 -m http.server`). Normal motion, reduced motion (system and simulated) and 390 px.
// Writes validation/pagecheck.json + .js and screenshots in vistas/.
import { chromium } from '../../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const F3 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(F3, '../../../..');                       // celuma-brand-system
const FILE_URL = pathToFileURL(path.join(F3, 'index.html')).href;
const HTTP_URL = 'http://lab.test/labs/experiments/2-logo-vector-v2/fase-3/';
const OUT = path.join(F3, 'vistas');
fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.json': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm', '.md': 'text/plain' };
const browser = await chromium.launch();
const res = { date: new Date().toISOString() };

async function open({ w = 1440, h = 900, reduced = false, http = false }) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference',
    isMobile: w < 768, hasTouch: w < 768 });
  if (http) {
    await ctx.route('http://lab.test/**', (route) => {
      let rel = decodeURIComponent(new URL(route.request().url()).pathname);
      if (rel.endsWith('/')) rel += 'index.html';
      const file = path.join(REPO, rel);
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return route.fulfill({ status: 404, body: 'not found' });
      return route.fulfill({ status: 200, body: fs.readFileSync(file), contentType: MIME[path.extname(file)] || 'application/octet-stream' });
    });
    // fonts come from Google in the shared tokens; keep the check offline and deterministic
    await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
  }
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)/.test(m.text())) errors.push(m.text()); });
  page.on('requestfailed', (r) => { if (!/fonts\.(googleapis|gstatic)/.test(r.url()) && !/\.(mp4|webm)$/.test(r.url())) errors.push('requestfailed ' + r.url()); });
  await page.goto(http ? HTTP_URL : FILE_URL, { waitUntil: 'load' });
  await page.waitForFunction(() => window.F3_GALLERY && window.F3_GALLERY.players.size > 0);
  await page.waitForTimeout(600);
  return { ctx, page, errors };
}
const state = (page) => page.evaluate(() => {
  const ps = Array.from(window.F3_GALLERY.players);
  return { players: ps.length, static: ps.filter((p) => p.isStatic).length, lottie: ps.filter((p) => p.anim).length,
    css: ps.filter((p) => p.css).length, playing: ps.filter((p) => !p.isStatic && p.playing()).length,
    running_css_animations: document.getAnimations().filter((a) => a.playState === 'running').length };
});
const brokenImages = (page) => page.$$eval('img', (is) => is.filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.getAttribute('src')));
// a player must fit inside its stage / screen: never clipped by overflow:hidden
const clipped = (page) => page.evaluate(() => {
  const out = [];
  document.querySelectorAll('.g-slot').forEach((s) => {
    const box = s.closest('.g-stage, .g-fit, .g-sizecells'); if (!box) return;
    const a = s.getBoundingClientRect(), b = box.getBoundingClientRect();
    if (a.width === 0) return;
    if (a.left < b.left - 1 || a.right > b.right + 1 || a.top < b.top - 1 || a.bottom > b.bottom + 1)
      out.push({ where: box.className + ' ' + (box.id || ''), slot: [a.left, a.top, a.right, a.bottom].map(Math.round), box: [b.left, b.top, b.right, b.bottom].map(Math.round) });
  });
  return out;
});
const overflowX = (page) => page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const off = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right <= vw + 1) return;
    let p = el.parentElement, hidden = false;
    while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'auto' || o === 'scroll') { hidden = true; break; } p = p.parentElement; }
    if (!hidden) off.push(`${el.tagName.toLowerCase()}.${el.className} → ${Math.round(r.right)}`);
  });
  return { scroll_minus_client: document.documentElement.scrollWidth - vw, elements_past_viewport: off.slice(0, 10) };
});

// ---------------------------------------------------------------- desktop, normal motion (file://)
{
  const { ctx, page, errors } = await open({});
  const r = {};
  r.initial = await state(page);
  r.banner_visible = await page.locator('#g-rm-banner').isVisible();
  r.broken_images = await brokenImages(page);
  r.clipped = await clipped(page);
  await page.evaluate(() => { const b = document.querySelector('#cards').getBoundingClientRect(); window.scrollBy(0, b.top - 200); });
  await page.waitForTimeout(900);
  r.cards_playing = await page.evaluate(() => Array.from(document.querySelectorAll('#cards .g-slot')).map((s) => s._player && !s._player.isStatic && s._player.playing()));
  await page.locator('#comparar').screenshot({ path: path.join(OUT, 'comparar-a-crema.png') });
  // controls
  await page.click('[data-typo="b"]'); await page.click('[data-bg-set="navy"]'); await page.waitForTimeout(1200);
  r.after_b_navy = await state(page);
  await page.locator('#comparar').screenshot({ path: path.join(OUT, 'comparar-b-navy.png') });
  await page.click('[data-ori="v"]'); await page.waitForTimeout(900);
  r.clipped_vertical = await clipped(page);
  await page.locator('#comparar').screenshot({ path: path.join(OUT, 'comparar-b-vertical-navy.png') });
  await page.click('[data-typo="iso"]'); await page.click('[data-bg-set="crema"]'); await page.waitForTimeout(600);
  r.ori_disabled_for_iso = await page.locator('[data-ori="h"]').isDisabled();
  await page.click('[data-typo="a"]'); await page.click('[data-ori="h"]'); await page.waitForTimeout(600);
  // card: loop mode, scrub, pause, restart
  const luz = page.locator('#cards .g-card').first();
  await luz.locator('[data-m="loop"]').click(); await page.waitForTimeout(500);
  r.luz_card_loop = await page.evaluate(() => { const p = document.querySelector('#cards .g-slot')._player; return { key: p.r.key, op: p.r.op, loop: p.anim.loop }; });
  await page.locator('#cards .g-card').first().locator('.g-range').fill('50');
  r.luz_scrub_readout = await page.locator('#cards .g-card').first().locator('.g-readout').textContent();
  r.enfoque_loop_disabled = await page.locator('#cards .g-card').nth(1).locator('[data-m="loop"]').isDisabled();
  await page.click('#g-play'); await page.waitForTimeout(300);
  r.after_pause_all = await state(page);
  await page.click('#g-play'); await page.click('#g-restart'); await page.waitForTimeout(400);
  r.after_restart = await state(page);
  await page.click('[data-speed="0.5"]');
  r.speed_applied = await page.evaluate(() => Array.from(window.F3_GALLERY.players).filter((p) => p.anim).every((p) => p.anim.playSpeed === 0.5));
  await page.click('[data-speed="1"]');
  // loader section
  await page.evaluate(() => { const b = document.querySelector('#load-sizes').getBoundingClientRect(); window.scrollBy(0, b.top - 240); });
  await page.waitForTimeout(1300);
  r.loader_css_running = await page.evaluate(() => Array.from(document.querySelectorAll('#load-sizes .g-slot')).filter((s) => s._player && s._player.css).map((s) => s._player.playing()));
  await page.locator('#carga').screenshot({ path: path.join(OUT, 'carga-luz-a-crema.png') });
  await page.click('[data-load-dir="estatico"]'); await page.waitForTimeout(300);
  await page.locator('#scr-task').screenshot({ path: path.join(OUT, 'carga-tarea-larga-estatico.png') });
  r.task_status = await page.locator('#scr-task .now-step').textContent();
  await page.click('[data-load-dir="luz"]');
  // splash + material
  await page.locator('#bienvenida').scrollIntoViewIfNeeded(); await page.waitForTimeout(2600);
  await page.locator('#bienvenida').screenshot({ path: path.join(OUT, 'bienvenida-enfoque-a.png') });
  await page.click('[data-splash-dir="mirada"]'); await page.waitForTimeout(400);
  r.splash_mirada_note = await page.evaluate(() => { const p = document.querySelector('#scr-phone-splash .g-slot')._player; return p && p.r.key; });
  await page.click('[data-splash-dir="enfoque"]');
  await page.click('[data-bg-set="navy"]');
  await page.locator('#material').scrollIntoViewIfNeeded(); await page.waitForTimeout(3200);
  await page.locator('#material').screenshot({ path: path.join(OUT, 'material-trazo-a-navy.png') });
  await page.click('#mat-outro'); await page.waitForTimeout(200);
  r.outro_direction = await page.evaluate(() => { const p = document.querySelector('#scr-169 .g-slot')._player; return p.anim.playDirection; });
  await page.click('#mat-intro'); await page.click('[data-bg-set="crema"]'); await page.waitForTimeout(500);
  // simulated reduced motion
  await page.click('#g-reduce'); await page.waitForTimeout(500);
  r.simulated_reduce = { ...(await state(page)), banner: await page.locator('#g-rm-banner').isVisible(), broken_images: await brokenImages(page) };
  await page.locator('#comparar').screenshot({ path: path.join(OUT, 'comparar-reducido-simulado.png') });
  await page.click('#g-reduce'); await page.waitForTimeout(500);
  r.after_unreduce = await state(page);
  r.video_can_play = await page.evaluate(() => { const v = document.querySelector('video'); return { webm: v.canPlayType('video/webm'), mp4: v.canPlayType('video/mp4') }; });
  r.val_rows = await page.locator('#val table tbody tr').count();
  r.clipped_end = await clipped(page);
  await page.screenshot({ path: path.join(OUT, 'galeria-1440.jpg'), fullPage: true, type: 'jpeg', quality: 78 });
  r.errors = errors;
  res.desktop_file = r;
  await ctx.close();
}
// ---------------------------------------------------------------- served over http
{
  const { ctx, page, errors } = await open({ http: true });
  await page.waitForTimeout(800);
  res.desktop_http = { state: await state(page), broken_images: await brokenImages(page), errors };
  await ctx.close();
}
// ---------------------------------------------------------------- system reduced motion
{
  const { ctx, page, errors } = await open({ reduced: true });
  await page.waitForTimeout(1500);
  const st = await state(page);
  res.reduced = { ...st, all_static: st.static === st.players && st.lottie === 0 && st.css === 0, banner: await page.locator('#g-rm-banner').isVisible(),
    broken_images: await brokenImages(page), errors };
  await page.locator('#carga').screenshot({ path: path.join(OUT, 'carga-reducido.png') });
  await ctx.close();
}
// ---------------------------------------------------------------- mobile 390
for (const typo of ['a', 'b', 'iso']) {
  const { ctx, page, errors } = await open({ w: 390, h: 844 });
  if (typo !== 'a') { await page.click(`[data-typo="${typo}"]`); await page.waitForTimeout(500); }
  if (typo === 'b') { await page.click('[data-ori="v"]'); await page.waitForTimeout(500); }
  const r = { overflow: await overflowX(page), clipped: await clipped(page), broken_images: await brokenImages(page), errors };
  if (typo === 'a') {
    await page.screenshot({ path: path.join(OUT, 'galeria-390.jpg'), fullPage: true, type: 'jpeg', quality: 72 });
    await page.locator('#bienvenida').scrollIntoViewIfNeeded(); await page.waitForTimeout(2400);
    await page.locator('#scr-phone-splash').screenshot({ path: path.join(OUT, 'bienvenida-movil-390.png') });
  }
  res[`mobile_390_${typo}`] = r;
  await ctx.close();
}
res.mobile = { overflow_px: Math.max(...['a', 'b', 'iso'].map((t) => res[`mobile_390_${t}`].overflow.scroll_minus_client)),
  clipped: ['a', 'b', 'iso'].reduce((n, t) => n + res[`mobile_390_${t}`].clipped.length, 0) };
fs.writeFileSync(path.join(F3, 'validation', 'pagecheck.json'), JSON.stringify(res, null, 1));
fs.writeFileSync(path.join(F3, 'validation', 'pagecheck.js'), 'window.F3_PAGECHECK = ' + JSON.stringify(res) + ';\n');
console.log(JSON.stringify(res, null, 1));
await browser.close();
