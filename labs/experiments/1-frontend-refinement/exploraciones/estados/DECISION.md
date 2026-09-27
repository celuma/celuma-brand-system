# Nota de exploración · Aprobado ≠ Publicado (y Lista ≠ Liberada)

**Estado:** cerrada como exploración por Rafael el 2026-09-26. Se rescata la dirección V4 «Interno ≠ entregado» para otra iteración; V2+ fue la recomendación técnica anterior, no la decisión final. Ver `../../DECISION.md`. Nada de esta carpeta cambia el prototipo principal (`../../index.html`, `data.js`, `experiment.css`, `app.js`, `BRIEF.md`) hasta que Rafael elija una opción.
**Fecha:** 2026-09-26 · **Parte de:** ronda 3 (`../../capturas/ronda-3/`, `../../BRIEF.md` § Ronda 3).

## Ver y decidir

Abrir `http://localhost:5050/labs/experiments/1-frontend-refinement/exploraciones/estados/` (o el mismo camino en `python3 -m http.server 8000`), con barra final.

- Arriba está la recomendación con R3 al lado, a tamaño real.
- La matriz muestra las siete opciones con sus pares críticos.
- La barra «Izquierda / Derecha» compara dos opciones en cuatro contextos a 1:1: tabla densa, lista de trabajo, ficha de informe y móvil de 390 px. Los botones cambian a escala de grises, deuteranopía o protanopía.
- Hay láminas estáticas en `capturas/laminas/`, en color y en gris.

## Recomendación técnica previa (archivo de la exploración)

**V2+ · Glifo lleno + contexto.**

1. Publicado (informe) y Liberada (orden) conservan la píldora menta de R3 (`#c7f0d8` / `#075e47`) y dibujan su icono relleno: el sello de Publicado con check blanco y un disco lleno con avión blanco para Liberada.
2. Aprobado, Lista y todos los demás estados siguen con icono de trazo. No cambia ningún color, contorno ni forma de R3.
3. La etiqueta del chip no cambia. «sin firmar» aparece fuera del chip, como segunda línea discreta, y solo en tablas sin columna «Qué sigue».
4. La decisión de revisión nunca se pinta como chip: se escribe junto a la persona («Revisora Ejemplo · Aprobó · 25 sep, 15:00»). El chip siempre es el estado del informe.

**Regla transversal propuesta:** *glifo lleno = entregado fuera del laboratorio.* Hoy solo aplica a Publicado y Liberada. Ninguna muestra se entrega, así que Lista nunca lleva glifo lleno, y Cerrada (cierre interno) tampoco.

**Compromiso:**
- **Frente a R2**, menos contundente a distancia. R2 invertía la polaridad del chip completo; V2+ solo oscurece un área de ~14 px. A cambio conserva la familia menta que Rafael prefirió.
- **Frente a R3**, añade una marca que se detecta antes de leer y que sobrevive sin color.
- **Si en monitores del laboratorio se queda corta,** V5 aplica la misma regla con el fondo de entregado en `#a9e5c5`. Es un escalón, no otra dirección.

## 1. Diagnóstico: qué se perdió entre R2 y R3

Medido sobre los colores aplicados y sobre capturas (ver `capturas/diagnostico-r2-r3.png`).

| Señal | R2 | R3 | Lectura |
|---|---|---|---|
| Polaridad (texto claro sobre fondo oscuro) | Sí | **Perdida** | Era la señal preatentiva y también lo que se sentía pesado |
| Contraste entre fondos Aprobado/Publicado | 6,77:1 · ΔL* 60,6 | **1,18:1 · ΔL* 6,5** | Dos mentas casi iguales |
| Diferencia de fondos con deuteranopía (ΔE) | 63,8 | **8,2** | Bajo ~10, difícil de percibir en 24 px |
| «Mancha» (zona 12 × 12 px más oscura, en gris) | Δ113 | **Δ24** | En R3 ningún chip tiene una zona sólida |
| Contorno | Solo en los no entregados | Ninguno | Quitarlo fue correcto: era ruido |
| Icono | Sello ≠ check | Sello ≠ check, ambos de trazo | A 14 px solo difiere el borde dentado |
| Texto | Presente | Presente | «Aprobado» y «Publicado» tienen la misma longitud y terminación: exigen leer |
| Contexto («Qué sigue», «Ahora») | Presente | Presente | Falta en tablas densas sin esa columna |
| Contraste de texto | 5,21 / 7,13:1 | 5,21 / 6,25:1 | Nunca fue el problema |

Lista/Liberada tenía la misma pérdida: fondos 1,18:1 y mancha Δ25 en R3. En R3 Liberada tenía un icono distinto, el avión, pero de trazo y en el mismo menta.

## 2. Opciones exploradas (todas: píldora, sin contorno, texto + icono, contraste ≥ 4,5:1)

| Opción | Mecanismo | Resultado |
|---|---|---|
| **V1 · Escalón tonal** | Solo luminancia: Aprobado/Lista casi neutros (`#eef7f2`); entregados en menta media (`#86d9ae`, tinta `#033d2d`) | Fuerte en color y en gris (gris del chip Δ49). Invierte la saliencia: en historiales, donde la mayoría está entregada, lo terminado grita más que lo pendiente |
| **V2 · Glifo lleno** | Forma: icono relleno solo en entregados; colores de R3 | Mancha Δ91 (Lista/Liberada Δ80); funciona en gris y con daltonismo. El chip completo casi no cambia (Δ24,5) |
| **V3 · Calificador en el chip** | Texto: «Aprobado · sin firmar» | No cambia la detección (mancha Δ24): exige leer. El chip pasa de 95 a 161 px; se corta en la tabla densa y no resuelve Lista/Liberada |
| **V4 · Interno ≠ entregado** | Significado: el verde queda solo para lo entregado; Aprobado, Lista y Cerrada pasan a cian `#e4f4fb` / `#0a6384` | Semántica más limpia, pero falla sin color (mancha Δ17, gris Δ13,7, ΔE deuteranopía 12,3). Cian cerca del teal de acción y de marca |
| **V5 · Glifo lleno + escalón suave** | V2 con entregado en `#a9e5c5` / `#065a44` | La más fuerte sin volver al oscuro (mancha Δ95, gris Δ38,7). Más saliencia de lo terminado que V2 |
| **V2+ (recomendada)** | V2 + «sin firmar» fuera del chip solo en tablas sin «Qué sigue» | Igual que V2 en detección, con refuerzo textual donde falta contexto |

## 3. Mediciones

`scripts/measure.py` sobre recortes a 3× de la fila de la matriz. «Mancha» y «gris» van de 0 a 255, en escala de grises (luma ITU-R 601).

| Opción | Mancha A/P | Mancha L/Lib | Gris chip A/P | Fondos A/P | ΔE deut. A/P | Ancho Aprobado |
|---|---|---|---|---|---|---|
| R2 (referencia) | 113 | 116 | 118,9 | 6,77:1 | 63,8 | 97 px |
| R3 (actual) | 24 | 25 | 19,9 | 1,18:1 | 8,2 | 95 px |
| V1 | 51 | 52 | 49,3 | 1,53:1 | 19,6 | 95 px |
| V2 | 91 | 80 | 24,5 | 1,18:1 | 8,2 | 95 px |
| V3 | 24 | 25 | 21,3 | 1,18:1 | 8,2 | 161 px |
| V4 | 17 | 18 | 13,7 | 1,10:1 | 12,3 | 95 px |
| V5 | 95 | 83 | 38,7 | 1,36:1 | 13,8 | 95 px |
| **V2+** | **91** | **80** | **24,5** | 1,18:1 | 8,2 | **95 px** |

**Cómo leerla:** V2+ obtiene el 81 % de la marca local de R2 (91/113) con el 21 % de su diferencia global de gris (24,5/118,9). Esa proporción es la definición operativa del «punto medio» pedido: inmediata y sobria. Las métricas de color de fondo de V2+ son iguales a R3 a propósito, porque su señal no es cromática.

## 4. ¿«sin firmar» dentro o fuera del chip?

- **Dentro (V3) lo vuelve demasiado largo:** +70 % de ancho (95 → 161 px). En la tabla densa la columna pasa de 128 a 187 px, el marco de 1:1 necesita 37 px de desplazamiento y el texto se corta. Además cambia la etiqueta del producto, repite «Firmar y publicar» y «Ahora», y no tiene equivalente honesto para Lista ni Liberada.
- **Fuera ayuda, pero solo donde falta contexto:** en tablas sin «Qué sigue» (columna de 138 px; segunda línea solo en filas aprobadas). En listas y fichas es redundante y se omite.
- **Redacción:** «sin firmar» nombra una carencia y puede leerse como anomalía. **«por firmar»** nombra el paso pendiente con la misma longitud. Queda como decisión de vocabulario pendiente; las muestras usan «sin firmar» porque fue lo pedido.

## 5. Aprobación ≠ entrega; decisión ≠ estado

- **Aprobado** es un paso interno: contenido aprobado, sin firma ni PDF oficial. Lleva icono de trazo y el contexto «Falta firmar y publicar».
- **Publicado** es el documento oficial: firmado y publicado en una sola operación (`APPROVED → PUBLISHED`, `specs/reports/lifecycle.md`). Es el único estado de informe con glifo lleno.
- **La decisión de revisión** (`ReportReview.status`) se muestra como verbo junto a la persona, nunca como chip: «Aprobó», «Pidió cambios», «Decisión pendiente». Así no compite visualmente con el estado del informe, aunque ambos usen el mismo icono de check.

## 6. Verificación

`scripts/verify-estados.mjs` (Playwright y Chromium del `node_modules` de `celuma-frontend`, sin dependencias nuevas) → `capturas/verificacion.json`.

| Comprobación | Resultado |
|---|---|
| Contraste de texto de todos los chips en los cuatro contextos | Mínimo 5,10:1 en R3 a V5 y V2+ (R2: 5,21:1) |
| Icono o glifo frente al fondo del chip | Mínimo 5,10:1; el blanco sobre el glifo lleno mide 7,77:1 |
| Mismo significado = mismo tratamiento en órdenes, muestras e informes | Sin incoherencias en ninguna opción |
| Móvil real a 390 × 844 | 0 px de desbordamiento de página e interior y 0 chips fuera de pantalla en las 8 opciones |
| Página de comparación a 1440 y 390 px | 0 px de desbordamiento, 0 errores de consola y 0 recursos fallidos; banda «Exploración · no aprobada» visible |
| Tabla densa | Solo V3 desborda su marco (37 px) |
| Sin color | Láminas en escala de grises y capturas con deuteranopía y protanopía simuladas (`capturas/pagina/*-gris|deut|prot.png`) |

## 7. Límites de la validación

- Sin pruebas con usuarios ni en monitores reales del laboratorio: «inmediata» se infiere de la métrica de mancha y de la inspección visual, no de tiempos de reacción.
- La métrica de mancha es un indicador propio (ventana de 12 × 12 px), no un modelo perceptivo validado.
- La simulación de daltonismo usa las matrices de Machado et al. (2009), con severidad total, en el navegador. El gris usa luma ITU-R 601.
- La tabla densa del arnés es más estrecha que la app; en la app real las columnas podrían ser más anchas.
- Los glifos llenos derivan de la geometría de `icons.js` (sello, avión) sin modificar ese archivo. El disco de Liberada es geometría nueva.
- En `@ant-design/icons` (instalado en `celuma-frontend`) existen `SafetyCertificateFilled` y `CheckCircleFilled`, pero `SendOutlined` no tiene variante rellena: Liberada necesitaría un disco propio con `SendOutlined` en blanco o un icono SVG propio.
- Los glifos son decorativos (`aria-hidden`): el lector de pantalla sigue oyendo «Publicado». No se probó con lectores reales.

## 8. Si Rafael elige V2+ (no hecho)

1. En este experimento: pasar el glifo lleno a `app.js` y `experiment.css`, y actualizar `BRIEF.md` y la galería.
2. En `celuma-frontend`, en una fase posterior y con sus pruebas: icono relleno por estado entregado en `status_configs.tsx`, `renderStatusChip` en `table_helpers.tsx`, «sin firmar» o «por firmar» en listas de informes sin columna de próxima acción, y decisión de revisión como texto junto a la persona.

## Archivos

`index.html`, `estados.css`, `estados.js` · `scripts/verify-estados.mjs`, `scripts/measure.py`, `scripts/sheets.py` · `capturas/`: `diagnostico-r2-r3.png`, `contextos/` (32 capturas 1:1), `movil-390/`, `chips/` (a 3×), `pagina/`, `laminas/`, `medicion-pixeles.json`, `verificacion.json`.
