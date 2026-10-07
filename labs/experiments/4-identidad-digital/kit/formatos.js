// Céluma · Experimento 04 · Formatos y métricas (CANDIDATO, pendiente de aprobación).
// Los artboards son bases de diseño por proporción, no especificaciones certificadas
// de ninguna plataforma. Las zonas de interfaz del 9:16 son una HIPÓTESIS de diseño
// tomada de docs/guia-de-publicaciones.md §5 (14 % arriba, 20 % abajo).
(function (root) {
  const FORMATOS = {
    '1x1':    { w: 1080, h: 1080, nombre: '1:1',    uso: 'Publicación cuadrada' },
    '4x5':    { w: 1080, h: 1350, nombre: '4:5',    uso: 'Publicación vertical y carrusel (prioritario)' },
    '9x16':   { w: 1080, h: 1920, nombre: '9:16',   uso: 'Historia y vídeo vertical (prioritario)' },
    '191x1':  { w: 1200, h: 628,  nombre: '1.91:1', uso: 'Vista de enlace y anuncio horizontal' },
    '16x9':   { w: 1920, h: 1080, nombre: '16:9',   uso: 'Vídeo horizontal, presentación y web' },
    // Formatos auxiliares del kit
    'avatar': { w: 1080, h: 1080, nombre: 'Avatar 1:1', uso: 'Foto de perfil (recorte circular seguro)' },
    'portada':{ w: 1584, h: 396,  nombre: 'Portada 4:1', uso: 'Portada ancha de perfil (base de trabajo)' },
    'destacado':{ w: 1080, h: 1920, nombre: 'Destacado 9:16', uso: 'Portada de historia destacada (círculo central)' },
    'banner': { w: 1500, h: 500,  nombre: 'Banner 3:1', uso: 'Banner web o de cabecera (base de trabajo)' },
    'firma':  { w: 1200, h: 300,  nombre: 'Firma 4:1', uso: 'Módulo de firma de correo (@2x de 600 × 150)' },
  };

  // S = lado corto, W = ancho. Escala de la guía (§4), ajustada en esta ronda:
  // el texto usa el mayor entre una proporción de S y otra de W para que los
  // horizontales sigan legibles a ~390 px de ancho.
  function metricas(fid) {
    const f = FORMATOS[fid];
    const W = f.w, H = f.h, S = Math.min(W, H);
    const horizontal = W / H > 1.2, vertical = H / W > 1.5;
    const m = Math.round(Math.max(S / 13.5, W * 0.05));
    const zonaArriba = vertical ? Math.round(H * 0.14) : 0;
    const zonaAbajo = vertical ? Math.round(H * 0.20) : 0;
    // En 9:16 el mensaje ocupa la pantalla completa: la tipografía crece un 10 %.
    const fv = vertical ? 1.1 : 1;
    return {
      fid, W, H, S, horizontal, vertical, m,
      zonaArriba, zonaAbajo,
      // tipografía (px de artboard)
      display: Math.round(Math.max(S * 0.150, W * 0.082) * fv),
      titulo:  Math.round(Math.max(S * 0.086, W * 0.047) * fv),
      titulo2: Math.round(Math.max(S * 0.064, W * 0.036) * fv),
      texto:   Math.round(Math.max(S * 0.042, W * 0.028) * fv),
      meta:    Math.round(Math.max(S * 0.029, W * 0.0195) * (vertical ? 1.06 : 1)),
      fuente:  Math.round(Math.max(S * 0.027, W * 0.018)),
      // firma: alto del lockup = alto del isotipo
      iso:     Math.round(Math.max(S * 0.074, W * 0.040)),
      linea:   Math.max(2, Math.round(S * 0.0022)),
    };
  }

  root.E4F = { FORMATOS, metricas };
})(typeof window !== 'undefined' ? window : globalThis);
