"""Fase 3 · direcciones de motion del logo Céluma — Exploración · no aprobada.

Builds, from the phase-1 geometry only (master isotipo + the lockup SVGs A/B), three motion
directions that are materially different from each other and from phase 2 («Mirada»):

  luz      only the light moves: the three rays (and, with the name, the accent of the é).
           Loader loop + short one-shot.
  enfoque  a circular field (a microscope field of view, no blur) opens on the cell while it
           settles; with the name, the field widens until it frames the whole signature.
  trazo    the membrane is drawn, the organelles are placed, the strokes and letters are
           written, the light comes last. Brand material (intro / outro).

Every variant ends on the exact phase-1 drawing: same paths, same colours, identity transforms,
opacity 1, no masks left partially closed (checked in validation, not assumed).

Outputs (all inside fase-3/):
  lottie/<dir>-<subject>-<mode>.json   Lottie (Bodymovin 5.x shape layers), 60 fps
  svg/luz-<subject>-loop.svg           SVG + CSS keyframes of the Luz loader (no player needed)
  estaticos/<subject>.svg              exact phase-1 artwork re-boxed to the animation box
                                       (reduced motion / fallback / validation reference)
  data.js                              everything above embedded for the gallery (file:// works)
  validation/spec.json                 variants, boxes, markers and expectations for validate.py
"""
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from scipy.optimize import minimize
from scipy.spatial import cKDTree

HERE = Path(__file__).resolve().parent
F3 = HERE.parent
EXP = F3.parent
sys.path.insert(0, str(HERE))
from svgpath import bbox, sample, subpaths  # noqa: E402

FPS = 60
TAG = "Exploración · no aprobada"
SVGNS = "{http://www.w3.org/2000/svg}"

# ====================================================================== phase-1 geometry
MASTER_TXT = (EXP / "master" / "celuma-isotipo-maestro.svg").read_text()
_root = ET.fromstring(MASTER_TXT)
ISO_D, ISO_FILL = {}, {}
for g in _root.iter(SVGNS + "g"):
    for el in g:
        if el.tag == SVGNS + "path":
            ISO_D[el.get("id")] = el.get("d")
            ISO_FILL[el.get("id")] = el.get("fill") or g.get("fill")
ISO_SP = {k: subpaths(d) for k, d in ISO_D.items()}
RAYS = ["rayo-1", "rayo-2", "rayo-3"]
CELL = ["membrana", "citoplasma", "nucleo", "nucleolo", "trazo-izquierdo", "trazo-derecho"]
ISO_BOX = (69, 38, 557, 678)          # phase-2 animation box: delivery box + 4 px per side
NUCLEO_C, NUCLEOLO_C = (388.36, 403.81), (423.77, 364.80)

_fit = json.loads((EXP / "validation" / "fit-report.json").read_text())["shapes"]
AXIS = {}
for k in RAYS:
    c = _fit["ray-" + k[-1]]["capsule"]
    a, b = np.array([c["x1"], c["y1"]]), np.array([c["x2"], c["y2"]])
    body = np.array([388.0, 443.0])
    base, tip = (a, b) if np.linalg.norm(a - body) < np.linalg.norm(b - body) else (b, a)
    L = float(np.linalg.norm(tip - base))
    AXIS[k] = {"base": base, "u": (tip - base) / L, "L": L}

LOCKUP_DIR = {"a": EXP / "svg/lockups/propuesta-a-baloo2", "b": EXP / "svg/lockups/propuesta-b-notion-v2"}
ORIENT = {"h": "horizontal", "v": "vertical"}
POLARITY = {"pos": "color-positivo", "neg": "color-negativo"}
WA = json.loads((EXP / "validation" / "wordmark-a.json").read_text())
B_IDS = re.findall(r'<path id="(b-[^"]+)" d="([^"]+)"/>', (EXP / "svg/wordmarks/wordmark-b-notion-v2-trazado.svg").read_text())


def read_lockup(opt, ori, pol):
    path = LOCKUP_DIR[opt] / f"celuma-lockup-{ORIENT[ori]}-{POLARITY[pol]}.svg"
    txt = path.read_text()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', txt).group(1).split()]
    m = re.search(r'<path id="wordmark" fill="([^"]+)" fill-rule="([^"]+)" transform="matrix\(([^)]+)\)" d="([^"]+)"/>', txt)
    fill, rule, mat, d = m.group(1), m.group(2), [float(v) for v in m.group(3).split()], m.group(4)
    # the isotipo inside every lockup must be the master itself (paths and colours)
    for k, dd in ISO_D.items():
        assert f'id="{k}"' in txt and f'd="{dd}"' in txt, (path, k)
    # glyph groups: A from the glyph ink boxes (font units), B from the per-letter ids of the tracing
    if opt == "a":
        raw = subpaths(d)
        groups = {n: [] for n in ["C", "e", "l", "u", "m", "a", "acento"]}
        names = ["C", "e", "l", "u", "m", "a"]
        for sp in raw:
            x0, y0, x1, y1 = bbox([sp])
            if y1 < -520:                         # entirely above the x-height: the acute accent
                groups["acento"].append(sp)
                continue
            cx = (x0 + x1) / 2
            gi = next(i for i, gb in enumerate(WA["glyph_ink_boxes"]) if gb[0] - 1 <= cx <= gb[2] + 1)
            groups[names[gi]].append(sp)
    else:
        assert " ".join(dd for _, dd in B_IDS) == d, "wordmark B in the lockup differs from the tracing"
        groups = {k[2:]: subpaths(dd) for k, dd in B_IDS}
        groups = {("e" if k == "e" else k): v for k, v in groups.items()}
    a_, b_, c_, d_, e_, f_ = mat
    assert b_ == 0 and c_ == 0 and a_ == d_, "lockup matrices are uniform scale + translation"
    tf = lambda p: (a_ * p[0] + c_ * p[1] + e_, b_ * p[0] + d_ * p[1] + f_)
    local = groups
    groups = {k: [[tuple(tf(p) for p in seg) for seg in sp] for sp in v] for k, v in groups.items()}
    order = ["C", "e", "acento", "l", "u", "m", "a"]
    assert set(groups) == set(order) and all(groups[k] for k in order), groups.keys()
    # `glyphs` (lockup coordinates) drive masks, fields and wipes; `glyphs_local` (font / tracing units)
    # are what is drawn, under the lockup's own matrix as a static group transform, exactly like the
    # phase-1 file (<path transform="matrix(...)">). Baking the matrix changed edge pixels.
    return {"file": path, "txt": txt, "viewBox": vb, "fill": fill, "rule": rule, "matrix": mat, "d": d,
            "glyphs": {k: groups[k] for k in order}, "glyphs_local": {k: local[k] for k in order}, "order": order}


def box_for(vb, pad=4):
    x0, y0 = math.floor(vb[0] - pad), math.floor(vb[1] - pad)
    x1, y1 = math.ceil(vb[0] + vb[2] + pad), math.ceil(vb[1] + vb[3] + pad)
    return (x0, y0, x1 - x0, y1 - y0)


LOCKUPS = {}
for opt in "ab":
    for ori in "hv":
        for pol in ("pos", "neg"):
            LOCKUPS[(opt, ori, pol)] = read_lockup(opt, ori, pol)


def rebox(svg_text, box):
    """Same artwork, only the canvas changes (viewBox/width/height). Used for the exact statics."""
    return re.sub(r'viewBox="[^"]*" width="[^"]*" height="[^"]*"',
                  f'viewBox="{" ".join(f"{v:g}" for v in box)}" width="{box[2]:g}" height="{box[3]:g}"',
                  svg_text, count=1)


# ====================================================================== maths helpers
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
                return tuple(a + (b - a) * p for a, b in zip(va, vb))
            return va + (vb - va) * p
    return track[-1][1]


def map_sp(sp, fn):
    return [tuple(fn(p) for p in seg) for seg in sp]


def axial(k, s, axis=None):
    """Phase-2 grammar: scale the whole ray along its axis about its base (caps squash)."""
    ax = axis or AXIS[k]
    b, u = ax["base"], ax["u"]

    def f(p):
        along = (p[0] - b[0]) * u[0] + (p[1] - b[1]) * u[1]
        return (p[0] - (1 - s) * along * u[0], p[1] - (1 - s) * along * u[1])
    return f


def capkeep(k, s, axis=None):
    """Phase-3 grammar: only the straight middle shortens; both round caps stay rigid.

    s = 0 -> the two caps meet (a point of light); s = 1 -> identity (the master path)."""
    ax = axis or AXIS[k]
    b, u, L = ax["base"], ax["u"], ax["L"]

    def f(p):
        along = (p[0] - b[0]) * u[0] + (p[1] - b[1]) * u[1]
        if along <= 0:
            d = 0.0
        elif along >= L:
            d = (1 - s) * L
        else:
            d = (1 - s) * along
        return (p[0] - d * u[0], p[1] - d * u[1])
    return f


def pca_axis(sps, up_is_tip=True):
    pts = np.array([p for sp in sps for p in sample(sp, 16)])
    c = pts.mean(axis=0)
    w, v = np.linalg.eigh(np.cov((pts - c).T))
    u = v[:, np.argmax(w)]
    if up_is_tip and u[1] > 0:           # tip = the upper end (screen y grows downwards)
        u = -u
    n = np.array([-u[1], u[0]])
    pr, q = (pts - c) @ u, (pts - c) @ n
    wd = q.max() - q.min()
    base = c + u * (pr.min() + wd / 2)
    tip = c + u * (pr.max() - wd / 2)
    L = float(np.linalg.norm(tip - base))
    return {"base": base, "u": u, "L": L, "n": n, "c": c, "pmin": pr.min(), "pmax": pr.max(), "qmin": q.min(), "qmax": q.max()}


# ====================================================================== Lottie builders
def rgba(hexc):
    h = hexc.lstrip("#")
    return [round((int(h[i:i + 2], 16) + 0.25) / 255, 6) for i in (0, 2, 4)] + [1]


def static(v):
    return {"a": 0, "k": v}


def ease_io(e, scalar=False):
    x1, y1, x2, y2 = e
    if scalar:
        return {"o": {"x": x1, "y": y1}, "i": {"x": x2, "y": y2}}
    return {"o": {"x": [x1], "y": [y1]}, "i": {"x": [x2], "y": [y2]}}


def keyed(track, conv, spatial=False):
    if all(v == track[0][1] for _, v, _ in track):
        return static(conv(track[0][1]))
    ks = []
    for n, (fr, val, e) in enumerate(track):
        k = {"t": fr, "s": conv(val)}
        if n < len(track) - 1:
            k.update(ease_io(e, scalar=spatial))
            if spatial:
                k.update({"to": [0, 0, 0], "ti": [0, 0, 0]})
        ks.append(k)
    return {"a": 1, "k": ks}


class Comp:
    def __init__(self, box):
        self.box = box
        self.ox, self.oy = box[0], box[1]

    def shape(self, sp, prec=3):
        v, i, o = [], [], []
        n = len(sp)
        for k, (p0, c1, _, _) in enumerate(sp):
            prev = sp[(k - 1) % n]
            v.append([round(p0[0] - self.ox, prec), round(p0[1] - self.oy, prec)])
            o.append([round(c1[0] - p0[0], prec), round(c1[1] - p0[1], prec)])
            i.append([round(prev[2][0] - p0[0], prec), round(prev[2][1] - p0[1], prec)])
        return {"i": i, "o": o, "v": v, "c": True}

    def poly(self, pts, closed=True):
        return {"i": [[0, 0]] * len(pts), "o": [[0, 0]] * len(pts),
                "v": [[round(x - self.ox, 3), round(y - self.oy, 3)] for x, y in pts], "c": closed}

    def smooth(self, pts):
        """Closed Catmull-Rom through pts -> Lottie shape (used for the membrane centreline)."""
        n = len(pts)
        v, i, o = [], [], []
        for k in range(n):
            p, pn, pp = pts[k], pts[(k + 1) % n], pts[(k - 1) % n]
            t = ((pn[0] - pp[0]) / 6, (pn[1] - pp[1]) / 6)
            v.append([round(p[0] - self.ox, 3), round(p[1] - self.oy, 3)])
            o.append([round(t[0], 3), round(t[1], 3)])
            i.append([round(-t[0], 3), round(-t[1], 3)])
        return {"i": i, "o": o, "v": v, "c": True}

    def smooth_open(self, pts, extra):
        """Open Catmull-Rom that goes once around the closed loop pts and `extra` points further."""
        n = len(pts)
        seq = [pts[k % n] for k in range(n + extra + 1)]
        v, i, o = [], [], []
        for k, p in enumerate(seq):
            pn, pp = pts[(k + 1) % n], pts[(k - 1) % n]
            t = ((pn[0] - pp[0]) / 6, (pn[1] - pp[1]) / 6)
            v.append([round(p[0] - self.ox, 3), round(p[1] - self.oy, 3)])
            o.append([round(t[0], 3), round(t[1], 3)])
            i.append([round(-t[0], 3), round(-t[1], 3)])
        return {"i": i, "o": o, "v": v, "c": False}

    def circle(self, c, r):
        k = K * r
        v = [(c[0], c[1] - r), (c[0] + r, c[1]), (c[0], c[1] + r), (c[0] - r, c[1])]
        o = [(k, 0), (0, k), (-k, 0), (0, -k)]
        i = [(-k, 0), (0, -k), (k, 0), (0, k)]
        return {"v": [self.pt(p) for p in v], "i": [[round(a, 3), round(b, 3)] for a, b in i],
                "o": [[round(a, 3), round(b, 3)] for a, b in o], "c": True}

    def pt(self, p):
        return [round(p[0] - self.ox, 3), round(p[1] - self.oy, 3)]

    def paths(self, sps, prec=3):
        return [{"ty": "sh", "nm": "Path", "ks": static(self.shape(sp, prec))} for sp in sps]

    def morph(self, sps, track, fn, prec=3):
        """One animated `sh` per subpath: keyframes are the geometry fn(value) of each key."""
        items = []
        for sp in sps:
            ks = []
            for n, (fr, val, e) in enumerate(track):
                k = {"t": fr, "s": [self.shape(map_sp(sp, fn(val)), prec)]}
                if n < len(track) - 1:
                    k.update(ease_io(e))
                ks.append(k)
            items.append({"ty": "sh", "nm": "Path", "ks": {"a": 1, "k": ks}})
        return items


def fill(hexc, rule="nonzero"):
    return {"ty": "fl", "nm": "Fill", "c": static(rgba(hexc)), "o": static(100), "r": 2 if rule == "evenodd" else 1}


def group(nm, items, p=None, a=None, s=None, o=None):
    return {"ty": "gr", "nm": nm, "it": items + [{
        "ty": "tr", "nm": "Transform", "p": p or static([0, 0]), "a": a or static([0, 0]),
        "s": s or static([100, 100]), "r": static(0), "o": o or static(100), "sk": static(0), "sa": static(0)}]}


def layer(nm, shapes, op, ip=0, o=None, masks=None, td=0, tt=0):
    L = {"ddd": 0, "ty": 4, "nm": nm, "sr": 1,
         "ks": {"o": o or static(100), "r": static(0), "p": static([0, 0, 0]), "a": static([0, 0, 0]),
                "s": static([100, 100, 100])},
         "ao": 0, "shapes": shapes, "ip": ip, "op": op, "st": 0, "bm": 0}
    if masks:
        L["hasMask"] = True
        L["masksProperties"] = masks
    if td:
        L["td"] = 1
    if tt:
        L["tt"] = tt
    return L


def mask(nm, comp, track, shape_fn):
    ks = []
    for n, (fr, val, e) in enumerate(track):
        k = {"t": fr, "s": [shape_fn(val)]}
        if n < len(track) - 1:
            k.update(ease_io(e))
        ks.append(k)
    return {"inv": False, "mode": "a", "pt": {"a": 1, "k": ks}, "o": static(100), "x": static(0), "nm": nm}


def lottie(name, comp, op, layers, markers, notes):
    for n, L in enumerate(layers, 1):
        L["ind"] = n
    return {"v": "5.7.4", "fr": FPS, "ip": 0, "op": op, "w": comp.box[2], "h": comp.box[3], "nm": f"{name} · {TAG}",
            "ddd": 0, "assets": [], "layers": layers,
            "markers": [{"tm": fr, "cm": nm, "dr": 0} for nm, fr in markers],
            "meta": {"g": "labs/experiments/2-logo-vector-v2/fase-3/scripts/fase3.py",
                     "d": f"{TAG}. Céluma, geometría exacta de la fase 1. {notes}"}}


# ====================================================================== easing + timing
LIN = (0.0, 0.0, 1.0, 1.0)
IO = (0.45, 0.0, 0.55, 1.0)
OUT = (0.2, 0.0, 0.0, 1.0)            # calm deceleration, no overshoot
OUT_SOFT = (0.25, 0.1, 0.25, 1.0)
DRAW = (0.55, 0.0, 0.3, 1.0)          # a pen stroke: accelerates, lands softly
WIPE = (0.4, 0.0, 0.3, 1.0)
LIGHT = (0.22, 1.0, 0.36, 1.0)        # light switching on (fast start, soft landing)
FADE = (0.0, 0.0, 0.58, 1.0)
f_ = lambda s: round(s * FPS)

# Luz ------------------------------------------------------------------------------------
LUZ = {
    "loop_total": 2.0,       # s
    "loop_rest": 0.25,       # master at rest before the wave
    "dip": 0.9,              # each ray: 1 -> s_min -> 1
    "dip_down": 0.42,        # share of the dip spent going down
    "stagger": 0.16,
    "s_min": 0.6,
    "once_rest": 0.30,       # cell (and name without accent) already there
    "ray_dur": 0.46,
    "ray_stagger": 0.14,
    "dot": 0.10,             # a ray starts as a point of light: opacity 0 -> 1 in this time
    "accent_gap": 0.06,      # after the last ray starts to settle
    "accent_dur": 0.36,
    "hold": 0.40,
}
# Enfoque ---------------------------------------------------------------------------------
ENF = {
    "start": 0.10,           # empty frame, then the field opens from a point
    "open": 0.75,            # circle 0 -> R (iris easing)
    "settle": 0.85,          # the cell settles 1.05 -> 1 (a focus pull without blur)
    "scale0": 1.05,
    "widen": 0.60,           # with the name: the field widens until it frames the signature
    "hold": 0.45,
}
# Trazo -----------------------------------------------------------------------------------
TRZ = {
    "ring": (0.12, 0.92), "cyto": (0.72, 1.08), "swap": 1.10,
    "nucleo": (0.90, 1.30), "nucleolo": (1.12, 1.38),
    "trazo_l": (1.18, 1.50), "trazo_r": (1.32, 1.62),
    "rays": 1.56, "ray_dur": 0.42, "ray_stagger": 0.09,
    "letters": 1.40, "letter_dur": 0.24, "letter_stagger": 0.075,
    "accent_after": 0.02, "accent_dur": 0.2,
    "hold": 0.45,
}


# ====================================================================== content pieces
def iso_static_groups(C, ids):
    """Groups top-first (Lottie draws the first item on top), master paint order reversed."""
    order = ["trazo-derecho", "trazo-izquierdo", "nucleolo", "nucleo", "citoplasma", "membrana",
             "rayo-3", "rayo-2", "rayo-1"]
    return [group(k, C.paths(ISO_SP[k]) + [fill(ISO_FILL[k])]) for k in order if k in ids]


def word_tr(C, lk):
    a, _, _, _, e, f = lk["matrix"]
    return {"p": static([round(e - C.ox, 6), round(f - C.oy, 6)]), "a": static([0, 0]), "s": static([round(a * 100, 6)] * 2)}


def word_group(C, lk, keys=None, nm="wordmark", items=None):
    """Glyphs in their own units under the lockup matrix (static group transform, as in the phase-1 SVG)."""
    keys = keys or lk["order"]
    L0 = Comp((0, 0, 0, 0))
    sps = [sp for k in keys for sp in lk["glyphs_local"][k]]
    return group(nm, (items if items is not None else L0.paths(sps, WORD_PREC)) + [fill(lk["fill"], lk["rule"])], **word_tr(C, lk))


def final_static(C, lk, ip, op):
    """The exact artwork as a plain layer (no mask, matte, transform or morph) from `ip` to the end.

    Animated layers stop at `ip`; at that frame they already equal the artwork, so the hand-over is
    invisible, and every held frame is drawn exactly like the phase-1 file."""
    shapes = ([word_group(C, lk)] if lk else []) + iso_static_groups(C, set(CELL) | set(RAYS))
    return layer("final-estatico", shapes, op, ip=ip)


def accent_axis(lk):
    return pca_axis(lk["glyphs"]["acento"])


# ---------------------------------------------------------------------------------- LUZ
def luz_loop(C, lk=None):
    T = LUZ
    op = f_(T["loop_total"])
    layers, markers = [], [("maestro", 0)]
    if lk:
        layers.append(layer("wordmark", [word_group(C, lk)], op))
    layers.append(layer("celula-fija", iso_static_groups(C, CELL), op))
    tracks = {}
    for n, k in enumerate(RAYS):
        a = T["loop_rest"] + n * T["stagger"]
        down = a + T["dip"] * T["dip_down"]
        end = a + T["dip"]
        tr = [(0, 1.0, LIN), (f_(a), 1.0, IO), (f_(down), T["s_min"], IO), (f_(end), 1.0, LIN)]
        if f_(end) < op:
            tr.append((op - 1, 1.0, LIN))
        tracks[k] = tr
        layers.append(layer(k, [group(k, C.morph(ISO_SP[k], tr, lambda s, k=k: axial(k, s)) + [fill(ISO_FILL[k])])], op))
    markers += [("ola-rayo-1", f_(T["loop_rest"])), ("ola-rayo-3", f_(T["loop_rest"] + 2 * T["stagger"])),
                ("reposo", f_(T["loop_rest"] + 2 * T["stagger"] + T["dip"]))]
    return op, layers, markers, {"rays": tracks}


def luz_once(C, lk=None):
    T = LUZ
    layers, markers = [], [("celula", 0)]
    tracks = {}
    t = T["once_rest"]
    ends = []
    ray_layers = []
    for n, k in enumerate(RAYS):          # left to top: the light sweeps the arc once
        a = t + n * T["ray_stagger"]
        b = a + T["ray_dur"]
        tr = [(f_(a), 0.0, LIGHT), (f_(b), 1.0, LIN)]
        op_tr = [(f_(a), 0.0, FADE), (f_(a + T["dot"]), 1.0, LIN)]
        tracks[k] = {"s": tr, "o": op_tr}
        ends.append(b)
        ray_layers.append(layer(k, [group(k, C.morph(ISO_SP[k], tr, lambda s, k=k: capkeep(k, s)) + [fill(ISO_FILL[k])])],
                                None, o=keyed(op_tr, lambda v: [round(v * 100, 3)])))
    markers.append(("rayos", f_(t)))
    last = max(ends)
    acc_layer = None
    if lk:
        ax = pca_axis(lk["glyphs_local"]["acento"])        # font units (the matrix is a uniform scale)
        a = t + 2 * T["ray_stagger"] + T["ray_dur"] * 0.55 + T["accent_gap"]
        b = a + T["accent_dur"]
        tr = [(f_(a), 0.0, LIGHT), (f_(b), 1.0, LIN)]
        op_tr = [(f_(a), 0.0, FADE), (f_(a + T["dot"] * 0.8), 1.0, LIN)]
        tracks["acento"] = {"s": tr, "o": op_tr, "axis_local": {"base": ax["base"].tolist(), "u": ax["u"].tolist(), "L": ax["L"]}}
        L0 = Comp((0, 0, 0, 0))
        items = L0.morph(lk["glyphs_local"]["acento"], tr, lambda s: capkeep(None, s, ax), prec=WORD_PREC)
        acc_layer = layer("acento", [word_group(C, lk, ["acento"], nm="acento", items=items)], None,
                          o=keyed(op_tr, lambda v: [round(v * 100, 3)]))
        markers.append(("acento", f_(a)))
        last = max(last, b)
    op = f_(last + T["hold"])
    fin = f_(last)
    markers.append(("final", fin))
    layers.append(final_static(C, lk, fin, op))
    if lk:
        layers.append(layer("wordmark-sin-acento", [word_group(C, lk, [g for g in lk["order"] if g != "acento"])], fin))
        acc_layer["op"] = fin
        layers.append(acc_layer)
    layers.append(layer("celula-fija", iso_static_groups(C, CELL), fin))
    for L in reversed(ray_layers):       # rayo-3 on top, as in the master
        L["op"] = fin
        layers.append(L)
    return op, layers, markers, tracks


# ---------------------------------------------------------------------------------- ENFOQUE
ISO_PTS = np.array([p for k in ISO_SP for sp in ISO_SP[k] for p in sample(sp, 32)])


def enclosing_circle(pts):
    f = lambda c: np.max(np.linalg.norm(pts - c, axis=1))
    c0 = pts.mean(axis=0)
    r = minimize(f, c0, method="Nelder-Mead", options={"xatol": 1e-4, "fatol": 1e-4, "maxiter": 4000})
    return r.x, float(r.fun)


FIELD_C, FIELD_R0 = enclosing_circle(ISO_PTS)
FIELD_R = FIELD_R0 + 6.0                  # 6 units beyond the farthest point: no anti-alias touch
K = 0.5522847498
WORD_PREC = 5


def stadium(cx, cy, R, E, vertical=False):
    """Circle (E = 0) or capsule extended by E to the right (or downwards). 6 vertices, always."""
    k = K * R
    if not vertical:
        v = [(cx, cy - R), (cx + E, cy - R), (cx + E + R, cy), (cx + E, cy + R), (cx, cy + R), (cx - R, cy)]
        o = [(0, 0), (k, 0), (0, k), (0, 0), (-k, 0), (0, -k)]
        i = [(-k, 0), (0, 0), (0, -k), (k, 0), (0, 0), (0, k)]
    else:
        v = [(cx, cy - R), (cx + R, cy), (cx + R, cy + E), (cx, cy + E + R), (cx - R, cy + E), (cx - R, cy)]
        o = [(k, 0), (0, 0), (0, k), (-k, 0), (0, 0), (0, -k)]
        i = [(-k, 0), (0, -k), (0, 0), (k, 0), (0, k), (0, 0)]
    return v, i, o


def enfoque_once(C, lk=None, ori="h"):
    T = ENF
    t0, t1 = T["start"], T["start"] + T["open"]
    cx, cy = (float(v) for v in FIELD_C)
    OPEN_E = (0.3, 0.0, 0.0, 1.0)      # an iris: opens fast, settles softly
    WIDEN_E = (0.4, 0.0, 0.2, 1.0)
    markers = [("vacio", 0), ("campo-abre", f_(t0))]
    # field geometry per key: (centre x, centre y, radius, extension)
    geo = [(0, (cx, cy, 0.0, 0.0), LIN), (f_(t0), (cx, cy, 0.0, 0.0), OPEN_E), (f_(t1), (cx, cy, FIELD_R, 0.0), LIN)]
    vertical = ori == "v"
    end = t1
    if lk:
        wpts = np.array([p for g in lk["order"] for sp in lk["glyphs"][g] for p in sample(sp, 24)])
        if not vertical:
            # capsule: the right half-circle travels until it contains every point of the name
            assert np.all(np.abs(wpts[:, 1] - cy) < FIELD_R - 2)
            assert np.min(wpts[:, 0]) > cx + FIELD_R + 2, "the circle alone would already show the name"
            E = float(np.max(wpts[:, 0] - cx - np.sqrt(FIELD_R ** 2 - (wpts[:, 1] - cy) ** 2))) + 8
            final = (cx, cy, FIELD_R, E)
        else:
            # the field grows into the circle that frames isotipo + name; it always contains the first one
            assert np.min(wpts[:, 1]) > cy + FIELD_R + 2, "the circle alone would already show the name"
            c2, r2 = enclosing_circle(np.vstack([ISO_PTS, wpts]))
            R2 = r2 + 8
            # |p - c(t)| - R(t) is convex in t, so a point inside both end circles stays inside every
            # interpolated circle: the isotipo is never hidden again while the field moves.
            assert np.all(np.linalg.norm(ISO_PTS - c2, axis=1) <= R2)
            final = (float(c2[0]), float(c2[1]), R2, 0.0)
        geo[-1] = (f_(t1), (cx, cy, FIELD_R, 0.0), WIDEN_E)
        geo.append((f_(t1 + T["widen"]), final, LIN))
        markers.append(("nombre", f_(t1)))
        end = t1 + T["widen"]
    end = max(end, t0 + T["settle"])
    op = f_(end + T["hold"])
    markers.append(("final", f_(end)))
    sc = [(f_(t0), T["scale0"], OUT), (f_(t0 + T["settle"]), 1.0, LIN)]
    iso = group("isotipo", iso_static_groups(C, set(CELL) | set(RAYS)),
                p=static(C.pt(FIELD_C)), a=static(C.pt(FIELD_C)),
                s=keyed(sc, lambda v: [round(v * 100, 4), round(v * 100, 4)]))
    shapes = ([word_group(C, lk)] if lk else []) + [iso]

    def mshape(val):
        x, y, R, E = val
        v, i, o = stadium(x, y, max(R, 0.0), E, vertical and E > 0)
        return {"v": [C.pt(p) for p in v], "i": [[round(a, 3), round(b, 3)] for a, b in i],
                "o": [[round(a, 3), round(b, 3)] for a, b in o], "c": True}
    L = layer("campo", shapes, f_(end), masks=[mask("campo-de-vision", C, geo, mshape)])
    return op, [final_static(C, lk, f_(end), op), L], markers, {"field": [(fr, list(v), e) for fr, v, e in geo], "scale": sc,
                              "field_centre": FIELD_C.tolist(), "field_r": FIELD_R}


# ---------------------------------------------------------------------------------- TRAZO
def ring_centreline(n_out=160):
    outer = np.array(sample(ISO_SP["membrana"][0], 48))
    inner = np.array(sample(ISO_SP["citoplasma"][0], 48))
    d, idx = cKDTree(inner).query(outer)
    mid = (outer + inner[idx]) / 2
    hw = d / 2
    # resample by arc length, light circular smoothing
    seg = np.linalg.norm(np.diff(np.vstack([mid, mid[:1]]), axis=0), axis=1)
    s = np.concatenate([[0], np.cumsum(seg)])
    tt = np.linspace(0, s[-1], n_out, endpoint=False)
    closed = np.vstack([mid, mid[:1]])
    res = np.stack([np.interp(tt, s, closed[:, 0]), np.interp(tt, s, closed[:, 1])], axis=1)
    kern = np.array([1, 2, 3, 2, 1], float)
    kern /= kern.sum()
    res = np.stack([np.convolve(np.r_[res[-2:, j], res[:, j], res[:2, j]], kern, mode="valid") for j in (0, 1)], axis=1)
    # orientation: clockwise on screen (y down) = positive shoelace area
    area = 0.5 * np.sum(res[:, 0] * np.roll(res[:, 1], -1) - np.roll(res[:, 0], -1) * res[:, 1])
    if area < 0:
        res = res[::-1]
    body = np.array([388.0, 443.0])
    ang = np.degrees(np.arctan2(res[:, 1] - body[1], res[:, 0] - body[0]))
    start = int(np.argmin(np.abs(((ang - (-125)) + 180) % 360 - 180)))      # up-left, next to the rays
    res = np.roll(res, -start, axis=0)
    # the band must cover the ring everywhere: max distance from the centreline to either edge
    tree = cKDTree(res)
    reach = max(tree.query(outer)[0].max(), tree.query(inner)[0].max())
    return res, float(hw.max()), float(reach)


RING_LINE, RING_HW, RING_REACH = ring_centreline()
RING_W = 2 * (RING_REACH + 6)
RING_OVERLAP = 7                          # centreline points drawn past the start (~4 % of the loop)


def wipe_quad(ax, p):
    """Quad covering the shape from its start (pmin) up to projection p along ax["u"]."""
    m = 6.0
    c, u, n = ax["c"], ax["u"], ax["n"]
    q0, q1 = ax["qmin"] - m, ax["qmax"] + m
    a = ax["pmin"] - m
    return [tuple(c + u * a + n * q0), tuple(c + u * p + n * q0), tuple(c + u * p + n * q1), tuple(c + u * a + n * q1)]


def trazo_once(C, lk=None):
    T = TRZ
    layers, markers, tracks = [], [("vacio", 0), ("membrana", f_(T["ring"][0]))], {}
    last = 0
    # letters (top of the stack; they never overlap the isotipo)
    if lk:
        t = T["letters"]
        glyphs = [g for g in lk["order"] if g != "acento"]
        markers.append(("nombre", f_(t)))
        for n, g in enumerate(glyphs):
            a = t + n * T["letter_stagger"]
            b = a + T["letter_dur"]
            ax = pca_axis(lk["glyphs"][g], up_is_tip=False)
            ax.update({"u": np.array([1.0, 0.0]), "n": np.array([0.0, 1.0])})      # letters are written left to right
            pts = np.array([p for sp in lk["glyphs"][g] for p in sample(sp, 16)])
            ax["c"] = pts.mean(axis=0)
            pr, q = pts[:, 0] - ax["c"][0], pts[:, 1] - ax["c"][1]
            ax.update({"pmin": pr.min(), "pmax": pr.max(), "qmin": q.min(), "qmax": q.max()})
            tr = [(f_(a), ax["pmin"] - 6, WIPE), (f_(b), ax["pmax"] + 6, LIN)]
            tracks["letra-" + g] = tr
            layers.append(layer("letra-" + g, [word_group(C, lk, [g], nm=g)], None,
                                masks=[mask("escritura", C, tr, lambda p, ax=ax: C.poly(wipe_quad(ax, p)))]))
            last = max(last, b)
        # the accent is drawn like the rays (grows from its base, round ends kept): a half-wiped accent
        # read as a grave accent («Cèluma») mid-way, found in the frame review
        ax = pca_axis(lk["glyphs_local"]["acento"])
        a = last + T["accent_after"]
        b = a + T["accent_dur"]
        tr = [(f_(a), 0.0, DRAW), (f_(b), 1.0, LIN)]
        o_tr = [(f_(a), 0.0, FADE), (f_(a + 0.05), 1.0, LIN)]
        tracks["acento"] = {"s": tr, "o": o_tr}
        L0 = Comp((0, 0, 0, 0))
        items = L0.morph(lk["glyphs_local"]["acento"], tr, lambda s: capkeep(None, s, ax), prec=WORD_PREC)
        layers.append(layer("acento", [word_group(C, lk, ["acento"], nm="acento", items=items)], None,
                            o=keyed(o_tr, lambda v: [round(v * 100, 3)])))
        markers.append(("acento", f_(a)))
        last = max(last, b)
    # inner strokes: written along their main direction
    for k, (a, b) in (("trazo-derecho", T["trazo_r"]), ("trazo-izquierdo", T["trazo_l"])):
        ax = pca_axis(ISO_SP[k], up_is_tip=False)
        if ax["u"][0] < 0:
            ax["u"], ax["n"] = -ax["u"], -ax["n"]
            ax["pmin"], ax["pmax"] = -ax["pmax"], -ax["pmin"]
            ax["qmin"], ax["qmax"] = -ax["qmax"], -ax["qmin"]
        tr = [(f_(a), ax["pmin"] - 6, WIPE), (f_(b), ax["pmax"] + 6, LIN)]
        tracks[k] = tr
        layers.append(layer(k, [group(k, C.paths(ISO_SP[k]) + [fill(ISO_FILL[k])])], None,
                            masks=[mask("trazo", C, tr, lambda p, ax=ax: C.poly(wipe_quad(ax, p)))]))
        last = max(last, b)
    markers.append(("trazos", f_(T["trazo_l"][0])))
    # nucleolus and nucleus are placed (grow from their own centre, no overshoot)
    a, b = T["nucleolo"]
    s_tr = [(f_(a), 0.0, OUT), (f_(b), 1.0, LIN)]
    tracks["nucleolo"] = s_tr
    layers.append(layer("nucleolo", [group("nucleolo", C.paths(ISO_SP["nucleolo"]) + [fill(ISO_FILL["nucleolo"])],
                                           p=static(C.pt(NUCLEOLO_C)), a=static(C.pt(NUCLEOLO_C)),
                                           s=keyed(s_tr, lambda v: [round(v * 100, 3)] * 2))], None))
    a, b = T["nucleo"]
    s_tr = [(f_(a), 0.35, OUT), (f_(b), 1.0, LIN)]
    o_tr = [(f_(a), 0.0, FADE), (f_(a + 0.4 * (b - a)), 1.0, LIN)]
    tracks["nucleo"] = {"s": s_tr, "o": o_tr}
    layers.append(layer("nucleo", [group("nucleo", C.paths(ISO_SP["nucleo"]) + [fill(ISO_FILL["nucleo"])],
                                         p=static(C.pt(NUCLEO_C)), a=static(C.pt(NUCLEO_C)),
                                         s=keyed(s_tr, lambda v: [round(v * 100, 3)] * 2))], None,
                        o=keyed(o_tr, lambda v: [round(v * 100, 3)])))
    markers.append(("organulos", f_(T["nucleo"][0])))
    # cytoplasm floods the drawn membrane from its centre (a growing circle, never a half-transparent
    # mint: on navy an opacity fade reads grey)
    a, b = T["cyto"]
    cpts = np.array(sample(ISO_SP["citoplasma"][0], 32))
    cc = cpts.mean(axis=0)
    rc = float(np.max(np.linalg.norm(cpts - cc, axis=1))) + 6
    r_tr = [(f_(a), 0.0, OUT_SOFT), (f_(b), rc, LIN)]
    tracks["citoplasma"] = {"centre": cc.tolist(), "r": r_tr}
    layers.append(layer("citoplasma", [group("citoplasma", C.paths(ISO_SP["citoplasma"]) + [fill(ISO_FILL["citoplasma"])])],
                        None, masks=[mask("llenado", C, r_tr, lambda r: C.circle(cc, r))]))
    # membrane: the exact ring (membrane minus cytoplasm) revealed by a stroke drawn along its
    # centreline (alpha track matte); once the cytoplasm is opaque the ring is swapped for the
    # master membrane itself, so the final frame has no matte at all.
    swap = f_(T["swap"])
    a, b = T["ring"]
    e_tr = [(f_(a), 0.0, DRAW), (f_(b), 100.0, LIN)]
    tracks["membrana"] = e_tr
    layers.append(layer("membrana", [group("membrana", C.paths(ISO_SP["membrana"]) + [fill(ISO_FILL["membrana"])])], None, ip=swap))
    # open centreline that runs ~4 % past its start: when the draw completes the stroke overlaps
    # itself, so the two butt ends never meet on a hairline seam
    line = {"ty": "sh", "nm": "Linea media", "ks": static(C.smooth_open([tuple(p) for p in RING_LINE], RING_OVERLAP))}
    trim = {"ty": "tm", "nm": "Trim", "s": static(0), "e": keyed(e_tr, lambda v: [round(v, 4)]), "o": static(0), "m": 1}
    stroke = {"ty": "st", "nm": "Stroke", "c": static([1, 1, 1, 1]), "o": static(100), "w": static(round(RING_W, 2)),
              "lc": 1, "lj": 2, "ml": 4}
    layers.append(layer("mate-membrana", [group("mate", [line, trim, stroke])], swap, td=1))
    layers.append(layer("anillo", [group("anillo", C.paths(ISO_SP["membrana"] + ISO_SP["citoplasma"]) + [fill(ISO_FILL["membrana"], "evenodd")])],
                        swap, tt=1))
    # rays: drawn from their base like pen strokes (round caps stay round)
    ray_layers = []
    for n, k in enumerate(RAYS):
        a = T["rays"] + n * T["ray_stagger"]
        b = a + T["ray_dur"]
        tr = [(f_(a), 0.0, DRAW), (f_(b), 1.0, LIN)]
        o_tr = [(f_(a), 0.0, FADE), (f_(a + 0.06), 1.0, LIN)]
        tracks[k] = {"s": tr, "o": o_tr}
        ray_layers.append(layer(k, [group(k, C.morph(ISO_SP[k], tr, lambda s, k=k: capkeep(k, s)) + [fill(ISO_FILL[k])])], None,
                                o=keyed(o_tr, lambda v: [round(v * 100, 3)])))
        last = max(last, b)
    markers.append(("rayos", f_(T["rays"])))
    layers += list(reversed(ray_layers))
    op = f_(last + T["hold"])
    markers.append(("final", f_(last)))
    for L in layers:
        if L.get("op") is None or L["nm"] == "membrana":
            L["op"] = f_(last)
    layers.insert(0, final_static(C, lk, f_(last), op))
    markers.sort(key=lambda m: m[1])
    return op, layers, markers, tracks


# ====================================================================== CSS SVG (Luz loader)
def css_track(name, track, fmt, total):
    lines = [f"@keyframes {name} {{"]
    if track[0][0] > 0:
        lines.append(f"  0% {{ {fmt(track[0][1])} animation-timing-function: linear; }}")
    for fr, v, e in track:
        pct = 100 * fr / total
        lines.append(f"  {pct:.4f}% {{ {fmt(v)} animation-timing-function: cubic-bezier({e[0]},{e[1]},{e[2]},{e[3]}); }}")
    if track[-1][0] < total:
        lines.append(f"  100% {{ {fmt(track[-1][1])} }}")
    lines.append("}")
    return "\n".join(lines)


def css_luz_loop(static_svg, op, tracks, title):
    dur = op / FPS
    css = []
    for k in RAYS:
        b, u = AXIS[k]["base"], AXIS[k]["u"]
        deg = math.degrees(math.atan2(u[1], u[0]))
        # every key keeps the same function list (only scaleX changes). Do NOT write `none` at rest:
        # CSS would interpolate none -> list component-wise and rotate the ray mid-dip (seen in validation)
        tf = lambda s, b=b, deg=deg: (f"transform: translate({b[0]:.2f}px, {b[1]:.2f}px) rotate({deg:.4f}deg) "
                                      f"scaleX({s:.4f}) rotate({-deg:.4f}deg) translate({-b[0]:.2f}px, {-b[1]:.2f}px);")
        css.append(css_track(f"cl3-{k}", tracks[k], tf, op))
    rules = "\n".join(f"#{k} {{ animation: cl3-{k} {dur:.4f}s linear infinite; }}" for k in RAYS)
    reduce = "@media (prefers-reduced-motion: reduce) { #rayo-1, #rayo-2, #rayo-3 { animation: none !important; } }"
    style = "\n".join(css) + "\n" + rules + "\n" + reduce
    out = re.sub(r"<title id=\"t\">[^<]*</title>", f'<title id="t">{title}</title>', static_svg, count=1)
    out = re.sub(r"(<desc id=\"d\">)([^<]*)(</desc>)",
                 lambda m: m.group(1) + f"{TAG}. Fase 3 · dirección Luz · bucle de carga ({dur:.2f} s). Solo cambia la "
                 "longitud de los rayos (escala axial desde su base); célula y nombre quietos, colores exactos. Con "
                 "prefers-reduced-motion (SVG en línea) queda el logo estático. " + m.group(2) + m.group(3), out, count=1)
    return out.replace("</desc>\n", f"</desc>\n  <style>\n{style}\n  </style>\n", 1)


# ====================================================================== timelines (for the gallery)
def timelines():
    """(label, start s, end s, kind) per direction and subject type, from the same timing dicts."""
    L, E, T = LUZ, ENF, TRZ
    r = [(f"Rayo {n + 1} · punto → luz", L["once_rest"] + n * L["ray_stagger"], L["once_rest"] + n * L["ray_stagger"] + L["ray_dur"], "luz")
         for n in range(3)]
    acc0 = L["once_rest"] + 2 * L["ray_stagger"] + L["ray_dur"] * 0.55 + L["accent_gap"]
    luz_iso_end = max(x[2] for x in r)
    luz_lk_end = max(luz_iso_end, acc0 + L["accent_dur"])
    loop = [(f"Rayo {n + 1} · se acorta y vuelve", L["loop_rest"] + n * L["stagger"], L["loop_rest"] + n * L["stagger"] + L["dip"], "luz")
            for n in range(3)]
    t1 = E["start"] + E["open"]
    tz = [("Membrana · se dibuja", *T["ring"], "trazo"), ("Citoplasma · llena desde el centro", *T["cyto"], "forma"),
          ("Núcleo · crece desde su centro", *T["nucleo"], "forma"), ("Nucléolo", *T["nucleolo"], "forma"),
          ("Trazos internos · se escriben", T["trazo_l"][0], T["trazo_r"][1], "trazo")]
    tz += [(f"Rayos · se dibujan desde la base", T["rays"], T["rays"] + 2 * T["ray_stagger"] + T["ray_dur"], "luz")]
    letters_end = T["letters"] + 5 * T["letter_stagger"] + T["letter_dur"]
    acc_a = letters_end + T["accent_after"]
    tz_iso_end = max(x[2] for x in tz)
    tz_lk_end = max(tz_iso_end, acc_a + T["accent_dur"])
    return {
        "luz": {"once-iso": [("Célula presente, sin luz", 0, L["once_rest"], "reposo")] + r + [("Final = maestro", luz_iso_end, luz_iso_end + L["hold"], "final")],
                "once-lockup": [("Célula y nombre sin acento", 0, L["once_rest"], "reposo")] + r +
                               [("Acento de la é · cuarta luz", acc0, acc0 + L["accent_dur"], "tipo"), ("Final = lockup", luz_lk_end, luz_lk_end + L["hold"], "final")],
                "loop": [("Reposo en el maestro", 0, L["loop_rest"], "reposo")] + loop +
                        [("Reposo en el maestro", loop[-1][2], L["loop_total"], "reposo")]},
        "enfoque": {"once-iso": [("Vacío", 0, E["start"], "reposo"), ("Campo de visión se abre", E["start"], t1, "campo"),
                                 ("Ajuste de foco 1,05 → 1 (sin desenfoque)", E["start"], E["start"] + E["settle"], "forma"),
                                 ("Final = maestro", max(t1, E["start"] + E["settle"]), max(t1, E["start"] + E["settle"]) + E["hold"], "final")],
                    "once-lockup": [("Vacío", 0, E["start"], "reposo"), ("Campo de visión se abre", E["start"], t1, "campo"),
                                    ("Ajuste de foco 1,05 → 1 (sin desenfoque)", E["start"], E["start"] + E["settle"], "forma"),
                                    ("El campo se amplía y descubre el nombre", t1, t1 + E["widen"], "tipo"),
                                    ("Final = lockup", t1 + E["widen"], t1 + E["widen"] + E["hold"], "final")]},
        "trazo": {"once-iso": [("Vacío", 0, T["ring"][0], "reposo")] + tz + [("Final = maestro", tz_iso_end, tz_iso_end + T["hold"], "final")],
                  "once-lockup": [("Vacío", 0, T["ring"][0], "reposo")] + tz +
                                 [("Letras · se escriben de izquierda a derecha", T["letters"], letters_end, "tipo"),
                                  ("Acento de la é · último trazo", acc_a, acc_a + T["accent_dur"], "tipo"),
                                  ("Final = lockup", tz_lk_end, tz_lk_end + T["hold"], "final")]},
    }


# ====================================================================== build everything
def subject_key(opt, ori, pol):
    return f"{opt}-{ori}-{pol}"


def subject_label(opt, ori, pol):
    return f"lockup {opt.upper()} · {ORIENT[ori]} · {POLARITY[pol]}"


def main():
    for d in ("lottie", "svg", "estaticos", "validation"):
        (F3 / d).mkdir(exist_ok=True)
    variants, statics = {}, {}
    # exact statics: the master and every lockup, only re-boxed
    statics["iso"] = rebox(MASTER_TXT, ISO_BOX)
    (F3 / "estaticos" / "isotipo.svg").write_text(statics["iso"])
    boxes = {"iso": ISO_BOX}
    for (opt, ori, pol), lk in LOCKUPS.items():
        key = subject_key(opt, ori, pol)
        boxes[key] = box_for(lk["viewBox"])
        statics[key] = rebox(lk["txt"], boxes[key])
        (F3 / "estaticos" / f"lockup-{opt}-{ORIENT[ori]}-{POLARITY[pol]}.svg").write_text(statics[key])

    plan = []   # (direction, subject, mode)
    for subj in ["iso"] + [subject_key(o, "h", p) for o in "ab" for p in ("pos", "neg")]:
        plan.append(("luz", subj, "loop"))
    for subj in ["iso"] + [subject_key(o, r, p) for o in "ab" for r in "hv" for p in ("pos", "neg")]:
        plan += [("luz", subj, "once"), ("enfoque", subj, "once"), ("trazo", subj, "once")]

    spec = {"fps": FPS, "tag": TAG, "boxes": boxes, "variants": {}, "field": {"centre": FIELD_C.tolist(), "r": FIELD_R},
            "ring": {"centreline_points": len(RING_LINE), "half_width_max": RING_HW, "reach": RING_REACH, "matte_stroke": RING_W},
            "timing": {"luz": LUZ, "enfoque": ENF, "trazo": TRZ}}
    css_files = {}
    for dname, subj, mode in plan:
        box = boxes[subj]
        C = Comp(box)
        lk = None
        if subj != "iso":
            opt, ori, pol = subj.split("-")
            lk = LOCKUPS[(opt, ori, pol)]
        if dname == "luz":
            op, layers, markers, tracks = (luz_loop if mode == "loop" else luz_once)(C, lk)
        elif dname == "enfoque":
            op, layers, markers, tracks = enfoque_once(C, lk, subj.split("-")[1] if lk else "h")
        else:
            op, layers, markers, tracks = trazo_once(C, lk)
        label = "isotipo" if subj == "iso" else subject_label(*subj.split("-"))
        name = f"Céluma · fase 3 · {dname} · {label} · {'bucle' if mode == 'loop' else 'una reproducción'}"
        data = lottie(name, C, op, layers, markers, f"Dirección {dname}.")
        fname = f"{dname}-{'isotipo' if subj == 'iso' else 'lockup-' + subj}-{mode}.json"
        text = json.dumps(data, separators=(",", ":"), ensure_ascii=False)
        (F3 / "lottie" / fname).write_text(text)
        key = f"{dname}|{subj}|{mode}"
        variants[key] = data
        first = {"luz": "master" if mode == "loop" else "sin-luz", "enfoque": "vacio", "trazo": "vacio"}[dname]
        spec["variants"][key] = {"file": f"lottie/{fname}", "op": op, "box": box, "subject": subj, "mode": mode,
                                 "direction": dname, "bytes": len(text.encode()), "markers": markers,
                                 "first_expect": first, "static": subj,
                                 "layers": [L["nm"] for L in layers],
                                 "uses_masks": any(L.get("hasMask") for L in layers),
                                 "uses_mattes": any(L.get("td") or L.get("tt") for L in layers)}
        if dname == "luz" and mode == "loop":
            svg = css_luz_loop(statics[subj], op, tracks["rays"],
                               f"Céluma · fase 3 · Luz · bucle de carga · {label} ({TAG})")
            cname = f"luz-{'isotipo' if subj == 'iso' else 'lockup-' + subj}-loop.svg"
            (F3 / "svg" / cname).write_text(svg)
            css_files[subj] = svg
            spec["variants"][key]["css_svg"] = f"svg/{cname}"
        print(f"{fname:52s} op {op:4d} ({op / FPS:.2f} s)  {len(text.encode()):7d} B  masks={spec['variants'][key]['uses_masks']} mattes={spec['variants'][key]['uses_mattes']}")

    (F3 / "validation" / "spec.json").write_text(json.dumps(spec, indent=1, default=lambda o: o.tolist() if hasattr(o, "tolist") else str(o)))
    meta = {k: {kk: v[kk] for kk in ("op", "box", "subject", "mode", "direction", "bytes", "markers", "file", "uses_masks", "uses_mattes")}
            for k, v in spec["variants"].items()}
    js = ("// Generated by fase-3/scripts/fase3.py — " + TAG + ". Same payloads as lottie/*.json, svg/*.svg and\n"
          "// estaticos/*.svg, embedded so the gallery also works when opened as a local file.\n"
          f"window.F3 = {{fps: {FPS}, meta: {json.dumps(meta, ensure_ascii=False)},\n"
          f"  lottie: {json.dumps(variants, separators=(',', ':'), ensure_ascii=False)},\n"
          f"  statics: {json.dumps(statics, ensure_ascii=False)},\n"
          f"  css: {json.dumps(css_files, ensure_ascii=False)},\n"
          f"  timelines: {json.dumps(timelines(), ensure_ascii=False)}}};\n")
    (F3 / "data.js").write_text(js)
    print("field centre", FIELD_C.round(2), "r", round(FIELD_R, 2), "| ring half-width max", round(RING_HW, 2),
          "reach", round(RING_REACH, 2), "matte stroke", round(RING_W, 2))
    print("data.js", len(js.encode()), "B")


if __name__ == "__main__":
    main()
