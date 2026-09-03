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
