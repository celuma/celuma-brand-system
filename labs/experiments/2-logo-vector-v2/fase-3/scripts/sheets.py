"""Fase 3 · review sheets (láminas) rendered with lottie-web in Chromium. Aprobado en el experimento 02 · incorporación pendiente.

  validation/lamina-luz.png | lamina-enfoque.png | lamina-trazo.png   keyframes: isotipo, A, B · crema and navy
  validation/lamina-carga-tamanos.png                                  Luz loop at 32/48/64/96 px on three backgrounds
  validation/lamina-final-vs-estatico.png                              last frame vs exact static, diff x8
Usage: python3.10 sheets.py <playersDir> <workDir>
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
F3 = HERE.parent
PLAYERS, WORK = sys.argv[1], Path(sys.argv[2]) / "sheets"
WORK.mkdir(parents=True, exist_ok=True)
spec = json.loads((F3 / "validation/spec.json").read_text())
V, FPS = spec["variants"], spec["fps"]
BG = {"crema": "#fbf6ec", "navy": "#0d1b2a", "blanco": "#ffffff"}
TAG = "Aprobado en el experimento 02 · incorporación pendiente"


def font(sz, bold=False):
    for p in (["/System/Library/Fonts/Supplemental/Arial Bold.ttf"] if bold else []) + ["/System/Library/Fonts/Supplemental/Arial.ttf",
                                                                                      "/System/Library/Fonts/Helvetica.ttc"]:
        try:
            return ImageFont.truetype(p, sz)
        except OSError:
            pass
    return ImageFont.load_default()


def run(jobs, tag):
    p = WORK / f"_jobs-{tag}.json"
    p.write_text(json.dumps(jobs))
    subprocess.run(["node", str(HERE / "render.mjs"), str(p), PLAYERS, str(WORK / f"_r-{tag}.json")], check=True, cwd=HERE,
                   stdout=subprocess.DEVNULL)


def keyframes(key, n=7):
    """Evenly spaced over the motion (first moving frame -> final marker), plus the held last frame."""
    v = V[key]
    op = v["op"]
    if v["mode"] == "loop":
        return sorted(set(round(i * (op - 1) / (n - 1)) for i in range(n)))
    mk = dict((nm, t) for nm, t in v["markers"])
    end = mk.get("final", op - 1)
    start = min(t for nm, t in v["markers"] if t > 0)            # first thing that moves
    inner = [round(start + i * (end - start) / (n - 2)) for i in range(n - 2)]
    return sorted(set([0] + inner + [end, op - 1]))[:n + 1]


def phase(key, f):
    p = ""
    for nm, t in V[key]["markers"]:
        if f >= t:
            p = nm
    return p


def tile_size(key, H):
    b = V[key]["box"]
    return round(b[2] * H / b[3]), H


# ------------------------------------------------------------------ direction sheets
ROWS = {
    "luz": [("luz|iso|loop", "crema", 118), ("luz|iso|loop", "navy", 118), ("luz|iso|once", "crema", 118), ("luz|a-h-pos|once", "crema", 78),
            ("luz|b-h-pos|once", "crema", 78), ("luz|a-h-neg|once", "navy", 78), ("luz|b-v-neg|once", "navy", 150)],
    "enfoque": [("enfoque|iso|once", "crema", 118), ("enfoque|iso|once", "navy", 118), ("enfoque|a-h-pos|once", "crema", 78),
                ("enfoque|b-h-pos|once", "crema", 78), ("enfoque|a-h-neg|once", "navy", 78), ("enfoque|b-v-neg|once", "navy", 150)],
    "trazo": [("trazo|iso|once", "crema", 118), ("trazo|iso|once", "navy", 118), ("trazo|a-h-pos|once", "crema", 78),
              ("trazo|b-h-pos|once", "crema", 78), ("trazo|a-h-neg|once", "navy", 78), ("trazo|b-v-neg|once", "navy", 150)],
}
NAMES = {"luz": "Luz · solo se mueve la luz", "enfoque": "Enfoque · poner la muestra a foco", "trazo": "Trazo · la marca se dibuja"}
jobs = []
for d, rows in ROWS.items():
    for key, bg, H in rows:
        w, h = tile_size(key, H)
        jobs.append({"name": f"{key}@{bg}", "renderer": "lottie-svg", "src": V[key]["file"], "frames": keyframes(key, 8),
                     "outDir": str(WORK / d / f"{key.replace('|', '_')}_{bg}"), "w": w, "h": h, "bg": BG[bg], "fresh": True, "dpr": 2})
# loader sizes
LOOP = "luz|iso|loop"
load_frames = [0, 25, 40, 52, 64, 80, 119]
for bg in ("crema", "blanco", "navy"):
    for h in (32, 48, 64, 96):
        w, _ = tile_size(LOOP, h)
        jobs.append({"name": f"load{h}@{bg}", "renderer": "lottie-svg", "src": V[LOOP]["file"], "frames": load_frames,
                     "outDir": str(WORK / "load" / f"{bg}-{h}"), "w": w, "h": h, "bg": BG[bg], "fresh": True, "dpr": 2})
run(jobs, "all")

pad, gap = 28, 10
for d, rows in ROWS.items():
    blocks = []
    for key, bg, H in rows:
        fr = keyframes(key, 8)
        ims = [Image.open(WORK / d / f"{key.replace('|', '_')}_{bg}" / f"f{f:04d}.png").convert("RGB") for f in fr]
        blocks.append((key, bg, fr, ims))
    W = pad * 2 + max(sum(i.width for i in b[3]) + gap * (len(b[3]) - 1) for b in blocks)
    Hh = 96 + sum(b[3][0].height + 64 for b in blocks) + 20
    sheet = Image.new("RGB", (W, Hh), (245, 243, 238))
    dr = ImageDraw.Draw(sheet)
    dr.text((pad, 24), f"Céluma · fase 3 · {NAMES[d]} — fotogramas clave (lottie-web, SVG, 2×)", fill=(13, 27, 42), font=font(30, True))
    dr.text((W - pad - 420, 30), f"{TAG} · 2-logo-vector-v2", fill=(180, 65, 58), font=font(22))
    y = 96
    for key, bg, fr, ims in blocks:
        sub = key.split("|")
        mode = "bucle" if sub[2] == "loop" else "una vez"
        dr.text((pad, y), f"{sub[1]} · {mode} · fondo {bg} · {V[key]['op'] / FPS:.2f} s".replace(".", ","), fill=(55, 65, 81), font=font(22, True))
        y += 32
        x = pad
        for f, im in zip(fr, ims):
            sheet.paste(im, (x, y))
            dr.text((x + 2, y + im.height + 4), f"{f / FPS:.2f} s · {phase(key, f)}".replace(".", ","), fill=(107, 114, 128), font=font(17))
            x += im.width + gap
        y += ims[0].height + 32
    sheet.save(F3 / "validation" / f"lamina-{d}.png", optimize=True)
    print("lamina", d, sheet.size)

# loader sizes sheet (tiles are rendered at 2x: lay out from their real pixel size)
cols = load_frames
tile = {h: Image.open(WORK / "load" / f"crema-{h}" / "f0000.png").size for h in (32, 48, 64, 96)}
colw = max(w for w, _ in tile.values()) + 22
rowh = {h: tile[h][1] + 26 for h in tile}
blockh = sum(rowh.values()) + 34
W = pad * 2 + 110 + len(cols) * colw
Hh = 118 + 3 * (blockh + 18)
sheet = Image.new("RGB", (W, Hh), (245, 243, 238))
dr = ImageDraw.Draw(sheet)
dr.text((pad, 24), "Céluma · fase 3 · Luz · bucle de carga a tamaño real (render 2×)", fill=(13, 27, 42), font=font(30, True))
dr.text((pad, 64), f"{TAG}. Columnas: fotogramas del bucle de 2,0 s. El 0 y el 119 son el maestro: el bucle cierra sin salto.", fill=(107, 114, 128), font=font(19))
for c, f in enumerate(cols):
    dr.text((pad + 110 + c * colw, 94), f"f{f} · {f / FPS:.2f} s".replace(".", ","), fill=(55, 65, 81), font=font(16, True))
y = 118
for bg in ("crema", "blanco", "navy"):
    dr.rectangle([pad, y, W - pad, y + blockh], fill=BG[bg])
    ink = (13, 27, 42) if bg != "navy" else (220, 228, 236)
    dr.text((pad + 10, y + 8), bg, fill=ink, font=font(18, True))
    yy = y + 34
    for h in (32, 48, 64, 96):
        dr.text((pad + 10, yy + rowh[h] // 2 - 10), f"{h} px", fill=(107, 114, 128) if bg != "navy" else (174, 185, 198), font=font(17))
        for c, f in enumerate(cols):
            im = Image.open(WORK / "load" / f"{bg}-{h}" / f"f{f:04d}.png").convert("RGB")
            sheet.paste(im, (pad + 110 + c * colw, yy + (rowh[h] - im.height) // 2))
        yy += rowh[h]
    y += blockh + 18
sheet.save(F3 / "validation" / "lamina-carga-tamanos.png", optimize=True)
print("lamina carga", sheet.size)

# last frame vs static (from validate.py renders)
R = Path(sys.argv[2]) / "renders"
REFS = Path(sys.argv[2]) / "refs"
picks = ["luz|iso|once", "enfoque|b-h-pos|once", "trazo|iso|once", "trazo|b-v-pos|once", "enfoque|a-h-pos|once"]
tiles = []
for k in picks:
    v = V[k]
    last = np.asarray(Image.open(R / k.replace("|", "_") / "svg" / f"f{v['op'] - 1:04d}.png").convert("RGBA")).astype(int)
    ref_dir = ("cubic-" if v["subject"].startswith("a-") else "") + v["subject"]
    ref = np.asarray(Image.open(REFS / ref_dir / "initial.png").convert("RGBA")).astype(int)
    diff = np.clip(np.abs(last - ref).max(-1) * 8, 0, 255).astype(np.uint8)
    tiles.append((k, ref_dir, Image.fromarray(last.astype(np.uint8), "RGBA"), Image.fromarray(ref.astype(np.uint8), "RGBA"),
                  Image.fromarray(np.stack([diff, np.clip(diff.astype(int) * 2 - 255, 0, 255).astype(np.uint8), np.zeros_like(diff)], -1), "RGB"),
                  int((np.abs(last - ref).max(-1) == 0).mean() * 1e6) / 1e4))
TH = 190
W = pad * 2 + 3 * 640 + 2 * gap
Hh = 100 + len(tiles) * (TH + 60)
sheet = Image.new("RGB", (W, Hh), (245, 243, 238))
dr = ImageDraw.Draw(sheet)
dr.text((pad, 24), "Céluma · fase 3 · último fotograma (lottie-web SVG) vs estático exacto de la fase 1", fill=(13, 27, 42), font=font(28, True))
dr.text((pad, 62), f"{TAG}. Diferencia ×8: negro = idéntico. Lockups A: referencia = gemela cúbica (ver validación).", fill=(107, 114, 128), font=font(19))
y = 100
for k, rd, last, ref, diff, same in tiles:
    dr.text((pad, y), f"{k} · píxeles idénticos {same:.4f} % · referencia {rd}".replace(".", ","), fill=(55, 65, 81), font=font(19, True))
    y += 28
    for c, im in enumerate((last, ref, diff)):
        s = min(640 / im.width, TH / im.height)
        im2 = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        bgc = Image.new("RGB", (640, TH), (251, 246, 236) if c < 2 else (0, 0, 0))
        if im2.mode == "RGBA":
            bgc.paste(im2, ((640 - im2.width) // 2, (TH - im2.height) // 2), im2)
        else:
            bgc.paste(im2, ((640 - im2.width) // 2, (TH - im2.height) // 2))
        sheet.paste(bgc, (pad + c * (640 + gap), y))
    y += TH + 32
sheet.save(F3 / "validation" / "lamina-final-vs-estatico.png", optimize=True)
print("lamina final", sheet.size)
