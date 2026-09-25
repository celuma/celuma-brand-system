# Céluma Brand System

Este repositorio reúne los fundamentos de identidad y los usos visuales de Céluma. Es la referencia para papelería, material digital y, progresivamente, los componentes de sus productos. Los contratos clínicos y de software se documentan en `celuma-engineering`.

## Recorrer los lienzos

Abra `index.html` con un servidor local (por ejemplo, `python3 -m http.server 8000`) y visite `http://localhost:8000`. El antiguo archivo `Céluma Brand System.html` dirige a la nueva entrada.

| Lienzo | Contenido | Estado actual |
| --- | --- | --- |
| Fundamentos | Logotipo, atmósfera, patrones e ilustración | Referencia visual en revisión |
| Papelería | Papelería corporativa, editorial y piezas de laboratorio | Conceptos; no hay variantes elegidas ni fichas de imprenta |
| Material digital | Firmas, ejemplos de interfaz, web y presentaciones | Conceptos; verificar textos y capacidades antes de publicar |
| Componentes | Inventario inicial de patrones reales de la app | Referencia; los componentes funcionales siguen en `celuma-frontend` |

Los artboards existentes se conservaron y agruparon por uso. Cada lienzo tiene su propio estado de posición y edición en los entornos que ofrecen el puente `window.omelette`. Las ediciones hechas en un navegador normal no se guardan en el repositorio. No use los nombres editables del lienzo como registro de aprobaciones.

## Colores de identidad

El teal de identidad es `#49b6ad`, alineado con el frontend. En superficies claras, texto y enlaces teal usan `#1f7a75`. Los rellenos `#49b6ad` usan texto navy `#0d1b2a`; esta combinación alcanza 7.1:1. El teal claro con texto blanco alcanza 2.45:1 y no debe usarse para texto normal. Los roles están en `styles/celuma-tokens.css`.

Este ajuste cambia el color del lienzo, pero no constituye por sí solo una aprobación de todas sus piezas. Consulte [el estado de uso](docs/estado-de-piezas.md) antes de compartir material externo.

## Responsabilidad de cada repositorio

- **Este repositorio:** identidad, reglas gráficas, modelos visuales y, más adelante, tokens y componentes compartidos versionados.
- **`celuma-frontend`:** implementación vigente de componentes y flujos de la aplicación, hasta su extracción explícita a un paquete.
- **`celuma-engineering`:** contratos de producto y decisiones de arquitectura; entre ellos, la propiedad del membrete clínico por laboratorio.

La próxima etapa del catálogo de componentes es documentar variantes, estados, accesibilidad y ejemplos reales. Extraer un paquete requiere estabilizar esas API, probarlo en frontend, landing y docs, y definir su versionado. La galería actual no se presenta como paquete instalable.
