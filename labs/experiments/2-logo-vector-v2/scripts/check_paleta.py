"""Check that every active piece of the experiment uses the approved palette and the master geometry.

Source of truth: master/celuma-paleta-aprobada.json (Rafael, 2026-09-27).
- Historical faithful master keeps the measured PNG colours (evidence); the active master has the
  approved ones. Both must share the same elements, ids, order, nesting, path data and attributes.
- Colour SVGs (isotipo, reduced, lockups A/B, phase-2/3 motion SVGs and statics): isotipo pigments
  are exactly the approved palette and every isotipo path equals the active master's.
- One-ink adaptations (mono, tints and mono lockups) carry only navy or white.
- Compatibility aliases (svg/isotipo/celuma-isotipo-ui.svg, svg/lockups/ui-baloo2/) have the same body
  as the file they alias.
- Lottie (phase 2 and 3): decoded fill/stroke colours are approved pigments, navy or white.
- PNG exports, example artboards and preview posters: no plateau pixel (3x3 uniform, opaque) has an
  old colour. PNG exports (png/) of at least 100 px show all five approved pigments on plateaus;
  example artboards, where the logo can be small, show at least the approved membrane and nucleus
  (rays thinner than 3 px have no plateau). Edge pixels are anti-alias blends and are not judged.
- No active text file contains the old membrane/nucleus hex values.

Usage: /opt/homebrew/bin/python3.10 scripts/check_paleta.py   (from the experiment folder)
Writes validation/paleta-check.json; exit code 1 if any check fails.
"""
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from PIL import Image

EXP = Path(__file__).resolve().parent.parent
PAL = json.loads((EXP / "master/celuma-paleta-aprobada.json").read_text())
OK = {k: v.lower() for k, v in PAL["pigmentos"].items()}
MEASURED = {k: v.lower() for k, v in PAL["medidos_en_png"].items() if k != "nota"}
OLD = sorted({MEASURED[k] for k in MEASURED if MEASURED[k] != OK[k]} | {"#3cada7"})
INKS = {"#0d1b2a", "#ffffff"}
NS = "{http://www.w3.org/2000/svg}"
ISO_IDS = ["rayos", "membrana", "citoplasma", "nucleo", "nucleolo", "trazos"]
KEY = {"rayos": "rayos", "membrana": "membrana", "citoplasma": "citoplasma", "nucleo": "nucleo",
       "nucleolo": "nucleolo", "trazos": "trazos"}
HIST = EXP / "master/celuma-isotipo-maestro.svg"
ACTIVE = EXP / "master/celuma-isotipo-maestro-paleta-aprobada.svg"
checks = []


def check(name, ok, detail=""):
    checks.append({"check": name, "ok": bool(ok), "detail": detail})


def rel(p):
    return str(Path(p).relative_to(EXP))


def structure(path):
    """(tag, id, parent path, attributes without fill/stroke) for every element under the root, in order."""
    out = []

    def walk(el, parents):
        for ch in el:
            tag = ch.tag.replace(NS, "")
            if tag in ("title", "desc", "style"):
                continue
            attrs = {k: v for k, v in ch.attrib.items() if k not in ("fill", "stroke")}
            out.append((tag, ch.get("id"), "/".join(parents), tuple(sorted(attrs.items()))))
            walk(ch, parents + (ch.get("id") or tag,))
    walk(ET.parse(path).getroot(), ())
    return out


def pigments(path):
    """Pigment of each isotipo part, read on the element that carries the id."""
    root = ET.parse(path).getroot()
    by_id = {el.get("id"): el for el in root.iter() if el.get("id")}
    return {k: (by_id[k].get("fill") or "").lower() for k in ISO_IDS if k in by_id}


def paths(path):
    root = ET.parse(path).getroot()
    return {el.get("id"): el.get("d") for el in root.iter(NS + "path") if el.get("id")}


def fills_all(text):
    return {m.lower() for m in re.findall(r'(?:fill|stroke)="(#[0-9a-fA-F]{6})"', text)}


# ------------------------------------------------------------------ masters
check("maestro histórico: pigmentos medidos en el PNG", pigments(HIST) == {k: MEASURED[k] for k in ISO_IDS}, rel(HIST))
check("maestro activo: pigmentos aprobados", pigments(ACTIVE) == {k: OK[k] for k in ISO_IDS}, rel(ACTIVE))
check("maestro activo = histórico en elementos, ids, orden, anidación, d y atributos (salvo fill)",
      structure(ACTIVE) == structure(HIST) and paths(ACTIVE) == paths(HIST), f"{len(structure(ACTIVE))} elementos")
MASTER_D = paths(ACTIVE)

# ------------------------------------------------------------------ colour SVGs
geo = json.loads((EXP / "validation/geometry.json").read_text())
colour_svgs = [EXP / "svg/isotipo/celuma-isotipo-color.svg", EXP / "svg/isotipo/celuma-isotipo-ui.svg"]
colour_svgs += sorted((EXP / "svg/lockups").glob("*/*-color-*.svg")) + sorted((EXP / "svg/lockups/ui-baloo2").glob("*.svg"))
colour_svgs += [EXP / "anim/celuma-isotipo-once.svg", EXP / "anim/celuma-isotipo-loop.svg", EXP / "anim/celuma-isotipo-maestro-caja-anim.svg"]
colour_svgs += sorted((EXP / "fase-3/estaticos").glob("*.svg")) + sorted((EXP / "fase-3/svg").glob("*.svg"))
bad = [rel(f) for f in colour_svgs if pigments(f) != {k: OK[k] for k in ISO_IDS}]
check("SVG en color: pigmentos del isotipo = paleta aprobada", not bad, f"{len(colour_svgs)} archivos; fallan {bad}")
bad = [rel(f) for f in colour_svgs if any(paths(f).get(k) != d for k, d in MASTER_D.items())]
check("SVG en color: todos los trazados del isotipo = maestro activo", not bad, f"{len(colour_svgs)} archivos; fallan {bad}")
iso = EXP / "svg/isotipo/celuma-isotipo-color.svg"
root = ET.parse(iso).getroot()
check("isotipo color: caja ajustada sin cambios", root.get("viewBox") == " ".join(f"{v:g}" for v in geo["tight_viewbox"]), root.get("viewBox"))
red = EXP / "svg/isotipo/celuma-isotipo-reducido-16-24px.svg"
check("versión reducida: solo pigmentos aprobados", fills_all(red.read_text()) <= set(OK.values()), sorted(fills_all(red.read_text())))
ink_only = sorted((EXP / "svg/isotipo").glob("*mono*.svg")) + sorted((EXP / "svg/lockups").glob("*/*-mono-*.svg"))
bad = [rel(f) for f in ink_only if not fills_all(f.read_text()) <= INKS]
check("adaptaciones a una tinta: solo navy o blanco", not bad, f"{len(ink_only)} archivos; fallan {bad}")

# ------------------------------------------------------------------ aliases
aliases = {EXP / "svg/isotipo/celuma-isotipo-ui.svg": iso}
for f in sorted((EXP / "svg/lockups/ui-baloo2").glob("*.svg")):
    aliases[f] = EXP / "svg/lockups/propuesta-a-baloo2" / f.name.replace("-ui-", "-color-")
body = lambda p: p.read_text().split("</desc>\n", 1)[1]
root_line = lambda p: p.read_text().split("\n", 1)[0]
bad = [rel(a) for a, s in aliases.items() if not s.exists() or body(a) != body(s) or root_line(a) != root_line(s)]
check("alias de compatibilidad: mismo cuerpo y caja que el archivo activo", len(aliases) == 5 and not bad, f"{len(aliases)} alias; fallan {bad}")

# ------------------------------------------------------------------ Lottie


def lottie_colours(obj, out):
    if isinstance(obj, dict):
        if obj.get("ty") in ("fl", "st") and isinstance(obj.get("c"), dict):
            k = obj["c"].get("k")
            if isinstance(k, list) and k and isinstance(k[0], (int, float)):
                out.add("#%02x%02x%02x" % tuple(int(round(v * 255 - 0.25)) for v in k[:3]))
            elif isinstance(k, list):
                for kf in k:
                    for v in (kf.get("s"), kf.get("e")):
                        if v:
                            out.add("#%02x%02x%02x" % tuple(int(round(c * 255 - 0.25)) for c in v[:3]))
        for v in obj.values():
            lottie_colours(v, out)
    elif isinstance(obj, list):
        for v in obj:
            lottie_colours(v, out)
    return out


lotties = sorted((EXP / "anim").glob("*.json")) + sorted((EXP / "fase-3/lottie").glob("*.json"))
allowed = set(OK.values()) | INKS
report_lottie = {}
for f in lotties:
    cols = lottie_colours(json.loads(f.read_text()), set())
    report_lottie[rel(f)] = sorted(cols)
bad = [k for k, v in report_lottie.items() if not set(v) <= allowed or not set(OK.values()) <= set(v)]
check("Lottie: colores = paleta aprobada (+ navy/blanco del wordmark)", not bad, f"{len(lotties)} archivos; fallan {bad}")

# ------------------------------------------------------------------ text files without old colours
texts = [ACTIVE, *colour_svgs, *ink_only, red, EXP / "anim/review-data.js", EXP / "fase-3/data.js", *lotties]
bad = [rel(f) for f in texts if any(o in f.read_text().lower() for o in OLD)]
check("archivos activos sin los hex anteriores " + ", ".join(OLD), not bad, f"{len(texts)} archivos; fallan {bad}")

# ------------------------------------------------------------------ PNG and posters


def plateau_colours(path):
    a = np.asarray(Image.open(path).convert("RGBA")).astype(np.int64)
    code = (a[..., 0] << 24) | (a[..., 1] << 16) | (a[..., 2] << 8) | a[..., 3]
    c = code[1:-1, 1:-1]
    same = np.ones_like(c, dtype=bool)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            same &= code[1 + dy:code.shape[0] - 1 + dy, 1 + dx:code.shape[1] - 1 + dx] == c
    flat = c[same & ((c & 255) == 255)]
    vals, counts = np.unique(flat, return_counts=True)
    return {"#%06x" % (v >> 8): int(n) for v, n in zip(vals, counts)}


pngs = sorted((EXP / "png").rglob("*color*.png")) + sorted((EXP / "png/favicon").glob("*.png"))
pngs += sorted((EXP / "examples").glob("*.png")) + [EXP / "anim/preview/celuma-isotipo-anim-preview-poster.jpg"]
pngs += sorted((EXP / "fase-3/preview").glob("*-poster.jpg"))
report_png = {}
for f in pngs:
    pc = plateau_colours(f)
    report_png[rel(f)] = {"size": list(Image.open(f).size), "plateau_old": {o: pc.get(o, 0) for o in OLD},
                          "plateau_approved": {k: pc.get(v, 0) for k, v in OK.items() if k != "trazos"}}
exports = [k for k in report_png if k.startswith("png/") and min(report_png[k]["size"]) >= 100]
examples = [k for k in report_png if k.startswith("examples/")]
bad = [k for k in report_png if sum(report_png[k]["plateau_old"].values())]
check("PNG/JPG: ningún píxel de meseta con los colores anteriores", not bad, f"{len(report_png)} imágenes; fallan {bad}")
bad = [k for k in exports if not all(report_png[k]["plateau_approved"].values())]
check("exportaciones PNG de 100 px o más: los cinco pigmentos aprobados en meseta", not bad, f"{len(exports)} PNG; fallan {bad}")
bad = [k for k in examples if not (report_png[k]["plateau_approved"]["membrana"] and report_png[k]["plateau_approved"]["nucleo"])]
check("ejemplos: membrana y núcleo aprobados en meseta", not bad, f"{len(examples)} PNG; fallan {bad}")

out = {"paleta_aprobada": OK, "colores_anteriores": OLD, "checks": checks, "lottie_colores": report_lottie, "imagenes": report_png}
(EXP / "validation/paleta-check.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
for c in checks:
    print(("OK  " if c["ok"] else "FAIL") + f"  {c['check']}  {c['detail'] if not c['ok'] else ''}")
sys.exit(0 if all(c["ok"] for c in checks) else 1)
