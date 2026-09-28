# Decisión · Experimento 02 · identidad vectorial y movimiento

**Resultado: aprobado por Rafael, 2026-09-26, para avanzar a incorporación al Brand System.** Esta decisión aprueba el maestro geométrico, el wordmark A y las direcciones de motion. **El 2026-09-27 Rafael aprobó además la paleta final del isotipo y pidió aplicarla a todo el experimento**, para que el experimento 03 arranque con ese logo vectorial. Es una aprobación en el laboratorio: el uso de cualquier pieza en producto, publicaciones e impresos requiere incorporación canónica y validación por medio.

## Identidad aprobada

- **Paleta aprobada (Rafael, 2026-09-27):** membrana y trazos `#49B6AD`, citoplasma `#BBEAD2`, núcleo `#F98D84`, nucléolo `#E5635F`, rayos `#F1C46C`. El wordmark A sigue en navy `#0d1b2a` (blanco en negativo). Fuente única para los generadores: `master/celuma-paleta-aprobada.json`.
  - **Alcance aplicado:** todas las piezas activas del experimento: isotipo y versión reducida, lockups A y B en color, PNG, favicon e iconos, ejemplos, Mirada (fase 2) y Luz, Enfoque y Trazo (fase 3) en Lottie, SVG animado y estáticos, datos de las galerías, láminas, vídeos y pósteres. Las monocromas y tramas conservan sus tintas navy/blanco.
  - **Qué cambia respecto al PNG medido:** membrana y trazos `#3baca6` → `#49b6ad` (ΔE00 3,1) y núcleo `#f88e85` → `#F98D84` (ΔE00 0,3), para coincidir con `--celuma-primary` y `--celuma-secondary`. Citoplasma, nucléolo y rayos conservan el valor medido.
  - **Qué no cambia:** trazados, recortes, transforms, proporciones, wordmark, tiempos, curvas y trayectorias. Comprobado con `scripts/check_paleta.py` y con la revalidación de las fases 2 y 3 (`VALIDACION-CIERRE.md`).
- **Maestro activo:** `master/celuma-isotipo-maestro-paleta-aprobada.svg`, fuente inequívoca de los entregables. Misma geometría y caja que el maestro fiel.
- **Maestro fiel histórico:** `master/celuma-isotipo-maestro.svg`, sin modificar. Conserva el ajuste documentado al PNG original (IoU de silueta 0,999; error de borde medio 0,10 px) y sus colores medidos. Es evidencia del ajuste geométrico, no un entregable. Sus métricas de color no describen la paleta aprobada.
- **Wordmark principal:** A · Baloo 2 800. Lockups horizontal y vertical; positivo, negativo y monocromo en `svg/lockups/propuesta-a-baloo2/`. La opción B se conserva como referencia tipográfica histórica, con el mismo isotipo, sin adoptarla como wordmark principal.
- **Alias de compatibilidad:** `svg/isotipo/celuma-isotipo-ui.svg` y los cuatro archivos de `svg/lockups/ui-baloo2/` se conservan porque había enlaces a esas rutas. Los generan los scripts con el mismo contenido y pigmentos que `svg/isotipo/celuma-isotipo-color.svg` y los lockups A en color. No son otra variante.
- **Adaptaciones aprobadas como familia:** monocromas y reducida 16–24 px bajo sus reglas de tamaño y fondo. Las maquetas son ejemplos, no autorizaciones de publicación.

### Historial cromático (trazabilidad, sin uso actual)

- 2026-09-26: al cierre se compararon el color fiel del PNG y una variante UI (membrana y trazos `#49b6ad`, núcleo `#F98D84`).
- 2026-09-27: se probó un citoplasma `#7dd8d9` con rayos ámbar `#f4bd5a`. Rafael regresó el citoplasma a `#bbead2`; con ese citoplasma el ámbar no mejoraba con claridad y se mantuvieron los rayos `#f1c46c`. Ambos colores quedan descartados.
- 2026-09-27: Rafael aprobó la paleta final. Se retiró la sección de comparación «Maestro vs. colores de la UI» de `index.html`, junto con sus controles, alternativas y evidencia. Ya hay una sola paleta.

## Motion aprobado

- **Mirada**, fase 2: isotipo que mira y llega al maestro, en versión única y bucle.
- **Luz, Enfoque y Trazo**, antigua fase 3 dentro de esta carpeta: direcciones aprobadas para carga, bienvenida y material visual respectivamente, con sus variantes de isotipo y lockup. A es el wordmark de referencia. Las variantes B quedan como referencia.
- Desde el 2026-09-27 todas las versiones animadas cierran en el **maestro activo con la paleta aprobada**. Se regeneraron y revalidaron con los mismos reproductores y criterios; tiempos y curvas no cambiaron.
- La aprobación visual no equivale a compatibilidad universal. Antes de incorporar en producto hay que comprobar, cuando corresponda, los formatos elegidos en Safari, Firefox, iOS y Android, además del movimiento reducido, el tamaño real y la carga/performance.

## Siguiente recorrido

1. `../3-logo-motion/`: experimento 03, dedicado solo a motion. Usa esta identidad y esta paleta aprobadas como única base y separa la iteración de movimiento de las decisiones estáticas.
2. Incorporar después a los archivos canónicos del Brand System (`assets/`, `styles/`) los SVG, las reglas y los tokens que se elijan, en un cambio propio, con comparaciones visuales y estado actualizado. Esta aprobación no modificó tokens ni assets canónicos.
3. Después, actualizar app, landing y demás repositorios en cambios propios, con sus pruebas. No se hizo ninguna migración entre repositorios.

**Revisión manual pendiente por medio:** contraste y lectura a tamaño real sobre los fondos permitidos en cada producto, impresión/CMYK y compatibilidad de los reproductores de motion fuera del entorno ya probado (Chromium). Registro de comprobaciones: `VALIDACION-CIERRE.md`.
