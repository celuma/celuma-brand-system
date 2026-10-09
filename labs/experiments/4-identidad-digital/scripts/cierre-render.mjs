// Céluma · Experimento 04 · Cierre (2026-10-07): vuelve a renderizar las 61 piezas del kit con el código actual
// (mismo camino que exportar.mjs: viewport 2000, DPR 1, captura de .pz) y las compara byte a byte con exports/kit/.
// Demuestra que los cambios de estado en kit/ (comentarios, títulos, rótulos) no alteran ninguna pieza aprobada.
// Uso: node scripts/cierre-render.mjs   → validacion/cierre-render.json (los renders temporales se borran)
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as T from './trabajos.mjs';

const E4 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ = path.resolve(E4, '../../..');
const REL = path.relative(RAIZ, E4).split(path.sep).join('/');
const TMP = path.join(E4, 'validacion/tmp/cierre-render');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const libre = () => new Promise((res) => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });
const puerto = await libre();
const srv = spawn('python3', ['-m', 'http.server', String(puerto), '--bind', '127.0.0.1'], { cwd: RAIZ, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
fs.mkdirSync(TMP, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const piezas = [];
for (const [p, f, d = T.RECOMENDADA] of T.KIT) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 2000, height: 2000 });
  await page.goto(`http://127.0.0.1:${puerto}/${REL}/kit/pieza.html#p=${p}&d=${d}&f=${f}`);
  await page.waitForFunction(() => document.body.dataset.listo === '1', null, { timeout: 30000 });
  const out = path.join(TMP, `${p}__${f}.png`);
  await (await page.$('.pz')).screenshot({ path: out });
  await page.close();
  piezas.push({ id: `${p}__${f}`, identica: sha(out) === sha(path.join(E4, 'exports/kit', `${p}__${f}.png`)) });
}
await browser.close(); srv.kill();
fs.rmSync(path.join(E4, 'validacion/tmp'), { recursive: true, force: true });
const n = piezas.filter((x) => x.identica).length;
const res = { fecha: new Date().toISOString(), navegador: 'Chromium (Playwright de celuma-frontend) headless, macOS', ok: n === piezas.length, resumen: `${n}/${piezas.length} piezas del kit renderizadas de nuevo con el código del cierre, idénticas byte a byte a exports/kit/`, distintas: piezas.filter((x) => !x.identica).map((x) => x.id) };
fs.writeFileSync(path.join(E4, 'validacion/cierre-render.json'), JSON.stringify(res, null, 1));
console.log(res.resumen);
process.exit(res.ok ? 0 : 1);
