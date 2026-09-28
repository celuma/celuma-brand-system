"""Fit an editable SVG master of the isotipo to assets/celuma-isotipo.png.

Pipeline (see README §Método):
1. Per layer, a continuous "inside" field is built from the raster:
   - rays and body silhouette: alpha / 255
   - cytoplasm (inner edge of the ring): projection of RGB on the teal→mint axis
   - nucleus: projection on mint→salmon; nucleolus: salmon→dark salmon
   - inner strokes: projection on mint→teal (ring excluded)
   The 0.5 iso-line of each field is the edge. A 1 px sharpening halo sits on
   both sides of every edge in the PNG; it is symmetric, so it does not move
   the 0.5 crossing.
2. The iso-line is traced at 8x (bilinear) and every point is then snapped to
   the exact 0.5 crossing along its normal, giving a dense sub-pixel contour.
3. Each closed contour is fitted with cubic Béziers (Schneider's algorithm,
   G1 joins), then refined globally by least squares with smooth (G1) nodes.
   The node count is the smallest that keeps max error <= TOL.
4. Nucleus and nucleolus are tested as circles and rays/strokes as capsules;
   the simpler primitive is only used if it is as faithful as the free fit.

Output: master/celuma-isotipo-master.svg and validation/fit-report.json
"""
import json
import math

import cv2
import numpy as np

from celuma_img import EXP, erode, load_rgba, region_masks
from fitlib import UP, fit_capsule, fit_circle, fit_shape, path_d, trace

TOL = 0.5        # px, target max distance contour → curve (see fitlib.MAX_TOL)
rgba = load_rgba()
H, W = rgba.shape[:2]
RGB = rgba[..., :3]
A = rgba[..., 3] / 255.0
masks = region_masks(rgba)
colors = json.loads((EXP / "validation" / "color-analysis.json").read_text())["regions"]
C = {k: np.array(v["median_rgb"]) for k, v in colors.items()}
teal = (C["ring"] * masks["ring"].sum() + C["strokes"] * masks["strokes"].sum()) / (
    masks["ring"].sum() + masks["strokes"].sum())


def proj(c0, c1):
    d = c1 - c0
    return ((RGB - c0) @ d) / (d @ d)


# ------------------------------------------------------------------ fields
dil = lambda m, r: cv2.dilate(m.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1,) * 2)) > 0
# Body and rays are separated by connected components of the alpha mask (the cell is
# the largest component, the rays are the next three). Colour classes are not used
# here: the light halo at ray tips would otherwise be taken for cytoplasm.
ncc, cc, st, _ = cv2.connectedComponentsWithStats((A >= 0.5).astype(np.uint8), connectivity=8)
order = 1 + np.argsort(-st[1:, cv2.CC_STAT_AREA])
body_cc = cc == order[0]
rays_cc = np.isin(cc, order[1:4])
body_zone = dil(body_cc, 3)
ray_zone = dil(rays_cc, 3) & ~body_zone

fields = {}
fields["rays"] = np.where(ray_zone, A, 0.0)
fields["body"] = np.where(body_zone, A, 0.0)
# inner edge of the ring: inside = anything that is not teal ring, within the body
inner_zone = erode(body_cc, 3)
f = np.clip(proj(teal, C["mint"]), -0.5, 1.5)
f = np.where(inner_zone, f, 0.0)
fields["mint"] = f
nz = dil(masks["nucleus"] | masks["nucleolus"], 6)
fields["nucleus"] = np.where(nz, np.clip(proj(C["mint"], C["nucleus"]), -0.5, 1.5), 0.0)
fields["nucleolus"] = np.where(dil(masks["nucleolus"], 6), np.clip(proj(C["nucleus"], C["nucleolus"]), -0.5, 1.5), 0.0)
sz = dil(masks["strokes"], 6) & ~dil(masks["ring"], 2)
fields["strokes"] = np.where(sz, np.clip(proj(C["mint"], teal), -0.5, 1.5), 0.0)


# ------------------------------------------------------------------ run
report = {"tolerance_px": TOL, "trace_upsample": UP, "shapes": {}}
shapes = {}

def register(key, p, allow=None):
    segs, d, corner, hist = fit_shape(p, key)
    entry = {"free_nodes": len(segs), "corner_nodes": int(sum(corner)), "free_max_px": round(float(d.max()), 3),
             "free_rms_px": round(float(np.sqrt((d ** 2).mean())), 3),
             "free_p99_px": round(float(np.percentile(d, 99)), 3), "points": len(p),
             "history_nodes_max_rms": [[n, round(a, 3), round(b, 3)] for n, a, b in hist]}
    chosen = ("path", path_d(segs))
    if allow == "circle":
        q, dc = fit_circle(p)
        entry.update(circle={"cx": round(q[0], 3), "cy": round(q[1], 3), "r": round(q[2], 3),
                             "max_px": round(float(dc.max()), 3), "rms_px": round(float(np.sqrt((dc ** 2).mean())), 3)})
        if dc.max() <= d.max() * 1.05 and np.sqrt((dc ** 2).mean()) <= np.sqrt((d ** 2).mean()) * 1.1:
            chosen = ("circle", q)
    if allow == "capsule":
        q, dc = fit_capsule(p)
        entry.update(capsule={"x1": round(q[0], 2), "y1": round(q[1], 2), "x2": round(q[2], 2), "y2": round(q[3], 2),
                              "width": round(2 * q[4], 2), "max_px": round(float(dc.max()), 3),
                              "rms_px": round(float(np.sqrt((dc ** 2).mean())), 3)})
        if dc.max() <= d.max() * 1.05 and np.sqrt((dc ** 2).mean()) <= np.sqrt((d ** 2).mean()) * 1.1:
            chosen = ("capsule", q)
    entry["representation"] = chosen[0]
    report["shapes"][key] = entry
    shapes[key] = chosen
    np.save(EXP / "validation" / f"_contour_{key}.npy", p)
    print(key, entry)


def order_lr(cs):
    return sorted(cs, key=lambda c: c[:, 0].mean())


rays = order_lr(trace(fields["rays"]))
assert len(rays) == 3, len(rays)
for i, p in enumerate(rays):
    register(f"ray-{i + 1}", p, allow="capsule")
body = trace(fields["body"])
assert len(body) == 1
register("body", body[0])
mint = trace(fields["mint"])
mint = max(mint, key=len)
register("cytoplasm", mint)
nuc = max(trace(fields["nucleus"]), key=len)
register("nucleus", nuc, allow="circle")
nol = max(trace(fields["nucleolus"], min_len=10), key=len)
register("nucleolus", nol, allow="circle")
st = order_lr(trace(fields["strokes"]))
assert len(st) == 2, len(st)
register("stroke-left", st[0])
register("stroke-right", st[1], allow="capsule")

(EXP / "validation" / "fit-report.json").write_text(json.dumps(report, indent=2))
json.dump({k: (v[0], v[1] if isinstance(v[1], str) else [float(x) for x in v[1]]) for k, v in shapes.items()},
          open(EXP / "validation" / "_shapes.json", "w"), indent=1)
print("nodes total (free fits):", sum(e["free_nodes"] for e in report["shapes"].values()))
