# Contexto para Claude Code en `labs/`

Este directorio es el laboratorio visual de Céluma. Siga también `../AGENTS.md`, que define las reglas de aprobación, adopción y cuidado de marca. Lea `README.md`, `../README.md`, `../docs/estado-de-piezas.md`, `../docs/guia-de-publicaciones.md` y, para UI de producto, `../../celuma-frontend/CELUMA_DESIGN_SYSTEM.md`. Contraste las reglas de UI con el código vigente del frontend cuando un experimento dependa de ellas.

## Límites y flujo

- Trabaje en `labs/experiments/<nombre-corto>/`, partiendo de `_template`. Mantenga el experimento ejecutable con el servidor estático existente; no agregue dependencias ni modifique archivos fuera de `labs/` sin una solicitud explícita.
- Complete `BRIEF.md` con hipótesis, referencias, variantes, evidencia y estado. Mantenga visible el estado real de la pieza en la vista y las capturas.
- Cada experimento es autónomo y tiene su propia entrada en `labs/index.html`. Preserve enlaces a experimentos anteriores. No confunda una fase interna con un experimento nuevo; documente los enlaces entre ellos sin mover archivos a ciegas.
- Reutilice los tokens e isotipo existentes sin reinterpretarlos silenciosamente. No cambie tokens compartidos desde el laboratorio. Documente las variantes locales y deje claro si son fieles, adaptadas o candidatas.
- Use solo datos sintéticos. No use información clínica identificable, secretos, exportaciones de clientes ni afirmaciones no verificadas sobre capacidades o cumplimiento.
- Si muestra informes o etiquetas, identifíquelos como maquetas no operativas. Los informes del producto usan el membrete del laboratorio cliente y las etiquetas requieren especificación y pruebas físicas.

## Cómo registrar decisiones

- Separe exploración, dirección aprobada, incorporación al Brand System y adopción en producto o publicaciones. Registre quién decidió, cuándo, el alcance preciso, lo que queda pendiente y el siguiente paso en `DECISION.md` y `docs/estado-de-piezas.md`.
- La aprobación visual de Rafael puede cerrar una dirección del laboratorio. Los cambios que alteren flujos clínicos, comportamiento de producto o materiales operativos también requieren validación de la persona responsable de esa área.
- No presentes una comparación o una maqueta como regla vigente. Si una decisión posterior cambia el estado de una propuesta, actualiza los rótulos visibles y la documentación relacionada para que no se contradigan.
- Mantén el maestro fiel de un logo y cada adaptación cromática como archivos separados. Un cambio de color no debe alterar trazados, transforms, proporciones ni viewBox. Las decisiones de geometría y color se registran por separado.

## Acuerdos vigentes de Céluma

- **Experimento 01:** se cierra como exploración. Los chips V4 «Interno ≠ entregado» y las mejoras de contraste se rescatan para nuevas pruebas; no están aprobados para la app. El color no puede ser la única señal de un estado clínico y la decisión de revisión no se confunde con el estado del informe o la muestra. Registro: `experiments/1-frontend-refinement/DECISION.md`.
- **Experimento 02:** Rafael aprobó la geometría del maestro, el wordmark A · Baloo 2 800 y las direcciones de motion Mirada, Luz, Enfoque y Trazo. El 2026-09-27 aprobó la paleta del isotipo (membrana y trazos `#49B6AD`, citoplasma `#BBEAD2`, núcleo `#F98D84`, nucléolo `#E5635F`, rayos `#F1C46C`) y su aplicación a todas las piezas activas del experimento. La fuente activa es `experiments/2-logo-vector-v2/master/celuma-isotipo-maestro-paleta-aprobada.svg`; el maestro fiel `master/celuma-isotipo-maestro.svg` se conserva como evidencia histórica del ajuste. Es una aprobación en el laboratorio: la incorporación a tokens y assets canónicos sigue pendiente. Consulte `experiments/2-logo-vector-v2/DECISION.md`.
- **Experimento 03:** es una continuación independiente centrada en motion, con base en la identidad aprobada de 02. El encargo del 2026-09-27 (`experiments/3-logo-motion/PROMPT.md`) permite propuestas propias y variaciones de estilo moderadas; la identidad estática no cambia y en reposo todo vuelve al maestro y al lockup A. Primera ronda en exploración: Respira, Relevo, Brote, Atento, Orden y Rebote (`BRIEF.md`, `DECISION.md`). Las deformaciones temporales (Rebote) son candidatas del 03, no identidad.
- En pantallas de carga, el logo solo indica actividad. El texto comunica el estado real; incluya estado estático o movimiento reducido y evite que el bucle parezca progreso clínico.
- Aprobación en el laboratorio no autoriza publicación ni implementación. Las incorporaciones a assets/tokens canónicos y las actualizaciones de `celuma-frontend`, landing u otros repositorios son cambios separados, con las pruebas propias de cada destino.

## Revisión

Revise la vista en tamaños pertinentes, contraste, foco, lectura y movimiento antes de proponer una decisión. Registre lo comprobado y lo pendiente; no afirme haber probado impresos, navegadores o dispositivos si no se hizo. No haga commit, push, merge, tag, publicación ni despliegue salvo solicitud explícita de Rafael.
