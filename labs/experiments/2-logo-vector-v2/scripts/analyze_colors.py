"""Measure the real colours of assets/celuma-isotipo.png and test for gradients.

Method
- Opaque pixels (alpha >= 250) are labelled by nearest k-means seed, the teal
  class is split into ring (largest component) and inner strokes.
- Each region is eroded by 4 px so anti-aliasing and the ~1 px sharpening halo
  on every edge are excluded: what remains is the colour "plateau".
- Plateau colour = per-channel median (robust to the generator's grain).
- Gradient test: least-squares fit rgb = c0 + cx*x + cy*y over the plateau.
  The predicted change across the region (corner to corner of its bbox) is
  reported in RGB levels and CIEDE2000. A radial fit from the region centroid
  is reported too. ΔE00 < 1 across the whole region = not a perceptible
  gradient; the region is modelled as a flat fill.

Output: validation/color-analysis.json
"""
import json

import numpy as np

from celuma_img import (EXP, SOURCE, REGIONS, delta_e2000, erode, hexcol, load_rgba,
                        region_masks, srgb_to_lab)

rgba = load_rgba()
H, W = rgba.shape[:2]
alpha = rgba[..., 3]
masks = region_masks(rgba)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float64)

out = {"source": str(SOURCE.relative_to(EXP.parents[2])), "size": [W, H], "regions": {}}
for name in REGIONS:
    m = masks[name] & (alpha >= 250)
    core = erode(m, 4)
    px = rgba[core][:, :3]
    med = np.median(px, axis=0)
    mean = px.mean(axis=0)
    std = px.std(axis=0)
    lab_px = srgb_to_lab(px)
    de_to_med = delta_e2000(lab_px, srgb_to_lab(med)[None])

    # linear gradient fit
    X = np.stack([np.ones(core.sum()), xx[core], yy[core]], axis=1)
    coef, *_ = np.linalg.lstsq(X, px, rcond=None)
    fit = X @ coef
    ss_res = ((px - fit) ** 2).sum(0)
    ss_tot = ((px - mean) ** 2).sum(0)
    r2 = 1 - ss_res / np.maximum(ss_tot, 1e-9)
    ys, xs = np.nonzero(core)
    corners = np.array([[1, xs.min(), ys.min()], [1, xs.max(), ys.max()],
                        [1, xs.min(), ys.max()], [1, xs.max(), ys.min()]], dtype=np.float64)
    cc = corners @ coef
    lin_de = max(float(delta_e2000(srgb_to_lab(cc[0]), srgb_to_lab(cc[1]))),
                 float(delta_e2000(srgb_to_lab(cc[2]), srgb_to_lab(cc[3]))))
    lin_rgb = float(np.abs(np.r_[cc[0] - cc[1], cc[2] - cc[3]]).max())

    # radial fit from centroid
    cx, cy = xs.mean(), ys.mean()
    r = np.hypot(xx[core] - cx, yy[core] - cy)
    Xr = np.stack([np.ones_like(r), r], axis=1)
    coef_r, *_ = np.linalg.lstsq(Xr, px, rcond=None)
    rmax = r.max()
    rad_de = float(delta_e2000(srgb_to_lab(coef_r[0]), srgb_to_lab(coef_r[0] + coef_r[1] * rmax)))

    # coarse 4x4 block medians to show any spatial drift
    blocks = []
    for by in np.array_split(np.arange(ys.min(), ys.max() + 1), 4):
        row = []
        for bx in np.array_split(np.arange(xs.min(), xs.max() + 1), 4):
            sub = core[by[0]:by[-1] + 1, bx[0]:bx[-1] + 1]
            if sub.sum() > 200:
                row.append(hexcol(np.median(rgba[by[0]:by[-1] + 1, bx[0]:bx[-1] + 1][sub][:, :3], axis=0)))
            else:
                row.append(None)
        blocks.append(row)

    out["regions"][name] = {
        "plateau_pixels": int(core.sum()),
        "median_hex": hexcol(med),
        "median_rgb": [round(float(v), 1) for v in med],
        "mean_rgb": [round(float(v), 2) for v in mean],
        "std_rgb": [round(float(v), 2) for v in std],
        "grain_de00_p50": round(float(np.percentile(de_to_med, 50)), 2),
        "grain_de00_p95": round(float(np.percentile(de_to_med, 95)), 2),
        "linear_gradient_r2": [round(float(v), 3) for v in r2],
        "linear_gradient_span_rgb_levels": round(lin_rgb, 2),
        "linear_gradient_span_de00": round(lin_de, 2),
        "radial_gradient_span_de00": round(rad_de, 2),
        "block_medians_4x4": blocks,
        "verdict": "flat" if max(lin_de, rad_de) < 1.0 else "gradient",
    }

# interior alpha noise (not a design feature)
inner = erode(alpha >= 250, 4)
out["alpha"] = {
    "interior_pixels": int(inner.sum()),
    "interior_alpha_mean": round(float(alpha[inner].mean()), 3),
    "interior_alpha_min": int(alpha[inner].min()),
    "interior_share_below_255": round(float((alpha[inner] < 255).mean()), 3),
    "note": "Interior alpha is dithered 240-255 by the generator (and a blocky fully-opaque patch in the nucleus). Max transparency 1-2 %; treated as noise, the master uses opacity 1.",
}

(EXP / "validation").mkdir(exist_ok=True)
(EXP / "validation" / "color-analysis.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
for n, r in out["regions"].items():
    print(f'{n:10s} {r["median_hex"]}  std={r["std_rgb"]}  grain p95 ΔE={r["grain_de00_p95"]}  '
          f'lin ΔE={r["linear_gradient_span_de00"]}  rad ΔE={r["radial_gradient_span_de00"]}  -> {r["verdict"]}')
print(out["alpha"])
