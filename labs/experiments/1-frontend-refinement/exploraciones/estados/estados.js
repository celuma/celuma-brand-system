// Exploración · Aprobado ≠ Publicado (y Lista ≠ Liberada). EXPLORACIÓN, no aprobada.
// Reutiliza sin modificarlos: ../../data.js (tonos y etiquetas de ronda 3, datos
// ficticios) y ../../icons.js (geometría SVG). Los glifos «llenos» de V2 se
// derivan de los mismos trazados del sprite, pintados con relleno.
import { TONES as R3_TONES, STATES, PATIENTS } from '../../data.js';
import { mountIcons, icon } from '../../icons.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ------------------------------------------------------------------ variantes
// Ronda 2 tal como se entregó (referencia histórica, no candidata).
const R2_TONES = {
  nuevo: { ink: '#1d4ed8', bg: '#eff6ff' }, encurso: { ink: '#92400e', bg: '#fffbeb' },
  diagnostico: { ink: '#6d28d9', bg: '#f5f3ff' }, revision: { ink: '#be185d', bg: '#fdf2f8' },
  completado: { ink: '#047857', bg: '#ecfdf5' }, cerrado: { ink: '#155e75', bg: '#ecfeff' },
  entregado: { ink: '#ffffff', bg: '#166534' }, atencion: { ink: '#b91c1c', bg: '#fef2f2' },
  neutro: { ink: '#374151', bg: '#f3f4f6' },
};

export const VARIANTS = {
  r2: {
    short: 'R2', name: 'Ronda 2 · relleno oscuro', role: 'referencia',
    how: 'Polaridad invertida: Publicado y Liberada en verde oscuro con texto blanco; el resto con contorno.',
    tones: R2_TONES,
  },
  r3: {
    short: 'R3', name: 'Ronda 3 · actual', role: 'actual',
    how: 'Misma píldora clara sin contorno; Publicado solo un menta algo más intenso y un sello de trazo.',
    tones: R3_TONES,
  },
  v1: {
    short: 'V1', name: 'V1 · Escalón tonal', role: 'alternativa',
    how: 'Solo luminancia: Aprobado y Lista casi neutros; Publicado y Liberada en menta media. Iconos y texto como R3.',
    tones: { ...R3_TONES, completado: { ink: '#07694c', bg: '#eef7f2' }, entregado: { ink: '#033d2d', bg: '#86d9ae' } },
  },
  v2: {
    short: 'V2', name: 'V2 · Glifo lleno', role: 'alternativa',
    how: 'Colores de R3 intactos. Los estados entregados dibujan su icono relleno (sello, avión) en su tinta; el resto, de trazo.',
    tones: R3_TONES, solid: true,
  },
  v3: {
    short: 'V3', name: 'V3 · Calificador en el chip', role: 'alternativa',
    how: 'Colores e iconos de R3. El chip dice «Aprobado · sin firmar». Solo el texto separa los estados.',
    tones: R3_TONES, qualifier: 'inside',
  },
  v4: {
    short: 'V4', name: 'V4 · Interno ≠ entregado', role: 'alternativa',
    how: 'Cambia el significado del verde: queda solo para lo entregado. Aprobado, Lista y Cerrada pasan a un cian «interno».',
    tones: { ...R3_TONES, interno: { ink: '#0a6384', bg: '#e4f4fb' } },
    remap: { report: { APPROVED: 'interno' }, sample: { READY: 'interno' }, order: { CLOSED: 'interno' }, review: { APPROVED: 'interno' } },
  },
  v5: {
    short: 'V5', name: 'V5 · Glifo lleno + escalón suave', role: 'alternativa',
    how: 'Combina V2 y la mitad del escalón de V1: los entregados, en menta algo más intensa y con su icono relleno.',
    tones: { ...R3_TONES, entregado: { ink: '#065a44', bg: '#a9e5c5' } }, solid: true,
  },
  rec: {
    short: 'V2+', name: 'V2+ · Glifo lleno + contexto', role: 'recomendada',
    how: 'V2, y «sin firmar» fuera del chip únicamente en tablas que no tienen columna «Qué sigue».',
    tones: R3_TONES, solid: true, qualifier: 'outside',
  },
};
const ORDER = ['r2', 'r3', 'v1', 'v2', 'v3', 'v4', 'v5', 'rec'];
// Glifos llenos: el sello conserva su silueta (relleno + check blanco); el avión va
// en blanco sobre un disco lleno, porque el avión relleno tenía poca superficie.
const SOLID = { 'badge-check': { shape: [0], detail: [1] }, send: { disc: true } };

// ------------------------------------------------------------------ píldora
function stateOf(domain, status) { return STATES[domain][status]; }
function toneKey(v, domain, status) { return v.remap?.[domain]?.[status] || stateOf(domain, status).tone; }
function chip(vId, domain, status, { lg = false } = {}) {
  const v = VARIANTS[vId];
  const st = stateOf(domain, status);
  const tk = toneKey(v, domain, status);
  const t = v.tones[tk];
  const solid = v.solid && tk === 'entregado' && SOLID[st.icon];
  const ic = solid ? `<svg class="ic solid" aria-hidden="true" focusable="false"><use href="#i-${st.icon}-solid"/></svg>` : icon(st.icon);
  const q = v.qualifier === 'inside' && domain === 'report' && status === 'APPROVED' ? '<span class="q-in"> · sin firmar</span>' : '';
  return `<span class="chip${lg ? ' chip-lg' : ''}" data-tone="${tk}" data-domain="${domain}" data-status="${status}"${solid ? ' data-glyph="lleno"' : ''} style="--ink:${t.ink};--bg:${t.bg}">${ic}${esc(st.label)}${q}</span>`;
}
// Celda de estado en tablas SIN «Qué sigue»: el calificador fuera del chip.
function stateCell(vId, domain, status) {
  const v = VARIANTS[vId];
  const out = v.qualifier === 'outside' && domain === 'report' && status === 'APPROVED' ? '<span class="q-out">sin firmar</span>' : '';
  return `<span class="cell-state">${chip(vId, domain, status)}${out}</span>`;
}
function decision(label = 'Aprobó', when = '25 sep, 15:00') {
  return `<span>${icon('check-circle', 'ic-sm')}${esc(label)} · ${esc(when)}</span>`;
}

// ------------------------------------------------------------------ contextos
const DENSE = [
  ['ORD-EJ-0036', 'p11', 'RELEASED', ['READY'], 'PUBLISHED'],
  ['ORD-EJ-0040', 'p10', 'CLOSED', ['READY'], 'APPROVED'],
  ['ORD-EJ-0039', 'p15', 'REVIEW', ['READY', 'READY'], 'APPROVED'],
  ['ORD-EJ-0031', 'p14', 'RELEASED', ['READY'], 'PUBLISHED'],
  ['ORD-EJ-0044', 'p13', 'REVIEW', ['READY', 'PROCESSING'], 'IN_REVIEW'],
  ['ORD-EJ-0047', 'p17', 'DIAGNOSIS', ['READY', 'READY'], 'DRAFT'],
  ['ORD-EJ-0028', 'p16', 'RELEASED', ['READY'], 'RETRACTED'],
];
function ctxDense(v) {
  return `<div class="ctx ctx-dense" data-ctx="tabla">
    <div class="ctx-title">Órdenes<small>tabla densa · filas de 44 px · sin columna «Qué sigue»</small></div>
    <table class="grid"><caption class="sr-only">Órdenes con estados de orden, muestra e informe</caption>
      <thead><tr><th scope="col">Orden</th><th scope="col">Paciente</th><th scope="col">Orden</th><th scope="col">Muestras</th><th scope="col">Informe</th></tr></thead>
      <tbody>${DENSE.map(([code, p, os, ss, rs]) => `<tr>
        <td class="cell-code"><a href="#tabla" tabindex="-1">${code}</a></td>
        <td style="max-width:150px"><span style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(PATIENTS[p].name)}</span></td>
        <td>${chip(v, 'order', os)}</td>
        <td><span class="samples-cell">${ss.map((s) => chip(v, 'sample', s)).join('')}</span></td>
        <td>${stateCell(v, 'report', rs)}</td></tr>`).join('')}</tbody>
    </table></div>`;
}
const WORK = [
  ['report', 'ORD-EJ-0039', 'Informe de la orden', 'p15', 'Firmar y publicar', 'Tú · revisora asignada', 'report', 'APPROVED', 'hace 2 d'],
  ['report', 'ORD-EJ-0031', 'Informe de la orden', 'p14', 'Completada', 'Informe publicado', 'report', 'PUBLISHED', 'hace 4 d'],
  ['sample', 'MUE-EJ-0090', 'de ORD-EJ-0040', 'p10', 'Completada', '', 'sample', 'READY', 'hace 3 d'],
  ['order', 'ORD-EJ-0036', 'Orden', 'p11', 'Completada', '', 'order', 'RELEASED', 'hace 5 d'],
  ['report', 'ORD-EJ-0044', 'Informe de la orden', 'p13', 'Revisar y decidir', 'Tú · revisora asignada', 'report', 'IN_REVIEW', 'hace 26 h'],
];
const TYPE_ICON = { report: 'file-text', sample: 'flask', order: 'clipboard' };
function ctxWork(v) {
  return `<div class="ctx ctx-work" data-ctx="trabajo">
    <div class="ctx-title">Mi trabajo<small>con «Qué sigue» · incluye completadas</small></div>
    <table class="grid"><caption class="sr-only">Lista de trabajo</caption>
      <thead><tr><th scope="col">Elemento</th><th scope="col">Qué sigue</th><th scope="col">Estado</th><th scope="col">Asignada</th></tr></thead>
      <tbody>${WORK.map(([t, code, sub, , next, who, d, s, age]) => `<tr>
        <td class="cell-code"><span class="type-badge">${icon(TYPE_ICON[t])}<span><a href="#trabajo" tabindex="-1">${code}</a><span class="cell-sub">${esc(sub)}</span></span></span></td>
        <td><div class="cell-task"><strong>${esc(next)}</strong>${who ? `<span class="by">${esc(who)}</span>` : ''}</div></td>
        <td>${chip(v, d, s)}</td>
        <td class="cell-age">${age}</td></tr>`).join('')}</tbody>
    </table></div>`;
}
function fichaHtml(v, status, compact = false) {
  const hint = status === 'APPROVED' ? 'Falta firmar y publicar · los solicitantes aún no lo ven' : 'PDF oficial de la versión 3 · documento del laboratorio';
  return `<div class="ctx ficha" data-ctx="ficha">
    <div class="top"><span class="code-chip">ORD-EJ-0044</span>${chip(v, 'report', status, { lg: true })}</div>
    <div><h3>Estudio histopatológico de ejemplo</h3><div class="sub">Paciente Demo Cuatro · PAC-EJ-0013 · Versión 3</div></div>
    ${compact ? '' : `<div class="now"><span class="lbl">Ahora</span>${chip(v, 'report', status)}<span class="hint">${hint}</span></div>`}
    <div class="who"><span class="avatar" aria-hidden="true">RE</span><span class="t"><strong>Revisora Ejemplo</strong>${decision()}${status === 'PUBLISHED' ? `<span>${icon('stamp', 'ic-sm')}Firmó y publicó · 25 sep, 16:00</span>` : ''}</span><em>Decisión de revisión · no es el estado del informe</em></div>
  </div>`;
}
function ctxFicha(v) { return `<div data-ctx="fichas">${fichaHtml(v, 'APPROVED')}${fichaHtml(v, 'PUBLISHED')}</div>`; }
function wcard(v, [t, code, sub, p, next, who, d, s, age]) {
  return `<li class="wcard">
    <div class="row1"><span class="cell-code type-badge">${icon(TYPE_ICON[t])}<a class="stretch" href="#movil" tabindex="-1">${code}</a></span>${chip(v, d, s)}</div>
    <div class="cell-patient"><span class="who"><strong>${esc(PATIENTS[p].name)}</strong><span class="cell-sub">${esc(PATIENTS[p].code)} · ${esc(sub)}</span></span></div>
    <div class="task"><span class="cell-task"><strong>${esc(next)}</strong>${who ? `<span class="by">${esc(who)}</span>` : ''}</span><span class="cell-age muted">${age}</span></div>
  </li>`;
}
function ctxPhone(v) {
  return `<div class="phone" data-ctx="movil">
    <div class="ph-bar">Exploración · no aprobada · 390 px</div>
    <div class="ph-body">
      ${fichaHtml(v, 'APPROVED', true)}
      <ul class="cards" aria-label="Mi trabajo (móvil)">${WORK.slice(0, 4).map((w) => wcard(v, w)).join('')}</ul>
    </div></div>`;
}
const CONTEXTS = [
  ['tabla', 'Tabla densa', 'Órdenes con estado de la orden, de sus muestras y del informe en la misma fila: donde Lista, Liberada, Aprobado y Publicado conviven.', ctxDense],
  ['trabajo', 'Lista de trabajo', 'La columna «Qué sigue» ya dice «Firmar y publicar»; el chip solo debe confirmar el estado.', ctxWork],
  ['ficha', 'Ficha de informe', 'Encabezado con chip grande, línea «Ahora» y la decisión de la revisora junto a la persona.', ctxFicha],
  ['movil', 'Móvil · 390 px', 'Marco de 390 px de ancho, tarjetas de la lista de trabajo y ficha compacta.', ctxPhone],
];

// ------------------------------------------------------------------ color
function parseRGB(s) { const m = s.match(/[\d.]+/g); return m.slice(0, 3).map(Number); }
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055) * 255;
const lum = (rgb) => { const [r, g, b] = rgb.map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
function lab(rgb) {
  const [r, g, b] = rgb.map(lin);
  let X = 0.4124 * r + 0.3576 * g + 0.1805 * b, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
  X /= 0.95047; Z /= 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
const dE = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));
const MACHADO = {
  deut: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  prot: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
};
const sim = (rgb, k) => { const c = rgb.map(lin); return MACHADO[k].map((row) => Math.max(0, Math.min(255, unlin(Math.max(0, Math.min(1, row[0] * c[0] + row[1] * c[1] + row[2] * c[2])))))); };
function pairMetrics(a, b) {
  const [ba, bb] = [a, b].map((el) => parseRGB(getComputedStyle(el).backgroundColor));
  return { bg: ratio(ba, bb), dL: Math.abs(lab(ba)[0] - lab(bb)[0]), deut: dE(sim(ba, 'deut'), sim(bb, 'deut')) };
}
export const METRIC_RULES = { bg: [1.3, 1.6], dL: [10, 20], deut: [12, 20] };
const grade = (k, val) => (val >= METRIC_RULES[k][1] ? 'good' : val >= METRIC_RULES[k][0] ? 'weak' : 'bad');

// ------------------------------------------------------------------ vistas
function signals(vId) {
  const v = VARIANTS[vId];
  const s = ['texto'];
  if (vId === 'r2') s.push('polaridad (fondo oscuro)', 'contorno');
  if (vId === 'v1') s.push('luminancia del fondo');
  if (v.solid) s.push('glifo lleno');
  if (v.qualifier === 'inside') s.push('calificador en el chip');
  if (v.qualifier === 'outside') s.push('«sin firmar» fuera del chip en tablas');
  if (vId === 'v4') s.push('familia de color (cian ≠ verde)');
  s.push('icono (sello ≠ check, avión ≠ check)');
  return s;
}
// Medición en píxeles (capturas/medicion-pixeles.json, generada por scripts/measure.py)
let PIX = null;
async function loadPixels() { try { const r = await fetch('capturas/medicion-pixeles.json', { cache: 'no-store' }); if (r.ok) PIX = await r.json(); } catch { PIX = null; } }
const PIX_RULES = { mancha: [35, 60], gris: [25, 40] };
const pgrade = (k, v) => (v >= PIX_RULES[k][1] ? 'good' : v >= PIX_RULES[k][0] ? 'weak' : 'bad');
function renderMatrix() {
  $('#matrix').innerHTML = `<table class="x-matrix"><caption class="sr-only">Pares críticos en cada variante, con métricas medidas</caption>
    <thead><tr><th scope="col">Variante</th><th scope="col">Aprobado</th><th scope="col">Publicado</th><th scope="col">Lista</th><th scope="col">Liberada</th><th scope="col">Cerrada</th><th scope="col">Decisión (texto)</th>
      <th scope="col" title="Diferencia de la zona de 12×12 px más oscura del chip, en gris (0–255)">Mancha A/P</th><th scope="col" title="Igual, Lista frente a Liberada">Mancha L/Lib</th><th scope="col" title="Diferencia de gris medio de todo el chip (0–255)">Gris chip A/P</th><th scope="col" title="Contraste entre fondos Aprobado/Publicado">Fondos A/P</th><th scope="col" title="Diferencia de color de fondos con deuteranopía simulada">ΔE deut. A/P</th><th scope="col">Señales además del color</th></tr></thead>
    <tbody>${ORDER.map((id) => { const v = VARIANTS[id]; return `<tr data-v="${id}" class="v-${id}${v.role === 'recomendada' ? ' is-rec' : ''}">
      <th scope="row">${esc(v.name)}${v.role === 'referencia' ? ' <span class="muted">(referencia)</span>' : ''}<small>${esc(v.how)}</small></th>
      <td>${chip(id, 'report', 'APPROVED')}</td><td>${chip(id, 'report', 'PUBLISHED')}</td>
      <td>${chip(id, 'sample', 'READY')}</td><td>${chip(id, 'order', 'RELEASED')}</td><td>${chip(id, 'order', 'CLOSED')}</td>
      <td><span class="x-dec">${icon('check-circle')}Aprobó</span></td>
      <td class="m" data-m="mancha"></td><td class="m" data-m="manchaL"></td><td class="m" data-m="gris"></td><td class="m" data-m="bg"></td><td class="m" data-m="deut"></td>
      <td style="font-size:12.5px;min-width:170px">${esc(signals(id).join(' · '))}</td></tr>`; }).join('')}</tbody></table>`;
  $$('#matrix tr[data-v]').forEach((tr) => {
    const id = tr.dataset.v;
    const a = $('[data-domain="report"][data-status="APPROVED"]', tr), p = $('[data-domain="report"][data-status="PUBLISHED"]', tr);
    const m = pairMetrics(a, p);
    const put = (k, txt, cls) => { const td = $(`[data-m="${k}"]`, tr); td.textContent = txt; if (cls) td.classList.add(cls); };
    put('bg', `${m.bg.toFixed(2)}:1`, grade('bg', m.bg)); put('deut', m.deut.toFixed(1), grade('deut', m.deut));
    const px = PIX?.[id];
    if (px) {
      put('mancha', String(px.AP_dPeak), pgrade('mancha', px.AP_dPeak)); put('manchaL', String(px.LL_dPeak), pgrade('mancha', px.LL_dPeak));
      put('gris', px.AP_dMean.toFixed(1), pgrade('gris', px.AP_dMean));
    } else ['mancha', 'manchaL', 'gris'].forEach((k) => put(k, '—'));
  });
}
function variantOptions(sel) { return ORDER.map((id) => `<option value="${id}"${id === sel ? ' selected' : ''}>${esc(VARIANTS[id].name)}${VARIANTS[id].role === 'recomendada' ? ' (recomendada)' : ''}</option>`).join(''); }
function renderCompare() {
  const { izq, der } = S;
  $('#sel-izq').innerHTML = variantOptions(izq);
  $('#sel-der').innerHTML = variantOptions(der);
  $('#contexts').innerHTML = CONTEXTS.map(([id, title, lead, fn]) => `<section class="x-sec" id="${id}" aria-labelledby="h-${id}">
      <h2 id="h-${id}">${esc(title)}</h2><p class="x-lead">${esc(lead)}</p>
      <div class="x-duo x-filterable">${[izq, der].map((vid, i) => `<div class="x-side v-${vid}" data-side="${i ? 'der' : 'izq'}" data-v="${vid}">
        <header><b>${esc(VARIANTS[vid].short)}</b><span>${esc(VARIANTS[vid].name.split('·')[1] || '')}${VARIANTS[vid].role === 'recomendada' ? ' · recomendada' : VARIANTS[vid].role === 'actual' ? ' · actual' : ''}</span></header>
        <div class="x-frame" tabindex="0" role="region" aria-label="${esc(title)} · ${esc(VARIANTS[vid].name)}">${fn(vid)}</div>
      </div>`).join('')}</div></section>`).join('');
  renderChecks();
}
// Verificación en vivo: contraste de texto de cada chip, glifos, consistencia por tono y móvil.
function renderChecks() {
  const rows = ORDER.map((id) => {
    const host = document.createElement('div');
    host.className = `v-${id}`;
    host.style.cssText = 'position:absolute;left:-9999px;top:0;width:1200px';
    host.innerHTML = CONTEXTS.map(([, , , fn]) => fn(id)).join('');
    document.body.append(host);
    const chips = $$('.chip', host);
    let minText = 99, minGlyph = 99, maxW = 0;
    const byTone = {};
    chips.forEach((c) => {
      const cs = getComputedStyle(c); const fg = parseRGB(cs.color), bg = parseRGB(cs.backgroundColor);
      minText = Math.min(minText, ratio(fg, bg));
      const g = $('svg', c); if (g) minGlyph = Math.min(minGlyph, ratio(parseRGB(getComputedStyle(g).color), bg));
      maxW = Math.max(maxW, c.getBoundingClientRect().width);
      const key = `${cs.backgroundColor}|${cs.color}|${c.dataset.glyph || 'trazo'}`;
      (byTone[c.dataset.tone] ||= new Set()).add(key);
    });
    const incoherent = Object.entries(byTone).filter(([, s]) => s.size > 1).map(([t]) => t);
    const phone = $('.phone', host);
    const phoneOverflow = [phone, ...$$('*', phone)].reduce((mx, el) => Math.max(mx, el.scrollWidth - el.clientWidth), 0);
    const aprLabel = $('[data-domain="report"][data-status="APPROVED"]', host).getBoundingClientRect().width;
    host.remove();
    return { id, minText, minGlyph, incoherent, phoneOverflow, maxW, aprLabel };
  });
  window.__estadosChecks = rows;
  $('#checks').innerHTML = `<table class="x-check"><caption class="sr-only">Verificación calculada en el navegador</caption>
    <thead><tr><th scope="col">Variante</th><th scope="col">Texto de chip (mín.)</th><th scope="col">Icono vs fondo (mín.)</th><th scope="col">Mismo tono = mismo tratamiento</th><th scope="col">Móvil 390: desbordamiento</th><th scope="col">Ancho de «Aprobado»</th></tr></thead>
    <tbody>${rows.map((r) => `<tr><th scope="row">${esc(VARIANTS[r.id].name)}</th>
      <td class="${r.minText >= 4.5 ? 'ok' : 'no'}">${r.minText.toFixed(2)}:1</td>
      <td class="${r.minGlyph >= 3 ? 'ok' : 'no'}">${r.minGlyph.toFixed(2)}:1</td>
      <td class="${r.incoherent.length ? 'no' : 'ok'}">${r.incoherent.length ? `Difiere en: ${r.incoherent.join(', ')}` : 'Sí'}</td>
      <td class="${r.phoneOverflow <= 0 ? 'ok' : 'no'}">${r.phoneOverflow} px</td>
      <td>${Math.round(r.aprLabel)} px</td></tr>`).join('')}</tbody></table>`;
}
function renderRecPair() {
  $('#rec-pair').innerHTML = ['r3', 'rec'].map((id) => `<div class="row v-${id}"><span class="k">${esc(VARIANTS[id].name)}</span>${chip(id, 'report', 'APPROVED')}${chip(id, 'report', 'PUBLISHED')}${chip(id, 'sample', 'READY')}${chip(id, 'order', 'RELEASED')}</div>`).join('');
}

// ------------------------------------------------------------------ estado y controles
const S = { izq: 'r3', der: 'rec', vista: 'color' };
function readHash() {
  const p = new URLSearchParams(location.hash.replace(/^#/, ''));
  if (VARIANTS[p.get('izq')]) S.izq = p.get('izq');
  if (VARIANTS[p.get('der')]) S.der = p.get('der');
  if (['color', 'gris', 'deut', 'prot'].includes(p.get('vista'))) S.vista = p.get('vista');
}
function writeHash() { history.replaceState(null, '', `#izq=${S.izq}&der=${S.der}&vista=${S.vista}`); }
function applyView() {
  document.body.classList.remove('view-color', 'view-gris', 'view-deut', 'view-prot');
  document.body.classList.add(`view-${S.vista}`);
  $$('[data-vista]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vista === S.vista)));
}
function addSolidSymbols() {
  const svg = $('symbol#i-badge-check').parentNode;
  Object.entries(SOLID).forEach(([name, spec]) => {
    const src = $(`#i-${name}`);
    const paths = $$('path', src);
    const sym = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    sym.id = `i-${name}-solid`;
    sym.setAttribute('viewBox', '0 0 24 24');
    if (spec.disc) {
      const NS = 'http://www.w3.org/2000/svg';
      const disc = document.createElementNS(NS, 'circle');
      disc.setAttribute('cx', '12'); disc.setAttribute('cy', '12'); disc.setAttribute('r', '10.5'); disc.setAttribute('fill', 'currentColor'); disc.setAttribute('stroke', 'none');
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(12 12.4) scale(0.56) translate(-12 -12)');
      g.setAttribute('stroke', '#ffffff'); g.setAttribute('stroke-width', '3.4'); g.setAttribute('fill', 'none');
      paths.forEach((p) => g.append(p.cloneNode()));
      sym.append(disc, g);
      svg.append(sym);
      return;
    }
    spec.shape.forEach((i) => { const c = paths[i].cloneNode(); c.setAttribute('fill', 'currentColor'); c.setAttribute('stroke-width', '1.6'); sym.append(c); });
    spec.detail.forEach((i) => { const c = paths[i].cloneNode(); c.setAttribute('stroke', '#ffffff'); c.setAttribute('stroke-width', '2.4'); sym.append(c); });
    svg.append(sym);
  });
}
// Modo «solo móvil» (#solo=movil&v=<id>): la vista móvil a ancho completo, para
// comprobar una variante en un viewport real de 390 px sin el marco de teléfono.
function renderSolo(vId) {
  document.body.classList.add('x-solo');
  $('#contenido').innerHTML = `<div class="v-${vId}" data-v="${vId}">${ctxPhone(vId)}</div>`;
  const ph = $('.phone');
  ph.style.cssText = 'width:100%;border:0;border-radius:0;box-shadow:none';
  $('.ph-bar', ph).textContent = `Exploración · no aprobada · ${VARIANTS[vId].name}`;
}
async function init() {
  mountIcons();
  addSolidSymbols();
  const solo = new URLSearchParams(location.hash.replace(/^#/, ''));
  if (solo.get('solo') === 'movil' && VARIANTS[solo.get('v')]) { renderSolo(solo.get('v')); document.documentElement.dataset.ready = '1'; return; }
  readHash();
  renderRecPair();
  await loadPixels();
  renderMatrix();
  renderCompare();
  applyView();
  $('#sel-izq').addEventListener('change', (e) => { S.izq = e.target.value; writeHash(); renderCompare(); });
  $('#sel-der').addEventListener('change', (e) => { S.der = e.target.value; writeHash(); renderCompare(); });
  $$('[data-vista]').forEach((b) => b.addEventListener('click', () => { S.vista = b.dataset.vista; writeHash(); applyView(); }));
  document.documentElement.dataset.ready = '1';
}
init();
