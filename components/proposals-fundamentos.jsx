// Céluma — PROPUESTA · Fundamentos compartidos (color, tipografía, logotipo,
// iconografía y voz). Ratios de contraste calculados con WCAG 2.x.
// Ningún valor nuevo queda aprobado por aparecer aquí.

function FundSheet({ width, height, eyebrow, title, children, dark = false }) {
  return (
    <div style={{ width, height, position: 'relative', background: dark ? 'var(--celuma-ink)' : '#fff', color: dark ? '#fff' : 'var(--celuma-ink)', padding: 32, fontFamily: 'var(--celuma-font-body)', overflow: 'hidden' }}>
      <ProposalTag dark={dark} />
      <div className={'cel-eyebrow' + (dark ? ' on-dark' : '')}>{eyebrow}</div>
      <div className="t-display" style={{ fontSize: 26, marginTop: 8, color: dark ? '#fff' : 'var(--celuma-ink)' }}>{title}</div>
      <div style={{ marginTop: 20 }}>{children}</div>
    </div>
  );
}

const FUND_STATUS = {
  ok: { label: 'Verificado', color: '#1f7a75', bg: '#e6f7f7' },
  prop: { label: 'Propuesta', color: '#8a5a00', bg: '#fff4d6' },
  pend: { label: 'Pendiente', color: '#b4413a', bg: '#ffeeec' },
};
function FundBadge({ s }) {
  const c = FUND_STATUS[s];
  return <span style={{ font: '700 9px/1 var(--celuma-font-body)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 6px', borderRadius: 4, color: c.color, background: c.bg }}>{c.label}</span>;
}

// ---------- Roles de color ----------
function FundColorRoles() {
  const roles = [
    { hex: '#49b6ad', name: 'Teal de identidad', role: 'Rellenos, bordes de campo, ilustración, isotipo', ink: '#0d1b2a', ratio: 'Navy encima 7,10:1 · blanco encima 2,45:1 ✕', s: 'ok' },
    { hex: '#1f7a75', name: 'Teal de tinta', role: 'Texto, enlaces y eyebrows sobre fondos claros', ink: '#ffffff', ratio: 'Sobre blanco 5,12:1 · sobre crema 4,76:1', s: 'prop' },
    { hex: '#0d1b2a', name: 'Navy', role: 'Texto principal, fondos profundos', ink: '#ffffff', ratio: 'Sobre crema 16,15:1', s: 'ok' },
    { hex: '#fbf6ec', name: 'Crema', role: 'Superficie por defecto en pantalla', ink: '#0d1b2a', ratio: '—', s: 'ok' },
    { hex: '#F98D84', name: 'Salmón', role: 'Acento de identidad: reglas y bordes', ink: '#0d1b2a', ratio: 'Sobre blanco 2,29:1 · no para texto', s: 'prop' },
    { hex: '#b4413a', name: 'Salmón de tinta', role: 'Solo si se necesita texto de la familia salmón', ink: '#ffffff', ratio: 'Sobre blanco 5,59:1', s: 'prop' },
    { hex: '#7dd8d9', name: 'Teal sobre oscuro', role: 'Acentos de texto sobre navy', ink: '#0d1b2a', ratio: 'Sobre navy 10,52:1', s: 'ok' },
    { hex: '#5b6472', name: 'Gris secundario', role: 'Texto secundario sobre crema', ink: '#ffffff', ratio: 'Sobre crema 5,55:1 (#6b7280 = 4,49:1)', s: 'prop' },
  ];
  return (
    <FundSheet width={980} height={560} eyebrow="Propuesta · fundamentos" title="Roles de color: identidad ≠ texto">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {roles.map((r) => (
          <div key={r.hex} style={{ border: '1px solid var(--celuma-border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ height: 84, background: r.hex, color: r.ink, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <FundBadge s={r.s} />
              <span style={{ font: '700 12px var(--celuma-font-mono)' }}>{r.hex}</span>
            </div>
            <div style={{ padding: 10, display: 'grid', gap: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>{r.name}</div>
              <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-2)', lineHeight: 1.4 }}>{r.role}</div>
              <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)' }}>{r.ratio}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 11.5, color: 'var(--celuma-fg-2)', lineHeight: 1.5 }}>
        Colores de estado de la app: se conservan sus familias de color, pero su tinta de texto debe oscurecerse (tono 700) y acompañarse de un icono. La marca no los usa como acentos decorativos.
      </div>
    </FundSheet>
  );
}

// ---------- Escalas tipográficas ----------
function FundTypeScale() {
  const screen = [
    ['Display', 'Baloo 2 · 800', 48, '−0,02em'], ['Título de página', 'Baloo 2 · 800', 24, '0'], ['Título de sección', 'Baloo 2 · 700', 18, '0'],
    ['Texto', 'Sistema · 400', 15, '1,6'], ['Secundario', 'Sistema · 400', 13, '1,5'], ['Mínimo informativo', 'Sistema · 500', 12, '—'],
  ];
  const print = [['Título impreso', 'Baloo 2 · 800', '20–28 pt'], ['Texto impreso', 'Por definir · 400', '9,5–11 pt'], ['Pie y datos', 'Por definir', '≥ 7 pt'], ['Tarjeta de presentación', 'Por definir', '≥ 7 pt']];
  return (
    <FundSheet width={980} height={560} eyebrow="Propuesta · fundamentos" title="Una voz tipográfica, tres escalas">
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><strong style={{ fontSize: 12 }}>Pantalla (px)</strong><FundBadge s="ok" /></div>
          {screen.map(([n, f, s, t]) => (
            <div key={n} style={{ borderTop: '1px solid var(--celuma-border)', padding: '8px 0', display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ font: `${f.includes('800') ? 800 : f.includes('700') ? 700 : f.includes('500') ? 500 : 400} ${Math.min(s, 34)}px/1.1 ${f.startsWith('Baloo') ? 'var(--celuma-font-display)' : 'var(--celuma-font-body)'}`, color: 'var(--celuma-ink)' }}>{n}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--celuma-fg-3)', whiteSpace: 'nowrap' }}>{s} px · {f}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><strong style={{ fontSize: 12 }}>Impreso (pt)</strong><FundBadge s="pend" /></div>
          {print.map(([n, f, s]) => (
            <div key={n} style={{ borderTop: '1px solid var(--celuma-border)', padding: '8px 0' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-3)' }}>{f} · {s}</div>
            </div>
          ))}
          <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-2)', marginTop: 8, lineHeight: 1.45 }}>“system-ui” no existe en imprenta: falta elegir una fuente de texto con licencia de impresión.</div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><strong style={{ fontSize: 12 }}>Publicaciones (S)</strong><FundBadge s="prop" /></div>
          {[['Eyebrow', 'S × 0,034'], ['Título', 'S × 0,088 · ≤ 3 líneas'], ['Texto', 'S × 0,044 · ≤ 2 líneas'], ['Margen', 'S ÷ 12']].map(([n, v]) => (
            <div key={n} style={{ borderTop: '1px solid var(--celuma-border)', padding: '8px 0' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-3)' }}>{v}</div>
            </div>
          ))}
          <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-2)', marginTop: 8, lineHeight: 1.45 }}>S = lado corto del formato. A 1080 px: título ≈ 95 px, texto ≈ 48 px.</div>
        </div>
      </div>
    </FundSheet>
  );
}

// ---------- Estado del logotipo ----------
function FundLogoStatus() {
  const Cell = ({ title, s, children, note }) => (
    <div style={{ border: '1px solid var(--celuma-border)', borderRadius: 12, padding: 12, display: 'grid', gap: 8, alignContent: 'start' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong style={{ fontSize: 12 }}>{title}</strong><FundBadge s={s} /></div>
      <div style={{ height: 120, borderRadius: 8, background: 'var(--celuma-bg)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>{children}</div>
      <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-2)', lineHeight: 1.45 }}>{note}</div>
    </div>
  );
  return (
    <FundSheet width={980} height={600} eyebrow="Propuesta · fundamentos" title="Logotipo: qué es vigente y qué falta">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <Cell title="Isotipo V2" s="ok" note="assets/celuma-isotipo.png es un recorte exacto de Celuma_Isotipo_V2.png (Notion, “Versión final”). Mismo archivo en app y landing.">
          <img src="docs/revision-grafica/referencias/notion/Celuma_Isotipo_V2.png" alt="" style={{ height: 110 }} />
        </Cell>
        <Cell title="celuma-logo-v3.png" s="pend" note="Dibujo distinto (núcleo irregular, rayos y fondo blanco opaco). No se usa en ningún repositorio. No promover.">
          <img src="assets/celuma-logo-v3.png" alt="" style={{ height: 110 }} />
        </Cell>
        <Cell title="Wordmark en uso" s="ok" note="App, landing, docs y este lienzo componen “Céluma” como texto vivo en Baloo 2 · 800.">
          <PubLockup size={34} />
        </Cell>
        <Cell title="Wordmark de Notion V2" s="pend" note="Celuma_Logotipo_V2.png usa una sans geométrica navy (≈ #0d1f3f) sobre crema opaco. No coincide con Baloo 2. Solo existe en PNG.">
          <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)', textAlign: 'center', padding: 10 }}>Ver enlace a Notion en el documento de revisión (archivo no copiado).</div>
        </Cell>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 18 }}>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          <div style={{ position: 'relative', padding: 22, background: 'repeating-linear-gradient(135deg, rgba(249,141,132,.18) 0 1px, transparent 1px 7px)', borderRadius: 8 }}>
            <div style={{ background: 'var(--celuma-bg)' }}><PubLockup size={40} /></div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.5 }}><strong style={{ color: 'var(--celuma-ink)' }}>Protección (propuesta):</strong> ½ altura del isotipo en los cuatro lados. <br /><strong style={{ color: 'var(--celuma-ink)' }}>Mínimos:</strong> isotipo 20 px en pantalla; lockup 12 mm de ancho impreso. Por debajo de 20 px los rayos se pierden (ver isotipo a 16 px).</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', lineHeight: 1.55 }}>
          <strong style={{ color: 'var(--celuma-ink)' }}>Falta para impresión y descargas:</strong> maestro vectorial (SVG/PDF) del isotipo y del lockup, versión monocroma (1 tinta), versión en negativo y valores CMYK/Pantone. Ningún archivo actual es apto para imprenta.
        </div>
      </div>
    </FundSheet>
  );
}

// ---------- Iconografía ----------
function FundIconography() {
  const ICON_ITEMS = [
    ['Marca · CelIcon', 'Trazo 1,8 redondeado, tipo Lucide', 'ok', <div style={{ display: 'flex', gap: 10, color: 'var(--celuma-primary-ink)' }}>{['file-text', 'users', 'bell', 'shield-check'].map((n) => <CelIcon key={n} name={n} size={22} />)}</div>],
    ['App · Ant Design', 'Outlined; 65 importaciones', 'ok', <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)' }}>InboxOutlined · AuditOutlined · SendOutlined</div>],
    ['Landing y docs · emoji', '🔬 🧪 ⚙️ 🔒 🤝 en tarjetas', 'pend', <div style={{ fontSize: 24 }}>🔬 🧪 ⚙️ 🔒</div>],
  ];
  return (
    <FundSheet width={980} height={430} eyebrow="Propuesta · fundamentos" title="Iconos: tres lenguajes y emoji">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {ICON_ITEMS.map(([t, d, s, demo]) => (
          <div key={t} style={{ border: '1px solid var(--celuma-border)', borderRadius: 12, padding: 14, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 12 }}>{t}</strong><FundBadge s={s} /></div>
            <div style={{ height: 50, display: 'flex', alignItems: 'center' }}>{demo}</div>
            <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-3)' }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 11.5, color: 'var(--celuma-fg-2)', lineHeight: 1.55, maxWidth: 820 }}>
        <strong style={{ color: 'var(--celuma-ink)' }}>Regla propuesta:</strong> iconos de contorno con extremos redondeados, un concepto = un icono en todos los medios, color de tinta (nunca teal claro sobre claro). La app conserva Ant Design; la marca documenta equivalencias. Los emoji de landing y docs se sustituyen cuando se toque esa sección, no con una campaña aparte.
      </div>
    </FundSheet>
  );
}

// ---------- Voz ----------
function FundVoice() {
  const rows = [
    ['Aplicación', 'Instrucción directa, verbo al inicio', 'Registrar muestra', 'Mezcla actual: “¿Olvidó su contraseña?” (usted) y “Bienvenido de nuevo”.', 'pend'],
    ['Landing y publicaciones', 'Tú, cálido y concreto', 'Conoce el flujo con tu equipo', '“Ilumina y digitaliza tu laboratorio” (tuteo) · coherente.', 'ok'],
    ['Docs', 'Tú, paso a paso', 'Escribe tu usuario y contraseña', 'Tuteo en guías · coherente.', 'ok'],
    ['Correo transaccional', 'Tú, breve, sin promoción', 'Has sido invitado a…', 'Tuteo en backend · coherente.', 'ok'],
    ['Documentos clínicos', 'Del laboratorio cliente', '—', 'No es voz de Céluma (ADR 0002).', 'ok'],
  ];
  return (
    <FundSheet width={980} height={470} eyebrow="Propuesta · fundamentos" title="Voz: clara, precisa y humana">
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr 1.1fr 1.8fr 90px', fontSize: 11, borderTop: '1px solid var(--celuma-border)' }}>
        {['Canal', 'Tratamiento', 'Ejemplo', 'Evidencia actual', 'Estado'].map((h) => <div key={h} style={{ padding: '8px 6px', fontWeight: 800, borderBottom: '1px solid var(--celuma-border)' }}>{h}</div>)}
        {rows.map((r) => r.map((c, i) => <div key={r[0] + i} style={{ padding: '8px 6px', borderBottom: '1px solid var(--celuma-border)', color: i === 0 ? 'var(--celuma-ink)' : 'var(--celuma-fg-2)', fontWeight: i === 0 ? 700 : 400 }}>{i === 4 ? <FundBadge s={c} /> : c}</div>))}
      </div>
      <div style={{ marginTop: 14, fontSize: 11.5, color: 'var(--celuma-fg-2)', lineHeight: 1.55 }}>
        Evitar: absolutos (“100 %”, “sin errores”), promesas de tiempo, términos normativos sin validar y “Patología digital” mientras no se decida el descriptor.
      </div>
    </FundSheet>
  );
}

Object.assign(window, { FundColorRoles, FundTypeScale, FundLogoStatus, FundIconography, FundVoice, FundBadge, FundSheet });
