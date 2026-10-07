"""Céluma · Experimento 04 · El último estado de cada motion frente a la pieza estática del kit,
y el primer fotograma de la intro (debe ser navy liso, como Orden en 03).
Uso: /opt/homebrew/bin/python3.10 scripts/comprobar_motion.py → validacion/motion-final.json
"""
import json, os
import numpy as np
from PIL import Image

E4 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARES = {'intro-novedad': 'exports/kit/novedad-131__16x9.png', 'paso-a-paso': 'exports/kit/flujo-informe__9x16.png'}
out = {}
for m, est in PARES.items():
    a = np.asarray(Image.open(os.path.join(E4, f'motion/{m}-final.png')).convert('RGB')).astype(int)
    b = np.asarray(Image.open(os.path.join(E4, est)).convert('RGB')).astype(int)
    d = np.abs(a - b).max(axis=2)
    out[m] = {'estatico': est, 'tamano': list(a.shape[1::-1]), 'pixeles_distintos': int((d > 0).sum()), 'diferencia_max': int(d.max()), 'identico': bool((d == 0).all())}
p = np.asarray(Image.open(os.path.join(E4, 'motion/intro-novedad-primero.png')).convert('RGB')).astype(int)
out['intro-novedad']['primer_fotograma_navy_liso'] = bool((np.abs(p - np.array([10, 21, 32])).max() <= 1))  # navy profundo #0A1520 (ronda 2)
json.dump(out, open(os.path.join(E4, 'validacion', 'motion-final.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
