// Captura de referencia de la UI actual de celuma-frontend con API simulada.
// Solo datos sintéticos. No modifica el frontend: lo sirve su propio dev server
// (preview "celuma-frontend", puerto 5173) y Playwright intercepta /api/.
//
// Uso (desde la raíz de celuma-brand-system):
//   node labs/experiments/1-frontend-refinement/scripts/capture-actual.mjs
// Requiere un checkout hermano de celuma-frontend con dependencias instaladas.
import { chromium } from '../../../../../celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../capturas/actual');
fs.mkdirSync(out, { recursive: true });
const APP = process.env.APP_URL || 'http://localhost:5173';

const now = new Date('2026-09-25T15:00:00Z');
const ago = (h) => new Date(now.getTime() - h * 3600e3).toISOString();
const branch = { id: 'b1', name: 'Sucursal Ejemplo Centro', code: 'CEN' };
const NAMES = ['Paciente Ejemplo Uno', 'Paciente Ejemplo Dos', 'Paciente Ficticio Tres', 'Paciente Demo Cuatro', 'Paciente Prueba Cinco', 'Paciente Modelo Seis'];
const pat = (i) => ({ id: 'p' + i, full_name: NAMES[i % NAMES.length], patient_code: 'PAC-EJ-' + String(10 + i).padStart(4, '0') });

const me = {
  id: 'u1', email: 'revisora@example.test', full_name: 'Revisora Ejemplo', roles: ['reviewer', 'pathologist'], tenant_id: 't1', branch_ids: ['b1'],
  permissions: ['lab:read', 'lab:create_order', 'lab:create_sample', 'lab:create_patient', 'lab:update_sample', 'lab:update_order', 'lab:manage_reviewers',
    'reports:read', 'reports:create', 'reports:edit', 'reports:submit', 'reports:approve', 'reports:sign', 'billing:read'],
};

const worklist = [
  { kind: 'review', item_type: 'report', status: 'PENDING', h: 1 }, // item_status de revisión = decisión (ReviewStatus)
  { kind: 'assignment', item_type: 'sample', status: 'PROCESSING', h: 3 },
  { kind: 'assignment', item_type: 'lab_order', status: 'DIAGNOSIS', h: 5 },
  { kind: 'review', item_type: 'report', status: 'PENDING', h: 20 },
  { kind: 'assignment', item_type: 'sample', status: 'RECEIVED', h: 26 },
  { kind: 'assignment', item_type: 'report', status: 'DRAFT', h: 50 },
  { kind: 'review', item_type: 'report', status: 'APPROVED', h: 70 },
].map((w, i) => ({
  id: 'w' + i, kind: w.kind, item_type: w.item_type, item_id: 'x' + i,
  display_id: (w.item_type === 'sample' ? 'MUE-EJ-0' : w.item_type === 'report' ? 'INF-EJ-0' : 'ORD-EJ-0') + (41 + i),
  item_status: w.status, assigned_at: ago(w.h), patient_id: 'p' + i, patient_name: pat(i).full_name, patient_code: pat(i).patient_code,
  order_code: 'ORD-EJ-0' + (41 + i), tags: i % 3 === 0 ? ['Urgente'] : [], link: '/orders/o3',
}));

const orderStatuses = ['RECEIVED', 'PROCESSING', 'DIAGNOSIS', 'REVIEW', 'CLOSED', 'RELEASED', 'CANCELLED'];
const orders = orderStatuses.map((s, i) => ({
  id: 'o' + i, order_code: 'ORD-EJ-0' + (41 + i), status: s, tenant_id: 't1', branch, patient: pat(i),
  requesting_physician: { id: 'm1', full_name: 'Dra. Solicitante Ejemplo', physician_code: 'MED-EJ-01' },
  requested_by: 'Dra. Solicitante Ejemplo', created_at: ago(24 * (i + 1)), sample_count: 1 + (i % 3), has_report: i > 2, has_invoice: i > 4,
  labels: i % 2 ? [{ id: 'l1', name: 'Urgente', color: '#ef4444' }] : [], assignees: [],
}));

const orderFull = {
  order: {
    id: 'o3', order_code: 'ORD-EJ-0044', status: 'REVIEW', patient_id: 'p3', tenant_id: 't1', branch_id: 'b1',
    requesting_physician: { id: 'm1', full_name: 'Dra. Solicitante Ejemplo', physician_code: 'MED-EJ-01', specialty: 'Ginecología' },
    requested_by: 'Dra. Solicitante Ejemplo', notes: 'Texto ficticio de descripción de la orden.', billed_lock: true, report_id: null, invoice_id: 'inv1',
    created_at: ago(72), assignees: [{ id: 'u3', name: 'Técnica Ejemplo', email: 't@example.test' }],
    reviewers: [{ id: 'u1', name: 'Revisora Ejemplo', email: 'revisora@example.test', status: 'PENDING', review_id: 'rv1' }],
    labels: [{ id: 'l1', name: 'Urgente', color: '#ef4444' }],
  },
  patient: { id: 'p3', patient_code: 'PAC-EJ-0013', first_name: 'Paciente Demo', last_name: 'Cuatro', dob: '1980-01-01', sex: 'F', tenant_id: 't1', branch_id: 'b1' },
  samples: [
    { id: 's1', sample_code: 'MUE-EJ-0101', type: 'BIOPSIA', state: 'READY', order_id: 'o3', tenant_id: 't1', branch_id: 'b1', created_at: ago(70), assignees: [] },
    { id: 's2', sample_code: 'MUE-EJ-0102 · Fragmento con descripción larga de ejemplo', type: 'LAMINILLA', state: 'PROCESSING', order_id: 'o3', tenant_id: 't1', branch_id: 'b1', created_at: ago(60), assignees: [] },
  ],
};
const events = [
  ['ORDER_CREATED', 72, 'Orden creada'], ['SAMPLE_RECEIVED', 70, 'Muestra recibida'], ['ORDER_STATUS_CHANGED', 40, 'Estado cambiado'], ['REVIEWERS_ADDED', 30, 'Revisor asignado'],
].map(([t, h, d], i) => ({ id: 'e' + i, event_type: t, description: d, created_at: ago(h), created_by: 'u3', created_by_name: 'Técnica Ejemplo',
  metadata: t === 'ORDER_STATUS_CHANGED' ? { old_status: 'DIAGNOSIS', new_status: 'REVIEW' } : t === 'REVIEWERS_ADDED' ? { reviewers: [{ id: 'u1', name: 'Revisora Ejemplo' }], reviewer_names: ['Revisora Ejemplo'] } : {} }));

const unknown = new Set();
async function mockApi(page) {
  await page.route(/\/api\//, (route) => {
    const u = new URL(route.request().url());
    const p = u.pathname.replace(/^\/api/, '');
    const json = (b, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(b) });
    if (p.startsWith('/v1/auth/me')) return json(me);
    if (p.startsWith('/v1/me/worklist')) return json({ items: worklist, total: worklist.length, page: 1, page_size: 20, has_more: false });
    if (p === '/v1/laboratory/orders/o3/full') return json(orderFull);
    if (p === '/v1/laboratory/orders/o3/events') return json({ events });
    if (p === '/v1/laboratory/orders/o3/comments') return json({ items: [], comments: [] });
    if (p.startsWith('/v1/laboratory/orders')) return json({ orders });
    if (p.startsWith('/v1/dashboard')) return json({ stats: { total_patients: 128, total_orders: 342, total_samples: 511, total_reports: 297, pending_orders: 14, draft_reports: 6, published_reports: 271 }, recent_activity: [] });
    if (p.startsWith('/v1/laboratory/labels')) return json({ labels: [{ id: 'l1', name: 'Urgente', color: '#ef4444' }] });
    if (p.startsWith('/v1/laboratory/users/search')) return json({ users: [{ id: 'u3', name: 'Técnica Ejemplo', email: 't@example.test' }] });
    if (p.startsWith('/v1/users/reviewers')) return json({ reviewers: [{ id: 'u1', full_name: 'Revisora Ejemplo', email: 'revisora@example.test', username: 'revisora' }] });
    if (p.includes('unread-count')) return json({ count: 2, unread_count: 2 });
    if (p.startsWith('/v1/notifications')) return json({ items: [], notifications: [], total: 0 });
    unknown.add(p);
    return json({});
  });
}

const browser = await chromium.launch();
const shots = [];
const errors = [];
async function shoot(name, route, { width = 1440, height = 900, full = false, wait = 2500 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
  await ctx.addInitScript(() => localStorage.setItem('auth_token', 'Bearer demo-sintetico'));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name} [console]: ${m.text().slice(0, 180)}`); });
  await mockApi(page);
  await page.goto(APP + route, { waitUntil: 'networkidle' }).catch((e) => errors.push(`${name}: ${e.message}`));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(wait);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const file = `${name}.jpg`;
  await page.screenshot({ path: path.join(out, file), fullPage: full, type: 'jpeg', quality: 78 });
  shots.push({ name, route, width, height, full, horizontalOverflowPx: overflow });
  await ctx.close();
}

for (const [w, h, tag] of [[1440, 900, '1440'], [768, 1024, '768'], [390, 844, '390']]) {
  await shoot(`worklist-${tag}`, '/worklist', { width: w, height: h });
  await shoot(`ordenes-${tag}`, '/orders', { width: w, height: h });
  await shoot(`orden-detalle-${tag}`, '/orders/o3', { width: w, height: h, full: w === 390 });
}

fs.writeFileSync(path.join(out, 'actual.json'), JSON.stringify({ app: APP, capturedAt: new Date().toISOString(), shots, errors, unknownApi: [...unknown] }, null, 2));
console.log(JSON.stringify({ n: shots.length, overflow: shots.map((s) => `${s.name}:${s.horizontalOverflowPx}`), errors: errors.slice(0, 20), unknownApi: [...unknown] }, null, 2));
await browser.close();
