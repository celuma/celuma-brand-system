/* Céluma · experimento 03 · Relevo — la marca es el ancla; el contenido se mueve (aprobado en laboratorio).
 *
 * Coreografía FLIP con Web Animations: la firma pasa de su posición de arranque a su lugar en la cabecera
 * (solo traslación y escala uniforme del lockup estático exacto), mientras el contenido entra con desplazamientos
 * cortos y ease-out, el mismo vocabulario que ya usa la app (confirm_dialog: 150–180 ms).
 * Con prefers-reduced-motion (o reduced: true) no hay desplazamientos: fundidos de 120 ms.
 *
 * Uso:  CelumaRelevo.move(lockupEl, applyFinalLayout, { duration: 480 })  → Promise
 *       CelumaRelevo.enter(elements, { stagger: 40 })                  → Promise
 *       CelumaRelevo.leave(elements)                                    → Promise
 * Sin dependencias.
 */
(function (global) {
  'use strict';
  var EASE = 'cubic-bezier(.2,0,0,1)';          // desaceleración calmada, sin rebote (OUT del generador)
  function reduced(o) {
    return (o && o.reduced) || (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* FLIP: mide, aplica el diseño final con `apply()`, y anima desde la posición anterior. */
  function move(el, apply, o) {
    o = o || {};
    var first = el.getBoundingClientRect();
    apply();
    var last = el.getBoundingClientRect();
    if (reduced(o)) {
      return el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: 'linear' }).finished;
    }
    var s = first.height / last.height;
    var dx = first.left - last.left, dy = first.top - last.top;
    var a = el.animate([
      { transformOrigin: '0 0', transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' },
      { transformOrigin: '0 0', transform: 'translate(0,0) scale(1)' }
    ], { duration: o.duration || 480, easing: o.easing || EASE, delay: o.delay || 0, fill: 'backwards' });
    return a.finished.then(function () { a.cancel(); });   // en reposo no queda ninguna transformación
  }

  function enter(els, o) {
    o = o || {};
    var red = reduced(o);
    return Promise.all([].map.call(els, function (el, i) {
      var kf = red ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ opacity: 0, transform: 'translateY(' + (o.dy == null ? 12 : o.dy) + 'px)' }, { opacity: 1, transform: 'none' }];
      var a = el.animate(kf, { duration: red ? 120 : (o.duration || 360), delay: (o.delay || 0) + (red ? 0 : i * (o.stagger || 40)),
        easing: EASE, fill: 'backwards' });
      return a.finished;
    }));
  }

  function leave(els, o) {
    o = o || {};
    var red = reduced(o);
    return Promise.all([].map.call(els, function (el) {
      var kf = red ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px)' }];
      return el.animate(kf, { duration: red ? 100 : (o.duration || 160), easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' }).finished;
    }));
  }

  global.CelumaRelevo = { move: move, enter: enter, leave: leave, EASE: EASE };
})(window);
