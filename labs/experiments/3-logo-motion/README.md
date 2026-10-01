# Experimento 03 · Motion de Céluma

**Estado: exploración, primera ronda (2026-09-27). Nada aprobado.** Seis direcciones propias de movimiento sobre la identidad aprobada en el experimento 02. Encargo: [`PROMPT.md`](PROMPT.md) · aprendizajes, principios y direcciones: [`BRIEF.md`](BRIEF.md) · estado, recomendaciones y preguntas: [`DECISION.md`](DECISION.md).

## Abrir la galería

Desde la raíz de `celuma-brand-system`, arranque `python3 -m http.server 8000` y abra `http://localhost:8000/labs/experiments/3-logo-motion/`, con barra final. La galería carga sus archivos por HTTP, así que no funciona abierta con `file://`. También funciona en el preview `npx serve` (puerto 5050), que quita `.html` e `index`. La entrada normaliza la carpeta con `history.replaceState` antes de cargar los recursos relativos (la corrección vigente en el lab, sin redirecciones).

- **Una sola página:** direcciones → fichas → contextos → comparación con 02 → marca y principios → validación → archivos.
- **Barra global:** pausar/reproducir, reiniciar, repetir, velocidad (¼× a 2×), fondo (crema, blanco, navy), firma (isotipo, horizontal, vertical) y movimiento reducido. Cada dirección tiene su transporte (pausa, reinicio y barra de posición) y su selector de formato.
- **Enlaces de revisión:** la carpeta acepta `?fondo=navy`, `firma=lockup-h` o `lockup-v`, `velocidad=0.5` y `reducido=1`, más un ancla: `#d-respira`, `#d-relevo`, `#d-brote`, `#d-atento`, `#d-orden`, `#d-rebote`, `#contexto`, `#comparar`. Por ejemplo, `…/3-logo-motion/?fondo=navy&firma=lockup-v#d-brote`.

## Direcciones

| | Respira | Relevo | Brote | Atento | Orden | Rebote |
|---|---|---|---|---|---|---|
| Expresión | 1 · producto | 1 · producto | 2 · bienvenida | 3 · interacción | 4 · marca | 5 · marca expresiva |
| Idea | El interior respira ±3 %; los rayos acompañan 10 u; la membrana no se mueve | La firma se asienta en la cabecera (FLIP) y el contenido entra | Del nucléolo nace la célula; la luz sale de detrás de la membrana; el nombre se asienta | El nucléolo mira al puntero o al foco, dentro del núcleo; los rayos se alargan un 6 % | Campo celular → cuadrícula → una célula se vuelve Céluma → la luz despeja | Cae, se aplasta 15 % y rebota; nucléolo con inercia; la luz asoma con impulso |
| Duración | Bucle de 3,6 s | 0,48 s la firma; ≈ 0,7 s en total | 2,03 s (isotipo) · 2,23 s (nombre) | Continua; se asienta en ~0,4 s | 4,33–4,45 s | 1,87 s · 2,30 s |
| Bucle / una vez | Bucle | Una vez por transición | Una vez | Eventos | Una vez | Una vez (sticker con repetición) |
| Final | Maestro (fotograma 0 = último) | Lockup A exacto, sin transformaciones | Capa estática exacta | SVG exacto al volver al reposo | Lockup o isotipo exacto sobre fondo liso | Capa estática exacta |
| Tamaño | 48–96 px | 64 → 40 px | ≥ 96 px; nombre ≥ 240 px de ancho | ≥ 120 px (micro: 32–48) | 16:9 a 1280–1920; 1:1 a 1080 | ≥ 160 px; 1:1 a 1080 |
| Formatos | SVG + CSS · Lottie · estático · `js/respira.js` | `js/relevo.js` (HTML/CSS/JS) | Lottie · SVG + CSS · estático | `js/atento.js` + SVG en línea | Lottie · MP4/WebM · estático | Lottie · MP4/WebM · GIF · estático |
| Reducido | Estático exacto | Fundidos de 120 ms | Estático exacto | Sin oyentes | Estático | Estático |

Las fichas completas (intención, relación con Céluma, contexto, limitaciones) están en la galería y en `galeria.js` (`DIRS`). **Ningún Lottie usa máscaras, mates, efectos, expresiones, texto ni imágenes**: solo capas de forma con traslación, escala uniforme o no uniforme (Rebote), rotación y opacidad.

**Reglas de uso del loader (Respira), en `js/respira.js`:** aparece solo si la espera supera 400 ms; una vez visible, dura al menos 600 ms; tras 3 ciclos (~11 s) vuelve al reposo por el camino más corto, mientras el texto sigue informando; al terminar se funde en 120 ms y el contenido no espera a la animación. El estado siempre va en texto con `role="status"`. No se usa dentro de botones ni por debajo de 24 px.

## Archivos

| Ruta | Qué es |
|---|---|
| `index.html`, `galeria.css`, `galeria.js` | Galería única (reutiliza los tokens, `lab.css` y los archivos de 02 solo para leerlos) |
| `lottie/<dirección>-<isotipo\|lockup-{h,v}-{pos,neg}>.json` | 18 Lottie (Bodymovin 5.7, 60 fps): Respira 3, Brote 5, Rebote 5, Orden 5 |
| `svg/<dirección>-<sujeto>.svg` | 8 SVG + CSS (`@keyframes`, sin SMIL; `prefers-reduced-motion` dentro): Respira 3, Brote 5 |
| `estaticos/<dirección>-<sujeto>.svg` | Arte exacto de 02 recolocado en la caja de cada pieza (solo cambia `viewBox`/`width`/`height`). Reposo, reducido y referencia |
| `js/respira.js`, `js/relevo.js`, `js/atento.js` | Módulos sin dependencias con las reglas de uso, la coreografía FLIP y la atención interactiva |
| `preview/*.mp4`, `*.webm`, `*-poster.jpg` | Vídeos de revisión (Respira, Brote, Rebote, 1280 × 720) y piezas de ejemplo: `orden-16x9-navy` (1920 × 1080), `orden-1x1-crema` y `rebote-social-1x1` (1080 × 1080) |
| `preview/rebote-sticker.gif` | Sticker 480 × 480, 30 fps, 64 colores |
| `spec.json` | Variantes, cajas, marcadores, líneas de tiempo, tiempos y pesos (lo leen la galería y los scripts) |
| `files.json` | Manifiesto de descargas de la galería |
| `validation/metrics.json`, `pagecheck.json`, `lamina-*.png` | Métricas, prueba de la galería y láminas de fotogramas clave |
| `vistas/*.jpg` | Capturas de la galería (1440 y 390 px, reducido sobre navy) y de los seis contextos |
| `vendor/lottie-web-5.13.0/` | Copia local del reproductor para la galería (MIT; mismo SHA-256 que en 02, `2eb76297…18ac`). No es una dependencia de producto |
| `scripts/` | Generador, validación, vídeo, láminas, prueba de página y manifiesto (§ Reproducir) |

Pesos de referencia (normal / gzip): Respira isotipo, SVG + CSS 8,3 / 2,7 KB y Lottie 10,6 / 2,6 KB. Brote isotipo, 10,9 / 3,0 KB y 18,8 / 2,8 KB. Brote con nombre, 26 / 5,2 KB y 46,7 / 5,9 KB. Rebote con nombre, Lottie 47,9 / 6,1 KB. Orden, Lottie 131–201 / 11–18 KB (36–50 células de campo).

## Formatos y compatibilidad

| Entorno | Estado |
|---|---|
| lottie-web 5.13.0, renderizador SVG, Chromium | **Probado**: primer y último fotograma de las 18 variantes; todos los fotogramas a media resolución |
| lottie-web 5.13.0, canvas · ThorVG (dotlottie-web 0.80.0) | **Probado** en los finales de los 4 isotipos y de Brote con nombre horizontal |
| SVG + CSS en línea, Chromium | **Probado**: t = 0 / terminado, y con `prefers-reduced-motion` emulado |
| Web Animations (Relevo), `getScreenCTM` (Atento), shadow DOM (galería) | Probado en Chromium mediante la prueba de página |
| Safari/WebKit, Firefox, lottie-ios, lottie-android, After Effects, dispositivos reales | **No probado.** El WebKit de Playwright falla en este equipo. No se afirma compatibilidad |

## Validación

Reproductores reales en Chromium headless (Playwright 1.62 del `celuma-frontend`), con un DOM nuevo por fotograma. Se usan las mismas tolerancias que en 02 (`validation/metrics.json`):

- **E:** 100 % de píxeles idénticos.
- **T1:** IoU ≥ 0,9999, solo antialias.
- **T2:** IoU ≥ 0,999; ΔRGB medio ≤ 1 en planos.
- **AA:** no cumple T2 (IoU < 0,999), pero todas las diferencias están en la banda de antialias de ±1 px (bordes y costuras entre pigmentos).

| Comprobación | Resultado |
|---|---|
| Último fotograma frente al estático | **14/18 idénticos (E)** al estático o a su «gemela cúbica». Son los 4 isotipos y los lockups horizontales y verticales cuya caja no se desplaza con decimales. Los lockups A tienen curvas Q (Baloo) que Lottie escribe como C exactas y Chromium tesela distinto, igual que en 02. Los 4 restantes (Brote y Rebote verticales) quedan en **T1** frente a la gemela. **18/18** sin diferencias fuera de la banda de antialias |
| Primer fotograma | Respira: el maestro (E). Brote, Rebote y Orden: cuadro vacío (alfa 0) |
| Cierre de bucles | **3/3** idénticos (último = primero) |
| Borde de la caja | Alfa 0 en todos los fotogramas de las 18 variantes: nada se recorta |
| Saltos entre fotogramas | ≤ 7,6 % de la caja en Respira, Brote y Orden. Rebote llega al 37,5 % durante la caída (un movimiento rápido y único, sin destellos) |
| SVG + CSS | Brote terminado: **E** en los 5. Respira en t = 0 con la animación en marcha: T2 en el isotipo y AA en los lockups (Chromium rasteriza distinto mientras hay animaciones activas, ya visto en 02). **Movimiento reducido: 8/8 E, 0 animaciones en marcha** |
| canvas / ThorVG | T2 en isotipos (IoU 0,9993–0,9997); AA en ThorVG con Brote horizontal y Orden (IoU 0,9986–0,9987). Colores de planos idénticos |
| Estructura y color | **18/18 Lottie** sin máscaras, mates, efectos, expresiones, texto, imágenes ni *time remap*; solo la paleta aprobada más navy y blanco. Los 8 SVG + CSS, igual |
| Geometría | Rebote: el nucléolo se aleja como máximo 58,0 u del centro del núcleo (límite 70; margen de 20 u al borde). Respira: el anillo de membrana pasa de 31,5 a 24,5 u en la inspiración; el citoplasma nunca la cruza |
| Reproducción (rAF, headless, indicativo) | Mediana de 8,3 ms y p95 ≤ 9,3 ms, sin fotogramas de más de 20 ms, en Respira (96 px), Brote (160 y 480 px), Rebote (240 px) y Orden (960 px). Con la galería entera activa: mediana de 8,3 ms y p95 ≤ 9,5 ms |

**Prueba de la galería** (`scripts/page_check.mjs` → `validation/pagecheck.json`), en tres servidores: `python3 -m http.server` nuevo, `npx serve` del preview (el mismo comportamiento que el 5050) y el `127.0.0.1:8765` de Rafael.

- **Entradas directas:** carpeta con barra, sin barra, `index.html` y `?fondo=navy#comparar`. Todas cargan, sin errores de consola ni desbordamiento. La consulta aplica el fondo y el ancla queda a la vista (≤ 600 ms tras construir).
- **Recorrido con clics:** laboratorio → «Abrir motion» → 03 → «← Laboratorio», y 03 → «02 · Motion anterior».
- **1440 y 390 px:** 0 px de desbordamiento; seis pestañas de contexto visibles y sin errores; 14 reproductores Lottie y 23 raíces SVG + CSS/estático.
- **Controles:** fondo navy, firma horizontal, velocidad, pausa (el tiempo se detiene) y comparación con Trazo de 02.
- **Movimiento reducido:** tanto con el botón como con la preferencia del sistema emulada, 0 reproductores Lottie, 0 animaciones en marcha y aviso visible.
- **Con `serve`**, al entrar sin barra final o con `index.html`, Chromium hace 8 peticiones especulativas con rutas relativas a la carpeta superior, antes de que el script normalice la dirección. Devuelven 404 y la página carga después todo bien. La misma entrada de 02 produce 20. Es un efecto conocido de la normalización del lab, no un recurso roto.

**Revisión manual en el navegador de la vista previa** (Claude, preview `serve`): clic en «Abrir motion» desde el laboratorio, clic en «En contexto» (ancla conservada), direcciones en escritorio, colores exactos comprobados en el DOM (`#49b6ad` en la membrana). El panel estaba oculto: Chromium frena temporizadores y animaciones en páginas ocultas, así que el ritmo se juzgó con los vídeos, las láminas y Playwright, no en ese panel.

**Ajustes hechos durante la revisión:**

1. Los rayos de Brote y Orden asomaban antes de que existiera la membrana que debía taparlos. Ahora son invisibles hasta que están tapados.
2. En Orden, una letra podía entrar mientras quedaba un punto de la cuadrícula debajo. Ahora cada letra espera al frente de luz.
3. Rebote caía desde fuera de la caja y aparecía en una línea invisible. Ahora cae desde media altura dentro del cuadro.
4. El loader retrasaba el contenido hasta terminar la respiración. Ahora se funde en 120 ms.
5. El tamaño real de Orden a 480 px desbordaba en móvil. Ahora se limita al ancho disponible.
6. La comparación en reducido pedía un estático inexistente. Ahora usa los estáticos de 02.
7. Carrera entre el desplazamiento nativo al ancla y el contenido que construye JS.
8. La métrica ignoraba las costuras entre pigmentos al definir la banda de antialias.

## Accesibilidad

- Movimiento reducido en todas las piezas. SVG + CSS: media query dentro del archivo, que deja el arte exacto. Lottie: la galería no crea el reproductor y muestra el estático. Atento no instala oyentes y Relevo solo usa fundidos. Como `<img>`, Chromium ignora el movimiento reducido dentro de un SVG (visto en 02): usar el SVG en línea o `<picture>` con el estático.
- Los bucles se detienen tras 3 ciclos si conviven con contenido (WCAG 2.2.2). Ninguna pieza parpadea más de 3 veces por segundo; ningún cambio de luminancia afecta a todo el cuadro.
- Controles con botones nativos, `aria-pressed` y foco visible; pestañas de contexto con `role="tab"` y flechas del teclado; logos animados con `aria-hidden` dentro de los loaders, con el estado en `role="status"`.
- Sin probar con lectores de pantalla ni en dispositivos reales.

## Reproducir

```
cd labs/experiments/3-logo-motion/scripts
/opt/homebrew/bin/python3.10 motion03.py                                 # Lottie, SVG + CSS, estáticos, spec.json (lee 02 sin modificarlo)
/opt/homebrew/bin/python3.10 sheet.py <players> <trabajo> [dirección …]   # láminas de fotogramas clave
/opt/homebrew/bin/python3.10 validate.py <players> <trabajo>             # reproductores reales + métricas (~2,5 min); --no-render reutiliza renders
node video.mjs [escena …]                                                 # vídeos, pósteres y GIF (~6 min)
/opt/homebrew/bin/python3.10 manifest.py                                  # files.json
node page_check.mjs --python [http://localhost:5050 http://127.0.0.1:8765] # prueba de la galería en servidores reales
```

- `<players>` contiene `lottie-web-5.13.0/package` y `lottiefiles-dotlottie-web-0.80.0/package`: los mismos paquetes de 02, obtenidos con `npm pack` y verificados por SHA-256. Se copiaron de una sesión anterior al scratchpad; no se descargó nada.
- `<trabajo>` es una carpeta fuera del repositorio para los renders.
- Herramientas ya instaladas: Python 3.10 de Homebrew (NumPy, SciPy, OpenCV, Pillow), Playwright/Chromium de `celuma-frontend` y ffmpeg 6.0. No se instaló ninguna dependencia.

## Límites y lo que no se hizo

- Solo Chromium en macOS; ni Safari, Firefox, iOS, Android ni dispositivos. Los fotogramas intermedios se juzgan a ojo.
- Los vídeos son vistas previas o ejemplos, no exportaciones finales para redes. La pieza social usa el texto comprobado de las notas de la versión 1.3.1 (el mismo de la revisión gráfica) y debe revisarse con producto antes de publicarse.
- No hay versiones monocromas animadas ni SVG + CSS de Orden y Rebote (demasiados elementos o deformación: Lottie o vídeo).
- No se tocaron 02 (maestros, galerías, animaciones, exportaciones), los tokens y assets canónicos ni otros repositorios. No hubo commit, push ni publicación.
