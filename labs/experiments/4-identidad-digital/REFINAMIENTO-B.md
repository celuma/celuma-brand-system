<!-- Copia íntegra del encargo de segunda ronda (Rafael, 2026-10-06). Fuente: deliverables/claude-experimento-04-refinamiento-b.md · SHA-256 5e0c804e9244a4b8… · 10 453 bytes. El texto que sigue no se modificó. -->

# Continuación para Claude · Experimento 04 · Refinar B y ampliar Microcosmos

Rafael pide continuar **en este mismo experimento y chat**. Su nueva instrucción es:

> Me gustaría rescatar los patrones y fondos, al menos este par, me agradan mucho. También trabajaría más en el diseño del microcosmos de Céluma para tener más componentes. Me gustaría seguir trabajando justo sobre este experimento: refinar la propuesta B teniendo estos detalles en mente.

La captura de referencia está conservada sin modificaciones en:
`/Users/rafaelmagana/.codex/.chatgpt-projects/g-p-680302f68c6c81919668522e2b9cb0b3/deliverables/referencias/experimento-04-fondos-cream-navy.png`.

Lee y mira la captura. Esto orienta una **segunda ronda de B · Ficha**, no una aprobación final de B, Inter, tintas, textos ni de todo el kit. No crees un experimento 05 ni una nueva conversación. Guarda este encargo como `REFINAMIENTO-B.md` dentro del 04 y conserva la trazabilidad de la primera ronda.

## 1. Qué rescatar con fidelidad

Los dos fondos que gustan a Rafael son **01 · Papel cream** y **02 · Navy** de la sección «06 · Patrones y fondos» del lienzo vigente. Sus fuentes reales están en:

- `celuma-brand-system/components/web-patterns.jsx`: `PatternCream` y `PatternNavy`.
- `celuma-brand-system/components/atoms.jsx`: `CelBlob`.
- `celuma-brand-system/styles/celuma-tokens.css`: crema `--celuma-bg: #FBF6EC`; navy profundo de ese fondo `--celuma-ink-3: #0A1520`.

Papel cream: superficie crema con una luz teal muy suave y difusa en el área superior izquierda, con mucho aire. Navy: superficie navy profunda con luz teal/menta suave arriba a la izquierda y otro halo discreto hacia la esquina inferior derecha. Conservar esa atmósfera y su sutileza, no solamente copiar los dos colores planos. Inspecciona el código y el render original para reproducir la referencia, sin reconstruirla a partir de la captura ni modificar los originales.

La advertencia inicial contra gradientes por inercia **no excluye estos fondos**: Rafael solicita ahora recuperarlos explícitamente. Los halos deben estar contenidos y cumplir una función de atmósfera; no son luces neón, sombras del logo ni efectos de vidrio. El rótulo heredado «reutilizables en impreso» no constituye validación de impresión: esta ronda es digital.

Usa versiones locales en el 04. Registra el navy profundo como superficie heredada rescatada, distinta del navy `#0D1B2A` de tinta/wordmark, sin cambiar los tokens compartidos ni la paleta del isotipo. Ofrece variantes suaves adaptadas por proporción y conserva las superficies planas para contenido que necesite máxima calma. Comprueba contraste contra las zonas más luminosas, no solo contra el color base. El logo mantiene zona de protección y fondo visualmente uniforme: halos, células y patrones fuera de su área.

## 2. Refinar B sin perder su base editorial

Mantén lo que funciona: orden de lectura, cabecera de serie, tipografía y alineaciones cuidadas, firma clara, módulo informativo y adaptación a contenido real. El objetivo es que B gane calidez, profundidad y reconocimiento de marca sin perder claridad ni convertirse en A · Lumen o C · Membrana.

No resuelvas esta iteración únicamente añadiendo fondos a los 61 archivos. Revisa el lenguaje completo: cuánto pesa cada regla, cómo se relaciona el borde salmón con el recurso gráfico, densidad, balance texto/imagen y ritmo entre piezas. No hace falta la misma cuadrícula ni la misma anatomía en toda publicación. Evita que las tablas y metadatos dominen mensajes institucionales; conserva su función en piezas de producto. No cambies aquí el tratamiento de fuentes o los textos como decisiones aprobadas: si mejoras su presentación, documenta la propuesta.

Define tres niveles coordinados dentro de B: **editorial sobrio** para contenido denso, **atmosférico** para identidad/valores y **microcosmos** para mensajes que admiten una ilustración protagonista. Son modos de B, no tres nuevas identidades. Muestra cuándo conviene cada uno y qué combinaciones recargan la pieza.

## 3. Microcosmos como vocabulario propio

Revisa `IllustCellGroup` («Microcosmos») en `components/web-patterns.jsx`, junto con `CelCellField`, `CelContour`, `CelDots` y `CelGrid` en `components/atoms.jsx`. Son fuentes de inspiración de lectura; sus pigmentos y composición antiguos no tienen precedencia sobre las decisiones del 02.

El brief de primera ronda criticó las burbujas aleatorias. Esa crítica no es una instrucción de Rafael para abandonar el microcosmos: ahora pide **desarrollarlo mejor y con más componentes**. Construye una gramática visual deliberada: familia de contornos celulares, proporciones, relación membrana/interior/foco, pesos de línea, capas, aire, agrupación y dirección de la luz. Afinidad con el logo aprobado, sin convertirlo en piezas recortadas ni generar logotipos alternativos.

Desarrolla aproximadamente **8–12 recursos útiles** y organizados en familias, con variaciones justificadas. Posibles recursos: células abstractas protagonistas y acompañantes; agrupaciones asimétricas; contornos/membranas abiertas; campos celulares de densidad baja/media; halos; conexiones sobrias entre grupos; recortes perimetrales; bandas o módulos para portadas; separadores y detalles de foco. Elige lo que produzca un vocabulario coherente: la cantidad no justifica recursos redundantes. Las conexiones y focos son metáforas gráficas, no nuevas funciones del producto ni pictogramas de estados clínicos.

Haz algo más rico que círculos dispuestos al azar: curvas, interior/foco desplazado con criterio, agrupaciones equilibradas y espacios reservados para texto. Los elementos celulares deben sentirse familiares y biomédicos sin volverse caricaturas, stickers ni micrografías realistas. Sin ojos/bocas, escalas, aumentos, tinciones, flechas de hallazgo o significados diagnósticos. No dibujes orgánulos con apariencia científica si solo cumplen un papel decorativo.

Cada recurso debe tener nombre, intención, reglas de escala/contraste/densidad, fondo compatible, área de exclusión para texto/firma y export SVG/PNG utilizable. Usa la paleta aprobada y tintes/alpha documentados. Ofrece versiones claras y oscuras donde aporten valor. Para campos generados, usa semillas reproducibles y controles útiles de densidad, escala y posición; evita que cambiar de formato ponga una célula encima de un titular. Mantén las ilustraciones diferenciadas del isotipo oficial.

## 4. Ronda visual y archivos reales

Primero preserva una hoja de contacto y la evidencia de B de la primera ronda, rotuladas como anteriores. No borres ni renombres entregables anteriores que estén enlazados; si regeneras exports activos, conserva una referencia suficiente de antes/después en una carpeta propia de esta iteración. No copies todo el kit sin necesidad.

Construye y revisa un grupo representativo de **6–8 composiciones** refinadas: identidad/valores, mensaje breve, capacidad publicada con contenido denso, portada e interior de carrusel, cierre navy y un banner o título de presentación. Comparación antes/después con el mismo texto y escala. Prioriza 4:5 y 9:16, incluye 1:1 y una prueba horizontal; adapta cada formato, no lo estires. Muestra los dos fondos solos y en contexto, y Microcosmos como recurso independiente y aplicado.

Después de esa revisión propia, extiende las reglas que funcionen al kit B sin pausar para pedir permiso intermedio. No fuerces ilustración donde la pieza pide solo información. Actualiza editor, galería, generadores, catálogo de recursos, manifest y paquetes de descarga afectados para que coincidan con lo que realmente entregas. Si introduces selección de fondo/recurso, deben funcionar tanto la vista como la exportación. Mantén A y C como antecedentes de primera ronda sin rediseñarlas.

Añade una sección clara **«Refinamiento B · Fondos y Microcosmos»** en la galería del 04, con acceso directo y recorrido existente: fondos → biblioteca → aplicaciones → antes/después → reglas/evidencia → archivos. No dupliques controles ni conviertas la galería en una interfaz innecesariamente compleja.

## 5. Calidad, validación y límites

Rafael sigue exigiendo alto rigor de diseño y fidelidad a **Claridad, Precisión, Seguridad, Confianza y Humanidad**. Cada recurso y composición debe reforzar esos valores de forma observable. Inspecciona renders, corrige fallos y explica el criterio artístico: qué aporta el fondo, qué función tiene la ilustración y por qué se usa ahí.

Comprueba lectura a 390 px de ancho, jerarquía, presupuesto de líneas, contraste sobre la composición final, áreas de protección, recursos fuera de texto/firma, recortes, nitidez y fidelidad entre preview y export. Valida los SVG con gradientes, transparencias o recortes reales; no declares autonomía o compatibilidad si faltan dependencias. Verifica editor, descargas, navegación real y reproducibilidad de recursos. Prueba largo/corto y claro/oscuro. No asumas que las pruebas de fondos planos siguen siendo suficientes.

Si una plantilla refinada participa en motion, actualiza sus estados estáticos/finales y comprobaciones, o identifica expresamente el vídeo anterior como primera ronda; no dejes exports actuales que se contradigan ni afirmes haber actualizado los vídeos sin generarlos.

Mantén `BRIEF.md`, `README.md`, `VALIDACION.md`, `DECISION.md`, `INCORPORACION.md` y manifest coherentes con la segunda ronda. En `DECISION.md` registra esta preferencia de Rafael: **refinar B, rescatar Papel cream/Navy y ampliar Microcosmos**. No la conviertas en aprobación de toda la dirección ni del experimento. Si actualizas el registro compartido, limita el cambio a la fila del 04.

Solo datos sintéticos y capacidades publicadas verificables. Logo/paleta/wordmark aprobados intactos. Sin modificar material canónico, originales de patrones, experimentos 01–03, frontend ni otros repositorios. Preserva cambios ajenos. Sin commit, push, PR, publicación o despliegue. La migración del Brand System sigue pendiente de una aprobación posterior.

**Continúa ahora en el mismo chat:** lee este encargo, mira la referencia, estudia los componentes originales y construye el refinamiento. Al cerrar entrega enlace directo, comparativa, biblioteca y aplicaciones, archivos utilizables, pruebas realizadas y decisiones pendientes.
