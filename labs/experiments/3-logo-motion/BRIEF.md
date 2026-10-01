# Brief · Experimento 03 · Motion de Céluma

**Estado:** cerrado y aprobado por Rafael para el laboratorio visual el 2026-09-30. Las seis direcciones quedan aprobadas como resultado del experimento; incorporación y adopción siguen separadas. **Base aprobada:** experimento 02 (`../2-logo-vector-v2/DECISION.md`). Encargo completo y referencias: `PROMPT.md`. Archivos, formatos y validación: `README.md`. Registro de decisión: `DECISION.md`.

## Alcance actualizado (encargo de Rafael, 2026-09-27)

El brief anterior limitaba el 03 a comportamiento y usos de las cuatro direcciones de 02. El nuevo encargo abre la ronda: propuestas propias de movimiento, narrativa, ritmo, interacción, composición y usos, con **variaciones de estilo moderadas** cuando se justifiquen. La identidad estática aprobada no cambia:

- Geometría, paleta y lockup A salen del maestro activo `../2-logo-vector-v2/master/celuma-isotipo-maestro-paleta-aprobada.svg`, de `master/celuma-paleta-aprobada.json` y de `svg/lockups/propuesta-a-baloo2/`. El 03 los **lee**; no los modifica.
- Una deformación temporal (squash, estiramiento, inercia) o un tratamiento durante la animación es una **decisión de motion aprobada en 03** para los contextos descritos: no toca los masters ni crea otra identidad estática.
- **En reposo, cada pieza recupera exactamente** el vector, la paleta y el lockup aprobados (se comprueba renderizando, no se supone).
- Mirada, Luz, Enfoque y Trazo son antecedentes aprobados en 02; esta ronda no los retoca y los muestra para comparar.

## 1. Lo aprendido de la marca y del producto

### Precedencia de fuentes

1. **Decisiones de Rafael registradas en 02** (`DECISION.md`, 2026-09-26/27): maestro geométrico, wordmark A · Baloo 2 800, paleta del isotipo y direcciones de motion. Mandan sobre todo lo anterior.
2. **Reglas del repositorio** (`AGENTS.md`, `labs/CLAUDE.md`): cuatro estados distintos (explorado → aprobado → incorporado → adoptado); el logo de carga solo indica actividad; estado estático y reducido obligatorios.
3. **Documentos de marca del repo**: `guia-de-publicaciones.md` (reglas verificadas y recomendaciones) y `revision-grafica-y-direccion-de-marca.md` (propuestas y decisiones D-1…D-15 abiertas).
4. **Producto real**: código de `celuma-frontend` y `CELUMA_DESIGN_SYSTEM.md` (lectura).
5. **Lienzos**: lenguaje visual de referencia, útil sobre todo en color cuando coincide con 02. Los artboards heredados no están aprobados y varios rótulos son anteriores al vector.
6. **Notion** (leído el 2026-09-27 con la conexión de Notion, solo lectura): esencia, valores y origen del nombre. Su paleta (`#1FB8A6`, `#4A4A4A`, `#F87171`), su tipografía (Inter/Circular) y su wordmark geométrico son **históricos** y quedan superados por 02.

### Marca (Notion + repo)

- **Nombre:** célula + luz. «¿Por qué Céluma?» y el landing dicen *lumen*; «Propuesta de marca» dice *Luminis* (D-7 abierta). Coinciden en el sentido: **claridad, precisión y vida**.
- **Qué hace:** «ilumina y ordena el proceso patológico» (Propuesta de marca, §1 y §6). La Bienvenida describe el flujo completo: de la llegada de la muestra al informe firmado y cobrado.
- **Valores:** Claridad, Precisión, Seguridad, Confianza, Humanidad (coinciden Notion y landing).
- **Personalidad y estilo:** «profesional, biomédico y humano»; «modular, sobrio, con predominio de espacios en blanco». El logo se describe como «célula estilizada con **núcleo luminoso**».
- **Galería de logo (Notion):** dos entradas, «final» (V2) y «borrador». El tipo de recurso «Animación» existe en la base, pero no hay piezas de motion en Notion.
- **Lienzos:** crema domina y navy puntúa; campo celular (círculos teal/menta con núcleo salmón), puntos de «grano de papel», cuadrícula técnica, blobs suaves; regla salmón corta como firma; Baloo 2 800 con −0,02 em. Regla clínica: la ilustración nunca parece micrografía (sin aumentos, tinciones ni flechas).
- **Reglas del logo que afectan al motion:** fondo liso en reposo (nunca sobre campo celular ni textura), sin sombras ni efectos, mínimo 24 px en color, protección de ½ isotipo, nada de texto blanco sobre `#49b6ad`, no usar color sobre teal ni salmón.

### Producto (lectura de `celuma-frontend`)

- **Usuarios:** patología, técnica, recepción y administración, en jornadas largas y con datos sensibles. La claridad pesa más que el efecto.
- **Carga hoy:** `Spin` genérico de antd a pantalla completa mientras se verifica la sesión o el permiso (`auth/require_auth.tsx`, `require_permission.tsx`), en la vista previa del informe (`report/report_preview.tsx`, panel de ≥ 200 px) y en el editor de plantillas; `Skeleton` en la primera carga de notificaciones; botones con `loading` y texto real, p. ej. «Firmando y generando PDF oficial…» en `report_editor.tsx`.
- **Motion existente:** fundido de 150 ms y *pop* de 180 ms `ease-out` en `confirm_dialog`, aparición de 250 ms en `error_text`, FLIP con asentamiento en `celuma_sortable_list`. Es un vocabulario breve, suave y sin rebote.
- **Presencia de marca:** `AuthHeader` (cabecera blanca de 64 px, isotipo de 40 px + «Céluma» Baloo 24/800), `BrandHeader` (isotipo de 60 px), barra lateral teal con isotipo PNG, isotipo neutro de respaldo en el renderizador de informes.
- **Conflicto detectado (no se resuelve aquí):** la barra lateral pone el isotipo **a color sobre teal `#49b6ad`**, un fondo que la regla de 02 excluye para el color. Se registra como pendiente de producto; las maquetas del 03 no aterrizan el logo sobre teal.
- **Dónde el logo no debe moverse:** informes y PDF (el membrete es del laboratorio cliente), botones de acciones clínicas, estados y chips.

### Oportunidades concretas de motion

| Momento real | Hoy | Oportunidad |
|---|---|---|
| Verificar sesión o permiso (pantalla completa) | `Spin` genérico | Isotipo en bucle calmado ≥ 48 px + texto `role="status"` tras 400 ms |
| Arranque → acceso | Cambio seco | La firma se asienta en la cabecera mientras el contenido entra |
| Vista previa de informe (panel) | `Spin` | Isotipo 48–64 px + «Preparando vista previa…»; nunca sobre el documento |
| Operación larga (firmar y publicar) | Botón con texto | El texto informa; si hay capa bloqueante, bucle que se detiene tras 3 ciclos. Al terminar, ninguna animación de «hecho» |
| Primer acceso / invitación aceptada | Formulario | Bienvenida breve, una sola vez |
| Landing, docs, redes, presentaciones | Estático | Intro narrativa, interacción en el hero, piezas de celebración |

## 2. Principios de motion (propios de esta ronda)

1. **Reposo exacto.** Todo termina o descansa en el maestro o el lockup aprobados. Deformaciones y efectos solo en tránsito, rotulados como candidatos.
2. **La célula vive; la luz llega al final.** La célula se mueve como algo vivo (respira, crece, se asienta, tiene inercia). Los rayos son la última palabra: primero ordena, luego ilumina.
3. **Actividad, nunca progreso.** Bucles sin dirección, sin llenado y sin cierre celebratorio. El estado y el avance se leen en texto. En contextos clínicos el logo no confirma nada.
4. **Calma con precisión.** En producto, transiciones de 150–450 ms con `ease-out` sin rebote y amplitudes pequeñas; bucles de ≥ 3 s con reposo. En marca, hasta ~4,5 s y rebote con medida.
5. **Aire y un solo foco.** Un protagonista por momento. El reposo final siempre sobre fondo liso.
6. **Humanidad sin mascota.** Personalidad por peso, inercia y atención; nunca ojos, bocas ni gestos añadidos al dibujo.
7. **Color exacto.** Los pigmentos del logo no cambian de tono; sin brillos ni desenfoques. Se evita el amarillo a media opacidad sobre navy (se ve pardo, documentado en 02).
8. **Formato honesto y accesible.** SVG + CSS en producto (sin reproductor); Lottie cuando aporta, preferiblemente sin máscaras ni mates; vídeo para redes. Movimiento reducido = estático exacto. Pausa tras 3 ciclos o 5 s cuando convive con contenido (WCAG 2.2.2); nada parpadea más de 3 veces por segundo.

## 3. Direcciones de la primera ronda

Seis direcciones con usos y niveles de expresión distintos (1 = más sobria, 5 = más expresiva). Ficha completa en la galería y en `README.md`.

| Dirección | Expresión | Idea | Uso principal | Formato |
|---|---|---|---|---|
| **Respira** | 1 | El interior de la célula respira; la luz acompaña el aliento. Vida en espera, sin dirección | Carga breve y espera larga en producto | SVG + CSS (sin reproductor) y Lottie |
| **Relevo** | 1 | La marca es el ancla: se asienta en su lugar y el contenido entra | Arranque → acceso → inicio | Prototipo HTML/CSS/JS (FLIP); no es Lottie |
| **Brote** | 2 | Del núcleo luminoso nace la célula; la luz sale de ella; el nombre se asienta | Bienvenida, primer acceso, splash | Lottie sin máscaras ni mates y SVG + CSS |
| **Atento** | 3 | La célula presta atención a lo que haces: el nucléolo sigue el cursor o el foco, dentro del núcleo | Hero del landing; micro-hover de la marca | SVG en línea + JS (6,4 KB; 2,7 KB con gzip) |
| **Orden** | 4 | «Ilumina y ordena»: un campo de células se alinea, una se vuelve Céluma y se enciende | Intro de vídeo, presentaciones, hero de campaña | Lottie y vídeo MP4/WebM |
| **Rebote** | 5 | Llega con peso: cae, se aplasta, rebota; el nucléolo va con retraso; la luz asoma | Redes y celebraciones, sticker, cierre | Lottie, vídeo y GIF |

## 4. Criterios de uso que deja esta ronda

1. Cada dirección tiene contexto recomendado y límites en DECISION.md; el logo de carga no representa progreso y el texto informa el estado.
2. Bucles y movimiento reducido tienen reglas y estáticos por pieza en README.md y en los módulos del 03.
3. Los formatos web y de vídeo probados constan en README.md. Safari, Firefox, iOS y Android siguen sin probarse y se validan antes de adoptar.
4. Rebote y Atento están aprobados como motion del laboratorio en los contextos descritos; no crean otra identidad estática.

## 5. Evidencia y estado

Ver `README.md` (§Validación) para lo comprobado, a qué tamaños y fondos, y lo que queda sin comprobar. Estado: **cerrado y aprobado en el laboratorio** (Rafael, 2026-09-30); ninguna pieza está incorporada al sistema canónico ni adoptada en producto o publicaciones.
