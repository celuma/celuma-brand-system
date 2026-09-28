"""Write the SVG masters and the isotipo family from the fitted shapes.

Two palettes, one geometry:
- measured: the plateau medians of assets/celuma-isotipo.png (validation/color-analysis.json). Only the
  historical faithful master uses it; it is the evidence of the fit and is written byte-identical.
- approved: master/celuma-paleta-aprobada.json (Rafael, 2026-09-27). The ACTIVE master and every
  colour deliverable use it, so regenerating never brings the old membrane/nucleus colours back.

Inputs : validation/_shapes.json (fit_vector.py), validation/color-analysis.json, master/celuma-paleta-aprobada.json
Outputs: master/celuma-isotipo-maestro.svg                    HISTORICAL faithful master, measured colours, 697 x 777 box
         master/celuma-isotipo-maestro-paleta-aprobada.svg    ACTIVE master: same geometry and box, approved palette
         svg/isotipo/celuma-isotipo-color.svg                 approved palette, tight box (delivery)
         svg/isotipo/celuma-isotipo-ui.svg                    compatibility alias of the file above (old UI-variant path)
         svg/isotipo/celuma-isotipo-mono-navy.svg / -blanco   ADAPTATION: 1 ink (unchanged)
         svg/isotipo/celuma-isotipo-mono-tramas-*.svg         ADAPTATION: 1 ink with tints (unchanged)
         svg/isotipo/celuma-isotipo-reducido-16-24px.svg      ADAPTATION for 16-24 px, approved palette
         validation/geometry.json                             bbox, tight box, both palettes
"""
import json
import re

import numpy as np

from celuma_img import EXP, delta_e2000, hexcol, srgb_to_lab

shapes = json.loads((EXP / "validation" / "_shapes.json").read_text())
col = json.loads((EXP / "validation" / "color-analysis.json").read_text())["regions"]

# Ring and inner strokes are one ink in the drawing: their plateau medians differ by
# ≤ 1 level (ΔE00 reported below). Use the pixel-weighted mean of both medians.
ring, strokes = np.array(col["ring"]["median_rgb"]), np.array(col["strokes"]["median_rgb"])
w_r, w_s = col["ring"]["plateau_pixels"], col["strokes"]["plateau_pixels"]
teal = (ring * w_r + strokes * w_s) / (w_r + w_s)
de_teal = float(delta_e2000(srgb_to_lab(ring), srgb_to_lab(strokes)))
COL = {
    "rays": hexcol(col["rays"]["median_rgb"]),
    "teal": hexcol(teal),
    "mint": hexcol(col["mint"]["median_rgb"]),
    "nucleus": hexcol(col["nucleus"]["median_rgb"]),
    "nucleolus": hexcol(col["nucleolus"]["median_rgb"]),
}
# Approved palette (single source for every active colour output).
_ok = json.loads((EXP / "master" / "celuma-paleta-aprobada.json").read_text())["pigmentos"]
assert _ok["membrana"] == _ok["trazos"], "membrane and inner strokes are one ink in the drawing"
APPROVED = {
    "rays": _ok["rayos"],
    "teal": _ok["membrana"],
    "mint": _ok["citoplasma"],
    "nucleus": _ok["nucleo"],
    "nucleolus": _ok["nucleolo"],
}
NAVY, WHITE = "#0d1b2a", "#ffffff"


def d_of(key):
    kind, val = shapes[key]
    assert kind == "path", (key, kind)
    return val


def sample(d):
    nums = [float(v) for v in re.findall(r"-?\d+(?:\.\d+)?", d)]
    p0 = np.array(nums[:2])
    pts = [p0]
    t = np.linspace(0, 1, 60)[:, None]
    for i in range(2, len(nums), 6):
        P1, P2, P3 = np.array(nums[i:i + 2]), np.array(nums[i + 2:i + 4]), np.array(nums[i + 4:i + 6])
        pts.append((1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * P1 + 3 * (1 - t) * t * t * P2 + t ** 3 * P3)
        p0 = P3
    return np.vstack(pts)


allpts = np.vstack([sample(d_of(k)) for k in shapes])
x0, y0 = allpts.min(0)
x1, y1 = allpts.max(0)
tight = [float(np.floor(x0)), float(np.floor(y0)), float(np.ceil(x1) - np.floor(x0)), float(np.ceil(y1) - np.floor(y0))]
body_pts = sample(d_of("body"))
bx0, by0 = body_pts.min(0)
bx1, by1 = body_pts.max(0)

# Historical faithful master: text frozen as approved on 2026-09-26 (the file must stay byte-identical).
DESC = ("Aprobado en el experimento 02; incorporación canónica pendiente. Vectorización del isotipo vigente (assets/celuma-isotipo.png, "
        "recorte de Celuma_Isotipo_V2.png de Notion). Geometría ajustada al raster; ver "
        "labs/experiments/2-logo-vector-v2/README.md para método, métricas y diferencias residuales.")
PAL = (f"membrana y trazos {APPROVED['teal']}, citoplasma {APPROVED['mint']}, núcleo {APPROVED['nucleus']}, "
       f"nucléolo {APPROVED['nucleolus']}, rayos {APPROVED['rays']}")
ADESC = (f"Fuente activa de los entregables del experimento 02. Paleta aprobada por Rafael el 2026-09-27: {PAL}. "
         "Geometría idéntica al maestro fiel histórico master/celuma-isotipo-maestro.svg, ajustado a assets/celuma-isotipo.png. "
         "Incorporación canónica pendiente; ver labs/experiments/2-logo-vector-v2/DECISION.md.")
CDESC = (f"Entregable del experimento 02 con la paleta aprobada por Rafael el 2026-09-27 ({PAL}). "
         "Misma geometría que master/celuma-isotipo-maestro-paleta-aprobada.svg, caja ajustada al dibujo. "
         "Incorporación canónica pendiente.")


def header(viewbox, w, h, title, desc):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" width="{w}" height="{h}" '
            f'role="img" aria-labelledby="t d">\n'
            f'  <title id="t">{title}</title>\n  <desc id="d">{desc}</desc>\n')


def color_body(pal):
    s = f'  <g id="rayos" fill="{pal["rays"]}">\n'
    for i in (1, 2, 3):
        s += f'    <path id="rayo-{i}" d="{d_of(f"ray-{i}")}"/>\n'
    s += '  </g>\n  <g id="celula">\n'
    s += f'    <path id="membrana" fill="{pal["teal"]}" d="{d_of("body")}"/>\n'
    s += f'    <path id="citoplasma" fill="{pal["mint"]}" d="{d_of("cytoplasm")}"/>\n'
    s += f'    <path id="nucleo" fill="{pal["nucleus"]}" d="{d_of("nucleus")}"/>\n'
    s += f'    <path id="nucleolo" fill="{pal["nucleolus"]}" d="{d_of("nucleolus")}"/>\n'
    s += f'    <g id="trazos" fill="{pal["teal"]}">\n'
    s += f'      <path id="trazo-izquierdo" d="{d_of("stroke-left")}"/>\n'
    s += f'      <path id="trazo-derecho" d="{d_of("stroke-right")}"/>\n    </g>\n  </g>\n'
    return s


def mono_body(ink):
    # Same geometry; one ink. Ring = membrane minus cytoplasm; nucleus with the nucleolus knocked out.
    s = f'  <g id="rayos" fill="{ink}">\n'
    for i in (1, 2, 3):
        s += f'    <path id="rayo-{i}" d="{d_of(f"ray-{i}")}"/>\n'
    s += f'  </g>\n  <g id="celula" fill="{ink}" fill-rule="evenodd">\n'
    s += f'    <path id="membrana" d="{d_of("body")} {d_of("cytoplasm")}"/>\n'
    s += f'    <path id="nucleo" d="{d_of("nucleus")} {d_of("nucleolus")}"/>\n'
    s += f'    <path id="trazo-izquierdo" d="{d_of("stroke-left")}"/>\n'
    s += f'    <path id="trazo-derecho" d="{d_of("stroke-right")}"/>\n  </g>\n'
    return s


def tint_body(ink):
    # One ink with tints (screen/offset): keeps the tonal order of the colour version
    # (nucleus lighter than the ring, nucleolus darker than the nucleus).
    s = f'  <g id="rayos" fill="{ink}">\n'
    for i in (1, 2, 3):
        s += f'    <path id="rayo-{i}" d="{d_of(f"ray-{i}")}"/>\n'
    s += f'  </g>\n  <g id="celula" fill="{ink}">\n'
    s += f'    <path id="membrana" fill-rule="evenodd" d="{d_of("body")} {d_of("cytoplasm")}"/>\n'
    s += f'    <path id="nucleo" fill-opacity="0.4" d="{d_of("nucleus")}"/>\n'
    s += f'    <path id="nucleolo" d="{d_of("nucleolus")}"/>\n'
    s += f'    <path id="trazo-izquierdo" d="{d_of("stroke-left")}"/>\n'
    s += f'    <path id="trazo-derecho" d="{d_of("stroke-right")}"/>\n  </g>\n'
    return s


def small_body(pal):
    # 16-24 px: same positions; rays and ring thickened with a same-colour stroke,
    # inner strokes omitted (they fall below 1 px and read as noise).
    s = f'  <g id="rayos" fill="{pal["rays"]}" stroke="{pal["rays"]}" stroke-width="26" stroke-linejoin="round">\n'
    for i in (1, 2, 3):
        s += f'    <path id="rayo-{i}" d="{d_of(f"ray-{i}")}"/>\n'
    s += '  </g>\n  <g id="celula">\n'
    s += f'    <path id="membrana" fill="{pal["teal"]}" d="{d_of("body")}"/>\n'
    s += f'    <path id="citoplasma" fill="{pal["mint"]}" stroke="{pal["teal"]}" stroke-width="24" d="{d_of("cytoplasm")}"/>\n'
    s += f'    <path id="nucleo" fill="{pal["nucleus"]}" d="{d_of("nucleus")}"/>\n'
    s += f'    <path id="nucleolo" fill="{pal["nucleolus"]}" d="{d_of("nucleolus")}"/>\n  </g>\n'
    return s


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    print("wrote", path.relative_to(EXP), len(text), "bytes")


tvb = " ".join(f"{v:g}" for v in tight)
write(EXP / "master" / "celuma-isotipo-maestro.svg",
      header("0 0 697 777", 697, 777, "Céluma · isotipo · maestro fiel (aprobado en experimento 02)", DESC)
      + color_body(COL) + "</svg>\n")
write(EXP / "master" / "celuma-isotipo-maestro-paleta-aprobada.svg",
      header("0 0 697 777", 697, 777, "Céluma · isotipo · maestro activo, paleta aprobada (experimento 02)", ADESC)
      + color_body(APPROVED) + "</svg>\n")
write(EXP / "svg" / "isotipo" / "celuma-isotipo-color.svg",
      header(tvb, tight[2], tight[3], "Céluma · isotipo · color, paleta aprobada (experimento 02)", CDESC)
      + color_body(APPROVED) + "</svg>\n")
# Compatibility alias: the old UI-variant path now holds the same drawing and pigments as the delivery file.
write(EXP / "svg" / "isotipo" / "celuma-isotipo-ui.svg",
      header(tvb, tight[2], tight[3], "Céluma · isotipo · alias de compatibilidad de celuma-isotipo-color.svg (paleta aprobada)",
             "Alias generado por scripts/build_svg.py para no romper enlaces previos. Mismo dibujo y pigmentos que "
             f"svg/isotipo/celuma-isotipo-color.svg: paleta aprobada por Rafael el 2026-09-27 ({PAL}). "
             "No es otra variante; para trabajo nuevo use celuma-isotipo-color.svg. Incorporación canónica pendiente.")
      + color_body(APPROVED) + "</svg>\n")
# One-ink adaptations: no palette colour; text frozen as approved on 2026-09-26 (files stay byte-identical).
mdesc = ("Aprobado en el experimento 02; incorporación canónica pendiente. ADAPTACIÓN FUNCIONAL a una tinta: misma geometría que el maestro, "
         "pero el citoplasma se vuelve transparente y el nucléolo queda calado en el núcleo. No es idéntica al color.")
write(EXP / "svg" / "isotipo" / "celuma-isotipo-mono-navy.svg",
      header(tvb, tight[2], tight[3], "Céluma · isotipo · monocromo navy (adaptación, exploración)", mdesc)
      + mono_body(NAVY) + "</svg>\n")
write(EXP / "svg" / "isotipo" / "celuma-isotipo-mono-blanco.svg",
      header(tvb, tight[2], tight[3], "Céluma · isotipo · monocromo blanco (adaptación, exploración)", mdesc)
      + mono_body(WHITE) + "</svg>\n")

tdesc = ("Aprobado en el experimento 02; incorporación canónica pendiente. ADAPTACIÓN FUNCIONAL a una tinta con tramas (opacidad 40 % en el núcleo): "
         "misma geometría que el maestro; conserva el orden tonal. No es idéntica al color.")
for name, ink in (("navy", NAVY), ("blanco", WHITE)):
    write(EXP / "svg" / "isotipo" / f"celuma-isotipo-mono-tramas-{name}.svg",
          header(tvb, tight[2], tight[3], f"Céluma · isotipo · una tinta con tramas, {name} (adaptación, exploración)", tdesc)
          + tint_body(ink) + "</svg>\n")
# small sizes: rays grow 13 units at each end/side, the ring 12 units inward; box grows accordingly
svb = [tight[0] - 14, tight[1] - 14, tight[2] + 28, tight[3] + 28]
sdesc = ("Aprobado en el experimento 02; incorporación canónica pendiente. ADAPTACIÓN FUNCIONAL para 16-24 px: mismas posiciones; rayos y membrana "
         f"engrosados, trazos internos omitidos. Paleta aprobada el 2026-09-27. No usar por encima de 24 px; no es el maestro.")
write(EXP / "svg" / "isotipo" / "celuma-isotipo-reducido-16-24px.svg",
      header(" ".join(f"{v:g}" for v in svb), svb[2], svb[3], "Céluma · isotipo · versión reducida 16-24 px (adaptación, paleta aprobada)", sdesc)
      + small_body(APPROVED) + "</svg>\n")

geo = {"artwork_bbox": [round(float(v), 2) for v in (x0, y0, x1, y1)],
       "tight_viewbox": tight,
       "small_viewbox": svb,
       "body_bbox": [round(float(v), 2) for v in (bx0, by0, bx1, by1)],
       "colors_measured_png": COL, "colors_approved": APPROVED, "teal_ring_vs_strokes_de00": round(de_teal, 2),
       "nodes": {k: len(re.findall("C", d_of(k))) for k in shapes}}
geo["nodes_total"] = sum(geo["nodes"].values())
(EXP / "validation" / "geometry.json").write_text(json.dumps(geo, indent=2))
print(json.dumps(geo, indent=1))
