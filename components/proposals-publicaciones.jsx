// Céluma — PROPUESTA · Direcciones de composición para publicaciones.
// Nada de este archivo está aprobado. La Dirección A usa contenido comprobado
// en celuma-docs; B y C conservan textos de ejemplo. Sin datos clínicos reales,
// cifras, testimonios, capacidades nuevas ni afirmaciones normativas.
//
// Las piezas se dibujan a escala de lienzo: generalmente 1/3 del tamaño de
// exportación (1080 px → 360 px); el formato 1.91:1 usa 1/2 (1200 px → 600 px).
// La Dirección A usa S (lado corto) y W (ancho); ver PUB_A_RULE. B y C aún
// usan la escala original basada en S. El isotipo mide S·0.075 y su zona de
// protección propuesta es de ½ isotipo alrededor.

const PUB_FORMATS = {
  square:    { w: 360, h: 360, name: '1:1',    export: '1080 × 1080' },
  portrait:  { w: 360, h: 450, name: '4:5',    export: '1080 × 1350' },
  story:     { w: 360, h: 640, name: '9:16',   export: '1080 × 1920' },
  link:      { w: 600, h: 314, name: '1.91:1', export: '1200 × 628' },
  wide:      { w: 640, h: 360, name: '16:9',   export: '1920 × 1080' },
};

// Contenido de ejemplo compartido por las tres direcciones.
const PUB_SAMPLE = {
  eyebrow: 'Guía de uso',
  title: 'Cómo registrar una muestra paso a paso',
  body: 'Una guía breve para el equipo de recepción del laboratorio.',
  cta: 'docs.celuma.mx',
  steps: ['Buscar al paciente', 'Crear la orden', 'Registrar la muestra'],
};

function pubMetrics(fmt) {
  const S = Math.min(fmt.w, fmt.h);
  return {
    S,
    m: Math.round(S / 12),
    eyebrow: Math.max(10, S * 0.034),
    title: S * 0.088,
    body: S * 0.044,
    iso: Math.round(S * 0.075),
    landscape: fmt.w / fmt.h > 1.2,
    tall: fmt.h / fmt.w > 1.5,
  };
}

// Marca de propuesta: pequeña, fuera del contenido principal.
function ProposalTag({ text = 'Propuesta', dark = false }) {
  return (
    <div style={{
      position: 'absolute', top: 6, right: 6, zIndex: 5,
      font: '700 8px/1 var(--celuma-font-body)', letterSpacing: '0.14em', textTransform: 'uppercase',
      padding: '4px 6px', borderRadius: 4,
      color: dark ? '#fff' : 'var(--celuma-ink)',
      background: dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.86)',
      border: `1px dashed ${dark ? 'rgba(255,255,255,0.5)' : 'rgba(13,27,42,0.35)'}`,
    }}>{text}</div>
  );
}

// Lockup reducido: isotipo + "Céluma" en Baloo 2 (tratamiento vigente en app, landing y docs).
function PubLockup({ size, dark = false }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.35 }}>
      <CelIso size={size} />
      <span style={{ font: `800 ${size * 0.72}px/1 var(--celuma-font-display)`, letterSpacing: '-0.02em', color: dark ? '#fff' : 'var(--celuma-ink)' }}>Céluma</span>
    </div>
  );
}

function PubEyebrow({ size, children, dark = false, rule = 'var(--celuma-secondary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.8, font: `700 ${size}px/1 var(--celuma-font-body)`, letterSpacing: '0.14em', textTransform: 'uppercase', color: dark ? '#7dd8d9' : 'var(--celuma-primary-ink)' }}>
      <span style={{ width: size * 2.2, height: Math.max(2, size * 0.22), background: rule, borderRadius: 2 }} />
      {children}
    </div>
  );
}

// ---------------------------------------------------------------
// Dirección A · Lámina clara — editorial sobre crema, un módulo visual.
// ---------------------------------------------------------------
function PubVisualModule({ kind = 'cells', radius = 16, seed = 3 }) {
  if (kind === 'pattern') {
    return <div style={{ position: 'absolute', inset: 0, borderRadius: radius, background: 'var(--celuma-primary-soft)', backgroundImage: 'radial-gradient(rgba(31,122,117,0.28) 1.3px, transparent 1.5px)', backgroundSize: '12px 12px' }} />;
  }
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', background: 'var(--celuma-primary-soft)' }}>
      <CelCellField width={400} height={400} density={26} seed={seed} opacity={0.9} palette={['#c8ecdc', '#49b6ad', '#e6f7f7', '#ffffff']} />
    </div>
  );
}

// Contenidos de prueba, tomados de documentación publicada (celuma-docs).
// Sin datos clínicos ni capacidades no documentadas.
const PUB_CONTENTS = {
  corto: {
    eyebrow: 'Novedades',
    title: 'Céluma 1.3.1 ya está disponible',
    body: 'Revisión y firma de informes.',
    cta: 'docs.celuma.mx',
    source: 'celuma-docs/docs/release-notes/v1-3-1.mdx',
  },
  medio: {
    eyebrow: 'Guía de uso',
    title: 'Cómo registrar una muestra',
    body: 'La orden debe existir antes de registrar la muestra. Consulta la guía para el equipo técnico.',
    cta: 'docs.celuma.mx',
    source: 'celuma-docs/docs/tecnicos/muestras.mdx',
    condensed: { body: 'Primero la orden, luego la muestra.' },
    condensedFor: ['square'],
  },
  largo: {
    eyebrow: 'Novedades · v1.3.1',
    title: 'Reabre un informe aprobado que aún no se ha firmado',
    body: 'El revisor asignado o un administrador pueden reabrirlo para corregirlo. Después debe aprobarse de nuevo antes de firmarse.',
    cta: 'docs.celuma.mx',
    source: 'celuma-docs/docs/release-notes/v1-3-1.mdx',
    // Versión condensada para formatos con menos presupuesto de texto.
    condensed: {
      title: 'Reabre un informe antes de firmarlo',
      body: 'Si se aprobó y aún no se firma.',
    },
    condensedFor: ['square', 'portrait', 'link'],
  },
};

// Regla de la Dirección A (propuesta). S = lado corto, W = ancho.
// El tipo usa el mayor entre una proporción de S y una de W, para que las
// piezas horizontales sigan siendo legibles cuando se ven a ~390 px de ancho.
const PUB_A_RULE = {
  margin: (S) => S / 12,
  zonesTall: { top: 0.14, bottom: 0.20 },     // 9:16: sin texto ni logo
  eyebrow: (S, W) => Math.max(S * 0.034, W * 0.024),
  title: (S, W) => Math.max(S * 0.088, W * 0.048),
  body: (S, W) => Math.max(S * 0.044, W * 0.029),
  iso: (S) => S * 0.075,
  module: { min: 0.30, max: 0.50, aspect: [0.5, 2] }, // área útil y proporción (sin franjas)
  landscapeModuleShare: 0.42,                  // ancho del módulo en horizontales
  lModuleWidth: { square: 0.62, portrait: 0.6 }, // composición en L (1:1 y 4:5)
  // Presupuesto de texto verificado con las pruebas: líneas máximas de título
  // y total de título + texto. Si un contenido lo excede, se usa su versión
  // condensada (el texto completo pasa a la descripción de la publicación).
  budget: {
    square:   { title: 2, total: 3 },
    portrait: { title: 3, total: 5 },
    story:    { title: 3, total: 7 },
    link:     { title: 3, total: 5 },
    wide:     { title: 3, total: 7 },
  },
};

function PubDirA({ format = 'square', visual = 'cells', tag = true, content = 'medio', guides = false }) {
  const fmt = PUB_FORMATS[format];
  const base = PUB_CONTENTS[content] || PUB_CONTENTS.medio;
  const useCondensed = !!base.condensed && (base.condensedFor || []).includes(format);
  const c = useCondensed ? { ...base, ...base.condensed } : base;
  const S = Math.min(fmt.w, fmt.h), W = fmt.w;
  const R = PUB_A_RULE;
  const m = R.margin(S);
  const tall = fmt.h / fmt.w > 1.5, landscape = fmt.w / fmt.h > 1.2, lShape = !tall && !landscape;
  const top = tall ? fmt.h * R.zonesTall.top : m;
  const bottom = tall ? fmt.h * R.zonesTall.bottom : m;
  const safeW = fmt.w - 2 * m, safeH = fmt.h - top - bottom;
  const eb = R.eyebrow(S, W), ti = R.title(S, W), bo = R.body(S, W), iso = R.iso(S);
  const gap = S * 0.035;
  const lGap = m * 0.6;
  const lModW = lShape ? (safeW - lGap) * R.lModuleWidth[format] : 0; // ancho real del módulo en L

  const text = (
    <div data-pub-text style={{ display: 'flex', flexDirection: 'column', gap, minWidth: 0 }}>
      <PubEyebrow size={eb}>{c.eyebrow}</PubEyebrow>
      <div data-pub-title style={{ font: `800 ${ti}px/1.04 var(--celuma-font-display)`, letterSpacing: '-0.02em', color: 'var(--celuma-ink)', textWrap: 'balance' }}>{c.title}</div>
      <div data-pub-body style={{ font: `400 ${bo}px/1.4 var(--celuma-font-body)`, color: 'var(--celuma-fg-2)', textWrap: 'pretty' }}>{c.body}</div>
    </div>
  );
  const footer = (
    <div data-pub-footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <PubLockup size={iso} />
      <span data-pub-cta style={{ font: `700 ${bo * 0.85}px/1 var(--celuma-font-body)`, color: 'var(--celuma-primary-ink)', whiteSpace: 'nowrap' }}>{c.cta}</span>
    </div>
  );
  const moduleEl = <div data-pub-module style={{ position: 'relative', width: '100%', height: '100%' }}><PubVisualModule kind={visual} seed={format.length + content.length} /></div>;

  return (
    <div data-pub-root data-format={format} data-content={content} data-condensed={useCondensed ? '1' : '0'} style={{ width: fmt.w, height: fmt.h, position: 'relative', overflow: 'hidden', background: 'var(--celuma-bg)', color: 'var(--celuma-ink)' }}>
      {tag && <ProposalTag />}
      {guides && tall && (<>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: top, background: 'rgba(249,141,132,0.16)', borderBottom: '1px dashed #c2554c' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: bottom, background: 'rgba(249,141,132,0.16)', borderTop: '1px dashed #c2554c' }} />
      </>)}
      <div data-pub-safe style={{ position: 'absolute', left: m, top, width: safeW, height: safeH, outline: guides ? '1px dashed rgba(194,85,76,0.6)' : 'none' }}>
        {landscape ? (
          <div style={{ height: '100%', display: 'grid', gridTemplateColumns: `${1 - R.landscapeModuleShare}fr ${R.landscapeModuleShare}fr`, gap: m }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>{text}{footer}</div>
            {moduleEl}
          </div>
        ) : lShape ? (
          // Composición en L: texto arriba; firma abajo a la izquierda y módulo casi cuadrado a la derecha.
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: gap * 0.9 }}>
            {text}
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: `${1 - R.lModuleWidth[format]}fr ${R.lModuleWidth[format]}fr`, gap: lGap }}>
              <div data-pub-footer style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: iso * 0.45, minWidth: 0 }}>
                <span data-pub-cta style={{ font: `700 ${Math.max(eb, bo * 0.75)}px/1.2 var(--celuma-font-body)`, color: 'var(--celuma-primary-ink)', whiteSpace: 'nowrap' }}>{c.cta}</span>
                <PubLockup size={iso} />
              </div>
              <div style={{ alignSelf: 'end', height: '100%', minHeight: (R.module.min * safeW * safeH) / lModW, maxHeight: (R.module.max * safeW * safeH) / lModW }}>{moduleEl}</div>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: gap * 1.2 }}>
            {text}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch' }}>
              <div style={{ width: '100%', alignSelf: 'center', height: '100%', minHeight: Math.max(safeH * R.module.min, safeW / R.module.aspect[1]), maxHeight: safeH * R.module.max }}>{moduleEl}</div>
            </div>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Dirección B · Ficha de producto — módulos de la app (tarjeta con borde salmón,
// chips suaves, pasos numerados). Fragmentos de interfaz abstractos, sin datos.
// ---------------------------------------------------------------
function PubDirB({ format = 'square', tag = true }) {
  const fmt = PUB_FORMATS[format];
  const k = pubMetrics(fmt);
  const compact = !k.landscape && !k.tall;
  const sp = compact ? 0.6 : 1;
  const card = (
    <div style={{ background: '#fff', borderRadius: k.S * 0.04, borderLeft: `${Math.max(3, k.S * 0.012)}px solid var(--celuma-secondary)`, boxShadow: 'var(--celuma-shadow-card)', padding: k.m * (compact ? 0.6 : 0.8), display: 'flex', flexDirection: 'column', gap: k.S * 0.03 * sp }}>
      <span style={{ alignSelf: 'flex-start', font: `700 ${k.eyebrow}px/1 var(--celuma-font-body)`, padding: `${k.eyebrow * 0.5}px ${k.eyebrow}px`, borderRadius: 999, background: 'var(--celuma-primary-soft)', color: 'var(--celuma-primary-ink)' }}>{PUB_SAMPLE.eyebrow}</span>
      <div style={{ font: `800 ${k.title * (compact ? 0.74 : 0.86)}px/1.06 var(--celuma-font-display)`, letterSpacing: '-0.02em' }}>{PUB_SAMPLE.title}</div>
    </div>
  );
  const steps = (
    <div style={{ display: 'grid', gap: k.S * 0.022 * sp }}>
      {PUB_SAMPLE.steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: k.S * 0.03, background: '#fff', border: '2px solid var(--celuma-border)', borderRadius: k.S * 0.033, padding: `${k.S * 0.022 * sp}px ${k.S * 0.03}px` }}>
          <span style={{ width: k.S * 0.075, height: k.S * 0.075, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(73,182,173,0.14)', border: '2px solid rgba(73,182,173,0.35)', color: 'var(--celuma-primary-ink)', font: `800 ${k.body}px/1 var(--celuma-font-display)` }}>{i + 1}</span>
          <span style={{ font: `600 ${k.body}px/1.2 var(--celuma-font-body)`, color: 'var(--celuma-ink)' }}>{s}</span>
        </div>
      ))}
    </div>
  );
  const footer = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <PubLockup size={k.iso} />
      <span style={{ font: `700 ${k.body * 0.82}px/1 var(--celuma-font-body)`, color: 'var(--celuma-primary-ink)' }}>{PUB_SAMPLE.cta}</span>
    </div>
  );
  const pad = k.tall ? `${fmt.h * 0.14}px ${k.m}px ${fmt.h * 0.2}px` : `${k.m}px`;
  return (
    <div style={{ width: fmt.w, height: fmt.h, position: 'relative', overflow: 'hidden', background: 'var(--celuma-bg)', color: 'var(--celuma-ink)' }}>
      {tag && <ProposalTag />}
      {k.landscape ? (
        <div style={{ position: 'absolute', inset: 0, padding: pad, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: k.m * 0.8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>{card}{footer}</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>{steps}</div>
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, padding: pad, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: k.m * 0.6 }}>
          {card}{steps}{footer}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------
// Dirección C · Luz nocturna — navy, tipografía grande, luz del isotipo.
// ---------------------------------------------------------------
function PubDirC({ format = 'square', tag = true }) {
  const fmt = PUB_FORMATS[format];
  const k = pubMetrics(fmt);
  const pad = k.tall ? `${fmt.h * 0.14}px ${k.m}px ${fmt.h * 0.2}px` : `${k.m}px`;
  return (
    <div style={{ width: fmt.w, height: fmt.h, position: 'relative', overflow: 'hidden', background: 'var(--celuma-ink)', color: '#fff' }}>
      {tag && <ProposalTag dark />}
      <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={fmt.w} height={fmt.h} density={Math.round(fmt.w * fmt.h / 14000)} seed={7} opacity={0.2} /></div>
      <CelBlob size={k.S * 1.3} x={fmt.w - k.S * 0.8} y={-k.S * 0.5} color="teal" />
      <div style={{ position: 'absolute', inset: 0, padding: pad, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <PubLockup size={k.iso} dark />
        <div style={{ display: 'flex', flexDirection: 'column', gap: k.S * 0.035, maxWidth: k.landscape ? '70%' : '100%' }}>
          <PubEyebrow size={k.eyebrow} dark>Sesión informativa</PubEyebrow>
          <div style={{ font: `800 ${k.title * 1.05}px/1.02 var(--celuma-font-display)`, letterSpacing: '-0.02em' }}>
            Conoce el flujo de <span style={{ color: '#7dd8d9' }}>Céluma</span> con tu equipo
          </div>
          <div style={{ font: `400 ${k.body}px/1.45 var(--celuma-font-body)`, color: 'var(--celuma-on-dark-1)' }}>Fecha y registro por confirmar.</div>
        </div>
        <span style={{ alignSelf: 'flex-start', font: `700 ${k.body * 0.9}px/1 var(--celuma-font-body)`, padding: `${k.body * 0.7}px ${k.body * 1.2}px`, borderRadius: 999, background: 'var(--celuma-primary)', color: 'var(--celuma-on-primary)' }}>celuma.mx</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Anatomía de la dirección recomendada (A): márgenes, zonas y proporciones.
// ---------------------------------------------------------------
function PubAnatomyA() {
  const rules = [
    ['Área útil', 'Margen m = S/12. En 9:16, además, sin texto ni logo en el 14 % superior ni el 20 % inferior (franjas salmón).'],
    ['Tipo', 'Eyebrow = máx(S·0,034; W·0,024) · título = máx(S·0,088; W·0,048) · texto = máx(S·0,044; W·0,029). El término en W mantiene legibles las piezas horizontales vistas a ~390 px.'],
    ['Presupuesto de líneas', '1:1 → título ≤ 2, total ≤ 3 · 4:5 → ≤ 3 / 5 · 9:16 → ≤ 3 / 7 · 1.91:1 → ≤ 3 / 5 · 16:9 → ≤ 3 / 7. Si no cabe, versión condensada; el texto completo va en la descripción.'],
    ['Módulo visual', '30–50 % del área útil y proporción entre 1:2 y 2:1 (nunca franja). 1:1 y 4:5 en L; 9:16 apilado; horizontales en columna (42 % del ancho).'],
    ['Firma', 'Isotipo S·0,075 + “Céluma”; protección ½ isotipo. En L: dirección y lockup abajo a la izquierda; en el resto, lockup a la izquierda y dirección a la derecha.'],
    ['CTA', 'Dirección corta en una sola línea, en tinta #1f7a75. El botón solo en canales con clic.'],
    ['Salmón', 'Solo la regla del eyebrow.'],
  ];
  return (
    <div style={{ width: 1180, height: 840, background: '#fff', padding: 32, position: 'relative', fontFamily: 'var(--celuma-font-body)', color: 'var(--celuma-ink)' }}>
      <ProposalTag />
      <div className="cel-eyebrow">Propuesta · Dirección A · anatomía (verificada con pruebas)</div>
      <div className="t-display" style={{ fontSize: 26, marginTop: 8 }}>Reglas derivadas del lado corto (S) y del ancho (W)</div>
      <div style={{ display: 'flex', gap: 22, marginTop: 20, alignItems: 'flex-start' }}>
        <PubDirA format="square" content="medio" tag={false} guides />
        <PubDirA format="story" content="medio" tag={false} guides />
        <div style={{ fontSize: 11.5, lineHeight: 1.5, color: 'var(--celuma-fg-2)', display: 'grid', gap: 9, width: 380 }}>
          {rules.map(([t, d]) => (<div key={t}><strong style={{ color: 'var(--celuma-ink)' }}>{t}.</strong> {d}</div>))}
          <div style={{ marginTop: 4, fontSize: 10.5, color: 'var(--celuma-fg-3)' }}>Contenidos de prueba: docs.celuma.mx (notas 1.3.1 y guía de muestras). Medición automática en docs/revision-grafica/scripts/measure-a.mjs.</div>
        </div>
      </div>
    </div>
  );
}

// Usos correctos e incorrectos (miniaturas).
function PubDoDont() {
  const Mini = ({ ok, title, note, children }) => (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ width: 200, height: 150, position: 'relative', borderRadius: 10, overflow: 'hidden', border: `2px solid ${ok ? '#1f7a75' : '#c2554c'}` }}>{children}</div>
      <div style={{ fontSize: 11, fontWeight: 800, color: ok ? '#1f7a75' : '#b4413a' }}>{ok ? '✓ Correcto' : '✕ Incorrecto'} · {title}</div>
      <div style={{ fontSize: 10, color: 'var(--celuma-fg-2)', lineHeight: 1.45, maxWidth: 200 }}>{note}</div>
    </div>
  );
  const base = { position: 'absolute', inset: 0, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
  return (
    <div style={{ width: 980, height: 520, background: '#fff', padding: 32, position: 'relative', fontFamily: 'var(--celuma-font-body)' }}>
      <ProposalTag />
      <div className="cel-eyebrow">Propuesta · usos correctos e incorrectos</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: 28, marginTop: 20 }}>
        <Mini ok title="Tinta sobre teal" note="Botón #49b6ad con texto navy (7,1:1).">
          <div style={{ ...base, background: 'var(--celuma-bg)', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ padding: '10px 18px', borderRadius: 999, background: '#49b6ad', color: '#0d1b2a', fontWeight: 800, fontSize: 13 }}>celuma.mx</span>
          </div>
        </Mini>
        <Mini title="Blanco sobre teal claro" note="Blanco sobre #49b6ad = 2,45:1. No cumple AA.">
          <div style={{ ...base, background: 'var(--celuma-bg)', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ padding: '10px 18px', borderRadius: 999, background: '#49b6ad', color: '#fff', fontWeight: 800, fontSize: 13 }}>celuma.mx</span>
          </div>
        </Mini>
        <Mini ok title="Ilustración declarada" note="Formas abstractas, sin escala ni tinción. Nunca en un espacio de imagen clínica.">
          <div style={{ position: 'absolute', inset: 0 }}><PubVisualModule radius={0} seed={5} /></div>
        </Mini>
        <Mini title="Simular una micrografía" note="Un rótulo tipo “40× · H&E” convierte la decoración en falsa evidencia diagnóstica.">
          <div style={{ position: 'absolute', inset: 0 }}><PubVisualModule radius={0} seed={5} /></div>
          <span style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(13,27,42,.75)', color: '#fff', font: '10px var(--celuma-font-mono)', padding: '2px 6px', borderRadius: 4 }}>40× · H&amp;E</span>
        </Mini>
        <Mini ok title="Logotipo con aire" note="Proporción original, protección de ½ isotipo, sobre fondo liso.">
          <div style={{ ...base, background: 'var(--celuma-bg)', justifyContent: 'center', alignItems: 'center' }}><PubLockup size={30} /></div>
        </Mini>
        <Mini title="Logotipo deformado o sobre textura" note="No estirar, recolorear ni colocar sobre el campo celular.">
          <div style={{ position: 'absolute', inset: 0 }}><PubVisualModule radius={0} seed={9} /></div>
          <div style={{ ...base, justifyContent: 'center', alignItems: 'center' }}><div style={{ transform: 'scaleX(1.5)' }}><PubLockup size={26} /></div></div>
        </Mini>
        <Mini ok title="Mensaje verificable" note="Describe una función publicada; invita a la guía.">
          <div style={{ ...base, background: 'var(--celuma-bg)' }}>
            <div style={{ font: '800 17px/1.1 var(--celuma-font-display)', color: 'var(--celuma-ink)' }}>Cómo registrar una muestra</div>
            <div style={{ fontSize: 10, color: 'var(--celuma-primary-ink)', fontWeight: 700 }}>docs.celuma.mx</div>
          </div>
        </Mini>
        <Mini title="Cifras o promesas sin fuente" note="“100 %”, tiempos o cumplimiento normativo requieren validación antes de publicarse.">
          <div style={{ ...base, background: 'var(--celuma-bg)' }}>
            <div style={{ font: '800 34px/1 var(--celuma-font-display)', color: 'var(--celuma-ink)' }}>100 %</div>
            <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)' }}>de trazabilidad garantizada</div>
          </div>
        </Mini>
      </div>
    </div>
  );
}

Object.assign(window, { PUB_CONTENTS, PUB_A_RULE, PUB_FORMATS, PubDirA, PubDirB, PubDirC, PubAnatomyA, PubDoDont, ProposalTag, PubLockup });
