# Migration plan · B · Ficha becomes the Brand System base

**Status: prepared, not executed (2026-10-07).** This specification turns the closed Experiment 04 into a concrete, reviewable migration. Nothing in it has been applied to canonical files, other repositories, GitHub, or any publication channel.

| | |
|---|---|
| Decision | Rafael, 2026-10-07: **B · Ficha, round-2 refinement**, is the chosen digital identity direction; **A · Lumen and C · Membrana are kept as alternatives** for possible future use; B round 1 is historical. Record: [`DECISION.md`](DECISION.md) |
| Goal | B becomes the **general base of the Brand System**: shared tokens, assets, templates, guide, canvases and downloads, no longer only a lab experiment |
| Not in scope | Re-opening the choice of B; executing the canonical replacement; `celuma-frontend`, `celuma-landing`, `celuma-docs`; social publication; tags, releases, merges or deploys |
| Lab baseline | Branch `labs/experiment-04-digital-material`, commit `4c9d04a`, plus the uncommitted closure of 2026-10-07 (`VALIDACION.md` §8) |
| Spanish summary | [`INCORPORACION.md`](INCORPORACION.md) |
| Backlog drafts | [`migration/issue-draft.md`](migration/issue-draft.md), [`migration/pr-draft.md`](migration/pr-draft.md), [`migration/integration-6-7-updates.md`](migration/integration-6-7-updates.md) |

Four states stay distinct throughout (`AGENTS.md`): *approved in the lab* (done) → *incorporated into the canonical Brand System* (this plan) → *adopted per medium or repository* (Phase 2, separate) → *published* (per piece, separate). Approval at one state does not imply the next.

---

## 1. Inventory and source → destination map

Destinations follow the existing repository: static files served from the root, no build step for the canvases, `assets/` and `styles/` owned by `@Raismaav @laisha1308` (`.github/CODEOWNERS`), Spanish asset names in the `celuma-{recurso}-{variante}-{color}.{ext}` pattern recommended in `docs/guia-de-publicaciones.md` §11. A new top-level `digital/` folder holds the runtime of the communication system. **Nothing canonical will import from `labs/`.**

Paths below are relative to the repository root. `L4` = `labs/experiments/4-identidad-digital`, `L2` = `labs/experiments/2-logo-vector-v2`, `L3` = `labs/experiments/3-logo-motion`.

### 1.1 Logo and lockups (from Experiment 02 · explicit dependency, WP-1)

| Source | Destination | Transformation |
|---|---|---|
| `L2/master/celuma-isotipo-maestro-paleta-aprobada.svg` | `assets/logo/celuma-isotipo-maestro.svg` | Byte copy (active master, approved palette) |
| `L2/master/celuma-paleta-aprobada.json` | `assets/logo/celuma-paleta.json` | Byte copy; single palette source for tokens and generators |
| `L2/svg/isotipo/celuma-isotipo-{color,mono-blanco,mono-navy,mono-tramas-blanco,mono-tramas-navy,reducido-16-24px}.svg` | `assets/logo/isotipo/` (same names) | Byte copies |
| `L2/svg/lockups/propuesta-a-baloo2/celuma-lockup-{horizontal,vertical}-{color-positivo,color-negativo,mono-blanco,mono-navy}.svg` (8) | `assets/logo/lockups/` (same names) | Byte copies. Wordmark A · Baloo 2 800 only; lockups B stay in the lab as typographic history |
| `L2/svg/wordmarks/wordmark-a-baloo2-800.svg` | `assets/logo/celuma-wordmark.svg` | Byte copy |
| `L2/png/isotipo/*`, `L2/png/lockups/propuesta-a-baloo2/*`, `L2/png/favicon/*` | `assets/logo/png/…`, `assets/logo/favicon/…` | Byte copies |
| `L4/kit/marca/*` (10 byte copies of 02) | — | Not migrated: the canonical runtime reads `assets/logo/` |
| `assets/celuma-isotipo.png`, `assets/celuma-logo-v3.png` | unchanged | The installed source asset is never overwritten (`AGENTS.md`); `logo-v3` stays unused |
| `L2/master/celuma-isotipo-maestro.svg` (faithful historical master), 02 aliases `celuma-isotipo-ui.svg`, `ui-baloo2/` | unchanged in the lab | Evidence and compatibility aliases for lab links; no canonical alias needed (no canonical path links to them) |

### 1.2 Motion (from Experiment 03 · dependency of WP-8)

| Source | Destination | Transformation |
|---|---|---|
| `L3/lottie/orden-lockup-h-neg.json` | `assets/motion/orden/celuma-orden-lockup-horizontal-negativo.json` | Byte copy (Orden, approved 2026-09-30); used by the 04 intro |
| `L3/vendor/lottie-web-5.13.0/` | `vendor/lottie-web-5.13.0/` (with its MIT licence) | Byte copy; pinned player |
| Relevo | — | The 04 intro re-implements Relevo as a transform in `motion.js`; the spec stays in `L3/spec.json` |
| Other 03 directions | — | Out of this migration; their own incorporation follows the 03 decision |

### 1.3 Colour roles and type (from `L4/kit/sistema.css` · WP-2, WP-3)

| Source (local role) | Destination in `styles/celuma-tokens.css` | Note |
|---|---|---|
| Pigments `--e4-membrana/citoplasma/nucleo/nucleolo/rayos` | Update `--celuma-iso-outline/fill/nucleus/rays` to `#49b6ad/#bbead2/#f98d84/#f1c46c`; **add** `--celuma-iso-nucleolus: #e5635f` | WP-1 (02 palette). Today `#2fa7a5/#c8ecdc/#e58a8a/#f0c75e`; no component or lab page reads these variables (checked with `grep`) |
| `--e4-crema`, `--e4-blanco`, `--e4-navy` | Existing `--celuma-bg`, `--celuma-surface`, `--celuma-ink` | Already canonical; no change |
| `--e4-teal-profunda #17635F` | **add** `--celuma-ink-teal-deep` | Eyebrows, CTA and numbering on cream/mint (6.53:1 cream) |
| `--e4-tinta-2 #3A4A5C`, `--e4-tinta-3 #56657A` | **add** `--celuma-brand-fg-2`, `--celuma-brand-fg-3` | Communication text roles. `--celuma-fg-2/3` stay as they are (app parity); `#6b7280` on cream (4.49:1) is reported to the frontend adoption phase, not changed here |
| `--e4-menta-suave #E4F3EA` | **add** `--celuma-mint-soft` | Cells and fills |
| `--e4-sobre-navy-2 #C9D3DD`, `--e4-menta-tinta #BBEAD2` | **add** `--celuma-on-navy-text-2`; reuse `--celuma-iso-fill` for the mint accent | Text on navy |
| `#0A1520` (Navy background surface) | **add** role alias `--celuma-surface-navy-deep: var(--celuma-ink-3)` | Documents the rescued surface, distinct from ink `#0D1B2A` |
| `--e4-teal-tinta #1F7A75` | Existing `--celuma-primary-ink` | Same value |
| `--e4-luz-0…3` | — | Used only by A · Lumen (`lumen()` in `piezas.js`): stays in the lab with A |
| Inter (exported text) | **add** `--celuma-font-export: "Inter", system-ui, sans-serif` | `--celuma-font-body` (app system stack) does not change; lab galleries use it for their chrome |
| Baloo 2 800 | Existing `--celuma-font-display` | No change |
| Google Fonts `@import` in `L4/kit/sistema.css` and `styles/celuma-tokens.css` | `assets/tipografias/{baloo-2,inter}/*.woff2` + `OFL.txt` + `styles/celuma-fonts.css` | WP-3, see §4.1 |

### 1.4 Backgrounds, Microcosmos and graphic resources (WP-4, WP-5)

| Source | Destination | Transformation |
|---|---|---|
| `L4/kit/microcosmos.js` (`FONDOS`, `svgFondo`, `CATALOGO`, drawing functions) | `digital/microcosmos.js` | **Parametric master** for backgrounds and Microcosmos; namespace `E4MC` → `CelumaDigital.microcosmos`, colours read from tokens |
| `L4/recursos/fondos/{svg,png}/fondo-{papel,papel-suave,navy,navy-suave}-{1x1,4x5,9x16,16x9}.*` (16 + 16) | `assets/fondos/{svg,png}/celuma-fondo-{…}-{…}.*` | Regenerated from the master; `<title>/<desc>` carry the canonical state |
| Crema plano, Navy plano | Tokens `--celuma-bg`, `--celuma-surface-navy-deep` | No file needed |
| `L4/recursos/microcosmos/{svg,png}/{recurso}-{claro,oscuro}[-muestra].*` (18 SVG, 36 PNG) + `catalogo.json` | `assets/microcosmos/{svg,png}/celuma-microcosmos-{recurso}-{claro,oscuro}[-muestra].*` + `assets/microcosmos/catalogo.json` | Regenerated; catalogue keeps intent, rules, backgrounds and exclusion zones |
| `L4/recursos/svg|png/cuadricula-orden-*`, `rastreador-4-pasos-*`, `regla-salmon-vertical`, `iconos/icono-*` (22) | `assets/recursos/{svg,png}/celuma-{…}.*`, `assets/recursos/{svg,png}/iconos/celuma-icono-*.*` | Regenerated by `digital/scripts/recursos.mjs` |
| `components/web-patterns.jsx` `PatternCream`, `PatternNavy`, `CelBlob` (`components/atoms.jsx`) | unchanged | Canonical originals that B reproduces within 1–2 levels; kept and guarded by a fidelity check (§2.4) |
| `IllustCellGroup` («01 · Microcosmos» in Fundamentos) | unchanged component; artboard relabelled as antecedent | Superseded by the B library in the canvas, not deleted |

### 1.5 Runtime, templates, editor and generators (WP-6, WP-7, WP-8)

| Source | Destination | Transformation |
|---|---|---|
| `L4/kit/formatos.js` | `digital/formatos.js` | Namespace `E4F` → `CelumaDigital.formatos` |
| `L4/kit/piezas.js` | `digital/piezas.js` | **B round 2 only**: keep `RENDER.b`, auxiliaries, `B2`, `VALOR_RECURSO`, `medir`, `ajustarModulos`; remove `a`, `c`, `b1` (they remain renderable in the lab). Logo path `marca/` → `assets/logo/` through one base setting (replaces the `window.E4_BASE` trap) |
| `L4/kit/piezas.css` | `digital/piezas.css` | Keep `.d-b`, `.d-b.r2` and shared rules; drop `.d-a`, `.d-c` (34 rules); `--e4-*` → `--celuma-*` |
| `L4/kit/sistema.css` | `digital/sistema.css` | Only page-level settings; every colour comes from `styles/celuma-tokens.css` (no new hex literals) |
| `L4/kit/contenido.js` | `digital/contenido.js` | Example content with sources; header states that approval is visual and claims need re-checking |
| `L4/AFIRMACIONES.md` | `docs/registro-de-afirmaciones.md` | Canonical claims register, re-verified on the migration date; lab copy stays as the 2026-10-06 snapshot |
| `L4/kit/pieza.html`, `editor.html`, `microcosmos.html` | `digital/pieza.html`, `digital/editor.html`, `digital/microcosmos.html` | Direction selector removed (B only); background and Microcosmos controls kept; state label «Brand System» |
| `L4/index.html` chapters 4–8, 10 | `digital/index.html` | Canonical gallery: system, backgrounds, Microcosmos, kit, motion, guide, files. No A/B/C comparison or round history (those stay in the lab, linked as references) |
| `L4/motion/motion.html`, `motion.js` | `digital/motion/` | Reads `assets/motion/orden/…` and `vendor/lottie-web-5.13.0/` |
| `L4/scripts/*` (exportar, trabajos, recursos, contraste, contraste_real, comprobar_pdf, comprobar_motion, video, hoja, hojas, manifiesto, empaquetar, navegacion, capturas, construir) | `digital/scripts/*` | Paths adapted; Playwright from `tools/` (§4.3) instead of `../../../../../celuma-frontend/node_modules`; `cierre.py` and `ronda2/*` stay in the lab (closure and round-2 evidence) |
| `L4/exports/kit/*.png`, `pdf/*.pdf`, `motion/*.mp4|webm`, `descargas/*.zip` | `digital/dist/` (git-ignored) + release assets (§4.4) | Regenerated, never copied by hand |
| `L4/motion/*-poster.jpg`, `*-final.png` | `assets/motion/digital/celuma-{intro-novedad,paso-a-paso}-{poster,final}.*` | Small, used by the gallery |
| `L4/manifest.json` | `digital/manifest.json` | Generated; hashes, sizes, state per file |

### 1.6 Guide, register, canvases and access (WP-9, WP-10, WP-11)

| Current canonical file | Change |
|---|---|
| `docs/guia-de-publicaciones.md` §3–§11 | Rewritten from B: roles (tokens), type, grid and 9:16 zones (hypothesis), signature and protection, backgrounds and Microcosmos rules, voice, correct/incorrect uses, review before publishing, files. Keeps the verified/recommendation markers; links to the previous version by commit |
| `docs/estado-de-piezas.md` | Rows «Material digital y presentaciones», «Propuesta · Publicaciones A, B y C», «Experimento 04» move to «incorporated (date)» as each WP lands |
| `docs/revision-grafica-y-direccion-de-marca.md` | Append resolution notes for D-6 (publications: B of Exp. 04) and D-12 (Inter for exported pieces); history is not rewritten |
| `README.md` (root) | New row «Sistema digital» and link to `digital/` |
| `canvases/digital.jsx` + new `components/sistema-digital.jsx` | New first section «Sistema digital · B · Ficha»; sections `pub-a`, `pub-a-pruebas`, `pub-b`, `pub-c` move to the end as «Antecedente · Publicaciones A/B/C (2026-09-25)», **artboard ids unchanged**; the canvas «B · Ficha de producto» is renamed in its label to avoid confusion with Exp. 04 B |
| `canvases/fundamentos.jsx`, `components/proposals-fundamentos.jsx` | Rules section updated with the incorporated roles, Inter and logo status; «06 · Patrones y fondos» adds the B variants next to the originals; «07 · Ilustraciones» adds the Microcosmos library and labels `IllustCellGroup` as antecedent |
| `canvases/papeleria.jsx`, `canvases/componentes.jsx` | Logo swap only (WP-1); B is a digital system and does not redefine stationery or app components |
| `app.jsx`, `index.html` | Header and favicon use `assets/logo/` SVG; header link «Sistema digital» next to «Laboratorio» |
| `labs/index.html`, 04 card | State becomes «Cerrado · B incorporada al Brand System (fecha)» only after WP-11 |

---

## 2. Source-of-truth architecture

### 2.1 Layers and dependency direction

```
assets/logo (02)  ──►  styles/celuma-tokens.css  ──►  digital/ (runtime: formatos, microcosmos, piezas, templates, scripts)
      │                        │                              │
      │                        ├──► components/ + canvases/   ├──► assets/fondos · assets/microcosmos · assets/recursos (generated, committed)
      │                        │                              └──► digital/dist (generated, ignored) ──► release assets
      └──────────────────────► │
labs/ (01–04: frozen evidence) ──reads──► styles/celuma-tokens.css (gallery chrome only)
```

- **Allowed:** `labs/` → canonical tokens (existing gallery chrome); `digital/` → `assets/`, `styles/`, `vendor/`; canvases → `assets/`, `styles/`, `digital/microcosmos.js` (plain script, no build).
- **Forbidden:** any canonical file → `labs/`. A CI-able check: `grep -rn "labs/experiments" assets styles components canvases digital docs/guia-de-publicaciones.md` must only find documentation links, never `src=`, `href=` to stylesheets/scripts, `import` or `fetch`.
- No cycles: `digital/` never writes into `styles/` or `assets/logo/`; generators write only `assets/{fondos,microcosmos,recursos}`, `digital/manifest.json` and `digital/dist/`.

### 2.2 One master per artifact

| Artifact | Master (edit here) | Generated from it (never edited by hand) |
|---|---|---|
| Logo geometry and palette | `assets/logo/celuma-isotipo-maestro.svg`, `assets/logo/celuma-paleta.json` (copies of 02; 02's generators remain the way to change them) | `--celuma-iso-*` must equal the JSON (parity check) |
| Colour roles | `styles/celuma-tokens.css` | `digital/sistema.css` references, resource SVG hex values (resolved at generation) |
| Backgrounds and Microcosmos | `digital/microcosmos.js` | `assets/fondos/**`, `assets/microcosmos/**`, `catalogo.json` |
| Piece layout | `digital/piezas.js`, `digital/piezas.css`, `digital/formatos.js` | PNG/PDF exports, motion end states |
| Piece text and sources | `digital/contenido.js` + `docs/registro-de-afirmaciones.md` | captions, alt text, manifest |
| Rules for people | `docs/guia-de-publicaciones.md` | — (canvases illustrate it, they do not define it) |

### 2.3 The lab after migration

- `L4` becomes a **frozen snapshot** of the approved decision: its own copies (`kit/marca`, `kit/sistema.css`, exports, zips) are evidence, not sources. They are not edited, except for link fixes. Its `manifest.json` hashes are the reference; a check fails if any hashed lab file changes after WP-0.
- Divergence between lab and canonical is therefore **intentional and bounded**: the canonical system evolves; the lab documents what Rafael approved on 2026-10-07.
- **A · Lumen and C · Membrana live in the lab**, fully renderable (`kit/pieza.html#…&d=a|c`, editor, `exports/comparacion/a|c/`, comparison package). The canonical guide lists them under «Alternativas conservadas» with links. They are **not default rules**: using one requires a new decision and a scoped incorporation (porting `RENDER.a`/`RENDER.c` into `digital/` as an explicit variant).

### 2.4 Guards against divergence

| Guard | Implementation | When |
|---|---|---|
| Logo byte identity | SHA-256 of `assets/logo/**` vs `L2` sources; 02's `scripts/check_paleta.py` run on the canonical copies | WP-1 and every later PR touching `assets/logo/` |
| Palette ↔ tokens parity | Small script compares `celuma-paleta.json` with `--celuma-iso-*` | WP-1, then in every token PR |
| No new hex in `digital/` | `grep -E '#[0-9A-Fa-f]{6}' digital/*.css` returns nothing outside comments | WP-6 |
| Background fidelity | `L4/scripts/ronda2/fidelidad-fondos.mjs` logic ported to `digital/scripts/fidelidad-fondos.mjs`: canonical backgrounds vs `PatternCream`/`PatternNavy` render, ≤ 2 levels | WP-4 and any change to `CelBlob` or `microcosmos.js` |
| Lab → canonical identity | `digital/scripts/exportar.mjs kit` output vs `L4/exports/kit/` pixel comparison | WP-6 (gate), WP-3 (fonts) |
| Lab freeze | Hashes in `L4/manifest.json` re-checked | Every migration PR |

### 2.5 Compatibility routes

- Every existing lab URL keeps working (nothing moves out of `labs/`). Links in issue #6, PR #7 and the lab card stay valid.
- Canvas artboard ids (`pub-a-*`, `pub-b-*`, `pub-c-*`, `pat-cream`, `pat-navy`, `ill-cell`) are preserved, so `.design-canvas.*.state.json` files and `measure-a.mjs` keep working on the antecedent sections.
- `docs/guia-de-publicaciones.md` keeps its numbered headings (§1–§11) so existing anchors resolve; the old text remains reachable through the commit link at the top.
- `assets/celuma-isotipo.png` stays at its path for any external reference.
- New canonical entry points are directories with `index.html` and must normalize the URL with `history.replaceState` (5050 preview strips `index`), like the lab pages.

---

## 3. Work packages and order

Roles come from the repository: **Rafael** (`@Raismaav`, brand owner, approver, CODEOWNER), **Laisha** (`@laisha1308`, UI/UX, CODEOWNER of `assets/` and `styles/`), **Implementer** (agent or engineer). A product owner for claims is not named in the repository; Rafael designates one before publication work (Phase 2).

| WP | Scope | Main files | Depends on | Review | Output | Acceptance criteria |
|---|---|---|---|---|---|---|
| **WP-0** Preconditions | Settle lab integration; freeze snapshot; record base | Issue #6 / PR #7 text (`migration/integration-6-7-updates.md`); `L4/README.md` freeze note | — | Rafael | Closed 04 on `main` (or migration branched from the lab branch); base SHA recorded | `python3 L4/scripts/cierre.py` and `node L4/scripts/navegacion.mjs http://localhost:5050` pass on the base; zip storage decision recorded (§4.4) |
| **WP-1** Canonical logo (02) | Incorporate the 02 master, palette, isotipo family, lockups A, wordmark, PNG and favicons; align `--celuma-iso-*`; header and favicon to SVG | `assets/logo/**`, `styles/celuma-tokens.css`, `index.html`, `app.jsx`, `canvases/fundamentos.jsx`, `components/proposals-fundamentos.jsx` (logo status) | WP-0; 02 decision (approved for incorporation 2026-09-26/27) | Rafael, Laisha | Logo usable from `assets/logo/` everywhere in the repo | Byte identity with 02 sources; palette parity; `check_paleta.py` passes; four canvases captured before/after with differences only where the PNG logo was replaced; `assets/celuma-isotipo.png` unchanged |
| **WP-2** Colour roles | Add B roles to tokens (§1.3); no existing value changes except `--celuma-iso-*` (WP-1) | `styles/celuma-tokens.css`, `docs/estado-de-piezas.md` | WP-1 | Rafael, Laisha | Shared roles available to canvases and `digital/` | Contrast table regenerated from tokens: 16/16 uses meet 4.5:1 / 3:1; four canvases pixel-identical before/after (additions only) |
| **WP-3** Fonts | Self-host Baloo 2 and Inter (OFL 1.1) | `assets/tipografias/**`, `styles/celuma-fonts.css`, `styles/celuma-tokens.css` (`@import` removed), `assets/tipografias/VERSIONES.md` | WP-2 | Rafael | Offline, reproducible typography | Versions and SHA-256 recorded; OFL files shipped; 61 kit pieces exported with local fonts are pixel-identical to the lab exports, or every difference is shown to Rafael before merge (any line-break change blocks); canvases readable with network disabled |
| **WP-4** Backgrounds and Microcosmos | Parametric master and generated assets; canvas additions in Fundamentos | `digital/microcosmos.js`, `assets/fondos/**`, `assets/microcosmos/**`, `canvases/fundamentos.jsx`, `components/sistema-digital.jsx` | WP-2 | Rafael; Laisha before any product use | Canonical backgrounds and library | 16 + 18 SVG self-contained (no `href`, `<image>`, `<text>`, `var(`, external `url(`); `<img>` = inline 34/34; PNG pixel-identical to the lab; fidelity to `PatternCream`/`PatternNavy` ≤ 2 levels; exclusion zones in `catalogo.json` unchanged |
| **WP-5** Graphic resources | Grid, tracker, salmon rule, icons | `assets/recursos/**` | WP-2 | Rafael; Laisha (icons, D-11) | 22 resources | 22 SVG self-contained; PNG pixel-identical; icon equivalences with Ant Design listed before any app use |
| **WP-6** Digital runtime | B-only engine, templates, editor, specimen, canonical gallery, generators, tool pinning | `digital/**`, `tools/package.json`, `tools/package-lock.json`, `tools/requirements.txt`, `.gitignore` | WP-3, WP-4, WP-5 | Rafael | Editable system usable outside the lab | **61/61 PNG pixel-identical to `L4/exports/kit/`**; composition 61/61 without observations; real-background contrast 0 failures; logo protection ≤ 3 levels; navigation suite (ported) passes on `python3 -m http.server` and 5050, incl. 390 px and reduced motion; no `labs/` imports |
| **WP-7** Distribution | Exports, PDF, manifest, packages, release plan | `digital/scripts/{exportar,manifiesto,empaquetar}.*`, `digital/manifest.json`, `digital/dist/` | WP-6 | Rafael (release = publication, needs explicit approval) | Reproducible packages | Clean clone → `construir.sh` → same PNG hashes as the manifest; PDF 61/61 single page at artboard size, searchable text; each package has a LEEME with the canonical state; no zip committed |
| **WP-8** Communication motion | Intro + vertical workflow | `assets/motion/**`, `vendor/lottie-web-5.13.0/`, `digital/motion/**` | WP-6; 03 Orden copied (§1.2) | Rafael | Two motion examples from canonical sources | End frames identical to the static pieces (2/2); first frame of the intro flat deep navy; durations 10 s / 9 s, 30 fps; reduced motion shows the static state; Lottie file byte-identical to 03 |
| **WP-9** Guide and register | Rewrite publication guide; canonical claims register; resolution notes | `docs/guia-de-publicaciones.md`, `docs/registro-de-afirmaciones.md`, `docs/revision-grafica-y-direccion-de-marca.md`, `README.md` | WP-2–WP-6 (drafting can start in parallel) | Rafael; product owner for claims | One written rule set | Every rule in the guide has a visible example in `digital/index.html`; claims re-checked against docs.celuma.mx on the migration date; local Markdown links resolve |
| **WP-10** Canvases | Material digital B section; antecedents; Fundamentos rules, backgrounds, Microcosmos | `canvases/digital.jsx`, `canvases/fundamentos.jsx`, `components/sistema-digital.jsx`, `components/proposals-fundamentos.jsx`, `index.html` (script order) | WP-1, WP-2, WP-4, WP-6 | Rafael, Laisha | Canvases show B as the base | Before/after captures of the four canvases (`docs/revision-grafica/scripts/capture-brand.mjs`); artboard ids preserved; `measure-a.mjs` still runs on the antecedent; Papelería and Componentes unchanged except the logo |
| **WP-11** General access and state | Header link, canonical gallery entry, state registers, lab card | `app.jsx`, `labs/index.html`, `labs/README.md`, `docs/estado-de-piezas.md`, `AGENTS.md`, `labs/CLAUDE.md` | WP-1–WP-10 | Rafael | B is the documented base | Four states distinct in every register; navigation from the canvases to `digital/` and back works on both servers; no label contradicts `DECISION.md` |

**Order and pull requests (small, independently revertible):**

1. PR-1 · WP-1 — canonical logo (02).
2. PR-2 · WP-2 + WP-3 — colour roles and self-hosted fonts.
3. PR-3 · WP-4 + WP-5 — backgrounds, Microcosmos, graphic resources.
4. PR-4 · WP-6 — digital runtime and canonical gallery (the identity gate).
5. PR-5 · WP-7 + WP-8 — distribution and motion.
6. PR-6 · WP-9 + WP-10 + WP-11 — guide, canvases, access and state.

WP-0 is a prerequisite, not a PR of this series. PR-2 and PR-3 can be reviewed in parallel after PR-1; PR-6's guide can be drafted from the start but merges last.

**Phase 2 (separate repositories and owners, not part of this migration):** `celuma-frontend` (white on identity teal, `#6b7280` contrast on cream, brand assets in the app: Laisha and product), `celuma-landing` (CTA `#0f8b8d`, absolute claims D-13: commercial/legal), `celuma-docs`, and per-medium publication (platform specs, captions, demo channel). Each starts from the incorporated Brand System, never from the lab.

---

## 4. Implementation rules and decisions

Routine choices are resolved here with a recommendation; they can be revisited in review without blocking the plan.

### 4.1 Fonts and licences

- **Baloo 2** (Ek Type) and **Inter** (Rasmus Andersson / The Inter Project Authors) are both SIL Open Font License 1.1, which allows bundling and redistribution with the licence text.
- **Recommendation: self-host** unmodified WOFF2 files from the official upstream releases, record version and SHA-256 in `assets/tipografias/VERSIONES.md`, ship `OFL.txt` next to each family. Reasons: exports become reproducible offline (today «sin red no se debe exportar»), no third-party request from brand pages, and the version cannot drift silently.
- Do not subset or rename fonts until each family's Reserved Font Name clause has been checked; unmodified files avoid the question.
- **Risk to test, not assume:** the files Google Fonts served during the lab exports may differ from the upstream release. WP-3's pixel comparison decides; if metrics differ, prefer the version that reproduces the approved exports and record why.
- PDFs currently embed glyphs as Type 3 with `ToUnicode` (searchable, not editable as fonts). Whether static local instances embed differently is a WP-7 observation, not a requirement.

### 4.2 Editable files vs distribution files

| Kind | Format | Where | Who uses it |
|---|---|---|---|
| Editable source | HTML/CSS/JS templates, `contenido.js`, SVG resources | `digital/`, `assets/` (committed) | Implementer, design |
| Working raster | PNG at working size (resources, backgrounds) | `assets/**/png` (committed; deterministic) | Design tools, slides |
| Distribution | PNG at artboard size (social), PDF (vector sharing), MP4/WebM | `digital/dist/` → release packages | Communication |
| Not delivered | Figma, Canva, Illustrator files | — | Only with a separate request and a file that actually works |

### 4.3 Reproducible export and tooling

- Pin tools in `tools/`: `playwright@1.62.0` (the version used for the lab exports, today borrowed from `celuma-frontend/node_modules`), Pillow, pypdf, NumPy in `tools/requirements.txt`; ffmpeg 6.0 documented. `tools/` does not affect the static site.
- `digital/scripts/construir.sh` regenerates everything from a clean clone; WP-7's acceptance compares hashes with `digital/manifest.json`.
- Known lab traps carried into the runtime: set the logo base explicitly; disable smooth scrolling in scripted captures; measure contrast on the glyph ink box; exclusion zones from real line rects; per-ratio halo placement; motion end state re-mounts the static piece.

### 4.4 Storage and versioning of binaries

| Item | Recommendation | Reason |
|---|---|---|
| SVG, JSON, code, Markdown | Commit | Small, diffable masters |
| PNG resources and backgrounds | Commit | Deterministic: the closure regenerated them byte-identical, so identical blobs cost nothing extra in git |
| Kit PNG/PDF exports, MP4/WebM, ZIP packages | **Do not commit** in canonical; build into `digital/dist/` (ignored) and publish as versioned release assets with SHA-256 in `digital/manifest.json` | PDFs, videos and zips are not byte-reproducible (timestamps); every regeneration would add new blobs (the 04 packages alone are ≈ 63 MB per version) |
| Lab packages (`L4/descargas/`, 8 zips) | Rafael decides in PR #7: keep them (history grows by ≈ 63 MB per regenerated set, the closure produced a second set) or drop them from the PR and attach them to a release. Recommendation: drop them from the commit and keep `empaquetar.sh` | Avoid duplicating generated files in history |
| Git LFS | Not needed if the rule above is followed | No large binaries committed |

A release (`brand-digital-v1.0.0`) is a publication: it requires Rafael's explicit approval of that exact action.

### 4.5 Text, image and motion rules carried over

- One message per piece; headline ≤ 3 lines; condensed versions instead of overflow; captions carry the full text.
- Claims only with a published source and state; demonstration invitation blocked until the channel is confirmed; no certifications, absolutes or invented figures.
- Backgrounds: light behind the message, never under the logo's protection zone (≤ 3 levels); right-side light only for the 4:1 cover.
- Microcosmos: one salmon focus per piece, three sizes, never on text or signature, no diagnostic meaning, never a substitute for the logo.
- Motion: ends on the static piece, static/reduced version always available, no motion that suggests a clinical result.
- Clinical reports keep the client laboratory letterhead (ADR 0002); the platform brand does not replace it.

### 4.6 State matrix

| Item | Lab | Canonical | Adoption |
|---|---|---|---|
| Logo, palette, wordmark A (02) | Approved 2026-09-26/27 | WP-1 | Per medium |
| Motion Orden, Relevo (03) | Approved 2026-09-30 | WP-8 (Orden copy); others separate | Per medium |
| B colour roles, Inter | Approved 2026-10-07 | WP-2, WP-3 | — |
| Backgrounds, Microcosmos | Approved 2026-10-07 | WP-4 | Per medium; Laisha before product use |
| Graphic resources, icons | Approved 2026-10-07 | WP-5 | Icons: D-11 review |
| Kit templates, editor, generators | Approved 2026-10-07 (lab tools) | WP-6, WP-7 | — |
| Communication motion | Approved as B samples | WP-8 | Per network |
| Piece texts and claims | Sourced 2026-10-06; not publishable by approval | WP-9 register | Per piece, with product owner |
| A · Lumen, C · Membrana | Alternatives kept | Not incorporated | — |
| B round 1 | Historical | — | — |

---

## 5. Validation and rollback

### 5.1 Checks per area (existing evidence vs. missing)

| Area | Before | After | Existing evidence (lab) | Missing (to do in the migration) |
|---|---|---|---|---|
| Four canvases | `capture-brand.mjs` captures of Fundamentos, Papelería, Material digital, Componentes | Same captures + pixel diff; expected diffs listed per PR | 2026-09-25 captures in `docs/revision-grafica/capturas/` (historical) | New captures at each PR; diff report |
| Mobile reading | — | Pieces at 390 px; gallery and editor at 390 px without horizontal scroll | `L4/validacion/hojas/movil-390.png`, `navegacion.json` | Canonical gallery at 390 px |
| Contrast on real backgrounds | — | `contraste_real.py` on canonical exports | 606 spans, 0 failures (2026-10-06) | Re-run from canonical tokens and fonts |
| Logo protection | — | Background variation ≤ 3 levels, 0 shapes in the zone | `L4/validacion/exportar-kit.json` | Re-run on canonical exports |
| Routes, downloads, editor | Current links | Ported `navegacion.mjs` on `python3 -m http.server` and 5050; directory with/without slash, `index.html`, query, fragment | 48 checks on both servers (closure, `VALIDACION.md` §8) | Canonical routes and release links |
| Identity source ↔ exports | — | 61/61 pixel identity lab ↔ canonical; manifest hashes | `L4/manifest.json` | WP-6 gate |
| Generation from scratch | — | Clean clone → tools install → `construir.sh` → same hashes | Lab built on one machine | WP-7 |
| Accessibility | — | Keyboard and focus on gallery and editor; `aria-current`; alt text and captions per piece; reduced motion | Lab checks in Chromium | Screen reader review (not done anywhere yet) |
| Browsers and media | — | Chromium (Playwright) on macOS | Chromium only; WebKit crashes on this machine | Safari, Firefox, iOS, Android, PDF in Acrobat/Preview/Illustrator, platform uploads: Phase 2 or explicit WP-7 extra |
| Print | — | Not applicable (digital system) | None | Only if a print use is requested |

### 5.2 Rollback

- Each PR is self-contained and revertible with `git revert` of its merge commit. Order of revert is the reverse of §3.
- Canonical originals are never overwritten: `assets/celuma-isotipo.png`, `PatternCream`, `PatternNavy`, `CelBlob`, `IllustCellGroup`, Publicaciones A/B/C (as antecedent sections), `--celuma-fg-*`. Reverting PR-6 restores the previous canvas order; reverting PR-2 removes only added tokens.
- Before PR-1, record the pre-migration commit SHA in `docs/estado-de-piezas.md` (a git tag would be cleaner but needs Rafael's explicit request).
- The lab is untouched, so the approved evidence and A/C alternatives survive any rollback.
- Released packages stay versioned; a rollback does not delete them, it marks them superseded in the manifest.

---

## 6. Backlog ready for review

- **Umbrella ticket:** [`migration/issue-draft.md`](migration/issue-draft.md) — problem, scope, WP checklist, acceptance, tests, exclusions. Not opened; it does not duplicate #6.
- **Pull requests:** [`migration/pr-draft.md`](migration/pr-draft.md) — full body for PR-1 and scoped outlines for PR-2…PR-6, using the Céluma PR structure (Summary · Evidence · Céluma safeguards).
- **Integration ticket #6 and PR #7:** [`migration/integration-6-7-updates.md`](migration/integration-6-7-updates.md) — replacement text for the parts that still describe B as pending. Closing the experiment does not close #6 or merge #7.

## 7. Visual review plan for Rafael

The selection of B is closed; these reviews only confirm that the canonical copy is faithful and well integrated.

| Order | What Rafael opens | Compare with | Decide |
|---|---|---|---|
| 1 · PR-1 | Logo sheet: canonical SVG at 16, 24, 32, 64, 128 px on cream, white and navy; Fundamentos «01 · Identidad»; app header and favicon | Current `assets/celuma-isotipo.png` in the same boxes | Faithful logo, visible palette change accepted (already approved in 02) |
| 2 · PR-2 | «Propuesta · Roles de color» artboard and contrast table | Lab §5 «Color: roles» | Role names and placement |
| 3 · PR-2 | Identity sheet: lab export · canonical export · difference, 61 pieces with local fonts | `L4/exports/kit/` | Zero differences, or each line-break change explained |
| 4 · PR-3 | Fundamentos «06 · Patrones y fondos» with originals and B variants; Microcosmos specimen `digital/microcosmos.html` | Lab §4 and `L4/kit/microcosmos.html` | Nothing changed except names and state labels |
| 5 · PR-4 | `digital/index.html` and `digital/editor.html` on desktop and 390 px | Lab gallery chapters 4–8 | The canonical gallery reads as the base, with A/C linked as alternatives |
| 6 · PR-5 | Motion pages and downloads list | `L4/motion/` | Same timing and end frames |
| 7 · PR-6 | Material digital canvas (B first, antecedents last), the rewritten guide | Current canvas and guide | Final wording before B becomes the documented base |

**Concrete risks to watch:**

1. Font files: a different Baloo 2 or Inter build moves line breaks; WP-3 blocks on any change.
2. Naming collision: the canvas «Publicaciones B · Ficha de producto» (2026-09-25) is not Exp. 04 B; relabel it as antecedent in PR-6.
3. Two greys for secondary text (`--celuma-fg-3 #6b7280` in the app vs `#56657A` in communication) can confuse readers of the guide; the guide must say which applies where.
4. Canvas performance: many live iframes in a Babel-in-the-browser canvas can be slow; show a curated set live and the rest as reference images from `digital/dist` previews.
5. Accidental lab edits after the freeze would turn evidence into a moving target; the freeze check runs in every PR.
6. Claims age: the sources were read on 2026-10-06; pieces that cite release notes must be re-checked when published.
7. Storage: committing regenerated zips or videos grows the repository on every rebuild; follow §4.4.
8. Publication by accident: a release or a social upload is a publication and needs Rafael's explicit approval of that action.
