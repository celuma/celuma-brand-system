// Céluma · Experimento 04 · Motion de comunicación (muestras de B aprobadas en el laboratorio el 2026-10-07;
// exportación y uso por red pendientes de la adopción por medio).
// Línea de tiempo determinista: render(t) dibuja el instante t (s). La misma función sirve
// para la vista en vivo (requestAnimationFrame) y para exportar vídeo fotograma a fotograma.
// No es Lottie: es HTML/CSS/JS sobre las piezas del kit. El segmento de logo de «intro-novedad»
// reproduce, sin modificarlo, el Lottie aprobado Orden del experimento 03 (lottie-web 5.13.0).
(function (root) {
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const easeOut = (x) => 1 - Math.pow(1 - x, 3);
  const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  const E3 = '../../3-logo-motion/';
  const PIEZAS = {
    'intro-novedad': {
      titulo: 'Intro de marca + novedad · 16:9', pieza: 'novedad-131', formato: '16x9', dir: 'b', duracion: 10.0, fps: 30, finAnim: 6.7,
      lottie: E3 + 'lottie/orden-lockup-h-neg.json', lottieFin: 228, lottieFps: 60,
      // Caja del lockup en el último fotograma de Orden (unidades del lockup → px a 1920 × 1080):
      // comp 3595 × 2023 con origen (−683, −635); arte del lockup [73, 42, 2084.93, 670].
      cajaOrden: (() => { const k = 1920 / 3595; return { x: (73 + 683) * k, y: (42 + 635) * k, w: 2084.93 * k, h: 670 * k }; })(),
      tramos: [
        ['Orden (03) · campo → cuadrícula → Céluma', 0, 3.8], ['Reposo en el lockup exacto', 3.8, 4.6],
        ['Relevo (03) · la firma se asienta en la ficha', 4.6, 5.3], ['La ficha entra · reglas, título, lista', 5.0, 6.7], ['Lectura · estado final = pieza estática', 6.7, 10.0],
      ],
    },
    'paso-a-paso': {
      titulo: 'Paso a paso · historia 9:16', pieza: 'flujo-informe', formato: '9x16', dir: 'b', duracion: 9.0, fps: 30, finAnim: 5.3,
      tramos: [
        ['Cabecera y título', 0, 1.0], ['Cuatro pasos, uno a uno', 1.1, 4.7], ['Fuente y firma', 4.6, 5.2], ['Lectura · estado final = pieza estática', 5.2, 9.0],
      ],
    },
  };

  function montar(id, escena) {
    const P = PIEZAS[id];
    escena.innerHTML = E4.html(P.pieza, P.dir, P.formato);
    const pz = escena.querySelector('.pz');
    E4.ajustarModulos(pz);
    const q = (s) => pz.querySelector(s), qa = (s) => [...pz.querySelectorAll(s)];
    const ctx = { P, pz, q, qa };
    if (id === 'intro-novedad') {
      const capa = document.createElement('div');
      capa.className = 'capa-lottie';
      // Orden (03) se reproduce sobre navy plano; al terminar, la capa se funde y aparece la luz del fondo Navy rescatado.
      capa.style.cssText = 'position:absolute;inset:0;z-index:5;background:' + (pz.classList.contains('r2') ? '#0A1520' : 'var(--e4-navy)');
      pz.appendChild(capa);
      const firma = q('.pie .firma-lockup');
      const vuelo = document.createElement('img');
      vuelo.src = firma.getAttribute('src'); vuelo.alt = '';
      vuelo.style.cssText = 'position:absolute;left:0;top:0;z-index:6;transform-origin:0 0;display:none';
      pz.appendChild(vuelo);
      Object.assign(ctx, { capa, firma, vuelo });
    }
    return ctx;
  }

  // Medidas reales de destino (después de que las fuentes y las imágenes cargan)
  function medir(ctx) {
    if (!ctx.firma) return;
    const a = ctx.pz.getBoundingClientRect(), b = ctx.firma.getBoundingClientRect();
    ctx.destino = { x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height };
  }

  function render(ctx, t, anim) {
    const { P, q, qa } = ctx;
    // Al completar su entrada, cada elemento vuelve a no tener estilos en línea: el estado final es
    // exactamente el DOM de la pieza estática (sin capas de composición residuales).
    const set = (el, o, dy = 0) => { if (!el) return; if (o >= 1) { el.style.opacity = ''; el.style.transform = ''; return; } el.style.opacity = o; el.style.transform = dy ? `translateY(${dy}px)` : ''; };
    const entra = (el, a, d = 0.45, dist = 18) => { const x = easeOut(seg(t, a, a + d)); set(el, x, (1 - x) * dist); };
    const regla = (el, a, d = 0.5) => { if (!el) return; const x = easeInOut(seg(t, a, a + d)); el.style.clipPath = x >= 1 ? '' : `inset(0 ${(1 - x) * 100}% 0 0)`; };
    // En los modos atmosférico y microcosmos de la ronda 2 la regla salmón pertenece al titular y entra con él.
    const borde = (el, a, d) => { if (ctx.pz.classList.contains('m-atm') || ctx.pz.classList.contains('m-mic')) return; const x = easeOut(seg(t, a, a + d)); el.style.borderLeftColor = x >= 1 ? '' : `rgba(249,141,132,${x})`; };

    if (P.pieza === 'novedad-131') {
      // 1 · Orden (Lottie aprobado del 03), a 60 fps muestreado en el tiempo del vídeo
      const f = Math.min(Math.round(t * P.lottieFps), P.lottieFin);
      if (anim) anim.goToAndStop(f, true);
      const fundido = seg(t, 4.6, 5.2);
      ctx.capa.style.display = fundido < 1 ? 'block' : 'none';
      ctx.capa.style.opacity = t < 4.6 ? '' : String(1 - easeInOut(fundido));
      if (anim && t >= 4.6) anim.renderer.svgElement.style.opacity = '0';
      else if (anim) anim.renderer.svgElement.style.opacity = '';
      // 2 · Relevo: la firma viaja de su caja final de Orden a su lugar en la ficha
      const c = P.cajaOrden, d = ctx.destino;
      const x = easeOut(seg(t, 4.6, 5.3));
      const vuela = t >= 4.6 && x < 1;
      ctx.vuelo.style.display = vuela ? 'block' : 'none';
      if (vuela) {
        const w = c.w + (d.w - c.w) * x, h = c.h + (d.h - c.h) * x;
        ctx.vuelo.style.width = w + 'px'; ctx.vuelo.style.height = h + 'px';
        ctx.vuelo.style.transform = `translate(${c.x + (d.x - c.x) * x}px, ${c.y + (d.y - c.y) * x}px)`;
      }
      ctx.firma.style.opacity = t >= 5.3 ? '' : 0;
      // 3 · La ficha entra
      regla(q('.cab'), 5.0, 0.55);
      borde(q('.entrada'), 5.15, 0.45);
      entra(q('.entrada .eyebrow'), 5.2, 0.4, 10);
      entra(q('.entrada .titulo'), 5.3, 0.5, 20);
      regla(q('.lista'), 5.5, 0.45);
      qa('.lista li').forEach((li, i) => entra(li, 5.6 + i * 0.16, 0.45, 12));
      entra(q('.fuente'), 6.2, 0.4, 0);
      regla(q('.pie'), 5.05, 0.55);
      entra(q('.pie .cta'), 6.25, 0.4, 0);
    } else {
      regla(q('.cab'), 0.0, 0.5);
      borde(q('.entrada'), 0.3, 0.4);
      entra(q('.entrada .eyebrow'), 0.25, 0.4, 10);
      entra(q('.entrada .titulo'), 0.35, 0.5, 20);
      entra(q('.entrada .texto'), 0.6, 0.45, 12);
      const pasos = q('.pasos-v');
      const lis = qa('.pasos-v li');
      const inicio = 1.1, paso = 0.9;
      // la línea crece hasta cada paso a medida que aparece
      const lp = clamp((t - inicio) / (paso * (lis.length - 1) + 0.3));
      if (lp >= 1) { pasos.style.removeProperty('--lp'); pasos.classList.remove('animando'); } else { pasos.style.setProperty('--lp', lp); pasos.classList.add('animando'); }
      lis.forEach((li, i) => {
        const a = inicio + i * paso;
        const p = li.querySelector('.punto');
        const x = easeOut(seg(t, a, a + 0.35));
        p.style.transform = x >= 1 ? '' : `scale(${(li.classList.contains('meta') ? 1.3 : 1) * x})`;
        [li.querySelector('.pv-n'), li.querySelector('.pv-t')].forEach((el) => entra(el, a + 0.08, 0.4, 10));
        entra(li.querySelector('.pv-q'), a + 0.22, 0.4, 0);
      });
      entra(q('.fuente'), 4.6, 0.4, 0);
      regla(q('.pie'), 4.6, 0.5);
      entra(q('.pie .firma-lockup'), 4.75, 0.45, 0);
      entra(q('.pie .cta'), 4.85, 0.4, 0);
    }
  }

  root.E4M = { PIEZAS, montar, medir, render };
})(typeof window !== 'undefined' ? window : globalThis);
