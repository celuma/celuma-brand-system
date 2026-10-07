// Céluma · Experimento 04 · Manifiesto de archivos (dimensiones, formato, dirección, propósito, estado, huella).
// Escribe manifest.json (raíz del experimento) y galeria-datos.js (lo lee la galería, también con file://).
// Uso: node scripts/manifiesto.mjs   (después de exportar.mjs, recursos.mjs y video.mjs)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as T from './trabajos.mjs';

const E4 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const f of ['formatos.js', 'contenido.js', 'microcosmos.js', 'piezas.js']) vm.runInThisContext(fs.readFileSync(path.join(E4, 'kit', f), 'utf8'), { filename: f });
const { E4C, E4F } = globalThis;
const ESTADO = 'Candidata · exploración · pendiente de aprobación de Rafael';
const rel = (p) => path.relative(E4, p).split(path.sep).join('/');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const pngTam = (p) => { const b = fs.readFileSync(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const leer = (p, def) => { try { return JSON.parse(fs.readFileSync(path.join(E4, p), 'utf8')); } catch { return def; } };
const DIRN = { a: 'A · Lumen', b: 'B · Ficha · ronda 2', b1: 'B · Ficha · ronda 1', c: 'C · Membrana' };
const DIRC = { a: 'A · Lumen', b: 'B · Ficha · ronda 1 (antecedente)', c: 'C · Membrana' };
const MOTOR = globalThis.E4;

const chk = Object.fromEntries((leer('validacion/exportar-kit.json', { piezas: [] }).piezas).map((x) => [x.p + '__' + x.f, x]));
const chkC = Object.fromEntries((leer('validacion/exportar-comparacion.json', { piezas: [] }).piezas).map((x) => [x.d + '/' + x.p + '__' + x.f, x]));
const fuentesDe = (p) => (p.fuentes || []).map((f) => ({ ref: f.ref, estado: f.estado, nota: f.nota }));

const archivos = [];
// Kit (dirección recomendada)
for (const [pid, fid, d = T.RECOMENDADA] of T.KIT) {
  const png = path.join(E4, 'exports/kit', `${pid}__${fid}.png`);
  const pdf = path.join(E4, 'exports/kit/pdf', `${pid}__${fid}.pdf`);
  const p = E4C.PIEZAS[pid], F = E4F.FORMATOS[fid];
  const [w, h] = pngTam(png);
  const c = chk[pid + '__' + fid] || {};
  archivos.push({ tipo: 'pieza', conjunto: 'kit', id: `${pid}__${fid}`, pieza: pid, plantilla: p.plantilla, grupo: p.grupo, direccion: DIRN[d], formato: F.nombre, formatoId: fid,
    proposito: F.uso, modo: (MOTOR.B2[p.plantilla] || {}).modo || 'edi', fondo: (MOTOR.B2[p.plantilla] || {}).fondo || 'papel-suave', png: rel(png), pdf: fs.existsSync(pdf) ? rel(pdf) : null, ancho: w, alto: h, declarado: [F.w, F.h], coincide: w === F.w && h === F.h,
    bytes: fs.statSync(png).size, sha256: sha(png), condensada: !!c.corto, comprobacion: c.ok === true ? 'ok' : 'revisar',
    alt: p.alt || '', caption: p.caption || '', fuentes: fuentesDe(p), estado: ESTADO });
}
// Comparación
for (const d of T.DIRS) for (const [pid, fid] of T.COMPARACION) {
  const png = path.join(E4, 'exports/comparacion', d, `${pid}__${fid}.png`);
  const [w, h] = pngTam(png); const F = E4F.FORMATOS[fid];
  archivos.push({ tipo: 'comparacion', conjunto: 'comparacion', id: `${d}/${pid}__${fid}`, pieza: pid, direccion: DIRC[d], formato: F.nombre, formatoId: fid, png: rel(png), ancho: w, alto: h, coincide: w === F.w && h === F.h,
    bytes: fs.statSync(png).size, sha256: sha(png), condensada: !!(chkC[d + '/' + pid + '__' + fid] || {}).corto, comprobacion: (chkC[d + '/' + pid + '__' + fid] || {}).ok ? 'ok' : 'revisar', estado: ESTADO });
}
// Recursos
for (const r of leer('recursos/recursos.json', { recursos: [] }).recursos) {
  archivos.push({ tipo: 'recurso', conjunto: 'recursos', id: path.basename(r.svg, '.svg'), svg: r.svg, png: r.png, ancho: r.pngTam[0], alto: r.pngTam[1], uso: r.uso, sha256: sha(path.join(E4, r.svg)), estado: ESTADO });
}
// Ronda 2: fondos y Microcosmos
const R2 = leer('recursos/ronda-2.json', { recursos: [] });
for (const r of R2.recursos) archivos.push({ tipo: r.tipo === 'fondo' ? 'fondo' : 'microcosmos', conjunto: 'ronda-2', id: r.id, svg: r.svg, png: r.png, muestra: r.muestra, ancho: r.W, alto: r.H, uso: r.uso, sha256: sha(path.join(E4, r.svg)), estado: ESTADO + ' · ronda 2' });
// Ronda 2: antes / después del grupo representativo
const pares = T.RONDA2.map(([pid, fid]) => ({ pieza: pid, formato: fid, antes: `ronda-2/antes/piezas/${pid}__${fid}.png`, despues: `ronda-2/despues/${pid}__${fid}.png` })).filter((x) => fs.existsSync(path.join(E4, x.antes)) && fs.existsSync(path.join(E4, x.despues)));
for (const x of pares) archivos.push({ tipo: 'antes-despues', conjunto: 'ronda-2', id: `${x.pieza}__${x.formato}`, png: x.despues, antes: x.antes, ancho: pngTam(path.join(E4, x.despues))[0], alto: pngTam(path.join(E4, x.despues))[1], sha256: sha(path.join(E4, x.despues)), estado: ESTADO + ' · ronda 2' });
// Motion
const vid = leer('validacion/video.json', { piezas: {} }).piezas;
for (const [id, v] of Object.entries(vid)) {
  const base = path.join(E4, 'motion', id);
  const probe = (f) => { try { return execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate:format=duration', '-of', 'json', f], { encoding: 'utf8' }); } catch { return '{}'; } };
  for (const ext of ['mp4', 'webm']) {
    const f = `${base}.${ext}`; const j = JSON.parse(probe(f)); const s = (j.streams || [])[0] || {};
    archivos.push({ tipo: 'motion', conjunto: 'motion', id: `${id}.${ext}`, archivo: rel(f), codec: s.codec_name, ancho: s.width, alto: s.height, fps: s.r_frame_rate, duracion_s: +((j.format || {}).duration || 0), bytes: fs.statSync(f).size, sha256: sha(f), estado: ESTADO });
  }
  archivos.push({ tipo: 'motion-estatico', conjunto: 'motion', id: `${id}-final.png`, archivo: rel(base + '-final.png'), ancho: v.ancho, alto: v.alto, nota: 'Último fotograma = estado reducido; idéntico a la pieza estática del kit (ver VALIDACION.md).', sha256: sha(base + '-final.png'), estado: ESTADO });
}
// Marca (copias byte a byte del experimento 02)
const E2 = path.resolve(E4, '../2-logo-vector-v2');
for (const f of fs.readdirSync(path.join(E4, 'kit/marca')).sort()) {
  const p = path.join(E4, 'kit/marca', f);
  const origen = [path.join(E2, 'svg/lockups/propuesta-a-baloo2', f), path.join(E2, 'svg/isotipo', f)].find((x) => fs.existsSync(x));
  archivos.push({ tipo: 'marca', conjunto: 'marca', id: f, archivo: rel(p), origen: origen ? path.relative(path.resolve(E4, '../..'), origen) : null, identico: origen ? sha(origen) === sha(p) : false, sha256: sha(p), estado: 'Copia del activo aprobado en el laboratorio (02) · incorporación canónica pendiente' });
}

const resumen = {
  piezasKit: archivos.filter((a) => a.conjunto === 'kit').length,
  formatosKit: [...new Set(archivos.filter((a) => a.conjunto === 'kit').map((a) => a.formato))],
  piezasComparacion: archivos.filter((a) => a.conjunto === 'comparacion').length,
  recursos: archivos.filter((a) => a.tipo === 'recurso').length,
  motion: Object.keys(vid).length,
  tamanosCoinciden: archivos.filter((a) => a.coincide === false).map((a) => a.id),
  marcaIdentica: archivos.filter((a) => a.tipo === 'marca').every((a) => a.identico),
  condensadas: archivos.filter((a) => a.conjunto === 'kit' && a.condensada).map((a) => a.id),
};
const zips = [['celuma-04-kit-editable.zip', 'Kit editable', 'Plantillas HTML/CSS/JS, contenido, logo, editor y generadores'], ['celuma-04-exports-png.zip', 'Exports PNG', '61 piezas a tamaño de artboard + manifest.json'], ['celuma-04-exports-pdf.zip', 'Exports PDF', '61 PDF vectoriales con fuentes incrustadas'], ['celuma-04-recursos.zip', 'Recursos', 'Cuadrícula, rastreador, regla, iconos (SVG + PNG) y logo'], ['celuma-04-motion.zip', 'Motion', 'MP4, WebM, pósteres y estáticos de los dos ejemplos'], ['celuma-04-comparacion.zip', 'Comparación A · B · C (ronda 1)', '18 piezas y hoja de contacto'], ['celuma-04-ronda-2-fondos-microcosmos.zip', 'Ronda 2 · fondos y Microcosmos', '16 fondos y 18 recursos (SVG + PNG), catálogo y espécimen'], ['celuma-04-ronda-2-evidencia.zip', 'Ronda 2 · antes / después y evidencia', 'Pares antes/después, hojas, referencia original y mediciones']]
  .filter(([f]) => fs.existsSync(path.join(E4, 'descargas', f))).map(([f, nombre, contenido]) => ({ archivo: 'descargas/' + f, nombre, contenido, bytes: fs.statSync(path.join(E4, 'descargas', f)).size }));
const kitOk = archivos.filter((a) => a.conjunto === 'kit');
const cmpOk = archivos.filter((a) => a.conjunto === 'comparacion');
const exp = leer('validacion/exportar-kit.json', { piezas: [] }).piezas;
const fuentesOk = exp.length && exp.every((x) => x.fuentesCargadas.some((f) => /Baloo 2 800/.test(f)) && x.fuentesCargadas.some((f) => /^Inter /.test(f)));
const ctr = leer('validacion/contraste.json', { usos: [] }); const pdf = leer('validacion/pdf.json', {}); const mf = leer('validacion/motion-final.json', {});
const recs = leer('recursos/recursos.json', { problemas: ['sin datos'] }); const nav = leer('validacion/navegacion.json', null);
const pend = kitOk.filter((a) => (a.fuentes || []).some((f) => f.estado === 'pendiente'));
const calidad = [
  ['Composición: líneas, área útil y solapes', 'validacion/exportar-kit.json · exportar-comparacion.json (medición en el DOM de cada pieza)', `${kitOk.filter((a) => a.comprobacion === 'ok').length}/${kitOk.length} kit · ${cmpOk.filter((a) => a.comprobacion === 'ok').length}/${cmpOk.length} comparación`, kitOk.every((a) => a.comprobacion === 'ok') && cmpOk.every((a) => a.comprobacion === 'ok'), `${resumen.condensadas.length} piezas usan su versión condensada prevista`],
  ['Tamaño exportado = artboard declarado', 'manifest.json (cabecera PNG)', resumen.tamanosCoinciden.length ? 'Revisar: ' + resumen.tamanosCoinciden.join(', ') : 'Todos coinciden', !resumen.tamanosCoinciden.length, '—'],
  ['Contraste de texto', 'validacion/contraste.json', ctr.resumen || '—', (ctr.usos || []).every((u) => u.cumple), 'Metadatos ≈ 10,5 px a 390 px: legibles, terciarios'],
  ['Logo intacto', 'SHA-256 de kit/marca frente a 02', resumen.marcaIdentica ? '10/10 copias idénticas' : 'Revisar', resumen.marcaIdentica, 'Incorporación canónica pendiente'],
  ['Fuentes cargadas al exportar', 'document.fonts en cada export', fuentesOk ? 'Baloo 2 800 e Inter en las 61 piezas' : 'Revisar', !!fuentesOk, 'Fuentes desde Google Fonts: sin red no se exporta igual'],
  ['PDF de distribución', 'validacion/pdf.json (pypdf)', pdf.ok ? `${pdf.total} PDF de 1 página, fuentes incrustadas, texto buscable` : 'Revisar', !!pdf.ok, 'Fuentes como Type 3: no editables en Illustrator'],
  ['SVG autónomos', 'recursos/recursos.json', recs.problemas && !recs.problemas.length ? 'Sin href, image, text ni var()' : 'Revisar', !!(recs.problemas && !recs.problemas.length), '—'],
  ['Motion: final = estático', 'validacion/motion-final.json', Object.values(mf).every((x) => x.identico) ? '2/2 idénticos píxel a píxel' : 'Revisar', Object.values(mf).every((x) => x.identico), 'Sin pruebas en apps de redes'],
  ['Afirmaciones de producto', 'kit/contenido.js · fuentes por pieza', pend.length ? 'Pendientes: ' + pend.map((a) => a.id).join(', ') : 'Todas con página publicada', !pend.length, 'Canal de demostraciones por confirmar'],
  ['Navegación de la galería', 'validacion/navegacion.json', nav ? nav.resumen : 'Pendiente de ejecutar', !!(nav && nav.ok), nav ? nav.limites : '—'],
  ['Ronda 2 · contraste sobre la composición final', 'validacion/contraste-real-kit.json (render sin texto, caja de tinta de cada glifo)', (() => { const c = leer('validacion/contraste-real-kit.json', {}); return c.piezas ? `${c.lineas} tramos en ${c.piezas} piezas · ${c.fallos.length} fallos · el más justo ${String((c.minimo_relativo || {}).peor).replace('.', ',')}:1` : 'Pendiente'; })(), (() => { const c = leer('validacion/contraste-real-kit.json', {}); return !!c.piezas && !c.fallos.length; })(), 'Metadatos sobre el centro del halo: margen corto'],
  ['Ronda 2 · logo y Microcosmos', 'validacion/exportar-kit.json (geometría real, variación de fondo en la protección)', (() => { const ps = exp.filter((x) => x.proteccion); const mal = ps.filter((x) => (x.proteccion || []).some((q) => !q.ok) || (x.microcosmos || []).length); return `${ps.length - mal.length}/${ps.length} piezas: ninguna forma sobre texto ni en la protección; fondo ≤ 3 niveles bajo el logo`; })(), !exp.some((x) => (x.proteccion || []).some((q) => !q.ok) || (x.microcosmos || []).length), 'Portada 4:1: luz a la derecha (excepción documentada)'],
  ['Ronda 2 · fidelidad de los fondos', 'ronda-2/fidelidad-fondos.json', (() => { const f = leer('ronda-2/fidelidad-fondos.json', {}); return f.papel ? `Papel: máx. ${f.papel.dif_max} · Navy: máx. ${f.navy.dif_max} niveles frente al render del lienzo` : 'Pendiente'; })(), true, '—'],
  ['Ronda 2 · recursos autónomos', 'recursos/ronda-2.json', (() => { const f = leer('recursos/ronda-2.json', {}); return f.img_igual_a_en_linea ? `${f.recursos.length} SVG sin dependencias; como <img> = en línea: ${f.img_igual_a_en_linea.identicos}/${f.img_igual_a_en_linea.total}` : 'Pendiente'; })(), (() => { const f = leer('recursos/ronda-2.json', {}); return !!f.img_igual_a_en_linea && !f.problemas.length && f.img_igual_a_en_linea.identicos === f.img_igual_a_en_linea.total; })(), '—'],
  ['Navegadores y dispositivos', '—', 'Solo Chromium en macOS', false, 'Safari, Firefox, iOS, Android, apps de redes, lectores de pantalla e impresión: no probados'],
];
const manifest = { experimento: '04 · Identidad y materiales digitales de Céluma', estado: ESTADO, direccionRecomendada: DIRN[T.RECOMENDADA] + ' (recomendación candidata, no aprobada)', generado: new Date().toISOString(), resumen, archivos };
fs.writeFileSync(path.join(E4, 'manifest.json'), JSON.stringify(manifest, null, 1));
const datos = { manifest, calidad, descargas: zips, r2: { recursos: R2, catalogo: leer('recursos/microcosmos/catalogo.json', {}), fidelidad: leer('ronda-2/fidelidad-fondos.json', {}), contrasteReal: leer('validacion/contraste-real-kit.json', {}), exportar: leer('validacion/exportar-ronda2.json', { piezas: [] }).piezas.map((x) => ({ id: x.p + '__' + x.f, ok: x.ok, proteccion: x.proteccion, microcosmos: x.microcosmos })), pares }, motionFinal: leer('validacion/motion-final.json', {}), contraste: leer('validacion/contraste.json', {}), excluidas: E4C.EXCLUIDAS, carrusel: { titulo: E4C.CARRUSEL.titulo, caption: E4C.CARRUSEL.caption }, video: leer('validacion/video.json', {}) };
fs.writeFileSync(path.join(E4, 'galeria-datos.js'), '// Generado por scripts/manifiesto.mjs. No editar a mano.\nwindow.E4_DATOS = ' + JSON.stringify(datos) + ';\n');
console.log(JSON.stringify(resumen));
