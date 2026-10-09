"""Céluma · Experimento 04 · Contraste WCAG 2.x de todas las combinaciones de texto del kit.
Uso: python3 scripts/contraste.py  → validacion/contraste.json
Objetivo de referencia: 4,5:1 texto normal; 3:1 texto grande (≥ 24 px, o ≥ 18,66 px en negrita, a tamaño de uso).
Los tamaños de artboard se convierten a tamaño de uso a ~390 px de ancho de pantalla.
"""
import json, os, re

E4 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
css = open(os.path.join(E4, 'kit', 'sistema.css'), encoding='utf-8').read()
V = dict(re.findall(r'--(e4-[\w-]+):\s*(#[0-9A-Fa-f]{6})', css))

def lum(h):
    h = h.lstrip('#'); r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def cr(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)

# (rol, tinta, fondo, tamaño mínimo en artboard px a 1080 de ancho, peso, dirección, dónde)
USOS = [
    ('Título y display', 'e4-tinta', 'e4-crema', 93, 800, 'A B C', 'Todas las piezas claras'),
    ('Texto de apoyo', 'e4-tinta-2', 'e4-crema', 45, 400, 'A B', 'Cuerpo de texto'),
    ('Metadatos (sílabas, fuente, serie)', 'e4-tinta-3', 'e4-crema', 29, 400, 'B', 'Lema, línea de fuente, numeración'),
    ('Antetítulo y CTA', 'e4-teal-profunda', 'e4-crema', 31, 650, 'A B C', 'Eyebrow y dirección'),
    ('Cabecera de serie', 'e4-tinta', 'e4-crema', 31, 650, 'B', 'Cabecera'),
    ('Rótulos del rastreador', 'e4-tinta-2', 'e4-crema', 31, 600, 'B', 'Pasos'),
    ('Título sobre luz intensa', 'e4-tinta', 'e4-luz-0', 93, 800, 'A', 'Zona iluminada'),
    ('Texto sobre luz', 'e4-tinta-2', 'e4-luz-1', 45, 400, 'A', 'Zona iluminada'),
    ('Antetítulo sobre luz', 'e4-teal-profunda', 'e4-luz-0', 31, 650, 'A', 'Zona iluminada'),
    ('Título sobre menta suave', 'e4-tinta', 'e4-menta-suave', 93, 800, 'C', 'Membrana'),
    ('Texto sobre menta suave', 'e4-tinta', 'e4-menta-suave', 45, 400, 'C', 'Membrana'),
    ('Número sobre foco salmón', 'e4-tinta', 'e4-nucleo', 67, 800, 'C', 'Foco numerado (texto grande)'),
    ('Título sobre navy', 'e4-sobre-navy', 'e4-navy', 93, 800, 'B', 'Portadas, cierres y anuncios'),
    ('Texto sobre navy', 'e4-sobre-navy-2', 'e4-navy', 45, 400, 'B', 'Portadas, cierres y anuncios'),
    ('Antetítulo y CTA sobre navy', 'e4-menta-tinta', 'e4-navy', 31, 650, 'B', 'Portadas, cierres y anuncios'),
    ('Metadatos sobre navy', '#A9B6C3', 'e4-navy', 29, 400, 'B', 'Numeración y fuente sobre navy'),
]
# Combinaciones prohibidas (documentadas para la guía)
PROHIBIDAS = [
    ('Blanco sobre teal de identidad', '#FFFFFF', 'e4-membrana'),
    ('Teal de identidad como texto sobre crema', 'e4-membrana', 'e4-crema'),
    ('Salmón como texto sobre crema', 'e4-nucleo', 'e4-crema'),
    ('Gris #6B7280 sobre crema (texto pequeño)', '#6B7280', 'e4-crema'),
    ('Teal de tinta #1F7A75 sobre menta suave', 'e4-teal-tinta', 'e4-menta-suave'),
    ('Amarillo de rayos como texto sobre crema', 'e4-rayos', 'e4-crema'),
]
hx = lambda k: V.get(k, k) if not k.startswith('#') else k
filas = []
for rol, t, f, px, peso, d, donde in USOS:
    c = cr(hx(t), hx(f))
    uso390 = px * 390 / 1080
    grande = uso390 >= 24 or (peso >= 700 and uso390 >= 18.66)
    obj = 3 if grande else 4.5
    filas.append({'rol': rol, 'tinta': hx(t), 'fondo': hx(f), 'contraste': round(c, 2), 'px_artboard': px, 'px_a_390': round(uso390, 1), 'texto_grande': grande, 'objetivo': obj, 'cumple': c >= obj, 'direcciones': d, 'donde': donde})
prohibidas = [{'uso': u, 'tinta': hx(t), 'fondo': hx(f), 'contraste': round(cr(hx(t), hx(f)), 2)} for u, t, f in PROHIBIDAS]
out = {'metodo': 'WCAG 2.x, luminancia relativa sRGB. Tamaño de uso estimado a 390 px de ancho.', 'usos': filas, 'prohibidas': prohibidas,
       'resumen': f"{sum(x['cumple'] for x in filas)}/{len(filas)} combinaciones de texto cumplen su objetivo"}
os.makedirs(os.path.join(E4, 'validacion'), exist_ok=True)
json.dump(out, open(os.path.join(E4, 'validacion', 'contraste.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(out['resumen'])
for x in filas:
    print(f"{'ok ' if x['cumple'] else 'XX '} {x['contraste']:5.2f}:1 (obj {x['objetivo']}) {x['rol']} · {x['px_a_390']} px a 390")
for x in prohibidas:
    print(f"   prohibida {x['contraste']:5.2f}:1 {x['uso']}")
