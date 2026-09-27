# Motion del logo · fase 3

**Estado actual: Luz, Enfoque y Trazo aprobadas visualmente por Rafael el 2026-09-26** como parte del experimento 02; ver `../DECISION.md`. A · Baloo 2 800 quedó elegido como wordmark principal; B permanece como comparación. El resto de este documento conserva el registro técnico de la exploración original y sus límites de compatibilidad.

- **Galería para decidir:** [`index.html`](index.html). Desde la raíz de `celuma-brand-system`, ejecute `python3 -m http.server 8000` y abra `http://localhost:8000/labs/experiments/2-logo-vector-v2/fase-3/`. También funciona abierta como archivo.
- **Nota de decisión corta:** [`NOTA-DECISION.md`](NOTA-DECISION.md).
- **Fases anteriores, intactas:** fase 1 en [`../index.html`](../index.html) y [`../README.md`](../README.md); fase 2 en [`../animacion.html`](../animacion.html) y [`../README-FASE2.md`](../README-FASE2.md). No se modificó ningún archivo suyo; solo se añadió un enlace a esta fase en `../README.md`.

## 0. Encargo, alcance y reglas

**Pedido.** Un abanico de *direcciones* de animación del logo: al menos tres, materialmente distintas entre sí y de la fase 2. Cada una en isotipo solo y en lockup A/B, pensada por contexto: carga compacta, bienvenida y material de marca. Además, una galería comparativa con reproducciones reales, Lottie ejecutable y vídeo para las recomendadas, validación documentada y preguntas para Rafael.

**Reglas que se cumplieron**

- Todo el trabajo está dentro de `fase-3/`. No se tocaron `labs/index.html`, otros experimentos, `assets/`, tokens, lienzos, `docs/`, el frontend ni producción. No hubo commit, push ni publicación.
- La geometría es solo la de la fase 1: el maestro `../master/celuma-isotipo-maestro.svg` y los 16 lockups `../svg/lockups/`. No se dibujó ninguna forma de marca nueva.
- **Último fotograma = lockup exacto.** Cada animación termina en una capa estática con los mismos trazados, colores y matriz del archivo de la fase 1, sin máscaras, mates, morph ni transformación animada. Se verificó rasterizando (§7). El wordmark conserva sus coordenadas y la matriz `matrix(s 0 0 s tx ty)` del lockup, igual que el SVG de la fase 1; esa transformación es parte del lockup, no un residuo de la animación.
- Nunca se deforman ni cambian de color la membrana, el citoplasma ni las letras. Durante la animación solo hay escalas uniformes (el ajuste de foco de Enfoque, el núcleo y el nucléolo de Trazo), revelados y cambios de longitud de los rayos y del acento.
- Datos ficticios: «Laboratorio Demo Norte», «Informe DEMO-0042» y textos marcados como ejemplo. No hay datos clínicos.
- Durante la fase original se etiquetaron galería, maquetas, láminas, vídeos y metadatos de Lottie/SVG como «Exploración · no aprobada». Tras la decisión de Rafael se actualizó el estado visible de la galería; los renders y metadatos exportados conservan ese registro histórico hasta su regeneración para cada medio.

## 1. Direcciones

| | **Luz** | **Enfoque** | **Trazo** | Mirada (fase 2, referencia) |
|---|---|---|---|---|
| Principio | Ritmo de luz: solo se mueven los rayos y el acento | Encuadre: un campo de visión descubre la marca | Dibujo: la marca se construye | Personaje: la célula mira |
| Idea | Céluma = célula + luz. La célula (la muestra) no se toca; lo único que cambia es la luz. El acento de la é es la cuarta luz | En un laboratorio primero se mira. Se abre un campo circular, como el de un microscopio, y la célula se asienta 1,05 → 1, un ajuste de foco sin desenfoque. Con nombre, el campo se amplía y lo descubre | El isotipo es una ilustración de contorno. Se dibuja como un apunte científico y el nombre se escribe | «Eureka» y rayos |
| Una vez | 1,43 s (isotipo) · 1,65 s (lockup) | 1,40 s · 1,90 s | 2,62 s · 2,68 s | 3,20 s |
| Bucle | 2,00 s | — (a propósito) | — (a propósito) | 4,80 s |
| Contexto propuesto | **Carga compacta** ★, arranque con lockup, bienvenida mínima | **Bienvenida / splash** ★, apertura de vídeo; al revés, outro | **Material de marca** ★: intro/outro, redes 1:1 y 16:9, hero del landing | Referencia |
| Lottie usa | Capas de forma y morph de trazados | Máscara animada (6 vértices) | Mate de pista (membrana), máscaras (citoplasma, trazos, letras) y morph | Capas de forma y morph |
| Otro formato | **SVG + CSS** (loader, sin reproductor) | SVG + `clip-path` viable, no construido | Vídeo para redes o correo | SVG + CSS (fase 2) |

**Por qué no hay bucle en Enfoque ni en Trazo.** Enfoque repetido parecería un obturador o un escáner, es decir, un proceso. Trazo repetido se completaría una y otra vez, que es justo la semántica del progreso, y es demasiado cargado para 32–96 px. Las dos son intros de una sola reproducción.

## 2. Tiempos (60 fps; la misma especificación genera todo)

**Luz · bucle de carga (120 fotogramas, 2,00 s).** 0,00–0,25 s reposo en el maestro. Cada rayo se acorta al 60 % desde su base (escala axial, `cubic-bezier(.45,0,.55,1)` al bajar y al subir) y vuelve en 0,90 s: rayo 1 a 0,25 s, rayo 2 a 0,41 s y rayo 3 a 0,57 s. 1,47–2,00 s reposo. El fotograma 0 es igual al 119 y los dos son el maestro. La célula y el nombre no tienen ninguna clave. Los colores son exactos en todos los fotogramas (sin fundidos, que sobre navy se ven pardos).

**Luz · una vez.** 0–0,30 s: célula presente, sin rayos; con nombre, «Celuma» sin acento. Es lo que mostraría una pantalla de arranque estática del sistema operativo antes de la animación. Cada rayo nace como un **punto de luz** (opacidad 0 → 1 en 0,10 s) y se proyecta: las puntas redondeadas se conservan y solo se alarga el tramo recto. Rayo 1 a 0,30 s, rayo 2 a 0,44 s, rayo 3 a 0,58 s; 0,46 s cada uno, con `cubic-bezier(.22,1,.36,1)`. Con nombre, el acento de la é hace lo mismo entre 0,89 y 1,25 s. Fin 1,04 s (isotipo) o 1,25 s (lockup), más 0,40 s de reposo.

**Enfoque.** 0–0,10 s vacío (transparente). 0,10–0,85 s: el campo circular (centro del círculo mínimo que contiene el isotipo, radio 343,9 unidades) se abre con curva de iris `cubic-bezier(.3,0,0,1)`. 0,10–0,95 s: la célula se asienta de 1,05 a 1 sobre ese centro, con `cubic-bezier(.2,0,0,1)` y sin rebote. Los rayos aparecen cuando el campo los alcanza. Con nombre, 0,85–1,45 s: en horizontal, el campo se estira hacia la derecha como una cápsula hasta contener todo el nombre; en vertical, crece hasta el círculo que encuadra la firma completa. Por convexidad, el isotipo no vuelve a ocultarse mientras tanto. Fin y reposo de 0,45 s.

**Trazo.** 0,12–0,92 s: la membrana se dibuja en sentido horario desde junto a los rayos. Es el anillo exacto (membrana menos citoplasma) descubierto por un trazo de 47,4 unidades que recorre su línea media, un mate de pista que se solapa un 4 % al cerrar para que no quede fisura. 0,72–1,08 s: el citoplasma se llena desde el centro con un círculo que crece; no es un fundido, porque sobre navy el menta a media opacidad se ve gris. Hacia 1,10 s el anillo cede el paso a la membrana del maestro. 0,90–1,30 s: el núcleo crece desde su centro (0,35 → 1). 1,12–1,38 s: el nucléolo. 1,18–1,62 s: los trazos internos se escriben en su dirección principal. 1,56–2,16 s: los rayos se dibujan desde la base, conservando las puntas. Con nombre, 1,40–2,01 s: las letras se escriben de izquierda a derecha (0,24 s cada una, 75 ms de desfase) y el acento es el último trazo (2,03–2,23 s). Reposo de 0,45 s. El outro es la misma animación al revés.

**Ajustes tras revisar fotogramas**

1. Fisura blanca donde se cerraba la membrana: el trazo del mate ahora se solapa.
2. Citoplasma gris sobre navy: se cambió el fundido por un llenado desde el centro.
3. En Trazo, el acento barrido se leía un instante como acento grave («Cèluma»): ahora crece desde su base como los rayos.
4. En el SVG + CSS del loader, escribir `transform: none` en los reposos hacía que CSS interpolara desde funciones identidad y el rayo 2 giraba a mitad de ciclo: se mantiene la lista completa de funciones de la fase 2.

## 3. Tipografía en movimiento: A y B

- Las dos se generan desde los lockups de la fase 1 (horizontal y vertical, positivo sobre crema/blanco y negativo sobre navy). La geometría y la separación son idénticas; solo cambia el wordmark.
- **Luz** solo mueve el acento (cuarta luz). **Enfoque** no mueve las letras: el campo las descubre. **Trazo** las escribe con un barrido por letra y dibuja el acento.
- **Recomendación para motion: A · Baloo 2 800** (argumento, no decisión de D-1):
  - ya está en la app, el landing y los docs, así que el movimiento no introduce una segunda voz;
  - es geometría de fuente, con glifos separados limpiamente, grosor constante y acento aislado, y el comportamiento es predecible al escribir letra a letra;
  - B es un trazado de raster (error ≤ 0,64 px). En piezas de 1080 px el movimiento dirige la mirada a sus bordes, aunque técnicamente funciona igual y su carácter de lettering encaja con Trazo.
- **Límite técnico de A:** la fase 1 escribe Baloo con curvas cuadráticas (Q) y Lottie solo tiene cúbicas. La conversión es exacta, pero Chromium tesela Q y C de forma distinta: dos SVG con la misma curva difieren en la banda de antialias de 1 px. Por eso el final Lottie de A es **idéntico a la «gemela cúbica»** del archivo de la fase 1 y no al archivo con Q (§7). Si A se adopta, conviene exportar el wordmark con cúbicas para que SVG y Lottie compartan rasterizado.

## 4. Contextos y recomendación

- **Carga compacta → Luz · bucle.** En la app, como **SVG + CSS en línea** (`svg/luz-isotipo-loop.svg`: 8,2 KB, 2,8 KB con gzip), sin añadir lottie-web (305 KB) al producto. Reglas de uso de la maqueta:
  - mostrarlo tras 400 ms y, una vez visible, mantenerlo al menos 600 ms;
  - el estado real lo da el texto;
  - si convive más de 5 s con otro contenido, detenerlo tras 3 ciclos (WCAG 2.2.2);
  - con `prefers-reduced-motion`, logo estático.

  Compromisos: a 32 px el cambio es muy discreto; tiene menos carácter que la Mirada; como `<img>` no respeta el movimiento reducido.
- **Material visual → Trazo.** Intro 16:9, pieza 1:1 con lockup vertical y hero del landing solo con isotipo. Compromisos: 2,6–2,7 s; muchos elementos; los mates y máscaras encarecen el render en canvas y no se probaron en iOS ni Android. Para redes se entrega como vídeo.
- **Bienvenida → Enfoque** (sugerida): breve, termina en el lockup y las letras quedan quietas. Alternativa si se prefiere continuidad con el loader: Luz · una vez.

## 5. Archivos

| Ruta | Qué es |
|---|---|
| `index.html`, `galeria.css`, `galeria.js` | Galería de decisión. Reutiliza `../experiment.css`, los tokens y el lottie-web local de la fase 2 (`../vendor/`), y reproduce la fase 2 desde `../anim/review-data.js` sin tocarla |
| `data.js` | Los 32 Lottie, los estáticos, los SVG + CSS y las líneas de tiempo, incrustados para que la galería abra como archivo (~1,2 MB; solo para revisión) |
| `lottie/<dirección>-<isotipo\|lockup-{a,b}-{h,v}-{pos,neg}>-<once\|loop>.json` | 32 Lottie (Bodymovin 5.x, 60 fps): Luz con 5 bucles y 9 de una vez; Enfoque y Trazo con 9 de una vez cada una |
| `svg/luz-<isotipo\|lockup-…>-loop.svg` | Loader Luz en SVG + CSS: isotipo y lockups horizontales A/B en positivo y negativo |
| `estaticos/isotipo.svg`, `estaticos/lockup-*.svg` | Maestro y los 8 lockups de color de la fase 1, copiados byte a byte salvo el lienzo (`viewBox`/`width`/`height`, comprobado en §7). Sirven de respaldo, para movimiento reducido y como referencia |
| `preview/luz.mp4`, `enfoque.mp4`, `trazo.mp4` (+ `.webm`, `-poster.jpg`) | Vídeo de revisión por dirección, 1280 × 720 |
| `preview/trazo-social.mp4`, `preview/trazo-intro.mp4` (+ `.webm`) | Piezas de material: 1080 × 1080 (A vertical sobre crema) y 1920 × 1080 (A horizontal sobre navy): intro, reposo y outro |
| `validation/lamina-{luz,enfoque,trazo}.png` | Láminas de fotogramas clave (isotipo, A y B; crema y navy; 2×) |
| `validation/lamina-carga-tamanos.png`, `lamina-final-vs-estatico.png` | Loader a 32–96 px en tres fondos y último fotograma frente al estático, con diferencia ×8 |
| `validation/metrics.json` (`.js`), `pagecheck.json` (`.js`), `spec.json` | Métricas, prueba de la galería y especificación resuelta |
| `vistas/*.png`, `*.jpg` | Capturas de la galería (1440 y 390 px, reducido, navy, B vertical) |
| `scripts/` | Generador y validación (§9) |

Pesos gzip de referencia:

| Archivo | Peso gzip |
|---|---|
| Luz isotipo bucle | 2,9 KB |
| Luz isotipo una vez | 2,7 KB |
| Enfoque isotipo | 2,6 KB |
| Trazo isotipo | 6,5 KB |
| Trazo lockup A | 10,0 KB |
| Enfoque lockup A | 5,2 KB |

## 6. Formatos y compatibilidad

- **Lottie de las tres direcciones:**
  - solo usa capas de forma (`ty: 4`), grupos, rellenos, trazados con morph, recortes de trazo (*trim*) y, donde se indica, máscaras (`masksProperties`, modo suma) y un mate alfa (`td`/`tt`);
  - no usa expresiones, efectos, texto, imágenes, 3D, *time remap* ni *merge paths*;
  - los colores se guardan como (k + 0,25)/255, igual que en la fase 2, para que sean exactos en lottie-web;
  - cada archivo lleva marcadores con sus fases.
- **Qué no conviene en Lottie.** Todo se pudo representar. Hay dos matices:
  - Enfoque y Trazo dependen de máscaras y mates. Funcionan en lottie-web y ThorVG, pero en lottie-ios, lottie-android y After Effects hay que probarlos antes de adoptarlos. Para la web, Enfoque tiene un equivalente ligero en SVG con `clip-path`, no construido.
  - Para redes, presentaciones y correo, el formato adecuado de Trazo es vídeo (MP4/WebM, o GIF sin movimiento reducido).
- **SVG + CSS (Luz):** CSS en línea, sin SMIL, con `@media (prefers-reduced-motion: reduce)`. Como `<img>`, Chromium lo anima igualmente, así que se usa en línea o en `<picture>` con el estático, igual que en la fase 2.

| Entorno | Estado |
|---|---|
| lottie-web 5.13.0, renderizador SVG, Chromium | **Probado**: todos los primeros y últimos fotogramas; todos los fotogramas a media resolución |
| lottie-web 5.13.0, renderizador canvas, Chromium | **Probado**: primer y último fotograma del isotipo y de los lockups horizontales positivos |
| ThorVG (dotlottie-web 0.80.0, WASM), Chromium | **Probado**: los mismos casos que canvas |
| SVG + CSS en Chromium (en línea, `<img>`, reducido) | **Probado** |
| lottie-ios, lottie-android, Safari/WebKit, Firefox, After Effects, Figma, dispositivos reales | **No probado.** El WebKit de Playwright falla en este macOS y no hay simulador ni emulador preparado. No se afirma compatibilidad |

## 7. Validación

Se usaron reproductores reales en Chromium headless (Playwright). Cada fotograma Lottie se dibuja en un DOM nuevo. Las referencias son los estáticos de `estaticos/`, rasterizados por el mismo navegador. Las tolerancias E, T1 y T2 son las de la fase 2 (`../README-FASE2.md` §5).

**Tolerancias**

- **E:** RGBA idéntico en el 100 % de los píxeles.
- **T1** (lottie-web SVG):
  - IoU ≥ 0,9999;
  - |Δα| > 2/255 solo en la banda de antialias de 1 px;
  - ΔE00 máximo en planos ≤ 0,5.
- **T2** (canvas, ThorVG y CSS mientras anima):
  - IoU ≥ 0,999;
  - diferencias solo en la banda de antialias;
  - ΔE00 medio ≤ 0,5 y máximo ≤ 1,0.

**Resultados** (`validation/metrics.json`; 32 variantes; renders en 165 s)

| Comprobación | Resultado |
|---|---|
| Estáticos frente a la fase 1 (comparación de texto) | **9/9 idénticos salvo el lienzo** (`viewBox`/`width`/`height`) |
| **Último fotograma, lottie-web SVG, 1×** | **12/32 idénticos píxel a píxel** al estático: los 4 isotipos (Luz bucle y una vez, Enfoque, Trazo) y los 8 lockups B horizontales. **8/32** (lockups A horizontales) son **idénticos a la gemela cúbica**. **12/32** (lockups verticales A y B) cumplen T1: IoU 1,0 y como máximo 11 píxeles de un borde con diferencia de 3/255, por redondeo de coma flotante al desplazar la caja vertical |
| Último fotograma a 2× (isotipo y lockups horizontales positivos) | 8 idénticos y 4 lockups A idénticos a su gemela cúbica |
| Lockups A frente al archivo con curvas Q | IoU 0,99949. Solo difiere la banda de antialias de los bordes curvos (α ≤ 83/255); las rectas coinciden. Es un teselado distinto de Q y C, no una diferencia de geometría (§3) |
| Primer fotograma | Enfoque y Trazo: **vacío** (alfa 0 en toda la caja). Bucles: el maestro o el lockup. Luz una vez: maestro sin rayos y, con nombre, sin acento (idéntico, o idéntico a la gemela en A) |
| lottie-web canvas y ThorVG (isotipo y lockups horizontales positivos) | ΔE00 = 0 en planos. Todas las diferencias están en la banda de antialias. Isotipo: IoU ≥ 0,9993, **cumple T2**. Lockups: IoU 0,9983–0,9993, **por debajo del 0,999 de T2**, porque el texto tiene mucho más borde por área. Se declara como no cumplido; es solo antialias |
| **Cierre de los bucles** (último fotograma frente al primero) | **11/11 idénticos** (SVG, canvas y ThorVG). El loop no salta |
| **Todos los fotogramas** (18 variantes, 2 183 fotogramas a media resolución, DOM nuevo en cada uno) | **Alfa 0 en el borde de la caja en todos**: nada se recorta. Cambio máximo entre fotogramas consecutivos: 5,6 % de los píxeles del logo, en Enfoque al abrir el campo. No hay destellos ni saltos de fondo completo |
| **Loader SVG + CSS** (5 archivos) | Fotograma 0 frente al estático: IoU 0,9980–0,9995, solo antialias y ΔE 0; mientras hay animaciones activas, Chromium rasteriza todo el SVG algo distinto (T2, como en la fase 2). t = duración igual a t = 0 (cierra). Paridad con Lottie en 12 instantes del ciclo: solo banda de antialias, ΔE 0 (peor IoU 0,9979). **Movimiento reducido en línea: idéntico al estático**, con `transform: none` y sin animaciones corriendo. **Como `<img>` sigue animándose** (limitación de Chromium ya conocida) |
| Galería (`validation/pagecheck.json`) | Sin errores de consola ni imágenes rotas, abierta como archivo y servida por http. 26 reproductores (18 Lottie y 8 SVG + CSS); fuera de pantalla se pausan. Controles comprobados: tipografía, orientación, fondo, pausa y reinicio globales, velocidad, bucle/una vez, barra de fotogramas, outro al revés y loaders. **Movimiento reducido** (sistema o botón): 26/26 estáticos, 0 animaciones activas. **390 px:** 0 px de desbordamiento horizontal y ningún reproductor recortado, con A, B vertical y solo isotipo |

**Alcance.** Chromium headless en macOS. Los fotogramas intermedios se revisaron a ojo en las láminas, los vídeos y las tiras de fotogramas. Los cuatro defectos de §2 se encontraron así y se corrigieron.

## 8. Accesibilidad y movimiento reducido

- **Galería:**
  - con la preferencia del sistema, o con el botón «Movimiento reducido», no se crea ningún reproductor: se muestra el SVG estático exacto;
  - los controles son botones nativos con `aria-pressed`, y cada tarjeta tiene pausa, reinicio y barra de fotogramas;
  - un control global pausa, reinicia y cambia la velocidad;
  - los reproductores fuera de pantalla se pausan.
- **Integración propuesta:**
  - loader SVG en línea (movimiento reducido: estático);
  - Lottie consultando `prefers-reduced-motion`: estático, o último fotograma en las animaciones de una vez y fotograma 0 en el bucle;
  - pausa tras 3 ciclos si convive más de 5 s con otro contenido;
  - el estado siempre en texto (`role="status"`), nunca solo en el logo.

## 9. Reproducir

```
cd labs/experiments/2-logo-vector-v2/fase-3/scripts
/opt/homebrew/bin/python3.10 fase3.py                        # Lottie, SVG+CSS, estáticos, data.js, spec
/opt/homebrew/bin/python3.10 validate.py <players> <trabajo> # reproductores reales + métricas (~3 min)
/opt/homebrew/bin/python3.10 sheets.py <players> <trabajo>   # láminas (usa los renders de validate.py)
node video.mjs                                               # vídeos MP4/WebM + pósteres (~5 min)
node page_check.mjs                                          # prueba de la galería (file://, http, reducido, 390 px)
```

- `<players>` contiene `lottie-web-5.13.0/package` y `lottiefiles-dotlottie-web-0.80.0/package` desempaquetados: son los mismos paquetes de la fase 2 (`npm pack`, SHA-256 `00f306a9…fd4f` y `187df578…7bb7`), y no se descargó nada nuevo.
- `<trabajo>` es una carpeta fuera del repositorio para los renders (~80 MB, regenerables).
- Herramientas ya instaladas: Python 3.10 de Homebrew, el Playwright/Chromium de `celuma-frontend` y ffmpeg 6.0.

## 10. Límites y lo que no se hizo

- No se probaron plataformas nativas, Safari ni Firefox (§6). El rendimiento no se midió en dispositivos.
- Los fotogramas intermedios se juzgan a ojo. Las métricas cubren los extremos, los bordes, el cierre de los bucles y los saltos.
- No hay exportación final para redes, correo ni GIF: los vídeos son vistas previas.
- No se construyeron las versiones SVG + CSS de Enfoque y Trazo, ni variantes monocromas animadas.
- No se decide D-1 ni D-2, no se enlaza en `labs/index.html` y no se modificaron las fases 1 y 2.
