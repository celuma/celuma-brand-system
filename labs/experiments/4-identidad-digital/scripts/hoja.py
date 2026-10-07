"""Céluma · Experimento 04 · Hojas de contacto para revisar exports a escala común.
Uso: python3 scripts/hoja.py <salida.png> <alto_px> <titulo> <png> [<png> ...]
     Una fila por grupo separado con '--'. Solo usa Pillow (python3 del sistema).
"""
import sys
from PIL import Image, ImageDraw, ImageFont

def fuente(t):
    for f in ('/System/Library/Fonts/SFNS.ttf', '/System/Library/Fonts/Helvetica.ttc'):
        try:
            return ImageFont.truetype(f, t)
        except OSError:
            pass
    return ImageFont.load_default()

def main():
    out, alto, titulo, *rutas = sys.argv[1:]
    alto = int(alto)
    filas, fila = [], []
    for r in rutas:
        if r == '--':
            filas.append(fila); fila = []
        else:
            fila.append(r)
    if fila:
        filas.append(fila)
    gap, pad, cab = 28, 40, 70
    imgs = [[Image.open(r).convert('RGB') for r in f] for f in filas]
    esc = [[im.resize((round(im.width * alto / im.height), alto), Image.LANCZOS) for im in f] for f in imgs]
    ancho = max(sum(i.width for i in f) + gap * (len(f) - 1) for f in esc) + pad * 2
    total = cab + sum(alto + 44 for _ in esc) + pad
    hoja = Image.new('RGB', (ancho, total), (233, 228, 218))
    d = ImageDraw.Draw(hoja)
    d.text((pad, 22), titulo, fill=(13, 27, 42), font=fuente(26))
    y = cab
    for f, rutas_f in zip(esc, filas):
        x = pad
        for im, r in zip(f, rutas_f):
            hoja.paste(im, (x, y))
            d.text((x, y + alto + 8), r.split('/')[-1].replace('.png', ''), fill=(86, 101, 122), font=fuente(15))
            x += im.width + gap
        y += alto + 44
    hoja.save(out, optimize=True)
    print(out, hoja.size)

if __name__ == '__main__':
    main()
