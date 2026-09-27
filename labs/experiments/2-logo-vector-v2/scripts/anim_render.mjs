// Phase 2 validation harness: render animation frames with real Lottie players.
// Players (validation-only dependencies, not shipped with the product):
//   lottie-web 5.13.0 (npm, MIT)        -> renderers "lottie-svg" and "lottie-canvas"
//   @lottiefiles/dotlottie-web 0.80.0  -> renderer "thorvg" (independent C++/WASM engine)
//   Chromium CSS animations            -> renderer "css-svg" (anim/*.svg)
// Usage: node anim_render.mjs jobs.json <playersDir>
// Job: {renderer, src, frames:[...], outDir, w, h, bg|null, dpr, reduced, name}
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EXP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const PLAYERS = process.argv[3];
const ORIGIN = 'http://lab.test';
const MIME = { '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.wasm': 'application/wasm',
  '.html': 'text/html', '.css': 'text/css', '.png': 'image/png' };

const browser = await chromium.launch();
const report = [];

async function newPage(job) {
  const ctx = await browser.newContext({ viewport: { width: job.w, height: job.h }, deviceScaleFactor: job.dpr || 1,
    reducedMotion: job.reduced ? 'reduce' : 'no-preference' });
  await ctx.route(`${ORIGIN}/**`, (route) => {
    const u = new URL(route.request().url());
    const base = u.pathname.startsWith('/players/') ? PLAYERS : EXP;
    const rel = decodeURIComponent(u.pathname.replace(/^\/(players|exp)\//, ''));
    const file = path.join(base, rel);
    if (u.pathname === '/exp/_blank.html') return route.fulfill({ status: 200, body: '<!doctype html><title>lab</title>', contentType: 'text/html' });
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: 'not found' });
    return route.fulfill({ status: 200, body: fs.readFileSync(file), contentType: MIME[path.extname(file)] || 'application/octet-stream' });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const bg = job.bg || 'transparent';
  await page.goto(`${ORIGIN}/exp/_blank.html`).catch(() => {});
  await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;background:${bg}}#stage{width:${job.w}px;height:${job.h}px;position:relative;overflow:hidden}#stage canvas,#stage svg{display:block}</style></head><body><div id="stage"></div></body></html>`);
  return { ctx, page, errors };
}

for (const job of jobs) {
  const { ctx, page, errors } = await newPage(job);
  fs.mkdirSync(job.outDir, { recursive: true });
  const t0 = Date.now();
  const timings = [];
  const raw = fs.readFileSync(path.join(EXP, job.src), 'utf8');
  const data = job.src.endsWith('.json') ? JSON.parse(raw) : raw;

  if (job.renderer.startsWith('lottie')) {
    await page.addScriptTag({ url: `${ORIGIN}/players/lottie-web-5.13.0/package/build/player/lottie.min.js` });
    await page.evaluate(({ data, r }) => {
      window.anim = window.lottie.loadAnimation({ container: document.getElementById('stage'), renderer: r, loop: false,
        autoplay: false, animationData: data, rendererSettings: { preserveAspectRatio: 'xMidYMid meet', clearCanvas: true } });
    }, { data, r: job.renderer === 'lottie-svg' ? 'svg' : 'canvas' });
    await page.waitForFunction(() => window.anim && window.anim.isLoaded);
    for (const f of job.frames) {
      if (job.fresh) {   // new player DOM per frame: avoids Chromium partial-repaint noise in sequential screenshots
        await page.evaluate(({ data, r }) => {
          window.anim.destroy();
          window.anim = window.lottie.loadAnimation({ container: document.getElementById('stage'), renderer: r, loop: false,
            autoplay: false, animationData: data, rendererSettings: { preserveAspectRatio: 'xMidYMid meet', clearCanvas: true } });
        }, { data, r: job.renderer === 'lottie-svg' ? 'svg' : 'canvas' });
      }
      const ms = await page.evaluate((f) => { const a = performance.now(); window.anim.goToAndStop(f, true); return performance.now() - a; }, f);
      timings.push(ms);
      if (!job.noShots) await page.locator('#stage').screenshot({ path: path.join(job.outDir, `f${String(f).padStart(4, '0')}.png`), omitBackground: !job.bg });
    }
    if (job.playback) {   // real-time playback: rAF deltas over the whole animation
      const pb = await page.evaluate(() => new Promise((res) => {
        const deltas = []; let last = performance.now();
        const tick = (t) => { deltas.push(t - last); last = t; if (window.anim.isPaused) return res(deltas); requestAnimationFrame(tick); };
        window.anim.addEventListener('complete', () => { window.anim.isPaused = true; });
        window.anim.goToAndPlay(0, true); requestAnimationFrame(tick);
      }));
      report.push({ name: job.name + ':playback', raf_deltas_ms: pb.slice(1) });
    }
  } else if (job.renderer === 'thorvg') {
    await page.evaluate(async ({ data, w, h }) => {
      const m = await import('http://lab.test/players/lottiefiles-dotlottie-web-0.80.0/package/dist/index.js');
      m.DotLottie.setWasmUrl('http://lab.test/players/lottiefiles-dotlottie-web-0.80.0/package/dist/dotlottie-player.wasm');
      const c = document.createElement('canvas'); c.width = w; c.height = h; c.style.width = w + 'px'; c.style.height = h + 'px';
      document.getElementById('stage').appendChild(c);
      window.dl = new m.DotLottie({ canvas: c, data: JSON.stringify(data), autoplay: false, loop: false,
        renderConfig: { devicePixelRatio: 1, autoResize: false, freezeOnOffscreen: false } });
      await new Promise((res, rej) => { window.dl.addEventListener('load', res); window.dl.addEventListener('loadError', (e) => rej(String(e.error))); });
    }, { data, w: job.w, h: job.h });
    for (const f of job.frames) {
      const ms = await page.evaluate((f) => new Promise((res) => {
        // setFrame() on the frame already shown emits no 'render' event: fall back after 250 ms
        const a = performance.now();
        let settled = false;
        const done = () => { if (settled) return; settled = true; window.dl.removeEventListener('render', done);
          requestAnimationFrame(() => res(performance.now() - a)); };
        window.dl.addEventListener('render', done);
        window.dl.setFrame(f);
        setTimeout(done, 250);
      }), f);
      timings.push(ms);
      await page.locator('#stage').screenshot({ path: path.join(job.outDir, `f${String(f).padStart(4, '0')}.png`), omitBackground: !job.bg });
    }
  } else if (job.renderer === 'css-svg') {
    await page.evaluate(({ svg, w, h }) => {
      const s = document.getElementById('stage'); s.innerHTML = svg;
      const el = s.querySelector('svg'); el.setAttribute('width', w); el.setAttribute('height', h);
    }, { svg: data, w: job.w, h: job.h });
    const nAnims = await page.evaluate(() => document.getAnimations().length);
    report.push({ name: job.name + ':animations', count: nAnims });
    for (const f of job.frames) {
      if (f === 'finished') {   // let every animation run out: element must fall back to the static master
        await page.evaluate(() => document.getAnimations().forEach((a) => a.finish()));
      } else if (f === 'initial') {
        // as loaded, no seeking (used for the reduced-motion check)
      } else {
        await page.evaluate((ms) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; }), (f * 1000) / 60);
      }
      await page.waitForTimeout(30);
      const tag = typeof f === 'number' ? `f${String(f).padStart(4, '0')}` : f;
      await page.locator('#stage').screenshot({ path: path.join(job.outDir, `${tag}.png`), omitBackground: !job.bg });
    }
    if (job.computed) {       // residual transform / opacity after the animation ended
      const res = await page.evaluate(() => ['nucleolo', 'rayo-1', 'rayo-2', 'rayo-3', 'trazos'].map((id) => {
        const e = document.getElementById(id); const cs = getComputedStyle(e);
        return { id, transform: cs.transform, opacity: cs.opacity, running: e.getAnimations().filter((a) => a.playState === 'running').length };
      }));
      report.push({ name: job.name + ':computed', values: res });
    }
  } else if (job.renderer === 'picture-svg') {
    // recommended embed: <picture> swaps to the static master when the user asks for reduced motion
    await page.evaluate(({ anim, still, w, h }) => new Promise((res) => {
      const pic = document.createElement('picture');
      const s = document.createElement('source'); s.media = '(prefers-reduced-motion: reduce)'; s.srcset = still;
      const i = new Image(); i.onload = res; i.width = w; i.height = h; i.src = anim;
      pic.append(s, i); document.getElementById('stage').appendChild(pic);
    }), { anim: `${ORIGIN}/exp/${job.src}`, still: `${ORIGIN}/exp/${job.still}`, w: job.w, h: job.h });
    for (const wait of job.frames) {
      await page.waitForTimeout(wait);
      await page.locator('#stage').screenshot({ path: path.join(job.outDir, `t${String(wait).padStart(5, '0')}.png`), omitBackground: !job.bg });
    }
  } else if (job.renderer === 'img-svg') {
    // the animated SVG used as a plain <img>, the way most sites embed a logo
    await page.evaluate(({ src, w, h }) => new Promise((res) => {
      const i = new Image(); i.onload = res; i.width = w; i.height = h; i.src = src; document.getElementById('stage').appendChild(i);
    }), { src: `${ORIGIN}/exp/${job.src}`, w: job.w, h: job.h });
    for (const wait of job.frames) {
      await page.waitForTimeout(wait);
      await page.locator('#stage').screenshot({ path: path.join(job.outDir, `t${String(wait).padStart(5, '0')}.png`), omitBackground: !job.bg });
    }
  }
  report.push({ name: job.name, renderer: job.renderer, frames: job.frames.length, ms_total: Date.now() - t0,
    per_frame_ms: timings.length ? { mean: timings.reduce((a, b) => a + b, 0) / timings.length, max: Math.max(...timings) } : null,
    errors });
  await ctx.close();
}
fs.writeFileSync(path.join(EXP, 'validation', 'anim', '_render-report.json'), JSON.stringify(report, null, 1));
await browser.close();
console.log(report.map((r) => `${r.name} ${r.renderer || ''} ${r.frames || ''} ${r.per_frame_ms ? r.per_frame_ms.mean.toFixed(2) + 'ms' : ''} ${r.errors ? r.errors.join('|') : ''}`).join('\n'));
