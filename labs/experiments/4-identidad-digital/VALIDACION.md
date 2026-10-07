# Validación · Experimento 04 · rondas 1 y 2 (2026-10-06)

Qué se comprobó, con qué, a qué tamaños y con qué límites. Las §1–§6 describen la ronda 1; la **§7 la ronda 2** (refinamiento de B con fondos y Microcosmos), cuyos exports sustituyen a los de la ronda 1 en `exports/kit/` y `motion/` (la ronda 1 se conserva en `ronda-2/antes/`). Todo en **Chromium headless de Playwright** (el de `celuma-frontend/node_modules`) sobre macOS, más el panel de navegador de Claude para clics en el preview 5050. Las cifras se regeneran con `sh scripts/construir.sh` y `node scripts/navegacion.mjs http://localhost:5050`. Una valoración cualitativa de Claude no es una aprobación.

## 1. Matriz de calidad

| Criterio | Evidencia | Resultado | Pendiente |
|---|---|---|---|
| Composición: líneas frente a presupuesto, área útil, solapes | `validacion/exportar-kit.json`, `exportar-comparacion.json`: medición en el DOM de cada pieza (rectángulos de línea, cajas, desbordes internos) | **61/61** piezas del kit y **18/18** de comparación sin observaciones; 3 usan su versión condensada prevista (capacidad-revisor 1:1, capacidad-emitidos 9:16 y 1:1) | La medición no juzga belleza: ver §3 |
| Tamaño exportado = artboard | `manifest.json` (cabecera PNG) | 79/79 coinciden | — |
| Contraste de texto | `validacion/contraste.json` (WCAG 2.x) | **16/16** combinaciones cumplen (4,5:1 normal, 3:1 grande a tamaño de uso a 390 px); 6 combinaciones prohibidas documentadas | Metadatos ≈ 10,5 px a 390 px: legibles, información terciaria |
| Logo intacto | SHA-256 de `kit/marca/` frente a `../2-logo-vector-v2/svg/…` | **10/10** copias idénticas byte a byte; nunca se recortan ni separan partes | Incorporación canónica de 02 pendiente |
| Fuentes cargadas al exportar | `document.fonts` registrado por pieza | Baloo 2 800 e Inter cargadas en las 61 piezas | Dependen de Google Fonts: sin red no se debe exportar |
| PDF de distribución | `validacion/pdf.json` (pypdf) | **61** PDF de una página al tamaño del artboard; glifos incrustados (Type 3 + `ToUnicode`), texto buscable; el avatar no tiene texto | Type 3 no es editable como fuente en Illustrator; no se abrió en Acrobat ni en Vista Previa |
| SVG autónomos | `recursos/recursos.json` | 22 SVG sin `href`, `<image>`, `<text>`, `var()` ni `url()`; PNG transparentes a 2048 px (iconos a 512) | — |
| Motion: final = estático | `validacion/motion-final.json` (NumPy) | **2/2** idénticos píxel a píxel a su pieza del kit; primer fotograma de la intro = navy liso | — |
| Motion: formato real | `ffprobe` en `manifest.json` | MP4 H.264 yuv420p 30 fps y WebM VP9: 1920×1080 · 10 s · 300 fotogramas; 1080×1920 · 9 s · 270 fotogramas; sin audio | Sin subtítulos ni audio; no se subió a ninguna red |
| Afirmaciones de producto | `kit/contenido.js`, [`AFIRMACIONES.md`](AFIRMACIONES.md) | Todas con página publicada en docs.celuma.mx (sitemap consultado el 2026-10-06); pendientes y contradicciones excluidas | Confirmar el canal de demostraciones |
| Navegación y controles | `validacion/navegacion.json` | Ver §4 | — |
| Navegadores y dispositivos | — | Solo Chromium en macOS | Safari, Firefox, iOS, Android, apps de redes, lectores de pantalla e impresión: **no probados** |

## 2. Tamaños y vistas revisados

- **Exports a tamaño real** (1080×1080, 1080×1350, 1080×1920, 1200×628, 1920×1080, 1584×396, 1500×500, 1200×300) y recortes a 100 % de cabecera, entrada de diccionario, rastreador y firma.
- **Lectura en teléfono:** cada pieza reducida a 390 px de ancho (`validacion/hojas/movil-390.png`): titulares ≈ 33 px, texto ≈ 16 px, antetítulos ≈ 11 px, metadatos ≈ 10,5 px.
- **Hojas de contacto a escala común:** `validacion/hojas/comparacion-abc.png`, `kit-identidad-producto.png`, `kit-carrusel-novedad.png`, `kit-horizontales-auxiliares.png`, `motion-fotogramas.png`, `motion-paso-a-paso.png`.
- **Guías de área útil y zonas** separadas de los exports limpios: `validacion/guias/` (rótulo «Candidata · 04» solo en esas vistas).
- **Galería** a 1440 y 390 px (`validacion/vistas/`): 0 px de desplazamiento horizontal; 118 imágenes sin roturas; tablas anchas dentro de contenedores con desplazamiento propio y foco de teclado.

## 3. Revisión de diseño: defectos encontrados y corregidos

Se inspeccionaron los renders en cada iteración (ver `BRIEF.md` §5). Corregidos antes de entregar:

1. A · Lumen dejaba media pieza muerta → los arcos cubren la diagonal completa; en 9:16 el bloque se centra.
2. B · Ficha: la cuadrícula era pesada y en 9:16 chocaba con el pie → celdas finas que se ajustan en celdas enteras al espacio real.
3. B: la cabecera repetía «Céluma» (ya firma abajo) y algunas cabeceras duplicaban el antetítulo («Demostración / Demostración») → la cabecera nombra la serie y el antetítulo el tema.
4. B: la capacidad del revisor repetía la misma idea en texto y módulo → tabla de permisos con fuente; el texto se retira.
5. B: el flujo en vertical tenía rótulos de rastreador encimados → lista vertical con responsables.
6. C · Membrana: anillo grueso y menta saturada con tono sticker → anillo fino, menta suave y sangrado.
7. Novedad horizontal se condensaba con espacio de sobra → columna más ancha y tamaño de lista ajustado; ahora muestra el texto completo.
8. Motion: firma ausente en el vertical (ruta relativa), regla de lista que aparecía antes que la lista, final con 47 px distintos por capas de composición → corregidos; el reposo vuelve a montar la pieza estática.
9. Editor: desbordaba a 390 px y no avisaba con claridad cuando el texto editado no cabía → corregido.

**Abierto (diseño, para la revisión de Rafael).** B puede volverse monótona en series largas si siempre usa la cuadrícula; el icono «guía» (libro) es el menos logrado del juego; los metadatos son pequeños por diseño; A y C son alternativas completas pero menos trabajadas en formatos auxiliares (no se desarrollaron en kit).

## 4. Navegación (clics reales)

`scripts/navegacion.mjs` en dos servidores: `python3 -m http.server` propio y el preview `npx serve` en `localhost:5050` (el que usa Rafael). Recorre: laboratorio → «Abrir identidad digital ↗» (pestaña nueva) → barra con `aria-current` → «Laboratorio»; entradas directas con barra, sin barra, `index.html` y `?formato=9x16&contexto=oscuro#direcciones`; controles de formato, contexto, grupo, vista y motion con clic y con teclado; reproducción y pausa de vídeo; todos los enlaces locales de la galería (incluidos `.md`, PNG, PDF y paquetes); anclas; galería ↔ editor; pieza y motion por enlace directo; 390 px con movimiento reducido.

**Resultado (2026-10-06): 26/26 pruebas en `http.server` y 26/26 en `localhost:5050`**, sin errores de página (`validacion/navegacion.json`).

**Clics en el panel de navegador de Claude sobre el 5050:** laboratorio con las cuatro tarjetas; `…/4-identidad-digital/index.html` se normaliza a la carpeta con barra, sin bucle y con 0 imágenes rotas; «Editor de piezas» abre el editor con `aria-current` y el aviso de presupuesto; «Identidad digital» vuelve a la galería; el botón 9:16 cambia las seis piezas; «← Volver al laboratorio» regresa. El panel no abre pestañas con `target="_blank"`: la apertura en pestaña nueva desde la tarjeta se comprobó con Playwright. El panel estaba oculto durante la prueba; el ritmo del motion se juzgó con los vídeos y los fotogramas, no en el panel.

En el preview 5050, al entrar sin barra final o con `index.html`, Chromium pide antes de la normalización algunos recursos relativos a la carpeta superior y recibe 404; luego la página carga todo bien. Es el efecto conocido y documentado en 02 y 03, no un recurso roto: el verificador lo registra como nota y falla si hay un 404 dentro de la carpeta del experimento.

## 5. Movimiento y accesibilidad

- Los vídeos no se reproducen solos; tienen controles nativos. Con `prefers-reduced-motion: reduce`, la galería muestra la versión estática (comprobado con emulación) y `motion/motion.html` dibuja directamente el estado final.
- Sin parpadeos ni cambios de luminancia de todo el cuadro; entradas de 0,4–0,5 s con salida suave; ningún bucle.
- Controles con botones nativos y `aria-pressed`, foco visible, barra de recorrido con `aria-current`, enlace para saltar al contenido, texto alternativo y caption por pieza.
- No se probó con lectores de pantalla.

## 6. No comprobado

Safari/WebKit (el WebKit de Playwright falla en este equipo), Firefox, iOS, Android, dispositivos reales, subida a redes sociales y sus recortes, especificaciones oficiales vigentes de cada plataforma, impresión, lectores de pantalla, la galería sin conexión, apertura de los PDF en Acrobat o Illustrator y la aplicación de Céluma en producción (ninguna capacidad se marcó como «demostrada en producto»).

## 7. Ronda 2 · refinamiento de B (fondos y Microcosmos)

| Criterio | Evidencia | Resultado | Pendiente |
|---|---|---|---|
| Fidelidad de los fondos rescatados | `ronda-2/fidelidad-fondos.json`: versión local frente al render del lienzo (`PatternCream`, `PatternNavy`) en el mismo azulejo 280 × 200 a 2×, sin las esquinas redondeadas | Papel: media 0,16, máx. 1 nivel · Navy: media 0,38, máx. 2 niveles · centros idénticos (#dbeae0, #17383e) | Banding de gradientes en pantallas reales no evaluado |
| Composición del kit ronda 2 | `validacion/exportar-kit.json` | **61/61** sin observaciones (líneas, área útil, solapes) | 2 piezas en versión condensada prevista |
| Microcosmos fuera de texto | Geometría real: puntos de cada línea de texto contra `isPointInFill`/`isPointInStroke` de cada forma, con su propia matriz | 0 formas sobre texto en el kit y en el grupo representativo | — |
| Logo sobre fondo uniforme | Variación del fondo en la zona de protección (lockup + ½ isotipo) y formas dentro | ≤ 3 niveles y 0 formas en todas las piezas; la portada 4:1 lleva la luz a la derecha (excepción documentada) | — |
| Contraste sobre la composición final | `validacion/contraste-real-kit.json`: render sin texto, caja de tinta real de cada tramo (diferencia entre render con y sin texto) + 3 px, peor píxel de fondo frente a la tinta | **606 tramos en 60 piezas · 0 fallos** · el más justo: lema 4,77:1 (objetivo 4,5) | Metadatos sobre el centro del halo: margen corto |
| Grupo representativo antes/después | `validacion/exportar-ronda2.json`, `ronda-2/despues/`, `ronda-2/antes/piezas/` | 10/10 sin observaciones; mismo texto y escala que la ronda 1 | — |
| Ronda 1 conservada | `exports/comparacion/` regenerada con `b1` y comparada píxel a píxel con la ronda 1 | 18/18 idénticas | — |
| Recursos autónomos | `recursos/ronda-2.json` | 34 SVG sin `href`, `<image>`, `<text>`, `var()` ni `url()` externos; como `<img>` idénticos al render en línea 34/34 | Figma, Illustrator e Inkscape no probados |
| PDF con gradientes | pypdf | Cada halo es un patrón de sombreado vectorial (1 en Papel, 2 en Navy, 0 en crema plano); sin imágenes rasterizadas | No abiertos en Acrobat ni Illustrator |
| Motion ronda 2 | `validacion/motion-final.json` | Finales idénticos a las piezas de la ronda 2 (sí); primer fotograma de la intro = navy profundo liso; Orden se funde hacia el Navy rescatado | — |
| Navegación y controles | `validacion/navegacion.json` | **http.server: 39/39 · http://localhost:5050: 39/39**: incluye capítulo de la ronda 2, conmutador antes/después, biblioteca, espécimen, fondo y Microcosmos del editor, `pieza.html` con `&fondo`/`&micro`, B ronda 1 y ancla `#refinamiento` | Safari, Firefox, dispositivos |

**Revisión de diseño de la ronda 2.** Los defectos encontrados y corregidos están en `BRIEF.md` §8 (membranas abultadas, salmón turbio, recursos omitidos por una exclusión demasiado gruesa, contornos que parecían un icono de señal y se retiraron, campo aleatorio convertido en tejido, repetición entre consejos y demostración, recorte con manchas, regla que cruzaba la célula, halo bajo el logo, barra salmón larga en el motion). La verificación tuvo dos falsos positivos (cajas en lugar de geometría y una matriz de transformación equivocada) que se corrigieron antes de usarla como prueba.

**Hojas de la ronda 2:** `ronda-2/hojas/` (fidelidad y formatos de fondos, biblioteca, antes/después 4:5 y otros formatos, modos, serie de valores, lectura a 390 px). **Límites:** todo en Chromium sobre macOS; el contraste «real» se mide sobre el render de Chromium, no en pantallas físicas.
