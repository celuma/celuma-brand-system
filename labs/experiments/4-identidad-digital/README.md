# Experimento 04 · Identidad y materiales digitales de Céluma

**Estado: cerrado y aprobado por Rafael para el laboratorio visual (2026-10-07).** Sistema visual alrededor del logo aprobado en 02 y del motion aprobado en 03. **Dirección elegida: B · Ficha, refinamiento de la ronda 2**, con sus modos editorial, atmosférico y microcosmos, los fondos rescatados Papel cream y Navy y la biblioteca Microcosmos ([`REFINAMIENTO-B.md`](REFINAMIENTO-B.md); galería §4). **A · Lumen y C · Membrana se conservan como alternativas** (galería §2, `exports/comparacion/a|c/`, editor). La B de la ronda 1 es antecedente histórico (`ronda-2/antes/`, `exports/comparacion/b/`). Los exports activos del kit son la ronda 2. **Aprobado en el laboratorio no significa incorporado ni publicable:** la incorporación canónica está preparada en [`MIGRATION-PLAN.md`](MIGRATION-PLAN.md) y cada pieza externa requiere su adopción por medio (texto, fuente vigente y plataforma).

Encargos: [`PROMPT.md`](PROMPT.md) (ronda 1), [`REFINAMIENTO-B.md`](REFINAMIENTO-B.md) (ronda 2) y [`ENCARGO-CIERRE.md`](ENCARGO-CIERRE.md) (cierre y migración) · diagnóstico, fuentes y direcciones: [`BRIEF.md`](BRIEF.md) · decisión de cierre: [`DECISION.md`](DECISION.md) · comprobaciones: [`VALIDACION.md`](VALIDACION.md) · afirmaciones: [`AFIRMACIONES.md`](AFIRMACIONES.md) · plan de incorporación: [`INCORPORACION.md`](INCORPORACION.md) y especificación en inglés [`MIGRATION-PLAN.md`](MIGRATION-PLAN.md) (borradores en [`migration/`](migration/)) · inventario: [`manifest.json`](manifest.json).

## Abrir

Desde la raíz de `celuma-brand-system`: `python3 -m http.server 8000` y abrir `http://localhost:8000/labs/experiments/4-identidad-digital/` (con barra final). También funciona en el preview `npx serve` del puerto 5050: la entrada normaliza la carpeta con `history.replaceState` antes de cargar recursos, sin redirecciones. Las tipografías llegan de Google Fonts; sin red, las páginas usan fuentes de reserva y **no** deben usarse para exportar.

- **Galería** (`index.html`): intención y base → tres direcciones (A y C, alternativas conservadas) → dirección elegida → **refinamiento B · fondos y Microcosmos** → sistema → kit → motion → guía → evidencias → archivos → cierre y migración. Enlaces directos: `?formato=9x16`, `?contexto=claro|oscuro`, `?grupo=Carrusel`, `?vista=movil`, `?motion=estatico` y anclas `#direcciones`, `#d-b`, `#refinamiento`, `#r2-fondos`, `#r2-biblioteca`, `#r2-aplicaciones`, `#r2-antes-despues`, `#r2-reglas`, `#r2-archivos`, `#mc-<recurso>`, `#sistema`, `#kit`, `#motion`, `#archivos`, `#plan`.
- **Editor** (`kit/editor.html`): elegir pieza, dirección (B ronda 2 · elegida; B ronda 1 · antecedente; A y C · alternativas conservadas), formato y, en B ronda 2, **fondo** y **Microcosmos** (automático o sin ilustración); editar textos con aviso en vivo de presupuesto, área útil y solapes; abrir a tamaño real; guardar PDF; copiar el contenido.
- **Una pieza a tamaño real** (`kit/pieza.html#p=<pieza>&d=<a|b|b1|c>&f=<formato>`), con `&fondo=<papel|papel-suave|navy|navy-suave|crema-plano|navy-plano>` y `&micro=0` (ronda 2), `&guias=1` para ver área útil y zonas, `&editar=1` para editar en el lienzo.
- **Espécimen Microcosmos** (`kit/microcosmos.html`): la biblioteca completa en claro y oscuro; `#r=<recurso>&t=<claro|oscuro>&w=&h=&excl=1` dibuja un recurso solo con su zona de exclusión.
- **Motion en vivo** (`motion/motion.html#m=intro-novedad` o `#m=paso-a-paso`): reproducir, pausar, reiniciar y versión estática.

## Estructura

| Ruta | Qué es |
|---|---|
| `kit/sistema.css` | Roles de color locales `--e4-*` (aprobados en el laboratorio dentro de B; no tocan los tokens compartidos: su promoción es parte de la migración) y carga de Baloo 2 e Inter |
| `kit/formatos.js` | Artboards y métricas por formato (margen, escala tipográfica, zonas) |
| `kit/contenido.js` | **Textos editables**, captions, texto alternativo y fuentes con estado de cada pieza |
| `kit/piezas.js`, `kit/piezas.css` | Motor de composición (A, B ronda 1 `b1`, B ronda 2 `b`, C), colocación del Microcosmos tras el layout y comprobaciones (líneas, área útil, solapes, formas sobre texto con geometría real, protección del logo, contraste sobre el fondo) |
| `kit/microcosmos.js`, `kit/microcosmos.html` | Ronda 2: fondos rescatados (perfil de `CelBlob`) y biblioteca Microcosmos con catálogo; espécimen |
| `kit/pieza.html`, `kit/editor.html` | Pieza a tamaño real y editor |
| `kit/marca/` | Copias **byte a byte** de los lockups A y el isotipo aprobados en 02 (no editar) |
| `exports/kit/` | 61 PNG del kit (B ronda 2) a tamaño de artboard; `pdf/` con 61 PDF vectoriales (halos como sombreado vectorial) |
| `exports/comparacion/<a|b|c>/` | 18 PNG de la ronda 1: mismo contenido en las tres direcciones. A y C son las alternativas conservadas; la B es la de la ronda 1 (antecedente histórico), regenerada idéntica con `b1` |
| `recursos/fondos/`, `recursos/microcosmos/` | Ronda 2: 16 fondos (SVG con `radialGradient` + PNG por formato) y 18 recursos Microcosmos (SVG transparente + PNG 2400 × 1800 + muestra 1200 × 900), `catalogo.json`, `recursos/ronda-2.json` |
| `ronda-2/` | Antes (ronda 1), después (grupo representativo), referencia original del lienzo y captura de Rafael, hojas de revisión y fidelidad de fondos |
| `REFINAMIENTO-B.md` | Encargo íntegro de la ronda 2 |
| `ENCARGO-CIERRE.md`, `MIGRATION-PLAN.md`, `migration/` | Encargo íntegro del cierre (2026-10-07), especificación de migración en inglés y borradores de ticket y PR |
| `recursos/svg`, `recursos/png` | Cuadrícula Orden, rastreador de pasos, regla salmón e iconos (SVG autónomos + PNG de trabajo) |
| `motion/` | `intro-novedad` (16:9) y `paso-a-paso` (9:16): MP4, WebM, póster, primer y último fotograma, fuente HTML/CSS/JS |
| `descargas/` | Paquetes zip con LEEME de estado (actualizado al cierre del 2026-10-07) |
| `validacion/` | Comprobaciones (`*.json`), hojas de contacto (`hojas/`), guías (`guias/`) y capturas de la galería (`vistas/`) |
| `scripts/` | Exportación, recursos, vídeo, contraste, manifiesto, paquetes, navegación (`navegacion.mjs`), capturas de la galería (`capturas.mjs`) y construcción completa (`construir.sh`). Cierre del 2026-10-07: `cierre-render.mjs` (las 61 piezas renderizadas de nuevo frente a `exports/kit/`) y `cierre.py` (estado coherente y piezas intactas frente al commit `4c9d04a`) |
| `index.html`, `galeria.css`, `galeria.js`, `galeria-datos.js` | Galería (los datos se generan) |

## Editar y exportar

1. Cambie textos en `kit/contenido.js` (o pruébelos antes en el editor y use «Copiar contenido»). Si cambia una afirmación de producto, actualice `fuentes` y su `estado`; sin página publicada, la pieza no sale a uso externo.
2. Para repetir una pieza en otro formato, añada `['<pieza>', '<formato>']` a `KIT` en `scripts/trabajos.mjs`. La composición se adapta sola; si no cabe, se usa la versión condensada (`tituloCorto`, `textoCorto`, `puntosCortos`, `permisosCortos`) y el exportador lo informa.
3. Exporte: `node scripts/exportar.mjs kit --pdf` (PNG + PDF + comprobaciones) y `python3 scripts/contraste_real.py kit` (contraste sobre los píxeles del fondo final), o todo en orden con `sh scripts/construir.sh` (~12 min: comparación, kit, PDF, contraste real, grupo representativo, recursos, fidelidad de fondos, guías, vídeo, hojas, manifiesto y paquetes).
4. Revise el PNG a 390 px de ancho y el informe `validacion/exportar-kit.json` (líneas, área útil, solapes, fuentes cargadas, errores).

**Fondo y Microcosmos por pieza.** En `kit/piezas.js`, la tabla `B2` asigna a cada plantilla su modo (`edi`, `atm`, `mic`), su fondo y su recurso; `VALOR_RECURSO` asigna un recurso a cada valor. Los recursos se dibujan después del layout y solo crecen hasta su zona de exclusión (líneas reales de texto, firma + ½ isotipo); si no caben con dignidad se omiten y el exportador lo registra. Cambiar la semilla (`data-semilla`) cambia la composición de forma reproducible.

**Repetir el carrusel (plantilla modular).** El carrusel es un bloque `CARRUSEL` en `kit/contenido.js`: una portada (`carrusel-portada`), de 2 a 5 pasos (`carrusel-paso`, con `paso`, `titulo`, `texto`, `quien` y `fuentes`), una nota opcional (`carrusel-nota`) y un cierre (`carrusel-cierre`). Copie el bloque con otro `id`, cambie los textos y añada sus láminas a `KIT` en 4:5. La numeración `01 / 07`, el rastreador y el ritmo crema/navy (portada y cierre en navy) se generan solos. Mantenga 5–7 láminas.

Herramientas ya instaladas en este equipo y usadas sin instalar nada: Playwright/Chromium de `celuma-frontend/node_modules`, `python3` del sistema (Pillow, pypdf), `/opt/homebrew/bin/python3.10` (NumPy, solo para comparar fotogramas), `ffmpeg` 6.0.

## Tipografía y licencias

- **Baloo 2 · 800** (Ek Type): wordmark y titulares. SIL Open Font License 1.1. https://fonts.google.com/specimen/Baloo+2
- **Inter** (Rasmus Andersson): texto de piezas exportadas, **aprobada en el laboratorio como parte de B** (2026-10-07); su incorporación canónica (D-12) y la carga local o remota son parte de la migración. SIL Open Font License 1.1. https://fonts.google.com/specimen/Inter · https://github.com/rsms/inter
- Se cargan desde Google Fonts como el resto del sistema; no se guardaron archivos de fuente. Los PNG y los PDF llevan la apariencia final: los PDF incrustan los glifos como Type 3 con `ToUnicode` (texto buscable; no editable como fuente en Illustrator).
- lottie-web 5.13.0 (MIT), copia local del experimento 03, solo para reproducir Orden.

## Formatos

Bases de diseño por proporción, no especificaciones certificadas de ninguna plataforma: 1:1 1080×1080, **4:5 1080×1350**, **9:16 1080×1920**, 1.91:1 1200×628 y 16:9 1920×1080; avatar 1080×1080, portada 4:1 1584×396, destacado 1080×1920, banner 3:1 1500×500 y firma 4:1 1200×300 (@2x de 600×150). En 9:16, el 14 % superior y el 20 % inferior quedan libres para la interfaz: **hipótesis** tomada de la guía local; no se consultaron especificaciones oficiales vigentes en esta ronda.

## Qué cubre y qué no

Cubre plantillas de identidad y valores, consejo, capacidad verificada, novedad, invitación a demostración y flujo; carrusel de 7 láminas y su plantilla modular; avatar, portada, destacados, banner, firma de correo (imagen) y dos diapositivas; dos motion; recursos y editor. No cubre impresos, informes clínicos, etiquetas, fotografía, firma de correo en HTML, anuncios con requisitos de plataforma, audio ni plantillas de Figma o Canva (no se entregó ninguna).

## Qué no se hizo

No se modificaron los experimentos 01–03, los maestros, tokens, lienzos (incluidos `PatternCream`, `PatternNavy`, `CelBlob` e `IllustCellGroup`, solo leídos) ni assets canónicos, ni `celuma-frontend`, `celuma-landing` o `celuma-docs`. Fuera de esta carpeta solo se registró el 04 en `labs/index.html`, `labs/README.md` y `docs/estado-de-piezas.md`; al cierre (2026-10-07) se actualizaron esas entradas y la nota de experimentos vigentes de `AGENTS.md` y `labs/CLAUDE.md`. Las rondas se integraron después en la rama `labs/experiment-04-digital-material` (commit `4c9d04a`, ticket #6, PR #7). El cierre no hizo commit, push, merge, publicación ni despliegue.

## Descargas

`descargas/` contiene 8 paquetes zip (≈ 63 MB) regenerables con `sh scripts/empaquetar.sh`; duplican archivos que ya están en la carpeta. Al cierre se regeneraron para que su `LEEME.txt`, su manifiesto y sus textos lleven el estado aprobado; el resto de su contenido no cambió (ver `VALIDACION.md` §8). Ya estaban versionados en la rama y se conservan; la estrategia de almacenamiento para el sistema canónico (paquetes fuera de git, releases o LFS) está en `MIGRATION-PLAN.md` §4.
