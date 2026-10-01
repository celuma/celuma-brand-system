"""Experimento 03 · láminas de fotogramas clave (exploración, no aprobada).

Uso: python3.10 sheet.py <players> <trabajo> [dirección ...]
Renderiza con lottie-web (SVG, DOM nuevo por fotograma) los instantes clave de cada variante sobre crema y navy y
compone validation/lamina-<dirección>.png. Los renders intermedios quedan en <trabajo> (fuera del repositorio).
"""
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
E3 = HERE.parent
spec = json.loads((E3 / "spec.json").read_text())
V = spec["variants"]
PLAYERS, WORK = sys.argv[1], Path(sys.argv[2])
WANT = sys.argv[3:] or ["respira", "brote", "rebote", "orden"]
BG = {"crema": "#fbf6ec", "navy": "#0d1b2a"}
ROWS = {
    "respira": [("isotipo", "crema"), ("isotipo", "navy"), ("lockup-h-pos", "crema")],
    "brote": [("isotipo", "crema"), ("isotipo", "navy"), ("lockup-h-pos", "crema"), ("lockup-v-neg", "navy")],
    "rebote": [("isotipo", "crema"), ("isotipo", "navy"), ("lockup-v-pos", "crema"), ("lockup-h-neg", "navy")],
    "orden": [("isotipo", "crema"), ("lockup-h-neg", "navy"), ("lockup-v-pos", "crema")],
}
N = {"respira": 8, "brote": 9, "rebote": 10, "orden": 10}
try:
    FONT = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 22)
    FONTB = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 26)
except OSError:
    FONT = FONTB = ImageFont.load_default()


def frames_for(v, n):
    op = v["op"]
    if v["loop"]:
        return [round(i * (op - 1) / (n - 1)) for i in range(n)]
    fin = v["fin"]
    fs = [round(i * fin / (n - 2)) for i in range(n - 1)] + [op - 1]
    return sorted(set(min(f, op - 1) for f in fs))


jobs, plan = [], {}
for d in WANT:
    for subj, bg in ROWS[d]:
        key = f"{d}|{subj}"
        v = V[key]
        b = v["box"]
        h = 150 if subj in ("isotipo",) else 110
        w = round(b[2] * h / b[3]) if not subj.startswith("lockup-h") or d == "orden" else round(b[2] * h / b[3])
        if d == "orden":
            h = 170 if v.get("aspect") == "1:1" else 150
            w = round(b[2] * h / b[3])
        fr = frames_for(v, N[d])
        out = WORK / d / f"{subj}-{bg}"
        jobs.append({"renderer": "lottie-svg", "src": v["lottie"], "frames": fr, "outDir": str(out), "w": w * 2, "h": h * 2,
                     "bg": BG[bg], "dpr": 1, "fresh": True, "name": f"{key}-{bg}"})
        plan.setdefault(d, []).append((key, bg, fr, out, w * 2, h * 2))
jf = WORK / "_sheet-jobs.json"
jf.parent.mkdir(parents=True, exist_ok=True)
jf.write_text(json.dumps(jobs))
subprocess.run(["node", str(HERE / "render.mjs"), str(jf), PLAYERS, str(WORK / "_sheet-report.json")], check=True)

for d, rows in plan.items():
    gap, lab = 14, 34
    width = max(sum(r[4] + gap for r in [row] * len(row[2])) for row in rows) + gap
    height = 70 + sum(r[5] + lab + gap + 14 for r in rows)
    sheet = Image.new("RGB", (max(width, 900), height), "#f5f3ee")
    dr = ImageDraw.Draw(sheet)
    dr.text((gap, 18), f"Céluma · experimento 03 · {d} · fotogramas clave (lottie-web SVG, 2×)", fill="#0d1b2a", font=FONTB)
    dr.text((sheet.width - 470, 22), "Exploración · no aprobada", fill="#b4413a", font=FONT)
    y = 70
    for key, bg, fr, out, w, h in rows:
        v = V[key]
        dr.text((gap, y), f"{key.split('|')[1]} · {bg} · {'bucle' if v['loop'] else 'una vez'} · {v['duration_s']:.2f} s".replace(".", ","),
                fill="#374151", font=FONT)
        x = gap
        for f in fr:
            im = Image.open(out / f"f{f:04d}.png").convert("RGB")
            sheet.paste(im, (x, y + lab - 6))
            dr.text((x, y + lab + h - 2), f"{f / 60:.2f} s".replace(".", ","), fill="#6b7280", font=FONT)
            x += w + gap
        y += h + lab + gap + 14
    p = E3 / "validation" / f"lamina-{d}.png"
    sheet.save(p, optimize=True)
    print(p, sheet.size)
