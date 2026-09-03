# V3 Changelog — what actually changed from V2

This is an honest account, not a marketing summary. V2 was already a
strong, disciplined build — the "Nile Editorial" system, the gold/radius/
shadow discipline, the safeguarding and sourcing rigor, the reduced-motion
and no-JS fallbacks were all correct before this pass started. V3 does
**not** rewrite that system. It extends it in three shared, site-wide
ways, then applies those extensions across the pages where they carry
real content: **Home, About, Foundation, Our Work, Impact, News,
Partner**, plus a lighter motion-only touch on **Stories**.

Read `DEPLOYMENT_CHECKLIST.md` for what's still open, and see the
"Scope of this pass" note at the bottom of this file before assuming
every one of the 19 pages received bespoke new composition — 11 of them
didn't, and claiming otherwise would break the same factual-integrity
rule this project holds its content to.

## 1. Three new shared-system components (`assets/css/style.css`, `assets/js/motion.js`)

Because all 19 pages load one shared stylesheet and one shared motion
script, everything in this section is live on every page immediately,
whether or not that page's HTML uses it yet.

- **Chapter numeral** (`.chapter-num`) — a small gold, tabular-numeral
  prefix for a section's eyebrow line (e.g. `02 · Verified impact
  record`). This is the "editorial issue number" device the brief asked
  for, done typographically — no new colour, no icon — instead of
  literal "Chapter 02" labels.
- **Editorial list** (`.edit-list` / `.edit-row`) — a rule-separated,
  numeral-led row pattern: the same information a card grid holds,
  carried by type and a hairline instead of a bordered surface. This is
  the concrete "card reduction" pattern the brief calls for. First use:
  Home's Program Pillars (see below).
- **Reveal motion vocabulary** (`data-reveal-style="rise|mask|scale"`)
  — `motion.js` previously applied one fade-up-24px tween to every
  `[data-reveal]` element on the site, which is exactly the "generic
  reveal system" the brief flags as looking templated. It now supports
  three variants: `rise` (unchanged default), `mask` (a clip-path
  uncovering, used for long-form prose and pull-quote-adjacent blocks),
  and `scale` (a quieter opacity+scale settle, used for photography-
  and evidence-grid). All three keep the same safety guarantees as
  before: skipped outright under reduced motion, and every element is
  visible by default if GSAP/ScrollTrigger never load.

## 2. Home — the pages that got new composition, specifically

- **Hero**: at ≥1040px only, the hero grid moved from a near-even
  0.92fr/1.08fr split to a more asymmetric 0.74fr/1.26fr, the portrait
  frame carries a small negative top offset so it breaks the section's
  padding line, and a rotated micro-label + hairline ("Founder · Achai
  Wiir Foundation") sits along its left edge as an editorial rail. This
  is gated to wide desktop specifically so the hero layout already
  verified at mobile/tablet widths is untouched — see "What wasn't
  re-verified" below for why that gate matters.
- **Every homepage section** now carries a chapter numeral (02 through
  10; the hero itself is the unnumbered opening) in document order —
  Evidence, Leadership, Impact by place, Program Pillars, Field note,
  Milestone, News, Partner, Contact. Section order was **not** changed —
  re-sequencing content without being able to visually re-verify the
  result was judged too risky for this pass.
- **Program Pillars** converted from a 2×2 card grid to the new
  `.edit-list` numbered-row pattern — direct card-reduction, and it also
  breaks up what was previously three card-grid sections (Evidence,
  Program Pillars, News) appearing with the same visual shape.
- **Motion variety**: Evidence and Impact-by-place grids now use the
  `scale` reveal instead of the same `rise` every other grid on the page
  uses; the Leadership block's prose (which contains the pull-quote) uses
  `mask`.

## 3. About — numerals + motion variety only

Biography, Leadership principles, From Achai to the Foundation,
Milestones, and Selected recognition each got a chapter numeral (01–05).
The principle grid now reveals with `scale`, the timeline and the two
prose blocks with `mask`, instead of every block on the page using the
same `rise`. **No structural recomposition** was done on About — it
still uses the same profile-grid / principle-grid / timeline layout as
V2. Given the brief's own instruction to treat About as "a masterpiece"
editorial profile, that full recomposition is real, scoped work for a
next pass, not something folded quietly into this one — see
`DEPLOYMENT_CHECKLIST.md`.

## 4. Foundation — numerals + two pillar-grids converted to edit-list

Eight body sections numbered (01 Mission & geography through 08
Implementation partners & team; the closing Partner CTA banner is left
unnumbered, same rule as every page's terminal CTA — see §7). Both
`.pillar-grid` instances on this page — "Working categories" (the same
four categories as Home) and "How the Foundation works" (four sequential
process steps, which suit a numbered list arguably *better* than they
suited a card grid) — converted to `.edit-list`. Two prose blocks now
reveal with `mask`.

## 5. Our Work — numerals + one pillar-grid converted, program-grid kept

Three sections numbered (01 Working categories, 02 Featured outcome, 03
More programs). The "More programs" `.pillar-grid` (three pending
categories) converted to `.edit-list`, matching Foundation and Home. The
top `program-grid` — three cards that link out to distinct pages — was
**deliberately left as cards**: each one functions as a navigation tile
to a different destination, not a description of one thing in four
parts, so the card-reduction logic doesn't apply the same way. It picked
up `data-reveal-style="scale"` for motion variety only.

## 6. Impact — one numeral, motion variety on the archive grid

"Filter the archive" numbered 01 (the map+list section above it has no
eyebrow to number — left alone rather than inventing one). The archive's
`record-card` grid now reveals with `scale` instead of `rise`. No
structural change — the map, filter chips, and record cards are all
V2's, untouched.

## 7. News, Partner — numerals, one more pillar-grid converted, motion variety

**News**: three sections numbered (01 Official updates, 02 Independent
record, 03 Media kit); both news-card grids and the media-kit download
grid now use `scale`. **Partner**: five sections numbered (01–05); the
"Confirmed priorities & locations" `.pillar-grid` converted to
`.edit-list`; the partnership-types `program-grid` kept as cards (same
reasoning as Our Work — each card names a distinct partnership
mechanism, not a repeated shape); two prose blocks use `mask`. On both
pages, the closing enquiry-form section ("Media enquiry" / "Start a
conversation") is left unnumbered — consistent with Home's Contact
section design and Contact.html itself: a terminal call-to-action isn't
an editorial "chapter," it's the page doing its one job.

## 8. Stories — motion variety only

The single story-index grid now reveals with `scale`. No numeral added:
the page has exactly one body section, so there's nothing to number
against.

## 9. Untouched (11 of 19 pages)

Contact, the three field notes (`story-aweil-tricycles`,
`story-juba-orphanage-support`, `story-debt-clearance-partnership`), the
two detail-template pages (`impact-aweil-tricycles-2023`,
`our-work-disability-inclusion`), the four legal pages (privacy,
accessibility, safeguarding, terms), and 404. These inherit the shared
CSS/JS additions in §1 automatically (additive, so nothing on them
changes since none of them reference the new classes/attribute), but
received no direct edits. Contact and the field notes/detail pages are
single-narrative pages where the chapter-numeral device doesn't have
multiple sections to number against in the first place; the legal pages
and 404 were deliberately left alone — the brief's own instruction is to
keep legal pages typographically dignified, not to decorate them.

## Scope of this pass — read before presenting this as "V3 complete"

The source brief describes a full 15-step workflow across all ~19 pages,
including rendered-screenshot review at 15 viewport sizes per page and a
completely reworked homepage narrative structure. This environment has
no headless browser available, so **no screenshots were taken or
reviewed** — all QA below is code-level (link integrity, HTML nesting,
CSS/JS syntax, duplicate IDs, asset existence), not visual. Do a manual
pass in an actual browser at the viewports listed in `V3_QA_REPORT.md`
before this goes anywhere near a client or the public.

Treat this delivery as **Phase 1 of V3**: the shared system extensions,
applied to the 8 pages with the most content and traffic (Home, About,
Foundation, Our Work, Impact, News, Partner, Stories). The 11 remaining
pages — Contact, the three field notes, the two detail templates, the
four legal pages, and 404 — are the natural next targets if a Phase 2 is
wanted; the patterns to reuse (`.chapter-num`, `.edit-list`,
`data-reveal-style`) are already built and documented in
`V3_DESIGN_SYSTEM.md`, so extending them is a much smaller lift than
building them was. None of the 19 pages received the full recomposition
(new HTML structure, rewritten narrative arc, bespoke per-page
composition) the source brief describes — every page kept its V2
structure; what changed is typographic, motion, and one repeated
card-grid pattern.
