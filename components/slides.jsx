// Céluma — Presentation / slide templates
// 16:9 slides for executive decks

const SLIDE = { w: 720, h: 405 }; // 16:9 scaled

// Title slide
function SlideTitle() {
  return (
    <div className="cel-sheet" style={{ width: SLIDE.w, height: SLIDE.h, padding: 0, position: 'relative', overflow: 'hidden', background: 'var(--celuma-ink)', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={SLIDE.w} height={SLIDE.h} density={22} seed={3} opacity={0.32} /></div>
      <CelBlob size={560} x={-160} y={-160} color="teal" />
      <CelBlob size={460} x={420} y={140} color="mint" />

      <div style={{ position: 'relative', padding: 50, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CelMark size="m" onDark />

        <div>
          <div className="cel-pill on-dark" style={{ fontSize: 11 }}>Q2 · 2026</div>
          <div className="t-display" style={{ fontSize: 56, color: '#fff', marginTop: 16, lineHeight: 0.96 }}>
            Operación Céluma:<br/><span style={{ color: '#7dd8d9' }}>resultados del trimestre.</span>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 16, maxWidth: 480, lineHeight: 1.55 }}>
            Avance del despliegue, KPIs operativos del laboratorio y hoja de ruta para el siguiente ciclo.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="cel-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>Reporte ejecutivo · MAY 2026</div>
          <div className="cel-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>01 / 12</div>
        </div>
      </div>
    </div>
  );
}

// Stat slide
function SlideStats() {
  return (
    <div className="cel-sheet cream" style={{ width: SLIDE.w, height: SLIDE.h, padding: 0, position: 'relative', overflow: 'hidden' }}>
      <CelBlob size={400} x={-120} y={-120} color="teal" />

      <div style={{ position: 'relative', padding: 50, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="cel-eyebrow">Operación · Q2</div>
            <div className="t-display" style={{ fontSize: 36, marginTop: 8, lineHeight: 1 }}>El trimestre, en cifras.</div>
          </div>
          <CelMark size="s" />
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 30 }}>
          {[
            ['Muestras', '4,128', 'Datos ilustrativos', 'beaker'],
            ['Casos firmados', '3,994', 'Datos ilustrativos', 'shield-check'],
            ['Tiempo medio', '34 h', 'Datos ilustrativos', 'calendar'],
            ['Sucursales activas', '06', 'Datos ilustrativos', 'map-pin'],
          ].map(([l, n, s, ic], i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: 'var(--celuma-shadow-soft)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="cel-eyebrow muted" style={{ fontSize: 9 }}>{l}</div>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--celuma-primary-soft)', color: 'var(--celuma-primary-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CelIcon name={ic} size={14} color="currentColor" />
                </div>
              </div>
              <div>
                <div className="t-display" style={{ fontSize: 34, marginTop: 14, color: i === 0 ? 'var(--celuma-primary)' : 'var(--celuma-ink)' }}>{n}</div>
                <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-3)', marginTop: 2 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--celuma-fg-3)' }}>
          <span className="cel-mono">Fuente · plataforma Céluma · 30 Jun 2026</span>
          <span className="cel-mono">04 / 12</span>
        </div>
      </div>
    </div>
  );
}

// Section divider slide — navy with subtle blobs (deck style)
function SlideDivider() {
  return (
    <div className="cel-sheet" style={{ width: SLIDE.w, height: SLIDE.h, padding: 0, position: 'relative', overflow: 'hidden', background: 'var(--celuma-ink-3)', color: '#fff' }}>
      <CelBlob size={520} x={-180} y={-180} color="mint" />
      <CelBlob size={420} x={460} y={200} color="teal" opacity={0.7} />

      <div style={{ position: 'relative', padding: 50, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="cel-eyebrow on-dark">Capítulo 02</div>
          <div className="t-display" style={{ fontSize: 64, color: '#fff', marginTop: 16, lineHeight: 0.94, maxWidth: 420 }}>
            Calidad clínica y <span style={{ color: '#7dd8d9' }}>trazabilidad</span>.
          </div>
          <div style={{ marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,0.7)', maxWidth: 360, lineHeight: 1.55 }}>
            Cómo se mide, cómo se reporta y qué decisiones operativas estamos tomando con esos datos.
          </div>
        </div>
        <CelIso size={130} opacity={0.9} />
      </div>

      <div style={{ position: 'absolute', left: 50, right: 50, bottom: 24, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
        <span className="cel-mono">Céluma · Reporte Q2 2026</span>
        <span className="cel-mono">05 / 12</span>
      </div>
    </div>
  );
}

// Content slide — text + image
function SlideContent() {
  return (
    <div className="cel-sheet" style={{ width: SLIDE.w, height: SLIDE.h, padding: 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', padding: '32px 50px 52px', height: '100%', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="cel-eyebrow">Flujo del laboratorio</div>
          <div className="t-display" style={{ fontSize: 32, marginTop: 10, lineHeight: 1.02 }}>
            Cada etapa,<br/>con responsable visible.
          </div>
          <hr className="cel-rule teal" style={{ width: 40, marginTop: 14, marginBottom: 14, height: 2 }} />
          <div style={{ fontSize: 13, color: 'var(--celuma-fg-2)', lineHeight: 1.7 }}>
            Texto de ejemplo: describe una capacidad publicada y verificada en la aplicación. Evita cifras, promesas de tiempo o afirmaciones normativas.
          </div>
          <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
            {[
              ['Recepción de muestras', 'Estados visibles para todo el equipo'],
              ['Revisión de informes', 'Revisores asignados y trazables'],
              ['Conversación por caso', 'Menciones y notificaciones'],
            ].map(([t, sub], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--celuma-primary-soft)', color: 'var(--celuma-primary-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CelIcon name="check" size={11} color="currentColor" stroke={3} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--celuma-ink)' }}>{t}</div>
                  <div style={{ fontSize: 11, color: 'var(--celuma-fg-3)', marginTop: 1 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', background: 'var(--celuma-bg)', borderRadius: 18, padding: 0, overflow: 'hidden', boxShadow: 'var(--celuma-shadow-soft)' }}>
          <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={310} height={300} density={16} seed={12} opacity={0.55} palette={['#c8ecdc','#49b6ad','#e58a8a','#e6f7f7','#49b6ad']} /></div>
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 9, color: 'var(--celuma-fg-2)' }}>Ilustración decorativa</div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 50, right: 50, bottom: 16, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--celuma-fg-3)' }}>
        <CelMark size="s" />
        <span className="cel-mono">07 / 12</span>
      </div>
    </div>
  );
}

// Quote slide
function SlideQuote() {
  return (
    <div className="cel-sheet cream" style={{ width: SLIDE.w, height: SLIDE.h, padding: 0, position: 'relative', overflow: 'hidden' }}>
      <CelBlob size={500} x={-150} y={-150} color="teal" />
      <CelBlob size={400} x={500} y={300} color="rose" opacity={0.5} />

      <div style={{ position: 'relative', padding: '50px 60px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 110, color: 'var(--celuma-primary-ink)', lineHeight: 0.5, letterSpacing: '-0.04em', position: 'relative', top: 6 }}>
          “
        </div>
        <div className="t-display" style={{ fontSize: 32, lineHeight: 1.15, marginTop: -10, maxWidth: 600 }}>
          La claridad de cada etapa ayuda al equipo del laboratorio a coordinar su trabajo.
        </div>
        <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--celuma-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CelIcon name="user" size={26} color="var(--celuma-primary)" stroke={1.5} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--celuma-ink)' }}>Dr. Eduardo Sánchez</div>
            <div style={{ fontSize: 11, color: 'var(--celuma-fg-3)' }}>Jefe de patología · Laboratorio Ejemplo</div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 20, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--celuma-fg-3)' }}>
        <CelMark size="s" />
        <span className="cel-mono">08 / 12</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  SlideTitle, SlideStats, SlideDivider, SlideContent, SlideQuote,
});
