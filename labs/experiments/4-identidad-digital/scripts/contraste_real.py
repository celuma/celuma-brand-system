"""Céluma · Experimento 04 · Contraste sobre la composición final (píxeles reales).
Para cada pieza B ronda 2 exportada, lee las cajas de cada tramo de texto (validacion/exportar-<modo>.json),
el export final y el render del mismo lienzo sin texto (validacion/tmp/sin-texto/). La caja de TINTA de cada
tramo es donde ambos renders difieren (los glifos reales, no la caja de línea de la fuente); se amplía 3 px y
se calcula el peor contraste entre la tinta y cualquier píxel de fondo en esa zona. Objetivo: 4,5:1 normal; 3:1 texto grande a tamaño de uso (390 px).
Uso: python3 scripts/contraste_real.py kit|ronda2 → validacion/contraste-real-<modo>.json (y borra los renders temporales)
"""
import json, os, re, sys, shutil
from PIL import Image
E4 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
modo = sys.argv[1] if len(sys.argv) > 1 else 'kit'
d = json.load(open(os.path.join(E4, f'validacion/exportar-{modo}.json')))
def lum(c):
    f = lambda v: v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = [x / 255 for x in c[:3]]
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
def cr(a, b):
    la, lb = lum(a), lum(b); return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
piezas, peores, fallos = [], [], []
for p in d['piezas']:
    if not p.get('textos'): continue
    img = Image.open(os.path.join(E4, 'validacion/tmp/sin-texto', os.path.basename(p['out']))).convert('RGB')
    fin = Image.open(os.path.join(E4, p['out'])).convert('RGB')
    W = img.width; px = img.load(); pf = fin.load(); filas = []
    for t in p['textos']:
        col = [float(x) for x in re.findall(r'[\d.]+', t['color'])[:3]]
        x0, y0, x1, y1 = max(0, t['x']), max(0, t['y']), min(img.width, t['x'] + t['w']), min(img.height, t['y'] + t['h'])
        tinta = [(x, y) for y in range(y0, y1) for x in range(x0, x1) if max(abs(a - b) for a, b in zip(px[x, y], pf[x, y])) > 24]
        if not tinta: continue
        tx0, tx1 = max(0, min(x for x, _ in tinta) - 3), min(img.width, max(x for x, _ in tinta) + 4)
        ty0, ty1 = max(0, min(y for _, y in tinta) - 3), min(img.height, max(y for _, y in tinta) + 4)
        lums = [(lum(px[x, y]), px[x, y]) for y in range(ty0, ty1, 2) for x in range(tx0, tx1, 2)]
        if not lums: continue
        oscuro, claro = min(lums)[1], max(lums)[1]
        peor = min(cr(col, oscuro), cr(col, claro))
        uso = t['px'] * 390 / W
        obj = 3 if (uso >= 24 or (t['peso'] >= 700 and uso >= 18.66)) else 4.5
        filas.append({'el': t['el'], 'peor': round(peor, 2), 'objetivo': obj, 'ok': peor >= obj})
    m = min(filas, key=lambda f: f['peor'] / f['objetivo'])
    piezas.append({'pieza': os.path.basename(p['out']), 'lineas': len(filas), 'peor': m, 'ok': all(f['ok'] for f in filas)})
    if not piezas[-1]['ok']: fallos.append(piezas[-1])
out = {'metodo': 'Peor píxel de fondo (render sin texto, muestreo cada 2 px) bajo cada línea frente a su tinta; WCAG 2.x.', 'modo': modo,
       'piezas': len(piezas), 'lineas': sum(x['lineas'] for x in piezas), 'fallos': fallos, 'detalle': piezas,
       'minimo_relativo': min((x['peor'] for x in piezas), key=lambda f: f['peor'] / f['objetivo']) if piezas else None}
json.dump(out, open(os.path.join(E4, f'validacion/contraste-real-{modo}.json'), 'w'), ensure_ascii=False, indent=1)
shutil.rmtree(os.path.join(E4, 'validacion/tmp/sin-texto'), ignore_errors=True)
print(f"{len(piezas)} piezas · {out['lineas']} líneas · fallos: {len(fallos)} · peor relativo: {out['minimo_relativo']}")
