# Agent instructions — celuma-brand-system

## Scope

This repository contains Céluma’s visual system and reusable presentation assets. Preserve established tokens, components, logos, typography, and clinical tone. Read the relevant project decision and `docs/estado-de-piezas.md` before changing a shared asset or starting a related experiment.

## Brand direction and approval

- Keep four states distinct: an experiment is being explored; a specific direction or asset is approved; that asset is incorporated into the canonical Brand System; and it is adopted in a product, publication, or another repository. Approval at one state does not imply the next.
- Record the reviewer, date, exact approved scope, remaining questions, and next adoption steps in the experiment’s `DECISION.md` and the shared status register. Treat those records as the source of truth, not gallery labels or old briefs.
- Rafael may approve a visual direction for the scope of an experiment. Before a change affects clinical workflow, product behavior, or operational material, validate it with the responsible product or domain owner and the relevant contracts.
- Do not turn a recommendation, mockup, comparison, or unresolved color option into a shared token or canonical asset without an explicit decision.

## Logo and color

- Preserve the approved vector master’s geometry. Recoloring must keep every path, transform, viewBox, and proportion unchanged; document each fill that changes.
- Keep the faithful-to-source logo separate from color adaptations. Never overwrite the faithful master or the installed source asset with a recolored or lower-quality copy.
- Current project state: Experiment 02 approves the faithful vector geometry, wordmark A · Baloo 2 800, and the visual directions Mirada, Luz, Enfoque, and Trazo. The UI color comparison (membrane/inner strokes `#49b6ad`, nucleus `#F98D84`) remains pending review against the faithful master. Check `labs/experiments/2-logo-vector-v2/DECISION.md` and its `index.html#color-ui` before using or extending either version.
- Do not change shared color tokens from inside an experiment. Token or canonical asset updates belong in a separate, explicitly scoped incorporation change.

## Experiments and navigation

- Keep each experiment self-contained under `labs/experiments/<name>/`, with a brief, decision record, runnable preview, and relevant evidence. Link it from the lab index and preserve links to earlier work.
- Distinguish a phase inside an experiment from a separately numbered experiment. The original motion gallery is phase 3 of Experiment 02; Experiment 03 is the separate motion continuation at `labs/experiments/3-logo-motion/`.
- Experiment 01’s V4 “Interno ≠ entregado” chips and contrast adjustments are research directions, not approved product changes. Status color alone must not carry clinical meaning; keep review decisions distinct from report or sample states.
- A loading logo indicates that the app is active; visible text communicates real status or progress. Provide a static/reduced-motion state and review loops for distraction and accessibility.

## Validation

- Inspect affected HTML, JSX, CSS, and exported assets together.
- Check changed assets at intended sizes and on relevant light and dark backgrounds. For logo comparisons, use matching boxes and scale; document color and geometry separately.
- Record what was reviewed, at which sizes/backgrounds, and what remains unchecked. Do not claim print, browser, device, or accessibility validation that was not performed.
- Use synthetic copy and images only. Never add PHI, secrets, credentials, customer exports, or real clinical reports.
- Do not overwrite source-quality assets with lower-resolution exports.

## Safety boundaries

- Do not reinterpret logos or tokens silently; document deliberate brand-system changes.
- Do not commit, push, merge, tag, publish, or deploy unless Rafael explicitly requests that exact action.
