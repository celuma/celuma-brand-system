# Brief · 02 · Isotipo vectorial (2-logo-vector-v2)

**Estado:** aprobado por Rafael el 2026-09-26; ver `DECISION.md` para el alcance y las tareas de incorporación. Este brief conserva el registro anterior de exploración.
**Responsable:** Claude (asistente), por encargo de Rafael
**Fecha:** 2026-09-26
**Revisión:** Rafael aprobó la dirección visual el 2026-09-26; validación por medio aún pendiente.

## Hipótesis y alcance

- **Problema u oportunidad.** No existe un maestro vectorial del logotipo. Todo son PNG, y el isotipo pierde los rayos por debajo de ~20 px (revisión gráfica §6, D-2).
- **Superficie y audiencia.** La identidad en todas las superficies: app, landing, docs, impresos y comunicación. El público de esta revisión es Rafael, más quien responda por la marca.
- **Qué se quiere comprobar.** Si se puede construir un SVG editable del isotipo V2 que reproduzca el raster dentro de su propio margen de ruido, sin reinterpretarlo. Y si, sobre él, se puede proponer un mini sistema: adaptaciones, lockups, reglas y exportaciones.
- **Criterio observable de éxito.**
  - IoU de silueta ≥ 0,99 y desviación media de borde ≤ 0,25 px.
  - Color de los planos con ΔE00 < 1.
  - Cientos de nodos como máximo, no miles, y ningún raster embebido.
  - Comparación visual reproducible.
  - Lo fiel separado de lo adaptado.
- **Fuera de alcance.**
  - Aprobar o publicar.
  - Tocar assets, tokens, lienzos, docs, el frontend o el experimento 01.
  - Decidir D-1.
  - Pruebas de imprenta.
  - Implementar la animación (fase 2).

## Referencias

- **Fuente.** `assets/celuma-isotipo.png`, un recorte exacto de `docs/revision-grafica/referencias/notion/Celuma_Isotipo_V2.png`. La imagen del PDF histórico `Propuesta de marca Céluma.pdf` es el mismo dibujo.
- **Referencias de Notion.** Con autorización de Rafael se copiaron `Celuma_Logotipo_V2.png` y `Celuma_Banner_V2.png` en `referencias/notion/`.
- **Contexto leído.**
  - `docs/revision-grafica-y-direccion-de-marca.md`: §6, §8, D-1 y D-2.
  - `docs/estado-de-piezas.md`.
  - `styles/celuma-tokens.css`.
  - El PDF histórico, en solo lectura.
- **Tokens y reglas que se mantienen.** Navy `#0d1b2a`, crema `#fbf6ec`, Baloo 2 800 y tracking −0,02 em, la protección de ½ isotipo (propuesta §8) y la regla de texto navy sobre teal.
- **Desviaciones.**
  - El maestro usa los colores medidos del PNG, no los tokens `--celuma-iso-*`, que difieren en ΔE00 2,2–4,7.
  - Los tokens no se tocaron.
  - Membrana y trazos se unificaron en `#3baca6`: en el PNG difieren en 1 nivel.
- **Contratos de producto.** Ninguno. Los ejemplos de app y landing son maquetas.

## Variantes y recursos

- **Variantes.** Todo está en `README.md` §1.
  - Fiel: maestro, color.
  - Adaptaciones: una tinta sólida y con tramas, en navy y en blanco, más la versión reducida de 16–24 px.
  - Wordmarks: A (Baloo 2) y B (trazado del V2).
  - Lockups: horizontal y vertical, en cuatro variantes cada uno.
  - PNG, favicon e iconos.
- **Origen y licencia de recursos externos.**
  - Baloo 2 v1.700: Ek Type, SIL OFL 1.1. El TTF se usó fuera del repositorio.
  - Referencias de Notion: archivos de Céluma.
  - Fuentes comparadas para identificar el lettering: Google Fonts vía Chromium, sin guardar archivos. Las fuentes del sistema macOS se usaron solo para identificar.
- **Datos sintéticos.** Los ejemplos usan «Laboratorio Demo Norte», `persona@laboratorio-demo.test`, `app.ejemplo.test`, «Orden DEMO-0042» y fechas ficticias. No hay datos clínicos.

## Validación

- **Tamaños y dispositivos revisados.**
  - Chromium en macOS: 697 × 777 (1:1 con la fuente), 16, 20, 24, 28, 32, 64 y 256 px.
  - Lockups: 64, 80, 96 y 120 px de ancho en horizontal; 48, 64 y 80 px de alto en vertical.
  - Vistas a 1440 y 390 px, sin desbordamiento horizontal.
- **Contraste, foco y movimiento.**
  - Contraste de la membrana: 2,75:1 sobre blanco, 2,55:1 sobre crema, 6,33:1 sobre navy; 1,1:1 sobre teal y 1,2:1 sobre salmón (fondos no permitidos).
  - Los controles de la vista tienen foco visible.
  - No hay movimiento.
- **Fondos claros y oscuros.** Blanco, crema, navy, teal suave, teal, salmón y textura (`index.html#reglas`). Las exportaciones se revisaron sobre damero, blanco, crema y navy (`validation/lamina-exportaciones.png`).
- **Capturas y evidencia.**
  - `validation/lamina-*.png` y `validation/vistas/*.jpg`.
  - `examples/*.png`.
  - Métricas en `validation/*.json`.
  - `vistas-check.json`: sin errores de consola ni imágenes rotas.
  - `exports-check.json`: 25 SVG bien formados, sin `<image>` ni `<text>` y con la etiqueta de exploración; 31 PNG, transparentes salvo los iconos táctiles.
- **Problemas encontrados y corregidos durante la revisión.**
  - Muescas en los extremos de los rayos: el halo del PNG se clasificaba como citoplasma.
  - Una proyección de Newton que divergía.
  - Una métrica de extremos cuantizada a 1 px.
  - Una tabla de tamaños que deformaba imágenes.
  - Pies de figura con poco contraste.
- **Problemas abiertos.** Ver `README.md` §6 y §7: impresión, otros navegadores y editores, CMYK/Pantone y las decisiones de marca.

## Decisión inicial (superada por `DECISION.md`)

- **Resultado inicial:** exploración.
- **Persona que revisó y fecha:** pendiente.
- **Razón:** falta la revisión de Rafael, D-1 y D-2.
- **Archivos canónicos que requerirían cambio tras aprobar.** Se haría en un cambio separado, no en este experimento:
  - `assets/` (añadir el SVG maestro y los PNG; no sustituir `celuma-isotipo.png` sin decisión);
  - `styles/celuma-tokens.css` (si se alinean los `--celuma-iso-*`);
  - `docs/estado-de-piezas.md`;
  - `docs/revision-grafica-y-direccion-de-marca.md` (§6, D-1 y D-2);
  - el favicon y el logotipo del frontend, el landing y los docs, cada uno en su repositorio;
  - `labs/index.html` (enlace al experimento).

## Fase 2 · isotipo animado (2026-09-26)

- **Autorización.** Rafael revisó la fase 1 («ya quedó») y pidió continuar. Eso autoriza avanzar el experimento, no publicar ni cambiar la marca vigente. El entregable es el **isotipo**: el lockup sigue abierto (D-1) y no se animó.
- **Resultado:**
  - Lottie de una reproducción (3,20 s) y en bucle (4,80 s, sin salto);
  - SVG + CSS equivalente;
  - maestro estático en la caja de la animación;
  - vídeo MP4/WebM de vista previa;
  - página de revisión `animacion.html`.
- **Validación con reproductores reales:** lottie-web 5.13.0 (SVG y canvas) y ThorVG (dotlottie-web 0.80.0), en Chromium headless.
  - Último fotograma idéntico píxel a píxel al maestro en lottie-web SVG; primer y último fotograma del bucle idénticos.
  - Zona estática sin cambios en los 480 fotogramas y nucléolo siempre dentro del núcleo.
  - El SVG en línea y `<picture>` respetan el movimiento reducido. **Como `<img>`, el SVG animado no lo respeta en Chromium.**
  - Detalle en `README-FASE2.md` §5.
- **Sin probar:** lottie-ios, lottie-android, Safari/WebKit y Firefox.
- **Decisión posterior:** Rafael aprobó Mirada y las direcciones Luz, Enfoque y Trazo; ver `DECISION.md`. La validación de uso y compatibilidad por medio permanece pendiente.

