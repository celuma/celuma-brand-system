// Céluma — shared atoms used across all artifact components
// Exported to window for cross-file access.

// --- Logo lockup ---
function CelMark({ size = 'm', stacked = false, onDark = false, sub = null, withWord = true, className = '' }) {
  const cls = ['cel-mark', size, stacked ? 'stacked' : '', onDark ? 'on-dark' : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      <span className="iso" aria-hidden="true"></span>
      {withWord && (
        <span className="word">
          <span>
            C<span className="accent">é</span>luma
            {sub && <span className="sub">{sub}</span>}
          </span>
        </span>
      )}
    </span>
  );
}

// --- Isotype only at a given pixel size ---
function CelIso({ size = 24, opacity = 1, style = {} }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: size, height: size,
        background: `url("assets/celuma-isotipo.png") center/contain no-repeat`,
        opacity,
        ...style,
      }}
    />
  );
}

// --- SVG cell field — clusters of soft circles inspired by isotipo ---
function CelCellField({ width = 600, height = 200, density = 18, seed = 1, opacity = 0.55, palette = ['#0f8b8d','#49b6ad','#c8ecdc','#e6f7f7'] }) {
  // Deterministic pseudo-random
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const cells = [];
  for (let i = 0; i < density; i++) {
    const r = 6 + rnd() * 28;
    const cx = rnd() * width;
    const cy = rnd() * height;
    const fill = palette[Math.floor(rnd() * palette.length)];
    const stroke = '#0f8b8d';
    const filled = rnd() > 0.45;
    cells.push(
      <g key={i}>
        {filled ? (
          <circle cx={cx} cy={cy} r={r} fill={fill} opacity={0.35 + rnd() * 0.45} />
        ) : (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="1.2" opacity={0.35 + rnd() * 0.4} />
        )}
        {filled && rnd() > 0.5 && (
          <circle cx={cx + (rnd() - 0.5) * r * 0.4} cy={cy + (rnd() - 0.5) * r * 0.4} r={r * 0.35} fill="#e58a8a" opacity="0.65" />
        )}
      </g>
    );
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ opacity }}>
      {cells}
    </svg>
  );
}

// --- Contour / wave lines pattern (abstract biomedical topography) ---
function CelContour({ width = 600, height = 200, color = 'rgba(15,139,141,0.18)', count = 8 }) {
  const lines = [];
  for (let i = 0; i < count; i++) {
    const y = (height / count) * i + 20;
    const amp = 8 + (i % 3) * 4;
    const len = width;
    let d = `M 0 ${y}`;
    const steps = 16;
    for (let j = 1; j <= steps; j++) {
      const x = (len / steps) * j;
      const off = Math.sin(j * 0.6 + i) * amp;
      d += ` L ${x} ${y + off}`;
    }
    lines.push(<path key={i} d={d} fill="none" stroke={color} strokeWidth="1.2" />);
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      {lines}
    </svg>
  );
}

// --- Dotted grid (microscope) ---
function CelDots({ size = 14, color = 'rgba(15,139,141,0.22)', style = {} }) {
  return <div style={{
    backgroundImage: `radial-gradient(${color} 1.2px, transparent 1.4px)`,
    backgroundSize: `${size}px ${size}px`,
    ...style,
  }} />;
}

// --- Hairline grid (technical) ---
function CelGrid({ size = 24, color = 'rgba(13,27,42,0.06)', style = {} }) {
  return <div style={{
    backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
    ...style,
  }} />;
}

// --- Barcode (faux Code 128 look) ---
function CelBarcode({ value = 'CEL-000000', width = 180, height = 36, color = '#0d1b2a' }) {
  let s = 0; for (let i = 0; i < value.length; i++) s = (s * 31 + value.charCodeAt(i)) >>> 0;
  const rnd = () => { s = (s * 9301 + 49297) >>> 0; return (s % 1000) / 1000; };
  const bars = [];
  let x = 4;
  while (x < width - 4) {
    const w = 1 + Math.floor(rnd() * 3);
    const black = rnd() > 0.45;
    if (black) bars.push(<rect key={x} x={x} y={0} width={w} height={height - 12} fill={color} />);
    x += w + 1;
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      {bars}
      <text x={width / 2} y={height - 2} textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="8" fill={color} letterSpacing="1.4">{value}</text>
    </svg>
  );
}

// --- Faux QR code (decorative) ---
function CelQR({ size = 64, color = '#0d1b2a', seed = 7 }) {
  const N = 21; const cell = size / N;
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const cells = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      // Position markers in 3 corners
      const inCorner = (x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8);
      let filled;
      if (inCorner) {
        const lx = x < 7 ? x : N - 1 - x;
        const ly = y < 7 ? y : N - 1 - y;
        const onEdge = lx === 0 || lx === 6 || ly === 0 || ly === 6;
        const inner = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
        filled = onEdge || inner;
      } else {
        filled = rnd() > 0.55;
      }
      if (filled) cells.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={color} />);
    }
  }
  return <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>{cells}</svg>;
}

// --- Status dot ---
function CelStatus({ tone = 'green', label }) {
  const colors = {
    green: ['var(--celuma-green-bg)','var(--celuma-green)'],
    amber: ['var(--celuma-amber-bg)','var(--celuma-amber)'],
    blue:  ['var(--celuma-blue-bg)', 'var(--celuma-blue)'],
    violet:['var(--celuma-violet-bg)','var(--celuma-violet)'],
    pink:  ['var(--celuma-pink-bg)', 'var(--celuma-pink)'],
    red:   ['var(--celuma-red-bg)',  'var(--celuma-red)'],
    gray:  ['var(--celuma-gray-bg)', 'var(--celuma-gray)'],
  };
  const [bg, fg] = colors[tone] || colors.gray;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: bg, color: fg, padding: '3px 10px',
      borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: 0.2,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />
      {label}
    </span>
  );
}

// --- Lucide-ish stroke icons drawn inline (no CDN dependency) ---
function CelIcon({ name, size = 16, stroke = 1.8, color = 'currentColor' }) {
  const paths = {
    'file-text': <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6M9 9h2" /></>,
    'shield-check': <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
    'check': <path d="M5 12l5 5L20 7" />,
    'check-circle': <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-5" /></>,
    'arrow-right': <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
    'mail': <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" /></>,
    'phone': <path d="M5 4h3l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
    'map-pin': <><path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z" /><circle cx="12" cy="9" r="2.5" /></>,
    'globe': <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>,
    'microscope': <><path d="M7 21h10" /><path d="M9 17l3-3 3 3" /><path d="M12 14V8" /><circle cx="14" cy="6" r="3" /><path d="M7 21v-2a4 4 0 0 1 4-4" /></>,
    'flask': <><path d="M9 3v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-10V3" /><path d="M8 3h8" /><path d="M6.5 14h11" /></>,
    'user': <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    'users': <><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 4a3.5 3.5 0 0 1 0 7" /><path d="M16 14a6 6 0 0 1 5 6" /></>,
    'home': <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
    'bar-chart': <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    'inbox': <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5 4h14l3 8v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z" /></>,
    'plus': <><path d="M12 5v14M5 12h14" /></>,
    'settings': <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
    'sparkles': <><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /><path d="M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /></>,
    'beaker': <><path d="M8 3h8" /><path d="M9 3v8L4 20a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3" /></>,
    'clipboard': <><rect x="6" y="4" width="12" height="18" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M9 12h6M9 16h6M9 8h2" /></>,
    'fingerprint': <><path d="M6 11a6 6 0 0 1 12 0" /><path d="M9 14a3 3 0 0 1 6 0v3" /><path d="M12 14v6" /><path d="M5 16c0-3 1-5 2-6" /><path d="M17 20c1-2 2-4 2-7" /></>,
    'eye': <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
    'lock': <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    'bell': <><path d="M6 9a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    'calendar': <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
    'download': <><path d="M12 4v12" /><path d="M7 11l5 5 5-5" /><path d="M5 20h14" /></>,
    'link': <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1" /></>,
    'menu': <path d="M3 6h18M3 12h18M3 18h18" />,
    'search': <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>,
    'edit': <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z" /></>,
  };
  const p = paths[name] || paths['check'];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      {p}
    </svg>
  );
}

// --- Soft radial blob (corner atmosphere) ---
function CelBlob({ size = 480, x = 0, y = 0, color = 'teal', opacity = 1 }) {
  const colors = {
    teal: 'rgba(15,139,141,0.18)',
    mint: 'rgba(73,182,173,0.22)',
    rose: 'rgba(229,138,138,0.16)',
    gold: 'rgba(240,199,94,0.18)',
  };
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width: size, height: size,
      pointerEvents: 'none',
      opacity,
      background: `radial-gradient(circle at center, ${colors[color]} 0%, ${colors[color].replace(/0\.\d+/, '0.04')} 40%, rgba(0,0,0,0) 70%)`,
    }} />
  );
}

Object.assign(window, {
  CelMark, CelIso, CelCellField, CelContour, CelDots, CelGrid,
  CelBarcode, CelQR, CelStatus, CelIcon, CelBlob,
});
