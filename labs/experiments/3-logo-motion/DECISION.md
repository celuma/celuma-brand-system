# Decisión · Experimento 03 · Motion de Céluma

**Estado: exploración, primera ronda (2026-09-27). Pendiente de la revisión de Rafael.** Nada de este experimento está aprobado, incorporado al Brand System ni adoptado en producto, landing, docs o redes. La base aprobada sigue siendo la del experimento 02 (`../2-logo-vector-v2/DECISION.md`), que esta ronda no modifica.

| Campo | Registro |
|---|---|
| Encargo | Rafael, 2026-09-27 (`PROMPT.md`) |
| Preparado por | Claude (asistente), por encargo de Rafael |
| Revisión | Pendiente: Rafael (marca). Para producto: la responsable de UI/UX y de producto (Laisha, según la página de Bienvenida de Notion) |
| Alcance | Seis direcciones de motion, galería, fichas, contextos con datos ficticios, generadores y validación en Chromium |
| Qué no cambia | Maestro, paleta y lockup A de 02; tokens y assets canónicos; `celuma-frontend`, landing y demás repositorios |

## Qué se entrega

| Dirección | Expresión | Uso propuesto | Formatos | Estado |
|---|---|---|---|---|
| Respira | 1 | Carga breve y espera larga en producto | SVG + CSS en línea, Lottie, estático, `js/respira.js` | Exploración |
| Relevo | 1 | Arranque → acceso → inicio | HTML/CSS/JS (FLIP), `js/relevo.js` | Exploración |
| Brote | 2 | Bienvenida del primer acceso, splash | Lottie sin máscaras, SVG + CSS, estático | Exploración |
| Atento | 3 | Hero del landing; micro-respuesta de la firma | SVG en línea + `js/atento.js` | Exploración |
| Orden | 4 | Intro de vídeo, presentaciones, campaña | Lottie, vídeo MP4/WebM, estático | Exploración |
| Rebote | 5 | Redes, celebraciones, sticker | Lottie, vídeo, GIF, estático | Exploración · deformación candidata |

## Recomendación del asistente (a validar; no es decisión)

| Contexto | Recomendación | Por qué | Alternativa |
|---|---|---|---|
| Carga en producto (sesión, permisos, vista previa) | **Respira**, SVG + CSS en línea, con las reglas de `js/respira.js` (400 ms de retardo, 600 ms mínimos, 3 ciclos, cierre sin «hecho» en 120 ms) | Vida sin dirección: no avanza ni se llena. La membrana no se mueve. No añade reproductor. Cierra sin salto | Luz (02), si se prefiere que la célula quede totalmente quieta |
| Arranque y acceso | **Relevo** | La firma se asienta y el contenido entra con el vocabulario que ya usa la app (150–480 ms, ease-out) | Corte seco actual |
| Bienvenida del primer acceso | **Brote** | Cuenta el «núcleo luminoso» de Notion; sin máscaras ni mates, más portable que Enfoque y Trazo | Enfoque (02) |
| Hero del landing | **Atento**, opcional | Humanidad por atención, no por gesto guionizado; el reposo es el maestro | Brote una vez, o estático |
| Intro de vídeo o presentación | **Orden** | Explica «ilumina y ordena» sin palabras y termina sobre fondo liso | Trazo (02), más corto |
| Redes y celebración | **Rebote**, con límites de tono | Personalidad y peso; la deformación solo existe en tránsito | Brote, para un tono más sobrio |

## Preguntas para Rafael

1. **Respira:** ¿el aliento del 3 % se lee a 48–64 px sin distraer? ¿Más profundo, más lento, o sin el acompañamiento de los rayos?
2. **Respira frente a Luz (02) para carga:** ¿célula viva o célula quieta con luz?
3. **Relevo:** ¿la firma debe acompañar al usuario del arranque a la cabecera? ¿Qué hacemos con el isotipo a color sobre la barra lateral teal, un fondo que excluye 02?
4. **Brote:** ¿la luz que sale de detrás de la membrana se lee como «luz» o como «antenas»? ¿El acento que brota al final aporta o sobra?
5. **Atento:** ¿la atención al puntero se siente cercana o invasiva? ¿Solo en el hero o también el modo micro en cabeceras?
6. **Orden:** ¿el campo celular recuerda al lienzo sin parecer micrografía? ¿4,4 s es aceptable para una intro?
7. **Rebote:** ¿el aplastado del 15 % cabe en la marca? ¿Solo para redes y stickers?
8. **Movimiento reducido:** ¿estático exacto (lo actual) en todas, o un fundido mínimo en Brote y Orden?

## Pendientes antes de pasar a «candidata» o «aprobada»

- Revisión visual de Rafael por dirección y contexto, con respuesta a las preguntas anteriores.
- Para cualquier uso en producto: validación con UI/UX y producto; pruebas en la app real con datos ficticios, lectores de pantalla y teclado.
- Compatibilidad fuera de Chromium: Safari/WebKit (el WebKit de Playwright falla en este equipo), Firefox, lottie-ios, lottie-android y dispositivos reales. Relevo y Atento dependen de Web Animations, de `getScreenCTM` y de las transformaciones de SVG.
- Redes: exportaciones finales (proporciones, pesos, subtítulos si hay texto, portada) y revisión del texto con producto. Los vídeos actuales son vistas previas o ejemplos.
- Conflicto de color de la barra lateral de la app (isotipo a color sobre teal): decisión de producto y marca, fuera de este experimento.
- Incorporación: si se aprueba alguna dirección, un cambio separado llevaría archivos y reglas al Brand System (`assets/`, `styles/`, documentación) y después, en otro cambio, a cada repositorio con sus pruebas.

## Lo que no se hizo

No se modificaron los archivos de 02 (maestros, galerías, animaciones ni exportaciones), ni los tokens y assets canónicos, `celuma-frontend`, landing, docs u otros repositorios. No hubo commit, push, merge, tag, publicación ni despliegue.
