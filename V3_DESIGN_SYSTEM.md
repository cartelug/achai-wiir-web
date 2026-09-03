# V3 Design System — "Nile Editorial"

This documents the system as it exists in `assets/css/style.css` right
now: the V2 tokens and components (unchanged) plus the V3 additions
(marked). Where a value lives in `:root`, it's given as the CSS variable
name, not a restated hex/px value, so this file can't drift from the
stylesheet.

## Colour

| Token | Role |
|---|---|
| `--navy` / `--navy-2` | Primary ink for headings on light ground; dark-section background |
| `--ivory` / `--ivory-2` | Page ground; alternating section band |
| `--ink` | Body text |
| `--gold` / `--bronze` | Accent — used sparingly: rules, active states, numerals, links. See "Gold discipline" below |
| `--stone` | Borders, dividers, hairlines |
| `--slate` | Secondary/meta text |
| `--teal` / `--teal-deep` | Signature accent, sampled from Achai's own hero-portrait gown — verified-record marks, preloader crest, monogram ring. Never a second competing palette |

**Gold discipline (unchanged from V2, worth restating):** gold marks a
key word, a rule, an active state, a numeral — never a fill, never a
gradient, never more than a hairline or a few characters at a time. The
new `.chapter-num` and `.edit-idx` numerals follow this exactly: gold
text on an ivory or navy ground, nothing else.

## Typography

Display: `--display` (Cormorant Garamond). Body/UI: `--body` (Manrope).
Both self-hosted, subset, `font-display: swap`.

Fluid scale (already solved as true linear interpolation 375px→1440px,
not eyeballed `clamp()`): `--fs-hero`, `--fs-h1`, `--fs-h2`, `--fs-h3`,
`--fs-lead`, `--fs-bodyl`, `--fs-body`, `--fs-ui`, `--fs-cap`,
`--fs-eyebrow`.

### Typographic roles in use (by selector, not by raw size)

- **Hero display** — `.hero h1` at `--fs-hero`
- **Page H1** — `.page-hero h1` at `--fs-h1`
- **Section heading** — `.section-head h2` at `--fs-h2`
- **Chapter numeral** *(V3)* — `.chapter-num`: gold, bold, tabular-nums,
  prefixes a section's `.eyebrow` line. Used in document order on Home,
  About, Foundation, Our Work, Impact, News, and Partner as a quiet
  "issue number" cue — a page's own hero eyebrow (its title, e.g. "About
  Achai") never gets one, and neither does a page's terminal
  contact/enquiry CTA (that's the page doing its job, not a chapter of
  it). See `V3_CHANGELOG.md` for exactly which sections carry one on
  each page.
- **Eyebrow** — `.eyebrow`: 700 weight, uppercase, `--fs-eyebrow`,
  `--bronze` (or `--stone` via `.on-navy`)
- **Lead** — `.lead` at `--fs-lead`
- **Pull quote** — `.quote`: oversized gold `"` glyph behind the line
  (`.quote::before`), reusing `--gold` at low opacity
- **Evidence / milestone numeral** — `.evidence-num`, `.milestone-year`:
  display face, tabular-nums, large
- **Editorial-row index** *(V3)* — `.edit-idx`: same numeral treatment
  as evidence/milestone, sized to sit beside a heading rather than stand
  alone
- **Caption / metadata** — `.fs-cap`, `.route-desc`, `.place-meta`, etc.

## Spacing, radius, shadow, border (unchanged)

- `--gutter` (20px, 24px ≥430px), `--maxw` (1180px)
- `--radius: 2px` — square-leaning geometry throughout; no SaaS-style
  large corner rounding anywhere in the system
- Section rhythm: `section { padding-block: 72px }`, `112px` ≥720px,
  `.tight` variants at `56px`
- Shadows appear only on hover-lift states (cards, primary buttons at
  ≥860px) — never as a resting/static surface treatment

## Components — card-based (V2, unchanged)

`.evidence-card`, `.news-card`, `.pillar-card` *(still defined; Home no
longer uses it — see below)*, `.record-card`, `.program-card`,
`.principle-card`, `.download-card`, `.partner-card`, `.place-card`.

## Components — rule/type-based, the card-reduction alternative *(V3)*

`.edit-list` / `.edit-row` / `.edit-idx`: a numeral-led, rule-separated
row. Same information density as a 2-up or 3-up card grid, no bordered
surface. Live on Home, Foundation (both of its former pillar-grids),
Our Work ("More programs"), and Partner ("Confirmed priorities &
locations") — every `.pillar-grid`/`.pillar-card` instance in the site
has now been converted; that class pair is still defined in the
stylesheet (nothing currently renders it) but there's no live example
left to point to. Reach for `.edit-list` first on any future "working
categories"-shaped content, and ask "does this genuinely need a card" —
per the brief's own card-reduction rule — before reaching for a bordered
grid at all. `.program-grid`/`.program-card` and `.news-card` are
different: those are still in active, deliberate use (Our Work, Partner,
News, Stories) because each card there is a distinct navigational
destination or a distinct source, not a repeated shape of the same kind
of fact — see `V3_CHANGELOG.md` §5 and §7 for the reasoning on each.

## Motion

### Vocabulary *(V3 — see `assets/js/motion.js`)*

`[data-reveal]` accepts `data-reveal-style`:

- **`rise`** *(default, unchanged)* — opacity 0→1, `y:24→0`. The
  original, still correct for most grids and short blocks.
- **`mask`** — opacity + `y:18→0` + `clip-path: inset(0% 0% 100% 0%) →
  inset(0% 0% 0% 0%)`. An "uncovering" reveal for long-form prose,
  timelines, and pull-quote-adjacent blocks.
- **`scale`** — opacity 0→1 + `scale: 0.96→1`, no vertical travel. A
  quieter settle for photography and evidence/record grids.

All three: GSAP-only, gated behind `!REDUCED && hasGSAP`, `once: true`
per `ScrollTrigger`, and every element is at full opacity by default in
plain CSS — none of this is a gate on seeing content.

### Existing motion patterns (V2, unchanged, still correct)

- Hero title: line-by-line masked reveal via `.line`/`.line-inner`
  (`overflow:hidden` + `yPercent` tween) — this **is** the "masked line
  reveal" the brief asks for under Motion Language 01; it predates this
  pass and needed no change.
- `.frame-cover` wipe on hero/scroll-triggered images — a solid panel
  that scales away to uncover a photo, itself a form of masked reveal
  for photography (Motion Language 02).
- `.count-up` figures (`delight.js`) on already-sourced numbers only.
- Header shrink + scroll-progress bar, nav underline-from-centre +
  active-page dot, portrait tone-reveal (`[data-tone-reveal]`) — all
  unchanged.

## Hero rail *(V3, ≥1040px only)*

`.hero-rail`: a rotated (`-90deg`) micro-label + 34px hairline,
absolutely positioned to the left of the hero media frame. Paired with
an asymmetric `0.74fr / 1.26fr` hero-grid split and a `-30px` top offset
on `.hero-media`, replacing the near-even split below that breakpoint.
Deliberately gated to a width band that couldn't be re-verified visually
in this environment without carrying that risk down into mobile/tablet,
which **were** previously verified (see `V3_QA_REPORT.md`).

## What this file doesn't cover yet

Grid/breakpoint documentation for the Impact map, media kit tabs, and
detail-page sidebar are unchanged from V2 and not re-documented here —
read the inline comments in `style.css` directly (search for "Impact
map", "Media kit", "Detail page").
