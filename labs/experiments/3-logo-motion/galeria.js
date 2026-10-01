/* Experimento 03 · galería de motion aprobada en el laboratorio.
 * Un solo reproductor para Lottie (lottie-web 5.13.0, copia local), SVG + CSS (en shadow DOM, controlado con Web
 * Animations), estático exacto y piezas interactivas (Atento, Relevo). Los archivos de 02 se leen sin modificarlos.
 * Requiere servidor HTTP (fetch). Datos de maquetas: ficticios. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var FPS = 60;
  var E2 = '../2-logo-vector-v2/';
  var ART = { isotipo: [73, 42, 549, 670], 'lockup-h': [73, 42, 2084.93, 670], 'lockup-v': [-64.25, 42, 823.5, 936.59] };
  var S = { playing: true, repeat: true, speed: 1, bg: 'crema', subject: 'isotipo', forced: false };
  var sysMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = function () { return sysMQ.matches || S.forced; };
  var SPEC = null, SPEC2 = null, METRICS = null, FILES = null;
  var players = [];
  var fmtS = function (s) { return s.toFixed(2).replace('.', ',') + ' s'; };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // ------------------------------------------------------------------ carga con caché
  var cache = {};
  function getText(url) {
    if (!cache[url]) cache[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.text(); });
    return cache[url];
  }
  function getJSON(url) { return getText(url).then(JSON.parse); }

  // ------------------------------------------------------------------ direcciones (contenido de las fichas)
  var DIRS = [
    { id: 'respira', name: 'Respira', level: 1, kicker: 'Producto · carga breve y espera larga',
      idea: 'El interior de la célula respira (±3 %) y la luz acompaña el aliento; la membrana no se mueve. Vida en espera: no avanza, no se llena y no termina.',
      subjects: ['isotipo', 'lockup-h'], formats: ['css', 'lottie', 'static'], def: 'css',
      ficha: [
        ['Intención', 'Decir «el sistema está trabajando» con un gesto vivo y calmado. No representa progreso.'],
        ['Relación con Céluma', 'Célula (vida) + luz, sin tocar la silueta. La calma transmite confianza; ningún pigmento cambia.'],
        ['Contexto', 'Verificación de sesión o permiso a pantalla completa; paneles de carga (vista previa); esperas largas, siempre con texto de estado.'],
        ['Duración', 'Bucle de 3,6 s: reposo 0,4 · inspira 1,3 · pausa 0,15 · espira 1,35 · reposo 0,4.'],
        ['Bucle / una vez', 'Bucle que cierra sin salto (primer y último fotograma = maestro).'],
        ['Al terminar', 'Se funde en 120 ms y el contenido aparece: sin animación de «hecho» y sin hacer esperar al contenido. Tras 3 ciclos vuelve al reposo por el camino más corto y el texto sigue informando.'],
        ['Tamaño', '48–96 px de alto de isotipo. A 32 px el cambio es de ~1 px. No usar por debajo de 24 px ni dentro de botones.'],
        ['Formato', 'SVG + CSS en línea (sin reproductor) · Lottie para apps nativas · estático exacto. Reglas de uso en <code>js/respira.js</code>.'],
        ['Reducido', 'Estático exacto (media query dentro del SVG; el controlador usa el estático).'],
        ['Limitaciones', 'Como <code>&lt;img&gt;</code>, Chromium ignora el movimiento reducido: usar en línea o <code>&lt;picture&gt;</code>. Discreto a 32 px. Sin probar en Safari, Firefox, iOS ni Android.']] },
    { id: 'relevo', name: 'Relevo', level: 1, kicker: 'Producto · arranque, acceso y transiciones',
      idea: 'La marca es el ancla: al pasar del arranque al acceso, la firma se asienta en la cabecera y el contenido entra con desplazamientos cortos. Nada compite con ella.',
      subjects: ['lockup-h'], formats: ['html', 'static'], def: 'html',
      ficha: [
        ['Intención', 'Continuidad: el usuario ve que es el mismo lugar mientras cambia la pantalla. Un solo foco.'],
        ['Relación con Céluma', 'Claridad y orden. Usa el mismo vocabulario que la app (confirm_dialog: 150–180 ms, ease-out, sin rebote).'],
        ['Contexto', 'Arranque → inicio de sesión; inicio de sesión → inicio; cierre o caducidad de sesión.'],
        ['Duración', 'Firma 480 ms (cubic-bezier(.2,0,0,1)); contenido 360 ms con 40 ms de escalonado; total ≈ 0,7 s.'],
        ['Bucle / una vez', 'Una vez por cambio de pantalla.'],
        ['Al terminar', 'La firma queda en el lockup A exacto de la cabecera, sin transformaciones residuales.'],
        ['Tamaño', 'Isotipo de 64 px en el arranque a 40 px en la cabecera (la del acceso actual).'],
        ['Formato', 'HTML/CSS/JS con Web Animations (FLIP): <code>js/relevo.js</code>. No aplica Lottie: es movimiento de interfaz.'],
        ['Reducido', 'Sin desplazamientos; fundidos de 120 ms.'],
        ['Limitaciones', 'En la app, Inicio pone la firma sobre la barra lateral teal (conflicto de color con 02): la maqueta no aterriza en teal. Validar con UI/UX antes de producto.']] },
    { id: 'brote', name: 'Brote', level: 2, kicker: 'Bienvenida · primer acceso · splash',
      idea: 'Del «núcleo luminoso» nace la célula: un punto de luz, el núcleo lo envuelve, la célula crece, la luz sale de ella y el nombre se asienta letra a letra.',
      subjects: ['isotipo', 'lockup-h', 'lockup-v'], formats: ['lottie', 'css', 'static'], def: 'lottie',
      ficha: [
        ['Intención', 'Dar la bienvenida con un origen: la vida empieza en el núcleo y la luz llega al final.'],
        ['Relación con Céluma', 'Literal a Notion («célula estilizada con núcleo luminoso»). Crece en calma, sin rebote.'],
        ['Contexto', 'Bienvenida del primer acceso o de una invitación aceptada; splash de la app; apertura corta de vídeo o presentación.'],
        ['Duración', 'Isotipo 2,0 s (movimiento 1,58 s). Con nombre 2,2 s (1,78 s).'],
        ['Bucle / una vez', 'Una vez: repetirlo parecería un proceso.'],
        ['Al terminar', 'Capa estática exacta (maestro o lockup A).'],
        ['Tamaño', 'Isotipo ≥ 96 px; lockup horizontal ≥ 240 px de ancho; vertical ≥ 160 px de alto.'],
        ['Formato', 'Lottie sin máscaras ni mates · SVG + CSS · estático. Solo escalas uniformes, traslaciones y fundidos.'],
        ['Reducido', 'Estático exacto.'],
        ['Limitaciones', 'Por debajo de ~64 px el crecimiento parece un parpadeo. Las letras entran con fundido (no hay máscara). Sin probar en plataformas nativas.']] },
    { id: 'atento', name: 'Atento', level: 3, kicker: 'Interacción · hero del landing · respuesta de la firma',
      idea: 'Humanidad sin mascota: el nucléolo mira hacia el puntero o hacia el elemento con foco, siempre dentro del núcleo; si te acercas, la luz se alarga un poco. En reposo, la mirada del maestro.',
      subjects: ['isotipo', 'lockup-h'], formats: ['js', 'static'], def: 'js',
      ficha: [
        ['Intención', 'Que la marca responda a la persona: atención, no espectáculo.'],
        ['Relación con Céluma', 'Continúa la mirada de Mirada (02) como respuesta, no como guion. El reposo mira arriba a la derecha: hacia la luz.'],
        ['Contexto', 'Hero del landing o de docs (modo completo). Firma de la cabecera: solo los rayos responden (modo micro). No en flujos clínicos.'],
        ['Duración', 'Continua; se asienta en ~0,4 s; vuelve al reposo tras 1,6 s sin actividad.'],
        ['Bucle / una vez', 'Sin bucle: responde a eventos (puntero, toque, foco del teclado).'],
        ['Al terminar', 'Reposo = SVG exacto (se retiran las transformaciones).'],
        ['Tamaño', '≥ 120 px en el hero; micro a 32–48 px.'],
        ['Formato', 'SVG en línea + <code>js/atento.js</code> (sin dependencias). No aplica Lottie.'],
        ['Reducido', 'No instala oyentes: estático exacto.'],
        ['Limitaciones', 'Seguir el puntero puede sentirse invasivo: ganancia baja, radio fijo y retorno al reposo. En táctil solo responde al toque. Sin probar en Safari, Firefox ni con lectores de pantalla (el SVG es decorativo).']] },
    { id: 'orden', name: 'Orden', level: 4, kicker: 'Marca · intro de vídeo, presentaciones, campaña',
      idea: '«Ilumina y ordena»: un campo de células se alinea en una cuadrícula; una se vuelve Céluma, la luz sale de ella y despeja la cuadrícula; queda la firma sobre fondo liso.',
      subjects: ['isotipo', 'lockup-h', 'lockup-v'], formats: ['lottie', 'static'], def: 'lottie', scene: true,
      ficha: [
        ['Intención', 'Contar qué hace Céluma sin palabras: del desorden al orden, y del orden a la claridad.'],
        ['Relación con Céluma', 'Posicionamiento de Notion («ilumina y ordena el proceso patológico»). Campo celular y «grano de papel» del lienzo.'],
        ['Contexto', 'Intro de vídeo, apertura de presentación o webinar, hero de campaña, pantallas de evento. No en la app.'],
        ['Duración', '4,3–4,45 s (movimiento 3,7–3,8 s).'],
        ['Bucle / una vez', 'Una vez.'],
        ['Al terminar', 'Isotipo o lockup exacto sobre fondo liso (regla de 02: nunca sobre campo celular).'],
        ['Tamaño', '16:9 a 1280–1920 px; 1:1 a 1080 px. El lockup ocupa el 58 % del ancho.'],
        ['Formato', 'Lottie (36–50 células de campo; 131–201 KB, 11–18 KB con gzip; sin máscaras) · vídeo MP4/WebM + póster · estático.'],
        ['Reducido', 'Estático; en vídeo, póster o corte al final.'],
        ['Limitaciones', 'Lottie pesado sin comprimir. El campo no debe leerse como micrografía (sin rótulos, tinción ni escala). La cuadrícula no es un indicador de progreso. Sin probar en reproductores nativos.']] },
    { id: 'rebote', name: 'Rebote', level: 5, kicker: 'Marca expresiva · redes, celebración, sticker',
      idea: 'Llega con peso: cae, se aplasta, rebota; el nucléolo sigue por inercia y la luz asoma con impulso. Las letras saltan a su sitio y el acento cae al final.',
      subjects: ['isotipo', 'lockup-h', 'lockup-v'], formats: ['lottie', 'static'], def: 'lottie',
      ficha: [
        ['Intención', 'Personalidad y alegría para celebrar (novedades, hitos) con una célula viva y elástica.'],
        ['Relación con Céluma', 'Humanidad. Deformación temporal propuesta en el 03 (aplasta 15 %, estira 8 %); nunca en reposo ni como identidad.'],
        ['Contexto', 'Redes (novedades, celebraciones), sticker de chat interno, cierre de vídeo o presentación. Nunca en la app ni junto a información clínica.'],
        ['Duración', 'Isotipo 1,87 s (movimiento 1,37 s); con nombre 2,3 s (1,8 s).'],
        ['Bucle / una vez', 'Una vez; como sticker, repetición con 1,5 s de reposo.'],
        ['Al terminar', 'Maestro o lockup exacto.'],
        ['Tamaño', '≥ 160 px; pieza social 1:1 a 1080 px.'],
        ['Formato', 'Lottie · vídeo MP4/WebM · GIF para sticker · estático.'],
        ['Reducido', 'Estático. El GIF no respeta la preferencia: en contextos sensibles, póster.'],
        ['Limitaciones', 'Tono lúdico: no apto para mensajes serios. Cae desde media altura dentro del cuadro: necesita ½ isotipo libre encima. La deformación temporal está aprobada para este motion de marca; no define otro logo estático.']] }
  ];
  var BYID = {}; DIRS.forEach(function (d) { BYID[d.id] = d; });

  function subjectKey(dir, subj, bg) {
    var avail = BYID[dir].subjects;
    var s = avail.indexOf(subj) >= 0 ? subj : avail.indexOf('lockup-h') >= 0 && subj === 'lockup-v' ? 'lockup-h' : avail[0];
    return { subj: s, key: s === 'isotipo' ? 'isotipo' : s + '-' + (bg === 'navy' ? 'neg' : 'pos'), fallback: s !== subj };
  }

  // ------------------------------------------------------------------ reproductor
  function Player(stage, o) {
    this.stage = stage; this.o = o; this.alive = true; this.visible = true; this.t = 0;
    this.slot = document.createElement('div'); this.slot.className = 'm-slot';
    stage.appendChild(this.slot);
    this.note = null;
    players.push(this);
  }
  Player.prototype.layout = function () {
    var o = this.o, W = this.stage.clientWidth, H = this.stage.clientHeight, b = o.box;
    if (!W || !H) return;
    var s, left, top;
    if (o.fit === 'scene') {
      s = Math.min(W / b[2], H / b[3]); left = (W - b[2] * s) / 2; top = (H - b[3] * s) / 2;
    } else if (o.fit === 'px') {                       // tamaño real: o.px = alto del dibujo en píxeles
      s = o.px / o.art[3]; left = 0; top = 0;
    } else {
      var a = o.art, fw = o.fw || 0.84, fh = o.fh || 0.66;
      s = Math.min(W * fw / a[2], H * fh / a[3]);
      left = W / 2 - (a[0] + a[2] / 2 - b[0]) * s; top = H / 2 - (a[1] + a[3] / 2 - b[1]) * s;
    }
    var st = this.slot.style;
    st.width = (b[2] * s) + 'px'; st.height = (b[3] * s) + 'px';
    if (o.fit !== 'px') { st.left = left + 'px'; st.top = top + 'px'; } else { st.position = 'relative'; }
  };
  Player.prototype.load = function () {
    var self = this, o = this.o;
    this.layout();
    if (o.fit !== 'px' && window.ResizeObserver) { this.ro = new ResizeObserver(function () { self.layout(); }); this.ro.observe(this.stage); }
    var kind = reduced() && o.kind !== 'static' ? 'static' : o.kind;
    this.kind = kind;
    if (kind === 'lottie') {
      return getText(o.src).then(function (txt) {
        if (!self.alive) return;
        var data = JSON.parse(txt);
        self.op = data.op; self.dur = data.op / data.fr;
        self.anim = lottie.loadAnimation({ container: self.slot, renderer: 'svg', loop: !!o.loop, autoplay: false, animationData: data,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false } });
        self.anim.setSpeed(S.speed);
        self.anim.addEventListener('enterFrame', function () { self.tick(self.anim.currentFrame / FPS); });
        self.anim.addEventListener('complete', function () { self.onComplete(); });
        self.anim.addEventListener('DOMLoaded', function () {
          self.ready = true;
          // hasta que se reproduce, una pieza de una vez muestra su reposo (el logo exacto), no el cuadro vacío inicial
          if (!o.loop && !self.shouldPlay()) { self.anim.goToAndStop(self.op - 1, true); self.tick((self.op - 1) / FPS); }
          else self.started = true;
          self.sync();
        });
      });
    }
    if (kind === 'css' || kind === 'static' || kind === 'js') {
      var src = kind === 'css' ? o.src : o.staticSrc;
      return getText(src).then(function (txt) {
        if (!self.alive) return;
        var root = self.slot.attachShadow({ mode: 'open' });
        root.innerHTML = '<style>:host{display:block;line-height:0}svg{width:100%;height:100%;display:block;overflow:visible}</style>' + txt;
        self.root = root; self.svg = root.querySelector('svg');
        if (kind === 'css') {
          self.anims = root.getAnimations(); self.dur = o.dur;
          self.anims.forEach(function (a) { a.playbackRate = S.speed; });
          if (!o.loop && !self.shouldPlay()) self.anims.forEach(function (a) { a.pause(); a.currentTime = o.dur * 1000; });
          else self.started = true;
          if (self.anims[0] && !o.loop) self.anims[0].finished.then(function () { self.onComplete(); }).catch(function () {});
          self.ready = true; self.sync(); self.raf();
        } else if (kind === 'js' && window.CelumaAtento) {
          self.atento = CelumaAtento.attach(self.svg, { mode: o.mode || 'full', forceReduced: reduced(), trigger: o.trigger });
          self.ready = true;
        } else { self.ready = true; }
        self.tick(kind === 'static' ? (o.dur || 0) : 0);
      });
    }
    return Promise.resolve();
  };
  Player.prototype.raf = function () {
    var self = this;
    if (!this.alive || this.kind !== 'css') return;
    var a = this.anims && this.anims[0];
    if (a && a.currentTime != null) {
      var t = (a.currentTime / 1000); if (this.o.loop) t = t % this.dur;
      this.tick(Math.min(t, this.dur));
    }
    requestAnimationFrame(function () { self.raf(); });
  };
  Player.prototype.tick = function (t) { this.t = t; if (this.o.onTick) this.o.onTick(t, this.dur || this.o.dur || 0); };
  Player.prototype.onComplete = function () {
    var self = this;
    if (this.o.loop) return;
    if (this.o.onComplete) this.o.onComplete();
    clearTimeout(this.rep);
    if (S.repeat && S.playing && !this.o.noRepeat) this.rep = setTimeout(function () { if (self.alive && S.playing && self.visible) self.restart(); }, 1300 / S.speed);
  };
  Player.prototype.shouldPlay = function () { return S.playing && this.visible && !this.o.manual; };
  Player.prototype.sync = function () {
    if (!this.ready) return;
    if (!this.started && this.shouldPlay() && !this.o.loop && (this.kind === 'lottie' || this.kind === 'css')) { this.started = true; this.restart(); return; }
    if (this.kind === 'lottie') {
      this.anim.setSpeed(S.speed);
      var ended = !this.o.loop && this.anim.currentFrame >= this.op - 1;
      if (this.shouldPlay() && !ended) this.anim.play(); else if (!this.shouldPlay()) this.anim.pause();
    } else if (this.kind === 'css') {
      var self = this;
      this.anims.forEach(function (a) { a.playbackRate = S.speed; if (self.shouldPlay() && a.playState !== 'finished') a.play(); else if (!self.shouldPlay()) a.pause(); });
    }
  };
  Player.prototype.restart = function () {
    clearTimeout(this.rep);
    if (!this.ready) return;
    if (this.kind === 'lottie') { this.anim.goToAndStop(0, true); if (this.shouldPlay()) this.anim.play(); this.tick(0); }
    else if (this.kind === 'css') {
      var self = this;
      this.anims.forEach(function (a) { a.currentTime = 0; if (self.shouldPlay()) a.play(); else a.pause(); });
      if (!this.o.loop && this.anims[0]) this.anims[0].finished.then(function () { self.onComplete(); }).catch(function () {});
    }
  };
  Player.prototype.seek = function (frac) {
    if (!this.ready) return;
    if (this.kind === 'lottie') { var f = Math.min(this.op - 1, Math.round(frac * (this.op - 1))); this.anim.goToAndStop(f, true); this.tick(f / FPS); }
    else if (this.kind === 'css') { var ms = frac * this.dur * 1000; this.anims.forEach(function (a) { a.pause(); a.currentTime = ms; }); this.tick(ms / 1000); }
  };
  Player.prototype.pause = function () { if (this.kind === 'lottie' && this.anim) this.anim.pause(); if (this.anims) this.anims.forEach(function (a) { a.pause(); }); };
  Player.prototype.destroy = function () {
    this.alive = false; clearTimeout(this.rep);
    if (this.anim) this.anim.destroy();
    if (this.atento) this.atento.destroy();
    if (this.ro) this.ro.disconnect();
    this.slot.remove();
    players.splice(players.indexOf(this), 1);
  };

  var io = window.IntersectionObserver ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      players.forEach(function (p) { if (p.stage === e.target) { p.visible = e.isIntersecting; p.sync(); } });
    });
  }, { rootMargin: '120px' }) : null;
  function watch(stage) { if (io) io.observe(stage); }

  // opciones de reproductor para una variante del 03
  function variantOpts(dir, subjInfo, format) {
    var d = BYID[dir], key = dir + '|' + subjInfo.key, v = SPEC.variants[key];
    var st = SPEC.statics && SPEC.statics[key];
    var art = ART[subjInfo.subj];
    if (!v && st) return { kind: format === 'static' ? 'static' : 'js', staticSrc: st.file, box: st.box, art: art, dur: 0, mode: subjInfo.subj === 'isotipo' ? 'full' : 'full' };
    var o = { box: v.box, art: art, loop: v.loop, dur: v.op / FPS, staticSrc: v.static, fit: d.scene ? 'scene' : 'art', variant: v };
    if (format === 'css' && v.css_svg) { o.kind = 'css'; o.src = v.css_svg; }
    else if (format === 'static') o.kind = 'static';
    else { o.kind = 'lottie'; o.src = v.lottie; }
    return o;
  }

  // ------------------------------------------------------------------ índice visual y artículos por dirección
  function level(n) { var s = ''; for (var i = 1; i <= 5; i++) s += i <= n ? '●' : '<span>●</span>'; return '<span class="m-level" aria-label="Expresión ' + n + ' de 5">' + s + '</span>'; }

  function buildOverview() {
    var host = $('#m-overview');
    DIRS.forEach(function (d) {
      var a = document.createElement('a');
      a.className = 'm-ov'; a.href = '#d-' + d.id;
      a.innerHTML = '<div class="m-stage" data-bg="' + S.bg + '"></div><b>' + d.name + '</b>' + level(d.level) + '<small>' + esc(d.kicker) + '</small>';
      host.appendChild(a);
      d.ovStage = $('.m-stage', a);
    });
  }

  function buildArticles() {
    var host = $('#m-directions');
    DIRS.forEach(function (d) {
      var art = document.createElement('article');
      art.className = 'm-dir'; art.id = 'd-' + d.id; art.setAttribute('aria-labelledby', 'h-' + d.id);
      var fm = { css: 'SVG + CSS', lottie: 'Lottie', static: 'Estático', js: 'SVG + JS', html: 'HTML + JS' };
      art.innerHTML =
        '<div class="m-dir-head"><h2 id="h-' + d.id + '">' + d.name + '</h2>' + level(d.level) + '<span class="m-kicker">' + esc(d.kicker) + '</span></div>' +
        '<p class="m-idea">' + esc(d.idea) + '</p>' +
        '<div class="m-dir-body"><div>' +
        '<div class="m-stage' + (d.scene ? ' m-wide' : '') + '" data-bg="' + S.bg + '"></div>' +
        '<div class="m-transport"><button class="m-btn" type="button" data-p="toggle">Pausar</button><button class="m-btn" type="button" data-p="restart">Reiniciar</button>' +
        '<span class="m-readout" aria-live="off"></span></div>' +
        '<input class="m-range" type="range" min="0" max="1000" value="0" aria-label="Posición de ' + d.name + '">' +
        '<div class="m-formats" role="group" aria-label="Formato de ' + d.name + '"><span class="m-lab">Formato</span>' +
        d.formats.map(function (f) { return '<button class="m-btn" type="button" data-format="' + f + '" aria-pressed="' + (f === d.def) + '">' + fm[f] + '</button>'; }).join('') + '</div>' +
        '</div><div class="m-ficha"><dl>' + d.ficha.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('') + '</dl></div></div>' +
        '<div class="m-timeline" hidden><h3>Línea de tiempo</h3><div class="m-tl"></div></div>' +
        '<div class="m-sizes"><h3>Tamaños reales</h3><div class="m-sizecells" data-bg="' + S.bg + '"></div></div>' +
        '<div class="m-dl"><h3>Archivos de ' + d.name + '</h3><ul></ul></div>';
      host.appendChild(art);
      d.el = art; d.format = d.def;
      $$('[data-format]', art).forEach(function (b) {
        b.addEventListener('click', function () {
          d.format = b.dataset.format;
          $$('[data-format]', art).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          mountDirection(d);
        });
      });
      $('[data-p="toggle"]', art).addEventListener('click', function (e) {
        var p = d.player; if (!p) return;
        p.o.manual = !p.o.manual;
        e.target.textContent = p.o.manual ? 'Reproducir' : 'Pausar';
        if (p.o.manual) p.pause(); else p.sync();
      });
      $('[data-p="restart"]', art).addEventListener('click', function () {
        if (d.id === 'relevo' && d.relevoMini) return d.relevoMini.restart();
        if (d.player) d.player.restart();
      });
      $('.m-range', art).addEventListener('input', function (e) {
        var p = d.player; if (!p) return;
        p.o.manual = true; $('[data-p="toggle"]', art).textContent = 'Reproducir';
        p.seek(e.target.value / 1000);
      });
    });
  }

  function timelineHTML(v) {
    var total = v.op / FPS;
    var rows = v.timeline.map(function (r) {
      var l = (r[1] / total) * 100, w = Math.max(0.8, ((r[2] - r[1]) / total) * 100);
      return '<div class="m-tl-row"><span>' + esc(r[0]) + '</span><div class="m-tl-track"><span class="m-tl-bar" data-k="' + r[3] + '" style="left:' + l.toFixed(2) + '%;width:' + w.toFixed(2) + '%"></span></div></div>';
    }).join('');
    return rows + '<div class="m-tl-axis"><span></span><div><span>0 s</span><span>' + fmtS(total / 2) + '</span><span>' + fmtS(total) + '</span></div></div>';
  }

  function mountDirection(d) {
    var art = d.el, stage = $('.m-stage', art);
    if (d.player) d.player.destroy(); d.player = null;
    if (d.relevoMini) { d.relevoMini.destroy(); d.relevoMini = null; }
    stage.dataset.bg = S.bg; stage.innerHTML = '';
    var si = subjectKey(d.id, S.subject, S.bg);
    var interactive = d.id === 'relevo' || d.id === 'atento';
    $('.m-range', art).hidden = interactive; $('[data-p="toggle"]', art).hidden = interactive;
    if (si.fallback && d.id !== 'relevo') { var n = document.createElement('span'); n.className = 'm-note'; n.textContent = 'Sin versión ' + (S.subject === 'lockup-v' ? 'vertical' : S.subject === 'lockup-h' ? 'con nombre' : 'isotipo') + ': se muestra ' + (si.subj === 'isotipo' ? 'el isotipo' : 'la horizontal'); stage.appendChild(n); }
    var readout = $('.m-readout', art), range = $('.m-range', art), tl = $('.m-timeline', art);
    var v = SPEC.variants[d.id + '|' + si.key];
    if (v) { tl.hidden = false; $('.m-tl', art).innerHTML = timelineHTML(v); } else tl.hidden = true;
    var head = null;
    if (v) { head = document.createElement('span'); head.className = 'm-tl-head'; $$('.m-tl-track', art)[0] && $('.m-tl', art).appendChild(head); }
    var onTick = function (t, dur) {
      readout.textContent = dur ? fmtS(Math.min(t, dur)) + ' / ' + fmtS(dur) : '';
      if (dur && document.activeElement !== range) range.value = Math.round(Math.min(1, t / dur) * 1000);
      if (head && dur) {
        var tracks = $$('.m-tl-track', art); if (!tracks.length) return;
        var r0 = tracks[0].getBoundingClientRect(), host = $('.m-tl', art).getBoundingClientRect();
        head.style.left = (r0.left - host.left + (t / dur) * r0.width) + 'px';
        head.style.top = (tracks[0].offsetTop - 2) + 'px';
        head.style.height = (tracks[tracks.length - 1].offsetTop + tracks[tracks.length - 1].offsetHeight - tracks[0].offsetTop + 4) + 'px';
      }
    };
    range.disabled = false;
    if (d.id === 'relevo') {
      range.disabled = true;
      readout.textContent = reduced() ? 'Reducido: fundidos de 120 ms' : 'Arranque → acceso · se repite';
      d.relevoMini = relevoMini(stage, si);
      return;
    }
    if (d.id === 'atento') {
      range.disabled = true;
      var o = variantOpts('atento', si, d.format === 'static' ? 'static' : 'js');
      o.onTick = function () {}; o.mode = 'full';
      d.player = new Player(stage, o); watch(stage); d.player.load();
      readout.textContent = reduced() || d.format === 'static' ? 'Estático exacto' : 'Interactiva: mueva el puntero o recorra la página con Tab';
      return;
    }
    var fmt = d.format;
    if (fmt === 'css' && !(v && v.css_svg)) fmt = 'lottie';
    var opts = variantOpts(d.id, si, fmt);
    opts.onTick = onTick;
    d.player = new Player(stage, opts); watch(stage);
    d.player.load();
  }

  function mountOverview(d) {
    if (d.ovPlayer) d.ovPlayer.destroy(); if (d.ovRelevo) { d.ovRelevo.destroy(); d.ovRelevo = null; }
    d.ovStage.dataset.bg = S.bg;
    var si = subjectKey(d.id, 'isotipo', S.bg);
    if (d.id === 'relevo') { d.ovRelevo = relevoMini(d.ovStage, subjectKey('relevo', 'lockup-h', S.bg)); return; }
    var o = variantOpts(d.id, si, d.id === 'atento' ? 'js' : d.def);
    o.fh = 0.72; o.fw = 0.8;
    d.ovPlayer = new Player(d.ovStage, o); watch(d.ovStage); d.ovPlayer.load();
  }

  // ------------------------------------------------------------------ tamaños reales
  var SIZES = {
    respira: { fmt: 'css', rows: [['isotipo', [24, 32, 48, 64, 96]], ['lockup-h', [32, 40]]] },
    brote: { fmt: 'css', rows: [['isotipo', [48, 64, 96, 160]], ['lockup-h', [48, 72]], ['lockup-v', [120, 160]]] },
    rebote: { fmt: 'lottie', rows: [['isotipo', [64, 96, 160]], ['lockup-v', [160]]] },
    atento: { fmt: 'js', rows: [['isotipo', [48, 120, 200]], ['lockup-h', [40]]] },
    orden: { fmt: 'lottie', scene: true, rows: [['lockup-h', [320, 480]]] },
    relevo: { note: 'Tamaños de uso: isotipo de 64 px en el arranque y lockup de 40 px de alto en la cabecera. Véase «En contexto → Arranque y acceso».' }
  };
  function mountSizes(d) {
    var host = $('.m-sizecells', d.el);
    (d.sizePlayers || []).forEach(function (p) { p.destroy(); });
    d.sizePlayers = []; host.innerHTML = ''; host.dataset.bg = S.bg;
    var cfg = SIZES[d.id];
    if (cfg.note) { host.innerHTML = '<p class="m-muted" style="margin:0">' + cfg.note + '</p>'; return; }
    cfg.rows.forEach(function (row) {
      var si = subjectKey(d.id, row[0], S.bg);
      row[1].forEach(function (px) {
        var o = variantOpts(d.id, si, cfg.fmt);
        var fig = document.createElement('figure');
        var box = o.box, art = o.art;
        var h, w, s;
        var avail = Math.max(120, host.clientWidth - 30), shrunk = false;
        if (cfg.scene) { w = Math.min(px, avail); shrunk = w < px; s = w / box[2]; h = box[3] * s; o.fit = 'scene'; }
        else { s = px / art[3]; w = box[2] * s; h = box[3] * s; o.fit = 'px'; o.px = px; }
        fig.innerHTML = '<div class="m-sizehost" style="width:' + w.toFixed(1) + 'px;height:' + h.toFixed(1) + 'px;position:relative"></div><figcaption>' +
          (cfg.scene ? px + ' px de ancho' + (shrunk ? ' (reducido a ' + Math.round(w) + ' px en esta pantalla)' : '') : (row[0] === 'isotipo' ? 'isotipo ' : row[0] === 'lockup-h' ? 'horizontal · alto ' : 'vertical · alto ') + px + ' px') + '</figcaption>';
        host.appendChild(fig);
        var stg = $('.m-sizehost', fig);
        if (o.kind === 'js') o.mode = px <= 48 ? 'micro' : 'full';
        var p = new Player(stg, o); p.load(); watch(stg); d.sizePlayers.push(p);
      });
    });
  }

  // ------------------------------------------------------------------ descargas por dirección
  function mountDownloads(d) {
    var ul = $('.m-dl ul', d.el);
    var items = (FILES && FILES.files || []).filter(function (f) { return f.direction === d.id; });
    ul.innerHTML = items.length ? items.map(fileLi).join('') : '<li class="m-muted">Sin archivos generados todavía.</li>';
  }
  function fileLi(f) {
    var kb = function (b) { return b >= 1048576 ? (b / 1048576).toFixed(2).replace('.', ',') + ' MB' : (b / 1024).toFixed(1).replace('.', ',') + ' KB'; };
    return '<li><span class="m-chip' + (f.kind === 'Lottie' || f.kind === 'SVG + CSS' ? ' ok' : '') + '">' + esc(f.kind) + '</span><a href="' + esc(f.path) + '" download>' +
      esc(f.path.split('/').pop()) + '</a> <small>' + kb(f.bytes) + (f.gzip ? ' · ' + kb(f.gzip) + ' gzip' : '') + (f.note ? ' · ' + esc(f.note) : '') + '</small></li>';
  }

  // ------------------------------------------------------------------ Relevo (mini y prototipo)
  function lockupImgHTML(si) {
    var st = SPEC.statics['relevo|' + si.key];
    return st.file;
  }
  function relevoMini(stage, si) {
    var alive = true, timers = [];
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden';
    var navy = S.bg === 'navy';
    wrap.innerHTML = '<div data-h style="position:absolute;left:0;right:0;top:0;height:18%;background:' + (navy ? '#13263a' : '#fff') + ';box-shadow:0 1px 8px rgba(0,0,0,.08);opacity:0"></div>' +
      '<div data-slotH style="position:absolute;left:4%;top:4.5%;height:9%;aspect-ratio:2093/678"></div>' +
      '<div data-lk style="position:absolute;line-height:0"></div>' +
      '<div data-card style="position:absolute;left:32%;right:32%;top:30%;bottom:14%;background:' + (navy ? '#13263a' : '#fff') + ';border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,.12);opacity:0"></div>' +
      '<div data-status style="position:absolute;left:0;right:0;top:64%;text-align:center;font-size:11px;font-weight:600;color:' + (navy ? '#c9d3de' : '#374151') + '">Verificando tu sesión…</div>';
    stage.appendChild(wrap);
    var lk = $('[data-lk]', wrap), slotH = $('[data-slotH]', wrap);
    getText(lockupImgHTML(si)).then(function (txt) { if (alive) { lk.innerHTML = txt; var s = lk.querySelector('svg'); s.style.width = '100%'; s.style.height = '100%'; } });
    function placeCenter() {
      var W = stage.clientWidth, H = stage.clientHeight, h = H * 0.2, w = h * 2093 / 678;
      lk.style.transform = ''; lk.style.left = (W - w) / 2 + 'px'; lk.style.top = (H * 0.36 - h / 2) + 'px'; lk.style.width = w + 'px'; lk.style.height = h + 'px';
    }
    function placeHeader() {
      var r = slotH.getBoundingClientRect(), p = stage.getBoundingClientRect();
      lk.style.left = (r.left - p.left) + 'px'; lk.style.top = (r.top - p.top) + 'px'; lk.style.width = r.width + 'px'; lk.style.height = r.height + 'px';
    }
    function run() {
      if (!alive) return;
      placeCenter();
      $('[data-h]', wrap).style.opacity = 0; $('[data-card]', wrap).style.opacity = 0; $('[data-status]', wrap).style.opacity = 1;
      timers.push(setTimeout(function () {
        if (!alive) return;
        var red = reduced();
        $('[data-status]', wrap).animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' });
        CelumaRelevo.move(lk, placeHeader, { reduced: red, delay: 60 });
        $('[data-h]', wrap).animate([{ opacity: 0 }, { opacity: 1 }], { duration: red ? 120 : 260, delay: red ? 0 : 240, fill: 'forwards' });
        CelumaRelevo.enter([$('[data-card]', wrap)], { reduced: red, delay: red ? 0 : 300, dy: 10 }).then(function () { $('[data-card]', wrap).style.opacity = 1; });
        timers.push(setTimeout(function () { if (alive && S.repeat && S.playing) run(); }, 3200 / S.speed));
      }, 1400 / S.speed));
    }
    run();
    return { restart: function () { timers.forEach(clearTimeout); timers = []; run(); },
      destroy: function () { alive = false; timers.forEach(clearTimeout); wrap.remove(); } };
  }

  // ------------------------------------------------------------------ contextos
  function fitNative(fit, native, W, H) {
    function apply() { var s = fit.clientWidth / W; native.style.transform = 'scale(' + s + ')'; }
    native.style.width = W + 'px'; native.style.height = H + 'px';
    apply(); if (window.ResizeObserver) new ResizeObserver(apply).observe(fit);
  }
  function screen(W, H, cap, phone) {
    var f = document.createElement('figure'); f.className = 'm-screen' + (phone ? ' phone' : '');
    f.innerHTML = '<div class="m-fit"><div class="m-native"></div><span class="m-mocktag">Maqueta · datos ficticios</span></div><figcaption>' + cap + '</figcaption>';
    var fit = $('.m-fit', f), nat = $('.m-native', f);
    fit.style.aspectRatio = W + ' / ' + H;          // la altura se conoce antes de medir: el ancla no salta
    setTimeout(function () { fitNative(fit, nat, W, H); }, 0);
    return { fig: f, nat: nat };
  }
  function respiraHost(nat, px) {
    var d = document.createElement('div');
    d.innerHTML = '<div data-respira-logo style="width:' + (px * 557 / 670 * 570 / 557).toFixed(1) + 'px;height:' + (px * 692 / 670).toFixed(1) + 'px;margin:0 auto 14px"></div><div class="mk-status" data-respira-text></div>';
    nat.appendChild(d);
    return d;
  }
  var CTX = [
    { id: 'carga', label: 'Carga breve', build: ctxCarga },
    { id: 'espera', label: 'Espera larga', build: ctxEspera },
    { id: 'acceso', label: 'Arranque y acceso', build: ctxAcceso },
    { id: 'bienvenida', label: 'Bienvenida', build: ctxBienvenida },
    { id: 'landing', label: 'Hero del landing', build: ctxLanding },
    { id: 'material', label: 'Material de marca', build: ctxMaterial }
  ];
  function buildContexts() {
    var tabs = $('#m-ctx-tabs'), panels = $('#m-ctx-panels');
    CTX.forEach(function (c, i) {
      var b = document.createElement('button');
      b.className = 'm-tab'; b.type = 'button'; b.id = 'tab-' + c.id; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'ctx-' + c.id);
      b.setAttribute('aria-selected', String(i === 0)); b.tabIndex = i === 0 ? 0 : -1; b.textContent = c.label;
      tabs.appendChild(b);
      var p = document.createElement('div'); p.className = 'm-ctx'; p.id = 'ctx-' + c.id; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', b.id);
      p.hidden = i !== 0; panels.appendChild(p); c.panel = p;
      b.addEventListener('click', function () { selectCtx(c.id); });
      b.addEventListener('keydown', function (e) {
        var k = e.key, j = CTX.indexOf(c);
        if (k === 'ArrowRight' || k === 'ArrowLeft') { var n = CTX[(j + (k === 'ArrowRight' ? 1 : CTX.length - 1)) % CTX.length]; selectCtx(n.id); $('#tab-' + n.id).focus(); e.preventDefault(); }
      });
    });
    var want = (location.hash.match(/^#ctx-(\w+)/) || [])[1];
    selectCtx(want && CTX.some(function (c) { return c.id === want; }) ? want : 'carga');
  }
  function selectCtx(id) {
    CTX.forEach(function (c) {
      var on = c.id === id;
      $('#tab-' + c.id).setAttribute('aria-selected', String(on)); $('#tab-' + c.id).tabIndex = on ? 0 : -1;
      c.panel.hidden = !on;
      if (on && !c.built) { c.built = true; c.build(c.panel); }
      if (!on && c.built && c.teardown) { c.teardown(); c.built = false; c.panel.innerHTML = ''; }
    });
  }
  function side(html) { var d = document.createElement('aside'); d.className = 'm-ctx-side'; d.innerHTML = html; return d; }

  function ctxCarga(panel) {
    var sc = screen(960, 560, 'Vista previa de un informe de ejemplo en un panel de 200+ px · Respira a 48 px');
    sc.nat.innerHTML = '<div style="position:absolute;inset:0;background:#fbf6ec;padding:28px">' +
      '<div class="mk-header"><h4>Informe DEMO-0042</h4><p>Vista previa · ejemplo sin validez clínica</p></div>' +
      '<div class="mk-card" style="margin-top:14px;padding:18px"><div class="mk-panel" data-panel style="height:300px;position:relative;display:grid;place-items:center">' +
      '<div data-loader hidden></div><div data-content hidden style="position:absolute;inset:18px;display:grid;gap:12px;align-content:start">' +
      '<div class="mk-bar" style="width:40%;height:14px;background:#d9e8e5"></div><div class="mk-bar"></div><div class="mk-bar" style="width:86%"></div><div class="mk-bar" style="width:92%"></div><div class="mk-bar" style="width:60%"></div>' +
      '<p class="mk-sub" style="text-align:left;margin:6px 0 0">Contenido ficticio de la vista previa</p></div></div></div></div>';
    var loaderEl = $('[data-loader]', sc.nat); var host = respiraHost(loaderEl, 48);
    loaderEl.appendChild(host);
    var content = $('[data-content]', sc.nat);
    var info = side('<h3>Carga breve · Respira</h3><p>La vista previa tarda lo que tarde el servidor. El isotipo solo aparece si la espera supera 400 ms y, una vez visible, se queda al menos 600 ms: una carga rápida no parpadea.</p>' +
      '<div class="m-ctx-actions"><button class="m-btn" type="button" data-sim="300">Carga de 0,3 s</button><button class="m-btn" type="button" data-sim="1500">Carga de 1,5 s</button><button class="m-btn" type="button" data-sim="4200">Carga de 4,2 s</button></div>' +
      '<ul><li>El texto (<code>role="status"</code>) dice qué pasa; el logo solo dice que hay actividad.</li><li>Al terminar, el isotipo se funde en 120 ms y el contenido aparece: no hay «hecho» y nada espera a la animación.</li><li>En botones y chips no se usa el isotipo: conservan su indicador.</li></ul>' +
      '<p class="m-muted" id="carga-log">Pulse una duración para simular.</p>');
    panel.appendChild(sc.fig); panel.appendChild(info);
    Promise.all([getText('svg/respira-isotipo.svg'), getText('estaticos/respira-isotipo.svg')]).then(function (t) {
      $$('[data-sim]', info).forEach(function (b) {
        b.addEventListener('click', function () {
          var ms = +b.dataset.sim, t0 = performance.now();
          content.hidden = true; loaderEl.hidden = false;
          var l = CelumaRespira.loader(host, { svgText: t[0], staticText: t[1], forceReduced: reduced() });
          l.start('Preparando vista previa…');
          setTimeout(function () {
            l.done('').then(function () {
              loaderEl.hidden = true; content.hidden = false;
              $('#carga-log').textContent = 'Carga simulada de ' + fmtS(ms / 1000) + ' · contenido visible a los ' + fmtS((performance.now() - t0) / 1000) +
                (ms < 400 ? ' · el isotipo no llegó a mostrarse' : ' · el isotipo se fundió en 120 ms; el contenido no esperó a la animación');
            });
          }, ms);
        });
      });
      $('[data-sim="1500"]', info).click();
    });
  }

  function ctxEspera(panel) {
    var sc = screen(960, 560, 'Espera larga con texto de estado · Respira a 64 px · se detiene tras 3 ciclos');
    sc.nat.innerHTML = '<div style="position:absolute;inset:0;background:rgba(13,27,42,.30);display:grid;place-items:center">' +
      '<div class="mk-card" style="width:520px;padding:30px 30px 24px;text-align:center"><div data-host></div>' +
      '<p class="mk-sub" data-elapsed style="margin:6px 0 16px">Tiempo transcurrido: 0:00</p>' +
      '<button class="mk-btn ghost" type="button" tabindex="-1">Cancelar</button></div></div>';
    var host = respiraHost($('[data-host]', sc.nat), 64);
    var info = side('<h3>Espera larga · Respira</h3><p>Operación de ejemplo (exportación ficticia). El texto informa en cada momento; el isotipo respira 3 veces (~11 s) y se queda en reposo: sigue la espera, pero ya no distrae (WCAG 2.2.2).</p>' +
      '<div class="m-ctx-actions"><button class="m-btn primary" type="button" data-run>Simular 18 s</button></div>' +
      '<ul><li>Nada en el logo representa avance ni resultado.</li><li>Al terminar, el resultado se comunica con texto y el logo desaparece.</li><li>En la app real, «Firmando y generando PDF oficial…» ya comunica el estado en el botón: si hubiera una capa bloqueante, se aplicaría esta regla.</li></ul>' +
      '<p class="m-muted" data-state>Estado del isotipo: —</p>');
    panel.appendChild(sc.fig); panel.appendChild(info);
    var timer = 0, tick = 0;
    Promise.all([getText('svg/respira-isotipo.svg'), getText('estaticos/respira-isotipo.svg')]).then(function (t) {
      function runSim() {
        clearInterval(tick); clearTimeout(timer);
        var l = CelumaRespira.loader(host, { svgText: t[0], staticText: t[1], forceReduced: reduced(), delay: 0 });
        var t0 = performance.now();
        l.start('Preparando la exportación de ejemplo…');
        tick = setInterval(function () {
          var s = (performance.now() - t0) / 1000;
          $('[data-elapsed]', sc.nat).textContent = 'Tiempo transcurrido: 0:' + String(Math.floor(s)).padStart(2, '0');
          if (s > 6 && s < 6.2) l.update('Sigue en curso. Puede tardar un poco más.');
          $('[data-state]', info).textContent = 'Estado del isotipo: ' + (host.dataset.respira === 'reposo' ? 'en reposo (3 ciclos cumplidos)' : host.dataset.respira === 'activo' ? 'respira' : '—');
        }, 200);
        timer = setTimeout(function () {
          clearInterval(tick);
          l.done('Exportación de ejemplo lista (simulación).', { keepText: true }).then(function () {
            $('[data-state]', info).textContent = 'Estado del isotipo: retirado; el resultado está en el texto';
          });
        }, 18000);
      }
      $('[data-run]', info).addEventListener('click', runSim);
      runSim();
    });
    CTX[1].teardown = function () { clearInterval(tick); clearTimeout(timer); };
  }

  function ctxAcceso(panel) {
    var sc = screen(1280, 800, 'Arranque → acceso → inicio · Relevo (FLIP) con Respira en el arranque');
    var navy = false;
    sc.nat.innerHTML = '<div data-root style="position:absolute;inset:0;background:#fbf6ec">' +
      '<div data-header style="position:absolute;left:0;right:0;top:0;height:64px;background:#fff;box-shadow:0 1px 12px rgba(0,0,0,.08);opacity:0"></div>' +
      '<div data-hslot style="position:absolute;left:24px;top:12px;height:40px;width:' + (40 * 2093 / 678).toFixed(1) + 'px"></div>' +
      '<div data-lk style="position:absolute;line-height:0"><div data-iso style="position:absolute;left:0;top:0;height:100%;aspect-ratio:557/678"></div><div data-full style="position:absolute;inset:0"></div></div>' +
      '<div data-status class="mk-status" style="position:absolute;left:0;right:0;top:470px" role="status">Verificando tu sesión…</div>' +
      '<div data-card class="mk-card" style="position:absolute;left:380px;top:150px;width:520px;padding:32px;opacity:0;display:grid;gap:14px">' +
      '<h4 style="margin:0;text-align:center;font:800 26px/1.2 var(--celuma-font-display)">Iniciar sesión</h4><p class="mk-sub" style="margin:0 0 6px">Texto de ejemplo</p>' +
      '<div class="mk-field">Usuario o email</div><div class="mk-field">Contraseña</div><button class="mk-btn" type="button" tabindex="-1">Iniciar sesión</button></div>' +
      '<div data-home style="position:absolute;left:24px;right:24px;top:88px;display:grid;gap:12px;opacity:0">' +
      '<div class="mk-header"><h4>Inicio</h4><p>Resumen de ejemplo · Laboratorio Demo Norte</p></div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">' + [0, 1, 2].map(function () { return '<div class="mk-card" data-tile style="height:120px;padding:18px"><div class="mk-bar" style="width:50%"></div><div class="mk-bar" style="width:30%;height:22px;margin-top:18px;background:#d9e8e5"></div></div>'; }).join('') + '</div>' +
      '<div class="mk-card" data-tile style="height:260px"></div></div></div>';
    var info = side('<h3>Arranque y acceso · Relevo</h3><p>La firma es el ancla. Mientras se verifica la sesión, el isotipo respira; cuando hay respuesta, completa el aliento y la firma se asienta en la cabecera (480 ms). El contenido entra con 12 px y 40 ms de escalonado.</p>' +
      '<div class="m-ctx-actions"><button class="m-btn primary" type="button" data-go="acceso">Sesión no iniciada → acceso</button><button class="m-btn" type="button" data-go="inicio">Iniciar sesión → inicio</button><button class="m-btn" type="button" data-go="reset">Volver al arranque</button></div>' +
      '<ul><li>Solo traslación y escala uniforme del lockup estático exacto; al terminar no queda ninguna transformación.</li><li>Con movimiento reducido: fundidos de 120 ms, sin desplazamientos.</li><li>En la app actual, Inicio pone la firma en la barra lateral teal (conflicto de color con 02). Esta maqueta la mantiene en una cabecera blanca: es un supuesto a validar con UI/UX.</li></ul>');
    panel.appendChild(sc.fig); panel.appendChild(info);
    var R = sc.nat, lk = $('[data-lk]', R), iso = $('[data-iso]', R), full = $('[data-full]', R), state = 'arranque', respiraRoot = null;
    Promise.all([getText('svg/respira-isotipo.svg'), getText('estaticos/relevo-lockup-h-pos.svg'), getText('estaticos/respira-isotipo.svg')]).then(function (t) {
      function center() {
        lk.style.left = (640 - 64 * 2093 / 678 / 2) + 'px'; lk.style.top = '330px'; lk.style.height = '64px'; lk.style.width = (64 * 2093 / 678) + 'px';
      }
      function reset() {
        state = 'arranque';
        center();
        full.innerHTML = t[1]; $('svg', full).style.cssText = 'width:100%;height:100%';
        // el isotipo del lockup respira: se superpone el SVG + CSS en la misma caja (mismo dibujo en reposo)
        iso.style.height = '100%'; iso.innerHTML = '';
        respiraRoot = iso.attachShadow ? (iso.shadowRoot || iso.attachShadow({ mode: 'open' })) : null;
        if (respiraRoot) respiraRoot.innerHTML = '<style>svg{width:100%;height:100%;display:block}</style>' + (reduced() ? t[2] : t[0]);
        var isoInFull = $('#isotipo', full); if (isoInFull) isoInFull.style.visibility = 'hidden';
        // la caja del isotipo animado: 60 28 570 692 ; la del lockup: 69 38 2093 678 → alinear el dibujo
        var k = 64 / 678; iso.style.left = ((60 - 69) * k) + 'px'; iso.style.top = ((28 - 38) * k) + 'px'; iso.style.width = (570 * k) + 'px'; iso.style.height = (692 * k) + 'px';
        $('[data-header]', R).style.opacity = 0; $('[data-card]', R).style.opacity = 0; $('[data-home]', R).style.opacity = 0; $('[data-status]', R).style.opacity = 1;
        $('[data-root]', R).getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
      }
      function toAcceso() {
        if (state !== 'arranque') return; state = 'acceso';
        var red = reduced();
        (respiraRoot ? CelumaRespira.settle(respiraRoot, 280) : Promise.resolve()).then(function () {
          if (respiraRoot) respiraRoot.innerHTML = ''; var isoInFull = $('#isotipo', full); if (isoInFull) isoInFull.style.visibility = '';
          $('[data-status]', R).animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' });
          var hs = $('[data-hslot]', R);
          CelumaRelevo.move(lk, function () { lk.style.left = hs.style.left; lk.style.top = hs.style.top; lk.style.height = hs.style.height; lk.style.width = hs.style.width; }, { reduced: red, delay: 60 });
          $('[data-header]', R).animate([{ opacity: 0 }, { opacity: 1 }], { duration: red ? 120 : 260, delay: red ? 0 : 240, fill: 'forwards' });
          CelumaRelevo.enter([$('[data-card]', R)], { reduced: red, delay: red ? 0 : 320, dy: 16, duration: 400 }).then(function () { $('[data-card]', R).style.opacity = 1; });
        });
      }
      function toInicio() {
        if (state === 'arranque') { toAcceso(); setTimeout(toInicio, 1300); return; }
        if (state !== 'acceso') return; state = 'inicio';
        var red = reduced();
        CelumaRelevo.leave([$('[data-card]', R)], { reduced: red }).then(function () {
          $('[data-card]', R).style.opacity = 0;
          $('[data-home]', R).style.opacity = 1;
          CelumaRelevo.enter($$('.mk-header, [data-tile]', $('[data-home]', R)), { reduced: red, stagger: 40, dy: 12 });
        });
      }
      $$('[data-go]', info).forEach(function (b) {
        b.addEventListener('click', function () { var g = b.dataset.go; if (g === 'reset') reset(); else if (g === 'acceso') toAcceso(); else toInicio(); });
      });
      reset();
    });
  }

  function ctxBienvenida(panel) {
    var ph = screen(390, 844, 'Móvil 390 × 844 · Brote con lockup vertical', true);
    var dk = screen(1280, 800, 'Escritorio · Brote con lockup horizontal sobre la tarjeta');
    ph.nat.innerHTML = '<div style="position:absolute;inset:0;background:#fbf6ec;display:grid;align-content:center;justify-items:center;gap:22px;padding:30px">' +
      '<div data-stage style="position:relative;width:260px;height:300px"></div>' +
      '<h4 style="margin:0;text-align:center;font:800 26px/1.2 var(--celuma-font-display)">Te damos la bienvenida a Laboratorio Demo Norte</h4>' +
      '<p class="mk-sub" style="margin:0">Invitación aceptada · texto de ejemplo</p><button class="mk-btn" type="button" tabindex="-1" style="width:100%">Continuar</button></div>';
    dk.nat.innerHTML = '<div style="position:absolute;inset:0;background:#fbf6ec;display:grid;place-items:center">' +
      '<div style="display:grid;gap:26px;justify-items:center"><div data-stage style="position:relative;width:420px;height:150px"></div>' +
      '<div class="mk-card" style="width:560px;padding:30px;text-align:center"><h4 style="margin:0;font:800 26px/1.2 var(--celuma-font-display)">Te damos la bienvenida</h4>' +
      '<p class="mk-sub">Laboratorio Demo Norte · texto de ejemplo</p><button class="mk-btn" type="button" tabindex="-1">Ir al inicio</button></div></div></div>';
    var info = side('<h3>Bienvenida · Brote</h3><p>Solo la primera vez (o al aceptar una invitación): del núcleo luminoso nace la célula y el nombre se asienta. Luego, la pantalla queda quieta.</p>' +
      '<div class="m-ctx-actions"><button class="m-btn primary" type="button" data-replay>Reproducir bienvenida</button></div>' +
      '<ul><li>Una vez; no se repite en cada inicio de sesión.</li><li>Sin máscaras ni mates: Lottie más portable que Trazo o Enfoque.</li><li>El mensaje de bienvenida es texto; el logo no confirma el alta de la cuenta.</li></ul>');
    var wrap = document.createElement('div'); wrap.className = 'm-screens'; wrap.appendChild(ph.fig); wrap.appendChild(dk.fig);
    panel.appendChild(wrap); panel.appendChild(info);
    var ps = [];
    function make() {
      ps.forEach(function (p) { p.destroy(); }); ps = [];
      [[ph.nat, 'lockup-v'], [dk.nat, 'lockup-h']].forEach(function (x) {
        var stg = $('[data-stage]', x[0]); var si = { subj: x[1], key: x[1] + '-pos' };
        var o = variantOpts('brote', si, 'lottie'); o.noRepeat = true; o.manual = false; o.fw = 1; o.fh = 1;
        var p = new Player(stg, o); ps.push(p);
        setTimeout(function () { p.layout(); p.load(); }, 30);
      });
    }
    $('[data-replay]', info).addEventListener('click', make);
    make();
    CTX[3].teardown = function () { ps.forEach(function (p) { p.destroy(); }); };
  }

  function ctxLanding(panel) {
    var sc = screen(1280, 720, 'Hero del landing · Atento: mueva el puntero o recorra los botones con Tab');
    sc.nat.innerHTML = '<div style="position:absolute;inset:0;background:#fbf6ec;overflow:hidden">' +
      '<div style="position:absolute;right:-120px;top:-160px;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(73,182,173,.18),rgba(73,182,173,.04) 40%,transparent 70%)"></div>' +
      '<div style="position:absolute;left:0;right:0;top:0;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 48px">' +
      '<a href="#ctx-landing" data-brand style="display:block;height:36px;width:' + (36 * 2093 / 678).toFixed(1) + 'px;line-height:0" aria-label="Céluma (ejemplo)"></a>' +
      '<span style="font-size:15px;font-weight:600;color:#374151">Guía · Novedades · Contacto</span></div>' +
      '<div style="position:absolute;left:96px;top:190px;width:560px">' +
      '<p style="margin:0 0 14px;font:700 13px/1 var(--celuma-font-body);letter-spacing:.14em;text-transform:uppercase;color:#1f7a75">Texto de ejemplo</p>' +
      '<h4 style="margin:0;font:800 52px/1.06 var(--celuma-font-display);letter-spacing:-.02em">Sistema de gestión para laboratorios de anatomía patológica</h4>' +
      '<p style="margin:18px 0 28px;font-size:18px;line-height:1.55;color:#374151">Maqueta: el hero real y sus textos se validan en celuma-landing.</p>' +
      '<div style="display:flex;gap:12px"><button class="mk-btn" type="button">Conoce Céluma</button><button class="mk-btn ghost" type="button">Lee la guía</button></div></div>' +
      '<div data-hero style="position:absolute;right:130px;top:150px;width:' + (360 * 557 / 678).toFixed(1) + 'px;height:360px"></div></div>';
    var info = side('<h3>Hero · Atento</h3><p>La célula presta atención: el nucléolo mira hacia el puntero o hacia el botón con foco, dentro del núcleo; si el puntero se acerca, la luz se alarga un 6 %. Tras 1,6 s sin actividad vuelve a la mirada del maestro.</p>' +
      '<p>En la cabecera, la firma usa el modo <b>micro</b>: solo los rayos responden al pasar el puntero o al enfocar el enlace.</p>' +
      '<ul><li>Reposo = SVG exacto.</li><li>Con movimiento reducido no se instala ningún oyente.</li><li>No para la app clínica: distraería en una tarea.</li></ul>');
    panel.appendChild(sc.fig); panel.appendChild(info);
    var ps = [];
    var h = { subj: 'isotipo', key: 'isotipo' }, oh = variantOpts('atento', h, 'js'); oh.mode = 'full'; oh.fw = 1; oh.fh = 1;
    var b = { subj: 'lockup-h', key: 'lockup-h-pos' }, ob = variantOpts('atento', b, 'js'); ob.mode = 'micro'; ob.fw = 1; ob.fh = 1;
    ob.trigger = $('[data-brand]', sc.nat);
    setTimeout(function () {
      var p1 = new Player($('[data-hero]', sc.nat), oh); p1.load(); ps.push(p1);
      var p2 = new Player($('[data-brand]', sc.nat), ob); p2.load(); ps.push(p2);
    }, 30);
    CTX[4].teardown = function () { ps.forEach(function (p) { p.destroy(); }); };
  }

  function ctxMaterial(panel) {
    var wide = screen(1280, 720, 'Intro 16:9 sobre navy · Orden · lockup horizontal');
    var sq = screen(1080, 1080, 'Pieza social 1:1 · Rebote · contenido comprobado en celuma-docs (v1.3.1)');
    sq.fig.classList.add('phone'); sq.fig.style.flex = '0 1 360px'; $('.m-fit', sq.fig).style.border = '1px solid var(--m-line)'; $('.m-fit', sq.fig).style.borderRadius = '14px';
    wide.nat.innerHTML = '<div data-stage style="position:absolute;inset:0;background:#0d1b2a"></div>';
    sq.nat.innerHTML = '<div style="position:absolute;inset:0;background:#fbf6ec"><div data-stage style="position:absolute;left:0;right:0;top:120px;height:560px"></div>' +
      '<div data-copy style="position:absolute;left:90px;right:90px;bottom:120px;text-align:center;opacity:0">' +
      '<p style="margin:0 0 14px;font:700 34px/1 var(--celuma-font-body);letter-spacing:.14em;text-transform:uppercase;color:#1f7a75">Novedades</p>' +
      '<p style="margin:0;font:800 76px/1.05 var(--celuma-font-display);letter-spacing:-.02em;color:#0d1b2a">Céluma 1.3.1 ya está disponible</p>' +
      '<p style="margin:20px 0 0;font-size:36px;color:#1f7a75;font-weight:700">docs.celuma.mx</p></div></div>';
    var info = side('<h3>Material de marca · Orden y Rebote</h3><p><b>Orden</b> abre vídeos y presentaciones: del campo celular a la cuadrícula, de la cuadrícula a la firma sobre fondo liso.</p>' +
      '<p><b>Rebote</b> celebra: la firma llega con peso y, cuando se asienta, aparece el texto (contenido comprobado de las notas de la versión 1.3.1).</p>' +
      '<div class="m-ctx-actions"><button class="m-btn primary" type="button" data-replay>Reproducir ambas</button></div>' +
      '<ul><li>Para redes se entregan como vídeo: <a href="preview/orden-16x9-navy.mp4">Orden 16:9</a> · <a href="preview/rebote-social-1x1.mp4">Rebote 1:1</a>.</li><li>Texto y logo nunca a la vez en movimiento: primero la firma, después el mensaje.</li><li>Zonas y márgenes según la guía de publicaciones (Dirección A).</li></ul>');
    var wrap = document.createElement('div'); wrap.className = 'm-screens'; wrap.appendChild(wide.fig); wrap.appendChild(sq.fig);
    panel.appendChild(wrap); panel.appendChild(info);
    var ps = [];
    function make() {
      ps.forEach(function (p) { p.destroy(); }); ps = [];
      var copy = $('[data-copy]', sq.nat); copy.style.opacity = 0; copy.getAnimations().forEach(function (a) { a.cancel(); });
      var o1 = variantOpts('orden', { subj: 'lockup-h', key: 'lockup-h-neg' }, 'lottie'); o1.noRepeat = true;
      var o2 = variantOpts('rebote', { subj: 'lockup-v', key: 'lockup-v-pos' }, 'lottie'); o2.noRepeat = true; o2.fw = 0.6; o2.fh = 0.72;     // firma ≈ 400 px de alto en 1080: el texto queda con aire debajo
      o2.onComplete = function () { copy.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: reduced() ? 1 : 420, easing: 'cubic-bezier(.2,0,0,1)', fill: 'forwards' }); };
      setTimeout(function () {
        var p1 = new Player($('[data-stage]', wide.nat), o1); p1.load(); ps.push(p1);
        var p2 = new Player($('[data-stage]', sq.nat), o2); p2.load().then(function () { if (reduced()) o2.onComplete(); }); ps.push(p2);
      }, 30);
    }
    $('[data-replay]', info).addEventListener('click', make);
    make();
    CTX[5].teardown = function () { ps.forEach(function (p) { p.destroy(); }); };
  }

  // ------------------------------------------------------------------ comparar con 02
  var ANT = [
    { id: 'mirada-once', name: 'Mirada · una vez (fase 2)', files: { isotipo: E2 + 'anim/celuma-isotipo-once.json' }, box: [69, 38, 557, 678] },
    { id: 'mirada-loop', name: 'Mirada · bucle (fase 2)', files: { isotipo: E2 + 'anim/celuma-isotipo-loop.json' }, box: [69, 38, 557, 678], loop: true },
    { id: 'luz-loop', name: 'Luz · bucle de carga', f3: 'luz', mode: 'loop', loop: true },
    { id: 'luz-once', name: 'Luz · una vez', f3: 'luz', mode: 'once' },
    { id: 'enfoque', name: 'Enfoque · bienvenida', f3: 'enfoque', mode: 'once' },
    { id: 'trazo', name: 'Trazo · material de marca', f3: 'trazo', mode: 'once' }
  ];
  function antOpts(a, subj, bg) {
    var art = ART[subj];
    if (a.files) {
      if (subj !== 'isotipo') return null;
      return { kind: 'lottie', src: a.files.isotipo, box: a.box, art: art, loop: !!a.loop, staticSrc: E2 + 'anim/celuma-isotipo-maestro-caja-anim.svg' };
    }
    var sk = subj === 'isotipo' ? 'iso' : 'a-' + subj.slice(-1) + '-' + (bg === 'navy' ? 'neg' : 'pos');
    var v = SPEC2 && SPEC2.variants[a.f3 + '|' + sk + '|' + a.mode];
    if (!v) return null;
    // estáticos exactos de la fase 3 de 02 (misma caja que cada variante; se leen sin modificarlos)
    var st = sk === 'iso' ? 'isotipo.svg' : 'lockup-a-' + (sk[2] === 'h' ? 'horizontal' : 'vertical') + '-color-' + (sk.slice(-3) === 'neg' ? 'negativo' : 'positivo') + '.svg';
    return { kind: 'lottie', src: E2 + 'fase-3/' + v.file, box: v.box, art: art, loop: !!a.loop, staticSrc: E2 + 'fase-3/estaticos/' + st };
  }
  var cmp = { a: null, b: null };
  function buildCompare() {
    var selA = $('#cmp-a'), selB = $('#cmp-b');
    ['respira', 'brote', 'rebote', 'orden'].forEach(function (id) { selA.add(new Option(BYID[id].name, id)); });
    ANT.forEach(function (a) { selB.add(new Option(a.name, a.id)); });
    selA.value = 'brote'; selB.value = 'enfoque';
    selA.addEventListener('change', mountCompare); selB.addEventListener('change', mountCompare);
    $('[data-cmp="restart"]').addEventListener('click', function () { [cmp.a, cmp.b].forEach(function (p) { if (p) p.restart(); }); });
    mountCompare();
  }
  function mountCompare() {
    [cmp.a, cmp.b].forEach(function (p) { if (p) p.destroy(); });
    var subj = S.subject;
    ['#cmp-stage-a', '#cmp-stage-b'].forEach(function (s) { var st = $(s); st.dataset.bg = S.bg; st.innerHTML = ''; watch(st); });
    var ida = $('#cmp-a').value, si = subjectKey(ida, subj, S.bg);
    var oa = variantOpts(ida, si, BYID[ida].def === 'css' ? 'css' : 'lottie');
    if (BYID[ida].scene) oa.fit = 'art';                                  // misma escala del dibujo que 02
    oa.fh = 0.6; oa.fw = 0.8;
    cmp.a = new Player($('#cmp-stage-a'), oa); cmp.a.load();
    $('#cmp-note-a').textContent = BYID[ida].name + ' · ' + (si.subj === 'isotipo' ? 'isotipo' : si.subj === 'lockup-h' ? 'horizontal' : 'vertical') + (si.fallback ? ' (no existe la firma pedida)' : '') + (BYID[ida].scene ? ' · escena recortada a la escala del dibujo' : '');
    var a2 = ANT.filter(function (a) { return a.id === $('#cmp-b').value; })[0];
    var ob = antOpts(a2, subj, S.bg), note = '';
    if (!ob) { ob = antOpts(a2, 'isotipo', S.bg); note = ' (solo existe el isotipo)'; }
    ob.fh = 0.6; ob.fw = 0.8;
    cmp.b = new Player($('#cmp-stage-b'), ob); cmp.b.load();
    $('#cmp-note-b').textContent = a2.name + note + ' · aprobado en 02';
  }

  // ------------------------------------------------------------------ validación y archivos
  function renderValidation() {
    var host = $('#m-validation');
    if (!METRICS) { host.innerHTML = '<p class="m-muted">Todavía no hay métricas (ejecute <code>scripts/validate.py</code>).</p>'; return; }
    var k = METRICS.summary;
    host.innerHTML = '<div class="m-kpis">' + k.kpis.map(function (x) { return '<div class="m-kpi"><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>'; }).join('') + '</div>' +
      '<div class="m-tablewrap"><table><thead><tr><th>Variante</th><th>Final vs estático</th><th>Inicio</th><th>Bordes</th><th>Otros reproductores</th><th>Notas</th></tr></thead><tbody>' +
      METRICS.rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td><td>' + esc(r[4]) + '</td><td>' + esc(r[5]) + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="m-muted">' + esc(METRICS.summary.limits) + '</p>';
  }
  function renderFiles() {
    var host = $('#m-files');
    if (!FILES) { host.innerHTML = '<p class="m-muted">Sin manifiesto de archivos.</p>'; return; }
    var groups = {};
    FILES.files.forEach(function (f) { (groups[f.group] = groups[f.group] || []).push(f); });
    host.innerHTML = Object.keys(groups).map(function (g) { return '<h3>' + esc(g) + '</h3><ul>' + groups[g].map(fileLi).join('') + '</ul>'; }).join('');
  }

  // ------------------------------------------------------------------ controles globales
  function remountAll() {
    DIRS.forEach(function (d) { mountOverview(d); mountDirection(d); mountSizes(d); });
    mountCompare();
    CTX.forEach(function (c) { if (c.built && !c.panel.hidden) { if (c.teardown) c.teardown(); c.panel.innerHTML = ''; c.built = false; selectCtx(c.id); } });
    $('#m-reduced-banner').hidden = !reduced();
  }
  function bindToolbar() {
    var tb = $('.m-toolbar');
    $('[data-act="toggle"]', tb).addEventListener('click', function (e) {
      S.playing = !S.playing; e.target.setAttribute('aria-pressed', String(S.playing)); e.target.textContent = S.playing ? 'Pausar' : 'Reproducir';
      players.forEach(function (p) { p.sync(); if (S.playing && p.kind === 'lottie' && !p.o.loop && p.anim && p.anim.currentFrame >= p.op - 1 && S.repeat) p.restart(); });
    });
    $('[data-act="restart"]', tb).addEventListener('click', function () { players.forEach(function (p) { p.restart(); }); DIRS.forEach(function (d) { if (d.relevoMini) d.relevoMini.restart(); }); });
    $('[data-act="repeat"]', tb).addEventListener('click', function (e) { S.repeat = !S.repeat; e.target.setAttribute('aria-pressed', String(S.repeat)); });
    $$('[data-speed]', tb).forEach(function (b) { b.addEventListener('click', function () {
      S.speed = +b.dataset.speed; $$('[data-speed]', tb).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); players.forEach(function (p) { p.sync(); });
    }); });
    $$('[data-bg]', tb).forEach(function (b) { b.addEventListener('click', function () {
      S.bg = b.dataset.bg; $$('[data-bg]', tb).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); remountAll();
    }); });
    $$('[data-subject]', tb).forEach(function (b) { b.addEventListener('click', function () {
      S.subject = b.dataset.subject; $$('[data-subject]', tb).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      DIRS.forEach(function (d) { mountDirection(d); }); mountCompare();
    }); });
    $('[data-act="reduced"]', tb).addEventListener('click', function (e) { S.forced = !S.forced; e.target.setAttribute('aria-pressed', String(S.forced)); remountAll(); });
    if (sysMQ.addEventListener) sysMQ.addEventListener('change', remountAll);
  }

  // ------------------------------------------------------------------ parámetros de revisión (?fondo=navy&firma=lockup-h&velocidad=0.5&reducido=1)
  function readParams() {
    var q = new URLSearchParams(location.search), v;
    if ((v = q.get('fondo')) && /^(crema|blanco|navy)$/.test(v)) S.bg = v;
    if ((v = q.get('firma')) && /^(isotipo|lockup-h|lockup-v)$/.test(v)) S.subject = v;
    if ((v = q.get('velocidad')) && ['0.25', '0.5', '1', '2'].indexOf(v) >= 0) S.speed = +v;
    if (q.get('reducido') === '1') S.forced = true;
    var tb = $('.m-toolbar');
    $$('[data-bg]', tb).forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.bg === S.bg)); });
    $$('[data-subject]', tb).forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.subject === S.subject)); });
    $$('[data-speed]', tb).forEach(function (x) { x.setAttribute('aria-pressed', String(+x.dataset.speed === S.speed)); });
    $('[data-act="reduced"]', tb).setAttribute('aria-pressed', String(S.forced));
  }

  // ------------------------------------------------------------------ arranque
  function start() {
    readParams();
    Promise.all([getJSON('spec.json'), getJSON(E2 + 'fase-3/validation/spec.json').catch(function () { return null; }),
      getJSON('validation/metrics.json').catch(function () { return null; }), getJSON('files.json').catch(function () { return null; })])
      .then(function (r) {
        SPEC = r[0]; SPEC2 = r[1]; METRICS = r[2]; FILES = r[3];
        buildOverview(); buildArticles(); bindToolbar();
        DIRS.forEach(function (d) { mountOverview(d); mountDirection(d); mountSizes(d); mountDownloads(d); });
        buildContexts(); buildCompare(); renderValidation(); renderFiles();
        $('#m-reduced-banner').hidden = !reduced();
        // el contenido se construye con JS: se vuelve a llevar al ancla al terminar y cuando cargan las fuentes,
        // salvo que la persona ya se haya desplazado
        var moved = false;
        ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function () { moved = true; }, { once: true, passive: true }); });
        var goHash = function () {
          if (moved) return;
          var t = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
          if (t) t.scrollIntoView();
        };
        goHash();
        window.addEventListener('load', goHash);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(goHash);
        setTimeout(goHash, 600);
        document.documentElement.dataset.ready = '1';
      })
      .catch(function (e) { $('#m-fetch-banner').hidden = false; console.error(e); });
  }
  start();
})();
