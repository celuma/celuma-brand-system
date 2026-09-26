// Captures representative surfaces of app (mocked API, synthetic data), landing and docs.
import { chromium } from '/Users/rafaelmagana/Céluma/celuma-frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });

const now = '2026-09-20T15:00:00Z';
const branch = { id: 'b1', name: 'Sucursal Centro', code: 'CEN' };
const pat = (i) => ({ id: 'p' + i, full_name: ['Ana Ejemplo Ruiz', 'Luis Muestra Paz', 'Eva Prueba Sol', 'Juan Ficticio Mar', 'Rosa Demo Luz', 'Iván Modelo Río', 'Sara Caso Vela'][i % 7], patient_code: 'PAC-00' + (10 + i) });
const orderStatuses = ['RECEIVED', 'PROCESSING', 'DIAGNOSIS', 'REVIEW', 'CLOSED', 'RELEASED', 'CANCELLED'];
const orders = orderStatuses.map((s, i) => ({
  id: 'o' + i, order_code: 'ORD-2026-0' + (41 + i), status: s, tenant_id: 't1', branch, patient: pat(i),
  requesting_physician: { id: 'm1', full_name: 'Dra. Médica Ejemplo', physician_code: 'MED-01' },
  requested_by: 'Dra. Médica Ejemplo', created_at: now, sample_count: 1 + (i % 3), has_report: i > 2, has_invoice: i > 4,
  labels: i % 2 ? [{ id: 'l1', name: 'Urgente', color: '#ef4444' }] : [], assignees: [],
}));
const sampleStates = ['RECEIVED', 'PROCESSING', 'READY', 'DAMAGED', 'CANCELLED'];
const samples = sampleStates.map((s, i) => ({
  id: 's' + i, sample_code: 'MUE-0' + (71 + i), type: ['BIOPSIA', 'LAMINILLA', 'BIOPSIA', 'SANGRE', 'BIOPSIA'][i], state: s, tenant_id: 't1', branch,
  order: { id: 'o' + i, order_code: orders[i].order_code, status: orders[i].status, patient: pat(i) }, received_at: now, labels: [], assignees: [],
}));
const reportStatuses = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'RETRACTED'];
const reports = reportStatuses.map((s, i) => ({
  id: 'r' + i, status: s, tenant_id: 't1', branch,
  order: { id: 'o' + i, order_code: orders[i].order_code, status: orders[i].status, requested_by: 'Dra. Médica Ejemplo', patient: pat(i) },
  title: 'Estudio de ejemplo ' + (i + 1), diagnosis_text: 'Texto ficticio', created_at: now, published_at: s === 'PUBLISHED' ? now : null,
  version_no: 1, has_pdf: s === 'PUBLISHED', reviewers: [{ id: 'u2', name: 'Revisor Ejemplo', email: 'rev@example.test', status: s === 'APPROVED' || s === 'PUBLISHED' ? 'APPROVED' : 'PENDING' }],
}));
const me = { id: 'u1', email: 'demo@example.test', full_name: 'Usuaria Demo', roles: ['admin'], tenant_id: 't1', branch_ids: ['b1'],
  permissions: ['lab:read', 'lab:create_order', 'lab:create_sample', 'lab:create_patient', 'lab:update_sample', 'reports:read', 'reports:create', 'billing:read', 'admin:manage_tenant', 'admin:manage_users', 'admin:manage_catalog', 'admin:manage_branches', 'reports:manage_templates'] };

const unknown = new Set();
async function mockApi(page) {
  await page.route(/\/api\//, (route) => {
    const u = new URL(route.request().url()); const p = u.pathname.replace(/^\/api/, '');
    const json = (b) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(b) });
    if (p.startsWith('/v1/auth/me')) return json(me);
    if (p.startsWith('/v1/laboratory/orders')) return json({ orders });
    if (p.startsWith('/v1/laboratory/samples')) return json({ samples });
    if (p.startsWith('/v1/reports')) return json({ reports });
    if (p.startsWith('/v1/dashboard')) return json({ stats: { total_patients: 128, total_orders: 342, total_samples: 511, total_reports: 297, pending_orders: 14, draft_reports: 6, published_reports: 271 },
      recent_activity: [
        { id: 'a1', title: 'Orden ORD-2026-041', description: 'Orden recibida', timestamp: now, type: 'order', status: 'RECEIVED' },
        { id: 'a2', title: 'Informe de ejemplo 3', description: 'Informe aprobado', timestamp: now, type: 'report', status: 'APPROVED' },
        { id: 'a3', title: 'Informe de ejemplo 4', description: 'Informe publicado', timestamp: now, type: 'report', status: 'PUBLISHED' },
        { id: 'a4', title: 'Muestra MUE-072', description: 'Muestra en proceso', timestamp: now, type: 'sample', status: 'PROCESSING' } ] });
    if (p.includes('unread-count')) return json({ count: 3, unread_count: 3 });
    if (p.startsWith('/v1/notifications')) return json({ items: [], notifications: [], total: 0 });
    unknown.add(p);
    return json({});
  });
}

const browser = await chromium.launch();
const shots = [];
const errors = [];
async function shoot(name, url, { width = 1440, height = 900, full = false, mock = false, auth = false, dark = false, wait = 1500 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, colorScheme: dark ? 'dark' : 'light' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(name + ': ' + e));
  if (mock) await mockApi(page);
  if (auth) await page.addInitScript(() => localStorage.setItem('auth_token', 'Bearer demo'));
  await page.goto(url, { waitUntil: 'networkidle' }).catch((e) => errors.push(name + ': ' + e));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(wait);
  const file = name + '.png';
  await page.screenshot({ path: path.join(out, file), fullPage: full });
  shots.push({ name, url, width, dark, full });
  await ctx.close();
}

const app = 'http://localhost:5173';
await shoot('app-login', app + '/login', { mock: true });
await shoot('app-login-movil', app + '/login', { mock: true, width: 390, height: 844 });
for (const [n, r] of [['inicio', '/home'], ['ordenes', '/orders'], ['muestras', '/samples'], ['informes', '/reports']]) {
  await shoot('app-' + n, app + r, { mock: true, auth: true, wait: 2500 });
}
await shoot('app-ordenes-movil', app + '/orders', { mock: true, auth: true, width: 390, height: 844, wait: 2500 });
await shoot('app-inicio-movil', app + '/home', { mock: true, auth: true, width: 390, height: 844, wait: 2500 });

const land = 'http://localhost:5180';
await shoot('landing-completa', land + '/', { full: true, wait: 2500 });
await shoot('landing-movil', land + '/', { full: true, width: 390, height: 844, wait: 2500 });

const docs = 'http://localhost:3001';
await shoot('docs-inicio', docs + '/', { wait: 2500 });
await shoot('docs-inicio-oscuro', docs + '/', { dark: true, wait: 2500 });
await shoot('docs-articulo', docs + '/primeros-pasos', { wait: 2500 });
await shoot('docs-articulo-movil', docs + '/primeros-pasos', { width: 390, height: 844, wait: 2500 });

fs.writeFileSync(path.join(out, 'superficies.json'), JSON.stringify({ shots, errors, unknownApi: [...unknown] }, null, 2));
console.log(JSON.stringify({ n: shots.length, errors, unknownApi: [...unknown] }, null, 2));
await browser.close();
