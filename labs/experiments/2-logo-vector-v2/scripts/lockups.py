"""Compose PROPOSAL lockups from the master isotipo and the two wordmark options.

Horizontal proportions are measured on Notion's Celuma_Logotipo_V2.png (the only
lockup reference that exists) and applied to BOTH options so that the comparison
isolates the typeface:
  cap height (C ink)          = 0.4359 x isotipo height (H)
  gap isotipo → C ink         = 0.1387 x H
  C ink centre                = cell-body centre + 0.0297 x H
Vertical lockup (no reference exists — proposal): wordmark width = 1.5 x isotipo
width, centred, 0.10 x H below the isotipo.

Outputs: svg/lockups/<option>/celuma-lockup-<horizontal|vertical>-<variant>.svg
         validation/lockups.json (boxes used by the rules and the HTML views)
"""
import json
import re

from celuma_img import EXP

geo = json.loads((EXP / "validation" / "geometry.json").read_text())
wb = json.loads((EXP / "validation" / "wordmark-b.json").read_text())
wa = json.loads((EXP / "validation" / "wordmark-a.json").read_text())
R = wb["layout"]["ratios"]
iso_x, iso_y, iso_w, iso_h = geo["tight_viewbox"]          # 73 43 549 669
H = iso_h
body_cy = (geo["body_bbox"][1] + geo["body_bbox"][3]) / 2

master = (EXP / "master" / "celuma-isotipo-maestro.svg").read_text()
mono = (EXP / "svg" / "isotipo" / "celuma-isotipo-mono-navy.svg").read_text()


def inner(svg):
    return re.search(r"</desc>\n(.*)</svg>", svg, re.S).group(1)


ISO_COLOR = inner(master)
ISO_MONO = inner(mono)  # fill="#0d1b2a", recoloured per variant

WORD = {
    "a": {"d": re.search(r' d="([^"]+)"/>', (EXP / "svg/wordmarks/wordmark-a-baloo2-800.svg").read_text()).group(1),
          "rule": "nonzero",
          "C": wa["glyph_ink_boxes"][0], "ink": wa["ink_bbox"],
          "label": "Propuesta A · Baloo 2 ExtraBold (en uso en app, landing y docs)"},
    "b": {"d": " ".join(re.findall(r'<path id="b-[^"]+" d="([^"]+)"/>', (EXP / "svg/wordmarks/wordmark-b-notion-v2-trazado.svg").read_text())),
          "rule": "evenodd",
          "C": wb["layout"]["C_bbox"], "ink": wb["layout"]["wordmark_bbox"],
          "label": "Propuesta B · wordmark del Logotipo V2 de Notion (trazado del raster)"},
}
VARIANTS = {  # name: (isotipo mode, word ink, ink for mono isotipo, suggested background)
    "color-positivo": ("color", "#0d1b2a", None, "#fbf6ec"),
    "color-negativo": ("color", "#ffffff", None, "#0d1b2a"),
    "mono-navy": ("mono", "#0d1b2a", "#0d1b2a", "#fbf6ec"),
    "mono-blanco": ("mono", "#ffffff", "#ffffff", "#0d1b2a"),
}
DESC = ("Exploración · no aprobada. PROPUESTA de lockup pendiente de decisión de Rafael (D-1). "
        "Isotipo = maestro fiel (color) o adaptación a una tinta (mono). Ver labs/experiments/2-logo-vector-v2/README.md.")


def word_transform(opt, orient):
    w = WORD[opt]
    cx0, cy0, cx1, cy1 = w["C"]
    x0, y0, x1, y1 = w["ink"]
    if orient == "horizontal":
        s = R["cap_height_over_isotipo_height"] * H / (cy1 - cy0)
        tx = iso_x + iso_w + R["gap_over_isotipo_height"] * H - cx0 * s
        ty = body_cy + R["cap_center_minus_body_center_over_isotipo_height"] * H - (cy0 + cy1) / 2 * s
    else:
        s = 1.5 * iso_w / (x1 - x0)
        tx = iso_x + iso_w / 2 - (x0 + x1) / 2 * s
        ty = iso_y + iso_h + 0.10 * H - y0 * s
    box = [x0 * s + tx, y0 * s + ty, x1 * s + tx, y1 * s + ty]
    return s, tx, ty, box


out = {}
for opt in ("a", "b"):
    for orient in ("horizontal", "vertical"):
        s, tx, ty, wbox = word_transform(opt, orient)
        X0 = min(iso_x, wbox[0])
        Y0 = min(iso_y, wbox[1])
        X1 = max(iso_x + iso_w, wbox[2])
        Y1 = max(iso_y + iso_h, wbox[3])
        vb = [round(X0, 2), round(Y0, 2), round(X1 - X0, 2), round(Y1 - Y0, 2)]
        out[f"{opt}-{orient}"] = {"viewBox": vb, "word_box": [round(v, 2) for v in wbox], "scale": s,
                                  "isotipo_box": [iso_x, iso_y, iso_x + iso_w, iso_y + iso_h],
                                  "clear_space_X": round(H / 2, 2)}
        for var, (mode, ink, iso_ink, bg) in VARIANTS.items():
            iso = ISO_COLOR if mode == "color" else ISO_MONO.replace("#0d1b2a", iso_ink)
            svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(f"{v:g}" for v in vb)}" '
                   f'width="{vb[2] / 2:g}" height="{vb[3] / 2:g}" role="img" aria-labelledby="t d">\n'
                   f'  <title id="t">Céluma · lockup {orient} · {var} · {WORD[opt]["label"]}</title>\n'
                   f'  <desc id="d">{DESC} Fondo sugerido {bg}.</desc>\n'
                   f'  <g id="isotipo">\n{iso}  </g>\n'
                   f'  <path id="wordmark" fill="{ink}" fill-rule="{WORD[opt]["rule"]}" '
                   f'transform="matrix({s:.6f} 0 0 {s:.6f} {tx:.3f} {ty:.3f})" d="{WORD[opt]["d"]}"/>\n</svg>\n')
            folder = EXP / "svg" / "lockups" / ("propuesta-a-baloo2" if opt == "a" else "propuesta-b-notion-v2")
            folder.mkdir(parents=True, exist_ok=True)
            (folder / f"celuma-lockup-{orient}-{var}.svg").write_text(svg)
(EXP / "validation" / "lockups.json").write_text(json.dumps(out, indent=2))
print(json.dumps(out, indent=1))
