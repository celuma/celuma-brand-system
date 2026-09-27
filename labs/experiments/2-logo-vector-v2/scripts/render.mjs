// Rasterise SVG / HTML / PNG jobs with Chromium (Skia), the renderer the brand pages use.
// Uses the Playwright already installed in celuma-frontend (same as docs/revision-grafica/scripts).
// Usage: node render.mjs jobs.json
// A job: { "kind": "svg"|"png"|"html", "src": path, "out": path, "width": N, "height": N,
//          "bg": css colour or null (transparent), "fit": [x, y, w, h] viewBox/crop to fit (optional),
//          "dpr": 1 }
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const browser = await chromium.launch();
const pages = new Map();
async function pageFor(dpr) {
  if (!pages.has(dpr)) pages.set(dpr, await browser.newPage({ deviceScaleFactor: dpr }));
  return pages.get(dpr);
}

for (const j of jobs) {
  const page = await pageFor(j.dpr || 1);
  await page.setViewportSize({ width: j.width, height: j.height });
  const bg = j.bg || 'transparent';
  let body;
  if (j.kind === 'svg') {
    let svg = fs.readFileSync(j.src, 'utf8');
    // size the root element to the job box; optionally override the viewBox
    svg = svg.replace(/<svg([^>]*?)\swidth="[^"]*"\sheight="[^"]*"/, '<svg$1');
    if (j.fit) svg = svg.replace(/viewBox="[^"]*"/, `viewBox="${j.fit.join(' ')}"`);
    svg = svg.replace('<svg ', `<svg width="${j.width}" height="${j.height}" preserveAspectRatio="xMidYMid meet" style="display:block" `);
    body = svg;
  } else if (j.kind === 'png') {
    const b64 = fs.readFileSync(j.src).toString('base64');
    if (j.fit) {
      // crop [x,y,w,h] of the PNG and fit it (contain) into the job box, like the SVG viewBox
      const [x, y, w, h] = j.fit;
      const [W, H] = j.natural;
      const s = Math.min(j.width / w, j.height / h);
      const ox = (j.width - w * s) / 2 - x * s;
      const oy = (j.height - h * s) / 2 - y * s;
      body = `<div style="position:relative;width:${j.width}px;height:${j.height}px;overflow:hidden">
        <img src="data:image/png;base64,${b64}" style="position:absolute;left:${ox}px;top:${oy}px;width:${W * s}px;height:${H * s}px"></div>`;
    } else {
      body = `<img src="data:image/png;base64,${b64}" style="display:block;width:${j.width}px;height:${j.height}px">`;
    }
  } else {
    body = fs.readFileSync(j.src, 'utf8');
  }
  const html = j.kind === 'html' ? body :
    `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:${bg}}</style></head><body>${body}</body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  if (j.kind === 'html') await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(j.out), { recursive: true });
  await page.screenshot({ path: j.out, omitBackground: !j.bg, clip: { x: 0, y: 0, width: j.width, height: j.height } });
}
await browser.close();
console.log(`rendered ${jobs.length} job(s)`);
