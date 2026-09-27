"""Minimal SVG path reader for the phase-1 geometry (absolute M L H V Q C Z, implicit repeats).

Every subpath is returned as a closed list of cubic segments ((p0, c1, c2, p3), ...), which is
what Lottie needs (vertices + relative in/out tangents). Q and L are converted to cubics exactly
(a line is a cubic with handles on the chord, a quadratic lifts to a cubic without approximation),
so the rendered outline is the same curve as the source path.
"""
import re

TOKEN = re.compile(r"[MLHVQCZmlhvqcz]|-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?")


def subpaths(d, matrix=None):
    """Parse `d` (absolute commands only) -> list of closed cubic subpaths.

    matrix = (a, b, c, d, e, f) as in SVG `matrix()`; applied to every point (and so to every
    control point, which is exact for affine maps).
    """
    toks = TOKEN.findall(d)
    i, cmd = 0, None
    out, cur, start, pen = [], [], None, None

    def num():
        nonlocal i
        v = float(toks[i])
        i += 1
        return v

    def close():
        nonlocal cur
        if cur:
            if abs(pen[0] - start[0]) > 1e-9 or abs(pen[1] - start[1]) > 1e-9:
                line(pen, start)
            out.append(cur)
            cur = []

    def line(a, b):
        cur.append((a, (a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3),
                    (a[0] + 2 * (b[0] - a[0]) / 3, a[1] + 2 * (b[1] - a[1]) / 3), b))

    while i < len(toks):
        t = toks[i]
        if t.isalpha():
            if t.islower():
                raise ValueError("relative commands are not used by the phase-1 files: " + t)
            cmd = t
            i += 1
            if cmd == "Z":
                close()
                pen = start
                continue
        # implicit repeat of the previous command (after M, repeats are L)
        if cmd == "M":
            if cur:
                close()
            start = pen = (num(), num())
            cmd = "L"
        elif cmd == "L":
            p = (num(), num())
            line(pen, p)
            pen = p
        elif cmd == "H":
            p = (num(), pen[1])
            line(pen, p)
            pen = p
        elif cmd == "V":
            p = (pen[0], num())
            line(pen, p)
            pen = p
        elif cmd == "Q":
            q = (num(), num())
            p = (num(), num())
            c1 = (pen[0] + 2 / 3 * (q[0] - pen[0]), pen[1] + 2 / 3 * (q[1] - pen[1]))
            c2 = (p[0] + 2 / 3 * (q[0] - p[0]), p[1] + 2 / 3 * (q[1] - p[1]))
            cur.append((pen, c1, c2, p))
            pen = p
        elif cmd == "C":
            c1 = (num(), num())
            c2 = (num(), num())
            p = (num(), num())
            cur.append((pen, c1, c2, p))
            pen = p
        else:
            raise ValueError("unexpected token " + t)
    close()
    if matrix:
        a, b, c, dd, e, f = matrix
        tf = lambda p: (a * p[0] + c * p[1] + e, b * p[0] + dd * p[1] + f)
        out = [[tuple(tf(p) for p in seg) for seg in sp] for sp in out]
    return out


def bbox(sp_list):
    xs = [p[0] for sp in sp_list for seg in sp for p in (seg[0], seg[3])]
    ys = [p[1] for sp in sp_list for seg in sp for p in (seg[0], seg[3])]
    return min(xs), min(ys), max(xs), max(ys)


def sample(sp, n_per_seg=24):
    """Points along one closed cubic subpath."""
    pts = []
    for p0, c1, c2, p3 in sp:
        for k in range(n_per_seg):
            t = k / n_per_seg
            mt = 1 - t
            pts.append((mt ** 3 * p0[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t ** 3 * p3[0],
                        mt ** 3 * p0[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t ** 3 * p3[1]))
    return pts
