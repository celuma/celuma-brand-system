// Measures Direction A pieces: module share of usable area, overlaps and text lines.
// Requires the sibling celuma-frontend checkout with its dependencies installed.
// Start this repository's local server on port 5050, then run this script with Node.
import { chromium } from '../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1800, height: 1400 } });
await page.goto('http://localhost:5050/index.html#digital');
await page.waitForSelector('[data-pub-root]');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
const rows = await page.evaluate(() => {
  const world = [...document.querySelectorAll('div')].find((d) => d.style.willChange === 'transform');
  world.style.transform = 'translate3d(0px,0px,0) scale(1)';
  return [...document.querySelectorAll('[data-pub-root]')].map((root) => {
    const q = (sel) => root.querySelector(sel).getBoundingClientRect();
    const R = root.getBoundingClientRect(), safe = q('[data-pub-safe]'), mod = q('[data-pub-module]'), text = q('[data-pub-text]'), foot = q('[data-pub-footer]');
    const title = root.querySelector('[data-pub-title]'), body = root.querySelector('[data-pub-body]');
    const lh = (el) => parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.2;
    const lines = (el) => Math.round(el.getBoundingClientRect().height / lh(el));
    const landscape = R.width / R.height > 1.2, tall = R.height / R.width > 1.5, lShape = !landscape && !tall;
    const overlaps = [];
    if (!landscape && text.bottom > Math.min(mod.top, foot.top) + 0.5) overlaps.push('texto>módulo/firma');
    if (tall && mod.bottom > foot.top + 0.5) overlaps.push('módulo>firma');
    if (landscape && text.bottom > foot.top + 0.5) overlaps.push('texto>firma');
    if (Math.max(foot.bottom, mod.bottom) > safe.bottom + 0.5 || text.top < safe.top - 0.5) overlaps.push('fuera de área útil');
    const budget = window.PUB_A_RULE.budget[root.dataset.format];
    const tl = lines(title), bl = lines(body);
    if (tl > budget.title) overlaps.push(`título ${tl}>${budget.title}`);
    if (tl + bl > budget.total) overlaps.push(`líneas ${tl + bl}>${budget.total}`);
    const cta = root.querySelector('[data-pub-cta]').getBoundingClientRect();
    if (cta.right > mod.left + 0.5 && cta.top < mod.bottom && cta.bottom > mod.top) overlaps.push('dirección>módulo');
    if (cta.right > safe.right + 0.5) overlaps.push('dirección fuera');
    const aspect = mod.width / mod.height;
    if (aspect > 2.001 || aspect < 0.499) overlaps.push('módulo franja');
    if (+((mod.width * mod.height) / (safe.width * safe.height)).toFixed(3) < 0.295 || (mod.width * mod.height) / (safe.width * safe.height) > 0.505) overlaps.push('módulo fuera de 30–50 %');
    return {
      id: root.closest('[data-dc-slot]').getAttribute('data-dc-slot'),
      format: root.dataset.format, content: root.dataset.content,
      moduleShare: +((mod.width * mod.height) / (safe.width * safe.height) * 100).toFixed(1),
      condensed: root.dataset.condensed, aspect: +(mod.width / mod.height).toFixed(2), titleLines: tl, bodyLines: bl,
      titlePx: +parseFloat(getComputedStyle(title).fontSize).toFixed(1), bodyPx: +parseFloat(getComputedStyle(body).fontSize).toFixed(1),
      overlaps: overlaps.join(', ') || 'ok',
    };
  });
});
const failures = rows.filter((r) => r.overlaps !== 'ok');
console.table(rows.filter((r) => r.id.includes('prueba')));
console.log('FALLOS:', JSON.stringify(failures.map((r) => [r.id, r.overlaps])));
fs.writeFileSync(new URL('../medicion-direccion-a.json', import.meta.url), JSON.stringify(rows, null, 2) + '\n');
if (failures.length) process.exitCode = 1;
await browser.close();
