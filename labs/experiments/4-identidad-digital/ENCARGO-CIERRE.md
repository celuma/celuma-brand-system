<!-- Copia íntegra del encargo de cierre y migración (Rafael, 2026-10-07). Fuente: deliverables/claude-experimento-04-cierre-y-migracion.md · SHA-256 54a9c32c6b647bec… · 11 796 bytes. El texto que sigue no se modificó. -->

# Encargo para Claude · Cierre del experimento 04 y preparación de migración

Solicitante: Rafael. Fecha de la decisión: **2026-10-07**, zona America/Mexico_City. Trabaja en este **chat nuevo**, con contexto fresco, sin depender de la conversación anterior.

## Decisión explícita de Rafael

> Confirma que usaremos la propuesta B y el resto las dejaremos como alternativas por si en un futuro las usamos. Deja el experimento como cerrado. El siguiente paso, una vez que quede cerrado, será preparar la migración para poder usarlo en general como base, ya no solo como experimento. Hazlo en un chat nuevo porque la ventana de contexto está casi llena.

Esta instrucción **aprueba B · Ficha, en su versión refinada de ronda 2, como dirección visual elegida** y pide cerrar el experimento 04. No solicites otra confirmación de esa misma decisión. **A · Lumen y C · Membrana se conservan como alternativas para una posible reutilización futura**: no se descartan, no se borran y no son la base principal. B de ronda 1 se conserva como antecedente histórico, no como otra dirección principal.

Primero completa y verifica el cierre. Después, en este mismo chat nuevo, **prepara una migración concreta y revisable** para que la identidad elegida sea la base general del Brand System. La preparación no es ejecutar ya la sustitución canónica ni desplegar o publicar.

## Contexto de trabajo comprobado

- Carpeta existente: `/Users/rafaelmagana/Céluma` (normalización Unicode del nombre puede variar; no crees otra carpeta).
- Repositorio: `celuma-brand-system`.
- Rama actual: `labs/experiment-04-digital-material`.
- Último commit comprobado: `4c9d04a0af63faf6ce931d6c83294ca4dfee5d2a`; el checkout estaba limpio al preparar este encargo. Revisa de nuevo antes de modificar y preserva cambios ajenos.
- Experimento: `labs/experiments/4-identidad-digital/`.
- Ticket de integración: https://github.com/celuma/celuma-brand-system/issues/6
- PR de integración: https://github.com/celuma/celuma-brand-system/pull/7
- Ambos están abiertos, asignados a Raismaav, con documentation/enhancement. El ticket está en Céluma Engineering: In Review, Type Task, Priority P3, Risk None, Effort M, Work type Documentation, Target release N/A - visual laboratory.
- Ticket y PR actualmente describen B como pendiente: la decisión nueva supera esa descripción. Registra en la entrega el texto en inglés que requiere actualización; no confundas cierre del experimento con cierre del ticket de integración o merge de la PR.

## Fuentes para reconstruir el contexto

Lee las instrucciones aplicables del repositorio, en particular `AGENTS.md`, `labs/CLAUDE.md` y `labs/README.md`; `docs/estado-de-piezas.md`, `docs/guia-de-publicaciones.md`, `docs/revision-grafica-y-direccion-de-marca.md`; y todos los documentos del 04: `PROMPT.md`, `REFINAMIENTO-B.md`, `BRIEF.md`, `README.md`, `DECISION.md`, `VALIDACION.md`, `AFIRMACIONES.md`, `INCORPORACION.md` y `manifest.json`.

Revisa la galería y el código real: `kit/sistema.css`, `formatos.js`, `contenido.js`, `piezas.js/css`, `microcosmos.js`, editor, especímenes, recursos y scripts generadores. Contrasta las reglas de diseño con las piezas entregadas. Lee las decisiones y fuentes activas de 02 y 03 para las dependencias de incorporación. Los lienzos y componentes canónicos actuales son referencias de lectura para el mapa de migración. El frontend, landing y docs son referencias, no destinos de edición de este encargo.

Si una fuente externa no es accesible, usa el material local y registra la limitación. No reconstruyas como hechos datos que no hayas leído ni vuelvas a abrir decisiones que Rafael ya tomó.

## 1. Cierre real y consistente del 04

Registra en `DECISION.md`:

- **Cerrado y aprobado por Rafael el 2026-10-07 para el laboratorio visual.**
- **Dirección elegida: B · Ficha, refinamiento de ronda 2**, con sus modos editorial/atmosférico/Microcosmos, los fondos recuperados Papel cream/Navy y la biblioteca Microcosmos. Conserva sus tipografías, tintas y reglas visuales tal como se entregaron en B como parte del alcance visual aprobado; la promoción a tokens/activos compartidos pertenece a la migración.
- A · Lumen y C · Membrana: **alternativas conservadas para posible uso futuro**, sin adopción principal automática.
- B ronda 1 y capturas originales: antecedentes históricos identificados.
- Alcance: elección del sistema visual B y cierre del experimento. No convierte cada caption o afirmación comercial en material publicable ni certifica plataformas, impresión, navegadores o flujos clínicos que no se probaron.
- Siguiente paso: preparación de incorporación de B como base general del Brand System, con dependencia de activos aprobados del 02 y motion del 03.

Actualiza todos los puntos donde el estado activo podría contradecir la decisión: `BRIEF.md`, `README.md`, la galería, sus datos y metadatos generados, `manifest.json`, catálogo de recursos, rótulos activos del editor/especímenes y documentación de descargas; la tarjeta del 04 y entradas de `labs/index.html`, `labs/README.md` y `docs/estado-de-piezas.md`. Si las instrucciones del repositorio mantienen un resumen vigente de experimentos, actualízalo con una nota breve del cierre, preservando su estructura.

No hagas un reemplazo indiscriminado de «candidata» en todo el árbol: hay decisiones históricas, alternativas y adopciones pendientes que necesitan conservar su contexto. El rótulo adecuado distingue **aprobado en el laboratorio**, **incorporación canónica pendiente**, **adopción por medio pendiente**. Registra la historia de primera y segunda ronda; no falsees qué estaba aprobado antes.

Los generadores deben producir el estado correcto: modificar solo el HTML generado y dejar scripts desactualizados no cierra el experimento. Revisa los paquetes que incluyen manifest/LEEME y los exports donde haya rótulos de estado; regenera solo los afectados sin perder calidad. Las piezas limpias no necesitan un sello añadido dentro del arte. Los ocho paquetes ya están versionados en la rama existente: no los borres para resolver por tu cuenta la estrategia de almacenamiento.

Abre la galería en el servidor real y revisa navegación, rótulos, B principal, acceso a A/C alternativas, editor, descargas y rutas históricas. Comprueba que las modificaciones de estado no cambian geometría, paleta ni composición aprobadas. Registra las comprobaciones nuevas, sin presentar la validación histórica como una prueba nueva. Corrige cualquier inconsistencia verificable antes de declarar el cierre terminado.

**No bloquees el cierre** por asuntos de adopción o publicación, como el canal de demostraciones, especificaciones de redes, impresión, compatibilidad adicional, estrategia de fuentes o almacenamiento. Consérvalos como tareas de la fase siguiente con alcance y motivo. La decisión de usar B ya está tomada.

## 2. Después del cierre: preparar la migración general

Transforma `INCORPORACION.md` en un plan operativo basado en la dirección ya aprobada; ya no debe preguntar si elegiremos A/B/C. Guarda una especificación de migración en inglés, por ejemplo `MIGRATION-PLAN.md`, y enlázala desde el cierre y la documentación correspondiente. Utiliza las plantillas del repositorio si existen para cualquier documentación de seguimiento. Los textos para GitHub, tickets y PRs deben estar en inglés.

El resultado debe incluir:

1. **Inventario y mapa exacto origen → destino.** Distingue logo/lockups de 02, motion de 03, tokens locales, tintas, fondos, Microcosmos, plantillas/editor, generadores, guía de publicaciones, lienzos y descargas. Propón carpetas y nombres reales que encajen con el repositorio existente, sin obligar al sistema general a importar recursos desde `labs/experiments/4-identidad-digital/`.
2. **Arquitectura de fuentes de verdad.** Cómo B será la base principal, cómo se consumen sus componentes/tokens, cómo se preserva el laboratorio como evidencia histórica y dónde quedan A/C como alternativas disponibles pero no reglas oficiales por defecto. Evita duplicados de masters, divergencia entre copias y dependencias cíclicas. Propón aliases o rutas de compatibilidad para links existentes.
3. **Paquetes de incorporación y orden de trabajo.** Cambios pequeños con archivos concretos, dependencias, responsable/rol cuando esté documentado, resultados y criterios de aceptación. Incluye incorporación canónica del logo nuevo como dependencia explícita, tratamiento de fondos y Microcosmos, promoción de tokens, plantillas y guía, lienzos y acceso general. Diferencia la preparación del uso de la marca de cualquier actualización posterior de frontend/landing/docs.
4. **Reglas y decisiones de implementación.** Fuentes y licencias; carga local o remota; exportación reproducible; diferencia entre archivos editables y PDF de distribución; storage/versionado de ZIPs y binarios; regeneración; texto/imagen/motion; matriz de estados aprobados y pendientes. Resuelve decisiones rutinarias mediante recomendación fundamentada sin pedir permisos innecesarios. No inventes certificaciones, lanzamientos o aprobaciones clínicas.
5. **Validación y retorno.** Verificaciones antes/después para los cuatro lienzos, lectura móvil, contraste sobre fondos reales, protección del logo, rutas/descargas/editor, identidad entre fuentes y exports, generación desde cero, accesibilidad y browser/media checks pertinentes. Explica cómo volver a la base anterior sin destruir el histórico. Cada tarea distingue validación existente de la que falta.
6. **Backlog listo para revisar.** Borradores en inglés de ticket y PR de migración, con problema, alcance, archivos, aceptación, pruebas y exclusiones. No los abras todavía ni dupliques el ticket #6/PR #7, que tratan la integración del laboratorio. Incluye los cambios de texto que esos dos necesitan por la decisión nueva de aprobación.
7. **Plan de revisión visual.** Qué vistas y comparativas podrá abrir Rafael para aprobar el cambio canónico; orden sugerido y riesgos concretos, sin burocracia artificial ni reabrir la selección de B.

No te limites a «después migramos»: entrega archivos concretos y un plan que permita iniciar la incorporación sin redescubrir la estructura. La meta es que B se use en general como base del Brand System una vez implementada esa migración. Conserva claridad, precisión, seguridad, confianza y humanidad como criterios de diseño y verificación.

## Límites de ejecución y entrega

Se autoriza actualizar el cierre del 04 y su registro/navegación/instrucciones de estado; preparar y guardar el plan y borradores de migración. No ejecutes todavía cambios canónicos de diseño ni edites otros repositorios. No crees otro experimento. Sin commit, push, merge, tag, despliegue o publicación en este encargo. No cierres ticket o PR de integración por el solo cierre visual; no envíes mensajes a otras personas ni edites Notion.

Preserva los masters, los experimentos 01–03, los archivos originales, A/C, evidencias históricas y cambios ajenos. Usa solo datos sintéticos. La adopción que afecte flujo clínico y la publicación por medio mantienen sus validaciones propias.

Al terminar entrega: confirmación del cierre comprobado y alcance aprobado; enlaces a la galería/decisión; ubicación de A/C; archivos cambiados y pruebas realizadas; especificación y mapa de migración con backlog y borradores en inglés; pendientes reales de adopción. Si algún check no pudo hacerse, dilo con precisión sin invalidar una aprobación ya otorgada.

**Empieza ahora en este chat nuevo: lee todo el encargo y las fuentes, completa el cierre, verifícalo y después prepara la migración concreta.**
