<!-- Drafts prepared 2026-10-07. Not opened. Bodies follow the Céluma PR structure used in #7 (Summary · Evidence · Céluma safeguards, from celuma-engineering/.github/pull_request_template.md); celuma-brand-system has no template of its own. Replace <migration-issue> with the number of the issue created from issue-draft.md. -->

# Draft pull requests · B · Ficha canonical migration

Six small PRs, in order. PR-1 is written in full; PR-2…PR-6 are scoped outlines to be completed when each starts. Every PR: base `main`, one branch per PR (suggested prefix `brand/b-migration-`), `Refs <migration-issue>`; **never** `Closes #6`.

---

## PR-1 · Incorporate the approved Experiment 02 logo into canonical assets

**Suggested branch:** `brand/b-migration-01-logo` · **Labels:** `enhancement`, `documentation`

### Summary

Incorporate the vector logo approved by Rafael in Experiment 02 (geometry and wordmark A on 2026-09-26, isotipo palette on 2026-09-27) into canonical `assets/logo/`, so the B · Ficha migration and every canvas can use it without importing from `labs/`. This is the explicit logo dependency of the B migration (WP-1 in `MIGRATION-PLAN.md`).

Refs <migration-issue>.

### Changes

- Add byte copies under `assets/logo/`: active master (`celuma-isotipo-maestro.svg`), palette (`celuma-paleta.json`), isotipo family (color, mono blanco/navy, mono tramas blanco/navy, reducido 16–24 px), eight lockups A, wordmark A, PNG exports and favicon set.
- Align `--celuma-iso-outline/fill/nucleus/rays` with the approved palette (`#49b6ad`, `#bbead2`, `#f98d84`, `#f1c46c`) and add `--celuma-iso-nucleolus: #e5635f`.
- Use the SVG isotipo in the app header (`app.jsx`) and the favicon set in `index.html`.
- Update the Fundamentos logo artboards and «Propuesta · Estado del logotipo» to show the incorporated master.
- Update `docs/estado-de-piezas.md` (Fundamentos and Experiment 02 rows) and record the pre-migration commit SHA.
- Keep `assets/celuma-isotipo.png` and `assets/celuma-logo-v3.png` unchanged; keep Experiment 02's faithful historical master and aliases in the lab.

### Files

`assets/logo/**` (new), `styles/celuma-tokens.css`, `index.html`, `app.jsx`, `canvases/fundamentos.jsx`, `components/proposals-fundamentos.jsx`, `docs/estado-de-piezas.md`.

### Evidence

- [ ] Current implementation or owner decision is cited: `labs/experiments/2-logo-vector-v2/DECISION.md`, `labs/experiments/4-identidad-digital/DECISION.md`.
- [ ] Historical evidence is identified as historical: 2026-09-25 canvas captures and the faithful master are references, not new tests.
- [ ] Unknown runtime state is stated explicitly: browsers other than Chromium, print/CMYK and devices remain untested.
- [ ] Internal documentation validation passes: local Markdown links resolve.

### Validation to record

- SHA-256 of every file in `assets/logo/` equals its Experiment 02 source.
- `labs/experiments/2-logo-vector-v2/scripts/check_paleta.py` passes on the canonical copies (geometry and palette).
- Palette parity: `assets/logo/celuma-paleta.json` ↔ `--celuma-iso-*`.
- Before/after captures of Fundamentos, Papelería, Material digital and Componentes; differences only where the PNG logo was replaced. Logo sheet at 16, 24, 32, 64 and 128 px on cream, white and navy.
- `grep` shows no canonical reference to `labs/` as a resource.

### Exclusions

No B tokens, fonts, backgrounds or templates (later PRs). No change to `celuma-frontend`, landing or docs. No tag, release or deploy.

### Céluma safeguards

- [ ] No PHI, secrets, credentials, dumps, or patient-bearing artifacts are included.
- [ ] Related specs, ADRs, runbooks, standards, and navigation are aligned: state register and logo status updated.
- [ ] Production actions remain separately authorized.

---

## PR-2 · Add B colour roles and self-hosted brand fonts (outline)

- **Scope:** WP-2 + WP-3. Additive tokens `--celuma-ink-teal-deep`, `--celuma-brand-fg-2`, `--celuma-brand-fg-3`, `--celuma-mint-soft`, `--celuma-on-navy-text-2`, `--celuma-surface-navy-deep`, `--celuma-font-export`; Baloo 2 and Inter WOFF2 with OFL and version/SHA record; `styles/celuma-fonts.css`; Google Fonts `@import` removed.
- **Files:** `styles/celuma-tokens.css`, `styles/celuma-fonts.css`, `assets/tipografias/**`, `docs/estado-de-piezas.md`.
- **Acceptance:** existing token values unchanged; contrast table 16/16 from tokens; four canvases pixel-identical except font rendering reviewed; 61 lab pieces re-exported with local fonts pixel-identical or each difference accepted by Rafael (line-break changes block).
- **Exclusions:** `--celuma-fg-*` and `--celuma-font-body` unchanged (app parity); A's light tints not migrated.

## PR-3 · Add canonical backgrounds, Microcosmos and graphic resources (outline)

- **Scope:** WP-4 + WP-5. `digital/microcosmos.js` as parametric master; generated `assets/fondos/**` (16 SVG + PNG), `assets/microcosmos/**` (18 SVG + PNG + samples + `catalogo.json`), `assets/recursos/**` (22 SVG + PNG); Fundamentos additions (B backgrounds next to the originals, Microcosmos library, `IllustCellGroup` labelled as antecedent).
- **Acceptance:** SVG self-contained; `<img>` = inline 34/34; PNG pixel-identical to the lab; fidelity ≤ 2 levels against `PatternCream`/`PatternNavy`; exclusion zones unchanged; artboard ids preserved.
- **Exclusions:** no product use of Microcosmos or icons before Laisha's review.

## PR-4 · Add the B · Ficha digital runtime, editor and canonical gallery (outline)

- **Scope:** WP-6. `digital/` (formatos, piezas B-only, piezas.css, sistema.css with token references only, contenido, pieza, editor, microcosmos specimen, `index.html` gallery, scripts) and `tools/` pins (Playwright 1.62.0, Pillow, pypdf, NumPy); `.gitignore` for `digital/dist/`.
- **Acceptance (identity gate):** 61/61 exports pixel-identical to `labs/experiments/4-identidad-digital/exports/kit/`; composition 61/61; real-background contrast 0 failures; logo protection ≤ 3 levels; navigation suite on both servers incl. 390 px and reduced motion; no `labs/` imports; no hex literals in `digital/*.css`.
- **Exclusions:** A, C and B round 1 renderers stay in the lab.

## PR-5 · Add reproducible distribution and communication motion (outline)

- **Scope:** WP-7 + WP-8. Manifest with hashes, packaging into `digital/dist/`, release plan (not executed); Orden Lottie and lottie-web 5.13.0 copied from Experiment 03; `digital/motion/`; posters and end frames in `assets/motion/digital/`.
- **Acceptance:** clean-clone rebuild matches manifest PNG hashes; PDF 61/61 single page at artboard size, searchable; motion end frames identical to static pieces 2/2; durations and reduced motion; Lottie byte-identical to 03; no ZIP, PDF or video committed.
- **Exclusions:** publishing a release needs Rafael's explicit approval of that action.

## PR-6 · Make B the documented base: guide, canvases and access (outline)

- **Scope:** WP-9 + WP-10 + WP-11. Rewritten `docs/guia-de-publicaciones.md`; new `docs/registro-de-afirmaciones.md` (claims re-checked on the PR date); resolution notes for D-6 and D-12; «Sistema digital · B · Ficha» first in Material digital; Publicaciones A/B/C moved to an antecedent section with ids preserved; header link to `digital/`; state registers and lab card updated to «incorporated».
- **Acceptance:** four canvases captured before/after; `measure-a.mjs` still runs on the antecedent; every guide rule has an example in `digital/index.html`; A/C listed as kept alternatives with lab links; four states distinct in every register; navigation passes on both servers.
- **Exclusions:** Phase 2 repositories and publication.
