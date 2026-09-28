"""Fase 3 · validate every motion variant with real players and build the review sheets.

Aprobado en el experimento 02 · incorporación pendiente. Same comparison classes as phase 2 (README-FASE2.md §5):
  E   pixel-identical RGBA to the reference render (identical share == 1.0)
  T1  lottie-web SVG: alpha IoU >= 0.9999, |d alpha| > 2/255 only inside the 1 px anti-alias band,
      flat-colour dE00 max <= 0.5
  T2  other rasterisers (lottie-web canvas, ThorVG) or CSS frames while animating: IoU >= 0.999,
      |d alpha| > 2/255 only in the AA band, flat dE00 mean <= 0.5 and max <= 1.0
References are Chromium renders of fase-3/estaticos/*.svg: the phase-1 master and lockup files with
only the canvas (viewBox/width/height) changed — checked textually below.

Usage: python3.10 validate.py <playersDir> <workDir>
  playersDir: lottie-web-5.13.0/package and lottiefiles-dotlottie-web-0.80.0/package unpacked
  workDir:    where the (large, regenerable) frame renders go — outside the repository
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
F3 = HERE.parent
EXP = F3.parent
sys.path.insert(0, str(EXP / "scripts"))
from celuma_img import delta_e2000, srgb_to_lab  # noqa: E402  (phase-1 colour maths, read-only reuse)

PLAYERS, WORK = sys.argv[1], Path(sys.argv[2])
WORK.mkdir(parents=True, exist_ok=True)
VAL = F3 / "validation"
spec = json.loads((VAL / "spec.json").read_text())
FPS = spec["fps"]
V = spec["variants"]
M = {"generated": time.strftime("%Y-%m-%d %H:%M"), "tolerances": {
    "E": "identical RGBA share == 1.0 vs reference render",
    "T1": "lottie-web SVG: IoU>=0.9999, |da|>2/255 only in 1px AA band, flat dE00 max<=0.5",
    "T2": "canvas/ThorVG/CSS mid-animation: IoU>=0.999, |da|>2/255 only in 1px AA band, flat dE00 mean<=0.5 max<=1.0"}}
BG = {"crema": (251, 246, 236), "blanco": (255, 255, 255), "navy": (13, 27, 42)}


def run(jobs, tag):
    p = WORK / f"_jobs-{tag}.json"
    p.write_text(json.dumps(jobs))
    rep = WORK / f"_report-{tag}.json"
    subprocess.run(["node", str(HERE / "render.mjs"), str(p), PLAYERS, str(rep)], check=True, cwd=HERE,
                   stdout=subprocess.DEVNULL)
    r = json.loads(rep.read_text())
    errs = [x for x in r if x["errors"]]
    assert not errs, errs
    return r


def load(p):
    return np.asarray(Image.open(p).convert("RGBA")).astype(np.float64)


# ------------------------------------------------------------------ references
# 1) statics are the phase-1 files re-boxed: only the root <svg> attributes may differ
LOCK_SRC = {"a": EXP / "svg/lockups/propuesta-a-baloo2", "b": EXP / "svg/lockups/propuesta-b-notion-v2"}
ORI = {"h": "horizontal", "v": "vertical"}
POL = {"pos": "color-positivo", "neg": "color-negativo"}
strip_root = lambda t: re.sub(r'viewBox="[^"]*" width="[^"]*" height="[^"]*"', "", t, count=1)
M["statics_textual"] = {}
for subj in spec["boxes"]:
    if subj == "iso":
        src, dst = EXP / "master/celuma-isotipo-maestro-paleta-aprobada.svg", F3 / "estaticos/isotipo.svg"  # active master
    else:
        o, r, p = subj.split("-")
        src = LOCK_SRC[o] / f"celuma-lockup-{ORI[r]}-{POL[p]}.svg"
        dst = F3 / f"estaticos/lockup-{o}-{ORI[r]}-{POL[p]}.svg"
    M["statics_textual"][subj] = {"source": str(src.relative_to(EXP)), "static": str(dst.relative_to(F3)),
                                  "identical_except_canvas": strip_root(src.read_text()) == strip_root(dst.read_text())}
assert all(v["identical_except_canvas"] for v in M["statics_textual"].values())

# 2) "sin luz" references (first frame of the Luz one-shot): no rays, and no accent on the é
REFS = WORK / "refs"
REFS.mkdir(exist_ok=True)
sys.path.insert(0, str(HERE))
import fase3  # noqa: E402  (same geometry the generator used)


def sin_luz(subj, txt=None):
    txt = txt or (F3 / ("estaticos/isotipo.svg" if subj == "iso" else
                        "estaticos/lockup-{}-{}-{}.svg".format(subj[0], ORI[subj[2]], POL[subj.split('-')[2]]))).read_text()
    txt = re.sub(r'\s*<g id="rayos".*?</g>', "", txt, count=1, flags=re.S)
    if subj != "iso":
        o = subj[0]
        m = re.search(r'(<path id="wordmark"[^>]* d=")([^"]+)(")', txt)
        d = m.group(2)
        if o == "a":
            subs = re.findall(r"M[^M]*", d)
            keep = [s_ for s_ in subs if not all(float(y) < -520 for y in re.findall(r"-?\d+(?:\.\d+)?", s_)[1::2])]
            assert len(keep) == len(subs) - 1
            nd = "".join(keep)
        else:
            acc = dict(fase3.B_IDS)["b-acento"]
            assert acc in d
            nd = d.replace(" " + acc, "")
        txt = txt[:m.start(2)] + nd + txt[m.end(2):]
    return txt


ref_jobs = []
for subj, box in spec["boxes"].items():
    w, h = box[2], box[3]
    src = "estaticos/isotipo.svg" if subj == "iso" else "estaticos/lockup-{}-{}-{}.svg".format(subj[0], ORI[subj[2]], POL[subj.split('-')[2]])
    ref_jobs.append({"name": f"ref-{subj}", "renderer": "svg", "src": src, "frames": ["initial"], "outDir": str(REFS / subj), "w": w, "h": h})
    (WORK / f"_sinluz-{subj}.svg").write_text(sin_luz(subj))
    tmp = F3 / "validation" / f"_sinluz-{subj}.svg"
    tmp.write_text(sin_luz(subj))
    ref_jobs.append({"name": f"ref-sinluz-{subj}", "renderer": "svg", "src": f"validation/_sinluz-{subj}.svg", "frames": ["initial"],
                     "outDir": str(REFS / f"sinluz-{subj}"), "w": w, "h": h})
# 3) "cubic twin" of every A lockup: the same file with Baloo's quadratic curves written as the
#    equivalent cubics (exact degree elevation, same transform). Lottie only has cubics, so this is
#    the reference that isolates geometry from how Chromium tessellates Q vs C curves.
from svgpath import subpaths  # noqa: E402


def cubic_twin(txt):
    m = re.search(r'(<path id="wordmark"[^>]* d=")([^"]+)(")', txt)
    out = []
    for sp in subpaths(m.group(2)):
        out.append("M%r %r" % sp[0][0] + "".join("C%r %r %r %r %r %r" % (*c1, *c2, *p3) for _, c1, c2, p3 in sp) + "Z")
    return txt[:m.start(2)] + "".join(out) + txt[m.end(2):]


for subj, box in spec["boxes"].items():
    if not subj.startswith("a-"):
        continue
    src = "estaticos/lockup-{}-{}-{}.svg".format(subj[0], ORI[subj[2]], POL[subj.split('-')[2]])
    twin = cubic_twin((F3 / src).read_text())
    (F3 / "validation" / f"_cubic-{subj}.svg").write_text(twin)
    (F3 / "validation" / f"_cubic-sinluz-{subj}.svg").write_text(sin_luz(subj, twin))
    ref_jobs.append({"name": f"ref-cubic-{subj}", "renderer": "svg", "src": f"validation/_cubic-{subj}.svg", "frames": ["initial"],
                     "outDir": str(REFS / f"cubic-{subj}"), "w": box[2], "h": box[3]})
    ref_jobs.append({"name": f"ref-cubic-sinluz-{subj}", "renderer": "svg", "src": f"validation/_cubic-sinluz-{subj}.svg", "frames": ["initial"],
                     "outDir": str(REFS / f"cubic-sinluz-{subj}"), "w": box[2], "h": box[3]})
for subj in ("iso", "a-h-pos", "b-h-pos"):
    box = spec["boxes"][subj]
    src = "estaticos/isotipo.svg" if subj == "iso" else f"estaticos/lockup-{subj[0]}-horizontal-color-positivo.svg"
    ref_jobs.append({"name": f"ref2x-{subj}", "renderer": "svg", "src": src, "frames": ["initial"], "outDir": str(REFS / f"2x-{subj}"),
                     "w": box[2], "h": box[3], "dpr": 2})
ref_jobs.append({"name": "ref2x-cubic-a-h-pos", "renderer": "svg", "src": "validation/_cubic-a-h-pos.svg", "frames": ["initial"],
                 "outDir": str(REFS / "2x-cubic-a-h-pos"), "w": spec["boxes"]["a-h-pos"][2], "h": spec["boxes"]["a-h-pos"][3], "dpr": 2})
t0 = time.time()
run(ref_jobs, "refs")
for f in list((F3 / "validation").glob("_sinluz-*.svg")) + list((F3 / "validation").glob("_cubic-*.svg")):  # includes _cubic-sinluz-*
    f.unlink()
REF = lambda subj, kind="": load(REFS / (f"{kind}{subj}" if kind else subj) / "initial.png")


def flat_mask(b):
    k = np.ones((5, 5), np.uint8)
    same = np.ones(b.shape[:2], bool)
    for c in range(4):
        ch = b[..., c].astype(np.uint8)
        same &= cv2.dilate(ch, k) == cv2.erode(ch, k)
    return same & (b[..., 3] == 255)


def compare(a, b, tol):
    ma, mb = a[..., 3] >= 128, b[..., 3] >= 128
    da = np.abs(a[..., 3] - b[..., 3])
    edge = np.zeros(b.shape[:2], bool)
    for c in range(4):
        ch = b[..., c].astype(np.uint8)
        edge |= cv2.dilate(ch, np.ones((3, 3), np.uint8)) != cv2.erode(ch, np.ones((3, 3), np.uint8))
    band = cv2.dilate(edge.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    flat = flat_mask(b) & (a[..., 3] == 255)
    de = delta_e2000(srgb_to_lab(a[..., :3][flat]), srgb_to_lab(b[..., :3][flat])) if flat.any() else np.zeros(1)
    out = {"iou": round(float((ma & mb).sum() / max((ma | mb).sum(), 1)), 6),
           "identical_rgba_share": round(float((np.abs(a - b).max(-1) == 0).mean()), 6),
           "alpha_max_diff": int(da.max()), "px_alpha_diff_gt2_outside_aa": int(((da > 2) & ~band).sum()),
           "max_abs_diff": int(np.abs(a - b).max()), "px_differing": int((np.abs(a - b).max(-1) > 0).sum()),
           "flat_de00_mean": round(float(de.mean()), 4), "flat_de00_max": round(float(de.max()), 4), "tolerance": tol}
    # band criterion: every alpha difference > 2/255 lies in the 1 px anti-alias band and flat colours match
    out["band_ok"] = out["px_alpha_diff_gt2_outside_aa"] == 0 and out["flat_de00_max"] <= 1.0
    if tol == "E":
        out["pass"] = out["identical_rgba_share"] == 1.0
    elif tol == "T1":
        out["pass"] = out["identical_rgba_share"] == 1.0 or (
            out["iou"] >= 0.9999 and out["px_alpha_diff_gt2_outside_aa"] == 0 and out["flat_de00_max"] <= 0.5)
    else:
        out["pass"] = (out["iou"] >= 0.999 and out["px_alpha_diff_gt2_outside_aa"] == 0 and
                       out["flat_de00_mean"] <= 0.5 and out["flat_de00_max"] <= 1.0)
    return out


# ------------------------------------------------------------------ player renders
R = WORK / "renders"
key_dir = lambda k: k.replace("|", "_")
jobs = []
for k, v in V.items():
    w, h = v["box"][2], v["box"][3]
    last = v["op"] - 1
    jobs.append({"name": f"{k}/svg-ends", "renderer": "lottie-svg", "src": v["file"], "frames": [0, last],
                 "outDir": str(R / key_dir(k) / "svg"), "w": w, "h": h, "fresh": True})
    if v["subject"] in ("iso", "a-h-pos", "b-h-pos"):
        for r in ("lottie-canvas", "thorvg"):
            jobs.append({"name": f"{k}/{r}", "renderer": r, "src": v["file"], "frames": [0, last],
                         "outDir": str(R / key_dir(k) / r), "w": w, "h": h, "fresh": True})
        jobs.append({"name": f"{k}/svg-2x", "renderer": "lottie-svg", "src": v["file"], "frames": [last],
                     "outDir": str(R / key_dir(k) / "svg-2x"), "w": w, "h": h, "dpr": 2, "fresh": True})
    if v["subject"] == "iso" or v["subject"].endswith("pos"):
        # every frame, half size, fresh player DOM: invariants (border, jumps, flashes)
        jobs.append({"name": f"{k}/all", "renderer": "lottie-svg", "src": v["file"], "frames": list(range(v["op"])),
                     "outDir": str(R / key_dir(k) / "all"), "w": round(w / 2), "h": round(h / 2), "fresh": True})
    if v.get("css_svg"):
        dips = [m[1] for m in v["markers"]]
        fr = sorted(set([0, 20, 30, 40, 50, 60, 70, 80, last] + dips))
        jobs.append({"name": f"{k}/css", "renderer": "css-svg", "src": v["css_svg"], "frames": fr + [v["op"]],
                     "outDir": str(R / key_dir(k) / "css"), "w": w, "h": h, "computed": True})
        jobs.append({"name": f"{k}/svg-css-frames", "renderer": "lottie-svg", "src": v["file"], "frames": fr,
                     "outDir": str(R / key_dir(k) / "svg"), "w": w, "h": h, "fresh": True})
        jobs.append({"name": f"{k}/css-reduced", "renderer": "css-svg", "src": v["css_svg"], "frames": ["initial"],
                     "outDir": str(R / key_dir(k) / "css-reduced"), "w": w, "h": h, "reduced": True, "computed": True})
        jobs.append({"name": f"{k}/img-reduced", "renderer": "img-svg", "src": v["css_svg"], "frames": [300, 700],
                     "outDir": str(R / key_dir(k) / "img-reduced"), "w": w, "h": h, "reduced": True})
report = run(jobs, "players")
M["render_seconds"] = round(time.time() - t0, 1)
rep = {r["name"]: r for r in report}


def frame(k, r, f):
    return load(R / key_dir(k) / r / (f"f{f:04d}.png" if isinstance(f, int) else f"{f}.png"))


TOL = {"svg": "T1", "lottie-canvas": "T2", "thorvg": "T2", "css": "T2"}
M["first_last"], M["loop_continuity"] = {}, {}
for k, v in V.items():
    subj, last = v["subject"], v["op"] - 1
    for r in ("svg", "lottie-canvas", "thorvg"):
        if not (R / key_dir(k) / r / f"f{last:04d}.png").exists():
            continue
        a0, a1 = frame(k, r, 0), frame(k, r, last)
        res = {"last": compare(a1, REF(subj), TOL[r])}
        if v["first_expect"] == "master":
            res["first"] = compare(a0, REF(subj), TOL[r])
        elif v["first_expect"] == "sin-luz":
            res["first"] = compare(a0, REF(subj, "sinluz-"), TOL[r])
        else:
            res["first"] = {"alpha_max": int(a0[..., 3].max()), "pass": int(a0[..., 3].max()) == 0, "tolerance": "vacío (alfa 0)"}
        if subj.startswith("a-") and r == "svg":
            # geometry check: Lottie (cubics) vs the cubic twin of the phase-1 file
            res["last_vs_cubic_twin"] = compare(a1, REF(subj, "cubic-"), "T1")
            if v["first_expect"] == "master":
                res["first_vs_cubic_twin"] = compare(a0, REF(subj, "cubic-"), "T1")
            elif v["first_expect"] == "sin-luz":
                res["first_vs_cubic_twin"] = compare(a0, REF(subj, "cubic-sinluz-"), "T1")
        M["first_last"][f"{k}/{r}"] = res
        if v["mode"] == "loop":
            M["loop_continuity"][f"{k}/{r}"] = {"identical_rgba_share": round(float((np.abs(a1 - a0).max(-1) == 0).mean()), 6),
                                               "max_abs": int(np.abs(a1 - a0).max())}
    if (R / key_dir(k) / "svg-2x" / f"f{last:04d}.png").exists():
        M["first_last"][f"{k}/svg@2x"] = {"last": compare(frame(k, "svg-2x", last), REF(subj, "2x-"), "T1")}
        if subj.startswith("a-"):
            M["first_last"][f"{k}/svg@2x"]["last_vs_cubic_twin"] = compare(frame(k, "svg-2x", last), REF(subj, "2x-cubic-"), "T1")

# ------------------------------------------------------------------ every frame (half size)
M["every_frame"] = {}
for k, v in V.items():
    d = R / key_dir(k) / "all"
    if not d.exists():
        continue
    prev, border, jumps, cov = None, 0, [], []
    for f in range(v["op"]):
        a = load(d / f"f{f:04d}.png")
        al = a[..., 3]
        border = max(border, int(max(al[0].max(), al[-1].max(), al[:, 0].max(), al[:, -1].max())))
        cov.append(float((al > 127).mean()))
        if prev is not None:
            # share of pixels whose composite on crema changes by more than 1/3 of the range in one frame
            ca = a[..., :3] * (al[..., None] / 255) + np.array(BG["crema"]) * (1 - al[..., None] / 255)
            cp = prev[..., :3] * (prev[..., 3:4] / 255) + np.array(BG["crema"]) * (1 - prev[..., 3:4] / 255)
            jumps.append(float((np.abs(ca - cp).max(-1) > 85).mean()))
        prev = a
    content = max(cov) or 1
    j = np.array(jumps)
    M["every_frame"][k] = {"frames": v["op"], "border_alpha_max": border,
                           "max_changed_share_per_frame": round(float(j.max()), 5),
                           "max_changed_share_of_logo": round(float(j.max() / content), 4),
                           "frame_of_max_change": int(j.argmax()) + 1,
                           "loop_wrap_changed_share": None}
    if v["mode"] == "loop":
        a, b = load(d / f"f{v['op'] - 1:04d}.png"), load(d / "f0000.png")
        M["every_frame"][k]["loop_wrap_changed_share"] = round(float((np.abs(a - b).max(-1) > 0).mean()), 6)

# ------------------------------------------------------------------ CSS loader: parity with Lottie, reduced motion
M["css"] = {}
for k, v in V.items():
    if not v.get("css_svg"):
        continue
    last = v["op"] - 1
    fr = sorted(set([0, 20, 30, 40, 50, 60, 70, 80, last] + [m[1] for m in v["markers"]]))
    par = {f: compare(frame(k, "css", f), frame(k, "svg", f), "T2") for f in fr}
    # A: CSS draws Baloo's Q curves, Lottie their cubic twin -> compare shapes by the band criterion only
    css_rep = rep[f"{k}/css"]
    red = rep[f"{k}/css-reduced"]
    img_a, img_b = frame(k, "img-reduced", "t00300"), frame(k, "img-reduced", "t00700")
    M["css"][k] = {
        "file": v["css_svg"], "bytes": (F3 / v["css_svg"]).stat().st_size, "animations": css_rep["animations"],
        # frame 0 is the master geometry, but with animations attached Chromium rasterises the whole SVG with
        # slightly different anti-aliasing (the difference covers every edge, not only the rays): T2, as phase 2
        "first_vs_static": compare(frame(k, "css", 0), REF(v["subject"], "cubic-" if v["subject"].startswith("a-") else ""), "T2"),
        "wrap_(t=duration)_vs_first": compare(frame(k, "css", v["op"]), frame(k, "css", 0), "E"),
        "parity_with_lottie_worst": min(par.values(), key=lambda x: x["iou"]),
        "parity_all_pass": all(x["pass"] for x in par.values()),
        "reduced_inline_vs_static": compare(frame(k, "css-reduced", "initial"), REF(v["subject"]), "E"),
        "reduced_inline_computed": red.get("computed"),
        "reduced_as_img_still_animates": bool(np.abs(img_a - img_b).max() > 0),
    }

# ------------------------------------------------------------------ summary
fl = M["first_last"]


def entry_ok(x):
    last_ok = x["last"]["pass"] or x.get("last_vs_cubic_twin", {}).get("pass", False)
    first = x.get("first", {"pass": True})
    first_ok = first["pass"] or x.get("first_vs_cubic_twin", {}).get("pass", False)
    return last_ok and first_ok


svg_last = {k: x for k, x in fl.items() if k.endswith("/svg") or k.endswith("/svg@2x")}
others = {k: x for k, x in fl.items() if k.endswith("/lottie-canvas") or k.endswith("/thorvg")}
M["classes"] = {
    "lottie_svg_last_identical": sorted(k for k, x in svg_last.items() if x["last"]["identical_rgba_share"] == 1.0),
    "lottie_svg_last_identical_to_cubic_twin": sorted(k for k, x in svg_last.items() if x.get("last_vs_cubic_twin", {}).get("identical_rgba_share") == 1.0),
    "lottie_svg_last_T1_only": sorted(k for k, x in svg_last.items() if x["last"]["identical_rgba_share"] < 1.0 and
                                      x.get("last_vs_cubic_twin", {}).get("identical_rgba_share", 0) < 1.0),
    "other_players_band_ok": all(x["last"]["band_ok"] and x.get("first", {}).get("band_ok", True) for x in others.values()),
    "other_players_T2_iou_below_0999": sorted(k for k, x in others.items() if x["last"]["iou"] < 0.999),
    "other_players_iou_min": min(x["last"]["iou"] for x in others.values()),
    "other_players_de00_max": max(x["last"]["flat_de00_max"] for x in others.values()),
}


M["summary"] = {
    "variants": len(V),
    "lottie_svg_last_identical": sum(1 for k in fl if k.endswith("/svg") and fl[k]["last"]["identical_rgba_share"] == 1.0),
    "lottie_svg_last_total": sum(1 for k in fl if k.endswith("/svg")),
    "all_first_last_pass": all(entry_ok(x) for x in fl.values()),
    "failing_strict": [k for k, x in fl.items() if not entry_ok(x)],
    "failing_band_criterion": [k for k, x in fl.items() if not (x["last"].get("band_ok", True) and x.get("first", {}).get("band_ok", True))],
    "lottie_svg_last_identical_or_cubic_twin": sum(1 for k in fl if k.endswith("/svg") and (fl[k]["last"]["identical_rgba_share"] == 1.0 or
                                                   fl[k].get("last_vs_cubic_twin", {}).get("identical_rgba_share") == 1.0)),
    "a_lockups_last_identical_to_cubic_twin": all(x["last_vs_cubic_twin"]["pass"] for x in fl.values() if "last_vs_cubic_twin" in x),
    "loops_close": all(x["identical_rgba_share"] == 1.0 for x in M["loop_continuity"].values()),
    "border_alpha_max_any_frame": max(x["border_alpha_max"] for x in M["every_frame"].values()),
    "css_all_ok": all(x["first_vs_static"]["band_ok"] and x["reduced_inline_vs_static"]["pass"] and x["wrap_(t=duration)_vs_first"]["pass"]
                      for x in M["css"].values()),
}
(VAL / "metrics.json").write_text(json.dumps(M, indent=1, ensure_ascii=False))
(VAL / "metrics.js").write_text("window.F3_METRICS = " + json.dumps(M, ensure_ascii=False) + ";\n")
print(json.dumps(M["summary"], indent=1, ensure_ascii=False))
print("render s", M["render_seconds"])
