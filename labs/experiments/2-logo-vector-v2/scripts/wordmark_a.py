"""Outline the in-use wordmark (option A): "Céluma" in Baloo 2 ExtraBold (wght 800).

Font: Baloo 2 v1.700 by Ek Type, SIL Open Font License 1.1, downloaded with
Rafael's permission from github.com/google/fonts (ofl/baloo2) to the session
scratchpad; it is NOT copied into the repository (OFL allows outlining a logo).
Pass the font path as argv[1].

- The variable font is instanced at wght=800 (fontTools.varLib.instancer).
- Glyph positions come from Chromium's own layout (kerning on) via canvas
  measureText of prefixes; letter-spacing -0.02em as in the landing navbar.
- Outlines are exact font outlines (TrueType quadratics, written as SVG Q/L).

Outputs: svg/wordmarks/wordmark-a-baloo2-800.svg, validation/wordmark-a.json
"""
import json
import subprocess
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

from celuma_img import EXP

WORD = "Céluma"
TRACK = -0.02          # em, landing navbar / --celuma-tracking-tight
src = Path(sys.argv[1])
inst_path = src.with_name("Baloo2-ExtraBold-instance.ttf")
font = TTFont(src)
inst = instancer.instantiateVariableFont(font, {"wght": 800})
inst.save(inst_path)
font = TTFont(inst_path)
upm = font["head"].unitsPerEm
os2 = font["OS/2"]

m = json.loads(subprocess.run(["node", str(EXP / "scripts" / "measure_text.mjs"), str(inst_path), WORD, "800"],
                              check=True, capture_output=True, text=True).stdout)
cmap = font.getBestCmap()
gs = font.getGlyphSet()
hmtx = font["hmtx"]
pen = SVGPathPen(gs)
bp = BoundsPen(gs)
xs = []
for i, ch in enumerate(WORD):
    gname = cmap[ord(ch)]
    adv = hmtx[gname][0]
    x = m["prefix"][i] - adv + i * TRACK * upm   # Chromium places glyph i after prefix i-1 (+ kerning)
    xs.append({"char": ch, "glyph": gname, "advance": adv, "x": round(x, 2),
               "chromium_single_width": round(m["single"][i], 2)})
    t = (1, 0, 0, -1, x, 0)                        # font units, y up → SVG y down, baseline at y=0
    gs[gname].draw(TransformPen(pen, t))
    gs[gname].draw(TransformPen(bp, t))
d = pen.getCommands()
x0, y0, x1, y1 = bp.bounds
vb = f"{x0:g} {y0:g} {x1 - x0:g} {y1 - y0:g}"
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{(x1 - x0) / 10:g}" height="{(y1 - y0) / 10:g}" role="img" aria-labelledby="t d">\n'
       f'  <title id="t">Céluma · wordmark A · Baloo 2 ExtraBold 800 (propuesta, exploración)</title>\n'
       f'  <desc id="d">Exploración · no aprobada. Contornos exactos de Baloo 2 v1.700 (Ek Type, SIL OFL 1.1), '
       f'wght 800, interletraje de Chromium y tracking -0,02 em como en el landing. Unidades de fuente (UPM {upm}); '
       f'línea base en y=0.</desc>\n'
       f'  <path id="wordmark-a" fill="#0d1b2a" d="{d}"/>\n</svg>\n')
out = EXP / "svg" / "wordmarks" / "wordmark-a-baloo2-800.svg"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(svg)

# ink boxes per glyph for layout (C cap height, etc.)
boxes = []
for g in xs:
    b = BoundsPen(gs)
    gs[g["glyph"]].draw(TransformPen(b, (1, 0, 0, -1, g["x"], 0)))
    boxes.append([round(v, 1) for v in b.bounds])
info = {"font": "Baloo 2", "version": font["name"].getDebugName(5), "designer": font["name"].getDebugName(9),
        "license": "SIL Open Font License 1.1", "wght": 800, "upm": upm,
        "capHeight": os2.sCapHeight, "xHeight": os2.sxHeight, "ascender": os2.sTypoAscender,
        "descender": os2.sTypoDescender, "tracking_em": TRACK, "glyphs": xs, "glyph_ink_boxes": boxes,
        "ink_bbox": [x0, y0, x1, y1]}
(EXP / "validation" / "wordmark-a.json").write_text(json.dumps(info, indent=2, ensure_ascii=False))
print(json.dumps({k: v for k, v in info.items() if k not in ("glyphs",)}, indent=1, ensure_ascii=False))
