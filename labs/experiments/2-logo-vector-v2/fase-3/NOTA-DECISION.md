# Nota de decisión · motion del logo (fase 3)

**Archivo de la recomendación previa.** Rafael aprobó después Luz, Enfoque y Trazo como direcciones visuales del experimento 02 y eligió el wordmark A; la decisión vigente está en [`../DECISION.md`](../DECISION.md). Galería: [`index.html`](index.html) · detalle: [`README-FASE3.md`](README-FASE3.md).

## Qué hay para decidir

Hay tres direcciones nuevas, cada una con un principio distinto, más la Mirada de la fase 2 como referencia:

- **Luz:** solo se mueve la luz.
- **Enfoque:** un campo de visión descubre la marca.
- **Trazo:** la marca se dibuja.

Todas existen como isotipo solo y como lockup A/B, horizontal y vertical, y terminan en el dibujo exacto de la fase 1.

## Recomendación original (anterior a la decisión de Rafael)

| Contexto | Propuesta | Por qué | Compromisos |
|---|---|---|---|
| **Carga compacta** (32–96 px) | **Luz · bucle 2,0 s**, en SVG + CSS en línea (2,8 KB gzip, sin reproductor) | La célula queda quieta y los rayos se acortan y vuelven. No llena, no cuenta y no se acerca a un final, así que no simula un proceso ni un progreso. Colores exactos en todos los fotogramas y estático con movimiento reducido | A 32 px el cambio es muy discreto. Tiene menos carácter que la Mirada. Como `<img>` ignora el movimiento reducido: va en línea o en `<picture>`. En tareas largas, el estado real lo da el texto y el logo se detiene tras 3 ciclos |
| **Material de marca** (intro/outro, 1:1, 16:9, hero) | **Trazo** (2,6–2,7 s; outro = al revés) | Es la narrativa más clara: se dibuja, se llena, se enciende y el nombre se escribe | Largo y con muchos elementos: no sirve para UI ni por debajo de ~96 px. Usa mate y máscaras, sin probar en iOS ni Android. Para redes, mejor como vídeo |
| **Bienvenida** (sugerida) | **Enfoque** (1,4 s isotipo; 1,9 s con nombre) | Es breve, termina en el lockup y las letras no se mueven: se descubren | Usa una máscara. El borde del campo corta el dibujo ~0,4 s. No tiene bucle |

**Wordmark para motion: A · Baloo 2 800.** Ya está en uso, tiene geometría de fuente y es predecible al animar letra a letra. B funciona igual, pero es un trazado de raster y el movimiento lleva la mirada a sus bordes en tamaños grandes. **Es un argumento para motion; D-1 sigue abierta.** Si se adopta A, conviene exportar el wordmark con curvas cúbicas, para que SVG y Lottie rastericen igual.

## Preguntas visuales

1. **Carga:** ¿la ola de Luz se percibe a 32 y 48 px sin distraer? ¿Más profunda, más lenta o solo desde 48 px?
2. **Carga:** ¿Luz o Mirada? ¿La Mirada «te observa» mientras esperas?
3. **Luz con nombre:** «Celuma» → «Céluma» cuando se enciende el acento. ¿Guiño o errata momentánea?
4. **Enfoque:** ¿el campo circular recuerda al microscopio sin parecer un escáner? ¿El ajuste 1,05 → 1 aporta o sobra?
5. **Bienvenida:** ¿con nombre o solo isotipo? ¿Horizontal en escritorio y vertical en móvil?
6. **Trazo:** ¿2,7 s es aceptable para intro? ¿Convence el citoplasma que se llena desde el centro?
7. **Trazo con nombre:** ¿la escritura letra a letra se ve más natural con A o con B?
8. **Fondos:** ¿alguna dirección no funciona en crema, blanco o navy?
9. **Movimiento reducido:** ¿logo estático (lo actual) o un fundido mínimo?

## Para pasar de exploración a candidata

- Que Rafael elija la dirección para cada contexto (o descarte alguna) y responda a las preguntas.
- Probar en lottie-ios, lottie-android, Safari y Firefox la dirección que se elija, sobre todo si usa máscaras o mates.
- Decidir D-1 antes de animar el lockup en producción.
- Nada de esto autoriza la publicación.
