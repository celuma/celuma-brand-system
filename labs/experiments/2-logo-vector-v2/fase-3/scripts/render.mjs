// Fase 3 · render frames with real players in Chromium (Playwright). Aprobado en el experimento 02 · incorporación pendiente.
// Players (validation only, not a product dependency):
//   lottie-web 5.13.0            -> "lottie-svg", "lottie-canvas"  (same file as ../vendor, SHA-256 2eb76297…18ac)
//   @lottiefiles/dotlottie-web   -> "thorvg" (independent C++/WASM engine), 0.80.0
//   Chromium                     -> "svg" (a static or CSS-animated SVG inline), "css-svg" (seek CSS animations)
// Usage: node render.mjs jobs.json <playersDir> [report.json]
// Job: {renderer, src (relative to fase-3/), frames:[int|'finished'|'initial'], outDir, w, h, bg|null, dpr,
//       reduced, fresh, name, playback}
import { chromium } from '../../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const F3 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const PLAYERS = process.argv[3];
const REPORT = process.argv[4] || path.join(F3, 'validation', '_render-report.json');
const ORIGIN = 'http://lab.test';
const MIME = { '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.wasm': 'application/wasm' };

const browser = await chromium.launch();
const report = [];

async function newPage(job) {
  const ctx = await browser.newContext({ viewport: { width: job.w, height: job.h }, deviceScaleFactor: job.dpr || 1,
    reducedMotion: job.reduced ? 'reduce' : 'no-preference' });
  await ctx.route(`${ORIGIN}/**`, (route) => {
    const u = new URL(route.request().url());
    if (u.pathname === '/f3/_blank.html') return route.fulfill({ status: 200, body: '<!doctype html><title>lab</title>', contentType: 'text/html' });
    const base = u.pathname.startsWith('/players/') ? PLAYERS : F3;
    const file = path.join(base, decodeURIComponent(u.pathname.replace(/^\/(players|f3)\//, '')));
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: 'not found' });
    return route.fulfill({ status: 200, body: fs.readFileSync(file), contentType: MIME[path.extname(file)] || 'application/octet-stream' });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`${ORIGIN}/f3/_blank.html`);
  await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;background:${job.bg || 'transparent'}}
    #stage{width:${job.w}px;height:${job.h}px;position:relative;overflow:hidden}#stage canvas,#stage svg{display:block}</style></head>
    <body><div id="stage"></div></body></html>`);
  return { ctx, page, errors };
}
const shot = (page, job, tag) => page.locator('#stage').screenshot({ path: path.join(job.outDir, `${tag}.png`), omitBackground: !job.bg });
const tagOf = (f) => (typeof f === 'number' ? `f${String(f).padStart(4, '0')}` : f);

for (const job of jobs) {
  const { ctx, page, errors } = await newPage(job);
  fs.mkdirSync(job.outDir, { recursive: true });
  const t0 = Date.now();
  const raw = fs.readFileSync(path.join(F3, job.src), 'utf8');
  const extra = {};
  if (job.renderer.startsWith('lottie')) {
    const data = JSON.parse(raw);
    const r = job.renderer === 'lottie-svg' ? 'svg' : 'canvas';
    await page.addScriptTag({ url: `${ORIGIN}/players/lottie-web-5.13.0/package/build/player/lottie.min.js` });
    const load = () => page.evaluate(({ data, r }) => new Promise((res) => {
      if (window.anim) window.anim.destroy();
      window.anim = window.lottie.loadAnimation({ container: document.getElementById('stage'), renderer: r, loop: false,
        autoplay: false, animationData: data, rendererSettings: { preserveAspectRatio: 'xMidYMid meet', clearCanvas: true } });
      if (window.anim.isLoaded) res(); else window.anim.addEventListener('DOMLoaded', res);
    }), { data, r });
    await load();
    for (const f of job.frames) {
      if (job.fresh) await load();   // a new player DOM per frame avoids Chromium partial-repaint noise
      await page.evaluate((f) => window.anim.goToAndStop(f, true), f);
      await shot(page, job, tagOf(f));
    }
    if (job.playback) {
      const pb = await page.evaluate(() => new Promise((res) => {
        const deltas = []; let last = performance.now(); let done = false;
        window.anim.addEventListener('complete', () => { done = true; });
        const tick = (t) => { deltas.push(t - last); last = t; if (done) return res(deltas); requestAnimationFrame(tick); };
        window.anim.goToAndPlay(0, true); requestAnimationFrame(tick);
      }));
      extra.raf_deltas_ms = pb.slice(1);
    }
  } else if (job.renderer === 'thorvg') {
    const data = JSON.parse(raw);
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
      await page.evaluate((f) => new Promise((res) => {
        let settled = false;
        const done = () => { if (settled) return; settled = true; window.dl.removeEventListener('render', done); requestAnimationFrame(() => res()); };
        window.dl.addEventListener('render', done);
        window.dl.setFrame(f);
        setTimeout(done, 250);
      }), f);
      await shot(page, job, tagOf(f));
    }
  } else if (job.renderer === 'svg' || job.renderer === 'css-svg') {
    await page.evaluate(({ svg, w, h }) => {
      const s = document.getElementById('stage'); s.innerHTML = svg;
      const el = s.querySelector('svg'); el.setAttribute('width', w); el.setAttribute('height', h);
    }, { svg: raw, w: job.w, h: job.h });
    extra.animations = await page.evaluate(() => document.getAnimations().length);
    for (const f of job.frames) {
      if (typeof f === 'number') {
        await page.evaluate((ms) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; }), (f * 1000) / 60);
      }
      await page.waitForTimeout(30);
      await shot(page, job, tagOf(f));
    }
    if (job.computed) {
      extra.computed = await page.evaluate(() => ['rayo-1', 'rayo-2', 'rayo-3'].map((id) => {
        const e = document.getElementById(id); const cs = getComputedStyle(e);
        return { id, transform: cs.transform, running: e.getAnimations().filter((a) => a.playState === 'running').length };
      }));
    }
  } else if (job.renderer === 'img-svg') {
    await page.evaluate(({ src, w, h }) => new Promise((res) => {
      const i = new Image(); i.onload = res; i.width = w; i.height = h; i.src = src; document.getElementById('stage').appendChild(i);
    }), { src: `${ORIGIN}/f3/${job.src}`, w: job.w, h: job.h });
    for (const wait of job.frames) { await page.waitForTimeout(wait); await shot(page, job, `t${String(wait).padStart(5, '0')}`); }
  }
  report.push({ name: job.name, renderer: job.renderer, src: job.src, frames: job.frames.length, ms: Date.now() - t0, errors, ...extra });
  await ctx.close();
}
fs.writeFileSync(REPORT, JSON.stringify(report, null, 1));
await browser.close();
console.log(report.map((r) => `${r.name} ${r.renderer} ${r.frames}f ${r.ms}ms ${r.errors.join('|')}`).join('\n'));
