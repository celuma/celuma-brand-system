// Phase 2 · check animacion.html in Chromium (file://, as Rafael would open it).
// Normal and reduced-motion contexts; exercises the controls; captures views.
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EXP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL_ = pathToFileURL(path.join(EXP, 'animacion.html')).href;
const OUT = path.join(EXP, 'validation', 'vistas');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const res = {};

async function open(opts) {
  const ctx = await browser.newContext({ viewport: { width: opts.w, height: 900 }, reducedMotion: opts.reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(URL_, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page, errors };
}
const readout = (p) => p.locator('#readout').textContent();

// ---- normal, desktop
{
  const { ctx, page, errors } = await open({ w: 1440 });
  const r = {};
  r.banner_visible = await page.locator('#rm-banner').isVisible();
  r.readout_t0 = await readout(page);
  await page.waitForTimeout(1200);
  r.readout_t1200 = await readout(page);
  await page.waitForTimeout(2600);
  r.readout_end = await readout(page);
  await page.waitForFunction(() => /idénticos/.test(document.getElementById('cmp-result').textContent), null, { timeout: 15000 });
  r.compare_once_svg = await page.locator('#cmp-result').textContent();
  await page.click('[data-cmp="canvas"]');
  await page.waitForTimeout(800);
  r.compare_once_canvas = await page.locator('#cmp-result').textContent();
  await page.click('[data-cmp="svg"]');
  await page.click('[data-ver="loop"]');
  await page.waitForTimeout(1200);
  r.compare_loop_svg = await page.locator('#cmp-result').textContent();
  // controls: keyframe buttons, scrub, backgrounds, scale, renderers
  await page.click('[data-ver="once"]');
  await page.waitForTimeout(300);
  await page.click('#pause');
  await page.click('#keys button:has-text("mira-izquierda")');
  r.after_key_left = await readout(page);
  await page.click('.an-row [data-bg="navy"]');
  await page.click('[data-scale="2"]');
  await page.locator('#stage').screenshot({ path: path.join(OUT, 'animacion-escenario-izquierda-navy-2x.png') });
  await page.locator('#scrub').fill('123');
  r.after_scrub_123 = await readout(page);
  await page.click('[data-ren="canvas"]');
  await page.waitForTimeout(500);
  await page.click('#pause');
  await page.locator('#scrub').fill('150');
  r.canvas_scrub_150 = await readout(page);
  await page.click('[data-ren="css"]');
  await page.waitForTimeout(400);
  r.css_animations = await page.evaluate(() => document.getAnimations().length);
  await page.click('#pause');
  await page.locator('#scrub').fill('45');
  r.css_scrub_45 = await readout(page);
  await page.locator('#stage').screenshot({ path: path.join(OUT, 'animacion-escenario-css-f45.png') });
  await page.click('[data-ren="svg"]');
  await page.click('.an-row [data-bg="crema"]');
  await page.click('[data-scale="1"]');
  await page.waitForTimeout(3600);
  r.broken_images = await page.$$eval('img', (i) => i.filter((x) => x.complete && x.naturalWidth === 0).map((x) => x.getAttribute('src')));
  r.video_can_play = await page.evaluate(() => { const v = document.querySelector('video'); return { webm: v.canPlayType('video/webm'), mp4: v.canPlayType('video/mp4') }; });
  r.val_rows = await page.locator('#val-first tbody tr').count();
  await page.screenshot({ path: path.join(OUT, 'animacion-1440.jpg'), fullPage: true, type: 'jpeg', quality: 82 });
  r.errors = errors;
  res.normal = r;
  await ctx.close();
}
// ---- reduced motion
{
  const { ctx, page, errors } = await open({ w: 1440, reduced: true });
  await page.waitForTimeout(1500);
  res.reduced = {
    banner_visible: await page.locator('#rm-banner').isVisible(),
    readout_after_1500ms: await readout(page),
    errors,
  };
  await page.locator('#stage').screenshot({ path: path.join(OUT, 'animacion-escenario-reduced.png') });
  await page.click('[data-ren="css"]');
  await page.waitForTimeout(300);
  res.reduced.css_running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
  await ctx.close();
}
// ---- mobile
{
  const { ctx, page, errors } = await open({ w: 390 });
  await page.waitForTimeout(800);
  res.mobile = { overflow: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), errors };
  await page.screenshot({ path: path.join(OUT, 'animacion-390.jpg'), fullPage: true, type: 'jpeg', quality: 80 });
  await ctx.close();
}
fs.writeFileSync(path.join(EXP, 'validation', 'animacion-check.json'), JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1));
await browser.close();
