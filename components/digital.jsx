// Céluma — Digital assets
// Email signatures, onboarding kit, dashboard widgets, empty states, notifications

// ---------- EMAIL SIGNATURES ----------
function EmailSigClassic() {
  return (
    <div className="cel-sheet" style={{ width: 460, padding: '20px 22px', borderRadius: 10 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--celuma-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #fff', boxShadow: 'var(--celuma-shadow-soft)' }}>
          <CelIso size={42} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--celuma-ink)', fontFamily: 'var(--celuma-font-display)' }}>Dra. Lucía Méndez</div>
          <div style={{ fontSize: 11, color: 'var(--celuma-primary)', fontWeight: 600, marginTop: 1 }}>Patóloga senior · Dermatopatología</div>
          <hr className="cel-rule teal" style={{ width: 26, marginTop: 8, marginBottom: 8 }} />
          <div style={{ display: 'grid', gap: 3, fontSize: 11, color: 'var(--celuma-fg-2)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <CelIcon name="mail" size={11} color="var(--celuma-primary)" /> l.mendez@celuma.mx
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <CelIcon name="phone" size={11} color="var(--celuma-primary)" /> +52 55 4129 0488
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <CelIcon name="globe" size={11} color="var(--celuma-primary)" /> celuma.mx
            </div>
          </div>
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--celuma-primary-soft)', borderRadius: 8, fontSize: 10, color: 'var(--celuma-primary)', fontWeight: 600 }}>
            Céluma · ilumina y digitaliza tu laboratorio de patología.
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailSigCompact() {
  return (
    <div className="cel-sheet" style={{ width: 460, padding: '14px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <CelMark size="s" />
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--celuma-border)' }} />
        <div style={{ fontSize: 11, color: 'var(--celuma-ink)', fontWeight: 700 }}>Ing. Rafael Téllez</div>
        <div style={{ fontSize: 10, color: 'var(--celuma-fg-3)' }}>· Director de Implementación</div>
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 14, fontSize: 10, color: 'var(--celuma-fg-3)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><CelIcon name="mail" size={10} color="var(--celuma-primary)" />r.tellez@celuma.mx</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><CelIcon name="phone" size={10} color="var(--celuma-primary)" />+52 55 2089 7124</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><CelIcon name="globe" size={10} color="var(--celuma-primary)" />celuma.mx</span>
      </div>
    </div>
  );
}

function EmailSigBanner() {
  return (
    <div className="cel-sheet" style={{ width: 460, padding: 0, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--celuma-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--celuma-font-display)', color: 'var(--celuma-ink)' }}>Daniela Cano, MD</div>
            <div style={{ fontSize: 10.5, color: 'var(--celuma-fg-3)', marginTop: 2 }}>Patóloga · Subespecialidad GI</div>
          </div>
          <CelMark size="s" />
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 10, color: 'var(--celuma-fg-2)' }}>
          <span>d.cano@celuma.mx</span>
          <span style={{ color: 'var(--celuma-border)' }}>·</span>
          <span>+52 55 4129 0488</span>
          <span style={{ color: 'var(--celuma-border)' }}>·</span>
          <span style={{ color: 'var(--celuma-primary)', fontWeight: 600 }}>celuma.mx</span>
        </div>
      </div>
      {/* Promo banner */}
      <div style={{ position: 'relative', height: 64, background: 'var(--celuma-ink)', color: '#fff', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={460} height={64} density={8} seed={11} opacity={0.35} /></div>
        <CelBlob size={300} x={300} y={-100} color="mint" />
        <div style={{ position: 'relative', height: '100%', padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Próximamente</div>
            <div style={{ fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 14, marginTop: 2 }}>Webinar · IA en microscopía digital</div>
          </div>
          <div style={{ background: 'var(--celuma-primary)', color: '#fff', borderRadius: 100, padding: '6px 14px', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Registrarme <CelIcon name="arrow-right" size={11} color="#fff" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- DASHBOARD HERO ----------
function DashboardHero() {
  return (
    <div className="cel-sheet" style={{ width: 720, height: 240, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--celuma-ink)' }} />
      <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={720} height={240} density={20} seed={7} opacity={0.32} /></div>
      <CelBlob size={520} x={-160} y={-160} color="teal" />
      <CelBlob size={400} x={440} y={40} color="mint" />

      <div style={{ position: 'relative', padding: 30, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 380 }}>
          <div className="cel-eyebrow on-dark" style={{ fontSize: 10 }}>Buenos días, Dra. Méndez</div>
          <div className="t-display" style={{ fontSize: 32, color: '#fff', marginTop: 8, lineHeight: 1 }}>
            12 casos te esperan<br/>esta mañana.
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>
            8 en diagnóstico · 3 en revisión · 1 listo para firma.
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button style={{
              background: 'var(--celuma-primary)', color: '#fff', border: 0,
              padding: '10px 18px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: 'var(--celuma-shadow-cta)',
            }}>Abrir bandeja <CelIcon name="arrow-right" size={12} color="#fff" /></button>
            <button style={{
              background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)',
              padding: '10px 18px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>Ver agenda</button>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <CelIso size={140} />
          <div style={{ position: 'absolute', top: -12, right: -14, background: '#fff', borderRadius: 12, padding: '8px 12px', boxShadow: 'var(--celuma-shadow-float)' }}>
            <div className="cel-eyebrow muted" style={{ fontSize: 8 }}>Hoy</div>
            <div style={{ fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--celuma-ink)' }}>+ 24</div>
            <div style={{ fontSize: 9, color: 'var(--celuma-fg-3)' }}>muestras recibidas</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- EMPTY STATES ----------
function EmptyStateInbox() {
  return (
    <div className="cel-sheet" style={{ width: 380, height: 320, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--celuma-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <CelIcon name="inbox" size={42} color="var(--celuma-primary)" stroke={1.5} />
        <div style={{ position: 'absolute', top: -4, right: -4, background: 'var(--celuma-green-bg)', color: 'var(--celuma-green)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff' }}>
          <CelIcon name="check" size={14} color="currentColor" stroke={2.5} />
        </div>
      </div>
      <div className="t-display" style={{ fontSize: 20, marginTop: 18 }}>Sin actividad reciente.</div>
      <div style={{ fontSize: 12, color: 'var(--celuma-fg-3)', marginTop: 6, lineHeight: 1.6, maxWidth: 260 }}>
        Cuando lleguen nuevas muestras, aparecerán aquí ordenadas por prioridad clínica.
      </div>
      <button style={{
        marginTop: 20,
        background: 'var(--celuma-primary)', color: '#fff', border: 0,
        padding: '10px 18px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
      }}>Registrar muestra</button>
    </div>
  );
}

function EmptyStateSearch() {
  return (
    <div className="cel-sheet cream" style={{ width: 380, height: 320, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <CelBlob size={300} x={-80} y={-80} color="teal" />
      <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        <CelIso size={70} opacity={0.85} />
      </div>
      <div className="t-display" style={{ fontSize: 20, marginTop: 12, position: 'relative' }}>Nada por aquí, todavía.</div>
      <div style={{ fontSize: 12, color: 'var(--celuma-fg-3)', marginTop: 6, lineHeight: 1.6, maxWidth: 260, position: 'relative' }}>
        No encontramos resultados para «<strong style={{ color: 'var(--celuma-ink)' }}>melanoma in situ</strong>». Prueba con otro término o ajusta los filtros.
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8, position: 'relative' }}>
        <span className="cel-pill ghost" style={{ fontSize: 10 }}>Limpiar filtros</span>
        <span className="cel-pill" style={{ fontSize: 10 }}>Ver todos</span>
      </div>
    </div>
  );
}

function EmptyStateOnboard() {
  return (
    <div className="cel-sheet" style={{ width: 380, height: 320, padding: 30, position: 'relative', overflow: 'hidden' }}>
      <CelBlob size={300} x={200} y={150} color="rose" opacity={0.6} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--celuma-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CelIcon name="sparkles" size={22} color="#fff" stroke={2} />
        </div>
        <div className="cel-eyebrow">Bienvenida a Céluma</div>
      </div>
      <div className="t-display" style={{ fontSize: 24, position: 'relative' }}>Empieza por configurar tu sucursal.</div>
      <div style={{ marginTop: 16, display: 'grid', gap: 8, position: 'relative' }}>
        {[
          ['Datos del laboratorio', true],
          ['Equipo médico', false],
          ['Sucursales y direcciones', false],
          ['Plantillas de informe', false],
        ].map(([l, c], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: c ? 'var(--celuma-green-bg)' : '#fff', border: `1px solid ${c ? 'var(--celuma-green-bg)' : 'var(--celuma-border)'}`, borderRadius: 10 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: c ? 'var(--celuma-green)' : '#fff', border: `2px solid ${c ? 'var(--celuma-green)' : 'var(--celuma-border)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {c && <CelIcon name="check" size={10} color="#fff" stroke={3} />}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: c ? 'var(--celuma-green)' : 'var(--celuma-ink)', textDecoration: c ? 'line-through' : 'none' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- NOTIFICATIONS / TOASTS ----------
function NotificationStack() {
  return (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Success */}
      <div className="cel-sheet" style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, borderLeft: '4px solid var(--celuma-green)', borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--celuma-green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CelIcon name="check" size={18} color="var(--celuma-green)" stroke={2.5} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--celuma-ink)' }}>Reporte firmado y enviado.</div>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-3)', marginTop: 2, lineHeight: 1.5 }}>CL‑00482 entregado al médico tratante.</div>
          <div style={{ marginTop: 6, fontSize: 10, color: 'var(--celuma-primary)', fontWeight: 600 }}>Ver bitácora →</div>
        </div>
        <div className="cel-mono" style={{ fontSize: 9, color: 'var(--celuma-fg-3)' }}>09:42</div>
      </div>

      {/* Info — case received */}
      <div className="cel-sheet" style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--celuma-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CelIcon name="beaker" size={18} color="var(--celuma-blue)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--celuma-ink)' }}><strong>Muestra recibida</strong> · sucursal Insurgentes</div>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-3)', marginTop: 2 }}>Biopsia GI · RM, F · 56 a · prioridad rutina</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <CelStatus tone="blue" label="RECIBIDA" />
            <span style={{ fontSize: 10, color: 'var(--celuma-fg-3)' }}>· CL‑00482</span>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="cel-sheet" style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, background: 'var(--celuma-amber-bg)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CelIcon name="bell" size={18} color="var(--celuma-amber)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--celuma-ink)' }}>3 casos rebasan SLA de 48 h.</div>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-2)', marginTop: 2 }}>Asignados a la Dra. Méndez. Reasigna o reprograma.</div>
        </div>
      </div>

      {/* User mention */}
      <div className="cel-sheet" style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--celuma-violet-bg)', color: 'var(--celuma-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--celuma-font-display)', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>DC</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--celuma-ink)' }}><strong>Dra. Cano</strong> te mencionó en CL‑00471</div>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-3)', marginTop: 2, lineHeight: 1.5, fontStyle: 'italic' }}>«Lucía, ¿coincides en clasificarlo como bajo grado?»</div>
        </div>
      </div>
    </div>
  );
}

// ---------- ONBOARDING WELCOME ----------
function OnboardingWelcome() {
  return (
    <div className="cel-sheet" style={{ width: 520, height: 460, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 18 }}>
      <div style={{ height: 200, background: 'var(--celuma-ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}><CelCellField width={520} height={200} density={16} seed={8} opacity={0.35} /></div>
        <CelBlob size={400} x={-100} y={-100} color="teal" />
        <CelBlob size={300} x={350} y={50} color="mint" />
        <div style={{ position: 'relative', padding: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div className="cel-pill on-dark">Bienvenida · 01 / 04</div>
            <div className="t-display" style={{ fontSize: 32, color: '#fff', marginTop: 12, lineHeight: 1 }}>
              Vamos a iluminar<br/>tu laboratorio.
            </div>
          </div>
          <CelIso size={110} />
        </div>
      </div>
      <div style={{ padding: 26 }}>
        <div style={{ fontSize: 13, color: 'var(--celuma-fg-2)', lineHeight: 1.65 }}>
          Te guiaremos en 4 pasos cortos para dejar lista la plataforma para tu equipo: datos de la unidad, sucursales, equipo médico y la primera plantilla de informe.
        </div>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 24, height: 4, borderRadius: 2, background: 'var(--celuma-primary)' }} />
            <div style={{ width: 24, height: 4, borderRadius: 2, background: 'var(--celuma-border)' }} />
            <div style={{ width: 24, height: 4, borderRadius: 2, background: 'var(--celuma-border)' }} />
            <div style={{ width: 24, height: 4, borderRadius: 2, background: 'var(--celuma-border)' }} />
          </div>
          <button style={{
            background: 'var(--celuma-primary)', color: '#fff', border: 0,
            padding: '12px 22px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: 'var(--celuma-shadow-cta-sm)',
          }}>Empezar <CelIcon name="arrow-right" size={13} color="#fff" /></button>
        </div>
      </div>
    </div>
  );
}

// ---------- DASHBOARD STAT CARDS (reusable visuals) ----------
function StatTiles() {
  const tiles = [
    { eyebrow: 'EN PROCESO', n: '12', sub: 'casos activos', tone: 'amber', icon: 'beaker' },
    { eyebrow: 'EN REVISIÓN', n: '03', sub: 'pendientes hoy', tone: 'pink', icon: 'eye' },
    { eyebrow: 'FIRMADOS', n: '08', sub: 'esta jornada', tone: 'green', icon: 'shield-check' },
    { eyebrow: 'TIEMPO MEDIO', n: '34 h', sub: 'recepción → firma', tone: 'blue', icon: 'calendar' },
  ];
  return (
    <div style={{ width: 720, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {tiles.map((t, i) => (
        <div key={i} className="cel-sheet" style={{ padding: 18, borderRadius: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="cel-eyebrow muted" style={{ fontSize: 9 }}>{t.eyebrow}</div>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `var(--celuma-${t.tone}-bg)`, color: `var(--celuma-${t.tone})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CelIcon name={t.icon} size={14} color="currentColor" />
            </div>
          </div>
          <div className="t-display" style={{ fontSize: 36, marginTop: 12 }}>{t.n}</div>
          <div style={{ fontSize: 11, color: 'var(--celuma-fg-3)', marginTop: 2 }}>{t.sub}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  EmailSigClassic, EmailSigCompact, EmailSigBanner,
  DashboardHero, EmptyStateInbox, EmptyStateSearch, EmptyStateOnboard,
  NotificationStack, OnboardingWelcome, StatTiles,
});
