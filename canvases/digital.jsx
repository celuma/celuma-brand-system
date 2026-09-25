// Artboards preserved from the original Céluma canvas.
function canvasDigital() {
  return (
    <>
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

<DCSection id="web" title="08 · Web y marketing" subtitle="Composiciones para landing pages — hero, encabezados de sección y cierre">
        <DCArtboard id="web-hero" label="Hero · Página principal" width={920} height={460}><HeroComposition /></DCArtboard>
        <DCArtboard id="web-section" label="Encabezado de sección" width={920} height={220}><SectionHeader /></DCArtboard>
        <DCArtboard id="web-cta" label="Banda de cierre · CTA" width={920} height={220}><CTAStrip /></DCArtboard>
      </DCSection>

<DCSection id="presentaciones" title="09 · Presentaciones" subtitle="Plantillas 16:9 — portada, capítulo, contenido, datos y cita">
        <DCArtboard id="slide-title" label="Slide · Portada" width={720} height={405}><SlideTitle /></DCArtboard>
        <DCArtboard id="slide-divider" label="Slide · Sección" width={720} height={405}><SlideDivider /></DCArtboard>
        <DCArtboard id="slide-content" label="Slide · Contenido" width={720} height={405}><SlideContent /></DCArtboard>
        <DCArtboard id="slide-stats" label="Slide · Datos" width={720} height={405}><SlideStats /></DCArtboard>
        <DCArtboard id="slide-quote" label="Slide · Cita" width={720} height={405}><SlideQuote /></DCArtboard>
      </DCSection>
    </>
  );
}
