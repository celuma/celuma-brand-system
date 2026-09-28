"""Shared helpers for the 2-logo-vector-v2 experiment.

Runs with the Python that already has numpy, scipy, OpenCV and Pillow on this
machine (/opt/homebrew/bin/python3.10). No new dependencies are installed.
The source raster is only ever read, never written.
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

EXP = Path(__file__).resolve().parents[1]            # labs/experiments/2-logo-vector-v2
REPO = EXP.parents[2]                                # celuma-brand-system
SOURCE = REPO / "assets" / "celuma-isotipo.png"      # 697 x 777 RGBA, read-only
NOTION_V2 = REPO / "docs" / "revision-grafica" / "referencias" / "notion" / "Celuma_Isotipo_V2.png"
CROP_OFFSET = (156, 108)                             # (x, y) of SOURCE inside NOTION_V2, measured

# Region order = painter's order of the master SVG.
REGIONS = ["rays", "ring", "mint", "nucleus", "nucleolus", "strokes"]


def load_rgba(path=SOURCE):
    return np.asarray(Image.open(path).convert("RGBA")).astype(np.float64)


# ---------------------------------------------------------------- colour maths
def srgb_to_linear(c):
    c = np.asarray(c, dtype=np.float64) / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(c):
    c = np.clip(c, 0, 1)
    return 255.0 * np.where(c <= 0.0031308, 12.92 * c, 1.055 * c ** (1 / 2.4) - 0.055)


def srgb_to_lab(rgb):
    lin = srgb_to_linear(rgb)
    m = np.array([[0.4124564, 0.3575761, 0.1804375],
                  [0.2126729, 0.7151522, 0.0721750],
                  [0.0193339, 0.1191920, 0.9503041]])
    xyz = lin @ m.T
    xyz = xyz / np.array([0.95047, 1.0, 1.08883])
    e = 216 / 24389
    k = 24389 / 27
    f = np.where(xyz > e, np.cbrt(xyz), (k * xyz + 16) / 116)
    L = 116 * f[..., 1] - 16
    a = 500 * (f[..., 0] - f[..., 1])
    b = 200 * (f[..., 1] - f[..., 2])
    return np.stack([L, a, b], axis=-1)


def delta_e2000(lab1, lab2):
    L1, a1, b1 = np.moveaxis(np.asarray(lab1, dtype=np.float64), -1, 0)
    L2, a2, b2 = np.moveaxis(np.asarray(lab2, dtype=np.float64), -1, 0)
    C1 = np.hypot(a1, b1)
    C2 = np.hypot(a2, b2)
    Cb = (C1 + C2) / 2
    G = 0.5 * (1 - np.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = np.hypot(a1p, b1), np.hypot(a2p, b2)
    h1p = np.degrees(np.arctan2(b1, a1p)) % 360
    h2p = np.degrees(np.arctan2(b2, a2p)) % 360
    dLp = L2 - L1
    dCp = C2p - C1p
    dh = h2p - h1p
    dh = np.where(C1p * C2p == 0, 0, np.where(dh > 180, dh - 360, np.where(dh < -180, dh + 360, dh)))
    dHp = 2 * np.sqrt(C1p * C2p) * np.sin(np.radians(dh / 2))
    Lbp = (L1 + L2) / 2
    Cbp = (C1p + C2p) / 2
    hs = h1p + h2p
    hbp = np.where(C1p * C2p == 0, hs,
                   np.where(np.abs(h1p - h2p) <= 180, hs / 2,
                            np.where(hs < 360, (hs + 360) / 2, (hs - 360) / 2)))
    T = (1 - 0.17 * np.cos(np.radians(hbp - 30)) + 0.24 * np.cos(np.radians(2 * hbp))
         + 0.32 * np.cos(np.radians(3 * hbp + 6)) - 0.20 * np.cos(np.radians(4 * hbp - 63)))
    dtheta = 30 * np.exp(-(((hbp - 275) / 25) ** 2))
    Rc = 2 * np.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7))
    Sl = 1 + 0.015 * (Lbp - 50) ** 2 / np.sqrt(20 + (Lbp - 50) ** 2)
    Sc = 1 + 0.045 * Cbp
    Sh = 1 + 0.015 * Cbp * T
    Rt = -np.sin(np.radians(2 * dtheta)) * Rc
    return np.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh))


def hexcol(rgb):
    return "#%02x%02x%02x" % tuple(int(round(float(v))) for v in rgb)


def composite(rgba, bg):
    """Straight-alpha RGBA (0..255 floats) over an opaque sRGB background (browser-style, gamma space)."""
    a = rgba[..., 3:4] / 255.0
    return rgba[..., :3] * a + np.asarray(bg, dtype=np.float64) * (1 - a)


# ---------------------------------------------------------------- segmentation
SEED = {  # k-means centroids of opaque pixels (alpha >= 250), used only as seeds
    "yellow": (241, 196, 106),
    "teal": (60, 173, 166),
    "mint": (188, 235, 210),
    "salmon": (248, 142, 133),
    "nucleolus": (233, 100, 95),
}


def classify(rgba, seeds=SEED):
    """Nearest-seed label per pixel (alpha >= 128), halo pixels included."""
    names = list(seeds)
    C = np.array([seeds[n] for n in names], dtype=np.float64)
    d = ((rgba[..., None, :3] - C[None, None]) ** 2).sum(-1)
    lab = d.argmin(-1)
    lab[rgba[..., 3] < 128] = -1
    return names, lab


def region_masks(rgba):
    """Boolean masks for the six design regions (pixel-level, before erosion)."""
    names, lab = classify(rgba)
    idx = {n: i for i, n in enumerate(names)}
    teal = (lab == idx["teal"]).astype(np.uint8)
    n, cc, stats, _ = cv2.connectedComponentsWithStats(teal, connectivity=8)
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    ring = cc == big
    strokes = (teal > 0) & ~ring
    # keep only sizeable stroke components (drop halo specks)
    keep = np.zeros_like(strokes)
    for i in range(1, n):
        if i != big and stats[i, cv2.CC_STAT_AREA] > 200:
            keep |= cc == i
    return {
        "rays": lab == idx["yellow"],
        "ring": ring,
        "mint": lab == idx["mint"],
        "nucleus": lab == idx["salmon"],
        "nucleolus": lab == idx["nucleolus"],
        "strokes": keep,
    }


def clean_regions(masks):
    """Region masks without the 1 px sharpening halo: 3x3 opening, small specks dropped.

    The nucleolus keeps only its largest component (the red halo line around the
    nucleus has the nucleolus colour and would otherwise pull its centroid).
    """
    k = np.ones((3, 3), np.uint8)
    out = {}
    for name, m in masks.items():
        o = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, k)
        n, cc, st, _ = cv2.connectedComponentsWithStats(o, connectivity=8)
        if n <= 1:
            out[name] = o > 0
            continue
        if name == "nucleolus":
            out[name] = cc == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
        else:
            out[name] = np.isin(cc, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] >= 100])
    return out


def erode(mask, px):
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * px + 1, 2 * px + 1))
    return cv2.erode(mask.astype(np.uint8), k) > 0
