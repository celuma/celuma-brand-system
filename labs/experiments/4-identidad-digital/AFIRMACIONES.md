# Registro de afirmaciones · Experimento 04

Cada afirmación sobre el producto que aparece en una pieza tiene una fuente concreta y un estado. Las pendientes o contradictorias quedan fuera del material propuesto para uso externo. Fuente de datos: [`kit/contenido.js`](kit/contenido.js) (campo `fuentes` de cada pieza). Comprobado el 2026-10-06.

**Estados.** *Publicada en docs*: página presente en `docs.celuma.mx/sitemap.xml` (consultado el 2026-10-06) y contenido leído en `celuma-docs` (tag `v1.3.1`/`main`). *Código*: implementada en `celuma-frontend` (lectura), sin prueba en producción en esta ronda. *Valor de marca*: valor o descripción de identidad documentado, no una capacidad. *Demostrada en producto*: ninguna; no se ejecutó la aplicación en esta ronda.

**Ronda 2 (2026-10-06):** el refinamiento cambia fondos, ilustración y composición; **no añade ni modifica afirmaciones**. Los textos, fuentes y estados de esta tabla siguen vigentes, y la línea «Fuente ·» se retiró de la portada y el cierre del carrusel porque no afirman nada del producto.

**Cierre (2026-10-07):** Rafael aprobó B · Ficha ronda 2 en el laboratorio. Es una aprobación visual: **no convierte estas afirmaciones en material publicable ni cambia sus estados**. Antes de publicar una pieza, comprueba que su página fuente sigue publicada y dice lo mismo (las fuentes se leyeron el 2026-10-06), y confirma el canal de demostraciones. La tabla sigue siendo el registro vigente para la migración (`MIGRATION-PLAN.md`).

## En uso en el kit

| Afirmación (texto de la pieza) | Piezas | Fuente | Estado |
|---|---|---|---|
| Solo el revisor asignado aprueba y firma el informe; si no eres el revisor, aprobar y firmar no se muestran | capacidad-revisor, consejo-revisor, novedad-131, carrusel 4–5 | docs.celuma.mx/release-notes/v1-3-1 · `report_editor.tsx` y pruebas `block_a_reviewer_controls` | Publicada en docs · código |
| Administración no aprueba ni firma por el hecho de serlo | capacidad-revisor (tabla) | docs.celuma.mx/release-notes/v1-3-1 | Publicada en docs |
| Un informe aprobado y aún sin firmar puede reabrirse (revisor asignado o administración) y debe aprobarse de nuevo | novedad-131, carrusel 6 | docs.celuma.mx/release-notes/v1-3-1 · `report_editor.tsx:1956` | Publicada en docs · código |
| Revisor predeterminado del laboratorio | novedad-131 | docs.celuma.mx/release-notes/v1-3-1 | Publicada en docs |
| Céluma 1.3.1 se publicó el 14 de septiembre de 2026 | novedad-131 | docs.celuma.mx/release-notes/v1-3-1 | Publicada en docs |
| Al firmar se completa la fecha de entrega | carrusel 5 | docs.celuma.mx/release-notes/v1-3-1 | Publicada en docs |
| Si cambias una plantilla o un membrete, los informes emitidos se conservan como se generaron | capacidad-emitidos | docs.celuma.mx/release-notes/v1-3 | Publicada en docs |
| Guardar conserva el borrador sin cambiar su estado; enviar a revisión lo pasa a «En revisión» con comentario opcional; si el revisor pide cambios vuelve a «Borrador» | carrusel 2–4, flujo-informe | docs.celuma.mx/patologos/diagnosticos | Publicada en docs |
| Para registrar una muestra la orden ya debe existir; la crean recepción o administración | consejo-muestra | docs.celuma.mx/tecnicos/muestras | Publicada en docs |
| Céluma: sistema de gestión para laboratorios de anatomía patológica, de la recepción de la muestra al informe firmado | demo, portada, slide-titulo | docs.celuma.mx/intro | Publicada en docs |
| Funciones por rol (patólogo, revisor, técnico, recepción, administración); los permisos se suman | slide-contenido, carrusel 7 | docs.celuma.mx/intro · /roles/overview | Publicada en docs |
| Contacto `hola@celuma.mx` | demo | celuma.mx (pie «Contacto», `Footer.tsx:54`) | Publicado en el landing · **confirmar que atiende demostraciones antes de publicar** |
| Claridad, Precisión, Seguridad, Confianza, Humanidad y sus descripciones | valores | Notion · Propuesta de marca; celuma.mx | Valor de marca (Seguridad: redacción nueva, ver abajo) |
| Célula y luz: claridad, precisión y vida | identidad-nombre | Notion · ¿Por qué Céluma?; celuma.mx | Valor de marca (no resuelve lumen/Luminis) |

**Redacción nueva.** «Seguridad: cuidar la información sensible en cada paso del trabajo» sustituye a «protección de datos sensibles bajo estándares de salud» (Notion/landing), que sería una afirmación de cumplimiento sin evidencia. Requiere revisión editorial.

## Excluidas del material externo (registro interno)

| Afirmación | Dónde aparece | Motivo |
|---|---|---|
| «100 % trazabilidad», «trazabilidad total» | Landing (Hero), Notion | Absoluto sin evidencia |
| «Datos seguros y cifrados», «bajo estándares de salud» | Landing (Features, Values), Notion | Seguridad o cumplimiento sin evidencia publicada |
| IA, laminillas digitalizadas, visor 40×, «Patología digital» | Lienzos heredados | Capacidades no publicadas (D-8) |
| «Sin margen para errores», «garantizando validez», «sin contrato de largo plazo» | Landing | Promesas sin validar (M-09, D-13) |
| Patólogos suben y eliminan imágenes de muestras | docs v1.2 frente a docs Roles | Las dos páginas publicadas se contradicen |
| Certificaciones, NOM, ISO, sellos | — | Sin evidencia; no se dibujan insignias |
| Cifras de uso, clientes, testimonios, tarifas, descuentos, eventos o fechas futuras | — | No existen datos validados |

**Pendiente de producto (no bloquea el kit):** la app dice «reporte» y los docs «informe». El kit usa «informe», como la documentación pública.
