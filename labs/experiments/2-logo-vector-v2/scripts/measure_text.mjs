// Measure glyph x-positions of a word as Chromium lays it out (kerning on).
// Usage: node measure_text.mjs font.ttf "Céluma" weight
// Prints JSON: prefix widths at font-size 1000px (1 px = 1 font unit for UPM 1000).
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const [fontPath, word, weight] = process.argv.slice(2);
const b64 = fs.readFileSync(fontPath).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body></body></html>');
const out = await page.evaluate(async ({ b64, word, weight }) => {
  const f = new FontFace('Measure', `url(data:font/ttf;base64,${b64})`, { weight: String(weight) });
  await f.load();
  document.fonts.add(f);
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${weight} 1000px Measure`;
  ctx.fontKerning = 'normal';
  const chars = Array.from(word);
  const prefix = chars.map((_, i) => ctx.measureText(chars.slice(0, i + 1).join('')).width);
  const single = chars.map((c) => ctx.measureText(c).width);
  return { chars, prefix, single };
}, { b64, word, weight });
console.log(JSON.stringify(out));
await browser.close();
