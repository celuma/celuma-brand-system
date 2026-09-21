// Céluma — Editorial / Clinical documents
// Clinical reports, internal forms, document templates (headers/footers), PDF templates

const A4 = { w: 460, h: 651 };

// ---------- CLINICAL REPORT ----------
// Inner page — formal histopathology report
function ClinicalReportPage() {
  return (
    <div className="cel-sheet" style={{ width: A4.w, height: A4.h, padding: 0, position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '28px 32px 18px', background: '#fff', borderBottom: '1px solid var(--celuma-border)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <CelMark size="m" />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="cel-eyebrow" style={{ fontSize: 9 }}>Informe histopatológico</div>
            <div className="cel-mono" style={{ fontSize: 11, marginTop: 4 }}>CL‑INF‑00482 · v.1</div>
            <div className="t-meta" style={{ marginTop: 2 }}>Emisión: 16 / 05 / 2026</div>
          </div>
        </div>
        <hr className="cel-rule teal" style={{ marginTop: 16, height: 2, width: 60 }} />
      </div>

      {/* Patient strip */}
      <div style={{ padding: '14px 32px', background: 'var(--celuma-bg)', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 12 }}>
        {[
          ['Paciente', 'Rodríguez Martínez, R.', 'name'],
          ['Edad / Sexo', '56 a · F'],
          ['Folio', 'CL‑00482'],
          ['Recibido', '14 / 05 / 2026'],
        ].map(([k, v], i) => (
          <div key={i}>
            <div className="cel-eyebrow muted" style={{ fontSize: 8 }}>{k}</div>
            <div style={{ fontSize: 11, color: 'var(--celuma-ink)', fontWeight: 700, marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 32px' }}>
        {/* Clinical info */}
        <div className="cel-eyebrow">Información clínica</div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.65, marginTop: 6 }}>
          Paciente femenino con sangrado rectal intermitente de 6 semanas de evolución. Se realiza colonoscopia con toma de biopsia de lesión polipoide en sigmoides.
        </div>

        {/* Macroscopic */}
        <div className="cel-eyebrow" style={{ marginTop: 18 }}>Descripción macroscópica</div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.65, marginTop: 6 }}>
          Se reciben tres fragmentos pardo‑rosados, de superficie lisa, de 0.4, 0.5 y 0.6 cm en eje mayor. Se incluyen en su totalidad en un cassette identificado como CL‑00482‑B3.
        </div>

        {/* Microscopy + image */}
        <div className="cel-eyebrow" style={{ marginTop: 18 }}>Microscopía</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 14, marginTop: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.65 }}>
            Mucosa colónica con arquitectura glandular preservada en la periferia. En el centro de los fragmentos se identifica proliferación de glándulas con elongación, ramificación leve y estratificación nuclear. Hipercromasia y pseudoestratificación sin pérdida de polaridad.
          </div>
          <div style={{ position: 'relative', height: 110, background: 'var(--celuma-primary-soft)', borderRadius: 12, overflow: 'hidden' }}>
            <CelCellField width={130} height={110} density={18} seed={2} opacity={0.75} palette={['#c8ecdc','#0f8b8d','#e58a8a','#e6f7f7','#49b6ad']} />
            <div style={{ position: 'absolute', bottom: 6, right: 6, background: '#fff', padding: '2px 6px', borderRadius: 6, fontSize: 8, color: 'var(--celuma-fg-3)' }} className="cel-mono">40× · H&E</div>
          </div>
        </div>

        {/* Diagnosis block */}
        <div className="cel-accent-block" style={{ marginTop: 18 }}>
          <div className="cel-eyebrow" style={{ fontSize: 10 }}>Diagnóstico</div>
          <div className="t-display" style={{ fontSize: 18, marginTop: 6 }}>Pólipo adenomatoso tubular con displasia de bajo grado.</div>
          <div style={{ fontSize: 10, color: 'var(--celuma-fg-2)', marginTop: 6 }}>Márgenes libres en los cortes evaluados. No se observan elementos de invasión.</div>
        </div>

        {/* Comments */}
        <div className="cel-eyebrow" style={{ marginTop: 18 }}>Comentarios</div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.65, marginTop: 6 }}>
          Se recomienda seguimiento endoscópico conforme a guías nacionales. El presente reporte considera los cortes representativos de la muestra recibida.
        </div>
      </div>

      {/* Signature footer */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 32px', borderTop: '1px solid var(--celuma-border)', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: 28, borderBottom: '1px solid var(--celuma-ink)', display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
              <div style={{ fontFamily: '"Brush Script MT", "Snell Roundhand", cursive', fontSize: 18, color: 'var(--celuma-ink)', fontStyle: 'italic' }}>L. Méndez</div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--celuma-ink)', fontWeight: 700, marginTop: 4 }}>Dra. Lucía Méndez Robles</div>
            <div style={{ fontSize: 9, color: 'var(--celuma-fg-3)' }}>Patóloga senior · Céd. Esp. 9483721</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="cel-pill green" style={{ fontSize: 9 }}>
              <CelIcon name="shield-check" size={11} color="currentColor" />FIRMADO ELECTRÓNICAMENTE
            </div>
            <div className="cel-mono" style={{ fontSize: 8, marginTop: 6 }}>SHA: a4f8e9···7c2b</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--celuma-divider)', fontSize: 8.5, color: 'var(--celuma-fg-3)' }}>
          <span>celuma.mx · contacto@celuma.mx · +52 55 4129 0488</span>
          <span className="cel-mono">P. 01 / 02</span>
        </div>
      </div>
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
          <div className="cel-pill">Confidencial · 2026</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="cel-eyebrow">Informe histopatológico</div>
          <div className="t-display" style={{ fontSize: 56, lineHeight: 0.94, marginTop: 12 }}>
            R. Martínez<br/><span style={{ color: 'var(--celuma-primary)' }}>56 a · F.</span>
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
                <div className="cel-mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--celuma-ink)', marginTop: 2 }}>CL‑00482</div>
              </div>
              <div>
                <div className="cel-eyebrow muted" style={{ fontSize: 8 }}>Recibido</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--celuma-ink)', marginTop: 2 }}>14 / 05 / 26</div>
              </div>
              <div>
                <div className="cel-eyebrow muted" style={{ fontSize: 8 }}>Patólogo</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--celuma-ink)', marginTop: 2 }}>Dra. Méndez</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--celuma-border)' }}>
          <div className="cel-mono" style={{ fontSize: 10 }}>CL‑INF‑00482 · v.1 · 16 MAY 2026</div>
          <div className="cel-pill green"><CelIcon name="shield-check" size={11} color="currentColor" />Firmado</div>
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
                }}>{c && <CelIcon name="check" size={9} color="#fff" stroke={3} />}</span>
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
        <div className="cel-mono" style={{ fontSize: 10, color: 'var(--celuma-primary)', fontWeight: 700, letterSpacing: '0.06em' }}>{n}</div>
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
          <span>© 2026 Céluma · Patología Digital S.A. de C.V.</span>
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

Object.assign(window, {
  ClinicalReportPage, ClinicalReportCover, InternalForm, HeaderStripVariants,
});
