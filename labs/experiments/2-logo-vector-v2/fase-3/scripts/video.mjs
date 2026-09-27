// Fase 3 · review videos (MP4 H.264 + WebM VP9), rendered frame by frame with lottie-web so timing is
// exact. Exploración · no aprobada. System ffmpeg (/usr/local/bin/ffmpeg, libx264 + libvpx-vp9).
// Usage: node video.mjs [scene ...]    scenes: luz enfoque trazo trazo-social trazo-intro (default: all)
import { chromium } from '../../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const F3 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOTTIE = path.join(F3, '..', 'vendor', 'lottie-web-5.13.0', 'lottie.min.js');
const spec = JSON.parse(fs.readFileSync(path.join(F3, 'validation', 'spec.json'), 'utf8'));
const V = spec.variants, FPS = spec.fps;
const BG = { crema: '#fbf6ec', navy: '#0d1b2a', blanco: '#ffffff' };
const op = (k) => V[k].op;
// frame functions: i = output frame within the segment
const once = (k, pre = 30, post = 60) => ({ n: pre + op(k) + post, f: (i) => Math.min(Math.max(i - pre, 0), op(k) - 1) });
const loop = (k, cycles) => ({ n: op(k) * cycles, f: (i) => i % op(k) });
const rev = (k, pre = 30, post = 40) => ({ n: pre + op(k) + post, f: (i) => Math.max(op(k) - 1 - Math.max(i - pre, 0), 0) });
const introOutro = (k, pre = 20, hold = 90, post = 30) => ({ n: pre + 2 * op(k) + hold + post,
  f: (i) => (i < pre ? 0 : i < pre + op(k) ? i - pre : i < pre + op(k) + hold ? op(k) - 1 : Math.max(op(k) - 1 - (i - pre - op(k) - hold), 0)) });
const cell = (key, want, tf) => ({ key, want, tf });

const SCENES = {
  luz: { W: 1280, H: 720, title: 'Luz · solo se mueve la luz', segments: [
    { label: 'Bucle de carga (2,0 s) · 3 ciclos', ...loop('luz|iso|loop', 3), panes: ['crema', 'navy', 'blanco'].map((bg) => ({ bg, cells: [cell('luz|iso|loop', { h: 200 }, 'f')] })) },
    { label: 'Bucle a tamaño real · 32 · 48 · 64 · 96 px', ...loop('luz|iso|loop', 2), panes: ['crema', 'navy'].map((bg) => ({ bg, cells: [32, 48, 64, 96].map((h) => cell('luz|iso|loop', { h }, 'f')) })) },
    { label: 'Una vez · isotipo · A · B (el acento de la é es la última luz)', ...once('luz|a-h-pos|once', 30, 70),
      panes: [{ bg: 'crema', cells: [cell('luz|iso|once', { h: 150 }, 'f')] }, { bg: 'crema', cells: [cell('luz|a-h-pos|once', { w: 330 }, 'f')] }, { bg: 'navy', cells: [cell('luz|b-h-neg|once', { w: 330 }, 'f')] }] },
  ] },
  enfoque: { W: 1280, H: 720, title: 'Enfoque · poner la muestra a foco', segments: [
    { label: 'Una vez · isotipo', ...once('enfoque|iso|once', 30, 50), panes: ['crema', 'navy', 'blanco'].map((bg) => ({ bg, cells: [cell('enfoque|iso|once', { h: 200 }, 'f')] })) },
    { label: 'Con nombre · horizontal · A (crema) y B (navy)', ...once('enfoque|a-h-pos|once', 30, 60),
      panes: [{ bg: 'crema', cells: [cell('enfoque|a-h-pos|once', { w: 520 }, 'f')] }, { bg: 'navy', cells: [cell('enfoque|b-h-neg|once', { w: 520 }, 'f')] }] },
    { label: 'Con nombre · vertical (móvil) · A y B', ...once('enfoque|a-v-pos|once', 30, 60),
      panes: [{ bg: 'crema', cells: [cell('enfoque|a-v-pos|once', { w: 250 }, 'f')] }, { bg: 'navy', cells: [cell('enfoque|b-v-neg|once', { w: 250 }, 'f')] }] },
  ] },
  trazo: { W: 1280, H: 720, title: 'Trazo · la marca se dibuja', segments: [
    { label: 'Una vez · isotipo', ...once('trazo|iso|once', 30, 50), panes: ['crema', 'navy', 'blanco'].map((bg) => ({ bg, cells: [cell('trazo|iso|once', { h: 200 }, 'f')] })) },
    { label: 'Con nombre · A (crema) y B (navy)', ...once('trazo|a-h-pos|once', 30, 60),
      panes: [{ bg: 'crema', cells: [cell('trazo|a-h-pos|once', { w: 520 }, 'f')] }, { bg: 'navy', cells: [cell('trazo|b-h-neg|once', { w: 520 }, 'f')] }] },
    { label: 'Outro · la misma animación al revés', ...rev('trazo|a-h-pos|once', 40, 40),
      panes: [{ bg: 'crema', cells: [cell('trazo|a-h-pos|once', { w: 520 }, 'f')] }, { bg: 'navy', cells: [cell('trazo|b-h-neg|once', { w: 520 }, 'f')] }] },
  ] },
  'trazo-social': { W: 1080, H: 1080, bare: true, title: 'Pieza social 1:1 · Trazo · A vertical', caption: 'Texto de ejemplo para redes', segments: [
    { label: 'Intro · reposo · outro', ...introOutro('trazo|a-v-pos|once'), panes: [{ bg: 'crema', cells: [cell('trazo|a-v-pos|once', { w: 540 }, 'f')] }] },
  ] },
  'trazo-intro': { W: 1920, H: 1080, bare: true, title: 'Intro/outro 16:9 · Trazo · A horizontal sobre navy', caption: 'Pieza de ejemplo · texto ficticio', segments: [
    { label: 'Intro · reposo · outro', ...introOutro('trazo|a-h-neg|once'), panes: [{ bg: 'navy', cells: [cell('trazo|a-h-neg|once', { w: 1000 }, 'f')] }] },
  ] },
};

const pick = process.argv.slice(2);
const names = pick.length ? pick : Object.keys(SCENES);
const browser = await chromium.launch();
fs.mkdirSync(path.join(F3, 'preview'), { recursive: true });
const phaseOf = (k, f) => { let p = ''; for (const [n, t] of V[k].markers) if (f >= t) p = n; return p; };

for (const name of names) {
  const sc = SCENES[name];
  const page = await browser.newPage({ viewport: { width: sc.W, height: sc.H } });
  const OUT = path.join(F3, 'preview', name);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', OUT + '.mp4']);
  ff.stderr.on('data', (d) => process.stderr.write(d));
  let total = 0;
  for (const seg of sc.segments) {
    const cellsData = {};
    seg.panes.forEach((p) => p.cells.forEach((c) => { cellsData[c.key] = JSON.parse(fs.readFileSync(path.join(F3, V[c.key].file), 'utf8')); }));
    await page.setContent(`<!doctype html><html><head><style>
      html,body{margin:0;width:${sc.W}px;height:${sc.H}px;overflow:hidden;background:#f5f3ee;font-family:-apple-system,Helvetica,Arial,sans-serif}
      .top{position:absolute;left:28px;right:28px;top:18px;display:flex;justify-content:space-between;align-items:center;color:#0d1b2a;font-size:20px;font-weight:700}
      .top small{display:block;font-size:15px;font-weight:600;color:#374151;margin-top:3px}
      .tag{font-size:13px;color:#b4413a;border:1px dashed #b4413a;border-radius:6px;padding:4px 8px;font-weight:700;background:rgba(255,255,255,.85)}
      .panes{position:absolute;left:${sc.bare ? 0 : 28}px;right:${sc.bare ? 0 : 28}px;top:${sc.bare ? 0 : 84}px;bottom:${sc.bare ? 0 : 54}px;display:flex;gap:16px}
      .pane{flex:1;border-radius:${sc.bare ? 0 : 16}px;display:flex;flex-wrap:wrap;gap:22px;align-items:center;justify-content:center;align-content:center;position:relative}
      .cell{position:relative}
      .cell>div,.cell svg{width:100%!important;height:100%!important;display:block}
      .foot{position:absolute;left:28px;right:28px;bottom:16px;display:flex;justify-content:space-between;font-size:15px;color:#374151;font-variant-numeric:tabular-nums}
      .cap{position:absolute;left:0;right:0;bottom:7%;text-align:center;font-size:${Math.round(sc.H / 36)}px;font-weight:600}
      .btag{position:absolute;right:22px;top:20px;z-index:2;font-size:${Math.round(sc.W / 70)}px}
    </style></head><body>
      ${sc.bare ? `<span class="tag btag">Exploración · no aprobada</span>` : `<div class="top"><span>Céluma · fase 3 · ${sc.title}<small>${seg.label}</small></span><span class="tag">Exploración · no aprobada</span></div>`}
      <div class="panes">${seg.panes.map((p, pi) => `<div class="pane" style="background:${BG[p.bg]}">${p.cells.map((c, ci) => {
        const b = V[c.key].box; const k = c.want.h ? c.want.h / (b[3] - 8) : c.want.w / (b[2] - 8);
        return `<div class="cell" id="c${pi}_${ci}" style="width:${(b[2] * k).toFixed(2)}px;height:${(b[3] * k).toFixed(2)}px"></div>`; }).join('')}
        ${sc.caption ? `<div class="cap" style="color:${p.bg === 'navy' ? '#aeb9c6' : '#6b7280'}">${sc.caption}</div>` : ''}</div>`).join('')}</div>
      ${sc.bare ? '' : '<div class="foot"><span id="ph"></span><span id="clk"></span></div>'}
    </body></html>`);
    await page.addScriptTag({ path: LOTTIE });
    await page.evaluate(({ panes, data }) => new Promise((res) => {
      window.A = []; let pending = 0;
      panes.forEach((p, pi) => p.cells.forEach((c, ci) => {
        pending++;
        const a = lottie.loadAnimation({ container: document.getElementById(`c${pi}_${ci}`), renderer: 'svg', loop: false, autoplay: false, animationData: data[c.key] });
        a.addEventListener('DOMLoaded', () => { if (--pending === 0) res(); });
        window.A.push(a);
      }));
    }), { panes: seg.panes, data: cellsData });
    const first = seg.panes[0].cells[0].key;
    for (let i = 0; i < seg.n; i++) {
      const fr = seg.f(i);
      await page.evaluate(({ fr, ph, clk }) => {
        window.A.forEach((a) => a.goToAndStop(Math.min(fr % a.totalFrames, a.totalFrames - 1), true));
        const p = document.getElementById('ph'); if (p) { p.textContent = ph; document.getElementById('clk').textContent = clk; }
      }, { fr, ph: `fotograma ${fr} · ${phaseOf(first, fr)}`, clk: `${(fr / FPS).toFixed(2).replace('.', ',')} s · vídeo ${((total + i) / FPS).toFixed(2).replace('.', ',')} s` });
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    total += seg.n;
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await page.close();
  await new Promise((res) => { const w = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', OUT + '.mp4', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1', OUT + '.webm']); w.on('close', res); });
  // poster: a held final frame (the outro scenes end empty, so they pick the hold before the outro)
  const posterFrame = name === 'trazo' ? sc.segments[0].n + sc.segments[1].n - 20
    : sc.bare ? 20 + op(sc.segments[0].panes[0].cells[0].key) + 45 : total - 24;
  const tPoster = posterFrame / FPS;
  await new Promise((res) => { const w = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-ss', tPoster.toFixed(2), '-i', OUT + '.mp4', '-frames:v', '1', '-q:v', '3', OUT + '-poster.jpg']); w.on('close', res); });
  console.log(`${name}: ${total} frames (${(total / FPS).toFixed(2)} s) · mp4 ${fs.statSync(OUT + '.mp4').size} B · webm ${fs.statSync(OUT + '.webm').size} B`);
}
await browser.close();
