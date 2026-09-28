# Laboratorio visual de Céluma

Espacio para prototipos de identidad, interfaz y comunicación. Aquí conviven exploraciones y decisiones aprobadas. Ver una pieza no equivale a aprobación; la decisión explícita se registra en cada experimento. Aprobación visual tampoco equivale a incorporación, publicación ni uso clínico.

## Abrir el entorno

Desde la raíz de `celuma-brand-system`, ejecute `python3 -m http.server 8000` y abra `http://localhost:8000/labs/`. No abra los HTML con `file://`: las rutas relativas y futuras cargas locales dependen del servidor. El lab funciona sin instalar dependencias ni modificar la entrada de los cuatro lienzos.

## Organización

- `index.html`: entrada del lab y acceso a la plantilla.
- `lab.css`: estilos exclusivos de la entrada.
- `experiments/_template/`: punto de partida para copiar en `experiments/<nombre-corto>/`.
- `experiments/1-frontend-refinement/`: experimento 01 (cerrado como exploración; se rescatan V4 y contraste en `DECISION.md`). `index.html` es el prototipo; `direcciones.html` compara A/B y `exploraciones/estados/` compara estados. Ábralo como carpeta (`/labs/experiments/1-frontend-refinement/`).
- `experiments/2-logo-vector-v2/`: experimento 02 (aprobado por Rafael; paleta del isotipo aprobada el 2026-09-27; ver `DECISION.md`). `index.html` reúne el maestro, la paleta y el mini sistema; `ejemplos.html` muestra aplicaciones; `animacion.html` revisa Mirada (fase 2); `fase-3/` compara Luz, Enfoque y Trazo. Las tres fases comparten un recorrido visible.
- `experiments/3-logo-motion/`: experimento 03 (exploración dedicada a motion), con la identidad y la paleta aprobadas de 02 como entrada y enlaces a las piezas de movimiento originales, ya regeneradas con esa paleta.
- Cada experimento mantiene su `BRIEF.md`, su vista previa y sus recursos dentro de su carpeta.

La carpeta `_template` no es una propuesta de diseño. Antes de explorar, copie la plantilla con un nombre descriptivo y complete el brief. Registre en la entrada del lab el enlace al experimento y su estado. No reutilice el nombre de un experimento para una dirección distinta.

## Revisión manual de navegación · 2026-09-26

- Entrada del lab: aparecen los experimentos 01, 02 y 03, con estados distintos y accesos a prototipo, maestro, comparación de color (retirada el 2026-09-27 al aprobarse la paleta) y motion.
- Recorridos del logo y de interfaz: enlaces locales comprobados; la fase o vista actual queda marcada. Revisión visual en ancho de 390 px y en escritorio, incluida la galería de fase 3.
- Los cuatro lienzos muestran acceso al laboratorio. No se cambió el contenido ni el estado de aprobación de las propuestas.
- Corrección del loader de fase 3: el selector muestra la variante elegida en tamaños reales y maquetas; se comprobaron Mirada, Lottie y Estático + texto. Las entradas directas a lab, maestro y fase 3 aceptan URLs sin barra final; los enlaces entre vistas apuntan a sus archivos HTML. Revisión visual en Chromium local.
- Revisión de Bienvenida y Material de fase 3: las cuatro direcciones cambian sus maquetas; se probó B vertical sobre navy, reproducción única, repetición manual, Intro/Outro al revés, pausa y movimiento reducido. Los enlaces directos a ambas secciones dejan el título visible a 390 y 1280 px, sin desbordamiento horizontal ni errores de página en Chromium local.

## Corrección de navegación · 2026-09-27

- La vista previa de Claude en `localhost:5050` redirige los HTML a direcciones sin extensión y elimina `index`. El script anterior añadía `/index.html` mediante otra navegación, causando un bucle en las entradas del lab y de los experimentos. Las comprobaciones HTTP del cierre no detectaban ese bucle de JavaScript.
- Las siete entradas `index.html`, incluida la plantilla, ahora normalizan la dirección de carpeta con `history.replaceState` antes de cargar los recursos relativos, sin otra petición. Conservan la consulta y el fragmento recibidos. El servidor 5050 puede descartar una consulta al redirigir un `index.html` explícito; para revisiones con parámetros, usar la dirección de carpeta.
- Revisado en el navegador integrado de Codex: laboratorio, lienzos, direcciones A/B, estados, prototipo 01, maestro 02, aplicaciones, Mirada, fase 3, experimento 03 y plantilla. Todas las vistas cargan sus tokens y las imágenes comprobadas; se siguieron enlaces reales desde el lab y al anclaje Color.
- Entradas directas, direcciones de carpeta sin barra final y anclajes comprobados tanto en `127.0.0.1:8765` como en `localhost:5050`. En fase 3, los controles Estático + texto y Luz · SVG + CSS cambian la selección y el contenido.
- Para futuras revisiones, comprobar la navegación en el navegador del servidor usado por Rafael; una respuesta HTTP 200 no demuestra que la página termine de navegar ni que las rutas de sus recursos sean correctas.

## Fuentes y límites

- Identidad y estados de aprobación: `../README.md`, `../docs/estado-de-piezas.md` y `../docs/guia-de-publicaciones.md`.
- Tokens de marca: `../styles/celuma-tokens.css`. No cambie los tokens compartidos desde un experimento; anote las variantes locales en su brief.
- UI del producto: `../../celuma-frontend/CELUMA_DESIGN_SYSTEM.md` y código vigente del frontend. El frontend conserva la implementación funcional y los contratos clínicos permanecen en `celuma-engineering`.
- `../assets/celuma-isotipo.png` sigue siendo la referencia canónica instalada. El maestro vectorial y Baloo 2 800 están aprobados en el experimento 02 pero esperan incorporación al sistema. `celuma-logo-v3.png` no es el logotipo vigente.
- Use únicamente datos e imágenes sintéticos. No incluya información clínica identificable, secretos, exportaciones de clientes ni afirmaciones de capacidades o cumplimiento sin verificar.
- Una ilustración biomédica decorativa no debe parecer imagen diagnóstica. Informes y etiquetas requieren validación de producto y pruebas operativas; el informe clínico pertenece visualmente al laboratorio cliente.

## Ciclo de trabajo

1. **Preparar:** definir hipótesis, superficie, restricciones y criterio de éxito en `BRIEF.md`.
2. **Explorar:** mantener código, estilos y recursos dentro del experimento; rotular la vista con su estado real.
3. **Revisar:** comparar con la referencia actual; comprobar tamaños previstos, móvil, contraste, foco de teclado y fondos claros/oscuros cuando correspondan. Registrar capturas y observaciones en el brief.
4. **Decidir:** anotar quién revisó, fecha y resultado: `exploración`, `candidata`, `aprobada` o `descartada`. `Candidata` tampoco autoriza publicación.
5. **Incorporar:** solo tras aprobación explícita, crear un cambio separado en los archivos canónicos y actualizar `docs/estado-de-piezas.md`. Si afecta la app, validar allí comportamiento, roles, accesibilidad y pruebas.

La galería no guarda decisiones por sí sola: el brief y la documentación de estado son el registro. No se hacen commits, publicaciones ni despliegues automáticamente desde este entorno.
