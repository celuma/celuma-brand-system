"""PNG exports, minimum-size test and export checks (all rendered by Chromium).

Outputs
  png/isotipo/…, png/lockups/…, png/favicon/…     transparent PNGs (favicon touch icons opaque)
  validation/lamina-minimos.png                    fiel vs reducido 16-32 px; lockups at candidate minimums
  validation/lamina-exportaciones.png              every export on checker, white, cream and navy
  validation/exports-check.json                    XML parse, size, mode, corner alpha, non-empty
"""
import json
import subprocess
import xml.etree.ElementTree as ET

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from celuma_img import EXP

VAL = EXP / "validation"
geo = json.loads((VAL / "geometry.json").read_text())
lk = json.loads((VAL / "lockups.json").read_text())
T = geo["tight_viewbox"]
SV = geo["small_viewbox"]
ISO = EXP / "svg" / "isotipo"
LOCK = EXP / "svg" / "lockups"
PNG = EXP / "png"
BG = {"blanco": "#ffffff", "crema": "#fbf6ec", "navy": "#0d1b2a"}
jobs = []


def job(src, out, w, h, bg=None, fit=None, dpr=1):
    j = {"kind": "svg", "src": str(src), "out": str(out), "width": int(round(w)), "height": int(round(h)), "dpr": dpr}
    if bg:
        j["bg"] = bg
    if fit:
        j["fit"] = fit
    jobs.append(j)


# ---- isotipo PNGs (height in px, transparent)
ar = T[2] / T[3]
for h in (64, 128, 256, 512, 1024):
    job(ISO / "celuma-isotipo-color.svg", PNG / "isotipo" / f"celuma-isotipo-color-{h}.png", h * ar, h)
for v in ("mono-navy", "mono-blanco", "mono-tramas-navy", "mono-tramas-blanco"):
    job(ISO / f"celuma-isotipo-{v}.svg", PNG / "isotipo" / f"celuma-isotipo-{v}-512.png", 512 * ar, 512)

# ---- lockups: horizontal 1200 px wide, vertical 800 px high (transparent)
for opt, folder in (("a", "propuesta-a-baloo2"), ("b", "propuesta-b-notion-v2")):
    for orient in ("horizontal", "vertical"):
        vb = lk[f"{opt}-{orient}"]["viewBox"]
        w, h = (1200, 1200 * vb[3] / vb[2]) if orient == "horizontal" else (800 * vb[2] / vb[3], 800)
        for var in ("color-positivo", "color-negativo", "mono-navy", "mono-blanco"):
            name = f"celuma-lockup-{orient}-{var}"
            job(LOCK / folder / f"{name}.svg", PNG / "lockups" / folder / f"{name}.png", w, h)

# ---- favicons / app icons: square boxes centred on the artwork
def square(vb, pad):
    x, y, w, h = vb
    side = max(w, h) * (1 + 2 * pad)
    return [x + w / 2 - side / 2, y + h / 2 - side / 2, side, side]


job(ISO / "celuma-isotipo-reducido-16-24px.svg", PNG / "favicon" / "favicon-16.png", 16, 16, fit=square(SV, 0.0))
job(ISO / "celuma-isotipo-color.svg", PNG / "favicon" / "favicon-32.png", 32, 32, fit=square(T, 0.0))
job(ISO / "celuma-isotipo-color.svg", PNG / "favicon" / "favicon-48.png", 48, 48, fit=square(T, 0.02))
job(ISO / "celuma-isotipo-color.svg", PNG / "favicon" / "apple-touch-icon-180.png", 180, 180, bg=BG["crema"], fit=square(T, 0.12))
job(ISO / "celuma-isotipo-color.svg", PNG / "favicon" / "icon-192.png", 192, 192, bg=BG["crema"], fit=square(T, 0.12))
job(ISO / "celuma-isotipo-color.svg", PNG / "favicon" / "icon-512-maskable.png", 512, 512, bg=BG["crema"], fit=square(T, 0.25))

# ---- minimum-size test renders (1x) : isotipo fiel vs reducido, lockups at candidate widths
MIN = VAL / "minimos"
for n in (16, 20, 24, 28, 32):
    for bgname, bg in BG.items():
        job(ISO / "celuma-isotipo-color.svg", MIN / f"fiel-{n}-{bgname}.png", n, n, bg=bg, fit=square(T, 0))
        job(ISO / "celuma-isotipo-reducido-16-24px.svg", MIN / f"reducido-{n}-{bgname}.png", n, n, bg=bg, fit=square(SV, 0))
for opt, folder in (("a", "propuesta-a-baloo2"), ("b", "propuesta-b-notion-v2")):
    vb = lk[f"{opt}-horizontal"]["viewBox"]
    for w in (64, 80, 96, 120):
        job(LOCK / folder / "celuma-lockup-horizontal-color-positivo.svg", MIN / f"h-{opt}-{w}.png", w, w * vb[3] / vb[2], bg=BG["crema"])
    vb = lk[f"{opt}-vertical"]["viewBox"]
    for h in (48, 64, 80):
        job(LOCK / folder / "celuma-lockup-vertical-color-positivo.svg", MIN / f"v-{opt}-{h}.png", h * vb[2] / vb[3], h, bg=BG["crema"])

(VAL / "_jobs-exports.json").write_text(json.dumps(jobs))
subprocess.run(["node", str(EXP / "scripts" / "render.mjs"), str(VAL / "_jobs-exports.json")], check=True, cwd=EXP / "scripts")

try:
    F = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
    FB = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 17)
except OSError:
    F = FB = ImageFont.load_default()
BANNER = "Exploración · no aprobada — 2-logo-vector-v2"


# ---- minimum-size sheet
def zoom(im, k):
    return im.resize((im.width * k, im.height * k), Image.NEAREST)


rows = []
for kind in ("fiel", "reducido"):
    for bgname in BG:
        tiles = [Image.open(MIN / f"{kind}-{n}-{bgname}.png").convert("RGB") for n in (16, 20, 24, 28, 32)]
        rows.append((f"{kind} · {bgname}", tiles))
W = 1760
sheet = Image.new("RGB", (W, 110 + len(rows) * 230 + 520), (245, 243, 238))
d = ImageDraw.Draw(sheet)
d.text((20, 16), "Tamaños mínimos · isotipo fiel vs versión reducida (16, 20, 24, 28, 32 px; 1:1 arriba, ×6 abajo)", fill=(13, 27, 42), font=FB)
d.text((W - 360, 18), BANNER, fill=(180, 65, 58), font=F)
y = 60
for label, tiles in rows:
    d.text((20, y), label, fill=(13, 27, 42), font=F)
    x = 160
    for t in tiles:
        sheet.paste(t, (x, y))
        sheet.paste(zoom(t, 6), (x, y + 40))
        x += 32 * 6 + 40
    y += 230
d.text((20, y), "Lockups a su mínimo candidato (1:1, fondo crema): horizontal 64 / 80 / 96 / 120 px de ancho · vertical 48 / 64 / 80 px de alto", fill=(13, 27, 42), font=FB)
y += 40
for opt in ("a", "b"):
    d.text((20, y + 10), f"Propuesta {opt.upper()}", fill=(13, 27, 42), font=F)
    x = 160
    for w in (64, 80, 96, 120):
        im = Image.open(MIN / f"h-{opt}-{w}.png").convert("RGB")
        sheet.paste(im, (x, y))
        sheet.paste(zoom(im, 3), (x, y + 60))
        x += w * 3 + 30
    for h in (48, 64, 80):
        im = Image.open(MIN / f"v-{opt}-{h}.png").convert("RGB")
        sheet.paste(im, (x, y))
        x += im.width + 30
    y += 230
sheet = sheet.crop((0, 0, W, y))
sheet.save(VAL / "lamina-minimos.png")

# ---- export checks
check = {"svg": {}, "png": {}}
for f in sorted((EXP / "svg").rglob("*.svg")) + [EXP / "master" / "celuma-isotipo-maestro.svg"]:
    txt = f.read_text()
    root = ET.fromstring(txt)
    check["svg"][str(f.relative_to(EXP))] = {
        "xml_ok": True, "viewBox": root.get("viewBox"), "bytes": len(txt.encode()),
        "has_raster_image": "<image" in txt, "has_text_element": "<text" in txt,
        "path_count": txt.count("<path"), "exploracion_label": "Exploración · no aprobada" in txt}
for f in sorted(PNG.rglob("*.png")):
    im = Image.open(f)
    a = np.asarray(im.convert("RGBA"))[..., 3]
    corners = [int(a[0, 0]), int(a[0, -1]), int(a[-1, 0]), int(a[-1, -1])]
    check["png"][str(f.relative_to(EXP))] = {"size": im.size, "mode": im.mode, "corner_alpha": corners,
                                              "transparent_background": max(corners) == 0,
                                              "opaque_pixels_share": round(float((a == 255).mean()), 3)}
(VAL / "exports-check.json").write_text(json.dumps(check, indent=1, ensure_ascii=False))

# ---- exports sheet: each PNG on checker / white / cream / navy
def checker(w, h, s=8):
    yy, xx = np.mgrid[0:h, 0:w]
    c = ((xx // s + yy // s) % 2) * 40 + 200
    return Image.fromarray(np.stack([c] * 3, -1).astype(np.uint8))


files = [f for f in sorted(PNG.rglob("*.png"))]
cell = 150
cols = 4
sheet = Image.new("RGB", (40 + (cell * 4 + 40) * cols, 70 + ((len(files) + cols - 1) // cols) * (cell + 44)), (245, 243, 238))
d = ImageDraw.Draw(sheet)
d.text((20, 16), f"Exportaciones PNG ({len(files)}) sobre damero, blanco, crema y navy — comprobación de transparencia", fill=(13, 27, 42), font=FB)
d.text((sheet.width - 360, 18), BANNER, fill=(180, 65, 58), font=F)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGBA")
    s = min((cell - 10) / im.width, (cell - 10) / im.height)
    im2 = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS if s < 1 else Image.NEAREST)
    x0 = 20 + (i % cols) * (cell * 4 + 40)
    y0 = 60 + (i // cols) * (cell + 44)
    d.text((x0, y0), str(f.relative_to(PNG)), fill=(60, 60, 60), font=F)
    for k, bg in enumerate([None, (255, 255, 255), (251, 246, 236), (13, 27, 42)]):
        base = checker(cell, cell) if bg is None else Image.new("RGB", (cell, cell), bg)
        base = base.convert("RGBA")
        base.alpha_composite(im2, ((cell - im2.width) // 2, (cell - im2.height) // 2))
        sheet.paste(base.convert("RGB"), (x0 + k * cell, y0 + 22))
sheet.save(VAL / "lamina-exportaciones.png")
bad = [k for k, v in check["png"].items() if not v["transparent_background"] and "touch" not in k and "icon-" not in k]
print("svg files", len(check["svg"]), "png files", len(check["png"]), "non-transparent (unexpected):", bad)
print("svg with raster/text:", [k for k, v in check["svg"].items() if v["has_raster_image"] or v["has_text_element"]])
print("svg missing label:", [k for k, v in check["svg"].items() if not v["exploracion_label"]])
