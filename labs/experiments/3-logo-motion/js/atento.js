/* Céluma · experimento 03 · Atento — exploración, no aprobada.
 *
 * La célula presta atención: el nucléolo mira hacia el puntero o hacia el elemento con foco, siempre dentro del
 * núcleo; cuando algo se acerca, los rayos se alargan un poco. Sin actividad vuelve a la mirada del maestro
 * (arriba a la derecha, hacia la luz) y se retiran todas las transformaciones: el reposo es el SVG exacto.
 *
 * Uso:  const c = CelumaAtento.attach(svgElement, { mode: 'full' | 'micro', focusScope: document, trigger: el });
 *       c.lookAt(clientX, clientY); c.rest(); c.destroy();
 * El SVG debe ser el isotipo (o un lockup) de 02 en línea, con los ids del maestro (#nucleolo, #rayo-1..3).
 * Con prefers-reduced-motion: reduce no se instala ningún oyente y el logo queda estático.
 * Sin dependencias. 6,4 KB sin minificar (2,7 KB con gzip).
 */
(function (global) {
  'use strict';
  var NUCLEO = [388.36, 403.81];          // centro del núcleo (unidades del maestro)
  var REST = [35.41, -39.01];             // nucléolo en el maestro, relativo al núcleo (|r| = 52,7)
  var LOOK_R = 54;                        // radio de mirada; el límite seguro es 70 (margen ≥ 8 u al borde)
  var RAYS = {                            // base y eje unitario de cada rayo (cápsulas de fit-report.json de 02)
    'rayo-1': [169.16, 237.71, -0.8775, -0.4796],
    'rayo-2': [244.47, 158.95, -0.5979, -0.8016],
    'rayo-3': [357.66, 135.96, -0.0039, -1.0]
  };
  var IDLE_MS = 1600;

  function attach(svg, opts) {
    opts = opts || {};
    var mode = opts.mode || 'full';
    var q = function (id) { return svg.querySelector('[id="' + id + '"]'); };
    var nucleolo = q('nucleolo');
    var rays = Object.keys(RAYS).map(function (k) { return { el: q(k), ax: RAYS[k] }; });
    var reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)');
    // estado del resorte (amortiguamiento crítico): desplazamiento del nucléolo y alargamiento de rayos
    var pos = [0, 0], vel = [0, 0], target = [0, 0];
    var ext = 1, extV = 0, extT = 1;
    var raf = 0, last = 0, idleTimer = 0, listeners = [];

    function on(t, ev, fn, o) { t.addEventListener(ev, fn, o); listeners.push([t, ev, fn, o]); }

    function toUser(x, y) {
      var m = svg.getScreenCTM();
      if (!m) return null;
      var p = svg.createSVGPoint(); p.x = x; p.y = y;
      return p.matrixTransform(m.inverse());
    }

    function setTarget(dx, dy, near) {
      target = [dx, dy]; extT = near;
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
    }

    function lookAt(x, y) {
      var p = toUser(x, y);
      if (!p) return;
      var vx = p.x - NUCLEO[0], vy = p.y - NUCLEO[1];
      var d = Math.hypot(vx, vy);
      if (mode === 'full' && d > 1) {
        var k = LOOK_R / d;
        setTarget(vx * k - REST[0], vy * k - REST[1], d < 900 ? 1 + 0.06 * (1 - d / 900) : 1);
      } else {
        setTarget(0, 0, d < 900 ? 1.06 : 1);
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(rest, IDLE_MS);
    }

    function rest() { clearTimeout(idleTimer); setTarget(0, 0, 1); }

    function step(t) {
      var dt = Math.min(0.05, (t - last) / 1000); last = t;
      var w = 11, w2 = 16;                                  // rigidez: ~0,4 s y ~0,25 s hasta asentarse
      for (var i = 0; i < 2; i++) {
        var a = w * w * (target[i] - pos[i]) - 2 * w * vel[i];
        vel[i] += a * dt; pos[i] += vel[i] * dt;
      }
      var ae = w2 * w2 * (extT - ext) - 2 * w2 * extV; extV += ae * dt; ext += extV * dt;
      var settled = Math.abs(target[0] - pos[0]) < 0.05 && Math.abs(target[1] - pos[1]) < 0.05 &&
        Math.hypot(vel[0], vel[1]) < 0.05 && Math.abs(extT - ext) < 0.0005 && Math.abs(extV) < 0.001;
      if (settled) { pos = target.slice(); vel = [0, 0]; ext = extT; extV = 0; }
      paint();
      raf = settled ? 0 : requestAnimationFrame(step);
    }

    function paint() {
      if (nucleolo) {
        if (pos[0] === 0 && pos[1] === 0) nucleolo.removeAttribute('transform');   // reposo = maestro exacto
        else nucleolo.setAttribute('transform', 'translate(' + pos[0].toFixed(3) + ' ' + pos[1].toFixed(3) + ')');
      }
      rays.forEach(function (r) {
        if (!r.el) return;
        if (ext === 1) { r.el.removeAttribute('transform'); return; }
        // escala axial desde la base (la gramática de Mirada y Luz en 02)
        var bx = r.ax[0], by = r.ax[1], ux = r.ax[2], uy = r.ax[3], s = ext - 1;
        var a = 1 + s * ux * ux, b = s * ux * uy, d = 1 + s * uy * uy;
        var e = bx - (a * bx + b * by), f = by - (b * bx + d * by);
        r.el.setAttribute('transform', 'matrix(' + [a, b, b, d, e, f].map(function (v) { return v.toFixed(5); }).join(' ') + ')');
      });
    }

    function install() {
      if (mode === 'full') {
        on(global, 'pointermove', function (e) { lookAt(e.clientX, e.clientY); }, { passive: true });
        on(global.document, 'pointerleave', rest);
        on(opts.focusScope || global.document, 'focusin', function (e) {
          if (!e.target || !e.target.getBoundingClientRect || e.target === global.document.body) return;
          var r = e.target.getBoundingClientRect();
          lookAt(r.left + r.width / 2, r.top + r.height / 2);
        });
      } else {
        var trg = opts.trigger || svg;
        var near = function () { setTarget(0, 0, 1.06); };
        on(trg, 'pointerenter', near); on(trg, 'focusin', near);
        on(trg, 'pointerleave', rest); on(trg, 'focusout', rest);
      }
    }

    function uninstall() {
      listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
      listeners = []; clearTimeout(idleTimer); cancelAnimationFrame(raf); raf = 0;
      pos = [0, 0]; vel = [0, 0]; ext = 1; extV = 0; paint();
    }

    function sync() { uninstall(); if (!(reduce && reduce.matches) && !opts.forceReduced) install(); }
    if (reduce && reduce.addEventListener) reduce.addEventListener('change', sync);
    sync();

    return {
      lookAt: lookAt, rest: rest,
      state: function () { return { offset: pos.slice(), rays: ext, active: listeners.length > 0 }; },
      destroy: function () { uninstall(); if (reduce && reduce.removeEventListener) reduce.removeEventListener('change', sync); }
    };
  }

  global.CelumaAtento = { attach: attach, NUCLEO: NUCLEO, REST: REST, LOOK_R: LOOK_R };
})(window);
