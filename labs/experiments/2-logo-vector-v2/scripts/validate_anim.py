"""Phase 2 · validate the animation with real players and build the review sheets.

Players (anim_render.mjs, headless Chromium via Playwright):
  lottie-svg / lottie-canvas  lottie-web 5.13.0
  thorvg                      @lottiefiles/dotlottie-web 0.80.0 (ThorVG engine, WASM)
  css-svg / img-svg / picture-svg   anim/*.svg (CSS keyframes) inline, as <img>, and in a <picture>
Reference: anim/celuma-isotipo-maestro-caja-anim.svg (the active master, same paths and colours, in the
animation box) rasterised by Chromium, and the same without #rayos.

Comparison classes (declared tolerances; README-FASE2.md §5):
  E   static end state (CSS animation finished, <picture> fallback, reduced motion):
      pixel-identical to the master render (identical RGBA share == 1.0)
  T1  Lottie frame drawn by lottie-web's SVG renderer (same rasteriser, different DOM):
      alpha IoU >= 0.9999, |d alpha| > 2/255 only inside the 1 px anti-alias band,
      flat-colour dE00 max <= 0.5
  T2  other rasterisers or CSS frames while animating (lottie-canvas, ThorVG, seeked CSS):
      alpha IoU >= 0.999, |d alpha| > 2/255 only inside the 1 px anti-alias band,
      flat-colour dE00 mean <= 0.5 and max <= 1.0
"Flat colour" = pixels whose 5x5 neighbourhood in the reference is one opaque colour (no edges).
Every Lottie frame is drawn in a fresh player DOM: sequential screenshots on one page showed
Chromium partial-repaint noise (up to 255 on isolated edge pixels) that is not in the animation.
Usage: python3.10 validate_anim.py <playersDir>
"""
import json
import re
import subprocess
import sys
import time

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from celuma_img import EXP, composite, delta_e2000, srgb_to_lab

PLAYERS = sys.argv[1]
VAL = EXP / "validation"
A = VAL / "anim"
R = A / "renders"
A.mkdir(parents=True, exist_ok=True)
spec = json.loads((VAL / "anim-spec.json").read_text())
FPS = spec["fps"]
BX, BY, W, H = spec["box"]
W, H = int(W), int(H)
OP = {"once": spec["once"]["op"], "loop": spec["loop"]["op"]}
MK = {v: dict((m[0], m[1]) for m in spec[v]["spec"]["markers"]) for v in ("once", "loop")}
M = {"tolerances": {
    "E": "static end state: identical RGBA share == 1.0 vs master render",
    "T1": "lottie-web SVG: IoU>=0.9999, |da|>2/255 only in 1px AA band, flat dE00 max<=0.5",
    "T2": "canvas/ThorVG/CSS mid-animation: IoU>=0.999, |da|>2/255 only in 1px AA band, flat dE00 mean<=0.5 max<=1.0"}}

# ------------------------------------------------------------------ references
MASTER_BOX = EXP / "anim" / "celuma-isotipo-maestro-caja-anim.svg"
(A / "_ref-sin-rayos.svg").write_text(re.sub(r'  <g id="rayos".*?</g>\n', "", MASTER_BOX.read_text(), flags=re.S))
ref_jobs = [
    {"kind": "svg", "src": str(MASTER_BOX), "out": str(A / "ref-maestro.png"), "width": W, "height": H},
    {"kind": "svg", "src": str(A / "_ref-sin-rayos.svg"), "out": str(A / "ref-maestro-sin-rayos.png"), "width": W, "height": H},
    {"kind": "svg", "src": str(MASTER_BOX), "out": str(A / "ref-maestro-2x.png"), "width": W, "height": H, "dpr": 2},
]
(A / "_ref-jobs.json").write_text(json.dumps(ref_jobs))
subprocess.run(["node", str(EXP / "scripts/render.mjs"), str(A / "_ref-jobs.json")], check=True, cwd=EXP / "scripts")

# ------------------------------------------------------------------ player renders
jobs = []
for v in ("once", "loop"):
    src = f"anim/celuma-isotipo-{v}.json"
    ray = MK[v]["rayos"]
    sample = sorted(set([0, OP[v] - 1, ray + 6, ray + 10, ray + 14] + list(MK[v].values())))
    jobs.append({"name": f"{v}-lottie-svg-all", "renderer": "lottie-svg", "src": src, "frames": list(range(OP[v])),
                 "outDir": str(R / v / "lottie-svg"), "w": W, "h": H, "fresh": True})
    jobs.append({"name": f"{v}-lottie-canvas", "renderer": "lottie-canvas", "src": src, "frames": sample,
                 "outDir": str(R / v / "lottie-canvas"), "w": W, "h": H, "fresh": True})
    jobs.append({"name": f"{v}-thorvg", "renderer": "thorvg", "src": src, "frames": sample, "outDir": str(R / v / "thorvg"), "w": W, "h": H})
    jobs.append({"name": f"{v}-css-svg", "renderer": "css-svg", "src": f"anim/celuma-isotipo-{v}.svg",
                 "frames": sample + (["finished"] if v == "once" else []), "outDir": str(R / v / "css-svg"), "w": W, "h": H,
                 "computed": v == "once"})
    jobs.append({"name": f"{v}-lottie-svg-2x", "renderer": "lottie-svg", "src": src, "frames": [0, OP[v] - 1],
                 "outDir": str(R / v / "lottie-svg-2x"), "w": W, "h": H, "dpr": 2, "fresh": True})
    for n in (32, 48, 64, 128):
        jobs.append({"name": f"{v}-lottie-svg-h{n}", "renderer": "lottie-svg", "src": src, "frames": sample,
                     "outDir": str(R / v / f"lottie-svg-h{n}"), "w": round(n * W / H), "h": n, "fresh": True})
# reduced motion (Playwright emulates prefers-reduced-motion: reduce)
jobs += [
    {"name": "once-css-inline-reduced", "renderer": "css-svg", "src": "anim/celuma-isotipo-once.svg", "frames": ["initial"],
     "outDir": str(R / "reduced/css-inline"), "w": W, "h": H, "reduced": True, "computed": True},
    {"name": "once-img-reduced", "renderer": "img-svg", "src": "anim/celuma-isotipo-once.svg", "frames": [60, 1500],
     "outDir": str(R / "reduced/img-once"), "w": W, "h": H, "reduced": True},
    {"name": "once-picture-reduced", "renderer": "picture-svg", "src": "anim/celuma-isotipo-once.svg",
     "still": "anim/celuma-isotipo-maestro-caja-anim.svg", "frames": [60, 1500], "outDir": str(R / "reduced/picture-once"),
     "w": W, "h": H, "reduced": True},
    {"name": "once-picture-normal", "renderer": "picture-svg", "src": "anim/celuma-isotipo-once.svg",
     "still": "anim/celuma-isotipo-maestro-caja-anim.svg", "frames": [60, 4000], "outDir": str(R / "picture-once"), "w": W, "h": H},
]
# performance: every frame seeked 3x without screenshots, plus real-time playback (rAF deltas)
for v in ("once", "loop"):
    for r in ("lottie-svg", "lottie-canvas"):
        jobs.append({"name": f"{v}-{r}-perf", "renderer": r, "src": f"anim/celuma-isotipo-{v}.json",
                     "frames": list(range(OP[v])) * 3, "outDir": str(R / "_perf"), "w": W, "h": H, "noShots": True, "playback": True})
(A / "_jobs.json").write_text(json.dumps(jobs))
t0 = time.time()
subprocess.run(["node", str(EXP / "scripts/anim_render.mjs"), str(A / "_jobs.json"), PLAYERS], check=True, cwd=EXP / "scripts")
M["render_seconds"] = round(time.time() - t0, 1)
report = json.loads((A / "_render-report.json").read_text())


def load(p):
    return np.asarray(Image.open(p).convert("RGBA")).astype(np.float64)


def fr(v, r, f):
    return load(R / v / r / f"f{f:04d}.png")


ref, ref_nr, ref2 = load(A / "ref-maestro.png"), load(A / "ref-maestro-sin-rayos.png"), load(A / "ref-maestro-2x.png")


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
    for c in range(4):   # any colour/alpha edge in the reference, grown by 1 px = AA band
        ch = b[..., c].astype(np.uint8)
        edge |= cv2.dilate(ch, np.ones((3, 3), np.uint8)) != cv2.erode(ch, np.ones((3, 3), np.uint8))
    band = cv2.dilate(edge.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    flat = flat_mask(b) & (a[..., 3] == 255)
    de = delta_e2000(srgb_to_lab(a[..., :3][flat]), srgb_to_lab(b[..., :3][flat])) if flat.any() else np.zeros(1)
    out = {"iou": round(float((ma & mb).sum() / max((ma | mb).sum(), 1)), 6),
           "alpha_max_diff": int(da.max()), "px_alpha_diff_gt2": int((da > 2).sum()),
           "px_alpha_diff_gt2_outside_aa": int(((da > 2) & ~band).sum()),
           "flat_de00_mean": round(float(de.mean()), 4), "flat_de00_max": round(float(de.max()), 4),
           "flat_pixels": int(flat.sum()),
           "identical_rgba_share": round(float((np.abs(a - b).max(-1) == 0).mean()), 6), "tolerance": tol}
    if tol == "E":
        out["pass"] = out["identical_rgba_share"] == 1.0
    elif tol == "T1":
        out["pass"] = out["iou"] >= 0.9999 and out["px_alpha_diff_gt2_outside_aa"] == 0 and out["flat_de00_max"] <= 0.5
    else:
        out["pass"] = (out["iou"] >= 0.999 and out["px_alpha_diff_gt2_outside_aa"] == 0 and
                       out["flat_de00_mean"] <= 0.5 and out["flat_de00_max"] <= 1.0)
    return out


TOL = {"lottie-svg": "T1", "lottie-canvas": "T2", "thorvg": "T2", "css-svg": "T2"}
M["first_last"] = {}
for v in ("once", "loop"):
    last = OP[v] - 1
    for r in ("lottie-svg", "lottie-canvas", "thorvg", "css-svg"):
        M["first_last"][f"{v}/{r}/first"] = compare(fr(v, r, 0), ref_nr if v == "once" else ref, TOL[r])
        M["first_last"][f"{v}/{r}/last"] = compare(fr(v, r, last), ref, TOL[r])
    M["first_last"][f"{v}/lottie-svg@2x/last"] = compare(load(R / v / "lottie-svg-2x" / f"f{last:04d}.png"), ref2, "T1")
M["first_last"]["once/css-svg/finished"] = compare(load(R / "once/css-svg/finished.png"), ref, "E")
M["first_last"]["once/picture(no reduced)/after-4s"] = compare(load(R / "picture-once/t04000.png"), ref, "E")

# loop closes on itself: last frame == first frame for every player
M["loop_continuity"] = {}
for r in ("lottie-svg", "lottie-canvas", "thorvg"):
    a, b = fr("loop", r, OP["loop"] - 1), fr("loop", r, 0)
    M["loop_continuity"][r] = {"identical_rgba_share": round(float((np.abs(a - b).max(-1) == 0).mean()), 6),
                               "max_abs": int(np.abs(a - b).max())}

# ------------------------------------------------------------------ invariants over every frame (lottie-svg, fresh DOM)
nol_c = np.array(spec["nucleolus_centre"]) - [BX, BY]
rays_zone = cv2.dilate(((np.abs(ref[..., :3] - [241, 196, 108]).max(-1) < 40) & (ref[..., 3] > 0)).astype(np.uint8),
                       np.ones((9, 9), np.uint8)) > 0
M["every_frame"] = {}
for v in ("once", "loop"):
    frames = [fr(v, "lottie-svg", f) for f in range(OP[v])]
    border = max(float(np.concatenate([f[0, :, 3], f[-1, :, 3], f[:, 0, 3], f[:, -1, 3]]).max()) for f in frames)
    steps = [float(np.abs(frames[i] - frames[i - 1]).mean()) for i in range(1, len(frames))]
    if v == "loop":
        steps.append(float(np.abs(frames[0] - frames[-1]).mean()))
    nol_union = np.zeros((H, W), bool)
    errs = []
    for k, f in enumerate(frames):
        m = (np.abs(f[..., :3] - [229, 99, 95]).max(-1) < 6) & (f[..., 3] > 250)
        nol_union |= m
        ys, xs = np.nonzero(m)
        exp_ = spec[v]["frames"][k]["nucleolo"]
        errs.append(float(np.hypot(xs.mean() + 0.5 - (nol_c[0] + exp_[0]), ys.mean() + 0.5 - (nol_c[1] + exp_[1]))))
    moving = (cv2.dilate(nol_union.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0) | rays_zone
    static = ~moving
    changed = max(int((np.abs(f - frames[0]).max(-1)[static] > 0).sum()) for f in frames)
    M["every_frame"][v] = {
        "frames": len(frames), "border_alpha_max": border,
        "static_region_pixels": int(static.sum()), "static_region_max_changed_pixels": changed,
        "mean_abs_step_max": round(max(steps), 4), "mean_abs_step_max_at_frame": int(np.argmax(steps)) + 1,
        "still_step_share": round(float(np.mean([s == 0 for s in steps])), 3),
        "nucleolus_centroid_vs_spec_px": {"max_minus_rest_bias": round(max(abs(e - errs[-1]) for e in errs), 3),
                                          "rest_bias": round(errs[-1], 3)}}


# nucleolus containment from geometry (master paths, per-frame analytic offsets)
def poly(d, step=200):
    nums = [float(x) for x in re.findall(r"-?\d+(?:\.\d+)?", d)]
    p0 = np.array(nums[:2])
    pts = []
    t = np.linspace(0, 1, step)[:, None]
    for i in range(2, len(nums), 6):
        c1, c2, p3 = np.array(nums[i:i + 2]), np.array(nums[i + 2:i + 4]), np.array(nums[i + 4:i + 6])
        pts.append((1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * c1 + 3 * (1 - t) * t * t * c2 + t ** 3 * p3)
        p0 = p3
    return np.vstack(pts).astype(np.float32)


mtxt = (EXP / "master/celuma-isotipo-maestro-paleta-aprobada.svg").read_text()  # active master (geometry = historical)
nuc = poly(re.search(r'id="nucleo" fill="[^"]+" d="([^"]+)"', mtxt).group(1))
nol = poly(re.search(r'id="nucleolo" fill="[^"]+" d="([^"]+)"', mtxt).group(1))


def margin(off):
    return min(cv2.pointPolygonTest(nuc.reshape(-1, 1, 2), (float(x + off[0]), float(y + off[1])), True) for x, y in nol[::8])


M["nucleolus_margin_px"] = {v: round(float(min(margin(r["nucleolo"]) for r in spec[v]["frames"])), 2) for v in ("once", "loop")}
M["nucleolus_margin_px"]["master_rest"] = round(float(margin((0, 0))), 2)

# ------------------------------------------------------------------ JSON structure
exec_ns = {}
exec((EXP / "scripts/animation.py").read_text().split("# -------------------------------------------------------------- write")[0], exec_ns)
master_shape = lambda name: exec_ns["shape_data"](exec_ns["parse"](exec_ns["PATHS"][name]))
M["lottie"] = {}
for v in ("once", "loop"):
    path = EXP / f"anim/celuma-isotipo-{v}.json"
    txt = path.read_text()
    j = json.loads(txt)
    fixed = [l for l in j["layers"] if l["nm"] == "celula-fija"][0]
    finals = [(l["nm"], key, l["ks"][key]["k"][-1]["s"]) for l in j["layers"] for key in ("p", "o") if l["ks"][key]["a"]]
    rays_ok = all(l["shapes"][0]["it"][0]["ks"]["k"][-1]["s"][0] == master_shape(l["nm"])
                  for l in j["layers"] if l["nm"].startswith("rayo"))
    static_ok = all(g["it"][0]["ks"] == {"a": 0, "k": master_shape(g["nm"])}
                    for l in j["layers"] if not l["nm"].startswith("rayo") for g in l["shapes"])
    M["lottie"][v] = {
        "bytes": len(path.read_bytes()), "fr": j["fr"], "op": j["op"], "w": j["w"], "h": j["h"],
        "layers": [l["nm"] for l in j["layers"]],
        "fixed_layer_has_animation": '"a":1' in json.dumps(fixed, separators=(",", ":")),
        "forbidden_features_present": [k for k in ('"x":"', '"ef":', '"masksProperties"', '"tt":', '"ty":"mm"', '"ty":5',
                                                   '"refId"', '"tm":{', '"ddd":1') if k in txt],
        "final_keyed_values": finals,
        "final_identity": all((k == "p" and all(abs(x) < 1e-12 for x in s)) or (k == "o" and s[0] == 100) for _, k, s in finals),
        "final_ray_shapes_equal_master": bool(rays_ok), "static_shapes_equal_master": bool(static_ok),
        "fill_colours": sorted({json.dumps(it["c"]["k"]) for l in j["layers"] for g in l["shapes"] for it in g["it"] if it["ty"] == "fl"}),
    }

# ------------------------------------------------------------------ reduced motion
rd = R / "reduced"
M["reduced_motion"] = {
    "css inline · al cargar": compare(load(rd / "css-inline/initial.png"), ref, "E"),
    "picture (fuente estática) · 0,06 s": compare(load(rd / "picture-once/t00060.png"), ref, "E"),
    "picture (fuente estática) · 1,56 s": compare(load(rd / "picture-once/t01500.png"), ref, "E"),
    "img con SVG animado · 0,06 s": compare(load(rd / "img-once/t00060.png"), ref, "E"),
    "img con SVG animado · 1,56 s": compare(load(rd / "img-once/t01500.png"), ref, "E"),
}
M["css_computed_after_finish"] = [r for r in report if r["name"].endswith(":computed")]

# ------------------------------------------------------------------ performance
perf = {}
for r in report:
    if r["name"].endswith("-perf"):
        perf[r["name"]] = {"seek_ms_mean": round(r["per_frame_ms"]["mean"], 3), "seek_ms_max": round(r["per_frame_ms"]["max"], 2)}
    if r["name"].endswith(":playback"):
        d = np.array(r["raf_deltas_ms"])
        perf[r["name"]] = {"frames": int(len(d)), "raf_ms_median": round(float(np.median(d)), 2),
                           "raf_ms_p95": round(float(np.percentile(d, 95)), 2), "long_frames_gt_20ms": int((d > 20).sum())}
    if r["name"] in ("once-thorvg", "loop-thorvg"):
        perf[r["name"]] = {"setFrame_to_screen_ms_mean": round(r["per_frame_ms"]["mean"], 2)}
M["performance"] = perf
M["player_errors"] = {r["name"]: r.get("errors") for r in report if r.get("errors")}
(VAL / "anim-metrics.json").write_text(json.dumps(M, indent=1, ensure_ascii=False, default=float))
(VAL / "anim-metrics.js").write_text("// Generated by scripts/validate_anim.py — Mirada, aprobada en el experimento 02 (paleta aprobada 2026-09-27)\nwindow.CELUMA_ANIM_METRICS = "
                                     + json.dumps(M, ensure_ascii=False, default=float) + ";\n")

# ------------------------------------------------------------------ sheets
try:
    F = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
    FB = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 18)
except OSError:
    F = FB = ImageFont.load_default()
BANNER = "Aprobado en lab · paleta 2026-09-27 · fase 2"
BGS = {"crema": (251, 246, 236), "navy": (13, 27, 42), "blanco": (255, 255, 255)}


def on(img, bg, size=None):
    im = Image.fromarray(np.clip(composite(img, bg), 0, 255).astype(np.uint8))
    return im.resize(size, Image.LANCZOS) if size else im


def sheet_frames(v, name, labels):
    tw, th = 200, int(200 * H / W)
    S = Image.new("RGB", (40 + len(labels) * (tw + 12), 90 + 2 * (th + 40)), (245, 243, 238))
    d = ImageDraw.Draw(S)
    d.text((20, 14), f"Isotipo animado · {'una reproducción' if v == 'once' else 'bucle'} · fotogramas clave (lottie-web, SVG)", fill=(13, 27, 42), font=FB)
    d.text((S.width - 420, 16), BANNER, fill=(180, 65, 58), font=F)
    for row, bg in enumerate(("crema", "navy")):
        for c, (f, lab) in enumerate(labels):
            x, y = 20 + c * (tw + 12), 60 + row * (th + 40)
            S.paste(on(fr(v, "lottie-svg", f), BGS[bg], (tw, th)), (x, y + 20))
            d.text((x, y), f"{lab} · f{f} · {f / FPS:.2f} s", fill=(13, 27, 42), font=F)
    S.save(VAL / name)


mk, mkl = MK["once"], MK["loop"]
sheet_frames("once", "lamina-anim-fotogramas-once.png",
             [(0, "inicio"), (mk["mira-izquierda"], "izquierda"), (mk["mira-derecha"], "derecha"), (mk["eureka"], "eureka"),
              (mk["rayos"] + 6, "rayos"), (mk["rayos"] + 14, "rayos"), (OP["once"] - 1, "final = maestro")])
sheet_frames("loop", "lamina-anim-fotogramas-loop.png",
             [(0, "inicio = maestro"), (mkl["rayos-se-apagan"] + 14, "se apagan"), (mkl["mira-izquierda"], "izquierda"),
              (mkl["mira-derecha"], "derecha"), (mkl["eureka"], "eureka"), (mkl["rayos"] + 10, "rayos"), (OP["loop"] - 1, "final = inicio")])


def heat(a, b):
    t = np.clip(np.abs(a - b).max(-1) / 255.0 * 8, 0, 1)
    return Image.fromarray((np.stack([t, np.clip(t * 2 - 1, 0, 1), np.zeros_like(t)], -1) * 255).astype(np.uint8))


tiles = [("maestro (SVG, Chromium)", on(ref, BGS["crema"]))]
for r in ("lottie-svg", "lottie-canvas", "thorvg"):
    a = fr("once", r, OP["once"] - 1)
    tiles += [(f"{r} · último", on(a, BGS["crema"])), (f"dif. ×8 · {r}", heat(a, ref))]
fin = load(R / "once/css-svg/finished.png")
tiles += [("SVG CSS al terminar", on(fin, BGS["crema"])), ("dif. ×8 · CSS terminado", heat(fin, ref))]
tw, th = 160, int(160 * H / W)
S = Image.new("RGB", (20 + len(tiles) * (tw + 10), th + 110), (245, 243, 238))
d = ImageDraw.Draw(S)
d.text((20, 12), "Último fotograma (una reproducción) vs maestro — negro = idéntico; rojo = diferencia ×8", fill=(13, 27, 42), font=FB)
d.text((S.width - 420, 14), BANNER, fill=(180, 65, 58), font=F)
for k, (lab, im) in enumerate(tiles):
    x = 20 + k * (tw + 10)
    S.paste(im.resize((tw, th), Image.LANCZOS), (x, 70))
    d.text((x, 48), lab, fill=(13, 27, 42), font=F)
S.save(VAL / "lamina-anim-final-vs-maestro.png")

labels = [(0, "inicio"), (mk["mira-izquierda"], "izq."), (mk["mira-derecha"], "der."), (mk["eureka"], "eureka"),
          (mk["rayos"] + 10, "rayos"), (OP["once"] - 1, "final")]
rows = [(n, bg) for n in (32, 48, 64, 128) for bg in ("blanco", "crema", "navy")]
tw = round(128 * W / H) + 20
S = Image.new("RGB", (200 + len(labels) * (tw + 10), 80 + sum(max(n, 40) + 16 for n, _ in rows)), (245, 243, 238))
d = ImageDraw.Draw(S)
d.text((20, 12), "Legibilidad del movimiento a 32, 48, 64 y 128 px de alto (1:1)", fill=(13, 27, 42), font=FB)
d.text((S.width - 420, 14), BANNER, fill=(180, 65, 58), font=F)
for c, (f, lab) in enumerate(labels):
    d.text((180 + c * (tw + 10), 44), lab, fill=(13, 27, 42), font=F)
y = 66
for n, bg in rows:
    d.text((20, y + max(n, 40) // 2 - 8), f"{n} px · {bg}", fill=(13, 27, 42), font=F)
    for c, (f, lab) in enumerate(labels):
        im = on(load(R / "once" / f"lottie-svg-h{n}" / f"f{f:04d}.png"), BGS[bg])
        cell = Image.new("RGB", (tw, max(n, 40)), BGS[bg])
        cell.paste(im, ((tw - im.width) // 2, (max(n, 40) - im.height) // 2))
        S.paste(cell, (180 + c * (tw + 10), y))
    y += max(n, 40) + 16
S.save(VAL / "lamina-anim-tamanos.png")

# ------------------------------------------------------------------ summary
bad = {k: v for k, v in M["first_last"].items() if not v["pass"]}
print("first/last:", len(M["first_last"]) - len(bad), "pass;", "FAIL:",
      {k: (v["iou"], v["px_alpha_diff_gt2_outside_aa"], v["flat_de00_max"], v["identical_rgba_share"]) for k, v in bad.items()})
for k in ("loop_continuity", "every_frame", "nucleolus_margin_px", "performance", "player_errors"):
    print(k, json.dumps(M[k], ensure_ascii=False, default=float)[:800])
print("reduced", {k: (v["pass"], v["identical_rgba_share"]) for k, v in M["reduced_motion"].items()})
print("lottie", {v: {k: M["lottie"][v][k] for k in ("bytes", "fixed_layer_has_animation", "final_identity",
                                                     "final_ray_shapes_equal_master", "static_shapes_equal_master",
                                                     "forbidden_features_present")} for v in ("once", "loop")})
print("css after finish", json.dumps(M["css_computed_after_finish"], ensure_ascii=False)[:500])
