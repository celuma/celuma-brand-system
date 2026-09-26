# Laboratorio visual de Céluma

Espacio para prototipos de identidad, interfaz y comunicación. Todo lo que vive aquí está **en exploración**; verlo o medirlo no equivale a aprobación ni a autorización para publicarlo o llevarlo a producción.

## Abrir el entorno

Desde la raíz de `celuma-brand-system`, ejecute `python3 -m http.server 8000` y abra `http://localhost:8000/labs/`. No abra los HTML con `file://`: las rutas relativas y futuras cargas locales dependen del servidor. El lab funciona sin instalar dependencias ni modificar la entrada de los cuatro lienzos.

## Organización

- `index.html`: entrada del lab y acceso a la plantilla.
- `lab.css`: estilos exclusivos de la entrada.
- `PROMPT_OPUS_01.md`: encargo del primer experimento de refinamiento del frontend.
- `experiments/_template/`: punto de partida para copiar en `experiments/<nombre-corto>/`.
- Cada experimento mantiene su `BRIEF.md`, su vista previa y sus recursos dentro de su carpeta.

La carpeta `_template` no es una propuesta de diseño. Antes de explorar, copie la plantilla con un nombre descriptivo y complete el brief. Registre en la entrada del lab el enlace al experimento y su estado. No reutilice el nombre de un experimento para una dirección distinta.

## Fuentes y límites

- Identidad y estados de aprobación: `../README.md`, `../docs/estado-de-piezas.md` y `../docs/guia-de-publicaciones.md`.
- Tokens de marca: `../styles/celuma-tokens.css`. No cambie los tokens compartidos desde un experimento; anote las variantes locales en su brief.
- UI del producto: `../../celuma-frontend/CELUMA_DESIGN_SYSTEM.md` y código vigente del frontend. El frontend conserva la implementación funcional y los contratos clínicos permanecen en `celuma-engineering`.
- Reutilice `../assets/celuma-isotipo.png` sin redibujarlo. `celuma-logo-v3.png` no es el logotipo vigente. El wordmark oficial y el maestro vectorial siguen pendientes.
- Use únicamente datos e imágenes sintéticos. No incluya información clínica identificable, secretos, exportaciones de clientes ni afirmaciones de capacidades o cumplimiento sin verificar.
- Una ilustración biomédica decorativa no debe parecer imagen diagnóstica. Informes y etiquetas requieren validación de producto y pruebas operativas; el informe clínico pertenece visualmente al laboratorio cliente.

## Ciclo de trabajo

1. **Preparar:** definir hipótesis, superficie, restricciones y criterio de éxito en `BRIEF.md`.
2. **Explorar:** mantener código, estilos y recursos dentro del experimento; rotular la vista como «Exploración · no aprobada».
3. **Revisar:** comparar con la referencia actual; comprobar tamaños previstos, móvil, contraste, foco de teclado y fondos claros/oscuros cuando correspondan. Registrar capturas y observaciones en el brief.
4. **Decidir:** anotar quién revisó, fecha y resultado: `exploración`, `candidata`, `aprobada` o `descartada`. `Candidata` tampoco autoriza publicación.
5. **Incorporar:** solo tras aprobación explícita, crear un cambio separado en los archivos canónicos y actualizar `docs/estado-de-piezas.md`. Si afecta la app, validar allí comportamiento, roles, accesibilidad y pruebas.

La galería no guarda decisiones por sí sola: el brief y la documentación de estado son el registro. No se hacen commits, publicaciones ni despliegues automáticamente desde este entorno.
