// Experimento 01 · Refinamiento del frontend — EXPLORACIÓN, no aprobada.
// Vanilla JS sin dependencias. No persiste nada ni llama a ninguna API: las
// acciones clínicas solo muestran su consecuencia visual y lo dicen.
import {
  TENANT, PERSONAS, TONES, STATES, ORDER_STEPS, REPORT_STEPS, SAMPLE_TYPES, NOW,
  PATIENTS, WORKLIST, ORDERS, TIMELINE_0044, CONVERSATION_0044, REPORT_0044,
} from './data.js';
import { mountIcons, icon } from './icons.js';

// ---------------------------------------------------------------- estado UI
const S = {
  data: 'normal',
  density: 'cómoda',
  notes: false,
  wl: { q: '', type: 'all', focus: null, showDone: false, sort: 'old' },
  od: { q: '', status: 'all', selected: 'ORD-EJ-0044', tab: 'timeline', tl: 'all' },
  rf: { status: 'IN_REVIEW', persona: 'revisora', busy: false },
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const main = () => $('#contenido');

// ---------------------------------------------------------------- formato
const TZ = 'America/Mexico_City';
const fDate = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });
const fShort = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });
const fDay = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ });
const fTime = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const dateTxt = (iso) => fDate.format(new Date(iso)).replace('.', '');
const shortTxt = (iso) => fShort.format(new Date(iso)).replace('.', '');
const dayTxt = (iso) => cap(fDay.format(new Date(iso)));
function ageTxt(iso) {
  const min = Math.round((NOW - new Date(iso)) / 60000);
  if (min < 60) return `hace ${min} min`;
  const hh = Math.round(min / 60);
  if (hh < 48) return `hace ${hh} h`;
  return `hace ${Math.round(hh / 24)} d`;
}
const initials = (name) => name.split(/\s+/).filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w)).slice(0, 2).map((w) => w[0]).join('');

// ---------------------------------------------------------------- piezas
function toneOf(domain, status) { return STATES[domain][status]; }
function chip(domain, status, { lg = false, label } = {}) {
  const st = toneOf(domain, status);
  if (!st) return `<span class="chip t-neutro">${esc(status)}</span>`;
  return `<span class="chip t-${st.tone}${lg ? ' chip-lg' : ''}">${icon(st.icon)}${esc(label || st.label)}</span>`;
}
const labelTag = (l) => `<span class="label">${icon('tag')}${esc(l)}</span>`;
const TYPE = {
  report: { label: 'Informe', icon: 'file-text' },
  sample: { label: 'Muestra', icon: 'flask' },
  order: { label: 'Orden', icon: 'clipboard' },
};
function note(n, html) { return `<p class="dnote"><span class="n">${n}</span><span>${html}</span></p>`; }

function toast(title, body = '', kind = 'info') {
  const inks = { info: '#1f7a75', ok: '#047857', warn: '#92400e', error: '#b91c1c' };
  const ic = { info: 'info', ok: 'check-circle', warn: 'alert-triangle', error: 'alert-triangle' }[kind];
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  el.style.setProperty('--ink', inks[kind]);
  el.innerHTML = `${icon(ic)}<div><strong>${esc(title)}</strong>${body ? `<p>${esc(body)}</p>` : ''}</div><button type="button" class="btn btn-ghost btn-xs btn-icon x" aria-label="Cerrar aviso">${icon('x', 'ic-sm')}</button>`;
  $('.x', el).addEventListener('click', () => el.remove());
  $('#toasts').append(el);
  setTimeout(() => el.remove(), 6500);
}

// Estilos de tono generados desde data.js (una sola fuente de verdad).
function injectTones() {
  const css = Object.entries(TONES).map(([k, t]) => `.t-${k}{--ink:${t.ink};--bg:${t.bg}}`).join('');
  const st = document.createElement('style');
  st.textContent = css;
  document.head.append(st);
}

// ---------------------------------------------------------------- navegación
const NAV = [
  { sep: 'Laboratorio' },
  { href: '#/trabajo', label: 'Mi trabajo', icon: 'list-checks', key: 'trabajo', count: () => WORKLIST.filter((w) => nextAction(w).mine && !nextAction(w).done).length },
  { href: '#/ordenes', label: 'Órdenes', icon: 'clipboard', key: 'ordenes' },
  { href: '#/fuera', label: 'Muestras', icon: 'flask', soon: true },
  { href: '#/informe', label: 'Informes', icon: 'file-text', key: 'informe' },
  { sep: 'Directorio' },
  { href: '#/fuera', label: 'Pacientes', icon: 'user', soon: true },
  { href: '#/fuera', label: 'Médicos solicitantes', icon: 'stethoscope', soon: true },
  { sep: 'Administración' },
  { href: '#/fuera', label: 'Resumen', icon: 'home', soon: true },
  { href: '#/fuera', label: 'Facturación', icon: 'receipt', soon: true },
  { sep: 'Prototipo' },
  { href: '#/componentes', label: 'Componentes', icon: 'layers', key: 'componentes' },
  { href: 'direcciones.html', label: 'Direcciones A/B', icon: 'sliders', key: 'dir' },
];
function renderNav(active) {
  $('#nav').innerHTML = NAV.map((n) => {
    if (n.sep) return `<div class="nav-label">${esc(n.sep)}</div>`;
    const cur = n.key === active ? ' aria-current="page"' : '';
    const c = n.count ? n.count() : 0;
    return `<a href="${n.href}"${cur}${n.soon ? ' class="is-soon" data-soon="1"' : ''} title="${esc(n.label)}${n.soon ? ' (fuera del prototipo)' : ''}">${icon(n.icon)}<span>${esc(n.label)}${n.soon ? '<span class="sr-only"> (fuera del prototipo)</span>' : ''}</span>${c ? `<b class="count" aria-label="${c} pendientes">${c}</b>` : ''}${n.soon ? '<i class="soon" aria-hidden="true"></i>' : ''}</a>`;
  }).join('') + '<p class="nav-foot"><i aria-hidden="true"></i><span>Sección fuera del prototipo</span></p>';
}

// ---------------------------------------------------------------- trabajo diario
// «Qué sigue» se deriva del tipo, la decisión y el estado de la entidad.
function nextAction(w) {
  if (w.kind === 'review') {
    if (w.decision === 'PENDING') return { text: 'Revisar y decidir', who: 'Tú · revisora asignada', mine: true, group: 'decidir' };
    if (w.decision === 'APPROVED' && w.report_status === 'APPROVED') return { text: 'Firmar y publicar', who: 'Tú · revisora asignada', mine: true, group: 'firmar' };
    if (w.decision === 'REJECTED') return { text: 'Esperando correcciones', who: 'Patóloga Ejemplo · autora', mine: false, group: 'espera' };
    return { text: 'Completada', who: 'Informe publicado', mine: false, done: true, group: 'hecho' };
  }
  if (w.type === 'sample') {
    return {
      RECEIVED: { text: 'Iniciar proceso', mine: true, group: 'muestras' },
      PROCESSING: { text: 'Completar proceso', mine: true, group: 'muestras' },
      DAMAGED: { text: 'Atender muestra insuficiente', mine: true, group: 'muestras' },
      READY: { text: 'Completada', mine: false, done: true, group: 'hecho' },
      CANCELLED: { text: 'Cancelada', mine: false, done: true, group: 'hecho' },
    }[w.status];
  }
  if (w.type === 'order') {
    if (w.status === 'RELEASED' || w.status === 'CANCELLED') return { text: 'Completada', mine: false, done: true, group: 'hecho' };
    return { text: w.status === 'DIAGNOSIS' ? 'Continuar diagnóstico' : 'Dar seguimiento', mine: true, group: 'otras' };
  }
  if (w.type === 'report') {
    if (w.status === 'DRAFT') return { text: 'Continuar borrador', who: 'Tú · autora', mine: true, group: 'otras' };
    return { text: 'En revisión', who: 'Esperando a la revisora', mine: false, group: 'espera' };
  }
  return { text: '—', mine: false, group: 'otras' };
}
function entityState(w) {
  if (w.kind === 'review') return chip('report', w.report_status);
  return chip(w.type === 'order' ? 'order' : w.type === 'sample' ? 'sample' : 'report', w.status);
}
const FOCUS = [
  { key: 'decidir', label: 'Por revisar y decidir', icon: 'eye', tone: 'revision' },
  { key: 'firmar', label: 'Por firmar y publicar', icon: 'stamp', tone: 'completado' },
  { key: 'muestras', label: 'Muestras por atender', icon: 'flask', tone: 'nuevo' },
  { key: 'espera', label: 'En espera de otras personas', icon: 'clock', tone: 'neutro' },
];

function wlFiltered() {
  const { q, type, focus, showDone, sort } = S.wl;
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-\s·]/g, '');
  const nq = norm(q);
  let rows = WORKLIST.filter((w) => {
    const na = nextAction(w);
    if (!showDone && na.done) return false;
    if (type !== 'all' && w.type !== type) return false;
    if (focus && na.group !== focus) return false;
    if (nq) {
      const p = PATIENTS[w.patient];
      const hay = norm([w.code, w.order, p?.name, p?.code, ...(w.labels || [])].join(' '));
      if (!hay.includes(nq)) return false;
    }
    return true;
  });
  rows.sort((a, b) => (sort === 'old' ? 1 : -1) * (new Date(a.at) - new Date(b.at)));
  return rows;
}

function viewTrabajo() {
  const pending = WORKLIST.filter((w) => !nextAction(w).done);
  const doneCount = WORKLIST.length - pending.length;
  const counts = Object.fromEntries(FOCUS.map((f) => [f.key, pending.filter((w) => nextAction(w).group === f.key).length]));
  const typeCount = (t) => WORKLIST.filter((w) => (S.wl.showDone || !nextAction(w).done) && (t === 'all' || w.type === t)).length;

  main().innerHTML = `
  <div class="page">
    <header class="card page-head">
      <div>
        <h1 class="page-title">Mi trabajo</h1>
        <p class="page-sub">Tus asignaciones y revisiones en ${esc(TENANT.name)}. Lo más antiguo aparece primero.</p>
      </div>
      <div class="page-head-extra"><span class="chip t-nuevo" style="--ink:#1f7a75;--bg:#eaf7f5">${icon('calendar')}${esc(dayTxt(NOW.toISOString()))}</span></div>
    </header>
    ${note(1, '<b>La entrada diaria responde «qué sigue».</b> Las tarjetas cuentan acciones, no totales del laboratorio (hoy, Inicio muestra «Total pacientes 128»). Cada tarjeta filtra la lista.')}
    <section aria-labelledby="qs-title">
      <h2 id="qs-title" class="sr-only">Qué sigue</h2>
      <div class="next-grid">
        ${FOCUS.map((f) => `
          <button type="button" class="next-card t-${f.tone}${counts[f.key] ? '' : ' is-zero'}" data-focus="${f.key}" aria-pressed="${S.wl.focus === f.key}">
            <span class="sym">${icon(f.icon)}</span>
            <span class="n">${S.data === 'normal' ? counts[f.key] : '–'}</span>
            <span class="t">${esc(f.label)}</span>
          </button>`).join('')}
      </div>
    </section>
    ${note(2, '<b>«Por firmar y publicar» necesita un dato nuevo.</b> Hoy el ítem de revisión trae la <i>decisión</i> (PENDING/APPROVED) y no el estado del informe; por eso la lista actual oculta «Aprobado» como si estuviera terminado. Ver AUDIT.md · H-02.')}
    <section class="card" aria-labelledby="wl-title">
      <h2 id="wl-title" class="sr-only">Lista de trabajo</h2>
      <div class="toolbar">
        <div class="toolbar-left">
          <div class="field search">
            <label class="sr-only" for="wl-q">Buscar en mi trabajo</label>
            <div class="field-box">${icon('search')}<input id="wl-q" type="search" autocomplete="off" placeholder="Buscar por código, paciente o etiqueta" value="${esc(S.wl.q)}" />${S.wl.q ? `<button type="button" class="clear-btn" data-act="clear-q" aria-label="Borrar búsqueda">${icon('x', 'ic-sm')}</button>` : ''}</div>
          </div>
          <div class="segmented" role="group" aria-label="Tipo de elemento">
            ${[['all', 'Todo'], ['report', 'Informes'], ['sample', 'Muestras'], ['order', 'Órdenes']].map(([v, l]) => `<button type="button" data-type="${v}" aria-pressed="${S.wl.type === v}">${l}${S.data === 'normal' ? ` <span class="n">${typeCount(v)}</span>` : ''}</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="list-meta">
        <div class="filter-summary" id="wl-summary" aria-live="polite"></div>
        <div class="toolbar-right">
          <button type="button" class="switch" role="switch" aria-checked="${S.wl.showDone}" data-act="done"><span class="track"></span>Incluir completadas${S.data === 'normal' ? ` (${doneCount})` : ''}</button>
          <label class="select-inline">Orden <select id="wl-sort"><option value="old"${S.wl.sort === 'old' ? ' selected' : ''}>Más antiguas primero</option><option value="new"${S.wl.sort === 'new' ? ' selected' : ''}>Más recientes primero</option></select></label>
        </div>
      </div>
      <div id="wl-body"></div>
    </section>
  </div>`;
  renderWorklistBody();
  bindTrabajo();
}

function renderWorklistBody() {
  const body = $('#wl-body');
  const summary = $('#wl-summary');
  const total = WORKLIST.filter((w) => !nextAction(w).done).length;
  if (S.data === 'cargando') {
    summary.innerHTML = '<span>Cargando…</span>';
    body.setAttribute('aria-busy', 'true');
    body.innerHTML = `<div class="table-wrap"><table class="grid"><caption class="sr-only">Cargando lista de trabajo</caption><tbody>${Array.from({ length: 6 }, () => `<tr aria-hidden="true"><td style="width:28%"><span class="skel" style="width:70%"></span><span class="skel" style="width:40%;margin-top:6px"></span></td><td><span class="skel" style="width:60%"></span></td><td><span class="skel" style="width:50%"></span></td><td><span class="skel" style="width:80px"></span></td></tr>`).join('')}</tbody></table></div>`;
    return;
  }
  body.removeAttribute('aria-busy');
  if (S.data === 'error') {
    summary.innerHTML = '';
    body.innerHTML = emptyBlock({ tone: 'atencion', ic: 'wifi-off', title: 'No se pudo cargar tu lista de trabajo', text: 'Revisa tu conexión e inténtalo de nuevo. Tus asignaciones no se modificaron.', detail: 'Código para soporte: WL-503 · 25 sep 2026, 17:00', action: `<button type="button" class="btn btn-primary btn-sm" data-act="retry">${icon('refresh')}Reintentar</button>`, role: 'alert' });
    return;
  }
  if (S.data === 'vacio') {
    summary.innerHTML = '';
    body.innerHTML = emptyBlock({ tone: 'completado', ic: 'check-circle', title: 'No tienes pendientes', text: 'Cuando te asignen una muestra, una orden o la revisión de un informe, aparecerá aquí.', action: `<a class="btn btn-secondary btn-sm" href="#/ordenes">Ver órdenes</a>` });
    return;
  }
  const rows = wlFiltered();
  const hidden = WORKLIST.length - total;
  const active = [];
  if (S.wl.focus) active.push(FOCUS.find((f) => f.key === S.wl.focus).label);
  if (S.wl.type !== 'all') active.push(TYPE[S.wl.type].label + 's');
  if (S.wl.q) active.push(`«${S.wl.q}»`);
  summary.innerHTML = `<span>Mostrando <strong>${rows.length}</strong> de ${S.wl.showDone ? WORKLIST.length : total}${!S.wl.showDone && hidden ? ` · ${hidden} completadas ocultas` : ''}</span>${active.length ? `<span>· Filtros: ${esc(active.join(', '))}</span><button type="button" class="btn btn-ghost btn-xs" data-act="reset">${icon('x', 'ic-sm')}Quitar filtros</button>` : ''}`;
  if (!rows.length) {
    body.innerHTML = emptyBlock({ tone: 'nuevo', ic: 'search', title: 'Ningún elemento coincide', text: 'Prueba con otro código o nombre, o quita los filtros para ver toda tu lista.', action: `<button type="button" class="btn btn-secondary btn-sm" data-act="reset">Quitar filtros</button>` });
    return;
  }
  const sortLabel = S.wl.sort === 'old' ? 'ascending' : 'descending';
  body.innerHTML = `
    <div class="table-wrap responsive">
      <table class="grid">
        <caption class="sr-only">Mi trabajo: ${rows.length} elementos</caption>
        <thead><tr>
          <th scope="col">Elemento</th>
          <th scope="col">Paciente</th>
          <th scope="col">Qué sigue</th>
          <th scope="col">Estado</th>
          <th scope="col" aria-sort="${sortLabel}"><button type="button" data-act="sort">Asignada ${icon('sort', 'ic-sm')}</button></th>
          <th scope="col"><span class="sr-only">Abrir</span></th>
        </tr></thead>
        <tbody>${rows.map(rowHtml).join('')}</tbody>
      </table>
    </div>
    <ul class="cards" aria-label="Mi trabajo">${rows.map(cardHtml).join('')}</ul>`;
}

function rowHtml(w) {
  const p = PATIENTS[w.patient];
  const na = nextAction(w);
  const t = TYPE[w.type];
  const sub = w.type === 'sample' ? `de ${w.order}` : w.kind === 'review' ? 'Informe de la orden' : t.label;
  return `<tr data-href="${w.link}">
    <td class="cell-code"><span class="type-badge">${icon(t.icon)}<span><a href="${w.link}">${esc(w.code)}</a><span class="cell-sub">${esc(sub)}</span></span></span>${w.labels?.length ? `<div class="labels">${w.labels.map(labelTag).join('')}</div>` : ''}</td>
    <td><div class="cell-patient"><span class="avatar" aria-hidden="true">${initials(p.name)}</span><span class="who"><strong>${esc(p.name)}</strong><span class="cell-sub">${esc(p.code)}</span></span></div></td>
    <td><div class="cell-task"><strong>${esc(na.text)}</strong>${na.who ? `<span class="by">${icon(na.mine ? 'user' : 'clock', 'ic-sm')}${esc(na.who)}</span>` : ''}</div></td>
    <td>${entityState(w)}</td>
    <td class="cell-age"><span>${ageTxt(w.at)}</span><span class="cell-sub">${esc(shortTxt(w.at))}</span></td>
    <td class="cell-go">${icon('chevron-right')}</td>
  </tr>`;
}
function cardHtml(w) {
  const p = PATIENTS[w.patient];
  const na = nextAction(w);
  const t = TYPE[w.type];
  return `<li class="wcard">
    <div class="row1"><span class="cell-code type-badge">${icon(t.icon)}<a class="stretch" href="${w.link}">${esc(w.code)}</a></span>${entityState(w)}</div>
    <div class="cell-patient"><span class="who"><strong>${esc(p.name)}</strong><span class="cell-sub">${esc(p.code)}${w.type === 'sample' ? ` · de ${esc(w.order)}` : ''}</span></span></div>
    ${w.labels?.length ? `<div class="labels">${w.labels.map(labelTag).join('')}</div>` : ''}
    <div class="task"><span class="cell-task"><strong>${esc(na.text)}</strong>${na.who ? `<span class="by">${esc(na.who)}</span>` : ''}</span><span class="cell-age muted">${ageTxt(w.at)}</span></div>
  </li>`;
}
function emptyBlock({ tone, ic, title, text, detail, action, role }) {
  return `<div class="empty t-${tone}"${role ? ` role="${role}"` : ''}><span class="sym">${icon(ic, 'ic-xl')}</span><h3>${esc(title)}</h3><p>${esc(text)}</p>${detail ? `<p class="detail">${esc(detail)}</p>` : ''}${action || ''}</div>`;
}

function bindTrabajo() {
  const root = main();
  $('#wl-q', root).addEventListener('input', (e) => {
    S.wl.q = e.target.value;
    renderWorklistBody();
    const box = $('.search .field-box', root);
    const has = $('.clear-btn', box);
    if (S.wl.q && !has) box.insertAdjacentHTML('beforeend', `<button type="button" class="clear-btn" data-act="clear-q" aria-label="Borrar búsqueda">${icon('x', 'ic-sm')}</button>`);
    if (!S.wl.q && has) has.remove();
  });
  $('#wl-sort', root).addEventListener('change', (e) => { S.wl.sort = e.target.value; renderWorklistBody(); });
  root.addEventListener('click', (e) => {
    const f = e.target.closest('[data-focus]');
    if (f) { S.wl.focus = S.wl.focus === f.dataset.focus ? null : f.dataset.focus; $$('[data-focus]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.focus === S.wl.focus))); renderWorklistBody(); return; }
    const t = e.target.closest('[data-type]');
    if (t) { S.wl.type = t.dataset.type; $$('[data-type]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.type === S.wl.type))); renderWorklistBody(); return; }
    const a = e.target.closest('[data-act]');
    if (a) {
      const act = a.dataset.act;
      if (act === 'done') { S.wl.showDone = !S.wl.showDone; a.setAttribute('aria-checked', String(S.wl.showDone)); viewTrabajo(); $('[data-act="done"]').focus(); }
      if (act === 'sort') { S.wl.sort = S.wl.sort === 'old' ? 'new' : 'old'; $('#wl-sort').value = S.wl.sort; renderWorklistBody(); $('[data-act="sort"]').focus(); }
      if (act === 'reset') { S.wl = { ...S.wl, q: '', type: 'all', focus: null }; viewTrabajo(); $('#wl-q').focus(); }
      if (act === 'clear-q') { S.wl.q = ''; $('#wl-q').value = ''; a.remove(); renderWorklistBody(); $('#wl-q').focus(); }
      if (act === 'retry') { setData('cargando'); setTimeout(() => setData('normal'), 900); }
      return;
    }
    const tr = e.target.closest('tr[data-href]');
    if (tr && !e.target.closest('a')) location.hash = tr.dataset.href;
  });
}

// ---------------------------------------------------------------- órdenes
function ordersFiltered() {
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-\s·]/g, '');
  const nq = norm(S.od.q);
  return ORDERS.filter((o) => (S.od.status === 'all' || o.status === S.od.status) && (!nq || norm([o.code, PATIENTS[o.patient].name, PATIENTS[o.patient].code, o.physician].join(' ')).includes(nq)));
}

function viewOrdenes(code) {
  if (code) S.od.selected = code;
  const pane = code ? 'detail' : 'list';
  main().innerHTML = `
  <div class="page">
    <header class="card page-head">
      <div>
        <h1 class="page-title">Órdenes</h1>
        <p class="page-sub">Avance de cada orden, sus muestras, su informe y quién intervino.</p>
      </div>
      <div class="page-head-extra"><button type="button" class="btn btn-primary" data-soon="Nueva orden">${icon('plus')}Nueva orden</button></div>
    </header>
    <div class="md" data-pane="${pane}">
      <section class="card md-list" aria-labelledby="ol-title">
        <div class="list-head">
          <h2 id="ol-title" class="section-title">Lista de órdenes</h2>
          <div class="field search" style="max-width:none">
            <label class="sr-only" for="od-q">Buscar órdenes</label>
            <div class="field-box">${icon('search')}<input id="od-q" type="search" autocomplete="off" placeholder="Código, paciente o solicitante" value="${esc(S.od.q)}" /></div>
          </div>
          <label class="select-inline">Estado
            <select id="od-status"><option value="all">Todos</option>${ORDER_STEPS.concat('CANCELLED').map((s) => `<option value="${s}"${S.od.status === s ? ' selected' : ''}>${STATES.order[s].label}</option>`).join('')}</select>
          </label>
        </div>
        <div id="ol-body"></div>
      </section>
      <div class="detail" id="od-detail"></div>
    </div>
  </div>`;
  renderOrderList();
  renderOrderDetail();
  bindOrdenes();
}

function renderOrderList() {
  const body = $('#ol-body');
  if (S.data === 'cargando') { body.innerHTML = `<ul class="olist" aria-busy="true">${Array.from({ length: 6 }, () => `<li aria-hidden="true" style="padding:12px"><span class="skel" style="width:50%"></span><span class="skel" style="width:80%;margin-top:8px"></span></li>`).join('')}</ul>`; return; }
  if (S.data === 'error') { body.innerHTML = emptyBlock({ tone: 'atencion', ic: 'wifi-off', title: 'No se pudieron cargar las órdenes', text: 'Inténtalo de nuevo en unos segundos.', action: `<button type="button" class="btn btn-primary btn-sm" data-act="retry">${icon('refresh')}Reintentar</button>`, role: 'alert' }); return; }
  if (S.data === 'vacio') { body.innerHTML = emptyBlock({ tone: 'nuevo', ic: 'clipboard', title: 'Aún no hay órdenes', text: 'Cuando registres una orden aparecerá aquí.', action: `<button type="button" class="btn btn-primary btn-sm" data-soon="Nueva orden">${icon('plus')}Nueva orden</button>` }); return; }
  const rows = ordersFiltered();
  if (!rows.length) { body.innerHTML = emptyBlock({ tone: 'nuevo', ic: 'search', title: 'Sin coincidencias', text: 'Cambia la búsqueda o el filtro de estado.' }); return; }
  body.innerHTML = `<ul class="olist">${rows.map((o) => {
    const p = PATIENTS[o.patient];
    return `<li><a href="#/ordenes/${o.code}" aria-current="${o.code === S.od.selected}">
      <span class="oc">${esc(o.code)}</span>${chip('order', o.status)}
      <span class="op">${esc(p.name)}</span>
      <span class="om">${esc(o.study)} · ${o.samples.length} ${o.samples.length === 1 ? 'muestra' : 'muestras'} · ${ageTxt(o.created)}</span>
    </a></li>`;
  }).join('')}</ul>`;
}

function orderTimeline(o) {
  if (o.code === 'ORD-EJ-0044') return TIMELINE_0044;
  const ev = [{ at: o.created, type: 'ORDER_CREATED', actor: 'Asistente Ejemplo', text: 'Registró la orden', group: 'orden' }];
  const idx = ORDER_STEPS.indexOf(o.status);
  for (let i = 1; i <= idx; i++) ev.push({ at: new Date(new Date(o.created).getTime() + i * 5 * 3600e3).toISOString(), type: 'ORDER_STATUS_CHANGED', actor: 'Técnica Ejemplo', text: 'Cambió el estado de la orden', from: ORDER_STEPS[i - 1], to: ORDER_STEPS[i], group: 'estados' });
  if (o.status === 'CANCELLED') ev.push({ at: new Date(new Date(o.created).getTime() + 4 * 3600e3).toISOString(), type: 'ORDER_CANCELLED', actor: 'Admin Ejemplo', text: 'Canceló la orden', group: 'estados' });
  return ev;
}
const EV_ICON = { ORDER_CREATED: 'clipboard', SAMPLE_RECEIVED: 'inbox', ORDER_STATUS_CHANGED: 'history', IMAGE_UPLOADED: 'image', SAMPLE_STATE_CHANGED: 'flask', REVIEWERS_ADDED: 'users', REPORT_CREATED: 'file-text', REPORT_SUBMITTED: 'send', ORDER_CANCELLED: 'slash-circle' };

function renderOrderDetail() {
  const box = $('#od-detail');
  const o = ORDERS.find((x) => x.code === S.od.selected) || ORDERS[4];
  const p = PATIENTS[o.patient];
  const tl = orderTimeline(o);
  const reached = (s) => tl.find((e) => e.to === s)?.at || (s === 'RECEIVED' ? o.created : null);
  const idx = ORDER_STEPS.indexOf(o.status);
  const cancelled = o.status === 'CANCELLED';
  const stepHtml = ORDER_STEPS.map((s, i) => {
    const st = STATES.order[s];
    const cls = cancelled ? (i === 0 ? 'done' : 'todo') : i < idx ? 'done' : i === idx ? `current t-${st.tone}` : 'todo';
    const when = (cls.startsWith('done') || cls.startsWith('current')) && reached(s) ? shortTxt(reached(s)) : '';
    return `<li class="${cls}"${i === idx && !cancelled ? ' aria-current="step"' : ''}><span class="dot">${icon(i < idx && !cancelled ? 'check' : st.icon)}</span><span class="st">${esc(st.label)}</span>${when ? `<span class="sd">${esc(when)}</span>` : ''}${i === idx && !cancelled ? '<span class="cur-tag">Actual</span>' : ''}</li>`;
  }).join('');
  const conv = o.code === 'ORD-EJ-0044' ? CONVERSATION_0044 : [];
  const tabs = [
    ['timeline', 'Línea de tiempo', 'history', tl.length],
    ['samples', 'Muestras', 'flask', o.samples.length],
    ['report', 'Informe', 'file-text', o.report ? 1 : 0],
    ['conversation', 'Conversación', 'message', conv.length],
  ];
  box.innerHTML = `
    <a class="back-link" href="#/ordenes">${icon('arrow-left')}Volver a la lista</a>
    <article class="card record" aria-labelledby="od-name">
      <div class="record-top">
        <span class="code-chip">${esc(o.code)}</span>${chip('order', o.status, { lg: true })}${o.labels.map(labelTag).join('')}
        <span class="spacer"></span>
        <div class="btn-row">
          ${o.report ? `<a class="btn btn-secondary btn-sm" href="#/informe">${icon('file-text')}Ver informe</a>` : ''}
          ${o.invoice ? `<button type="button" class="btn btn-secondary btn-sm btn-icon" data-soon="Factura" aria-label="Ver factura">${icon('receipt')}</button>` : ''}
          <button type="button" class="btn btn-secondary btn-sm btn-icon" data-soon="Más acciones" aria-label="Más acciones">${icon('more')}</button>
        </div>
      </div>
      ${note(3, '<b>Código de orden legible:</b> hoy es texto blanco sobre salmón (2,29:1). Propuesta: fondo salmón suave, borde salmón y tinta navy (15,5:1); el salmón sigue siendo la firma de identidad.')}
      <div class="record-main">
        <span class="avatar avatar-lg" aria-hidden="true">${initials(p.name)}</span>
        <div class="who">
          <h2 id="od-name">${esc(p.name)}</h2>
          <span class="idline">${esc(p.code)} · ${p.age} años</span>
          <div class="meta-row">
            <span>${icon('stethoscope')}Solicitante: <b>${esc(o.physician)}</b></span>
            <span>${icon('flask')}Estudio: <b>${esc(o.study)}</b></span>
            <span>${icon('building')}${esc(o.branch)}</span>
            <span>${icon('calendar')}Registrada ${esc(dateTxt(o.created))}</span>
          </div>
        </div>
      </div>
      <div class="stats" role="list" aria-label="Resumen">
        <div role="listitem"><b>${o.samples.length}</b><span>${o.samples.length === 1 ? 'Muestra' : 'Muestras'}</span></div>
        <div role="listitem"><b>${o.report ? 1 : 0}</b><span>Informe</span></div>
        <div role="listitem"><b>${o.invoice ? 1 : 0}</b><span>Factura</span></div>
      </div>
      ${o.billedLock ? `<div class="notice" role="note">${icon('alert-triangle')}<div><strong>Retenido por pago pendiente</strong><p>El informe no será visible para los solicitantes hasta liquidar el pago.</p></div></div>` : ''}
      ${cancelled ? `<div class="notice neutral" role="note">${icon('slash-circle')}<div><strong>Orden cancelada</strong><p>Se conserva su historial. No admite nuevas muestras ni informe.</p></div></div>` : ''}
      <section aria-labelledby="od-steps-t">
        <h3 id="od-steps-t" class="sr-only">Avance de la orden</h3>
        <ol class="steps">${stepHtml}</ol>
      </section>
      ${note(4, '<b>El avance vive en la ficha</b>, no dentro de una pestaña: es el dato que más se consulta. Cada paso alcanzado muestra su fecha, tomada de la línea de tiempo.')}
    </article>
    <div class="od-grid">
      <section class="card" aria-label="Detalle de la orden">
        <div class="tabs" role="tablist" aria-label="Secciones de la orden">
          ${tabs.map(([k, l, ic, n]) => `<button type="button" role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${S.od.tab === k}" tabindex="${S.od.tab === k ? 0 : -1}">${icon(ic)}${l}${n ? ` <span class="badge">${n}</span>` : ''}</button>`).join('')}
        </div>
        ${tabs.map(([k]) => `<div class="tabpanel" role="tabpanel" id="panel-${k}" aria-labelledby="tab-${k}" tabindex="0"${S.od.tab === k ? '' : ' hidden'}>${tabPanel(k, o, tl, conv)}</div>`).join('')}
      </section>
      <aside class="rail" aria-label="Personas y etiquetas">
        <section class="card"><h3>${icon('eye')}Revisión <span class="n">1</span></h3>
          <div class="person"><span class="avatar" aria-hidden="true">RE</span><span class="who"><strong>Revisora Ejemplo</strong><span>${o.report === 'IN_REVIEW' ? `${icon('clock', 'ic-sm')}Decisión pendiente` : o.report === 'APPROVED' || o.report === 'PUBLISHED' ? `${icon('check-circle', 'ic-sm')}Aprobó` : 'Asignada al registrar la orden'}</span></span></div>
        </section>
        <section class="card"><h3>${icon('users')}Asignadas <span class="n">2</span></h3>
          <div class="person"><span class="avatar" aria-hidden="true">TE</span><span class="who"><strong>Técnica Ejemplo</strong><span>Técnica de laboratorio</span></span></div>
          <div class="person"><span class="avatar" aria-hidden="true">PE</span><span class="who"><strong>Patóloga Ejemplo</strong><span>Patóloga</span></span></div>
        </section>
        <section class="card"><h3>${icon('tag')}Etiquetas <span class="n">${o.labels.length}</span></h3>
          ${o.labels.length ? `<div class="labels">${o.labels.map(labelTag).join('')}</div>` : '<p class="muted" style="font-size:13px">Sin etiquetas.</p>'}
        </section>
      </aside>
    </div>`;
}

function tabPanel(k, o, tl, conv) {
  if (k === 'timeline') {
    const groups = [['all', 'Todo'], ['estados', 'Estados'], ['muestras', 'Muestras'], ['informe', 'Informe'], ['asignaciones', 'Asignaciones']];
    const items = tl.filter((e) => S.od.tl === 'all' || e.group === S.od.tl).slice().reverse();
    let lastDay = '';
    const lis = items.map((e) => {
      const d = dayTxt(e.at);
      const day = d !== lastDay ? `<li class="tl-day" aria-hidden="false">${esc(d)}</li>` : '';
      lastDay = d;
      const trans = e.from ? `<div class="trans">${chip('order', e.from)}<span aria-label="a">→</span>${chip('order', e.to)}</div>` : e.sfrom ? `<div class="trans">${chip('sample', e.sfrom)}<span aria-label="a">→</span>${chip('sample', e.sto)}</div>` : '';
      return `${day}<li class="tl-item"><span class="sym">${icon(EV_ICON[e.type] || 'history')}</span><div><div class="what">${esc(e.text)}${trans}</div><div class="who">${esc(e.actor)}</div></div><time datetime="${e.at}">${esc(fTime.format(new Date(e.at)))}</time></li>`;
    }).join('');
    return `<div class="segmented tl-filters" role="group" aria-label="Filtrar la línea de tiempo">${groups.map(([v, l]) => `<button type="button" data-tl="${v}" aria-pressed="${S.od.tl === v}">${l}</button>`).join('')}</div>
      ${note(5, '<b>Trazabilidad en lenguaje del laboratorio:</b> los cambios de estado se muestran con sus chips traducidos (hoy aparece «de DIAGNOSIS a REVIEW») y cada evento dice quién lo hizo y a qué hora.')}
      ${items.length ? `<ol class="tl">${lis}</ol>` : emptyBlock({ tone: 'nuevo', ic: 'history', title: 'Sin eventos de este tipo', text: 'Cambia el filtro para ver el resto del historial.' })}`;
  }
  if (k === 'samples') {
    return `<div class="samples">${o.samples.map(([code, type, state]) => `<div class="sample"><span class="sym">${icon('flask')}</span><div style="min-width:0"><div class="name">${esc(code)}</div><div class="sub">${esc(SAMPLE_TYPES[type])} · Recibida ${esc(shortTxt(o.created))}</div></div>${chip('sample', state)}</div>`).join('')}</div>
      ${note(6, '<b>Nombres largos:</b> el código de muestra envuelve en su propia línea y nunca se superpone al paciente (criterio de CEL-131-10).')}`;
  }
  if (k === 'report') {
    if (!o.report) return emptyBlock({ tone: 'nuevo', ic: 'file-text', title: 'Esta orden aún no tiene informe', text: 'La patóloga lo crea cuando las muestras están listas.', action: `<button type="button" class="btn btn-secondary btn-sm" data-soon="Crear informe">${icon('plus')}Crear informe</button>` });
    return `<div class="sample" style="grid-template-columns:auto minmax(0,1fr) auto"><span class="sym">${icon('file-text')}</span><div><div class="name">${esc(REPORT_0044.title)}</div><div class="sub">Versión ${REPORT_0044.version} · Autora: ${esc(REPORT_0044.author)} · Revisora: ${esc(REPORT_0044.reviewer)}</div></div>${chip('report', o.report)}</div>
      <p style="margin-top:12px" class="muted">Siguiente paso: ${o.report === 'IN_REVIEW' ? 'decisión de la revisora asignada.' : o.report === 'APPROVED' ? 'firmar y publicar (revisora asignada).' : o.report === 'DRAFT' ? 'terminar el borrador y enviarlo a revisión.' : 'ninguno: el informe ya está publicado.'}</p>
      <div class="btn-row" style="margin-top:12px"><a class="btn btn-primary btn-sm" href="#/informe">${icon('arrow-right')}Abrir flujo del informe</a></div>`;
  }
  if (k === 'conversation') {
    if (!conv.length) return emptyBlock({ tone: 'nuevo', ic: 'message', title: 'Sin mensajes', text: 'Usa la conversación para coordinar con el equipo de esta orden.' });
    return `<div class="thread">${conv.map((m) => `<div class="msg${m.mine ? ' mine' : ''}"><span class="avatar" aria-hidden="true">${m.initials}</span><div><div class="meta"><b>${esc(m.who)}</b> · ${esc(shortTxt(m.at))}</div><div class="bubble">${esc(m.text)}</div></div></div>`).join('')}</div>
      <form class="composer" data-soon-form="1"><div class="field"><label class="sr-only" for="msg">Escribe un mensaje</label><div class="field-box"><input id="msg" placeholder="Escribe un mensaje · @ para mencionar" /></div></div><button class="btn btn-primary btn-icon" aria-label="Enviar mensaje">${icon('send')}</button></form>`;
  }
  return '';
}

function bindOrdenes() {
  const root = main();
  $('#od-q', root).addEventListener('input', (e) => { S.od.q = e.target.value; renderOrderList(); });
  $('#od-status', root).addEventListener('change', (e) => { S.od.status = e.target.value; renderOrderList(); });
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) { selectTab(tab.id.replace('tab-', '')); return; }
    const tlb = e.target.closest('[data-tl]');
    if (tlb) { S.od.tl = tlb.dataset.tl; const panel = $('#panel-timeline'); const o = ORDERS.find((x) => x.code === S.od.selected); panel.innerHTML = tabPanel('timeline', o, orderTimeline(o), []); $(`[data-tl="${S.od.tl}"]`, panel).focus(); return; }
    const a = e.target.closest('[data-act="retry"]');
    if (a) { setData('cargando'); setTimeout(() => setData('normal'), 900); }
  });
  root.addEventListener('keydown', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    const tabs = $$('[role="tab"]', root);
    const i = tabs.indexOf(tab);
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = tabs.length - 1;
    if (n !== null) { e.preventDefault(); selectTab(tabs[n].id.replace('tab-', '')); tabs[n].focus(); }
  });
  root.addEventListener('submit', (e) => { if (e.target.dataset.soonForm) { e.preventDefault(); toast('Maqueta: no se envían mensajes', 'La conversación real vive en celuma-frontend.', 'info'); } });
}
function selectTab(k) {
  S.od.tab = k;
  $$('[role="tab"]').forEach((t) => { const on = t.id === `tab-${k}`; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  $$('[role="tabpanel"]').forEach((p) => { p.hidden = p.id !== `panel-${k}`; });
}

// ---------------------------------------------------------------- flujo del informe
// Acciones permitidas por estado y persona, según standards/rbac.md y
// specs/reports/lifecycle.md (1.3.1). La UI no es la frontera de seguridad.
const ACTIONS = {
  DRAFT: {
    patologa: [['save', 'Guardar versión', 'secondary'], ['submit', 'Enviar a revisión', 'primary']],
    revisora: [['presentation', 'Ajustar presentación', 'secondary']],
    admin: [],
  },
  IN_REVIEW: {
    patologa: [],
    revisora: [['approve', 'Aprobar', 'primary'], ['changes', 'Solicitar cambios', 'danger'], ['presentation', 'Ajustar presentación', 'secondary']],
    admin: [],
  },
  APPROVED: {
    patologa: [],
    revisora: [['sign', 'Firmar y publicar', 'primary'], ['reopen', 'Reabrir', 'danger']],
    admin: [['reopen', 'Reabrir', 'danger']],
  },
  PUBLISHED: {
    patologa: [['pdf', 'Descargar PDF oficial', 'primary'], ['print', 'Imprimir copia local', 'secondary']],
    revisora: [['pdf', 'Descargar PDF oficial', 'primary'], ['print', 'Imprimir copia local', 'secondary']],
    admin: [['pdf', 'Descargar PDF oficial', 'primary'], ['print', 'Imprimir copia local', 'secondary']],
  },
  RETRACTED: {
    patologa: [['print', 'Imprimir copia local', 'secondary']],
    revisora: [['print', 'Imprimir copia local', 'secondary']],
    admin: [['print', 'Imprimir copia local', 'secondary']],
  },
};
const ACT_ICON = { save: 'check', submit: 'send', presentation: 'sliders', approve: 'check-circle', changes: 'undo', sign: 'stamp', reopen: 'undo', pdf: 'download', print: 'printer' };
const NEXT = {
  DRAFT: { v: 'Terminar el borrador y enviarlo a revisión', who: 'Patóloga Ejemplo · autora', why: 'Solo el borrador admite cambios de contenido en el editor.' },
  IN_REVIEW: { v: 'Decisión de la revisora asignada', who: 'Revisora Ejemplo', why: 'Aprobar deja el contenido listo para firma; solicitar cambios lo devuelve a borrador.' },
  APPROVED: { v: 'Firmar y publicar, o reabrir para corregir', who: 'Revisora Ejemplo (firma) · administración (solo reabrir)', why: 'Aprobado todavía no es publicado: los solicitantes no ven nada hasta firmar y publicar.' },
  PUBLISHED: { v: 'Ninguno. El documento oficial ya existe', who: '—', why: 'Un informe publicado no se edita. Retractarlo es una operación aparte.' },
  RETRACTED: { v: 'Ninguno. El informe fue retirado', who: '—', why: 'Se conserva como evidencia; no vuelve a ser editable.' },
};
const NO_ACTION = {
  patologa: { IN_REVIEW: 'Como autora esperas la decisión. El editor queda en solo lectura mientras se revisa.', APPROVED: 'Como autora no firmas: la firma corresponde a la revisora asignada.' },
  revisora: {},
  admin: { DRAFT: 'Administración no edita el contenido clínico.', IN_REVIEW: 'Administración no aprueba: se requiere rol de revisora y asignación (ADR 0009).', APPROVED: 'Administración solo puede reabrir. Firmar requiere rol de revisora y asignación.' },
};

function viewInforme() {
  const st = S.rf.status;
  const r = REPORT_0044;
  const p = PATIENTS.p13;
  const persona = PERSONAS[S.rf.persona];
  const stepIdx = REPORT_STEPS.indexOf(st === 'RETRACTED' ? 'PUBLISHED' : st);
  const ops = { DRAFT: 'Enviar a revisión', IN_REVIEW: 'Aprobar', APPROVED: 'Firmar y publicar' };
  const desc = {
    DRAFT: 'La autora edita y guarda versiones.',
    IN_REVIEW: 'La revisora asignada aprueba o solicita cambios.',
    APPROVED: 'Contenido aprobado, aún sin firma. Se puede reabrir.',
    PUBLISHED: 'Firmado y publicado en una sola operación, con PDF oficial.',
  };
  const track = REPORT_STEPS.map((s, i) => {
    const sd = STATES.report[s];
    const cls = i < stepIdx ? 'done' : i === stepIdx ? `current t-${sd.tone}` : 'todo';
    return `<li class="lc-state ${cls}"${i === stepIdx ? ' aria-current="step"' : ''}>
      <span class="node"><span class="dot">${icon(i < stepIdx ? 'check' : sd.icon)}</span><span class="bar"></span></span>
      <span class="name">${esc(sd.label)}${i === stepIdx && st !== 'RETRACTED' ? ' <span class="sr-only">(estado actual)</span>' : ''}</span>
      <span class="op">${esc(desc[s])}${ops[s] ? `<br />Sigue: <b>${esc(ops[s])}</b>` : ''}</span>
    </li>`;
  }).join('');
  const actions = ACTIONS[st][S.rf.persona];
  const noAct = NO_ACTION[S.rf.persona][st];
  const nx = NEXT[st];
  const done = (k) => ({
    submitted: st !== 'DRAFT',
    decision: ['APPROVED', 'PUBLISHED', 'RETRACTED'].includes(st),
    signed: ['PUBLISHED', 'RETRACTED'].includes(st),
    retracted: st === 'RETRACTED',
  }[k]);
  const ev = [
    { ok: true, ic: 'pen', k: `Versión ${r.version} guardada`, v: `${r.author} · autora`, t: r.submitted },
    { ok: done('submitted'), ic: 'send', k: 'Enviado a revisión', v: done('submitted') ? `${r.author}` : 'Pendiente: lo hace la autora', t: done('submitted') ? r.submitted : null },
    { ok: done('decision'), ic: 'check-circle', k: done('decision') ? `Aprobado por ${r.reviewer}` : 'Decisión de revisión', v: done('decision') ? 'Revisora asignada' : st === 'DRAFT' ? 'Aún no se envía a revisión' : `Pendiente: ${r.reviewer}`, t: done('decision') ? r.decisionAt : null },
    { ok: done('signed'), ic: 'stamp', k: done('signed') ? `Firmado por ${r.reviewer}` : 'Firma', v: done('signed') ? `Versión ${r.version} · imagen y metadatos de firma` : 'Se registra al firmar y publicar', t: done('signed') ? r.signedAt : null },
    { ok: done('signed'), ic: 'badge-check', k: done('signed') ? 'Publicado · PDF oficial generado' : 'Publicación y PDF oficial', v: done('signed') ? `PDF oficial de la versión ${r.version}` : 'Solo existe después de firmar y publicar', t: done('signed') ? r.signedAt : null },
  ];
  if (done('retracted')) ev.push({ ok: true, ic: 'file-x', k: 'Retractado', v: 'Operación aparte con permiso de retractar', t: new Date(NOW.getTime() - 0.3 * 3600e3).toISOString() });

  main().innerHTML = `
  <div class="page">
    <header class="card page-head">
      <div>
        <nav class="crumbs" aria-label="Ruta"><a href="#/ordenes/ORD-EJ-0044">ORD-EJ-0044</a>${icon('chevron-right', 'ic-sm')}<span>Informe</span></nav>
        <h1 class="page-title">${esc(r.title)}</h1>
        <p class="page-sub">${esc(p.name)} · ${esc(p.code)} · Estudio: ${esc(r.study)} · Versión ${r.version}</p>
      </div>
      <div class="page-head-extra">${chip('report', st, { lg: true })}</div>
    </header>

    <section class="card" aria-label="Flujo del informe">
      <div class="ctrl-bar" role="group" aria-label="Controles de la maqueta">
        <span class="lbl">Maqueta</span>
        <div class="segmented" role="group" aria-label="Simular estado del informe">
          ${['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'RETRACTED'].map((s) => `<button type="button" data-rf-status="${s}" aria-pressed="${st === s}">${esc(STATES.report[s].label)}</button>`).join('')}
        </div>
        <label class="select-inline">Ver como
          <select id="rf-persona">${Object.entries(PERSONAS).map(([k, v]) => `<option value="${k}"${S.rf.persona === k ? ' selected' : ''}>${esc(v.roleLabel)}</option>`).join('')}</select>
        </label>
      </div>
      <div class="rf-grid">
        <div>
          <div class="now-panel is-first">
            <div class="now-head"><h2 class="now-title">Ahora</h2>${chip('report', st, { lg: true })}${st === 'APPROVED' ? '<span class="muted" style="font-size:13px">Falta firmar y publicar · los solicitantes aún no lo ven</span>' : ''}</div>
            <div class="now-next"><span class="k">Siguiente paso</span><span class="v">${esc(nx.v)}</span><span class="why">${nx.who !== '—' ? `Responsable: ${esc(nx.who)}. ` : ''}${esc(nx.why)}</span></div>
            ${st === 'PUBLISHED' || st === 'RETRACTED' ? `<div class="notice" role="note">${icon('alert-triangle')}<div><strong>Retenido por pago pendiente</strong><p>${st === 'PUBLISHED' ? 'Publicado, pero los solicitantes no lo verán hasta liquidar el pago de la orden.' : 'La orden sigue con pago pendiente.'}</p></div></div>` : ''}
            <div>
              <div class="btn-row" id="rf-actions">
                ${actions.length ? actions.map(([k, l, kind]) => `<button type="button" class="btn btn-${kind}" data-action="${k}"${S.rf.busy && k === 'sign' ? ' aria-busy="true" disabled' : ''}>${S.rf.busy && k === 'sign' ? '<span class="spinner" aria-hidden="true"></span>Firmando y generando PDF oficial…' : `${icon(ACT_ICON[k])}${esc(l)}`}</button>`).join('') : ''}
              </div>
              ${!actions.length || noAct ? `<p class="role-note" style="margin-top:${actions.length ? 10 : 0}px">${icon('info', 'ic-sm')}<span>${esc(noAct || `Como ${persona.roleLabel.toLowerCase()} no tienes acciones en este estado.`)}</span></p>` : ''}
              ${S.rf.persona === 'revisora' && ['DRAFT', 'IN_REVIEW'].includes(st) ? `<p class="role-note" style="margin-top:8px">${icon('info', 'ic-sm')}<span>La revisora ajusta membrete y firma, pero no edita el contenido clínico.</span></p>` : ''}
            </div>
          </div>
          <div class="lifecycle">
            <div class="section-head"><h2 id="rf-title" class="section-title">Ruta del informe</h2><span class="muted" style="font-size:13px">Vocabulario y reglas de specs/reports/lifecycle.md (1.3.1)</span></div>
            <ol class="lc-track" aria-label="Estados del informe">${track}</ol>
            <div class="lc-branches">
              <div class="lc-branch">${icon('undo')}<span><b>Solicitar cambios</b> · En revisión → Borrador. La revisión se reinicia.</span></div>
              <div class="lc-branch">${icon('undo')}<span><b>Reabrir</b> · Aprobado sin firma → Borrador. Revisora asignada o administración. Se vuelve a revisar y aprobar.</span></div>
              <div class="lc-branch">${icon('file-x')}<span><b>Retractar</b> · Publicado → Retractado. Operación aparte; no está en el editor actual y no vuelve editable el documento.</span></div>
            </div>
            ${note(7, '<b>Firma y publicación son una sola operación</b> («Firmar y publicar», APPROVED → PUBLISHED). No existe un estado «Firmado» intermedio; la firma aparece como evidencia, no como paso.')}
          </div>
          <div class="traz">
            <div>
              <h2 class="section-title" style="font-size:17px;margin-bottom:4px">Trazabilidad</h2>
              <ul class="evidence">${ev.map((e) => `<li class="${e.ok ? '' : 'pending'}"><span class="sym">${icon(e.ok ? e.ic : 'clock', 'ic-sm')}</span><div><div class="k">${esc(e.k)}</div><div class="v">${esc(e.v)}</div></div>${e.t ? `<time datetime="${e.t}">${esc(shortTxt(e.t))}</time>` : '<span class="r">Pendiente</span>'}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
        <div class="doc-card">
          <div class="section-head" style="margin:0"><h2 class="section-title">Documento</h2><span class="muted" style="font-size:13px">${st === 'PUBLISHED' ? 'Corresponde al PDF oficial' : st === 'RETRACTED' ? 'Copia marcada como retractada' : 'Vista previa · no es el PDF oficial'}</span></div>
          <div class="doc-frame">${docHtml(st, r, p)}</div>
          <p class="doc-caption">${icon('building', 'ic-sm')}<span>El documento lleva el membrete del <b>laboratorio cliente</b> (ADR 0002). Céluma solo aparece como huella en el pie. Tipografía y tinta neutras de documento, sin Baloo ni teal.</span></p>
          ${note(8, '<b>Sin imagen clínica simulada:</b> la maqueta no incluye ilustraciones ni micrografías. Una imagen del caso sería un espacio neutro, nunca el campo celular de la marca.')}
        </div>
      </div>
    </section>
  </div>`;
  bindInforme();
}

function docHtml(st, r, p) {
  const wm = { DRAFT: 'VISTA PREVIA', IN_REVIEW: 'VISTA PREVIA', APPROVED: 'VISTA PREVIA', RETRACTED: 'RETRACTADO' }[st];
  const signed = st === 'PUBLISHED' || st === 'RETRACTED';
  return `<div class="doc" aria-label="Maqueta del documento del laboratorio cliente">
    <div class="doc-mock">Maqueta no operativa · datos ficticios</div>
    <div class="doc-head"><span class="doc-logo" aria-hidden="true">LE</span><span class="doc-lab"><b>${esc(TENANT.name)}</b><span>Sucursal Centro · Dirección y teléfono de ejemplo</span></span></div>
    <div class="doc-data">
      <span><b>Paciente:</b> ${esc(p.name)}</span><span><b>Código de orden:</b> ${esc(r.order)}</span>
      <span><b>Edad:</b> ${p.age} años</span><span><b>Tipo de estudio:</b> ${esc(r.study)}</span>
      <span><b>Médico solicitante:</b> Dra. Solicitante Ejemplo</span><span><b>Fecha de recepción:</b> 22 sep 2026</span>
    </div>
    ${r.sections.map(([h, t]) => `<h5>${esc(h)}</h5><p>${esc(t)}</p>`).join('')}
    <div class="doc-sign">${signed ? `<span class="line"></span><b>${esc(r.reviewer)}</b><span>Firmado el ${esc(dateTxt(r.signedAt))}</span>` : '<span style="color:#595959">Firma pendiente · se agrega al firmar y publicar</span>'}</div>
    <div class="doc-foot"><span>Documento generado en Céluma.</span><span>Página 1 de 1</span></div>
    ${wm ? `<div class="doc-watermark" aria-hidden="true"><span>${wm}</span></div>` : ''}
  </div>`;
}

const DIALOGS = {
  submit: { t: 'Enviar a revisión', items: ['El informe pasa a «En revisión» y la revisora asignada recibe la tarea.', 'Mientras se revisa, el editor queda en solo lectura para la autora.'], ok: 'Enviar a revisión', to: 'IN_REVIEW' },
  approve: { t: '¿Aprobar este informe?', items: ['El contenido de la versión 3 queda aprobado para firma.', 'Aprobar no publica: los solicitantes no lo verán hasta firmar y publicar.', 'Si hace falta corregir antes de firmar, se puede reabrir.'], ok: 'Aprobar', to: 'APPROVED' },
  changes: { t: 'Solicitar cambios', items: ['El informe vuelve a «Borrador» y la autora recibe tu comentario en la conversación.', 'Después tendrá que enviarse de nuevo a revisión.'], ok: 'Solicitar cambios', to: 'DRAFT', field: true, danger: true },
  sign: { t: '¿Firmar y publicar?', items: ['Se registra tu firma en la versión 3.', 'Se genera el PDF oficial con esa firma.', 'El informe queda publicado y ya no se puede editar. Retirarlo requiere una operación aparte (retractar).'], ok: 'Firmar y publicar', to: 'PUBLISHED', busy: true },
  reopen: { t: '¿Reabrir este informe?', items: ['Vuelve a «Borrador» sin crear una versión nueva.', 'Las decisiones de revisión se reinician: habrá que revisar y aprobar otra vez.', 'Solo es posible porque aún no está firmado.'], ok: 'Reabrir', to: 'DRAFT', danger: true },
};

function openDialog(k) {
  const d = DIALOGS[k];
  const dlg = $('#dlg');
  dlg.innerHTML = `<form method="dialog">
    <div class="dlg">
      <h2 id="dlg-title">${esc(d.t)}</h2>
      <p class="muted">${esc(REPORT_0044.title)} · ORD-EJ-0044</p>
      <ul>${d.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      ${d.field ? `<div class="field floating"><div class="field-box"><label for="dlg-c">Comentario para la autora</label><input id="dlg-c" /></div><span class="field-msg field-help">Opcional. Se publica en la conversación de la orden.</span></div>` : ''}
      <div class="notice neutral" role="note">${icon('info')}<div><strong>Maqueta</strong><p>Confirmar solo muestra el estado resultante. No se guarda ni se envía nada.</p></div></div>
    </div>
    <div class="dlg-foot"><button value="cancel" class="btn btn-secondary">Cancelar</button><button value="ok" class="btn ${d.danger ? 'btn-danger' : 'btn-primary'}">${esc(d.ok)}</button></div>
  </form>`;
  const opener = document.activeElement;
  dlg.showModal();
  dlg.addEventListener('close', function onClose() {
    dlg.removeEventListener('close', onClose);
    if (dlg.returnValue === 'ok') {
      if (d.busy) {
        S.rf.busy = true; viewInforme(); $('[data-action="sign"]')?.focus();
        setTimeout(() => { S.rf.busy = false; S.rf.status = d.to; viewInforme(); toast('Vista de maqueta: Publicado', 'No se firmó ni se publicó nada real.', 'ok'); $('#rf-actions .btn')?.focus(); }, 1400);
      } else {
        S.rf.status = d.to; viewInforme();
        toast(`Vista de maqueta: ${STATES.report[d.to].label}`, 'No se guardó ningún cambio.', 'ok');
        $('#rf-actions .btn')?.focus() || $('[data-rf-status]')?.focus();
      }
    } else opener?.focus();
  });
}

function bindInforme() {
  const root = main();
  root.addEventListener('click', (e) => {
    const s = e.target.closest('[data-rf-status]');
    if (s) { S.rf.status = s.dataset.rfStatus; viewInforme(); $(`[data-rf-status="${S.rf.status}"]`).focus(); return; }
    const a = e.target.closest('[data-action]');
    if (a) {
      const k = a.dataset.action;
      if (DIALOGS[k]) openDialog(k);
      else if (k === 'save') toast('Maqueta: versión no guardada', 'En el producto, cada guardado crea una versión nueva.');
      else if (k === 'presentation') toast('Maqueta: presentación', 'La revisora puede cambiar membrete y opciones de firma en Borrador y En revisión.');
      else if (k === 'pdf') toast('Maqueta: sin PDF', 'El PDF oficial lo genera el backend al firmar y publicar.');
      else if (k === 'print') toast('Maqueta: copia local', S.rf.status === 'RETRACTED' ? 'En el producto la copia se marca RETRACTADO.' : 'La copia local no sustituye al PDF oficial.');
    }
  });
  $('#rf-persona', root).addEventListener('change', (e) => { S.rf.persona = e.target.value; viewInforme(); $('#rf-persona').focus(); });
}

// ---------------------------------------------------------------- galería
function lum(rgb) {
  const [r, g, b] = rgb.map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function parseColor(str) { const m = str.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; }
function ratio(a, b) { const [x, y] = [lum(parseColor(a)), lum(parseColor(b))].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); }

const CURRENT = {
  order: { RECEIVED: ['#3b82f6', '#eff6ff', 'Recibida'], PROCESSING: ['#f59e0b', '#fffbeb', 'En Proceso'], DIAGNOSIS: ['#8b5cf6', '#f5f3ff', 'Diagnóstico'], REVIEW: ['#ec4899', '#fdf2f8', 'Revisión'], CLOSED: ['#0891b2', '#ecfeff', 'Cerrada'], RELEASED: ['#10b981', '#ecfdf5', 'Liberada'], CANCELLED: ['#ef4444', '#fef2f2', 'Cancelada'] },
  sample: { RECEIVED: ['#3b82f6', '#eff6ff', 'Recibida'], PROCESSING: ['#f59e0b', '#fffbeb', 'En Proceso'], READY: ['#10b981', '#ecfdf5', 'Lista'], DAMAGED: ['#ef4444', '#fef2f2', 'Insuficiente'], CANCELLED: ['#6b7280', '#f3f4f6', 'Cancelada'] },
  report: { DRAFT: ['#f59e0b', '#fffbeb', 'Borrador'], IN_REVIEW: ['#3b82f6', '#eff6ff', 'En Revisión'], APPROVED: ['#10b981', '#ecfdf5', 'Aprobado'], PUBLISHED: ['#22c55e', '#f0fdf4', 'Publicado'], RETRACTED: ['#ef4444', '#fef2f2', 'Retractado'] },
  review: { PENDING: ['#f59e0b', '#fffbeb', 'Pendiente'], APPROVED: ['#10b981', '#ecfdf5', 'Aprobado'], REJECTED: ['#ef4444', '#fef2f2', 'Rechazado'] },
};
const curChip = ([c, bg, l]) => `<span data-reference="actual" style="display:inline-block;background:${bg};color:${c};border-radius:12px;font-size:11px;font-weight:500;padding:4px 10px">${esc(l)}</span>`;

function viewComponentes() {
  const sections = [['principios', 'Principios'], ['acciones', 'Acciones'], ['encabezados', 'Encabezados'], ['campos', 'Campos y filtros'], ['estados', 'Estados clínicos'], ['tabla', 'Tabla y tarjeta'], ['vacios', 'Vacíos y carga'], ['feedback', 'Feedback'], ['navegacion', 'Navegación'], ['movimiento', 'Movimiento']];
  const btnStates = (cls, label, ic) => ['', 'is-hover', 'is-focus', 'is-active'].map((s, i) => `<span class="spec"><button type="button" class="btn ${cls} ${s}" tabindex="-1">${ic ? icon(ic) : ''}${label}</button><small>${['Normal', 'Hover', 'Foco', 'Presionado'][i]}</small></span>`).join('')
    + `<span class="spec"><button type="button" class="btn ${cls}" disabled>${ic ? icon(ic) : ''}${label}</button><small>Deshabilitado</small></span>`;
  const domains = [['order', 'Orden'], ['sample', 'Muestra'], ['report', 'Informe'], ['review', 'Decisión de revisión']];
  main().innerHTML = `
  <div class="page">
    <header class="card page-head">
      <div>
        <h1 class="page-title">Componentes</h1>
        <p class="page-sub">Reglas que conectan Mi trabajo, Órdenes e Informe. Refinan componentes reales de celuma-frontend; no son un paquete ni sustituyen al código.</p>
      </div>
      <nav class="gal-nav" aria-label="Secciones de la galería">${sections.map(([id, l]) => `<a href="#/componentes/${id}">${l}</a>`).join('')}</nav>
    </header>

    <section class="card gal-sec" id="principios" aria-labelledby="g-pr"><header><h2 id="g-pr" class="section-title">Principios</h2><p>Lo que se repite en las tres vistas. Todo es propuesta pendiente de revisión.</p></header>
      <ol class="rules">
        <li><b>El estado nunca depende solo del color:</b> texto + icono + tinta ≥ 4,5:1; «entregado» cambia de forma (relleno sólido).</li>
        <li><b>Una sola escala semántica</b> para órdenes, muestras, informes y decisiones: el mismo significado usa el mismo tono.</li>
        <li><b>Decisión ≠ estado:</b> la decisión del revisor y el estado del informe se muestran por separado.</li>
        <li><b>Qué sigue y quién:</b> cada lista y ficha dice la próxima acción y su responsable.</li>
        <li><b>Identidad en el borde, contenido limpio:</b> teal en navegación y acción primaria; salmón solo en el filete del encabezado y el código.</li>
        <li><b>Texto sobre teal siempre navy</b> (7,10:1); texto teal siempre #1f7a75.</li>
        <li><b>Foco visible único:</b> contorno 2 px #1f7a75 con separación de 2 px; navy sobre el lateral teal.</li>
        <li><b>El documento clínico pertenece al laboratorio cliente;</b> la app no lo decora.</li>
      </ol>
    </section>

    <section class="card gal-sec" id="acciones" aria-labelledby="g-ac"><header><h2 id="g-ac" class="section-title">Acciones · CelumaButton</h2><p>Píldora teal con texto navy para la acción primaria; contorno neutro con límite ≥ 3:1 para la secundaria; peligro sin relleno rojo salvo confirmación.</p></header>
      <div class="specimens">
        <div class="spec-row"><span class="k">Primario</span><div class="v">${btnStates('btn-primary', 'Enviar a revisión', 'send')}<span class="spec"><button type="button" class="btn btn-primary" aria-busy="true" disabled tabindex="-1"><span class="spinner" aria-hidden="true"></span>Firmando y generando PDF oficial…</button><small>Cargando (texto de la app)</small></span></div></div>
        <div class="spec-row"><span class="k">Secundario</span><div class="v">${btnStates('btn-secondary', 'Imprimir copia local', 'printer')}</div></div>
        <div class="spec-row"><span class="k">Peligro</span><div class="v">${btnStates('btn-danger', 'Solicitar cambios', 'undo')}</div></div>
        <div class="spec-row"><span class="k">Tamaños</span><div class="v"><button type="button" class="btn btn-primary" tabindex="-1">Default · 40</button><button type="button" class="btn btn-primary btn-sm" tabindex="-1">Small · 34</button><button type="button" class="btn btn-secondary btn-xs" tabindex="-1">XSmall · 28</button><button type="button" class="btn btn-secondary btn-sm btn-icon" aria-label="Solo icono" tabindex="-1">${icon('more')}</button></div></div>
      </div>
      <ul class="rules"><li>Una acción primaria por zona. Verbo en infinitivo y objeto cuando no es obvio («Enviar a revisión», no «Enviar»).</li><li>Cambios frente a hoy: texto navy en lugar de blanco (2,45 → 7,10:1); altura 40 en lugar de 44 para ganar densidad; borde secundario #8a94a3 (3,07:1).</li><li>Cargando: el botón conserva su ancho, muestra el proceso en texto y queda <code>aria-busy</code>.</li></ul>
    </section>

    <section class="card gal-sec" id="encabezados" aria-labelledby="g-en"><header><h2 id="g-en" class="section-title">Encabezados · PageHeader y ficha</h2><p>El filete salmón de 5 px se conserva como firma. El título describe la vista; el subtítulo dice para qué sirve.</p></header>
      <div class="gal-grid-2">
        <div class="card page-head" style="box-shadow:none"><div><h3 class="page-title">Órdenes</h3><p class="page-sub">Avance de cada orden y quién intervino.</p></div><button type="button" class="btn btn-primary btn-sm" tabindex="-1">${icon('plus')}Nueva orden</button></div>
        <div class="card record" style="box-shadow:none;gap:10px"><div class="record-top"><span class="code-chip">ORD-EJ-0044</span>${chip('order', 'REVIEW', { lg: true })}</div><div class="record-main"><span class="avatar avatar-lg" aria-hidden="true">PC</span><div class="who"><h3 style="font:800 22px/1.1 var(--celuma-font-display)">Paciente Demo Cuatro</h3><span class="idline">PAC-EJ-0013 · 46 años</span></div></div></div>
      </div>
      <ul class="rules"><li>Código de entidad: fondo salmón suave, borde salmón y tinta navy (15,5:1). Hoy: blanco sobre salmón (2,29:1).</li><li>Títulos en frase («Mi trabajo», «Lista de órdenes»), no en mayúsculas iniciales por palabra.</li></ul>
    </section>

    <section class="card gal-sec" id="campos" aria-labelledby="g-ca"><header><h2 id="g-ca" class="section-title">Campos y filtros · FloatingCaption*</h2><p>Etiqueta siempre visible (flota al escribir). Contorno teal oscurecido para alcanzar 3:1 en reposo. El error no desaparece solo.</p></header>
      <div class="specimens">
        <div class="spec-row"><span class="k">Campo</span><div class="v" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));width:100%">
          <div class="spec"><div class="field floating" style="width:100%"><div class="field-box"><label for="g1">Nombre del paciente<span class="req" aria-hidden="true">*</span></label><input id="g1" /></div></div><small>Reposo · #2e9692 3,56:1</small></div>
          <div class="spec"><div class="field floating" style="width:100%"><div class="field-box is-hover"><label for="g2">Nombre del paciente<span class="req" aria-hidden="true">*</span></label><input id="g2" tabindex="-1" /></div></div><small>Hover</small></div>
          <div class="spec"><div class="field floating has-value" style="width:100%"><div class="field-box is-focus"><label for="g3">Nombre del paciente<span class="req" aria-hidden="true">*</span></label><input id="g3" value="Paciente Ejemplo" tabindex="-1" /></div></div><small>Foco con valor</small></div>
          <div class="spec"><div class="field floating has-value is-error" style="width:100%"><div class="field-box"><label for="g4">Código de muestra<span class="req" aria-hidden="true">*</span></label><input id="g4" value="MUE" aria-invalid="true" aria-describedby="g4-m" tabindex="-1" /></div><span class="field-msg" id="g4-m">${icon('alert-triangle', 'ic-sm')}Escribe el código completo, por ejemplo MUE-EJ-0101.</span></div><small>Error persistente</small></div>
          <div class="spec"><div class="field floating has-value is-disabled" style="width:100%"><div class="field-box"><label for="g5">Sucursal</label><input id="g5" value="Sucursal Centro" disabled /></div><span class="field-msg field-help">Solo administración cambia la sucursal.</span></div><small>Deshabilitado con motivo</small></div>
        </div></div>
        <div class="spec-row"><span class="k">Búsqueda</span><div class="v"><div class="field search"><label class="sr-only" for="g6">Buscar</label><div class="field-box">${icon('search')}<input id="g6" type="search" placeholder="Buscar por código, paciente o etiqueta" tabindex="-1" /></div></div></div></div>
        <div class="spec-row"><span class="k">Segmentado</span><div class="v"><div class="segmented" role="group" aria-label="Ejemplo"><button type="button" aria-pressed="true" tabindex="-1">Todo <span class="n">9</span></button><button type="button" aria-pressed="false" tabindex="-1">Informes <span class="n">4</span></button><button type="button" aria-pressed="false" tabindex="-1">Muestras <span class="n">3</span></button></div></div></div>
        <div class="spec-row"><span class="k">Interruptor · selector</span><div class="v"><button type="button" class="switch" role="switch" aria-checked="false" tabindex="-1"><span class="track"></span>Incluir completadas (3)</button><button type="button" class="switch" role="switch" aria-checked="true" tabindex="-1"><span class="track"></span>Activado</button><label class="select-inline">Orden <select tabindex="-1"><option>Más antiguas primero</option></select></label></div></div>
      </div>
      <ul class="rules"><li>El mensaje de error es texto con icono, se asocia con <code>aria-describedby</code> y permanece hasta corregirse. Hoy se oculta a los 5 s (<code>MESSAGE_AUTO_HIDE_MS</code>).</li><li>Un filtro activo siempre se ve: contador de ocultos y «Quitar filtros». Hoy la lista de trabajo oculta completadas con un filtro de columna casi invisible.</li></ul>
    </section>

    <section class="card gal-sec" id="estados" aria-labelledby="g-es"><header><h2 id="g-es" class="section-title">Estados clínicos · escala semántica</h2><p>Nueve tonos con significado transversal. Cada estado conserva su etiqueta del producto y suma un icono propio. Contraste medido en vivo sobre el color calculado.</p></header>
      <div class="tone-legend">${Object.entries(TONES).map(([k, t]) => `<div><span class="chip t-${k}">${esc(t.name)}</span><p>${esc({ nuevo: 'Entró al laboratorio, nadie lo ha trabajado.', encurso: 'Trabajo en marcha o decisión pendiente.', diagnostico: 'Autoría clínica en curso.', revision: 'Esperando revisión.', completado: 'Paso interno terminado; no entregado.', cerrado: 'Cerrado internamente antes de liberar.', entregado: 'Visible fuera del laboratorio. Fondo menta más intenso, sin relleno oscuro.', atencion: 'Requiere intervención o fue retirado.', neutro: 'Terminado sin resultado (cancelado).' }[k])}</p></div>`).join('')}</div>
      <div class="table-wrap"><table class="chip-table"><caption class="sr-only">Estados de la app: hoy y propuesta</caption>
        <thead><tr><th scope="col">Dominio</th><th scope="col">Valor</th><th scope="col">Hoy</th><th scope="col">Contraste hoy</th><th scope="col">Propuesta</th><th scope="col">Contraste propuesta</th></tr></thead>
        <tbody>${domains.map(([d, dl]) => Object.keys(STATES[d]).map((s) => {
          const c = CURRENT[d][s];
          const r0 = ratio(hexToRgb(c[0]), hexToRgb(c[1]));
          return `<tr><td>${dl}</td><td><code>${s}</code></td><td>${curChip(c)}</td><td><span class="ratio ${r0 >= 4.5 ? 'ok' : 'bad'}">${r0.toFixed(2)}:1</span></td><td data-live>${chip(d, s)}${STATES[d][s].current ? ` <span class="was">hoy «${esc(STATES[d][s].current)}»</span>` : ''}</td><td><span class="ratio" data-ratio></span></td></tr>`;
        }).join('')).join('')}</tbody></table></div>
      <ul class="rules"><li>«Aprobado» (verde pálido, check) y «Publicado» (menta más intensa, sello) se distinguen sin cambiar de silueta: hoy sus tintas miden 1,11:1 entre sí.</li><li>«Cancelada» pasa a gris en órdenes y muestras (hoy rojo en órdenes y gris en muestras).</li><li>«Cambios solicitados» es propuesta de vocabulario para REJECTED, porque la operación es «Solicitar cambios». Requiere validación.</li><li>Etiquetas en frase según specs/laboratory/sample-status.md («En proceso»), no «En Proceso».</li><li>Sexo y roles salen de la paleta de estados (hoy comparten azul y rosa).</li></ul>
    </section>

    <section class="card gal-sec" id="tabla" aria-labelledby="g-ta"><header><h2 id="g-ta" class="section-title">Tabla y tarjeta · CelumaTable</h2><p>La fila entera se puede pulsar, pero el enlace del código es el objetivo de teclado. Bajo 820 px de contenedor la tabla se convierte en tarjetas: sin desplazamiento horizontal.</p></header>
      <div class="box table-wrap"><table class="grid"><caption class="sr-only">Estados de fila</caption><thead><tr><th scope="col">Elemento</th><th scope="col">Qué sigue</th><th scope="col">Estado</th><th scope="col">Muestra</th></tr></thead><tbody>
        <tr><td class="cell-code"><a href="#/componentes/tabla" tabindex="-1">ORD-EJ-0051</a></td><td><div class="cell-task"><strong>Revisar y decidir</strong></div></td><td>${chip('report', 'IN_REVIEW')}</td><td class="muted">Normal</td></tr>
        <tr style="background:var(--fr-row-hover)"><td class="cell-code"><a href="#/componentes/tabla" tabindex="-1">ORD-EJ-0039</a></td><td><div class="cell-task"><strong>Firmar y publicar</strong></div></td><td>${chip('report', 'APPROVED')}</td><td class="muted">Hover</td></tr>
        <tr class="is-selected"><td class="cell-code"><a href="#/componentes/tabla" tabindex="-1" class="is-focus">ORD-EJ-0044</a></td><td><div class="cell-task"><strong>Revisar y decidir</strong></div></td><td>${chip('report', 'IN_REVIEW')}</td><td class="muted">Seleccionada + foco</td></tr>
      </tbody></table></div>
      <ul class="cards" style="display:grid;padding:0;max-width:380px">${cardHtml(WORKLIST[5])}</ul>
      <ul class="rules"><li>Densidad: 56 px cómoda (defecto) o 44 px compacta en el control de revisión. Hoy las filas miden ~73 px.</li><li>Cabecera con fondo cálido hundido y orden visible con <code>aria-sort</code>.</li></ul>
    </section>

    <section class="card gal-sec" id="vacios" aria-labelledby="g-va"><header><h2 id="g-va" class="section-title">Vacíos, errores y carga · EmptyState</h2><p>El mismo patrón de avatar suave distingue cuatro situaciones con tono, icono y texto; ninguna usa ilustración decorativa.</p></header>
      <div class="gal-grid-2">
        <div class="box">${emptyBlock({ tone: 'completado', ic: 'check-circle', title: 'No tienes pendientes', text: 'Cuando te asignen trabajo aparecerá aquí.' })}</div>
        <div class="box">${emptyBlock({ tone: 'nuevo', ic: 'search', title: 'Ningún elemento coincide', text: 'Prueba con otro código o quita los filtros.', action: '<button type="button" class="btn btn-secondary btn-sm" tabindex="-1">Quitar filtros</button>' })}</div>
        <div class="box">${emptyBlock({ tone: 'atencion', ic: 'wifi-off', title: 'No se pudo cargar', text: 'Tus datos no se modificaron. Inténtalo de nuevo.', detail: 'Código para soporte: WL-503', action: `<button type="button" class="btn btn-primary btn-sm" tabindex="-1">${icon('refresh')}Reintentar</button>` })}</div>
        <div class="box">${emptyBlock({ tone: 'neutro', ic: 'lock', title: 'Sin acceso a esta sección', text: 'Tu rol no incluye Facturación. Pide acceso a administración.' })}</div>
      </div>
      <div class="box" style="padding:16px;display:grid;gap:10px" aria-hidden="true"><span class="skel" style="width:40%"></span><span class="skel" style="width:85%"></span><span class="skel" style="width:70%"></span></div>
      <ul class="rules"><li>Cargando: esqueleto con la forma final y <code>aria-busy</code>; con movimiento reducido el brillo se detiene.</li><li>Error: di qué pasó, qué no se perdió y qué hacer; incluye un código para soporte.</li></ul>
    </section>

    <section class="card gal-sec" id="feedback" aria-labelledby="g-fe"><header><h2 id="g-fe" class="section-title">Feedback · avisos, toasts y confirmación</h2><p>Avisos en línea para condiciones que persisten; toasts para confirmar algo que acaba de pasar; diálogo solo para acciones irreversibles o que cambian el estado clínico.</p></header>
      <div class="gal-grid-2">
        <div class="notice" role="note">${icon('alert-triangle')}<div><strong>Retenido por pago pendiente</strong><p>El informe no será visible para los solicitantes hasta liquidar el pago.</p></div></div>
        <div class="notice info" role="note">${icon('info')}<div><strong>Vista previa</strong><p>No es el PDF oficial. El PDF oficial existe después de firmar y publicar.</p></div></div>
        <div class="notice ok" role="note">${icon('check-circle')}<div><strong>Muestra lista</strong><p>MUE-EJ-0101 cambió a Lista.</p></div></div>
        <div class="notice danger" role="note">${icon('alert-triangle')}<div><strong>Muestra insuficiente</strong><p>MUE-EJ-0099 requiere atención antes de continuar.</p></div></div>
      </div>
      <div class="btn-row"><button type="button" class="btn btn-secondary btn-sm" data-demo-toast="ok">Mostrar toast de éxito</button><button type="button" class="btn btn-secondary btn-sm" data-demo-toast="error">Mostrar toast de error</button><button type="button" class="btn btn-secondary btn-sm" data-demo-dialog="sign">Abrir confirmación «Firmar y publicar»</button></div>
      <ul class="rules"><li>La confirmación enumera consecuencias en frases cortas y repite el verbo de la acción en el botón.</li><li>Toasts en región <code>aria-live</code>; los de error usan <code>role="alert"</code>. Se cierran solos a los 6,5 s y con botón.</li></ul>
    </section>

    <section class="card gal-sec" id="navegacion" aria-labelledby="g-na"><header><h2 id="g-na" class="section-title">Navegación · lateral, pestañas y pasos</h2><p>El lateral conserva el teal de identidad con tinta navy. El logotipo se apoya en una placa crema, como piden las reglas de fondo liso del isotipo.</p></header>
      <div class="gal-grid-2">
        <div class="sb-mini" aria-hidden="true"><div class="nav" style="padding:0"><a href="#/componentes">${icon('home')}<span>Normal</span></a><a href="#/componentes" style="background:rgba(255,255,255,.32)">${icon('clipboard')}<span>Hover</span></a><a href="#/componentes" aria-current="page">${icon('list-checks')}<span>Actual</span><b class="count">6</b></a><a href="#/componentes" style="outline:2px solid var(--celuma-ink);outline-offset:2px">${icon('file-text')}<span>Foco</span></a></div></div>
        <div class="stack">
          <div class="box"><div class="tabs" role="tablist" aria-label="Ejemplo de pestañas"><button type="button" role="tab" aria-selected="true" tabindex="-1">${icon('history')}Línea de tiempo</button><button type="button" role="tab" aria-selected="false" tabindex="-1">${icon('flask')}Muestras <span class="badge">2</span></button></div></div>
          <div class="box" style="padding:12px"><ol class="steps">${['RECEIVED', 'PROCESSING', 'DIAGNOSIS', 'REVIEW'].map((s, i) => `<li class="${i < 2 ? 'done' : i === 2 ? `current t-${STATES.order[s].tone}` : 'todo'}"><span class="dot">${icon(i < 2 ? 'check' : STATES.order[s].icon)}</span><span class="st">${STATES.order[s].label}</span></li>`).join('')}</ol></div>
        </div>
      </div>
      <ul class="rules"><li>Texto navy sobre teal (7,10:1); hoy blanco (2,45:1). Actual: placa blanca y icono en teal de tinta.</li><li>Pasos: completados en teal de tinta con check; el actual toma el tono de su estado; los pendientes en gris con texto ≥ 4,5:1.</li><li>Bajo 1100 px el lateral se reduce a iconos con nombre accesible; bajo 768 px pasa a un menú deslizante.</li></ul>
    </section>

    <section class="card gal-sec" id="movimiento" aria-labelledby="g-mo"><header><h2 id="g-mo" class="section-title">Movimiento</h2><p>Solo para confirmar causa y efecto: 160 ms en controles, 220 ms en paneles. Nada se mueve por decoración.</p></header>
      <div class="motion-demo"><span class="pill">Pasa el puntero por esta fila</span><span class="muted">Con <code>prefers-reduced-motion: reduce</code> todas las transiciones y animaciones duran ~0 ms.</span></div>
    </section>
  </div>`;
  // Contraste en vivo de los chips propuestos
  $$('tr', main()).forEach((tr) => {
    const c = $('[data-live] .chip', tr);
    const out = $('[data-ratio]', tr);
    if (!c || !out) return;
    const cs = getComputedStyle(c);
    const r = ratio(cs.color, cs.backgroundColor);
    out.textContent = `${r.toFixed(2)}:1`;
    out.classList.add(r >= 4.5 ? 'ok' : 'bad');
  });
  main().addEventListener('click', (e) => {
    const t = e.target.closest('[data-demo-toast]');
    if (t) toast(t.dataset.demoToast === 'ok' ? 'Versión guardada' : 'No se pudo guardar', t.dataset.demoToast === 'ok' ? 'Ejemplo de confirmación breve.' : 'Ejemplo: revisa tu conexión e inténtalo de nuevo.', t.dataset.demoToast);
    const d = e.target.closest('[data-demo-dialog]');
    if (d) openDialog(d.dataset.demoDialog);
  });
}
function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`; }

// ---------------------------------------------------------------- router
function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const params = Object.fromEntries(new URLSearchParams(query));
  return { parts: path.split('/').filter(Boolean), params };
}
function applyParams(params) {
  if (params.datos) S.data = params.datos;
  if (params.densidad) setDensity(params.densidad, false);
  if (params.notas) setNotes(params.notas === '1', false);
  if (params.estado && STATES.report[params.estado]) S.rf.status = params.estado;
  if (params.como && PERSONAS[params.como]) S.rf.persona = params.como;
  if (params.tab) S.od.tab = params.tab;
  if (params.completadas) S.wl.showDone = params.completadas === '1';
  syncControls();
}

const TITLES = { trabajo: 'Mi trabajo', ordenes: 'Órdenes', informe: 'Informe', componentes: 'Componentes' };
let firstRender = true;
function route() {
  const { parts, params } = parseHash();
  applyParams(params);
  const view = parts[0] || 'trabajo';
  if (view === 'fuera') { toast('Sección fuera del prototipo', 'Este experimento cubre Mi trabajo, Órdenes, Informe y Componentes.'); history.back(); return; }
  closeDrawer();
  renderNav(view === 'ordenes' ? 'ordenes' : view);
  if (view === 'ordenes') viewOrdenes(parts[1]);
  else if (view === 'informe') viewInforme();
  else if (view === 'componentes') {
    viewComponentes();
    if (parts[1]) { const el = document.getElementById(parts[1]); if (el) { el.scrollIntoView({ block: 'start' }); el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); } }
  } else viewTrabajo();
  const title = TITLES[view] || 'Mi trabajo';
  document.title = `${title} · Exploración · Céluma`;
  if (!firstRender && !(view === 'componentes' && parts[1])) {
    main().focus({ preventScroll: true });
    window.scrollTo(0, 0);
    $('#route-announcer').textContent = `Vista: ${title}`;
  }
  firstRender = false;
}

// ---------------------------------------------------------------- controles
function syncControls() {
  $$('[data-ctl="data"] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === S.data)));
  $$('[data-ctl="density"] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === S.density)));
  $('[data-ctl="notes"]').setAttribute('aria-checked', String(S.notes));
}
function setData(v) { S.data = v; syncControls(); route(); }
function setDensity(v, rerender = true) { S.density = v; document.body.dataset.density = v; syncControls(); if (rerender) route(); }
function setNotes(on, rerender = true) { S.notes = on; document.body.dataset.notes = on ? 'on' : 'off'; syncControls(); if (rerender) route(); }

function openDrawer() { const sb = $('#sidebar'); sb.dataset.open = 'true'; $('#menu-btn').setAttribute('aria-expanded', 'true'); const s = document.createElement('div'); s.className = 'scrim'; s.addEventListener('click', closeDrawer); document.body.append(s); $('.nav a', sb)?.focus(); }
function closeDrawer() { const sb = $('#sidebar'); if (sb.dataset.open !== 'true') return; sb.dataset.open = 'false'; $('#menu-btn').setAttribute('aria-expanded', 'false'); $('.scrim')?.remove(); $('#menu-btn').focus(); }

function init() {
  mountIcons();
  injectTones();
  $('[data-ctl="data"]').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setData(b.dataset.v); });
  $('[data-ctl="density"]').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setDensity(b.dataset.v); });
  $('[data-ctl="notes"]').addEventListener('click', () => setNotes(!S.notes));
  $('#menu-btn').addEventListener('click', openDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); const d = $('#xcontrols'); if (d.open) { d.open = false; $('summary', d).focus(); } } });
  document.addEventListener('click', (e) => {
    const soon = e.target.closest('[data-soon]');
    if (soon && !soon.closest('#nav')) { e.preventDefault(); toast(`Maqueta: «${soon.dataset.soon}»`, 'Esta acción está fuera del alcance del prototipo.'); }
  });
  window.addEventListener('hashchange', route);
  document.body.dataset.notes = 'off';
  route();
}
init();
