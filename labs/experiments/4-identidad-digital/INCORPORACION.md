# Plan de incorporación posterior · Experimento 04

**Este plan prepara la migración; no la ejecuta.** Solo aplica después de una aprobación explícita de Rafael registrada en [`DECISION.md`](DECISION.md), y cada fila es un cambio propio, con sus pruebas. Nada de lo siguiente se ha modificado en esta ronda.

## Mapa: material actual → candidato → dependencia → validación

| Material actual (canónico o en uso) | Candidato del 04 | Depende de | Validación necesaria |
|---|---|---|---|
| Lienzo *Material digital*, secciones «Propuesta · Publicaciones A/B/C» y pruebas de contenido (`components/proposals-publicaciones.jsx`, `canvases/digital.jsx`) | Sistema B · Ficha y sus 61 piezas (`kit/`, `exports/kit/`) | Decisión de dirección (pregunta 1) | Decidir si A/B/C del lienzo se retiran o quedan como antecedente; capturas antes/después; `measure-a.mjs` deja de ser la regla vigente o se adapta |
| `docs/guia-de-publicaciones.md` §3–§9 | Reglas de la galería §4 y `README.md` (escala, zonas, presupuesto, voz, usos) | Dirección + tipografía (D-12) + tintas | Reescritura revisada por Rafael; mantener la distinción verificado/recomendación |
| `styles/celuma-tokens.css` (roles de texto; `--celuma-fg-3` `#6b7280`) | Tintas `--e4-teal-profunda` `#17635F`, `--e4-tinta-2` `#3A4A5C`, `--e4-tinta-3` `#56657A`, `--e4-menta-suave`, tintes de luz | Pregunta 3 | Cambio de tokens propio; revisar los cuatro lienzos y su contraste; no tocar los colores de estado |
| Tipografía de texto «fuente del sistema» en piezas exportadas | Inter (OFL 1.1) | D-12 | Licencia confirmada; decidir carga (Google Fonts o archivos locales con OFL) y su efecto en lienzos; no cambia la app |
| Assets canónicos (`assets/celuma-isotipo.png`) | Lockups A y isotipo de 02 ya copiados en `kit/marca/` | Incorporación de 02 (pendiente, independiente) | Seguir el plan de 02; el 04 solo consume esos archivos |
| Recursos gráficos (no existen como assets) | `recursos/svg` y `recursos/png`: cuadrícula Orden, rastreador, regla salmón, 10 iconos | Dirección | Revisión de iconos con UI/UX (Laisha); equivalencias con Ant Design de la app (D-11) |
| Motion de comunicación (no existe) | `motion/intro-novedad`, `motion/paso-a-paso` y `motion/motion.js` | Pregunta 6; incorporación de 03 | Exportaciones finales por red (duración, peso, subtítulos si hubiera audio), Safari/Firefox para la versión HTML |
| Plantillas editables (no existen) | `kit/pieza.html`, `kit/editor.html`, `kit/contenido.js`, `scripts/` | Dirección | Decidir dónde viven (este repositorio, otro paquete o Figma/Canva en un encargo aparte) |
| Lienzo *Fundamentos* · «06 · Patrones y fondos» (`PatternCream`, `PatternNavy`, `CelBlob`) | Fondos locales del 04 (`kit/microcosmos.js` · `FONDOS`, `recursos/fondos/`) con variantes por proporción, suaves y planas | Aprobación de la ronda 2 | Decidir si los originales del lienzo adoptan los ajustes por proporción o si el 04 los consume tal cual; comparar render con `scripts/ronda2/fidelidad.py` |
| `--celuma-ink-3 #0A1520` (token existente, sin rol de superficie documentado) | Navy profundo como superficie de portadas y cierres, distinto de la tinta `#0D1B2A` | Pregunta de la ronda 2 | Cambio de tokens propio; contraste de tintas sobre navy profundo con halos (`validacion/contraste-real-kit.json`) |
| `IllustCellGroup`, `CelCellField` (lienzo) | Biblioteca Microcosmos (9 recursos, `recursos/microcosmos/`, `kit/microcosmos.js`) | Aprobación de la ronda 2 | Decidir si sustituye o convive con las ilustraciones del lienzo; revisión con UI/UX; sin significados diagnósticos |
| `docs/estado-de-piezas.md` | Fila del experimento 04 (exploración, ronda 2) | Esta ronda | Actualizar al estado aprobado/incorporado cuando ocurra |
| Material publicado (redes, landing, docs) | — | Aprobación + revisión por medio | Fuera de este repositorio; texto y fuente vigentes; prueba en la plataforma real |

## Qué quedaría listo tras la aprobación

- Sistema documentado (galería §4–§5), fondos rescatados y biblioteca Microcosmos con su catálogo, exports de muestra en cinco proporciones y auxiliares, PDF de distribución, recursos SVG/PNG, generadores reproducibles (`scripts/construir.sh`), editor y manifiesto.

## Qué necesita revisión adicional aunque se apruebe

- Especificaciones vigentes de cada plataforma (tamaños, zonas, pesos) consultadas en fuentes oficiales: aquí solo hay bases por proporción e hipótesis de zonas.
- Safari, Firefox, iOS, Android, apps de redes, lectores de pantalla e impresión: no probados.
- Canal de demostraciones y descriptor oficial (D-8).
- Revisión editorial de los textos y de la redacción nueva de «Seguridad».
- Coherencia «reporte/informe» con producto.
