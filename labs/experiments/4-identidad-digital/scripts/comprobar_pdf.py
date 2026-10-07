"""Céluma · Experimento 04 · PDF de distribución: una página, tamaño del artboard, fuentes incrustadas.
Uso: python3 scripts/comprobar_pdf.py → validacion/pdf.json (usa pypdf del python3 del sistema)."""
import glob, json, os
from pypdf import PdfReader
E4 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
res = []
for f in sorted(glob.glob(os.path.join(E4, 'exports/kit/pdf/*.pdf'))):
    r = PdfReader(f); p = r.pages[0]
    fonts = p.get('/Resources', {}).get('/Font', {}) or {}
    tipos = sorted({str(v.get_object().get('/Subtype')) for v in fonts.values()})
    tounicode = all('/ToUnicode' in v.get_object() for v in fonts.values())
    w, h = float(p.mediabox.width) * 96 / 72, float(p.mediabox.height) * 96 / 72
    sin_texto = not fonts and not p.extract_text().strip()
    res.append({'pdf': os.path.relpath(f, E4), 'paginas': len(r.pages), 'px': [round(w), round(h)], 'fuentes': len(fonts), 'tipos': tipos, 'sin_texto': sin_texto, 'texto_buscable': (tounicode and bool(p.extract_text().strip())) or sin_texto})
ok = all(x['paginas'] == 1 and (x['fuentes'] > 0 or x['sin_texto']) and x['texto_buscable'] for x in res)
json.dump({'total': len(res), 'ok': ok, 'nota': 'Chromium incrusta las fuentes web como Type 3 (contornos vectoriales) con ToUnicode: aspecto estable y texto buscable; no es editable como fuente en Illustrator.', 'pdf': res}, open(os.path.join(E4, 'validacion/pdf.json'), 'w'), ensure_ascii=False, indent=1)
print(len(res), 'PDF', 'ok' if ok else 'REVISAR')
