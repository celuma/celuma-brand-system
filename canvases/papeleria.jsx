// Legacy stationery artboards. Every piece here is a VISUAL EXPLORATION of the
// brand: not approved, not an operational template (see docs/estado-de-piezas.md).
function canvasPapeleria() {
  return (
    <>
<DCSection id="papeleria" title="Exploración · 02 · Papelería corporativa" subtitle="Exploración visual de marca · no aprobada ni plantilla operativa · hojas, tarjetas, sobres y carpetas en variantes A/B/C sin elegir">
        <DCArtboard id="lh-classic" label="Exploración · Hoja membretada · A" width={460} height={651}><CelExploration><LetterheadClassic /></CelExploration></DCArtboard>
        <DCArtboard id="lh-sideband" label="Exploración · Hoja membretada · B" width={460} height={651}><CelExploration><LetterheadSideBand /></CelExploration></DCArtboard>
        <DCArtboard id="lh-editorial" label="Exploración · Hoja membretada · C" width={460} height={651}><CelExploration><LetterheadEditorial /></CelExploration></DCArtboard>

        <DCArtboard id="bc-a-front" label="Exploración · Tarjeta A · Frente" width={340} height={215}><CelExploration><BizCardFrontA /></CelExploration></DCArtboard>
        <DCArtboard id="bc-a-back" label="Exploración · Tarjeta A · Reverso" width={340} height={215}><CelExploration><BizCardBackA /></CelExploration></DCArtboard>
        <DCArtboard id="bc-b-front" label="Exploración · Tarjeta B · Frente" width={340} height={215}><CelExploration><BizCardFrontB /></CelExploration></DCArtboard>
        <DCArtboard id="bc-b-back" label="Exploración · Tarjeta B · Reverso" width={340} height={215}><CelExploration><BizCardBackB /></CelExploration></DCArtboard>
        <DCArtboard id="bc-c-front" label="Exploración · Tarjeta C · Frente" width={340} height={215}><CelExploration><BizCardFrontC /></CelExploration></DCArtboard>
        <DCArtboard id="bc-c-back" label="Exploración · Tarjeta C · Reverso" width={340} height={215}><CelExploration><BizCardBackC /></CelExploration></DCArtboard>

        <DCArtboard id="env-classic" label="Exploración · Sobre DL · Clásico" width={460} height={220}><CelExploration><EnvelopeClassic /></CelExploration></DCArtboard>
        <DCArtboard id="env-bold" label="Exploración · Sobre DL · Confidencial" width={460} height={220}><CelExploration><EnvelopeBold /></CelExploration></DCArtboard>

        <DCArtboard id="folder-dark" label="Exploración · Carpeta institucional · Nocturna" width={440} height={580}><CelExploration><FolderCover /></CelExploration></DCArtboard>
        <DCArtboard id="folder-light" label="Exploración · Carpeta institucional · Luminosa" width={440} height={580}><CelExploration><FolderCoverLight /></CelExploration></DCArtboard>
      </DCSection>

<DCSection id="documentos" title="Exploración · 03 · Documentos y editorial" subtitle="Exploración visual de marca · no aprobada ni plantilla operativa · el informe es un ejemplo visual: en el producto cada informe usa el membrete del laboratorio cliente">
        <DCArtboard id="doc-cover-bold" label="Exploración · Portada · White paper" width={460} height={651}><CelExploration><DocCoverBold /></CelExploration></DCArtboard>
        <DCArtboard id="doc-cover-edi" label="Exploración · Portada · Manual operativo" width={460} height={651}><CelExploration><DocCoverEditorial /></CelExploration></DCArtboard>
        <DCArtboard id="report-cover" label="Exploración · Informe · ejemplo visual · Portada" width={460} height={651}><CelExploration><ClinicalReportCover /></CelExploration></DCArtboard>
        <DCArtboard id="report-page" label="Exploración · Informe · ejemplo visual · Página 1" width={460} height={651}><CelExploration><ClinicalReportPage /></CelExploration></DCArtboard>
        <DCArtboard id="report-page-2" label="Exploración · Informe · ejemplo visual · Página 2" width={460} height={651}><CelExploration><ClinicalReportPage2 /></CelExploration></DCArtboard>
        <DCArtboard id="internal-form" label="Exploración · Formato interno · Recepción" width={460} height={651}><CelExploration><InternalForm /></CelExploration></DCArtboard>
        <DCArtboard id="header-footer" label="Exploración · Headers y footers · Sistema editorial" width={580} height={520}><CelExploration><HeaderStripVariants /></CelExploration></DCArtboard>
      </DCSection>

<DCSection id="labops" title="Exploración · 04 · Operativo de laboratorio" subtitle="Exploración visual de marca · no aprobada ni plantilla operativa · etiquetas sin especificación de impresora ni códigos reales">
        <DCArtboard id="lab-tube" label="Exploración · Etiqueta de tubo / vial" width={340} height={106}><CelExploration below><TubeLabel /></CelExploration></DCArtboard>
        <DCArtboard id="lab-cassette" label="Exploración · Etiqueta de cassette" width={200} height={146}><CelExploration below><CassetteLabel /></CelExploration></DCArtboard>
        <DCArtboard id="lab-slide" label="Exploración · Etiqueta de lámina" width={200} height={146}><CelExploration below><SlideLabel /></CelExploration></DCArtboard>
        <DCArtboard id="lab-block" label="Exploración · Etiqueta de bloque" width={200} height={146}><CelExploration below><BlockLabel /></CelExploration></DCArtboard>
        <DCArtboard id="lab-container" label="Exploración · Etiqueta de contenedor" width={340} height={216}><CelExploration below><ContainerLabel /></CelExploration></DCArtboard>

        <DCArtboard id="sticker-brand" label="Exploración · Sticker redondo · marca" width={180} height={180}><CelExploration><StickerRoundBrand /></CelExploration></DCArtboard>
        <DCArtboard id="sticker-value-a" label="Exploración · Sticker valor · Claridad" width={180} height={180}><CelExploration><StickerRoundValue glyph="✦" title="Claridad" /></CelExploration></DCArtboard>
        <DCArtboard id="sticker-value-b" label="Exploración · Sticker valor · Precisión" width={180} height={180}><CelExploration><StickerRoundValue glyph="◎" title="Precisión" tone="dark" /></CelExploration></DCArtboard>
        <DCArtboard id="sticker-hex" label="Exploración · Sticker hex · API" width={200} height={174}><CelExploration><StickerHex /></CelExploration></DCArtboard>
        <DCArtboard id="sticker-square" label="Exploración · Sticker cuadrado" width={180} height={180}><CelExploration><StickerSquare /></CelExploration></DCArtboard>
        <DCArtboard id="sticker-bumper" label="Exploración · Sticker bumper" width={360} height={110}><CelExploration><StickerBumper /></CelExploration></DCArtboard>

        <DCArtboard id="badge-staff" label="Exploración · Credencial · Personal médico" width={280} height={440}><CelExploration><StaffBadge /></CelExploration></DCArtboard>
        <DCArtboard id="badge-visitor" label="Exploración · Credencial · Visitante" width={280} height={440}><CelExploration><StaffBadgeMinimal /></CelExploration></DCArtboard>
        <DCArtboard id="lanyard" label="Exploración · Lanyard · Vista" width={240} height={540}><CelExploration><LanyardPreview /></CelExploration></DCArtboard>
      </DCSection>
    </>
  );
}
