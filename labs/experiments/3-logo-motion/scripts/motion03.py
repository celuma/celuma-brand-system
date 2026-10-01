"""Experimento 03 · Motion de Céluma — generador de la primera ronda (exploración, no aprobada).

Lee, sin modificarlos, el maestro activo y los lockups A del experimento 02:
  ../../2-logo-vector-v2/master/celuma-isotipo-maestro-paleta-aprobada.svg
  ../../2-logo-vector-v2/svg/lockups/propuesta-a-baloo2/celuma-lockup-{horizontal,vertical}-color-{positivo,negativo}.svg

Cada variante se describe como un árbol de escena (grupos con UNA transformación animada —traslación, escala o
rotación— más opacidad; las composiciones se hacen anidando). De ese único árbol salen:
  lottie/<dir>-<sujeto>.json   Lottie (Bodymovin 5.x, capas de forma), 60 fps
  svg/<dir>-<sujeto>.svg       SVG + CSS @keyframes (solo donde tiene sentido: Respira y Brote)
  estaticos/<sujeto>.svg       arte exacto de 02 recolocado en la caja (reposo, movimiento reducido, referencia)
  spec.json                    variantes, cajas, marcadores, tiempos y archivos (galería y validación)

Reglas que el generador hace cumplir:
  - Los trazados, rellenos y matrices son los del maestro y de los lockups de 02 (se comprueba al leer).
  - Las animaciones de una vez terminan en una capa estática exacta (sin transformaciones ni máscaras).
  - Los bucles empiezan y terminan en el maestro.
  - Ningún pigmento del logo cambia de tono; ninguna animación usa máscaras, mates, efectos ni expresiones.
"""
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
E3 = HERE.parent
E2 = E3.parent / "2-logo-vector-v2"
sys.path.insert(0, str(HERE))
from svgpath import sample, subpaths  # noqa: E402  (copia de 02/fase-3/scripts/svgpath.py)

FPS = 60
TAG = "Exploración · experimento 03 · no aprobada"
SVGNS = "{http://www.w3.org/2000/svg}"
REL_E2 = "labs/experiments/2-logo-vector-v2"

# ============================================================================ geometría de 02 (solo lectura)
MASTER_TXT = (E2 / "master" / "celuma-isotipo-maestro-paleta-aprobada.svg").read_text()
PALETA = json.loads((E2 / "master" / "celuma-paleta-aprobada.json").read_text())["pigmentos"]
_root = ET.fromstring(MASTER_TXT)
ISO_D, ISO_FILL = {}, {}
for g in _root.iter(SVGNS + "g"):
    for el in g:
        if el.tag == SVGNS + "path":
            ISO_D[el.get("id")] = el.get("d")
            ISO_FILL[el.get("id")] = el.get("fill") or g.get("fill")
ISO_SP = {k: subpaths(d) for k, d in ISO_D.items()}
RAYS = ["rayo-1", "rayo-2", "rayo-3"]
PAINT = ["rayo-1", "rayo-2", "rayo-3", "membrana", "citoplasma", "nucleo", "nucleolo", "trazo-izquierdo", "trazo-derecho"]
for k in PAINT:
    assert ISO_FILL[k].lower() == PALETA[{"rayo-1": "rayos", "rayo-2": "rayos", "rayo-3": "rayos", "trazo-izquierdo": "trazos",
                                           "trazo-derecho": "trazos"}.get(k, k)].lower(), k
ISO_BOX = (69, 38, 557, 678)          # caja de animación de 02: caja de entrega + 4 px por lado
NUCLEO_C = (388.36, 403.81)
NUCLEOLO_C = (423.77, 364.80)


def _poly(k, n=60):
    return np.array([p for sp in ISO_SP[k] for p in sample(sp, n)], dtype=np.float64)


MEM_POLY = _poly("membrana")
_m = cv2.moments(MEM_POLY.astype(np.float32).reshape(-1, 1, 2))
CELL_C = (_m["m10"] / _m["m00"], _m["m01"] / _m["m00"])          # centroide de área de la membrana
CELL_BOTTOM = (CELL_C[0], float(MEM_POLY[:, 1].max()))
_fit = json.loads((E2 / "validation" / "fit-report.json").read_text())["shapes"]
AXIS = {}
for k in RAYS:
    c = _fit["ray-" + k[-1]]["capsule"]
    a, b = np.array([c["x1"], c["y1"]]), np.array([c["x2"], c["y2"]])
    base, tip = (a, b) if np.linalg.norm(a - np.array(CELL_C)) < np.linalg.norm(b - np.array(CELL_C)) else (b, a)
    L = float(np.linalg.norm(tip - base))
    AXIS[k] = {"base": base, "u": (tip - base) / L, "L": L}


def inside(poly, pts, margin):
    cnt = poly.astype(np.float32).reshape(-1, 1, 2)
    return all(cv2.pointPolygonTest(cnt, (float(x), float(y)), True) >= margin for x, y in pts)


def hide_depth(k, margin=4.0):
    """Menor retroceso a lo largo del eje que deja el rayo entero detrás de la membrana."""
    pts = _poly(k, 24)
    u = AXIS[k]["u"]
    d = 0.0
    while not inside(MEM_POLY, pts - u * d, margin):
        d += 1.0
        assert d < 600, k
    return d


HIDE = {k: hide_depth(k) for k in RAYS}

# ---------------------------------------------------------------------------- lockups A
WA = json.loads((E2 / "validation" / "wordmark-a.json").read_text())
LK_DIR = E2 / "svg/lockups/propuesta-a-baloo2"
ORIENT = {"h": "horizontal", "v": "vertical"}
POL = {"pos": "color-positivo", "neg": "color-negativo"}
LETTERS = ["C", "e", "l", "u", "m", "a"]


def split_d(d):
    """El `d` del wordmark en subtrazados de texto (se conservan los comandos Q originales)."""
    return [m.strip() for m in re.split(r"(?=M)", d) if m.strip()]


def read_lockup(ori, pol):
    path = LK_DIR / f"celuma-lockup-{ORIENT[ori]}-{POL[pol]}.svg"
    txt = path.read_text()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', txt).group(1).split()]
    m = re.search(r'<path id="wordmark" fill="([^"]+)" fill-rule="([^"]+)" transform="matrix\(([^)]+)\)" d="([^"]+)"/>', txt)
    fill, rule, mat, d = m.group(1), m.group(2), [float(v) for v in m.group(3).split()], m.group(4)
    for k, dd in ISO_D.items():                       # el isotipo del lockup es el maestro activo
        assert f'id="{k}"' in txt and f'd="{dd}"' in txt, (path, k)
    groups = {k: [] for k in LETTERS + ["acento"]}
    for s in split_d(d):
        sp = subpaths(s)
        xs = [p[0] for seg in sp[0] for p in (seg[0], seg[3])]
        ys = [p[1] for seg in sp[0] for p in (seg[0], seg[3])]
        if max(ys) < -520:
            groups["acento"].append(s)
            continue
        cx = (min(xs) + max(xs)) / 2
        gi = next(i for i, gb in enumerate(WA["glyph_ink_boxes"]) if gb[0] - 1 <= cx <= gb[2] + 1)
        groups[LETTERS[gi]].append(s)
    assert " ".join(s for k in LETTERS + ["acento"] for s in groups[k]).count("M") == d.count("M")
    a_, b_, c_, d_, e_, f_ = mat
    assert b_ == 0 and c_ == 0 and a_ == d_
    return {"file": path, "txt": txt, "viewBox": vb, "fill": fill, "rule": rule, "matrix": mat, "d": d, "groups": groups,
            "em": 1000 * a_}


LOCKUPS = {(o, p): read_lockup(o, p) for o in "hv" for p in ("pos", "neg")}


def glyph_box(lk, key):
    """Caja de un glifo en coordenadas del lockup."""
    a, _, _, _, e, f = lk["matrix"]
    pts = [p for s in lk["groups"][key] for sp in subpaths(s) for seg in sp for p in (seg[0], seg[3])]
    xs, ys = [p[0] * a + e for p in pts], [p[1] * a + f for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


# ============================================================================ tiempo y curvas
def F(s):
    return int(round(s * FPS))


LIN = (0.0, 0.0, 1.0, 1.0)
SINE = (0.37, 0.0, 0.63, 1.0)          # respiración
OUT = (0.2, 0.0, 0.0, 1.0)             # desaceleración calmada, sin rebote (vocabulario de producto)
OUT_SOFT = (0.25, 0.1, 0.25, 1.0)
LIGHT = (0.22, 1.0, 0.36, 1.0)         # la luz sale rápido y se posa
FADE = (0.0, 0.0, 0.58, 1.0)
GRAV_IN = (0.55, 0.0, 1.0, 0.45)       # caída
GRAV_OUT = (0.0, 0.55, 0.45, 1.0)      # subida que frena
IO = (0.45, 0.0, 0.55, 1.0)
POP = (0.3, 0.0, 0.2, 1.0)


def bezier_ease(e, x):
    x1, y1, x2, y2 = e
    lo, hi = 0.0, 1.0
    for _ in range(60):
        t = (lo + hi) / 2
        bx = 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t * t * x2 + t ** 3
        lo, hi = (t, hi) if bx < x else (lo, t)
    t = (lo + hi) / 2
    return 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t * t * y2 + t ** 3


def value_at(track, fr):
    if fr <= track[0][0]:
        return track[0][1]
    for (fa, va, e), (fb, vb, _) in zip(track, track[1:]):
        if fa <= fr <= fb:
            p = bezier_ease(e, (fr - fa) / (fb - fa)) if fb > fa else 1.0
            if isinstance(va, (tuple, list)):
                return tuple(x + (y - x) * p for x, y in zip(va, vb))
            return va + (vb - va) * p
    return track[-1][1]


def trk(*keys):
    """keys: (segundos, valor, curva hacia la siguiente clave)."""
    out = [(F(t), v, e) for t, v, e in keys]
    assert all(a[0] <= b[0] for a, b in zip(out, out[1:])), out
    return out


# ============================================================================ árbol de escena
def P(k):
    """Hoja: un trazado del maestro, tal cual."""
    return {"type": "path", "id": k, "d": ISO_D[k], "sp": ISO_SP[k], "fill": ISO_FILL[k], "rule": "nonzero", "local": False}


def G(nm, kids, kind=None, anchor=(0.0, 0.0), track=None, opacity=None, matrix=None, cls=None):
    return {"type": "group", "id": nm, "kids": kids, "kind": kind, "anchor": tuple(anchor), "track": track,
            "opacity": opacity, "matrix": matrix, "cls": cls}


def word_leaf(lk, keys, nm):
    ds = [s for k in keys for s in lk["groups"][k]]
    d = " ".join(ds)
    return {"type": "path", "id": nm, "d": d, "sp": [sp for s in ds for sp in subpaths(s)], "fill": lk["fill"],
            "rule": lk["rule"], "local": True}


def word_group(lk, keys, nm):
    """Glifos en unidades de fuente bajo la matriz estática del lockup (igual que el archivo de 02)."""
    return G(nm + "-m", [word_leaf(lk, keys, nm)], matrix=lk["matrix"])


def iso_static():
    return [G("rayos", [P(k) for k in RAYS]), G("celula", [P(k) for k in PAINT[3:]])]


def static_tree(lk=None):
    kids = iso_static()
    if lk:
        kids = kids + [word_group(lk, LETTERS[:2] + ["acento"] + LETTERS[2:], "wordmark")]
    return G("final", kids)


# ---------------------------------------------------------------------------- matrices (extensión y comprobaciones)
def mat_of(n, fr):
    if n["type"] != "group":
        return np.eye(3)
    if n["matrix"]:
        a, b, c, d, e, f = n["matrix"]
        return np.array([[a, c, e], [b, d, f], [0, 0, 1]])
    if not n["kind"]:
        return np.eye(3)
    v = value_at(n["track"], fr)
    ax, ay = n["anchor"]
    T = lambda x, y: np.array([[1, 0, x], [0, 1, y], [0, 0, 1]], dtype=float)
    if n["kind"] == "t":
        return T(v[0], v[1])
    if n["kind"] == "s":
        return T(ax, ay) @ np.diag([v[0], v[1], 1.0]) @ T(-ax, -ay)
    th = math.radians(v)
    R = np.array([[math.cos(th), -math.sin(th), 0], [math.sin(th), math.cos(th), 0], [0, 0, 1]])
    return T(ax, ay) @ R @ T(-ax, -ay)


def visible_at(n, fr):
    return n["type"] != "group" or not n["opacity"] or value_at(n["opacity"], fr) > 1e-4


def extent(tree, frames):
    lo, hi = np.array([1e9, 1e9]), np.array([-1e9, -1e9])
    cache = {}

    def pts_of(leaf):
        if id(leaf) not in cache:
            cache[id(leaf)] = np.array([p for sp in leaf["sp"] for p in sample(sp, 10)] + [[0, 0]])[:-1]
        return cache[id(leaf)]

    def walk(n, M, fr):
        nonlocal lo, hi
        if not visible_at(n, fr):
            return
        if n["type"] == "path":
            P_ = pts_of(n)
            Q = (M @ np.c_[P_, np.ones(len(P_))].T).T[:, :2]
            lo, hi = np.minimum(lo, Q.min(0)), np.maximum(hi, Q.max(0))
            return
        M2 = M @ mat_of(n, fr)
        for k in n["kids"]:
            walk(k, M2, fr)

    for fr in frames:
        walk(tree, np.eye(3), fr)
    return lo, hi


def box_around(lo, hi, base, pad=4):
    x0 = math.floor(min(lo[0], base[0]) - pad)
    y0 = math.floor(min(lo[1], base[1]) - pad)
    x1 = math.ceil(max(hi[0], base[0] + base[2]) + pad)
    y1 = math.ceil(max(hi[1], base[1] + base[3]) + pad)
    return (x0, y0, x1 - x0, y1 - y0)


# ============================================================================ emisor Lottie
K_CIRC = 0.5522847498


def rgba(hexc):
    h = hexc.lstrip("#")
    return [round((int(h[i:i + 2], 16) + 0.25) / 255, 6) for i in (0, 2, 4)] + [1]


def static(v):
    return {"a": 0, "k": v}


def ease_io(e, spatial):
    x1, y1, x2, y2 = e
    if spatial:
        return {"o": {"x": x1, "y": y1}, "i": {"x": x2, "y": y2}}
    return {"o": {"x": [x1], "y": [y1]}, "i": {"x": [x2], "y": [y2]}}


def keyed(track, conv, spatial=False):
    if all(v == track[0][1] for _, v, _ in track):
        return static(conv(track[0][1]))
    ks = []
    for n, (fr, val, e) in enumerate(track):
        k = {"t": fr, "s": conv(val)}
        if n < len(track) - 1:
            k.update(ease_io(e, spatial))
            if spatial:
                k.update({"to": [0, 0, 0], "ti": [0, 0, 0]})
        ks.append(k)
    return {"a": 1, "k": ks}


def lot_shape(sp, ox, oy, prec=3):
    v, i, o = [], [], []
    n = len(sp)
    for k, (p0, c1, _, _) in enumerate(sp):
        prev = sp[(k - 1) % n]
        v.append([round(p0[0] - ox, prec), round(p0[1] - oy, prec)])
        o.append([round(c1[0] - p0[0], prec), round(c1[1] - p0[1], prec)])
        i.append([round(prev[2][0] - p0[0], prec), round(prev[2][1] - p0[1], prec)])
    return {"i": i, "o": o, "v": v, "c": True}


def lot_tr(p=None, a=None, s=None, r=None, o=None):
    return {"ty": "tr", "nm": "Transform", "p": p or static([0, 0]), "a": a or static([0, 0]),
            "s": s or static([100, 100]), "r": r or static(0), "o": o or static(100), "sk": static(0), "sa": static(0)}


def lot_node(n, ox, oy, local=False):
    if n["type"] == "path":
        lx, ly = (0, 0) if (local or n["local"]) else (ox, oy)
        prec = 4 if (local or n["local"]) else 3
        items = [{"ty": "sh", "nm": "Path", "ks": static(lot_shape(sp, lx, ly, prec))} for sp in n["sp"]]
        items.append({"ty": "fl", "nm": "Fill", "c": static(rgba(n["fill"])), "o": static(100), "r": 2 if n["rule"] == "evenodd" else 1})
        return {"ty": "gr", "nm": n["id"], "it": items + [lot_tr()]}
    if n["type"] == "circle":
        c, r = n["c"], n["r"]
        k = K_CIRC * r
        v = [(0, -r), (r, 0), (0, r), (-r, 0)]
        shape = {"v": [[round(c[0] + x - ox, 3), round(c[1] + y - oy, 3)] for x, y in v],
                 "o": [[round(a, 3), round(b, 3)] for a, b in [(k, 0), (0, k), (-k, 0), (0, -k)]],
                 "i": [[round(a, 3), round(b, 3)] for a, b in [(-k, 0), (0, -k), (k, 0), (0, k)]], "c": True}
        items = [{"ty": "sh", "nm": "Circulo", "ks": static(shape)}]
        if n.get("stroke"):
            items.append({"ty": "st", "nm": "Stroke", "c": static(rgba(n["stroke"])), "o": static(100), "w": static(n["sw"]),
                          "lc": 2, "lj": 2, "ml": 4})
        if n.get("fill"):
            items.append({"ty": "fl", "nm": "Fill", "c": static(rgba(n["fill"])), "o": static(100), "r": 1})
        return {"ty": "gr", "nm": n["id"], "it": items + [lot_tr()]}
    kids = [lot_node(k, ox, oy, local or bool(n["matrix"])) for k in reversed(n["kids"]) if k.get("cls") != "swap-in"]
    o = keyed(n["opacity"], lambda v: [round(v * 100, 3)]) if n["opacity"] else None
    if n["matrix"]:
        a, _, _, _, e, f = n["matrix"]
        tr = lot_tr(p=static([round(e - ox, 6), round(f - oy, 6)]), s=static([round(a * 100, 6)] * 2), o=o)
    elif not n["kind"]:
        tr = lot_tr(o=o)
    else:
        ax, ay = n["anchor"][0] - ox, n["anchor"][1] - oy
        A = static([round(ax, 3), round(ay, 3)])
        if n["kind"] == "t":
            tr = lot_tr(a=A, p=keyed(n["track"], lambda v: [round(ax + v[0], 3), round(ay + v[1], 3)], spatial=True), o=o)
        elif n["kind"] == "s":
            tr = lot_tr(a=A, p=static([round(ax, 3), round(ay, 3)]), s=keyed(n["track"], lambda v: [round(v[0] * 100, 4), round(v[1] * 100, 4)]), o=o)
        else:
            tr = lot_tr(a=A, p=static([round(ax, 3), round(ay, 3)]), r=keyed(n["track"], lambda v: [round(v, 4)]), o=o)
    return {"ty": "gr", "nm": n["id"], "it": kids + [tr]}


def lot_layer(nm, tree, box, ip, op):
    return {"ddd": 0, "ty": 4, "nm": nm, "sr": 1,
            "ks": {"o": static(100), "r": static(0), "p": static([0, 0, 0]), "a": static([0, 0, 0]), "s": static([100, 100, 100])},
            "ao": 0, "shapes": [lot_node(tree, box[0], box[1])], "ip": ip, "op": op, "st": 0, "bm": 0}


def lottie_doc(name, box, op, layers, markers, notes):
    for n, L in enumerate(layers, 1):
        L["ind"] = n
    return {"v": "5.7.4", "fr": FPS, "ip": 0, "op": op, "w": box[2], "h": box[3], "nm": f"{name} · {TAG}", "ddd": 0,
            "assets": [], "layers": layers, "markers": [{"tm": fr, "cm": nm, "dr": 0} for nm, fr in markers],
            "meta": {"g": "labs/experiments/3-logo-motion/scripts/motion03.py",
                     "d": f"{TAG}. Céluma · geometría y paleta del maestro activo de 02 (sin cambios). {notes}"}}


# ============================================================================ emisor SVG + CSS
def fmt(v):
    return f"{v:.4f}".rstrip("0").rstrip(".") if isinstance(v, float) else str(v)


def css_tf(n, v):
    ax, ay = n["anchor"]
    if n["kind"] == "t":
        return f"transform: translate({fmt(float(v[0]))}px, {fmt(float(v[1]))}px);"
    if n["kind"] == "s":
        return (f"transform: translate({fmt(ax)}px, {fmt(ay)}px) scale({fmt(float(v[0]))}, {fmt(float(v[1]))}) "
                f"translate({fmt(-ax)}px, {fmt(-ay)}px);")
    return f"transform: translate({fmt(ax)}px, {fmt(ay)}px) rotate({fmt(float(v))}deg) translate({fmt(-ax)}px, {fmt(-ay)}px);"


def css_keyframes(name, track, total, decl):
    lines = [f"@keyframes {name} {{"]
    if track[0][0] > 0:
        lines.append(f"  0% {{ {decl(track[0][1])} animation-timing-function: linear; }}")
    for fr, v, e in track:
        lines.append(f"  {100 * fr / total:.4f}% {{ {decl(v)} animation-timing-function: cubic-bezier({e[0]},{e[1]},{e[2]},{e[3]}); }}")
    if track[-1][0] < total:
        lines.append(f"  100% {{ {decl(track[-1][1])} }}")
    lines.append("}")
    return "\n".join(lines)


def svg_emit(tree, prefix, total, loop):
    """Devuelve (marcado, css). Cada grupo animado recibe una animación de transformación y otra de opacidad."""
    css, rules = [], []
    dur = f"{total / FPS:.4f}s"
    it = "infinite" if loop else "1"
    fill_mode = "none" if loop else "backwards"

    def walk(n, depth):
        pad = "  " * depth
        if n["type"] == "path":
            rule = ' fill-rule="evenodd"' if n["rule"] == "evenodd" else ""
            return f'{pad}<path id="{prefix}{n["id"]}" fill="{n["fill"]}"{rule} d="{n["d"]}"/>'
        attrs = f' id="{prefix}{n["id"]}"'
        anims = []
        if n["matrix"]:
            attrs += ' transform="matrix(' + " ".join(f"{v:g}" for v in n["matrix"]) + ')"'
        if n["kind"]:
            nm = f"{prefix}{n['id']}-tf"
            css.append(css_keyframes(nm, n["track"], total, lambda v, n=n: css_tf(n, v)))
            anims.append(nm)
        if n["opacity"]:
            nm = f"{prefix}{n['id']}-op"
            css.append(css_keyframes(nm, n["opacity"], total, lambda v: f"opacity: {fmt(float(v))};"))
            anims.append(nm)
        if n.get("cls") == "swap-in":        # capa exacta final: oculta mientras dura la animación
            nm = f"{prefix}oculta"
            anims.append(nm)
        if n.get("cls") == "swap-out":       # piezas animadas: visibles solo mientras dura la animación
            nm = f"{prefix}visible"
            anims.append(nm)
            attrs += ' visibility="hidden"'
        if anims:
            attrs += ' class="c3a"'
            rules.append(f"#{prefix}{n['id']} {{ animation: " + ", ".join(f"{a} {dur} linear {it} {fill_mode}" for a in anims) + "; }")
        inner = "\n".join(walk(k, depth + 1) for k in n["kids"])
        return f"{pad}<g{attrs}>\n{inner}\n{pad}</g>"

    body = walk(tree, 1)
    css.append(f"@keyframes {prefix}oculta {{ from, to {{ visibility: hidden; }} }}")
    css.append(f"@keyframes {prefix}visible {{ from, to {{ visibility: visible; }} }}")
    reduce = "@media (prefers-reduced-motion: reduce) { .c3a { animation: none !important; } }"
    return body, "\n".join(css) + "\n" + "\n".join(rules) + "\n" + reduce


def svg_doc(box, title, desc, body, css):
    vb = " ".join(f"{v:g}" for v in box)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{box[2]:g}" height="{box[3]:g}" role="img" aria-labelledby="t d">\n'
            f'  <title id="t">{title}</title>\n  <desc id="d">{desc}</desc>\n  <style>\n{css}\n  </style>\n{body}\n</svg>\n')


def rebox(svg_text, box):
    """El mismo arte; solo cambia el lienzo (viewBox/width/height)."""
    return re.sub(r'viewBox="[^"]*" width="[^"]*" height="[^"]*"',
                  f'viewBox="{" ".join(f"{v:g}" for v in box)}" width="{box[2]:g}" height="{box[3]:g}"', svg_text, count=1)


# ============================================================================ direcciones
# Cada constructor devuelve un dict: tree, op, fin (None si es bucle), loop, markers, base (caja del arte en reposo),
# timeline (etiquetas para la galería) y notes.

# ---------------------------------------------------------------------------- RESPIRA · producto · carga
RESPIRA = {"total": 3.6, "rest0": 0.40, "in": 1.30, "hold": 0.15, "out": 1.35, "S": 1.03, "ray": 10.0, "lag": 0.08}


def respira(lk=None):
    T = RESPIRA
    t0, t1 = T["rest0"], T["rest0"] + T["in"]
    t2, t3 = t1 + T["hold"], t1 + T["hold"] + T["out"]
    op = F(T["total"])
    interior = trk((0, (1.0, 1.0), LIN), (t0, (1.0, 1.0), SINE), (t1, (T["S"], T["S"]), LIN), (t2, (T["S"], T["S"]), SINE),
                   (t3, (1.0, 1.0), LIN), (T["total"] - 1 / FPS, (1.0, 1.0), LIN))
    rays = []
    for k in RAYS:
        u = AXIS[k]["u"] * T["ray"]
        l = T["lag"]
        tr = trk((0, (0.0, 0.0), LIN), (t0 + l, (0.0, 0.0), SINE), (t1 + l, (float(u[0]), float(u[1])), LIN),
                 (t2 + l, (float(u[0]), float(u[1])), SINE), (t3 + l, (0.0, 0.0), LIN), (T["total"] - 1 / FPS, (0.0, 0.0), LIN))
        rays.append(G(k + "-luz", [P(k)], kind="t", track=tr))
    kids = [G("rayos", rays), G("celula", [P("membrana"),
                                           G("interior", [P(k) for k in PAINT[4:]], kind="s", anchor=CELL_C, track=interior)])]
    if lk:
        kids.append(word_group(lk, LETTERS[:2] + ["acento"] + LETTERS[2:], "wordmark"))
    tl = [("Reposo (maestro)", 0, t0, "reposo"), ("Inspira · el interior crece 3 %", t0, t1, "vida"),
          ("La luz acompaña (+10 u por rayo)", t0 + T["lag"], t1 + T["lag"], "luz"), ("Pausa", t1, t2, "reposo"),
          ("Espira", t2, t3, "vida"), ("Reposo (maestro)", t3, T["total"], "reposo")]
    return {"tree": G("respira", kids), "op": op, "fin": None, "loop": True,
            "markers": [("maestro", 0), ("inspira", F(t0)), ("espira", F(t2)), ("reposo", F(t3))], "timeline": tl,
            "notes": f"Respira · bucle de {T['total']:.1f} s. Solo escala uniforme del interior (±3 %) y traslación axial de los rayos; "
                     "membrana fija; primer y último fotograma = maestro."}


# ---------------------------------------------------------------------------- BROTE · bienvenida
BROTE = {"nucleolo": (0.10, 0.42), "nucleo": (0.22, 0.70), "cuerpo": (0.30, 0.98), "trazo_l": (0.78, 1.10), "trazo_r": (0.86, 1.18),
         "rays": 1.00, "ray_dur": 0.42, "ray_stagger": 0.08, "letters": 0.98, "letter_dur": 0.44, "letter_stagger": 0.05,
         "rise_em": 0.13, "accent": (1.42, 1.78), "hold": 0.45}


def hidden_until(t):
    """Opacidad 0 hasta `t` y 1 desde el fotograma siguiente. El cambio ocurre con el rayo tapado por la membrana."""
    return [(0, 0.0, LIN), (F(t), 0.0, LIN), (F(t) + 1, 1.0, LIN)]


def centroid(k):
    pts = _poly(k, 40)
    return tuple(pts.mean(0))


def brote(lk=None):
    T = BROTE
    a, b = T["nucleolo"]
    nucleolo = G("nucleolo-brote", [P("nucleolo")], kind="s", anchor=NUCLEOLO_C,
                 track=trk((0, (0.0, 0.0), LIN), (a, (0.0, 0.0), OUT), (b, (1.0, 1.0), LIN)))
    a, b = T["nucleo"]
    nucleo = G("nucleo-brote", [P("nucleo")], kind="s", anchor=NUCLEOLO_C,
               track=trk((0, (0.0, 0.0), LIN), (a, (0.0, 0.0), OUT), (b, (1.0, 1.0), LIN)))
    a, b = T["cuerpo"]
    cuerpo = G("cuerpo-brote", [P("membrana"), P("citoplasma")], kind="s", anchor=NUCLEO_C,
               track=trk((0, (0.0, 0.0), LIN), (a, (0.0, 0.0), OUT), (b, (1.0, 1.0), LIN)))
    trazos = []
    for k, key in (("trazo-izquierdo", "trazo_l"), ("trazo-derecho", "trazo_r")):
        a, b = T[key]
        trazos.append(G(k + "-brote", [P(k)], kind="s", anchor=centroid(k),
                        track=trk((0, (0.0, 0.0), LIN), (a, (0.0, 0.0), OUT), (b, (1.0, 1.0), LIN))))
    rays, ends = [], []
    for n, k in enumerate(reversed(RAYS)):          # 3 → 2 → 1: la luz empieza hacia donde mira el nucléolo
        a = T["rays"] + n * T["ray_stagger"]
        b = a + T["ray_dur"]
        d = -AXIS[k]["u"] * HIDE[k]
        rays.append(G(k + "-brote", [P(k)], kind="t", track=trk((0, (float(d[0]), float(d[1])), LIN), (a, (float(d[0]), float(d[1])), LIGHT),
                                                                (b, (0.0, 0.0), LIN)),
                      opacity=hidden_until(a)))
        ends.append(b)
    rays.sort(key=lambda g: g["id"])
    end = max(ends)
    kids = [G("rayos", rays), G("celula", [cuerpo, nucleo, nucleolo] + trazos)]
    tl = [("Punto de luz · nucléolo", *T["nucleolo"], "luz"), ("El núcleo lo envuelve", *T["nucleo"], "vida"),
          ("La célula crece desde el núcleo", *T["cuerpo"], "vida"), ("Trazos internos", T["trazo_l"][0], T["trazo_r"][1], "forma"),
          ("La luz sale de la célula · 3 → 2 → 1", T["rays"], end, "luz")]
    markers = [("vacio", 0), ("nucleolo", F(T["nucleolo"][0])), ("celula", F(T["cuerpo"][0])), ("luz", F(T["rays"]))]
    if lk:
        letters = []
        rise = T["rise_em"] * lk["em"]
        for n, key in enumerate(LETTERS):
            a = T["letters"] + n * T["letter_stagger"]
            b = a + T["letter_dur"]
            letters.append(G(f"letra-{key}", [word_group(lk, [key], f"glifo-{key}")], kind="t",
                             track=trk((0, (0.0, rise), LIN), (a, (0.0, rise), OUT), (b, (0.0, 0.0), LIN)),
                             opacity=trk((0, 0.0, LIN), (a, 0.0, FADE), (a + 0.18, 1.0, LIN))))
            ends.append(b)
        a, b = T["accent"]
        letters.append(G("letra-acento", [word_group(lk, ["acento"], "glifo-acento")], kind="t",
                         track=trk((0, (0.0, rise * 0.8), LIN), (a, (0.0, rise * 0.8), LIGHT), (b, (0.0, 0.0), LIN)),
                         opacity=trk((0, 0.0, LIN), (a, 0.0, FADE), (a + 0.12, 1.0, LIN))))
        ends.append(b)
        kids.append(G("nombre", letters, cls="swap-out"))
        kids.append(G("nombre-final", [word_group(lk, LETTERS[:2] + ["acento"] + LETTERS[2:], "wordmark")], cls="swap-in"))
        tl += [("El nombre se asienta · letra a letra", T["letters"], T["letters"] + 5 * T["letter_stagger"] + T["letter_dur"], "tipo"),
               ("El acento brota al final", *T["accent"], "tipo")]
        markers.append(("nombre", F(T["letters"])))
        end = max(ends)
    fin = F(end)
    op = F(end + T["hold"])
    markers.append(("final", fin))
    tl.append(("Final = lockup/maestro exacto", end, end + T["hold"], "final"))
    return {"tree": G("brote", kids), "op": op, "fin": fin, "loop": False, "markers": markers, "timeline": tl,
            "notes": "Brote · una vez. Solo escalas uniformes (nucléolo, núcleo, cuerpo, trazos), traslación axial de los rayos "
                     "desde detrás de la membrana y subida con fundido de las letras. Sin máscaras ni mates."}


# ---------------------------------------------------------------------------- REBOTE · redes y celebración
REBOTE = {"hold": 0.5, "drop": 0.5, "land": 0.34}


def rebote(lk=None, box_h=None):
    """Cae desde media altura (0,5 × el isotipo) dentro del cuadro: la caja incluye la caída y nada se recorta."""
    fall = -REBOTE["drop"] * 670.0
    L = REBOTE["land"]
    drop = trk((0.00, (0.0, fall), GRAV_IN), (L, (0.0, 0.0), GRAV_OUT), (L + 0.16, (0.0, -44.0), GRAV_IN), (L + 0.32, (0.0, 0.0), GRAV_OUT),
               (L + 0.40, (0.0, -9.0), GRAV_IN), (L + 0.48, (0.0, 0.0), LIN))
    appear = trk((0.00, 0.0, LIN), (0.08, 1.0, LIN))
    squash = trk((0.00, (0.96, 1.04), IO), (L - 0.08, (0.93, 1.08), LIN), (L, (0.93, 1.08), OUT), (L + 0.06, (1.15, 0.85), IO),
                 (L + 0.16, (0.95, 1.06), IO), (L + 0.26, (1.0, 1.0), LIN), (L + 0.32, (1.0, 1.0), OUT), (L + 0.36, (1.06, 0.94), IO),
                 (L + 0.44, (0.985, 1.015), IO), (L + 0.54, (1.0, 1.0), LIN))
    lag = trk((0.00, (0.0, 0.0), LIN), (L, (0.0, 0.0), OUT), (L + 0.09, (0.0, 17.0), IO), (L + 0.22, (-1.5, -8.0), IO),
              (L + 0.38, (0.0, 3.0), IO), (L + 0.52, (0.0, 0.0), LIN))
    nucleolo = G("nucleolo-inercia", [P("nucleolo")], kind="t", track=lag)
    rays, ends = [], []
    r0 = L + 0.46
    for n, k in enumerate(reversed(RAYS)):
        a = r0 + n * 0.07
        base = tuple(float(v) for v in AXIS[k]["base"])
        rays.append(G(k + "-pop", [P(k)], kind="s", anchor=base,
                      track=trk((0, (0.0, 0.0), LIN), (a, (0.0, 0.0), POP), (a + 0.20, (1.14, 1.14), IO), (a + 0.32, (0.97, 0.97), IO),
                                (a + 0.42, (1.0, 1.0), LIN))))
        ends.append(a + 0.42)
    rays.sort(key=lambda g: g["id"])
    cell = G("celula", [P("membrana"), P("citoplasma"), P("nucleo"), nucleolo, P("trazo-izquierdo"), P("trazo-derecho")])
    body = G("aplasta", [G("rayos", rays), cell], kind="s", anchor=CELL_BOTTOM, track=squash)
    kids = [G("cae", [body], kind="t", track=drop, opacity=appear)]
    tl = [("Aparece y cae con peso (se estira)", 0.0, L, "peso"), ("Toca · se aplasta 15 %", L, L + 0.16, "peso"),
          ("Rebote y segundo apoyo", L + 0.16, L + 0.54, "peso"), ("El nucléolo sigue por inercia", L, L + 0.52, "vida"),
          ("La luz asoma con impulso · 3 → 2 → 1", r0, max(ends), "luz")]
    markers = [("cae", 0), ("toca", F(L)), ("rebota", F(L + 0.16)), ("luz", F(r0))]
    if lk:
        letters = []
        hop = 0.20 * lk["em"]
        l0 = L + 0.60
        for n, key in enumerate(LETTERS):
            a = l0 + n * 0.06
            letters.append(G(f"letra-{key}", [word_group(lk, [key], f"glifo-{key}")], kind="t",
                             track=trk((0, (0.0, hop), LIN), (a, (0.0, hop), GRAV_OUT), (a + 0.17, (0.0, -0.05 * lk["em"]), GRAV_IN),
                                       (a + 0.30, (0.0, 0.0), LIN)),
                             opacity=trk((0, 0.0, LIN), (a, 0.0, FADE), (a + 0.08, 1.0, LIN))))
            ends.append(a + 0.30)
        a = l0 + 0.46
        letters.append(G("letra-acento", [word_group(lk, ["acento"], "glifo-acento")], kind="t",
                         track=trk((0, (0.0, -0.45 * lk["em"]), LIN), (a, (0.0, -0.45 * lk["em"]), GRAV_IN), (a + 0.22, (0.0, 0.0), GRAV_OUT),
                                   (a + 0.31, (0.0, -0.04 * lk["em"]), GRAV_IN), (a + 0.40, (0.0, 0.0), LIN)),
                         opacity=trk((0, 0.0, LIN), (a, 0.0, FADE), (a + 0.08, 1.0, LIN))))
        ends.append(a + 0.40)
        kids.append(G("nombre", letters))
        tl += [("Las letras saltan a su sitio", l0, l0 + 5 * 0.06 + 0.30, "tipo"), ("El acento cae al final", a, a + 0.40, "tipo")]
        markers.append(("nombre", F(l0)))
    end = max(ends + [L + 0.54])
    fin, op = F(end), F(end + REBOTE["hold"])
    markers.append(("final", fin))
    tl.append(("Final = maestro/lockup exacto", end, end + REBOTE["hold"], "final"))
    return {"tree": G("rebote", kids), "op": op, "fin": fin, "loop": False, "markers": markers, "timeline": tl,
            "notes": "Rebote · una vez. Deformación temporal propuesta en el 03 (aplastar/estirar no uniforme del isotipo durante el "
                     "rebote); nunca en reposo. Cae desde media altura dentro del cuadro. Nucléolo con inercia dentro del núcleo; "
                     "rayos con impulso desde su base."}


# ============================================================================ salida
def subject_key(lk_key):
    if not lk_key:
        return "isotipo"
    o, p = lk_key
    return f"lockup-{o}-{p}"


def base_box(lk):
    return ISO_BOX if not lk else tuple(lk["viewBox"])


def static_svg(lk, box):
    if not lk:
        return rebox(MASTER_TXT, box)
    return rebox(lk["txt"], box)


def build_variant(direction, builder, lk_key, css=False, box_fn=None):
    lk = LOCKUPS[lk_key] if lk_key else None
    base = base_box(lk)
    v = builder(lk) if not box_fn else builder(lk, box_h=box_fn(base))
    tree, op = v["tree"], v["op"]
    frames = range(0, op)
    lo, hi = extent(tree, frames)
    box = box_around(lo, hi, (base[0], base[1], base[2], base[3]), pad=4)
    subj = subject_key(lk_key)
    name = f"{direction}-{subj}"
    layers = []
    if v["fin"] is not None:
        layers.append(lot_layer("final-estatico", static_tree(lk), box, v["fin"], op))
        layers.append(lot_layer("animacion", tree, box, 0, v["fin"]))
    else:
        layers.append(lot_layer("animacion", tree, box, 0, op))
    doc = lottie_doc(f"Céluma · {direction} · {subj}", box, op, layers, v["markers"], v["notes"])
    (E3 / "lottie" / f"{name}.json").write_text(json.dumps(doc, separators=(",", ":"), ensure_ascii=False))
    static_name = f"{direction}-{subj}.svg"
    stat = static_svg(lk, box)
    stat = re.sub(r'(<desc id="d">)', r'\1' + f"Estático exacto de 02 en la caja de {direction} (experimento 03 · reposo y movimiento reducido). ", stat, count=1)
    (E3 / "estaticos" / static_name).write_text(stat)
    out = {"direction": direction, "subject": subj, "box": list(box), "op": op, "fin": v["fin"], "loop": v["loop"],
           "fps": FPS, "markers": v["markers"], "timeline": v["timeline"], "lottie": f"lottie/{name}.json",
           "static": f"estaticos/{static_name}", "duration_s": round(op / FPS, 3),
           "motion_s": round((v["fin"] if v["fin"] is not None else op) / FPS, 3)}
    if css:
        body, style = svg_emit(tree, f"{direction[:3]}-", op, v["loop"])
        title = f"Céluma · {direction} · {subj} · SVG + CSS · {TAG}"
        desc = (f"{TAG}. {v['notes']} Con prefers-reduced-motion (SVG en línea) queda el arte estático exacto. "
                "Como &lt;img&gt;, Chromium ignora prefers-reduced-motion: usar en línea o &lt;picture&gt; con el estático.")
        svg = svg_doc(box, title, desc, body, style)
        (E3 / "svg" / f"{name}.svg").write_text(svg)
        out["css_svg"] = f"svg/{name}.svg"
    return out


def main():
    for d in ("lottie", "svg", "estaticos", "validation"):
        (E3 / d).mkdir(exist_ok=True)
    spec = {"fps": FPS, "tag": TAG, "generated_by": "scripts/motion03.py", "source": {
        "master": f"{REL_E2}/master/celuma-isotipo-maestro-paleta-aprobada.svg",
        "palette": f"{REL_E2}/master/celuma-paleta-aprobada.json",
        "lockups": f"{REL_E2}/svg/lockups/propuesta-a-baloo2/"}, "palette": PALETA,
        "geometry": {"cell_centroid": CELL_C, "cell_bottom": CELL_BOTTOM, "nucleo": NUCLEO_C, "nucleolo": NUCLEOLO_C,
                     "ray_hide_depth": HIDE}, "variants": {}}
    V = spec["variants"]
    for lk in (None, ("h", "pos"), ("h", "neg")):
        r = build_variant("respira", respira, lk, css=True)
        V[f"respira|{r['subject']}"] = r
    for lk in (None, ("h", "pos"), ("h", "neg"), ("v", "pos"), ("v", "neg")):
        r = build_variant("brote", brote, lk, css=True)
        V[f"brote|{r['subject']}"] = r
    for lk in (None, ("h", "pos"), ("h", "neg"), ("v", "pos"), ("v", "neg")):
        r = build_variant("rebote", rebote, lk, box_fn=lambda base: base[3] + 120)
        V[f"rebote|{r['subject']}"] = r
    import orden                                         # noqa: E402  (escena con campo celular)
    for r in orden.build_all(sys.modules[__name__]):
        V[f"orden|{r['subject']}"] = r
    # estáticos para las direcciones que no se exportan como animación (Atento: SVG en línea + JS; Relevo: FLIP)
    for direction, keys in (("atento", (None, ("h", "pos"), ("h", "neg"))), ("relevo", (("h", "pos"), ("h", "neg")))):
        for lk_key in keys:
            lk = LOCKUPS[lk_key] if lk_key else None
            b = base_box(lk)
            box = (math.floor(b[0] - 4), math.floor(b[1] - 4), math.ceil(b[2] + 8), math.ceil(b[3] + 8)) if lk else ISO_BOX
            subj = subject_key(lk_key)
            txt = re.sub(r'(<desc id="d">)', r'\1' + f"Estático exacto de 02 en la caja de {direction} (experimento 03). ", static_svg(lk, box), count=1)
            (E3 / "estaticos" / f"{direction}-{subj}.svg").write_text(txt)
            spec.setdefault("statics", {})[f"{direction}|{subj}"] = {"file": f"estaticos/{direction}-{subj}.svg", "box": list(box)}
    import gzip
    for v in V.values():
        for k in ("lottie", "css_svg", "static"):
            if v.get(k):
                raw = (E3 / v[k]).read_bytes()
                v.setdefault("bytes", {})[k] = [len(raw), len(gzip.compress(raw, 9))]
    spec["timing"] = {"respira": RESPIRA, "brote": BROTE, "rebote": REBOTE, "orden": orden.ORDEN}
    (E3 / "spec.json").write_text(json.dumps(spec, ensure_ascii=False, indent=1))
    for k, v in V.items():
        size = (E3 / v["lottie"]).stat().st_size
        print(f"{k:28s} box {v['box']} op {v['op']} fin {v['fin']} lottie {size/1024:.1f} KB" + (f" css {(E3 / v['css_svg']).stat().st_size/1024:.1f} KB" if v.get('css_svg') else ""))


if __name__ == "__main__":
    main()
