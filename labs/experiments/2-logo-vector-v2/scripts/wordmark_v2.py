"""Vectorise the wordmark of Notion's Celuma_Logotipo_V2.png (option B, reference only).

The PNG (1024², opaque cream, no font metadata) is an image, not typeset text, so
there is no font file to recover. The word is traced with the same method as the
isotipo: field = projection of RGB on the cream→navy axis, 0.5 iso-line, fitted
Béziers with counters (evenodd). Output keeps the raster's pixel units.

Outputs: svg/wordmarks/wordmark-b-notion-v2-trazado.svg, validation/wordmark-b.json
"""
import json

import cv2
import numpy as np
from PIL import Image
from scipy.spatial import cKDTree

from celuma_img import EXP, hexcol
from fitlib import fit_shape, path_d, trace

REF = EXP / "referencias" / "notion" / "Celuma_Logotipo_V2.png"
X0, Y0, X1, Y1 = 340, 425, 900, 575           # word area, measured from the navy components
img = np.asarray(Image.open(REF).convert("RGB")).astype(np.float64)
crop = img[Y0:Y1, X0:X1]
bg = np.median(img[:50, :50].reshape(-1, 3), 0)
navy_mask = crop.mean(-1) < 80
core = cv2.erode(navy_mask.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
navy = np.median(crop[core], 0)
d = navy - bg
field = np.clip(((crop - bg) @ d) / (d @ d), -0.5, 1.5)

contours = trace(field, min_len=10, holes=True)
report = {"source": str(REF.relative_to(EXP)), "cream_bg": hexcol(bg), "navy": hexcol(navy), "contours": []}
paths = []
for p in contours:
    p = p + np.array([X0, Y0])
    segs, dist, corner, hist = fit_shape(p, "glyph")
    area = 0.5 * np.sum(p[:, 0] * np.roll(p[:, 1], -1) - np.roll(p[:, 0], -1) * p[:, 1])
    report["contours"].append({"bbox": [round(float(v), 1) for v in (*p.min(0), *p.max(0))],
                               "nodes": len(segs), "corners": int(sum(corner)),
                               "max_px": round(float(dist.max()), 3), "rms_px": round(float(np.sqrt((dist ** 2).mean())), 3),
                               "signed_area": round(float(area), 1)})
    paths.append((p, path_d(segs)))
    print(report["contours"][-1])

# group contours into glyphs (holes belong to the outer contour that contains them)
paths.sort(key=lambda t: t[0][:, 0].min())
outer = [pp for pp in paths if not any(
    (q[0][:, 0].min() < pp[0][:, 0].min() and q[0][:, 0].max() > pp[0][:, 0].max() and
     q[0][:, 1].min() < pp[0][:, 1].min() and q[0][:, 1].max() > pp[0][:, 1].max()) for q in paths if q is not pp)]
glyph_d = []
for o in outer:
    ox0, oy0 = o[0].min(0)
    ox1, oy1 = o[0].max(0)
    ds = [o[1]] + [q[1] for q in paths if q is not o and q[0][:, 0].min() > ox0 and q[0][:, 0].max() < ox1
                   and q[0][:, 1].min() > oy0 and q[0][:, 1].max() < oy1]
    glyph_d.append(" ".join(ds))

allp = np.vstack([p for p, _ in paths])
bx0, by0 = np.floor(allp.min(0))
bx1, by1 = np.ceil(allp.max(0))
vb = f"{bx0:g} {by0:g} {bx1 - bx0:g} {by1 - by0:g}"
names = ["C", "e", "acento", "l", "u", "m", "a"]
body = "".join(f'    <path id="b-{n}" d="{g}"/>\n' for n, g in zip(names, glyph_d))
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{bx1 - bx0:g}" height="{by1 - by0:g}" role="img" aria-labelledby="t d">\n'
       f'  <title id="t">Céluma · wordmark B · trazado del Logotipo V2 de Notion (referencia, exploración)</title>\n'
       f'  <desc id="d">Exploración · no aprobada. Vectorización del wordmark de Celuma_Logotipo_V2.png '
       f'(imagen, sin archivo de fuente). No es una tipografía instalada ni licenciada; geometría ajustada al raster. '
       f'Color medido {hexcol(navy)}; aquí se usa el navy de marca #0d1b2a.</desc>\n'
       f'  <g id="wordmark-b" fill="#0d1b2a" fill-rule="evenodd">\n{body}  </g>\n</svg>\n')
out = EXP / "svg" / "wordmarks" / "wordmark-b-notion-v2-trazado.svg"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(svg)

# metrics used by the lockups
iso_teal = (np.abs(img - np.array([59, 172, 166])).max(-1) < 40)
iso_teal[:, 340:] = False
ys, xs = np.nonzero(iso_teal)
iso_all = np.abs(img - bg).max(-1) > 25
iso_all[:, 340:] = False
ya, xa = np.nonzero(iso_all)
C = [c for c in report["contours"] if c["bbox"][0] < 365][0]["bbox"]
report["layout"] = {
    "isotipo_bbox": [int(xa.min()), int(ya.min()), int(xa.max()) + 1, int(ya.max()) + 1],
    "cell_body_bbox": [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1],
    "wordmark_bbox": [float(bx0), float(by0), float(bx1), float(by1)],
    "C_bbox": C,
}
L = report["layout"]
H_iso = L["isotipo_bbox"][3] - L["isotipo_bbox"][1]
cap = C[3] - C[1]
body_cy = (L["cell_body_bbox"][1] + L["cell_body_bbox"][3]) / 2
report["layout"]["ratios"] = {
    "cap_height_over_isotipo_height": round(cap / H_iso, 4),
    "gap_over_isotipo_height": round((C[0] - L["isotipo_bbox"][2]) / H_iso, 4),
    "cap_center_minus_body_center_over_isotipo_height": round(((C[1] + C[3]) / 2 - body_cy) / H_iso, 4),
    "wordmark_width_over_isotipo_height": round((bx1 - bx0) / H_iso, 4),
}
(EXP / "validation" / "wordmark-b.json").write_text(json.dumps(report, indent=2))
print(json.dumps(report["layout"], indent=1), "nodes", sum(c["nodes"] for c in report["contours"]))
