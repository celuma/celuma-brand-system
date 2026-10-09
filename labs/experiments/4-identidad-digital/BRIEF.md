# Brief · Experimento 04 · Identidad y materiales digitales de Céluma

**Estado:** **cerrado y aprobado por Rafael para el laboratorio visual el 2026-10-07**: dirección elegida **B · Ficha, refinamiento de la ronda 2**; A · Lumen y C · Membrana se conservan como alternativas; la B de la ronda 1 es antecedente histórico ([`DECISION.md`](DECISION.md)). Incorporación canónica y adopción por medio pendientes ([`MIGRATION-PLAN.md`](MIGRATION-PLAN.md)). Historia: primera ronda entregada el 2026-10-06 con B como recomendación candidata; segunda ronda (refinamiento de B) el mismo día, a petición de Rafael ([`REFINAMIENTO-B.md`](REFINAMIENTO-B.md)), todavía sin aprobación; cierre el 2026-10-07 ([`ENCARGO-CIERRE.md`](ENCARGO-CIERRE.md)). Ronda 2: §8.
**Encargos:** Rafael, 2026-10-06 ([`PROMPT.md`](PROMPT.md), ronda 1) · 2026-10-06 ([`REFINAMIENTO-B.md`](REFINAMIENTO-B.md), ronda 2) · 2026-10-07 ([`ENCARGO-CIERRE.md`](ENCARGO-CIERRE.md), cierre y migración). Copias íntegras.
**Responsable de la ronda:** Claude (asistente), por encargo de Rafael.
**Galería:** [`index.html`](index.html) · archivos y edición: [`README.md`](README.md) · comprobaciones: [`VALIDACION.md`](VALIDACION.md) · decisión de cierre: [`DECISION.md`](DECISION.md) · plan de incorporación: [`INCORPORACION.md`](INCORPORACION.md) y [`MIGRATION-PLAN.md`](MIGRATION-PLAN.md) · afirmaciones: [`AFIRMACIONES.md`](AFIRMACIONES.md).

## 1. Hipótesis y alcance

- **Oportunidad.** El logo ya tiene maestro, paleta y wordmark aprobados (02) y motion aprobado (03), pero la comunicación digital no tiene un sistema alrededor: las propuestas A/B/C del lienzo *Material digital* no tienen plantillas editables, la tipografía de texto exportado no está definida (D-12) y no hay kit, exports ni reglas de recursos propios.
- **Qué se quiere comprobar.** Si un sistema editorial construido alrededor del logo, sin tocarlo, puede expresar los cinco valores de forma observable y producir piezas de calidad en cinco proporciones con un flujo repetible (contenido → plantilla → export → comprobación).
- **Criterio de éxito.** Tres direcciones distintas comparables con el mismo contenido; una desarrollada en kit con exports reales y fuentes editables; cero desbordes o solapes medidos; contraste ≥ objetivo en cada combinación de texto; logo idéntico byte a byte; afirmaciones de producto con fuente publicada; motion cuyo final coincide con la pieza estática.
- **Fuera de alcance.** Sustituir material canónico (lienzos, guía, tokens, assets); cambiar el frontend, el landing, los docs u otros repositorios; tocar 01–03; publicar, hacer commit o desplegar; impresos, informes clínicos, fotografía.

## 2. Diagnóstico

**Lo que ya funciona (verificado).**
- El logo aprobado en 02 es un vector limpio con una paleta coherente con la app (`#49B6AD` = `--celuma-primary`, `#F98D84` = `--celuma-secondary`).
- La app, el landing y los docs comparten crema, navy y Baloo 2 800 en titulares; la app tiene un rasgo propio: el borde salmón de 5 px del `PageHeader` (`celuma-frontend/src/components/ui/page_header.tsx`).
- El motion de 03 ya resolvió cómo entra la marca (Orden, Relevo, Brote) y que todo vuelve al maestro en reposo.
- La revisión gráfica dejó reglas medidas para publicaciones (Dirección A, `PUB_A_RULE`) y una lista de afirmaciones heredadas que no deben copiarse.

**Lo que falla o falta.**
- Texto exportado en «fuente del sistema»: en una imagen exportada cambia según la máquina; no es reproducible ni redistribuible.
- `#6B7280` (gris de apoyo de tokens y app) sobre crema da 4,49:1: no alcanza 4,5:1 para texto pequeño. `#1F7A75` sobre menta suave da 4,47:1.
- Las propuestas de publicaciones usan un campo celular de círculos de tamaños aleatorios que se lee como «burbujas» y, en piezas pequeñas, como decoración genérica.
- No hay plantillas editables, ni carrusel, ni recursos independientes, ni descargas.
- Discrepancias de voz: la app dice «reporte» y los docs «informe»; el login mezcla usted/tú; el landing usa absolutos («100 % trazabilidad», «sin margen para errores»).
- Dos páginas publicadas de docs se contradicen sobre si un patólogo puede subir imágenes (v1.2 frente a Roles): excluido del material.

## 3. Matriz de fuentes

Precedencia aplicada: encargo y decisiones vigentes de Rafael → registros de aprobación de 02 y 03 → frontend vigente (lectura) → guías, lienzos y notas históricas.

| Fuente | Qué se tomó | Qué se conserva | Qué evoluciona | Qué falta decidir |
|---|---|---|---|---|
| `PROMPT.md` (encargo 04) | Alcance, cantidades, límites, criterios | — | — | — |
| `AGENTS.md`, `labs/CLAUDE.md`, `labs/README.md` | Estados, navegación, validación, límites | Patrón de navegación y normalización de URL | — | — |
| 02 · `DECISION.md`, maestro activo, paleta, lockups A | Logo y paleta aprobados | Geometría, pigmentos, lockup A, mínimos y fondos | — (copias byte a byte en `kit/marca/`) | Incorporación canónica |
| 03 · `DECISION.md`, `spec.json`, Lottie de Orden | Direcciones de motion y sus usos | Orden (intro), Relevo (firma), reposo exacto | Aplicadas a piezas de comunicación | Revisión por medio |
| `styles/celuma-tokens.css` | Roles existentes | Crema, navy, teal + texto navy, salmón | Tintas locales `--e4-*` medidas | Si pasan a tokens |
| `docs/guia-de-publicaciones.md` | Escala por S y W, zonas 9:16, voz | Hipótesis de zonas 14 %/20 %, tú, sin absolutos | Escala (margen y tipos), presupuesto por plantilla | Sustituir la guía tras aprobación |
| `docs/revision-grafica-y-direccion-de-marca.md` | Diagnóstico previo, D-1…D-15, afirmaciones corregidas | Propuesta de narrativa sin absolutos | Dirección de publicaciones (D-6) | D-6, D-8, D-12 |
| Lienzos (`canvases/`, `components/proposals-publicaciones.jsx`) | Direcciones A/B/C previas | Antecedente, no regla | Nuevo sistema propio | Retirar o mantener A/B/C del lienzo |
| `celuma-frontend` (lectura; `CELUMA_DESIGN_SYSTEM.md`, `tokens.ts`, `page_header.tsx`, `status_configs.tsx`, `report_editor.tsx`) | Identidad del producto, estados, capacidades en código | Borde salmón, radios, soft avatar | Paso de producto a marca sin capturas | Unificar «reporte/informe» |
| `celuma-docs` (lectura; tag v1.3.1, `docs.celuma.mx/sitemap.xml` consultado el 2026-10-06) | Capacidades publicadas y voz | Cada afirmación del kit | — | — |
| `celuma-landing` (lectura) | Valores, origen del nombre, contacto `hola@celuma.mx` | Los cinco valores | Descripciones sin promesas | Afirmaciones del landing (D-13) |
| Notion (lectura con la conexión existente, 2026-10-06) | Bienvenida, Propuesta de marca, ¿Por qué Céluma?, Logotipo e isotipo (final), Galería de logo | Valores, «profesional, biomédico y humano», «modular, sobrio, con espacios en blanco» | — | lumen/Luminis (D-7, no se resuelve); paleta, wordmark y tipografía de Notion son históricos |

**Notion, leído en esta sesión.** Propuesta de marca (editada 2026-05-25): valores, misión, visión, posicionamiento; paleta `#1FB8A6/#4A4A4A/#F87171` y tipografía Inter/Circular, ambas **históricas**. ¿Por qué Céluma? (2026-05-25): *luma* de *lumen*. Bienvenida (2026-09-24): v1.3/v1.3.1 «En producción» con notas en docs.celuma.mx; Laisha responde por UI/UX. Logotipo e isotipo (final): archivos V2. Galería: base de datos con estados y tipo de recurso. No se modificó nada en Notion.

## 4. Valores → decisiones observables

| Valor | Consecuencia de diseño | Cómo se comprueba |
|---|---|---|
| Claridad | Un mensaje por pieza; cabecera que nombra la serie; titular ≤ 3 líneas; texto ≥ 16 px a 390 px | Presupuesto de líneas medido en cada export; tabla de contraste |
| Precisión | Medidas derivadas de S y W; cuadrícula en celdas enteras; misma anatomía en cinco formatos; fuente publicada en la pieza | `validacion/exportar-*.json`; línea «Fuente ·» |
| Seguridad | Sin sellos ni cumplimiento; datos sintéticos; pendientes fuera; colores de estado clínico fuera de la marca | `AFIRMACIONES.md`; usos incorrectos |
| Confianza | Plantillas estables; composición sobria; motion que termina en la pieza estática; nada «confirma» un resultado | Comparación píxel a píxel final/estático |
| Humanidad | Crema, Baloo, segunda persona, responsable nombrado («Revisor asignado»), sin mascota ni infantilización | Revisión visual a 390 px; voz |

## 5. Direcciones de la primera ronda

| | A · Lumen | B · Ficha (recomendación candidata) | C · Membrana |
|---|---|---|---|
| Idea | La luz ordena: arcos planos nacen arriba a la izquierda y el mensaje vive en la zona iluminada | Precisión que se lee: lámina editorial con cabecera de serie, reglas finas, regla salmón, módulo informativo y fuente citada | Lo esencial, contenido: contorno orgánico con anillo teal y relleno menta; foco salmón numerado |
| Recursos | Arcos de luz (tintes planos de los rayos) | Cuadrícula Orden, rastreador de pasos, tabla de permisos, lista numerada, regla salmón | Membrana con radios asimétricos que sangra; foco |
| Lenguaje | Poético, pausado | Editorial, técnico y cercano | Amable, guiado |
| Fortalezas | La más cálida; evoca célula + luz | Escala a contenido real; coherente en cinco formatos; honesta por construcción | Muy reconocible; buen contraste interior |
| Límites | Sin módulo para contenido denso; puede volverse decorativa | Puede enfriarse; exige disciplina con fuentes | Repite la anatomía del logo y compite con él; tono sticker |

**Iteración documentada (renders inspeccionados en cada ronda).** 1) Primer render: A con media pieza vacía; B con una cuadrícula pesada («plástico de burbujas») que se solapaba con el pie en 9:16; C con anillo grueso y menta saturada. 2) A: arcos que cubren toda la diagonal; B: celdas más pequeñas y finas; C: anillo fino, menta suave y sangrado. 3) B: la cuadrícula se ajusta en celdas enteras al espacio real; la cabecera deja de repetir «Céluma»; la capacidad del revisor pasa a una tabla de permisos (más clara que el texto, que se retira por redundante); el flujo en vertical se vuelve una lista con responsables; el 1:1 usa una tabla condensada. 4) Motion: firma ausente por una ruta relativa (corregido), regla de lista que aparecía antes que la lista, final con 47 px distintos por capas de composición (corregido: el reposo se vuelve a montar como pieza estática).

## 6. Referencias, licencias y datos

- **Tipografías:** Baloo 2 (Ek Type, SIL OFL 1.1) e Inter (Rasmus Andersson, SIL OFL 1.1), ambas desde Google Fonts, como el resto del sistema. Disponibilidad comprobada el 2026-10-06 (`fonts.googleapis.com` responde 200). No se guardaron archivos de fuente en el repositorio.
- **Reproductor:** lottie-web 5.13.0 (MIT), copia local del experimento 03 (`../3-logo-motion/vendor/`), solo lectura.
- **Herramientas:** Playwright/Chromium de `celuma-frontend/node_modules`, Python 3 del sistema (Pillow, pypdf), Python 3.10 de Homebrew (NumPy), ffmpeg 6.0 del sistema. No se instaló nada.
- **Datos:** sintéticos o de documentación pública. Firma de correo con marcadores («Nombre Apellido», «nombre@celuma.mx»). Sin pacientes, médicos ni laboratorios reales.

## 7. Decisión

**Cerrado y aprobado por Rafael el 2026-10-07 para el laboratorio visual.** Dirección elegida: B · Ficha ronda 2 (modos, fondos Papel cream/Navy y Microcosmos de §8, con su tipografía, tintas y reglas tal como se entregaron). A · Lumen y C · Membrana: alternativas conservadas. B ronda 1: antecedente histórico. Las secciones §1–§6 y §8 describen el trabajo de las rondas 1 y 2 tal como se planteó entonces; donde dicen «candidata» o «pendiente» registran ese momento. Alcance exacto, matriz de estados y siguiente paso: [`DECISION.md`](DECISION.md).

## 8. Ronda 2 · refinamiento de B con fondos y Microcosmos

**Encargo.** Rafael: «rescatar los patrones y fondos, al menos este par», «trabajar más en el diseño del microcosmos de Céluma para tener más componentes» y «refinar la propuesta B teniendo estos detalles en mente» ([`REFINAMIENTO-B.md`](REFINAMIENTO-B.md), copia íntegra; captura de referencia en `ronda-2/referencia/captura-rafael-fondos-cream-navy.png`). Es un refinamiento, no una aprobación.

**Fuentes leídas (solo lectura).** `components/web-patterns.jsx` (`PatternCream`, `PatternNavy`, `IllustCellGroup`), `components/atoms.jsx` (`CelBlob`, `CelCellField`, `CelContour`, `CelDots`, `CelGrid`), `styles/celuma-tokens.css` (`--celuma-bg #FBF6EC`, `--celuma-ink-3 #0A1520`) y el render del lienzo *Fundamentos* en el preview 5050 (`ronda-2/referencia/original-*@2x.png`, `scripts/ronda2/capturar-original.mjs`). Nada de eso se modificó.

**Diagnóstico.** `CelBlob` es un gradiente radial teal `rgba(73,182,173,α)` → α 0,04 al 40 % → 0 al 70 % del radio. Papel cream = un halo α 0,18 arriba a la izquierda sobre crema; Navy = halo α 0,22 arriba a la izquierda y otro α 0,126 abajo a la derecha sobre `#0A1520`. `IllustCellGroup` usa círculos perfectos, pigmentos antiguos (`#2fa7a5`, `#e58a8a`) y un nucléolo granate `#9b3535`: demasiado cerca del dibujo del logo y fuera de la paleta de 02. `CelCellField` reparte círculos de tamaños continuos al azar: es la «burbuja aleatoria» que la ronda 1 criticó.

| Qué | Conservar | Evolucionar | Decidir |
|---|---|---|---|
| Fondos | Perfil exacto de `CelBlob`, colores y sutileza | Posición del halo por proporción para que quede detrás del mensaje y se apague antes de la firma; variantes suaves y planas | Si el navy profundo `#0A1520` es superficie del sistema |
| Microcosmos | La idea: célula grande + acompañantes, membrana, interior, foco | Gramática deliberada con la paleta de 02, sin nucléolo ni rayos; familias y reglas; semillas | Qué recursos pasan a la biblioteca canónica |
| B · Ficha | Orden de lectura, cabecera de serie, firma, módulo informativo, fuente | Reglas más finas, regla salmón solo con el titular en modos atmosférico y microcosmos, menos metadatos en piezas institucionales | Los tres modos y su reparto |

**Fondos (versiones locales).** `kit/microcosmos.js` (`FONDOS`, `svgFondo`) reproduce el perfil de `CelBlob` con `radialGradient` SVG. En el azulejo original (280 × 200) la diferencia con el render del lienzo es de 1 nivel (Papel) y 2 niveles (Navy) como máximo, con el centro del halo idéntico (`#DBEAE0`, `#17383E`; `ronda-2/fidelidad-fondos.json`). Por proporción la luz se coloca en (0,30 W; 0,30–0,34 H) en verticales, (0,27; 0,25) en 1:1 y (0,22; 0,24) en horizontales, con radio reducido en 1:1 y anchos, para que la zona del logo varíe ≤ 3 niveles. La portada 4:1 (lockup grande a la izquierda) lleva la luz a la derecha: excepción documentada (`papel-derecha`). Variantes: Papel, Papel suave (α 0,11), Navy, Navy suave (un halo), Crema plano y Navy plano.

**Microcosmos (biblioteca propia, 9 recursos, 5 familias).** Células (protagonista, acompañantes, membrana abierta), Agrupaciones (grupo asimétrico, par), Campos (tejido perimetral, campo ordenado), Contornos (recorte perimetral) y Detalles (foco y separador). Gramática: membrana orgánica con doble contorno en la protagonista; interior de citoplasma; foco desplazado hacia la luz (arriba a la izquierda, como los rayos y los halos); un único foco salmón pleno por pieza, núcleo teal tenue en acompañantes; tres tamaños (1 · 0,42 · 0,18 R) y holgura ≥ 0,25 R; sin rayos, trazos internos ni nucléolo; sin significados diagnósticos. Catálogo con intención, reglas, fondos y exclusión en `recursos/microcosmos/catalogo.json`; espécimen en `kit/microcosmos.html`.

**Tres modos de B.** *Editorial sobrio* (capacidades, pasos, flujo, diapositiva de contenido: Papel suave, sin ilustración protagonista); *atmosférico* (valores, consejos, novedad, cierre, portada: Papel o Navy con su luz y, si hay aire, un recurso de borde); *microcosmos* (Célula y luz, demostración, portada de carrusel, título de presentación, banner: un grupo en un módulo reservado). La serie de valores lleva un recurso por valor: grupo (Claridad), campo ordenado (Precisión), recorte (Seguridad), par (Confianza), tejido (Humanidad).

**Iteración de la ronda 2 (renders inspeccionados).** 1) Membranas «abultadas» y foco salmón tintado turbio en acompañantes → contornos más controlados, salmón solo en la protagonista. 2) Recursos atmosféricos omitidos porque la exclusión usaba la caja completa del bloque de texto → exclusión por líneas reales y centro óptimo sobre el borde. 3) Contornos concéntricos que se leían como un icono de señal → retirados de la biblioteca. 4) Campo disperso, «burbujas» → tejido hexagonal sin desorden que crece desde un borde. 5) Consejos y demostración repetían el mismo grupo → consejos en modo atmosférico con tejido. 6) Recorte con foco y arco cortados que parecían manchas → recorte sin foco ni arco. 7) Regla del destino que cruzaba la célula del cierre → sin regla en modo atmosférico. 8) Halo bajo el logo en 1:1, 16:9 y portada → posiciones por proporción y excepción de la portada. 9) Barra salmón larga en el motion → entra con el titular. 10) La propia verificación tuvo dos falsos positivos (cajas en lugar de geometría; matriz del SVG raíz en lugar de la del trazado) que se corrigieron antes de confiar en ella.

**Valores, ronda 2.** Claridad: la luz va detrás del mensaje y nunca bajo el texto; un foco por pieza. Precisión: recursos que crecen hasta su exclusión medida, semillas reproducibles, fidelidad medida contra el original. Seguridad: nada nuevo sobre el producto; ilustración sin significado diagnóstico. Confianza: misma anatomía, la ronda 1 conservada idéntica como antecedente. Humanidad: calidez de papel, células amables sin caricatura y un tejido que se lee como comunidad.
