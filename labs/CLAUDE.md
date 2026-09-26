# Contexto para Claude Code en `labs/`

Este directorio es el laboratorio visual de Céluma. Lea `README.md`, `../README.md`, `../docs/estado-de-piezas.md`, `../docs/guia-de-publicaciones.md` y, para UI de producto, `../../celuma-frontend/CELUMA_DESIGN_SYSTEM.md` antes de diseñar. Contraste las reglas de UI con el código vigente del frontend cuando un experimento dependa de ellas.

- Trabaje en `labs/experiments/<nombre-corto>/`, partiendo de `_template`. Mantenga el experimento ejecutable con el servidor estático existente; no agregue dependencias ni modifique archivos fuera de `labs/` sin una solicitud explícita.
- Complete `BRIEF.md` con hipótesis, referencias, variantes, evidencia de revisión y estado. Mantenga visible «Exploración · no aprobada» en la vista y en las capturas.
- Reutilice los tokens e isotipo existentes sin reinterpretarlos silenciosamente. Documente cualquier variante local. No presente propuestas actuales como reglas aprobadas.
- Use solo datos sintéticos. No use información clínica identificable, secretos, exportaciones de clientes ni afirmaciones no verificadas sobre capacidades o cumplimiento.
- Si muestra informes o etiquetas, identifíquelos como maquetas no operativas. Los informes del producto usan el membrete del laboratorio cliente y las etiquetas requieren especificación y pruebas físicas.
- Revise la vista en tamaños pertinentes, contraste, foco, lectura y movimiento antes de proponer una decisión. Registre lo comprobado y lo pendiente. La aprobación de una pieza requiere una decisión explícita de Rafael y de la persona responsable del área.
- No haga commit, push, merge, tag, publicación ni despliegue salvo solicitud explícita de Rafael.
