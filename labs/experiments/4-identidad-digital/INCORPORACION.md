# Plan de incorporación · B · Ficha como base del Brand System

**Estado: preparado, no ejecutado (2026-10-07).** Rafael cerró el experimento el 2026-10-07 y eligió **B · Ficha, refinamiento de la ronda 2** ([`DECISION.md`](DECISION.md)). Este plan ya no compara direcciones: describe cómo B pasa de experimento aprobado a **base general del Brand System**. La especificación completa, en inglés, está en [`MIGRATION-PLAN.md`](MIGRATION-PLAN.md); los borradores de ticket y PR, en [`migration/`](migration/). La versión anterior de este archivo (mapa previo a la aprobación) se conserva en el historial de git, commit `4c9d04a`.

Los cuatro estados siguen separados: **aprobado en el laboratorio** (hecho) → **incorporado al Brand System** (este plan) → **adoptado por medio o repositorio** (fase 2, aparte) → **publicado** (pieza a pieza).

## Principios

1. **El sistema canónico no importa nada desde `labs/`.** Los archivos se copian o regeneran en destinos propios (`assets/`, `styles/`, `digital/`, `docs/`, lienzos).
2. **Una fuente por artefacto.** Logo y paleta: `assets/logo/` (copias del 02). Roles de color: `styles/celuma-tokens.css`. Fondos y Microcosmos: el módulo paramétrico `digital/microcosmos.js`, del que se generan los SVG y PNG. Composición: `digital/piezas.js`. Reglas para personas: `docs/guia-de-publicaciones.md`.
3. **El laboratorio queda congelado como evidencia.** El 04 conserva sus copias, exports y paquetes tal como se aprobaron; la diferencia con el sistema canónico es intencional y está controlada por comprobaciones.
4. **A · Lumen y C · Membrana se quedan en el laboratorio**, completas y renderizables, enlazadas desde la guía como alternativas conservadas. No son reglas por defecto: usarlas exige una decisión y una incorporación propias.
5. **No se sobrescriben originales canónicos:** `assets/celuma-isotipo.png`, `PatternCream`, `PatternNavy`, `CelBlob`, `IllustCellGroup` y las publicaciones A/B/C del lienzo (que pasan a antecedente) se conservan; los tokens existentes no cambian de valor, salvo `--celuma-iso-*`, que adoptan la paleta aprobada en 02.

## Mapa resumido origen → destino

| Material | Origen | Destino | Paquete |
|---|---|---|---|
| Logo, lockups A, wordmark, PNG y favicons | `../2-logo-vector-v2/master/`, `svg/isotipo/`, `svg/lockups/propuesta-a-baloo2/`, `svg/wordmarks/`, `png/` | `assets/logo/**` (copias byte a byte) | WP-1 · dependencia explícita |
| Paleta del isotipo | `../2-logo-vector-v2/master/celuma-paleta-aprobada.json` | `assets/logo/celuma-paleta.json` y `--celuma-iso-*` (+ `--celuma-iso-nucleolus`) | WP-1 |
| Tintas y roles de B | `kit/sistema.css` (`--e4-*`) | Tokens nuevos en `styles/celuma-tokens.css` (`--celuma-ink-teal-deep`, `--celuma-brand-fg-2/3`, `--celuma-mint-soft`, `--celuma-on-navy-text-2`, `--celuma-surface-navy-deep`) | WP-2 |
| Tintes de luz `--e4-luz-*` | `kit/sistema.css` | No se migran: solo los usa A · Lumen | — |
| Baloo 2 e Inter | Google Fonts | `assets/tipografias/**` (WOFF2 + OFL) y `styles/celuma-fonts.css` | WP-3 |
| Fondos Papel cream / Navy | `kit/microcosmos.js`, `recursos/fondos/` | `digital/microcosmos.js` → `assets/fondos/{svg,png}/celuma-fondo-*` | WP-4 |
| Biblioteca Microcosmos | `kit/microcosmos.js`, `recursos/microcosmos/` | `digital/microcosmos.js` → `assets/microcosmos/**` + `catalogo.json` | WP-4 |
| Cuadrícula, rastreador, regla, iconos | `recursos/svg`, `recursos/png` | `assets/recursos/**` | WP-5 |
| Motor, plantillas, editor, espécimen, galería | `kit/*.js|css|html`, `index.html` (cap. 4–8 y 10) | `digital/` solo con B ronda 2 | WP-6 |
| Generadores y comprobaciones | `scripts/*` | `digital/scripts/*` con Playwright fijado en `tools/` | WP-6 |
| Exports, PDF, paquetes | `exports/`, `descargas/` | `digital/dist/` (ignorado por git) → paquetes de versión publicados solo con aprobación | WP-7 |
| Motion de comunicación | `motion/`; Orden y lottie-web del 03 | `digital/motion/`, `assets/motion/**`, `vendor/lottie-web-5.13.0/` | WP-8 |
| Registro de afirmaciones | `AFIRMACIONES.md` | `docs/registro-de-afirmaciones.md` (comprobado de nuevo en la fecha de migración) | WP-9 |
| Guía de publicaciones | `docs/guia-de-publicaciones.md` | Reescrita a partir de B, con los mismos encabezados numerados | WP-9 |
| Lienzos | `canvases/digital.jsx`, `canvases/fundamentos.jsx` | Sección «Sistema digital · B · Ficha»; A/B/C del lienzo como antecedente con los mismos ids | WP-10 |
| Acceso y estado | `app.jsx`, registros | Enlace «Sistema digital», estado «incorporado» con fecha | WP-11 |

## Orden de trabajo

1. **WP-0 · Condiciones previas:** actualizar el texto del ticket #6 y la PR #7, decidir el almacenamiento de los paquetes del 04 y registrar el commit base. El cierre del laboratorio no cierra #6 ni fusiona #7.
2. **PR-1 · WP-1:** logo canónico del 02.
3. **PR-2 · WP-2 + WP-3:** roles de color y tipografías locales.
4. **PR-3 · WP-4 + WP-5:** fondos, Microcosmos y recursos.
5. **PR-4 · WP-6:** motor y galería canónicos. Puerta principal: **61/61 piezas idénticas píxel a píxel** a los exports aprobados del laboratorio.
6. **PR-5 · WP-7 + WP-8:** distribución y motion.
7. **PR-6 · WP-9 + WP-10 + WP-11:** guía, lienzos, acceso y estado.

Responsables según el repositorio: **Rafael** (aprobación y marca; CODEOWNER), **Laisha** (UI/UX; CODEOWNER de `assets/` y `styles/`) e implementación (agente o ingeniería). La persona responsable de producto para las afirmaciones no figura en el repositorio: Rafael la designa antes de publicar.

## Decisiones rutinarias resueltas por recomendación

- **Tipografías:** archivos WOFF2 sin modificar, de las versiones oficiales, con `OFL.txt` y su SHA-256; se adoptan solo si reproducen las piezas aprobadas.
- **Herramientas:** Playwright 1.62.0, Pillow, pypdf y NumPy fijados en `tools/`, sin depender de `celuma-frontend/node_modules`; ffmpeg 6.0 documentado.
- **Almacenamiento:** se versionan fuentes, SVG y PNG deterministas; los exports de distribución, PDF, vídeos y ZIP se generan en `digital/dist/` y se publican como paquetes de versión con hashes en el manifiesto. Para los ZIP ya versionados del 04 la decisión es de Rafael en la PR #7 (recomendación: retirarlos del commit y conservar `empaquetar.sh`).
- **Editable frente a distribución:** plantillas HTML/CSS/JS y SVG para editar; PNG, PDF, MP4 y WebM para distribuir. Sin Figma ni Canva salvo encargo aparte.

## Validación y retorno

Cada PR registra comprobaciones antes y después: los cuatro lienzos, lectura a 390 px, contraste sobre los fondos reales, protección del logo, rutas, descargas y editor en `python3 -m http.server` y en el preview 5050, identidad entre fuentes y exports, regeneración desde un clon limpio y accesibilidad con teclado. Safari, Firefox, dispositivos, lectores de pantalla, plataformas e impresión siguen sin probar y se registran como pendientes de la adopción. Cada PR se revierte por separado; los originales canónicos y el laboratorio quedan intactos, así que volver a la base anterior no destruye el histórico. Detalle: `MIGRATION-PLAN.md` §5.

## Después de la incorporación (fase 2, fuera de este plan)

`celuma-frontend`, `celuma-landing`, `celuma-docs` y la publicación por medio parten del Brand System ya incorporado, nunca del laboratorio, con sus responsables y pruebas: especificaciones vigentes de cada plataforma, revisión de textos y fuentes, canal de demostraciones, contraste del gris de apoyo en la app y blanco sobre teal.
