# Compone láminas 1:1 por contexto (R3 y las alternativas) en color y en escala de
# grises, a partir de capturas/contextos/ y capturas/movil-390/.
# Uso: python3 scripts/sheets.py   (desde exploraciones/estados)
from PIL import Image, ImageDraw, ImageFont, ImageOps
import os
here = os.path.dirname(os.path.abspath(__file__))
cap = os.path.join(here, '..', 'capturas')
out = os.path.join(cap, 'laminas')
os.makedirs(out, exist_ok=True)

def font(size, bold=False):
    p = '/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial.ttf'
    return ImageFont.truetype(p, size) if os.path.exists(p) else ImageFont.load_default()

NAMES = {'r2': 'R2 · relleno oscuro (referencia)', 'r3': 'R3 · actual', 'v1': 'V1 · Escalón tonal', 'v2': 'V2 · Glifo lleno',
         'v3': 'V3 · Calificador en el chip', 'v4': 'V4 · Interno ≠ entregado', 'v5': 'V5 · Glifo lleno + escalón suave', 'rec': 'V2+ · Glifo lleno + contexto (recomendada)'}
ORDER = ['r3', 'v1', 'v2', 'v3', 'v4', 'v5', 'rec']
CTX = {'tabla': 'Tabla densa', 'trabajo': 'Lista de trabajo', 'ficha': 'Ficha de informe', 'movil': 'Móvil (marco de 390 px)'}

def sheet(ctx, gray=False, order=ORDER, cols=2, src='contextos', pattern='{c}-{v}.png', title=None):
    imgs = [Image.open(os.path.join(cap, src, pattern.format(c=ctx, v=v))).convert('RGB') for v in order]
    if gray: imgs = [ImageOps.grayscale(i).convert('RGB') for i in imgs]
    cw = max(i.width for i in imgs); pad = 24; lab = 30; head = 74
    rows = (len(imgs) + cols - 1) // cols
    rh = [max(imgs[r * cols + k].height for k in range(cols) if r * cols + k < len(imgs)) for r in range(rows)]
    W = pad + cols * (cw + pad); H = head + sum(h + lab + pad for h in rh) + pad
    c = Image.new('RGB', (W, H), '#f3f1ec'); d = ImageDraw.Draw(c)
    d.rectangle([0, 0, W, 32], fill='#fff4d6')
    d.text((pad, 9), 'EXPLORACIÓN · NO APROBADA — datos ficticios · tamaño real (1 px CSS = 1 px)', fill='#7a4b00', font=font(14, True))
    d.text((pad, 42), (title or CTX.get(ctx, ctx)) + (' · escala de grises' if gray else ''), fill='#0d1b2a', font=font(20, True))
    y = head
    for r in range(rows):
        for k in range(cols):
            i = r * cols + k
            if i >= len(imgs): break
            x = pad + k * (cw + pad)
            v = order[i]
            d.text((x, y + 4), NAMES[v], fill='#1f7a75' if v == 'rec' else '#0d1b2a', font=font(15, True))
            c.paste(imgs[i], (x, y + lab))
        y += rh[r] + lab + pad
    name = f"{ctx}{'-grises' if gray else ''}.png"
    c.save(os.path.join(out, name))
    return name, c.size

for ctx in CTX:
    for g in (False, True):
        print(sheet(ctx, g, cols=3 if ctx == 'movil' else 2))
for g in (False, True):
    print(sheet('movil390', g, order=['r3', 'v1', 'v2', 'v3', 'v4', 'v5', 'rec'], cols=7, src='movil-390', pattern='movil-{v}.png', title='Móvil a 390 × 844 real'))
