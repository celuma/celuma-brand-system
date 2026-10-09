"""Céluma · Experimento 04 · Comprobación del cierre (2026-10-07).

Compara la carpeta del experimento con el commit anterior al cierre (BASE) y comprueba que el cierre
solo cambió estado, rótulos, metadatos y paquetes:
  1. Ningún binario aprobado cambia (exports, motion, recursos PNG, ronda 2, marca). Excepciones medidas:
     las 5 guías activas (solo el rótulo, arriba a la derecha) y 4 hojas de contacto (solo la franja del título).
  2. Los SVG de recursos solo cambian en <desc>.
  3. Cada ZIP conserva los mismos archivos y sus binarios byte a byte (CRC), salvo la hoja comparacion-abc.
  4. El manifiesto lleva el estado de cada conjunto (B aprobada · A y C alternativas · B ronda 1 antecedente).
  5. Las 61 piezas renderizadas de nuevo con el código del cierre son idénticas (validacion/cierre-render.json,
     generado antes con node scripts/cierre-render.mjs).
  6. Los rótulos activos (galería, editor, pieza, espécimen, motion, LEEME, datos y entradas compartidas)
     no contienen estados contradictorios con DECISION.md.
Uso (desde la carpeta del experimento): python3 scripts/cierre.py   → validacion/cierre.json
Solo usa Pillow (python3 del sistema) y git.
"""
import io, json, re, subprocess, sys, zipfile
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image, ImageChops

BASE = '4c9d04a0af63faf6ce931d6c83294ca4dfee5d2a'
E4 = Path(__file__).resolve().parent.parent
RAIZ = E4.parents[2]
REL = E4.relative_to(RAIZ).as_posix()

def git(*a, binario=False):
    r = subprocess.run(['git', '-C', str(RAIZ), *a], capture_output=True, check=True)
    return r.stdout if binario else r.stdout.decode('utf-8')

def en_base(rel):
    return git('show', f'{BASE}:{REL}/{rel}', binario=True)

cambios = {}
for linea in git('diff', '--name-status', '--no-renames', BASE, '--', REL).splitlines():
    st, ruta = linea.split('\t', 1)
    cambios[ruta[len(REL) + 1:]] = st
for ruta in git('ls-files', '--others', '--exclude-standard', '--', REL).splitlines():
    cambios[ruta[len(REL) + 1:]] = 'A'

BIN = re.compile(r'\.(png|jpe?g|pdf|mp4|webm|zip)$', re.I)
GUIAS = {f'validacion/guias/guias-capacidad-revisor__{f}.png' for f in ('1x1', '4x5', '9x16', '191x1', '16x9')}
HOJAS = {f'validacion/hojas/{f}.png' for f in ('comparacion-abc', 'kit-carrusel-novedad', 'kit-horizontales-auxiliares', 'kit-identidad-producto')}
NUEVAS = re.compile(r'^validacion/vistas/cierre/')
res = {'fecha': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'base': BASE, 'binarios': {}, 'svg': {}, 'zips': {}, 'manifiesto': {}, 'rotulos': {}}

# 1 · Binarios
total_bin = [p for p in git('ls-tree', '-r', '--name-only', BASE, '--', REL).splitlines() if BIN.search(p) and not p.endswith('.zip')]
mal, medidos = [], []
for rel, st in sorted(cambios.items()):
    if not BIN.search(rel) or rel.endswith('.zip') or NUEVAS.match(rel):
        continue
    if st == 'D':
        mal.append(rel + ' (borrado)'); continue
    if rel in GUIAS or rel in HOJAS:
        a = Image.open(io.BytesIO(en_base(rel))).convert('RGB'); b = Image.open(E4 / rel).convert('RGB')
        caja = ImageChops.difference(a, b).getbbox() if a.size == b.size else None
        # Guía: rótulo de estado (top 12 px, alto 40, a la derecha). Hoja: franja del título (y < 70).
        ok = caja is not None and (caja[3] <= 60 and caja[0] >= a.size[0] * 0.45 if rel in GUIAS else caja[3] <= 70)
        medidos.append({'archivo': rel, 'tamano': list(a.size), 'caja_diferencias': list(caja) if caja else None, 'ok': ok})
        if not ok: mal.append(rel + ' (diferencia fuera del rótulo o del título)')
        continue
    mal.append(rel + ' (binario modificado)')
res['binarios'] = {'en_base': len(total_bin), 'modificados_fuera_de_excepciones': mal, 'excepciones_medidas': medidos,
                   'intactos': len(total_bin) - len([m for m in medidos]) - len(mal)}

# 2 · SVG de recursos: solo <desc>
desc = re.compile(rb'<desc>[^<]*</desc>')
svg_mal, svg_n = [], 0
for rel, st in cambios.items():
    if rel.endswith('.svg') and rel.startswith('recursos/') and st == 'M':
        svg_n += 1
        if desc.sub(b'', en_base(rel)) != desc.sub(b'', (E4 / rel).read_bytes()):
            svg_mal.append(rel)
otros_svg = [r for r, st in cambios.items() if r.endswith('.svg') and not r.startswith('recursos/')]
res['svg'] = {'modificados': svg_n, 'con_cambios_fuera_de_desc': svg_mal, 'otros_svg_modificados': otros_svg}

# 3 · ZIP: mismos archivos; binarios con el mismo CRC (salvo la hoja comparacion-abc, medida arriba)
zips_mal = []
for z in sorted((E4 / 'descargas').glob('*.zip')):
    rel = 'descargas/' + z.name
    antes = {i.filename: i.CRC for i in zipfile.ZipFile(io.BytesIO(en_base(rel))).infolist()}
    ahora = {i.filename: i.CRC for i in zipfile.ZipFile(z).infolist()}
    distintos = sorted(n for n in ahora if n in antes and antes[n] != ahora[n])
    bin_dist = [n for n in distintos if BIN.search(n) and n != 'validacion/hojas/comparacion-abc.png']
    info = {'archivos': len(ahora), 'iguales': len(ahora) - len(distintos), 'actualizados': distintos,
            'faltan': sorted(set(antes) - set(ahora)), 'nuevos': sorted(set(ahora) - set(antes)), 'binarios_distintos': bin_dist}
    # Únicas adiciones previstas: los verificadores del cierre, que entran en el paquete editable con el resto de scripts/.
    info['ok'] = not info['faltan'] and not [n for n in info['nuevos'] if n not in ('scripts/cierre.py', 'scripts/cierre-render.mjs')] and not bin_dist and 'LEEME.txt' in distintos
    if not info['ok']: zips_mal.append(z.name)
    res['zips'][z.name] = info

# 4 · Estados del manifiesto
m = json.loads((E4 / 'manifest.json').read_text('utf-8'))
A = m['archivos']
def todos(f, patron): return all(re.search(patron, a['estado']) for a in A if f(a))
res['manifiesto'] = {
    'decision': m.get('decision', {}),
    'kit_aprobado': todos(lambda a: a['conjunto'] == 'kit', r'^Aprobada en el laboratorio \(Rafael, 2026-10-07\)'),
    'ronda2_aprobada': todos(lambda a: a['conjunto'] == 'ronda-2' and a['tipo'] != 'antes-despues', r'^Aprobada en el laboratorio'),
    'recursos_aprobados': todos(lambda a: a['tipo'] == 'recurso', r'^Aprobada en el laboratorio'),
    'motion_muestra_aprobada': todos(lambda a: a['conjunto'] == 'motion', r'^Muestra de B aprobada'),
    'a_c_alternativas': todos(lambda a: a['conjunto'] == 'comparacion' and a['id'][0] in 'ac', r'^Alternativa conservada'),
    'b1_antecedente': todos(lambda a: a['conjunto'] == 'comparacion' and a['id'][0] == 'b', r'^Antecedente histórico'),
}
manifiesto_ok = all(v for k, v in res['manifiesto'].items() if k != 'decision') and res['manifiesto']['decision'].get('fecha') == '2026-10-07'

# 5 · Rótulos activos sin estados contradictorios
PROHIBIDO = re.compile(r'pendiente de (la )?aprobaci[oó]n|Decisi[oó]n \(pendiente\)|no aprobad[ao]|[Rr]ecomendaci[oó]n candidata|[Cc]andidat[ao]|CANDIDAT|Exploraci[oó]n · pendiente|PENDIENTE\.')
HISTORICO = ['cuando B era la recomendación candidata de Claude']  # frase de registro en la galería §3
def bloque(texto, inicio, fin):
    i = texto.index(inicio); return texto[i:texto.index(fin, i)]
lab = (RAIZ / 'labs/index.html').read_text('utf-8')
fuentes = {
    'index.html': (E4 / 'index.html').read_text('utf-8'),
    'galeria.js': (E4 / 'galeria.js').read_text('utf-8'),
    'galeria-datos.js': (E4 / 'galeria-datos.js').read_text('utf-8'),
    'kit/editor.html': (E4 / 'kit/editor.html').read_text('utf-8'),
    'kit/pieza.html': (E4 / 'kit/pieza.html').read_text('utf-8'),
    'kit/microcosmos.html': (E4 / 'kit/microcosmos.html').read_text('utf-8'),
    'motion/motion.html': (E4 / 'motion/motion.html').read_text('utf-8'),
    'descargas/LEEME.txt': (E4 / 'descargas/LEEME.txt').read_text('utf-8'),
    'README.md': (E4 / 'README.md').read_text('utf-8'),
    'manifest.json · estados': '\n'.join([m['estado']] + sorted({a['estado'] for a in A})),
    'recursos/*.json · estado': '\n'.join(json.loads((E4 / p).read_text('utf-8'))['estado'] for p in ('recursos/recursos.json', 'recursos/ronda-2.json', 'recursos/microcosmos/catalogo.json')),
    'labs/index.html · tarjeta 04': bloque(lab, '<h3>04 ·', '</div>\n          <a href="experiments/4-identidad-digital/index.html"'),
    'labs/index.html · aviso': bloque(lab, '<div class="lab-notice"', '</div>'),
    'labs/README.md · entrada 04': next(l for l in (RAIZ / 'labs/README.md').read_text('utf-8').splitlines() if l.startswith('- `experiments/4-identidad-digital/`')),
    'docs/estado-de-piezas.md · fila 04': next(l for l in (RAIZ / 'docs/estado-de-piezas.md').read_text('utf-8').splitlines() if l.startswith('| Experimento 04')),
}
for nombre, t in fuentes.items():
    for h in HISTORICO: t = t.replace(h, '')
    res['rotulos'][nombre] = sorted({x.group(0) for x in PROHIBIDO.finditer(t)})
rotulos_mal = {k: v for k, v in res['rotulos'].items() if v}

render = json.loads((E4 / 'validacion' / 'cierre-render.json').read_text('utf-8')) if (E4 / 'validacion' / 'cierre-render.json').exists() else {'ok': False, 'resumen': 'sin ejecutar scripts/cierre-render.mjs'}
res['render'] = render
res['ok'] = not mal and not svg_mal and not otros_svg and not zips_mal and manifiesto_ok and not rotulos_mal and render['ok']
b = res['binarios']
res['resumen'] = (f"{b['intactos']}/{b['en_base']} binarios intactos; {len(medidos)} con cambio medido solo en rótulo o título · "
                  f"{svg_n} SVG solo con <desc> nuevo · {len(res['zips']) - len(zips_mal)}/{len(res['zips'])} ZIP con binarios intactos · "
                  f"estados del manifiesto {'correctos' if manifiesto_ok else 'REVISAR'} · rótulos contradictorios: {sum(len(v) for v in rotulos_mal.values())} · "
                  f"render: {render['resumen']}")
(E4 / 'validacion' / 'cierre.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), 'utf-8')
print(res['resumen'])
for x in mal + svg_mal + otros_svg + zips_mal: print('  XX', x)
for k, v in rotulos_mal.items(): print('  XX rótulo', k, v)
sys.exit(0 if res['ok'] else 1)
