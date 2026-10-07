"""Experimento 03 · validación con reproductores reales (aprobado en laboratorio).

Uso: python3.10 validate.py <players> <trabajo>
  <players>  carpeta con lottie-web-5.13.0/package y lottiefiles-dotlottie-web-0.80.0/package (los mismos de 02)
  <trabajo>  carpeta fuera del repositorio para los renders (se pueden borrar)

Comprueba, para las 18 variantes Lottie y los 8 SVG + CSS:
  - último fotograma (una vez) o fotograma 0 y último (bucle) frente al estático exacto, rasterizados por el mismo Chromium;
    los lockups A se comparan también con su «gemela cúbica» (Baloo usa curvas Q; Lottie solo tiene C, ver 02 §3);
  - cierre del bucle (último fotograma = primero);
  - alfa en el borde de la caja en todos los fotogramas (a media resolución) y saltos entre fotogramas consecutivos;
  - SVG + CSS: t = 0, terminado, y con prefers-reduced-motion (sin animaciones en marcha e idéntico al estático);
  - lottie-web canvas y ThorVG en los finales de los isotipos y de un lockup;
  - estructura de los Lottie (sin máscaras, mates, efectos, expresiones, texto ni imágenes) y colores (solo paleta + navy/blanco);
  - geometría: nucléolo dentro del núcleo (Rebote) y citoplasma dentro de la membrana (Respira);
  - reproducción: intervalos de requestAnimationFrame a tamaño de uso (indicativo, Chromium headless).
Escribe validation/metrics.json y validation/lamina-final-vs-estatico.png.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
E3 = HERE.parent
sys.path.insert(0, str(HERE))
import motion03 as M  # noqa: E402
from svgpath import subpaths  # noqa: E402

PLAYERS, WORK = sys.argv[1], Path(sys.argv[2])
NO_RENDER = "--no-render" in sys.argv
WORK.mkdir(parents=True, exist_ok=True)
spec = json.loads((E3 / "spec.json").read_text())
V = spec["variants"]
PAL = {c.lower() for c in spec["palette"].values()} | {"#0d1b2a", "#ffffff"}


def cubic_d(d):
    out = []
    for sp in subpaths(d):
        out.append(f"M{sp[0][0][0]:.4f} {sp[0][0][1]:.4f}")
        for p0, c1, c2, p3 in sp:
            out.append(f"C{c1[0]:.4f} {c1[1]:.4f} {c2[0]:.4f} {c2[1]:.4f} {p3[0]:.4f} {p3[1]:.4f}")
        out.append("Z")
    return " ".join(out)


# ------------------------------------------------------------------ trabajos de render
jobs = []
TW = WORK / "twins"
TW.mkdir(exist_ok=True)


def size_of(v):
    b = v["box"]
    k = 0.5 if v["direction"] == "orden" else 1.0
    return round(b[2] * k), round(b[3] * k)


for key, v in V.items():
    w, h = size_of(v)
    name = key.replace("|", "-")
    out = WORK / name
    final = v["op"] - 1
    frames = [0, final] + ([v["fin"]] if v["fin"] is not None and v["fin"] != final else [])
    jobs.append({"renderer": "lottie-svg", "src": v["lottie"], "frames": frames, "outDir": str(out / "lottie-svg"), "w": w, "h": h,
                 "bg": None, "dpr": 1, "fresh": True, "name": f"{key} lottie-svg"})
    jobs.append({"renderer": "svg", "src": v["static"], "frames": ["initial"], "outDir": str(out / "static"), "w": w, "h": h,
                 "bg": None, "dpr": 1, "name": f"{key} static"})
    if "lockup" in key:
        txt = (E3 / v["static"]).read_text()
        m = re.search(r'(<path id="wordmark"[^>]* d=")([^"]+)(")', txt)
        twin = txt.replace(m.group(0), m.group(1) + cubic_d(m.group(2)) + m.group(3))
        tp = TW / f"{name}.svg"
        tp.write_text(twin)
        jobs.append({"renderer": "svg", "src": str(Path("validation") / "_twins" / f"{name}.svg"), "frames": ["initial"],
                     "outDir": str(out / "twin"), "w": w, "h": h, "bg": None, "dpr": 1, "name": f"{key} twin"})
    # barrido de todos los fotogramas a media resolución
    hw, hh = max(2, round(w / 2)), max(2, round(h / 2))
    step = 2 if v["direction"] == "orden" else 1
    jobs.append({"renderer": "lottie-svg", "src": v["lottie"], "frames": list(range(0, v["op"], step)), "outDir": str(out / "sweep"),
                 "w": hw, "h": hh, "bg": None, "dpr": 1, "fresh": False, "name": f"{key} sweep"})
    if v.get("css_svg"):
        fr = [0, "finished"] if not v["loop"] else [0, v["op"] // 2]
        jobs.append({"renderer": "css-svg", "src": v["css_svg"], "frames": fr, "outDir": str(out / "css"), "w": w, "h": h, "bg": None,
                     "dpr": 1, "name": f"{key} css", "computed": True})
        jobs.append({"renderer": "css-svg", "src": v["css_svg"], "frames": ["initial"], "outDir": str(out / "css-reduced"), "w": w, "h": h,
                     "bg": None, "dpr": 1, "reduced": True, "name": f"{key} css-reduced", "computed": True})
    if key in ("respira|isotipo", "brote|isotipo", "rebote|isotipo", "orden|isotipo", "brote|lockup-h-pos"):
        for r in ("lottie-canvas", "thorvg"):
            jobs.append({"renderer": r, "src": v["lottie"], "frames": [final], "outDir": str(out / r), "w": w, "h": h, "bg": None, "dpr": 1,
                         "fresh": True, "name": f"{key} {r}"})
# reproducción a tamaño de uso
USE = {"respira|isotipo": 96, "brote|isotipo": 160, "rebote|isotipo": 240, "orden|lockup-h-neg": 960, "brote|lockup-h-pos": 480}
for key, px in USE.items():
    v = V[key]
    b = v["box"]
    if v["direction"] == "orden" or "lockup-h" in key:
        w, h = px, round(px * b[3] / b[2])
    else:
        h, w = px, round(px * b[2] / b[3])
    jobs.append({"renderer": "lottie-svg", "src": v["lottie"], "frames": [], "outDir": str(WORK / "perf" / key.replace("|", "-")), "w": w, "h": h,
                 "bg": "#fbf6ec", "dpr": 2, "playback": True, "name": f"{key} playback {px}px"})

# el render sirve archivos desde 3-logo-motion/: se enlazan las gemelas temporalmente
link = E3 / "validation" / "_twins"
if link.is_symlink() or link.exists():
    link.unlink() if link.is_symlink() else None
link.symlink_to(TW, target_is_directory=True)
jf = WORK / "_jobs.json"
jf.write_text(json.dumps(jobs))
try:
    if not NO_RENDER:
        subprocess.run(["node", str(HERE / "render.mjs"), str(jf), PLAYERS, str(WORK / "_report.json")], check=True)
finally:
    link.unlink()
report = {r["name"]: r for r in json.loads((WORK / "_report.json").read_text())}


# ------------------------------------------------------------------ comparación de imágenes
def load(p):
    return np.asarray(Image.open(p).convert("RGBA")).astype(np.int16)


def compare(a, b):
    A, B = load(a), load(b)
    if A.shape != B.shape:
        return {"error": f"tamaño {A.shape} vs {B.shape}"}
    ident = float(np.mean(np.all(A == B, axis=2)))
    ma, mb = A[..., 3] >= 128, B[..., 3] >= 128
    iou = float((ma & mb).sum() / max(1, (ma | mb).sum()))
    # banda de antialias: píxeles con un vecino distinto (bordes de alfa y costuras entre colores), en A o en B, ±1 px
    def edges(X):
        e = np.zeros(X.shape[:2], bool)
        for dy, dx in ((0, 1), (1, 0), (1, 1), (1, -1)):
            Y = np.roll(np.roll(X, dy, 0), dx, 1)
            e |= np.any(X != Y, axis=2)
        return e
    band = cv2.dilate((edges(A) | edges(B)).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    off = ~band
    da = np.abs(A[..., 3] - B[..., 3])
    plateau = off & (A[..., 3] == 255) & (B[..., 3] == 255)
    drgb = np.abs(A[..., :3] - B[..., :3]).max(axis=2)
    res = {"identical": round(ident, 6), "iou": round(iou, 6), "alpha_off_band_max": int(da[off].max()) if off.any() else 0,
           "rgb_plateau_max": int(drgb[plateau].max()) if plateau.any() else 0, "rgb_plateau_mean": round(float(drgb[plateau].mean()), 4) if plateau.any() else 0}
    if ident == 1.0:
        res["class"] = "E"
    elif iou >= 0.9999 and res["alpha_off_band_max"] <= 2 and res["rgb_plateau_max"] <= 2:
        res["class"] = "T1"
    elif iou >= 0.999 and res["rgb_plateau_mean"] <= 1.0 and res["rgb_plateau_max"] <= 3:
        res["class"] = "T2"
    elif res["alpha_off_band_max"] <= 2 and res["rgb_plateau_max"] <= 2:
        res["class"] = "AA"                       # solo antialias, pero IoU < 0,999: no cumple T2
    else:
        res["class"] = "FALLA"
    return res


def tag(f):
    return f"f{f:04d}" if isinstance(f, int) else f


results = {}
for key, v in V.items():
    name = key.replace("|", "-")
    out = WORK / name
    final = v["op"] - 1
    st = out / "static" / "initial.png"
    r = {"op": v["op"], "fin": v["fin"], "loop": v["loop"]}
    r["final_vs_static"] = compare(out / "lottie-svg" / f"{tag(final)}.png", st)
    if "lockup" in key:
        r["final_vs_twin"] = compare(out / "lottie-svg" / f"{tag(final)}.png", out / "twin" / "initial.png")
        r["static_vs_twin"] = compare(st, out / "twin" / "initial.png")
    first = load(out / "lottie-svg" / "f0000.png")
    if v["loop"]:
        r["first_vs_static"] = compare(out / "lottie-svg" / "f0000.png", st)
        r["loop_closure"] = compare(out / "lottie-svg" / f"{tag(final)}.png", out / "lottie-svg" / "f0000.png")
    else:
        r["first_alpha_max"] = int(first[..., 3].max())          # 0 = cuadro vacío al empezar
    # barrido
    sw = sorted((out / "sweep").glob("f*.png"))
    border_hits, jumps, prev = [], [], None
    for p in sw:
        im = load(p)
        fr = int(p.stem[1:])
        a = im[..., 3]
        edge = max(int(a[0, :].max()), int(a[-1, :].max()), int(a[:, 0].max()), int(a[:, -1].max()))
        if edge > 0:
            border_hits.append(fr)
        if prev is not None:
            ch = np.any(np.abs(im - prev) > 24, axis=2)
            jumps.append(float(ch.mean()))
        prev = im
    r["border_nonzero_frames"] = border_hits
    r["max_consecutive_change"] = round(max(jumps), 4) if jumps else 0.0
    # CSS
    if v.get("css_svg"):
        c = {}
        if v["loop"]:
            c["t0_vs_static"] = compare(out / "css" / "f0000.png", st)
        else:
            c["finished_vs_static"] = compare(out / "css" / "finished.png", st)
            if "lockup" in key:
                c["finished_vs_twin"] = compare(out / "css" / "finished.png", out / "twin" / "initial.png")
        c["reduced_vs_static"] = compare(out / "css-reduced" / "initial.png", st)
        rep = report.get(f"{key} css-reduced", {})
        c["reduced_running"] = sum(x["running"] for x in rep.get("computed", []))
        c["animations"] = report.get(f"{key} css", {}).get("animations")
        r["css"] = c
    for rr in ("lottie-canvas", "thorvg"):
        p = out / rr / f"{tag(final)}.png"
        if p.exists():
            r.setdefault("other_players", {})[rr] = compare(p, st)
    r["errors"] = [e for n, x in report.items() if n.startswith(key + " ") for e in x.get("errors", [])]
    results[key] = r

# ------------------------------------------------------------------ estructura y color de los Lottie
FORBIDDEN = ("masksProperties", "hasMask", "tt", "td", "ef")


def walk(o, found, colors):
    if isinstance(o, dict):
        for k in FORBIDDEN:
            if k in o and o[k] not in (None, 0, False, []):
                found.add(k)
        if "shapes" in o and "tm" in o:                  # time remap solo existe en capas; «tm» también es la clave de los marcadores
            found.add("tm (time remap)")
        if o.get("ty") in (1, 2, 5) and "ks" in o and "shapes" not in o:
            found.add(f"layer-ty-{o['ty']}")
        if o.get("ty") in ("fl", "st"):
            c = o["c"]["k"]
            colors.add("#" + "".join(f"{int(round(x * 255 - 0.25)):02x}" for x in c[:3]))
        if "x" in o and isinstance(o.get("x"), str):
            found.add("expresión")
        for v in o.values():
            walk(v, found, colors)
    elif isinstance(o, list):
        for v in o:
            walk(v, found, colors)


structure = {}
for key, v in V.items():
    found, colors = set(), set()
    walk(json.loads((E3 / v["lottie"]).read_text()), found, colors)
    structure[key] = {"forbidden": sorted(found), "colors": sorted(colors), "off_palette": sorted(colors - PAL)}
css_colors = {}
for key, v in V.items():
    if v.get("css_svg"):
        cs = {c.lower() for c in re.findall(r'fill="(#[0-9a-fA-F]{6})"', (E3 / v["css_svg"]).read_text())}
        css_colors[key] = {"colors": sorted(cs), "off_palette": sorted(cs - PAL)}

# ------------------------------------------------------------------ geometría
geo = {}
r0 = np.array(M.NUCLEOLO_C) - np.array(M.NUCLEO_C)
lag = None
tree = M.rebote(None, box_h=800)["tree"]


def find(n, name):
    if n.get("id") == name:
        return n
    for k in n.get("kids", []) or []:
        f = find(k, name)
        if f:
            return f


lag = find(tree, "nucleolo-inercia")["track"]
dmax = max(np.linalg.norm(r0 + np.array(M.value_at(lag, f))) for f in range(0, M.F(2.5)))
geo["rebote_nucleolo"] = {"max_center_distance": round(float(dmax), 2), "limit": 70.0, "margin_to_nucleus_edge_px": round(109.4 - dmax - 31.3, 2)}
mem = M.MEM_POLY
cyt = M._poly("citoplasma")
C = np.array(M.CELL_C)
S = M.RESPIRA["S"]
cyt_s = C + (cyt - C) * S
d = [cv2.pointPolygonTest(mem.astype(np.float32).reshape(-1, 1, 2), (float(x), float(y)), True) for x, y in cyt_s]
d0 = [cv2.pointPolygonTest(mem.astype(np.float32).reshape(-1, 1, 2), (float(x), float(y)), True) for x, y in cyt]
geo["respira_membrana"] = {"ring_min_rest": round(min(d0), 2), "ring_min_inhale": round(min(d), 2), "scale": S}

# ------------------------------------------------------------------ reproducción
perf = {}
for key, px in USE.items():
    rep = report.get(f"{key} playback {px}px", {})
    dl = rep.get("raf_deltas_ms", [])
    if dl:
        a = np.array(dl)
        perf[key] = {"px": px, "median_ms": round(float(np.median(a)), 2), "p95_ms": round(float(np.percentile(a, 95)), 2),
                     "over_20ms": int((a > 20).sum()), "frames": len(a)}

# ------------------------------------------------------------------ resumen para la galería
rows = []
cls_count = {}
for key, r in results.items():
    f = r["final_vs_static"]
    cls = f["class"]
    if "final_vs_twin" in r and r["final_vs_twin"]["class"] == "E" and cls != "E":
        cls_txt = f"E frente a la gemela cúbica · archivo de 02 con curvas Q: {cls} (IoU {f['iou']:.4f})"
    else:
        cls_txt = f"{cls} ({f['identical'] * 100:.2f} % idéntico)"
    cls_count[cls] = cls_count.get(cls, 0) + 1
    start = ("maestro: " + r["first_vs_static"]["class"] + " · cierre: " + r["loop_closure"]["class"]) if r["loop"] else (
        "vacío" if r["first_alpha_max"] == 0 else f"alfa máx. {r['first_alpha_max']}")
    bh = r["border_nonzero_frames"]
    border = "alfa 0 en el borde" if not bh else f"{len(bh)} fotogramas tocan el borde ({bh[0]}–{bh[-1]})"
    other = ", ".join(f"{k.replace('lottie-', '')}: {x['class']}" for k, x in r.get("other_players", {}).items())
    notes = []
    if "css" in r:
        c = r["css"]
        cc = c.get("finished_vs_static") or c.get("t0_vs_static")
        notes.append(f"CSS {'final' if 'finished_vs_static' in c else 't=0'}: {cc['class']}" + (
            f" (gemela: {c['finished_vs_twin']['class']})" if "finished_vs_twin" in c else ""))
        notes.append(f"reducido: {c['reduced_vs_static']['class']}, {c['reduced_running']} animaciones")
    if structure[key]["forbidden"]:
        notes.append("usa: " + ", ".join(structure[key]["forbidden"]))
    if structure[key]["off_palette"]:
        notes.append("colores fuera de paleta: " + ", ".join(structure[key]["off_palette"]))
    notes.append(f"salto máx. {r['max_consecutive_change'] * 100:.1f} %")
    if r["errors"]:
        notes.append("errores: " + "; ".join(r["errors"]))
    rows.append([key.replace("|", " · "), cls_txt, start, border, other or "—", " · ".join(notes)])

n = len(results)
exact_final = sum(1 for r in results.values() if r["final_vs_static"]["class"] == "E" or r.get("final_vs_twin", {}).get("class") == "E")
kpis = [
    [f"{exact_final}/{n}", "finales Lottie idénticos al estático o a su gemela cúbica (lottie-web SVG)"],
    [f"{sum(1 for r in results.values() if r['final_vs_static']['class'] != 'FALLA')}/{n}", "finales sin diferencias fuera de la banda de antialias (E, T1, T2 o AA)"],
    [f"{sum(1 for r in results.values() if r['loop'] and r['loop_closure']['class'] == 'E')}/{sum(1 for r in results.values() if r['loop'])}", "bucles que cierran sin salto"],
    [f"{sum(1 for k in structure if not structure[k]['forbidden'] and not structure[k]['off_palette'])}/{n}", "Lottie sin máscaras, mates, efectos ni colores fuera de paleta"],
    [f"{sum(1 for r in results.values() if 'css' in r and r['css']['reduced_running'] == 0 and r['css']['reduced_vs_static']['class'] == 'E')}/{sum(1 for r in results.values() if 'css' in r)}",
     "SVG + CSS idénticos al estático con movimiento reducido"],
]
limits = ("Solo Chromium headless en macOS. No se probaron Safari/WebKit (el WebKit de Playwright falla en este equipo), Firefox, "
          "lottie-ios, lottie-android ni dispositivos reales. Los fotogramas intermedios se juzgan a ojo en láminas y vídeos.")
metrics = {"generated_by": "scripts/validate.py", "players": {"lottie-web": "5.13.0", "dotlottie-web": "0.80.0"},
           "tolerances": {"E": "100 % de píxeles RGBA idénticos",
                          "T1": "IoU ≥ 0,9999; |Δα| ≤ 2 fuera de la banda de antialias de 1 px; ΔRGB ≤ 2 en planos",
                          "T2": "IoU ≥ 0,999; ΔRGB medio ≤ 1 y máx. ≤ 3 en planos",
                          "AA": "no cumple T2 (IoU < 0,999), pero todas las diferencias están en la banda de antialias (0 fuera de banda y en planos)",
                          "banda": "píxeles con un vecino de otro color o alfa (bordes y costuras entre pigmentos) en cualquiera de las dos imágenes, ±1 px"},
           "variants": results, "structure": structure, "css_colors": css_colors, "geometry": geo, "performance": perf,
           "summary": {"kpis": kpis, "limits": limits, "classes": cls_count}, "rows": rows}
(E3 / "validation" / "metrics.json").write_text(json.dumps(metrics, ensure_ascii=False, indent=1))

# ------------------------------------------------------------------ lámina final vs estático
try:
    FONT = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 18)
except OSError:
    FONT = ImageFont.load_default()
tiles = []
for key in ("respira|isotipo", "brote|isotipo", "brote|lockup-h-pos", "rebote|lockup-v-neg", "orden|lockup-h-neg"):
    name = key.replace("|", "-")
    out = WORK / name
    a = Image.open(out / "lottie-svg" / f"{tag(V[key]['op'] - 1)}.png").convert("RGBA")
    b = Image.open(out / "static" / "initial.png").convert("RGBA")
    diff = np.abs(np.asarray(a).astype(int) - np.asarray(b).astype(int)).max(axis=2)
    dimg = Image.fromarray(np.clip(diff * 8, 0, 255).astype(np.uint8)).convert("RGBA")
    H = 180
    row = []
    for im in (a, b, dimg):
        k = H / im.height
        bg = Image.new("RGBA", im.size, (13, 27, 42, 255) if "neg" in key else (251, 246, 236, 255))
        row.append(Image.alpha_composite(bg, im).resize((max(1, round(im.width * k)), H)))
    tiles.append((key, row))
W = max(sum(t.width for t in row) + 60 for _, row in tiles) + 40
sheet = Image.new("RGB", (W, 60 + len(tiles) * 230), "#f5f3ee")
dr = ImageDraw.Draw(sheet)
dr.text((20, 18), "Experimento 03 · último fotograma (lottie-web SVG) · estático exacto · diferencia ×8 — aprobado en laboratorio", fill="#0d1b2a", font=FONT)
y = 56
for key, row in tiles:
    r = results[key]
    dr.text((20, y), f"{key} · {r['final_vs_static']['class']} ({r['final_vs_static']['identical'] * 100:.2f} % idéntico)"
            + (f" · gemela cúbica: {r['final_vs_twin']['class']}" if "final_vs_twin" in r else ""), fill="#374151", font=FONT)
    x = 20
    for im in row:
        sheet.paste(im, (x, y + 26))
        x += im.width + 20
    y += 230
sheet.save(E3 / "validation" / "lamina-final-vs-estatico.png", optimize=True)
print(json.dumps(metrics["summary"], ensure_ascii=False, indent=1))
print(json.dumps(geo, ensure_ascii=False))
print(json.dumps(perf, ensure_ascii=False))
for row in rows:
    print(" | ".join(row))
