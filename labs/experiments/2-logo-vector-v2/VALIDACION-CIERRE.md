# Validación manual del cierre · 2026-09-26

*Registro histórico del cierre. La variante UI y la sección `#color-ui` que describe se retiraron el 2026-09-27, al aprobarse la paleta (ver más abajo).*

- SVG de la variante UI: comparación programática de `viewBox`, dimensiones, atributos `d` y transformaciones de todos los trazados contra el isotipo fiel y los cuatro lockups A de origen. Deben ser idénticos.
- Colores de salida: membrana y trazos `#49b6ad`; núcleo `#F98D84`; los otros tres pigmentos y el wordmark mantienen el color anterior. Contraste de la membrana: 2,45:1 sobre blanco, 2,27:1 sobre crema y 7,10:1 sobre navy; se usa como marca gráfica, no como texto ni señal única de estado. Sobre el propio teal se usaría la versión monocroma navy.
- Revisión visual completada en Chromium local: la sección maestro/UI permitía alternar isotipo, logo horizontal y vertical en la misma caja, con corte del 0 al 100 % y fondos blanco, crema y navy. La versión negativa se cargaba al elegir navy. A 390 px, sin desbordamiento (ancho del documento = 390 px) ni imágenes rotas.
- Navegación comprobada: índice del lab con tres estados, enlace directo a color UI y nueva entrada de motion. Se verificaron las rutas locales de seis páginas HTML (ningún recurso faltante), y la página de motion a 390 px (sin desbordamiento ni imagen rota). Consola del navegador sin errores ni avisos al revisar la variante UI.
- Límite: no se exportaron PNG de la variante UI ni se probaron impresión, Safari, Firefox, iOS o Android. Esas validaciones pertenecen a la incorporación por medio.

## Prueba cromática del 2026-09-27 (historial, descartada)

- Se probó en el isotipo UI un citoplasma `#7dd8d9` con rayos `#f4bd5a`. Acercaba membrana y trazos al citoplasma (ΔE00 10,6 y 1,48:1, frente a 18,0 y 1,84:1 con `#bbead2`). Rafael regresó el citoplasma a `#bbead2`.
- Con `#bbead2`, el ámbar `#f4bd5a` no mejoraba con claridad frente a `#f1c46c`: ΔE00 2,97; contraste 1,71 / 1,59 / 10,17:1 frente a 1,63 / 1,52 / 10,65:1 sobre blanco, crema y navy; sin diferencia apreciable a 24–48 px. Se mantuvieron los rayos originales.
- La comparación, sus alternativas, su script y su lámina se retiraron al aprobarse la paleta. Solo queda este registro y el historial de `DECISION.md`.

## Adopción de la paleta aprobada · 2026-09-27

**Aprobación:** Rafael, 2026-09-27. Paleta: membrana y trazos `#49B6AD`, citoplasma `#BBEAD2`, núcleo `#F98D84`, nucléolo `#E5635F`, rayos `#F1C46C`. Se aplica a todo el experimento 02 y es la base del 03. Aprobación en el laboratorio; incorporación canónica pendiente.

### Fuentes y generadores

- `master/celuma-paleta-aprobada.json` es la fuente única de la paleta. `build_svg.py` la lee y escribe el **maestro activo** `master/celuma-isotipo-maestro-paleta-aprobada.svg`, el isotipo de color, la versión reducida y el alias `svg/isotipo/celuma-isotipo-ui.svg`.
- `lockups.py`, `animation.py` y `fase-3/scripts/fase3.py` leen el maestro activo. `exports.py` y las páginas parten de esos SVG, así que regenerar no devuelve los colores anteriores.
- Rótulos veraces en generadores, láminas, vídeos y maquetas: «Aprobado en lab / en el experimento 02 · incorporación pendiente» o «Maqueta · aprobado en lab».
- El **maestro fiel histórico** `master/celuma-isotipo-maestro.svg` se regenera byte a byte igual y no cambió (git). Tampoco cambiaron el PNG fuente, `styles/` ni `assets/`.

### Regenerado

- **SVG:** isotipo color, reducido y 5 alias (`celuma-isotipo-ui.svg` y `svg/lockups/ui-baloo2/`, con el mismo cuerpo que sus archivos activos). Lockups A y B: en los 8 de color solo cambian los rellenos de membrana, núcleo y trazos, además de los metadatos; en los 8 monocromos solo cambian los metadatos. Wordmark, `transform` y `viewBox` son idénticos. Las monocromas y tramas del isotipo salen byte a byte iguales.
- **PNG:**
  - isotipo color a 64–1024 px, 8 lockups en color, favicon 16/32/48, apple-touch 180, icon-192 e icon-512-maskable;
  - 15 pruebas de mínimo `validation/minimos/color-*` (sustituyen a `fiel-*`) y las de lockups;
  - `validation/sizes/svg-aprobado-*`, láminas de mínimos y exportaciones, `exports-check.json`;
  - las 10 capturas de `examples/` y las vistas de `index.html` y `ejemplos.html`.
  - Los PNG monocromos salen byte a byte iguales.
- **Fase 2 (Mirada):**
  - 2 Lottie, 2 SVG animados, estático `celuma-isotipo-maestro-caja-anim.svg` y `review-data.js`;
  - métricas, 5 láminas y referencias de `validation/anim/`;
  - vídeo MP4/WebM y póster, vistas de `animacion.html`.
- **Fase 3 (Luz, Enfoque y Trazo):**
  - 32 Lottie, 5 SVG de Luz, 9 estáticos, `data.js` y `spec.json`;
  - métricas, 5 láminas, 5 vídeos MP4 + 5 WebM + 5 pósteres, `pagecheck` y 12 vistas.
- **Sin regenerar, rotulado como histórico:**
  - lo que produce `validate.py` (ajuste del maestro fiel al PNG: `metrics.json`, láminas de superposición, detalles ×8 y tamaños, `sizes/svg-*.png`);
  - `lamina-anim-trazos-ab.png`: A/B de paralaje, sin generador;
  - `lamina-tipografia-v2.png`: no contiene el logo.

### Comprobaciones

- **Paleta y geometría (`scripts/check_paleta.py` → `validation/paleta-check.json`): 14/14.**
  - El maestro activo iguala al histórico en elementos, ids, orden, anidación, `d` y atributos; solo cambian los rellenos.
  - En los 31 SVG en color (isotipo, alias, lockups A/B en color y alias, estáticos y SVG de las fases 2 y 3), los pigmentos del isotipo son los aprobados y cada trazado coincide con el maestro activo. La caja ajustada no cambia.
  - Monocromas (12 SVG): solo navy o blanco. Los 34 Lottie decodificados solo contienen la paleta aprobada más navy y blanco.
  - Ningún archivo activo contiene `#3baca6`, `#3cada7` ni `#f88e85`.
  - En 35 PNG/JPG (exportaciones, iconos, ejemplos y pósteres), ningún píxel de meseta tiene un color anterior. Los `#f88e85` que aparecen son mezclas de antialias en el borde núcleo–citoplasma. Las exportaciones de 100 px o más muestran los cinco pigmentos.
- **Tiempos y curvas.**
  - Comparación estructural con git: en los 2 Lottie de la fase 2 y los 32 de la fase 3 solo cambian los canales de color (`#3baca6`→`#49b6ad`, `#f88e85`→`#f98d84`), `nm` y `meta`. Ningún fotograma clave, tiempo ni curva cambió.
  - `anim-spec.json` es idéntico. En `fase-3/validation/spec.json` solo cambian el rótulo y los tamaños en bytes.
  - Los SVG animados solo cambian en rellenos y metadatos.
  - Los vídeos tienen los mismos fotogramas, duraciones y dimensiones. El póster de Mirada es el mismo fotograma (168, vídeo 3,30 s).
- **Último fotograma y reproducción, fase 2** (`validate_anim.py`, lottie-web 5.13.0, ThorVG vía dotlottie-web 0.80.0 y CSS en Chromium):
  - primer y último fotograma 20/20, con las mismas tolerancias que al cierre; lottie-web SVG a 1× y 2× 100 % idéntico al maestro activo;
  - bucle continuo en los tres reproductores; margen del nucléolo sin cambios;
  - movimiento reducido con los mismos resultados: CSS en línea y `<picture>` quedan estáticos; `<img>` con SVG animado sigue animándose, limitación conocida de Chromium ya documentada.
- **Fase 3** (`validate.py`, mismos reproductores): el resumen es idéntico al del cierre.
  - 12/32 últimos fotogramas idénticos píxel a píxel y 20/32 idénticos o iguales a su gemela cúbica.
  - Mismas listas `failing_strict` / `failing_band_criterion` (diferencias de teselado ya documentadas en `README-FASE3.md`).
  - Bucles que cierran, alfa 0 en el borde en todos los fotogramas, CSS correcto y 9/9 estáticos textualmente iguales a sus fuentes.
- **Páginas:**
  - `capture.mjs`: `index.html` y `ejemplos.html` a 1440 y 390 px sin errores, imágenes rotas ni desbordamiento.
  - `anim_page_check.mjs`: normal, reducido (banner y nada en marcha) y móvil sin errores; la comparación en vivo da 100 % de píxeles idénticos al maestro.
  - `fase-3/scripts/page_check.mjs`: file://, http, reducido y tres vistas a 390 px, sin errores, imágenes rotas ni recortes.
  - Rastreo de enlaces servido en `localhost:5050` sobre el lab, 02 (índice, ejemplos, animación, fase 3) y 03: 138 referencias locales con respuesta correcta, anclajes existentes y consola sin errores.
  - En `index.html` no queda `#color-ui`. El selector de «Antes / después» alterna el SVG aprobado y el maestro fiel histórico, con sus rótulos.
- **Límites:**
  - Solo Chromium en macOS. No se probaron Safari, Firefox, iOS ni Android: el WebKit de Playwright falla en este equipo.
  - No se probaron impresión/CMYK, lectores de pantalla ni pantallas reales.
  - A 320 px, la tabla de tamaños mínimos de `#reglas`, anterior a este cambio, desborda 16 px; a 390 y 1280 px no hay desbordamiento.
  - Los tokens y assets canónicos no se modificaron.
