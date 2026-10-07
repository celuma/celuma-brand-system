"""Experimento 03 · manifiesto de archivos descargables (files.json) para la galería. Aprobado en el laboratorio; incorporación pendiente.

Uso: python3.10 manifest.py   (después de motion03.py, validate.py y video.mjs)
"""
import gzip
import json
from pathlib import Path

E3 = Path(__file__).resolve().parent.parent
DIRS = ["respira", "relevo", "brote", "atento", "orden", "rebote"]
NAMES = {"respira": "Respira", "relevo": "Relevo", "brote": "Brote", "atento": "Atento", "orden": "Orden", "rebote": "Rebote"}
KIND = {".json": "Lottie", ".mp4": "Vídeo MP4", ".webm": "Vídeo WebM", ".jpg": "Póster", ".gif": "GIF", ".js": "JS", ".png": "Lámina",
        ".py": "Generador", ".mjs": "Generador"}
TEXT = {".json", ".svg", ".js", ".py", ".mjs", ".md"}
EXTRA_JS = {"respira": "js/respira.js", "relevo": "js/relevo.js", "atento": "js/atento.js"}
NOTES = {
    "js/respira.js": "reglas del loader: 400 ms de retardo, 600 ms mínimos, 3 ciclos, cierre sin «hecho»",
    "js/relevo.js": "FLIP con Web Animations; reducido: fundidos",
    "js/atento.js": "atención al puntero y al foco; reducido: sin oyentes",
    "preview/rebote-social-1x1.mp4": "pieza de ejemplo con texto comprobado (v1.3.1)",
    "preview/rebote-sticker.gif": "sticker; el GIF no respeta el movimiento reducido",
}


def entry(rel, direction, group):
    p = E3 / rel
    raw = p.read_bytes()
    ext = p.suffix
    kind = KIND.get(ext, ext[1:].upper())
    if rel.startswith("svg/"):
        kind = "SVG + CSS"
    elif rel.startswith("estaticos/"):
        kind = "Estático"
    e = {"path": rel, "kind": kind, "bytes": len(raw), "direction": direction, "group": group}
    if ext in TEXT:
        e["gzip"] = len(gzip.compress(raw, 9))
    if rel in NOTES:
        e["note"] = NOTES[rel]
    return e


files = []
for d in DIRS:
    rels = []
    for sub, pat in (("lottie", f"{d}-*.json"), ("svg", f"{d}-*.svg"), ("estaticos", f"{d}-*.svg"), ("preview", f"{d}*.mp4"),
                     ("preview", f"{d}*.webm"), ("preview", f"{d}*.gif"), ("preview", f"{d}*-poster.jpg"), ("validation", f"lamina-{d}.png")):
        rels += sorted(str(p.relative_to(E3)) for p in (E3 / sub).glob(pat))
    if d in EXTRA_JS:
        rels.insert(0, EXTRA_JS[d])
    files += [entry(r, d, NAMES[d]) for r in rels]
for r in ("scripts/motion03.py", "scripts/orden.py", "scripts/svgpath.py", "scripts/render.mjs", "scripts/validate.py", "scripts/sheet.py",
          "scripts/video.mjs", "scripts/page_check.mjs", "scripts/manifest.py", "spec.json"):
    if (E3 / r).exists():
        files.append(entry(r, None, "Generadores y especificación"))
for r in ("validation/metrics.json", "validation/lamina-final-vs-estatico.png", "validation/pagecheck.json"):
    if (E3 / r).exists():
        files.append(entry(r, None, "Evidencia de validación"))
(E3 / "files.json").write_text(json.dumps({"generated_by": "scripts/manifest.py", "files": files}, ensure_ascii=False, indent=1))
print(len(files), "archivos ·", sum(f["bytes"] for f in files) // 1024, "KB")
