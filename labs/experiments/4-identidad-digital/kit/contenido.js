// Céluma · Experimento 04 · Contenido de las piezas (kit B aprobado en el laboratorio el 2026-10-07).
// La aprobación visual no convierte estos textos en material publicable: cada afirmación
// conserva su fuente y estado, y se comprueba otra vez antes de publicar (AFIRMACIONES.md).
//
// CÓMO EDITAR: cambie solo los textos entre comillas. Cada pieza conserva sus
// fuentes. Si cambia una afirmación sobre el producto, actualice `fuentes` y
// `estado`; una afirmación sin fuente publicada no puede salir a uso externo.
// Después ejecute `node scripts/exportar.mjs` (ver README.md §Editar y exportar).
//
// Estados de una afirmación:
//   'publicada-docs'  → publicada en docs.celuma.mx (sitemap y repositorio comprobados el 2026-10-06)
//   'valor-marca'     → valor o descripción de marca documentado (Notion / landing), no es una capacidad
//   'redaccion-nueva' → texto nuevo de marca, sin afirmación de producto; requiere revisión editorial
//   'pendiente'       → no comprobada; NO se usa en piezas externas (solo registro interno)
//
// Datos: todo es sintético o procede de documentación pública. Sin pacientes,
// médicos ni laboratorios reales.
(function (root) {
  const F = {
    v131: { ref: 'docs.celuma.mx/release-notes/v1-3-1', repo: 'celuma-docs/docs/release-notes/v1-3-1.mdx (tag v1.3.1)', estado: 'publicada-docs' },
    v13: { ref: 'docs.celuma.mx/release-notes/v1-3', repo: 'celuma-docs/docs/release-notes/v1-3.mdx (tag v1.3.1)', estado: 'publicada-docs' },
    diag: { ref: 'docs.celuma.mx/patologos/diagnosticos', repo: 'celuma-docs/docs/patologos/diagnosticos.mdx', estado: 'publicada-docs' },
    roles: { ref: 'docs.celuma.mx/roles/overview', repo: 'celuma-docs/docs/roles/overview.mdx', estado: 'publicada-docs' },
    intro: { ref: 'docs.celuma.mx/intro', repo: 'celuma-docs/docs/intro.mdx', estado: 'publicada-docs' },
    muestras: { ref: 'docs.celuma.mx/tecnicos/muestras', repo: 'celuma-docs/docs/tecnicos/muestras.mdx', estado: 'publicada-docs' },
    valores: { ref: 'Notion · Propuesta de marca §4 (leída el 2026-10-06) y celuma.mx (Values.tsx)', repo: 'celuma-landing/src/components/Values.tsx', estado: 'valor-marca' },
    nombre: { ref: 'Notion · ¿Por qué Céluma? (leída el 2026-10-06) y celuma.mx (Values.tsx)', repo: 'celuma-landing/src/components/Values.tsx:91-93', estado: 'valor-marca' },
    contacto: { ref: 'celuma.mx · pie de página «Contacto»', repo: 'celuma-landing/src/components/Footer.tsx:54', estado: 'publicada-docs', nota: 'Confirmar que el buzón atiende solicitudes de demostración antes de publicar.' },
  };

  const VALORES = [
    { titulo: 'Claridad', silabas: 'cla·ri·dad', texto: 'Información visible, ordenada y accesible para quien la necesita.', fuentes: [F.valores] },
    { titulo: 'Precisión', silabas: 'pre·ci·sión', texto: 'Procesos médicos reflejados con rigor digital.', fuentes: [F.valores] },
    { titulo: 'Seguridad', silabas: 'se·gu·ri·dad', texto: 'Cuidar la información sensible en cada paso del trabajo.', fuentes: [F.valores], estadoTexto: 'redaccion-nueva', nota: 'Se evita «bajo estándares de salud» (Notion/landing): sería una afirmación de cumplimiento sin evidencia.' },
    { titulo: 'Confianza', silabas: 'con·fian·za', texto: 'Un sistema que respalda la práctica médica con transparencia.', fuentes: [F.valores] },
    { titulo: 'Humanidad', silabas: 'hu·ma·ni·dad', texto: 'Diseñado para apoyar a los profesionales, no para complicarles el trabajo.', fuentes: [F.valores] },
  ];

  const P = {};

  VALORES.forEach((v, i) => {
    P['valor-' + v.titulo.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')] = {
      plantilla: 'valor', grupo: 'Identidad y valores',
      eyebrow: 'Nuestros valores', serie: [i + 1, 5],
      titulo: v.titulo, silabas: v.silabas, texto: v.texto, cta: 'celuma.mx',
      fuentes: v.fuentes, estadoTexto: v.estadoTexto, nota: v.nota,
      alt: `Pieza de Céluma sobre el valor ${v.titulo}: «${v.texto}» Valor ${i + 1} de 5.`,
      caption: `${v.titulo}. ${v.texto} Es uno de los cinco valores que orientan cómo diseñamos Céluma.`,
    };
  });

  Object.assign(P, {
    'valores-resumen': {
      plantilla: 'valores', grupo: 'Identidad y valores',
      eyebrow: 'Valores de Céluma', eyebrowB: '', titulo: 'Lo que nos guía',
      lista: VALORES.map((v) => v.titulo), cta: 'celuma.mx', fuentes: [F.valores],
      alt: 'Pieza de Céluma con sus cinco valores: Claridad, Precisión, Seguridad, Confianza y Humanidad.',
      caption: 'Claridad, Precisión, Seguridad, Confianza y Humanidad: cinco valores para un laboratorio que trabaja con información sensible.',
    },
    'identidad-nombre': {
      plantilla: 'identidad', grupo: 'Identidad y valores',
      eyebrow: 'Por qué Céluma', titulo: 'Célula y luz', texto: 'Del nombre nace lo que buscamos: claridad, precisión y vida.',
      cta: 'celuma.mx', fuentes: [F.nombre], nota: 'No se resuelve lumen/Luminis (D-7): el texto dice «luz».',
      alt: 'Pieza de Céluma: «Célula y luz. Del nombre nace lo que buscamos: claridad, precisión y vida.»',
      caption: 'Céluma une célula y luz. De ahí vienen tres ideas que cuidamos: claridad, precisión y vida.',
    },
    'capacidad-revisor': {
      plantilla: 'capacidad', grupo: 'Capacidad verificada',
      eyebrow: 'Revisión y firma · versión 1.3.1', titulo: 'Solo el revisor asignado aprueba y firma el informe',
      tituloCorto: 'Solo el revisor asignado firma el informe',
      texto: 'Si no eres el revisor de esa orden, las acciones de aprobar y firmar no se muestran.',
      textoCorto: 'Aprobar y firmar solo aparecen para el revisor de la orden.',
      permisos: [['Revisor asignado', 'Aprueba y firma', true], ['Otro patólogo', 'No ve aprobar ni firmar', false], ['Administración', 'No aprueba ni firma por serlo', false]],
      permisosCortos: [['Revisor asignado', 'Aprueba y firma', true], ['Cualquier otro usuario', 'No ve aprobar ni firmar', false]],
      cta: 'docs.celuma.mx', fuentes: [F.v131, { ref: 'celuma-frontend · report_editor.tsx (controles del revisor) y pruebas block_a_reviewer_controls', estado: 'codigo', nota: 'Implementado en código; no se probó en producción en esta ronda.' }],
      alt: 'Pieza de Céluma: «Solo el revisor asignado aprueba y firma el informe.» Novedad de la versión 1.3.1.',
      caption: 'Desde la versión 1.3.1, solo el revisor asignado a la orden aprueba y firma el informe. Si no tienes ese rol en la orden, esas acciones no aparecen. Detalles en docs.celuma.mx.',
    },
    'capacidad-emitidos': {
      plantilla: 'capacidad', grupo: 'Capacidad verificada',
      eyebrow: 'Plantillas y membretes · versión 1.3', titulo: 'Actualiza la plantilla: lo ya emitido se conserva',
      tituloCorto: 'Lo ya emitido se conserva',
      texto: 'Si cambias una plantilla o un membrete, los informes emitidos quedan tal como se generaron.',
      textoCorto: 'Cambiar la plantilla no altera informes emitidos.',
      cta: 'docs.celuma.mx', fuentes: [F.v13],
      alt: 'Pieza de Céluma: «Actualiza la plantilla: lo ya emitido se conserva.»',
      caption: 'Cuando actualizas una plantilla o un membrete, los informes que ya emitiste se conservan como se generaron. Lo explicamos en las notas de la versión 1.3.',
    },
    'consejo-revisor': {
      plantilla: 'consejo', grupo: 'Consejo o guía',
      eyebrow: 'Consejo', eyebrowB: 'Revisión y firma', titulo: '¿Diagnosticas y también firmas?',
      texto: 'Pide que te asignen como revisor de la orden. Desde la versión 1.3.1, solo el revisor asignado aprueba y firma.',
      textoCorto: 'Pide que te asignen como revisor de la orden.',
      cta: 'docs.celuma.mx', fuentes: [F.v131],
      alt: 'Consejo de Céluma: si diagnosticas y también firmas, pide que te asignen como revisor de la orden.',
      caption: 'Si en tu laboratorio la misma persona diagnostica y firma, necesita el rol de revisor y estar asignada a la orden. Así lo indican las notas de la versión 1.3.1.',
    },
    'consejo-muestra': {
      plantilla: 'consejo', grupo: 'Consejo o guía',
      eyebrow: 'Guía de uso · técnicos', eyebrowB: 'Técnicos de laboratorio', titulo: 'Primero la orden, luego la muestra',
      texto: 'Para registrar una muestra, la orden ya debe existir. La crea recepción o administración.',
      textoCorto: 'La orden debe existir antes de la muestra.',
      cta: 'docs.celuma.mx', fuentes: [F.muestras],
      alt: 'Guía de Céluma: primero la orden, luego la muestra.',
      caption: 'Para registrar una muestra en Céluma, la orden debe existir. Las órdenes las crea el personal de recepción o de administración. Guía completa en docs.celuma.mx.',
    },
    'novedad-131': {
      plantilla: 'novedad', grupo: 'Novedad verificable',
      eyebrow: 'Novedades · 14 sep 2026', eyebrowB: '14 de septiembre de 2026', titulo: 'Céluma 1.3.1: revisión y firma de informes',
      tituloCorto: 'Céluma 1.3.1',
      puntos: ['Solo el revisor asignado aprueba y firma', 'Reabre un informe aprobado aún sin firmar', 'Revisor predeterminado del laboratorio'],
      puntosCortos: ['Firma del revisor asignado', 'Reabrir antes de firmar'],
      cta: 'docs.celuma.mx', fuentes: [F.v131],
      alt: 'Anuncio de Céluma 1.3.1, revisión y firma de informes: solo el revisor asignado aprueba y firma; se puede reabrir un informe aprobado aún sin firmar; revisor predeterminado del laboratorio.',
      caption: 'Céluma 1.3.1 (14 de septiembre de 2026) se centra en la revisión y firma de informes. Conoce los cambios en las notas de la versión en docs.celuma.mx.',
    },
    'demo': {
      plantilla: 'demo', grupo: 'Invitación a demostración',
      eyebrow: 'Demostración', eyebrowB: 'Para laboratorios de anatomía patológica', titulo: 'Conoce Céluma con tu equipo',
      texto: 'Te mostramos el flujo del laboratorio, desde la recepción de la muestra hasta el informe firmado.',
      textoCorto: 'De la recepción de la muestra al informe firmado.',
      cta: 'hola@celuma.mx', ctaEtiqueta: 'Escríbenos', fuentes: [F.intro, F.contacto],
      alt: 'Invitación de Céluma: «Conoce Céluma con tu equipo.» Escríbenos a hola@celuma.mx.',
      caption: '¿Quieres ver cómo Céluma acompaña el trabajo del laboratorio, de la recepción de la muestra al informe firmado? Escríbenos a hola@celuma.mx.',
    },
    'flujo-informe': {
      plantilla: 'flujo', grupo: 'Explicación de flujo',
      eyebrow: 'Flujo del informe', eyebrowB: 'Informes', titulo: 'Del borrador a la firma',
      pasos: ['Redacta', 'Envía a revisión', 'Revisa', 'Firma'],
      responsables: ['Patólogo', 'Patólogo', 'Revisor asignado', 'Revisor asignado'],
      texto: 'Cada paso tiene un responsable claro.',
      cta: 'docs.celuma.mx', fuentes: [F.diag, F.v131, F.roles],
      alt: 'Esquema de Céluma: del borrador a la firma en cuatro pasos: redacta, envía a revisión, revisa y firma.',
      caption: 'Un informe en Céluma avanza en cuatro pasos: redacta, envía a revisión, revisa y firma. Cada paso tiene un responsable. Guía completa en docs.celuma.mx.',
    },
  });

  // Carrusel completo · 7 láminas · mismo contenido para las tres direcciones.
  const CARRUSEL = {
    id: 'carrusel-informe', titulo: 'Del borrador al informe firmado', total: 7, fuentes: [F.diag, F.v131, F.roles],
    caption: 'Cómo avanza un informe en Céluma: redacta, envía a revisión, revisa y firma. Y qué hacer si un informe aprobado necesita una corrección antes de firmarse. Guía completa en docs.celuma.mx.',
    laminas: [
      { plantilla: 'carrusel-portada', eyebrow: 'Guía · flujo del informe', titulo: 'Del borrador al informe firmado', texto: 'Cómo avanza un informe en Céluma, paso a paso.', accion: 'Desliza', alt: 'Portada del carrusel: Del borrador al informe firmado.' },
      { plantilla: 'carrusel-paso', paso: 1, titulo: 'Redacta', texto: 'El patólogo escribe el informe en el editor. Guardar conserva el borrador sin cambiar su estado.', quien: 'Patólogo', fuentes: [F.diag], alt: 'Paso 1, Redacta: el patólogo escribe el informe; guardar conserva el borrador.' },
      { plantilla: 'carrusel-paso', paso: 2, titulo: 'Envía a revisión', texto: 'El informe pasa a En revisión. Puedes dejar un comentario con los cambios.', quien: 'Patólogo', fuentes: [F.diag], alt: 'Paso 2, Envía a revisión: el informe pasa a En revisión.' },
      { plantilla: 'carrusel-paso', paso: 3, titulo: 'Revisa', texto: 'El revisor asignado lo aprueba o solicita cambios. Si pide cambios, vuelve a Borrador.', quien: 'Revisor asignado', fuentes: [F.diag, F.v131], alt: 'Paso 3, Revisa: el revisor asignado aprueba o solicita cambios.' },
      { plantilla: 'carrusel-paso', paso: 4, titulo: 'Firma', texto: 'Solo el revisor asignado firma. Al firmar se completa la fecha de entrega.', quien: 'Revisor asignado', fuentes: [F.v131, F.roles], alt: 'Paso 4, Firma: solo el revisor asignado firma; se completa la fecha de entrega.' },
      { plantilla: 'carrusel-nota', eyebrow: '¿Y si hay que corregir?', titulo: 'Aprobado, pero aún sin firmar', texto: 'El revisor asignado o un administrador pueden reabrirlo. Después debe aprobarse de nuevo.', fuentes: [F.v131], alt: 'Nota: un informe aprobado y aún sin firmar puede reabrirse y debe aprobarse de nuevo.' },
      { plantilla: 'carrusel-cierre', titulo: 'Guía completa para cada rol', texto: 'Patólogos, revisores, técnicos y administración.', cta: 'docs.celuma.mx', fuentes: [F.roles], alt: 'Cierre: guía completa para cada rol en docs.celuma.mx.' },
    ],
  };
  CARRUSEL.laminas.forEach((l, i) => {
    P[`${CARRUSEL.id}-${i + 1}`] = Object.assign({ grupo: 'Carrusel', serie: [i + 1, CARRUSEL.total], carrusel: CARRUSEL.id, cta: l.cta || 'docs.celuma.mx', fuentes: l.fuentes || CARRUSEL.fuentes, caption: CARRUSEL.caption }, l);
  });

  // Piezas auxiliares del kit
  Object.assign(P, {
    'avatar': { plantilla: 'avatar', grupo: 'Perfil', alt: 'Isotipo de Céluma.', caption: '' },
    'portada': { plantilla: 'portada', grupo: 'Perfil', texto: 'Sistema de gestión para laboratorios de anatomía patológica', cta: 'celuma.mx', fuentes: [F.intro], alt: 'Portada de Céluma: sistema de gestión para laboratorios de anatomía patológica.', caption: '' },
    'destacado-guias': { plantilla: 'destacado', grupo: 'Destacados', titulo: 'Guías', icono: 'guia', alt: 'Destacado: Guías.' },
    'destacado-novedades': { plantilla: 'destacado', grupo: 'Destacados', titulo: 'Novedades', icono: 'novedad', alt: 'Destacado: Novedades.' },
    'destacado-flujo': { plantilla: 'destacado', grupo: 'Destacados', titulo: 'Flujo', icono: 'flujo', alt: 'Destacado: Flujo.' },
    'destacado-valores': { plantilla: 'destacado', grupo: 'Destacados', titulo: 'Valores', icono: 'valor', alt: 'Destacado: Valores.' },
    'banner-docs': { plantilla: 'banner', grupo: 'Banners y firma', eyebrow: 'Documentación', titulo: 'Guías para cada rol del laboratorio', cta: 'docs.celuma.mx', fuentes: [F.roles], alt: 'Banner: guías para cada rol del laboratorio en docs.celuma.mx.' },
    'firma-correo': { plantilla: 'firma', grupo: 'Banners y firma', nombre: 'Nombre Apellido', puesto: 'Puesto', correo: 'nombre@celuma.mx', cta: 'celuma.mx', alt: 'Firma de correo de Céluma (datos de ejemplo).', nota: 'Nombre, puesto y correo son marcadores de ejemplo.' },
    'slide-titulo': { plantilla: 'slide-titulo', grupo: 'Presentación', eyebrow: 'Presentación', titulo: 'Céluma para laboratorios de anatomía patológica', texto: 'De la recepción de la muestra al informe firmado.', fuentes: [F.intro], alt: 'Diapositiva de título de Céluma.' },
    'slide-contenido': { plantilla: 'slide-contenido', grupo: 'Presentación', eyebrow: 'Roles', titulo: 'Cada persona ve lo que le corresponde',
      filas: [['Patólogo', 'Redacta y envía informes a revisión'], ['Revisor', 'Aprueba y firma informes'], ['Técnico de laboratorio', 'Registra y procesa muestras'], ['Recepción', 'Registra pacientes y órdenes'], ['Administración', 'Usuarios, catálogos y configuración']],
      nota: 'Los permisos se suman cuando una persona tiene varios roles.', fuentes: [F.intro, F.roles], alt: 'Diapositiva: roles en Céluma.' },
  });

  // Registro interno: afirmaciones excluidas del material externo.
  const EXCLUIDAS = [
    { texto: '«100 % trazabilidad», «trazabilidad total»', origen: 'Landing (Hero.tsx) y Notion · Propuesta de marca', motivo: 'Absoluto sin evidencia.' },
    { texto: '«Datos seguros y cifrados», «bajo estándares de salud»', origen: 'Landing (Features.tsx, Values.tsx), Notion', motivo: 'Afirmación de seguridad o cumplimiento sin evidencia publicada.' },
    { texto: 'IA, laminillas digitalizadas, visor 40×, «Patología digital»', origen: 'Lienzos heredados', motivo: 'Capacidades no publicadas (D-8 abierta).' },
    { texto: '«Sin margen para errores», «garantizando validez», «sin contrato de largo plazo»', origen: 'Landing', motivo: 'Promesas comerciales o clínicas sin validar (M-09/D-13).' },
    { texto: 'Patólogos suben y eliminan imágenes de muestras', origen: 'docs v1.2 frente a docs/roles (contradicción)', motivo: 'Las dos páginas publicadas no coinciden; pendiente de producto.' },
    { texto: 'Certificaciones, NOM, ISO, sellos', origen: '—', motivo: 'No hay evidencia; no se dibujan insignias.' },
    { texto: 'Cifras de uso, clientes, testimonios, tarifas o descuentos', origen: '—', motivo: 'No existen datos validados.' },
  ];

  root.E4C = { PIEZAS: P, CARRUSEL, VALORES, FUENTES: F, EXCLUIDAS };
})(typeof window !== 'undefined' ? window : globalThis);
