"""Which open-licence typeface is closest to the Notion V2 wordmark?

The V2 wordmark is an image with no font metadata; this does not identify "the"
font, it ranks candidates by shape similarity. Per glyph (C, é, l, u, m, a):
both words are scaled to the same C ink height, each glyph is centred on its ink
box and compared by IoU. Also reported: word width / cap height (proportion).
Candidates are rendered by Chromium from the Google Fonts CSS API.

Outputs: validation/font-match.json, validation/lamina-tipografia-v2.png
"""
import json
import subprocess

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from celuma_img import EXP

VAL = EXP / "validation"
TMP = VAL / "_fontmatch"
FAMILIES = {  # family: weights to try (all SIL OFL 1.1 on Google Fonts)
    "Poppins": [600, 700, 800], "Montserrat": [600, 700, 800], "Plus Jakarta Sans": [700, 800],
    "DM Sans": [600, 700, 800], "Figtree": [700, 800], "Outfit": [600, 700], "Inter": [700, 800],
    "Manrope": [700, 800], "Urbanist": [700, 800], "Lexend": [600, 700], "Nunito Sans": [700, 800],
    "Work Sans": [600, 700], "Rubik": [600, 700], "Albert Sans": [700, 800], "Red Hat Display": [700, 800],
    "Baloo 2": [800],
}
# macOS system fonts: identification only (Apple licence does not allow logo use outside Apple platforms)
LOCAL = {"Avenir Next": [700, 800], "Avenir": [800, 900], "Futura": [700], "Helvetica Neue": [700]}
cands = [{"family": f, "weight": w} for f, ws in FAMILIES.items() for w in ws] + \
        [{"family": f, "weight": w, "local": True} for f, ws in LOCAL.items() for w in ws]
TMP.mkdir(parents=True, exist_ok=True)
(TMP / "cands.json").write_text(json.dumps(cands))
subprocess.run(["node", str(EXP / "scripts" / "font_match.mjs"), str(TMP / "cands.json"), str(TMP)], check=True)
rep = json.loads((TMP / "report.json").read_text())

# reference: V2 wordmark rendered large from the traced SVG
ref_svg = (EXP / "svg/wordmarks/wordmark-b-notion-v2-trazado.svg").read_text()
vb = [float(v) for v in __import__("re").search(r'viewBox="([^"]+)"', ref_svg).group(1).split()]
pad = 20
padded = ref_svg.replace(f'viewBox="{" ".join(f"{v:g}" for v in vb)}"',
                         f'viewBox="{vb[0] - pad:g} {vb[1] - pad:g} {vb[2] + 2 * pad:g} {vb[3] + 2 * pad:g}"')
(TMP / "ref.svg").write_text(padded)
ref_job = [{"kind": "svg", "src": str(TMP / "ref.svg"), "out": str(TMP / "ref.png"),
            "width": int((vb[2] + 2 * pad) * 4), "height": int((vb[3] + 2 * pad) * 4), "bg": "#ffffff"}]
(TMP / "ref.json").write_text(json.dumps(ref_job))
subprocess.run(["node", str(EXP / "scripts" / "render.mjs"), str(TMP / "ref.json")], check=True, cwd=EXP / "scripts")


def glyphs(path):
    g = 255 - np.asarray(Image.open(path).convert("L")).astype(np.float64)
    m = (g >= 128).astype(np.uint8)
    n, cc, st, _ = cv2.connectedComponentsWithStats(m, connectivity=8)
    comps = sorted([i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 200], key=lambda i: st[i, 0])
    boxes = [st[i, :4] for i in comps]
    # merge the acute accent into é: the component whose x-range overlaps another and sits above it
    groups = []
    for i, b in zip(comps, boxes):
        placed = False
        for gr in groups:
            gb = gr["box"]
            if b[0] < gb[0] + gb[2] and gb[0] < b[0] + b[2]:
                gr["ids"].append(i)
                x0, y0 = min(gb[0], b[0]), min(gb[1], b[1])
                x1, y1 = max(gb[0] + gb[2], b[0] + b[2]), max(gb[1] + gb[3], b[1] + b[3])
                gr["box"] = [x0, y0, x1 - x0, y1 - y0]
                placed = True
        if not placed:
            groups.append({"ids": [i], "box": list(b)})
    out = []
    for gr in groups:
        x, y, w, h = gr["box"]
        mask = np.isin(cc[y:y + h, x:x + w], gr["ids"]).astype(np.float32)
        out.append({"box": gr["box"], "mask": mask})
    return out


def place(mask, scale, size):
    h, w = mask.shape
    nh, nw = max(1, int(round(h * scale))), max(1, int(round(w * scale)))
    r = cv2.resize(mask, (nw, nh), interpolation=cv2.INTER_AREA)
    canvas = np.zeros(size, np.float32)
    oy, ox = (size[0] - nh) // 2, (size[1] - nw) // 2
    canvas[max(oy, 0):max(oy, 0) + min(nh, size[0]), max(ox, 0):max(ox, 0) + min(nw, size[1])] = \
        r[max(-oy, 0):max(-oy, 0) + min(nh, size[0]), max(-ox, 0):max(-ox, 0) + min(nw, size[1])]
    return canvas >= 0.5


ref = glyphs(TMP / "ref.png")

# Consistency: the Banner V2 (a screenshot) also sets "Céluma"; same lettering?
ban = np.asarray(Image.open(EXP / "referencias/notion/Celuma_Banner_V2.png").convert("RGB")).astype(np.float64)
bb = np.median(ban[:40, 1500:1600].reshape(-1, 3), 0)
bn = np.median(ban[ban.mean(-1) < 60], 0)
dd = bn - bb
fb = np.clip(((ban - bb) @ dd) / (dd @ dd), 0, 1)
fb[:, :450] = 0                                  # drop the isotipo
big = cv2.resize(fb.astype(np.float32), None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
Image.fromarray((255 - big * 255).clip(0, 255).astype(np.uint8)).save(TMP / "banner-word.png")
assert len(ref) == 6, len(ref)
refC = ref[0]["box"][3]
ref_width = (ref[-1]["box"][0] + ref[-1]["box"][2] - ref[0]["box"][0]) / refC
names = ["C", "é", "l", "u", "m", "a"]


def compare(ref, gl):
    s = ref[0]["box"][3] / gl[0]["box"][3]
    ious = []
    for a, b in zip(ref, gl):
        size = (int(max(a["box"][3], b["box"][3] * s)) + 40, int(max(a["box"][2], b["box"][2] * s)) + 40)
        A = place(a["mask"], 1.0, size)
        B = place(b["mask"], s, size)
        ious.append(float((A & B).sum() / (A | B).sum()))
    return s, ious


banner = glyphs(TMP / "banner-word.png")
bs, bious = compare(ref, banner) if len(banner) == 6 else (None, [])
banner_check = {"groups": len(banner), "mean_glyph_iou": round(float(np.mean(bious)), 4) if bious else None,
                "glyph_iou": dict(zip(names, [round(v, 3) for v in bious]))}
print("banner vs logotipo", banner_check)
results = []
for r in rep:
    if not r["loaded"]:
        results.append({"family": r["family"], "weight": r["weight"], "error": "font not loaded"})
        continue
    gl = glyphs(r["file"])
    if len(gl) != 6:
        results.append({"family": r["family"], "weight": r["weight"], "error": f"{len(gl)} glyph groups"})
        continue
    s = refC / gl[0]["box"][3]
    ious = []
    for a, b in zip(ref, gl):
        size = (int(max(a["box"][3], b["box"][3] * s)) + 40, int(max(a["box"][2], b["box"][2] * s)) + 40)
        A = place(a["mask"], 1.0, size)
        B = place(b["mask"], s, size)
        ious.append(float((A & B).sum() / (A | B).sum()))
    width = (gl[-1]["box"][0] + gl[-1]["box"][2] - gl[0]["box"][0]) * s / refC
    results.append({"family": r["family"], "weight": r["weight"], "local_system_font": bool(r.get("local")),
                    "mean_glyph_iou": round(float(np.mean(ious)), 4),
                    "glyph_iou": dict(zip(names, [round(v, 3) for v in ious])),
                    "word_width_over_cap": round(width, 3), "ref_word_width_over_cap": round(ref_width, 3),
                    "file": r["file"]})
ok = sorted([r for r in results if "mean_glyph_iou" in r], key=lambda r: -r["mean_glyph_iou"])
public = [{k: v for k, v in r.items() if k != "file"} for r in ok]
(VAL / "font-match.json").write_text(json.dumps({"method": __doc__, "banner_v2_vs_logotipo_v2": banner_check, "ranking": public,
                                                  "errors": [r for r in results if "error" in r]}, indent=2, ensure_ascii=False))
for r in ok[:8]:
    print(r["family"], r["weight"], r["mean_glyph_iou"], r["glyph_iou"], r["word_width_over_cap"], "ref", r["ref_word_width_over_cap"])
print("errors", [r for r in results if "error" in r])

# sheet: V2 reference + best weight of the top 5 families + Baloo 2
try:
    F = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 26)
except OSError:
    F = ImageFont.load_default()
best = {}
for r in ok:
    best.setdefault(r["family"], r)
rows = [("Logotipo V2 de Notion (trazado del raster)", TMP / "ref.png", None),
        (f"Banner V2 de Notion (captura) · IoU medio por glifo vs Logotipo V2 {banner_check['mean_glyph_iou']}", TMP / "banner-word.png", None)]
for fam in list(best)[:5]:
    rows.append((f'{fam} {best[fam]["weight"]} · IoU medio por glifo {best[fam]["mean_glyph_iou"]:.3f}', best[fam]["file"], best[fam]))
if "Baloo 2" in best and "Baloo 2" not in [r[0].split(" ")[0] for r in rows]:
    rows.append((f'Baloo 2 800 (en uso) · IoU {best["Baloo 2"]["mean_glyph_iou"]:.3f}', best["Baloo 2"]["file"], best["Baloo 2"]))
tiles = []
for label, f, _ in rows:
    g = glyphs(f)
    x0 = g[0]["box"][0]
    y0 = min(b["box"][1] for b in g)
    x1 = g[-1]["box"][0] + g[-1]["box"][2]
    y1 = max(b["box"][1] + b["box"][3] for b in g)
    im = Image.open(f).convert("RGB").crop((x0 - 10, y0 - 10, x1 + 10, y1 + 10))
    s = 160 / g[0]["box"][3]
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    tiles.append((label, im))
W = max(max(t[1].width for t in tiles) + 40, 1250)
Hh = sum(t[1].height + 50 for t in tiles) + 60
sheet = Image.new("RGB", (W, Hh), "white")
d = ImageDraw.Draw(sheet)
d.text((20, 14), "Wordmark V2 vs sans de licencia abierta (misma altura de C) — Exploración · no aprobada", fill=(13, 27, 42), font=F)
y = 60
for label, im in tiles:
    d.text((20, y), label, fill=(80, 80, 80), font=F)
    sheet.paste(im, (20, y + 34))
    y += im.height + 50
sheet.save(VAL / "lamina-tipografia-v2.png")

# renders are regenerated on every run; keep only the sheet and the JSON
import shutil
shutil.rmtree(TMP, ignore_errors=True)
