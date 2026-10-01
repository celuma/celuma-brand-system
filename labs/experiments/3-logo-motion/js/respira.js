/* Céluma · experimento 03 · Respira — reglas de uso del loader como código (exploración, no aprobada).
 *
 * El logo de carga solo indica actividad: el estado real lo dice el texto (role="status"). Estas reglas evitan
 * parpadeos en cargas cortas y distracción en esperas largas:
 *   - se muestra solo si la espera supera `delay` (400 ms);
 *   - una vez visible, se mantiene al menos `minVisible` (600 ms);
 *   - tras `maxCycles` respiraciones (3 × 3,6 s ≈ 11 s) se detiene en reposo y el texto sigue informando (WCAG 2.2.2);
 *   - al terminar NO hay animación de «hecho» y el contenido no espera al logo: el loader se funde en 120 ms;
 *   - con prefers-reduced-motion se usa el estático exacto.
 *
 * Uso:  const l = CelumaRespira.loader(host, { svgText, staticText, label });  l.start('Preparando vista previa…');
 *       l.update('Sigue en curso…');  await l.done('Vista previa lista');  // resuelve cuando ya no se ve
 *       l.done('Listo', { keepText: true })  // retira solo el logo y deja el texto de resultado
 * `svgText` es svg/respira-isotipo.svg (SVG + CSS); `staticText` es estaticos/respira-isotipo.svg.
 * Sin dependencias.
 */
(function (global) {
  'use strict';
  var CYCLE_MS = 3600;

  function mount(host, svgText) {
    var root = host.shadowRoot || host.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>:host{display:inline-block;line-height:0}svg{width:100%;height:100%;display:block}</style>' + svgText;
    return root;
  }

  /* Vuelve al reposo (el maestro) por el camino más corto y sin saltos, en `maxMs` como máximo, y se detiene.
     Solo cuando el logo sigue en pantalla (tras 3 ciclos o antes de un Relevo); al terminar una carga no se usa:
     el loader se funde y el contenido no espera. */
  function settle(root, maxMs) {
    maxMs = maxMs || 300;
    var anims = root.getAnimations ? root.getAnimations() : [];
    return Promise.all(anims.map(function (a) {
      var d = a.effect.getTiming().duration;
      var t = (a.currentTime || 0) % d;
      a.effect.updateTiming({ iterations: 1 });
      a.currentTime = t;
      var back = t < d / 2, remaining = back ? t : d - t;
      var rate = Math.max(1, remaining / maxMs);
      a.playbackRate = back ? -rate : rate;
      a.play();
      return a.finished.catch(function () {});
    }));
  }

  function loader(host, o) {
    o = o || {};
    var delay = o.delay == null ? 400 : o.delay, minVisible = o.minVisible == null ? 600 : o.minVisible;
    var maxCycles = o.maxCycles == null ? 3 : o.maxCycles;
    var reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var logo = host.querySelector('[data-respira-logo]'), text = host.querySelector('[data-respira-text]');
    var shownAt = 0, showTimer = 0, stopTimer = 0, root = null, state = 'idle';
    if (text) { text.setAttribute('role', 'status'); text.setAttribute('aria-live', 'polite'); }
    if (logo) logo.setAttribute('aria-hidden', 'true');

    function show() {
      state = 'visible'; shownAt = performance.now();
      if (logo) logo.hidden = false;
      root = mount(logo, (reduce || o.forceReduced) ? o.staticText : o.svgText);
      host.hidden = false;
      if (!reduce && !o.forceReduced && maxCycles) {
        stopTimer = setTimeout(function () { if (state === 'visible') { settle(root, CYCLE_MS / 2); state = 'resting'; host.dataset.respira = 'reposo'; } },
          maxCycles * CYCLE_MS);
      }
      host.dataset.respira = 'activo';
    }

    return {
      start: function (msg) {
        if (text && msg) text.textContent = msg;
        state = 'waiting'; host.hidden = true;
        showTimer = setTimeout(show, delay);
      },
      update: function (msg) { if (text) text.textContent = msg; },
      done: function (msg, opt) {
        opt = opt || {};
        clearTimeout(showTimer); clearTimeout(stopTimer);
        if (text && msg) text.textContent = msg;
        if (state === 'waiting' || state === 'idle') { state = 'idle'; if (!opt.keepText) host.hidden = true; return Promise.resolve(); }
        var wait = Math.max(0, minVisible - (performance.now() - shownAt));
        var target = opt.keepText ? logo : host;
        return new Promise(function (res) { setTimeout(res, wait); }).then(function () {
          state = 'idle';
          var fade = target.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduce || o.forceReduced ? 1 : 120, easing: 'linear' });
          return fade.finished.then(function () { target.hidden = true; delete host.dataset.respira; });
        });
      },
      state: function () { return state; }
    };
  }

  global.CelumaRespira = { loader: loader, settle: settle, mount: mount, CYCLE_MS: CYCLE_MS };
})(window);
