// Captures every artboard of the brand-system canvases at 1:1 (DPR 2).
// Usage: node capture-brand.mjs <outDir> [canvasId...]
import { chromium } from '/Users/rafaelmagana/Céluma/celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2];
const only = process.argv.slice(3);
const canvases = only.length ? only : ['fundamentos', 'papeleria', 'digital', 'componentes'];
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1800, height: 1400 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const manifest = [];
for (const c of canvases) {
  await page.goto(`http://localhost:5050/index.html#${c}`);
  await page.waitForSelector('[data-dc-slot] .dc-card', { timeout: 20000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.fonts.ready);
  // Overview at the canvas' own fit.
  await page.screenshot({ path: path.join(out, `lienzo-${c}-vista.png`) });
  const ids = await page.$$eval('[data-dc-slot]', (els) => els.map((e) => e.getAttribute('data-dc-slot')));
  for (const id of ids) {
    const box = await page.evaluate((id) => {
      const slot = document.querySelector(`[data-dc-slot="${CSS.escape(id)}"]`);
      const card = slot.querySelector('.dc-card');
      const world = [...document.querySelectorAll('div')].find((d) => d.style.willChange === 'transform');
      world.style.transform = 'translate3d(0px,0px,0) scale(1)';
      document.documentElement.style.setProperty('--dc-inv-zoom', '1');
      const w = world.getBoundingClientRect();
      const r = card.getBoundingClientRect();
      world.style.transform = `translate3d(${-(r.left - w.left) + 40}px,${-(r.top - w.top) + 120}px,0) scale(1)`;
      const r2 = card.getBoundingClientRect();
      return { x: r2.left, y: r2.top, width: r2.width, height: r2.height };
    }, id);
    const file = `${c}__${id}.png`;
    await page.screenshot({ path: path.join(out, file), clip: box });
    manifest.push({ canvas: c, id, file, width: Math.round(box.width), height: Math.round(box.height) });
  }
}
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify({ manifest, errors }, null, 2));
console.log(JSON.stringify({ count: manifest.length, errors }, null, 2));
await browser.close();
