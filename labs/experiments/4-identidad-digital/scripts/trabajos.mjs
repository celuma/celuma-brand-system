// Céluma · Experimento 04 · Lista de exportaciones (qué pieza, en qué dirección y formato).
// Editar aquí para repetir formatos sin rehacer la composición.
export const DIRS = ['a', 'b', 'c'];

// Comparación: mismo contenido y mismos formatos en las tres direcciones.
export const COMPARACION = [
  ['valor-claridad', '4x5'], ['valor-claridad', '9x16'],
  ['capacidad-revisor', '4x5'], ['capacidad-revisor', '9x16'],
  ['carrusel-informe-1', '4x5'], ['carrusel-informe-4', '4x5'],
];

// Kit de la dirección recomendada (se completa tras la comparación).
export const RECOMENDADA = 'b';
const V = ['claridad', 'precision', 'seguridad', 'confianza', 'humanidad'];
const TODOS = ['1x1', '4x5', '9x16', '191x1', '16x9'];
export const KIT = [
  // Identidad y valores
  ...V.flatMap((v) => [[`valor-${v}`, '4x5'], [`valor-${v}`, '9x16']]), ['valor-claridad', '1x1'],
  ['valores-resumen', '4x5'], ['valores-resumen', '1x1'], ['valores-resumen', '9x16'],
  ['identidad-nombre', '4x5'], ['identidad-nombre', '9x16'], ['identidad-nombre', '16x9'],
  // Capacidad verificada
  ...TODOS.map((f) => ['capacidad-revisor', f]),
  ['capacidad-emitidos', '4x5'], ['capacidad-emitidos', '9x16'], ['capacidad-emitidos', '1x1'],
  // Consejo o guía
  ['consejo-revisor', '4x5'], ['consejo-revisor', '9x16'], ['consejo-revisor', '1x1'],
  ['consejo-muestra', '4x5'], ['consejo-muestra', '9x16'],
  // Novedad verificable e invitación
  ...TODOS.map((f) => ['novedad-131', f]),
  ...TODOS.map((f) => ['demo', f]),
  // Flujo
  ['flujo-informe', '4x5'], ['flujo-informe', '9x16'], ['flujo-informe', '16x9'], ['flujo-informe', '191x1'],
  // Carrusel completo (7 láminas, 4:5)
  ...[1, 2, 3, 4, 5, 6, 7].map((i) => [`carrusel-informe-${i}`, '4x5']),
  // Perfil, destacados, banner, firma y presentación
  ['avatar', 'avatar'], ['portada', 'portada'],
  ['destacado-guias', 'destacado'], ['destacado-novedades', 'destacado'], ['destacado-flujo', 'destacado'], ['destacado-valores', 'destacado'],
  ['banner-docs', 'banner'], ['firma-correo', 'firma'],
  ['slide-titulo', '16x9'], ['slide-contenido', '16x9'],
];

// Ronda 2 · grupo representativo (mismo texto y escala que la ronda 1, en ronda-2/antes/piezas).
export const RONDA2 = [
  ['valor-claridad', '4x5'], ['valor-claridad', '9x16'], ['identidad-nombre', '4x5'], ['capacidad-revisor', '4x5'], ['capacidad-revisor', '1x1'],
  ['carrusel-informe-1', '4x5'], ['carrusel-informe-4', '4x5'], ['carrusel-informe-7', '4x5'], ['novedad-131', '9x16'], ['slide-titulo', '16x9'],
];
