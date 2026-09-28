// Fase 3 · galería de direcciones de motion — aprobadas en el experimento 02, incorporación pendiente.
// Reproduce los Lottie reales (data.js, lottie-web 5.13.0 de ../vendor) y los SVG + CSS del loader.
// Movimiento reducido (sistema o simulado): nada se anima; se muestra el SVG estático exacto de estaticos/.
(() => {
  const D = window.F3, P2 = window.CELUMA_ANIM, MET = window.F3_METRICS, PC = window.F3_PAGECHECK;
  const FPS = D.fps;
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false, addEventListener() {} };
  const S = { typo: 'a', ori: 'h', bg: 'crema', speed: 1, paused: false, repeat: true, simReduce: false,
    cardMode: { luz: 'once', enfoque: 'once', trazo: 'once', mirada: 'once' }, loadDir: 'luz', splashDir: 'enfoque', matDir: 'trazo' };
  const reduced = () => mq.matches || S.simReduce;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const n2 = (x, d = 2) => Number(x).toFixed(d).replace('.', ',');
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const ORI = { h: 'horizontal', v: 'vertical' };
  const POL = { pos: 'color-positivo', neg: 'color-negativo' };
  const ISO_BOX = [69, 38, 557, 678];

  // ------------------------------------------------------------------ directions (copy)
  const DIRS = {
    luz: { name: 'Luz', tag: 'solo se mueve la luz', modes: ['once', 'loop'], chips: [['Carga', 'star'], ['Bienvenida mínima', '']],
      idea: 'La célula no se mueve; solo cambian los rayos y, con nombre, el acento de la é, que hace de cuarta luz. En bucle, los rayos se acortan y vuelven: no hay llenado ni cuenta.' },
    enfoque: { name: 'Enfoque', tag: 'poner la muestra a foco', modes: ['once'], chips: [['Bienvenida', 'star'], ['Outro (al revés)', '']],
      idea: 'Un campo de visión circular, como el de un microscopio, se abre desde el centro mientras la célula se asienta de 1,05 a 1, sin desenfoque. Con nombre, el campo se amplía y lo descubre.' },
    trazo: { name: 'Trazo', tag: 'la marca se dibuja', modes: ['once'], chips: [['Material de marca', 'star'], ['Hero', '']],
      idea: 'La membrana se traza, el citoplasma se llena desde el centro, núcleo y nucléolo se colocan, los trazos internos se escriben y la luz llega al final. Con nombre, las letras se escriben.' },
    mirada: { name: 'Mirada', tag: 'fase 2 · referencia', modes: ['once', 'loop'], chips: [['Referencia', 'warn']], ref: true,
      idea: 'La célula mira a la izquierda y a la derecha, tiene su «eureka» y se encienden los rayos. Es un personaje y solo anima el isotipo. No cuenta entre las tres.' },
  };

  // ------------------------------------------------------------------ data access
  const subjectOf = (typo = S.typo, ori = S.ori, bg = S.bg) => (typo === 'iso' ? 'iso' : `${typo}-${ori}-${bg === 'navy' ? 'neg' : 'pos'}`);
  const staticSrc = (subj, dir) => {
    if (dir === 'mirada' || subj === 'iso') return dir === 'mirada' ? '../anim/celuma-isotipo-maestro-caja-anim.svg' : 'estaticos/isotipo.svg';
    const [o, r, p] = subj.split('-');
    return `estaticos/lockup-${o}-${ORI[r]}-${POL[p]}.svg`;
  };
  function resolve(dir, subj, mode) {
    if (dir === 'mirada') {
      return { data: P2[mode], box: ISO_BOX, subj: 'iso', key: `mirada|iso|${mode}`, op: P2[mode].op,
        note: subj !== 'iso' ? 'La fase 2 solo anima el isotipo (sin nombre)' : '', markers: P2[mode].markers.map((m) => [m.cm, m.tm]) };
    }
    let key = `${dir}|${subj}|${mode}`, note = '';
    if (!D.lottie[key] && mode === 'loop' && subj !== 'iso') { key = `${dir}|${subj.replace('-v-', '-h-')}|loop`; note = 'Bucle con nombre solo en horizontal'; }
    if (!D.lottie[key]) return null;
    const m = D.meta[key];
    return { data: D.lottie[key], box: m.box, subj: m.subject, key, op: m.op, note, markers: m.markers };
  }
  // artwork size -> slot size (the comp box carries 4 units of margin per side)
  function slotSize(box, want) {
    const aw = box[2] - 8, ah = box[3] - 8;
    const k = want.h ? want.h / ah : want.w / aw;
    return { w: box[2] * k, h: box[3] * k };
  }

  // ------------------------------------------------------------------ players
  const players = new Set();
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => {
    ents.forEach((e) => { const p = e.target._player; if (!p) return; p.visible = e.isIntersecting; p.sync(); });
  }, { rootMargin: '80px' }) : null;

  function mountStatic(slot, dir, subj, size, alt) {
    const img = new Image();
    img.src = staticSrc(subj, dir); img.alt = alt || 'Céluma'; img.decoding = 'async';
    img.style.width = size.w + 'px'; img.style.height = size.h + 'px'; img.style.display = 'block';
    slot.appendChild(img);
  }
  function uniqueSvg(svgText, pfx) {
    // CSS inside an inline SVG is global: prefix ids, selectors and keyframes per instance
    return svgText.replace(/id="([^"]+)"/g, `id="${pfx}$1"`).replace(/aria-labelledby="t d"/, `aria-labelledby="${pfx}t ${pfx}d"`)
      .replace(/#(rayo-\d)/g, `#${pfx}$1`).replace(/cl3-/g, `${pfx}cl3-`);
  }
  let uid = 0;

  /** cfg: {dir, subj, mode, want:{h}|{w}, renderer:'lottie'|'css', onFrame, loop, reverse, noRepeat, alt} */
  function mount(slot, cfg) {
    unmount(slot);
    slot.innerHTML = '';
    const r = resolve(cfg.dir, cfg.subj, cfg.mode);
    if (!r) { slot.innerHTML = '<p class="g-na">Sin versión para esta combinación.</p>'; return null; }
    const size = slotSize(r.box, cfg.want);
    slot.style.width = size.w + 'px'; slot.style.height = size.h + 'px';
    const p = { slot, cfg, r, visible: !io, ended: false, anim: null, css: null, timer: 0, isStatic: false, frame: 0 };
    p.isLoop = cfg.mode === 'loop';
    if (reduced()) {
      p.isStatic = true;
      mountStatic(slot, cfg.dir, r.subj, size, cfg.alt);
    } else if (cfg.renderer === 'css') {
      const svgText = D.css[r.subj];
      const holder = document.createElement('div'); holder.className = 'pl';
      holder.innerHTML = uniqueSvg(svgText, `u${++uid}-`);
      const svg = holder.querySelector('svg'); svg.removeAttribute('width'); svg.removeAttribute('height');
      slot.appendChild(holder);
      p.css = () => $$('*', holder).flatMap((el) => el.getAnimations ? el.getAnimations() : []);
      p.css().forEach((a) => { a.playbackRate = S.speed; });
    } else {
      const holder = document.createElement('div'); holder.className = 'pl';
      holder.setAttribute('role', 'img'); holder.setAttribute('aria-label', cfg.alt || 'Céluma');
      slot.appendChild(holder);
      p.anim = lottie.loadAnimation({ container: holder, renderer: 'svg', loop: p.isLoop, autoplay: false, animationData: clone(r.data),
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false } });
      p.anim.setSpeed(S.speed);
      p.anim.addEventListener('enterFrame', (e) => { p.frame = e.currentTime; cfg.onFrame && cfg.onFrame(e.currentTime, p); });
      p.anim.addEventListener('complete', () => {
        p.ended = true; cfg.onFrame && cfg.onFrame(p.anim.playDirection < 0 ? 0 : r.op - 1, p);
        if (S.repeat && !cfg.noRepeat && !reduced()) p.timer = setTimeout(() => { if (p.visible && !S.paused) p.restart(); }, 1600);
      });
      p.anim.addEventListener('DOMLoaded', () => {
        if (cfg.reverse) { p.anim.goToAndStop(r.op - 1, true); p.anim.setDirection(-1); }
        p.sync();
      });
    }
    p.playing = () => (p.anim ? !p.anim.isPaused : p.css ? p.css().some((a) => a.playState === 'running') : false);
    p.play = () => { if (p.anim) { if (p.ended) p.restart(); else p.anim.play(); } else if (p.css) p.css().forEach((a) => a.play()); };
    p.pause = () => { clearTimeout(p.timer); if (p.anim) p.anim.pause(); else if (p.css) p.css().forEach((a) => a.pause()); };
    p.restart = () => {
      clearTimeout(p.timer); p.ended = false;
      if (p.anim) { if (p.anim.playDirection < 0) p.anim.goToAndPlay(r.op - 1, true); else p.anim.goToAndPlay(0, true); }
      else if (p.css) p.css().forEach((a) => { a.currentTime = 0; a.play(); });
    };
    p.seek = (f) => {
      clearTimeout(p.timer);
      if (p.anim) { p.anim.goToAndStop(f, true); p.ended = false; cfg.onFrame && cfg.onFrame(f, p); }
      else if (p.css) p.css().forEach((a) => { a.pause(); a.currentTime = (f / FPS) * 1000; });
    };
    p.sync = () => {
      if (p.isStatic) return;
      const want = p.visible && !S.paused;
      if (want && !p.playing() && !p.ended) p.play();
      else if (!want && p.playing()) p.pause();
    };
    p.destroy = () => { clearTimeout(p.timer); if (p.anim) p.anim.destroy(); if (io) io.unobserve(slot); players.delete(p); };
    slot._player = p; players.add(p);
    if (io) io.observe(slot); else p.sync();
    if (p.css) p.sync();
    return p;
  }
  function unmount(slot) { if (slot._player) { slot._player.destroy(); slot._player = null; } }
  const setSpeedAll = () => players.forEach((p) => { if (p.anim) p.anim.setSpeed(S.speed); if (p.css) p.css().forEach((a) => { a.playbackRate = S.speed; }); });

  // ------------------------------------------------------------------ scaled native screens
  const fits = [];
  function prepFit(el) {
    const [W, H] = el.dataset.native.split('x').map(Number);
    el.style.aspectRatio = `${W} / ${H}`;
    el.innerHTML = `<div class="g-native" style="width:${W}px;height:${H}px"></div>`;
    const nat = el.firstChild;
    const fit = () => { nat.style.transform = `scale(${el.clientWidth / W})`; };
    fits.push(fit);
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(el);
    fit();
    return nat;
  }
  const NAT = {};
  $$('.g-fit').forEach((el) => { NAT[el.id] = prepFit(el); });
  window.addEventListener('resize', () => fits.forEach((f) => f()));

  // ------------------------------------------------------------------ 1 · comparison cards
  function markerAt(markers, f) { let p = ''; for (const [n, t] of markers) if (f >= t) p = n; return p; }
  function renderCards() {
    const wrap = $('#cards');
    $$('.g-slot', wrap).forEach(unmount);
    wrap.innerHTML = '';
    const subj = subjectOf();
    const mounts = [];      // measure stages only after every card is in the grid
    for (const [id, d] of Object.entries(DIRS)) {
      const mode = d.modes.includes(S.cardMode[id]) ? S.cardMode[id] : 'once';
      const card = document.createElement('article');
      card.className = 'g-card' + (d.ref ? ' ref' : '');
      card.innerHTML = `<h3>${d.name} <small>${d.tag}</small></h3><p class="idea">${d.idea}</p>
        <div class="g-stage" data-bg="${S.bg}"><div class="g-slot"></div></div>
        <div class="g-transport" role="group" aria-label="Versión y reproducción · ${d.name}">
          <button type="button" class="g-btn" data-m="once" aria-pressed="${mode === 'once'}">Una vez</button>
          <button type="button" class="g-btn" data-m="loop" aria-pressed="${mode === 'loop'}" ${d.modes.includes('loop') ? '' : 'disabled title="Sin bucle a propósito: ver ficha"'}>Bucle</button>
          <button type="button" class="g-btn" data-a="toggle" aria-label="Pausar o reproducir ${d.name}">❚❚</button>
          <button type="button" class="g-btn" data-a="restart" aria-label="Reiniciar ${d.name}">↺</button>
          <span class="g-readout" aria-live="off">—</span></div>
        <input class="g-range" type="range" min="0" value="0" step="1" aria-label="Fotograma de ${d.name}" />
        <div class="g-meta">${d.chips.map(([t, c]) => `<span class="g-chip ${c}">${c === 'star' ? '★ ' : ''}${t}</span>`).join('')}<span class="g-chip dur"></span></div>`;
      wrap.appendChild(card);
      mounts.push([id, d, mode, card]);
    }
    for (const [id, d, mode, card] of mounts) {
      const stage = $('.g-stage', card), slot = $('.g-slot', card), range = $('.g-range', card), ro = $('.g-readout', card);
      const r = resolve(id, subj, mode);
      const isLockup = r && r.subj !== 'iso';
      const vertical = isLockup && r.subj.split('-')[1] === 'v';
      if (vertical) stage.classList.add('tall');
      const avail = Math.max(200, stage.clientWidth - 28);
      const want = !isLockup ? { h: 168 } : vertical ? { h: 250 } : { w: Math.min(avail, 330) };
      const p = mount(slot, { dir: id, subj, mode, want, alt: `Céluma · ${d.name}`,
        onFrame: (f) => { range.value = Math.round(f); ro.textContent = `${n2(f / FPS)} s · ${markerAt(r.markers, f)}`; } });
      if (r) {
        range.max = r.op - 1;
        $('.dur', card).textContent = `${n2(r.op / FPS)} s${mode === 'loop' ? ' · bucle' : ''}`;
        if (r.note) { const nt = document.createElement('span'); nt.className = 'g-note'; nt.textContent = r.note; stage.appendChild(nt); }
      }
      if (!p || p.isStatic) { range.disabled = true; ro.textContent = reduced() ? 'estático (movimiento reducido)' : '—'; $$('[data-a]', card).forEach((b) => { b.disabled = true; }); }
      $$('[data-m]', card).forEach((b) => b.addEventListener('click', () => { S.cardMode[id] = b.dataset.m; renderCards(); }));
      $('[data-a="toggle"]', card).addEventListener('click', (e) => {
        if (!p) return; if (p.playing()) { p.pause(); e.target.textContent = '▶'; } else { p.visible = true; p.play(); e.target.textContent = '❚❚'; } });
      $('[data-a="restart"]', card).addEventListener('click', () => p && p.restart());
      range.addEventListener('input', () => p && p.seek(+range.value));
    }
  }

  // ------------------------------------------------------------------ 2 · loader
  const LOAD_ROWS = [
    { id: 'luz', label: 'Luz · SVG + CSS', sub: 'bucle 2,0 s · sin reproductor', dir: 'luz', renderer: 'css' },
    { id: 'luz-lottie', label: 'Luz · Lottie', sub: 'mismo bucle, lottie-web', dir: 'luz', renderer: 'lottie' },
    { id: 'mirada', label: 'Mirada · fase 2', sub: 'bucle 4,8 s · referencia', dir: 'mirada', renderer: 'lottie' },
    { id: 'estatico', label: 'Estático + texto', sub: 'línea base honesta', dir: 'static' },
  ];
  function loaderSlot(el, rowId, want, subj = 'iso') {
    const row = LOAD_ROWS.find((r) => r.id === rowId);
    if (row.dir === 'static') {
      const r = resolve('luz', subj, 'loop') || resolve('luz', 'iso', 'loop');
      const size = slotSize(r.box, want); el.style.width = size.w + 'px'; el.style.height = size.h + 'px';
      mountStatic(el, 'luz', r.subj, size); return null;
    }
    return mount(el, { dir: row.dir, subj, mode: 'loop', want, renderer: row.renderer, alt: 'Cargando' });
  }
  function renderLoaderSizes() {
    const wrap = $('#load-sizes');
    $$('.g-slot', wrap).forEach(unmount);
    wrap.innerHTML = '';
    const subj = subjectOf(S.typo, 'h');
    for (const row of LOAD_ROWS.filter((item) => item.id === S.loadDir)) {
      const div = document.createElement('div'); div.className = 'g-sizerow';
      div.innerHTML = `<div class="lab">${row.label}<small>${row.sub}</small></div><div class="g-sizecells" data-bg="${S.bg}"></div>`;
      wrap.appendChild(div);
      const cells = $('.g-sizecells', div);
      for (const h of [32, 48, 64, 96]) {
        const fig = document.createElement('figure'); fig.innerHTML = `<div class="g-slot"></div><figcaption>${h} px</figcaption>`;
        cells.appendChild(fig); loaderSlot($('.g-slot', fig), row.id, { h });
      }
      if (S.typo !== 'iso' && row.dir !== 'mirada') {
        const fig = document.createElement('figure'); fig.innerHTML = `<div class="g-slot"></div><figcaption>lockup ${S.typo.toUpperCase()} · 160 px</figcaption>`;
        cells.appendChild(fig); loaderSlot($('.g-slot', fig), row.id, { w: 160 }, subj);
      }
    }
  }
  let taskTimer = 0, stepTimer = 0;
  function renderLoaderScreens() {
    const bgc = { crema: '#fbf6ec', blanco: '#ffffff', navy: '#0d1b2a' }[S.bg];
    const row = S.loadDir;
    // desktop app panel
    const app = NAT['scr-app'];
    $$('.g-slot', app).forEach(unmount);
    app.innerHTML = `<div class="m-app"><div class="m-top"><b>Céluma</b><span>Laboratorio Demo Norte</span></div>
      <div class="m-body"><div class="m-side"><span>Lista de trabajo</span><i></i><i style="width:70%"></i><i style="width:84%"></i><i style="width:60%"></i></div>
      <div class="m-main" data-bg="${S.bg}"><div class="m-load" role="status"><div class="g-slot"></div><p>Cargando lista de trabajo…</p><small>Datos ficticios</small></div></div></div></div>
      <span class="m-tag">Maqueta · aprobado en lab</span>`;
    loaderSlot($('.g-slot', app), row, { h: 48 });
    // phone boot
    const ph = NAT['scr-phone-load'];
    $$('.g-slot', ph).forEach(unmount);
    ph.innerHTML = `<div class="m-phone" data-bg="${S.bg}" style="background:${bgc}"><div class="g-slot"></div><p role="status">Abriendo Céluma…</p></div>`;
    const lockup = S.typo !== 'iso' && row !== 'mirada';
    loaderSlot($('.g-slot', ph), row, lockup ? { w: 200 } : { h: 64 }, lockup ? subjectOf(S.typo, 'h') : 'iso');
    // long task
    const tk = NAT['scr-task'];
    $$('.g-slot', tk).forEach(unmount);
    clearInterval(taskTimer);
    tk.innerHTML = `<div class="m-task" data-bg="${S.bg}" style="background:${S.bg === 'navy' ? '#13263a' : '#fff'};color:${S.bg === 'navy' ? '#fff' : 'inherit'}">
      <div class="g-slot"></div><div><h4>Generando PDF del informe DEMO-0042</h4><div role="status" aria-live="polite" class="now-step" style="font-size:14px"></div>
      <ol class="steps"><li>Reuniendo resultados</li><li>Aplicando plantilla del laboratorio</li><li>Preparando la descarga</li></ol>
      <div class="t"></div><div style="font-size:13px;margin-top:6px;opacity:.8">Puedes seguir trabajando; te avisaremos al terminar. · Simulación con datos ficticios</div></div></div>`;
    const tp = loaderSlot($('.g-slot', tk), row, { h: 64 });
    // > 5 s next to other content (WCAG 2.2.2): three cycles, then the logo rests on its static frame
    // and only the text keeps reporting the real state
    clearTimeout(renderLoaderScreens._stop);
    if (tp && !tp.isStatic) renderLoaderScreens._stop = setTimeout(() => { tp.seek(0); tp.pause(); tp.isStatic = true; tk.dataset.stopped = '1'; }, (tp.r.op / FPS) * 3000);
    let step = 0, t0 = Date.now();
    const lis = $$('.steps li', tk), now = $('.now-step', tk), tt = $('.t', tk);
    const tick = () => {
      lis.forEach((li, i) => { li.className = i < step ? 'done' : i === step ? 'now' : ''; li.textContent = li.textContent.replace(/^✓ /, ''); if (i < step) li.textContent = '✓ ' + li.textContent; });
      now.textContent = step < 3 ? `Paso ${step + 1} de 3` : 'Listo · Descarga preparada';
      tt.textContent = `Tiempo transcurrido: ${Math.floor((Date.now() - t0) / 1000)} s`;
    };
    tick();
    // simulated system state: elapsed time every second, one step every 2,6 s, then it starts over
    taskTimer = setInterval(() => { if (!S.paused) tick(); }, 1000);
    clearInterval(stepTimer);
    stepTimer = setInterval(() => { if (S.paused) return; step = (step + 1) % 4; if (step === 0) t0 = Date.now(); tick(); }, 2600);
  }

  // ------------------------------------------------------------------ 3 · splash
  function renderSplash() {
    const bgc = { crema: '#fbf6ec', blanco: '#ffffff', navy: '#0d1b2a' }[S.bg];
    const dir = S.splashDir;
    $('#splash-replay').disabled = reduced();
    $('#splash-note').textContent = dir === 'mirada' ? 'Mirada (fase 2) solo anima el isotipo; tipografía y orientación no aplican en esta vista.' : '';
    for (const [id, wants] of [['scr-phone-splash', { iso: { h: 112 }, h: { w: 240 }, v: { w: 200 } }], ['scr-desk-splash', { iso: { h: 150 }, h: { w: 420 }, v: { w: 260 } }]]) {
      const nat = NAT[id];
      $$('.g-slot', nat).forEach(unmount);
      nat.innerHTML = `<div class="m-splash" style="background:${bgc}"><div class="g-slot"></div></div><span class="m-tag">Maqueta · aprobado en lab</span>`;
      const subj = subjectOf();
      const want = S.typo === 'iso' || dir === 'mirada' ? wants.iso : wants[S.ori];
      mount($('.g-slot', nat), { dir, subj, mode: 'once', want, noRepeat: true, alt: 'Céluma · bienvenida' });
    }
  }

  // ------------------------------------------------------------------ 4 · material
  let matReverse = false;
  function renderMaterial() {
    const bgc = { crema: '#fbf6ec', blanco: '#ffffff', navy: '#0d1b2a' }[S.bg];
    const dir = S.matDir;
    $('#mat-intro').setAttribute('aria-pressed', String(!matReverse));
    $('#mat-outro').setAttribute('aria-pressed', String(matReverse));
    $('#mat-intro').disabled = reduced();
    $('#mat-outro').disabled = reduced();
    $('#material-note').textContent = dir === 'mirada' ? 'Mirada (fase 2) solo anima el isotipo; tipografía y orientación no aplican en estas piezas.' : '';
    const pieces = [
      ['scr-169', { iso: { h: 420 }, h: { w: 1000 }, v: { w: 560 } }, 'Pieza de ejemplo · texto ficticio'],
      ['scr-11', { iso: { h: 460 }, v: { w: 560 } }, 'Texto de ejemplo para redes'],
    ];
    for (const [id, wants, cap] of pieces) {
      const nat = NAT[id];
      $$('.g-slot', nat).forEach(unmount);
      nat.innerHTML = `<div class="m-piece" data-bg="${S.bg}" style="background:${bgc}"><div class="g-slot"></div><div class="cap">${cap}</div></div><span class="m-tag">Maqueta · aprobado en lab</span>`;
      const ori = id === 'scr-11' ? 'v' : S.ori;             // the square piece always uses the vertical lockup
      const want = S.typo === 'iso' || dir === 'mirada' ? wants.iso : wants[ori];
      mount($('.g-slot', nat), { dir, subj: subjectOf(S.typo, ori), mode: 'once', want, reverse: matReverse, noRepeat: true, alt: 'Céluma · pieza de marca' });
    }
    const hero = NAT['scr-hero'];
    $$('.g-slot', hero).forEach(unmount);
    hero.innerHTML = `<div class="m-hero" data-bg="${S.bg}" style="background:${bgc}"><div><h2>Titular de ejemplo para el landing</h2><p>Texto ficticio de apoyo. Esta maqueta no describe capacidades del producto.</p></div>
      <div style="display:grid;place-items:center"><div class="g-slot"></div></div></div><span class="m-tag">Maqueta · aprobado en lab</span>`;
    mount($('.g-slot', hero), { dir, subj: 'iso', mode: 'once', want: { h: 420 }, reverse: matReverse, noRepeat: true, alt: 'Céluma' });
  }

  // ------------------------------------------------------------------ 5 · fichas
  const FICHA = {
    luz: {
      narr: ['<strong>Una vez (1,4–1,7 s):</strong> la célula ya está en pantalla y es lo que mostraría una pantalla de arranque estática del sistema. Cada rayo nace como un punto de luz y se proyecta, de izquierda a arriba, con 140 ms entre uno y otro. Con nombre, el acento de la é se enciende al final, como cuarta luz.',
        '<strong>Bucle (2,0 s):</strong> una ola lenta: cada rayo se acorta al 60 % desde su base y vuelve, con 160 ms de desfase. Hay 0,25 s de reposo al inicio y ~0,5 s al final. La célula y el nombre no se mueven y los colores son exactos en todos los fotogramas.'],
      uso: ['<strong>Carga compacta (32–96 px): recomendada.</strong> No simula un proceso: no llena, no cuenta y no avanza hacia un final.', 'Arranque de la app con lockup horizontal, con el nombre quieto.', 'Bienvenida mínima, que continúa sin salto desde una pantalla de arranque estática.'],
      comp: ['A 32 px la ola es muy discreta: los rayos miden ~1,4 px de grosor.', 'Tiene menos carácter que la Mirada y poca narrativa para piezas grandes.', 'Durante la ola, el bucle acorta los rayos con escala axial y sus puntas redondeadas se achatan un poco; no se aprecia por debajo de ~200 px.', 'El acento que aparece al final puede leerse como una errata momentánea (pregunta 3).'],
      fmt: ['<strong>SVG + CSS</strong> para el bucle (<code>svg/luz-*-loop.svg</code>; isotipo 8,2 KB, 2,8 KB con gzip): sin reproductor, con movimiento reducido en línea.', '<strong>Lottie</strong> para el bucle y la versión de una reproducción: solo capas de forma y morph de trazados, sin máscaras ni mates. Es el Lottie más compatible de los tres.'],
    },
    enfoque: {
      narr: ['<strong>Una vez (1,4 s solo isotipo; 1,9 s con nombre):</strong> fondo vacío (0,10 s). Un campo circular se abre desde el centro con curva de iris: rápido al principio y suave al final (0,75 s). A la vez, la célula se asienta de 1,05 a 1, como un ajuste de foco sin desenfoque. Los rayos aparecen cuando el campo los alcanza.',
        '<strong>Con nombre:</strong> en horizontal, el campo se estira hacia la derecha como una cápsula y descubre «Céluma» (0,60 s). En vertical, crece hasta el círculo que encuadra toda la firma. Las letras no se mueven.'],
      uso: ['<strong>Bienvenida / splash: sugerida.</strong> Es breve, termina en el lockup y mantiene sobrias las letras.', 'Apertura de vídeo. Al revés sirve de cierre (outro), porque el campo se cierra.'],
      comp: ['No tiene bucle a propósito: repetido, parecería un obturador o un escáner y se leería como un proceso.', 'El borde del campo corta el dibujo durante ~0,4 s.', 'Usa una máscara animada de Lottie (6 vértices). lottie-web y ThorVG la reproducen; iOS y Android están sin probar.', 'Por debajo de ~64 px, el efecto de campo no se distingue.'],
      fmt: ['<strong>Lottie</strong>: una capa con máscara, que al final cede el paso a una capa estática exacta.', '<strong>SVG + CSS</strong> es viable con <code>clip-path: circle()</code>, pero no se construyó. Sería la opción ligera para la web si se elige esta dirección.'],
    },
    trazo: {
      narr: ['<strong>Una vez (2,6 s solo isotipo; 2,7 s con nombre):</strong> la membrana se dibuja en sentido horario desde junto a los rayos (0,12–0,92 s). El citoplasma se llena desde el centro, el núcleo crece desde el suyo y aparece el nucléolo. Los trazos internos se escriben en su dirección y, al final, los rayos se dibujan desde la base con la punta redondeada.',
        '<strong>Con nombre:</strong> las seis letras se escriben de izquierda a derecha (barrido de 0,24 s cada una, con 75 ms de desfase) y el acento es el último trazo. <strong>Outro:</strong> la misma animación reproducida al revés.'],
      uso: ['<strong>Material de marca: recomendada</strong> para intro/outro de vídeo, pieza social 1:1 y 16:9, y hero del landing en la primera visita.', 'Presentaciones y eventos: la firma se construye delante del público.'],
      comp: ['Dura 2,6–2,7 s y mueve muchos elementos: no sirve para UI, carga ni tamaños menores de ~96 px.', 'Es la más exigente: mate de pista (membrana) y máscaras (citoplasma, trazos y letras). Más coste en lottie-web canvas; iOS y Android están sin probar.', 'La escritura de las letras es un barrido, no un trazo caligráfico.'],
      fmt: ['<strong>Lottie</strong>: capas con máscaras y un mate; al final, una capa estática exacta.', '<strong>Vídeo</strong> (MP4/WebM) cuando el destino no reproduce Lottie: redes sociales, presentaciones o correo.'],
    },
  };
  function gantt(rows) {
    const end = Math.max(...rows.map((r) => r[2]));
    const tickN = Math.ceil(end / 0.5);
    return `<div class="g-tl" role="table" aria-label="Línea de tiempo">${rows.map(([l, a, b, k]) =>
      `<div class="row" role="row"><span role="cell">${esc(l)} <span style="color:var(--celuma-fg-3);font-variant-numeric:tabular-nums">· ${n2(a)}–${n2(b)} s</span></span>
       <span class="track" role="cell"><span class="bar k-${k}" style="left:${(100 * a) / end}%;width:${Math.max(0.8, (100 * (b - a)) / end)}%"></span></span></div>`).join('')}
      <div class="row"><span></span><span class="axis">${Array.from({ length: tickN + 1 }, (_, i) => `<span>${n2(Math.min(i * 0.5, end), 1)}</span>`).join('')}</span></div></div>`;
  }
  function renderFichas() {
    const wrap = $('#fichas');
    const T = D.timelines;
    wrap.innerHTML = ['luz', 'enfoque', 'trazo'].map((id) => {
      const f = FICHA[id], d = DIRS[id];
      const tls = id === 'luz' ? [['Bucle de carga', T.luz.loop], ['Una vez · isotipo', T.luz['once-iso']], ['Una vez · con nombre', T.luz['once-lockup']]]
        : [['Una vez · isotipo', T[id]['once-iso']], ['Una vez · con nombre', T[id]['once-lockup']]];
      return `<article class="g-ficha" id="ficha-${id}"><div>
          <h3>${d.name} <small style="font-family:var(--celuma-font-body);font-size:14px;color:var(--celuma-fg-3)">· ${d.tag}</small></h3>
          <p>${d.idea}</p>
          <h4>Narrativa</h4>${f.narr.map((x) => `<p>${x}</p>`).join('')}
          <h4>Razón de uso</h4><ul>${f.uso.map((x) => `<li>${x}</li>`).join('')}</ul>
          <h4>Compromisos</h4><ul>${f.comp.map((x) => `<li>${x}</li>`).join('')}</ul>
          <h4>Formato</h4><ul>${f.fmt.map((x) => `<li>${x}</li>`).join('')}</ul>
        </div><div>
          <h4 style="margin-top:0">Tiempos (s)</h4>${tls.map(([t, rows]) => `<p style="margin:10px 0 0;font-weight:700;font-size:13px">${t}</p>${gantt(rows)}`).join('')}
          <h4>Lámina</h4><a href="validation/lamina-${id}.png"><img loading="lazy" src="validation/lamina-${id}.png" alt="Lámina de fotogramas clave de ${d.name}: isotipo, A y B sobre crema y navy" /></a>
          <h4>Vídeo de revisión</h4><video controls muted playsinline preload="none" poster="preview/${id}-poster.jpg">
            <source src="preview/${id}.webm" type="video/webm" /><source src="preview/${id}.mp4" type="video/mp4" /></video>
          <p class="lv-caption"><a href="preview/${id}.mp4">MP4</a> · <a href="preview/${id}.webm">WebM</a></p>
        </div></article>`;
    }).join('') + `<article class="g-ficha" id="ficha-mirada" style="background:#f7f5ef;border-style:dashed"><div>
        <h3>Mirada <small style="font-family:var(--celuma-font-body);font-size:14px;color:var(--celuma-fg-3)">· fase 2 · referencia de calidad</small></h3>
        <p>${DIRS.mirada.idea}</p><p>Una vez 3,20 s · bucle 4,80 s · solo el isotipo. Se conserva íntegra en <a href="../animacion.html">animacion.html</a> y <a href="../README-FASE2.md">README-FASE2.md</a>; aquí solo se reproduce, sin cambios, para comparar.</p></div>
        <div><h4 style="margin-top:0">Por qué no cuenta entre las tres</h4><p>Es el punto de partida. Las tres direcciones nuevas usan principios distintos: la luz (Luz), el encuadre (Enfoque) y el dibujo (Trazo), en lugar del personaje. No son variantes de velocidad de la Mirada.</p></div></article>`;
  }

  // ------------------------------------------------------------------ 6 · validation
  function renderValidation() {
    const el = $('#val');
    if (!MET) { el.innerHTML = '<p class="lv-note">Falta <code>validation/metrics.js</code>: ejecuta <code>scripts/validate.py</code>.</p>'; return; }
    const s = MET.summary, fl = MET.first_last, ef = MET.every_frame, pc = (x) => n2(100 * x, 3) + ' %';
    const ok = (b, t = 'cumple', f = 'no cumple') => (b ? `<span class="g-ok">${t}</span>` : `<span class="g-bad">${f}</span>`);
    const kpi = (b, t) => `<div class="lv-kpi"><b>${b}</b><span>${t}</span></div>`;
    const svgKeys = Object.keys(fl).filter((k) => k.endsWith('/svg'));
    const same = (x) => x && x.identical_rgba_share === 1;
    const exact = svgKeys.filter((k) => same(fl[k].last)).length;
    const twin = svgKeys.filter((k) => !same(fl[k].last) && same(fl[k].last_vs_cubic_twin)).length;
    const nearly = svgKeys.filter((k) => !same(fl[k].last) && !same(fl[k].last_vs_cubic_twin));
    let rows = '';
    for (const k of svgKeys) {
      const v = fl[k], key = k.replace('/svg', ''), e = ef[key];
      const cv = fl[key + '/lottie-canvas'], th = fl[key + '/thorvg'];
      const f = v.first;
      const first = f.alpha_max !== undefined ? (f.pass ? 'vacío (alfa 0)' : '<span class="g-bad">NO vacío</span>')
        : same(f) ? '<span class="g-ok">idéntico</span>' : same(v.first_vs_cubic_twin) ? '<span class="g-ok">idéntico (gemela cúbica)</span>'
          : `${pc((v.first_vs_cubic_twin || f).identical_rgba_share)} · ${(v.first_vs_cubic_twin || f).pass ? 'T1' : '⚠'}`;
      const lt = v.last_vs_cubic_twin;
      const last = same(v.last) ? '<span class="g-ok">idéntico</span>'
        : same(lt) ? `<span class="g-ok">idéntico a la gemela cúbica</span> <small>(vs Q: IoU ${v.last.iou.toFixed(4)})</small>`
          : `${(lt || v.last).px_differing ?? '?'} px distintos · máx. ${(lt || v.last).max_abs_diff ?? '?'}/255${lt ? ' (vs gemela cúbica)' : ''} · ${ok((lt || v.last).pass, 'T1', 'revisar')}`;
      const other = [cv, th].map((x) => (x ? `IoU ${x.last.iou.toFixed(4)} · ΔE ${n2(x.last.flat_de00_max)} · ${x.last.band_ok ? 'solo banda AA' : '<span class="g-bad">fuera de banda</span>'}` : '—'));
      rows += `<tr><td>${esc(key)}</td><td>${first}</td><td>${last}</td><td class="num">${other[0]}</td><td class="num">${other[1]}</td><td class="num">${e ? e.border_alpha_max : '—'}</td></tr>`;
    }
    const band = (x) => `IoU ${x.iou.toFixed(4)} · ${x.band_ok ? 'solo banda AA, ΔE 0' : '<span class="g-bad">fuera de banda</span>'}`;
    const css = Object.entries(MET.css || {}).map(([k, c]) => `<tr><td>${esc(k)}</td><td class="num">${c.bytes.toLocaleString('es')} B</td><td>${band(c.first_vs_static)}</td>
      <td>${ok(c['wrap_(t=duration)_vs_first'].pass, 'idéntico')}</td><td>${band(c.parity_with_lottie_worst)} (peor fotograma)</td><td>${ok(c.reduced_inline_vs_static.pass, 'estático idéntico')}</td><td>${c.reduced_as_img_still_animates ? '<span class="g-bad">sí se anima</span>' : 'estático'}</td></tr>`).join('');
    const loops = Object.values(MET.loop_continuity);
    const C = MET.classes || {};
    el.innerHTML = `<div class="g-kpis">
        ${kpi(`${exact}/${svgKeys.length}`, 'últimos fotogramas (lottie-web SVG, 1×) idénticos píxel a píxel al estático de la fase 1')}
        ${kpi(`+${twin}`, 'lockups A idénticos píxel a píxel a su gemela cúbica (misma geometría; ver nota)')}
        ${kpi(`${nearly.length}`, `restantes (lockups verticales): ${Math.max(0, ...nearly.map((k) => (fl[k].last_vs_cubic_twin || fl[k].last).px_differing || 0))} píxeles como máximo con diferencia ≤ ${Math.max(0, ...nearly.map((k) => (fl[k].last_vs_cubic_twin || fl[k].last).max_abs_diff || 0))}/255 en un borde (coma flotante); IoU 1, cumplen T1`)}
        ${kpi(loops.every((x) => x.identical_rgba_share === 1) ? `${loops.length}/${loops.length}` : 'NO', 'bucles cierran: último fotograma = primero (SVG, canvas, ThorVG)')}
        ${kpi(s.border_alpha_max_any_frame === 0 ? '0' : s.border_alpha_max_any_frame, 'alfa máximo en el borde de la caja, en todos los fotogramas (sin recortes)')}
        ${kpi(PC ? `${PC.mobile.overflow_px} px` : '—', 'desbordamiento horizontal de esta página a 390 px')}
      </div>
      <div class="lv-note" style="margin-top:14px"><strong>Nota sobre A · Baloo 2.</strong> El wordmark A de la fase 1 usa curvas cuadráticas (Q) y Lottie solo tiene cúbicas. La conversión es exacta (elevación de grado), pero Chromium tesela Q y C de otra forma, así que los bordes curvos difieren en la banda de antialias de 1 px, incluso entre dos SVG. La prueba: el último fotograma Lottie es <strong>idéntico píxel a píxel</strong> a la «gemela cúbica» (el mismo archivo de la fase 1 con las Q escritas como C). La geometría final es la del lockup A; solo cambia el teselado. B y el isotipo no tienen Q.</div>
      <details class="g-det" open><summary>Primer y último fotograma por variante (lottie-web SVG; canvas y ThorVG en isotipo y lockups horizontales positivos)</summary>
        <div class="lv-scroll" style="margin-top:10px"><table class="lv-table"><thead><tr><th>Variante</th><th>Primer fotograma</th><th>Último vs estático exacto</th><th>lottie-web canvas</th><th>ThorVG</th><th>Borde α (todos)</th></tr></thead><tbody>${rows}</tbody></table></div>
        <p class="lv-caption">Canvas y ThorVG (otros rasterizadores): ΔE00 máximo en planos ${n2(C.other_players_de00_max ?? 0)}; ${C.other_players_band_ok ? 'todas las diferencias de alfa &gt; 2/255 están en la banda de antialias de 1 px' : '<span class="g-bad">hay diferencias fuera de la banda</span>'}. Con el isotipo se cumple T2 (IoU ≥ 0,999). En los lockups el IoU baja hasta ${(C.other_players_iou_min ?? 0).toFixed(4)}, por debajo del 0,999 de T2, porque el texto tiene mucho más borde por área: se declara como no cumplido y la diferencia es solo de antialias.</p></details>
      <details class="g-det"><summary>Loader Luz en SVG + CSS</summary>
        <div class="lv-scroll" style="margin-top:10px"><table class="lv-table"><thead><tr><th>Archivo</th><th>Peso</th><th>Fotograma 0 vs estático</th><th>Cierre (t = duración vs t = 0)</th><th>Paridad con Lottie</th><th>Reducido (en línea)</th><th>Reducido como &lt;img&gt;</th></tr></thead><tbody>${css}</tbody></table></div>
        <p class="lv-caption">Mientras hay animaciones CSS activas, Chromium rasteriza todo el SVG con un antialias algo distinto: la diferencia cubre todos los bordes, no solo los rayos. Por eso el fotograma 0 se evalúa con T2 y no como idéntico, igual que en la fase 2. Con movimiento reducido no hay animación y el resultado es idéntico al estático. Como en la fase 2, Chromium no aplica <code>prefers-reduced-motion</code> dentro de un SVG usado como <code>&lt;img&gt;</code>: hay que integrarlo en línea o en un <code>&lt;picture&gt;</code> con el estático.</p></details>
      <details class="g-det"><summary>Alcance y límites de las pruebas</summary><ul>
        <li>Probado: Chromium headless (Playwright) en macOS, con lottie-web 5.13.0 (SVG y canvas), ThorVG (dotlottie-web 0.80.0) y CSS de Chromium.</li>
        <li>Sin probar: lottie-ios, lottie-android, Safari/WebKit (el WebKit de Playwright falla en este macOS), Firefox, After Effects, Figma y dispositivos reales. No se afirma compatibilidad.</li>
        <li>Cada fotograma se dibuja en un DOM nuevo del reproductor, por el ruido de repintado de Chromium en capturas secuenciales detectado en la fase 2.</li>
        <li>Fotogramas intermedios: se revisaron el borde, los saltos y los cierres en todos los fotogramas (a media resolución). Su aspecto se juzga a ojo, no con una métrica.</li>
        <li>Los vídeos son vistas previas renderizadas fotograma a fotograma, no exportaciones para redes.</li></ul></details>`;
  }

  // ------------------------------------------------------------------ global controls
  const press = (sel, attr, val) => $$(sel).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[attr] === String(val))));
  function renderAll() {
    $('#g-rm-banner').classList.toggle('on', reduced());
    $('#g-rm-sys').textContent = mq.matches ? 'La preferencia del sistema está activada.' : 'Simulado desde esta página.';
    $$('[data-ori]').forEach((b) => { b.disabled = S.typo === 'iso'; });
    renderCards(); renderLoaderSizes(); renderLoaderScreens(); renderSplash(); renderMaterial();
    $('#g-play').textContent = S.paused ? '▶ Reproducir' : '❚❚ Pausa';
    $('#g-play').setAttribute('aria-pressed', String(S.paused));
  }
  $$('[data-typo]').forEach((b) => b.addEventListener('click', () => { S.typo = b.dataset.typo; press('[data-typo]', 'typo', S.typo); renderAll(); }));
  $$('[data-ori]').forEach((b) => b.addEventListener('click', () => { S.ori = b.dataset.ori; press('[data-ori]', 'ori', S.ori); renderAll(); }));
  $$('[data-bg-set]').forEach((b) => b.addEventListener('click', () => { S.bg = b.dataset.bgSet; press('[data-bg-set]', 'bgSet', S.bg); renderAll(); }));
  $$('[data-speed]').forEach((b) => b.addEventListener('click', () => { S.speed = +b.dataset.speed; press('[data-speed]', 'speed', b.dataset.speed); setSpeedAll(); }));
  $('#g-play').addEventListener('click', () => { S.paused = !S.paused; players.forEach((p) => p.sync()); $('#g-play').textContent = S.paused ? '▶ Reproducir' : '❚❚ Pausa'; $('#g-play').setAttribute('aria-pressed', String(S.paused)); });
  $('#g-restart').addEventListener('click', () => { S.paused = false; $('#g-play').textContent = '❚❚ Pausa'; $('#g-play').setAttribute('aria-pressed', 'false'); players.forEach((p) => { if (!p.isStatic && p.visible) p.restart(); }); });
  $('#g-repeat').addEventListener('click', (e) => { S.repeat = !S.repeat; e.target.setAttribute('aria-pressed', String(S.repeat)); });
  $('#g-reduce').addEventListener('click', (e) => { S.simReduce = !S.simReduce; e.target.setAttribute('aria-pressed', String(S.simReduce)); renderAll(); });
  mq.addEventListener && mq.addEventListener('change', renderAll);
  $$('[data-load-dir]').forEach((b) => b.addEventListener('click', () => { S.loadDir = b.dataset.loadDir; press('[data-load-dir]', 'loadDir', S.loadDir); renderLoaderSizes(); renderLoaderScreens(); }));
  $$('[data-splash-dir]').forEach((b) => b.addEventListener('click', () => { S.splashDir = b.dataset.splashDir; press('[data-splash-dir]', 'splashDir', S.splashDir); renderSplash(); }));
  const resumePlayback = () => { if (!S.paused) return; S.paused = false; $('#g-play').textContent = '❚❚ Pausa'; $('#g-play').setAttribute('aria-pressed', 'false'); players.forEach((p) => p.sync()); };
  $('#splash-replay').addEventListener('click', () => { resumePlayback(); ['scr-phone-splash', 'scr-desk-splash'].forEach((id) => { const p = $('.g-slot', NAT[id])._player; if (p) p.restart(); }); });
  $$('[data-mat-dir]').forEach((b) => b.addEventListener('click', () => { S.matDir = b.dataset.matDir; press('[data-mat-dir]', 'matDir', S.matDir); renderMaterial(); }));
  $('#mat-intro').addEventListener('click', () => { matReverse = false; resumePlayback(); renderMaterial(); });
  $('#mat-outro').addEventListener('click', () => { matReverse = true; resumePlayback(); renderMaterial(); });

  // the sticky toolbar sits right under the sticky header, whatever height the header wraps to
  const hdr = $('.lv-header'), bar = $('.g-toolbar');
  const placeBar = () => {
    const headerHeight = getComputedStyle(hdr).position === 'sticky' ? hdr.offsetHeight : 0;
    bar.style.top = headerHeight + 'px';
    const toolbarHeight = getComputedStyle(bar).position === 'sticky' ? bar.offsetHeight : 0;
    document.documentElement.style.setProperty('--g-anchor-offset', (headerHeight + toolbarHeight + 16) + 'px');
  };
  placeBar(); window.addEventListener('resize', placeBar);
  if ('ResizeObserver' in window) { const navObserver = new ResizeObserver(placeBar); navObserver.observe(hdr); navObserver.observe(bar); }

  // expose a tiny hook for the automated page check (scripts/page_check.mjs)
  window.F3_GALLERY = { state: S, players, reduced, renderAll };
  renderFichas();
  renderValidation();
  renderAll();
  // Hash navigation can run before the generated gallery gives sections their final positions.
  if (location.hash) window.addEventListener('load', () => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) {
        const scroller = document.documentElement;
        const previous = scroller.style.scrollBehavior;
        scroller.style.scrollBehavior = 'auto';
        target.scrollIntoView({ block: 'start', behavior: 'auto' });
        requestAnimationFrame(() => { scroller.style.scrollBehavior = previous; });
      }
    }));
  }, { once: true });
})();
