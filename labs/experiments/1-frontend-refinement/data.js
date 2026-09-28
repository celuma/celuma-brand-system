// Datos sintéticos del experimento. Ningún nombre, código ni texto corresponde a
// personas, laboratorios o casos reales. Los valores de estado usan los enums
// reales del backend (OrderStatus, SampleState, ReportStatus, ReviewStatus).

export const TENANT = {
  name: 'Laboratorio Ejemplo de Patología',
  short: 'Laboratorio Ejemplo',
  branches: ['Sucursal Centro', 'Sucursal Norte'],
};

// Personas para el selector «Ver como». Los permisos siguen standards/rbac.md.
export const PERSONAS = {
  revisora: { id: 'u1', name: 'Revisora Ejemplo', initials: 'RE', roles: ['reviewer'], roleLabel: 'Revisora asignada' },
  patologa: { id: 'u2', name: 'Patóloga Ejemplo', initials: 'PE', roles: ['pathologist'], roleLabel: 'Patóloga · autora' },
  admin: { id: 'u4', name: 'Admin Ejemplo', initials: 'AE', roles: ['admin'], roleLabel: 'Administración' },
};

// ---------- Escala semántica de estados (propuesta D-4) ----------
// tone = significado transversal; icon = uno por estado; label = vocabulario
// del producto (en frase, como specs/laboratory/sample-status.md).
export const TONES = {
  nuevo:      { name: 'Nuevo',               ink: '#2563eb', bg: '#eff6ff' },
  encurso:    { name: 'En curso',            ink: '#a34a12', bg: '#fff4dc' },
  diagnostico:{ name: 'Autoría clínica',     ink: '#7c3aed', bg: '#f5f0ff' },
  revision:   { name: 'En revisión',         ink: '#c21862', bg: '#fff0f7' },
  completado: { name: 'Completado',          ink: '#047857', bg: '#ecfdf5' },
  cerrado:    { name: 'Cerrado',             ink: '#0c7189', bg: '#e4f9fb' },
  entregado:  { name: 'Entregado',           ink: '#075e47', bg: '#c7f0d8' },
  atencion:   { name: 'Requiere atención',   ink: '#c32929', bg: '#fff0f0' },
  neutro:     { name: 'Terminal neutro',     ink: '#4b5563', bg: '#f1f2f4' },
};

export const STATES = {
  order: {
    RECEIVED:   { label: 'Recibida',    tone: 'nuevo',       icon: 'inbox' },
    PROCESSING: { label: 'En proceso',  tone: 'encurso',     icon: 'progress' },
    DIAGNOSIS:  { label: 'Diagnóstico', tone: 'diagnostico', icon: 'clipboard-list' },
    REVIEW:     { label: 'Revisión',    tone: 'revision',    icon: 'eye' },
    CLOSED:     { label: 'Cerrada',     tone: 'cerrado',     icon: 'lock' },
    RELEASED:   { label: 'Liberada',    tone: 'entregado',   icon: 'send' },
    CANCELLED:  { label: 'Cancelada',   tone: 'neutro',      icon: 'slash-circle' },
  },
  sample: {
    RECEIVED:   { label: 'Recibida',     tone: 'nuevo',      icon: 'inbox' },
    PROCESSING: { label: 'En proceso',   tone: 'encurso',    icon: 'progress' },
    READY:      { label: 'Lista',        tone: 'completado', icon: 'check-circle' },
    DAMAGED:    { label: 'Insuficiente', tone: 'atencion',   icon: 'alert-triangle' },
    CANCELLED:  { label: 'Cancelada',    tone: 'neutro',     icon: 'slash-circle' },
  },
  report: {
    DRAFT:      { label: 'Borrador',    tone: 'encurso',    icon: 'pen' },
    IN_REVIEW:  { label: 'En revisión', tone: 'revision',   icon: 'eye' },
    APPROVED:   { label: 'Aprobado',    tone: 'completado', icon: 'check-circle' },
    PUBLISHED:  { label: 'Publicado',   tone: 'entregado',  icon: 'badge-check' },
    RETRACTED:  { label: 'Retractado',  tone: 'atencion',   icon: 'file-x' },
  },
  // Decisión del revisor (ReportReview.status). No es el estado del informe.
  review: {
    PENDING:  { label: 'Decisión pendiente',  tone: 'encurso',    icon: 'clock' },
    APPROVED: { label: 'Aprobó',              tone: 'completado', icon: 'check-circle' },
    REJECTED: { label: 'Cambios solicitados', tone: 'atencion',   icon: 'undo', current: 'Rechazado' },
  },
};

export const ORDER_STEPS = ['RECEIVED', 'PROCESSING', 'DIAGNOSIS', 'REVIEW', 'CLOSED', 'RELEASED'];
export const REPORT_STEPS = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED'];

export const SAMPLE_TYPES = { BIOPSIA: 'Biopsia', LAMINILLA: 'Laminilla', TEJIDO: 'Tejido', SANGRE: 'Sangre', OTRO: 'Otro' };

// Fecha de referencia fija para que las capturas sean reproducibles.
export const NOW = new Date('2026-09-25T17:00:00-06:00');
const h = (hours) => new Date(NOW.getTime() - hours * 3600e3).toISOString();

export const PATIENTS = {
  p10: { id: 'p10', name: 'Paciente Ejemplo Uno', code: 'PAC-EJ-0010', age: 52 },
  p11: { id: 'p11', name: 'Paciente Ejemplo Dos', code: 'PAC-EJ-0011', age: 37 },
  p12: { id: 'p12', name: 'Paciente Ficticio Tres', code: 'PAC-EJ-0012', age: 61 },
  p13: { id: 'p13', name: 'Paciente Demo Cuatro', code: 'PAC-EJ-0013', age: 46 },
  p14: { id: 'p14', name: 'Paciente Prueba Cinco', code: 'PAC-EJ-0014', age: 29 },
  p15: { id: 'p15', name: 'Paciente Modelo Seis', code: 'PAC-EJ-0015', age: 70 },
  p16: { id: 'p16', name: 'Paciente Ejemplo Siete', code: 'PAC-EJ-0016', age: 44 },
  p17: { id: 'p17', name: 'Paciente Ejemplo con Nombre Compuesto Muy Largo de Prueba', code: 'PAC-EJ-0017', age: 58 },
};

// Elementos de la lista de trabajo. item_status sigue a la API: en revisiones
// es la DECISIÓN (ReviewStatus); report_status es un dato que la API actual no
// envía en el ítem de revisión (dependencia marcada en AUDIT.md).
export const WORKLIST = [
  { id: 'w1', kind: 'review', type: 'report', code: 'ORD-EJ-0044', patient: 'p13', decision: 'PENDING', report_status: 'IN_REVIEW', at: h(26), labels: ['Urgente'], link: '#/informe' },
  { id: 'w2', kind: 'review', type: 'report', code: 'ORD-EJ-0051', patient: 'p10', decision: 'PENDING', report_status: 'IN_REVIEW', at: h(3), labels: [], link: '#/informe' },
  { id: 'w3', kind: 'review', type: 'report', code: 'ORD-EJ-0039', patient: 'p15', decision: 'APPROVED', report_status: 'APPROVED', at: h(50), labels: [], link: '#/informe' },
  { id: 'w4', kind: 'review', type: 'report', code: 'ORD-EJ-0048', patient: 'p16', decision: 'REJECTED', report_status: 'DRAFT', at: h(8), labels: [], link: '#/informe' },
  { id: 'w5', kind: 'assignment', type: 'sample', code: 'MUE-EJ-0112', order: 'ORD-EJ-0052', patient: 'p11', status: 'RECEIVED', at: h(0.6), labels: [], link: '#/ordenes/ORD-EJ-0052' },
  { id: 'w6', kind: 'assignment', type: 'sample', code: 'MUE-EJ-0102 · Fragmento de ejemplo con descripción extensa del lecho', order: 'ORD-EJ-0044', patient: 'p13', status: 'PROCESSING', at: h(5), labels: ['Urgente'], link: '#/ordenes/ORD-EJ-0044' },
  { id: 'w7', kind: 'assignment', type: 'sample', code: 'MUE-EJ-0099', order: 'ORD-EJ-0046', patient: 'p12', status: 'DAMAGED', at: h(47), labels: [], link: '#/ordenes/ORD-EJ-0046' },
  { id: 'w8', kind: 'assignment', type: 'order', code: 'ORD-EJ-0047', patient: 'p17', status: 'DIAGNOSIS', at: h(22), labels: ['Segunda opinión'], link: '#/ordenes/ORD-EJ-0047' },
  { id: 'w9', kind: 'assignment', type: 'report', code: 'ORD-EJ-0045', patient: 'p14', status: 'DRAFT', at: h(30), labels: [], link: '#/informe' },
  // Completadas (ocultas por defecto, pero con contador visible)
  { id: 'w10', kind: 'review', type: 'report', code: 'ORD-EJ-0031', patient: 'p14', decision: 'APPROVED', report_status: 'PUBLISHED', at: h(96), labels: [], link: '#/informe' },
  { id: 'w11', kind: 'assignment', type: 'sample', code: 'MUE-EJ-0090', order: 'ORD-EJ-0040', patient: 'p10', status: 'READY', at: h(80), labels: [], link: '#/ordenes/ORD-EJ-0040' },
  { id: 'w12', kind: 'assignment', type: 'order', code: 'ORD-EJ-0036', patient: 'p11', status: 'RELEASED', at: h(120), labels: [], link: '#/ordenes/ORD-EJ-0036' },
];

// Órdenes (lista y detalle). Solicitantes y sucursales ficticios.
export const ORDERS = [
  { code: 'ORD-EJ-0052', status: 'RECEIVED', patient: 'p11', physician: 'Dra. Solicitante Ejemplo', branch: 'Sucursal Centro', created: h(1), study: 'Biopsia', samples: [['MUE-EJ-0112', 'BIOPSIA', 'RECEIVED']], labels: [] },
  { code: 'ORD-EJ-0051', status: 'REVIEW', patient: 'p10', physician: 'Dr. Solicitante Prueba', branch: 'Sucursal Norte', created: h(30), study: 'Citología', samples: [['MUE-EJ-0110', 'LAMINILLA', 'READY']], labels: [], report: 'IN_REVIEW' },
  { code: 'ORD-EJ-0047', status: 'DIAGNOSIS', patient: 'p17', physician: 'Dra. Solicitante Ejemplo', branch: 'Sucursal Centro', created: h(40), study: 'Biopsia', samples: [['MUE-EJ-0105', 'TEJIDO', 'READY'], ['MUE-EJ-0106', 'LAMINILLA', 'READY']], labels: ['Segunda opinión'], report: 'DRAFT' },
  { code: 'ORD-EJ-0046', status: 'PROCESSING', patient: 'p12', physician: 'Dr. Solicitante Prueba', branch: 'Sucursal Centro', created: h(52), study: 'Biopsia', samples: [['MUE-EJ-0099', 'BIOPSIA', 'DAMAGED']], labels: [] },
  { code: 'ORD-EJ-0044', status: 'REVIEW', patient: 'p13', physician: 'Dra. Solicitante Ejemplo', branch: 'Sucursal Centro', created: h(74), study: 'Biopsia', samples: [['MUE-EJ-0101', 'BIOPSIA', 'READY'], ['MUE-EJ-0102 · Fragmento de ejemplo con descripción extensa del lecho', 'LAMINILLA', 'PROCESSING']], labels: ['Urgente'], report: 'IN_REVIEW', billedLock: true, invoice: true },
  { code: 'ORD-EJ-0040', status: 'CLOSED', patient: 'p10', physician: 'Dr. Solicitante Prueba', branch: 'Sucursal Norte', created: h(100), study: 'Biopsia', samples: [['MUE-EJ-0090', 'BIOPSIA', 'READY']], labels: [], report: 'APPROVED' },
  { code: 'ORD-EJ-0036', status: 'RELEASED', patient: 'p11', physician: 'Dra. Solicitante Ejemplo', branch: 'Sucursal Centro', created: h(160), study: 'Citología', samples: [['MUE-EJ-0081', 'LAMINILLA', 'READY']], labels: [], report: 'PUBLISHED', invoice: true },
  { code: 'ORD-EJ-0033', status: 'CANCELLED', patient: 'p16', physician: 'Dr. Solicitante Prueba', branch: 'Sucursal Norte', created: h(200), study: 'Biopsia', samples: [['MUE-EJ-0077', 'BIOPSIA', 'CANCELLED']], labels: [] },
];

// Línea de tiempo de ORD-EJ-0044 (eventos del enum EventType, texto traducido).
export const TIMELINE_0044 = [
  { at: h(74), type: 'ORDER_CREATED', actor: 'Asistente Ejemplo', text: 'Registró la orden', group: 'orden' },
  { at: h(74), type: 'REVIEWERS_ADDED', actor: 'Sistema', text: 'Asignó a Revisora Ejemplo como revisora (revisora predeterminada del laboratorio)', group: 'asignaciones' },
  { at: h(73), type: 'SAMPLE_RECEIVED', actor: 'Asistente Ejemplo', text: 'Recibió la muestra MUE-EJ-0101 (Biopsia)', group: 'muestras' },
  { at: h(72), type: 'SAMPLE_RECEIVED', actor: 'Asistente Ejemplo', text: 'Recibió la muestra MUE-EJ-0102 · Fragmento de ejemplo con descripción extensa del lecho (Laminilla)', group: 'muestras' },
  { at: h(70), type: 'ORDER_STATUS_CHANGED', actor: 'Técnica Ejemplo', text: 'Cambió el estado de la orden', from: 'RECEIVED', to: 'PROCESSING', group: 'estados' },
  { at: h(69), type: 'IMAGE_UPLOADED', actor: 'Técnica Ejemplo', text: 'Subió 3 imágenes a MUE-EJ-0101', group: 'muestras' },
  { at: h(52), type: 'SAMPLE_STATE_CHANGED', actor: 'Técnica Ejemplo', text: 'Cambió el estado de MUE-EJ-0101', sfrom: 'PROCESSING', sto: 'READY', group: 'muestras' },
  { at: h(50), type: 'ORDER_STATUS_CHANGED', actor: 'Técnica Ejemplo', text: 'Cambió el estado de la orden', from: 'PROCESSING', to: 'DIAGNOSIS', group: 'estados' },
  { at: h(30), type: 'REPORT_CREATED', actor: 'Patóloga Ejemplo', text: 'Creó el informe (versión 1)', group: 'informe' },
  { at: h(27), type: 'REPORT_SUBMITTED', actor: 'Patóloga Ejemplo', text: 'Envió el informe a revisión (versión 3)', group: 'informe' },
  { at: h(26), type: 'ORDER_STATUS_CHANGED', actor: 'Sistema', text: 'Cambió el estado de la orden', from: 'DIAGNOSIS', to: 'REVIEW', group: 'estados' },
];

export const CONVERSATION_0044 = [
  { who: 'Técnica Ejemplo', initials: 'TE', at: h(51), text: 'La muestra MUE-EJ-0102 sigue en proceso; las imágenes de MUE-EJ-0101 ya están cargadas.' },
  { who: 'Patóloga Ejemplo', initials: 'PE', at: h(28), text: 'Gracias. Envío el informe a revisión con la información disponible de MUE-EJ-0101.' },
  { who: 'Revisora Ejemplo', initials: 'RE', at: h(4), text: 'Recibido. Lo reviso hoy.', mine: true },
];

// Informe de ejemplo (texto deliberadamente genérico y marcado como ficticio).
export const REPORT_0044 = {
  order: 'ORD-EJ-0044',
  title: 'Estudio histopatológico de ejemplo',
  version: 3,
  author: 'Patóloga Ejemplo',
  reviewer: 'Revisora Ejemplo',
  created: h(30),
  submitted: h(27),
  decisionAt: h(2),
  signedAt: h(1),
  study: 'Biopsia',
  sections: [
    ['Información clínica', 'Texto de ejemplo para evaluar la maqueta. No describe un caso real.'],
    ['Descripción macroscópica', 'Fragmento de tejido de ejemplo. Medidas y características ficticias, escritas solo para ocupar el espacio del documento.'],
    ['Descripción microscópica', 'Párrafo de relleno con longitud similar a un informe breve. El contenido no tiene valor clínico.'],
    ['Diagnóstico', 'Diagnóstico de ejemplo · sin validez clínica.'],
  ],
};
