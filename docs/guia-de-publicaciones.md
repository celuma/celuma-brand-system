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
| Papelería, reporte clínico y etiquetas | 🔴 No usar para publicaciones | Siguen en exploración y requieren revisión de producto. |
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

- **Títulos:** Baloo 2 · 800, interletrado −0,02 em, máximo 3 líneas.
- **Texto:** fuente del sistema (en diseño, usa la del sistema operativo; en Figma o Canva, una sans neutra equivalente hasta que se defina una oficial para piezas exportadas; ver §8), máximo 2 líneas en publicaciones.
- **Eyebrow:** mayúsculas, 600–700, interletrado 0,14 em, en teal de tinta.
- **Tamaños en publicaciones** (S = lado corto del formato): eyebrow S × 0,034; título S × 0,088; texto S × 0,044. A 1080 px: título ≈ 95 px, texto ≈ 48 px. *(Recomendación.)*

## 5. Composición (Dirección A, recomendada)

1. **Margen** = S ÷ 12 en los cuatro lados (90 px a 1080 px).
2. **Orden de lectura:** eyebrow → título → texto → módulo visual → firma (logo y dirección).
3. **Texto ≤ 45 %** del área útil; **módulo visual 30–50 %**.
4. **Firma** abajo: lockup a la izquierda y dirección corta (p. ej. `docs.celuma.mx`) a la derecha en teal de tinta.
5. **Formatos verticales 9:16:** deja libre el 14 % superior y el 20 % inferior (zonas que ocupan las interfaces de las apps). No pongas texto ni logo ahí.
6. **Horizontales (1.91:1 y 16:9):** texto a la izquierda y módulo visual a la derecha (proporción 1,35 : 1).

Las mismas reglas funcionan en 1:1, 4:5, 9:16, 1.91:1 y 16:9 porque todo deriva del lado corto; no dependen de una red social concreta. Ver `docs/revision-grafica/capturas/30-propuesta-A-formatos.jpg` y `34-propuesta-A-anatomia.jpg`.

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
