#!/bin/sh
# Céluma · Experimento 04 · Paquetes de descarga (zip del sistema). Uso: sh scripts/empaquetar.sh
set -e
cd "$(dirname "$0")/.."
mkdir -p descargas
rm -f descargas/*.zip
cp descargas/LEEME.txt LEEME.txt
zip -qr descargas/celuma-04-kit-editable.zip LEEME.txt README.md kit scripts motion/motion.html motion/motion.js -x '*/.DS_Store' '*/__pycache__/*'
zip -qr descargas/celuma-04-exports-png.zip LEEME.txt manifest.json exports/kit -x 'exports/kit/pdf/*' '*/.DS_Store'
zip -qr descargas/celuma-04-exports-pdf.zip LEEME.txt exports/kit/pdf -x '*/.DS_Store'
zip -qr descargas/celuma-04-recursos.zip LEEME.txt recursos/svg recursos/png recursos/recursos.json kit/marca -x '*/.DS_Store'
zip -qr descargas/celuma-04-motion.zip LEEME.txt motion/*.mp4 motion/*.webm motion/*-poster.jpg motion/*-final.png
zip -qr descargas/celuma-04-comparacion.zip LEEME.txt exports/comparacion validacion/hojas/comparacion-abc.png -x '*/.DS_Store'
zip -qr descargas/celuma-04-ronda-2-fondos-microcosmos.zip LEEME.txt recursos/fondos recursos/microcosmos recursos/ronda-2.json kit/microcosmos.js kit/microcosmos.html -x '*/.DS_Store'
zip -qr descargas/celuma-04-ronda-2-evidencia.zip LEEME.txt REFINAMIENTO-B.md ronda-2 -x '*/.DS_Store'
rm LEEME.txt
ls -la descargas
