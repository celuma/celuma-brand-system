// Céluma · 04 · ronda 2 · Captura de lectura de los originales del lienzo Fundamentos (no los modifica):
// 01 · Papel cream, 02 · Navy y 01 · Microcosmos, a densidad 2×. Requiere el preview 5050 en marcha.
// Uso: node scripts/ronda2/capturar-original.mjs [http://localhost:5050]
import { chromium } from '../../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const E4 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const base = process.argv[2] || 'http://localhost:5050';
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1800, height: 1400 }, deviceScaleFactor: 2 });
await pg.goto(base + '/index.html#fundamentos');
await pg.waitForSelector('[data-dc-slot] .dc-card', { timeout: 20000 });
await pg.waitForTimeout(1500);
for (const id of ['pat-cream', 'pat-navy', 'ill-cell']) {
  const box = await pg.evaluate((id) => {
    const slot = [...document.querySelectorAll('[data-dc-slot]')].find((s) => s.getAttribute('data-dc-slot') === id || s.getAttribute('data-dc-slot').endsWith('/' + id));
    const card = slot.querySelector('.dc-card');
    const world = [...document.querySelectorAll('div')].find((d) => d.style.willChange === 'transform');
    world.style.transform = 'translate3d(0px,0px,0) scale(1)';
    document.documentElement.style.setProperty('--dc-inv-zoom', '1');
    const w = world.getBoundingClientRect(), r = card.getBoundingClientRect();
    world.style.transform = `translate3d(${-(r.left - w.left) + 40}px,${-(r.top - w.top) + 120}px,0) scale(1)`;
    const tile = card.querySelector('.cel-sheet') || card;
    const r2 = tile.getBoundingClientRect();
    return { x: r2.left, y: r2.top, width: r2.width, height: r2.height };
  }, id);
  await pg.screenshot({ path: path.join(E4, 'ronda-2/referencia', `original-${id}@2x.png`), clip: box });
  console.log(id, JSON.stringify(box));
}
await b.close();
