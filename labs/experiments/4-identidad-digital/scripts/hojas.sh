#!/bin/sh
# Céluma · Experimento 04 · Hojas de contacto de revisión (validacion/hojas). Uso: sh scripts/hojas.sh
set -e
cd "$(dirname "$0")/.."
H=validacion/hojas; C=exports/comparacion; K=exports/kit; T=validacion/tmp/frames
mkdir -p $H $T
python3 scripts/hoja.py $H/comparacion-abc.png 520 "Experimento 04 · ronda 1 · A Lumen (alternativa) · B Ficha ronda 1 (antecedente de la elegida) · C Membrana (alternativa) · misma escala" \
  $C/a/valor-claridad__4x5.png $C/b/valor-claridad__4x5.png $C/c/valor-claridad__4x5.png $C/a/valor-claridad__9x16.png $C/b/valor-claridad__9x16.png $C/c/valor-claridad__9x16.png -- \
  $C/a/capacidad-revisor__4x5.png $C/b/capacidad-revisor__4x5.png $C/c/capacidad-revisor__4x5.png $C/a/capacidad-revisor__9x16.png $C/b/capacidad-revisor__9x16.png $C/c/capacidad-revisor__9x16.png -- \
  $C/a/carrusel-informe-1__4x5.png $C/b/carrusel-informe-1__4x5.png $C/c/carrusel-informe-1__4x5.png $C/a/carrusel-informe-4__4x5.png $C/b/carrusel-informe-4__4x5.png $C/c/carrusel-informe-4__4x5.png
python3 scripts/hoja.py $H/kit-identidad-producto.png 470 "Kit B · valores, identidad y producto (aprobado en el laboratorio, 2026-10-07)" \
  $K/valor-claridad__4x5.png $K/valor-precision__4x5.png $K/valor-seguridad__4x5.png $K/valor-confianza__4x5.png $K/valor-humanidad__4x5.png $K/valores-resumen__4x5.png -- \
  $K/identidad-nombre__4x5.png $K/capacidad-revisor__4x5.png $K/capacidad-emitidos__4x5.png $K/consejo-revisor__4x5.png $K/consejo-muestra__4x5.png $K/demo__4x5.png $K/flujo-informe__4x5.png
python3 scripts/hoja.py $H/kit-carrusel-novedad.png 470 "Kit B · carrusel de 7 láminas y novedad (aprobado en el laboratorio, 2026-10-07)" \
  $K/carrusel-informe-1__4x5.png $K/carrusel-informe-2__4x5.png $K/carrusel-informe-3__4x5.png $K/carrusel-informe-4__4x5.png $K/carrusel-informe-5__4x5.png $K/carrusel-informe-6__4x5.png $K/carrusel-informe-7__4x5.png -- \
  $K/novedad-131__4x5.png $K/novedad-131__9x16.png $K/novedad-131__1x1.png $K/demo__9x16.png $K/capacidad-revisor__9x16.png $K/flujo-informe__9x16.png $K/valor-claridad__9x16.png
python3 scripts/hoja.py $H/kit-horizontales-auxiliares.png 330 "Kit B · horizontales, presentación, perfil, destacados, banner y firma (aprobado en el laboratorio, 2026-10-07)" \
  $K/capacidad-revisor__191x1.png $K/capacidad-revisor__16x9.png $K/novedad-131__191x1.png $K/novedad-131__16x9.png -- \
  $K/demo__16x9.png $K/flujo-informe__16x9.png $K/identidad-nombre__16x9.png $K/slide-titulo__16x9.png $K/slide-contenido__16x9.png -- \
  $K/portada__portada.png $K/banner-docs__banner.png $K/firma-correo__firma.png -- \
  $K/avatar__avatar.png $K/destacado-guias__destacado.png $K/destacado-novedades__destacado.png $K/destacado-flujo__destacado.png $K/destacado-valores__destacado.png
python3 - <<'PY'
from PIL import Image
E='exports/comparacion'
ims=[Image.open(f'{E}/{d}/capacidad-revisor__4x5.png') for d in 'abc']+[Image.open(f'{E}/{d}/carrusel-informe-4__4x5.png') for d in 'abc']
sc=[im.resize((390, round(im.height*390/im.width)), Image.LANCZOS) for im in ims]
out=Image.new('RGB',(390*3+40, sc[0].height*2+30),(233,228,218))
for k,i in enumerate(sc): out.paste(i,((k%3)*410,(k//3)*(i.height+30)))
out.save('validacion/hojas/movil-390.png')
PY
for t in 0.5 1.5 2.5 3.3 4.0 4.9 5.15 5.5 6.0 9.9; do ffmpeg -loglevel error -y -ss $t -i motion/intro-novedad.mp4 -frames:v 1 -vf scale=640:-1 $T/i-$t.png; done
python3 scripts/hoja.py $H/motion-fotogramas.png 300 "Intro + novedad · 0,5 · 1,5 · 2,5 · 3,3 · 4,0 s (Orden, 03) | 4,9 · 5,15 · 5,5 · 6,0 · 9,9 s (Relevo y ficha)" \
  $T/i-0.5.png $T/i-1.5.png $T/i-2.5.png $T/i-3.3.png $T/i-4.0.png -- $T/i-4.9.png $T/i-5.15.png $T/i-5.5.png $T/i-6.0.png $T/i-9.9.png
for t in 0.3 0.8 1.3 2.2 3.1 4.0 4.8 8.9; do ffmpeg -loglevel error -y -ss $t -i motion/paso-a-paso.mp4 -frames:v 1 -vf scale=-1:640 $T/p-$t.png; done
python3 scripts/hoja.py $H/motion-paso-a-paso.png 520 "Paso a paso · 0,3 · 0,8 · 1,3 · 2,2 · 3,1 · 4,0 · 4,8 · 8,9 s" $T/p-0.3.png $T/p-0.8.png $T/p-1.3.png $T/p-2.2.png $T/p-3.1.png $T/p-4.0.png $T/p-4.8.png $T/p-8.9.png
rm -rf validacion/tmp
ls $H
