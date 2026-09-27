"""Phase 2 · motion curves of the timeline (validation/lamina-anim-curvas.png).

Plots, from validation/anim-spec.json, the nucleolus offset (x, y and distance to the nucleus
centre vs the 70 px limit) and each ray's scale and opacity over time, with the markers.
It is the quickest way to read rhythm, holds and overlaps without watching the video.
"""
import json
import math

from PIL import Image, ImageDraw, ImageFont

from celuma_img import EXP

spec = json.loads((EXP / "validation" / "anim-spec.json").read_text())
FPS = spec["fps"]
NUC = spec["nucleus_centre"]
NOL = spec["nucleolus_centre"]
try:
    F = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 14)
    FB = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 17)
except OSError:
    F = FB = ImageFont.load_default()

panels = []
for v in ("once", "loop"):
    rows = spec[v]["frames"]
    op = spec[v]["op"]
    Wp, Hp, L, T = 1400, 330, 70, 40
    im = Image.new("RGB", (Wp, Hp), (255, 255, 255))
    d = ImageDraw.Draw(im)
    d.text((L, 8), f"{'Una reproducción' if v == 'once' else 'Bucle'} · {op} fotogramas · {op / FPS:.2f} s", fill=(13, 27, 42), font=FB)
    X = lambda f: L + (Wp - L - 30) * f / (op - 1)
    # grid seconds
    for s in range(0, int(op / FPS) + 1):
        x = X(s * FPS)
        d.line([(x, T), (x, Hp - 30)], fill=(235, 235, 235))
        d.text((x - 6, Hp - 26), f"{s}s", fill=(120, 120, 120), font=F)
    for f, name in [(m[1], m[0]) for m in spec[v]["spec"]["markers"]]:
        d.line([(X(f), T), (X(f), Hp - 30)], fill=(249, 141, 132), width=1)
        d.text((X(f) + 3, T), name, fill=(180, 65, 58), font=F)
    # nucleolus distance to nucleus centre (0..80 mapped to the top half)
    top, bot = T + 24, T + 140

    def Y1(val):
        return bot - (bot - top) * val / 80

    d.line([(L, Y1(70)), (Wp - 30, Y1(70))], fill=(180, 65, 58))
    d.text((8, Y1(70) - 8), "límite 70", fill=(180, 65, 58), font=F)
    pts_d, pts_x = [], []
    for r in rows:
        cx = NOL[0] + r["nucleolo"][0] - NUC[0]
        cy = NOL[1] + r["nucleolo"][1] - NUC[1]
        pts_d.append((X(r["f"]), Y1(math.hypot(cx, cy))))
        pts_x.append((X(r["f"]), (top + bot) / 2 - cx * 0.55))
    d.line(pts_x, fill=(59, 172, 166), width=3)
    d.line(pts_d, fill=(13, 27, 42), width=2)
    d.text((8, top), "nucléolo", fill=(13, 27, 42), font=F)
    d.text((L + 4, bot - 16), "negro: distancia al centro del núcleo · teal: x (arriba = derecha)", fill=(90, 90, 90), font=F)
    # rays
    top2, bot2 = bot + 20, Hp - 36
    cols = {"rayo-1": (241, 196, 108), "rayo-2": (212, 150, 40), "rayo-3": (150, 100, 10)}
    for k, c in cols.items():
        d.line([(X(r["f"]), bot2 - (bot2 - top2) * r["rays"][k]["s"]) for r in rows], fill=c, width=3)
        d.line([(X(r["f"]), bot2 - (bot2 - top2) * r["rays"][k]["o"]) for r in rows], fill=c, width=1)
    d.text((8, top2), "rayos", fill=(13, 27, 42), font=F)
    d.text((L + 4, top2), "grueso: escala axial · fino: opacidad · claro→oscuro: rayo 1, 2, 3", fill=(90, 90, 90), font=F)
    panels.append(im)
out = Image.new("RGB", (1400, sum(p.height for p in panels) + 40), (245, 243, 238))
ImageDraw.Draw(out).text((20, 10), "Curvas de movimiento · Exploración · no aprobada", fill=(13, 27, 42), font=FB)
y = 40
for p in panels:
    out.paste(p, (0, y))
    y += p.height
out.save(EXP / "validation" / "lamina-anim-curvas.png")
print("ok")
