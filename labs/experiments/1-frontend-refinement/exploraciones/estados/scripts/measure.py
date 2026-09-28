# Medición en píxeles de la señal NO cromática: cada chip recortado a 3× se pasa a
# escala de grises (luma ITU-R 601) y se comparan pares (Aprobado/Publicado,
# Lista/Liberada) por luminancia media y por «área de tinta» (píxeles oscuros).
# Uso: python3 scripts/measure.py   (desde exploraciones/estados)
from PIL import Image
import json, os
here = os.path.dirname(os.path.abspath(__file__))
chips = os.path.join(here, '..', 'capturas', 'chips')
VARS = ['r2', 'r3', 'v1', 'v2', 'v3', 'v4', 'v5', 'rec']
def peak(im, k=36):
    # Luma media de la ventana de 12 × 12 px CSS (36 × 36 a 3×) más oscura: la «mancha».
    w, h = im.size; px = im.load(); k = min(k, h)
    I = [[0] * (w + 1) for _ in range(h + 1)]
    for y in range(h):
        row = 0
        for x in range(w):
            row += px[x, y]; I[y + 1][x + 1] = I[y][x + 1] + row
    best = 255
    for y in range(0, h - k + 1):
        for x in range(0, w - k + 1):
            s = I[y + k][x + k] - I[y][x + k] - I[y + k][x] + I[y][x]
            best = min(best, s / (k * k))
    return best
def stats(path):
    im = Image.open(path).convert('L'); px = list(im.getdata()) if not hasattr(im, 'get_flattened_data') else list(im.get_flattened_data()); n = len(px)
    return {'mean': sum(px) / n, 'ink': sum(1 for p in px if p < 110) / n, 'w': im.width / 3, 'peak': peak(im)}
out = {}
for v in VARS:
    s = {k: stats(os.path.join(chips, f'{v}-{k}.png')) for k in ['aprobado', 'publicado', 'lista', 'liberada']}
    out[v] = {
        'AP_dMean': round(abs(s['aprobado']['mean'] - s['publicado']['mean']), 1),
        'AP_dInk': round(100 * abs(s['aprobado']['ink'] - s['publicado']['ink']), 1),
        'LL_dMean': round(abs(s['lista']['mean'] - s['liberada']['mean']), 1),
        'LL_dInk': round(100 * abs(s['lista']['ink'] - s['liberada']['ink']), 1),
        'ink_aprobado': round(100 * s['aprobado']['ink'], 1), 'ink_publicado': round(100 * s['publicado']['ink'], 1),
        'w_aprobado': round(s['aprobado']['w']), 'w_publicado': round(s['publicado']['w']),
        'peak_aprobado': round(s['aprobado']['peak']), 'peak_publicado': round(s['publicado']['peak']),
        'AP_dPeak': round(abs(s['aprobado']['peak'] - s['publicado']['peak'])),
        'LL_dPeak': round(abs(s['lista']['peak'] - s['liberada']['peak'])),
    }
json.dump(out, open(os.path.join(here, '..', 'capturas', 'medicion-pixeles.json'), 'w'), indent=2, ensure_ascii=False)
print(f"{'var':5s} {'ΔLuma A/P':>10s} {'ΔMancha A/P':>12s} {'ΔLuma L/Lib':>12s} {'ΔMancha L/Lib':>14s}  mancha A→P   ancho A/P")
for v, m in out.items():
    print(f"{v:5s} {m['AP_dMean']:10.1f} {m['AP_dPeak']:12d} {m['LL_dMean']:12.1f} {m['LL_dPeak']:14d}  {m['peak_aprobado']:3d}→{m['peak_publicado']:3d}     {m['w_aprobado']}/{m['w_publicado']} px")
