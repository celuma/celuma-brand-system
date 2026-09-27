"""Compare the SVG master with the source PNG and build the validation sheets.

1. Chromium renders the master at the source box (697 x 777, transparent) and,
   for small sizes, both the PNG (cropped to the artwork box) and the SVG into
   N x N squares (16, 20, 32, 64, 256) — same browser resampling for both.
2. Metrics (validation/metrics.json):
   - silhouette: IoU of alpha >= 0.5, area ratio (sum of alpha), mean |d alpha|,
     symmetric boundary distance between the 0.5 iso-lines (mean / p95 / max)
   - regions: per-region IoU, area ratio and centroid offset (px)
   - colour: CIEDE2000 per pixel on white, cream and navy composites — all
     pixels, flat interiors (eroded 3 px) and the 2 px edge band separately
   - small sizes: mean ΔE00 and alpha MAE between PNG and SVG at each size
3. Sheets (validation/*.png): overlay/difference, edge overlay, zooms, sizes.
"""
import json
import subprocess

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.spatial import cKDTree

from celuma_img import (EXP, REGIONS, SOURCE, clean_regions, composite, delta_e2000, erode, load_rgba,
                        region_masks, srgb_to_lab)

VAL = EXP / "validation"
SCR = EXP / "scripts"
BGS = {"blanco": (255, 255, 255), "crema": (251, 246, 236), "navy": (13, 27, 42)}
SIZES = [16, 20, 32, 64, 256]
geo = json.loads((VAL / "geometry.json").read_text())
TIGHT = geo["tight_viewbox"]

# ------------------------------------------------------------------ renders
jobs = [{"kind": "svg", "src": str(EXP / "master" / "celuma-isotipo-maestro.svg"),
         "out": str(VAL / "render-maestro-697x777.png"), "width": 697, "height": 777}]
for n in SIZES:
    jobs.append({"kind": "png", "src": str(SOURCE), "out": str(VAL / "sizes" / f"png-{n}.png"),
                 "width": n, "height": n, "fit": TIGHT, "natural": [697, 777]})
    jobs.append({"kind": "svg", "src": str(EXP / "master" / "celuma-isotipo-maestro.svg"),
                 "out": str(VAL / "sizes" / f"svg-{n}.png"), "width": n, "height": n, "fit": TIGHT})
(VAL / "_jobs.json").write_text(json.dumps(jobs))
subprocess.run(["node", str(SCR / "render.mjs"), str(VAL / "_jobs.json")], check=True, cwd=SCR)

src = load_rgba()
vec = load_rgba(VAL / "render-maestro-697x777.png")
H, W = src.shape[:2]
aS, aV = src[..., 3] / 255, vec[..., 3] / 255
M = {}


# ------------------------------------------------------------------ silhouette
def iso_points(alpha, up=8):
    big = cv2.resize(alpha.astype(np.float32), (W * up, H * up), interpolation=cv2.INTER_LINEAR)
    cnts, _ = cv2.findContours((big >= 0.5).astype(np.uint8), cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    pts = np.vstack([c[:, 0, :] for c in cnts if len(c) > 40 * up]).astype(np.float64)
    return (pts + 0.5) / up


mS, mV = aS >= 0.5, aV >= 0.5
pS, pV = iso_points(aS), iso_points(aV)
dSV, _ = cKDTree(pV).query(pS)
dVS, _ = cKDTree(pS).query(pV)
dsym = np.r_[dSV, dVS]
M["silhouette"] = {
    "iou_alpha50": round(float((mS & mV).sum() / (mS | mV).sum()), 5),
    "area_ratio_sum_alpha": round(float(aV.sum() / aS.sum()), 5),
    "alpha_mae_in_union_bbox": round(float(np.abs(aV - aS)[mS | mV].mean()), 5),
    "pixels_alpha_diff_gt_0_25": int((np.abs(aV - aS) > 0.25).sum()),
    "boundary_distance_px": {"mean": round(float(dsym.mean()), 3), "p95": round(float(np.percentile(dsym, 95)), 3),
                             "max": round(float(dsym.max()), 3)},
}

# ------------------------------------------------------------------ regions
rS, rV = clean_regions(region_masks(src)), clean_regions(region_masks(vec))
M["regions"] = {}
for k in REGIONS:
    a, b = rS[k], rV[k]
    ya, xa = np.nonzero(a)
    yb, xb = np.nonzero(b)
    M["regions"][k] = {
        "iou": round(float((a & b).sum() / (a | b).sum()), 4),
        "area_ratio": round(float(b.sum() / a.sum()), 4),
        "centroid_offset_px": [round(float(xb.mean() - xa.mean()), 3), round(float(yb.mean() - ya.mean()), 3)],
    }

# Nucleus as a whole disc, measured on the colour field (projection on the mint→salmon
# axis >= 0.5, nucleolus included). The colour-class masks are unreliable here: the
# 1 px red halo inside the PNG nucleus edge is removed by the 3x3 opening.
col = json.loads((VAL / "color-analysis.json").read_text())["regions"]
mint_c, sal_c = np.array(col["mint"]["median_rgb"]), np.array(col["nucleus"]["median_rgb"])


def disc(img):
    dd = sal_c - mint_c
    f = ((img[..., :3] - mint_c) @ dd) / (dd @ dd)
    m = np.zeros(f.shape, bool)
    m[270:530, 260:520] = f[270:530, 260:520] >= 0.5
    return m


dS, dV = disc(src), disc(vec)
M["regions"]["nucleus_disc_field"] = {"iou": round(float((dS & dV).sum() / (dS | dV).sum()), 4),
                                      "area_ratio": round(float(dV.sum() / dS.sum()), 4),
                                      "note": "nucleus + nucleolus on the mint→salmon colour field; halo-independent"}

# ray axes and tips on the sub-pixel 0.5 alpha contour (a pixel-extreme measure is
# quantised to 1 px and overstated the ray-3 tip difference in an earlier run)
from fitlib import trace


def ray_tips(alpha):
    n, cc, st, _ = cv2.connectedComponentsWithStats((alpha >= 0.5).astype(np.uint8))
    order = 1 + np.argsort(-st[1:, cv2.CC_STAT_AREA])
    tips = []
    for i in sorted(order[1:4], key=lambda i: st[i, cv2.CC_STAT_LEFT]):
        zone = cv2.dilate((cc == i).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
        P = max(trace(np.where(zone, alpha, 0.0), min_len=10), key=len)
        c = P.mean(0)
        u = np.linalg.svd(P - c)[2][0]
        if u[1] > 0:
            u = -u
        pr = (P - c) @ u
        tips.append({"center": c, "axis_deg": float(np.degrees(np.arctan2(u[1], u[0])) % 180),
                     "length": float(pr.max() - pr.min()), "u": u, "P": P})
    return tips


tS, tV = ray_tips(aS), ray_tips(aV)
M["rays"] = []
for i, (s_, v) in enumerate(zip(tS, tV)):
    # reach of each end measured along the SOURCE axis (robust for round caps)
    ps = (s_["P"] - s_["center"]) @ s_["u"]
    pv = (v["P"] - s_["center"]) @ s_["u"]
    M["rays"].append({
        "ray": i + 1,
        "center_offset_px": [round(float(v["center"][0] - s_["center"][0]), 3), round(float(v["center"][1] - s_["center"][1]), 3)],
        "axis_deg_source": round(s_["axis_deg"], 2), "axis_deg_vector": round(v["axis_deg"], 2),
        "length_source_px": round(s_["length"], 2), "length_vector_px": round(v["length"], 2),
        "end_reach_diff_px": [round(float(pv.min() - ps.min()), 3), round(float(pv.max() - ps.max()), 3)],
    })

# ------------------------------------------------------------------ colour
union = (aS > 0) | (aV > 0)
edge = np.zeros_like(union)
for k in REGIONS:
    m = rS[k].astype(np.uint8)
    edge |= (cv2.dilate(m, np.ones((5, 5), np.uint8)) - cv2.erode(m, np.ones((5, 5), np.uint8))) > 0
edge |= (cv2.dilate(mS.astype(np.uint8), np.ones((5, 5), np.uint8)) - cv2.erode(mS.astype(np.uint8), np.ones((5, 5), np.uint8))) > 0
interior = union & ~edge
M["color"] = {}
de_white = None
for name, bg in BGS.items():
    cS, cV = composite(src, bg), composite(vec, bg)
    de = delta_e2000(srgb_to_lab(cS), srgb_to_lab(cV))
    if name == "blanco":
        de_white = de
    M["color"][name] = {
        "all_de00": {"mean": round(float(de[union].mean()), 3), "p95": round(float(np.percentile(de[union], 95)), 3),
                     "p99": round(float(np.percentile(de[union], 99)), 3)},
        "interior_de00": {"mean": round(float(de[interior].mean()), 3), "p95": round(float(np.percentile(de[interior], 95)), 3)},
        "edge_band_de00": {"mean": round(float(de[edge & union].mean()), 3), "p95": round(float(np.percentile(de[edge & union], 95)), 3)},
        "per_region_interior_mean_de00": {k: round(float(de[erode(rS[k], 3)].mean()), 3) for k in REGIONS},
        "share_pixels_de_gt_2": round(float((de[union] > 2).mean()), 4),
        "share_pixels_de_gt_5": round(float((de[union] > 5).mean()), 4),
    }

# ------------------------------------------------------------------ small sizes
M["sizes"] = {}
for n in SIZES:
    a = np.asarray(Image.open(VAL / "sizes" / f"png-{n}.png").convert("RGBA")).astype(np.float64)
    b = np.asarray(Image.open(VAL / "sizes" / f"svg-{n}.png").convert("RGBA")).astype(np.float64)
    u = (a[..., 3] > 0) | (b[..., 3] > 0)
    row = {"alpha_mae": round(float(np.abs(a[..., 3] - b[..., 3])[u].mean() / 255), 4)}
    for name, bg in BGS.items():
        de = delta_e2000(srgb_to_lab(composite(a, bg)), srgb_to_lab(composite(b, bg)))
        row[f"de00_mean_{name}"] = round(float(de[u].mean()), 3)
        row[f"de00_max_{name}"] = round(float(de[u].max()), 2)
    M["sizes"][str(n)] = row

(VAL / "metrics.json").write_text(json.dumps(M, indent=2, ensure_ascii=False))

# ------------------------------------------------------------------ sheets
try:
    FONT = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 18)
    FONT_S = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 14)
except OSError:
    FONT = FONT_S = ImageFont.load_default()
BANNER = "Exploración · no aprobada — 2-logo-vector-v2"


def on(rgba, bg):
    return Image.fromarray(np.clip(composite(rgba, bg), 0, 255).astype(np.uint8))


def heat(v, vmax):
    t = np.clip(v / vmax, 0, 1)
    r = np.clip(3 * t, 0, 1)
    g = np.clip(3 * t - 1, 0, 1)
    b = np.clip(3 * t - 2, 0, 1)
    return Image.fromarray((np.stack([r, g, b], -1) * 255).astype(np.uint8))


def labelled(tiles, labels, pad=16, top=34, title=None):
    w = sum(t.width for t in tiles) + pad * (len(tiles) + 1)
    h = max(t.height for t in tiles) + top + pad + (40 if title else 0)
    sheet = Image.new("RGB", (w, h), (245, 243, 238))
    d = ImageDraw.Draw(sheet)
    y0 = pad
    if title:
        d.text((pad, 10), title, fill=(13, 27, 42), font=FONT)
        d.text((w - pad - 330, 12), BANNER, fill=(180, 65, 58), font=FONT_S)
        y0 += 40
    x = pad
    for t, lab in zip(tiles, labels):
        d.text((x, y0 - 4), lab, fill=(13, 27, 42), font=FONT_S)
        sheet.paste(t, (x, y0 + top - 16))
        x += t.width + pad
    return sheet


white = BGS["blanco"]
S_img, V_img = on(src, white), on(vec, white)
onion = Image.blend(S_img, V_img, 0.5)
diff = heat(de_white, 10.0)
# edge overlay: source iso-line magenta, vector iso-line green
ov = Image.new("RGB", (W, H), (255, 255, 255))
od = ImageDraw.Draw(ov)
for pts, colr in ((pS, (230, 0, 160)), (pV, (0, 150, 60))):
    for x, y in pts[::3]:
        od.point((x, y), fill=colr)
labelled([S_img, V_img, onion, diff, ov],
         ["PNG fuente (697×777)", "SVG maestro (Chromium)", "Superposición 50 %", "ΔE00 (negro 0 → blanco ≥10)",
          "Silueta α=0,5: PNG magenta / SVG verde"],
         title="Isotipo · fuente raster vs maestro SVG, misma caja y resolución").save(VAL / "lamina-overlay-diferencia.png")

# zooms 8x
spots = {"extremo rayo 3": (357, 60), "borde membrana/citoplasma": (140, 470), "núcleo y nucléolo": (440, 350),
         "unión trazo izquierdo": (290, 580), "borde exterior inferior": (390, 700)}
rows = []
for name, (cx, cy) in spots.items():
    box = (cx - 22, cy - 22, cx + 22, cy + 22)
    z = lambda im: im.crop(box).resize((352, 352), Image.NEAREST)
    rows.append(labelled([z(S_img), z(V_img), z(diff)], [f"{name} · PNG", "SVG", "ΔE00"]))
sheet = Image.new("RGB", (rows[0].width, sum(r.height for r in rows) + 50), (245, 243, 238))
ImageDraw.Draw(sheet).text((16, 14), "Detalles ×8 — halo de nitidez de ~1 px en el PNG; el SVG no lo reproduce", fill=(13, 27, 42), font=FONT)
ImageDraw.Draw(sheet).text((sheet.width - 346, 16), BANNER, fill=(180, 65, 58), font=FONT_S)
y = 50
for r in rows:
    sheet.paste(r, (0, y))
    y += r.height
sheet.save(VAL / "lamina-detalles-x8.png")

# sizes sheet: every size at 1:1 plus a nearest-neighbour 4x magnification for inspection
cols = []
labels = []
for bgname, bg in BGS.items():
    for kind in ("png", "svg"):
        tiles = []
        for n in SIZES:
            im = Image.open(VAL / "sizes" / f"{kind}-{n}.png").convert("RGBA")
            base = Image.new("RGBA", im.size, bg + (255,))
            one = Image.alpha_composite(base, im).convert("RGB")
            mag = one.resize((n * 4, n * 4), Image.NEAREST) if n <= 64 else one
            tile = Image.new("RGB", (max(mag.width, 256) + one.width + 24, max(mag.height, n) + 12), bg)
            tile.paste(one, (6, 6))
            tile.paste(mag, (one.width + 18, 6))
            tiles.append(tile)
        colw = max(t.width for t in tiles)
        col = Image.new("RGB", (colw, sum(t.height for t in tiles) + 8 * len(tiles)), bg)
        yy = 0
        for t in tiles:
            col.paste(t, (0, yy))
            yy += t.height + 8
        cols.append(col)
        labels.append(f"{'PNG' if kind == 'png' else 'SVG'} · {bgname}")
labelled(cols, labels, title=f"Tamaños {', '.join(map(str, SIZES))} px (1:1 y ampliado ×4 vecino más cercano ≤64 px)").save(VAL / "lamina-tamanos-fondos.png")

print(json.dumps({k: M[k] for k in ("silhouette",)}, indent=1))
print(json.dumps(M["color"]["blanco"], indent=1))
print(json.dumps(M["regions"], indent=1))
print(json.dumps(M["rays"], indent=1))
print(json.dumps(M["sizes"], indent=1))
