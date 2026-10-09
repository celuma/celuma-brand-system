// Céluma · 04 · ronda 2 · Fidelidad de los fondos locales frente al render original del lienzo
// (ronda-2/referencia/original-pat-*@2x.png, capturados con capturar-original.mjs). Mismo tamaño (280×200) y densidad 2×.
// Uso: node scripts/ronda2/fidelidad-fondos.mjs → ronda-2/referencia/local-*.png + ronda-2/fidelidad-fondos.json
import { chromium } from '../../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const E4 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
vm.runInThisContext(fs.readFileSync(path.join(E4, 'kit/microcosmos.js'), 'utf8'));
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 280, height: 200 }, deviceScaleFactor: 2 });
for (const f of ['papel', 'navy']) {
  await pg.setContent(`<html><body style="margin:0">${globalThis.E4MC.svgFondo(f, 280, 200)}</body></html>`);
  await pg.screenshot({ path: path.join(E4, 'ronda-2/referencia', `local-${f}@2x.png`) });
}
await b.close();
