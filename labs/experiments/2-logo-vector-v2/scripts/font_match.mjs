// Render "Céluma" in candidate open-licence fonts (Google Fonts CSS API, loaded by
// Chromium like any brand page; no font file is saved) for font_match.py.
// Usage: node font_match.mjs candidates.json outDir
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const cands = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const outDir = process.argv[3];
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2600, height: 900 } });
const report = [];
for (const c of cands) {
  const fam = c.family.replace(/ /g, '+');
  const link = c.local ? '' : `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${fam}:wght@${c.weight}&display=block">`;
  await page.setContent(`<!doctype html><html><head>
    ${link}
    <style>html,body{margin:0;background:#fff}span{position:absolute;left:40px;top:40px;font:${c.weight} 600px/1 '${c.family}';color:#000;white-space:nowrap}</style>
    </head><body><span>Céluma</span></body></html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate((c) => document.fonts.check(`${c.weight} 600px '${c.family}'`, 'Céluma'), c);
  const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family));
  const file = path.join(outDir, `${c.family.replace(/ /g, '_')}-${c.weight}.png`);
  await page.screenshot({ path: file });
  report.push({ ...c, file, check: ok, loaded: c.local ? ok : (loaded.includes(c.family) || loaded.includes(`"${c.family}"`)) });
}
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 1));
await browser.close();
console.log(report.map((r) => `${r.family} ${r.weight} loaded=${r.loaded}`).join('\n'));
