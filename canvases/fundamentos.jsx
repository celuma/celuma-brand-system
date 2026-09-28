// Artboards preserved from the original Céluma canvas.
function canvasFundamentos() {
  return (
    <>
<DCSection id="reglas" title="Propuesta · Reglas de identidad" subtitle="Pendiente de aprobación · roles de color, tipografía, logotipo, iconos y voz">
        <DCArtboard id="fund-color" label="Propuesta · Roles de color" width={980} height={560}><FundColorRoles /></DCArtboard>
        <DCArtboard id="fund-tipo" label="Propuesta · Escalas tipográficas" width={980} height={560}><FundTypeScale /></DCArtboard>
        <DCArtboard id="fund-logo" label="Propuesta · Estado del logotipo" width={980} height={600}><FundLogoStatus /></DCArtboard>
        <DCArtboard id="fund-iconos" label="Propuesta · Iconografía" width={980} height={430}><FundIconography /></DCArtboard>
        <DCArtboard id="fund-voz" label="Propuesta · Voz" width={980} height={470}><FundVoice /></DCArtboard>
      </DCSection>

<DCSection id="identidad" title="01 · Identidad" subtitle="Lockups del logotipo, sistema de marca, atmósfera">
        <DCArtboard id="lockups" label="Lockups del logotipo" width={620} height={420}>
          <div style={{ width: '100%', height: '100%', padding: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, background: '#fff' }}>
            <div>
              <div className="cel-eyebrow" style={{ fontSize: 9 }}>Horizontal · principal</div>
              <div style={{ marginTop: 14 }}><CelMark size="xl" /></div>
              <hr className="cel-rule" style={{ margin: '20px 0' }} />
              <div className="cel-eyebrow" style={{ fontSize: 9 }}>Stacked · firma</div>
              <div style={{ marginTop: 14 }}><CelMark size="m" stacked sub="Patología Digital" /></div>
            </div>
            <div style={{ background: 'var(--celuma-ink)', borderRadius: 14, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <CelBlob size={300} x={-80} y={-80} color="teal" />
              <div style={{ position: 'relative' }}>
                <div className="cel-eyebrow on-dark" style={{ fontSize: 9 }}>Inverso · sobre oscuro</div>
                <div style={{ marginTop: 14 }}><CelMark size="l" onDark /></div>
                <hr style={{ border: 0, height: 1, background: 'rgba(255,255,255,0.16)', margin: '20px 0' }} />
                <div className="cel-eyebrow on-dark" style={{ fontSize: 9 }}>Isotipo · solo símbolo</div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 14 }}>
                  <CelIso size={56} />
                  <CelIso size={36} />
                  <CelIso size={24} />
                  <CelIso size={18} />
                </div>
              </div>
            </div>
          </div>
        </DCArtboard>

        <DCArtboard id="brand-mood" label="Atmósfera de marca" width={620} height={420}>
          <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, position: 'relative' }}>
            <div style={{ background: 'var(--celuma-bg)', padding: 30, position: 'relative', overflow: 'hidden' }}>
              <CelBlob size={300} x={-100} y={-100} color="teal" />
              <div style={{ position: 'relative' }}>
                <div className="cel-eyebrow">Cream · cálido</div>
                <div className="t-display" style={{ fontSize: 28, marginTop: 8, lineHeight: 1 }}>Papel,<br/>luz, calma.</div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--celuma-fg-3)', lineHeight: 1.6, maxWidth: 220 }}>
                  Fondo cremoso como superficie por defecto. Tipografía Baloo 2 800 y trazos de teal para acentos.
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--celuma-ink)', color: '#fff', padding: 30, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <CelCellField width={310} height={420} density={24} seed={4} opacity={0.5} />
              </div>
              <CelBlob size={260} x={120} y={200} color="mint" />
              <div style={{ position: 'relative' }}>
                <div className="cel-eyebrow on-dark">Ink · profundidad</div>
                <div className="t-display" style={{ fontSize: 28, marginTop: 8, lineHeight: 1, color: '#fff' }}>Datos,<br/>noche, foco.</div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: 220 }}>
                  Navy oscuro para visores, presentaciones y CTAs. Campo celular sutil agrega textura sin gradientes.
                </div>
              </div>
            </div>
          </div>
        </DCArtboard>

        <DCArtboard id="iso-detail" label="Isotipo · 6 tamaños" width={620} height={200}>
          <div style={{ width: '100%', height: '100%', background: '#fff', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 16 }}>
            {[16, 24, 32, 48, 64, 96].map((s) => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <CelIso size={s} />
                <div className="cel-mono" style={{ fontSize: 9 }}>{s}px</div>
              </div>
            ))}
          </div>
        </DCArtboard>
      </DCSection>

<DCSection id="patrones" title="06 · Patrones y fondos" subtitle="Superficies institucionales sobrias · reutilizables en digital e impreso">
        <DCArtboard id="pat-cream" label="01 · Papel cream" width={280} height={240}><PatternCream /></DCArtboard>
        <DCArtboard id="pat-navy" label="02 · Navy" width={280} height={240}><PatternNavy /></DCArtboard>
        <DCArtboard id="pat-dots" label="03 · Grano de papel" width={280} height={240}><PatternDots /></DCArtboard>
        <DCArtboard id="pat-hatch" label="04 · Trama diagonal" width={280} height={240}><PatternHatch /></DCArtboard>
        <DCArtboard id="pat-grid" label="05 · Cuadrícula técnica" width={280} height={240}><PatternGrid /></DCArtboard>
        <DCArtboard id="pat-iso" label="06 · Forro isotipo" width={280} height={240}><PatternIso /></DCArtboard>
      </DCSection>

<DCSection id="ilustraciones" title="07 · Ilustraciones biomédicas abstractas" subtitle="Conceptos visuales reutilizables para artículos, dashboards y módulos del sistema">
        <DCArtboard id="ill-cell" label="01 · Microcosmos" width={420} height={320}><IllustCellGroup /></DCArtboard>
        <DCArtboard id="ill-net" label="02 · Trazabilidad" width={420} height={320}><IllustNetwork /></DCArtboard>
        <DCArtboard id="ill-lumen" label="03 · Lumen" width={420} height={320}><IllustLumen /></DCArtboard>
      </DCSection>
    </>
  );
}
