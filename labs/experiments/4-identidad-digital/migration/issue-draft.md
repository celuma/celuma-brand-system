<!-- Draft prepared 2026-10-07. Not opened. Do not open until Rafael asks. It does not replace or duplicate issue #6 (laboratory integration). -->

# Draft issue · Migrate approved B · Ficha into the canonical Brand System

**Suggested title:** Migrate approved B · Ficha digital identity into the canonical Brand System

**Suggested metadata (confirm in the Céluma Engineering project):** assignee Raismaav · labels `documentation`, `enhancement` · Status Backlog · Type Task · Priority P3 · Risk Low (static brand repository, no product runtime) · Effort L · Work type Documentation · Target release N/A. Link to #6 as related, not as parent or duplicate.

---

## Context

On **2026-10-07 Rafael closed Experiment 04 and approved, for the visual laboratory, B · Ficha in its round-2 refinement** as Céluma's digital identity direction: editorial, atmospheric and Microcosmos modes; the rescued Papel cream and Navy backgrounds; the Microcosmos library; and its typography, inks and visual rules as delivered. **A · Lumen and C · Membrana are kept as alternatives for possible future use.** B round 1 is historical.

The approved system still lives only in `labs/experiments/4-identidad-digital/`. The canonical Brand System (tokens, assets, canvases, publication guide, downloads) still reflects the earlier proposals: the publication guide recommends the canvas «Direction A», the tokens carry the pre-02 isotipo pigments, fonts load from Google Fonts, and there are no canonical backgrounds, Microcosmos assets, editable templates or reproducible exports.

Laboratory integration of the experiment is tracked separately in #6 / #7. This issue covers the **next state: canonical incorporation**.

## Problem

Teams cannot use B as the general base without importing from a lab folder that must stay frozen as evidence. Shared roles (deep teal ink, brand text inks, deep-navy surface, Inter for exported text), the backgrounds and the Microcosmos library are local to the experiment; the logo approved in Experiment 02 is not canonical yet; generators depend on another repository's `node_modules`; and generated binaries would bloat the repository if copied as they are.

## Goal

B · Ficha becomes the documented, reproducible base of the Brand System: shared tokens and assets, a B-only runtime with templates, editor and generators, an updated publication guide and canvases, and a distribution path — without changing the approved design and without touching other repositories.

## Scope

Specification: [`MIGRATION-PLAN.md`](../MIGRATION-PLAN.md) (source → destination map, source-of-truth architecture, rules, validation, rollback, review plan).

- [ ] **WP-0 · Preconditions:** update #6/#7 text; decide the storage of the eight Experiment 04 packages; record the pre-migration commit SHA.
- [ ] **PR-1 · WP-1 · Canonical logo (Experiment 02 dependency):** `assets/logo/**` byte copies of the active master, palette, isotipo family, lockups A, wordmark, PNG and favicons; `--celuma-iso-*` aligned to the approved palette; header and favicon to SVG.
- [ ] **PR-2 · WP-2 + WP-3 · Colour roles and fonts:** additive B roles in `styles/celuma-tokens.css`; self-hosted Baloo 2 and Inter with OFL in `assets/tipografias/`.
- [ ] **PR-3 · WP-4 + WP-5 · Backgrounds, Microcosmos and graphic resources:** parametric master `digital/microcosmos.js`; generated `assets/fondos/**`, `assets/microcosmos/**`, `assets/recursos/**`.
- [ ] **PR-4 · WP-6 · Digital runtime:** `digital/` with the B-only engine, templates, editor, specimen, canonical gallery and generators; tools pinned in `tools/`.
- [ ] **PR-5 · WP-7 + WP-8 · Distribution and motion:** `digital/dist/` (ignored), manifest with hashes, packaging; Orden and lottie-web copied from Experiment 03; two communication motions.
- [ ] **PR-6 · WP-9 + WP-10 + WP-11 · Guide, canvases and access:** rewritten publication guide; canonical claims register; Material digital and Fundamentos canvases; header link; state registers.

## Acceptance criteria

- [ ] No canonical file imports, links as a resource, or fetches anything from `labs/`.
- [ ] Logo files are byte-identical to Experiment 02 sources; palette JSON and `--celuma-iso-*` match; `assets/celuma-isotipo.png` is unchanged.
- [ ] Existing token values are unchanged except `--celuma-iso-*`; new roles cover every colour used by `digital/` (no new hex literals there).
- [ ] The canonical runtime regenerates **61/61 kit pieces pixel-identical** to the approved lab exports (or every font-driven difference is shown to Rafael and accepted before merge).
- [ ] Backgrounds stay within 2 levels of `PatternCream`/`PatternNavy`; 34/34 round-2 SVG resources are self-contained and render identically inline and as images.
- [ ] Composition checks 61/61, real-background contrast with 0 failures, logo protection ≤ 3 levels, no Microcosmos shape on text or signature.
- [ ] Navigation, editor and downloads pass on `python3 -m http.server` and on the 5050 preview, including 390 px and reduced motion.
- [ ] A clean clone with the pinned tools rebuilds the same PNG hashes as `digital/manifest.json`; no ZIP, PDF or video is committed in canonical folders.
- [ ] Publication guide, claims register, canvases and `docs/estado-de-piezas.md` describe B as the incorporated base; A/C are listed as kept alternatives with links to the lab; nothing contradicts `labs/experiments/4-identidad-digital/DECISION.md`.
- [ ] The Experiment 04 lab folder is unchanged after WP-0 (manifest hashes).

## Tests and evidence per PR

Before/after captures of the four canvases (`docs/revision-grafica/scripts/capture-brand.mjs`), pixel identity sheets (lab vs canonical), contrast on real pixels (`contraste_real.py`), composition and protection checks (`exportar.mjs`), fidelity of backgrounds, navigation suite on both servers, local Markdown link check. Each PR states which checks are new and which are historical lab evidence.

## Exclusions

- Re-opening the choice of B, or promoting A/C.
- `celuma-frontend`, `celuma-landing`, `celuma-docs` and any social or web publication (Phase 2, separate issues and owners).
- Platform-specific specs, print, Safari/Firefox/iOS/Android, screen readers and PDF editors beyond what each PR explicitly records.
- Tags, releases, merges or deploys without Rafael's explicit request for that exact action.
- Real patient, physician or laboratory data; only synthetic content.

## Dependencies and owners

- Experiment 02 incorporation (WP-1) and Experiment 03 Orden copy (WP-8).
- Rafael (`@Raismaav`): approval of each PR, storage and release decisions. Laisha (`@laisha1308`): CODEOWNER review for `assets/` and `styles/`; icon equivalences (D-11) before any app use. A product owner for claims is designated by Rafael before Phase 2.

## Risks

Font build differences moving line breaks; confusion between the canvas «Publicaciones B · Ficha de producto» and Experiment 04 B; two secondary-text greys (app vs communication); canvas performance with live iframes; accidental edits to the frozen lab; ageing product claims; repository growth from generated binaries.

## References

- Closure decision: `labs/experiments/4-identidad-digital/DECISION.md`
- Migration specification: `labs/experiments/4-identidad-digital/MIGRATION-PLAN.md`
- Spanish operational plan: `labs/experiments/4-identidad-digital/INCORPORACION.md`
- Closure validation: `labs/experiments/4-identidad-digital/VALIDACION.md` §8
- Laboratory integration: #6, #7
