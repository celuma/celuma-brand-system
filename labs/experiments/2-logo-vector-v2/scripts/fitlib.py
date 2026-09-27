"""Curve-fitting library shared by the isotipo and wordmark vectorisers.

trace(): dense sub-pixel 0.5 iso-contours of a continuous "inside" field.
fit_shape(): closed cubic Bézier spline (Schneider seed + node insertion +
global least-squares refinement with smooth/corner nodes). See fit_vector.py.
"""
import math

import cv2
import numpy as np
from scipy import ndimage, optimize

UP = 8           # tracing upsample

# ------------------------------------------------------------------ contours
def trace(field, min_len=40, holes=False):
    """Dense sub-pixel 0.5 iso-contours in SVG user units (pixel edges at integers).

    holes=True also returns inner contours (letter counters)."""
    H, W = field.shape
    big = cv2.resize(field.astype(np.float32), (W * UP, H * UP), interpolation=cv2.INTER_LINEAR)
    binm = (big >= 0.5).astype(np.uint8)
    mode = cv2.RETR_LIST if holes else cv2.RETR_EXTERNAL
    cnts, hier = cv2.findContours(binm, mode, cv2.CHAIN_APPROX_NONE)
    out = []
    for c in cnts:
        c = c[:, 0, :].astype(np.float64)
        if len(c) < min_len * UP:
            continue
        # pixel-index coords of the original grid (pixel centres at integers)
        p = (c + 0.5) / UP - 0.5
        p = resample(p, 0.25)
        p = smooth_closed(p, 2.0)
        p = snap(field, p)
        out.append(p + 0.5)  # → SVG coords (pixel centre = i + 0.5)
    return out


def resample(p, step):
    q = np.vstack([p, p[:1]])
    seg = np.hypot(*np.diff(q, axis=0).T)
    s = np.r_[0, np.cumsum(seg)]
    n = max(int(s[-1] / step), 8)
    t = np.linspace(0, s[-1], n, endpoint=False)
    return np.stack([np.interp(t, s, q[:, 0]), np.interp(t, s, q[:, 1])], axis=1)


def smooth_closed(p, sigma):
    return np.stack([ndimage.gaussian_filter1d(p[:, i], sigma, mode="wrap") for i in range(2)], axis=1)


def normals(p):
    d = np.roll(p, -1, 0) - np.roll(p, 1, 0)
    n = np.stack([d[:, 1], -d[:, 0]], axis=1)
    return n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-9)


def snap(field, p):
    """Move each point along its normal to the exact 0.5 crossing (bilinear field)."""
    n = normals(p)
    ts = np.linspace(-1.2, 1.2, 49)
    pts = p[:, None, :] + ts[None, :, None] * n[:, None, :]
    v = ndimage.map_coordinates(field, [pts[..., 1].ravel(), pts[..., 0].ravel()], order=1, mode="nearest")
    v = v.reshape(pts.shape[:2]) - 0.5
    out = p.copy()
    for i in range(len(p)):
        s = np.sign(v[i])
        idx = np.nonzero(s[:-1] * s[1:] < 0)[0]
        if len(idx) == 0:
            continue
        j = idx[np.argmin(np.abs(ts[idx]))]
        t = ts[j] - v[i, j] * (ts[j + 1] - ts[j]) / (v[i, j + 1] - v[i, j])
        out[i] = p[i] + t * n[i]
    return smooth_closed(out, 1.0)


# ------------------------------------------------------------------ Bézier maths
def bez(P, t):
    t = np.asarray(t)[..., None]
    return ((1 - t) ** 3) * P[0] + 3 * ((1 - t) ** 2) * t * P[1] + 3 * (1 - t) * t * t * P[2] + t ** 3 * P[3]


def bez_d1(P, t):
    t = np.asarray(t)[..., None]
    return 3 * ((1 - t) ** 2) * (P[1] - P[0]) + 6 * (1 - t) * t * (P[2] - P[1]) + 3 * t * t * (P[3] - P[2])


def bez_d2(P, t):
    t = np.asarray(t)[..., None]
    return 6 * (1 - t) * (P[2] - 2 * P[1] + P[0]) + 6 * t * (P[3] - 2 * P[2] + P[1])


def newton(P, pts, u):
    d = bez(P, u) - pts
    d1 = bez_d1(P, u)
    d2 = bez_d2(P, u)
    num = (d * d1).sum(1)
    den = (d1 * d1 + d * d2).sum(1)
    safe = np.abs(den) > 1e-12
    step = np.divide(num, den, out=np.zeros_like(num), where=safe)
    return np.clip(u - step, 0, 1)


def gen_bezier(pts, u, t1, t2):
    p0, p3 = pts[0], pts[-1]
    A1 = (3 * (1 - u) ** 2 * u)[:, None] * t1
    A2 = (3 * (1 - u) * u ** 2)[:, None] * t2
    c00, c01, c11 = (A1 * A1).sum(), (A1 * A2).sum(), (A2 * A2).sum()
    tmp = pts - bez(np.array([p0, p0, p3, p3]), u)
    x0, x1 = (A1 * tmp).sum(), (A2 * tmp).sum()
    det = c00 * c11 - c01 * c01
    seg = np.linalg.norm(p3 - p0)
    if abs(det) > 1e-12:
        a1 = (x0 * c11 - x1 * c01) / det
        a2 = (c00 * x1 - c01 * x0) / det
    else:
        a1 = a2 = seg / 3
    if a1 < 1e-6 * seg or a2 < 1e-6 * seg:
        a1 = a2 = seg / 3
    return np.array([p0, p0 + a1 * t1, p3 + a2 * t2, p3])


def chord_u(pts):
    s = np.r_[0, np.cumsum(np.hypot(*np.diff(pts, axis=0).T))]
    return s / s[-1]


def fit_open(pts, t1, t2, err):
    if len(pts) <= 3:
        seg = np.linalg.norm(pts[-1] - pts[0]) / 3
        return [np.array([pts[0], pts[0] + seg * t1, pts[-1] + seg * t2, pts[-1]])]
    u = chord_u(pts)
    P = gen_bezier(pts, u, t1, t2)
    for _ in range(30):
        u = newton(P, pts, u)
        P = gen_bezier(pts, u, t1, t2)
    dist = np.linalg.norm(bez(P, u) - pts, axis=1)
    if dist.max() <= err:
        return [P]
    split = int(np.clip(np.argmax(dist), 2, len(pts) - 3))
    tc = pts[split - 2] - pts[split + 2]
    tc /= np.linalg.norm(tc)
    return fit_open(pts[:split + 1], t1, tc, err) + fit_open(pts[split:], -tc, t2, err)


def tangent_at(p, i, k=6):
    d = p[(i + k) % len(p)] - p[(i - k) % len(p)]
    return d / np.linalg.norm(d)


def fit_closed(p, err):
    # start at the point of maximum curvature: most natural node location
    curv = np.abs(np.cross(np.roll(p, -8, 0) - p, p - np.roll(p, 8, 0)))
    i0 = int(np.argmax(curv))
    q = np.vstack([np.roll(p, -i0, 0), np.roll(p, -i0, 0)[:1]])
    t = tangent_at(q[:-1], 0)
    return fit_open(q, t, -t, err)


# ------------------------------------------------------------------ global refinement
# A node is [x, y, theta_in, theta_out, handle_out, handle_in]. Smooth (G1) nodes
# share one angle; corner nodes keep two. Segment i runs node i -> node i+1.
def _dir(a):
    return np.array([math.cos(a), math.sin(a)])


def segs_to_nodes(segs):
    k = len(segs)
    N = np.zeros((k, 6))
    for i, P in enumerate(segs):
        prev = segs[(i - 1) % k]
        tin = prev[3] - prev[2]
        tout = P[1] - P[0]
        N[i, :2] = P[0]
        N[i, 2] = math.atan2(tin[1], tin[0])
        N[i, 3] = math.atan2(tout[1], tout[0])
        N[i, 4] = np.linalg.norm(tout)
        N[i, 5] = np.linalg.norm(tin)
    return N


def nodes_to_segs(N):
    k = len(N)
    return [np.array([N[i, :2], N[i, :2] + N[i, 4] * _dir(N[i, 3]),
                      N[(i + 1) % k, :2] - N[(i + 1) % k, 5] * _dir(N[(i + 1) % k, 2]), N[(i + 1) % k, :2]])
            for i in range(k)]


def pack(N, corner):
    x = []
    for i in range(len(N)):
        x += [N[i, 0], N[i, 1], N[i, 2], N[i, 4], N[i, 5]] + ([N[i, 3]] if corner[i] else [])
    return np.array(x)


def unpack(x, corner):
    k = len(corner)
    N = np.zeros((k, 6))
    j = 0
    for i in range(k):
        N[i, 0], N[i, 1], N[i, 2], N[i, 4], N[i, 5] = x[j:j + 5]
        N[i, 3] = x[j + 5] if corner[i] else x[j + 2]
        j += 6 if corner[i] else 5
    return N


def closest_on(segs, pts):
    """Nearest point on the spline: ~1 px coarse sampling, then guarded Newton steps."""
    best_d = np.full(len(pts), np.inf)
    best_s = np.zeros(len(pts), int)
    best_t = np.zeros(len(pts))
    for si, P in enumerate(segs):
        n = max(32, int(np.linalg.norm(np.diff(P, axis=0), axis=1).sum()))
        ts = np.linspace(0, 1, n)
        c = bez(P, ts)
        d = ((pts[:, None, :] - c[None]) ** 2).sum(-1)
        j = d.argmin(1)
        dm = d[np.arange(len(pts)), j]
        upd = dm < best_d
        best_d[upd], best_s[upd], best_t[upd] = dm[upd], si, ts[j[upd]]
    for si, P in enumerate(segs):
        m = best_s == si
        if m.any():
            u = best_t[m]
            q = pts[m]
            du = ((bez(P, u) - q) ** 2).sum(1)
            for _ in range(6):
                un = newton(P, q, u)
                dn = ((bez(P, un) - q) ** 2).sum(1)
                ok = dn < du
                u = np.where(ok, un, u)
                du = np.where(ok, dn, du)
            best_t[m] = u
    return best_s, best_t


def residuals(segs, pts):
    s, t = closest_on(segs, pts)
    q = np.empty_like(pts)
    for si in range(len(segs)):
        m = s == si
        if m.any():
            q[m] = bez(segs[si], t[m])
    return np.linalg.norm(q - pts, axis=1), s, t


def dist_to(segs, pts):
    return residuals(segs, pts)[0]


def refine(N, corner, pts, iters=4):
    from scipy.sparse import lil_matrix
    N = N.copy()
    N[:, 4:] = np.maximum(N[:, 4:], 0.1)
    for i in range(len(N)):
        if not corner[i]:  # smooth: average in/out angle
            N[i, 2] = N[i, 3] = math.atan2(math.sin(N[i, 2]) + math.sin(N[i, 3]), math.cos(N[i, 2]) + math.cos(N[i, 3]))
    k = len(N)
    offs = np.cumsum([0] + [6 if c else 5 for c in corner])
    for _ in range(iters):
        s_idx, t = closest_on(nodes_to_segs(N), pts)

        def resid(x):
            ss = nodes_to_segs(unpack(x, corner))
            r = np.empty((len(pts), 2))
            for si in range(k):
                m = s_idx == si
                if m.any():
                    r[m] = bez(ss[si], t[m]) - pts[m]
            return r.ravel()

        x0 = pack(N, corner)
        lo = np.full(len(x0), -np.inf)
        for i in range(k):
            lo[offs[i] + 3] = lo[offs[i] + 4] = 0.05
        sp = lil_matrix((2 * len(pts), len(x0)), dtype=np.int8)
        for j, si in enumerate(s_idx):
            for node in (si, (si + 1) % k):
                sp[2 * j:2 * j + 2, offs[node]:offs[node + 1]] = 1
        res = optimize.least_squares(resid, x0, bounds=(lo, np.full(len(x0), np.inf)), method="trf",
                                     x_scale="jac", max_nfev=60, jac_sparsity=sp)
        N = unpack(res.x, corner)
    return N


def split_node(N, corner, si, t):
    """Insert a node on segment si at parameter t (de Casteljau); the curve is unchanged."""
    segs = nodes_to_segs(N)
    P = segs[si]
    l = lambda a, b: a + (b - a) * t
    p01, p12, p23 = l(P[0], P[1]), l(P[1], P[2]), l(P[2], P[3])
    p012, p123 = l(p01, p12), l(p12, p23)
    m = l(p012, p123)
    k = len(N)
    j = (si + 1) % k
    N = N.copy()
    N[si, 4] = np.linalg.norm(p01 - P[0])
    N[j, 5] = np.linalg.norm(P[3] - p23)
    ang = math.atan2(*(p123 - p012)[::-1])
    new = np.array([m[0], m[1], ang, ang, np.linalg.norm(p123 - m), np.linalg.norm(m - p012)])
    N = np.insert(N, si + 1, new, axis=0)
    corner = corner[:si + 1] + [False] + corner[si + 1:]
    return N, corner, si + 1


MAX_TOL = 0.5     # px, stop when every contour sample is within this distance
RMS_TOL = 0.15    # px, and the RMS is at the raster noise floor
MAX_NODES = 40


def fit_shape(p, name):
    """Coarse Schneider seed, then insert nodes where the error is largest.

    Each step tries: a smooth node and a corner node at the worst sample, and a
    smooth node in the middle of the segment with the largest squared error.
    The candidate with the best (max, rms) is kept if it improves max by 3 % or
    rms by 5 %. Stops when max <= MAX_TOL and rms <= RMS_TOL, at MAX_NODES, or
    when nothing improves (raster noise floor).
    """
    pf = p[::2]  # 0.5 px spacing for the optimisation, full density for scoring
    segs = fit_closed(pf, 2.5)
    corner = [False] * len(segs)
    N = refine(segs_to_nodes(segs), corner, pf)
    d, s_idx, t = residuals(nodes_to_segs(N), pf)
    rms = lambda v: float(np.sqrt((v ** 2).mean()))
    history = [(len(N), float(d.max()), rms(d))]
    while (d.max() > MAX_TOL or rms(d) > RMS_TOL) and len(N) < MAX_NODES:
        w = int(np.argmax(d))
        sse = np.bincount(s_idx, weights=d ** 2, minlength=len(N))
        sw = int(np.argmax(sse))
        tw = float(np.median(t[s_idx == sw])) if (s_idx == sw).any() else 0.5
        trials = [(s_idx[w], t[w], False), (s_idx[w], t[w], True), (sw, tw, False)]
        best = None
        for si, ti, as_corner in trials:
            ti = min(max(ti, 0.05), 0.95)
            N2, c2, ni = split_node(N, corner, si, ti)
            c2[ni] = as_corner
            N2 = refine(N2, c2, pf, iters=3)
            d2, s2, t2 = residuals(nodes_to_segs(N2), pf)
            score = (float(d2.max()), rms(d2))
            if best is None or score[0] + 2 * score[1] < best[0][0] + 2 * best[0][1]:
                best = (score, N2, c2, d2, s2, t2)
        if not (best[0][0] < 0.97 * d.max() or best[0][1] < 0.95 * rms(d)):
            break
        _, N, corner, d, s_idx, t = best
        history.append((len(N), float(d.max()), rms(d)))
    Nf = refine(N, corner, pf, iters=5)
    dfull_f = dist_to(nodes_to_segs(Nf), p)
    dfull = dist_to(nodes_to_segs(N), p)
    if dfull_f.max() + 2 * rms(dfull_f) < dfull.max() + 2 * rms(dfull):
        N, dfull = Nf, dfull_f
    return nodes_to_segs(N), dfull, corner, history


# ------------------------------------------------------------------ primitives
def fit_circle(p):
    x, y = p[:, 0], p[:, 1]
    Am = np.stack([x, y, np.ones_like(x)], 1)
    b = x * x + y * y
    c, *_ = np.linalg.lstsq(Am, b, rcond=None)
    cx, cy = c[0] / 2, c[1] / 2
    r = math.sqrt(c[2] + cx * cx + cy * cy)

    def res(q):
        return np.hypot(x - q[0], y - q[1]) - q[2]

    q = optimize.least_squares(res, [cx, cy, r]).x
    d = np.abs(res(q))
    return q, d


def fit_capsule(p):
    """Stadium = all points at distance w/2 from a segment (round caps)."""
    mean = p.mean(0)
    u, s, vt = np.linalg.svd(p - mean)
    ax = vt[0]
    proj_ = (p - mean) @ ax
    half = (proj_.max() - proj_.min()) / 2
    x0 = np.r_[mean - ax * (half - 14), mean + ax * (half - 14), 15.0]

    def seg_dist(q):
        a, b, r = q[:2], q[2:4], q[4]
        ab = b - a
        t = np.clip(((p - a) @ ab) / (ab @ ab), 0, 1)
        return np.linalg.norm(p - (a + t[:, None] * ab), axis=1) - r

    q = optimize.least_squares(seg_dist, x0).x
    return q, np.abs(seg_dist(q))


def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def path_d(segs):
    d = f"M{fmt(segs[0][0][0])} {fmt(segs[0][0][1])}"
    for P in segs:
        d += f"C{fmt(P[1][0])} {fmt(P[1][1])} {fmt(P[2][0])} {fmt(P[2][1])} {fmt(P[3][0])} {fmt(P[3][1])}"
    return d + "Z"


