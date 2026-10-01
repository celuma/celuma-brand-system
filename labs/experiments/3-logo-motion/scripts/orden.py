"""Experimento 03 · dirección Orden — «ilumina y ordena» (aprobado en laboratorio).

Escena de marca: un campo de células (el lenguaje del lienzo: anillo teal, citoplasma menta, algún núcleo salmón)
aparece y deriva; cada célula viaja a una ranura de una cuadrícula regular y se condensa en un punto teal
(el «grano de papel» del lienzo). La ranura central es la de la célula de Céluma: el isotipo crece desde ella,
la luz sale de detrás de la membrana y un frente de luz recorre la cuadrícula y la disuelve. En reposo solo queda
el isotipo o el lockup exacto sobre fondo liso (regla de 02: nunca sobre campo celular).

Todo son capas de forma con traslación, escala y opacidad; no hay máscaras, mates, efectos ni expresiones.
Se usa desde motion03.py (build_all).
"""
import math

import numpy as np
from scipy.optimize import linear_sum_assignment

ORDEN = {
    "appear": (0.15, 0.75), "appear_dur": 0.45, "drift_end": 1.35,
    "order": (1.25, 1.55), "order_dur": (0.60, 0.80),
    "grow": (1.95, 2.55), "nucleo": (2.08, 2.58), "trazos": (2.28, 2.66),
    "rays": 2.58, "ray_dur": 0.46, "ray_stagger": 0.08,
    "wave": 2.62, "wave_span": 0.72, "wave_dur": 0.34,
    "letters": 3.00, "letter_dur": 0.44, "letter_stagger": 0.05, "accent": (3.40, 3.72),
    "hold": 0.65,
}
SCENES = {
    # sujeto: (proporción, fracción del lado que ocupa el arte, columnas de la cuadrícula)
    "isotipo": ("1:1", 0.46, 7),
    "lockup-h": ("16:9", 0.58, 11),
    "lockup-v": ("1:1", 0.58, 7),
}


def scene_box(base, aspect, frac):
    cx, cy = base[0] + base[2] / 2, base[1] + base[3] / 2
    if aspect == "16:9":
        W = base[2] / frac
        H = W * 9 / 16
        if base[3] > H * frac:                      # que el alto también quepa
            H = base[3] / frac
            W = H * 16 / 9
    else:
        W = H = max(base[2], base[3]) / frac
    W, H = math.ceil(W), math.ceil(H)
    return (math.floor(cx - W / 2), math.floor(cy - H / 2), W, H)


def build(m, lk_key, subj):
    T = ORDEN
    lk = m.LOCKUPS[lk_key] if lk_key else None
    base = m.base_box(lk)
    aspect, frac, cols = SCENES[subj if not lk_key else f"lockup-{lk_key[0]}"]
    box = scene_box(base, aspect, frac)
    rng = np.random.default_rng(7)
    g = box[2] / cols
    C = np.array(m.CELL_C)
    # cuadrícula alineada con el centro de la célula
    i0, i1 = math.ceil((box[0] + g * 0.5 - C[0]) / g), math.floor((box[0] + box[2] - g * 0.5 - C[0]) / g)
    j0, j1 = math.ceil((box[1] + g * 0.5 - C[1]) / g), math.floor((box[1] + box[3] - g * 0.5 - C[1]) / g)
    slots = np.array([C + np.array([i * g, j * g]) for j in range(j0, j1 + 1) for i in range(i0, i1 + 1)])
    n = len(slots)
    centre = int(np.argmin(np.linalg.norm(slots - C, axis=1)))
    starts = np.c_[rng.uniform(box[0] + g * 0.4, box[0] + box[2] - g * 0.4, n), rng.uniform(box[1] + g * 0.4, box[1] + box[3] - g * 0.4, n)]
    cost = np.linalg.norm(starts[:, None, :] - slots[None, :, :], axis=2)
    ri, ci = linear_sum_assignment(cost)                   # cada célula a la ranura más cercana posible
    target = slots[ci[np.argsort(ri)]]
    radii = rng.uniform(0.20, 0.36, n) * g
    drift_dir = rng.normal(size=(n, 2))
    drift_dir /= np.linalg.norm(drift_dir, axis=1)[:, None]
    mids = starts + drift_dir * rng.uniform(0.10, 0.22, n)[:, None] * g
    with_nucleus = rng.uniform(size=n) > 0.55
    alpha = rng.uniform(0.55, 0.9, n)
    r_dot = 0.05 * g
    F, trk, G = m.F, m.trk, m.G
    dist_c = np.linalg.norm(target - C, axis=1)
    far = float(dist_c.max()) or 1.0
    cells = []
    central_id = None
    for k in range(n):
        a_in = rng.uniform(*T["appear"])
        o_start = rng.uniform(*T["order"])
        o_end = o_start + rng.uniform(*T["order_dur"])
        is_c = bool(np.allclose(target[k], slots[centre]))
        r = float(radii[k])
        if is_c:
            central_id = k
            r = 0.30 * g
        pos = trk((0, tuple(map(float, starts[k])), m.LIN), (a_in, tuple(map(float, starts[k])), m.SINE),
                  (T["drift_end"] if o_start > T["drift_end"] else o_start - 0.01, tuple(map(float, mids[k])), m.LIN),
                  (o_start, tuple(map(float, mids[k])), m.OUT), (o_end, tuple(map(float, target[k])), m.LIN))
        s_dot = r_dot / r
        wave_t = T["wave"] + T["wave_span"] * (float(dist_c[k]) / far)
        if is_c:
            # la célula central llega, conserva su tamaño de célula y se funde bajo el isotipo que crece
            scale = trk((0, (0.0, 0.0), m.LIN), (a_in, (0.0, 0.0), m.OUT), (a_in + T["appear_dur"], (1.0, 1.0), m.LIN))
            opac = trk((0, float(alpha[k]), m.LIN), (T["grow"][0] + 0.05, float(alpha[k]), m.LIN), (T["grow"][0] + 0.22, 0.0, m.LIN))
            inner = trk((0, (1.0, 1.0), m.LIN))
        else:
            scale = trk((0, (0.0, 0.0), m.LIN), (a_in, (0.0, 0.0), m.OUT), (a_in + T["appear_dur"], (1.0, 1.0), m.LIN),
                        (o_start, (1.0, 1.0), m.OUT), (o_end, (s_dot, s_dot), m.LIN),
                        (wave_t, (s_dot, s_dot), m.OUT), (wave_t + T["wave_dur"] * 0.45, (s_dot * 1.7, s_dot * 1.7), m.IO),
                        (wave_t + T["wave_dur"], (0.0, 0.0), m.LIN))
            opac = trk((0, float(alpha[k]), m.LIN))
            inner = trk((0, (1.0, 1.0), m.LIN), (o_start, (1.0, 1.0), m.OUT), (o_start + 0.5 * (o_end - o_start), (0.0, 0.0), m.LIN))
        ring_w = 0.2 * r
        body = [{"type": "circle", "id": f"c{k}-anillo", "c": (0.0, 0.0), "r": r, "fill": m.PALETA["membrana"]},
                G(f"c{k}-interior", [{"type": "circle", "id": f"c{k}-menta", "c": (0.0, 0.0), "r": r - ring_w, "fill": m.PALETA["citoplasma"]}] +
                  ([{"type": "circle", "id": f"c{k}-nucleo", "c": (0.18 * r, -0.12 * r), "r": 0.34 * r, "fill": m.PALETA["nucleo"]}]
                   if with_nucleus[k] or is_c else []), kind="s", anchor=(0.0, 0.0), track=inner)]
        cells.append(G(f"c{k}", [G(f"c{k}-escala", body, kind="s", anchor=(0.0, 0.0), track=scale)], kind="t", track=pos, opacity=opac))
    # ---------------------------------------------------------------- isotipo que crece desde la ranura central
    s0 = (0.30 * g) / 290.0                          # radio de la célula central / radio medio de la membrana
    a, b = T["grow"]
    cuerpo = G("cuerpo", [m.P("membrana"), m.P("citoplasma")], kind="s", anchor=m.CELL_C,
               track=trk((0, (0.0, 0.0), m.LIN), (a, (s0, s0), m.OUT), (b, (1.0, 1.0), m.LIN)))
    a, b = T["nucleo"]
    nucleo = G("nucleo-orden", [m.P("nucleo"), m.P("nucleolo")], kind="s", anchor=m.NUCLEO_C,
               track=trk((0, (0.0, 0.0), m.LIN), (a, (0.0, 0.0), m.OUT), (b, (1.0, 1.0), m.LIN)))
    a, b = T["trazos"]
    trazos = G("trazos-orden", [m.P("trazo-izquierdo"), m.P("trazo-derecho")], kind="s", anchor=m.CELL_C,
               track=trk((0, (0.0, 0.0), m.LIN), (a, (0.6, 0.6), m.OUT), (b, (1.0, 1.0), m.LIN)),
               opacity=trk((0, 0.0, m.LIN), (a, 0.0, m.FADE), (a + 0.12, 1.0, m.LIN)))
    rays, ends = [], [T["grow"][1]]
    for i, key in enumerate(reversed(m.RAYS)):
        a = T["rays"] + i * T["ray_stagger"]
        d = -m.AXIS[key]["u"] * m.HIDE[key]
        rays.append(G(key + "-orden", [m.P(key)], kind="t",
                      track=trk((0, (float(d[0]), float(d[1])), m.LIN), (a, (float(d[0]), float(d[1])), m.LIGHT), (a + T["ray_dur"], (0.0, 0.0), m.LIN)),
                      opacity=m.hidden_until(a)))
        ends.append(a + T["ray_dur"])
    rays.sort(key=lambda x: x["id"])
    kids = [G("campo", cells), G("rayos", rays), G("celula", [cuerpo, nucleo, trazos])]
    ends.append(T["wave"] + T["wave_span"] + T["wave_dur"])
    tl = [("Campo celular · aparece y deriva", T["appear"][0], T["drift_end"], "campo"),
          ("Orden · cada célula a su ranura", T["order"][0], T["order"][1] + T["order_dur"][1], "orden"),
          ("Una célula se vuelve Céluma", *T["grow"], "vida"),
          ("La luz sale de la célula", T["rays"], T["rays"] + 2 * T["ray_stagger"] + T["ray_dur"], "luz"),
          ("Frente de luz · la cuadrícula se despeja", T["wave"], T["wave"] + T["wave_span"] + T["wave_dur"], "luz")]
    markers = [("vacio", 0), ("campo", F(T["appear"][0])), ("orden", F(T["order"][0])), ("celula", F(T["grow"][0])), ("luz", F(T["rays"]))]
    if lk:
        rise = 0.13 * lk["em"]
        letters = []
        for i, key in enumerate(m.LETTERS):
            x0, y0, x1, y1 = m.glyph_box(lk, key)
            # cada letra espera a que el frente de luz haya despejado su zona de la cuadrícula
            near = [T["wave"] + T["wave_span"] * (float(dist_c[k]) / far) + T["wave_dur"] for k in range(n)
                    if x0 - g * 0.6 <= target[k][0] <= x1 + g * 0.6 and y0 - g * 0.6 <= target[k][1] <= y1 + g * 0.6]
            a = max([T["letters"] + i * T["letter_stagger"]] + [t - 0.20 for t in near])
            letters.append(G(f"letra-{key}", [m.word_group(lk, [key], f"glifo-{key}")], kind="t",
                             track=trk((0, (0.0, rise), m.LIN), (a, (0.0, rise), m.OUT), (a + T["letter_dur"], (0.0, 0.0), m.LIN)),
                             opacity=trk((0, 0.0, m.LIN), (a, 0.0, m.FADE), (a + 0.18, 1.0, m.LIN))))
            ends.append(a + T["letter_dur"])
        a, b = T["accent"]
        letters.append(G("letra-acento", [m.word_group(lk, ["acento"], "glifo-acento")], kind="t",
                         track=trk((0, (0.0, rise * 0.8), m.LIN), (a, (0.0, rise * 0.8), m.LIGHT), (b, (0.0, 0.0), m.LIN)),
                         opacity=trk((0, 0.0, m.LIN), (a, 0.0, m.FADE), (a + 0.12, 1.0, m.LIN))))
        ends.append(b)
        kids.append(G("nombre", letters))
        tl.append(("El nombre se asienta", T["letters"], b, "tipo"))
        markers.append(("nombre", F(T["letters"])))
    end = max(ends)
    fin, op = F(end), F(end + T["hold"])
    markers.append(("final", fin))
    tl.append(("Final = lockup/isotipo exacto sobre fondo liso", end, end + T["hold"], "final"))
    tree = G("orden", kids)
    name = f"orden-{subj}"
    layers = [m.lot_layer("final-estatico", m.static_tree(lk), box, fin, op), m.lot_layer("animacion", tree, box, 0, fin)]
    doc = m.lottie_doc(f"Céluma · orden · {subj}", box, op, layers, markers,
                       f"Orden · escena {aspect}, {n} células de campo que se ordenan en cuadrícula; una se vuelve Céluma. "
                       "Traslación, escala y opacidad; sin máscaras ni mates. El reposo final es el arte exacto sobre fondo liso.")
    import json
    (m.E3 / "lottie" / f"{name}.json").write_text(json.dumps(doc, separators=(",", ":"), ensure_ascii=False))
    stat = m.static_svg(lk, box)
    (m.E3 / "estaticos" / f"{name}.svg").write_text(stat)
    return {"direction": "orden", "subject": subj, "box": list(box), "op": op, "fin": fin, "loop": False, "fps": m.FPS,
            "markers": markers, "timeline": tl, "lottie": f"lottie/{name}.json", "static": f"estaticos/{name}.svg",
            "duration_s": round(op / m.FPS, 3), "motion_s": round(fin / m.FPS, 3), "aspect": aspect, "cells": n,
            "central_cell": central_id, "grid_step": g}


def build_all(m):
    out = [build(m, None, "isotipo")]
    for key in (("h", "pos"), ("h", "neg"), ("v", "pos"), ("v", "neg")):
        out.append(build(m, key, f"lockup-{key[0]}-{key[1]}"))
    return out
