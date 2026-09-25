// Artboards preserved from the original Céluma canvas.
function canvasPapeleria() {
  return (
    <>
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

<DCSection id="documentos" title="03 · Documentos y editorial" subtitle="Portadas, reportes clínicos, formatos internos, headers y footers reutilizables">
        <DCArtboard id="doc-cover-bold" label="Portada · White paper" width={460} height={651}><DocCoverBold /></DCArtboard>
        <DCArtboard id="doc-cover-edi" label="Portada · Manual operativo" width={460} height={651}><DocCoverEditorial /></DCArtboard>
        <DCArtboard id="report-cover" label="Reporte clínico · Portada" width={460} height={651}><ClinicalReportCover /></DCArtboard>
        <DCArtboard id="report-page" label="Reporte clínico · Página" width={460} height={651}><ClinicalReportPage /></DCArtboard>
        <DCArtboard id="internal-form" label="Formato interno · Recepción" width={460} height={651}><InternalForm /></DCArtboard>
        <DCArtboard id="header-footer" label="Headers y footers · Sistema editorial" width={580} height={520}><HeaderStripVariants /></DCArtboard>
      </DCSection>

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
    </>
  );
}
