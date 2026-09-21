// Céluma — Stationery
// Letterheads, business cards, envelopes, folders, document covers

// ---------- LETTERHEAD ----------
// A4 ratio: 1 : 1.414. We render at 460×651.
const A4 = { w: 460, h: 651 };

// Letterhead A — Classic: small logo top-left, contact strip footer, dotted accent
function LetterheadClassic() {
  return (
    <div className="cel-sheet" style={{ width: A4.w, height: A4.h, padding: 36 }}>
      <CelBlob size={340} x={-80} y={-140} color="teal" />
      {/* Header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CelMark size="m" />
        <div style={{ textAlign: 'right' }}>
          <div className="cel-eyebrow">FOLIO</div>
          <div style={{ fontFamily: 'var(--celuma-font-mono)', fontSize: 12, color: 'var(--celuma-fg-2)', marginTop: 4 }}>CL-2026-00482</div>
        </div>
      </div>
      <hr className="cel-rule teal" style={{ marginTop: 24, marginBottom: 28 }} />

      {/* Body */}
      <div style={{ position: 'relative' }}>
        <div className="t-meta" style={{ marginBottom: 24 }}>Ciudad de México, 14 de mayo de 2026</div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.7, marginBottom: 20 }}>
          <strong style={{ color: 'var(--celuma-ink)' }}>Dra. María Fernanda Cortés</strong><br/>
          Servicio de Anatomía Patológica<br/>
          Hospital General Manuel Gea González
        </div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.7 }}>
          Estimada Dra. Cortés:<br/><br/>
          Adjunto el resumen ejecutivo del informe de auditoría correspondiente al periodo Q1‑2026 de las muestras procesadas en su unidad. El detalle completo, incluyendo trazabilidad por caso y tiempos de respuesta, queda disponible en el portal de Céluma para descarga inmediata.<br/><br/>
          Quedamos atentos para cualquier observación.
        </div>
        {/* placeholder body lines */}
        <div style={{ display: 'grid', gap: 8, marginTop: 24, opacity: 0.6 }}>
          {[100, 92, 96, 88, 70].map((w, i) => (
            <div key={i} style={{ height: 6, background: 'var(--celuma-divider)', width: `${w}%`, borderRadius: 4 }} />
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 36px 22px', borderTop: '1px solid var(--celuma-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 9.5, color: 'var(--celuma-fg-3)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><CelIcon name="globe" size={12} color="var(--celuma-primary)" />celuma.mx</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><CelIcon name="mail" size={12} color="var(--celuma-primary)" />contacto@celuma.mx</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><CelIcon name="map-pin" size={12} color="var(--celuma-primary)" />Ciudad de México</span>
          </div>
          <div className="cel-mono" style={{ fontSize: 9 }}>P. 01 / 01</div>
        </div>
      </div>
    </div>
  );
}

// Letterhead B — Side band: vertical teal column at left
function LetterheadSideBand() {
  return (
    <div className="cel-sheet cream" style={{ width: A4.w, height: A4.h, display: 'flex' }}>
      {/* Vertical band */}
      <div style={{
        width: 84, background: 'var(--celuma-ink)', color: '#fff',
        padding: '28px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
      }}>
        <CelBlob size={240} x={-80} y={-40} color="mint" />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <CelIso size={42} />
          <div style={{
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em',
          }}>Céluma</div>
        </div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
            Patología Digital
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, padding: '38px 32px 28px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="cel-eyebrow">Documento interno</div>
            <div className="t-display" style={{ fontSize: 22, marginTop: 6 }}>Informe operativo</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div className="cel-mono">CL‑INF‑2026‑038</div>
            <div className="t-meta" style={{ marginTop: 4 }}>14 / 05 / 2026</div>
          </div>
        </div>

        <div className="cel-accent-block" style={{ marginTop: 24, padding: '14px 16px' }}>
          <div className="cel-eyebrow">El origen del nombre</div>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', marginTop: 6, lineHeight: 1.6 }}>
            <em>Célu</em>la · <em>lumen</em> · luz. Cada documento que firmamos ilumina un proceso clínico.
          </div>
        </div>

        <div style={{ marginTop: 22, fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.75 }}>
          Resumen de actividad mensual del laboratorio. Las cifras reflejan los casos procesados, firmados y entregados a través de la plataforma Céluma durante el periodo indicado.
        </div>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[['Recibidos', '482'], ['Firmados', '467'], ['Entregados', '459']].map(([k, v], i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--celuma-fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</div>
              <div className="t-display" style={{ fontSize: 28, marginTop: 4, color: i === 0 ? 'var(--celuma-primary)' : 'var(--celuma-ink)' }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--celuma-border)', paddingTop: 12, fontSize: 9, color: 'var(--celuma-fg-3)' }}>
          <span>celuma.mx · contacto@celuma.mx</span>
          <span className="cel-mono">01/01</span>
        </div>
      </div>
    </div>
  );
}

// Letterhead C — Editorial: large eyebrow header on cream, cell-field footer
function LetterheadEditorial() {
  return (
    <div className="cel-sheet cream" style={{ width: A4.w, height: A4.h, padding: 36, display: 'flex', flexDirection: 'column' }}>
      {/* Header — magazine-style */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <div className="cel-eyebrow" style={{ fontSize: 9 }}>Céluma · Carta Oficial · Vol. 04 / 26</div>
        <div className="cel-mono" style={{ fontSize: 9 }}>FOLIO CL‑00482</div>
      </div>
      <hr className="cel-rule" style={{ background: 'var(--celuma-ink)', height: 2 }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
        <div className="t-display" style={{ fontSize: 38, lineHeight: 0.95 }}>
          Carta<br/><span style={{ color: 'var(--celuma-primary)' }}>oficial.</span>
        </div>
        <CelMark size="s" stacked sub="Patología" />
      </div>

      <hr className="cel-rule" style={{ marginTop: 18 }} />

      {/* Two col body */}
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 18, fontSize: 10, color: 'var(--celuma-fg-2)', lineHeight: 1.7 }}>
        <div>
          <div className="cel-eyebrow" style={{ fontSize: 9 }}>Destinatario</div>
          <div style={{ color: 'var(--celuma-ink)', fontWeight: 700, marginTop: 4 }}>Lic. Andrés Vega</div>
          <div>Coordinación Médica</div>
          <div>Hospital Ángeles del Pedregal</div>
          <hr className="cel-rule thin" style={{ margin: '12px 0' }} />
          <div className="cel-eyebrow" style={{ fontSize: 9 }}>Asunto</div>
          <div style={{ marginTop: 4 }}>Renovación de convenio anual 2026‑2027</div>
          <hr className="cel-rule thin" style={{ margin: '12px 0' }} />
          <div className="cel-eyebrow" style={{ fontSize: 9 }}>Fecha</div>
          <div style={{ marginTop: 4 }}>14 de mayo, 2026</div>
        </div>
        <div>
          <div style={{ marginBottom: 10 }}>Estimado Lic. Vega:</div>
          <p style={{ margin: 0, marginBottom: 10 }}>Por medio de la presente comunicamos los términos para la renovación del convenio de servicios de patología digital, vigentes para el periodo julio 2026 – junio 2027. Los servicios contemplan: digitalización de muestras, validación remota por subespecialidad, almacenamiento WORM y entrega electrónica firmada bajo NOM‑024.</p>
          <p style={{ margin: 0, marginBottom: 10, opacity: 0.5 }}>Los términos comerciales y SLA se detallan en el anexo I del presente documento. El detalle operativo, ventanas de soporte y matriz de escalamiento aparecen en el anexo II.</p>
          <p style={{ margin: 0, opacity: 0.3 }}>Quedamos atentos a comentarios para programar la firma en agenda compartida.</p>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative', height: 56, marginTop: 16, borderTop: '1px solid var(--celuma-border)' }}>
        
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 0 8px' }}>
          <div className="cel-mono" style={{ fontSize: 9 }}>celuma.mx</div>
          <div className="cel-mono" style={{ fontSize: 9 }}>P. 01</div>
        </div>
      </div>
    </div>
  );
}

// ---------- BUSINESS CARDS ----------
// CR80 standard: 85x55mm → ratio 1.545. Render at 340×220.
const BC = { w: 340, h: 215 };

function BizCardFrontA() {
  return (
    <div className="cel-sheet" style={{ width: BC.w, height: BC.h, padding: 22, position: 'relative' }}>
      <CelBlob size={220} x={-80} y={-90} color="teal" />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <CelMark size="m" />
        <div>
          <div className="t-display" style={{ fontSize: 17, lineHeight: 1.1 }}>Daniela Cano, MD</div>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-3)', marginTop: 3 }}>Patóloga · Subespecialidad GI</div>
          <hr className="cel-rule teal" style={{ width: 28, marginTop: 10, marginBottom: 10 }} />
          <div style={{ display: 'grid', gap: 4, fontSize: 10, color: 'var(--celuma-fg-2)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><CelIcon name="mail" size={11} color="var(--celuma-primary)" />d.cano@celuma.mx</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><CelIcon name="phone" size={11} color="var(--celuma-primary)" />+52 55 4129 0488</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BizCardBackA() {
  return (
    <div className="cel-sheet" style={{ width: BC.w, height: BC.h, background: 'var(--celuma-ink)', color: '#fff', padding: 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={BC.w} height={BC.h} density={10} seed={2} opacity={0.35} /></div>
      <CelBlob size={300} x={140} y={80} color="mint" />
      <div style={{ position: 'relative', height: '100%', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CelMark size="m" onDark />
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Sister system</div>
          <div className="t-display" style={{ fontSize: 22, color: '#fff', marginTop: 4, lineHeight: 1 }}>Ilumina y digitaliza<br/>tu laboratorio.</div>
        </div>
      </div>
    </div>
  );
}

function BizCardFrontB() {
  // Asymmetric vertical band
  return (
    <div className="cel-sheet" style={{ width: BC.w, height: BC.h, display: 'flex', overflow: 'hidden' }}>
      <div style={{ width: 92, background: 'var(--celuma-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 14px', position: 'relative' }}>
        <CelIso size={40} />
        <div style={{
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
        }}>celuma.mx</div>
      </div>
      <div style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className="t-display" style={{ fontSize: 22, lineHeight: 1 }}>Céluma</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--celuma-ink)' }}>Ing. Rafael Téllez</div>
          <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)', marginTop: 2 }}>Director de Implementación</div>
          <hr className="cel-rule" style={{ margin: '10px 0', width: 30, background: 'var(--celuma-primary)', height: 2 }} />
          <div style={{ fontSize: 9.5, color: 'var(--celuma-fg-2)', lineHeight: 1.6 }}>
            r.tellez@celuma.mx<br/>
            +52 55 2089 7124
          </div>
        </div>
      </div>
    </div>
  );
}

function BizCardBackB() {
  return (
    <div className="cel-sheet cream" style={{ width: BC.w, height: BC.h, padding: 22, position: 'relative', overflow: 'hidden' }}>
      <CelBlob size={260} x={-60} y={-60} color="teal" />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div className="cel-eyebrow">Valores</div>
        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          {[['✦', 'Claridad'], ['◎', 'Precisión'], ['🔒', 'Seguridad'], ['🤝', 'Confianza']].map(([g, l], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--celuma-ink)' }}>
              <span style={{ width: 24, height: 24, background: '#fff', borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: 'var(--celuma-font-display)', fontWeight: 800, color: 'var(--celuma-primary)' }}>{g}</span>
              <span style={{ fontWeight: 600 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BizCardFrontC() {
  // Mono, type-led
  return (
    <div className="cel-sheet cream" style={{ width: BC.w, height: BC.h, padding: 24, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="t-display" style={{ fontSize: 28, lineHeight: 1 }}>
          Céluma
        </div>
        <CelIso size={26} />
      </div>
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 22 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--celuma-ink)', fontFamily: 'var(--celuma-font-display)' }}>Patricia Reyes</div>
        <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)', marginTop: 2 }}>Coordinación de calidad · QA</div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="cel-mono" style={{ fontSize: 9, color: 'var(--celuma-fg-2)' }}>p.reyes@celuma.mx</div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--celuma-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CelIcon name="arrow-right" size={12} color="var(--celuma-primary)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BizCardBackC() {
  return (
    <div className="cel-sheet" style={{ width: BC.w, height: BC.h, background: '#fff', padding: 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <CelDots size={12} color="rgba(15,139,141,0.30)" style={{ width: '100%', height: '100%' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ background: '#fff', padding: '18px 24px', borderRadius: 14, boxShadow: 'var(--celuma-shadow-card)', textAlign: 'center' }}>
          <CelIso size={40} />
          <div className="t-display" style={{ fontSize: 18, marginTop: 6, color: 'var(--celuma-ink)' }}>celuma.mx</div>
          <div className="cel-mono" style={{ fontSize: 9, marginTop: 2 }}>SCAN · ESCANEAR</div>
        </div>
      </div>
    </div>
  );
}

// ---------- ENVELOPE — DL ratio (110×220mm ≈ 1:2). Render 460×220 ----------
function EnvelopeClassic() {
  return (
    <div className="cel-sheet" style={{ width: 460, height: 220, padding: 22, position: 'relative' }}>
      <CelBlob size={240} x={-80} y={-100} color="teal" />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <CelMark size="s" />
          <div style={{ marginTop: 14, fontSize: 8.5, color: 'var(--celuma-fg-3)', lineHeight: 1.5 }}>
            Av. Insurgentes Sur 1602, Piso 4<br/>
            Crédito Constructor, Benito Juárez<br/>
            03940 · Ciudad de México · MX
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 26, bottom: 26, width: 200 }}>
        <hr className="cel-rule teal" style={{ width: 24, marginBottom: 8 }} />
        <div style={{ fontSize: 8, color: 'var(--celuma-fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Destinatario</div>
        <div style={{ marginTop: 6, display: 'grid', gap: 5 }}>
          {[100, 78, 62, 84].map((w, i) => (
            <div key={i} style={{ height: 4, background: 'var(--celuma-divider)', width: `${w}%`, borderRadius: 2 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EnvelopeBold() {
  return (
    <div className="cel-sheet" style={{ width: 460, height: 220, background: 'var(--celuma-ink)', color: '#fff', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={460} height={220} density={14} seed={3} opacity={0.38} /></div>
      <CelBlob size={360} x={260} y={-60} color="mint" />
      <div style={{ position: 'relative', flex: 1, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CelMark size="m" onDark />
        <div>
          <div className="cel-eyebrow on-dark">Correspondencia oficial</div>
          <div className="t-display" style={{ fontSize: 22, marginTop: 4, color: '#fff' }}>Confidencial — Médico tratante</div>
        </div>
      </div>
      <div style={{ width: 120, background: 'rgba(255,255,255,0.04)', borderLeft: '1px solid rgba(255,255,255,0.10)', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="cel-mono" style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', textAlign: 'center', letterSpacing: '0.18em' }}>NO. ENVÍO</div>
        <div style={{ background: 'var(--celuma-primary)', color: '#fff', borderRadius: 100, padding: '4px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>CL‑00482</div>
        <div className="cel-mono" style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>14 / 05 / 2026</div>
      </div>
    </div>
  );
}

// ---------- INSTITUTIONAL FOLDER ----------
function FolderCover() {
  return (
    <div className="cel-sheet" style={{ width: 440, height: 580, background: 'var(--celuma-ink)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={440} height={580} density={24} seed={1} opacity={0.4} /></div>
      <CelBlob size={520} x={-160} y={300} color="mint" />
      <CelBlob size={360} x={250} y={-100} color="teal" />

      <div style={{ position: 'relative', padding: '36px 32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CelMark size="m" onDark />
          <div className="cel-pill on-dark">CONFIDENCIAL</div>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ marginBottom: 'auto', marginTop: 60 }}>
          <div className="cel-eyebrow on-dark" style={{ fontSize: 10 }}>Carpeta institucional · 2026</div>
          <div className="t-display" style={{ fontSize: 44, color: '#fff', marginTop: 10, lineHeight: 0.96 }}>
            Documentación<br/>del laboratorio.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 14, maxWidth: 280, lineHeight: 1.55 }}>
            Convenios, procedimientos, anexos clínicos y reportes consolidados del periodo.
          </div>
        </div>
        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div>
            <div className="cel-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>FOLIO</div>
            <div style={{ fontFamily: 'var(--celuma-font-mono)', fontSize: 14, color: '#fff', marginTop: 4 }}>CL‑CARP‑00482</div>
          </div>
          <CelIso size={64} />
        </div>
      </div>
    </div>
  );
}

function FolderCoverLight() {
  return (
    <div className="cel-sheet cream" style={{ width: 440, height: 580, position: 'relative', overflow: 'hidden' }}>
      <CelBlob size={480} x={-160} y={-160} color="teal" />
      <CelBlob size={400} x={200} y={380} color="rose" opacity={0.7} />

      <div style={{ position: 'relative', padding: '36px 32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CelMark size="m" />
          <div className="cel-pill">2026 · Q2</div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 260, height: 260, background: '#fff', borderRadius: 20, boxShadow: 'var(--celuma-shadow-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <CelIso size={140} />
            <div style={{ position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: 100, padding: '6px 16px', boxShadow: 'var(--celuma-shadow-float)' }}>
              <div className="cel-mono" style={{ fontSize: 10, color: 'var(--celuma-primary)' }}>celuma.mx</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <div className="cel-eyebrow">Carpeta clínica</div>
          <div className="t-display" style={{ fontSize: 36, marginTop: 6, lineHeight: 1 }}>Expediente<br/>institucional.</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--celuma-border)' }}>
            <div className="cel-mono" style={{ fontSize: 10 }}>CL‑CARP‑00482 · 14 MAY 2026</div>
            <CelIcon name="arrow-right" size={20} color="var(--celuma-primary)" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- DOCUMENT COVER (A4) ----------
function DocCoverBold() {
  return (
    <div className="cel-sheet" style={{ width: A4.w, height: A4.h, background: 'var(--celuma-ink)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={A4.w} height={A4.h} density={28} seed={5} opacity={0.42} /></div>
      <CelBlob size={620} x={-200} y={-200} color="teal" />
      <CelBlob size={520} x={280} y={400} color="mint" />

      <div style={{ position: 'relative', padding: 40, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CelMark size="m" onDark />
          <div className="cel-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>v. 2.4 — MAY 2026</div>
        </div>

        <div style={{ flex: 1 }} />
        <div>
          <div className="cel-pill on-dark" style={{ fontSize: 10 }}>WHITE PAPER · CL‑WP‑012</div>
          <div className="t-display" style={{ fontSize: 60, color: '#fff', lineHeight: 0.92, marginTop: 18, letterSpacing: '-0.03em' }}>
            Trazabilidad<br/>de la muestra,<br/>
            <span style={{ color: '#7dd8d9' }}>de extremo a extremo.</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 14, color: 'rgba(255,255,255,0.7)', maxWidth: 360, lineHeight: 1.55 }}>
            Cómo Céluma modela el ciclo de vida del caso —desde la recepción hasta la firma— sin pérdida de información y bajo cumplimiento NOM‑024.
          </div>
        </div>
        <div style={{ flex: 1 }} />

        <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.14)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="cel-eyebrow on-dark" style={{ fontSize: 9 }}>Autoría · Equipo Céluma</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>Dirección de Producto · Mayo 2026</div>
          </div>
          <CelIcon name="arrow-right" size={26} color="#7dd8d9" />
        </div>
      </div>
    </div>
  );
}

function DocCoverEditorial() {
  return (
    <div className="cel-sheet cream" style={{ width: A4.w, height: A4.h, position: 'relative', overflow: 'hidden' }}>
      <CelBlob size={400} x={-120} y={-100} color="teal" />

      <div style={{ position: 'relative', padding: 40, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="cel-eyebrow" style={{ fontSize: 10 }}>Manual operativo · 01 / 04</div>
          <CelIso size={30} />
        </div>
        <hr className="cel-rule teal" style={{ marginTop: 14, width: 80 }} />

        <div style={{ marginTop: 60 }}>
          <div className="t-display" style={{ fontSize: 56, lineHeight: 0.94 }}>
            Procesos<br/>de la unidad de<br/>
            <span style={{ color: 'var(--celuma-primary)' }}>patología.</span>
          </div>
          <div style={{ marginTop: 26, maxWidth: 320, fontSize: 13, color: 'var(--celuma-fg-2)', lineHeight: 1.65 }}>
            Guía de referencia para la operación diaria del laboratorio: recepción, procesamiento, microscopía, validación y entrega.
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="cel-mono" style={{ fontSize: 10 }}>
            <div style={{ color: 'var(--celuma-fg-3)' }}>VOLUMEN</div>
            <div style={{ color: 'var(--celuma-ink)', fontSize: 22, marginTop: 4 }}>04 / 26</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <CelMark size="s" />
            <div className="cel-mono" style={{ fontSize: 9, marginTop: 8 }}>celuma.mx · CL‑MAN‑026</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  LetterheadClassic, LetterheadSideBand, LetterheadEditorial,
  BizCardFrontA, BizCardBackA, BizCardFrontB, BizCardBackB, BizCardFrontC, BizCardBackC,
  EnvelopeClassic, EnvelopeBold,
  FolderCover, FolderCoverLight,
  DocCoverBold, DocCoverEditorial,
});
