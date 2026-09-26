# Guía de publicaciones de Céluma

> **Estado:** borrador de trabajo (2026-09-25). Distingue **reglas verificadas**, **recomendaciones** y **decisiones pendientes**. Lo marcado como recomendación o propuesta puede cambiar cuando Rafael valide la dirección de marca. Documento de apoyo: [`revision-grafica-y-direccion-de-marca.md`](revision-grafica-y-direccion-de-marca.md).

## 1. Para qué sirve

Esta guía orienta a quien prepara publicaciones y material de comunicación de Céluma (redes, anuncios en la web, portadas de guías, banners, presentaciones breves). **No** cubre informes clínicos, etiquetas de laboratorio ni pantallas de la aplicación: tienen contratos propios.

Céluma es un SaaS de gestión para laboratorios de anatomía patológica. Lo usan personas de patología, técnica de laboratorio, asistencia y administración. La claridad del mensaje importa más que el efecto visual.

## 2. Semáforo: qué puedes usar hoy

| Elemento | Estado | Cómo usarlo |
|---|---|---|
| Isotipo `assets/celuma-isotipo.png` | ✅ **Verificado** | Es un recorte exacto del isotipo marcado como “Versión final” en Notion y el mismo archivo usado por la app y el landing. Úsalo tal cual. |
| Wordmark “Céluma” en Baloo 2 · 800 junto al isotipo | ✅ **Verificado en uso** | Es como aparece en la app, el landing y los docs. Existe una versión distinta en Notion (sans geométrica); **la decisión final está pendiente** (ver §8). |
| Fondo crema `#fbf6ec` y navy `#0d1b2a` | ✅ Verificado | Superficies principales. |
| Teal de identidad `#49b6ad` | ✅ Verificado | Rellenos, formas, ilustración. **Nunca texto blanco encima.** Texto encima: navy. |
| Teal de tinta `#1f7a75` | 🟡 Recomendación | Texto y enlaces teal sobre fondos claros. |
| Salmón `#F98D84` | 🟡 Recomendación | Solo reglas cortas o bordes de acento. Nunca texto. |
| Baloo 2 (títulos) + fuente del sistema (texto) | ✅ Verificado | Ver §4. |
| Dirección A “Lámina clara” | 🟡 Propuesta recomendada | Plantilla base para publicaciones. Lienzo *Material digital*, sección “Propuesta · Publicaciones A”. |
| Dirección B “Ficha de producto” | 🟡 Propuesta | Para guías paso a paso y novedades de producto. |
| Dirección C “Luz nocturna” | 🟠 Exploración | Solo eventos puntuales; no como plantilla diaria. |
| Artboards heredados de *Material digital* (firmas, hero, slides) | 🟠 Conceptos | Sirven de inspiración; **no** copiar textos ni cifras. |
| Papelería, informe de ejemplo y etiquetas | 🔴 No usar para publicaciones | Exploración visual de marca: no aprobada ni plantilla operativa. El informe es un ejemplo con datos ficticios y sin validez clínica. |
| `assets/celuma-logo-v3.png` | 🔴 No usar | Es otro dibujo, no es la versión final. |

## 3. Color

**Reglas verificadas (contraste WCAG calculado):**

- Navy sobre crema: 16,15:1. Texto principal.
- Navy sobre teal `#49b6ad`: 7,10:1. Única combinación de texto permitida sobre el teal de identidad.
- Blanco sobre teal `#49b6ad`: **2,45:1. Prohibido para texto.**
- Teal `#49b6ad` como texto sobre claro: 2,27–2,45:1. **Prohibido para texto.**
- `#7dd8d9` sobre navy: 10,52:1. Acento de texto en fondos oscuros.

**Recomendaciones:**

- Proporción orientativa por pieza: crema o navy ≈ 70 %, teal ≈ 20 %, salmón ≤ 5 %, el resto texto.
- Un solo acento de color por pieza además del teal.
- Los colores de estado de la app (azul, ámbar, verde, violeta, rosa, rojo) **no** son colores de marca: no los uses como decoración.

## 4. Tipografía

- **Títulos:** Baloo 2 · 800, interletrado −0,02 em.
- **Texto:** fuente del sistema (en diseño, usa la del sistema operativo; en Figma o Canva, una sans neutra equivalente hasta que se defina una oficial para piezas exportadas; ver §8).
- **Eyebrow:** mayúsculas, 600–700, interletrado 0,14 em, en teal de tinta.
- **Tamaños en publicaciones** *(recomendación verificada con pruebas)*. S = lado corto, W = ancho del formato:
  - eyebrow = el mayor entre S × 0,034 y W × 0,024;
  - título = el mayor entre S × 0,088 y W × 0,048;
  - texto = el mayor entre S × 0,044 y W × 0,029.

  En formatos cuadrados y verticales manda S (a 1080 px: título ≈ 95 px, texto ≈ 48 px). En horizontales manda W: así el texto sigue legible cuando la pieza se ve a unos 390 px de ancho en un teléfono.

## 5. Composición (Dirección A, recomendada)

1. **Área útil:** margen = S ÷ 12 en los cuatro lados (90 px a 1080 px). En **9:16**, además, deja libre el **14 % superior** y el **20 % inferior** (zonas que ocupan las interfaces de las apps): ahí no va texto ni logo.
2. **Orden de lectura:** eyebrow → título → texto → módulo visual → firma (dirección y logo).
3. **Módulo visual:** entre el **30 % y el 50 % del área útil**, con proporción entre **1:2 y 2:1**. Nunca una franja delgada.
4. **Composición por formato:**
   - **1:1 y 4:5, en L.** Texto arriba. Abajo, la firma a la izquierda (dirección y, debajo, el lockup) y el módulo a la derecha (62 % del ancho en 1:1, 60 % en 4:5).
   - **9:16, apilado.** Texto, módulo a todo el ancho y firma, dentro de las zonas seguras.
   - **1.91:1 y 16:9, en columnas.** Texto y firma a la izquierda, módulo a la derecha (42 % del ancho).
5. **Presupuesto de texto** (líneas de título / total título + texto):

   | 1:1 | 4:5 | 9:16 | 1.91:1 | 16:9 |
   |---|---|---|---|---|
   | ≤ 2 / ≤ 3 | ≤ 3 / ≤ 5 | ≤ 3 / ≤ 7 | ≤ 3 / ≤ 5 | ≤ 3 / ≤ 7 |

   Si el mensaje no cabe, escribe una **versión condensada** para ese formato y deja el texto completo en la descripción de la publicación. En las pruebas, un mensaje largo necesitó versión condensada en 1:1, 4:5 y 1.91:1, y uno medio solo en 1:1.
6. **Dirección (CTA):** corta, en una sola línea y en teal de tinta (p. ej. `docs.celuma.mx`).

Las reglas no dependen de una red social concreta: se definen por proporción. Evidencia: `docs/revision-grafica/capturas/36-propuesta-A-pruebas-contenido.jpg` (3 contenidos comprobados × 5 proporciones) y `34-propuesta-A-anatomia.jpg`. La medición automática está en `docs/revision-grafica/scripts/measure-a.mjs`.

## 6. Logotipo

- **Protección** *(recomendación)*: ½ de la altura del isotipo libre alrededor del lockup.
- **Tamaño mínimo** *(recomendación)*: isotipo de 20 px en pantalla. Por debajo, los rayos amarillos se pierden. En impreso: lockup de 12 mm de ancho mínimo (pendiente de prueba física).
- **Fondo:** liso (crema, blanco o navy). Nunca sobre el campo celular, fotografías con textura ni patrones.
- **No:** estirar, recolorear, rotar, añadir sombras, contornos ni efectos, recortar los rayos, ni separar el núcleo como elemento suelto.
- **Descriptor:** no uses “Patología digital” como subtítulo del logo hasta que se decida el descriptor oficial.

## 7. Imagen: fotografía, ilustración o patrón

| Recurso | Cuándo | Criterio |
|---|---|---|
| **Patrón** (puntos, trama) | Anuncios de texto, recordatorios y consejos breves | Opacidad baja, siempre dentro de un módulo delimitado. |
| **Ilustración** (campo celular, composiciones del isotipo) | Temas de marca, bienvenida y portadas de guía | Formas abstractas, sin escala ni tinción ni rótulos técnicos. |
| **Fotografía** | Personas y espacios reales, solo con consentimiento | Luz cálida y natural. Sin pacientes, sin muestras identificables y sin pantallas con datos. **No hay banco de fotos aprobado: decisión pendiente.** |
| **Captura de la app** | Solo para funciones publicadas | Solo datos ficticios, sin datos reales de laboratorios, pacientes ni médicos. Recorta a la zona relevante. |

**Regla clínica:** una ilustración decorativa **nunca** debe parecer evidencia diagnóstica. No añadas aumentos (“40×”), tinciones (“H&E”), escalas ni flechas de hallazgo a una ilustración.

## 8. Voz y contenido

- **Tratamiento:** tú, cálido y concreto (coherente con el landing, los docs y los correos).
- **Verbos claros:** “Registra”, “Consulta”, “Conoce”.
- **Nunca sin validación:** cifras, porcentajes (“100 %”), tiempos de respuesta, testimonios, nombres de clientes o instituciones, cumplimiento normativo (NOM, ISO, etc.), IA, digitalización de laminillas o cualquier capacidad no publicada en `docs.celuma.mx`.
- **Nombres de ejemplo:** usa nombres claramente ficticios (“Laboratorio Ejemplo”).
- **CTA:** en imágenes estáticas, el CTA es una dirección corta o una frase (“Lee la guía en docs.celuma.mx”). El botón en píldora (teal con texto navy) solo aparece en canales donde se puede hacer clic, como banners web.

## 9. Ejemplos correctos e incorrectos

Ver `docs/revision-grafica/capturas/35-usos-correctos-incorrectos.jpg`.

| ✅ Correcto | ✕ Incorrecto |
|---|---|
| Botón teal con texto navy | Botón teal con texto blanco |
| Ilustración rotulada como tal o sin rótulo | Ilustración con “40× · H&E” |
| Lockup con aire sobre fondo liso | Lockup estirado o sobre el campo celular |
| “Cómo registrar una muestra” + enlace a la guía | “100 % de trazabilidad garantizada” |
| Un acento salmón corto | Texto salmón pequeño |

## 10. Qué debe revisarse antes de publicar

Pasa a revisión (Rafael y quien responda por producto) cualquier pieza que:

1. Mencione una capacidad del producto, un número, un plazo, un cliente o una norma.
2. Use fotografía de personas o espacios reales.
3. Use la Dirección C, una variante nueva o un color fuera de §3.
4. Vaya a imprimirse.
5. Muestre capturas de la aplicación.

Lista de comprobación rápida: contraste (§3), márgenes y zonas (§5), logo (§6), imagen (§7), textos verificables (§8).

## 11. Archivos: qué tienes hoy y qué hará falta para descargas

**Disponible hoy:**

- `assets/celuma-isotipo.png` (PNG 697 × 777, transparente).
- Tokens de color en `styles/celuma-tokens.css`.
- Baloo 2 desde Google Fonts (licencia SIL Open Font License, a confirmar para redistribución en un paquete).
- Artboards de propuesta en el lienzo *Material digital* (se ven con un servidor local; ver `README.md`).

**Falta antes de ofrecer descargas** *(pendiente)*:

| Recurso | Formato | Notas |
|---|---|---|
| Isotipo maestro | SVG + PDF vectorial | Hoy solo hay PNG. |
| Lockup horizontal y vertical | SVG + PDF + PNG @1x/@2x | Depende de la decisión del wordmark. |
| Versiones monocroma y negativo | SVG | Para 1 tinta y fondos oscuros. |
| Paleta | ASE / JSON de tokens + tabla CMYK/Pantone | CMYK y Pantone por definir con imprenta. |
| Plantillas de publicación | Figma o formato editable acordado, 5 proporciones | A partir de la dirección aprobada. |
| Fuentes | Enlace oficial + licencia | Definir la sans de texto para piezas exportadas. |
| Ficha técnica por formato | Tabla: tamaño, margen, zonas, peso máximo | Incluida parcialmente en §5. |

**Nombres de archivo** *(recomendación)*: `celuma-{recurso}-{variante}-{color}.{ext}`, p. ej. `celuma-lockup-horizontal-navy.svg`, `celuma-isotipo-mono-negativo.svg`.
