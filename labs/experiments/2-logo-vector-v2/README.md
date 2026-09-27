# Isotipo vectorial · maestro fiel y mini sistema del logo

**Estado: aprobado por Rafael el 2026-09-26 para incorporación posterior al Brand System.** Experimento 02 del laboratorio visual. La decisión final y su alcance están en [`DECISION.md`](DECISION.md).

El maestro vectorial, el wordmark A · Baloo 2 800, sus lockups, y las animaciones Mirada, Luz, Enfoque y Trazo quedaron aprobados como dirección visual. La variante cromática UI es una propuesta adicional pendiente de revisión frente al maestro. La opción B queda como archivo comparativo. La aprobación no publica ni incorpora automáticamente estas piezas; las secciones siguientes documentan también el estado previo a la decisión.

- **Vista comparativa:** [`index.html`](index.html). Incluye antes/después, métricas, color, tamaños, familia, wordmark, reglas y, después de ellas, un deslizador maestro/UI pendiente de revisión.
- **Ejemplos:** [`ejemplos.html`](ejemplos.html). Muestra un favicon, el login de la app, el hero del landing y piezas de comunicación. Todo usa datos ficticios.
- **Registro del experimento:** [`BRIEF.md`](BRIEF.md). **Fase 2 (Mirada aprobada):** [`animacion.html`](animacion.html) · [`README-FASE2.md`](README-FASE2.md) · brief original en [`ANIMATION-BRIEF.md`](ANIMATION-BRIEF.md).
- **Fase 3 original (Luz, Enfoque y Trazo aprobadas):** galería [`fase-3/index.html`](fase-3/index.html) · [`fase-3/README-FASE3.md`](fase-3/README-FASE3.md) · nota de decisión [`fase-3/NOTA-DECISION.md`](fase-3/NOTA-DECISION.md).

Para abrir las vistas, arranque el servidor desde la raíz de `celuma-brand-system` con `python3 -m http.server 8000` y visite `http://localhost:8000/labs/experiments/2-logo-vector-v2/`. Las páginas también funcionan si se abren como archivo, porque no cargan datos remotos. Solo Baloo 2, en el texto de las vistas, llega desde Google Fonts, como en el resto del sistema.

---

## 1. Rutas de entrega

| Ruta | Qué es | Tipo |
|---|---|---|
| `master/celuma-isotipo-maestro.svg` | Maestro editable. Usa la misma caja que el PNG (viewBox 0 0 697 777) para comparar píxel a píxel. | **Fiel** |
| `svg/isotipo/celuma-isotipo-color.svg` | La misma geometría con una caja ajustada al dibujo (73 42 549 670), pensada para entregar. | **Fiel** |
| `svg/isotipo/celuma-isotipo-ui.svg` | Misma geometría, membrana y trazos `#49b6ad`, núcleo `#F98D84`. | **Variante UI · en revisión** |
| `svg/lockups/ui-baloo2/` | Lockups A horizontal y vertical, positivos y negativos, con la variante UI. | **Variante UI · en revisión** |
| `svg/isotipo/celuma-isotipo-mono-navy.svg` · `…-mono-blanco.svg` | Una tinta sólida: el citoplasma queda transparente y el nucléolo, calado. | Adaptación |
| `svg/isotipo/celuma-isotipo-mono-tramas-navy.svg` · `…-blanco.svg` | Una tinta con tramas: núcleo al 40 %. | Adaptación |
| `svg/isotipo/celuma-isotipo-reducido-16-24px.svg` | Versión para 16–24 px: rayos y membrana engrosados, sin trazos internos. | Adaptación |
| `svg/wordmarks/wordmark-a-baloo2-800.svg` | «Céluma» en contornos exactos de Baloo 2 800. | **Aprobado** |
| `svg/wordmarks/wordmark-b-notion-v2-trazado.svg` | Trazado del lettering de `Celuma_Logotipo_V2.png`. | Propuesta · referencia |
| `svg/lockups/propuesta-a-baloo2/` · `propuesta-b-notion-v2/` | Horizontal y vertical, cada uno en color positivo, color negativo, mono navy y mono blanco: 8 por opción. | **A aprobado** · B archivo comparativo |
| `png/isotipo/` | Color a 64, 128, 256, 512 y 1024 px de alto; mono y tramas a 512 px. Fondo transparente. | Exportación |
| `png/lockups/` | Los 16 lockups en PNG transparente. Los horizontales miden 1200 px de ancho y los verticales, 800 px de alto. | Exportación |
| `png/favicon/` | `favicon-16` (reducido), `favicon-32` y `favicon-48` (fieles), más `apple-touch-icon-180`, `icon-192` e `icon-512-maskable`. Los tres últimos son opacos, sobre crema. | Exportación · propuesta |
| `examples/` | Capturas de los ejemplos con el wordmark A y con el B. | Maqueta |
| `validation/` | Métricas (`*.json`), láminas de comparación (`lamina-*.png`), renders y capturas de las vistas. | Evidencia |
| `referencias/notion/` | `Celuma_Logotipo_V2.png` y `Celuma_Banner_V2.png`, copiados con autorización (ver `LEEME.md`). | Referencia |
| `scripts/` | El proceso completo y reproducible (§8). | Código |

No se reemplazó ningún asset ni token canónico, ni se cambió el frontend. En este cierre se actualizaron el índice del lab y el registro de estado en `docs/estado-de-piezas.md`. El PNG fuente sigue intacto (SHA-256 `f7b2a1f3…952f`).

## 2. Antes / después

La fuente es `assets/celuma-isotipo.png` (697 × 777, RGBA). Este archivo es un recorte exacto de `docs/revision-grafica/referencias/notion/Celuma_Isotipo_V2.png`, con offset (156, 108) y una diferencia máxima de 1 nivel. La imagen incrustada en `Propuesta de marca Céluma.pdf` también es el mismo dibujo (diferencia ≤ 1 nivel donde hay alfa). `assets/celuma-logo-v3.png` es otro dibujo y no se usó.

`index.html#antes-despues` compara ambos en la misma caja, con un control deslizante y cuatro fondos: blanco, crema, navy y damero. Hay dos láminas estáticas:

- `validation/lamina-overlay-diferencia.png`: PNG, SVG, superposición al 50 %, mapa ΔE00 y las siluetas α = 0,5 de ambos superpuestas.
- `validation/lamina-detalles-x8.png`: cinco zonas ampliadas ×8.

## 3. Método de validación y resultados

**Colores.** Cada región se clasificó por su color. Luego se erosionó 4 px para quitar el antialias y el halo, y en esa meseta se tomó la mediana por canal. Para detectar degradados se ajustó un modelo lineal y otro radial. **No hay degradado:** de extremo a extremo, ninguna región varía más de ΔE00 0,44, que es menos que el grano del generador (desviación típica ≈ 1 nivel).

**Geometría.** Para cada capa se construyó un campo continuo:

- alfa, para la silueta y los rayos;
- la proyección del color sobre el eje entre las dos tintas vecinas, para membrana/citoplasma, núcleo, nucléolo y trazos.

Sobre ese campo se trazó la isolínea 0,5 con precisión subpíxel. El halo de nitidez del PNG es simétrico y no desplaza ese cruce. Después se ajustaron Bézier cúbicas: una semilla de Schneider, luego inserción de nodos suaves o de esquina donde el error máximo lo exige y, al final, un refinamiento global por mínimos cuadrados. El ajuste se detiene al llegar al piso de ruido (error máximo ≤ 0,5 px y RMS ≤ 0,15 px) o cuando ya no mejora. Resultado: **73 nodos en 9 trazados**, sin raster ni texto embebidos.

**Comparación.** Chromium, el mismo motor que usan las páginas de marca, rasteriza el SVG a 697 × 777 con fondo transparente, y el resultado se compara con el PNG:

| Métrica | Resultado |
|---|---|
| IoU de silueta (α ≥ 0,5) | **0,999** |
| Distancia entre bordes α = 0,5 (media / p95 / máx.) | **0,10 / 0,28 / 0,63 px** |
| Área (suma de alfa), SVG/PNG | 1,0011 (+0,11 %) |
| IoU por región | Rayos 0,993 · membrana 0,995 · citoplasma 0,998 · disco nuclear 0,9985 (campo de color) · nucléolo 0,993 · trazos 0,991 |
| Rayos | Ejes 28,6° / 53,2° / 89,8° (±0,07°); extremos a ≤ 0,20 px sobre su eje; longitudes 0,1–0,2 px más cortas |
| Centroides de región | Desplazamiento ≤ 0,27 px |
| Color en planos, ΔE00 media / p95 | **0,52 / 1,06** (blanco; crema y navy iguales ± 0,02) |
| Color en la banda de borde (2 px), ΔE00 media | 4,9 (halo del PNG, §6) |
| Píxeles con ΔE00 > 2 | 7,4 %, todos en bordes |
| Tamaños 16 / 20 / 32 / 64 / 256 px, ΔE00 medio sobre blanco | 3,8 / 3,5 / 2,3 / 1,2 / 0,87 (PNG y SVG pasan por el mismo reescalado) |

Las cifras vienen de `validation/metrics.json`, `fit-report.json`, `color-analysis.json` y `geometry.json`. Donde el IoU de región se mide sobre clases de color, el halo lo penaliza. Por eso el núcleo se mide también sobre el campo de color (0,9985), porque el anillo de halo rojo del PNG desaparece en la limpieza morfológica.

**No se afirma que el SVG sea «100 % idéntico».** Un raster de 697 × 777, con antialias, grano y halo, solo fija la posición del borde con una incertidumbre de ± 0,1–0,3 px. El objetivo fue quedar dentro de ese margen, y así quedó.

## 4. Colores medidos vs tokens

| Región | Medido (maestro) | Token más cercano | ΔE00 |
|---|---|---|---|
| Membrana y trazos | `#3baca6` | `--celuma-iso-outline` #2fa7a5 · `--celuma-primary` #49b6ad | 2,15 · 3,13 |
| Citoplasma | `#bbead2` | `--celuma-iso-fill` #c8ecdc | 3,75 |
| Núcleo | `#f88e85` | `--celuma-iso-nucleus` #e58a8a · `--celuma-secondary` #F98D84 | 4,70 · **0,31** |
| Nucléolo | `#e5635f` | — | — |
| Rayos | `#f1c46c` | `--celuma-iso-rays` #f0c75e | 3,17 |

En el PNG, la membrana y los trazos difieren en 1 nivel (`#3baca6` / `#3cada7`, ΔE00 0,3). El maestro usa una sola tinta. Los tokens `--celuma-iso-*` no reproducen el isotipo: la diferencia es perceptible, de ΔE00 2,2 a 4,7. **No se modificaron.** Corregirlos es una decisión aparte (§7). Faltan los valores CMYK y Pantone, que exigen una prueba de imprenta.

## 5. Fiel vs adaptaciones, y reglas propuestas

- **Fiel:** el maestro y `celuma-isotipo-color.svg`. Funciona sin variante negativa sobre blanco, crema, navy y teal suave: la membrana `#3baca6` delimita la célula con 2,6–2,8:1 en fondos claros y 6,3:1 en navy.
- **Adaptaciones.** Ninguna es idéntica al isotipo:
  - *Una tinta sólida*: el núcleo pesa más que en color.
  - *Una tinta con tramas*: conserva el orden tonal y se prefiere cuando el medio admite tramas.
  - *Reducido 16–24 px*: rayos y membrana engrosados, sin trazos internos. Nunca se usa por encima de 24 px.
- **Área de protección (propuesta):** X = ½ de la altura del isotipo en los cuatro lados. Es la regla ya propuesta en §8 de la revisión gráfica.
- **Mínimos en pantalla,** comprobados en Chromium a 1× (`validation/lamina-minimos.png`):
  - isotipo fiel ≥ 24 px de alto, para que los rayos midan al menos 1 px;
  - isotipo reducido entre 16 y 24 px;
  - lockup horizontal ≥ 80 px de ancho y lockup vertical ≥ 64 px de alto, ambos con altura x ≈ 8 px.
  - En impresión no hubo prueba física: los 12 mm de la propuesta previa siguen sin verificar.
- **Fondos:** sí sobre blanco, crema #fbf6ec, navy #0d1b2a y teal suave #e6f7f7. No en color sobre teal #49b6ad (membrana a 1,1:1; ahí se usa una tinta navy), salmón (membrana a 1,2:1 y rayos a 1,4:1) ni texturas o fotos sin zona calma.
- **Usos incorrectos,** ilustrados en `index.html#reglas`: deformar, rotar, cambiar colores, añadir sombras o contornos, usar `celuma-logo-v3.png`, usar la versión reducida por encima de 24 px, aplicar transparencias, reordenar el lockup o componer el wordmark con otra fuente o tamaño.

## 6. Diferencias residuales y límites

- **Halo de nitidez:** el PNG muestra ~1 px más oscuro y ~1 px más claro a cada lado de cada borde. Es un artefacto del generador y no se reprodujo.
- **Grano y alfa interior:** el alfa interior va de 250 a 255 (media 254,7), con un parche de bloques en el núcleo. El maestro usa tintas planas y opacidad 1.
- **Forma de núcleo y nucléolo:** no son círculos. Un círculo daría un RMS de 0,79 px en el núcleo y de 0,36 px en el nucléolo, así que se conservaron como trazados.
- **Rayos:** son casi cápsulas rectas, pero no lo son del todo. Una cápsula de ~30 px de grosor da un error máximo de 0,40–0,69 px. Se conservaron los trazados; la aproximación sirve para la fase 2 (ver `ANIMATION-BRIEF.md`).
- **Pruebas de color y lectura:** solo se validó el render de Chromium en macOS. Falta probar Safari, Firefox, Figma, Illustrator e Inkscape, así como impresión, lectores de pantalla y pantallas reales.
- **Favicon:** no se generó `.ico` ni `manifest.webmanifest`, solo PNG y el SVG.
- **Wordmark A:** usa la geometría de Baloo 2 v1.700 del repositorio de Google Fonts. El texto vivo en Chromium se ve ~2 % más grueso por el suavizado de texto, pero la forma es idéntica: IoU 0,976 frente al texto vivo con la línea base ajustada al píxel.
- **Wordmark B:** es un trazado de un raster de 1024 px (altura de C ≈ 111 px), con un error máximo de 0,64 px. No es una fuente y no admite otras palabras.
- **Proporciones del vertical:** no existe referencia; son propuesta.

## 7. Decisiones documentadas antes del cierre (registro histórico; resolución en `DECISION.md`)

1. **D-2 · ¿Este SVG sirve como maestro?** La revisión gráfica recomendaba encargarlo. Esta es la vía «vectorizar a partir del V2 con revisión», con el error medido. Falta decidir entre adoptarlo como candidato, usarlo como base para un diseñador o descartarlo.
2. **D-1 · Wordmark.**
   - **A (Baloo 2)** tiene licencia SIL OFL 1.1, está en producción y sus terminales redondeados combinan con el isotipo.
   - **B (lettering V2)** no tiene fuente identificable. Su lettering coincide con el del Banner V2 (IoU 0,983), pero la sans abierta más cercana es DM Sans 800, con apenas 0,890.
   - **Recomendación: A**, con las proporciones de lockup medidas en B (ya aplicadas). Si se quiere el tono de B, la vía es D-1 (c): un wordmark propio o una fuente licenciada, no el trazado. Cualquier lockup sigue siendo **propuesta**.
3. Proporciones del lockup vertical y separación del horizontal. Se usó 0,139 × H, medido en V2; el landing usa hoy ~0,44 × H.
4. **Tokens `--celuma-iso-*`:** decidir si se alinean con los colores medidos. Afectaría a los lienzos y requiere un cambio aparte.
5. **Monocromo:** qué variante es la oficial, la sólida o la de tramas, y si la reducida se adopta para el favicon.
6. **Impresión:** CMYK, Pantone, mínimos en mm y prueba física.
7. **Fase 2:** Rafael autorizó avanzar tras revisar la fase 1 («ya quedó»). La animación del isotipo está hecha en exploración (`README-FASE2.md`); el lockup animado espera a D-1.

## 8. Reproducir

Las herramientas ya estaban instaladas: Python 3.10 de Homebrew (`/opt/homebrew/bin/python3.10`, con NumPy, SciPy, OpenCV, Pillow y fontTools) y el Playwright/Chromium de `celuma-frontend/node_modules` (el mismo que usan `docs/revision-grafica/scripts`). No se instaló ninguna dependencia.

Con autorización de Rafael se descargaron `Baloo2[wght].ttf` (683 KB) y `OFL.txt` desde `github.com/google/fonts/ofl/baloo2` al directorio temporal de la sesión, **fuera del repositorio**, solo para contornear el wordmark A.

```
cd labs/experiments/2-logo-vector-v2/scripts
/opt/homebrew/bin/python3.10 analyze_colors.py      # colores y prueba de degradado
/opt/homebrew/bin/python3.10 fit_vector.py          # contornos y curvas (≈ 1 min)
/opt/homebrew/bin/python3.10 build_svg.py           # maestro, familia y adaptaciones
/opt/homebrew/bin/python3.10 validate.py            # métricas y láminas
/opt/homebrew/bin/python3.10 wordmark_v2.py         # trazado del lettering V2
/opt/homebrew/bin/python3.10 wordmark_a.py <ruta a Baloo2[wght].ttf>
/opt/homebrew/bin/python3.10 lockups.py
/opt/homebrew/bin/python3.10 exports.py             # PNG, mínimos y comprobación de exportaciones
/opt/homebrew/bin/python3.10 font_match.py          # identificación tipográfica (usa Google Fonts vía Chromium)
node capture.mjs                                    # capturas de las vistas y de los ejemplos
```

Los archivos que empiezan por `_` (`validation/_shapes.json`) son intermedios que los scripts regeneran.

## 9. Qué no se hizo

No hubo commit, push, merge, tag, publicación ni despliegue. El laboratorio enlaza el experimento y registra la aprobación de Rafael; la incorporación a los archivos canónicos y otros repositorios es un trabajo posterior.
