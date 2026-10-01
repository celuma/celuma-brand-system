// Experimento 03 · vídeos de revisión y piezas de ejemplo (MP4 H.264 + WebM VP9 + póster; GIF para el sticker).
// Aprobado en laboratorio. Cada fotograma se dibuja con lottie-web (copia local de vendor/) y se captura, así el ritmo es exacto.
// Usa el ffmpeg del sistema (/usr/local/bin/ffmpeg, libx264 + libvpx-vp9).
// Uso: node video.mjs [escena ...]   escenas: respira brote rebote orden-16x9-navy orden-1x1-crema rebote-social-1x1 rebote-sticker
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const E3 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOTTIE = path.join(E3, 'vendor', 'lottie-web-5.13.0', 'lottie.min.js');
const spec = JSON.parse(fs.readFileSync(path.join(E3, 'spec.json'), 'utf8'));
const V = spec.variants, FPS = spec.fps;
const BG = { crema: '#fbf6ec', navy: '#0d1b2a', blanco: '#ffffff' };
const ART = { isotipo: [73, 42, 549, 670], 'lockup-h': [73, 42, 2084.93, 670], 'lockup-v': [-64.25, 42, 823.5, 936.59] };
const artOf = (key) => ART[key.split('|')[1].replace(/-(pos|neg)$/, '')];
const op = (k) => V[k].op;
const once = (k, pre = 24, post = 60) => ({ n: pre + op(k) + post, f: (i) => Math.min(Math.max(i - pre, 0), op(k) - 1) });
const loop = (k, cycles) => ({ n: op(k) * cycles, f: (i) => i % op(k) });
const cell = (key, want) => ({ key, want });
const TAG = 'Aprobado en laboratorio · experimento 03';

const SCENES = {
  respira: { W: 1280, H: 720, title: 'Respira · la célula respira mientras el sistema trabaja', segments: [
    { label: 'Bucle de 3,6 s · 3 ciclos · crema, navy y blanco', ...loop('respira|isotipo', 3), panes: ['crema', 'navy', 'blanco'].map((bg) => ({ bg, cells: [cell('respira|isotipo', { h: 220 })] })) },
    { label: 'Tamaño real · 32 · 48 · 64 · 96 px', ...loop('respira|isotipo', 2), panes: ['crema', 'navy'].map((bg) => ({ bg, cells: [32, 48, 64, 96].map((h) => cell('respira|isotipo', { h })) })) },
  ] },
  brote: { W: 1280, H: 720, title: 'Brote · del núcleo luminoso nace la célula', segments: [
    { label: 'Isotipo · una vez', ...once('brote|isotipo'), panes: ['crema', 'navy', 'blanco'].map((bg) => ({ bg, cells: [cell('brote|isotipo', { h: 220 })] })) },
    { label: 'Con nombre · horizontal', ...once('brote|lockup-h-pos'), panes: [{ bg: 'crema', cells: [cell('brote|lockup-h-pos', { w: 520 })] }, { bg: 'navy', cells: [cell('brote|lockup-h-neg', { w: 520 })] }] },
    { label: 'Con nombre · vertical', ...once('brote|lockup-v-pos'), panes: [{ bg: 'crema', cells: [cell('brote|lockup-v-pos', { h: 330 })] }, { bg: 'navy', cells: [cell('brote|lockup-v-neg', { h: 330 })] }] },
  ] },
  rebote: { W: 1280, H: 720, title: 'Rebote · llega con peso (deformación temporal propuesta)', segments: [
    { label: 'Isotipo · una vez', ...once('rebote|isotipo'), panes: ['crema', 'navy', 'blanco'].map((bg) => ({ bg, cells: [cell('rebote|isotipo', { h: 220 })] })) },
    { label: 'Con nombre · horizontal', ...once('rebote|lockup-h-pos'), panes: [{ bg: 'crema', cells: [cell('rebote|lockup-h-pos', { w: 520 })] }, { bg: 'navy', cells: [cell('rebote|lockup-h-neg', { w: 520 })] }] },
    { label: 'Con nombre · vertical', ...once('rebote|lockup-v-pos'), panes: [{ bg: 'crema', cells: [cell('rebote|lockup-v-pos', { h: 330 })] }, { bg: 'navy', cells: [cell('rebote|lockup-v-neg', { h: 330 })] }] },
  ] },
  'orden-16x9-navy': { W: 1920, H: 1080, bare: true, segments: [
    { ...once('orden|lockup-h-neg', 12, 90), panes: [{ bg: 'navy', cells: [cell('orden|lockup-h-neg', { scene: true })] }] }] },
  'orden-1x1-crema': { W: 1080, H: 1080, bare: true, segments: [
    { ...once('orden|lockup-v-pos', 12, 90), panes: [{ bg: 'crema', cells: [cell('orden|lockup-v-pos', { scene: true })] }] }] },
  'rebote-social-1x1': { W: 1080, H: 1080, bare: true, social: true, segments: [
    { ...once('rebote|lockup-v-pos', 12, 120), panes: [{ bg: 'crema', cells: [cell('rebote|lockup-v-pos', { h: 420 })] }] }] },
  'rebote-sticker': { W: 480, H: 480, bare: true, gif: true, notag: true, segments: [
    { ...once('rebote|isotipo', 6, 90), panes: [{ bg: 'crema', cells: [cell('rebote|isotipo', { h: 330 })] }] }] },
};

function cellBox(c) {
  const b = V[c.key].box;
  if (c.want.scene) return { k: null, w: '100%', h: '100%', left: 0, top: 0 };
  const a = artOf(c.key);
  const k = c.want.h ? c.want.h / a[3] : c.want.w / a[2];
  return { k, w: b[2] * k, h: b[3] * k, dx: (a[0] + a[2] / 2 - b[0]) * k, dy: (a[1] + a[3] / 2 - b[1]) * k, aw: a[2] * k, ah: a[3] * k };
}

const pick = process.argv.slice(2);
const names = pick.length ? pick : Object.keys(SCENES);
const browser = await chromium.launch();
fs.mkdirSync(path.join(E3, 'preview'), { recursive: true });
const phaseOf = (k, f) => { let p = ''; for (const [n, t] of V[k].markers) if (f >= t) p = n; return p; };

for (const name of names) {
  const sc = SCENES[name];
  const page = await browser.newPage({ viewport: { width: sc.W, height: sc.H } });
  const OUT = path.join(E3, 'preview', name);
  const args = sc.gif
    ? ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'png', OUT + '-frames.mkv']
    : ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
      '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', OUT + '.mp4'];
  const ff = spawn('ffmpeg', args);
  ff.stderr.on('data', (d) => process.stderr.write(d));
  let total = 0, finalFrameIndex = 0;
  for (const seg of sc.segments) {
    const data = {};
    seg.panes.forEach((p) => p.cells.forEach((c) => { data[c.key] = JSON.parse(fs.readFileSync(path.join(E3, V[c.key].lottie), 'utf8')); }));
    const cellsHTML = (p, pi) => p.cells.map((c, ci) => {
      const b = cellBox(c);
      if (c.want.scene) return `<div class="cell" id="c${pi}_${ci}" style="position:absolute;inset:0"></div>`;
      return `<div class="cellwrap" style="width:${b.aw.toFixed(1)}px;height:${b.ah.toFixed(1)}px"><div class="cell" id="c${pi}_${ci}" style="position:absolute;width:${b.w.toFixed(2)}px;height:${b.h.toFixed(2)}px;left:${(b.aw / 2 - b.dx).toFixed(2)}px;top:${(b.ah / 2 - b.dy).toFixed(2)}px"></div></div>`;
    }).join('');
    await page.setContent(`<!doctype html><html><head><style>
      @import url("https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&display=block");
      html,body{margin:0;width:${sc.W}px;height:${sc.H}px;overflow:hidden;background:#f5f3ee;font-family:-apple-system,Helvetica,Arial,sans-serif}
      .top{position:absolute;left:28px;right:28px;top:18px;display:flex;justify-content:space-between;align-items:center;color:#0d1b2a;font-size:20px;font-weight:700}
      .top small{display:block;font-size:15px;font-weight:600;color:#374151;margin-top:3px}
      .tag{font-size:13px;color:#b4413a;border:1px dashed #b4413a;border-radius:6px;padding:4px 8px;font-weight:700;background:rgba(255,255,255,.85)}
      .panes{position:absolute;left:${sc.bare ? 0 : 28}px;right:${sc.bare ? 0 : 28}px;top:${sc.bare ? 0 : 84}px;bottom:${sc.bare ? 0 : 54}px;display:flex;gap:16px}
      .pane{flex:1;border-radius:${sc.bare ? 0 : 16}px;display:flex;flex-wrap:wrap;gap:26px;align-items:center;justify-content:center;align-content:center;position:relative;overflow:hidden}
      .cellwrap{position:relative}
      .cell>div,.cell svg{width:100%!important;height:100%!important;display:block}
      .foot{position:absolute;left:28px;right:28px;bottom:16px;display:flex;justify-content:space-between;font-size:15px;color:#374151;font-variant-numeric:tabular-nums}
      .btag{position:absolute;right:${Math.round(sc.W / 48)}px;top:${Math.round(sc.W / 48)}px;z-index:2;font-size:${Math.max(11, Math.round(sc.W / 80))}px}
      .copy{position:absolute;left:90px;right:90px;bottom:118px;text-align:center;opacity:0}
      .copy .e{margin:0 0 14px;font:700 34px/1 -apple-system,Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#1f7a75}
      .copy .t{margin:0;font:800 74px/1.05 "Baloo 2",system-ui,sans-serif;letter-spacing:-.02em;color:#0d1b2a}
      .copy .u{margin:18px 0 0;font:700 34px/1 -apple-system,Helvetica,Arial,sans-serif;color:#1f7a75}
    </style></head><body>
      ${sc.bare ? (sc.notag ? '' : `<span class="tag btag">${TAG}</span>`) : `<div class="top"><span>Céluma · experimento 03 · ${sc.title}<small>${seg.label}</small></span><span class="tag">${TAG}</span></div>`}
      <div class="panes">${seg.panes.map((p, pi) => `<div class="pane" style="background:${BG[p.bg]}${sc.social ? ';align-content:flex-start;padding-top:120px' : ''}">${cellsHTML(p, pi)}</div>`).join('')}</div>
      ${sc.social ? '<div class="copy" id="copy"><p class="e">Novedades</p><p class="t">Céluma 1.3.1 ya está disponible</p><p class="u">docs.celuma.mx</p></div>' : ''}
      ${sc.bare ? '' : '<div class="foot"><span id="ph"></span><span id="clk"></span></div>'}
    </body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.addScriptTag({ path: LOTTIE });
    await page.evaluate(({ panes, data }) => new Promise((res) => {
      window.A = []; let pending = 0;
      panes.forEach((p, pi) => p.cells.forEach((c, ci) => {
        pending++;
        const a = lottie.loadAnimation({ container: document.getElementById(`c${pi}_${ci}`), renderer: 'svg', loop: false, autoplay: false,
          animationData: data[c.key], rendererSettings: { preserveAspectRatio: 'xMidYMid meet' } });
        a.addEventListener('DOMLoaded', () => { if (--pending === 0) res(); });
        window.A.push(a);
      }));
    }), { panes: seg.panes, data });
    const first = seg.panes[0].cells[0].key;
    const fin = V[first].fin ?? op(first);
    for (let i = 0; i < seg.n; i++) {
      const fr = seg.f(i);
      // la pieza social: el texto entra cuando la firma ya está en reposo (0,42 s, ease-out), nunca a la vez
      const since = i - (24 - 12) - fin;
      const copyP = sc.social ? Math.max(0, Math.min(1, (i - 12 - fin - 6) / (0.42 * FPS))) : 0;
      await page.evaluate(({ fr, ph, clk, copyP }) => {
        window.A.forEach((a) => a.goToAndStop(Math.min(fr % a.totalFrames, a.totalFrames - 1), true));
        const p = document.getElementById('ph'); if (p) { p.textContent = ph; document.getElementById('clk').textContent = clk; }
        const c = document.getElementById('copy');
        if (c) { const e = 1 - Math.pow(1 - copyP, 3); c.style.opacity = e; c.style.transform = `translateY(${(1 - e) * 16}px)`; }
      }, { fr, ph: `fotograma ${fr} · ${phaseOf(first, fr)}`, clk: `${(fr / FPS).toFixed(2).replace('.', ',')} s · vídeo ${((total + i) / FPS).toFixed(2).replace('.', ',')} s`, copyP });
      void since;
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    finalFrameIndex = total + seg.n - 30;
    total += seg.n;
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await page.close();
  const run = (a) => new Promise((res) => { const w = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...a]); w.stderr.on('data', (d) => process.stderr.write(d)); w.on('close', res); });
  if (sc.gif) {
    await run(['-i', OUT + '-frames.mkv', '-vf', 'fps=30,split[a][b];[a]palettegen=max_colors=64:stats_mode=full[p];[b][p]paletteuse=dither=none', '-loop', '0', OUT + '.gif']);
    await run(['-ss', ((finalFrameIndex) / FPS).toFixed(2), '-i', OUT + '-frames.mkv', '-frames:v', '1', '-q:v', '3', OUT + '-poster.jpg']);
    fs.unlinkSync(OUT + '-frames.mkv');
    console.log(`${name}: ${total} fotogramas · gif ${fs.statSync(OUT + '.gif').size} B`);
    continue;
  }
  await run(['-i', OUT + '.mp4', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1', OUT + '.webm']);
  await run(['-ss', (finalFrameIndex / FPS).toFixed(2), '-i', OUT + '.mp4', '-frames:v', '1', '-q:v', '3', OUT + '-poster.jpg']);
  console.log(`${name}: ${total} fotogramas (${(total / FPS).toFixed(2)} s) · mp4 ${fs.statSync(OUT + '.mp4').size} B · webm ${fs.statSync(OUT + '.webm').size} B`);
}
await browser.close();
