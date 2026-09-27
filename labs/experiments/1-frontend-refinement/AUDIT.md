# Auditoría · Experimento 01 · Refinamiento del frontend

> **Estado: exploración.** Nada de este documento está aprobado. Los hallazgos describen `celuma-frontend` 1.3.1 (`9dd6ca9`), leído el 2026-09-25, y los contratos de `celuma-engineering` citados. No se modificó ningún archivo fuera de `celuma-brand-system/labs/`.

**Cómo se obtuvo la evidencia.** Lectura del código y de los contratos; capturas de la app servida por su propio `npm run dev` con API simulada y datos ficticios (`scripts/capture-actual.mjs` → `capturas/actual/`); cálculo de contraste WCAG 2.x. La pantalla del editor de informes no se reprodujo en vivo (depende de demasiados endpoints): se auditó por código.

**Etiquetas.** Tipo: **C** comprensión o seguridad clínica · **A** accesibilidad y legibilidad · **J** jerarquía, densidad y navegación · **V** voz y consistencia · **P** preferencia estética (se declara como tal). Certeza: Alta = hecho en código o captura · Media = inferencia con evidencia parcial.

## 1. Hallazgos priorizados

Orden: impacto para el usuario primero; a igual impacto, menor esfuerzo primero.

| ID | Tipo | Hallazgo | Evidencia | Impacto | Esfuerzo | Certeza |
|---|---|---|---|---|---|---|
| H-01 | C | «Aprobado» y «Publicado» se ven iguales. Un informe aprobado **sin firmar** puede leerse como entregado. | `status_configs.tsx` `REPORT_STATUS_CONFIG` (`#10b981` vs `#22c55e`: 1,11:1 entre tintas); `report_editor.tsx:208-213` | Alto | Bajo | Alta (hecho) · Media (impacto) |
| H-02 | C | En la lista de trabajo, el ítem de revisión muestra la **decisión** del revisor con los mismos chips que el estado del informe, y el filtro por defecto oculta `APPROVED` como «completado». Un informe aprobado que falta **firmar y publicar** desaparece de la lista por defecto; el filtro activo solo se nota por el color del icono de columna. | `celuma-backend/app/api/v1/worklist.py:250` (`item_status = review.status`); `worklist.tsx` `isCompletedStatus` incluye `APPROVED` y `defaultStatusFilteredValue`; `capturas/actual/worklist-1440.jpg` (7 ítems, se ven 6) | Alto | Medio (requiere dato de API) | Alta (código) · Media (impacto) |
| H-03 | C | Enums sin traducir en la trazabilidad: «Cambió el estado de la orden de DIAGNOSIS a REVIEW». | `order_detail.tsx:1673-1676`; `capturas/actual/orden-detalle-1440.jpg` | Medio | Bajo | Alta |
| H-04 | C/A | El estado depende del color: chip de 11 px/500 sin icono; tintas entre 2,07:1 y 3,86:1. La regla escrita «estado = color + icono» no se cumple en el chip. | `table_helpers.tsx:282-311`; `CELUMA_DESIGN_SYSTEM.md` §3 | Alto | Bajo | Alta |
| H-05 | A | En móvil (390 px) las listas desbordan en horizontal: **491 px** en la lista de trabajo y **747 px** en órdenes. | `capturas/actual/actual.json`; `worklist-390.jpg` | Alto | Medio | Alta |
| H-06 | A | Texto blanco sobre teal `#49b6ad` (2,45:1) en lateral, botón primario y login; texto teal `#49b6ad` en enlaces, pestaña activa y etiqueta flotante (2,45:1). | `button.tsx:23`; `sidebar_menu.tsx`; `celuma_tabs.tsx`; `floating_caption_input.tsx` | Alto | Bajo | Alta |
| H-07 | A | El mensaje de error de los campos se oculta solo a los 5 s. | `floating_caption_input.tsx` `MESSAGE_AUTO_HIDE_MS = 5000` | Medio | Bajo | Alta |
| H-08 | A | Sin reglas `:focus-visible` (0), sin `prefers-reduced-motion` (0) y `lang="en"` en una interfaz en español. | `grep` en `src/`; `index.html:2` | Medio | Bajo | Alta (código) · Media (sin prueba con lector de pantalla) |
| H-09 | A | Código de orden en blanco sobre salmón (2,29:1). Contorno de campo `#49b6ad` (2,45:1) bajo el 3:1 de límite de control. | `record_card.tsx` `codeChipStyle`; `floating_caption_input.tsx` | Medio | Bajo | Alta |
| H-10 | C | El editor muestra los pasos del informe, pero no dice qué falta ni quién debe actuar; la firma no aparece como evidencia antes de publicar. «Firmar y publicar» es una sola operación (`/sign` y `/sign-and-publish`: `APPROVED → PUBLISHED`), sin confirmación que enumere consecuencias. | `report_editor.tsx:1898-1990`; `reports.py:3487, 3682`; `specs/reports/lifecycle.md` | Medio | Medio | Alta (código) · Media (impacto) |
| H-11 | J | La entrada «Inicio» muestra totales del laboratorio («Total Pacientes 128») que no dicen qué hacer; el trabajo pendiente vive en otra sección. | `home.tsx`; `capturas/10-app-inicio.jpg` (revisión gráfica) | Medio | Medio | Media |
| H-12 | J | Lista de trabajo poco jerárquica: fecha como primera columna, «Tarea» dice *Asignación/Revisión* en vez de la próxima acción, filas de ~73 px. | `worklist.tsx`; `capturas/actual/worklist-1440.jpg` | Medio | Medio | Alta |
| H-13 | C/V | Un mismo color significa cosas distintas entre dominios (azul: recibida, en revisión, masculino, patólogo); «Cancelada» es roja en órdenes y gris en muestras. | `status_configs.tsx`; `rbac.ts` `roleColor` | Medio | Medio | Alta |
| H-14 | V | «Reporte» en la app (159 cadenas) frente a «informe» en docs (116 frente a 12). Etiquetas en mayúsculas iniciales («En Proceso») frente al contrato («En proceso»). | `grep` en `celuma-frontend/src` y `celuma-docs/docs`; `specs/laboratory/sample-status.md` | Bajo | Bajo | Alta |
| H-15 | J | Navegación en orden no operativo (Inicio, Lista, Reportes, Pacientes, Médicos, Órdenes, Muestras, Facturación). | `sidebar_menu.tsx` `NAV_ITEMS` | Bajo | Bajo | Media |
| H-16 | P | Sombras de tarjeta intensas apiladas y saludo con emoji en el encabezado. Preferencia: menos ruido en pantallas densas. | `tokens.ts` `shadow`; `home.tsx` | Bajo | Bajo | Preferencia |

**Comprensión o seguridad clínica:** H-01, H-02, H-03, H-04, H-10, H-13. **Preferencias estéticas:** H-16 (y la elección de sombras más suaves en la propuesta).

**Qué conviene conservar:** crema + navy, Baloo 2 + sistema, radios 12–14, filete salmón del encabezado, patrón «fondo suave + tinta», búsqueda tolerante de `lib/search.ts`, `RecordCard` sin superposición (CEL-131-10), aviso «Retenido por pago pendiente», etiquetas «Imprimir borrador / copia local» distintas de «PDF oficial», y la separación de acciones de revisor en `rbac.ts`.

## 2. Matriz de propuestas del brand system

Adoptar = se usa tal cual en el prototipo · Adaptar = se usa el principio con cambios · No aplicar ahora = fuera de la interfaz clínica o sin decisión previa.

| Propuesta (origen) | Decisión | Justificación |
|---|---|---|
| Roles de color: teal de identidad `#49b6ad` para rellenos, teal de tinta `#1f7a75` para texto, navy sobre teal (Fundamentos) | **Adoptar** | Conserva el color del isotipo y resuelve H-06 (2,45 → 7,10:1). |
| Salmón como acento, nunca texto (Fundamentos) | **Adoptar** | Filete de encabezado y borde del código; el código pasa a tinta navy sobre salmón suave (15,5:1). |
| Salmón de tinta `#b4413a` (Fundamentos) | No aplicar ahora | La app no necesita texto salmón; evita confundirlo con error. |
| Teal sobre oscuro `#7dd8d9` (Fundamentos) | No aplicar ahora | La app no tiene superficies oscuras ni modo oscuro en alcance. |
| Gris secundario `#5b6472` (Fundamentos) | **Adoptar** | `#6b7280` da 4,49:1 sobre crema; `#5b6472` da 5,55:1. |
| Escala tipográfica de pantalla (Fundamentos) | **Adaptar** | Título 24/800 y sección 18/700 se conservan; texto de tabla 14 (densidad); mínimo informativo 12 px en chips y metadatos. |
| Escala impresa y de publicaciones (Fundamentos) | No aplicar ahora | El documento clínico usa la tipografía del laboratorio cliente; las publicaciones no son pantallas. |
| Estado del logotipo: isotipo V2 vigente, wordmark pendiente, protección ½, mínimo 20 px (Fundamentos) | **Adaptar** | Isotipo sin redibujar a 30 px sobre placa crema (regla de fondo liso); wordmark Baloo en uso sin declararlo oficial; `celuma-logo-v3.png` no se usa. |
| Iconografía: contorno, extremos redondeados, un concepto = un icono (Fundamentos) | **Adaptar** | Iconos dibujados para el prototipo con esa regla; en producción se mapean a Ant Design (§4). |
| Voz: tú, claro, sin absolutos; verbo al inicio (Fundamentos) | **Adoptar** | Títulos en frase, acciones con verbo y objeto, confirmaciones que enumeran consecuencias. «Tú/usted» del login sigue pendiente. |
| Ficha `CelumaButton`: tinta navy (Componentes) | **Adoptar** | Alternativa «relleno `#1f7a75` + blanco» evaluada en la dirección B y descartada por ahora. |
| Ficha `PageHeader`: filete salmón de 5 px (Componentes) | **Adoptar** | Se conserva como firma del producto. |
| Ficha chip de estado: tinta 700, icono, relleno sólido para Publicado (Componentes) | **Adaptar** | Se generaliza a una escala semántica de 9 tonos para órdenes, muestras, informes y decisiones. Tras la revisión de Rafael, todos los chips quedan sin contorno y Publicado/Liberada usan menta más intensa en lugar de verde sólido oscuro. El chip conserva «Aprobado» y la falta de firma se dice en «Siguiente paso». |
| Ficha `FloatingCaptionInput`: contorno `#2e9692`, etiqueta `#1f7a75` (Componentes) | **Adoptar** | Y el error deja de ocultarse solo (H-07). |
| Ficha `EmptyState`: avatar suave con icono en tinta (Componentes) | **Adoptar** | Cuatro variantes: vacío, sin resultados, error, sin acceso. |
| Inventario contrastado (Componentes) | **Adoptar** | Base del mapa de adopción (§4). |
| Publicaciones A «Lámina clara» | **Adaptar (solo principios)** | Un foco por zona, jerarquía eyebrow → título → texto, «marca en el borde, contenido limpio». No se copian composiciones de marketing. |
| Publicaciones B «Ficha de producto» | No aplicar ahora | Es para guías y novedades; se toma solo la regla «si se muestra un estado, se usa el chip exacto del producto». |
| Publicaciones C «Luz nocturna» | No aplicar ahora | Navy dominante y textura: inadecuado para trabajo clínico diario. |
| Presupuesto de texto y versión condensada (Publicaciones) | **Adaptar** | Etiquetas cortas en chips y tarjetas; el detalle va en segunda línea. |
| Ilustración, campo celular y patrones (Fundamentos) | No aplicar ahora | Solo marketing. Se **adopta** la regla clínica: ninguna ilustración en el documento ni en zonas de datos. |
| Fotografía (Guía) | No aplicar ahora | No hay banco aprobado ni necesidad en la app. |
| Informe de ejemplo de papelería (Céluma como emisor) | No aplicar | Contradice ADR 0002. El prototipo usa membrete del laboratorio cliente y la huella «Documento generado en Céluma.». |
| Etiquetas de laboratorio, descriptor «Patología Digital», papelería | No aplicar | Sin contrato de producto; fuera del alcance de la interfaz. |
| Marca `CelExploration` / «Propuesta» (lienzos) | **Adaptar** | Banda «Exploración · no aprobada» fija en cada vista y captura. |

## 3. Diferencias necesarias por contexto

| Contexto | Qué comparte | Qué es propio | Por qué |
|---|---|---|---|
| **Interfaz clínica (app)** | Isotipo, crema, navy, teal de identidad y de tinta, Baloo en títulos, salmón en el borde | Densidad, escala semántica de estados, iconos de producto, sin ilustración, foco y teclado | Se lee durante horas y con prisa; el color se reserva para estados y acción. |
| **Marca editorial (publicaciones, web)** | Isotipo, paleta y tipografía | Aire, un mensaje por pieza, ilustración abstracta, CTA como dirección | Comunica, no opera; puede ser expresiva. |
| **Documentos del laboratorio (informes)** | Solo la huella «Documento generado en Céluma.» | Membrete, tipografía y tinta del laboratorio cliente; sin Baloo, sin teal, sin ilustración | ADR 0002 y `letterheads.md`: el documento pertenece al laboratorio. |
| **Material promocional** | Isotipo y reglas de color | Cifras y capacidades solo verificadas; nombres ficticios | Riesgo comercial y legal (guía §8). |

## 4. Mapa de adopción (no se modificó nada; orden en el `BRIEF.md`)

| Archivo en `celuma-frontend` | Cambio posible | Hallazgos |
|---|---|---|
| `src/components/design/tokens.ts` | Roles: `primaryInk #1f7a75`, `onPrimary #0d1b2a`, `textSecondaryOnCream #5b6472`, `fieldBorder #2e9692`, `focusRing`, tonos semánticos | H-04, H-06, H-09 |
| `src/components/ui/status_configs.tsx` | Tono + icono por estado; etiquetas en frase; configuración separada para la decisión de revisión; «Cancelada» neutra; sexo y roles fuera de la paleta de estados | H-01, H-04, H-13, H-14 |
| `src/components/ui/table_helpers.tsx` | `renderStatusChip` con icono, 12 px/600, sin contorno; menta más intensa para entregado | H-01, H-04 |
| `src/components/ui/button.tsx` | Texto navy en primario; borde secundario `#8a94a3`; foco visible | H-06, H-08 |
| `src/components/ui/sidebar_menu.tsx` | Tinta navy, activo en placa blanca, isotipo sobre placa crema, orden por flujo | H-06, H-15 |
| `src/components/ui/record_card.tsx` | `codeChipStyle`: salmón suave + borde salmón + navy | H-09 |
| `src/components/ui/floating_caption_*.tsx`, `textarea_field.tsx`, `search_field.tsx` | Contorno `#2e9692`, etiqueta `#1f7a75`, error persistente con `aria-describedby` | H-07, H-09 |
| `src/components/ui/celuma_tabs.tsx` | Texto activo navy, barra `#1f7a75` | H-06 |
| `src/components/ui/celuma_steps.tsx` | Completados en teal de tinta, actual con su tono, fechas, vertical en contenedor estrecho | H-05, H-10 |
| `src/components/ui/empty_state.tsx` | Icono en tinta; variantes vacío/sin resultados/error/sin acceso | — |
| `src/components/ui/table.tsx` | Modo tarjeta por ancho de contenedor; `aria-sort`; densidad | H-05, H-12 |
| `src/pages/worklist.tsx` | «Qué sigue» y responsable; decisión ≠ estado; completadas con contador visible; más antiguas primero | H-02, H-12 |
| `src/pages/order_detail.tsx` | Estados traducidos en la línea de tiempo; avance en la ficha con fechas; rail bajo pestañas en anchos medios | H-03, H-05 |
| `src/components/report/report_editor.tsx` | Panel «Ahora / Siguiente paso / responsable», trazabilidad con firma como evidencia, confirmación de «Firmar y publicar» | H-10 |
| `src/pages/home.tsx` | Entrada diaria por rol («Mi trabajo»); resumen del laboratorio para administración | H-11 |
| `index.html`, `src/index.css` | `lang="es"`; `:focus-visible` global; `prefers-reduced-motion` | H-08 |
| `CELUMA_DESIGN_SYSTEM.md` | Actualizar solo después de aprobar | — |

**Dependencia fuera del frontend:** H-02 necesita que `GET /me/worklist` devuelva el estado del informe en los ítems de revisión (`celuma-backend/app/api/v1/worklist.py`), o que el frontend lo consulte aparte.

**Equivalencias de iconos (prototipo → Ant Design):** inbox → `InboxOutlined` · progreso → `SyncOutlined` o `ExperimentOutlined` · lápiz → `EditOutlined` · diagnóstico → `SolutionOutlined` · ojo → `EyeOutlined`/`AuditOutlined` · check → `CheckCircleOutlined` · sello → `SafetyCertificateOutlined` · enviar → `SendOutlined` · candado → `LockOutlined` · prohibido → `StopOutlined` · alerta → `WarningOutlined` · deshacer → `RollbackOutlined` · archivo tachado → `FileExcelOutlined` (a validar) · reloj → `ClockCircleOutlined`.

**Pruebas que habría que revisar al adoptar (no se tocaron):** `tests-visual/__snapshots__/notifications-*.png` y `record_card_long_names.visual.spec.ts` (chips y ficha), pruebas unitarias de `status_configs`, del picker de estado de muestra y de controles de revisor.
