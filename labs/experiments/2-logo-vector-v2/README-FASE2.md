# Isotipo animado · fase 2

**Estado actual: Mirada aprobada visualmente por Rafael el 2026-09-26** como parte del experimento 02; ver `DECISION.md`. El texto restante documenta la fase de exploración y sus límites técnicos. La base es el maestro activo `master/celuma-isotipo-maestro-paleta-aprobada.svg`, con la paleta aprobada el 2026-09-27. Ese día se regeneraron Lottie, SVG animado, estático de respaldo, datos de la página, vídeo y póster, y se repitió la validación (§5, `../VALIDACION-CIERRE.md`): tiempos, curvas y trayectoria son idénticos y el último fotograma coincide con el maestro activo. Aún no se ha incorporado a producto. Las cifras de color que siguen se refieren a la versión regenerada salvo que se indique lo contrario.

**El entregable de esta fase es el isotipo.** D-1 se resolvió después a favor de A · Baloo 2 800; esta pieza no contiene lockup animado.

- **Revisión visual:** [`animacion.html`](animacion.html). Tiene reproductor, controles, versiones, fondos, escalas, comparación en vivo con el maestro, vídeo y métricas. Se abre como archivo o con `python3 -m http.server 8000` desde la raíz de `celuma-brand-system` → `http://localhost:8000/labs/experiments/2-logo-vector-v2/animacion.html`.
- **Vídeo para revisar el ritmo:** [`anim/preview/celuma-isotipo-anim-preview.mp4`](anim/preview/celuma-isotipo-anim-preview.mp4), también en WebM.
- **Brief original:** [`ANIMATION-BRIEF.md`](ANIMATION-BRIEF.md). Los ajustes respecto de él están en §3.

## 1. Rutas

| Ruta | Qué es | Peso (gzip) |
|---|---|---|
| `anim/celuma-isotipo-once.json` | Lottie (Bodymovin 5.x), **una reproducción**, 3,20 s, 60 fps, 557 × 678 | 10 559 B (2 984 B) |
| `anim/celuma-isotipo-loop.json` | Lottie, **bucle** de 4,80 s que cierra sin salto | 14 809 B (3 124 B) |
| `anim/celuma-isotipo-once.svg` | SVG + CSS `@keyframes`, una reproducción (opción ligera) | 8 894 B (2 780 B) |
| `anim/celuma-isotipo-loop.svg` | SVG + CSS, bucle | 10 934 B (2 872 B) |
| `anim/celuma-isotipo-maestro-caja-anim.svg` | Maestro **estático** en la misma caja: respaldo y movimiento reducido | 4 082 B (2 177 B) |
| `anim/preview/celuma-isotipo-anim-preview.mp4` · `.webm` | Vista previa de 18,4 s, 1280 × 720, 60 fps (H.264 / VP9). Una reproducción ×2 y bucle ×2 sobre crema, navy y blanco | ~0,6 / ~0,75 MB |
| `anim/review-data.js` | Los mismos JSON y SVG incrustados para que `animacion.html` funcione como archivo local | 49 930 B |
| `animacion.html` | Página de revisión | — |
| `vendor/lottie-web-5.13.0/` | Reproductor de la página de revisión (MIT, §6). **No** es una dependencia de producción | 305 704 B |
| `validation/anim-metrics.json` · `.js` | Todas las métricas de §5 | — |
| `validation/lamina-anim-*.png` | Láminas: fotogramas clave, curvas, último fotograma vs maestro, tamaños y A/B de trazos | — |
| `validation/anim/` | Renders de referencia del maestro (`ref-*.png`). Los renders de cada reproductor (~21 MB) no se guardan: se regeneran con `validate_anim.py` | — |
| `scripts/animation.py` | Genera JSON, SVG y datos desde **una sola especificación de tiempos** | — |
| `scripts/validate_anim.py` · `anim_render.mjs` · `anim_video.mjs` · `anim_curves.py` · `anim_page_check.mjs` | Validación, vídeo, curvas y prueba de la página | — |

La caja de la animación es la caja de entrega del isotipo (73 42 549 670) con **4 px de margen** por lado (69 38 557 678). Así ningún antialias toca el borde; la caja ajustada de la fase 1 dejaba la membrana a 0,14 px del límite.

## 2. Qué se mueve y qué no

- **Fijos en todos los fotogramas:** membrana, citoplasma, núcleo y trazos. En Lottie, la capa `celula-fija` no tiene ni una clave. En render, la zona estática no cambia ni un píxel en los 480 fotogramas.
- **La mirada:** traslación de `#nucleolo` dentro del núcleo. Nada más cambia de posición. No se añadieron ojos, caras, destellos, brillos, sombras ni desenfoques.
- **Los rayos:** crecen a lo largo de su propio eje desde la base (el extremo junto a la célula) y pasan de opacidad 0 a 1.
  - En Lottie se hace con un **morph del trazado**: la última clave *es* el trazado del maestro, sin transformación.
  - En CSS se hace con una escala axial `translate·rotate·scaleX·rotate·translate`, con `animation-fill-mode: backwards`. Al terminar, el elemento vuelve a su estilo base: `transform: none`, `opacity: 1`.
- **Final:** el maestro exacto. Las transformaciones valen identidad, las opacidades 1, y la geometría y los colores son los del maestro (§5).

## 3. Tiempos (60 fps) y ajustes respecto del brief

**Una reproducción: 192 fotogramas, 3,20 s**

| Tiempo | Fotogramas | Momento | Detalle | Easing |
|---|---|---|---|---|
| 0,00–0,30 s | 0–18 | Reposo | Célula sin rayos; nucléolo en su posición maestra | — |
| 0,30–0,75 s | 18–45 | Mira a la izquierda | Nucléolo Δ(−93,4 ; +31,0) | `cubic-bezier(.45,0,.55,1)` |
| 0,75–1,00 s | 45–60 | Pausa | — | — |
| 1,00–1,50 s | 60–90 | Mira a la derecha | Nucléolo Δ(+22,6 ; +31,0) | `cubic-bezier(.45,0,.55,1)` |
| 1,50–1,75 s | 90–105 | Pausa | — | — |
| 1,75–2,05 s | 105–123 | «Eureka» | Vuelve a la mirada del maestro (arriba a la derecha) con un sobreimpulso de ~4 px | `cubic-bezier(.34,1.56,.64,1)` |
| 2,05–2,30 s | 123–138 | **Pausa eureka** | Nada se mueve | — |
| 2,30–2,80 s | 138–168 | Rayos como luz | Rayo 3 → 2 → 1, escalonados 70 ms, 0,36 s cada uno. Opacidad en el primer 25 % del tramo | `cubic-bezier(.22,1,.36,1)`; opacidad `(0,0,.58,1)` |
| 2,80–3,20 s | 168–192 | Final | **Maestro exacto, estático** | — |

**Bucle: 288 fotogramas, 4,80 s.** Arranca en el maestro y queda quieto 0,6 s. Luego los rayos se retraen hacia su base: 0,60–0,98 s, en orden 1 → 2 → 3, escalonados 40 ms, 0,30 s cada uno, con `cubic-bezier(.55,0,1,.45)`. Después sigue la misma secuencia de la versión de una reproducción, desplazada 0,60 s. El movimiento termina en 3,40 s y el maestro queda quieto hasta 4,80 s. Entre ciclos hay **2,0 s de maestro en reposo**. El último fotograma es idéntico al primero y los rayos se apagan y encienden una sola vez por ciclo, sin destellos.

**Ajustes tras la inspección** (curvas en `validation/lamina-anim-curvas.png`, fotogramas y vídeo):

1. **Pausa «eureka» explícita (+0,25 s).** Con los tiempos del brief, los rayos empezaban en 1,70 s, antes de que el nucléolo se asentara (1,75 s). No había pausa de descubrimiento, que es lo que pide la narrativa.
2. **Reposo inicial de 0,30 s** (antes 0,10 s). Con 0,10 s, la célula empezaba a moverse casi al aparecer y no daba tiempo a reconocerla.
3. **Pausas tras cada mirada de 0,25 s** (antes 0,20 s), para que cada dirección se lea como una mirada y no como un balanceo continuo.
4. **Fundido de los rayos al 25 %** del tramo (antes 40 %). Sobre navy, el amarillo a opacidad parcial se veía pardo durante demasiados fotogramas.
5. **Trazos fijos.** En el A/B con paralaje de ±6 px (`validation/lamina-anim-trazos-ab.png`) el movimiento apenas se percibe y no mejora la lectura. Con más desplazamiento se leería como una «boca» que se desliza dentro de una cabeza fija, lo que cambiaría la identidad. El generador conserva la opción (`CELUMA_TRAZOS_DX`) para reevaluarlo.
6. **Duración total: 3,20 s** frente a los 2,60 s del brief. Es una consecuencia de los puntos 1–3.

## 4. Formatos y compatibilidad

**Lottie.** Solo usa capas de forma (`ty: 4`) con trazados, rellenos y transformaciones:

- no hay expresiones, efectos, máscaras, mates, *merge paths*, texto, imágenes, 3D ni *time remap*;
- tiene 6 capas: `trazos`, `nucleolo`, `celula-fija` y `rayo-1..3`;
- incluye marcadores (`markers`) con las fases, útiles para saltar a un momento.

Los colores se guardan como (k + 0,25)/255. Así, tanto los reproductores que truncan (lottie-web) como los que redondean dan exactamente el color del maestro. Con k/255 redondeado a seis decimales, lottie-web pintaba (ejemplo histórico, con el color del maestro fiel) `#3baca5` en lugar de `#3baca6`: se detectó en la validación y está corregido.

| Entorno | Estado |
|---|---|
| lottie-web 5.13.0 en Chromium, renderizador **SVG** | **Probado**: primer y último fotograma idénticos píxel a píxel al maestro, a 1× y 2× |
| lottie-web 5.13.0 en Chromium, renderizador **canvas** | **Probado**: colores exactos; solo cambia el antialias de los bordes |
| ThorVG (`@lottiefiles/dotlottie-web` 0.80.0, WASM) en Chromium | **Probado**: colores exactos; solo cambia el antialias de los bordes |
| SVG + CSS en línea, en Chromium | **Probado**: al terminar es idéntico al maestro; `prefers-reduced-motion` respetado |
| SVG + CSS como `<img>`, en Chromium | **Probado**: se anima, pero **ignora `prefers-reduced-motion`** (ver §6) |
| lottie-ios, lottie-android, Safari/WebKit, Firefox, Figma o After Effects | **No probado.** El WebKit de Playwright no arranca en este macOS (segfault) y no hay simulador ni emulador preparado. No se afirma compatibilidad |

## 5. Validación: tolerancias y resultados

Todo se renderizó con reproductores reales en Chromium headless (Playwright) y se comparó con el maestro rasterizado por el mismo navegador. Cada fotograma Lottie se dibuja en un DOM nuevo del reproductor. Las capturas secuenciales en una misma página mostraban ruido de repintado parcial de Chromium: hasta 255 en píxeles sueltos de borde, incluido el borde de la membrana, que no se anima. Ese ruido desaparece al renderizar en limpio.

**Tolerancias declaradas**

- **E** (estado estático final): 100 % de píxeles RGBA idénticos al maestro.
- **T1** (lottie-web SVG):
  - IoU de silueta ≥ 0,9999;
  - |Δα| > 2/255 solo dentro de la banda de antialias de 1 px;
  - ΔE00 máximo en zonas de color plano ≤ 0,5.
- **T2** (canvas, ThorVG y SVG CSS mientras se anima):
  - IoU ≥ 0,999;
  - |Δα| > 2/255 solo en la banda de antialias;
  - ΔE00 en planos con media ≤ 0,5 y máximo ≤ 1,0.

**Resultados** (`validation/anim-metrics.json`)

| Comprobación | Resultado |
|---|---|
| Primer y último fotograma, 20 comparaciones (once/loop × SVG, canvas, ThorVG, CSS, 2×, CSS terminado, `<picture>`) | **20/20 cumplen su tolerancia** |
| lottie-web SVG · último fotograma vs maestro (1× y 2×) | **100 % de píxeles idénticos** |
| lottie-web SVG · primer fotograma de la versión de una reproducción vs maestro sin rayos | 100 % idénticos |
| lottie-web canvas y ThorVG · último fotograma | IoU 0,9997 y 0,9993; ΔE00 en planos **0,0**; diferencias solo en el antialias |
| SVG CSS al terminar, y `<picture>` tras la animación | 100 % idénticos; `transform: none` y `opacity: 1` en todas las capas animadas |
| **Cierre del bucle** (último fotograma vs primero) | **100 % idénticos** en lottie-web SVG, canvas y ThorVG |
| Zona estática en los 480 fotogramas | 0 píxeles cambian |
| Borde de la caja en todos los fotogramas | alfa 0: nada toca el borde ni se recorta |
| Nucléolo | Margen mínimo de **19,5 px** dentro del núcleo (en reposo, 25,9 px). El centroide renderizado sigue la especificación a ±0,07 px |
| Parpadeo | Sin saltos entre fotogramas consecutivos. Los rayos se apagan y encienden una vez por ciclo |
| Legibilidad | Fotogramas clave a 32, 48, 64 y 128 px sobre blanco, crema y navy (`validation/lamina-anim-tamanos.png`). La mirada se distingue desde 32 px y los rayos desde 48 px |
| Rendimiento (Chromium headless, indicativo) | Buscar un fotograma: ~0,02 ms. Reproducción: rAF de mediana 8,3 ms, p95 ≤ 10 ms, 0 fotogramas > 20 ms. ThorVG, de `setFrame` a pantalla: ~30 ms (incluye un rAF y eventos). No se midió en dispositivos reales |
| **Movimiento reducido** | SVG en línea: maestro estático (idéntico). `<picture>` con fuente estática: maestro (idéntico). **`<img>` con el SVG animado: se anima igual.** Página de revisión: muestra el último fotograma y no arranca sola |
| Página `animacion.html` | Sin errores de consola ni imágenes rotas, sin desbordamiento a 390 px y controles comprobados (`validation/animacion-check.json`) |

## 6. Decisiones y límites a tener en cuenta

- **Movimiento reducido con `<img>`.** Chromium no aplica `prefers-reduced-motion` dentro de un SVG usado como imagen; está verificado. Para integrarlo hay tres opciones:
  - un `<picture>` con `<source media="(prefers-reduced-motion: reduce)" srcset="celuma-isotipo-maestro-caja-anim.svg">`, que está verificado;
  - el SVG en línea;
  - Lottie, con la preferencia consultada por la aplicación.
- **Dependencias de validación**, descargadas con el permiso del encargo y **fuera del repositorio** (scratchpad de la sesión):
  - `lottie-web` 5.13.0 (npm, MIT, tgz SHA-256 `00f306a9…fd4f`);
  - `@lottiefiles/dotlottie-web` 0.80.0 (npm, MIT, tgz SHA-256 `187df578…7bb7`).
  - La página de revisión lleva una copia de `lottie.min.js` 5.13.0 en `vendor/` (SHA-256 `2eb76297…18ac`, con `LICENSE.md`) para funcionar sin conexión. **No** es una dependencia de producción.
- **Herramientas ya instaladas:** Python 3.10 de Homebrew, el Playwright/Chromium de `celuma-frontend` y ffmpeg 6.0 (`/usr/local/bin`).
- **Morph de los rayos:** requiere que el reproductor interpole trazados con el mismo número de vértices. Así es aquí, porque son las mismas curvas del maestro con una compresión axial. Es una función estándar de Lottie, pero no se probó en iOS ni en Android.
- **El vídeo** es una vista previa. Para correo o redes haría falta una exportación dedicada, que no se hizo.
- **No se tocó** nada fuera de `labs/experiments/2-logo-vector-v2/`: ni assets, ni tokens, ni lienzos, ni frontend, ni docs, ni `labs/index.html`, ni el experimento 01. No hubo commit, push ni publicación.

## 7. Qué debe juzgar Rafael (a ojo, en `animacion.html` o en el vídeo)

1. **Ritmo de las miradas.** ¿Las dos miradas (0,45 s y 0,50 s, con 0,25 s de pausa) se leen como «mira a un lado y al otro», o se sienten lentas o nerviosas? Prueba a 0,5× y a 1×.
2. **Momento «eureka».** ¿El regreso hacia arriba a la derecha con un sobreimpulso de ~4 px y la pausa de 0,25 s transmiten «descubrimiento»? ¿Hace falta más pausa o menos rebote?
3. **Aparición de los rayos.** Orden 3 → 2 → 1, crecimiento desde la base y fundido corto. ¿Se leen como luz que se enciende? ¿Mejor más escalonados o simultáneos?
4. **Bucle.** ¿Los 2,0 s de reposo entre ciclos bastan? ¿Tiene sentido apagar los rayos al inicio del ciclo?
5. **Usos:** en qué superficie iría (carga, hero, bienvenida) y si, con movimiento reducido, se prefiere el maestro estático (lo actual) o un fundido mínimo.

## 8. Reproducir

```
cd labs/experiments/2-logo-vector-v2/scripts
/opt/homebrew/bin/python3.10 animation.py                     # JSON, SVG y review-data.js desde el maestro
/opt/homebrew/bin/python3.10 anim_curves.py                   # curvas de movimiento
/opt/homebrew/bin/python3.10 validate_anim.py <players>       # reproductores reales + métricas + láminas (~1–2 min)
node anim_video.mjs <players> ../anim/preview/celuma-isotipo-anim-preview.mp4 ../anim/preview/celuma-isotipo-anim-preview.webm
node anim_page_check.mjs                                      # prueba de animacion.html (normal, reducido y móvil)
```

`<players>` es una carpeta con los paquetes `lottie-web-5.13.0/package` y `lottiefiles-dotlottie-web-0.80.0/package` desempaquetados, que se obtienen con `npm pack lottie-web@5.13.0 @lottiefiles/dotlottie-web@0.80.0`.
