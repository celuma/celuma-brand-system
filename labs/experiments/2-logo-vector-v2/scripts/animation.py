"""Phase 2 · build the isotipo animation from master/celuma-isotipo-maestro.svg.

One timeline spec drives every output, so Lottie and CSS cannot drift apart:
  anim/celuma-isotipo-once.json   Lottie (Bodymovin 5.x schema), single play
  anim/celuma-isotipo-loop.json   Lottie, seamless loop (frame 0 == last frame == master)
  anim/celuma-isotipo-once.svg    SVG + CSS keyframes, single play (light option)
  anim/celuma-isotipo-loop.svg    SVG + CSS keyframes, loop
  anim/review-data.js             the same four payloads for animacion.html (works from file://)
  validation/anim-spec.json       resolved timeline + per-frame analytic values for validation

Motion rules (ANIMATION-BRIEF.md):
- membrana, citoplasma, nucleo: static, never keyed.
- the gaze is a translation of #nucleolo inside the nucleus (optionally #trazos parallax).
- rays grow along their own axis from the base (shape morph in Lottie, axial scale in CSS),
  opacity 0 -> 1. Their final key is the master path itself: no transform left behind.
- last frame == master: identity transforms, opacity 1, master colours and geometry.
"""
import json
import math
import os
import re
import xml.etree.ElementTree as ET

from celuma_img import EXP

FPS = 60
MASTER = EXP / "master" / "celuma-isotipo-maestro.svg"
OUT = EXP / os.environ.get("CELUMA_ANIM_OUT", "anim")      # override only for A/B tests
BOX = (69.0, 38.0, 557.0, 678.0)           # delivery box (73 42 549 670) + 4 px so no anti-alias touches the edge
NS = {"s": "http://www.w3.org/2000/svg"}

# -------------------------------------------------------------- geometry from the master
root = ET.parse(MASTER).getroot()
PATHS, FILLS = {}, {}
for g in root.iter("{http://www.w3.org/2000/svg}g"):
    for el in g:
        if el.tag.endswith("path"):
            PATHS[el.get("id")] = el.get("d")
            FILLS[el.get("id")] = el.get("fill") or g.get("fill")
ORDER_BOTTOM_TO_TOP = ["rayo-1", "rayo-2", "rayo-3", "membrana", "citoplasma", "nucleo", "nucleolo",
                       "trazo-izquierdo", "trazo-derecho"]
assert set(ORDER_BOTTOM_TO_TOP) == set(PATHS), PATHS.keys()


def parse(d):
    """'M x y C ... Z' (as written by fitlib.path_d) -> list of cubic segments."""
    nums = [float(v) for v in re.findall(r"-?\d+(?:\.\d+)?", d)]
    assert d.startswith("M") and d.rstrip().endswith("Z") and (len(nums) - 2) % 6 == 0
    p0 = (nums[0], nums[1])
    segs = []
    for i in range(2, len(nums), 6):
        c1, c2, p3 = (nums[i], nums[i + 1]), (nums[i + 2], nums[i + 3]), (nums[i + 4], nums[i + 5])
        segs.append((p0, c1, c2, p3))
        p0 = p3
    assert abs(segs[-1][3][0] - segs[0][0][0]) < 1e-9 and abs(segs[-1][3][1] - segs[0][0][1]) < 1e-9
    return segs


# Ray axes: base (next to the cell) and tip, from the capsule fits (validation/fit-report.json)
fit = json.loads((EXP / "validation" / "fit-report.json").read_text())["shapes"]
RAY_AXIS = {}
for k in ("rayo-1", "rayo-2", "rayo-3"):
    c = fit["ray-" + k[-1]]["capsule"]
    a, b = (c["x1"], c["y1"]), (c["x2"], c["y2"])
    # base = the end closer to the cell body centre
    body = (388.0, 443.0)
    base, tip = (a, b) if math.dist(a, body) < math.dist(b, body) else (b, a)
    L = math.dist(base, tip)
    u = ((tip[0] - base[0]) / L, (tip[1] - base[1]) / L)
    RAY_AXIS[k] = {"base": base, "tip": tip, "u": u, "deg": math.degrees(math.atan2(u[1], u[0]))}

NUCLEUS_C, NUCLEOLUS_C = (388.36, 403.81), (423.77, 364.80)   # circle fits (centre only used for limits)

# -------------------------------------------------------------- timeline (frames @ 60 fps)
IO = (0.45, 0.0, 0.55, 1.0)          # gaze moves: symmetric ease-in-out
BACK = (0.34, 1.56, 0.64, 1.0)       # "eureka": settles on the master gaze with a small overshoot
RAY_IN = (0.22, 1.0, 0.36, 1.0)      # rays: fast start, soft landing (light switching on)
FADE_IN = (0.0, 0.0, 0.58, 1.0)      # ray opacity: ease-out
RAY_OUT = (0.55, 0.0, 1.0, 0.45)     # loop only: rays retract, ease-in
LIN = (0.0, 0.0, 1.0, 1.0)

LOOK_L = (-93.4, 31.0)               # nucleolus offset: looks left  (58 from the nucleus centre)
LOOK_R = (22.6, 31.0)                # nucleolus offset: looks right (58 from the nucleus centre)
TRAZOS_DX = float(os.environ.get("CELUMA_TRAZOS_DX", "0"))  # inner-stroke parallax; A/B-tested, see README-FASE2.md §3


# Timing in seconds. Starting point = ANIMATION-BRIEF.md §3; changes after visual review are
# logged in README-FASE2.md §3 (longer first rest, 0.25 s holds, explicit "eureka" pause before the rays).
T = {
    "look_l": (0.30, 0.75),      # rest, then looks left
    "look_r": (1.00, 1.50),      # hold 0.25 s, then looks right
    "eureka": (1.75, 2.05),      # hold 0.25 s, then back to the master gaze with overshoot
    "rays": 2.30,                # "eureka" pause 0.25 s, then the first ray starts
    "ray_dur": 0.36,
    "ray_stagger": 0.07,
    "hold_end": 0.40,            # exact master held at the end of the single play
    "ray_fade": 0.25,            # share of each ray's segment used to fade in (0.40 in the brief read brown on navy)
}


def once_spec(t0=0):
    """Single play. Returns keyframe tracks; t0 (frames) shifts everything (used by the loop)."""
    f = lambda s: t0 + round(s * FPS)
    look = [  # (frame, value, easing to next)
        (f(0.00), (0.0, 0.0), LIN),
        (f(T["look_l"][0]), (0.0, 0.0), IO),
        (f(T["look_l"][1]), LOOK_L, LIN),
        (f(T["look_r"][0]), LOOK_L, IO),
        (f(T["look_r"][1]), LOOK_R, LIN),
        (f(T["eureka"][0]), LOOK_R, BACK),
        (f(T["eureka"][1]), (0.0, 0.0), LIN),
    ]
    trazos = [(fr, (TRAZOS_DX * (1 if v[0] > 0 else -1 if v[0] < 0 else 0), 0.0), e) for fr, v, e in look]
    rays = {}
    for n, k in enumerate(["rayo-3", "rayo-2", "rayo-1"]):   # closest to the gaze first
        s0 = T["rays"] + n * T["ray_stagger"]
        rays[k] = {
            "scale": [(f(s0), 0.0, RAY_IN), (f(s0 + T["ray_dur"]), 1.0, LIN)],
            "opacity": [(f(s0), 0.0, FADE_IN), (f(s0 + T["ray_dur"] * T["ray_fade"]), 1.0, LIN)],
        }
    end = max(rays[k]["scale"][-1][0] for k in rays)
    return {"look": look, "trazos": trazos, "rays": rays, "motion_end": end,
            "markers": [("reposo", f(0.00)), ("mira-izquierda", f(T["look_l"][1])), ("mira-derecha", f(T["look_r"][1])),
                        ("eureka", f(T["eureka"][1])), ("rayos", f(T["rays"])), ("maestro", end)]}


ONCE = once_spec()
ONCE_OP = ONCE["motion_end"] + round(T["hold_end"] * FPS)  # hold on the exact master

# Loop: master rest -> rays retract -> same gaze + eureka + rays -> master rest. frame 0 == last.
LOOP_REST_IN, RETRACT, LOOP_TOTAL = 0.60, 0.30, 4.80
LOOP = once_spec(t0=round(LOOP_REST_IN * FPS))
for n, k in enumerate(["rayo-1", "rayo-2", "rayo-3"]):      # retract in reverse order
    a = round((LOOP_REST_IN + n * 0.04) * FPS)
    b = a + round(RETRACT * FPS)
    LOOP["rays"][k]["scale"] = [(0, 1.0, LIN), (a, 1.0, RAY_OUT), (b, 0.0, LIN)] + LOOP["rays"][k]["scale"]
    LOOP["rays"][k]["opacity"] = [(0, 1.0, LIN), (a + round(RETRACT * 0.6 * FPS), 1.0, LIN), (b, 0.0, LIN)] + \
        LOOP["rays"][k]["opacity"]
LOOP_OP = round(LOOP_TOTAL * FPS)                         # rest before the next cycle
LOOP["markers"] = [("maestro-inicio", 0), ("rayos-se-apagan", round(LOOP_REST_IN * FPS))] + LOOP["markers"][1:]


# -------------------------------------------------------------- easing evaluation (for validation)
def bezier_ease(e, x):
    x1, y1, x2, y2 = e
    lo, hi = 0.0, 1.0
    for _ in range(60):               # solve B_x(t) = x by bisection (monotone in t)
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
            if isinstance(va, tuple):
                return tuple(a + (b - a) * p for a, b in zip(va, vb))
            return va + (vb - va) * p
    return track[-1][1]


# -------------------------------------------------------------- Lottie builders
def rgba(hexc):
    """8-bit colour k -> (k + 0.25) / 255: survives both floor (lottie-web) and round (other players).

    Plain k/255 rounded to 6 decimals can land a hair below k and lottie-web floors it to k - 1.
    """
    h = hexc.lstrip("#")
    return [round((int(h[i:i + 2], 16) + 0.25) / 255, 6) for i in (0, 2, 4)] + [1]


def shape_data(segs, xform=lambda p: p):
    """Closed cubic path -> Lottie shape {v, i, o, c} in comp coordinates (BOX offset)."""
    ox, oy = BOX[0], BOX[1]
    v, i, o = [], [], []
    n = len(segs)
    for k, (p0, c1, _, _) in enumerate(segs):
        prev = segs[(k - 1) % n]
        P = xform(p0)
        C1 = xform(c1)
        C2p = xform(prev[2])
        v.append([round(P[0] - ox, 3), round(P[1] - oy, 3)])
        o.append([round(C1[0] - P[0], 3), round(C1[1] - P[1], 3)])
        i.append([round(C2p[0] - P[0], 3), round(C2p[1] - P[1], 3)])
    return {"i": i, "o": o, "v": v, "c": True}


def static(v):
    return {"a": 0, "k": v}


def ease_io(e, scalar=False):
    x1, y1, x2, y2 = e
    if scalar:
        return {"o": {"x": x1, "y": y1}, "i": {"x": x2, "y": y2}}
    return {"o": {"x": [x1], "y": [y1]}, "i": {"x": [x2], "y": [y2]}}


def keyed(track, conv, spatial=False):
    ks = []
    for n, (fr, val, e) in enumerate(track):
        k = {"t": fr, "s": conv(val)}
        if n < len(track) - 1:
            k.update(ease_io(e, scalar=spatial))
            if spatial:
                k.update({"to": [0, 0, 0], "ti": [0, 0, 0]})
        ks.append(k)
    return {"a": 1, "k": ks}


def group(name, items):
    return {"ty": "gr", "nm": name, "it": items + [{
        "ty": "tr", "nm": "Transform", "p": static([0, 0]), "a": static([0, 0]), "s": static([100, 100]),
        "r": static(0), "o": static(100), "sk": static(0), "sa": static(0)}]}


def fill(hexc):
    return {"ty": "fl", "nm": "Fill", "c": static(rgba(hexc)), "o": static(100), "r": 1}


def layer(ind, name, shapes, op, pos=None, opacity=None):
    return {"ddd": 0, "ind": ind, "ty": 4, "nm": name, "sr": 1,
            "ks": {"o": opacity or static(100), "r": static(0), "p": pos or static([0, 0, 0]),
                   "a": static([0, 0, 0]), "s": static([100, 100, 100])},
            "ao": 0, "shapes": shapes, "ip": 0, "op": op, "st": 0, "bm": 0}


def axial(k, s):
    """Scale the ray along its own axis about its base (s = 1 -> identity)."""
    b, u = RAY_AXIS[k]["base"], RAY_AXIS[k]["u"]

    def f(p):
        dx, dy = p[0] - b[0], p[1] - b[1]
        along = dx * u[0] + dy * u[1]
        return (p[0] - (1 - s) * along * u[0], p[1] - (1 - s) * along * u[1])
    return f


def build_lottie(spec, op, name):
    layers = []
    ind = 1
    # top of the stack first (Lottie draws layers[0] on top)
    layers.append(layer(ind, "trazos", [group(n, [{"ty": "sh", "nm": "Path", "ks": static(shape_data(parse(PATHS[n])))},
                                                  fill(FILLS[n])]) for n in ("trazo-derecho", "trazo-izquierdo")], op,
                        pos=keyed(spec["trazos"], lambda v: [v[0], v[1], 0], spatial=True) if TRAZOS_DX else None))
    ind += 1
    layers.append(layer(ind, "nucleolo", [group("nucleolo", [{"ty": "sh", "nm": "Path", "ks": static(shape_data(parse(PATHS["nucleolo"])))},
                                                             fill(FILLS["nucleolo"])])], op,
                        pos=keyed(spec["look"], lambda v: [round(v[0], 3), round(v[1], 3), 0], spatial=True)))
    ind += 1
    # static cell: nucleo over citoplasma over membrana (never keyed)
    layers.append(layer(ind, "celula-fija", [group(n, [{"ty": "sh", "nm": "Path", "ks": static(shape_data(parse(PATHS[n])))},
                                                       fill(FILLS[n])]) for n in ("nucleo", "citoplasma", "membrana")], op))
    ind += 1
    for k in ("rayo-3", "rayo-2", "rayo-1"):
        segs = parse(PATHS[k])
        tr = spec["rays"][k]
        shape_track = [(fr, s, e) for fr, s, e in tr["scale"]]
        sh = {"a": 1, "k": []}
        for n, (fr, s, e) in enumerate(shape_track):
            kf = {"t": fr, "s": [shape_data(segs, axial(k, s))]}
            if n < len(shape_track) - 1:
                kf.update(ease_io(e))
            sh["k"].append(kf)
        layers.append(layer(ind, k, [group(k, [{"ty": "sh", "nm": "Path", "ks": sh}, fill(FILLS[k])])], op,
                            opacity=keyed(tr["opacity"], lambda v: [round(v * 100, 3)])))
        ind += 1
    return {"v": "5.7.4", "fr": FPS, "ip": 0, "op": op, "w": int(BOX[2]), "h": int(BOX[3]), "nm": name, "ddd": 0,
            "assets": [], "layers": layers,
            "markers": [{"tm": fr, "cm": nm, "dr": 0} for nm, fr in spec["markers"]],
            "meta": {"g": "labs/experiments/2-logo-vector-v2/scripts/animation.py",
                     "d": "Exploración · no aprobada. Isotipo Céluma, geometría del maestro SVG."}}


# -------------------------------------------------------------- CSS SVG builder
def css_track(name, track, fmt, total):
    lines = [f"@keyframes {name} {{"]
    for fr, v, e in track:
        pct = 100 * fr / total
        lines.append(f"  {pct:.4f}% {{ {fmt(v)} animation-timing-function: cubic-bezier({e[0]},{e[1]},{e[2]},{e[3]}); }}")
    if track[-1][0] < total:
        lines.append(f"  100% {{ {fmt(track[-1][1])} }}")
    if track[0][0] > 0:
        lines.insert(1, f"  0% {{ {fmt(track[0][1])} animation-timing-function: linear; }}")
    lines.append("}")
    return "\n".join(lines)


def build_css_svg(spec, op, loop):
    dur = op / FPS
    it = "infinite" if loop else "1"
    css = []
    anims = []
    css.append(css_track("cl-nucleolo", spec["look"],
                         lambda v: f"transform: translate({v[0]:.3f}px, {v[1]:.3f}px);", op))
    anims.append(("#nucleolo", "cl-nucleolo"))
    if TRAZOS_DX:
        css.append(css_track("cl-trazos", spec["trazos"], lambda v: f"transform: translate({v[0]:.3f}px, 0px);", op))
        anims.append(("#trazos", "cl-trazos"))
    for k in ("rayo-1", "rayo-2", "rayo-3"):
        b, deg = RAY_AXIS[k]["base"], RAY_AXIS[k]["deg"]
        tf = lambda s, b=b, deg=deg: (f"transform: translate({b[0]:.2f}px, {b[1]:.2f}px) rotate({deg:.4f}deg) "
                                      f"scaleX({s:.4f}) rotate({-deg:.4f}deg) translate({-b[0]:.2f}px, {-b[1]:.2f}px);")
        css.append(css_track(f"cl-{k}-s", spec["rays"][k]["scale"], tf, op))
        css.append(css_track(f"cl-{k}-o", spec["rays"][k]["opacity"], lambda v: f"opacity: {v:.4f};", op))
        anims.append((f"#{k}", f"cl-{k}-s, cl-{k}-o"))
    rules = "\n".join(
        f"{sel} {{ animation-name: {names}; animation-duration: {dur:.4f}s; animation-iteration-count: {it}; "
        f"animation-timing-function: linear; animation-fill-mode: backwards; }}" for sel, names in anims)
    reduce = ("@media (prefers-reduced-motion: reduce) { "
              + ", ".join(sel for sel, _ in anims) + " { animation: none !important; } }")
    style = "\n".join(css) + "\n" + rules + "\n" + reduce
    master = MASTER.read_text()
    body = re.search(r"</desc>\n(.*)</svg>", master, re.S).group(1)
    kind = "bucle" if loop else "una reproducción"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(f"{v:g}" for v in BOX)}" '
            f'width="{BOX[2]:g}" height="{BOX[3]:g}" role="img" aria-labelledby="t d">\n'
            f'  <title id="t">Céluma · isotipo animado · {kind} (exploración, no aprobado)</title>\n'
            f'  <desc id="d">Exploración · no aprobada. Animación del isotipo sobre la geometría exacta de '
            f'master/celuma-isotipo-maestro.svg; al terminar (o con movimiento reducido) queda el maestro estático. '
            f'Duración {dur:.2f} s{", en bucle" if loop else ""}.</desc>\n'
            f'  <style>\n{style}\n  </style>\n{body}</svg>\n')


# -------------------------------------------------------------- write
OUT.mkdir(exist_ok=True)
once = build_lottie(ONCE, ONCE_OP, "Céluma isotipo · una reproducción · Exploración · no aprobada")
loop = build_lottie(LOOP, LOOP_OP, "Céluma isotipo · bucle · Exploración · no aprobada")
files = {
    "celuma-isotipo-once.json": json.dumps(once, separators=(",", ":"), ensure_ascii=False),
    "celuma-isotipo-loop.json": json.dumps(loop, separators=(",", ":"), ensure_ascii=False),
    "celuma-isotipo-once.svg": build_css_svg(ONCE, ONCE_OP, loop=False),
    "celuma-isotipo-loop.svg": build_css_svg(LOOP, LOOP_OP, loop=True),
}
# the master itself (unchanged paths and colours), only the viewBox set to the animation box
MASTER_BOX_SVG = re.sub(r'viewBox="[^"]*" width="[^"]*" height="[^"]*"',
                        f'viewBox="{" ".join(f"{v:g}" for v in BOX)}" width="{BOX[2]:g}" height="{BOX[3]:g}"',
                        MASTER.read_text(), count=1)
(OUT / "celuma-isotipo-maestro-caja-anim.svg").write_text(MASTER_BOX_SVG)
for name, text in files.items():
    (OUT / name).write_text(text)
    print(f"{name:28s} {len(text.encode()):7d} bytes")
(OUT / "review-data.js").write_text(
    "// Generated by scripts/animation.py — Exploración · no aprobada. Same payloads as anim/*.json|svg,\n"
    "// embedded so animacion.html also works when opened as a local file.\n"
    f"window.CELUMA_ANIM = {{fps: {FPS}, once: {files['celuma-isotipo-once.json']}, loop: {files['celuma-isotipo-loop.json']},\n"
    f"  svgOnce: {json.dumps(files['celuma-isotipo-once.svg'], ensure_ascii=False)},\n"
    f"  svgLoop: {json.dumps(files['celuma-isotipo-loop.svg'], ensure_ascii=False)},\n"
    f"  master: {json.dumps(MASTER_BOX_SVG, ensure_ascii=False)}}};\n")

# resolved spec + analytic per-frame values for validation
def per_frame(spec, op):
    rows = []
    for fr in range(op):
        dx, dy = value_at(spec["look"], fr)
        row = {"f": fr, "nucleolo": [round(dx, 4), round(dy, 4)],
               "rays": {k: {"s": round(value_at(v["scale"], fr), 5), "o": round(value_at(v["opacity"], fr), 5)}
                        for k, v in spec["rays"].items()}}
        rows.append(row)
    return rows


def jsonable(spec):
    return {k: v for k, v in spec.items()}


SPEC_OUT = EXP / "validation" / "anim-spec.json" if OUT.name == "anim" else OUT / "anim-spec.json"
SPEC_OUT.parent.mkdir(exist_ok=True)
SPEC_OUT.write_text(json.dumps({
    "fps": FPS, "box": BOX, "ray_axis": RAY_AXIS, "nucleus_centre": NUCLEUS_C, "nucleolus_centre": NUCLEOLUS_C,
    "trazos_dx": TRAZOS_DX,
    "once": {"op": ONCE_OP, "spec": jsonable(ONCE), "frames": per_frame(ONCE, ONCE_OP)},
    "loop": {"op": LOOP_OP, "spec": jsonable(LOOP), "frames": per_frame(LOOP, LOOP_OP)},
}, indent=1, default=list))
print("once op", ONCE_OP, "frames =", ONCE_OP / FPS, "s · motion ends at", ONCE["motion_end"])
print("loop op", LOOP_OP, "frames =", LOOP_OP / FPS, "s · motion ends at", LOOP["motion_end"])
print("markers once", ONCE["markers"])
print("markers loop", LOOP["markers"])
