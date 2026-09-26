# Diagnóstico de alineación: marca (`celuma-brand-system`) ↔ aplicación (`celuma-frontend`)

- **Fecha:** 2026-09-25
- **Tipo de documento:** diagnóstico (primera etapa). No propone implementación inmediata ni modifica componentes, tokens, documentación ni el tablero.
- **Preparado por:** Claude (asistente), a solicitud de Rafael.
- **Estado de las conclusiones:** todo lo que aparece aquí como "recomendación" es una **propuesta** pendiente de decisión. Nada de este documento constituye una decisión aprobada.

---

## 0. Cómo leer este documento

**Estado de cada elemento** (se usa en todo el documento):

| Etiqueta | Significado |
|---|---|
| **Aprobado** | Hay una decisión registrada (ADR, spec con estado *Ready/Accepted*, o regla escrita explícita). |
| **Implementado** | Existe en código o en archivos del repositorio, pero no hay constancia escrita de que se haya aprobado como regla. |
| **Propuesta** | Aparece como opción, variante o maqueta; no hay evidencia de elección. |
| **Pendiente** | Se necesita y no existe. |

**Tipo de cambio** (para diferencias entre repositorios):

| Tipo | Significado |
|---|---|
| **Evolución coherente** | Cambio que refuerza la identidad y conviene trasladar al resto del sistema. |
| **Adaptación de contexto** | Diferencia válida porque el medio lo exige (pantalla, impreso, documento clínico). No es error. |
| **Inconsistencia accidental** | Residuo o deriva sin intención aparente. Corregible sin decisión de diseño. |
| **Potencialmente disruptivo** | Altera la identidad, la legibilidad, la accesibilidad o la viabilidad de aplicaciones previstas. Requiere decisión explícita. |

**Prioridad:** P0 (resolver antes de tocar cualquier token o pieza) · P1 (primera etapa) · P2 (segunda etapa) · P3 (oportunista).
**Certeza:** Alta (hecho verificado en archivos) · Media (inferencia razonable con evidencia parcial) · Baja (hipótesis que requiere confirmación).

**Hechos vs. interpretaciones.** En la matriz, la columna *Evidencia* contiene únicamente hechos verificables (rutas, valores, fechas, cálculos reproducibles). Las columnas *Impacto* y *Recomendación* son interpretación. Las preferencias estéticas se marcan explícitamente como tales (§12).

---

## 1. Diagnóstico breve

**Estado actual en una frase:** hoy existen **dos sistemas visuales emparentados pero desincronizados**. El brand system es una instantánea de la identidad tomada alrededor del **24 de mayo de 2026**. Seis días después, la aplicación cambió su color primario y luego añadió un acento salmón. Desde entonces, la app evolucionó durante cuatro meses (más de 20 componentes nuevos) sin que la marca se actualizara, y la marca incluye piezas (reporte clínico, etiquetas de laboratorio) que contradicen contratos de producto ya aprobados.

Puntos clave:

1. **Dos teals primarios en competencia.** La marca, el landing y los docs usan `#0f8b8d`. La app usa `#49b6ad` y su documentación prohíbe explícitamente `#0f8b8d` por considerarlo "off-brand". El cambio en la app (commit `458ca9e`, 2026-05-30) acerca el color al logotipo real, pero **empeora el contraste**: el texto blanco sobre `#49b6ad` alcanza 2.45:1. Es el punto que más decisiones condiciona.
2. **La paleta de estados de la app no distingue bien estados clínicamente distintos.** "Aprobado" (`#10b981`) y "Publicado" (`#22c55e`) son prácticamente el mismo verde (1.11:1 entre ambos), y todos los chips de estado quedan por debajo de 4.5:1. En un laboratorio de anatomía patológica, confundir *aprobado sin firmar* con *publicado* es el riesgo de claridad más serio que encontré.
3. **El reporte clínico de la marca contradice el modelo del producto.** La marca presenta a Céluma como el laboratorio emisor (logo, patóloga y contacto de Céluma). Según ADR 0002, la presentación del reporte pertenece al **tenant** (membrete del laboratorio), y la app ya implementa un *default neutral* deliberado.
4. **El "tablero kanban" no contiene estados.** Es un lienzo de 9 secciones con 60 artboards y variantes sin elegir. Sirve para conocer el **alcance previsto**, pero no permite saber qué está pendiente, aprobado o descartado.
5. **No hay fuente de verdad declarada** para la identidad. Cada repositorio (marca, app, landing, docs) tiene su propia copia de tokens, y la marca no tiene documentación escrita, solo JSX y CSS.

**Alcance real de esta revisión:**

- Revisión **estática** de código y archivos (lectura de JSX, CSS, TS y Markdown; historial git; muestreo de color de los PNG; cálculo de contraste WCAG 2.x).
- **No** se renderizaron el lienzo ni la app en navegador, **no** se ejecutaron auditorías automáticas de accesibilidad (axe, Lighthouse) y **no** se probaron impresiones reales.
- Se consultaron también `celuma-engineering`, `celuma-landing`, `celuma-docs` y `celuma-backend` como contexto, sin revisarlos a fondo.

---

## 2. Fuentes

### 2.1 Consultadas

| Fuente | Qué aporta | Estado |
|---|---|---|
| `celuma-brand-system/` completo (`app.jsx`, `design-canvas.jsx`, `components/*.jsx`, `styles/celuma-tokens.css`, `styles/celuma-system.css`, `assets/*.png`, `AGENTS.md`, `.github/CODEOWNERS`) | Identidad, tokens de marca, 60 artboards | Implementado; sin decisiones registradas |
| Historial git de `celuma-brand-system` (2 commits: 2026-09-20 y 2026-09-21; archivos con fecha de modificación 2026-05-24) | Datación de la instantánea | Hecho |
| `celuma-frontend/CELUMA_DESIGN_SYSTEM.md` (última modificación 2026-07-04) | Reglas de diseño de la app | Regla escrita = **la fuente más cercana a "aprobado"** para la app |
| `celuma-frontend/src/components/design/tokens.ts` + historial git | Tokens de la app y cambio de primario | Implementado |
| `celuma-frontend/src/components/ui/*`, `collaboration/*`, `auth/*`, `comments/*`, `report/versioned/*` | Componentes y estados | Implementado |
| `celuma-frontend/src/main.tsx` (tema antd), `src/index.css`, `index.html`, `src/lib/rbac.ts` | Tema global, CSS, idioma | Implementado |
| `celuma-frontend/AGENTS.md`, `celuma-brand-system/AGENTS.md` | Reglas de trabajo y seguridad | Aprobado (instrucciones de repositorio) |
| `celuma-engineering/adr/0002-template-vs-letterhead.md` | La presentación del reporte es del tenant | **Aprobado** (*Accepted*) |
| `celuma-engineering/specs/reports/letterheads.md`, `lifecycle.md`, `renderer.md`, `pdf.md` | Contrato de membretes y ciclo de vida del reporte | **Aprobado** (*Ready*) |
| `celuma-engineering/specs/laboratory/sample-status.md` | Estados de muestra y etiquetas en español | **Aprobado** (*Ready*) |
| `celuma-engineering/docs/sources-of-truth.md`, `overview.md`, `glossary.md`, `references/repository-governance-inventory.md` | Jerarquía de fuentes, gobernanza del repo de marca | Aprobado |
| `celuma-backend/app/models/enums.py`, `app/services/email.py` | Enums reales de estado; correos transaccionales | Implementado |
| `celuma-landing/src/index.css`, `src/components/Values.tsx` | Paleta del sitio público; valores de marca y origen del nombre | Implementado |
| `celuma-docs/src/css/custom.css`, `static/img/` | Paleta del sitio de documentación | Implementado |
| GitHub Project "Céluma Engineering" (`gh project item-list 1 --owner celuma`) | Buscar un kanban de marca | Solo contiene 1 tarjeta del repo de marca (gobernanza, cerrada) |

### 2.2 No accesibles o no revisadas

| Fuente | Por qué importa | Situación |
|---|---|---|
| **Kanban con columnas de estado** para papelería | Saber qué está aprobado, en curso o descartado | No existe en disco, en git ni en el GitHub Project. Interpreté como "tablero" el lienzo `Céluma Brand System.html` (ver §4). **Confirmar.** |
| `.design-canvas.state.json` (estado persistido del lienzo: orden, piezas ocultas, renombres) | Podría contener elecciones o descartes | No existe; el lienzo guarda estado vía un puente `window.omelette` (runtime de Claude Design) que no está disponible localmente. |
| Proyecto original en claude.ai/design | Brief, iteraciones y variantes descartadas | Sin acceso. |
| Notion (plan de entrega) | Decisiones de producto o comerciales recientes | Sin acceso; `sources-of-truth.md` advierte que puede estar desactualizado. |
| Archivo fuente vectorial del logotipo (AI, SVG, PDF) y valores oficiales de color del logo | Base de cualquier aplicación impresa | No existe en ningún repositorio (solo PNG). |
| Razón escrita del cambio de primario a `#49b6ad` | Distinguir evolución intencional de ajuste puntual | El commit `458ca9e` solo dice "Update primary color scheme to unify the visual design". |
| Especificaciones de impresión (proveedor, impresoras de etiquetas, papel, tintas) | Viabilidad de papelería y etiquetas | No documentadas. |
| Render visual real y auditoría automatizada de accesibilidad | Confirmar foco, contraste en contexto, tamaños efectivos | No ejecutados en esta etapa. |
| Estado de cumplimiento regulatorio (NOM-024, WORM, etc.) | Las piezas de marca lo afirman | Sin evidencia en los repositorios revisados. |

---

## 3. Mapa del estado actual

### 3.1 Quién usa qué

| Aspecto | `celuma-brand-system` | `celuma-frontend` (app) | `celuma-landing` | `celuma-docs` |
|---|---|---|---|---|
| Teal primario | `#0f8b8d` | `#49b6ad` (antd `colorPrimary` y `tokens.primary`) | `#0f8b8d` | `#0f8b8d` |
| `#49b6ad` | `--celuma-primary-mint` ("sidebar fill") | primario, 95 literales | — | — |
| Acento secundario | ninguno formal; `iso-nucleus #e58a8a` solo en blobs "rose" | salmón `#F98D84` (`tokens.secondary`) | — | — |
| Fondo | crema `#fbf6ec` | crema `#fbf6ec` | crema `#fbf6ec` | — |
| Tinta | navy `#0d1b2a` | navy `#0d1b2a` | navy `#0d1b2a` | — |
| Títulos | Baloo 2 (800) | Baloo 2 (800) | Baloo 2 | Baloo 2 |
| Texto | system-ui | system-ui | system-ui | system-ui |
| Iconos | `CelIcon` propio, trazo tipo Lucide 1.8 | `@ant-design/icons` (65 imports) | — | — |
| Radios / sombra de tarjeta | 14 / `0 10px 20px …` | 14 / idéntica | — | — |
| Isotipo | `assets/celuma-isotipo.png` | mismo archivo (md5 idéntico) | mismo | propio en `static/img` |

### 3.2 Cronología relevante (hechos)

| Fecha | Evento | Fuente |
|---|---|---|
| 2026-01-15 | La app fija primario `#0f8b8d` | git `dce1605` en `tokens.ts` |
| 2026-05-24 | Archivos del brand system generados (fecha de modificación de los archivos) | `ls -la` |
| **2026-05-30** | **La app cambia el primario a `#49b6ad`** | git `458ca9e` |
| 2026-06-03 | La app añade salmón `#F98D84` "Logo secondary" | git `94cff32` |
| 2026-06 → 2026-09 | Más de 20 componentes nuevos en la app | git log por archivo (§6.2) |
| 2026-07-04 | Última edición de `CELUMA_DESIGN_SYSTEM.md` | git |
| 2026-09-20 | Primer commit del brand system, **sin cambios de contenido respecto de mayo** | git `903e1db` |

**Hecho clave:** el comentario de cabecera de `celuma-tokens.css:7-8` dice que los tokens provienen de `celuma-frontend/src/components/design/tokens.ts`. Esa afirmación era cierta en mayo y **dejó de serlo 6 días después**.

### 3.3 Color real del logotipo (muestreo del PNG, cuantizado a pasos de 8)

| Elemento del isotipo | Muestreo `celuma-isotipo.png` | Token de marca | Token de app |
|---|---|---|---|
| Anillo teal | ≈ `#38a8a0` (y `#48b0a8` en `logo-v3`) | `--celuma-iso-outline #2fa7a5` | `primary #49b6ad` |
| Citoplasma | ≈ `#b8e8d0` | `--celuma-iso-fill #c8ecdc` | — |
| Núcleo | ≈ `#f88880` | `--celuma-iso-nucleus #e58a8a` | `secondary #F98D84` |
| Rayos | ≈ `#f0c068` | `--celuma-iso-rays #f0c75e` | — |

**Interpretación (certeza media):** los colores de la app (`#49b6ad`, `#F98D84`) están **más cerca del logotipo** que el primario de marca `#0f8b8d`, que no aparece en el logo. Esto sugiere que el cambio de la app fue una **evolución intencional hacia el símbolo**, no un error.

### 3.4 Contraste (WCAG 2.x, calculado)

| Combinación | Ratio | AA texto normal (4.5) | AA texto grande o no textual (3.0) |
|---|---|---|---|
| Blanco sobre `#49b6ad` (botón primario, sidebar) | **2.45** | ✗ | ✗ |
| `#49b6ad` sobre blanco (links, texto teal) | 2.45 | ✗ | ✗ |
| `#49b6ad` sobre crema | 2.27 | ✗ | ✗ |
| Hover `#3da8a0` / active `#2e9692` con blanco | 2.87 / 3.56 | ✗ | ✗ / ✓ |
| Blanco sobre `#0f8b8d` | **4.12** | ✗ (por poco) | ✓ |
| `#0f8b8d` sobre crema | 3.82 | ✗ | ✓ |
| Salmón `#F98D84` sobre blanco | 2.29 | ✗ | ✗ |
| `#6b7280` (texto secundario) sobre crema | 4.49 | ✗ (por 0.01) | ✓ |
| Chip ámbar (`#f59e0b` / `#fffbeb`) | **2.07** | ✗ | ✗ |
| Chip verde Aprobado/Liberada/Lista | 2.41 | ✗ | ✗ |
| Chip verde Publicado | 2.18 | ✗ | ✗ |
| Chip azul / rosa / rojo / violeta | 3.38 / 3.23 / 3.44 / 3.86 | ✗ | ✓ |
| **Tinta Aprobado vs tinta Publicado** | **1.11** | colores indistinguibles | |
| Referencia: `#1f7a75` / `#0c6f71` sobre blanco | 5.12 / 5.95 | ✓ | ✓ |

**Conclusión:** ni el teal de la marca ni el de la app sirven como color de texto o de relleno con texto blanco en tamaños normales. Si se revirtiera simplemente a `#0f8b8d`, **el problema de accesibilidad seguiría sin resolverse**.

---

## 4. El "tablero kanban": qué es y qué alcance revela

**Hecho:** no encontré ningún kanban con columnas (Backlog / En curso / Hecho) para la marca. El único artefacto que funciona como tablero es el lienzo `Céluma Brand System.html` (`app.jsx` + `design-canvas.jsx`): un lienzo tipo Figma, organizado en secciones horizontales de artboards que pueden reordenarse, renombrarse y ocultarse. **Supongo que es a lo que te refieres. Por favor confírmalo** (pregunta Q1).

**Alcance previsto (inventario del lienzo):**

| Sección | Piezas | Medio | Variantes sin elegir |
|---|---|---|---|
| 01 Identidad | Lockups (horizontal, stacked con descriptor, inverso, isotipo), atmósfera crema/navy, isotipo en 6 tamaños | Ambos | — |
| 02 Papelería corporativa | Hoja membretada ×3, tarjeta de presentación ×3 (frente y reverso), sobre DL ×2, carpeta ×2 | Impreso | Sí: A/B/C, clásica/confidencial, nocturna/luminosa |
| 03 Documentos y editorial | Portada white paper, portada de manual, **reporte clínico** (portada y página), formato interno de recepción, headers/footers | Impreso y PDF | — |
| 04 Operativo de laboratorio | Etiquetas de tubo, cassette, lámina, bloque y contenedor; 6 stickers; credencial de personal y visitante; lanyard | Impreso (etiquetas: impresora especializada) | — |
| 05 Identidad digital | Firma de correo ×3, onboarding, hero de dashboard, tarjetas KPI, 3 empty states, notificaciones | Digital | Firmas ×3 |
| 06 Patrones y fondos | Crema, navy, puntos, trama, cuadrícula, forro de isotipo | Ambos | — |
| 07 Ilustraciones | Microcosmos, trazabilidad, lumen | Ambos | — |
| 08 Web y marketing | Hero, encabezado de sección, banda de CTA | Digital | — |
| 09 Presentaciones | Portada, sección, contenido, datos, cita (16:9) | Digital o proyección | — |

**Qué no se puede deducir del tablero:** prioridades, piezas aprobadas, piezas descartadas, fechas, responsables ni dependencias. Las dependencias de §9 son **inferidas** a partir del contenido de cada pieza.

---

## 5. Lo que ya está alineado y conviene conservar

Estado: **Implementado** y consistente entre los repositorios. Recomendación: **conservar sin cambios** y documentar como fundamento compartido.

1. **Fondo crema `#fbf6ec` + tinta navy `#0d1b2a`.** Idénticos en marca, app y landing; contraste 16.15:1. Es la base cálida y "no fría" que ambos documentos describen.
2. **Pareja tipográfica Baloo 2 (títulos, 800) + system-ui (texto).** Coincide en los cuatro repositorios. La jerarquía de la app (título de página 24/800, subtítulo 14, título de tarjeta 20) coincide con `.celuma-page-title` / `.celuma-subtitle` de la marca.
3. **Geometría:** radio de tarjeta 14, campos 12, CTA en píldora 999 y sombra de tarjeta idéntica (`0 10px 20px rgba(0,0,0,.08), 0 6px 6px rgba(0,0,0,.06)`).
4. **Isotipo único:** el mismo PNG (md5 `f2255678…`) en marca, app (sidebar, login, fallback de reportes) y landing.
5. **Patrón "fondo suave + tinta del mismo tono"** para chips, avatares y círculos de icono. Aparece en la marca (`CelStatus`, `cel-pill`, tiles KPI) y en la app (`renderStatusChip`, `SampleStatusPicker`, `EmptyState`, `CelumaSteps`). Es un rasgo de identidad compartido y valioso. Lo que falla es el contraste de las tintas (§7), no el patrón.
6. **Nomenclatura y paleta base de estados de orden** (Recibida azul, En proceso ámbar, Diagnóstico violeta, Revisión rosa, Liberada verde, Cancelada rojo), compartidas entre `--celuma-*` y `ORDER_STATUS_CONFIG`, y coherentes con `OrderStatus` del backend.
7. **Reporte clínico neutral en la app** (`default_report_presentation_v2.ts`): isotipo solo como respaldo, tinta `#4A4A4A`, tipografías de documento (Arial/Helvetica/Times/Calibri), pie "Documento generado en Céluma." y ningún dato de tenant heredado. Es una **adaptación de contexto correcta** que la marca debería adoptar como regla, no contradecir.
8. **Componentes de la app que representan la dirección deseada**, según su documento y su uso: `CelumaButton`, `FloatingCaption*`, `Panel`, `PageHeader` (borde salmón), `ActionButtonPanel`, `CelumaTable` + `CelumaPagination`, `CelumaSteps`, `EmptyState`, `SampleStatusPicker`, `ConversationThread`, `CelumaSortableList`, `CelumaModal` + `ModalFormFooter`.
9. **Valores y relato de marca** del landing (`Values.tsx`: Claridad, Precisión, Seguridad, Confianza, Humanidad; *célula + lumen*). La marca los retoma en la hoja membretada B y en los stickers "Claridad"/"Precisión".

---

## 6. Revisión por área

### 6.1 Fundamentos compartidos

| Fundamento | Documentado en marca | Documentado en app | Observación |
|---|---|---|---|
| Logotipo y variantes | Solo como componentes (`CelMark`, `CelIso`); sin reglas escritas | No | Sin vector, sin área de protección, sin tamaño mínimo, sin versión monocroma ni usos prohibidos. El wordmark es texto vivo en Baloo 800, no un archivo trazado. `celuma-logo-v3.png` no se usa en ningún repositorio. (F-06) |
| Color | Tokens CSS completos | `tokens.ts` + constantes dispersas | Conflicto de primario (F-01 a F-04) |
| Tipografía | Clases semánticas en px de pantalla | Tokens de tamaño de título | No hay escala para impreso (pt) ni fuente de cuerpo para PDF o impresión; `system-ui` no existe fuera de una pantalla (F-08) |
| Iconografía | Set propio de trazo | antd outlined | Dos lenguajes distintos, sin guía (F-09) |
| Formas | Radios y sombras en tokens | Radios en `tokens.ts` y `button.tsx` | Alineado (§5.3); la marca no documenta los radios 8/10 de los botones compactos |
| Composición y espaciado | Escala `--celuma-space-*` | `gap 12`, `padding 24`, `maxWidth 1400` | Compatible; la app no usa la escala nombrada |
| Imágenes, patrones, ilustración | Muchos (campo celular, blobs, tramas) | Casi ninguno | Adaptación de contexto razonable; falta la regla de dónde **no** usarlos (F-12) |
| Tono de comunicación | Implícito en textos de ejemplo | No | Sin guía de voz. Evidencias: landing formal-cálido; correos transaccionales con tuteo ("Has sido invitado"); dashboard de marca con tuteo ("12 casos te esperan") (F-11) |
| Descriptor de marca | "Patología Digital" | — | Posible conflicto con el posicionamiento real (F-07) |

### 6.2 Diseño de la aplicación

**Clasificación de componentes** (interpretación a partir del documento, la fecha y el uso):

| Grupo | Componentes | Nota |
|---|---|---|
| **Dirección deseada** (documentados y recientes) | Los del §5.8 | Base para trasladar a la marca |
| **Dirección deseada, sin documentar** (creados o cambiados después del 2026-07-04) | `celuma_tabs`, `celuma_switch`, `empty_state`, `section_title`, `record_card`, `celuma_rich_text`, `upload_dropzone`, `image_gallery_card`, `selection_checkbox`, `notification_bell`, `notification_list`, `notification_preferences_section`, `collaboration/*` (`SampleStatusPicker`, `ReviewersSection`, `AssigneesSection`, `LabelsSection`, `RailSectionHeader`, `UserPickerDropdown`) | Deriva documental (A-01) |
| **Heredados** | `auth/brand_header.tsx` (2025, `alt="Logo"`, isotipo + título de 36 px), `text_field`/`select_field`/`date_field`/`password_field` (anteriores a `FloatingCaption*`), rutas `/catalog`, `/study-types`, `/report-templates` fuera de `/config`; botones `text`/`link`/`dashed` que pasan directo a antd | Candidatos a revisar, no necesariamente a eliminar |
| **Excepciones** | Gradiente `#49b6ad → #0f8b8d` en `password_reset_*`, `accept_invitation`, `patient_portal`; `#0f8b8d` en links punteados de `samples_list`/`reports_list`, en `stats_card` (color por defecto) y en `rbac.ts` (rol *reviewer*); estilo `logoDot` sin usar con colores fuera de paleta (`#ffd166`, `#ef476f`, `#06d6a0`) | Residuos de la migración de mayo (A-07) |
| **Adaptación válida de contexto** | `report/versioned/*` (documento clínico neutral) | Conservar (§5.7) |

**Estados de interacción y jerarquía:**

- Los botones tienen estados hover, active y disabled explícitos (`button.tsx:23-25`), pero todos con teal de bajo contraste. El disabled `#a8d4d0` con blanco da 1.62:1, lo cual es aceptable para un estado deshabilitado, pero debe distinguirse claramente del estado activo.
- Foco: **0 reglas `:focus-visible`** y 4 `outline: none` en `src/`. Los anillos de foco son `rgba(73,182,173,.20)`, muy tenues. No es verificable sin renderizar (A-10).
- **0 reglas `prefers-reduced-motion`**, a pesar de las animaciones de arrastre con inclinación (`CelumaSortableList`) y las transiciones.
- 67 usos de `fontSize` 9–11 en `.tsx`; el chip de estado usa 11px/500 (A-11).
- `index.html` declara `lang="en"` en una interfaz en español (A-12).

**Estados de trabajo (el punto más sensible para un laboratorio):** ver A-02 a A-06. En resumen: el color es el canal principal para reconocer el estado, pero los colores se repiten entre dominios, no alcanzan contraste suficiente y confunden estados que tienen implicaciones clínicas distintas (aprobado ≠ firmado/publicado).

### 6.3 Aplicaciones de marca (tablero)

| Grupo | Coherencia con la dirección actual | Necesidades del medio | Hallazgos |
|---|---|---|---|
| Identidad (01) | Usa `#0f8b8d`; wordmark vivo; descriptor "Patología Digital" | Vector, monocromo, tamaño mínimo | F-06, F-07 |
| Papelería (02) | Coherente con landing; no con la app | Medidas físicas, CMYK/Pantone, sangrado, tipografía de impresión | P-06, P-07, P-04 |
| Documentos (03) | **El reporte clínico contradice ADR 0002** | PDF generado por Chromium con tipografías de documento | P-02, P-03 |
| Operativo de laboratorio (04) | Decorativo, con color; la app no imprime etiquetas | Impresión térmica, resistencia química, simbología real, identificadores de paciente | P-05 |
| Digital (05) | Difiere de la app real (hero navy, vocabulario "firmados/casos") | Correo: sin webfonts, modo oscuro del cliente | P-08, P-09 |
| Patrones e ilustración (06–07) | Coherentes con la marca | Uso fuera de contenido clínico | F-12 |
| Web y slides (08–09) | Coherentes con el landing (`#0f8b8d`) | Proyección: contraste en sala | P-10 |

### 6.4 Organización del sistema

- No hay fuente de verdad declarada (O-01). `sources-of-truth.md` no menciona `celuma-brand-system`.
- La marca no tiene documentación escrita (O-02); la gobernanza lo reconoce: *"Brand-system automation is intentionally absent… decide whether changes are expected"* (`repository-governance-inventory.md:38,52`).
- Los tokens están en cuatro formatos incompatibles: CSS vars de marca, objeto TS de la app, CSS vars del landing y variables Docusaurus (O-03).
- El lienzo depende de un runtime externo para persistir y de React en modo desarrollo desde unpkg (O-04).

---

## 7. Matriz de hallazgos

> Evidencia = hecho verificable. Impacto y recomendación = interpretación.

### 7.1 Fundamentos (F)

| ID | Hallazgo | Evidencia | Tipo | Impacto | Prio | Certeza | Recomendación |
|---|---|---|---|---|---|---|---|
| F-01 | Dos teals primarios en conflicto; cada documento declara el suyo como correcto | `celuma-tokens.css:17` (`#0f8b8d`), `:22` (`#49b6ad` = "sidebar fill"); `tokens.ts:12`; `CELUMA_DESIGN_SYSTEM.md:314` ("Off-brand teals (e.g. `#0f8b8d`): always use `#49b6ad`"); `celuma-landing/src/index.css:4`; `celuma-docs/src/css/custom.css:5`; commit `458ca9e` | Potencialmente disruptivo | Toda pieza nueva hereda un color distinto según el repositorio en que se haga; landing/docs y app se perciben como productos diferentes | **P0** | Alta | Decidir un **modelo de roles de color**, no un solo hex (ver D-1) |
| F-02 | `#49b6ad` es el teal del logotipo; `#0f8b8d` no aparece en él | Muestreo PNG §3.3 | Evolución coherente (de la app) | Revertir la app a `#0f8b8d` sería alejarse del símbolo | P0 | Media | Tratar `#49b6ad` como **teal de identidad** (rellenos, superficies, ilustración) |
| F-03 | Ningún teal vigente alcanza AA para texto o para texto blanco sobre relleno | §3.4: 2.45 (app), 4.12 (marca) | Potencialmente disruptivo (accesibilidad) | Botones primarios, links, sidebar y pestañas activas con legibilidad insuficiente | **P0** | Alta | Definir un **teal de acción/tinta** ≥ 4.5:1 (candidatos a validar: `#1f7a75` 5.12, `#0c6f71` 5.95) para texto, links y rellenos con texto |
| F-04 | Salmón `#F98D84` es identidad en la app y no existe en la marca | `tokens.ts:15`; `page_header.tsx` (`borderLeft 5px secondary`); `CELUMA_DESIGN_SYSTEM.md:303` | Evolución coherente | La marca pierde un rasgo que la app ya usa en cada pantalla | P1 | Alta | Incorporar el salmón a la marca como acento (del núcleo del logo) con reglas: nunca como texto (2.29:1), nunca como color de error |
| F-05 | Valores `--celuma-iso-*` no coinciden con el arte | §3.3 | Inconsistencia accidental | Ilustraciones y blobs con tonos ligeramente distintos del logo | P3 | Media | Fijar los valores a partir del archivo maestro del logo cuando exista |
| F-06 | Logotipo solo en PNG; sin reglas de uso; `logo-v3` sin usar y con núcleo más saturado | `assets/*.png` (RGBA 697×777, RGB 1024×1024 sin alfa); `atoms.jsx` `CelMark` (texto vivo); `grep celuma-logo-v3` sin resultados | Pendiente | Bloquea papelería, etiquetas, bordado y grabado; riesgo de variantes no controladas | **P1** | Alta | Obtener o crear el maestro vectorial; documentar área de protección, mínimos, versiones monocromas y usos prohibidos; decidir el destino de `logo-v3` |
| F-07 | Descriptor "Patología Digital" frente al posicionamiento real | `app.jsx:22`, `stationery.jsx:79`, `documents.jsx:288`; `overview.md`: "Multi-tenant SaaS for anatomic pathology laboratories" | Potencialmente disruptivo (posicionamiento) | "Patología digital" suele entenderse como escaneo de laminillas (WSI), que el producto no ofrece según la evidencia revisada | P1 | Media | Decidir el descriptor oficial (D-5) |
| F-08 | Sin tipografía ni escala para impreso/PDF | Tokens solo en px; `system-ui` como cuerpo; el renderer de reportes usa Arial/Helvetica/Times/Calibri (`versioned_report_renderer_v2.tsx:113-124`) | Pendiente | En impresión, "system-ui" resuelve de forma impredecible | P1 | Alta | Definir la fuente de cuerpo para impresos de marca y documentar que los reportes clínicos usan la tipografía del tenant |
| F-09 | Dos lenguajes de iconos | `atoms.jsx` `CelIcon` (trazo 1.8 redondeado); app: 65 imports de `@ant-design/icons` | Adaptación de contexto o inconsistencia (a decidir) | Íconos de marketing y de producto no se corresponden | P2 | Alta | No cambiar la librería de la app; documentar criterios comunes (outline, esquinas redondeadas, un icono por concepto) (D-6) |
| F-10 | Radios y sombras alineados; botones compactos (8/10) sin documentar en la marca | `button.tsx`; `main.tsx:63` (`borderRadius 8`) | Adaptación de contexto | Bajo | P3 | Alta | Documentar en la marca como variante de UI densa |
| F-11 | Sin guía de tono; registros mezclados | Landing (formal-cálido); `backend/app/services/email.py:140-147` (tuteo, sin marca); `digital.jsx` dashboard ("te esperan") | Pendiente | Incoherencia entre correo, app y material comercial; riesgo de un tono informal en contextos clínicos | P1 | Alta | Guía de voz breve: tú/usted por canal, vocabulario de estados, tono en errores y en comunicaciones clínicas |
| F-12 | Ilustración y patrones sin reglas de exclusión; "micrografía" simulada en el reporte | `documents.jsx` (`CelCellField` rotulado "40× · H&E") | Potencialmente disruptivo (si se replica) | Una imagen decorativa que imita evidencia diagnóstica en un documento clínico | P1 | Alta | Regla: ilustración/patrón nunca dentro de contenido clínico, etiquetas ni zonas de datos |

### 7.2 Aplicación (A)

| ID | Hallazgo | Evidencia | Tipo | Impacto | Prio | Certeza | Recomendación |
|---|---|---|---|---|---|---|---|
| A-01 | Documento de diseño desactualizado: más de 20 componentes posteriores o no listados | `CELUMA_DESIGN_SYSTEM.md` (2026-07-04) vs. fechas git §6.2 | Inconsistencia accidental | Otros colaboradores (humanos o IA) reinventan patrones existentes | P2 | Alta | Actualizar el inventario tras resolver D-1/D-2 (no antes, para no documentar dos veces) |
| A-02 | Chips de estado bajo AA | `table_helpers.tsx:300-311` (11px/500, sin icono); §3.4 | Potencialmente disruptivo (a11y) | Lectura difícil en listas y worklist, peor en monitores de laboratorio con brillo alto | **P0** | Alta | Oscurecer la tinta de cada estado (tono 700) conservando el fondo pastel; es un cambio mínimo |
| A-03 | Aprobado y Publicado casi idénticos | `status_configs.tsx:28-29`; tintas 1.11:1 entre sí | **Potencialmente disruptivo (clínico)** | Un reporte aprobado **sin firmar** puede leerse como ya entregado | **P0** | Alta (hecho) / Media (impacto) | Diferenciar Publicado por algo más que el tono: icono (sello o firma), borde o relleno sólido; revisarlo con usuarios patólogos |
| A-04 | Mismo color, distinto significado entre dominios | Azul: orden/muestra Recibida, reporte En revisión, sexo masculino, rol patólogo; ámbar: En proceso, Borrador, Pendiente de revisión, Pago parcial; rosa: orden en Revisión y sexo femenino; rojo: factura Pendiente (`status_configs.tsx:56`) | Inconsistencia (de diseño) | En pantallas mixtas (detalle de orden, worklist) el color deja de orientar | P1 | Alta | Definir una **escala semántica transversal** (p. ej. *nuevo · en curso · requiere acción · completado · terminal negativo · neutral*) y mapear cada enum a ella; sacar sexo y roles de la paleta de estados |
| A-05 | La regla "estado = color + icono" no se cumple | `CELUMA_DESIGN_SYSTEM.md:84`; `renderStatusChip` sin icono; `ORDER/REPORT_STATUS_CONFIG` sin campo `icon`; "En proceso" = `SettingOutlined` (muestra) y `ExperimentOutlined` (orden); Insuficiente y Cancelada comparten icono | Inconsistencia accidental | Se depende del color, que es justo el canal más débil (A-02, A-04) | P1 | Alta | Un icono por estado **semántico**, centralizado en `*_CONFIG`, y mostrado también en el chip |
| A-06 | "Cancelada" en rojo para órdenes y en gris para muestras | `status_configs.tsx:12` vs `:21` | Inconsistencia accidental | Mismo concepto, dos lecturas | P2 | Alta | Unificar según la escala de A-04 |
| A-07 | Residuos de `#0f8b8d` en 9 archivos | `grep` (§6.2 "Excepciones") | Inconsistencia accidental | Bajo visualmente, pero contradice el documento de la app | P2 | Alta | Resolver después de D-1: algunos usos (links) podrían ser justamente el teal de tinta propuesto |
| A-08 | Paleta dispersa fuera de tokens | 95 literales `#49b6ad`; hover/active/tint/danger viven en `button.tsx:23-25`; `index.css` repite valores | Inconsistencia accidental | Cualquier cambio de color exige tocar decenas de archivos | P2 | Alta | Ampliar `tokens.ts` con roles (acción, tinta, tinte, peligro, bordes, estados) antes de cambiar valores |
| A-09 | Sidebar con texto blanco sobre `#49b6ad` | `sidebar_menu.tsx:283,306,441` | Potencialmente disruptivo (a11y) | La navegación principal tiene 2.45:1 | P1 | Alta | Depende de D-1: oscurecer el relleno o la tinta del texto; el sidebar es el lugar más visible de la identidad |
| A-10 | Foco poco visible y sin movimiento reducido | 0 `:focus-visible`, 4 `outline:none`, 0 `prefers-reduced-motion` | Pendiente | Navegación por teclado en recepción y captura intensiva | P1 | Media (sin render) | Auditar con teclado y axe; definir anillo de foco ≥ 3:1 |
| A-11 | Texto pequeño frecuente | 67 usos de `fontSize` 9–11 | Pendiente | Suma de tamaño pequeño y bajo contraste | P2 | Media | Fijar un mínimo de 12px para información de estado o de paciente |
| A-12 | `lang="en"` | `celuma-frontend/index.html:2` | Inconsistencia accidental | Lectores de pantalla y separación silábica en inglés | P2 | Alta | Cambiar a `es` (trivial; fuera del alcance de esta etapa) |
| A-13 | Comentarios o documentación que no coinciden con el código | `page_header.tsx` dice "teal accent indicator" y usa salmón; el documento dice "Cerrada → Liberada" y la config lista RELEASED antes de CLOSED | Inconsistencia accidental | Confusión menor | P3 | Alta | Corregir junto con A-01 |

### 7.3 Aplicaciones de marca (P)

| ID | Hallazgo | Evidencia | Tipo | Impacto | Prio | Certeza | Recomendación |
|---|---|---|---|---|---|---|---|
| P-01 | Todo el lienzo es anterior al cambio de la app | §3.2; `app.jsx:9` afirma "exclusivamente tokens" | Hecho de contexto | 60 artboards usan la lógica de color "vieja" | P1 | Alta | No rehacer las piezas hasta resolver D-1; luego actualizarlas por tokens, no pieza por pieza |
| P-02 | El reporte clínico presenta a Céluma como laboratorio emisor | `documents.jsx` (`ClinicalReportPage`, `ClinicalReportCover`: `CelMark`, "Dra. … Patóloga senior", `celuma.mx`, Baloo, teal); ADR 0002; `letterheads.md`; `default_report_presentation_v2.ts` | **Potencialmente disruptivo** | Si se usa como plantilla, contradice el contrato aprobado y puede suplantar la identidad del laboratorio cliente | **P0** | Alta | Redefinir la pieza como: (a) membrete neutral por defecto y (b) "huella de plataforma" (p. ej. "Documento generado en Céluma"). El diseño del reporte pertenece al tenant |
| P-03 | Afirmaciones de producto o regulatorias sin respaldo | NOM-024 (`stationery.jsx:162,450`, `web-patterns.jsx:220`); WORM, "digitalización de muestras", "validación remota por subespecialidad" (`stationery.jsx:162`); "IA en microscopía digital" (`digital.jsx:80`); SLA 48 h, "96.7% en SLA" (`slides.jsx`, `digital.jsx:246`) | Potencialmente disruptivo (legal y comercial) | Riesgo de publicidad engañosa o compromisos contractuales implícitos | **P1** | Alta (existen) / Baja (veracidad) | Validar cada afirmación o sustituirla por texto neutro antes de cualquier uso externo |
| P-04 | Nombres reales de instituciones en maquetas | "Hospital General Manuel Gea González" (`stationery.jsx:29`), "Hospital Ángeles del Pedregal" (`:152`), "Hospital Ángeles" (`slides.jsx:191`); `AGENTS.md` exige copy sintético | Inconsistencia con la regla | Puede leerse como relación comercial o aval; incumple la regla del propio repositorio | P1 | Alta | Sustituir por instituciones ficticias al tocar esas piezas |
| P-05 | Etiquetas de laboratorio sin respaldo de producto ni de medio | La app no imprime etiquetas (sin librerías de códigos; "etiquetas" en la app = *labels*/tags); `labops.jsx`: bandas de color, isotipo, código de barras y QR **falsos**, textos de 8–9 px, iniciales/edad/sexo | Potencialmente disruptivo (si se implementa tal cual) | Las impresoras de etiquetas suelen ser térmicas monocromas; en cassettes y laminillas se necesitan identificadores legibles por máquina y resistencia a solventes | P2 (sin fecha) | Media | Tratar la sección 04 como **exploración**; antes de diseñar, definir impresora, simbología (Code 128/DataMatrix), dimensiones físicas y política de identificadores. La marca en la etiqueta debe ser mínima o nula |
| P-06 | Sin especificación física de impresos | Solo A4, CR80 y DL en comentarios; escala A4 460 px (1 px ≈ 0.46 mm); tarjeta 340 px para 85 mm → texto de 8–10 px ≈ 5.7–7.1 pt; sin sangrado, zona segura, CMYK ni Pantone | Pendiente | Las piezas no se pueden enviar a imprenta tal cual | P1 (si hay impresión cercana) | Alta | Ficha técnica por pieza (medida, sangrado, tintas, papel, tipografía mínima en pt) |
| P-07 | Variantes sin elegir | Hojas A/B/C, tarjetas A/B/C, sobres ×2, carpetas ×2, firmas ×3 | Propuesta | Riesgo de usar variantes distintas en paralelo | P1 | Alta | Elegir una variante por pieza (o una primaria y una secundaria con uso definido) |
| P-08 | La sección digital de la marca no refleja la app real | `digital.jsx` (hero navy con campo celular; "Firmados", "casos", "agenda"); la app tiene `EmptyState`, `NotificationList`, `StatsCard`, `DashboardSummary` sobre crema y vocabulario "Órdenes / Aprobado / Publicado" | Divergencia (frontend más reciente) | La marca muestra una app que no existe; confunde a quien diseñe a partir de ella | P1 | Alta | Frontend → marca: sustituir las maquetas por capturas o especificaciones de los componentes reales; conservar las maquetas como "concepto de marketing" si se quiere |
| P-09 | Correo transaccional sin marca, pese a que SES ya está activo | `backend/app/services/email.py:136-149` (HTML plano, tuteo, "Equipo Céluma"); la marca solo diseña firmas personales | Pendiente | Primer contacto real de usuarios con la marca | P2 | Alta | Añadir al tablero una plantilla de correo transaccional (sin webfonts, compatible con modo oscuro, accesible) |
| P-10 | Web y slides dependen del teal de marca | `web-patterns.jsx`, `slides.jsx`; landing en `#0f8b8d` | Adaptación de contexto | Se ven afectados por D-1 | P3 | Alta | Actualizar solo después de D-1 |

### 7.4 Organización (O)

| ID | Hallazgo | Evidencia | Tipo | Impacto | Prio | Certeza | Recomendación |
|---|---|---|---|---|---|---|---|
| O-01 | Sin fuente de verdad declarada para la identidad | `sources-of-truth.md` no lista `celuma-brand-system`; `celuma-tokens.css:7-8` cita a la app; `CELUMA_DESIGN_SYSTEM.md` cita `tokens.ts` | Pendiente | Cada repositorio puede "ganar" la discusión | **P0** | Alta | Decidir la propiedad por capa (D-2) y registrarlo como ADR |
| O-02 | La marca no tiene documentación escrita | Solo `AGENTS.md`; reglas implícitas en JSX | Pendiente | Imposible validar piezas nuevas o delegar a terceros | P1 | Alta | Crear un `README` y una guía corta de fundamentos (después de D-1 a D-5) |
| O-03 | Tokens en cuatro formatos sin sincronización | CSS vars (marca), TS (app), CSS vars (landing), variables Docusaurus | Inconsistencia estructural | La deriva se repetirá | P2 | Alta | Tokens canónicos de marca en un formato neutro (JSON) + verificación ligera en cada repositorio; sin *build pipeline* por ahora |
| O-04 | El lienzo no funciona como tablero de trabajo | Estado vía `window.omelette` inexistente; sin columnas de estado; React en modo desarrollo desde unpkg | Limitación de herramienta | No hay seguimiento de pendientes | P2 | Alta | Llevar el seguimiento a issues o GitHub Project (etiqueta `area:brand`) y dejar el lienzo como catálogo visual |
| O-05 | Idioma y audiencia de la documentación de diseño | El documento de la app está en inglés y orientado a IA; la marca está en español | Decisión menor | Fricción para colaboradores | P3 | Alta | Decidir el idioma (D-8) |
| O-06 | La nota del lienzo afirma "exclusivamente tokens", pero hay valores fijos | `app.jsx:9`; `#7dd8d9`, `#fff` y tamaños inline en componentes | Inconsistencia accidental | Bajo | P3 | Alta | Tokenizar `#7dd8d9` (teal sobre oscuro, 10.52:1, válido) cuando se actualice |

---

## 8. Dirección de la alineación

### 8.1 Del frontend a la marca (la app llegó antes a algo que la marca debería adoptar)

| Qué | Por qué | Condición |
|---|---|---|
| Teal de identidad `#49b6ad` como color del símbolo, de rellenos y superficies | Es el color del logo (F-02) | Solo con un teal de tinta accesible al lado (F-03) |
| Salmón `#F98D84` como acento de identidad | Viene del núcleo del logo y la app ya lo usa como firma visual (F-04) | Con reglas: no texto, no error |
| Patrón de encabezado con borde lateral salmón y perfil de entidad (badge, chips, stats) | Rasgo reconocible y probado | Documentarlo como patrón de UI, no de impresos |
| Controles: botón en píldora, campos con contorno de 2px y *floating caption*, `ActionButtonPanel` segmentado | Definen el "look" actual de producto | Para la sección digital de la marca |
| Componentes reales de empty state, notificación y KPI | Sustituyen maquetas que ya no reflejan el producto (P-08) | — |
| Default neutral del reporte clínico | Adaptación correcta, basada en un ADR (§5.7) | La marca lo adopta como regla de "huella de plataforma" |

### 8.2 De la marca al frontend (fundamentos que la app debería respetar)

| Qué | Por qué | Nota |
|---|---|---|
| Un color de **tinta/acción accesible** (derivado del teal) | La app no alcanza AA en su acción principal | La marca debe definirlo; la app lo aplica |
| Escala semántica de estados con tintas oscuras + icono | Claridad clínica (A-02 a A-06) | Pertenece a la **app** en su detalle, pero la marca debe fijar el principio y los tonos base |
| Reglas del logotipo (tamaño mínimo, área de protección) | El sidebar usa el isotipo a 32–44 px y el login a 60 px, sin regla | Necesita primero F-06 |
| Guía de tono | Microcopy de errores, estados y correos | F-11 |
| Escala de espaciado nombrada | La app usa valores sueltos | P3, oportunista |

### 8.3 Específico de cada contexto (no unificar)

| Contexto | Lo que debe quedarse propio | Razón |
|---|---|---|
| **App** | Densidad, radios compactos 8/10, antd como base de comportamiento, paleta amplia para *labels* de usuario (`LABEL_COLORS`), iconos antd | Productividad y costo de cambio |
| **Documentos clínicos (reportes)** | Tipografía de documento, tinta neutra, identidad **del tenant**, sin ilustración | ADR 0002; legibilidad y validez del documento |
| **Etiquetas de laboratorio** | Monocromo, identificadores legibles por máquina, sin decoración | Viabilidad técnica y seguridad del paciente |
| **Marketing, web y slides** | Campo celular, blobs, fondos navy, Baloo en tamaños grandes, ilustración | Expresividad de marca |
| **Correo** | Fuentes de sistema, estructura simple, compatibilidad con modo oscuro | Limitaciones de los clientes de correo |
| **Impresos corporativos** | CMYK/Pantone, escala en pt, papel | Medio físico |

---

## 9. Cambios potencialmente disruptivos y decisiones a validar

### 9.1 Cambios disruptivos identificados

| # | Cambio | Dónde ocurrió | Qué alteró | Clasificación |
|---|---|---|---|---|
| X-1 | Primario `#0f8b8d` → `#49b6ad` | App, 2026-05-30 | Identidad (a favor del logo) **y** accesibilidad (en contra) | Evolución coherente en intención, disruptiva en ejecución |
| X-2 | Salmón como acento | App, 2026-06-03 | Añade un segundo color de identidad no reflejado en la marca | Evolución coherente |
| X-3 | Reporte clínico con marca Céluma | Marca (mayo) | Contradice el modelo de producto (tenant) | Disruptivo si se implementa |
| X-4 | Estados con tintas pastel de bajo contraste y colisiones | App (heredado y ampliado) | Claridad de estados clínicos | Disruptivo para la operación |
| X-5 | Afirmaciones regulatorias o de producto | Marca | Riesgo legal y comercial | Disruptivo si se publica |
| X-6 | Etiquetas decorativas | Marca | Viabilidad de impresión y seguridad del paciente | Disruptivo si se implementa |

### 9.2 Decisiones que requieren validación

| ID | Decisión | Opciones (sin preferencia salvo nota) | Evidencia relevante |
|---|---|---|---|
| **D-1** | Modelo de color primario | (a) Volver a `#0f8b8d` en todas partes · (b) Adoptar `#49b6ad` en todas partes · (c) **Dos roles**: teal de identidad `#49b6ad` + teal de acción/tinta accesible (nuevo, ≥ 4.5:1) · (d) Otro. *Nota: (c) es la única opción que respeta a la vez el logo y la accesibilidad según §3.3–3.4; requiere validación visual.* | F-01 a F-03 |
| **D-2** | Propiedad por capa | Propuesta: **marca** = fundamentos (logo, color base, tipografía, tono, reglas de aplicación); **app** = componentes, estados, densidad; **engineering** = contratos de documentos clínicos. Alternativa: la app manda en todo lo digital. | O-01 |
| **D-3** | Papel de Céluma en documentos clínicos | Solo huella de plataforma · Membrete neutral por defecto con marca Céluma discreta · Otro | P-02, ADR 0002 |
| **D-4** | Escala semántica de estados | Mantener paleta por dominio y oscurecer tintas (mínimo) · Escala transversal por significado (recomendable, más trabajo) | A-02 a A-06 |
| **D-5** | Descriptor de marca | "Patología Digital" · Otro que describa el producto (p. ej. gestión de laboratorio de anatomía patológica) · Sin descriptor | F-07 |
| **D-6** | Iconografía | La marca adopta un estilo compatible con antd · La marca mantiene su set propio solo para marketing | F-09 |
| **D-7** | Alcance del tablero | Qué secciones se ejecutan y cuáles son exploración (p. ej. 04 etiquetas) | §4, P-05, P-07 |
| **D-8** | Idioma y ubicación de la documentación de diseño | Español en la marca, inglés en la app (actual) · Unificar | O-05 |

---

## 10. Vacíos de documentación o evidencia que impiden concluir

1. **Intención del cambio a `#49b6ad`.** Sin la razón escrita, F-02 sigue siendo una inferencia. Si fue una decisión de marca, cambia la lectura de F-01.
2. **Archivo maestro del logotipo** y valores oficiales de color. Sin ellos no se puede cerrar F-05 ni F-06.
3. **Estado real del tablero:** qué se aprobó, qué se descartó y qué se imprimió. Sin esto, P-07 es solo una observación.
4. **Uso real previsto de papelería y etiquetas:** ¿hay impresión próxima? ¿Céluma imprime etiquetas o lo hace cada laboratorio con su equipo? Determina la prioridad de P-05 y P-06.
5. **Validez de las afirmaciones** (NOM-024, WORM, SLA, IA). Necesita confirmación del área de producto o legal.
6. **Render y auditoría de accesibilidad** de la app (foco, contraste en contexto, zoom 200 %, teclado). A-10 y A-11 son de certeza media por esta razón.
7. **Evidencia de usuarios:** ¿ha habido confusión real entre Aprobado y Publicado, o entre estados de orden y de muestra? Ayudaría a priorizar A-03 y A-04.
8. **Guía de tono o documento de posicionamiento** (quizá en Notion).
9. **Lista de piezas que ya circulan** (tarjetas impresas, firmas en uso, presentaciones enviadas), para saber qué cambios afectan material ya distribuido.

---

## 11. Propuesta de ajustes por etapas

Principio: **cambios mínimos, primero decisiones y después tokens; nada de rediseñar piezas antes de fijar los fundamentos.**

### Etapa 0 — Decidir (sin tocar código ni piezas)
- Resolver D-1, D-2, D-3 y D-4 (las otras pueden esperar).
- Registrar D-1/D-2 como ADR en `celuma-engineering` y añadir `celuma-brand-system` a `sources-of-truth.md`.
- Confirmar qué es el "tablero" y el alcance de D-7.

### Etapa 1 — Riesgos operativos y de claridad (cambios pequeños en la app)
- A-03: diferenciar Publicado de Aprobado (icono + tratamiento) — **prioridad máxima**.
- A-02: oscurecer las tintas de estado a tonos con AA manteniendo los fondos pastel.
- A-05/A-06: un icono por estado en `*_CONFIG`, mostrado en el chip; unificar Cancelada.
- F-03/A-09: aplicar el teal de acción accesible (si D-1 = c) a botones primarios, links y sidebar. Es un cambio de valor en tokens, no un rediseño.
- A-12: `lang="es"`.

### Etapa 2 — Fundamentos de marca escritos
- README + guía corta: color por roles, tipografía (pantalla y pt), logotipo (cuando exista el vector), iconografía, ilustración (con zonas prohibidas), tono.
- Actualizar `celuma-tokens.css` según D-1 e incorporar el salmón; corregir el comentario de origen.
- Tokens canónicos en formato neutro (O-03) y ampliación de `tokens.ts` con roles (A-08).

### Etapa 3 — Tablero
- P-02: reemplazar el reporte clínico por "membrete neutral + huella de plataforma".
- P-03/P-04: limpiar afirmaciones y nombres reales.
- P-08: sustituir la sección digital por componentes reales.
- P-07: elegir variantes; añadir fichas técnicas (P-06) solo a las piezas que se vayan a imprimir.
- P-09: añadir la plantilla de correo transaccional.
- Mover el seguimiento a issues (O-04).

### Etapa 4 — Oportunista
- A-01/A-13: actualizar `CELUMA_DESIGN_SYSTEM.md` una vez estables las etapas 1–2.
- A-07: limpiar residuos de `#0f8b8d` según el rol decidido.
- P-05: etiquetas, solo cuando exista una necesidad de producto y la especificación técnica.
- P-10, F-05, F-10, O-06.

---

## 12. Hechos, interpretaciones y preferencias

| Afirmación | Categoría |
|---|---|
| Marca/landing/docs usan `#0f8b8d`; la app usa `#49b6ad` y prohíbe `#0f8b8d` | Hecho |
| El cambio de la app ocurrió el 2026-05-30, después de generarse la marca | Hecho |
| `#49b6ad` está más cerca del logo que `#0f8b8d` | Hecho (muestreo) con margen de ±8 por canal |
| El cambio fue una evolución intencional hacia el logo | **Interpretación** |
| Los ratios de contraste de §3.4 | Hecho (cálculo WCAG 2.x reproducible) |
| Confundir Aprobado con Publicado tiene riesgo clínico | **Interpretación** basada en el contrato de ciclo de vida |
| El reporte de marca contradice ADR 0002 | Hecho (comparación de documento aprobado vs pieza) |
| "Patología Digital" sugiere escaneo de laminillas | **Interpretación** (uso habitual del término en el sector) |
| La sección 04 es exploratoria | **Interpretación** (no hay feature de impresión en la app) |
| El campo celular y los blobs "dan calidez" y son adecuados para marketing | **Preferencia estética** |
| El hero navy del dashboard de marca es "más expresivo" que la app en crema | **Preferencia estética** (no se usa como argumento en este documento) |
| El borde salmón del encabezado es un rasgo reconocible | **Interpretación / preferencia**; se propone conservar porque ya está implementado de forma consistente, no por gusto |

---

## 13. Preguntas para revisar juntos

1. **Q1 — Tablero:** ¿el "kanban" es el lienzo `Céluma Brand System.html` o existe otro tablero (Notion, Figma, papel) que no pude ver? Si existe, ¿qué columnas o estados tiene?
2. **Q2 — Primario:** ¿el cambio a `#49b6ad` del 30 de mayo fue una decisión de identidad (acercarse al logo) o un ajuste visual de la app? ¿Aceptarías el modelo de dos teals (identidad + acción accesible)?
3. **Q3 — Salmón:** ¿el salmón es oficialmente parte de la marca o solo un recurso de la app?
4. **Q4 — Reporte:** ¿Céluma debe aparecer en los reportes de los laboratorios? ¿Solo como "Documento generado en Céluma" o de forma más visible?
5. **Q5 — Estados:** ¿has observado confusiones entre Aprobado y Publicado, o entre estados de orden y de muestra? ¿Prefieres el ajuste mínimo (oscurecer tintas + iconos) o una escala semántica transversal?
6. **Q6 — Descriptor:** ¿"Patología Digital" es el descriptor deseado? ¿Céluma ofrece, o planea ofrecer, digitalización de laminillas?
7. **Q7 — Afirmaciones:** ¿hay respaldo para NOM-024, WORM, SLA y la mención a IA? ¿Quién valida el material comercial?
8. **Q8 — Impresión:** ¿qué piezas se van a imprimir en los próximos meses? ¿Hay proveedor y presupuesto definidos?
9. **Q9 — Etiquetas:** ¿las etiquetas de muestra son un producto de Céluma (la app las generaría) o una pieza para laboratorios específicos? ¿Qué impresoras usan los laboratorios?
10. **Q10 — Logotipo:** ¿existe un archivo vectorial del logo? ¿Qué es `celuma-logo-v3.png` y debe conservarse?
11. **Q11 — Tono:** ¿tuteo o usted? ¿Varía según el canal (app, correo, material comercial, documentos clínicos)?
12. **Q12 — Propiedad:** ¿quién aprueba los cambios de marca y quién los de la app? CODEOWNERS indica que la superficie de producto es compartida con Laisha. ¿La marca también?
13. **Q13 — Iconos:** ¿la marca debe hablar el mismo idioma de iconos que la app (antd) o es aceptable que el material comercial use su set propio?

---

## 14. Cierre

### Qué ajustar primero
1. **Decidir D-1 (modelo de teal) y D-2 (quién define qué).** Casi todos los demás hallazgos dependen de estas dos decisiones.
2. **Diferenciar "Publicado" de "Aprobado"** en la app y **subir el contraste de los chips de estado**. Son cambios pequeños con el mayor efecto sobre la claridad operativa del laboratorio.
3. **Retirar del uso externo** el reporte clínico con marca Céluma, las afirmaciones no validadas y los nombres reales de hospitales del tablero. No hace falta rediseñar nada: basta con no usar esas piezas hasta corregirlas.

### Qué conservar
- Crema + navy, Baloo 2 + system-ui, radios y sombras, el patrón "fondo suave + tinta", el isotipo actual y el relato *célula + lumen* con sus cinco valores.
- Los componentes de la app listados en §5.8 como dirección de producto.
- El reporte clínico **neutral** que ya implementa la app y el principio de ADR 0002.
- Patrones, campo celular e ilustraciones de la marca, **solo** para marketing, web, slides y papelería corporativa.

### Qué decisiones resolver antes de implementar
- **D-1** modelo de color · **D-2** propiedad por capa · **D-3** papel de Céluma en documentos clínicos · **D-4** escala semántica de estados.
- Después, en la etapa 2: **D-5** descriptor · **D-6** iconografía · **D-7** alcance del tablero · **D-8** idioma de la documentación.

*Fin del diagnóstico. No se modificó ningún archivo existente en ninguno de los repositorios; este documento es el único archivo creado.*
