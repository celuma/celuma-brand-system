// Céluma — Brand System Canvas
// Composes every artifact into a navigable design canvas.

function App() {
  return (
    <DesignCanvas
      title="Céluma · Brand System"
      subtitle="Ecosistema visual completo · papelería, documentos, operación, digital y presentación"
      noteText="Cada tablero usa exclusivamente tokens de Céluma Design (color, tipografía, sombras, radios). Las variantes se diseñaron para mantener coherencia visual cuando se imprimen y cuando se ven en pantalla."
    >
      {/* ============================================== */}
      {/* 01 — IDENTIDAD & MARCA                          */}
      {/* ============================================== */}
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

      {/* ============================================== */}
      {/* 02 — PAPELERÍA CORPORATIVA                      */}
      {/* ============================================== */}
      <DCSection id="papeleria" title="02 · Papelería corporativa" subtitle="Hojas membretadas, tarjetas, sobres y carpetas — 3 expresiones del mismo sistema">
        <DCArtboard id="lh-classic" label="Hoja membretada · A" width={460} height={651}><LetterheadClassic /></DCArtboard>
        <DCArtboard id="lh-sideband" label="Hoja membretada · B" width={460} height={651}><LetterheadSideBand /></DCArtboard>
        <DCArtboard id="lh-editorial" label="Hoja membretada · C" width={460} height={651}><LetterheadEditorial /></DCArtboard>

        <DCArtboard id="bc-a-front" label="Tarjeta A · Frente" width={340} height={215}><BizCardFrontA /></DCArtboard>
        <DCArtboard id="bc-a-back" label="Tarjeta A · Reverso" width={340} height={215}><BizCardBackA /></DCArtboard>
        <DCArtboard id="bc-b-front" label="Tarjeta B · Frente" width={340} height={215}><BizCardFrontB /></DCArtboard>
        <DCArtboard id="bc-b-back" label="Tarjeta B · Reverso" width={340} height={215}><BizCardBackB /></DCArtboard>
        <DCArtboard id="bc-c-front" label="Tarjeta C · Frente" width={340} height={215}><BizCardFrontC /></DCArtboard>
        <DCArtboard id="bc-c-back" label="Tarjeta C · Reverso" width={340} height={215}><BizCardBackC /></DCArtboard>

        <DCArtboard id="env-classic" label="Sobre DL · Clásico" width={460} height={220}><EnvelopeClassic /></DCArtboard>
        <DCArtboard id="env-bold" label="Sobre DL · Confidencial" width={460} height={220}><EnvelopeBold /></DCArtboard>

        <DCArtboard id="folder-dark" label="Carpeta institucional · Nocturna" width={440} height={580}><FolderCover /></DCArtboard>
        <DCArtboard id="folder-light" label="Carpeta institucional · Luminosa" width={440} height={580}><FolderCoverLight /></DCArtboard>
      </DCSection>

      {/* ============================================== */}
      {/* 03 — DOCUMENTOS Y EDITORIAL                     */}
      {/* ============================================== */}
      <DCSection id="documentos" title="03 · Documentos y editorial" subtitle="Portadas, reportes clínicos, formatos internos, headers y footers reutilizables">
        <DCArtboard id="doc-cover-bold" label="Portada · White paper" width={460} height={651}><DocCoverBold /></DCArtboard>
        <DCArtboard id="doc-cover-edi" label="Portada · Manual operativo" width={460} height={651}><DocCoverEditorial /></DCArtboard>
        <DCArtboard id="report-cover" label="Reporte clínico · Portada" width={460} height={651}><ClinicalReportCover /></DCArtboard>
        <DCArtboard id="report-page" label="Reporte clínico · Página" width={460} height={651}><ClinicalReportPage /></DCArtboard>
        <DCArtboard id="internal-form" label="Formato interno · Recepción" width={460} height={651}><InternalForm /></DCArtboard>
        <DCArtboard id="header-footer" label="Headers y footers · Sistema editorial" width={580} height={520}><HeaderStripVariants /></DCArtboard>
      </DCSection>

      {/* ============================================== */}
      {/* 04 — OPERATIVO DE LABORATORIO                   */}
      {/* ============================================== */}
      <DCSection id="labops" title="04 · Operativo de laboratorio" subtitle="Etiquetas de muestras, stickers institucionales, credenciales y lanyards">
        <DCArtboard id="lab-tube" label="Etiqueta de tubo / vial" width={340} height={90}><TubeLabel /></DCArtboard>
        <DCArtboard id="lab-cassette" label="Etiqueta de cassette" width={200} height={130}><CassetteLabel /></DCArtboard>
        <DCArtboard id="lab-slide" label="Etiqueta de lámina" width={200} height={130}><SlideLabel /></DCArtboard>
        <DCArtboard id="lab-block" label="Etiqueta de bloque" width={200} height={130}><BlockLabel /></DCArtboard>
        <DCArtboard id="lab-container" label="Etiqueta de contenedor" width={340} height={200}><ContainerLabel /></DCArtboard>

        <DCArtboard id="sticker-brand" label="Sticker redondo · marca" width={180} height={180}><StickerRoundBrand /></DCArtboard>
        <DCArtboard id="sticker-value-a" label="Sticker valor · Claridad" width={180} height={180}><StickerRoundValue glyph="✦" title="Claridad" /></DCArtboard>
        <DCArtboard id="sticker-value-b" label="Sticker valor · Precisión" width={180} height={180}><StickerRoundValue glyph="◎" title="Precisión" tone="dark" /></DCArtboard>
        <DCArtboard id="sticker-hex" label="Sticker hex · API" width={200} height={174}><StickerHex /></DCArtboard>
        <DCArtboard id="sticker-square" label="Sticker cuadrado" width={180} height={180}><StickerSquare /></DCArtboard>
        <DCArtboard id="sticker-bumper" label="Sticker bumper" width={360} height={110}><StickerBumper /></DCArtboard>

        <DCArtboard id="badge-staff" label="Credencial · Personal médico" width={280} height={440}><StaffBadge /></DCArtboard>
        <DCArtboard id="badge-visitor" label="Credencial · Visitante" width={280} height={440}><StaffBadgeMinimal /></DCArtboard>
        <DCArtboard id="lanyard" label="Lanyard · Vista" width={240} height={540}><LanyardPreview /></DCArtboard>
      </DCSection>

      {/* ============================================== */}
      {/* 05 — IDENTIDAD DIGITAL                          */}
      {/* ============================================== */}
      <DCSection id="digital" title="05 · Identidad digital" subtitle="Firmas de correo, onboarding, dashboards, empty states y notificaciones del sistema">
        <DCArtboard id="sig-classic" label="Firma de correo · Clásica" width={460} height={180}><EmailSigClassic /></DCArtboard>
        <DCArtboard id="sig-compact" label="Firma de correo · Compacta" width={460} height={84}><EmailSigCompact /></DCArtboard>
        <DCArtboard id="sig-banner" label="Firma de correo · Con banner" width={460} height={170}><EmailSigBanner /></DCArtboard>

        <DCArtboard id="onboard" label="Onboarding · Bienvenida" width={520} height={460}><OnboardingWelcome /></DCArtboard>
        <DCArtboard id="dashboard-hero" label="Dashboard · Hero personal" width={720} height={240}><DashboardHero /></DCArtboard>
        <DCArtboard id="stat-tiles" label="Dashboard · Tarjetas de KPI" width={720} height={140}><StatTiles /></DCArtboard>

        <DCArtboard id="empty-inbox" label="Empty state · Bandeja vacía" width={380} height={320}><EmptyStateInbox /></DCArtboard>
        <DCArtboard id="empty-search" label="Empty state · Búsqueda vacía" width={380} height={320}><EmptyStateSearch /></DCArtboard>
        <DCArtboard id="empty-onboard" label="Empty state · Setup pendiente" width={380} height={320}><EmptyStateOnboard /></DCArtboard>

        <DCArtboard id="notifications" label="Sistema de notificaciones" width={360} height={420}><NotificationStack /></DCArtboard>
      </DCSection>

      {/* ============================================== */}
      {/* 06 — PATRONES Y FONDOS                          */}
      {/* ============================================== */}
      <DCSection id="patrones" title="06 · Patrones y fondos" subtitle="Superficies institucionales sobrias · reutilizables en digital e impreso">
        <DCArtboard id="pat-cream" label="01 · Papel cream" width={280} height={240}><PatternCream /></DCArtboard>
        <DCArtboard id="pat-navy" label="02 · Navy" width={280} height={240}><PatternNavy /></DCArtboard>
        <DCArtboard id="pat-dots" label="03 · Grano de papel" width={280} height={240}><PatternDots /></DCArtboard>
        <DCArtboard id="pat-hatch" label="04 · Trama diagonal" width={280} height={240}><PatternHatch /></DCArtboard>
        <DCArtboard id="pat-grid" label="05 · Cuadrícula técnica" width={280} height={240}><PatternGrid /></DCArtboard>
        <DCArtboard id="pat-iso" label="06 · Forro isotipo" width={280} height={240}><PatternIso /></DCArtboard>
      </DCSection>

      {/* ============================================== */}
      {/* 07 — ILUSTRACIONES BIOMÉDICAS                   */}
      {/* ============================================== */}
      <DCSection id="ilustraciones" title="07 · Ilustraciones biomédicas abstractas" subtitle="Conceptos visuales reutilizables para artículos, dashboards y módulos del sistema">
        <DCArtboard id="ill-cell" label="01 · Microcosmos" width={420} height={320}><IllustCellGroup /></DCArtboard>
        <DCArtboard id="ill-net" label="02 · Trazabilidad" width={420} height={320}><IllustNetwork /></DCArtboard>
        <DCArtboard id="ill-lumen" label="03 · Lumen" width={420} height={320}><IllustLumen /></DCArtboard>
      </DCSection>

      {/* ============================================== */}
      {/* 08 — WEB & MARKETING                             */}
      {/* ============================================== */}
      <DCSection id="web" title="08 · Web y marketing" subtitle="Composiciones para landing pages — hero, encabezados de sección y cierre">
        <DCArtboard id="web-hero" label="Hero · Página principal" width={920} height={460}><HeroComposition /></DCArtboard>
        <DCArtboard id="web-section" label="Encabezado de sección" width={920} height={220}><SectionHeader /></DCArtboard>
        <DCArtboard id="web-cta" label="Banda de cierre · CTA" width={920} height={220}><CTAStrip /></DCArtboard>
      </DCSection>

      {/* ============================================== */}
      {/* 09 — PRESENTACIONES                              */}
      {/* ============================================== */}
      <DCSection id="presentaciones" title="09 · Presentaciones" subtitle="Plantillas 16:9 — portada, capítulo, contenido, datos y cita">
        <DCArtboard id="slide-title" label="Slide · Portada" width={720} height={405}><SlideTitle /></DCArtboard>
        <DCArtboard id="slide-divider" label="Slide · Sección" width={720} height={405}><SlideDivider /></DCArtboard>
        <DCArtboard id="slide-content" label="Slide · Contenido" width={720} height={405}><SlideContent /></DCArtboard>
        <DCArtboard id="slide-stats" label="Slide · Datos" width={720} height={405}><SlideStats /></DCArtboard>
        <DCArtboard id="slide-quote" label="Slide · Cita" width={720} height={405}><SlideQuote /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
