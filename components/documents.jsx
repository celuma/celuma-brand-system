// Céluma — Editorial / Clinical documents
// Clinical reports, internal forms, document templates (headers/footers), PDF templates

const A4 = { w: 460, h: 651 };

// ---------- CLINICAL REPORT (EXPLORACIÓN DE MARCA) ----------
// Visual brand exploration on stationery. It does NOT describe how the product
// issues reports today: real reports carry the client laboratory's letterhead
// (celuma-engineering ADR 0002). Two pages so the fixed footer never covers content.

function ReportExampleBand() {
  return (
    <div style={{ margin: '0 32px', padding: '5px 10px', border: '1px dashed rgba(13,27,42,0.35)', borderRadius: 6, background: '#fffaf0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--celuma-fg-2)' }}>
      <span>Ejemplo visual de marca · no es un informe clínico</span>
      <span style={{ fontWeight: 600, letterSpacing: '0.04em' }}>Datos ficticios</span>
    </div>
  );
}

function ReportHeader({ compact = false }) {
  return (
    <div style={{ padding: compact ? '22px 32px 12px' : '28px 32px 14px', background: '#fff', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CelMark size={compact ? 's' : 'm'} />
        <div style={{ textAlign: 'right' }}>
          <div className="cel-eyebrow" style={{ fontSize: 9 }}>Informe histopatológico</div>
          <div className="cel-mono" style={{ fontSize: 11, marginTop: 4 }}>EJ‑INF‑00482 · v.1</div>
          {!compact && <div className="t-meta" style={{ marginTop: 2 }}>Emisión: 16 / 05 / 2026</div>}
        </div>
      </div>
      {!compact && <hr className="cel-rule teal" style={{ marginTop: 14, height: 2, width: 60 }} />}
    </div>
  );
}

function ReportPageFooter({ page }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 32px 14px', borderTop: '1px solid var(--celuma-divider)', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 8.5, color: 'var(--celuma-fg-3)' }}>
      <span>Exploración de marca · celuma.mx</span>
      <span className="cel-mono">P. {page} / 02</span>
    </div>
  );
}

// Page 1 — patient strip, clinical information, gross and microscopic description.
function ClinicalReportPage() {
  return (
    <div className="cel-sheet" style={{ width: A4.w, height: A4.h, padding: 0, position: 'relative', overflow: 'hidden' }}>
      <ReportHeader />
      <ReportExampleBand />
      {/* Patient strip */}
      <div style={{ marginTop: 12, padding: '12px 32px', background: 'var(--celuma-bg)', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 12 }}>
        {[
          ['Paciente', 'Paciente Ejemplo, R.'],
          ['Edad / Sexo', '56 a · F'],
          ['Folio', 'EJ‑00482'],
          ['Recibido', '14 / 05 / 2026'],
        ].map(([k, v], i) => (
          <div key={i}>
            <div className="cel-eyebrow muted" style={{ fontSize: 8 }}>{k}</div>
            <div style={{ fontSize: 11, color: 'var(--celuma-ink)', fontWeight: 700, marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 32px 0' }}>
        <div className="cel-eyebrow">Información clínica</div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.6, marginTop: 6 }}>
          Texto de ejemplo. Paciente femenino con sangrado rectal intermitente de 6 semanas de evolución. Se realiza colonoscopia con toma de biopsia de lesión polipoide en sigmoides.
        </div>

        <div className="cel-eyebrow" style={{ marginTop: 16 }}>Descripción macroscópica</div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.6, marginTop: 6 }}>
          Se reciben tres fragmentos pardo‑rosados, de superficie lisa, de 0.4, 0.5 y 0.6 cm en eje mayor. Se incluyen en su totalidad en un cassette identificado como EJ‑00482‑B3.
        </div>

        <div className="cel-eyebrow" style={{ marginTop: 16 }}>Microscopía</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 14, marginTop: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.6 }}>
            Mucosa colónica con arquitectura glandular preservada en la periferia. En el centro de los fragmentos se identifica proliferación de glándulas con elongación, ramificación leve y estratificación nuclear. Hipercromasia y pseudoestratificación sin pérdida de polaridad.
          </div>
          <div style={{ position: 'relative', height: 110 }}>
            <CelImageSlot label="Imagen del caso" note="Solo si el laboratorio la adjunta" />
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 9.5, color: 'var(--celuma-fg-3)', fontStyle: 'italic' }}>Continúa en la página 2: diagnóstico, comentarios y firma.</div>
      </div>
      <ReportPageFooter page="01" />
    </div>
  );
}

// Page 2 — diagnosis, comments and signature block.
function ClinicalReportPage2() {
  return (
    <div className="cel-sheet" style={{ width: A4.w, height: A4.h, padding: 0, position: 'relative', overflow: 'hidden' }}>
      <ReportHeader compact />
      <ReportExampleBand />
      <div style={{ padding: '18px 32px 0' }}>
        <div className="cel-accent-block">
          <div className="cel-eyebrow" style={{ fontSize: 10 }}>Diagnóstico</div>
          <div className="t-display" style={{ fontSize: 18, marginTop: 6, lineHeight: 1.2 }}>Pólipo adenomatoso tubular con displasia de bajo grado.</div>
          <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-2)', marginTop: 6, lineHeight: 1.5 }}>Márgenes libres en los cortes evaluados. No se observan elementos de invasión.</div>
        </div>

        <div className="cel-eyebrow" style={{ marginTop: 20 }}>Comentarios</div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.6, marginTop: 6 }}>
          Texto de ejemplo. Se recomienda seguimiento endoscópico conforme a guías nacionales. El presente reporte considera los cortes representativos de la muestra recibida.
        </div>

        {/* Signature block (example only, no validity) */}
        <div style={{ marginTop: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: 34, borderBottom: '1px solid var(--celuma-ink)', display: 'flex', alignItems: 'flex-end', paddingBottom: 3, fontSize: 9, color: 'var(--celuma-fg-3)' }}>Espacio de firma</div>
            <div style={{ fontSize: 10, color: 'var(--celuma-ink)', fontWeight: 700, marginTop: 4 }}>Dra. Nombre Ejemplo</div>
            <div style={{ fontSize: 9, color: 'var(--celuma-fg-3)' }}>Patóloga · cédula de ejemplo</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="cel-pill ghost" style={{ fontSize: 9, color: 'var(--celuma-fg-2)' }}>
              <CelIcon name="file-text" size={11} color="currentColor" />EJEMPLO · SIN VALIDEZ CLÍNICA
            </div>
          </div>
        </div>

        <div style={{ marginTop: 26, padding: '10px 12px', borderRadius: 8, background: 'var(--celuma-bg)', fontSize: 9.5, color: 'var(--celuma-fg-2)', lineHeight: 1.5 }}>
          En el producto, cada informe usa el membrete del laboratorio cliente. Este ejemplo solo explora cómo podría verse la marca en papelería.
        </div>
      </div>
      <ReportPageFooter page="02" />
    </div>
  );
}

// Clinical report — cover variant for delivery PDF
function ClinicalReportCover() {
  return (
    <div className="cel-sheet cream" style={{ width: A4.w, height: A4.h, padding: 0, position: 'relative', overflow: 'hidden' }}>
      <CelBlob size={500} x={-140} y={-160} color="teal" />
      <CelBlob size={400} x={200} y={420} color="rose" opacity={0.6} />

      <div style={{ position: 'relative', padding: 36, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CelMark size="m" />
          <div className="cel-pill ghost" style={{ color: 'var(--celuma-fg-2)' }}>Ejemplo visual · datos ficticios</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="cel-eyebrow">Informe histopatológico</div>
          <div className="t-display" style={{ fontSize: 56, lineHeight: 0.94, marginTop: 12 }}>
            Paciente<br/><span style={{ color: 'var(--celuma-primary-ink)' }}>Ejemplo.</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--celuma-fg-2)', maxWidth: 320, lineHeight: 1.55 }}>
            Biopsia incisional de lesión polipoide en sigmoides. Procedimiento de colonoscopia diagnóstica del 14 de mayo 2026.
          </div>

          <div style={{ marginTop: 32, background: '#fff', borderRadius: 16, padding: 22, boxShadow: 'var(--celuma-shadow-soft)' }}>
            <div className="cel-eyebrow muted" style={{ fontSize: 9 }}>Diagnóstico</div>
            <div className="t-display" style={{ fontSize: 22, marginTop: 6 }}>Pólipo adenomatoso tubular con displasia de bajo grado.</div>
            <hr className="cel-rule" style={{ margin: '16px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div className="cel-eyebrow muted" style={{ fontSize: 8 }}>Folio</div>
                <div className="cel-mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--celuma-ink)', marginTop: 2 }}>EJ‑00482</div>
              </div>
              <div>
                <div className="cel-eyebrow muted" style={{ fontSize: 8 }}>Recibido</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--celuma-ink)', marginTop: 2 }}>14 / 05 / 26</div>
              </div>
              <div>
                <div className="cel-eyebrow muted" style={{ fontSize: 8 }}>Patólogo</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--celuma-ink)', marginTop: 2 }}>Dra. Ejemplo</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--celuma-border)' }}>
          <div className="cel-mono" style={{ fontSize: 10 }}>Exploración de marca</div>
          <div className="cel-pill ghost" style={{ color: 'var(--celuma-fg-2)', whiteSpace: 'nowrap' }}><CelIcon name="file-text" size={11} color="currentColor" />Sin validez clínica</div>
        </div>
      </div>
    </div>
  );
}

// ---------- INTERNAL FORM — recepción de muestras ----------
function InternalForm() {
  return (
    <div className="cel-sheet" style={{ width: A4.w, height: A4.h, padding: 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid var(--celuma-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CelMark size="s" />
          <div className="cel-mono" style={{ fontSize: 10, color: 'var(--celuma-fg-3)' }}>F‑LAB‑003 · Rev. 04</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 }}>
          <div>
            <div className="cel-eyebrow">Formato interno</div>
            <div className="t-display" style={{ fontSize: 22, marginTop: 4 }}>Recepción de muestras.</div>
          </div>
          <div className="cel-pill" style={{ background: 'var(--celuma-amber-bg)', color: 'var(--celuma-amber)' }}>USO INTERNO</div>
        </div>
      </div>

      <div style={{ padding: '20px 32px', display: 'grid', gap: 14 }}>
        {/* Section: Procedencia */}
        <FormSection title="Procedencia" n="01">
          <FormRow label="Sucursal" value="Insurgentes Sur" />
          <FormRow label="Médico tratante" value="Dra. María F. Cortés" />
          <FormRow label="Fecha / Hora" value="14 / 05 / 2026 · 09:42" mono />
        </FormSection>

        {/* Section: Paciente */}
        <FormSection title="Paciente" n="02">
          <FormRow label="Nombre completo" value="R. Martínez Rodríguez" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormRow label="Edad" value="56 años" />
            <FormRow label="Sexo" value="F" mono />
          </div>
        </FormSection>

        {/* Checkboxes */}
        <FormSection title="Tipo de procedimiento" n="03">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['Biopsia incisional', true], ['Biopsia escisional', false], ['Citología', false], ['Pieza quirúrgica', false], ['Aspirado', false], ['Otro', false]].map(([l, c], i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--celuma-ink)' }}>
                <span style={{
                  width: 14, height: 14, borderRadius: 4,
                  border: `2px solid ${c ? 'var(--celuma-primary)' : 'var(--celuma-border)'}`,
                  background: c ? 'var(--celuma-primary)' : '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{c && <CelIcon name="check" size={9} color="var(--celuma-on-primary)" stroke={3} />}</span>
                {l}
              </label>
            ))}
          </div>
        </FormSection>

        {/* Multi-line */}
        <FormSection title="Notas clínicas" n="04">
          <div style={{ border: '2px solid var(--celuma-primary)', borderRadius: 12, padding: 12, fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.55, minHeight: 60 }}>
            Sangrado rectal intermitente de 6 semanas. Lesión polipoide en sigmoides identificada en colonoscopia.
          </div>
        </FormSection>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 32px', borderTop: '1px solid var(--celuma-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: 'var(--celuma-fg-3)' }}>
        <span>celuma.mx · Formato controlado por Calidad</span>
        <span className="cel-mono">P. 01 / 01</span>
      </div>
    </div>
  );
}

function FormSection({ title, n, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div className="cel-mono" style={{ fontSize: 10, color: 'var(--celuma-primary-ink)', fontWeight: 700, letterSpacing: '0.06em' }}>{n}</div>
        <div className="cel-eyebrow">{title}</div>
        <div style={{ flex: 1, height: 1, background: 'var(--celuma-border)' }} />
      </div>
      <div style={{ display: 'grid', gap: 10 }}>{children}</div>
    </div>
  );
}

function FormRow({ label, value, mono = false }) {
  return (
    <div>
      <div style={{ fontSize: 8.5, color: 'var(--celuma-fg-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ borderBottom: '1px solid var(--celuma-ink)', paddingBottom: 4, marginTop: 4, fontSize: 11, color: 'var(--celuma-ink)', fontFamily: mono ? 'var(--celuma-font-mono)' : 'var(--celuma-font-body)', fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );
}

// ---------- TEMPLATE: HEADER + FOOTER STRIPS (for reuse) ----------
function HeaderStripVariants() {
  return (
    <div style={{ width: 580, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Variant 1 — Classic line */}
      <div className="cel-sheet" style={{ padding: '14px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CelMark size="s" />
          <div style={{ display: 'flex', gap: 14, fontSize: 10, color: 'var(--celuma-fg-3)' }}>
            <span><CelIcon name="globe" size={11} color="var(--celuma-primary)" /> celuma.mx</span>
            <span><CelIcon name="mail" size={11} color="var(--celuma-primary)" /> contacto@celuma.mx</span>
          </div>
        </div>
        <hr className="cel-rule teal" style={{ marginTop: 10, height: 2, width: 40 }} />
      </div>

      {/* Variant 2 — Bold band */}
      <div className="cel-sheet" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--celuma-ink)', color: '#fff', padding: '12px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <CelBlob size={260} x={-60} y={-80} color="teal" />
          <CelMark size="s" onDark />
          <div className="cel-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>CL‑INF‑00482 · 14.05.26</div>
        </div>
      </div>

      {/* Variant 3 — Magazine eyebrow */}
      <div className="cel-sheet cream" style={{ padding: '14px 22px' }}>
        <div className="cel-eyebrow" style={{ fontSize: 9 }}>Céluma · Documento oficial · Vol. 04 / 26</div>
        <hr className="cel-rule" style={{ background: 'var(--celuma-ink)', height: 2, marginTop: 8 }} />
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="t-display" style={{ fontSize: 22 }}>Informe operativo.</div>
          <CelIso size={22} />
        </div>
      </div>

      {/* Footer variants */}
      <div className="cel-sheet" style={{ padding: '14px 22px', borderTop: '1px solid var(--celuma-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: 'var(--celuma-fg-3)' }}>
          <span>© 2026 Céluma · Razón social por confirmar</span>
          <span className="cel-mono">P. 01 / 04</span>
        </div>
      </div>

      <div className="cel-sheet" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--celuma-bg)', padding: '14px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CelIso size={18} />
            <span style={{ fontSize: 10, color: 'var(--celuma-fg-2)' }}><strong>Céluma</strong> ilumina y digitaliza tu laboratorio.</span>
          </div>
          <div className="cel-pill" style={{ fontSize: 9 }}>celuma.mx</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ClinicalReportPage2,
  ClinicalReportPage, ClinicalReportCover, InternalForm, HeaderStripVariants,
});
