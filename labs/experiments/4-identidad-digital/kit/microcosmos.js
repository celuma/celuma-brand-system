// Céluma · Experimento 04 · Ronda 2 · Fondos rescatados y biblioteca Microcosmos (aprobado por Rafael en el laboratorio el 2026-10-07 dentro de B · Ficha ronda 2; incorporación canónica pendiente).
//
// FONDOS. Versiones locales de «01 · Papel cream» y «02 · Navy» (components/web-patterns.jsx,
// PatternCream/PatternNavy) y de CelBlob (components/atoms.jsx), que NO se modifican. CelBlob es un
// gradiente radial: rgba(73,182,173,α) en el centro → α 0,04 al 40 % → 0 al 70 % del radio
// (círculo «farthest-corner» de una caja cuadrada = lado/√2). Aquí se reproduce con el mismo
// perfil, adaptado por proporción. Navy profundo #0A1520 = --celuma-ink-3 (superficie heredada),
// distinto del navy #0D1B2A de tinta y wordmark.
//
// MICROCOSMOS. Gramática propia de células abstractas: membrana (contorno orgánico), interior
// (tinte de citoplasma), foco desplazado hacia la luz (arriba a la izquierda, como los rayos del
// isotipo y los halos). Sin rayos, sin trazos internos, sin nucléolo: nunca un logotipo alternativo.
// Sin escalas, tinciones, aumentos ni significados diagnósticos. Todo es determinista (semillas).
(function (root) {
  const C = { membrana: '#49B6AD', citoplasma: '#BBEAD2', nucleo: '#F98D84', mentaSuave: '#E4F3EA', crema: '#FBF6EC', navy: '#0D1B2A', navyProfundo: '#0A1520', tealRGB: [73, 182, 173] };

  // ------------------------------------------------------------------
  // Utilidades: PRNG determinista y curvas cerradas suaves (Catmull-Rom → Bézier cúbica)
  // ------------------------------------------------------------------
  function rng(seed) { let a = (seed * 2654435761) >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const f1 = (n) => Math.round(n * 10) / 10;
  function suave(pts, cerrado = true) {
    const n = pts.length; const P = (i) => pts[cerrado ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    const lim = cerrado ? n : n - 1;
    for (let i = 0; i < lim; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return cerrado ? d + 'Z' : d;
  }
  // Puntos de un contorno orgánico: elipse con ondulación suave y determinista.
  function puntos(cx, cy, rx, ry, rot, seed, ond = 0.045, n = 8, a0 = 0, tramo = Math.PI * 2, abierto = false) {
    const r = rng(seed); const pts = []; const k = abierto ? n - 1 : n;
    const fase = r() * Math.PI * 2;
    for (let i = 0; i < n; i++) {
      const t = a0 + (tramo * i) / k;
      const w = 1 + ond * (Math.sin(t * 2 + fase) * 0.75 + Math.sin(t * 3 + fase * 1.7) * 0.25 + (r() - 0.5) * 0.35);
      const x = Math.cos(t) * rx * w, y = Math.sin(t) * ry * w;
      pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
    }
    return pts;
  }
  const escalar = (pts, cx, cy, k) => pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);

  // ------------------------------------------------------------------
  // Tonos: claro (papel) y oscuro (navy). Opacidades documentadas.
  // ------------------------------------------------------------------
  const TONOS = {
    // foco: salmón pleno, solo en la protagonista. focoT: núcleo teal tenue de acompañantes (el salmón no se diluye).
    claro: { mem: [C.membrana, 1], mem2: [C.membrana, 0.34], int: [C.citoplasma, 0.62], intT: [C.citoplasma, 0.36], foco: [C.nucleo, 1], focoT: [C.membrana, 0.3], luz: ['#FFFFFF', 0.75], campo: [C.membrana, 0.5], campoInt: [C.citoplasma, 0.3] },
    oscuro: { mem: [C.membrana, 1], mem2: [C.membrana, 0.4], int: [C.membrana, 0.2], intT: [C.citoplasma, 0.09], foco: [C.nucleo, 1], focoT: [C.citoplasma, 0.32], luz: [C.citoplasma, 0.4], campo: [C.membrana, 0.48], campoInt: [C.membrana, 0.1] },
  };
  const relleno = ([c, o]) => `fill="${c}"${o < 1 ? ` fill-opacity="${o}"` : ''}`;
  const trazo = ([c, o], w) => `fill="none" stroke="${c}" stroke-width="${f1(w)}"${o < 1 ? ` stroke-opacity="${o}"` : ''} stroke-linecap="round" stroke-linejoin="round"`;

  // ------------------------------------------------------------------
  // 1 · Células
  // ------------------------------------------------------------------
  // tipo: 'protagonista' (doble membrana, interior pleno, foco salmón pleno; UNA por pieza)
  //       'acompanante'  (membrana simple, interior tenue, foco tintado u omitido)
  //       'pequena'      (membrana sola, sin foco)
  function celula({ cx, cy, r, asp = 0.9, rot = -0.35, seed = 1, tipo = 'protagonista', tono = 'claro', peso = 3, foco, luz = true }) {
    const T = TONOS[tono];
    const pts = puntos(cx, cy, r, r * asp, rot, seed, tipo === 'pequena' ? 0.012 : tipo === 'acompanante' ? 0.025 : 0.035, 8);
    const d = suave(pts);
    let s = '';
    if (tipo === 'protagonista') s += `<path d="${suave(escalar(pts, cx, cy, 1.13))}" ${trazo(T.mem2, peso * 0.55)}/>`;
    if (tipo !== 'pequena') s += `<path d="${d}" ${relleno(tipo === 'protagonista' ? T.int : T.intT)}/>`;
    s += `<path d="${d}" ${trazo(T.mem, tipo === 'pequena' ? peso * 0.7 : tipo === 'acompanante' ? peso * 0.8 : peso)}${tipo === 'pequena' ? '' : ''}/>`;
    // Luz: un arco interior arriba a la izquierda indica la dirección de la luz (no es un trazo del logo).
    if (luz && tipo === 'protagonista') {
      const arco = puntos(cx, cy, r * 0.8, r * asp * 0.8, rot, seed + 7, 0.02, 5, Math.PI * 1.08, Math.PI * 0.36, true);
      s += `<path d="${suave(arco, false)}" ${trazo(T.luz, peso * 0.7)}/>`;
    }
    const conFoco = foco === undefined ? (tipo === 'protagonista' ? 'pleno' : tipo === 'acompanante' ? 'tenue' : null) : foco;
    if (conFoco) {
      const rf = r * (tipo === 'protagonista' ? 0.27 : 0.25);
      const fx = cx - r * 0.2, fy = cy - r * asp * 0.17;
      s += `<path d="${suave(puntos(fx, fy, rf, rf * 0.93, rot + 0.6, seed + 3, 0.03, 7))}" ${relleno(conFoco === 'pleno' ? T.foco : T.focoT)}/>`;
    }
    return { svg: s, caja: [cx - r * 1.16, cy - r * asp * 1.16, cx + r * 1.16, cy + r * asp * 1.16] };
  }

  // Membrana abierta: un contorno de ~290° que abraza un espacio (número, icono o vacío).
  function membranaAbierta({ cx, cy, r, seed = 4, tono = 'claro', peso = 3, inicio = -0.55, tramo = 5.05, rot = 0 }) {
    const T = TONOS[tono];
    const p = puntos(cx, cy, r, r * 0.94, rot, seed, 0.035, 9, inicio, tramo, true);
    const p2 = puntos(cx, cy, r * 1.12, r * 0.94 * 1.12, rot, seed, 0.035, 9, inicio + 0.25, tramo - 0.5, true);
    return { svg: `<path d="${suave(p2, false)}" ${trazo(T.mem2, peso * 0.55)}/><path d="${suave(p, false)}" ${trazo(T.mem, peso)}/>`, caja: [cx - r * 1.14, cy - r * 1.06, cx + r * 1.14, cy + r * 1.06] };
  }

  // ------------------------------------------------------------------
  // 2 · Agrupaciones (posiciones en unidades del radio protagonista; holgura ≥ 0,25 R)
  // ------------------------------------------------------------------
  const DISPOSICIONES = {
    // Protagonista con acompañantes que se alejan de la luz hacia abajo a la derecha.
    diagonal: [['protagonista', 0, 0, 1], ['acompanante', 1.62, 0.62, 0.42], ['acompanante', 0.78, 1.62, 0.3], ['pequena', 2.35, -0.3, 0.17], ['pequena', 1.85, 1.55, 0.14]],
    // Par: dos células de tamaño distinto, cercanas sin tocarse.
    par: [['protagonista', 0, 0, 1], ['acompanante', 1.66, 0.74, 0.55], ['pequena', 2.45, -0.1, 0.16]],
    // Horizontal para bandas, portadas anchas y títulos de presentación.
    horizontal: [['protagonista', 0, 0, 1], ['acompanante', 1.82, 0.42, 0.5], ['acompanante', 3.02, -0.18, 0.3], ['pequena', 2.62, 1.05, 0.16], ['pequena', 3.85, 0.48, 0.13]],
    // Vertical para historias 9:16: la familia desciende.
    vertical: [['protagonista', 0, 0, 1], ['acompanante', 0.62, 1.68, 0.46], ['acompanante', -0.35, 2.75, 0.28], ['pequena', 1.25, 2.62, 0.16], ['pequena', 0.4, 3.45, 0.13]],
  };
  // Encaja una disposición dentro de una caja [x, y, w, h] y la alinea al ancla; devuelve svg + cajas.
  function grupo({ caja, disposicion = 'diagonal', seed = 11, tono = 'claro', peso = 3, ancla = 'centro', focoPleno = true }) {
    const D = DISPOSICIONES[disposicion];
    const [bx, by, bw, bh] = caja;
    // Caja de la disposición en unidades de R (incluye doble membrana)
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    D.forEach(([t, x, y, r]) => { const k = t === 'protagonista' ? 1.16 : 1.03; x0 = Math.min(x0, x - r * k); x1 = Math.max(x1, x + r * k); y0 = Math.min(y0, y - r * k); y1 = Math.max(y1, y + r * k); });
    const R = Math.min(bw / (x1 - x0), bh / (y1 - y0));
    const gw = (x1 - x0) * R, gh = (y1 - y0) * R;
    const ax = { izquierda: 0, centro: 0.5, derecha: 1 }[ancla.split('-')[1] || (ancla === 'centro' ? 'centro' : 'derecha')] ?? 0.5;
    const ay = { arriba: 0, centro: 0.5, abajo: 1 }[ancla.split('-')[0]] ?? 0.5;
    const ox = bx + (bw - gw) * ax - x0 * R, oy = by + (bh - gh) * ay - y0 * R;
    let s = ''; const cajas = [];
    D.forEach(([t, x, y, r], i) => {
      const c = celula({ cx: ox + x * R, cy: oy + y * R, r: r * R, seed: seed + i * 13, tipo: t, tono, peso: peso * (t === 'protagonista' ? 1 : 0.85), asp: t === 'protagonista' ? 0.9 : 0.94, rot: -0.35 + i * 0.4, foco: t === 'protagonista' ? (focoPleno ? 'pleno' : 'tenue') : undefined });
      s += c.svg; cajas.push(c.caja);
    });
    return { svg: s, cajas, R };
  }

  // ------------------------------------------------------------------
  // 3 · Campos (densidad baja/media; retícula hexagonal con desplazamiento; tres tamaños, no aleatorios)
  // ------------------------------------------------------------------
  // Campo: retícula hexagonal SIN desorden de posición. El tamaño y la ocupación crecen hacia el borde
  // indicado («desvanecer» = lado desde el que se apaga): una gradación deliberada, no burbujas sueltas.
  function campo({ caja, paso = 90, densidad = 0.6, seed = 5, tono = 'claro', peso = 2, excluir = [], desvanecer = 'ninguno', margen = 0 }) {
    const [bx, by, bw, bh] = caja; const r = rng(seed); const T = TONOS[tono];
    let s = '', n = 0;
    for (let fila = 0, y = by + paso / 2; y < by + bh - paso * 0.2; fila++, y += paso * 0.866) {
      for (let x = bx + paso / 2 + (fila % 2 ? paso / 2 : 0); x < bx + bw - paso * 0.2; x += paso) {
        // t: 0 en el lado que se apaga, 1 en el borde fuerte
        let t = 1;
        if (desvanecer === 'izquierda') t = (x - bx) / bw;
        if (desvanecer === 'derecha') t = 1 - (x - bx) / bw;
        if (desvanecer === 'arriba') t = (y - by) / bh;
        if (desvanecer === 'abajo') t = 1 - (y - by) / bh;
        if (r() > densidad * Math.pow(t, 1.15)) continue;
        const k = paso * (0.22 + 0.17 * t);
        if (excluir.some(([ex, ey, ew, eh]) => x + k + margen > ex && x - k - margen < ex + ew && y + k + margen > ey && y - k - margen < ey + eh)) continue;
        const d = suave(puntos(x, y, k, k * 0.94, 0.6, seed + n * 7, 0.02, 7));
        const o = Math.round((0.3 + 0.7 * t) * 100) / 100;
        s += `<g opacity="${o}">${t > 0.35 ? `<path d="${d}" ${relleno(T.campoInt)}/>` : ''}<path d="${d}" ${trazo(T.campo, peso)}/></g>`;
        n++;
      }
    }
    return { svg: s, n };
  }
  // Campo ordenado (ronda 1, refinado): retícula regular, una célula foco. Se conserva para modo editorial.
  function campoOrdenado({ caja, cols = 10, filas = 3, foco = [1, 3], tono = 'claro', peso = 2 }) {
    const [bx, by, bw] = caja; const g = bw / cols, r = g * 0.2; const T = TONOS[tono];
    let s = '';
    for (let y = 0; y < filas; y++) for (let x = 0; x < cols; x++) {
      const cx = bx + x * g + g / 2, cy = by + y * g + g / 2;
      if (y === foco[0] && x === foco[1]) s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r * 1.42)}" ${relleno(T.foco)}/>`;
      else s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" ${relleno(tono === 'claro' ? [C.mentaSuave, 1] : T.campoInt)} stroke="${C.membrana}" stroke-width="${f1(peso)}"/>`;
    }
    return { svg: s, alto: filas * g };
  }

  // ------------------------------------------------------------------
  // 4 · Contornos y bordes: recorte perimetral y contornos concéntricos desde una esquina
  // ------------------------------------------------------------------
  const ESQ = { 'abajo-derecha': [1, 1], 'arriba-derecha': [1, 0], 'abajo-izquierda': [0, 1], 'arriba-izquierda': [0, 0] };
  function recortePerimetral({ W, H, r, esquina = 'abajo-derecha', seed = 21, tono = 'claro', peso = 3, foco = null, dentro = 0.42 }) {
    const [ex, ey] = ESQ[esquina];
    // centro fuera del lienzo: queda visible ~ «dentro» del radio
    const cx = ex * W + (ex ? 1 : -1) * r * (1 - dentro) * 0.75, cy = ey * H + (ey ? 1 : -1) * r * (1 - dentro) * 0.75;
    const c = celula({ cx, cy, r, seed, tipo: 'protagonista', tono, peso, foco, luz: false, rot: 0.3 });
    return { svg: c.svg, centro: [cx, cy], r };
  }
  function contornos({ W, H, r, esquina = 'abajo-derecha', anillos = 5, seed = 31, tono = 'claro', peso = 2 }) {
    const [ex, ey] = ESQ[esquina]; const T = TONOS[tono];
    const cx = ex * W, cy = ey * H; let s = '';
    for (let i = 0; i < anillos; i++) {
      const k = r * (0.4 + i * 0.17);
      const o = Math.round((0.82 - i * 0.11) * 100) / 100;
      s += `<path d="${suave(puntos(cx, cy, k, k * 0.94, 0.4, seed + i, 0.03, 9))}" ${trazo([T.mem[0], o], peso)}/>`;
    }
    return { svg: s, centro: [cx, cy], r: r * (0.4 + (anillos - 1) * 0.17) * 1.05 };
  }

  // ------------------------------------------------------------------
  // 5 · Detalles: foco-detalle y separador
  // ------------------------------------------------------------------
  function focoDetalle({ cx, cy, r, tono = 'claro', peso = 2, pleno = false, seed = 41 }) {
    const T = TONOS[tono]; const d = suave(puntos(cx, cy, r, r * 0.94, 0.2, seed, 0.03, 7));
    const rf = r * 0.42;
    return `<path d="${d}" ${relleno(T.intT)}/><path d="${d}" ${trazo(T.mem, peso)}/><path d="${suave(puntos(cx - r * 0.18, cy - r * 0.16, rf, rf, 0, seed + 1, 0.04, 6))}" ${relleno(pleno ? T.foco : T.focoT)}/>`;
  }
  function separador({ x, y, w, r, tono = 'claro', peso = 2 }) {
    const T = TONOS[tono];
    return `<line x1="${f1(x + r * 2.6)}" y1="${f1(y)}" x2="${f1(x + w)}" y2="${f1(y)}" ${trazo(T.mem2, peso)}/>` + focoDetalle({ cx: x + r, cy: y, r, tono, peso });
  }

  // ------------------------------------------------------------------
  // FONDOS rescatados (perfil de CelBlob). Cada halo: centro (fracción de W, H), radio en S, α pico.
  // ------------------------------------------------------------------
  const FONDOS = {
    papel: { base: C.crema, tono: 'claro', nombre: 'Papel cream', halos: [{ x: 0.32, y: 0.45, r: 1.06, a: 0.18 }] },
    'papel-suave': { base: C.crema, tono: 'claro', nombre: 'Papel cream suave', halos: [{ x: 0.3, y: 0.32, r: 0.95, a: 0.11, a40: 0.03 }] },
    navy: { base: C.navyProfundo, tono: 'oscuro', nombre: 'Navy', halos: [{ x: 0.29, y: 0.4, r: 0.99, a: 0.22 }, { x: 0.93, y: 0.95, r: 0.78, a: 0.126, a40: 0.028 }] },
    'navy-suave': { base: C.navyProfundo, tono: 'oscuro', nombre: 'Navy suave', halos: [{ x: 0.28, y: 0.32, r: 0.92, a: 0.15, a40: 0.03 }] },
    // Excepción documentada: en portadas anchas con el lockup a la izquierda, la luz va detrás del texto.
    'papel-derecha': { base: C.crema, tono: 'claro', nombre: 'Papel cream (luz a la derecha)', fijo: true, halos: [{ x: 0.64, y: 0.42, r: 1.06, a: 0.18 }] },
    'crema-plano': { base: C.crema, tono: 'claro', nombre: 'Crema plano', halos: [] },
    'navy-plano': { base: C.navyProfundo, tono: 'oscuro', nombre: 'Navy plano', halos: [] },
  };
  // Ajuste por proporción: la luz queda arriba a la izquierda, detrás del mensaje, y su perfil se
  // apaga antes de la firma (abajo a la izquierda) para que el logo descanse sobre un fondo uniforme.
  // El azulejo original (280 × 200, 1,4:1) conserva exactamente la posición de CelBlob.
  function halosPara(fondo, W, H) {
    const S = Math.min(W, H), q = W / H;
    const forma = q >= 1.6 ? 'ancho' : q >= 1.3 ? 'original' : q >= 0.95 ? 'cuadrado' : q >= 0.66 ? 'alto' : 'vertical';
    const AJ = { ancho: [0.22, 0.24, 0.9], cuadrado: [0.27, 0.25, 0.84], alto: [0.3, 0.32, 1], vertical: [0.3, 0.3, 1] };
    return FONDOS[fondo].halos.map((h, i) => {
      let { x, y } = h, k = 1;
      if (i === 0 && AJ[forma] && !FONDOS[fondo].fijo) [x, y, k] = AJ[forma];
      return { cx: x * W, cy: y * H, R: h.r * S * k, a: h.a, a40: h.a40 ?? 0.04 };
    });
  }
  // α del halo en un punto (perfil CelBlob: lineal α→a40 en 0–40 %, a40→0 en 40–70 %)
  function alfaHalo(h, x, y) {
    const t = Math.hypot(x - h.cx, y - h.cy) / h.R;
    if (t <= 0.4) return h.a + (h.a40 - h.a) * (t / 0.4);
    if (t <= 0.7) return h.a40 * (1 - (t - 0.4) / 0.3);
    return 0;
  }
  // Color de fondo resultante en un punto (composición «source-over» de cada halo sobre la base)
  function colorFondo(fondo, W, H, x, y) {
    let [r, g, b] = [1, 3, 5].map((i) => parseInt(FONDOS[fondo].base.slice(i, i + 2), 16));
    for (const h of halosPara(fondo, W, H)) { const a = alfaHalo(h, x, y); r += (C.tealRGB[0] - r) * a; g += (C.tealRGB[1] - g) * a; b += (C.tealRGB[2] - b) * a; }
    return [r, g, b];
  }
  function svgFondo(fondo, W, H, id = 'f') {
    const F = FONDOS[fondo]; const hs = halosPara(fondo, W, H);
    const [tr, tg, tb] = C.tealRGB; const tc = `rgb(${tr},${tg},${tb})`;
    const defs = hs.map((h, i) => `<radialGradient id="${id}h${i}" gradientUnits="userSpaceOnUse" cx="${f1(h.cx)}" cy="${f1(h.cy)}" r="${f1(h.R)}"><stop offset="0" stop-color="${tc}" stop-opacity="${h.a}"/><stop offset="0.4" stop-color="${tc}" stop-opacity="${h.a40}"/><stop offset="0.7" stop-color="${tc}" stop-opacity="0"/></radialGradient>`).join('');
    return `<svg class="fondo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">${defs ? `<defs>${defs}</defs>` : ''}<rect width="${W}" height="${H}" fill="${F.base}"/>${hs.map((h, i) => `<rect width="${W}" height="${H}" fill="url(#${id}h${i})"/>`).join('')}</svg>`;
  }


  // ------------------------------------------------------------------
  // CATÁLOGO: 9 recursos en 5 familias (los contornos concéntricos se descartaron en la revisión: en composición se leían como un icono de señal). Cada recurso se dibuja en una lámina W×H y devuelve su
  // zona de exclusión (donde no puede entrar texto ni firma). Peso de línea base = S × 0,0055.
  // ------------------------------------------------------------------
  const peso = (W, H) => Math.max(2, Math.min(W, H) * 0.0055);
  const CATALOGO = [
    { id: 'celula-protagonista', familia: 'Células', nombre: 'Célula protagonista',
      intencion: 'El foco de la pieza: una sola por composición, con doble membrana, interior pleno, foco salmón desplazado hacia la luz y un arco de luz interior.',
      reglas: 'Radio ≥ 0,16 S. Una por pieza; es el único foco salmón pleno. Holgura de texto ≥ 0,25 R alrededor de la doble membrana.',
      fondos: 'Papel, papel suave, crema plano, navy, navy suave.',
      dibujar: (W, H, tono) => { const r = Math.min(W, H) * 0.3; const c = celula({ cx: W * 0.5, cy: H * 0.52, r, tono, peso: peso(W, H) }); return { svg: c.svg, excl: [c.caja] }; } },
    { id: 'celula-acompanante', familia: 'Células', nombre: 'Células acompañantes',
      intencion: 'Escala la protagonista en dos pasos (0,42 y 0,18 R): membrana simple, interior tenue, foco tintado o ausente.',
      reglas: 'Nunca más grandes que la protagonista ni con foco pleno. Tres tamaños, no más.',
      fondos: 'Todos.',
      dibujar: (W, H, tono) => { const S = Math.min(W, H), p = peso(W, H); const a = celula({ cx: W * 0.36, cy: H * 0.52, r: S * 0.17, tipo: 'acompanante', tono, peso: p * 0.85, seed: 3 }); const b = celula({ cx: W * 0.68, cy: H * 0.42, r: S * 0.09, tipo: 'pequena', tono, peso: p * 0.85, seed: 5 }); const c = celula({ cx: W * 0.66, cy: H * 0.68, r: S * 0.06, tipo: 'pequena', tono, peso: p * 0.85, seed: 8 }); return { svg: a.svg + b.svg + c.svg, excl: [a.caja, b.caja, c.caja] }; } },
    { id: 'membrana-abierta', familia: 'Células', nombre: 'Membrana abierta',
      intencion: 'Un contorno de ~290° que abraza un número o un icono: contención sin cerrar, para índices y destacados.',
      reglas: 'Dentro solo un número o icono centrado; la abertura mira hacia arriba a la derecha (por donde entra la luz).',
      fondos: 'Papel, crema plano, navy.',
      dibujar: (W, H, tono) => { const r = Math.min(W, H) * 0.3; const m = membranaAbierta({ cx: W / 2, cy: H / 2, r, tono, peso: peso(W, H) }); return { svg: m.svg, excl: [m.caja] }; } },
    { id: 'grupo-asimetrico', familia: 'Agrupaciones', nombre: 'Grupo asimétrico',
      intencion: 'Ilustración protagonista: una célula y sus acompañantes se alejan de la luz hacia abajo a la derecha. Ordenado, nunca aleatorio.',
      reglas: 'Ocupa un módulo reservado (35–50 % del área útil); el texto vive fuera de su caja. Disposiciones: diagonal, horizontal y vertical.',
      fondos: 'Papel, navy.',
      dibujar: (W, H, tono) => { const g = grupo({ caja: [W * 0.08, H * 0.08, W * 0.84, H * 0.84], tono, peso: peso(W, H), disposicion: 'diagonal' }); return { svg: g.svg, excl: g.cajas }; } },
    { id: 'grupo-par', familia: 'Agrupaciones', nombre: 'Par',
      intencion: 'Dos células cercanas sin tocarse: compañía y relevo, para mensajes breves y consejos.',
      reglas: 'Holgura ≥ 0,25 R entre membranas; no unir con líneas ni dar significado de división celular.',
      fondos: 'Papel, papel suave, navy.',
      dibujar: (W, H, tono) => { const g = grupo({ caja: [W * 0.1, H * 0.14, W * 0.8, H * 0.72], tono, peso: peso(W, H), disposicion: 'par', seed: 17 }); return { svg: g.svg, excl: g.cajas }; } },
    { id: 'campo-perimetral', familia: 'Campos', nombre: 'Campo perimetral',
      intencion: 'Un tejido de células sobre retícula hexagonal que crece desde un borde y se aclara hacia el texto: orden vivo, comunidad, sin competir con el mensaje.',
      reglas: 'Sin desorden de posición: tamaño y ocupación crecen hacia el borde fuerte. Paso 0,07–0,13 S. Nunca bajo el texto ni en la protección del logo.',
      fondos: 'Papel, papel suave, navy.',
      dibujar: (W, H, tono) => { const S = Math.min(W, H); const f = campo({ caja: [W * 0.4, 0, W * 0.6, H], paso: S * 0.08, densidad: 1, tono, peso: peso(W, H) * 0.55, desvanecer: 'izquierda', seed: 9 }); return { svg: f.svg, excl: [[W * 0.4, 0, W, H]] }; } },
    { id: 'campo-ordenado', familia: 'Campos', nombre: 'Campo ordenado',
      intencion: 'La cuadrícula de la ronda 1, más ligera: un foco entre muchas células iguales. Para piezas de producto y modo editorial.',
      reglas: 'Celdas enteras, nunca deformadas; una sola célula foco; columnas fijas por formato.',
      fondos: 'Crema plano, papel suave, navy.',
      dibujar: (W, H, tono) => { const o = campoOrdenado({ caja: [W * 0.1, H * 0.3, W * 0.8], cols: 8, filas: 3, foco: [1, 2], tono, peso: peso(W, H) * 0.55 }); return { svg: o.svg, excl: [[W * 0.1, H * 0.3, W * 0.9, H * 0.3 + o.alto]] }; } },
    { id: 'recorte-perimetral', familia: 'Contornos', nombre: 'Recorte perimetral',
      intencion: 'Una gran célula vista de cerca, cortada por el borde: profundidad y escala para identidad y cierres.',
      reglas: 'Visible ≤ 45 % de su radio; foco tintado; nunca en la esquina de la firma.',
      fondos: 'Papel, navy.',
      dibujar: (W, H, tono) => { const S = Math.min(W, H); const rp = recortePerimetral({ W, H, r: S * 0.62, tono, peso: peso(W, H), esquina: 'arriba-derecha', dentro: 0.62 }); return { svg: rp.svg, excl: [[W * 0.4, 0, W, H * 0.62]] }; } },
    { id: 'foco-separador', familia: 'Detalles', nombre: 'Foco y separador',
      intencion: 'Detalle mínimo para modo editorial: marca un elemento de lista o separa bloques sin añadir otra ilustración.',
      reglas: 'Una línea por bloque; foco tintado (el pleno se reserva a la protagonista).',
      fondos: 'Todos.',
      dibujar: (W, H, tono) => { const S = Math.min(W, H), p = peso(W, H) * 0.6; const r = S * 0.05; return { svg: separador({ x: W * 0.12, y: H * 0.42, w: W * 0.76, r, tono, peso: p }) + focoDetalle({ cx: W * 0.5, cy: H * 0.7, r: S * 0.09, tono, peso: p }), excl: [[W * 0.1, H * 0.35, W * 0.9, H * 0.82]] }; } },
  ];

  root.E4MC = { CATALOGO, C, TONOS, FONDOS, DISPOSICIONES, rng, puntos, suave, celula, membranaAbierta, grupo, campo, campoOrdenado, recortePerimetral, contornos, focoDetalle, separador, halosPara, alfaHalo, colorFondo, svgFondo };
})(typeof window !== 'undefined' ? window : globalThis);
