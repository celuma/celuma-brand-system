// Céluma · Experimento 04 · Exporta los motion de comunicación a MP4 (H.264) y WebM (VP9).
// Cada fotograma se dibuja con render(t) y se captura: el ritmo es exacto aunque el navegador vaya lento.
// Usa el Chromium de celuma-frontend y el ffmpeg del sistema (/usr/local/bin/ffmpeg). No instala nada.
// Uso: node scripts/video.mjs [intro-novedad] [paso-a-paso]
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const E4 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ = path.resolve(E4, '../../..');
const REL = path.relative(RAIZ, E4).split(path.sep).join('/');
const MEDIDAS = { 'intro-novedad': [1920, 1080], 'paso-a-paso': [1080, 1920] };
const nombres = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MEDIDAS);

const libre = () => new Promise((res) => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });
const puerto = await libre();
const srv = spawn('python3', ['-m', 'http.server', String(puerto), '--bind', '127.0.0.1'], { cwd: RAIZ, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const run = (a) => new Promise((res, rej) => { const w = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...a]); w.stderr.on('data', (d) => process.stderr.write(d)); w.on('close', (c) => (c ? rej(new Error('ffmpeg ' + c)) : res())); });

const browser = await chromium.launch();
const informe = {};
for (const id of nombres) {
  const [W, H] = MEDIDAS[id];
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) errores.push(r.status() + ' ' + r.url()); });
  await page.goto(`http://127.0.0.1:${puerto}/${REL}/motion/motion.html#m=${id}&bare=1&t=0`);
  await page.waitForFunction(() => document.body.dataset.listo === '1', null, { timeout: 30000 });
  const { duracion, fps } = await page.evaluate(() => ({ duracion: window.E4_MOTION.duracion, fps: window.E4_MOTION.fps }));
  const n = Math.round(duracion * fps);
  const out = path.join(E4, 'motion', id);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', out + '.mp4']);
  ff.stderr.on('data', (d) => process.stderr.write(d));
  // La escena se vuelve a montar en el reposo: se captura por recorte, no por un nodo fijo.
  const foto = () => page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
  let ultimo = null;
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await page.evaluate((s) => window.E4_MOTION.ir(s), i / fps);
    const buf = await foto();
    if (i === 0) fs.writeFileSync(out + '-primero.png', buf);
    ultimo = buf;
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  // Estado final exacto (t = duración) para comparar con la pieza estática del kit
  await page.evaluate((s) => window.E4_MOTION.ir(s), duracion);
  fs.writeFileSync(out + '-final.png', await foto());
  await run(['-i', out + '.mp4', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1', out + '.webm']);
  await run(['-i', out + '-final.png', '-q:v', '3', out + '-poster.jpg']);
  void ultimo;
  informe[id] = { ancho: W, alto: H, fps, fotogramas: n, duracion_s: duracion, segundos_render: Math.round((Date.now() - t0) / 1000), errores };
  console.log(id, JSON.stringify(informe[id]));
  await page.close();
}
await browser.close();
srv.kill();
fs.writeFileSync(path.join(E4, 'validacion', 'video.json'), JSON.stringify({ fecha: new Date().toISOString(), navegador: 'Chromium (Playwright de celuma-frontend), headless, macOS', piezas: informe }, null, 1));
