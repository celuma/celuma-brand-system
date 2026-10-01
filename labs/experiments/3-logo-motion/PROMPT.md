# Encargo · Experimento 03 · Motion de Céluma

**Solicitante:** Rafael · **Fecha del encargo:** 2026-09-27 · **Conversación:** «Experimento 03 · Motion de Céluma».
Este archivo guarda el encargo y las referencias para que otro agente pueda continuar. El registro de lo hecho está en `BRIEF.md`, `README.md` y `DECISION.md`.

## Encargo (texto de Rafael, conservado)

> Quiero que trabajes en esta conversación nueva con contexto fresco. Esta es una solicitud de Rafael para crear e implementar propuestas de motion de Céluma, partiendo de todo lo aprendido en el experimento 02. La carpeta de trabajo es /Users/rafaelmagana/Céluma; el repositorio donde escribirás es celuma-brand-system, dentro de labs/experiments/3-logo-motion/.
>
> **INTENCIÓN.** Entiende primero la marca y el producto, y después crea propuestas propias de animación y de usos. Tienes libertad creativa para movimiento, narrativa, ritmo, interacción, composición y usos; también puedes explorar estilos con mesura. Quiero propuestas que se sientan Céluma y una galería funcional para revisarlas. No limites la ronda a retocar Mirada, Luz, Enfoque y Trazo: son antecedentes, no el techo creativo. No necesitas preguntar permiso para empezar ni para implementar esta exploración.
>
> **CONTEXTO DE MARCA Y ORDEN DE LECTURA.**
> 1. Lee celuma-brand-system/AGENTS.md, labs/CLAUDE.md, labs/README.md, docs/estado-de-piezas.md y docs/guia-de-publicaciones.md. El BRIEF actual del 03 era más restrictivo: actualízalo con este encargo, que permite creatividad y variaciones de estilo moderadas, manteniendo intacta la identidad estática aprobada. Guarda este encargo y las referencias en PROMPT.md para que el siguiente agente pueda continuar.
> 2. Notas de Notion: consulta en modo lectura las páginas de marca y los documentos relevantes enlazados desde ellas (Bienvenida a Céluma, Propuesta de marca, ¿Por qué Céluma?, Logotipo e isotipo (final), Galería de logo). La revisión local docs/revision-grafica-y-direccion-de-marca.md resume fuentes, valores y discrepancias históricas. Si no puedes acceder a una página, usa lo realmente disponible y declara el límite; no inventes que la leíste. La paleta y el wordmark históricos de Notion no sustituyen las decisiones posteriores de Rafael en 02.
> 3. Recorre el experimento 02 completo: DECISION.md, BRIEF.md, README.md, VALIDACION-CIERRE.md, maestro, aplicaciones, reglas de uso, fase 2 (Mirada) y fase 3 interna (Luz/Enfoque/Trazo, incluidos generadores, formatos y límites).
> 4. Revisa los cuatro lienzos actuales de celuma-brand-system (index.html, fuentes que los generan, styles/, componentes y ejemplos). Rafael toma buena parte de esos lienzos como referencia cuando es coherente con lo aprobado en 02, especialmente el color. Usa su lenguaje visual sin asumir que todo lo heredado está aprobado ni copiar rótulos obsoletos que aún digan que falta un vector.
> 5. Entiende celuma-frontend como producto (AGENTS.md, CELUMA_DESIGN_SYSTEM.md, README.md, estructura, pantallas, tokens, UI, estados, cabeceras, acceso, carga/espera y patrones). Identifica oportunidades concretas de motion a partir del uso real. El frontend es referencia de lectura; no implementes todavía cambios allí.
>
> **BASE APROBADA.** Maestro activo `labs/experiments/2-logo-vector-v2/master/celuma-isotipo-maestro-paleta-aprobada.svg`; paleta `master/celuma-paleta-aprobada.json`; isotipo `svg/isotipo/celuma-isotipo-color.svg` y familia reducida/monocroma bajo sus reglas; lockups principales `svg/lockups/propuesta-a-baloo2/` (wordmark A · Baloo 2 800; B es referencia histórica). Membrana y trazos #49B6AD; citoplasma #BBEAD2; núcleo #F98D84; nucléolo #E5635F; rayos #F1C46C; wordmark navy #0D1B2A o blanco en negativo. Superficies de apoyo: crema, blanco y navy. El maestro fiel histórico conserva los tonos medidos del PNG; citoplasma #7DD8D9 y rayos #F4BD5A se descartaron. Valores: claridad, precisión, seguridad, confianza y humanidad; célula + luz, cálida y profesional, biomédica, con aire (verificar matices en las fuentes).
>
> **LIBERTAD CREATIVA CON IDENTIDAD RECONOCIBLE.** Se admiten anticipación, personalidad, miradas, luz, ritmo, apariciones, transiciones, composición con tipografía, interacción con el entorno y metáforas de marca; estilos algo más expresivos para material de marca, con mesura y justificación. Una deformación temporal o un tratamiento visual durante la animación es una propuesta explícita del 03: no altera los masters ni se convierte en identidad aprobada. En reposo el logo recupera exactamente el vector, la paleta y el lockup aprobados. Distinguir app de laboratorio frente a intro, redes o material de marca. La paleta aprobada es el ancla; cualquier tratamiento adicional es candidato, no token compartido.
>
> **TRABAJO Y ENTREGABLES.** Resumen breve de marca y producto con fuentes y precedencia, y principios de motion propios; después implementar sin esperar aprobación intermedia. Primera ronda de unas 4–6 direcciones realmente distintas (alguna muy sobria para producto y alguna más narrativa para marca), animadas de verdad, con y sin wordmark donde tenga sentido; tamaños reales y usos (carga breve/larga, acceso o bienvenida, transiciones, material visual). Galería coherente y navegable dentro de 03 con controles de reproducción, repetición, velocidad, fondo, isotipo/lockup y movimiento reducido; comparación con 02 y regreso al laboratorio. Ficha por dirección (intención, contexto, duración, bucle o única, final, tamaño, formato, limitaciones). Archivos vectoriales editables, generadores reproducibles, SVG/CSS o Lottie según convenga, descargables y pósteres; no llamar Lottie a lo que solo existe en CSS. Estado estático y movimiento reducido en cada propuesta. Los loaders solo indican actividad; el texto comunica estado y progreso. Datos ficticios; nada que aparente un resultado clínico o una operación completada. El 03 queda en exploración: registrar evidencias, recomendaciones y pendientes en BRIEF/README/DECISION. No modificar masters, galerías, animaciones ni exports de 02; no migrar assets/tokens canónicos ni otros repos; sin commit, push ni publicación.
>
> **NAVEGACIÓN Y VALIDACIÓN.** El preview localhost:5050 elimina .html e index; las entradas normalizan carpetas con history.replaceState antes de cargar recursos relativos, conservando fragmento y consulta. No reponer el antiguo location.replace que añadía /index.html (bucle). Revisar con rutas de carpeta con barra final; también existe el servidor Python en 127.0.0.1:8765. Probar enlaces haciendo clic desde el laboratorio en el navegador de la vista previa; comprobar entrada directa con/sin barra, recursos, anclajes, controles, escritorio/móvil, estado reducido, final exacto, bucles sin salto y rendimiento a los tamaños de uso. Registrar lo probado y los límites reales.

## Referencias

| Fuente | Ruta o enlace | Qué aporta |
|---|---|---|
| Reglas del repositorio | `../../../AGENTS.md`, `../../CLAUDE.md`, `../../README.md` | Estados (exploración → aprobado → incorporado → adoptado), validación de navegación, límites |
| Estado de piezas | `../../../docs/estado-de-piezas.md` | Registro compartido del estado del 03 |
| Guía de publicaciones | `../../../docs/guia-de-publicaciones.md` | Color, tipografía, composición por proporción, zonas 9:16, reglas del logo, voz |
| Revisión gráfica | `../../../docs/revision-grafica-y-direccion-de-marca.md` | Fuentes, discrepancias (lumen/Luminis, paleta histórica), matriz marca↔producto |
| Experimento 02 | `../2-logo-vector-v2/DECISION.md`, `README.md`, `README-FASE2.md`, `fase-3/README-FASE3.md`, `VALIDACION-CIERRE.md` | Base aprobada, antecedentes de motion, método de validación y límites |
| Maestro y paleta | `../2-logo-vector-v2/master/celuma-isotipo-maestro-paleta-aprobada.svg`, `master/celuma-paleta-aprobada.json` | Única fuente de geometría y color |
| Lockups A | `../2-logo-vector-v2/svg/lockups/propuesta-a-baloo2/` | Composición exacta de la firma |
| Lienzos | `../../../index.html`, `canvases/*.jsx`, `components/*.jsx`, `styles/celuma-tokens.css` | Lenguaje visual: crema/navy, campo celular, puntos, cuadrícula, regla salmón, Baloo 2 |
| Producto | `celuma-frontend/CELUMA_DESIGN_SYSTEM.md`, `src/components/design/tokens.ts`, `src/components/auth/*`, `src/components/ui/*`, `src/pages/login.tsx`, `src/components/report/*` | Carga y espera reales, acceso, cabeceras, micro-motion existente |
| Notion (lectura) | [Bienvenida a Céluma](https://app.notion.com/p/36b2f320871b81a89ed7f61cb7e35ac7) · [Propuesta de marca](https://app.notion.com/p/2682f320871b80678bbce2a08bccbba4) · [¿Por qué Céluma?](https://app.notion.com/p/2502f320871b80caa093e1182fb0fbf3) · [Logotipo e isotipo (final)](https://app.notion.com/p/2592f320871b808692bbe96d67a9b3c4) · [Galería de logo](https://app.notion.com/p/36b2f320871b80268834d53a24aadba5) | Esencia, valores, posicionamiento, origen del nombre; archivos V2 |
| Referencias copiadas | `../../../docs/revision-grafica/referencias/notion/`, `../2-logo-vector-v2/referencias/notion/` | Isotipo, logotipo y banner V2 de Notion |

## Cómo continuar

1. Leer `BRIEF.md` (aprendizajes, principios, direcciones) y `README.md` (archivos, formatos, validación).
2. Abrir la galería por carpeta con barra final: `http://localhost:5050/labs/experiments/3-logo-motion/` o `http://127.0.0.1:8765/labs/experiments/3-logo-motion/`.
3. Regenerar con `scripts/` (ver `README.md` §Reproducir). No editar los archivos generados a mano.
4. Registrar la revisión de Rafael en `DECISION.md` y en `docs/estado-de-piezas.md` sin convertir la exploración en aprobación.
