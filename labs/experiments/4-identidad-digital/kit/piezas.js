// Céluma · Experimento 04 · Motor de composición (CANDIDATO, pendiente de aprobación).
// Una pieza = contenido (contenido.js) × dirección (A Lumen · B Ficha · C Membrana) × formato (formatos.js).
// El logo SIEMPRE se usa como archivo completo de marca/ (copias byte a byte de los
// lockups A y el isotipo aprobados en el experimento 02). Ningún recurso de esta
// página recorta, separa o redibuja partes del logo.
(function (root) {
  const { FORMATOS, metricas } = root.E4F;
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const pad = (n) => String(n).padStart(2, '0');

  const DIRECCIONES = {
    a: { id: 'a', nombre: 'Lumen', lema: 'La luz ordena' },
    b: { id: 'b', nombre: 'Ficha · ronda 2', lema: 'Precisión que se lee, con luz y Microcosmos' },
    b1: { id: 'b1', nombre: 'Ficha · ronda 1', lema: 'Precisión que se lee' },
    c: { id: 'c', nombre: 'Membrana', lema: 'Lo esencial, contenido' },
  };

  // ------------------------------------------------------------------
  // Iconos propios (retícula 24, trazo 2, extremos redondeados). Un concepto = un icono.
  // ------------------------------------------------------------------
  const ICONOS = {
    guia: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5C4.7 19 4 18.3 4 17.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5-.7 1.5-1.5z"/><path d="M7 8h1.5M7 11h1.5M15.5 8H17M15.5 11H17"/>',
    novedad: '<path d="M5 20V4.5"/><path d="M5 5h11.5l-2.2 3.5 2.2 3.5H5"/>',
    flujo: '<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/><circle cx="12" cy="5.5" r="2.2"/><circle cx="12" cy="18.5" r="2.2"/><path d="M6.8 10.6 10.3 7M13.7 7l3.5 3.6M17.2 13.4l-3.5 3.6M10.3 17l-3.5-3.6"/>',
    valor: '<circle cx="12" cy="12" r="8.5"/><path d="m14.8 9.2-1.9 4.1-4.1 1.9 1.9-4.1z"/>',
    firma: '<path d="M4 19h16"/><path d="M14.5 5.5 18 9l-8.5 8.5H6V14z"/>',
    plantilla: '<path d="M7 3.5h7l4 4V19c0 .8-.7 1.5-1.5 1.5h-9.5C6.2 20.5 5.5 19.8 5.5 19V5c0-.8.7-1.5 1.5-1.5z"/><path d="M14 3.5V8h4M8.5 12h7M8.5 15.5h5"/>',
    muestra: '<path d="M9 3.5h6M10 3.5v11.8a2 2 0 0 0 4 0V3.5"/><path d="M10 10h4"/>',
    persona: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c.8-3.3 3.6-5.2 7-5.2s6.2 1.9 7 5.2"/>',
    flecha: '<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>',
    correo: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4.5 7 7.5 6 7.5-6"/>',
  };
  const icono = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONOS[n] || ''}</svg>`;

  // ------------------------------------------------------------------
  // Firma: lockup A horizontal completo (o vertical), nunca recompuesto.
  // ------------------------------------------------------------------
  // Ruta de los archivos de marca relativa a la página que dibuja (kit/ por defecto).
  // Otras páginas fijan window.E4_BASE (p. ej. '../kit/') antes de dibujar.
  const MARCA = () => (root.E4_BASE || '') + 'marca/';
  const lockup = (oscuro, cls = 'firma-lockup') => `<img class="${cls}" src="${MARCA()}celuma-lockup-horizontal-color-${oscuro ? 'negativo' : 'positivo'}.svg" alt="Céluma">`;
  const lockupV = (oscuro, cls = 'firma-lockup-v') => `<img class="${cls}" src="${MARCA()}celuma-lockup-vertical-color-${oscuro ? 'negativo' : 'positivo'}.svg" alt="Céluma">`;
  const isotipo = (cls = 'iso') => `<img class="${cls}" src="${MARCA()}celuma-isotipo-color.svg" alt="Céluma">`;

  const fuenteTxt = (p) => {
    const f = (p.fuentes || []).find((x) => x.estado === 'publicada-docs' && /^docs\.celuma/.test(x.ref));
    return f ? f.ref : '';
  };

  // ------------------------------------------------------------------
  // Recursos gráficos propios (derivados de célula + luz, no del dibujo del logo)
  // ------------------------------------------------------------------
  // A · Lumen: tres arcos de luz concéntricos que nacen fuera de la esquina superior izquierda,
  // como la dirección de los rayos del isotipo. Rellenos planos, sin degradados.
  function lumen(M, o = {}) {
    const { W, H, S } = M;
    const cx = o.cx ?? -S * 0.12, cy = o.cy ?? -S * 0.10;
    const D = Math.hypot(W - cx, H - cy); // distancia a la esquina opuesta
    const r = (o.r || [0.98, 0.74, 0.52, 0.31]).map((f) => Math.round(f * D * (o.k ?? 1)));
    const fills = o.fills || ['var(--e4-luz-3)', 'var(--e4-luz-2)', 'var(--e4-luz-1)', 'var(--e4-luz-0)'];
    return `<svg class="lumen" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">${r.map((ri, i) => `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${ri}" fill="${fills[i]}"/>`).join('')}</svg>`;
  }

  // B · Ficha: cuadrícula ordenada de células (eco de «Orden», 03). Círculos perfectos y
  // regulares: se lee como diagrama, nunca como micrografía. Una sola célula es el foco.
  function cuadricula(cols, filas, foco, o = {}) {
    const g = 100, r = o.r ?? 21;
    const w = cols * g, h = filas * g;
    let s = '';
    for (let y = 0; y < filas; y++) for (let x = 0; x < cols; x++) {
      const i = y * cols + x, cx = x * g + g / 2, cy = y * g + g / 2;
      if (i === foco) s += `<circle cx="${cx}" cy="${cy}" r="${r + 9}" fill="var(--e4-nucleo)"/>`;
      else s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--e4-menta-suave)" stroke="var(--e4-membrana)" stroke-width="${o.trazo ?? 3.2}"/>`;
    }
    return `<svg class="cuadricula" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${o.ajuste || 'xMinYMax meet'}" aria-hidden="true">${s}</svg>`;
  }
  // Retícula del módulo B: columnas fijas por formato; las filas se ajustan en el navegador
  // al espacio libre real (celdas enteras, nunca deformadas). El foco se fija por fila/columna.
  const RET_B = { '1x1': [10, 2], '4x5': [10, 3], '9x16': [8, 6], '191x1': [5, 4], '16x9': [6, 5], 'banner': [8, 2], 'portada': [12, 2] };
  const modB = (M, fila, col) => { const [cc, ff] = RET_B[M.fid] || [8, 3]; return `<div class="modulo" data-cols="${cc}" data-filas="${ff}" data-foco="${fila},${col}">${cuadricula(cc, ff, Math.min(fila, ff - 1) * cc + Math.min(col, cc - 1))}</div>`; };
  function ajustarModulos(raiz) {
    raiz.querySelectorAll('.modulo[data-cols]').forEach((el) => {
      const cc = +el.dataset.cols, max = +el.dataset.filas || 6;
      const [ff0, fc] = el.dataset.foco.split(',').map(Number);
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const filas = Math.max(1, Math.min(max, Math.floor(h / (w / cc))));
      const ff = Math.min(ff0, filas - 1);
      el.innerHTML = cuadricula(cc, filas, ff * cc + Math.min(fc, cc - 1));
    });
    const pz = raiz.classList && raiz.classList.contains('pz') ? raiz : raiz.querySelector && raiz.querySelector('.pz');
    if (pz) ajustarMicrocosmos(pz);
  }

  // B · Ficha: rastreador de pasos (línea con nodos; el actual es el foco salmón).
  function rastreador(n, actual, etiquetas) {
    let s = '<div class="rastreador" aria-hidden="true">';
    for (let i = 1; i <= n; i++) {
      const est = i < actual ? 'hecho' : i === actual ? 'actual' : 'pendiente';
      s += `<div class="nodo ${est}"><span class="punto"></span>${etiquetas ? `<span class="et">${esc(etiquetas[i - 1])}</span>` : ''}</div>`;
    }
    return s + '</div>';
  }

  // C · Membrana: contorno orgánico (anillo teal + relleno menta) construido con radios
  // asimétricos, como la célula; contiene el mensaje. No es el trazado del isotipo.
  const membranaRadios = ['42% 34% 40% 30% / 30% 36% 34% 42%', '36% 44% 32% 40% / 40% 30% 44% 34%', '30% 40% 44% 34% / 36% 44% 30% 40%'];

  // ------------------------------------------------------------------
  // Variables CSS de la pieza
  // ------------------------------------------------------------------
  function vars(M) {
    return Object.entries({ W: M.W, H: M.H, S: M.S, m: M.m, za: M.zonaArriba, zb: M.zonaAbajo, display: M.display, titulo: M.titulo, titulo2: M.titulo2, texto: M.texto, meta: M.meta, fuente: M.fuente, iso: M.iso, linea: M.linea })
      .map(([k, v]) => `--${k}:${v}px`).join(';');
  }

  function orientacion(fid) {
    const M = metricas(fid);
    if (fid === '1x1' || fid === 'avatar') return 'cuadrado';
    if (M.vertical) return 'alto';
    if (M.horizontal) return 'horizontal';
    return 'vertical';
  }

  // Elegir versión condensada: se marca en el HTML y el ajuste en el navegador decide.
  const T = (p, k, corto) => esc(corto && p[k + 'Corto'] ? p[k + 'Corto'] : p[k]);

  // ==================================================================
  // A · LUMEN
  // ==================================================================
  function dirA(p, M, o, corto) {
    const oscuro = false;
    const tpl = p.plantilla;
    let cuerpo = '';
    const firma = `<footer class="firma">${lockup(oscuro)}${p.cta ? `<span class="cta">${p.ctaEtiqueta ? esc(p.ctaEtiqueta) + ' · ' : ''}${esc(p.cta)}</span>` : ''}</footer>`;
    const eyebrow = p.eyebrow ? `<p class="eyebrow">${esc(p.eyebrow)}</p>` : '';
    if (tpl === 'valor') {
      cuerpo = `<div class="bloque"><p class="eyebrow">${esc(p.eyebrow)} · ${p.serie[0]} de ${p.serie[1]}</p><h1 class="display" data-max="1">${esc(p.titulo)}</h1><p class="texto grande" data-max="4">${esc(p.texto)}</p></div>`;
    } else if (tpl === 'carrusel-paso') {
      cuerpo = `<div class="bloque"><p class="numero" aria-hidden="true">${p.paso}</p><p class="eyebrow">Paso ${p.paso} de 4 · ${esc(p.quien)}</p><h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><p class="texto" data-max="5">${esc(p.texto)}</p></div><p class="serie">${p.serie[0]} / ${p.serie[1]}</p>`;
    } else if (tpl === 'carrusel-portada') {
      cuerpo = `<div class="bloque">${eyebrow}<h1 class="titulo xl" data-max="4">${esc(p.titulo)}</h1><p class="texto" data-max="3">${esc(p.texto)}</p></div><p class="desliza">${esc(p.accion)} ${icono('flecha')}</p><p class="serie">${p.serie[0]} / ${p.serie[1]}</p>`;
    } else if (tpl === 'novedad') {
      const pts = corto && p.puntosCortos ? p.puntosCortos : p.puntos;
      cuerpo = `<div class="bloque">${eyebrow}<h1 class="titulo" data-max="3">${T(p, 'titulo', corto)}</h1><ul class="puntos" data-max="6">${pts.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
    } else if (tpl === 'flujo') {
      cuerpo = `<div class="bloque">${eyebrow}<h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><ol class="pasos-lista">${p.pasos.map((x, i) => `<li><span class="n">${i + 1}</span>${esc(x)}</li>`).join('')}</ol></div>`;
    } else {
      cuerpo = `<div class="bloque">${eyebrow}<h1 class="titulo" data-max="3">${T(p, 'titulo', corto)}</h1>${p.texto ? `<p class="texto" data-max="4">${T(p, 'texto', corto)}</p>` : ''}</div>`;
    }
    return `${lumen(M)}<div class="area">${cuerpo}${firma}</div>`;
  }

  // ==================================================================
  // B · FICHA
  // ==================================================================
  // Cabecera de serie: nombra la colección; la marca ya firma abajo y no se repite.
  const SERIE_B = { 'valor': 'Valores', 'valores': 'Valores', 'identidad': 'Identidad', 'capacidad': 'Producto', 'consejo': 'Consejos de uso', 'novedad': 'Novedades', 'demo': 'Demostración', 'flujo': 'Cómo funciona', 'carrusel-portada': 'Guía · Flujo del informe', 'carrusel-paso': 'Guía · Flujo del informe', 'carrusel-nota': 'Guía · Flujo del informe', 'carrusel-cierre': 'Guía · Flujo del informe' };
  const PASOS_B = ['Redacta', 'Envía', 'Revisa', 'Firma'];
  function dirB1(p, M, o, corto) {
    const tpl = p.plantilla;
    const navy = TONO_B[tpl] === 'navy';
    const serieTxt = p.serie ? `${pad(p.serie[0])} / ${pad(p.serie[1])}` : (p.version ? esc(p.version) : '');
    const cab = `<header class="cab"><span class="cab-serie">${esc(p.serieB || SERIE_B[tpl] || '')}</span><span class="cab-num">${serieTxt}</span></header>`;
    const fte = fuenteTxt(p);
    const cta = `<span class="cta">${p.ctaEtiqueta ? esc(p.ctaEtiqueta) + ' · ' : ''}${esc(p.cta || 'celuma.mx')}</span>`;
    const pie = `<footer class="pie">${lockup(navy)}${cta}</footer>`;
    const fuente = fte ? `<p class="fuente">Fuente · ${esc(fte)}</p>` : '';
    const eyT = p.eyebrowB ?? p.eyebrow;
    const ey = eyT ? `<p class="eyebrow">${esc(eyT)}</p>` : '';
    let main = '', modulo = '', col = false;
    switch (tpl) {
      case 'valor':
        main = `<div class="entrada"><h1 class="display" data-max="1">${esc(p.titulo)}</h1><p class="lema">${esc(p.silabas)} <i>sust. f.</i></p><p class="def" data-max="4"><span class="def-n">1</span>${esc(p.texto)}</p></div>`;
        modulo = modB(M, p.serie[0] - 1, 2 * p.serie[0] - 1);
        break;
      case 'valores':
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="2">${esc(p.titulo)}</h1></div>`;
        modulo = `<ol class="valores-lista" data-max="5">${p.lista.map((v, i) => `<li><span class="li-n">${pad(i + 1)}</span><span class="v">${esc(v)}</span></li>`).join('')}</ol>`;
        col = true;
        break;
      case 'carrusel-paso':
        main = `<div class="entrada"><p class="indice">${pad(p.paso)}</p><p class="quien">${icono('persona')}${esc(p.quien)}</p><h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><p class="texto" data-max="5">${esc(p.texto)}</p></div>`;
        modulo = `<div class="modulo tracker">${rastreador(4, p.paso, PASOS_B)}</div>`;
        col = true;
        break;
      case 'carrusel-portada':
        main = `<div class="entrada"><h1 class="titulo xl" data-max="4">${esc(p.titulo)}</h1><p class="texto" data-max="3">${esc(p.texto)}</p></div>`;
        modulo = `<div class="modulo tracker">${rastreador(4, 0, PASOS_B)}<p class="desliza">${esc(p.accion)} ${icono('flecha')}</p></div>`;
        col = true;
        break;
      case 'carrusel-nota':
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="3">${esc(p.titulo)}</h1><p class="texto" data-max="4">${esc(p.texto)}</p></div>`;
        modulo = `<div class="modulo tracker">${rastreador(4, 3, ['Redacta', 'Envía', 'Revisa', 'Firma'])}<p class="nota-tracker">${icono('flecha', 'girada')}Reabierto, vuelve a edición y a revisión</p></div>`;
        col = true;
        break;
      case 'carrusel-cierre':
        main = `<div class="entrada"><h1 class="titulo" data-max="3">${esc(p.titulo)}</h1><p class="texto" data-max="3">${esc(p.texto)}</p></div>`;
        modulo = `<div class="modulo destino"><p class="destino-et">Consulta la guía en</p><p class="destino-url">${esc(p.cta)}</p></div>`;
        col = true;
        break;
      case 'novedad': {
        const pts = corto && p.puntosCortos ? p.puntosCortos : p.puntos;
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="3">${T(p, 'titulo', corto)}</h1></div>`;
        modulo = `<ol class="lista" data-max="6">${pts.map((x, i) => `<li><span class="li-n">${pad(i + 1)}</span>${esc(x)}</li>`).join('')}</ol>`;
        break;
      }
      case 'flujo':
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><p class="texto" data-max="2">${esc(p.texto)}</p></div>`;
        modulo = M.horizontal
          ? `<div class="modulo tracker grande">${rastreador(4, 4, p.pasos)}</div>`
          : `<ol class="pasos-v" data-max="8">${p.pasos.map((x, i) => `<li class="${i === p.pasos.length - 1 ? 'meta' : ''}"><span class="punto" aria-hidden="true"></span><span class="pv-n">${pad(i + 1)}</span><span class="pv-t">${esc(x)}</span><span class="pv-q">${esc(p.responsables[i])}</span></li>`).join('')}</ol>`;
        col = true;
        break;
      default: {
        // Si la tabla de permisos explica la capacidad, el texto de apoyo sobra (sería redundante).
        const conTabla = !!p.permisos;
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="3">${T(p, 'titulo', corto)}</h1>${p.texto && !conTabla ? `<p class="texto" data-max="4">${T(p, 'texto', corto)}</p>` : ''}</div>`;
        const pos = { capacidad: [1, 3], consejo: [0, 7], demo: [2, 8], identidad: [1, 5] }[tpl];
        if (conTabla) modulo = `<table class="permisos" data-max="6"><tbody>${(corto && p.permisosCortos ? p.permisosCortos : p.permisos).map(([q, a, si]) => `<tr class="${si ? 'si' : 'no'}"><th>${esc(q)}</th><td><span class="marca" aria-hidden="true"></span>${esc(a)}</td></tr>`).join('')}</tbody></table>`;
        else if (pos) modulo = modB(M, pos[0], pos[1]);
      }
    }
    return `<div class="area">${cab}<div class="cuerpo${col ? ' col' : ''}">${main}${modulo}</div>${fuente}${pie}</div>`;
  }
  // Ritmo editorial: crema domina; navy puntúa portadas, cierres y anuncios.
  const TONO_B = { 'novedad': 'navy', 'carrusel-portada': 'navy', 'carrusel-cierre': 'navy', 'slide-titulo': 'navy' };

  // ------------------------------------------------------------------
  // Piezas auxiliares del kit (dirección B): perfil, destacados, banner, firma, presentación
  // ------------------------------------------------------------------
  function auxB1(p, M) {
    const tpl = p.plantilla;
    if (tpl === 'avatar') return `<div class="avatar-centro">${isotipo('iso-avatar')}</div>`;
    if (tpl === 'destacado') return `<div class="destacado-centro"><span class="destacado-circulo">${icono(p.icono)}</span><p class="destacado-titulo">${esc(p.titulo)}</p></div>`;
    if (tpl === 'portada') return `<div class="area fila">${lockup(false, 'portada-lockup')}<span class="regla-v" aria-hidden="true"></span><p class="portada-texto" data-max="2">${esc(p.texto)}</p>${modB(M, 0, 9)}</div>`;
    if (tpl === 'banner') return `<div class="area fila"><div class="banner-txt"><p class="eyebrow">${esc(p.eyebrow)}</p><h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><p class="cta">${esc(p.cta)}</p></div>${modB(M, 1, 5)}${lockup(false, 'banner-lockup')}</div>`;
    if (tpl === 'firma') return `<div class="area fila">${lockupV(false, 'firma-v')}<span class="regla-v" aria-hidden="true"></span><div class="firma-datos"><p class="firma-nombre">${esc(p.nombre)}</p><p class="firma-puesto">${esc(p.puesto)}</p><p class="firma-contacto">${esc(p.correo)} · <b>${esc(p.cta)}</b></p></div></div>`;
    if (tpl === 'slide-titulo') return `<div class="area"><header class="cab"><span class="cab-serie">${esc(p.eyebrow)}</span><span class="cab-num">01</span></header><div class="cuerpo"><div class="entrada"><h1 class="titulo xl" data-max="3">${esc(p.titulo)}</h1><p class="texto" data-max="2">${esc(p.texto)}</p></div>${modB(M, 1, 4)}</div><footer class="pie">${lockup(true)}<span class="cta">celuma.mx</span></footer></div>`;
    if (tpl === 'slide-contenido') return `<div class="area"><header class="cab"><span class="cab-serie">${esc(p.eyebrow)}</span><span class="cab-num">02</span></header><div class="cuerpo col"><div class="entrada"><h1 class="titulo" data-max="2">${esc(p.titulo)}</h1></div><table class="tabla"><tbody>${p.filas.map(([a, b]) => `<tr><th>${esc(a)}</th><td>${esc(b)}</td></tr>`).join('')}</tbody></table><p class="tabla-nota">${esc(p.nota)}</p></div><p class="fuente">Fuente · ${esc(fuenteTxt({ fuentes: p.fuentes.slice(-1) }) || 'docs.celuma.mx')}</p><footer class="pie">${lockup(false)}<span class="cta">docs.celuma.mx</span></footer></div>`;
    return '';
  }
  const AUX = new Set(['avatar', 'destacado', 'portada', 'banner', 'firma', 'slide-titulo', 'slide-contenido']);

  // ==================================================================
  // B · FICHA · RONDA 2 — misma base editorial, con fondos rescatados (Papel cream y Navy) y
  // Microcosmos. Tres modos de B: «edi» editorial sobrio (contenido denso), «atm» atmosférico
  // (identidad y valores) y «mic» microcosmos (una ilustración protagonista).
  // ==================================================================
  const B2 = {
    valor: { modo: 'atm', fondo: 'papel' }, valores: { modo: 'atm', fondo: 'papel' },
    identidad: { modo: 'mic', fondo: 'papel', recurso: 'grupo' },
    capacidad: { modo: 'edi', fondo: 'papel-suave' }, consejo: { modo: 'atm', fondo: 'papel-suave', recurso: 'campo' },
    novedad: { modo: 'atm', fondo: 'navy' }, demo: { modo: 'mic', fondo: 'papel', recurso: 'grupo' },
    flujo: { modo: 'edi', fondo: 'papel-suave' },
    'carrusel-portada': { modo: 'mic', fondo: 'navy', recurso: 'grupo' }, 'carrusel-paso': { modo: 'edi', fondo: 'papel-suave' },
    'carrusel-nota': { modo: 'edi', fondo: 'papel-suave' }, 'carrusel-cierre': { modo: 'atm', fondo: 'navy', recurso: 'recorte' },
    avatar: { modo: 'edi', fondo: 'crema-plano' }, portada: { modo: 'atm', fondo: 'papel-derecha', recurso: 'campo' },
    destacado: { modo: 'atm', fondo: 'papel' }, banner: { modo: 'mic', fondo: 'papel', recurso: 'grupo' },
    firma: { modo: 'edi', fondo: 'crema-plano' }, 'slide-titulo': { modo: 'mic', fondo: 'navy', recurso: 'grupo' },
    'slide-contenido': { modo: 'edi', fondo: 'papel-suave' },
  };
  // Cada valor de la serie tiene su recurso: la serie se reconoce y cada pieza dice algo propio.
  const VALOR_RECURSO = { 1: 'grupo', 2: 'ordenado', 3: 'recorte', 4: 'par', 5: 'campo' };
  function configB2(p, o) {
    const c = Object.assign({}, B2[p.plantilla] || { modo: 'edi', fondo: 'papel-suave' });
    if (p.plantilla === 'valor') c.recurso = VALOR_RECURSO[p.serie[0]];
    if (o.fondo && root.E4MC.FONDOS[o.fondo]) c.fondo = o.fondo;
    if (o.micro === false) { c.recurso = null; if (c.modo === 'mic') c.modo = 'atm'; }
    c.tono = root.E4MC.FONDOS[c.fondo].tono;
    return c;
  }
  // Módulo en flujo (se dibuja después de medir su caja) o capa atmosférica (esquivando texto y firma).
  const mcModulo = (c, extra = '') => `<div class="mc-modulo" data-mc="${c.recurso}" data-tono="${c.tono}"${extra} aria-hidden="true"></div>`;
  function dirB2(p, M, o, corto, c) {
    const tpl = p.plantilla, oscuro = c.tono === 'oscuro';
    const serieTxt = p.serie ? `${pad(p.serie[0])} / ${pad(p.serie[1])}` : (p.version ? esc(p.version) : '');
    const cab = `<header class="cab"><span class="cab-serie">${esc(p.serieB || SERIE_B[tpl] || '')}</span><span class="cab-num">${serieTxt}</span></header>`;
    const fte = fuenteTxt(p);
    const cta = `<span class="cta">${p.ctaEtiqueta ? esc(p.ctaEtiqueta) + ' · ' : ''}${esc(p.cta || 'celuma.mx')}</span>`;
    const pie = `<footer class="pie">${lockup(oscuro)}${cta}</footer>`;
    // Metadatos solo donde hay una afirmación de producto: portada y cierre no la tienen.
    const fuente = fte && !['carrusel-portada', 'carrusel-cierre'].includes(tpl) ? `<p class="fuente">Fuente · ${esc(fte)}</p>` : '';
    const eyT = p.eyebrowB ?? p.eyebrow;
    const ey = eyT ? `<p class="eyebrow">${esc(eyT)}</p>` : '';
    let main = '', modulo = '', col = false;
    const enFlujo = ['ordenado', 'par', 'grupo'].includes(c.recurso);
    switch (tpl) {
      case 'valor':
        main = `<div class="entrada"><h1 class="display" data-max="1">${esc(p.titulo)}</h1><p class="lema">${esc(p.silabas)} <i>sust. f.</i></p><p class="def" data-max="4"><span class="def-n">1</span>${esc(p.texto)}</p></div>`;
        if (enFlujo) modulo = mcModulo(c, ` data-semilla="${p.serie[0] * 7}" data-foco="1,3" data-filas-max="3"`);
        col = true; break;
      case 'valores':
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="2">${esc(p.titulo)}</h1></div>`;
        modulo = `<div class="mc-separador" data-tono="${c.tono}" aria-hidden="true"></div><ol class="valores-lista" data-max="5">${p.lista.map((v, i) => `<li><span class="li-n">${pad(i + 1)}</span><span class="v">${esc(v)}</span></li>`).join('')}</ol>`;
        col = true; break;
      case 'carrusel-paso':
        main = `<div class="entrada"><p class="indice">${pad(p.paso)}</p><p class="quien">${icono('persona')}${esc(p.quien)}</p><h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><p class="texto" data-max="5">${esc(p.texto)}</p></div>`;
        modulo = `<div class="modulo tracker">${rastreador(4, p.paso, PASOS_B)}</div>`;
        col = true; break;
      case 'carrusel-portada':
        main = `<div class="entrada"><h1 class="titulo xl" data-max="4">${esc(p.titulo)}</h1><p class="texto" data-max="3">${esc(p.texto)}</p><p class="desliza">${esc(p.accion)} ${icono('flecha')}</p></div>`;
        if (c.recurso) modulo = mcModulo(c, ' data-semilla="23"');
        col = true; break;
      case 'carrusel-nota':
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="3">${esc(p.titulo)}</h1><p class="texto" data-max="4">${esc(p.texto)}</p></div>`;
        modulo = `<div class="modulo tracker">${rastreador(4, 3, PASOS_B)}<p class="nota-tracker">${icono('flecha', 'girada')}Reabierto, vuelve a edición y a revisión</p></div>`;
        col = true; break;
      case 'carrusel-cierre':
        main = `<div class="entrada"><h1 class="titulo" data-max="3">${esc(p.titulo)}</h1><p class="texto" data-max="3">${esc(p.texto)}</p></div>`;
        modulo = `<div class="modulo destino"><p class="destino-et">Consulta la guía en</p><p class="destino-url">${esc(p.cta)}</p></div>`;
        col = true; break;
      case 'novedad': {
        const pts = corto && p.puntosCortos ? p.puntosCortos : p.puntos;
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="3">${T(p, 'titulo', corto)}</h1></div>`;
        modulo = `<ol class="lista" data-max="6">${pts.map((x, i) => `<li><span class="li-n">${pad(i + 1)}</span>${esc(x)}</li>`).join('')}</ol>`;
        break;
      }
      case 'flujo':
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><p class="texto" data-max="2">${esc(p.texto)}</p></div>`;
        modulo = M.horizontal
          ? `<div class="modulo tracker grande">${rastreador(4, 4, p.pasos)}</div>`
          : `<ol class="pasos-v" data-max="8">${p.pasos.map((x, i) => `<li class="${i === p.pasos.length - 1 ? 'meta' : ''}"><span class="punto" aria-hidden="true"></span><span class="pv-n">${pad(i + 1)}</span><span class="pv-t">${esc(x)}</span><span class="pv-q">${esc(p.responsables[i])}</span></li>`).join('')}</ol>`;
        col = true; break;
      default: {
        const conTabla = !!p.permisos;
        main = `<div class="entrada">${ey}<h1 class="titulo" data-max="3">${T(p, 'titulo', corto)}</h1>${p.texto && !conTabla ? `<p class="texto" data-max="4">${T(p, 'texto', corto)}</p>` : ''}</div>`;
        if (conTabla) modulo = `<table class="permisos" data-max="6"><tbody>${(corto && p.permisosCortos ? p.permisosCortos : p.permisos).map(([q, a, si]) => `<tr class="${si ? 'si' : 'no'}"><th>${esc(q)}</th><td><span class="marca" aria-hidden="true"></span>${esc(a)}</td></tr>`).join('')}</tbody></table>`;
        else if (c.recurso && enFlujo) modulo = mcModulo(c, ` data-semilla="${tpl.length * 5}"`);
        else if (tpl === 'capacidad') modulo = mcModulo({ recurso: 'ordenado', tono: c.tono }, ' data-foco="1,3"');
        col = M.horizontal ? false : true;
      }
    }
    const atmos = c.recurso && !enFlujo ? `<svg class="mc-atmos" data-mc="${c.recurso}" data-tono="${c.tono}" data-semilla="${(p.serie ? p.serie[0] : 1) * 11}" aria-hidden="true"></svg>` : '';
    return `${atmos}<div class="area">${cab}<div class="cuerpo${col ? ' col' : ''}">${main}${modulo}</div>${fuente}${pie}</div>`;
  }
  function auxB2(p, M, c) {
    const tpl = p.plantilla, oscuro = c.tono === 'oscuro';
    if (tpl === 'destacado') return `<div class="destacado-centro"><span class="destacado-celula" data-mc="celda" data-tono="${c.tono}">${icono(p.icono)}</span><p class="destacado-titulo">${esc(p.titulo)}</p></div>`;
    if (tpl === 'portada') return `<svg class="mc-atmos" data-mc="campo" data-tono="${c.tono}" data-semilla="5" aria-hidden="true"></svg><div class="area fila">${lockup(false, 'portada-lockup')}<span class="regla-v" aria-hidden="true"></span><p class="portada-texto" data-max="2">${esc(p.texto)}</p><div class="portada-aire"></div></div>`;
    if (tpl === 'banner') return `<div class="area fila"><div class="banner-txt"><p class="eyebrow">${esc(p.eyebrow)}</p><h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><p class="cta">${esc(p.cta)}</p></div>${mcModulo(c, ' data-semilla="19"')}${lockup(false, 'banner-lockup')}</div>`;
    if (tpl === 'slide-titulo') return `<div class="area"><header class="cab"><span class="cab-serie">${esc(p.eyebrow)}</span><span class="cab-num">01</span></header><div class="cuerpo"><div class="entrada"><h1 class="titulo xl" data-max="3">${esc(p.titulo)}</h1><p class="texto" data-max="2">${esc(p.texto)}</p></div>${mcModulo(c, ' data-semilla="29"')}</div><footer class="pie">${lockup(oscuro)}<span class="cta">celuma.mx</span></footer></div>`;
    return auxB1(p, M);
  }



  // ==================================================================
  // C · MEMBRANA
  // ==================================================================
  function dirC(p, M, o, corto) {
    const tpl = p.plantilla;
    const rad = membranaRadios[(p.serie ? p.serie[0] : 0) % membranaRadios.length];
    const foco = (contenido) => `<span class="foco" aria-hidden="true">${contenido}</span>`;
    const firma = `<footer class="firma">${lockup(false)}<span class="cta">${p.ctaEtiqueta ? esc(p.ctaEtiqueta) + ' · ' : ''}${esc(p.cta || 'celuma.mx')}</span></footer>`;
    let dentro = '', fuera = '';
    if (tpl === 'valor') {
      dentro = `${foco(p.serie[0])}<h1 class="display" data-max="1">${esc(p.titulo)}</h1><p class="texto grande" data-max="4">${esc(p.texto)}</p>`;
      fuera = `<p class="eyebrow">${esc(p.eyebrow)} · ${p.serie[0]} de ${p.serie[1]}</p>`;
    } else if (tpl === 'carrusel-paso') {
      dentro = `${foco(p.paso)}<p class="quien">${esc(p.quien)}</p><h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><p class="texto" data-max="5">${esc(p.texto)}</p>`;
      fuera = `<p class="eyebrow">Paso ${p.paso} de 4</p><p class="serie">${p.serie[0]} / ${p.serie[1]}</p>`;
    } else if (tpl === 'carrusel-portada') {
      dentro = `${foco(icono('flujo'))}<h1 class="titulo xl" data-max="4">${esc(p.titulo)}</h1><p class="texto" data-max="3">${esc(p.texto)}</p>`;
      fuera = `<p class="eyebrow">${esc(p.eyebrow)}</p><p class="desliza">${esc(p.accion)} ${icono('flecha')}</p><p class="serie">${p.serie[0]} / ${p.serie[1]}</p>`;
    } else if (tpl === 'novedad') {
      const pts = corto && p.puntosCortos ? p.puntosCortos : p.puntos;
      dentro = `${foco(icono('novedad'))}<h1 class="titulo" data-max="3">${T(p, 'titulo', corto)}</h1><ul class="puntos" data-max="6">${pts.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
      fuera = p.eyebrow ? `<p class="eyebrow">${esc(p.eyebrow)}</p>` : '';
    } else if (tpl === 'flujo') {
      dentro = `${foco(icono('flujo'))}<h1 class="titulo" data-max="2">${esc(p.titulo)}</h1><ol class="pasos-lista">${p.pasos.map((x, i) => `<li><span class="n">${i + 1}</span>${esc(x)}</li>`).join('')}</ol>`;
      fuera = p.eyebrow ? `<p class="eyebrow">${esc(p.eyebrow)}</p>` : '';
    } else {
      const ic = { capacidad: 'firma', consejo: 'guia', demo: 'persona', identidad: 'valor', 'carrusel-nota': 'plantilla', 'carrusel-cierre': 'guia' }[tpl] || 'guia';
      dentro = `${foco(icono(ic))}<h1 class="titulo" data-max="3">${T(p, 'titulo', corto)}</h1>${p.texto ? `<p class="texto" data-max="4">${T(p, 'texto', corto)}</p>` : ''}`;
      fuera = p.eyebrow ? `<p class="eyebrow">${esc(p.eyebrow)}</p>` : '';
    }
    return `<div class="area"><div class="arriba">${fuera}</div><div class="membrana" style="border-radius:${rad}"><div class="citoplasma">${dentro}</div></div>${firma}</div>`;
  }



  // ------------------------------------------------------------------
  // Ronda 2 · Microcosmos después del layout: módulos a la medida de su caja y capas atmosféricas
  // que crecen solo hasta tocar la exclusión (texto, firma + ½ isotipo de protección, metadatos).
  // ------------------------------------------------------------------
  // Exclusión ajustada a las líneas reales de texto (rectángulos de cada línea), no a la caja del bloque.
  const SEL_TEXTO = '.cab,.cab-serie,.cab-num,.titulo,.display,.texto,.def,.lema,.eyebrow,.fuente,.cta,.desliza,.serie,.portada-texto,.quien,.indice,.destino-et,.destino-url,.lista li,.valores-lista li,.permisos tr,.pasos-v li,.tabla tr,.tabla-nota,.nota-tracker,.tracker,.regla-v,.mc-modulo';
  const SEL_LOGO = '.firma-lockup,.portada-lockup,.banner-lockup,.firma-v,.iso-avatar';
  function rectsExclusion(pz, M) {
    const b = pz.getBoundingClientRect(), k = b.width / M.W;
    const rel = (r, pad = 0) => [(r.left - b.left) / k - pad, (r.top - b.top) / k - pad, (r.right - b.left) / k + pad, (r.bottom - b.top) / k + pad];
    const pad = M.S * 0.035, out = [];
    pz.querySelectorAll(SEL_TEXTO).forEach((e) => {
      if (/\b(cab|tracker|regla-v|mc-modulo)\b/.test(e.className)) { const r = e.getBoundingClientRect(); if (r.width) out.push(rel(r, pad)); return; }
      const rg = document.createRange(); rg.selectNodeContents(e);
      [...rg.getClientRects()].filter((r) => r.width > 1 && r.height > 1).forEach((r) => out.push(rel(r, pad)));
    });
    pz.querySelectorAll(SEL_LOGO).forEach((e) => { const r = e.getBoundingClientRect(); if (r.width) out.push(rel(r, Math.max(pad, M.iso * 0.5))); });
    return out;
  }
  const distRect = (x, y, [x0, y0, x1, y1]) => Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(y0 - y, 0, y - y1));
  function ajustarMicrocosmos(pz) {
    const MC = root.E4MC; if (!MC || !pz.classList.contains('r2')) return;
    const fid = pz.dataset.formato, M = metricas(fid);
    const peso = Math.max(2, M.S * 0.0055);
    pz.querySelectorAll('.mc-modulo[data-mc]').forEach((el) => {
      const w = el.clientWidth, h = el.clientHeight, tono = el.dataset.tono, semilla = +el.dataset.semilla || 11;
      el.removeAttribute('data-omitido');
      if (Math.min(w, h) < M.S * 0.16) { el.innerHTML = ''; el.dataset.omitido = '1'; return; }
      let svg = '';
      if (el.dataset.mc === 'ordenado') {
        const [cc] = RET_B[fid] || [8, 3]; const g = w / cc; const filas = Math.max(1, Math.min(+el.dataset.filasMax || 4, Math.floor(h / g)));
        const [ff, fc] = (el.dataset.foco || '1,3').split(',').map(Number);
        const o = MC.campoOrdenado({ caja: [0, h - filas * g, w], cols: cc, filas, foco: [Math.min(ff, filas - 1), Math.min(fc, cc - 1)], tono, peso: peso * 0.55 });
        svg = o.svg;
      } else {
        const a = w / h; const disp = el.dataset.mc === 'par' ? 'par' : a > 1.75 ? 'horizontal' : a < 0.72 ? 'vertical' : 'diagonal';
        const g = MC.grupo({ caja: [0, 0, w, h], disposicion: disp, seed: semilla, tono, peso, ancla: el.dataset.ancla || (M.horizontal ? 'centro' : 'abajo-derecha') });
        svg = g.svg;
      }
      el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" overflow="visible">${svg}</svg>`;
    });
    pz.querySelectorAll('svg.mc-atmos[data-mc]').forEach((el) => {
      const W = M.W, H = M.H, tono = el.dataset.tono, semilla = +el.dataset.semilla || 11;
      el.setAttribute('viewBox', `0 0 ${W} ${H}`); el.setAttribute('width', W); el.setAttribute('height', H);
      el.innerHTML = ''; el.removeAttribute('data-omitido');
      const ex = rectsExclusion(pz, M);
      // Banda libre entre el bloque de texto y el pie: ahí vive el recurso atmosférico.
      const ent = pz.querySelector('.entrada,.portada-texto'), pie = pz.querySelector('.pie,.portada-lockup');
      const b = pz.getBoundingClientRect(), k = b.width / W;
      const yTop = ent ? (ent.getBoundingClientRect().bottom - b.top) / k : H * 0.4;
      const yBot = pie ? (pie.getBoundingClientRect().top - b.top) / k : H * 0.85;
      const yc = M.horizontal ? H * 0.5 : (yTop + yBot) / 2;
      const mc = el.dataset.mc;
      if (mc === 'campo') {
        const exc = ex.map(([a, b2, c2, d2]) => [a, b2, c2 - a, d2 - b2]);
        // Ancho (portada): columna derecha. Vertical y cuadrado: la banda libre entre el texto y el pie.
        const caja = M.horizontal
          ? (() => { const x0 = Math.max(...ex.filter((r) => r[1] < H * 0.9).map((r) => r[2]).filter((x) => x < W * 0.8), W * 0.55); return [x0, 0, W - x0, H]; })()
          : [0, yTop, W, Math.max(0, yBot - yTop)];
        const f = MC.campo({ caja, paso: M.S * (M.horizontal ? 0.14 : 0.075), densidad: 1, seed: semilla, tono, peso: peso * 0.55, excluir: exc, desvanecer: 'izquierda', margen: M.S * 0.01 });
        if (f.n < 4) { el.dataset.omitido = '1'; return; }
        el.innerHTML = f.svg;
        return;
      }
      if (mc === 'contornos' && pz.querySelector('.valores-lista')) {
        // Lista de valores: los contornos acompañan al título arriba a la derecha.
        const t = pz.querySelector('.entrada').getBoundingClientRect(), b2 = pz.getBoundingClientRect(), k2 = b2.width / W;
        const cy2 = (t.top - b2.top) / k2 + (t.height / k2) / 2, cx2 = W + M.S * 0.06;
        const d2 = Math.min(...ex.map((r) => distRect(cx2, cy2, r)));
        const r2 = d2 / ((0.4 + 4 * 0.17) * 1.08);
        if (r2 < M.S * 0.12) { el.dataset.omitido = '1'; return; }
        el.innerHTML = `<g transform="translate(${cx2 - W} ${cy2 - H})">${MC.contornos({ W, H, r: r2, esquina: 'abajo-derecha', seed: semilla, tono, peso: peso * 0.72 }).svg}</g>`;
        return;
      }
      // Centro óptimo sobre el borde derecho: el que deja más distancia libre a texto y firma.
      const cx = mc === 'recorte' ? W + M.S * 0.12 : W + M.S * 0.16;
      let cy = Math.max(yc, H * 0.35), dmin = -1;
      for (let y = Math.max(yTop, H * 0.3); y <= Math.min(yBot + M.S * 0.1, H * 0.92); y += M.S * 0.01) {
        const d = Math.min(...ex.map((r) => distRect(cx, y, r)));
        if (d > dmin + 0.5) { dmin = d; cy = y; }
      }
      if (mc === 'contornos') {
        const r = dmin / ((0.4 + 4 * 0.17) * 1.08);
        if (r < M.S * 0.18) { el.dataset.omitido = '1'; return; }
        el.innerHTML = MC.contornos({ W, H, r, esquina: 'abajo-derecha', seed: semilla, tono, peso: peso * 0.72 }).svg.replace(/(<path d=")/g, '$1').replace(/^/, `<g transform="translate(${cx - W} ${cy - H})">`) + '</g>';
      } else if (mc === 'recorte') {
        const r = Math.min(M.S * 0.62, dmin / 1.18);
        if (r < M.S * 0.24) { el.dataset.omitido = '1'; return; }
        el.innerHTML = MC.celula({ cx, cy, r, seed: semilla, tipo: 'protagonista', tono, peso, foco: null, luz: false, rot: 0.3 }).svg;
      }
    });
    pz.querySelectorAll('.mc-separador').forEach((el) => {
      const w = el.clientWidth, h = M.S * 0.06, r = M.S * 0.022;
      el.style.height = h + 'px';
      el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${MC.separador({ x: 0, y: h / 2, w, r, tono: el.dataset.tono, peso: Math.max(1.5, peso * 0.55) })}</svg>`;
    });
    pz.querySelectorAll('.destacado-celula[data-mc]').forEach((el) => {
      const w = el.clientWidth; const r = w * 0.42;
      const c = MC.celula({ cx: w / 2, cy: w / 2, r: r * 0.86, tipo: 'pequena', tono: el.dataset.tono, peso: Math.max(2, M.S * 0.006), foco: null, seed: 3 });
      const m = MC.membranaAbierta({ cx: w / 2, cy: w / 2, r: r * 1.04, tono: el.dataset.tono, peso: Math.max(2, M.S * 0.008), seed: 6 });
      const fondo = `<path d="${MC.suave(MC.puntos(w / 2, w / 2, r * 0.86, r * 0.86, 0, 3, 0.012, 8))}" fill="${MC.C.mentaSuave}"/>`;
      el.insertAdjacentHTML('afterbegin', `<svg class="celda" viewBox="0 0 ${w} ${w}" width="${w}" height="${w}">${fondo}${m.svg}</svg>`);
      void c;
    });
  }

  // ------------------------------------------------------------------
  // Comprobación de composición: líneas frente a presupuesto, área útil y solapes.
  // ------------------------------------------------------------------
  function lineas(el) {
    const r = document.createRange(); r.selectNodeContents(el);
    const tops = [];
    [...r.getClientRects()].filter((x) => x.width > 1 && x.height > 1).forEach((x) => { if (!tops.some((t) => Math.abs(t - x.top) < x.height * 0.5)) tops.push(x.top); });
    return tops.length;
  }
  const dentro = (a, b, tol = 1) => a.left >= b.left - tol && a.right <= b.right + tol && a.top >= b.top - tol && a.bottom <= b.bottom + tol;
  const cruza = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
  function medir(pz, fid) {
    const M = metricas(fid);
    const box = pz.getBoundingClientRect();
    const k = box.width / M.W; // admite piezas escaladas (editor)
    const util = { left: box.left + M.m * k - 1, right: box.right - M.m * k + 1, top: box.top + (M.m + M.zonaArriba) * k - 1, bottom: box.bottom - (M.m + M.zonaAbajo) * k + 1 };
    const r = { lineas: [], fuera: [], solapes: [] };
    pz.querySelectorAll('[data-max]').forEach((el) => {
      const n = el.tagName === 'UL' || el.tagName === 'OL' || el.tagName === 'TABLE' ? [...el.querySelectorAll(':scope > li, tr')].reduce((s, li) => s + lineas(li), 0) : lineas(el);
      r.lineas.push({ el: el.className, n, max: +el.dataset.max, ok: n <= +el.dataset.max });
    });
    // .membrana y .lumen pueden sangrar (recurso gráfico); el texto y la firma, nunca.
    const sel = '.titulo,.display,.texto,.def,.eyebrow,.cta,.firma-lockup,.lema,.fuente,.lista,.puntos,.pasos-lista,.pasos-v,.permisos,.valores-lista,.serie,.desliza,.cab,.pie,.foco,.quien,.indice,.numero,.modulo,.tabla';
    pz.querySelectorAll(sel).forEach((el) => { const b = el.getBoundingClientRect(); if (b.width && !dentro(b, util)) r.fuera.push(String(el.className.baseVal ?? el.className)); });
    pz.querySelectorAll('.citoplasma,.area,.cuerpo').forEach((el) => { if (el.scrollHeight > el.clientHeight + 1) r.fuera.push('desborde:' + el.className); });
    const bloques = [...pz.querySelectorAll('.titulo,.display,.texto,.def,.lista,.puntos,.pasos-lista,.pasos-v,.permisos,.valores-lista,.firma,.pie,.modulo,.desliza,.fuente,.tabla')];
    for (let i = 0; i < bloques.length; i++) for (let j = i + 1; j < bloques.length; j++) {
      if (bloques[i].contains(bloques[j]) || bloques[j].contains(bloques[i])) continue;
      if (cruza(bloques[i].getBoundingClientRect(), bloques[j].getBoundingClientRect())) r.solapes.push(bloques[i].className + ' × ' + bloques[j].className);
    }
    // Ronda 2: el microcosmos no toca texto ni la protección del logo; contraste contra el fondo real.
    r.microcosmos = []; r.contraste = []; r.proteccion = [];
    if (pz.classList.contains('r2') && root.E4MC) {
      const k = box.width / M.W;
      const textos = [...pz.querySelectorAll('.titulo,.display,.texto,.def,.lema,.eyebrow,.cta,.fuente,.cab-serie,.cab-num,.lista li,.valores-lista li,.permisos tr,.pasos-v li,.desliza,.quien,.indice,.destino-et,.destino-url,.nodo .et,.portada-texto,.tabla tr,.tabla-nota,.nota-tracker,.destacado-titulo,.firma-datos p')];
      // Geometría real: puntos de cada línea de texto contra el relleno y el trazo de cada forma.
      const formasEl = [...pz.querySelectorAll('.mc-modulo path, .mc-modulo circle, svg.mc-atmos path, svg.mc-atmos circle')];
      const formas = formasEl.map((e) => e.getBoundingClientRect()).filter((q) => q.width > 1);
      const toca = (el, x, y) => { const m = el.getScreenCTM(); if (!m) return false; const pt = new DOMPoint(x, y).matrixTransform(m.inverse()); return el.isPointInFill(pt) || el.isPointInStroke(pt); };
      const tocaZona = (z) => { for (const el of formasEl) { const fb = el.getBoundingClientRect(); if (!cruza(fb, z)) continue; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 3; j++) if (toca(el, z.left + ((z.right - z.left) * i) / 8, z.top + ((z.bottom - z.top) * j) / 3)) return true; } return false; };
      textos.forEach((t) => {
        const rg = document.createRange(); rg.selectNodeContents(t);
        const lineas = [...rg.getClientRects()].filter((q) => q.width > 1);
        if (lineas.some((q) => tocaZona(q))) r.microcosmos.push('forma sobre texto: ' + t.className);
      });
      const fondo = pz.dataset.fondo;
      const lum = ([R, G, B]) => { const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(R) + 0.7152 * f(G) + 0.0722 * f(B); };
      const cr = (a, b2) => { const x = lum(a), y = lum(b2); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      textos.forEach((t) => {
        const tr = t.getBoundingClientRect(); if (!tr.width) return;
        const cs = getComputedStyle(t); const col = cs.color.match(/\d+(\.\d+)?/g).map(Number);
        let peor = Infinity;
        for (let i = 0; i <= 4; i++) for (let j = 0; j <= 2; j++) {
          const x = (tr.left - box.left + (tr.width * i) / 4) / k, y = (tr.top - box.top + (tr.height * j) / 2) / k;
          peor = Math.min(peor, cr(col.slice(0, 3), root.E4MC.colorFondo(fondo, M.W, M.H, x, y)));
        }
        const px = parseFloat(cs.fontSize) / k * (390 / M.W), peso = +cs.fontWeight;
        const obj = px >= 24 || (peso >= 700 && px >= 18.66) ? 3 : 4.5;
        r.contraste.push({ el: String(t.className).split(' ')[0] || t.tagName, min: Math.round(peor * 100) / 100, objetivo: obj, ok: peor >= obj });
      });
      pz.querySelectorAll(SEL_LOGO).forEach((lg) => {
        const lr = lg.getBoundingClientRect(); if (!lr.width) return;
        const pad = M.iso * 0.5 * k;
        const zona = { left: lr.left - pad, top: lr.top - pad, right: lr.right + pad, bottom: lr.bottom + pad };
        const invade = tocaZona(zona) ? 1 : 0;
        const pts = []; for (let i = 0; i <= 4; i++) for (let j = 0; j <= 2; j++) pts.push(root.E4MC.colorFondo(fondo, M.W, M.H, (zona.left - box.left + ((zona.right - zona.left) * i) / 4) / k, (zona.top - box.top + ((zona.bottom - zona.top) * j) / 2) / k));
        const delta = Math.max(...[0, 1, 2].map((c) => Math.max(...pts.map((q) => q[c])) - Math.min(...pts.map((q) => q[c]))));
        r.proteccion.push({ logo: lg.className, formasDentro: invade, variacionFondo: Math.round(delta * 10) / 10, ok: invade === 0 && delta <= 3 });
      });
    }
    r.ok = r.lineas.every((x) => x.ok) && !r.fuera.length && !r.solapes.length && !r.microcosmos.length && r.contraste.every((x) => x.ok) && r.proteccion.every((x) => x.ok);
    return r;
  }

  const RENDER = { a: dirA, b: dirB1, c: dirC };

  // ------------------------------------------------------------------
  // API
  // ------------------------------------------------------------------
  function html(pid, dir, fid, opciones = {}) {
    const p = root.E4C.PIEZAS[pid];
    if (!p) throw new Error('Pieza desconocida: ' + pid);
    const M = metricas(fid);
    const corto = !!opciones.corto;
    const aux = AUX.has(p.plantilla);
    // 'b' = B · Ficha ronda 2 (fondos + Microcosmos). 'b1' = B de la ronda 1, conservada como antecedente.
    if (dir === 'b' && root.E4MC) {
      const c = configB2(p, opciones);
      const inner = aux ? auxB2(p, M, c) : dirB2(p, M, opciones, corto, c);
      const cls = ['pz', 'd-b', 'r2', 'm-' + c.modo, 'fondo-' + c.fondo, 't-' + p.plantilla, 'f-' + fid, 'o-' + orientacion(fid), corto ? 'corto' : '', c.tono === 'oscuro' ? 'tono-navy' : ''].join(' ');
      const fondo = `<div class="capa-fondo" aria-hidden="true">${root.E4MC.svgFondo(c.fondo, M.W, M.H, 'f' + pid.replace(/[^a-z0-9]/gi, ''))}</div>`;
      return `<article class="${cls}" style="${vars(M)}" data-pieza="${pid}" data-dir="b" data-formato="${fid}" data-fondo="${c.fondo}" data-modo="${c.modo}" lang="es">${fondo}${inner}</article>`;
    }
    const d = dir === 'b1' ? 'b' : dir;
    const inner = aux ? auxB1(p, M) : (dir === 'b1' ? dirB1 : RENDER[dir])(p, M, opciones, corto);
    const tono = (d === 'b' || aux) && TONO_B[p.plantilla] ? 'tono-' + TONO_B[p.plantilla] : '';
    const cls = ['pz', 'd-' + (aux ? 'b' : d), 't-' + p.plantilla, 'f-' + fid, 'o-' + orientacion(fid), corto ? 'corto' : '', tono].join(' ');
    return `<article class="${cls}" style="${vars(M)}" data-pieza="${pid}" data-dir="${dir}" data-formato="${fid}" lang="es">${inner}</article>`;
  }

  root.E4 = { html, medir, ajustarModulos, ajustarMicrocosmos, rectsExclusion, B2, DIRECCIONES, ICONOS, icono, metricas, FORMATOS, lumen, cuadricula };
})(typeof window !== 'undefined' ? window : globalThis);
