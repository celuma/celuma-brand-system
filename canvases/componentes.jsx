// Reference inventory. The live components still belong to celuma-frontend.
function canvasComponentes() {
  const groups = [
    { title: 'Acciones y formularios', names: ['CelumaButton', 'FloatingCaption*', 'CelumaSwitch', 'CelumaTabs', 'ModalFormFooter'] },
    { title: 'Estructura y datos', names: ['PageHeader', 'Panel', 'CelumaTable', 'CelumaPagination', 'CelumaSteps'] },
    { title: 'Comunicación y contenido', names: ['EmptyState', 'NotificationList', 'ConversationThread', 'ImageGalleryCard'] },
  ];
  return (
    <>
      <DCSection id="componentes" title="Componentes de Céluma" subtitle="Inventario inicial de patrones reales de la aplicación · referencias, aún no es un paquete">
        <DCArtboard id="componentes-intro" label="Alcance del catálogo" width={620} height={300}>
          <div style={{ width: '100%', height: '100%', background: 'var(--celuma-bg)', padding: 36, color: 'var(--celuma-ink)' }}>
            <div className="cel-eyebrow">Sistema de producto</div>
            <h2 className="t-display" style={{ fontSize: 32, lineHeight: 1.1, margin: '18px 0 12px' }}>Una identidad, varias superficies.</h2>
            <p style={{ maxWidth: 490, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
              Este lienzo registra los componentes que definen la experiencia de Céluma. Los componentes funcionales permanecen en celuma-frontend hasta que se extraigan, prueben y versionen para su uso compartido.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <span className="cel-pill">Referencia visual</span><span className="cel-pill">Extracción futura</span>
            </div>
          </div>
        </DCArtboard>
        <DCArtboard id="componentes-inventario" label="Inventario de componentes" width={720} height={440}>
          <div style={{ width: '100%', height: '100%', background: '#fff', padding: 30, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {groups.map((group) => (
              <div key={group.title} style={{ background: 'var(--celuma-bg)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{group.title}</div>
                {group.names.map((name) => <div key={name} style={{ borderTop: '1px solid var(--celuma-border)', padding: '9px 0', fontSize: 12 }}>{name}</div>)}
              </div>
            ))}
          </div>
        </DCArtboard>
        <DCArtboard id="componentes-regla" label="Reglas de reutilización" width={520} height={440}>
          <div style={{ width: '100%', height: '100%', background: 'var(--celuma-ink)', padding: 32, color: '#fff' }}>
            <div className="cel-eyebrow on-dark">Límite del sistema</div>
            <h2 style={{ font: '800 28px/1.15 var(--celuma-font-display)', margin: '18px 0 22px' }}>Compartir lo estable.</h2>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>Marca, tokens, tipografía, botones y patrones generales pueden converger entre frontend, landing y docs.</p>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>Estados clínicos, informes y flujos de laboratorio conservan sus contratos de producto y su contexto.</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,.25)', marginTop: 22, paddingTop: 14, color: 'var(--celuma-on-dark-1)', fontSize: 12 }}>
              Fuente actual: celuma-frontend/src/components · Validar antes de publicar un paquete.
            </div>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection id="fichas" title="Propuesta · Fichas de componentes" subtitle="Pendiente de aprobación · anatomía, variantes, estados y reglas de componentes reales de celuma-frontend">
        <DCArtboard id="ficha-inventario" label="Propuesta · Inventario contrastado" width={980} height={600}><CompInventory /></DCArtboard>
        <DCArtboard id="ficha-button" label="Propuesta · CelumaButton" width={980} height={620}><CompButton /></DCArtboard>
        <DCArtboard id="ficha-header" label="Propuesta · PageHeader" width={980} height={620}><CompPageHeader /></DCArtboard>
        <DCArtboard id="ficha-chip" label="Propuesta · Chip de estado" width={980} height={620}><CompStatusChip /></DCArtboard>
        <DCArtboard id="ficha-input" label="Propuesta · FloatingCaptionInput" width={980} height={620}><CompInput /></DCArtboard>
        <DCArtboard id="ficha-empty" label="Propuesta · EmptyState" width={980} height={560}><CompEmpty /></DCArtboard>
      </DCSection>
    </>
  );
}
