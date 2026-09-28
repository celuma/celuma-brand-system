# Compone láminas «Hoy (celuma-frontend) | Propuesta (exploración)» a partir de
# capturas/actual y capturas/ronda-2. Uso: python3 scripts/compare.py
from PIL import Image, ImageDraw, ImageFont
import os
here = os.path.dirname(os.path.abspath(__file__))
cap = os.path.join(here, '..', 'capturas')
out = os.path.join(cap, 'comparacion')
os.makedirs(out, exist_ok=True)
def font(size, bold=False):
    for p in (['/System/Library/Fonts/Supplemental/Arial Bold.ttf'] if bold else []) + ['/System/Library/Fonts/Supplemental/Arial.ttf', '/Library/Fonts/Arial.ttf']:
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()
PAIRS = [
    ('trabajo-1440', 'actual/worklist-1440.jpg', 'ronda-2/trabajo-1440.jpg', 'Lista de trabajo · 1440 px', None),
    ('orden-1440', 'actual/orden-detalle-1440.jpg', 'ronda-2/orden-1440.jpg', 'Detalle de orden · 1440 px', None),
    ('trabajo-390', 'actual/worklist-390.jpg', 'ronda-2/trabajo-390.jpg', 'Lista de trabajo · 390 px', None),
    ('orden-390', 'actual/orden-detalle-390.jpg', 'ronda-2/orden-390.jpg', 'Detalle de orden · 390 px', 844),
]
for name, a, b, title, crop in PAIRS:
    A = Image.open(os.path.join(cap, a)).convert('RGB'); B = Image.open(os.path.join(cap, b)).convert('RGB')
    if crop: A = A.crop((0, 0, A.width, min(crop, A.height))); B = B.crop((0, 0, B.width, min(crop, B.height)))
    h = max(A.height, B.height); gap = 24; top = 108; pad = 24
    W = A.width + B.width + gap + pad * 2
    img = Image.new('RGB', (W, h + top + pad), '#f0eee9')
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 34], fill='#fff4d6')
    d.text((pad, 9), 'EXPLORACIÓN · NO APROBADA — comparación con datos ficticios', fill='#7a4b00', font=font(15, True))
    d.text((pad, 46), title, fill='#0d1b2a', font=font(20, True))
    d.text((pad, top - 26), 'Hoy · celuma-frontend 1.3.1 (API simulada)', fill='#374151', font=font(15))
    d.text((pad + A.width + gap, top - 26), 'Propuesta · experimento 01, ronda 2', fill='#1f7a75', font=font(15, True))
    img.paste(A, (pad, top)); img.paste(B, (pad + A.width + gap, top))
    img.save(os.path.join(out, f'{name}.jpg'), quality=82)
    print('ok', name, img.size)
