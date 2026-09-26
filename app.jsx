// Céluma — Brand System. Each canvas owns its own state and viewport.
const CELUMA_CANVASES = [
  { id: 'fundamentos', label: 'Fundamentos', description: 'Identidad, patrones e ilustración', render: canvasFundamentos },
  { id: 'papeleria', label: 'Papelería', description: 'Piezas impresas y documentos', render: canvasPapeleria },
  { id: 'digital', label: 'Material digital', description: 'Correo, web y presentaciones', render: canvasDigital },
  { id: 'componentes', label: 'Componentes', description: 'Patrones de la aplicación', render: canvasComponentes },
];

function selectedCanvas() {
  const id = window.location.hash.slice(1);
  return CELUMA_CANVASES.some((canvas) => canvas.id === id) ? id : 'fundamentos';
}

function App() {
  const [active, setActive] = React.useState(selectedCanvas);
  React.useEffect(() => {
    const onHashChange = () => setActive(selectedCanvas());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const canvas = CELUMA_CANVASES.find((item) => item.id === active);
  return (
    <div className="brand-app">
      <header className="brand-header">
        <div className="brand-header__identity">
          <img src="assets/celuma-isotipo.png" alt="" width="36" height="36" />
          <div><strong>Céluma</strong><span>Brand System · en revisión</span></div>
        </div>
        <nav className="brand-tabs" aria-label="Lienzos del sistema de marca">
          {CELUMA_CANVASES.map((item) => (
            <a key={item.id} href={'#' + item.id} aria-current={active === item.id ? 'page' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="brand-header__hint" title={canvas.description}>{canvas.description}</div>
      </header>
      <DesignCanvas key={active} stateFile={'.design-canvas.' + active + '.state.json'} viewportKey={active}
        style={{ height: 'calc(100dvh - var(--brand-header-height))', width: '100%' }}>
        {canvas.render()}
      </DesignCanvas>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
