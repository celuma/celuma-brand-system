# Brief de animación del isotipo · fase 2 (NO implementada)

**Estado:** implementado en exploración el 2026-09-26, tras la revisión de la fase 1 por Rafael («ya quedó»), sobre `master/celuma-isotipo-maestro.svg`. Solo el isotipo: el lockup sigue abierto (D-1). Resultados, ajustes de ritmo respecto de este brief y validación en [`README-FASE2.md`](README-FASE2.md); revisión visual en [`animacion.html`](animacion.html). Exploración · no aprobada en su momento; Mirada se aprobó el 2026-09-26 y, desde el 2026-09-27, se genera desde el maestro activo con la paleta aprobada (`README-FASE2.md`).

> Este documento se conserva como el brief original. Los valores de §3 se ajustaron tras la inspección visual; los vigentes están en README-FASE2.md §3.

## 1. Idea

La célula mira a la izquierda y luego a la derecha, con un movimiento sutil. Se detiene un instante, como si descubriera algo («eureka»). Aparecen los tres rayos como luz y la animación termina **exactamente** en el isotipo maestro estático.

**Reglas fijas**

- La membrana (`#membrana`) y el citoplasma (`#citoplasma`) no se animan ni se deforman en ningún fotograma.
- La «mirada» es un desplazamiento del nucléolo (`#nucleolo`) dentro del núcleo. Opcionalmente, los trazos (`#trazos`) acompañan con un paralaje mínimo. El núcleo queda fijo.
- Los rayos (`#rayo-1..3`) usan la geometría del maestro. En el último fotograma, cada capa tiene transformación identidad.
- La animación no usa efectos que no estén en el maestro: ni brillos, ni desenfoques, ni sombras.
- El fondo es transparente.

## 2. Datos del maestro (unidades del viewBox 0 0 697 777)

| Elemento | Referencia | Valor |
|---|---|---|
| Núcleo | centro y radio aproximados (círculo de ajuste, RMS 0,79 px) | (388,4 ; 403,8), r ≈ 109,4 |
| Nucléolo | centro y radio aproximados | (423,8 ; 364,8), r ≈ 31,3 |
| Recorrido libre del nucléolo | 109,4 − 31,3 − 8 de margen | el centro puede alejarse hasta **70** del centro del núcleo (en el maestro está a 52,7, mirando arriba a la derecha) |
| Rayo 1 | base (junto a la célula) → punta; eje | (169,2 ; 237,7) → (88,0 ; 193,4); 28,7° |
| Rayo 2 | base → punta; eje | (244,5 ; 159,0) → (187,1 ; 82,1); 53,3° |
| Rayo 3 | base → punta; eje | (357,7 ; 136,0) → (357,4 ; 58,5); 89,8° |
| Caja ajustada | viewBox de entrega | 73 42 549 670 |

Los rayos se aproximan a cápsulas de ~30 px de grosor con un error máximo de 0,40–0,69 px (`validation/fit-report.json`). La aproximación sirve para guiar el movimiento, pero el último fotograma usa los trazados del maestro.

## 3. Storyboard: versión de una sola reproducción (2,60 s · 60 fps · 156 fotogramas)

| Tiempo (s) | Fotogramas | Momento | Qué se mueve | Easing |
|---|---|---|---|---|
| 0,00–0,10 | 0–6 | Reposo | Célula completa **sin rayos** (escala 0). Nucléolo en su posición maestra. | — |
| 0,10–0,55 | 6–33 | Mira a la izquierda | Nucléolo Δ(−93,4 ; +31,0), queda a 58 del centro del núcleo. Trazos Δ(−6 ; 0), opcional. | `cubic-bezier(.45,0,.55,1)` |
| 0,55–0,75 | 33–45 | Pausa | — | mantener |
| 0,75–1,25 | 45–75 | Mira a la derecha | Nucléolo Δ(+22,6 ; +31,0). Trazos Δ(+6 ; 0). | `cubic-bezier(.45,0,.55,1)` |
| 1,25–1,45 | 75–87 | Pausa | — | mantener |
| 1,45–1,75 | 87–105 | «Eureka» | El nucléolo vuelve a Δ(0 ; 0), la mirada del maestro hacia arriba a la derecha, con un sobreimpulso de ≤ 4 px. Trazos a Δ(0 ; 0). | `cubic-bezier(.34,1.56,.64,1)` |
| 1,70–2,20 | 102–132 | Rayos como luz | Cada rayo escala de 0 a 100 % desde su **base**, y su opacidad pasa de 0 a 1 en el primer 40 % del tramo. Escalonado de 70 ms en el orden rayo 3 → 2 → 1 (del más cercano a la mirada al más lejano). | `cubic-bezier(.22,1,.36,1)` |
| 2,20–2,60 | 132–156 | Final | **Maestro exacto, estático.** Todas las transformaciones son identidad y todas las opacidades valen 1. | — |

Con el sobreimpulso, el nucléolo llega a ≤ 57 del centro del núcleo y nunca toca su borde (límite: 70).

## 4. Versión en bucle (4,80 s · 288 fotogramas)

- El primer y el último fotograma son el **maestro** completo, con rayos, para que el bucle no tenga salto.
- **0,00–0,60** Maestro quieto.
- **0,60–0,90** Los rayos se retraen hacia su base: escala de 100 a 0 %, con `cubic-bezier(.55,0,1,.45)`.
- **0,70–3,40** La misma mirada y el mismo eureka que en la versión de una reproducción, desplazados en el tiempo.
- **3,10–3,60** Los rayos reaparecen.
- **3,60–4,80** Maestro quieto.
- **Uso:** solo en contextos donde el bucle aporte algo, como una pantalla de carga. Si dura más de 5 s junto a otro contenido, debe ofrecer pausa o detenerse (WCAG 2.2.2). Los rayos aparecen una vez por ciclo; no hay destellos.

## 5. Movimiento reducido

- **Por defecto,** con `prefers-reduced-motion: reduce` se muestra el maestro estático, sin animación.
- **Alternativa «mínimo»** (a decidir): solo un fundido de opacidad de 300 ms en los rayos, sin desplazamientos ni escalas.
- En Lottie, la aplicación que integra la animación consulta la preferencia y, si hay que reducir, muestra el último fotograma (`goToAndStop(op-1, true)`) o el SVG maestro.

## 6. Formatos de entrega

1. **SVG animado con CSS.** Es el maestro con `@keyframes` dentro de un `<style>`, reutilizando los ids.
   - Usar `transform-box: view-box` y `transform-origin` en unidades de usuario, en la base de cada rayo.
   - Incluir `@media (prefers-reduced-motion: reduce) { * { animation: none } }`.
   - No usar SMIL: el soporte y el respeto del movimiento reducido son irregulares.
2. **Lottie JSON (Bodymovin 5.x):** `celuma-isotipo-once.json` y `celuma-isotipo-loop.json`.
   - Se genera **por script a partir de los trazados del maestro**, no por exportación desde After Effects. Así la geometría del último fotograma es idéntica al SVG.
   - Parámetros: 60 fps, `w` 549 y `h` 670, con la capa raíz desplazada (−73, −42).
3. **Vistas previas para revisión** (no son entregables): una tira de fotogramas y un MP4 grabado con Playwright; el `ffmpeg` que trae Playwright ya está instalado.

## 7. Restricciones de exportación a Lottie

- **Formas:**
  - Solo capas de forma (`ty: 4`) con trazados `sh`. Las cúbicas del maestro se traducen de forma exacta: vértices `v` y tangentes `i`/`o` relativas.
  - Rellenos `fl` con el color en sRGB normalizado 0–1; por ejemplo, `#49b6ad` → [0,2873, 0,7147, 0,6794] (con el ajuste (k + 0,25)/255 de `README-FASE2.md`).
  - `r: 1` para la regla nonzero y `r: 2` para evenodd (solo en variantes monocromas).
- **Transformaciones:** van en grupos (`tr`). El punto de anclaje de cada rayo es su base. El nucléolo y los trazos se animan con `p` (posición). Nada de expresiones.
- **Elementos a evitar** (por soporte desigual o por coste en lottie-web con canvas, lottie-ios o lottie-android):
  - expresiones, efectos (brillo, desenfoque), máscaras y mates, *merge paths*;
  - capas de texto (el wordmark va en contornos), imágenes, 3D y *time remap*;
  - capas ocultas sobrantes.
- **Revelado de los rayos.** La opción recomendada (R1) es escalar desde la base el trazado del maestro. Es exacta al final y funciona en todos los reproductores. Alternativas:
  - R2: *trim paths* sobre la línea central de la cápsula, cambiando al trazado del maestro en el último fotograma. Hay un salto de ≤ 0,7 px.
  - R3: una máscara que avanza a lo largo del eje. Es exacta, pero cuesta rendimiento y el soporte es irregular.
- **Presupuesto:** JSON < 30 KB, sin datos binarios.

## 8. Cómo verificar el fotograma inicial y el final

1. **Último fotograma igual al maestro.** Renderizar con lottie-web en Chromium (Playwright) usando `anim.goToAndStop(op-1, true)`, a 697 × 777 con fondo transparente. Compararlo con `validation/render-maestro-697x777.png` usando `scripts/validate.py` adaptado. Criterio: IoU de silueta ≥ 0,9999, ΔE00 interior < 0,5 y ningún píxel con |Δα| > 2/255 fuera de la banda de antialias. Hacer lo mismo con el SVG animado: buscar el final mediante `document.getAnimations()` y `currentTime`.
2. **Primer fotograma.**
   - En el bucle debe ser igual al maestro, con el mismo criterio que el último.
   - En la versión de una reproducción debe ser igual al maestro sin `#rayos`, comparándolo con un render del maestro con los rayos ocultos.
3. **Invariantes en todos los fotogramas** (muestreo de cada fotograma):
   - alfa = 0 fuera del viewBox;
   - `#membrana` y `#citoplasma` sin claves de animación (se comprueba en el JSON);
   - el centro del nucléolo a ≤ 70 del centro del núcleo.
4. **Movimiento reducido.** Emular `reducedMotion: 'reduce'` en Playwright y comprobar que el primer fotograma mostrado es el maestro.
5. **Revisión visual.**
   - Tira de fotogramas en 0,00 · 0,55 · 1,25 · 1,60 · 1,90 · 2,20 · final.
   - Revisión a 1× y 2× sobre blanco, crema y navy.
   - Ritmo percibido, con Rafael.

## 9. Decisiones que necesita Rafael antes de ejecutar

- Qué maestro se adopta. Este SVG es el candidato.
- Qué lockup, y si el wordmark aparece después de los rayos (por ejemplo, un fundido de 200 ms en una pantalla de bienvenida).
- Los usos: pantalla de carga, hero del landing, firma de correo (formato GIF o MP4, sin movimiento reducido) o app.
- Si hace falta el bucle o basta con una sola reproducción.
- Si los trazos acompañan la mirada.
- El orden y el escalonado de los rayos.
- Si, con movimiento reducido, se usa el fundido «mínimo» o nada.
