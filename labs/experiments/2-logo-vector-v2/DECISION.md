# Decisión · Experimento 02 · identidad vectorial y movimiento

**Resultado: aprobado por Rafael, 2026-09-26, para avanzar a incorporación al Brand System.** Esta decisión aprueba el maestro geométrico, el wordmark A y las direcciones de motion. La alternativa cromática UI se compara con el maestro y queda pendiente de revisión; el uso de cualquier pieza en producto, publicaciones e impresos requiere incorporación y validación por medio.

## Identidad aprobada y color en revisión

- **Maestro geométrico:** `master/celuma-isotipo-maestro.svg`. Conserva el ajuste documentado al PNG original (IoU de silueta 0,999; error de borde medio 0,10 px). Su color medido sigue siendo la referencia fiel del raster.
- **Wordmark principal:** A · Baloo 2 800. Lockups horizontal y vertical; positivo, negativo y monocromo de la carpeta `svg/lockups/propuesta-a-baloo2/`. La opción B se conserva como comparación histórica, sin adoptarla como wordmark principal.
- **Variante cromática para UI, pendiente de revisión:** `svg/isotipo/celuma-isotipo-ui.svg` y los cuatro lockups en `svg/lockups/ui-baloo2/`. Membrana y trazos `#49b6ad`; núcleo `#F98D84`. La geometría, incluido el wordmark, es idéntica a las versiones de origen. Citoplasma `#bbead2`, nucléolo `#e5635f` y rayos `#f1c46c` permanecen como en el maestro: no hace falta cambiar el resto de la paleta para lograr el emparejamiento solicitado.
- **Dos lecturas de color en comparación:** maestro fiel al PNG para preservar la fuente; variante UI para aplicaciones que deban coincidir con los colores compartidos. La elección cromática final sigue sujeta a la revisión y los ajustes solicitados por Rafael; la variante UI no es una reproducción cromática exacta del PNG.
- **Adaptaciones aprobadas como familia:** monocromas y reducida 16–24 px bajo sus reglas de tamaño/fondo. Las maquetas son ejemplos, no autorizaciones de publicación.

## Motion aprobado

- **Mirada**, fase 2: isotipo que mira y llega al maestro, en versión única y bucle.
- **Luz, Enfoque y Trazo**, antigua fase 3 dentro de esta carpeta: direcciones aprobadas para carga, bienvenida y material visual respectivamente, con sus variantes de isotipo y lockup. A es el wordmark de referencia. Las variantes B quedan en el archivo comparativo.
- La aprobación visual no equivale a compatibilidad universal: antes de incorporar en producto hay que comprobar los formatos elegidos en Safari, Firefox, iOS y Android cuando corresponda, movimiento reducido, tamaño real y carga/performance. Las versiones animadas existentes cierran en el maestro **fiel**, no en la nueva variante UI; adaptar su color y revalidar el fotograma final es trabajo del experimento 03.

## Siguiente recorrido

1. `../3-logo-motion/`: experimento 03, dedicado solo a motion. Usa esta identidad aprobada como base y separa la iteración de movimiento de las decisiones estáticas.
2. Incorporar después los SVG, reglas y tokens que se elijan a los archivos canónicos del Brand System, con comparaciones visuales y estado actualizado.
3. Después, actualizar app, landing y demás repositorios en cambios propios, con sus pruebas. Ninguna migración entre repositorios se hizo en este cierre.

**Revisión manual pendiente por medio:** contraste y lectura a tamaño real sobre fondos permitidos; exportación PNG/favicon de la variante UI; impresión/CMYK; compatibilidad de los reproductores de motion fuera del entorno ya probado. Registro de comprobaciones de este cierre: `VALIDACION-CIERRE.md`.
