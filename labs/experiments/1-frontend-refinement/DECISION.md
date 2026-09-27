# Decisión · Experimento 01 · refinamiento del frontend

**Resultado: cerrado como exploración, 2026-09-26, por Rafael.** No se incorpora aún al frontend ni al Brand System como patrón aprobado.

## Piezas que se rescatan para una siguiente iteración

- **Chips V4 · Interno ≠ entregado.** Se conserva la idea semántica de separar los estados internos (Aprobado, Lista, Cerrada) de los estados de entrega (Publicado, Liberada). La etiqueta textual debe seguir expresando el estado real; el color nunca es la única señal.
- **Mejoras de contraste** del prototipo: texto navy sobre teal, tinta teal accesible para enlaces/foco, contornos de campo y controles más visibles, y texto de chips comprobado. Son direcciones valiosas para evaluar en la app real, no un cambio de tokens canónicos aprobado.
- **Distinción entre decisión de revisión y estado del informe**, y «qué sigue», se mantienen como hallazgos de diseño, sujetos a revisión de producto y al contrato del ciclo clínico.

## Observaciones que impiden aprobarlo hoy

- V4 separa significados con color, pero en escala de grises la diferencia medida es pequeña (Δ de gris 13,7) y en la prueba simulada de deuteranopía también queda limitada. El cian se acerca al teal de acción y marca. Necesita otra señal de forma/icono y prueba con usuarios antes de aplicarse a estados clínicos.
- La recomendación técnica anterior V2+ tiene una señal de glifo más clara sin color, pero no resuelve por sí sola la separación cromática que interesa de V4. La siguiente ronda puede combinar principios; no se eligió una variante final.
- Falta revisar vocabulario («sin firmar»/«por firmar»), lectores de pantalla, monitores reales del laboratorio, flujo en React/Ant Design y los permisos y contratos involucrados. Ver `exploraciones/estados/DECISION.md` y `BRIEF.md`.

El prototipo y las mediciones quedan como archivo del laboratorio. Para retomar, comparar una revisión de V4 con señal no cromática frente a V2+ en tabla densa, móvil y tareas reales; después decidir con UI/UX, producto y personas del laboratorio.
