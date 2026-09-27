# Encargo para Claude Code · Experimento 01

Trabaja en `/Users/rafaelmagana/Céluma/celuma-brand-system`. Quiero un **experimento profundo de refinamiento visual y de interacción para la aplicación Céluma**, construido dentro de `labs/`, a partir de la UI que ya existe en `celuma-frontend` y de las propuestas del sistema de marca. Céluma es un SaaS para laboratorios de anatomía patológica; claridad clínica, trazabilidad y confianza tienen prioridad sobre el efecto visual. Busca una propuesta con calidad suficiente para que el equipo pueda decidir qué incorporar después a producción.

**Trabaja de forma autónoma hasta entregar una propuesta ejecutable, revisada y documentada. No te detengas tras la auditoría, un plan, wireframes o una sola captura.** Toma decisiones de diseño reversibles, registra sus motivos y continúa. Si una dependencia impide reproducir una pantalla, usa el código y las fixtures sintéticas disponibles, declara el límite y sigue con el resto del experimento.

## 1. Lee el contexto antes de diseñar

En `celuma-brand-system`, lee `AGENTS.md`, `README.md`, `labs/README.md`, `labs/CLAUDE.md`, `docs/estado-de-piezas.md`, `docs/guia-de-publicaciones.md`, `docs/revision-grafica-y-direccion-de-marca.md`, `diagnostico-alineacion-marca-frontend.md`, `styles/celuma-tokens.css` y los cuatro lienzos y componentes que sean relevantes. Examina los artboards de propuestas de fundamentos, componentes y publicaciones A/B/C. La guía de publicaciones aplica a comunicación; extrae de ella principios transferibles a producto sin copiar sus composiciones de marketing como si fueran pantallas de la app.

En el repositorio hermano `../celuma-frontend`, lee `AGENTS.md`, `CELUMA_DESIGN_SYSTEM.md` y el código vigente. La guía puede estar desactualizada: para comportamiento y valores actuales prevalecen la implementación y los contratos de producto. Inspecciona al menos `src/components/design/tokens.ts`, `src/components/ui/status_configs.tsx`, los componentes de botón, encabezado, tabla, campos, navegación y estados vacíos, y las pantallas que elijas para el prototipo. Revisa sus pruebas y fixtures visuales antes de usar capturas como referencia. Consulta `../celuma-engineering` solo para los contratos clínicos y de producto que afecten la propuesta, especialmente roles, ciclo de informe, identidad del laboratorio cliente y límites por tenant.

No interpretes «propuesta», «recomendada» o «verificada en uso» como «aprobada». Distingue explícitamente lo que está consolidado, lo que es una propuesta y lo que es una decisión pendiente. Conserva el isotipo vigente; `celuma-logo-v3.png` no es el logotipo aprobado. No inventes capacidades, cifras, clientes, cumplimiento normativo ni fotografías clínicas.

## 2. Define una dirección con evidencia

Haz una auditoría de las superficies reales: jerarquía, densidad, navegación, componentes, estados, accesibilidad, móvil, tono y consistencia con la marca. Obtén capturas de la app en tamaños de escritorio y móvil si el entorno lo permite; usa únicamente datos sintéticos. Prioriza hallazgos por impacto para el usuario y esfuerzo de adopción. Separa problemas de comprensión o seguridad clínica de preferencias estéticas.

Considera **todas** las propuestas del brand system mediante una matriz breve de «adoptar / adaptar / no aplicar ahora» con justificación. Incluye color por roles, tipografía, iconografía, voz, fichas de componentes, ilustración y direcciones de publicación. Explica las diferencias necesarias entre interfaz clínica, marca editorial, documentos del laboratorio y material promocional. Explora al menos dos direcciones visuales comparables en miniaturas o muestras de componentes; elige una para desarrollar y explica por qué. No conviertas el producto en una colección de efectos ni sacrifiques densidad útil.

## 3. Construye el experimento

La carpeta `labs/experiments/1-frontend-refinement/` ya contiene este encargo. Usa `labs/experiments/_template/` como base para crear ahí `BRIEF.md`, la vista previa y sus estilos, sin reemplazar `PROMPT.md` ni crear otra carpeta anidada. Crea una vista navegable y funcional que pueda abrirse desde el servidor estático del brand system. Mantén su CSS, JavaScript, capturas y recursos dentro de la carpeta del experimento; comparte solo los tokens e isotipo existentes mediante rutas relativas. No agregues dependencias solo para el prototipo. Enlaza el experimento desde `labs/index.html` con estado visible **«Exploración · no aprobada»**.

El prototipo debe mostrar un pequeño sistema coherente, no una pantalla aislada:

1. Una vista de **trabajo diario** con navegación, prioridades, búsqueda o filtros y estados legibles. Toma como referencia la pantalla real de inicio o worklist.
2. Una vista de **lista y detalle** para orden o muestra, con jerarquía de información, trazabilidad, acciones y estados relevantes. Toma como referencia los componentes y pantallas reales.
3. Una vista del **flujo de informe o revisión** que haga inequívoca la diferencia entre borrador, revisión, aprobación, firma y publicación según los contratos reales. Si algún estado no existe o no aplica en el código, usa su vocabulario correcto en vez de inventarlo.
4. Una pequeña **galería de componentes** con las reglas que conectan las tres vistas: botones, encabezados, campos, tabla o tarjetas, chips de estado, estados vacíos y feedback. Muestra estados normal, hover, foco, error, deshabilitado y carga cuando sean pertinentes.

Las vistas deben funcionar en escritorio y móvil. Implementa interacciones suficientes para evaluar navegación, filtros, pestañas o cambios de estado visual; no simules operaciones clínicas reales ni persistencia. Usa nombres y datos claramente ficticios. Mantén visible la marca de exploración en toda vista y captura. Una ilustración decorativa nunca debe parecer evidencia diagnóstica; los informes emitidos pertenecen visualmente al laboratorio cliente, no a Céluma.

Busca pulido de detalle: ritmo espacial, alineación, tipografía, microcopy, estados vacíos, densidad, foco, movimiento intencional y continuidad entre pantallas. Respeta `prefers-reduced-motion`. Si propones un cambio a los tokens compartidos, impleméntalo solo como variante local y documéntalo para revisión; no alteres el sistema canónico.

## 4. Itera y comprueba

Realiza al menos dos rondas de revisión visual después de la primera implementación. Compara la propuesta con capturas o referencias de la UI actual y registra qué mejoró, qué empeoró y qué cambiaste en cada ronda. Revisa al menos anchuras cercanas a 1440, 768 y 390 px, navegación con teclado, foco visible, orden de lectura, contraste de texto y controles, desbordamiento horizontal y errores de consola o recursos. Comprueba estados largos, vacíos y de error; diferencia estados clínicos con texto e icono además de color. Evita actualizar snapshots o pruebas del frontend, porque este trabajo permanece en el lab.

No afirmes accesibilidad o preparación para producción si no la comprobaste. Si una verificación automática no está disponible, haz revisión manual y deja constancia precisa. En `BRIEF.md` registra la hipótesis, referencias, variantes, decisiones, capturas, resultados, límites y estado final **«exploración»**; ninguna pieza queda aprobada por este encargo. Añade en la carpeta del experimento un `AUDIT.md` conciso con hallazgos priorizados, la matriz de propuestas y un mapa de adopción que indique qué archivos del frontend podrían cambiar en una fase posterior, sin modificarlos ahora.

## 5. Límites de ejecución y entrega

Puedes leer `celuma-frontend` y `celuma-engineering`, pero escribe solo dentro de `celuma-brand-system/labs/`. Preserva los cambios locales existentes. No modifiques los lienzos actuales, tokens compartidos, documentos clínicos ni el frontend. No hagas commit, push, merge, tag ni despliegue. No uses información de pacientes, informes reales, credenciales o exportaciones de clientes. Evita recursos externos sin origen y licencia documentados.

Al terminar, entrégame: enlace o ruta local de la vista, archivos creados, dirección elegida y alternativa descartada, cinco decisiones de diseño más importantes, validaciones realizadas con resultados concretos y riesgos pendientes. Incluye un orden sugerido para adoptar las mejoras en el frontend **solo después de nuestra revisión**. El resultado debe permitir evaluar visualmente el trabajo sin tener que leer primero todo el análisis.
