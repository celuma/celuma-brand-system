// Céluma — Lab operations
// Sample labels (cassette/slide/tube), institutional stickers, credentials, lanyards

// ---------- SAMPLE LABELS ----------

// Tube / vial label — long thin rectangle wraps around tube
function TubeLabel() {
  return (
    <div className="cel-sheet" style={{ width: 340, height: 90, padding: '10px 12px', position: 'relative', display: 'flex', gap: 10, alignItems: 'center', borderRadius: 8 }}>
      <div style={{ width: 50, height: 50, background: 'var(--celuma-primary-soft)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <CelIso size={32} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="cel-mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--celuma-ink)' }}>CL‑00482‑A1</div>
          <div style={{ fontSize: 8, color: 'var(--celuma-fg-3)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>BIOPSIA</div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--celuma-fg-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>RM, F · 56 · 14/05/26 · 09:42</div>
        <div style={{ marginTop: 4 }}>
          <CelBarcode value="CL00482A1" width={210} height={24} />
        </div>
      </div>
    </div>
  );
}

// Cassette label — small, square-ish, for histology cassettes (~28×22mm real)
function CassetteLabel() {
  return (
    <div className="cel-sheet" style={{ width: 200, height: 130, padding: 12, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CelIso size={22} />
        <div className="cel-pill" style={{ fontSize: 9, padding: '2px 8px' }}>CASSETTE</div>
      </div>
      <div>
        <div className="cel-mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--celuma-ink)', letterSpacing: '0.04em' }}>CL‑00482‑B3</div>
        <div style={{ fontSize: 9, color: 'var(--celuma-fg-3)', marginTop: 1 }}>RM · 56 a · GI · 14.05.26</div>
        <div style={{ marginTop: 6 }}>
          <CelBarcode value="CL00482B3" width={176} height={20} />
        </div>
      </div>
    </div>
  );
}

// Slide label — for glass microscope slides (~25×20mm real)
function SlideLabel() {
  return (
    <div className="cel-sheet" style={{ width: 200, height: 130, padding: 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: 24, background: 'var(--celuma-primary)', color: 'var(--celuma-on-primary)', padding: '4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em' }}>LÁMINA · HE</span>
        <CelIso size={16} />
      </div>
      <div style={{ padding: 10 }}>
        <div className="cel-mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--celuma-ink)' }}>CL‑00482‑B3 · L1</div>
        <div style={{ fontSize: 9, color: 'var(--celuma-fg-3)', marginTop: 2 }}>Tinción: H&E · Corte 04</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <CelQR size={42} />
          <div style={{ fontSize: 9, color: 'var(--celuma-fg-2)', lineHeight: 1.4 }}>
            <div>RM, F · 56 a</div>
            <div className="cel-mono" style={{ fontSize: 9 }}>14.05.26 · 09:42</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Block label — paraffin block
function BlockLabel() {
  return (
    <div className="cel-sheet" style={{ width: 200, height: 130, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: 'var(--celuma-amber)' }} />
      <div style={{ padding: '12px 12px 12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="cel-eyebrow" style={{ fontSize: 8, color: 'var(--celuma-amber)' }}>BLOQUE · PARAFINA</div>
          <CelIso size={18} />
        </div>
        <div className="cel-mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--celuma-ink)', marginTop: 6 }}>CL‑00482‑B3</div>
        <div style={{ fontSize: 9, color: 'var(--celuma-fg-3)', marginTop: 1 }}>GI · Colon · Biopsia</div>
        <hr className="cel-rule" style={{ margin: '8px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--celuma-fg-2)' }}>
          <span>Bloque 3/4</span>
          <span className="cel-mono">14.05.26</span>
        </div>
      </div>
    </div>
  );
}

// Container label — secondary specimen container
function ContainerLabel() {
  return (
    <div className="cel-sheet" style={{ width: 340, height: 200, padding: 18, position: 'relative' }}>
      <CelBlob size={200} x={-60} y={-60} color="teal" opacity={0.6} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CelMark size="s" />
        <div className="cel-pill amber">FORMALDEHÍDO 10%</div>
      </div>
      <hr className="cel-rule" style={{ margin: '12px 0' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
        <div>
          <div className="cel-eyebrow muted" style={{ fontSize: 8 }}>MUESTRA</div>
          <div className="cel-mono" style={{ fontSize: 18, color: 'var(--celuma-ink)', fontWeight: 700, marginTop: 2 }}>CL‑00482</div>
          <div style={{ fontSize: 10, color: 'var(--celuma-fg-2)', marginTop: 6 }}>
            <strong style={{ color: 'var(--celuma-ink)' }}>Paciente:</strong> R.M. (56, F)<br/>
            <strong style={{ color: 'var(--celuma-ink)' }}>Origen:</strong> Colonoscopia · Sigmoides<br/>
            <strong style={{ color: 'var(--celuma-ink)' }}>Recibido:</strong> 14/05/2026 · 09:42
          </div>
        </div>
        <CelQR size={70} />
      </div>
      <div style={{ position: 'absolute', left: 18, right: 18, bottom: 14 }}>
        <CelBarcode value="CL004820001" width={304} height={28} />
      </div>
    </div>
  );
}

// ---------- INSTITUTIONAL STICKERS ----------

// Round sticker — large brand mark
function StickerRoundBrand() {
  return (
    <div className="cel-sheet" style={{ width: 180, height: 180, borderRadius: '50%', background: 'var(--celuma-ink)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={180} height={180} density={10} seed={6} opacity={0.38} /></div>
      <CelBlob size={220} x={-30} y={-30} color="mint" />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <CelIso size={52} />
        <div style={{ fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
          Céluma
        </div>
        <div style={{ fontSize: 8, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Patología · 2026</div>
      </div>
    </div>
  );
}

// Round sticker — value
function StickerRoundValue({ glyph = '✦', title = 'Claridad', tone = 'soft' }) {
  const dark = tone === 'dark';
  return (
    <div className="cel-sheet" style={{
      width: 180, height: 180, borderRadius: '50%',
      background: dark ? 'var(--celuma-ink)' : 'var(--celuma-primary-soft)',
      color: dark ? '#fff' : 'var(--celuma-ink)',
      position: 'relative', overflow: 'hidden',
      border: dark ? 'none' : '2px solid var(--celuma-primary)',
    }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 56, color: dark ? '#7dd8d9' : 'var(--celuma-primary)' }}>{glyph}</div>
        <div className="t-display" style={{ fontSize: 22, marginTop: 4, color: dark ? '#fff' : 'var(--celuma-ink)' }}>{title}</div>
        <div style={{ fontSize: 8, letterSpacing: '0.22em', color: dark ? 'rgba(255,255,255,0.5)' : 'var(--celuma-fg-3)', textTransform: 'uppercase', marginTop: 6 }}>Valor Céluma</div>
      </div>
    </div>
  );
}

// Hex sticker — modern dev-style
function StickerHex() {
  const hexClip = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
  return (
    <div style={{ width: 200, height: 174, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, clipPath: hexClip, background: 'var(--celuma-primary)', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <CelIso size={42} />
          <div style={{ fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--celuma-on-primary)', letterSpacing: '-0.02em' }}>Céluma</div>
          <div style={{ fontSize: 8, letterSpacing: '0.22em', color: 'var(--celuma-on-primary)', textTransform: 'uppercase' }}>API · v2</div>
        </div>
      </div>
    </div>
  );
}

// Rectangle bumper-style sticker
function StickerBumper() {
  return (
    <div className="cel-sheet" style={{ width: 360, height: 110, borderRadius: 18, padding: 18, position: 'relative', overflow: 'hidden' }}>
      <CelBlob size={200} x={-40} y={-60} color="teal" opacity={0.7} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
        <CelIso size={50} />
        <div>
          <div className="t-display" style={{ fontSize: 24 }}>Ilumino mi laboratorio.</div>
          <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)', marginTop: 2, letterSpacing: '0.18em', textTransform: 'uppercase' }}>celuma.mx</div>
        </div>
      </div>
    </div>
  );
}

// Square sticker — "Patología digital"
function StickerSquare() {
  return (
    <div className="cel-sheet" style={{ width: 180, height: 180, borderRadius: 22, padding: 18, background: 'var(--celuma-primary-soft)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <CelDots size={10} color="rgba(73,182,173,0.22)" style={{ width: '100%', height: '100%' }} />
      </div>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CelIso size={40} />
        <div>
          <div className="cel-eyebrow" style={{ fontSize: 9 }}>Sister system</div>
          <div className="t-display" style={{ fontSize: 22, marginTop: 4, lineHeight: 1 }}>Patología<br/>digital.</div>
        </div>
      </div>
    </div>
  );
}

// ---------- CREDENTIALS (Lanyard cards / staff badge) ----------

function StaffBadge() {
  return (
    <div className="cel-sheet" style={{ width: 280, height: 440, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
      {/* Top punch */}
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 30, height: 8, borderRadius: 4, background: 'var(--celuma-bg)', border: '1px solid var(--celuma-border)', zIndex: 2 }} />
      {/* Header */}
      <div style={{ height: 110, background: 'var(--celuma-ink)', color: '#fff', padding: 22, position: 'relative', overflow: 'hidden' }}>
        <CelBlob size={240} x={-80} y={-40} color="teal" />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', height: '100%' }}>
          <CelMark size="s" onDark />
        </div>
      </div>

      {/* Photo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: -34 }}>
        <div style={{ width: 92, height: 92, borderRadius: '50%', background: 'var(--celuma-primary-soft)', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: 'var(--celuma-shadow-float)' }}>
          <CelIcon name="user" size={42} color="var(--celuma-primary)" stroke={1.6} />
        </div>
      </div>

      <div style={{ padding: '14px 20px 0', textAlign: 'center' }}>
        <div className="t-display" style={{ fontSize: 20 }}>Dra. Lucía Méndez</div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-3)', marginTop: 2 }}>Patóloga senior · Subesp. dermatopatología</div>
        <div className="cel-pill" style={{ marginTop: 10 }}>Personal médico</div>
      </div>

      <hr className="cel-rule" style={{ margin: '16px 20px 14px' }} />

      <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="cel-mono" style={{ fontSize: 10 }}>
          <div style={{ color: 'var(--celuma-fg-3)', fontSize: 8, letterSpacing: '0.2em' }}>ID</div>
          <div style={{ color: 'var(--celuma-ink)', fontWeight: 700, marginTop: 2 }}>CL‑LM‑0247</div>
          <div style={{ color: 'var(--celuma-fg-3)', fontSize: 8, letterSpacing: '0.2em', marginTop: 10 }}>VIGENCIA</div>
          <div style={{ color: 'var(--celuma-ink)', fontWeight: 700, marginTop: 2 }}>05 / 2027</div>
        </div>
        <CelQR size={64} />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 20px', background: 'var(--celuma-primary)', color: 'var(--celuma-on-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9 }}>
        <span style={{ fontWeight: 700, letterSpacing: '0.18em' }}>ACCESO · LAB</span>
        <span className="cel-mono">celuma.mx</span>
      </div>
    </div>
  );
}

function StaffBadgeMinimal() {
  return (
    <div className="cel-sheet cream" style={{ width: 280, height: 440, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 30, height: 8, borderRadius: 4, background: 'var(--celuma-bg)', border: '1px solid var(--celuma-border)', zIndex: 2 }} />
      <CelBlob size={420} x={-120} y={120} color="teal" opacity={0.7} />

      <div style={{ position: 'relative', padding: '36px 24px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CelIso size={28} />
          <div className="cel-mono" style={{ fontSize: 9, color: 'var(--celuma-fg-3)' }}>CL‑VIS‑104</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="cel-eyebrow" style={{ fontSize: 9 }}>Visitante autorizado</div>
          <div className="t-display" style={{ fontSize: 32, lineHeight: 0.96, marginTop: 8 }}>Andrés<br/>Carmona.</div>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-3)', marginTop: 6 }}>Auditor externo · INDRE</div>

          <div style={{ marginTop: 24, display: 'grid', gap: 8, fontSize: 10, color: 'var(--celuma-fg-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sucursal</span><strong style={{ color: 'var(--celuma-ink)' }}>Insurgentes</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Acceso</span><strong style={{ color: 'var(--celuma-ink)' }}>Áreas comunes</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Vigencia</span><strong style={{ color: 'var(--celuma-ink)' }}>14 / 05 / 2026</strong></div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--celuma-border)', paddingTop: 14 }}>
          <div>
            <div className="cel-eyebrow" style={{ fontSize: 9 }}>Escolta requerida</div>
            <div className="t-display" style={{ fontSize: 16, marginTop: 2 }}>Sí.</div>
          </div>
          <CelQR size={64} />
        </div>
      </div>
    </div>
  );
}

// Lanyard preview (the strap + clip + card)
function LanyardPreview() {
  return (
    <div style={{ width: 240, height: 540, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Strap */}
      <div style={{ width: 36, height: 220, background: 'var(--celuma-primary)', position: 'relative', clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 8, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.18em' }}>CÉLUMA</div>
        <div style={{ position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.18em' }}>CÉLUMA</div>
        <div style={{ position: 'absolute', top: 64, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.18em' }}>CÉLUMA</div>
        <div style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.18em' }}>CÉLUMA</div>
        <div style={{ position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.18em' }}>CÉLUMA</div>
        <div style={{ position: 'absolute', top: 148, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.18em' }}>CÉLUMA</div>
        <div style={{ position: 'absolute', top: 176, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.18em' }}>CÉLUMA</div>
      </div>
      {/* Clip */}
      <div style={{ width: 28, height: 12, background: '#1c2a3a', borderRadius: 3, marginTop: -2 }} />
      <div style={{ width: 16, height: 10, background: '#1c2a3a', borderRadius: '50% 50% 30% 30%', marginTop: 2 }} />
      {/* Card */}
      <div style={{ marginTop: 6, transform: 'scale(0.78)', transformOrigin: 'top center' }}>
        <StaffBadge />
      </div>
    </div>
  );
}

Object.assign(window, {
  TubeLabel, CassetteLabel, SlideLabel, BlockLabel, ContainerLabel,
  StickerRoundBrand, StickerRoundValue, StickerHex, StickerBumper, StickerSquare,
  StaffBadge, StaffBadgeMinimal, LanyardPreview,
});
