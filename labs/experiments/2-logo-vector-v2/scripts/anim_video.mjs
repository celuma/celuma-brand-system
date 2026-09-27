// Phase 2 · review video (MP4 H.264 + WebM VP9) rendered frame by frame with lottie-web,
// so timing is exact (no screen-recording jitter). Uses the system ffmpeg (/usr/local/bin/ffmpeg).
// Usage: node anim_video.mjs <playersDir> <out.mp4> <out.webm>
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EXP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [PLAYERS, OUT_MP4, OUT_WEBM] = process.argv.slice(2);
const once = JSON.parse(fs.readFileSync(path.join(EXP, 'anim/celuma-isotipo-once.json'), 'utf8'));
const loop = JSON.parse(fs.readFileSync(path.join(EXP, 'anim/celuma-isotipo-loop.json'), 'utf8'));
const W = 1280, H = 720, FPS = 60;

// timeline of the video: [label, animation key, frame] per output frame
const seq = [];
const hold = (key, f, n, label) => { for (let i = 0; i < n; i++) seq.push({ key, f, label }); };
const play = (key, anim, label) => { for (let f = 0; f < anim.op; f++) seq.push({ key, f, label }); };
for (let r = 0; r < 2; r++) { hold('once', 0, 30, 'Una reproducción'); play('once', once, 'Una reproducción'); hold('once', once.op - 1, 42, 'Una reproducción · final = maestro'); }
for (let r = 0; r < 2; r++) play('loop', loop, `Bucle · ciclo ${r + 1} de 2`);

const markers = (anim) => anim.markers.map((m) => [m.tm, m.cm]).sort((a, b) => a[0] - b[0]);
const mk = { once: markers(once), loop: markers(loop) };
const phase = (key, f) => { let p = ''; for (const [t, n] of mk[key]) if (f >= t) p = n; return p; };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(`<!doctype html><html><head><style>
  html,body{margin:0;width:${W}px;height:${H}px;font-family:-apple-system,Helvetica,Arial,sans-serif;background:#f5f3ee;overflow:hidden}
  .top{position:absolute;left:32px;top:22px;right:32px;display:flex;justify-content:space-between;color:#0d1b2a;font-size:20px;font-weight:700}
  .tag{font-size:14px;color:#b4413a;border:1px dashed #b4413a;border-radius:6px;padding:4px 8px;font-weight:700}
  .panes{position:absolute;top:78px;left:32px;right:32px;bottom:70px;display:flex;gap:20px}
  .pane{flex:1;border-radius:18px;display:grid;place-items:center;position:relative}
  .pane .st{width:320px;height:${Math.round(320 * 670 / 549)}px}
  .pane small{position:absolute;left:14px;bottom:10px;font-size:13px;opacity:.75}
  .foot{position:absolute;left:32px;right:32px;bottom:22px;display:flex;justify-content:space-between;font-size:16px;color:#0d1b2a}
</style></head><body>
  <div class="top"><span>Céluma · isotipo animado — <span id="label"></span></span><span class="tag">Exploración · no aprobada</span></div>
  <div class="panes">
    <div class="pane" style="background:#fbf6ec"><div class="st" id="a"></div><small>crema #fbf6ec</small></div>
    <div class="pane" style="background:#0d1b2a;color:#fff"><div class="st" id="b"></div><small>navy #0d1b2a</small></div>
    <div class="pane" style="background:#ffffff"><div class="st" id="c"></div><small>blanco</small></div>
  </div>
  <div class="foot"><span id="phase"></span><span id="clock"></span></div>
</body></html>`);
await page.addScriptTag({ path: path.join(PLAYERS, 'lottie-web-5.13.0/package/build/player/lottie.min.js') });
await page.evaluate(({ once, loop }) => {
  window.A = {};
  for (const key of ['once', 'loop']) {
    window.A[key] = ['a', 'b', 'c'].map((id) => {
      const d = document.createElement('div'); d.style.cssText = 'width:100%;height:100%'; d.dataset.key = key;
      document.getElementById(id).appendChild(d);
      return window.lottie.loadAnimation({ container: d, renderer: 'svg', loop: false, autoplay: false,
        animationData: key === 'once' ? once : loop });
    });
  }
  window.show = (key, f, label, phase, clock) => {
    for (const k of ['once', 'loop']) window.A[k].forEach((an) => { an.wrapper.style.display = k === key ? 'block' : 'none'; });
    window.A[key].forEach((an) => an.goToAndStop(f, true));
    document.getElementById('label').textContent = label;
    document.getElementById('phase').textContent = `fotograma ${f} · ${phase}`;
    document.getElementById('clock').textContent = clock;
  };
}, { once, loop });

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', OUT_MP4]);
ff.stderr.on('data', (d) => process.stderr.write(d));
const frames = path.join(path.dirname(OUT_MP4), '_frames');
fs.mkdirSync(frames, { recursive: true });
for (let i = 0; i < seq.length; i++) {
  const s = seq[i];
  await page.evaluate(({ key, f, label, ph, clock }) => window.show(key, f, label, ph, clock),
    { key: s.key, f: s.f, label: s.label, ph: phase(s.key, s.f), clock: `${(s.f / FPS).toFixed(2)} s · vídeo ${(i / FPS).toFixed(2)} s` });
  const buf = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
// WebM (VP9) from the MP4 for browsers/players that prefer it
await new Promise((res) => {
  const w = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', OUT_MP4, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '30', '-row-mt', '1', OUT_WEBM]);
  w.on('close', res);
});
fs.rmSync(frames, { recursive: true, force: true });
console.log(`video frames ${seq.length} (${(seq.length / FPS).toFixed(2)} s)`);
