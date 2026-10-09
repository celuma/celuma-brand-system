<!-- Copia íntegra del encargo de Rafael (2026-10-06). Fuente: deliverables/claude-experimento-04-identidad-digital.md · SHA-256 b0060d1c2de0ef8d… · 17 244 bytes. El texto que sigue no se modificó. -->

# Encargo para Claude · Experimento 04 · Identidad y materiales digitales de Céluma

Solicitante: Rafael. Fecha: 2026-10-06. Estado: encargo de exploración; aprobación pendiente.

Rafael te pide comenzar e implementar el **Experimento 04: la nueva identidad visual y el sistema de materiales digitales de Céluma**, en esta conversación nueva. La carpeta de trabajo es `/Users/rafaelmagana/Céluma`; el repositorio de destino es `celuma-brand-system`. Trabaja dentro de `labs/experiments/4-identidad-digital/`. La carpeta seleccionada puede mostrar el nombre con otra normalización Unicode: usa la ruta real existente, sin crear un duplicado.

No te quedes en una propuesta escrita ni esperes permiso para explorar: estudia las fuentes, diseña y construye una primera entrega visual revisable. La intención es tener un sistema y materiales reutilizables para publicaciones en redes y comunicación digital, basados en el logo nuevo, sus colores y lo que ya existe en el frontend. **Después de la aprobación explícita de Rafael podremos empezar a reemplazar el material canónico de Brand System. Esa sustitución no pertenece a este encargo.**

## 1. Nivel de exigencia

Actúa como director de arte y diseñador senior de identidad para un producto de salud. Rafael exige **alto rigor en la calidad del diseño y fidelidad a los valores de Céluma**. No basta con que las piezas funcionen o compartan colores: deben tener criterio editorial, composición cuidada, una jerarquía inequívoca, tipografía bien resuelta y una personalidad reconocible. Revisa tus propias propuestas con exigencia y corrige defectos antes de presentarlas.

Debe sentirse profesional, biomédica, cálida y humana, apropiada para equipos de anatomía patológica que trabajan con información sensible. Evita la estética genérica de SaaS, plantillas intercambiables, adornos gratuitos, gradientes por inercia, exceso de tarjetas y un tono infantil. La creatividad tiene que servir al mensaje y a la identidad.

## 2. Fuentes y precedencia: leer antes de diseñar

1. `celuma-brand-system/AGENTS.md`, `labs/CLAUDE.md`, `labs/README.md`, `README.md`, `docs/estado-de-piezas.md`, `docs/guia-de-publicaciones.md` y `docs/revision-grafica-y-direccion-de-marca.md`.
2. Experimento 02: `labs/experiments/2-logo-vector-v2/DECISION.md`, `BRIEF.md`, `README.md`, `VALIDACION-CIERRE.md`, maestro, paleta, lockups A, monocromas, versión reducida y aplicaciones. La decisión posterior sobre geometría, wordmark y color prevalece sobre textos históricos que todavía digan que no hay vector o que el wordmark está pendiente.
3. Experimento 03: `labs/experiments/3-logo-motion/DECISION.md`, `BRIEF.md`, `README.md`, `spec.json`, galería y exports. Cerrado y aprobado por Rafael para el laboratorio el 2026-09-30: Respira, Relevo, Brote, Atento, Orden y Rebote. Sus aprobaciones son referencias de laboratorio; las exportaciones de publicación requieren revisión por medio.
4. Los cuatro lienzos actuales y sus fuentes: `index.html`, `canvases/`, `components/`, `styles/`. Las publicaciones A/B/C y el material heredado son antecedentes, no una dirección obligatoria ni autorización para copiar textos o cifras.
5. `celuma-frontend`: sus instrucciones aplicables, `CELUMA_DESIGN_SYSTEM.md`, `src/components/design/tokens.ts`, componentes UI, cabeceras, acceso, pantallas y estados vigentes. Contrasta documentación con código. Usa el frontend solo como referencia de lectura: no lo cambies. Consulta `celuma-landing` y `celuma-docs` en lectura para voz y capacidades realmente publicadas.
6. Notion, si está disponible con la conexión existente, solo lectura: Bienvenida a Céluma, Propuesta de marca, ¿Por qué Céluma?, Logotipo e isotipo (final), Galería de logo. Sus enlaces están en la revisión gráfica y en `labs/experiments/3-logo-motion/PROMPT.md`. Si no puedes acceder, continúa con las referencias locales y explica qué no pudiste leer. No presentes el resumen local como una lectura nueva de Notion. La propuesta de marca de referencia y las copias originales son solo lectura. No conviertas paleta, wordmark o fuentes históricas de Notion en reglas actuales.

Precedencia: este encargo y decisiones explícitas vigentes de Rafael → registros de aprobación del 02 y 03 para su alcance → implementación vigente del frontend como referencia de producto → guías, lienzos y notas históricas para contexto. Distingue siempre hechos, recomendaciones y propuestas nuevas. Documenta las discrepancias sin reabrir el logo aprobado.

## 3. Base aprobada que debes preservar

- Maestro activo: `labs/experiments/2-logo-vector-v2/master/celuma-isotipo-maestro-paleta-aprobada.svg`.
- Paleta fuente: `labs/experiments/2-logo-vector-v2/master/celuma-paleta-aprobada.json`.
- Lockups principales: `labs/experiments/2-logo-vector-v2/svg/lockups/propuesta-a-baloo2/`. Wordmark A: **Baloo 2 800**, con el acento correcto en **Céluma**.
- Membrana/trazos `#49B6AD`; citoplasma `#BBEAD2`; núcleo `#F98D84`; nucléolo `#E5635F`; rayos `#F1C46C`. Wordmark navy `#0D1B2A`, blanco en negativo. Superficies de apoyo: crema `#FBF6EC`, blanco y navy.
- Preserva geometría, trazados, transforms, viewBox, proporciones y relaciones del logo. Usa sus variantes aprobadas para tamaño/fondo; no lo redibujes. `master/celuma-isotipo-maestro.svg` es el maestro histórico fiel al PNG, no el activo cromático. No uses `assets/celuma-logo-v3.png`, lockups B ni los colores descartados como nueva identidad.
- La nueva identidad aquí significa desarrollar el sistema alrededor de este logo: composición, jerarquía, recursos gráficos, voz y aplicaciones. Puedes proponer reglas locales y una sans para textos exportados si hace falta; deben quedar candidatas, con justificación, licencia y compatibilidad revisadas. Baloo 2 800 permanece en el wordmark. No modifiques tokens compartidos.

## 4. Valores como criterios observables de diseño

Los valores documentados son **Claridad, Precisión, Seguridad, Confianza y Humanidad**. El sentido compartido del nombre es célula + luz: claridad, precisión y vida. No inventes una nueva misión oficial ni resuelvas como hecho la discrepancia histórica lumen/Luminis.

Traduce cada valor a decisiones que podamos revisar:

- Claridad: un mensaje principal por pieza, orden de lectura evidente, contraste, textos comprensibles y lectura cómoda en móvil.
- Precisión: retícula, alineaciones, espaciado, anatomía del logo y consistencia; mensajes sobre producto sustentados en fuentes.
- Seguridad: privacidad en ejemplos, datos sintéticos y prudencia en las afirmaciones; no insignias de certificación ni promesas de cumplimiento sin evidencia.
- Confianza: sistema coherente y estable, composición sobria, legibilidad y un tono honesto que no prometa resultados clínicos.
- Humanidad: calidez, cercanía y respeto por quienes trabajan en el laboratorio; personalidad sin infantilización ni ansiedad comercial.

Explica cómo se ven estos valores en las piezas. No los limites a una lista decorativa.

## 5. Proceso creativo y primera ronda

1. Guarda este encargo en `PROMPT.md`. Prepara un diagnóstico breve y una matriz de fuentes, con qué conservar, qué evolucionar y qué falta decidir.
2. Diseña **tres direcciones realmente distintas** del sistema gráfico, todas compatibles con la base aprobada. Deben diferir en composición, lenguaje editorial y recursos, no solo en fondo o disposición del logo. Ponles nombres, describe su idea, fortalezas, límites y relación con los valores.
3. Para comparar, aplica el mismo contenido y los mismos formatos a las tres: una pieza institucional de valores, una explicación breve de producto con capacidad verificada y la portada más una lámina interior de un carrusel. Revisa las piezas a escala de uso.
4. Recomienda una dirección provisional y construye con ella el kit más completo de primera ronda, sin esperar una selección intermedia. Debe estar rotulada como recomendación candidata: no implica que Rafael ya la aprobó. Conserva las alternativas para revisión.
5. Itera después de inspeccionar los renders. Si una composición, recurso o texto reduce calidad, rehazlo. No presentes borradores defectuosos para completar cantidad.

## 6. Entregables dentro del experimento

**Sistema de identidad candidato:** paleta con roles y combinaciones de contraste; escalas tipográficas; retículas y espaciado por proporción; jerarquía; firma y protección; recursos gráficos propios derivados con criterio de célula/luz; reglas de ilustración, iconografía, capturas y motion; usos correctos/incorrectos; voz, ejemplos y presupuesto de texto. Mantén separados los colores de marca y los colores semánticos de estados clínicos del frontend. Aprovecha su calidez y coherencia sin convertir toda publicación en una captura de la app.

**Kit de comunicación reutilizable:**

- Plantillas para identidad/valores, consejo o guía, capacidad verificada, anuncio de novedad verificable, invitación genérica a demostración y explicación de flujo. No inventes eventos, fechas, versiones, tarifas, descuentos, clientes, cifras o funciones.
- Al menos un carrusel completo de 5–7 láminas: portada, desarrollo con ritmo editorial y cierre; también plantilla modular para repetirlo.
- Piezas adaptadas deliberadamente a las proporciones 1:1, 4:5, 9:16, 1.91:1 y 16:9. Artboards de trabajo: 1080×1080, 1080×1350, 1080×1920, 1200×628 y 1920×1080. Son bases de diseño, no certificación de especificaciones actuales de cada plataforma. Prioriza 4:5 y 9:16 para la primera ronda. No estires una composición para cambiar de formato.
- Avatar y portadas digitales adaptables, portadas de historias/destacados si tienen sentido, módulos de firma y banners; título de presentación y una lámina de contenido reutilizable. Define qué cubre el kit y qué queda fuera.
- Dos ejemplos breves de motion para comunicación, reutilizando con criterio las direcciones del 03: una intro/outro o anuncio de marca y un formato vertical. Entrega versión estática y especifica duración, formato real y límites. No fuerces animación donde el mensaje pida calma. No llames Lottie a una pieza que solo existe en CSS ni prometas un MP4 que no generaste.
- Biblioteca de recursos independientes con reglas de uso, sin recortar el logo o separar elementos de manera que contradiga las reglas aprobadas.
- Ejemplos en español con captions editables, CTA breve y texto alternativo. Cada afirmación sobre una función debe tener una fuente concreta y su estado: demostrada en producto, publicada en docs o pendiente. Si está pendiente, exclúyela del material propuesto para uso externo y déjala en el registro interno.

**Archivos utilizables:** fuentes editables reales, recursos SVG y PNG en resolución de trabajo, exports finales de muestra y generadores/configuración para repetir formatos sin rehacer la composición. SVG/HTML/CSS locales con textos editables y un flujo reproducible son aceptables. Incluye versión de distribución con apariencia tipográfica estable cuando corresponda. No prometas Figma/Canva u otro formato sin entregar un archivo que realmente se pueda usar. Mantén licencias y enlaces oficiales de fuentes/recursos; verifica disponibilidad antes de distribuirlos. Descargas reales, manifest con dimensiones, formato, dirección, propósito y estado; README con instrucciones de edición/exportación y estructura de carpetas. La galería sola no es el kit.

**Documentación y revisión:** `BRIEF.md`, `PROMPT.md`, `README.md`, `DECISION.md` (pendiente, nunca aprobada por ti), `VALIDACION.md`, inventario/manifest y un plan de incorporación futuro que mapee material actual → candidato → dependencia → validación. Ese plan prepara la migración; no la ejecuta.

## 7. Galería y navegación

Entrada autónoma en `labs/experiments/4-identidad-digital/index.html`, con navegación exclusiva del 04 y acceso desde una tarjeta nueva del laboratorio que abra una pestaña propia. Anteriores solo en referencias/comparaciones. Sigue `labs/README.md`: recorrido laboratorio → experimento actual → capítulos propios; índice local separado; `aria-current`; anclas estables; vuelta al laboratorio y acceso a brief, validación, decisión y descargas.

Organiza un recorrido legible: intención y base → comparación de direcciones → sistema recomendado → kit en contexto y a tamaño real → guía → evidencias → archivos → pendientes y plan de incorporación. Las propuestas comparables comparten escala y controles; separa páginas solo si una aplicación o etapa lo necesita. Permite cambiar dirección/formato, comparar fondos y reproducir/detener motion donde corresponda. Que se pueda revisar en móvil y con teclado, sin exceso de controles.

Para registrar el 04 se autorizan los cambios mínimos en `labs/index.html` y `labs/README.md`, y una fila/nota de estado en `docs/estado-de-piezas.md` que diga exploración y enlace el 04. No reescribas reglas canónicas, contenido anterior ni los estados aprobados del 02 y 03.

## 8. Rigor de validación

- Renderiza e inspecciona visualmente las piezas y exports, no solo el código. Comprueba versiones largas/cortas, tildes, líneas, recortes, alineaciones, jerarquía, contraste, márgenes y consistencia entre formatos. Evalúa publicaciones a unos 390 px de ancho y la galería en escritorio y móvil.
- Mide contraste en todas las combinaciones de texto: objetivo de referencia 4.5:1 para texto normal y 3:1 para texto grande. No uses blanco sobre teal de identidad ni teal claro/salmón como tinta pequeña. Si una corrección necesita otra tinta, proponla localmente y registra el rol sin alterar el logo ni los tokens compartidos.
- En 9:16 utiliza la guía local como punto de partida para márgenes y reservas de interfaz; rotula las zonas como hipótesis de diseño. Verifica fuentes oficiales vigentes si afirmas requisitos exactos de una plataforma. No declares que se revisaron sus interfaces sin hacerlo.
- Comprueba fuentes cargadas, archivos exportados a tamaño declarado, fondo/transparencia adecuados, apariencia al abrirlos fuera de la galería y descargas. Revisa SVG para que no dependa accidentalmente de rutas externas, fuentes ausentes o datos privados. Separa overlays de revisión de los exports limpios; el manifest y la galería conservan el estado pendiente.
- Prueba navegación con clics reales en el servidor usado: entrada desde lab, rutas directas con/sin barra, `index.html`, parámetros/anclas, controles y enlaces de descarga. El preview 5050 puede quitar `.html` e `index`: normaliza la carpeta con `history.replaceState` antes de cargar recursos, preservando consulta/fragmento, sin redirecciones que repongan `index.html`. No reincidas en el bucle histórico.
- Motion: reproducir/pausar, duración, bucle cuando proceda, estático/movimiento reducido y final fiel al maestro. No conviertas una animación decorativa en confirmación de resultado clínico.
- Incluye matriz de calidad con criterio, evidencia, resultado y pendiente. Señala problemas de diseño con la misma honestidad que fallos técnicos. Si usas una valoración cualitativa, explica el motivo; no trates tu propia puntuación como aprobación.
- Registra exactamente qué se comprobó, a qué tamaños, en qué navegador y con qué límites. No inventes pruebas en Safari, Firefox, dispositivos reales, apps de redes, impresión ni lectores de pantalla. Corrige los defectos que sí puedas verificar antes de entregar.

## 9. Límites y cierre de esta ronda

Solo datos sintéticos. Ningún paciente, médico o laboratorio real, exportación de clientes, credencial o informe operativo. Si necesitas captura de producto, usa un entorno/fixture sintético existente y lectura segura; si no lo hay, entrega una maqueta explícita en lugar de entrar a datos reales. Ilustraciones biomédicas decorativas no son evidencia diagnóstica: sin tinciones, aumentos, escalas o hallazgos inventados.

No copies afirmaciones heredadas de IA, laminillas digitalizadas, porcentajes, certificaciones o garantías sin evidencia. No confundas lo que se quiere desarrollar con lo publicado. La nueva marca de plataforma no reemplaza el membrete del laboratorio en un informe clínico.

Preserva archivos previos y cambios ajenos; revisa el estado del repositorio antes de trabajar. No hagas checkout que descarte cambios. Sin nuevas dependencias innecesarias. Sin alterar los experimentos 01–03, maestros, tokens o lienzos canónicos, frontend, landing ni docs de producto. Sin commit, push, PR, merge, tag, publicación ni despliegue.

Al terminar presenta: enlace de galería funcional, contacto visual comparativo, recomendación argumentada, archivos editables y descargas, verificación realizada, límites y decisiones concretas para Rafael. El experimento sigue en exploración/candidato hasta su aprobación explícita. No marques como aprobada ninguna pieza por iniciativa propia. Deja documentado qué quedaría listo para incorporar tras la aprobación y qué necesitaría una revisión adicional.

**Comienza ahora: confirma brevemente el alcance, revisa las fuentes y construye la primera ronda con este nivel de rigor.**
