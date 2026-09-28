// Capture the experiment pages (file://, no server needed) and export example artboards.
// Checks: broken images, console errors, horizontal overflow at 390 px.
// Usage: node capture.mjs
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EXP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = { pages: {} };
const browser = await chromium.launch();

async function open(page, file) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(pathToFileURL(path.join(EXP, file)).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const broken = await page.$$eval('img', (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  return { errors, broken, overflow };
}

for (const [file, widths] of [['index.html', [1440, 390]], ['ejemplos.html', [1440, 390]]]) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const r = await open(page, file);
    const shot = path.join(EXP, 'validation', 'vistas', `${file.replace('.html', '')}-${w}.jpg`);
    fs.mkdirSync(path.dirname(shot), { recursive: true });
    await page.screenshot({ path: shot, fullPage: true, type: 'jpeg', quality: 82 });
    out.pages[`${file}@${w}`] = r;
    if (file === 'ejemplos.html' && w === 1440) {
      for (const opt of ['a', 'b']) {
        await page.click(`[data-opt="${opt}"]`);
        await page.waitForTimeout(300);
        for (const el of await page.$$('[data-artboard]')) {
          const name = await el.getAttribute('data-artboard');
          await el.screenshot({ path: path.join(EXP, 'examples', `ejemplo-${name}-${opt}.png`) });
        }
      }
    }
    await page.close();
  }
}
fs.writeFileSync(path.join(EXP, 'validation', 'vistas-check.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
