"""Céluma · 04 · ronda 2 · Compara los fondos locales con el render original del lienzo (mismo tamaño 280×200 a 2×).
Uso: /opt/homebrew/bin/python3.10 scripts/ronda2/fidelidad.py → ronda-2/fidelidad-fondos.json"""
import json, os, numpy as np
from PIL import Image
E4 = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
R = os.path.join(E4, 'ronda-2/referencia'); out = {}
for loc, orig, c in (('papel', 'pat-cream', (180, 180)), ('navy', 'pat-navy', (160, 160))):
    a = np.asarray(Image.open(f'{R}/local-{loc}@2x.png').convert('RGB')).astype(int)
    b = np.asarray(Image.open(f'{R}/original-{orig}@2x.png').convert('RGB')).astype(int)
    m = np.zeros(a.shape[:2], bool); m[40:-40, 40:-40] = True  # sin las esquinas redondeadas del azulejo original
    d = np.abs(a - b).max(axis=2)[m]
    out[loc] = {'original': orig, 'pixeles': int(m.sum()), 'dif_media': round(float(d.mean()), 2), 'dif_p99': int(np.percentile(d, 99)), 'dif_max': int(d.max()),
                'centro_original': '#%02x%02x%02x' % tuple(b[c[1], c[0]]), 'centro_local': '#%02x%02x%02x' % tuple(a[c[1], c[0]])}
json.dump(out, open(os.path.join(E4, 'ronda-2/fidelidad-fondos.json'), 'w'), indent=1)
print(json.dumps({k: (v['dif_max'], v['centro_local']) for k, v in out.items()}))
