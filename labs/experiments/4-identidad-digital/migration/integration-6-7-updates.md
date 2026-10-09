<!-- Prepared 2026-10-07. Replacement text for issue #6 and PR #7 (celuma/celuma-brand-system) after Rafael's closure decision. Not applied: editing GitHub is Rafael's call. Closing the experiment does not close #6 or merge #7. -->

# Text updates for issue #6 and PR #7

Both still describe B as pending («Experiment 04 and direction B are still pending Rafael's approval»). The decision of **2026-10-07** supersedes that. The changes below keep both items scoped to **laboratory integration**; canonical incorporation is a new issue ([`issue-draft.md`](issue-draft.md)).

**Before editing them:** the closure changes exist only in the local working tree of `labs/experiment-04-digital-material` (base `4c9d04a`). The PR shows them only after a commit and push that Rafael must request explicitly. When that happens, recount the changed files (the closure adds `ENCARGO-CIERRE.md`, `MIGRATION-PLAN.md`, `migration/`, `scripts/cierre.py`, `scripts/cierre-render.mjs`, `validacion/cierre.json`, `validacion/cierre-render.json`, new gallery captures, and touches `AGENTS.md` and `labs/CLAUDE.md` outside the experiment) and update the commit SHA below.

---

## Issue #6

**Title** — replace with:

> Integrate closed Experiment 04: approved B · Ficha digital identity kit (A/C kept as alternatives)

**Context, third paragraph** (the bold one) — replace with:

> **Rafael closed Experiment 04 on 2026-10-07 and approved B · Ficha, round-2 refinement, for the visual laboratory**: its editorial/atmospheric/Microcosmos modes, the recovered Papel cream and Navy backgrounds, the Microcosmos library, and its typography, inks and visual rules as delivered. **A · Lumen and C · Membrana are kept as alternatives** for possible future use; B round 1 is historical evidence. This issue tracks integration of the closed experiment into the visual laboratory. Lab approval does not incorporate anything into the canonical Brand System, adopt it in a product, or authorize publication; canonical incorporation is prepared in `MIGRATION-PLAN.md` and tracked in a separate issue.

**Implementation → Commit** — replace with:

> - Commits: `4c9d04a…` (experiment) + `<closure commit SHA>` (closure of 2026-10-07)
> - Scope: `<recount>` changed files; changes outside the experiment: `labs/index.html`, `labs/README.md`, `docs/estado-de-piezas.md`, `AGENTS.md`, `labs/CLAUDE.md` (status entries only).

**Identity directions → last bullet** — replace «Inter, local text inks, and new system rules remain candidates.» with:

> Inter, the local text inks and the system rules are approved as part of B for the lab; their promotion to shared tokens is part of the canonical migration.

**Verification and evidence** — add after the table:

> **Closure checks (2026-10-07, new):** state labels updated in gallery, editor, specimen, motion page, manifest, resource metadata, packages and shared registers; `scripts/cierre.py` against `4c9d04a`: 304/313 binary deliverables unchanged and 9 with differences measured only in a state label or sheet title; 56 resource SVGs changed only in `<desc>`; 8/8 ZIP packages keep every binary byte-identical (only `LEEME.txt`, manifest and text files updated); 0 contradictory labels; the 61 kit pieces re-rendered with the closure code are byte-identical to the approved exports (`scripts/cierre-render.mjs`). Navigation: 48/48 on the Python server and 48/48 on localhost:5050, including the A/C alternatives and the editor; 300 local gallery links respond. The round 1–2 table above is historical evidence of those rounds.

**Acceptance criteria** — replace the last item with:

> - [x] Rafael's explicit design decision and exact approved scope are recorded (`DECISION.md`, 2026-10-07): B · Ficha round 2 approved for the lab; A/C kept as alternatives.

and add:

> - [ ] Decide whether the eight ZIP packages (≈ 63 MB; regenerated at closure, so a second set) stay in the commit or move to release assets.

**Decisions still open** — replace the whole section with:

> ## Decision (2026-10-07)
>
> Resolved by Rafael: direction B · Ficha round 2 with its three-mode allocation, one Microcosmos resource per value, Inter for exported text, local inks, deep-navy `#0A1520` surface and the right-side light on the wide cover, all as delivered. A · Lumen and C · Membrana kept as alternatives.
>
> ## Remaining items (adoption or next phase, not blocking this integration)
>
> Demonstration contact channel; visible source line vs caption per medium; use of the two motions as standard intros per network; platform specs and safe zones; package storage; canonical incorporation (separate issue, `MIGRATION-PLAN.md`).

**References** — rename «Pending decision and unresolved questions» to «Closure decision and approved scope», rename «Separate future incorporation plan» to «Incorporation plan (Spanish)», and add:

> - [Closure and migration request](…/labs/experiments/4-identidad-digital/ENCARGO-CIERRE.md)
> - [Migration specification](…/labs/experiments/4-identidad-digital/MIGRATION-PLAN.md)

**Project fields:** keep Status *In Review*, Type *Task*, Priority *P3*, Risk *None*, Effort *M*, Work type *Documentation*, Target release *N/A - visual laboratory* — the scope is still lab integration.

---

## PR #7

**Title** — replace with:

> Add closed Experiment 04: approved B · Ficha digital identity kit and Microcosmos

**Summary, third paragraph** (the bold one) — replace with:

> **Rafael closed Experiment 04 on 2026-10-07 and approved B · Ficha, round-2 refinement, for the visual laboratory. A · Lumen and C · Membrana are kept as alternatives; B round 1 is historical.** This PR integrates the closed experiment into the lab. It does not incorporate B into canonical tokens, assets, canvases or the publication guide (prepared in `MIGRATION-PLAN.md`, tracked separately), adopt it in the product, or authorize publication.

Keep: «Closes #6 (laboratory integration only; design approval and adoption remain separate).» — change to «Closes #6 (laboratory integration only; canonical incorporation and adoption remain separate).»

**Changes** — add:

> - Record the closure: approved scope, state matrix and history in `DECISION.md`; verbatim request in `ENCARGO-CIERRE.md`; consistent labels in gallery, editor, specimen, motion page, manifest, resource metadata, guides, contact sheets, packages and shared registers (`labs/index.html`, `labs/README.md`, `docs/estado-de-piezas.md`, `AGENTS.md`, `labs/CLAUDE.md`).
> - Add explicit access to the A/C alternatives (gallery chapter 2, editor, comparison package).
> - Prepare the canonical migration: `MIGRATION-PLAN.md` (English), `INCORPORACION.md` (Spanish) and drafts in `migration/`; nothing canonical is changed.
> - Add `scripts/cierre.py` (closure consistency check) and `scripts/cierre-render.mjs` (re-render identity check), with new closure evidence in `validacion/cierre-render.json`, `validacion/cierre.json`, `validacion/navegacion.json` and `validacion/vistas/cierre/`.

**Evidence** — add a line:

> - [x] Closure checks repeated for this update: `scripts/cierre.py` (no approved geometry, palette or composition changed; packages keep their binaries) `scripts/cierre-render.mjs` (61/61 pieces byte-identical) and `scripts/navegacion.mjs` on both servers (48/48 each), see `VALIDACION.md` §8.

**Limitations and review decisions** — replace the last two bullets with:

> - The eight generated ZIP files total approximately 63 MB and were regenerated at closure so their LEEME and metadata carry the approved state; committing them adds a second set to history. Recommendation: drop them from the commit and attach them to a release, keeping `scripts/empaquetar.sh`. Rafael decides.
> - Resolved on 2026-10-07: direction and modes, Inter, local inks, deep navy and the wide-cover light. Remaining adoption items: demonstration contact, source line per medium, motion use per network, platform specs. See `DECISION.md`.

**Céluma safeguards** — unchanged; add to the second item: «closure decision, migration plan and state registers aligned».
