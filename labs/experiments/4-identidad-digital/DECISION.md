# Decisión · Experimento 04 · Identidad y materiales digitales

**Cerrado y aprobado por Rafael para el laboratorio visual el 2026-10-07.** Dirección elegida: **B · Ficha, refinamiento de la ronda 2**. **A · Lumen y C · Membrana se conservan como alternativas** para una posible reutilización futura; no se descartan ni son la base principal. La B de la ronda 1 queda como antecedente histórico. Es una aprobación en el laboratorio: la incorporación canónica al Brand System y la adopción por medio (redes, landing, docs, producto) son pasos separados y siguen pendientes.

> «Confirma que usaremos la propuesta B y el resto las dejaremos como alternativas por si en un futuro las usamos. Deja el experimento como cerrado. El siguiente paso, una vez que quede cerrado, será preparar la migración para poder usarlo en general como base, ya no solo como experimento.» — Rafael, 2026-10-07 ([`ENCARGO-CIERRE.md`](ENCARGO-CIERRE.md))

| Registro | Detalle |
|---|---|
| Encargos | Rafael: ronda 1, 2026-10-06 ([`PROMPT.md`](PROMPT.md)) · ronda 2, 2026-10-06 ([`REFINAMIENTO-B.md`](REFINAMIENTO-B.md)) · cierre y migración, 2026-10-07 ([`ENCARGO-CIERRE.md`](ENCARGO-CIERRE.md)) |
| Autoría de las propuestas | Claude, a partir del logo de 02, el motion de 03, el frontend vigente y la documentación publicada |
| Revisión y cierre | **Rafael, 2026-10-07** (America/Mexico_City) |
| Dirección elegida | **B · Ficha · ronda 2**: kit activo (`exports/kit/`, `motion/`), sistema de la galería §4–§5, editor con `d=b` |
| Alternativas conservadas | **A · Lumen** y **C · Membrana**: `exports/comparacion/a/` y `c/`, galería §2 (`#d-a`, `#d-c`), editor y `kit/pieza.html` con `d=a` / `d=c`, paquete `descargas/celuma-04-comparacion.zip` |
| Antecedente histórico | **B · Ficha · ronda 1**: `exports/comparacion/b/`, `ronda-2/antes/`, editor con `d=b1`; capturas originales en `ronda-2/referencia/` |
| Fuera de este cierre | Tokens, assets, lienzos y guía canónicos; `celuma-frontend`, `celuma-landing`, `celuma-docs`; publicación; ticket #6 y PR #7 |

## Alcance aprobado en el laboratorio

El sistema visual B · Ficha de la ronda 2, **tal como se entregó**:

- **Tres modos** coordinados —editorial sobrio, atmosférico y microcosmos— y su reparto por plantilla (tabla `B2` de `kit/piezas.js`), incluida la serie de valores con un recurso Microcosmos por valor.
- **Fondos rescatados** Papel cream y Navy (perfil de `CelBlob`), con sus variantes Papel suave, Navy suave, Crema plano y Navy plano, su colocación por proporción y la excepción documentada de la portada 4:1 (luz a la derecha). El **navy profundo `#0A1520`** es la superficie de esos fondos, distinta del navy `#0D1B2A` de tinta y wordmark.
- **Biblioteca Microcosmos**: 9 recursos en 5 familias, con su gramática (membrana, interior, foco desplazado hacia la luz, un foco salmón por pieza, tres tamaños), zonas de exclusión y semillas reproducibles (`kit/microcosmos.js`, `recursos/microcosmos/catalogo.json`).
- **Tipografía** como se entregó: Baloo 2 800 para wordmark y titulares; **Inter** para el texto de las piezas exportadas.
- **Tintas y roles locales** como se entregaron (`kit/sistema.css`, prefijo `--e4-`): teal profunda `#17635F`, tinta 2 `#3A4A5C`, tinta 3 `#56657A`, menta suave `#E4F3EA`, apoyo sobre navy `#C9D3DD` y los tintes de luz; junto con las combinaciones prohibidas (sin blanco sobre teal, sin salmón ni teal claro como texto pequeño).
- **Reglas de composición**: retícula y márgenes derivados de S y W, cabecera de serie, regla salmón, módulo informativo, firma con lockup A completo y protección de ½ isotipo, presupuesto de texto y versión condensada; zonas 9:16 como hipótesis de diseño.
- **Kit de 61 piezas** (PNG y PDF), carrusel modular, recursos de la ronda 1 que siguen en B (cuadrícula Orden, rastreador, regla salmón, iconos) y los **dos motion** (`intro-novedad`, `paso-a-paso`) como muestras de la dirección.
- **Herramientas del laboratorio**: editor, espécimen, generadores y comprobaciones, como medio para revisar y reproducir el kit.

La promoción de esos roles, fuentes y recursos a tokens y activos compartidos pertenece a la migración ([`MIGRATION-PLAN.md`](MIGRATION-PLAN.md)). El logo, la paleta del isotipo y el wordmark A siguen siendo los aprobados en 02 (copias byte a byte en `kit/marca/`).

## Qué no aprueba este cierre

- No convierte cada caption, texto o afirmación comercial en material publicable. Las afirmaciones conservan su fuente y estado en [`AFIRMACIONES.md`](AFIRMACIONES.md) y deben comprobarse otra vez al publicar. La invitación a demostración no se publica hasta confirmar el canal.
- No certifica especificaciones de plataformas, impresión, navegadores distintos de Chromium, dispositivos, lectores de pantalla ni flujos clínicos. Esos límites siguen como están en [`VALIDACION.md`](VALIDACION.md).
- No incorpora nada al Brand System canónico ni cambia otros repositorios. No publica, no despliega y no cierra el ticket #6 ni fusiona la PR #7, que tratan la integración del laboratorio.

## Estado por material

| Material | Laboratorio | Incorporación canónica | Adopción por medio |
|---|---|---|---|
| Kit B ronda 2 (`exports/kit/`, 61 PNG + 61 PDF) | **Aprobado** 2026-10-07 | Pendiente · `MIGRATION-PLAN.md` WP-6/WP-7 | Pendiente: texto, fuente vigente, formato y zonas de cada plataforma |
| Fondos Papel cream / Navy y variantes (`recursos/fondos/`) | **Aprobado** | Pendiente · WP-4 | Pendiente por medio |
| Biblioteca Microcosmos (`recursos/microcosmos/`) | **Aprobado** | Pendiente · WP-4 | Pendiente por medio; revisión con UI/UX antes de usarla en producto |
| Inter y tintas locales (`kit/sistema.css`) | **Aprobado** dentro de B | Pendiente · WP-2 (tokens) y WP-3 (fuentes) | — |
| Recursos de la ronda 1 en B (cuadrícula, rastreador, regla, iconos) | **Aprobado** dentro de B | Pendiente · WP-5 | Iconos: equivalencias con UI/UX (D-11) |
| Motion `intro-novedad` y `paso-a-paso` | **Aprobado** como muestra de B | Pendiente · WP-8; depende de la incorporación de Orden y Relevo (03) | Pendiente: exportación y revisión por red |
| Editor, espécimen y generadores | Herramientas del laboratorio | Pendiente · WP-6 (versión canónica solo B) | — |
| Logo y lockups (`kit/marca/`) | Aprobado en 02 | Pendiente en 02 · WP-1, dependencia explícita | — |
| A · Lumen y C · Membrana | **Alternativas conservadas** | No se incorporan; quedan disponibles en el laboratorio | — |
| B · Ficha · ronda 1 | **Antecedente histórico** | No | — |

## Preguntas abiertas: resolución

| Pregunta registrada | Resolución al cierre |
|---|---|
| 1 · Dirección | **B · Ficha ronda 2** (Rafael). A y C, alternativas conservadas |
| 2 · Tipografía de texto (D-12) | Inter, tal como se entregó, dentro del alcance visual aprobado. Carga local o remota y licencia en el paquete: migración (WP-3) |
| 3 · Tintas locales | Aprobadas como roles de B. Su promoción a tokens compartidos: migración (WP-2) |
| 4 · Línea «Fuente ·» en la pieza | Se conserva como se entregó. Si un medio la pasa al caption, se decide en la adopción por medio |
| 5 · Canal de demostraciones | **Pendiente de adopción.** La pieza `demo` no se publica hasta confirmar `hola@celuma.mx` u otro canal |
| 6 · Motion | Los dos ejemplos forman parte de B aprobada. Su uso como intro estándar y las exportaciones por red: adopción por medio |
| 7 · Qué plantillas pasan primero | Propuesta de orden en `MIGRATION-PLAN.md`; la elección por medio es parte de la adopción |
| Ronda 2 · tres modos y reparto | Aprobados como se entregaron |
| Ronda 2 · un recurso por valor | Aprobado como se entregó |
| Ronda 2 · navy profundo `#0A1520` | Aprobado como superficie de B. Rol de token: migración (WP-2) |
| Ronda 2 · luz a la derecha en la portada 4:1 | Aprobada como excepción documentada |
| Ronda 2 · versionar los paquetes (≈ 63 MB) | Estrategia de almacenamiento para la fase siguiente (`MIGRATION-PLAN.md` §4). Los ocho paquetes siguen versionados en la rama; no se borraron |

Ninguno de los asuntos pendientes bloquea el cierre: son tareas de incorporación o de adopción, con alcance y motivo en el plan.

## Historia de la decisión

1. **2026-10-06 · ronda 1.** Tres direcciones con el mismo contenido. Claude recomendó B · Ficha como **candidata**; nada quedó aprobado.
2. **2026-10-06 · ronda 2.** Rafael pidió **refinar B, rescatar Papel cream y Navy y ampliar el Microcosmos**. Se registró como orientación de trabajo, no como aprobación de B, de Inter, de las tintas ni del experimento.
3. **2026-10-07 · cierre.** Rafael aprueba B · Ficha ronda 2 como dirección elegida, conserva A y C como alternativas y pide preparar la migración. El texto anterior de este registro («Estado: PENDIENTE», con sus preguntas) se conserva en el historial de git, commit `4c9d04a`.

## Verificación del cierre

El 2026-10-07 se actualizaron estado, rótulos, navegación, metadatos y paquetes, y se comprobó que ninguna pieza aprobada cambió de geometría, paleta ni composición. Detalle y límites: [`VALIDACION.md`](VALIDACION.md) §8. Las comprobaciones de las rondas 1 y 2 (§1–§7) son evidencia histórica de esas rondas, no pruebas nuevas.

## Siguiente paso: preparar la migración

B pasa a ser la base general del Brand System mediante una **migración preparada, no ejecutada**:

- Plan operativo en español: [`INCORPORACION.md`](INCORPORACION.md).
- Especificación en inglés con inventario origen → destino, arquitectura, paquetes de trabajo, reglas, validación, retorno y plan de revisión: [`MIGRATION-PLAN.md`](MIGRATION-PLAN.md).
- Borradores en inglés del ticket y la PR de migración y textos para actualizar el ticket #6 y la PR #7: [`migration/`](migration/).

Dependencias explícitas: incorporación canónica del logo, los lockups y la paleta aprobados en 02 (WP-1), y de Orden y Relevo del 03 para el motion (WP-8). La adopción en producto, landing, docs o publicaciones sigue con sus propias validaciones y responsables.
