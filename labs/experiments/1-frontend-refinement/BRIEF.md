# Brief · Experimento 01 · Refinamiento del frontend

**Estado:** cerrado como exploración por Rafael el 2026-09-26; chips V4 y mejoras de contraste rescatados para revisión, sin aprobación de producto. Ver `DECISION.md`.
**Responsable:** Claude Code (Opus 5.5), por encargo de Rafael (`PROMPT.md`)
**Fecha:** 2026-09-25
**Revisión:** pendiente (Rafael y quien responda por UI/UX y producto)

## Ver el resultado en dos minutos

1. Desde la raíz de `celuma-brand-system`: `python3 -m http.server 8000` y abrir `http://localhost:8000/labs/experiments/1-frontend-refinement/` (con barra final). Con el servidor del `launch.json` («brand-system», `npx serve`, puerto 5050) la ruta es la misma.
2. Recorrer **Mi trabajo → Órdenes (ORD-EJ-0044) → Informe → Componentes** desde el lateral. En Informe, cambiar «Simular estado» y «Ver como».
3. «Controles de revisión» (arriba a la derecha) cambia los datos (normal, cargando, vacío, error), la densidad y muestra **notas de diseño** numeradas dentro de las pantallas.
4. Comparaciones listas: `capturas/comparacion/` (hoy vs. propuesta) y `direcciones.html` (A vs. B).

Rutas directas útiles: `#/trabajo?datos=error`, `#/trabajo?completadas=1&densidad=compacta`, `#/ordenes/ORD-EJ-0033` (cancelada), `#/informe?estado=APPROVED&como=admin`, `#/informe?estado=PUBLISHED`, `#/componentes/estados`.

## Hipótesis y alcance

- **Problema:** la app es cálida y reconocible, pero el estado clínico depende de colores de bajo contraste (Aprobado y Publicado casi iguales), la lista de trabajo mezcla la decisión del revisor con el estado del informe y oculta trabajo pendiente, los enums aparecen sin traducir en la trazabilidad y las listas desbordan en móvil.
- **Hipótesis:** si cada estado se expresa con texto, icono y forma dentro de una escala semántica común, y cada pantalla dice «qué sigue y quién», el equipo del laboratorio distingue sin ambigüedad borrador, revisión, aprobación y firma-publicación, **sin cambiar la identidad** ni perder densidad útil.
- **Superficie y audiencia:** app web para patología, técnica, revisión y administración de un laboratorio (escritorio y móvil).
- **Criterio observable de éxito:** (1) ningún estado se identifica solo por color; (2) Aprobado y Publicado difieren en fondo, icono y texto; (3) texto ≥ 4,5:1 y controles ≥ 3:1; (4) 0 px de desplazamiento horizontal a 1440, 768, 640, 390 y 320 px; (5) foco visible en todo el recorrido con teclado; (6) el flujo del informe usa solo estados y operaciones del contrato.
- **Fuera de alcance:** cambiar el frontend, tokens compartidos o lienzos; simular operaciones reales o persistencia; muestras, pacientes, médicos, facturación, configuración y portales; modo oscuro.

## Referencias

- **Marca:** `AGENTS.md`, `README.md`, `labs/README.md`, `labs/CLAUDE.md`, `docs/estado-de-piezas.md`, `docs/guia-de-publicaciones.md`, `docs/revision-grafica-y-direccion-de-marca.md`, `diagnostico-alineacion-marca-frontend.md`, `styles/celuma-tokens.css`, `components/proposals-*.jsx` y capturas de `docs/revision-grafica/capturas/`.
- **Frontend (1.3.1, `9dd6ca9`):** `AGENTS.md`, `CELUMA_DESIGN_SYSTEM.md` (desactualizado frente al código en varios puntos; prevalece el código), `tokens.ts`, `status_configs.tsx`, `table_helpers.tsx`, `button.tsx`, `page_header.tsx`, `record_card.tsx`, `sidebar_menu.tsx`, `table.tsx`, `floating_caption_input.tsx`, `empty_state.tsx`, `celuma_steps.tsx`, `celuma_tabs.tsx`, `lib/rbac.ts`, `pages/home.tsx`, `pages/worklist.tsx`, `pages/order_detail.tsx`, `components/report/report_editor.tsx`; pruebas en `tests-visual/` (arnés y 49 snapshots, solo leídos).
- **Contratos (`celuma-engineering`):** `specs/reports/lifecycle.md`, `specs/digital-signature/*`, `standards/rbac.md`, ADR 0002, 0009 y 0010, `specs/reports/letterheads.md`, `specs/laboratory/sample-status.md` y `patients-branches.md`, `docs/glossary.md`. Comprobaciones puntuales en `celuma-backend` (`enums.py`, `api/v1/reports.py`, `api/v1/worklist.py`).
- **Contratos que condicionan la propuesta:** ciclo `DRAFT → IN_REVIEW → APPROVED → PUBLISHED`; «Firmar y publicar» es **una** operación; solicitar cambios y reabrir vuelven a `DRAFT`; retractar es aparte (`PUBLISHED → RETRACTED`); aprobar y firmar exigen rol de revisora + capacidad + asignación; administración solo reabre; la «firma digital» es imagen y metadatos, no certificado; el informe usa el membrete del laboratorio cliente.

## Direcciones exploradas

| | A · Continuidad legible (**elegida**) | B · Mesa neutra (descartada por ahora) |
|---|---|---|
| Idea | Conserva lateral teal, crema, tarjetas y filete salmón; cambia tinta, estados y jerarquía | Cromo neutro para que el único color sea el estado; filas de 30–40 px |
| A favor | Claridad de estado por forma e icono; continuidad; bajo costo de adopción | Densidad (14–16 filas visibles) |
| En contra | Menos densa (se compensa con modo compacto de 44 px) | Se percibe como rediseño; pierde identidad; requiere una decisión de marca que no existe |

Detalle y miniaturas en `direcciones.html`. Es una decisión **reversible**: B queda como alternativa si las pruebas con usuarios muestran que el lateral teal compite con los estados.

## Cinco decisiones de diseño principales

1. **Escala semántica de estados** (9 tonos: nuevo, en curso, autoría clínica, en revisión, completado, cerrado, entregado, requiere atención, terminal neutro). Cada estado conserva su etiqueta del producto y suma un icono propio. Todos los chips usan la misma píldora sin contorno; «entregado» (Publicado, Liberada) usa menta más intensa, icono y texto propios, sin relleno verde oscuro.
2. **Decisión ≠ estado, y «qué sigue» en cada lista.** La lista de trabajo muestra por separado el estado del informe y la próxima acción con su responsable («Firmar y publicar · Tú, revisora asignada»; «Esperando correcciones · Patóloga Ejemplo»). Las completadas se ocultan con un interruptor y un contador visibles.
3. **Firma y publicación como una sola operación con evidencia.** No se inventa un estado «Firmado». La ruta del informe muestra los 4 estados del contrato y las ramas (solicitar cambios, reabrir, retractar); la firma aparece en la trazabilidad; la confirmación enumera consecuencias. El documento se ve con **membrete del laboratorio cliente** y tipografía neutra, con la huella «Documento generado en Céluma.».
4. **Identidad en el borde, legibilidad en la tinta.** Texto navy sobre teal (2,45 → 7,10:1), teal de tinta `#1f7a75` para texto, salmón solo en el filete del encabezado y el borde del código, isotipo sin redibujar sobre placa crema.
5. **Diseño por contenedor, sin desplazamiento horizontal.** Tabla → tarjetas bajo 820 px de contenedor, pasos verticales en fichas estrechas, lateral de iconos bajo 1100 px y cajón bajo 768 px; densidad cómoda (56 px) o compacta (44 px).

**Otras decisiones:** error de campo persistente; foco único de 2 px `#1f7a75` (navy en el lateral); navegación agrupada por flujo (Laboratorio, Directorio, Administración); «Mi trabajo» como entrada diaria; «más antiguas primero»; código de orden con tabular-nums; ninguna ilustración en pantallas ni documento.

**Decisiones de vocabulario pendientes (no son reglas):** «Cambios solicitados» para la decisión `REJECTED` (hoy «Rechazado»); «informe» (docs) frente a «reporte» (app); etiquetas en frase («En proceso»).

## Variantes locales de tokens

Definidas en `experiment.css` como `--fr-*`. **No modifican** `styles/celuma-tokens.css`.

| Variable | Valor | Motivo |
|---|---|---|
| `--fr-ink-muted` | `#5b6472` | Texto secundario sobre crema 5,55:1 (propuesta de marca «gris secundario») |
| `--fr-field` | `#2e9692` | Contorno de campo 3,56:1 sobre blanco (≥ 3:1) |
| `--fr-focus` | `#1f7a75` | Anillo de foco = teal de tinta |
| `--fr-border-control` | `#8a94a3` | Borde de botón secundario 3,07:1 |
| `--fr-border`, `--fr-sunken`, `--fr-row-hover`, `--fr-tint` | crema y menta | Superficies internas claras, con un poco más de presencia cromática tras la revisión de Rafael |
| `--fr-shadow-card` | sombra suave | Sustituye `tokens.shadow` en tarjetas densas (preferencia) |
| `--fr-row-h` | 56 / 44 px | Densidad cómoda / compacta |
| Tonos de estado | en `data.js` (`TONES`) | Escala semántica; fuente única que genera los estilos; tintas más vivas sin perder contraste |

## Rondas de revisión

**Implementación inicial** (`capturas/inicial/`): 34 capturas. Problemas medidos: desbordamiento a 390 px (177, 164, 112 y 181 px) y a 768 px (23 px); un texto a 4,48:1; 404 transitorios porque `npx serve` quita la barra final de la carpeta.

**Ronda 1** (`capturas/ronda-1/`)
- *Observado:* rail lateral que dejaba las pestañas de la orden en ~450 px con «Informe» cortada; pasos desalineados; acciones del informe bajo el pliegue; ramas del ciclo ilegibles en tres columnas; búsqueda y filtros en dos líneas; icono de firma confuso; banda de exploración de ~100 px en móvil; código largo desbordando su tarjeta.
- *Cambios:* rejillas con `minmax(0, 1fr)`; «Ahora / Siguiente paso / acciones» antes de la ruta; ramas en lista; `align-content: start` en pasos; sello como icono de firmar; banda compacta; ajuste de columnas; guarda de barra final.
- *Mejoró:* 0 px de desbordamiento y 0 fallos de contraste; acciones visibles sin desplazar en 1440.
- *Empeoró:* la ruta del informe quedó bajo el pliegue en 1440 (se acepta: la acción es lo diario); en 390 los pasos de la orden se superpusieron porque las *container queries* estaban antes que las reglas base.

**Ronda 2** (`capturas/ronda-2/`, evidencia final)
- *Observado:* rail aún a la derecha y pasos superpuestos (orden de cascada); banda de dos líneas a 768; segmentado de estados cortado en móvil; documento recortado en móvil; cajón móvil que tapaba la banda y mostraba texto oculto; comillas literales en la tabla de direcciones.
- *Cambios:* consultas de contenedor al final de la cascada; pasos verticales en fichas estrechas; banda de una línea bajo 1100 px con enlaces dentro de «Controles»; segmentado que envuelve; documento sin proporción fija en contenedores estrechos; cajón bajo la banda; botones que envuelven texto largo; ajustes de 320 px; persona «Patóloga y revisora».
- *Mejoró:* todo lo anterior, verificado; reajuste correcto a 320 y 640 px.
- *Empeoró o queda peor que hoy:* más texto por fila («qué sigue» y responsable); la fila de tarjetas «qué sigue» empuja la lista hacia abajo; sin avatares de color por paciente (se pierde una señal rápida de reconocimiento); la densidad cómoda muestra unas 9 filas a 900 px de alto; el lateral agrupado es más largo.

**Frente a la UI actual** (`capturas/comparacion/` corresponde a la ronda 2): blanco sobre teal 2,45:1 → navy 7,10:1; chips originales 2,07–3,86:1 → tintas legibles con icono y sin contorno; desbordamiento móvil 491 y 747 px → 0; filas ~73 px → 56/44 px; completadas ocultas sin aviso → interruptor con contador; «de DIAGNOSIS a REVIEW» → chips traducidos; Aprobado/Publicado se distinguen por color de fondo, icono, etiqueta y «Siguiente paso».

**Ronda 3 · retroalimentación de Rafael** (`capturas/ronda-3/`): la ronda 2 se percibía más opaca que la app actual; el contorno de todas las píldoras y el verde oscuro de Publicado/Liberada generaban ruido. Se quitaron los contornos, se aclaró y tiñó ligeramente la superficie hundida, y se ajustaron tintas y fondos de estados hacia colores más vivos. Publicado/Liberada ahora usan `#c7f0d8` con tinta `#075e47` (6,25:1) frente al verde claro de Aprobado/Lista `#ecfdf5` con tinta `#047857` (5,21:1). Todos conservan la misma forma de píldora; etiqueta, icono y contexto de «Siguiente paso» comunican la diferencia clínica. Los nueve pares tinta/fondo miden entre 4,75:1 y 6,75:1. Revisión visual de `trabajo-1440.jpg`, `trabajo-390.jpg`, `informe-aprobado-revisora-390.jpg` y la galería; mejora la continuidad visual sin volver al bajo contraste original. Esta preferencia sigue en exploración, no aprobada.

## Validación

Script reproducible: `node labs/experiments/1-frontend-refinement/scripts/verify.mjs <ronda>` (Playwright y Chromium del `node_modules` de `celuma-frontend`; no se añadieron dependencias). Resultados completos en `capturas/ronda-2/verificacion.json`.

| Comprobación | Resultado (ronda 2) |
|---|---|
| Anchuras | 1440 × 900, 768 × 1024 y 390 × 844 en 5 vistas + 13 estados extra (34 capturas); reajuste a 320 y 640 px (10 casos) |
| Desbordamiento horizontal | 0 px en todos los casos |
| Consola y recursos | 0 errores, 0 avisos, 0 peticiones fallidas |
| Contraste de texto (WCAG 2.x sobre colores computados, fondo compuesto) | 4 663 textos medidos, 0 por debajo de 4,5:1 (3:1 en texto grande). Excluidos a propósito: los chips «Hoy» de la galería, que reproducen la app actual |
| Banda «Exploración · no aprobada» | Visible en la parte superior de las 34 capturas |
| Teclado | 44, 39, 29 y 24 paradas con Tab en cuatro recorridos; 0 sin anillo visible; 0 fuera de vista |
| Pestañas | Flechas cambian pestaña, foco y panel |
| Diálogo «Firmar y publicar» | Foco dentro al abrir; Escape cierra y devuelve el foco al botón; estado de carga con `aria-busy`; resultado visual «Publicado» |
| Cajón móvil | `aria-expanded`, foco al primer enlace, Escape cierra y devuelve el foco al botón de menú |
| Nombres accesibles, `h1`, `lang` | 0 controles sin nombre; un `h1` por vista; `lang="es"` |
| Movimiento reducido | Con `prefers-reduced-motion: reduce`: transiciones 0,000001 s y animación del esqueleto desactivada |
| Estados largos, vacíos y de error | Nombres y códigos largos envuelven sin superponerse; vacío, sin resultados, error y cargando en lista de trabajo y órdenes |
| Entrada del lab | `labs/` enlaza al experimento con «Exploración · no aprobada»; 0 errores a 1280 y 390 px |

**Nueva verificación de ronda 3:** `capturas/ronda-3/verificacion.json` repite 34 capturas y 10 casos de reajuste; 0 errores, 0 desbordamientos, 0 textos bajo el umbral en 4 663 textos medidos, 0 controles sin nombre, y recorridos de teclado, diálogo, cajón y movimiento reducido sin regresiones detectadas. Las cifras de la tabla anterior corresponden a ronda 2 y se conservan como historial.

**Revisión manual:** dos rondas visuales documentadas arriba sobre las capturas. Esquema de encabezados revisado por vista (un `h1`; `h2` por región: «Qué sigue» y «Lista de trabajo»; «Ahora», «Ruta del informe», «Trazabilidad» y «Documento»). La captura en escala de grises de ronda 2 es histórica; tras la revisión de Rafael, la distinción sin color depende de etiqueta, icono y «Siguiente paso», no de un relleno oscuro (inspección visual, no una medida).

**No verificado:** axe u otra auditoría automática de accesibilidad (no está instalada y no se añadieron dependencias); lectores de pantalla reales; zoom de texto al 200 % (solo reajuste por ancho); Safari, Firefox y dispositivos reales; modo de alto contraste de Windows; contraste de iconos y bordes medido uno por uno (solo los valores de diseño calculados); pruebas con usuarios.

## Recursos y datos

- Recursos compartidos por ruta relativa: `../../../styles/celuma-tokens.css` y `../../../assets/celuma-isotipo.png` (sin redibujar). Baloo 2 llega por el `@import` de Google Fonts que ya hace el archivo de tokens.
- Iconos SVG dibujados para este experimento (`icons.js`); sin librerías externas. Son prototipos, no activos canónicos; la app real usa `@ant-design/icons` y las equivalencias propuestas están en `AUDIT.md`.
- Datos ficticios (`data.js`): «Laboratorio Ejemplo de Patología», «Paciente Ejemplo…», códigos `ORD-EJ`, `MUE-EJ`, `PAC-EJ`. Sin pacientes, informes, credenciales ni exportaciones reales. El texto del informe se declara sin validez clínica.
- La app actual se capturó con su servidor de desarrollo y una API simulada en el navegador; no se cambió ningún archivo del frontend.

## Límites y riesgos pendientes

1. **Sin validación con usuarios.** El riesgo clínico de H-01 y H-02 es una inferencia a partir del contrato; conviene observarlo con patología y revisión.
2. **«Por firmar y publicar» necesita un dato nuevo** de `GET /me/worklist` (estado del informe en ítems de revisión) o una consulta adicional.
3. **Vocabulario pendiente:** «Cambios solicitados», «informe/reporte», tú/usted en el login.
4. **El prototipo no es React ni Ant Design:** tablas, pestañas y selectores reales requieren re-tematizar antd; las estimaciones de esfuerzo son aproximadas.
5. **El editor de informes no se reprodujo en vivo:** la vista de flujo se diseñó desde el código y los contratos.
6. **La frase de «qué sigue» para muestras y órdenes asignadas es una propuesta**, no un contrato de producto.
7. **Retractar** existe en backend y en el estado, pero no en el editor actual: se muestra como operación aparte, sin botón.
8. **Alcance por sucursal:** la brecha documentada en rutas de pacientes (`patients-branches.md`) no se aborda; el lateral solo muestra el laboratorio y sus sucursales.
9. La banda de exploración ocupa 40 px fijos: es propia del lab y no forma parte de la propuesta.

## Orden sugerido de adopción (solo después de la revisión)

1. **Decidir primero:** escala semántica de estados (D-4 del diagnóstico), vocabulario pendiente, entrada diaria por rol.
2. **Bajo riesgo, alto impacto:** `lang="es"`, `:focus-visible` y `prefers-reduced-motion` globales; texto navy sobre teal (`button.tsx`, `sidebar_menu.tsx`); chips sin contorno, con icono y tinta legible; menta más intensa para entregado (`status_configs.tsx`, `table_helpers.tsx`); traducir enums en línea de tiempo y actividad.
3. **Listas y formularios:** lista de trabajo con «qué sigue» y decisión separada (con el dato de API); error persistente en campos; `CelumaTable` en modo tarjeta; código de orden legible.
4. **Fichas y flujo del informe:** avance con fechas en la ficha de orden; panel «Ahora / Siguiente paso» y trazabilidad en el editor; confirmación de «Firmar y publicar».
5. **Navegación y densidad:** orden del lateral por flujo, modo compacto, isotipo sobre placa; después actualizar `CELUMA_DESIGN_SYSTEM.md`.

Cada paso requiere en `celuma-frontend` sus propias pruebas (`npm run lint`, `npm test`, `npm run build`, Playwright) y revisar a mano cualquier snapshot visual afectado.

## Archivos del experimento

`PROMPT.md` (encargo, sin cambios) · `BRIEF.md` · `AUDIT.md` · `index.html`, `experiment.css`, `app.js`, `data.js`, `icons.js` (prototipo) · `direcciones.html`, `direcciones.css` · `scripts/capture-actual.mjs`, `scripts/verify.mjs`, `scripts/compare.py` · `capturas/actual/`, `capturas/inicial/`, `capturas/ronda-1/`, `capturas/ronda-2/`, `capturas/ronda-3/`, `capturas/comparacion/`.

Fuera de la carpeta, dentro de `labs/`: `labs/index.html` (tarjeta del experimento y aviso), `labs/lab.css` (estilos de esa tarjeta) y una línea en `labs/README.md`.

## Decisión

- **Resultado:** exploración
- **Persona que revisó y fecha:** Rafael, 2026-09-26.
- **Razón:** rescatar V4 «Interno ≠ entregado» y mejoras de contraste, con observaciones de accesibilidad y validación clínica aún abiertas. Ver `DECISION.md`.
- **Archivos canónicos que requerirían cambio tras aprobar:** ver `AUDIT.md` §4 (frontend) y, si se aprueba la escala de estados, `styles/celuma-tokens.css` y `docs/estado-de-piezas.md` del brand system.

La aprobación se registra aquí y en `../../../docs/estado-de-piezas.md` antes de incorporar o publicar una pieza. Este brief no autoriza ningún uso.
