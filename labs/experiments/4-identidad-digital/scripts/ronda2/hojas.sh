#!/bin/sh
# Céluma · 04 · ronda 2 · Hojas de revisión (ronda-2/hojas). Uso: sh scripts/ronda2/hojas.sh
set -e
cd "$(dirname "$0")/../.."
H=ronda-2/hojas; A=ronda-2/antes/piezas; D=ronda-2/despues; F=recursos/fondos/png; R=ronda-2/referencia; M=recursos/microcosmos/png
mkdir -p $H
python3 scripts/hoja.py $H/fondos-fidelidad.png 400 "Fondos · original del lienzo (izq.) y versión local del 04 (der.) · 280 × 200 a 2×" $R/original-pat-cream@2x.png $R/local-papel@2x.png $R/original-pat-navy@2x.png $R/local-navy@2x.png
python3 scripts/hoja.py $H/fondos-formatos.png 520 "Fondos rescatados por proporción · Papel cream, Papel suave, Navy, Navy suave" \
  $F/fondo-papel-4x5.png $F/fondo-papel-suave-4x5.png $F/fondo-navy-4x5.png $F/fondo-navy-suave-4x5.png $F/fondo-papel-9x16.png $F/fondo-navy-9x16.png -- \
  $F/fondo-papel-1x1.png $F/fondo-navy-1x1.png $F/fondo-papel-16x9.png $F/fondo-navy-16x9.png
python3 scripts/hoja.py $H/biblioteca.png 300 "Microcosmos · 9 recursos en claro y oscuro (muestras a 1200 × 900)" \
  $M/celula-protagonista-claro-muestra.png $M/celula-protagonista-oscuro-muestra.png $M/celula-acompanante-claro-muestra.png $M/celula-acompanante-oscuro-muestra.png $M/membrana-abierta-claro-muestra.png $M/membrana-abierta-oscuro-muestra.png -- \
  $M/grupo-asimetrico-claro-muestra.png $M/grupo-asimetrico-oscuro-muestra.png $M/grupo-par-claro-muestra.png $M/grupo-par-oscuro-muestra.png $M/campo-perimetral-claro-muestra.png $M/campo-perimetral-oscuro-muestra.png -- \
  $M/campo-ordenado-claro-muestra.png $M/campo-ordenado-oscuro-muestra.png $M/recorte-perimetral-claro-muestra.png $M/recorte-perimetral-oscuro-muestra.png $M/foco-separador-claro-muestra.png $M/foco-separador-oscuro-muestra.png
python3 scripts/hoja.py $H/antes-despues-4x5.png 520 "Antes (ronda 1) | después (ronda 2) · mismo texto y escala" \
  $A/valor-claridad__4x5.png $D/valor-claridad__4x5.png $A/identidad-nombre__4x5.png $D/identidad-nombre__4x5.png $A/capacidad-revisor__4x5.png $D/capacidad-revisor__4x5.png -- \
  $A/carrusel-informe-1__4x5.png $D/carrusel-informe-1__4x5.png $A/carrusel-informe-4__4x5.png $D/carrusel-informe-4__4x5.png $A/carrusel-informe-7__4x5.png $D/carrusel-informe-7__4x5.png
python3 scripts/hoja.py $H/antes-despues-formatos.png 520 "Antes | después · 9:16, 1:1 y 16:9" \
  $A/valor-claridad__9x16.png $D/valor-claridad__9x16.png $A/novedad-131__9x16.png $D/novedad-131__9x16.png $A/capacidad-revisor__1x1.png $D/capacidad-revisor__1x1.png -- \
  $A/slide-titulo__16x9.png $D/slide-titulo__16x9.png
K=exports/kit
python3 scripts/hoja.py $H/modos.png 520 "Tres modos de B · editorial sobrio · atmosférico · microcosmos" \
  $K/capacidad-revisor__4x5.png $K/carrusel-informe-4__4x5.png $K/flujo-informe__4x5.png -- $K/valor-claridad__4x5.png $K/valor-seguridad__4x5.png $K/consejo-revisor__4x5.png $K/novedad-131__4x5.png -- $K/identidad-nombre__4x5.png $K/demo__4x5.png $K/carrusel-informe-1__4x5.png
python3 scripts/hoja.py $H/serie-valores.png 520 "Serie de valores · un recurso propio por valor" $K/valor-claridad__4x5.png $K/valor-precision__4x5.png $K/valor-seguridad__4x5.png $K/valor-confianza__4x5.png $K/valor-humanidad__4x5.png $K/valores-resumen__4x5.png
python3 - <<'PY'
from PIL import Image
D='ronda-2/despues'
ims=[Image.open(f'{D}/{n}') for n in ['valor-claridad__4x5.png','identidad-nombre__4x5.png','carrusel-informe-1__4x5.png','carrusel-informe-7__4x5.png','capacidad-revisor__4x5.png','novedad-131__9x16.png']]
sc=[im.resize((390, round(im.height*390/im.width)), Image.LANCZOS) for im in ims]
h=max(i.height for i in sc); out=Image.new('RGB',(410*len(sc),h),(233,228,218))
for k,i in enumerate(sc): out.paste(i,(k*410,0))
out.save('ronda-2/hojas/movil-390.png')
PY
ls $H
