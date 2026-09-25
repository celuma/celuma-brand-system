// Céluma — Patterns, hero visuals, abstract biomedical illustrations, web composition modules

// ---------- PATTERNS (reusable wallpapers) ----------
function PatternTile({ children, label, sub }) {
  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="cel-sheet" style={{ width: 280, height: 200, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 14 }}>
        {children}
      </div>
      <div style={{ paddingLeft: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--celuma-ink)' }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)', marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

// 01 — Cream paper (default surface)
function PatternCream() {
  return (
    <PatternTile label="01 · Papel cream" sub="Superficie por defecto · cualquier documento">
      <div style={{ position: 'absolute', inset: 0, background: 'var(--celuma-bg)' }} />
      <CelBlob size={300} x={-60} y={-60} color="teal" />
    </PatternTile>
  );
}

// 02 — Navy depth
function PatternNavy() {
  return (
    <PatternTile label="02 · Navy" sub="Hero · CTA · cierre · presentaciones">
      <div style={{ position: 'absolute', inset: 0, background: 'var(--celuma-ink-3)' }} />
      <CelBlob size={280} x={-60} y={-60} color="mint" />
      <CelBlob size={220} x={150} y={80} color="teal" opacity={0.7} />
    </PatternTile>
  );
}

// 03 — Paper grain (dot micropattern)
function PatternDots() {
  return (
    <PatternTile label="03 · Grano de papel" sub="Microtramado · fondos institucionales">
      <div style={{ position: 'absolute', inset: 0, background: 'var(--celuma-surface)' }} />
      <CelDots size={14} color="rgba(73,182,173,0.18)" style={{ position: 'absolute', inset: 0 }} />
    </PatternTile>
  );
}

// 04 — Hatched watermark
function PatternHatch() {
  return (
    <PatternTile label="04 · Trama diagonal" sub="Marcas de agua · forros · interior de sobres">
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <div className="cel-pat-hatch" style={{ position: 'absolute', inset: 0 }} />
    </PatternTile>
  );
}

// 05 — Technical grid
function PatternGrid() {
  return (
    <PatternTile label="05 · Cuadrícula técnica" sub="Diagramas · planos · esquemas operativos">
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <CelGrid size={20} color="rgba(13,27,42,0.08)" style={{ position: 'absolute', inset: 0 }} />
    </PatternTile>
  );
}

// 06 — Isotipo lining
function PatternIso() {
  return (
    <PatternTile label="06 · Forro isotipo" sub="Interior de carpetas · lanyards · empaques">
      <div style={{ position: 'absolute', inset: 0, background: 'var(--celuma-primary-soft)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: 8, alignItems: 'center', justifyItems: 'center', opacity: 0.55 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <CelIso key={i} size={22} />
        ))}
      </div>
    </PatternTile>
  );
}

// ---------- ABSTRACT BIOMEDICAL ILLUSTRATIONS ----------

// Illustration 1 — Cell composition (sober — no rays)
function IllustCellGroup() {
  return (
    <div className="cel-sheet" style={{ width: 420, height: 320, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 18 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--celuma-bg)' }} />
      <CelBlob size={420} x={-100} y={-60} color="teal" />
      <svg viewBox="0 0 420 320" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Big cell */}
        <circle cx="200" cy="170" r="86" fill="#c8ecdc" />
        <circle cx="200" cy="170" r="86" fill="none" stroke="#2fa7a5" strokeWidth="3" />
        <circle cx="220" cy="160" r="32" fill="#e58a8a" opacity="0.9" />
        <circle cx="228" cy="156" r="9" fill="#9b3535" />
        {/* small companion cells */}
        <circle cx="74" cy="110" r="32" fill="none" stroke="#49b6ad" strokeWidth="2" opacity="0.7" />
        <circle cx="74" cy="110" r="14" fill="#e6f7f7" />
        <circle cx="340" cy="240" r="40" fill="none" stroke="#49b6ad" strokeWidth="2" opacity="0.5" />
        <circle cx="340" cy="240" r="18" fill="#c8ecdc" />
        <circle cx="346" cy="236" r="6" fill="#e58a8a" />
        <circle cx="90" cy="250" r="22" fill="none" stroke="#49b6ad" strokeWidth="2" opacity="0.6" />
      </svg>
      <div style={{ position: 'absolute', left: 24, bottom: 18 }}>
        <div className="cel-eyebrow">Illustration · 01</div>
        <div className="t-display" style={{ fontSize: 18, marginTop: 4 }}>Microcosmos</div>
      </div>
    </div>
  );
}

// Illustration 2 — Network nodes (digital pathology)
function IllustNetwork() {
  return (
    <div className="cel-sheet" style={{ width: 420, height: 320, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 18 }}>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <CelBlob size={300} x={250} y={150} color="teal" opacity={0.7} />
      <svg viewBox="0 0 420 320" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Connections */}
        <g stroke="rgba(73,182,173,0.30)" strokeWidth="1.4" fill="none">
          <path d="M 80 90 L 200 60 L 320 110" />
          <path d="M 80 90 L 140 200" />
          <path d="M 200 60 L 220 180" />
          <path d="M 320 110 L 280 230" />
          <path d="M 140 200 L 220 180 L 280 230" />
          <path d="M 140 200 L 280 230" />
          <path d="M 90 260 L 140 200" />
          <path d="M 90 260 L 220 180" />
        </g>
        {/* Nodes */}
        {[
          [80, 90, 14, '#49b6ad'], [200, 60, 18, '#49b6ad'], [320, 110, 14, '#49b6ad'],
          [140, 200, 22, '#49b6ad'], [220, 180, 28, '#49b6ad'], [280, 230, 16, '#49b6ad'],
          [90, 260, 12, '#49b6ad'],
        ].map(([x, y, r, c], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="#fff" />
            <circle cx={x} cy={y} r={r} fill="none" stroke={c} strokeWidth="2" />
            <circle cx={x} cy={y} r={r * 0.45} fill={c} opacity="0.4" />
          </g>
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 24, bottom: 18 }}>
        <div className="cel-eyebrow">Illustration · 02</div>
        <div className="t-display" style={{ fontSize: 18, marginTop: 4 }}>Trazabilidad</div>
      </div>
    </div>
  );
}

// Illustration 3 — Brand atmosphere (sober — isotipo + atmosphere, no rays)
function IllustLumen() {
  return (
    <div className="cel-sheet" style={{ width: 420, height: 320, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 18, background: 'var(--celuma-ink-3)', color: '#fff' }}>
      <CelBlob size={420} x={-100} y={-100} color="mint" />
      <CelBlob size={340} x={220} y={140} color="teal" opacity={0.85} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CelIso size={170} opacity={0.95} />
      </div>
      <div style={{ position: 'absolute', left: 24, bottom: 18, color: '#fff' }}>
        <div className="cel-eyebrow on-dark">Illustration · 03</div>
        <div className="t-display" style={{ fontSize: 18, marginTop: 4, color: '#fff' }}>Lumen</div>
      </div>
    </div>
  );
}

// ---------- HERO COMPOSITION ----------
function HeroComposition() {
  return (
    <div className="cel-sheet cream" style={{ width: 920, height: 460, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 18 }}>
      <CelBlob size={560} x={-160} y={-160} color="teal" />
      <CelBlob size={460} x={620} y={260} color="rose" opacity={0.6} />

      <div style={{ position: 'relative', padding: 50, height: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div className="cel-eyebrow">Ilumina y digitaliza</div>
          <div className="t-display" style={{ fontSize: 56, lineHeight: 0.96, marginTop: 14 }}>
            La patología<br/>en tiempo real,<br/>
            <span style={{ color: 'var(--celuma-primary-ink)' }}>de extremo a extremo.</span>
          </div>
          <div style={{ marginTop: 18, fontSize: 14, color: 'var(--celuma-fg-3)', lineHeight: 1.65, maxWidth: 380 }}>
            Céluma simplifica cada proceso: desde el registro del caso hasta la firma del informe, sin perder una sola muestra entre estaciones.
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button style={{ background: 'var(--celuma-primary)', color: 'var(--celuma-on-primary)', border: 0, padding: '14px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: 'var(--celuma-shadow-cta-sm)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Empezar hoy <CelIcon name="arrow-right" size={14} color="var(--celuma-on-primary)" />
            </button>
            <button style={{ background: 'transparent', color: 'var(--celuma-primary-ink)', border: '2px solid var(--celuma-primary)', padding: '12px 22px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Ver funcionalidades
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', height: '100%' }}>
          {/* Big card */}
          <div style={{ position: 'absolute', right: 20, top: 30, width: 280, background: '#fff', borderRadius: 20, padding: 22, boxShadow: 'var(--celuma-shadow-hero)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <CelStatus tone="green" label="FIRMADO" />
              <div className="cel-mono" style={{ fontSize: 9, color: 'var(--celuma-fg-3)' }}>CL‑00482</div>
            </div>
            <div className="t-display" style={{ fontSize: 16, marginTop: 12 }}>R. Martínez · 56 a · F</div>
            <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)', marginTop: 2 }}>Biopsia GI · Sigmoides</div>
            <div style={{ marginTop: 12, height: 90, background: 'var(--celuma-primary-soft)', borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
              <CelCellField width={280} height={90} density={14} seed={5} opacity={0.72} palette={['#c8ecdc','#49b6ad','#e58a8a','#e6f7f7','#49b6ad']} />
              <div style={{ position: 'absolute', bottom: 6, left: 8, background: 'rgba(13,27,42,0.72)', color: '#fff', padding: '2px 6px', borderRadius: 5, fontSize: 8, fontFamily: 'var(--celuma-font-mono)' }}>40× · H&E</div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--celuma-fg-3)' }}>
              <span>Recibido · 14.05</span>
              <span>Firmado · 16.05</span>
            </div>
          </div>
          {/* Floating chip */}
          <div style={{ position: 'absolute', right: 200, top: -10, background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: 'var(--celuma-shadow-float)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--celuma-green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CelIcon name="shield-check" size={16} color="var(--celuma-green)" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)' }}>Trazabilidad</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--celuma-ink)' }}>Seguimiento</div>
            </div>
          </div>
          {/* Floating chip 2 */}
          <div style={{ position: 'absolute', right: 0, bottom: 30, background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: 'var(--celuma-shadow-float)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CelIso size={28} />
            <div>
              <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)' }}>Tiempo medio</div>
              <div style={{ fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 16, color: 'var(--celuma-ink)' }}>34 h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- LANDING SECTION HEADERS ----------
function SectionHeader() {
  return (
    <div className="cel-sheet" style={{ width: 920, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 18 }}>
      <div style={{ padding: '60px 50px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ maxWidth: 560 }}>
            <div className="cel-eyebrow">Para quién</div>
            <div className="t-display" style={{ fontSize: 44, marginTop: 12, lineHeight: 1 }}>
              Construido junto a los equipos que diagnostican en México.
            </div>
          </div>
          <div className="cel-pill ghost" style={{ fontSize: 11 }}>4 perfiles · 100% trazabilidad</div>
        </div>
        <hr className="cel-rule teal" style={{ marginTop: 28, width: 80, height: 2 }} />
      </div>
    </div>
  );
}

// ---------- CTA STRIP ----------
function CTAStrip() {
  return (
    <div className="cel-sheet" style={{ width: 920, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 18, background: 'var(--celuma-ink)' }}>
      <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={920} height={220} density={22} seed={9} opacity={0.32} /></div>
      <CelBlob size={520} x={-160} y={-100} color="teal" />
      <CelBlob size={420} x={580} y={80} color="mint" />

      <div style={{ position: 'relative', padding: '54px 50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <CelIso size={70} opacity={0.95} />
          <div>
            <div className="cel-eyebrow on-dark">¿Listo?</div>
            <div className="t-display" style={{ fontSize: 36, color: '#fff', marginTop: 6, lineHeight: 1 }}>¿Listo para iluminar tu laboratorio?</div>
          </div>
        </div>
        <button style={{
          background: 'var(--celuma-primary)', color: 'var(--celuma-on-primary)', border: 0,
          padding: '16px 28px', borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: 'pointer',
          boxShadow: 'var(--celuma-shadow-cta)', display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
        }}>Crear cuenta <CelIcon name="arrow-right" size={14} color="var(--celuma-on-primary)" /></button>
      </div>
    </div>
  );
}

Object.assign(window, {
  PatternCream, PatternNavy, PatternDots, PatternHatch, PatternGrid, PatternIso,
  IllustCellGroup, IllustNetwork, IllustLumen,
  HeroComposition, SectionHeader, CTAStrip,
});
