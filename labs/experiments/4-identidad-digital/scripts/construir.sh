#!/bin/sh
# Céluma · Experimento 04 · Reconstruye todo en orden (≈ 12 min). Uso: sh scripts/construir.sh
# La comparación A · B · C conserva la B de la ronda 1 (antecedente); el kit es B ronda 2.
# Para recapturar el original del lienzo (fidelidad de fondos) hace falta el preview 5050:
#   node scripts/ronda2/capturar-original.mjs   (opcional; las capturas ya están en ronda-2/referencia)
set -e
cd "$(dirname "$0")/.."
node scripts/exportar.mjs comparacion
node scripts/exportar.mjs kit --pdf
python3 scripts/contraste_real.py kit
node scripts/exportar.mjs ronda2
python3 scripts/contraste_real.py ronda2
python3 scripts/comprobar_pdf.py
python3 scripts/contraste.py
node scripts/recursos.mjs
node scripts/ronda2/fidelidad-fondos.mjs
/opt/homebrew/bin/python3.10 scripts/ronda2/fidelidad.py
for f in 1x1 4x5 9x16 191x1 16x9; do node scripts/exportar.mjs uno capacidad-revisor b $f --revision >/dev/null; mv validacion/tmp/capacidad-revisor__b__${f}__revision.png validacion/guias/guias-capacidad-revisor__${f}.png; done
node scripts/video.mjs
/opt/homebrew/bin/python3.10 scripts/comprobar_motion.py >/dev/null
sh scripts/hojas.sh
sh scripts/ronda2/hojas.sh
node scripts/manifiesto.mjs
sh scripts/empaquetar.sh
node scripts/manifiesto.mjs
