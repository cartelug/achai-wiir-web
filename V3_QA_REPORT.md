# V3 QA Report

**Read this before treating the site as visually verified.** This
environment has no headless browser (no Chromium/Playwright/Puppeteer
available, and the sandbox's outbound network is limited to package
registries — it can't download one). Every check below is code-level.
**No page was actually rendered or screenshotted at any viewport.** The
brief's own required-viewport-testing matrix (5 mobile / 3 tablet / 5
desktop sizes × ~19 pages) was not performed and should not be assumed
done.

## What was actually tested, and how

### 1. Internal link integrity — PASS (0 broken, all 19 pages)
Every `href`/`src` across all 19 HTML files was parsed and checked
against the files and assets actually present on disk (script-based, not
manual clicking). Checked before this pass started (V2 baseline), after
the first edit (Home + About), and again after extending to Foundation,
Our Work, Impact, News, Partner, and Stories. Result every time: **0
broken internal links, 0 missing asset references** (CSS, JS, images,
fonts). External links (`eyeradio.org`, `radiotamazuj.org`, the
GSAP/Lenis CDN `<script>` tags) were not fetched — they were already
present in V2 and untouched here.

### 2. HTML structural validity — PASS (all 19 pages)
Parsed with Python's `html.parser` and checked for unclosed, stray, or
mismatched tags, across every page in the folder — not just the 8 that
were edited; a global check is cheap enough to run on all of them
regardless. **0 errors, 0 unclosed elements, all 19 pages.**

### 3. Duplicate `id` attributes — PASS (all 19 pages)
Checked per-page (an `id` duplicated within one page is invalid HTML and
can silently break `getElementById`/anchor-link targeting). None found,
checked after every round of edits.

### 4. CSS syntax — PASS
`style.css` brace count: 469 open / 469 close, balanced, both before and
after the V3 additions. Not a full CSS parse/lint — a balance check
catches unclosed rules, which is the failure mode a manual edit like
this one risks.

### 5. JavaScript syntax — PASS (all 6 files)
`node --check` on `motion.js`, `main.js`, `preloader.js`,
`archive-filter.js`, `impact-map.js`, `delight.js`. All parse cleanly.
This confirms syntactic validity, **not runtime behaviour** — it doesn't
catch a typo'd selector or an event that never fires, only a script that
would outright fail to load.

### 6. Placeholder-domain audit — as expected
`REPLACE-WITH-YOUR-DOMAIN` appears in all 19 pages' canonical/OG/Twitter
tags, same as V2. This is correct pre-deployment state, not a defect —
see `DEPLOYMENT_CHECKLIST.md` item 1.

## What was NOT tested — do these before this goes to a client

- **Visual rendering at any viewport.** No screenshots exist of V3. The
  hero-rail (`≥1040px`), the asymmetric hero grid, every `.edit-list`
  row, and every `mask`/`scale` reveal have not been seen rendered —
  only reasoned through against the existing, already-verified CSS they
  extend. Open each of the 8 edited pages in an actual browser at
  minimum 390px, 768px, 1024px, 1440px, and 1920px before sharing any of
  them further.
- **Motion in motion.** The `clip-path` interpolation GSAP performs for
  `data-reveal-style="mask"` was reasoned to be safe (GSAP tweens
  `inset()` clip-path values natively), but was not watched running.
  Confirm it reads as a clean uncover, not a jump-cut, everywhere it's
  used — About's timeline is the one case where it meets a component
  (alternating left/right items at ≥900px) that wasn't originally
  designed with a clip-path reveal in mind; see
  `DEPLOYMENT_CHECKLIST.md` item 10.
- **Cross-browser / real-device check.** Nothing here was opened in
  Safari, or on an actual phone. V2's README states it was previously
  verified this way; that verification predates this pass's edits.
- **The 11 untouched pages**, beyond the link/asset/duplicate-ID/HTML-
  nesting checks above (which ran on all 19), were not reviewed for
  anything else — they carry no V3 changes to review.
- **Lighthouse / performance / accessibility-audit tooling.** Not run.
  V2's existing accessibility groundwork (skip link, focus-visible,
  reduced-motion handling, labelled forms) is unchanged by this pass and
  wasn't re-audited beyond the structural checks above.

## Pages touched in this pass

| Page | Changed | Re-checked |
|---|---|---|
| `index.html` | Hero rail/grid, 9 chapter numerals, Program Pillars → edit-list, reveal variety | Links, HTML nesting, CSS/JS validity |
| `about.html` | 5 chapter numerals, reveal variety | Links, HTML nesting, CSS/JS validity |
| `foundation.html` | 8 chapter numerals, both pillar-grids → edit-list, reveal variety | Links, HTML nesting, CSS/JS validity |
| `our-work.html` | 3 chapter numerals, "More programs" pillar-grid → edit-list, reveal variety | Links, HTML nesting, CSS/JS validity |
| `impact.html` | 1 chapter numeral, reveal variety on archive grid | Links, HTML nesting, CSS/JS validity |
| `news.html` | 3 chapter numerals, reveal variety | Links, HTML nesting, CSS/JS validity |
| `partner.html` | 5 chapter numerals, one pillar-grid → edit-list, reveal variety | Links, HTML nesting, CSS/JS validity |
| `stories.html` | Reveal variety only (single section — no numeral) | Links, HTML nesting, CSS/JS validity |
| `assets/css/style.css` | V3 additions — additive only | Brace balance |
| `assets/js/motion.js` | Reveal-variant branch added | `node --check` |
| Other 11 pages (Contact, 3 field notes, 2 detail templates, 4 legal, 404) | No direct edits | Links, HTML nesting, missing-asset, duplicate-ID |

## Known limitations carried over from V2 (unchanged, restated for
   completeness — not new to this pass)

Everything in V2's own README under "Status: working concept, not
launch-ready" still applies verbatim: reference-only photography, no
donation flow, working-copy biography and program text, no confirmed
Foundation registration/governance detail, placeholder canonical domain.
This pass did not touch content, sourcing, or any claim on any page.

## Desktop scroll-performance pass (post-delivery fix)

A "heavy scroll" report on desktop led to a real, verified root-cause fix
— not a guess:

1. **`backdrop-filter` on two scroll-affected elements.** `header.site`
   (`position:sticky`) and `.mobile-cta-bar` (`position:fixed`) both
   carried `backdrop-filter:blur(...)`. A blurred backdrop behind a
   sticky/fixed element has to be recomputed continuously as new content
   passes underneath it — a well-documented, genuinely expensive
   per-frame cost, worse the longer the page (Home renders to ~9,800px).
   Both already sat at 92–97% background opacity, where blur's visual
   contribution was marginal — so it was removed outright rather than
   just reduced, with background opacity nudged up slightly (header
   0.92→0.96, CTA bar 0.94→0.97) to hold the same visual read.
2. **Two unsynced animation-frame loops.** Lenis was driving itself on
   its own independent `requestAnimationFrame` loop, separate from
   GSAP's own ticker (which drives every tween and ScrollTrigger). Two
   independent raf loops aren't guaranteed to execute in the same order
   within a frame — a documented cause of jitter when Lenis and GSAP are
   both present. Fixed by wiring Lenis onto `gsap.ticker.add()` instead
   (with `gsap.ticker.lagSmoothing(0)`), the integration Lenis's own
   docs recommend when GSAP is present — confirmed against Lenis's
   GitHub README, not assumed.
3. **Lenis `duration` lowered 1.05s → 0.85s.** Per Lenis's own docs,
   duration is literally the heavy-vs-snappy knob ("higher values feel
   heavier and more cinematic; lower values feel snappier") — confirmed
   via Lenis's own documentation, not guessed. Still well under the
   library's own default of 1.2s pre-fix; now clearly on the snappy side
   of it, matching this project's own brief ("responsive... never
   sluggish, never overly eased").

**Not re-verified visually** — same limitation as the rest of this
report: no headless browser in this environment, so the *feel* of the
fix (does it now actually read as snappy) hasn't been watched, only
reasoned from documented cause → documented fix. Confirm on a real
desktop browser before calling this closed.

## Responsiveness pass (post-delivery)

A follow-up request to make the site "more responsive" on both mobile
and desktop. Distinct from the earlier scroll-performance fix — this
targeted forced waits, load priority, and interaction-feedback speed.

1. **Preloader forced-minimum cut from ~2.44s to ~1.1s (55% less).**
   The engraved-line-drawing intro had a hard-coded minimum runtime
   (149 rows × 5.5ms stagger + fixed resolve/fade stages) that applied
   on *every* first visit regardless of connection speed — and
   `body.is-locked{ overflow:hidden }` meant scroll was fully blocked
   for that whole window. Retimed every stage (row stagger, resolve,
   fade) by a uniform ~0.45× factor, so the sequence is proportionally
   identical, just not glacial. This also brings it back in line with
   this project's own original brief, which explicitly calls for "no
   long wait" on the intro.
   - **Caught in the process:** the preloader crest's own fade/scale-in
     transition (520ms + 120ms delay = 640ms) was tied to the same
     `is-resolving` class as the portrait, but I'd only retimed the
     portrait's transition, not the crest's — it would have been cut off
     mid-animation once the JS moved on after the new, shorter
     RESOLVE_MS. Retimed it too (now 235ms + 55ms delay = 290ms),
     re-verified it fits inside the new 370ms window with margin.
2. **Image loading priority.** None of the site's 30 `<img>` tags had
   `loading` or `decoding` attributes — every image on every page loaded
   eagerly, competing for bandwidth with whatever's actually above the
   fold. Added `decoding="async"` to all 30 (always safe, never delays
   paint) and `loading="lazy"` to the 11 that are never the first image
   on their page (footer logo on all 19 pages, plus secondary photos on
   About/Index/News/the three field notes) — the first image per page
   stays eager for fastest initial paint.
3. **Hover-feedback transitions tightened.** Two were slow relative to
   the rest of the system's 160–320ms interactive language: the primary-
   button sheen sweep (640ms → 380ms) and the card image hover-zoom
   (700ms → 400ms, `.media-frame img`, used by download/record/program
   card hovers).
4. **Scroll-entrance reveals tightened.** The `rise`/`scale`/`mask`
   reveal durations from the earlier V3 pass (0.75s/0.8s/0.9s) are now
   0.45s/0.5s/0.55s, and the reveal-group stagger is 0.06s (was 0.09s) —
   content that's scrolled past no longer visibly lags behind a fast
   scroller. The hero's own entrance (title lines, hero items, frame-
   cover wipe — the first thing a visitor sees right after the
   preloader) got the same tightening, proportionally.
5. **Left alone, on purpose:** `[data-tone-reveal] img{ transition:filter
   900ms }` — the one-time desaturate-to-colour reveal on portraits as
   they scroll into view. Nothing is blocked while it runs (it's a
   passive colour fade, not a gate on any interaction), and it's a
   deliberate "cinematic" pacing choice the brief explicitly asks for —
   tightening every animation indiscriminately would have traded the
   site's actual character for a number, not for anything a visitor
   would experience as "more responsive."

**Not re-verified visually** — same standing limitation: no headless
browser here, so none of this has been watched running. The JS/CSS
timing-value pairs were cross-checked numerically (see the constants
listed above) rather than eyeballed, which is how the crest desync was
actually caught — but confirm the feel on a real browser before this
goes out.
