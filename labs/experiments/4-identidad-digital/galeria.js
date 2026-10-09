// Céluma · Experimento 04 · Galería (cerrado 2026-10-07: B · Ficha ronda 2 aprobada en el laboratorio; A y C, alternativas conservadas).
// Lee galeria-datos.js (generado) y kit/formatos.js.
(function () {
  const D = window.E4_DATOS || { manifest: { archivos: [] } };
  const A = D.manifest.archivos;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const params = new URLSearchParams(location.search);
  const kb = (n) => (n > 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.round(n / 1024) + ' KB');

  // ---------- Paletas ----------
  const PIG = [['#49B6AD', 'Membrana · teal', 'Identidad: formas, reglas, anillos. Nunca texto sobre claro ni texto blanco encima.'], ['#BBEAD2', 'Citoplasma · menta', 'Rellenos suaves.'], ['#F98D84', 'Núcleo · salmón', 'Regla de borde y un solo foco por pieza. Nunca texto.'], ['#E5635F', 'Nucléolo · coral', 'Solo dentro del logo.'], ['#F1C46C', 'Rayos · luz', 'Solo dentro del logo en B; tintes de luz en A.']];
  const SUP = [['#FBF6EC', 'Crema', 'Papel: superficie dominante.'], ['#FFFFFF', 'Blanco', 'Superficie alternativa.'], ['#0D1B2A', 'Navy', 'Tinta y superficie de portadas, cierres y anuncios.']];
  const TIN = [['#17635F', 'Teal profunda (local)', 'Antetítulo y CTA · 6,53:1 crema'], ['#3A4A5C', 'Tinta 2 (local)', 'Texto de apoyo · 8,43:1'], ['#56657A', 'Tinta 3 (local)', 'Metadatos · 5,51:1'], ['#E4F3EA', 'Menta suave (local)', 'Celdas y rellenos'], ['#C9D3DD', 'Apoyo sobre navy (local)', 'Texto sobre navy · 11,47:1']];
  const sw = ([c, n, u]) => `<div class="g-sw"><i style="background:${c}"></i><div><b>${n}</b><code>${c}</code><br><span>${u}</span></div></div>`;
  $('#paleta-base').innerHTML = [...PIG, ...SUP].map(sw).join('');
  $('#paleta-roles').innerHTML = [...SUP, ...TIN, ...PIG.slice(0, 3)].map(sw).join('');

  // ---------- Comparación ----------
  const DIRS = [
    { id: 'a', nombre: 'A · Lumen', lema: 'La luz ordena', idea: 'Arcos de luz plana nacen arriba a la izquierda, como los rayos del isotipo; el mensaje vive en la zona iluminada, con mucho aire.', fuerte: 'La más cálida y la más próxima a «célula + luz». Muy legible y tranquila.', limite: 'Sin módulo para contenido denso; la luz puede volverse decorativa y el amarillo, nostálgico.', valores: 'Claridad y Humanidad; menos Precisión visible.' },
    { id: 'b', nombre: 'B · Ficha', lema: 'Precisión que se lee', idea: 'Una lámina editorial con cabecera de serie, reglas finas, regla salmón del PageHeader, módulo informativo y la fuente citada.', fuerte: 'Hace visible la precisión; escala a pasos, permisos y novedades; coherente en cinco formatos.', limite: 'Puede enfriarse si se abusa de metadatos; exige disciplina con las fuentes.', valores: 'Precisión, Confianza y Seguridad visibles; Humanidad en tono, crema y Baloo.', rec: true, sello: 'Ronda 1 · antecedente de la elegida' },
    { id: 'c', nombre: 'C · Membrana', lema: 'Lo esencial, contenido', idea: 'Un contorno orgánico con anillo teal y relleno menta sostiene el mensaje; un foco salmón numera.', fuerte: 'La más reconocible y cercana; buen contraste dentro del contenedor.', limite: 'Repite la anatomía del logo y compite con él; riesgo de tono sticker.', valores: 'Humanidad y Claridad; Precisión menos evidente.' },
  ];
  const PZC = [['valor-claridad', 'Valores'], ['capacidad-revisor', 'Capacidad verificada'], ['carrusel-informe-1', 'Carrusel · portada'], ['carrusel-informe-4', 'Carrusel · interior']];
  let cf = ['4x5', '9x16'].includes(params.get('formato')) ? params.get('formato') : '4x5';
  let cc = ['lienzo', 'claro', 'oscuro'].includes(params.get('contexto')) ? params.get('contexto') : 'lienzo';
  function pintarComparacion() {
    $('#comparacion').innerHTML = DIRS.map((d) => `<article class="g-dir${d.rec ? ' rec' : ''}" id="d-${d.id}">
      <header><h3>${d.nombre}</h3><span class="g-sello">${d.sello || 'Alternativa conservada'}</span></header>
      <p class="lema">${d.lema}</p><p>${d.idea}</p>
      <dl><dt>Fortalezas</dt><dd>${d.fuerte}</dd><dt>Límites</dt><dd>${d.limite}</dd><dt>Valores</dt><dd>${d.valores}</dd></dl>
      <div class="g-piezas">${PZC.map(([p, et]) => {
        const f = p.startsWith('carrusel') ? '4x5' : cf;
        const ruta = `exports/comparacion/${d.id}/${p}__${f}.png`;
        const img = `<a href="${ruta}"><img src="${ruta}" width="1080" height="${f === '9x16' ? 1920 : 1350}" alt="${esc(et)} en la dirección ${esc(d.nombre)}, formato ${f.replace('x', ':')}" loading="lazy"></a>`;
        const cuerpo = cc === 'lienzo' ? img : `<div class="g-feed ${cc}"><div class="fc"><i></i>celuma</div>${img}<p class="ft">Vista de ejemplo a 390 px · caption editable</p></div>`;
        return `<figure>${cuerpo}<figcaption>${et} · ${f.replace('x', ':')}</figcaption></figure>`;
      }).join('')}</div></article>`).join('');
  }
  document.querySelectorAll('[data-cf]').forEach((b) => b.addEventListener('click', () => { cf = b.dataset.cf; marcar('[data-cf]', b); pintarComparacion(); }));
  document.querySelectorAll('[data-cc]').forEach((b) => b.addEventListener('click', () => { cc = b.dataset.cc; marcar('[data-cc]', b); pintarComparacion(); }));
  function marcar(sel, activo) { document.querySelectorAll(sel).forEach((x) => x.setAttribute('aria-pressed', String(x === activo))); }
  marcar('[data-cf]', document.querySelector(`[data-cf="${cf}"]`)); marcar('[data-cc]', document.querySelector(`[data-cc="${cc}"]`));
  pintarComparacion();

  // ---------- Contraste ----------
  const C = D.contraste || { usos: [], prohibidas: [] };
  $('#tabla-contraste').innerHTML = `<caption>${esc(C.metodo || '')} ${esc(C.resumen || '')}</caption><thead><tr><th scope="col">Uso</th><th scope="col">Muestra</th><th scope="col">Contraste</th><th scope="col">A 390 px</th><th scope="col">Objetivo</th><th scope="col">Resultado</th></tr></thead><tbody>` +
    C.usos.map((u) => `<tr><th scope="row">${esc(u.rol)}<br><small>${esc(u.direcciones)} · ${esc(u.donde)}</small></th><td><span class="g-mues" style="color:${u.tinta};background:${u.fondo}">Aa ${u.tinta}</span></td><td>${String(u.contraste).replace('.', ',')}:1</td><td>${String(u.px_a_390).replace('.', ',')} px</td><td>${String(u.objetivo).replace('.', ',')}:1${u.texto_grande ? ' (grande)' : ''}</td><td class="${u.cumple ? 'ok' : 'mal'}">${u.cumple ? 'Cumple' : 'No cumple'}</td></tr>`).join('') + '</tbody>';
  $('#contraste-prohibidas').innerHTML = '<b>Prohibidas como texto:</b> ' + C.prohibidas.map((p) => `${esc(p.uso)} (${String(p.contraste).replace('.', ',')}:1)`).join(' · ') + '.';

  // ---------- Escala tipográfica ----------
  const FS = ['1x1', '4x5', '9x16', '191x1', '16x9'];
  const M = FS.map((f) => [f, window.E4F.metricas(f)]);
  $('#tabla-escala').innerHTML = `<caption>Tamaños en px de artboard (y aproximado a 390 px de ancho). S = lado corto, W = ancho.</caption><thead><tr><th scope="col">Formato</th><th scope="col">Margen</th><th scope="col">Display</th><th scope="col">Titular</th><th scope="col">Texto</th><th scope="col">Meta</th><th scope="col">Lockup (alto)</th></tr></thead><tbody>` +
    M.map(([f, m]) => { const k = 390 / m.W; const c = (v) => `${v} <small>(${(v * k).toFixed(1).replace('.', ',')})</small>`; return `<tr><th scope="row">${window.E4F.FORMATOS[f].nombre} · ${m.W}×${m.H}</th><td>${m.m}</td><td>${c(m.display)}</td><td>${c(m.titulo)}</td><td>${c(m.texto)}</td><td>${c(m.meta)}</td><td>${c(m.iso)}</td></tr>`; }).join('') + '</tbody>';

  // ---------- Guías ----------
  $('#guias').innerHTML = ['1x1', '4x5', '9x16', '191x1', '16x9'].map((f) => `<figure><a href="validacion/guias/guias-capacidad-revisor__${f}.png"><img src="validacion/guias/guias-capacidad-revisor__${f}.png" alt="Pieza de capacidad en ${f.replace('x', ':')} con el área útil y las zonas marcadas" loading="lazy"></a><figcaption>${f.replace('x', ':').replace('191', '1.91')} · área útil${f === '9x16' ? ' + zonas 14 % / 20 %' : ''}</figcaption></figure>`).join('');

  // ---------- Recursos ----------
  const R = A.filter((a) => a.tipo === 'recurso');
  $('#recursos-lista').innerHTML = R.map((r) => `<div class="g-rec${/navy/.test(r.id) ? ' navy' : ''}${/icono/.test(r.id) ? ' ico' : ''}"><img src="${r.png}" alt="" loading="lazy"><p><b>${esc(r.id)}</b><br>${esc(r.uso)}</p><p><a href="${r.svg}" download>SVG</a> · <a href="${r.png}" download>PNG ${r.ancho}×${r.alto}</a></p></div>`).join('');

  // ---------- Usos correctos e incorrectos ----------
  const celdas = (focos) => { let s = ''; for (let y = 0; y < 3; y++) for (let x = 0; x < 8; x++) { const i = y * 8 + x; s += focos.includes(i) ? `<circle cx="${x * 30 + 15}" cy="${y * 30 + 15}" r="10" fill="#F98D84"/>` : `<circle cx="${x * 30 + 15}" cy="${y * 30 + 15}" r="7" fill="#E4F3EA" stroke="#49B6AD" stroke-width="1.5"/>`; } return `<svg viewBox="0 0 240 90" width="220" aria-hidden="true">${s}</svg>`; };
  const USOS = [
    [true, '<div style="background:#49B6AD;color:#0d1b2a;font:700 18px Inter;padding:14px 22px;border-radius:999px">Escríbenos</div>', '<b>Sí:</b> navy sobre teal (7,10:1).'],
    [false, '<div style="background:#49B6AD;color:#fff;font:700 18px Inter;padding:14px 22px;border-radius:999px">Escríbenos</div>', '<b>No:</b> blanco sobre teal (2,45:1).'],
    [true, '<div style="background:#fbf6ec;width:100%;height:100%;display:grid;place-items:center"><img src="kit/marca/celuma-lockup-horizontal-color-positivo.svg" alt="" width="170"></div>', '<b>Sí:</b> lockup completo sobre zona lisa, con ½ isotipo de aire.'],
    [false, '<div style="background:#fbf6ec url(recursos/png/cuadricula-orden-8x2-crema.png) center/cover;width:100%;height:100%;display:grid;place-items:center"><img src="kit/marca/celuma-lockup-horizontal-color-positivo.svg" alt="" width="170"></div>', '<b>No:</b> logo sobre la cuadrícula o cualquier textura.'],
    [true, celdas([12]), '<b>Sí:</b> una sola célula foco: un mensaje.'],
    [false, celdas([2, 12, 21]), '<b>No:</b> varios focos que compiten por la atención.'],
    [true, '<div style="font:600 15px/1.4 Inter;color:#0d1b2a;padding:0 18px">Solo el revisor asignado firma.<br><span style="color:#56657A;font-size:11px;white-space:nowrap">Fuente · docs.celuma.mx/release-notes/v1-3-1</span></div>', '<b>Sí:</b> afirmación publicada y con su fuente.'],
    [false, '<div style="font:800 22px/1.1 \'Baloo 2\';color:#0d1b2a;padding:0 18px;text-align:center">100 % de trazabilidad garantizada</div>', '<b>No:</b> absolutos, promesas o cumplimiento sin evidencia.'],
    [true, '<svg viewBox="0 0 240 40" width="220" aria-hidden="true"><line x1="30" y1="20" x2="210" y2="20" stroke="#49B6AD" stroke-width="2"/><circle cx="30" cy="20" r="9" fill="#49B6AD"/><circle cx="90" cy="20" r="9" fill="#49B6AD"/><circle cx="150" cy="20" r="11" fill="#F98D84"/><circle cx="210" cy="20" r="9" fill="#E4F3EA" stroke="#49B6AD" stroke-width="2"/></svg>', '<b>Sí:</b> pasos con colores de marca y rótulo de texto.'],
    [false, '<div style="display:flex;gap:6px;font:700 12px Inter"><span style="background:#eff6ff;color:#3b82f6;padding:5px 8px;border-radius:99px">Recibida</span><span style="background:#fffbeb;color:#f59e0b;padding:5px 8px;border-radius:99px">En proceso</span><span style="background:#ecfdf5;color:#10b981;padding:5px 8px;border-radius:99px">Liberada</span></div>', '<b>No:</b> colores de estado clínico de la app como decoración.'],
    [true, '<img src="kit/marca/celuma-isotipo-color.svg" alt="" height="96">', '<b>Sí:</b> el isotipo siempre completo.'],
    [false, '<img src="kit/marca/celuma-isotipo-color.svg" alt="" height="200" style="clip-path:inset(0 52% 55% 0);transform:translate(28px,30px)">', '<b>No:</b> rayos o núcleo sueltos como adorno.'],
  ];
  $('#usos-lista').innerHTML = USOS.map(([ok, ej, t]) => `<div class="g-uso${ok ? '' : ' no'}"><div class="ej" style="background:#fbf6ec">${ej}</div><p>${t}</p></div>`).join('');
  $('#tabla-excluidas').innerHTML = '<thead><tr><th scope="col">Afirmación</th><th scope="col">Dónde aparece</th><th scope="col">Por qué se excluye</th></tr></thead><tbody>' + (D.excluidas || []).map((x) => `<tr><td>${esc(x.texto)}</td><td>${esc(x.origen)}</td><td>${esc(x.motivo)}</td></tr>`).join('') + '</tbody>';

  // ---------- Kit ----------
  const KIT = A.filter((a) => a.conjunto === 'kit');
  const grupos = ['Todos', ...new Set(KIT.map((k) => k.grupo))];
  let grupo = grupos.includes(params.get('grupo')) ? params.get('grupo') : 'Todos';
  let vista = params.get('vista') === 'movil' ? 'movil' : 'mini';
  $('#filtro-grupo').innerHTML = '<span class="g-et">Grupo</span>' + grupos.map((g) => `<button type="button" class="g-btn" data-kg="${esc(g)}" aria-pressed="${g === grupo}">${esc(g)}</button>`).join('');
  const nombre = (k) => { const t = { valor: 'Valor', valores: 'Valores', identidad: 'Identidad', capacidad: 'Capacidad', consejo: 'Consejo', novedad: 'Novedad', demo: 'Demostración', flujo: 'Flujo', 'carrusel-portada': 'Carrusel · portada', 'carrusel-paso': 'Carrusel · paso', 'carrusel-nota': 'Carrusel · nota', 'carrusel-cierre': 'Carrusel · cierre' }[k.plantilla] || k.grupo; return `${t} · ${k.pieza}`; };
  function pintarKit() {
    const g = $('#kit-grid'); g.className = 'g-kit' + (vista === 'movil' ? ' movil' : '');
    g.innerHTML = KIT.filter((k) => grupo === 'Todos' || k.grupo === grupo).map((k) => `<article class="g-ficha" id="k-${esc(k.id)}">
      <a href="${k.png}"><img src="${k.png}" alt="${esc(k.alt)}" loading="lazy" width="${k.ancho}" height="${k.alto}"></a>
      <p class="nombre">${esc(nombre(k))}</p>
      <p class="meta">${esc(k.formato)} · ${k.ancho} × ${k.alto} px · ${kb(k.bytes)} · modo ${esc({ edi: 'editorial', atm: 'atmosférico', mic: 'microcosmos' }[k.modo] || '')} ${k.condensada ? '<span class="g-cond">versión condensada</span>' : ''}</p>
      <div class="enl"><a href="${k.png}" download>PNG</a>${k.pdf ? `<a href="${k.pdf}" download>PDF</a>` : ''}<a href="kit/editor.html#p=${esc(k.pieza)}&d=b&f=${esc(k.formatoId)}">Editar</a><a href="kit/pieza.html#p=${esc(k.pieza)}&d=b&f=${esc(k.formatoId)}&vista=1">Vista viva</a></div>
      ${k.caption ? `<details><summary>Caption y texto alternativo</summary><p><b>Caption:</b> ${esc(k.caption)}</p><p><b>Alt:</b> ${esc(k.alt)}</p></details>` : `<details><summary>Texto alternativo</summary><p>${esc(k.alt)}</p></details>`}
      ${k.fuentes && k.fuentes.length ? `<details><summary>Fuentes y estado</summary><ul>${k.fuentes.map((f) => `<li>${esc(f.ref)} · <b>${esc(f.estado)}</b>${f.nota ? ' · ' + esc(f.nota) : ''}</li>`).join('')}</ul></details>` : ''}
    </article>`).join('');
  }
  document.querySelectorAll('[data-kg]').forEach((b) => b.addEventListener('click', () => { grupo = b.dataset.kg; marcar('[data-kg]', b); pintarKit(); }));
  document.querySelectorAll('[data-kv]').forEach((b) => b.addEventListener('click', () => { vista = b.dataset.kv; marcar('[data-kv]', b); pintarKit(); }));
  marcar('[data-kv]', document.querySelector(`[data-kv="${vista}"]`));
  pintarKit();
  const CAR = KIT.filter((k) => k.grupo === 'Carrusel').sort((a, b) => a.pieza.localeCompare(b.pieza, 'es', { numeric: true }));
  $('#carrusel-tira').innerHTML = CAR.map((k, i) => `<figure><a href="${k.png}"><img src="${k.png}" alt="${esc(k.alt)}" loading="lazy" width="${k.ancho}" height="${k.alto}"></a><figcaption>${i + 1} / ${CAR.length} · ${esc(k.alt)}</figcaption></figure>`).join('');
  $('#carrusel-caption').innerHTML = `<b>Caption sugerido:</b> ${esc((D.carrusel || {}).caption || '')}`;

  // ---------- Motion ----------
  const V = (D.video || {}).piezas || {};
  const MF = D.motionFinal || {};
  const MOT = [
    { id: 'intro-novedad', titulo: 'Intro de marca + novedad · 16:9', usa: 'Orden (03) del campo a la cuadrícula y al lockup exacto sobre navy plano; la capa se funde y aparece la luz del Navy rescatado mientras Relevo (03) asienta la firma; la novedad 1.3.1 entra con calma y se queda 3,3 s para leerse.', vertical: false },
    { id: 'paso-a-paso', titulo: 'Paso a paso · historia 9:16', usa: 'Sin animar el logo: el mensaje pide calma. Cada paso aparece cuando el anterior ya se leyó; termina en la pieza estática del flujo.', vertical: true },
  ];
  let mv = params.get('motion') === 'estatico' || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'estatico' : 'video';
  function pintarMotion() {
    $('#motion-lista').innerHTML = MOT.map((m) => {
      const v = V[m.id] || {}, f = MF[m.id] || {};
      const mp4 = A.find((a) => a.id === m.id + '.mp4') || {}, webm = A.find((a) => a.id === m.id + '.webm') || {};
      const medio = mv === 'video'
        ? `<video controls preload="metadata" playsinline muted poster="motion/${m.id}-poster.jpg" aria-label="${esc(m.titulo)}"><source src="motion/${m.id}.webm" type="video/webm"><source src="motion/${m.id}.mp4" type="video/mp4"></video>`
        : `<img src="motion/${m.id}-final.png" alt="Versión estática de ${esc(m.titulo)}">`;
      return `<article class="g-mov${m.vertical ? ' vertical' : ''}" id="m-${m.id}">${medio}<h3>${esc(m.titulo)}</h3><p>${esc(m.usa)}</p>
        <dl><dt>Duración</dt><dd>${String(v.duracion_s || '').replace('.', ',')} s · ${v.fps} fps · ${v.fotogramas} fotogramas</dd>
        <dt>Formato real</dt><dd>MP4 H.264 (${kb(mp4.bytes || 0)}) · WebM VP9 (${kb(webm.bytes || 0)}) · ${v.ancho} × ${v.alto} · sin audio</dd>
        <dt>Final</dt><dd>${f.identico ? 'Idéntico píxel a píxel a la pieza estática del kit' : 'Revisar'}</dd>
        <dt>Estático</dt><dd><a href="motion/${m.id}-final.png">PNG final</a> · <a href="motion/motion.html#m=${m.id}">vista en vivo (HTML/CSS/JS)</a></dd>
        <dt>Límites</dt><dd>No es Lottie. Revisado en Chromium; sin pruebas en apps de redes.</dd></dl></article>`;
    }).join('');
  }
  document.querySelectorAll('[data-mv]').forEach((b) => b.addEventListener('click', () => { mv = b.dataset.mv; marcar('[data-mv]', b); pintarMotion(); }));
  marcar('[data-mv]', document.querySelector(`[data-mv="${mv}"]`));
  pintarMotion();

  // ---------- Calidad ----------
  const Q = D.calidad || [];
  $('#tabla-calidad').innerHTML = '<thead><tr><th scope="col">Criterio</th><th scope="col">Evidencia</th><th scope="col">Resultado</th><th scope="col">Pendiente</th></tr></thead><tbody>' + Q.map((q) => `<tr><th scope="row">${esc(q[0])}</th><td>${q[1]}</td><td class="${q[3] ? 'ok' : 'mal'}">${esc(q[2])}</td><td>${esc(q[4])}</td></tr>`).join('') + '</tbody>';

  // ---------- Descargas y manifiesto ----------
  $('#descargas').innerHTML = (D.descargas || []).map((d) => `<li><a href="${d.archivo}" download>${esc(d.nombre)}</a><span>${esc(d.contenido)} · ${kb(d.bytes)}</span></li>`).join('');
  $('#manifest-n').textContent = A.length;
  $('#tabla-manifest').innerHTML = '<thead><tr><th scope="col">Archivo</th><th scope="col">Tipo</th><th scope="col">Dirección</th><th scope="col">Formato</th><th scope="col">Tamaño</th><th scope="col">Estado</th></tr></thead><tbody>' +
    A.map((a) => `<tr><td><a href="${a.png || a.archivo || a.svg}">${esc(a.png || a.archivo || a.svg)}</a></td><td>${esc(a.tipo)}</td><td>${esc(a.direccion || '')}</td><td>${esc(a.formato || a.codec || '')}</td><td>${a.ancho ? a.ancho + '×' + a.alto : ''}</td><td>${esc(a.estado)}</td></tr>`).join('') + '</tbody>';


  // ---------- Ronda 2 · Refinamiento B ----------
  const R2 = D.r2 || { recursos: { recursos: [] }, catalogo: { recursos: [] }, pares: [] };
  const FONDOS_R2 = [['papel', 'Papel cream', 'Identidad, valores, microcosmos. Halo teal α 0,18 → 0,04 → 0 (perfil CelBlob).'], ['papel-suave', 'Papel cream suave', 'Contenido denso: la misma luz, más baja (α 0,11).'], ['navy', 'Navy', 'Portadas, cierres, anuncios, presentaciones. Navy profundo #0A1520 con dos halos.'], ['navy-suave', 'Navy suave', 'Navy con un solo halo, para piezas con más texto.']];
  const recR2 = (R2.recursos.recursos || []);
  $('#r2-fondos-lista').innerHTML = FONDOS_R2.map(([id, n, u]) => {
    const fs = recR2.filter((r) => r.tipo === 'fondo' && r.id.startsWith('fondo-' + id + '-') && (id.includes('suave') || !r.id.includes('suave')));
    const m = fs.find((r) => r.id.endsWith('4x5')) || fs[0];
    return `<article class="g-fondo-ficha"><img src="${m ? m.png : ''}" alt="Fondo ${esc(n)} en 4:5" loading="lazy"><div><b>${esc(n)}</b><p>${esc(u)}</p><p class="enl">${fs.map((r) => `<a href="${r.svg}" download>${r.id.split('-').pop().replace('x', ':')} SVG</a> · <a href="${r.png}" download>PNG</a>`).join('<br>')}</p></div></article>`;
  }).join('') + '<article class="g-fondo-ficha"><i class="plano crema"></i><div><b>Crema plano · Navy plano</b><p>Para máxima calma: avatar, firma de correo, piezas sin luz. Mismas tintas.</p></div></article>';
  const CAT = (R2.catalogo.recursos || []);
  $('#r2-biblioteca-lista').innerHTML = CAT.map((c) => {
    const cl = recR2.find((r) => r.id === c.id + '-claro') || {}, os = recR2.find((r) => r.id === c.id + '-oscuro') || {};
    return `<article class="g-recurso" id="mc-${c.id}"><div class="pares2"><img src="${cl.muestra || ''}" alt="${esc(c.nombre)} sobre Papel cream" loading="lazy"><img src="${os.muestra || ''}" alt="${esc(c.nombre)} sobre Navy" loading="lazy"></div>
      <div class="t"><p class="fam">${esc(c.familia)}</p><h4>${esc(c.nombre)}</h4><p>${esc(c.intencion)}</p><p><b>Reglas:</b> ${esc(c.reglas)}</p><p><b>Fondos:</b> ${esc(c.fondos)}</p>
      <p class="enl"><a href="${cl.svg}" download>SVG claro</a> · <a href="${cl.png}" download>PNG claro</a> · <a href="${os.svg}" download>SVG oscuro</a> · <a href="${os.png}" download>PNG oscuro</a> · <a href="kit/microcosmos.html#r=${c.id}&t=claro&w=1200&h=900&excl=1">exclusión</a></p></div></article>`;
  }).join('');
  const KP = (n) => `exports/kit/${n}.png`;
  const REC = [
    [KP('capacidad-revisor__4x5'), 'microcosmos', '<b>No:</b> tabla de permisos + grupo celular. La información densa no lleva ilustración protagonista.'],
    [KP('valor-claridad__4x5'), 'campo', '<b>No:</b> grupo + tejido + halo en la misma pieza. Un recurso por pieza.'],
    [KP('novedad-131__4x5'), 'foco', '<b>No:</b> varios focos salmón (lista, foco, regla). Un foco pleno y la regla del titular.'],
  ];
  $('#r2-recargadas').innerHTML = REC.map(([img, tipo, t]) => `<div class="g-uso no"><div class="ej recargada ${tipo}"><img src="${img}" alt="" loading="lazy"><img class="sobre" src="${tipo === 'campo' ? 'recursos/microcosmos/png/campo-perimetral-claro.png' : tipo === 'foco' ? 'recursos/microcosmos/png/campo-ordenado-oscuro.png' : 'recursos/microcosmos/png/grupo-asimetrico-claro.png'}" alt=""></div><p>${t} <span class="g-nota">Maqueta de error superpuesta; no es un export.</span></p></div>`).join('');
  let ad = 'ambas';
  const pintarPares = () => {
    $('#r2-pares').className = 'g-pares ' + ad;
    $('#r2-pares').innerHTML = (R2.pares || []).map((x) => `<figure><div class="par"><a class="antes" href="${x.antes}"><img src="${x.antes}" alt="Ronda 1: ${esc(x.pieza)} ${esc(x.formato)}" loading="lazy"><span>Ronda 1</span></a><a class="despues" href="${x.despues}"><img src="${x.despues}" alt="Ronda 2: ${esc(x.pieza)} ${esc(x.formato)}" loading="lazy"><span>Ronda 2</span></a></div><figcaption>${esc(x.pieza)} · ${esc(x.formato.replace('x', ':').replace('191', '1.91'))}</figcaption></figure>`).join('');
  };
  document.querySelectorAll('[data-ad]').forEach((b) => b.addEventListener('click', () => { ad = b.dataset.ad; marcar('[data-ad]', b); pintarPares(); }));
  pintarPares();
  const CR = R2.contrasteReal || {}, FI = R2.fidelidad || {}, RR = R2.recursos || {};
  const EV = [
    ['Fidelidad de los fondos', FI.papel ? `Papel máx. ${FI.papel.dif_max} · Navy máx. ${FI.navy.dif_max} niveles; centros ${FI.papel.centro_local} y ${FI.navy.centro_local}` : '—'],
    ['Contraste sobre la composición final', CR.piezas ? `${CR.lineas} tramos de texto en ${CR.piezas} piezas · ${CR.fallos.length} fallos · el más justo ${String((CR.minimo_relativo || {}).peor).replace('.', ',')}:1 (${(CR.minimo_relativo || {}).el})` : '—'],
    ['Microcosmos fuera de texto y firma', `${(R2.exportar || []).filter((x) => x.ok).length}/${(R2.exportar || []).length} del grupo representativo; todo el kit en evidencias`],
    ['Recursos autónomos', RR.img_igual_a_en_linea ? `${RR.recursos.length} SVG sin dependencias externas; como <img> idénticos al render en línea ${RR.img_igual_a_en_linea.identicos}/${RR.img_igual_a_en_linea.total}` : '—'],
    ['Motion', 'Final de los dos vídeos idéntico a la pieza estática de la ronda 2; Orden se funde hacia el Navy rescatado'],
  ];
  $('#r2-evidencia').innerHTML = '<thead><tr><th scope="col">Comprobación</th><th scope="col">Resultado</th></tr></thead><tbody>' + EV.map(([a, b]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join('') + '</tbody>';
  $('#r2-descargas').innerHTML = (D.descargas || []).filter((d) => /ronda-2/.test(d.archivo)).map((d) => `<li><a href="${d.archivo}" download>${esc(d.nombre)}</a><span>${esc(d.contenido)} · ${kb(d.bytes)}</span></li>`).join('') + '<li><a href="REFINAMIENTO-B.md">Encargo de la ronda 2</a><span>Copia íntegra · Markdown</span></li><li><a href="kit/microcosmos.html">Espécimen Microcosmos</a><span>HTML · reproducible por semilla</span></li>';

  // El contenido se construye con JS: si llega un ancla, se coloca después de construir.
  // Se coloca al instante (sin desplazamiento suave) y otra vez cuando terminan de cargar las imágenes,
  // salvo que la persona ya se haya movido.
  if (location.hash.length > 1) {
    const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) {
      let movido = false;
      const ir = () => { if (!movido) t.scrollIntoView({ behavior: 'instant', block: 'start' }); };
      requestAnimationFrame(ir);
      addEventListener('wheel', () => { movido = true; }, { once: true, passive: true });
      addEventListener('touchstart', () => { movido = true; }, { once: true, passive: true });
      addEventListener('keydown', () => { movido = true; }, { once: true });
      if (document.readyState === 'complete') ir(); else addEventListener('load', ir, { once: true });
    }
  }
  document.body.dataset.listo = '1';
})();
