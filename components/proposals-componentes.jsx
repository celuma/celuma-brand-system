// Céluma — PROPUESTA · Fichas visuales de componentes reales de celuma-frontend.
// Son dibujos de referencia, no implementación. Valores tomados del código fuente
// indicado en cada ficha (celuma-frontend, rama main 1.3.1). Donde la ficha
// muestra “propuesta”, el cambio no existe todavía en la app.

function CompSheet({ name, source, summary, children, height = 620 }) {
  return (
    <div style={{ width: 980, height, position: 'relative', background: '#fff', padding: 30, fontFamily: 'var(--celuma-font-body)', color: 'var(--celuma-ink)', overflow: 'hidden' }}>
      <ProposalTag text="Ficha propuesta" />
      <div className="cel-eyebrow">Componente de producto</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 6 }}>
        <div className="t-display" style={{ fontSize: 28 }}>{name}</div>
        <code className="cel-mono" style={{ fontSize: 10.5 }}>{source}</code>
      </div>
      <div style={{ fontSize: 12, color: 'var(--celuma-fg-2)', marginTop: 4, maxWidth: 760, lineHeight: 1.5 }}>{summary}</div>
      <div style={{ marginTop: 18 }}>{children}</div>
    </div>
  );
}

function CompCol({ title, children }) {
  return (
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <div style={{ font: '700 10px/1 var(--celuma-font-body)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--celuma-fg-3)' }}>{title}</div>
      {children}
    </div>
  );
}

function CompNote({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, lineHeight: 1.55, color: 'var(--celuma-fg-2)' }}>
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}

function CompCallout({ n, x, y }) {
  return <span style={{ position: 'absolute', left: x, top: y, width: 18, height: 18, borderRadius: '50%', background: 'var(--celuma-secondary-ink)', color: '#fff', font: '800 10px/18px var(--celuma-font-body)', textAlign: 'center' }}>{n}</span>;
}

// ---------- CelumaButton ----------
function CompButtonDraw({ size = 'default', kind = 'primary', state = 'rest', proposal = false, label = 'Registrar' }) {
  const dim = { default: [44, 16, 700, 999, 28], small: [38, 14, 600, 10, 16], xsmall: [30, 13, 600, 8, 12] }[size];
  const teal = { rest: '#49b6ad', hover: '#3da8a0', active: '#2e9692', disabled: '#a8d4d0' }[state];
  let st;
  if (kind === 'primary') st = { background: teal, border: `2px solid ${teal}`, color: proposal ? '#0d1b2a' : '#fff' };
  else if (kind === 'secondary') st = { background: '#fff', border: `2px solid ${state === 'hover' ? '#49b6ad' : '#d1d5db'}`, color: state === 'hover' ? (proposal ? '#1f7a75' : '#49b6ad') : '#374151' };
  else st = { background: '#fff', border: `2px solid ${state === 'hover' ? '#e5484d' : '#d1d5db'}`, color: state === 'hover' ? '#e5484d' : '#374151' };
  if (state === 'disabled' && kind !== 'primary') st = { background: '#fff', border: '2px solid #e5e7eb', color: '#9ca3af' };
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: dim[0], padding: `0 ${dim[4]}px`, borderRadius: dim[3], font: `${dim[2]} ${dim[1]}px/1 var(--celuma-font-body)`, boxSizing: 'border-box', ...st }}>{label}</span>;
}

function CompButton() {
  return (
    <CompSheet name="CelumaButton" source="src/components/ui/button.tsx" summary="Botón de acción. Tres pieles (primario, secundario, peligro) y tres tamaños. Texto primario actual: blanco sobre #49b6ad (2,45:1).">
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 26 }}>
        <CompCol title="Anatomía">
          <div style={{ position: 'relative', padding: '18px 10px' }}>
            <CompButtonDraw />
            <CompCallout n="1" x={2} y={4} /><CompCallout n="2" x={60} y={4} /><CompCallout n="3" x={112} y={52} />
          </div>
          <CompNote items={['1 · Contenedor: 44 px, radio 999, borde 2 px', '2 · Etiqueta: 16 px / 700, verbo en infinitivo', '3 · Estado: hover #3da8a0 · active #2e9692 · translateY(1px)']} />
        </CompCol>
        <CompCol title="Variantes · tamaños">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <CompButtonDraw /><CompButtonDraw kind="secondary" label="Cancelar" /><CompButtonDraw kind="danger" state="hover" label="Eliminar" />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <CompButtonDraw size="default" label="Default" /><CompButtonDraw size="small" label="Small" /><CompButtonDraw size="xsmall" label="XSmall" />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['rest', 'hover', 'active', 'disabled'].map((s) => <CompButtonDraw key={s} size="small" state={s} label={s} />)}
          </div>
        </CompCol>
        <CompCol title="Propuesta de accesibilidad">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: 4, justifyItems: 'center' }}><CompButtonDraw /><span style={{ fontSize: 10, color: '#b4413a' }}>Actual 2,45:1</span></div>
            <div style={{ display: 'grid', gap: 4, justifyItems: 'center' }}><CompButtonDraw proposal /><span style={{ fontSize: 10, color: '#1f7a75' }}>Navy 7,10:1</span></div>
          </div>
          <CompNote items={['Mantener el relleno de identidad y cambiar solo la tinta a navy.', 'Alternativa: relleno #1f7a75 con blanco (5,12:1) si se prefiere texto claro.', 'Secundario en hover: texto #1f7a75, no #49b6ad.']} />
        </CompCol>
      </div>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        <CompCol title="Usar"><CompNote items={['Una acción primaria por vista o modal.', 'Default en encabezados y formularios; small en toolbars; xsmall en esquinas densas.', 'Peligro solo para acciones destructivas o cancelar.']} /></CompCol>
        <CompCol title="Trasladar a marca"><CompNote items={['Píldora + borde 2 px = forma de CTA para web y banners.', 'En publicaciones estáticas no se dibujan botones: el CTA es una dirección corta.']} /></CompCol>
      </div>
    </CompSheet>
  );
}

// ---------- PageHeader ----------
function CompPageHeader() {
  const Header = ({ w = 560, cta = true }) => (
    <div style={{ width: w, background: '#fff', borderRadius: 14, boxShadow: 'var(--celuma-shadow-card)', borderLeft: '5px solid #F98D84', padding: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, position: 'relative', flexWrap: 'wrap' }}>
      <div>
        <div style={{ font: '800 24px/1.1 var(--celuma-font-display)' }}>Órdenes</div>
        <div style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>Consulta y gestiona las órdenes de laboratorio</div>
      </div>
      {cta && <CompButtonDraw label="Nueva orden" />}
    </div>
  );
  return (
    <CompSheet name="PageHeader" source="src/components/ui/page_header.tsx" summary="Encabezado de cada vista: tarjeta con borde izquierdo salmón de 5 px, título Baloo 24/800, subtítulo 14 y acción opcional. En móvil el CTA baja y ocupa el ancho.">
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 26 }}>
        <CompCol title="Anatomía">
          <div style={{ position: 'relative', background: 'var(--celuma-bg)', padding: 16, borderRadius: 12 }}>
            <Header />
            <CompCallout n="1" x={10} y={10} /><CompCallout n="2" x={150} y={30} /><CompCallout n="3" x={396} y={78} /><CompCallout n="4" x={440} y={22} />
          </div>
          <CompNote items={['1 · Acento salmón 5 px (tokens.secondary)', '2 · Título h1 Baloo 24/800 navy', '3 · Subtítulo 14 #6b7280 (sobre blanco 4,83:1)', '4 · Slot de acción: CelumaButton primario o chip de estado']} />
        </CompCol>
        <CompCol title="Principio reutilizable">
          <CompNote items={['Principio: “una marca de identidad en el borde, contenido limpio en el centro”.', 'Marca → publicaciones: la regla salmón del eyebrow (Dirección A) y el borde de tarjeta (Dirección B) derivan de aquí.', 'No trasladar la tarjeta completa con sombra a impresos: en papel basta la regla salmón.', 'El salmón nunca como texto ni como color de error (se confunde con peligro #e5484d).']} />
          <div style={{ background: 'var(--celuma-bg)', padding: 12, borderRadius: 12 }}><Header w={300} cta={false} /></div>
        </CompCol>
      </div>
    </CompSheet>
  );
}

// ---------- Chip de estado ----------
function CompChip({ label, color, bg, icon, proposal = false }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: bg, color, borderRadius: 12, fontSize: proposal ? 12 : 11, fontWeight: proposal ? 600 : 500, padding: '4px 10px', border: proposal ? `1px solid ${color}33` : 'none' }}>
      {proposal && icon && <CelIcon name={icon} size={12} color={color} stroke={2.2} />}{label}
    </span>
  );
}

function CompStatusChip() {
  const current = [
    ['Borrador', '#f59e0b', '#fffbeb', '2,07'], ['En revisión', '#3b82f6', '#eff6ff', '3,38'], ['Aprobado', '#10b981', '#ecfdf5', '2,41'],
    ['Publicado', '#22c55e', '#f0fdf4', '2,18'], ['Retractado', '#ef4444', '#fef2f2', '3,44'],
  ];
  const proposal = [
    ['Borrador', '#92400e', '#fffbeb', 'edit', '6,8'], ['En revisión', '#1d4ed8', '#eff6ff', 'eye', '6,2'], ['Aprobado · sin firma', '#047857', '#ecfdf5', 'check', '5,2'],
    ['Publicado', '#ffffff', '#15803d', 'shield-check', '5,0'], ['Retractado', '#b91c1c', '#fef2f2', 'lock', '5,9'],
  ];
  return (
    <CompSheet name="Chip de estado" source="src/components/ui/table_helpers.tsx · status_configs.tsx" summary="Estado de orden, muestra o informe: fondo suave + tinta del mismo tono. Hoy solo texto de 11 px; el color lleva casi toda la señal y “Aprobado” y “Publicado” son indistinguibles (1,11:1 entre tintas).">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        <CompCol title="Actual (implementado)">
          <div style={{ display: 'grid', gap: 8 }}>
            {current.map(([l, c, b, r]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CompChip label={l} color={c} bg={b} /><span style={{ fontSize: 10, color: 'var(--celuma-fg-3)' }}>{r}:1</span></div>)}
          </div>
        </CompCol>
        <CompCol title="Propuesta (no implementada)">
          <div style={{ display: 'grid', gap: 8 }}>
            {proposal.map(([l, c, b, i, r]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CompChip label={l} color={c} bg={b} icon={i} proposal /><span style={{ fontSize: 10, color: 'var(--celuma-fg-3)' }}>≈ {r}:1</span></div>)}
          </div>
        </CompCol>
      </div>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        <CompCol title="Reglas propuestas"><CompNote items={['Tinta tono 700 (≥ 4,5:1) y 12 px mínimo.', 'Icono por estado semántico, igual en chip, pasos y avatar suave.', '“Publicado” cambia de forma (relleno sólido), no solo de tono: es el único estado entregado.', 'Traducir siempre el enum (hoy aparece “APPROVED” en Actividad reciente).']} /></CompCol>
        <CompCol title="Límite con la marca"><CompNote items={['La paleta de estados pertenece al producto; la marca no la usa como decoración.', 'En publicaciones, si se muestra un estado, se usa exactamente el chip del producto.', 'Ratios de la propuesta son estimados; validar en la app antes de adoptar.']} /></CompCol>
      </div>
    </CompSheet>
  );
}

// ---------- FloatingCaptionInput ----------
function CompField({ state = 'rest', label = 'Nombre del paciente', value = '', error }) {
  const border = { rest: '#49b6ad', hover: '#3da8a0', focus: '#3da8a0', error: '#e5484d', disabled: '#e5e7eb' }[state];
  const floating = state === 'focus' || value;
  return (
    <div style={{ width: 250 }}>
      <div style={{ position: 'relative', height: 52, border: `2px solid ${border}`, borderRadius: 12, background: '#fff', boxShadow: state === 'focus' ? '0 0 0 3px rgba(73,182,173,.20)' : 'none' }}>
        <span style={{ position: 'absolute', left: 14, top: floating ? 7 : 16, fontSize: floating ? 12 : 15, color: state === 'error' ? '#e5484d' : floating ? '#3da8a0' : '#6b7280' }}>{label} <span style={{ color: '#e5484d' }}>*</span></span>
        {value && <span style={{ position: 'absolute', left: 14, top: 25, fontSize: 15, color: '#0d1b2a' }}>{value}</span>}
      </div>
      {error && <div style={{ fontSize: 12, color: '#e5484d', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function CompInput() {
  return (
    <CompSheet name="FloatingCaptionInput" source="src/components/ui/floating_caption_input.tsx" summary="Campo con etiqueta flotante, contorno teal de 2 px y radio 12. Familia: Select, MultiSelect, Date, Password y CelumaTextArea comparten el mismo contorno.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>
        <CompCol title="Estados"><CompField /><CompField state="focus" value="Ana Ejemplo" /><CompField state="error" value="A" error="Escribe al menos 2 caracteres" /></CompCol>
        <CompCol title="Reglas"><CompNote items={['Etiqueta visible siempre (flota al escribir); nunca solo placeholder.', 'Asterisco rojo para obligatorios + nota en el pie del formulario.', 'Error: borde, etiqueta y mensaje en rojo; mensaje en texto, no solo color.']} /></CompCol>
        <CompCol title="Accesibilidad (a verificar)"><CompNote items={['Contorno #49b6ad sobre blanco 2,45:1: por debajo de 3:1 para límites de control.', 'Propuesta: contorno en reposo #2e9692 (3,56:1) o #1f7a75; mantener el anillo de foco.', 'Etiqueta flotante #3da8a0 (2,87:1) → #1f7a75.']} /></CompCol>
      </div>
    </CompSheet>
  );
}

// ---------- EmptyState ----------
function CompEmpty() {
  const Empty = ({ color = '#49b6ad', title, desc, action }) => (
    <div style={{ width: 280, display: 'grid', justifyItems: 'center', textAlign: 'center', gap: 10, padding: '28px 18px', background: '#fff', borderRadius: 14, boxShadow: 'var(--celuma-shadow-soft)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: color + '1a', display: 'grid', placeItems: 'center' }}><CelIcon name="inbox" size={28} color={color === '#49b6ad' ? '#1f7a75' : color} /></div>
      <div style={{ font: '700 18px/1.2 var(--celuma-font-display)' }}>{title}</div>
      <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.45 }}>{desc}</div>
      {action && <CompButtonDraw size="small" label={action} />}
    </div>
  );
  return (
    <CompSheet name="EmptyState" source="src/components/ui/empty_state.tsx" summary="Círculo suave con icono, título Baloo 18/700, descripción y acción opcional. Sirve para vacíos, errores de carga y selección pendiente." height={560}>
      <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
        <Empty title="Aún no hay órdenes" desc="Cuando registres una orden aparecerá aquí." action="Nueva orden" />
        <Empty color="#e5484d" title="No se pudo cargar" desc="Revisa tu conexión e inténtalo de nuevo." action="Reintentar" />
        <div style={{ flex: 1 }}>
          <CompCol title="Principio y traslado">
            <CompNote items={['Principio: “soft avatar” = tinta al 10 % de fondo + icono en tinta. Es el mismo lenguaje del chip de estado.', 'Marca: la sección digital del lienzo debería mostrar este componente en lugar de los empty states conceptuales anteriores.', 'Ilustraciones grandes (campo celular) solo en marketing; en la app basta el círculo con icono.', 'Propuesta: icono en #1f7a75 cuando el círculo es teal, para alcanzar 3:1.']} />
          </CompCol>
        </div>
      </div>
    </CompSheet>
  );
}

// ---------- Inventario contrastado ----------
function CompInventory() {
  const rows = [
    ['CelumaButton', 'Documentado', 'Ficha'], ['FloatingCaption* (5)', 'Documentado', 'Ficha'], ['PageHeader', 'Documentado', 'Ficha'],
    ['Chip de estado', 'Documentado (regla de icono no cumplida)', 'Ficha'], ['EmptyState', 'No listado en CELUMA_DESIGN_SYSTEM.md', 'Ficha'],
    ['Panel · ActionButtonPanel', 'Documentado', 'Pendiente'], ['CelumaTable · CelumaPagination', 'Documentado', 'Pendiente'], ['CelumaSteps', 'Documentado', 'Pendiente'],
    ['CelumaTabs · CelumaSwitch', 'No listado', 'Pendiente'], ['SampleStatusPicker', 'No listado', 'Pendiente'], ['NotificationBell · NotificationList', 'No listado', 'Pendiente'],
    ['ConversationThread', 'Documentado', 'Pendiente'], ['RecordCard · ImageGalleryCard · UploadDropzone', 'No listado', 'Pendiente'], ['SidebarCeluma', 'Documentado', 'Pendiente · contraste 2,45:1'],
  ];
  return (
    <CompSheet name="Inventario contrastado" source="celuma-frontend/src/components" summary="Qué existe en la app, si su documentación lo cubre y si ya tiene ficha en este lienzo. Los componentes siguen viviendo en celuma-frontend; no hay paquete compartido." height={600}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.6fr 1fr', fontSize: 11.5 }}>
        {['Componente', 'Documentación en frontend', 'Ficha de marca'].map((h) => <div key={h} style={{ fontWeight: 800, padding: '7px 6px', borderBottom: '2px solid var(--celuma-border)' }}>{h}</div>)}
        {rows.map((r) => r.map((c, i) => <div key={r[0] + i} style={{ padding: '6px', borderBottom: '1px solid var(--celuma-border)', color: i === 0 ? 'var(--celuma-ink)' : 'var(--celuma-fg-2)', fontWeight: i === 0 ? 700 : 400 }}>{c}</div>))}
      </div>
    </CompSheet>
  );
}

Object.assign(window, { CompButton, CompPageHeader, CompStatusChip, CompInput, CompEmpty, CompInventory });
