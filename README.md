# Achai Wiir & the Achai Wiir Foundation — flagship site (design concept)

A full, multi-page static build of the official concept site for Achai Wiir
and the Achai Wiir Foundation, on the "Nile Editorial" design system from
`07_WEBSITE_PLAN/DESIGN_SYSTEM.md` in the research package. This is the
flagship, ~2x-content expansion of the earlier one-page homepage concept:
**19 pages** in total — see "Pages" below.

## Design-psychology refinement pass

On top of the structure above, every page carries a second pass aimed
specifically at first-impression polish:

- **A personal monogram** ("AW", ringed in gold and a signature teal) in
  the header and the preloader — a bespoke mark reads as "made for her,"
  not "templated," which is most of what makes a design feel credible at
  a glance.
- **A signature teal accent**, sampled directly from the actual gown in
  her own hero portrait (`#1B6E86`) — not an invented brand colour, so it
  reads as authentically hers rather than a generic NGO palette. Used
  sparingly alongside the existing navy/gold system, never as a second
  competing palette.
- **A visible check-mark on every independently-verified figure**
  (`.status-pill.is-verified`) distinct from a hollow dot on anything
  still records-pending or working copy — an at-a-glance trust cue for a
  skimming visitor, without touching what's actually claimed anywhere.
- **Figures that count up into view** (Home's evidence numbers, the
  featured Our Work outcome, the Aweil record's fact sheet) instead of
  appearing static — `assets/js/delight.js`, vanilla JS, no library
  dependency, and it never animates a number this site doesn't already
  source elsewhere on the same page.
- **Tactile press feedback** on every button, card, and chip — a phone
  has no hover state, so a quick, physical-feeling `:active` response is
  what makes taps feel considered rather than inert.

None of this touches content, sourcing, or the rights/working-copy
labelling discipline below — it's presentation only, layered on top of
the same facts.

## Design-psychology refinement pass #2 — desktop depth & editorial detail

A second polish pass, layered on the same discipline: additive-only,
nothing here changes what any page claims, and every effect degrades
cleanly under `prefers-reduced-motion` or without JS.

- **Desktop hover now matches the mobile press.** Primary buttons lift
  with a soft shadow and a brief light sheen sweeps across on hover;
  the two card types that didn't yet have a hover state (`.principle-card`,
  `.download-card`) now match the rest; download-card thumbnails get a
  subtle image zoom on hover.
- **A thin gold corner-bracket on every reference photograph**
  (`.media-frame::before/::after`) — a museum-plate cue reinforcing
  "specific, curated record" rather than a generic stock crop. Never
  covers the "Reference image" tag, which stays bottom-left.
- **Portraits resolve into colour as they scroll into view** (hero,
  About's profile photo, the three Stories hero images) — strictly a
  progressive enhancement: every photo is full-colour by default in
  plain CSS, and only when JS + `IntersectionObserver` are both
  available does `motion.js` briefly desaturate a tagged portrait until
  it's actually in view. No JS, reduced motion, or a blocked script
  means the photo simply stays full colour, as it always did.
- **The primary nav marks the current page** — a persistent underline
  plus a small gold dot under the active link, instead of only a hover
  state; the hover underline itself now draws from the centre outward.
- **A pending status pill carries a faint diagonal texture**
  (`.status-pill.is-pending`), so "verified vs. pending" doesn't rely on
  colour (or the check/hollow-dot icon) alone.
- **An oversized gold quotation mark behind every `.quote`** — the kind
  of typographic flourish a print magazine uses to mark a pulled line,
  reusing the existing gold accent rather than a new colour.

## Status: working concept, not launch-ready

This is a front-end build for design and content review — not the
production site. Before anything here goes live:

- **Every photograph is reference-only.** Every portrait and event photo
  carries a visible "reference image · rights clearance pending" tag (or,
  on the three Stories field notes, an equivalent caption line under a
  full-bleed image). None are cleared for public use — see
  `00_META/RIGHTS_AND_APPROVALS.md` in the research package for what that
  clearance requires (owner, subject/guardian consent, credit line,
  approved channels).
- **Only publisher-reported figures are stated as fact**, each with its
  outlet, date, and a link to the original report: 300+ children (Juba,
  Jan 2022, Eye Radio), 98 tricycles (Aweil, Jan 2023, Radio Tamazuj), and
  8 people released from detention (Juba, Jul 2021, Eye Radio, jointly
  with the South Sudan Islamic Council). Two further locations — Mangalla
  (IDP support) and Wau (a mobility-aid event) — are documented only in
  Foundation channels or reference photography and are labelled **records
  pending** everywhere they appear, never presented as confirmed.
- **Nothing from the excluded-claims list appears anywhere**: the
  "2,000+ wheelchairs" figure, any "Award of Excellence" claim, and any
  Foundation registration/legal-entity/governance detail are all absent by
  design, including from image alt text and captions.
- **No fabricated contact details, anywhere.** No personal phone number,
  email address, or social handle is published for Achai Wiir or Foundation
  staff — every enquiry route on Contact, Partner, and News & Media routes
  by role instead (Partnerships, Media, Events, Safeguarding, General).
- **No donation or payment flow, anywhere.** "Partner with us" and
  "Discuss support" are the only giving-adjacent CTAs on the entire site.
- **Copy marked "working"** — biography, program descriptions, leadership
  principles, field notes, the media-kit bios — is placeholder editorial
  pending Achai's and the Foundation's sign-off, not approved final
  language. The three Stories field notes are explicitly labelled
  composite, illustrative narratives, not verbatim quotations from a real,
  identified person.
- **Child- and vulnerable-person safeguarding is a first-class rule, not
  an afterthought.** See `safeguarding.html`: no child is identified by
  full name, condition, or precise location without documented guardian
  consent, and the formerly-detained individuals in the 2021 debt-clearance
  story are never named or identified.
- **No donation flow; forms are previews.** Every form on the site (Home,
  Contact, News & Media enquiry, Partner) confirms in-page on submit and
  sends nothing anywhere until it's wired to a real inbox.

None of this needs to be stripped out before a client review — it's the
point of a concept build. It does need to come out (or be replaced with
approved material) before public launch. See
`07_WEBSITE_PLAN/ACHAI_WIIR_PREMIUM_WEBSITE_PLAN.md`, section
"Non-negotiable launch gates," for the full checklist.

## Before you share this link — WhatsApp / social preview

Every page has full Open Graph and Twitter Card meta tags, and there's a
custom 1200×630 preview image at `assets/img/og-cover.jpg`, so a link to
this site renders as a proper preview card (image, title, description)
when pasted into WhatsApp, iMessage, Slack, etc. — not just a bare URL.

**This only works once the site is hosted somewhere with a real URL.**
Every page's `<head>` currently uses a placeholder domain,
`https://REPLACE-WITH-YOUR-DOMAIN`, in its canonical link and its
`og:url` / `og:image` / `twitter:image` tags. Before sending this link to
anyone:

1. Deploy the site (GitHub Pages is the simplest option, and matches how
   the reference "Nakiyi" site is hosted).
2. Find-and-replace `REPLACE-WITH-YOUR-DOMAIN` with your real deployed
   domain across every `.html` file in this folder — e.g. on macOS/Linux:
   `grep -rl "REPLACE-WITH-YOUR-DOMAIN" *.html | xargs sed -i '' -e 's#https://REPLACE-WITH-YOUR-DOMAIN#https://your-real-domain#g'`
   (drop the empty `''` after `-i` on Linux).
3. Re-upload, then test the preview with a tool like
   [WhatsApp's own share preview] or by pasting the link in a chat to
   yourself — some platforms cache a stale preview for a URL they've seen
   before, so a first-time share of the exact URL gives the truest test.

## Pages

```
index.html                              Home
about.html                              About Achai — long-form profile + full milestone timeline
foundation.html                         The Foundation — mission, programs, governance status
our-work.html                           Our Work — index of the 4 working program categories
our-work-disability-inclusion.html      Our Work — full program template (Disability Inclusion & Mobility)
impact.html                             Impact Archive — SVG map + year/location/status filters
impact-aweil-tricycles-2023.html        Impact Archive — full record template (Aweil, Jan 2023)
stories.html                            Stories — index
story-aweil-tricycles.html              Field note — Aweil tricycle distribution
story-juba-orphanage-support.html       Field note — Juba orphanage-centre support
story-debt-clearance-partnership.html   Field note — 2021 debt-clearance partnership
news.html                               News & Media Centre — coverage + full Media Kit
partner.html                            Partner / Support — 5 partnership types, no donation flow
contact.html                            Contact — role-routed enquiry form
privacy.html, accessibility.html,       Legal essentials — short, honest, "pending legal review"
  safeguarding.html, terms.html
404.html                                On-brand 404 with a correction-report route
```

Only one program (Disability Inclusion & Mobility) and one impact record
(Aweil tricycles) have full detail-page templates built out — they have
the strongest sourced evidence. `our-work.html` and `impact.html` both
say so plainly and link to where the other categories' evidence currently
lives (a Foundation page section, a related field note); build their own
full pages from the same template once comparable evidence is confirmed.

## Structure

```
index.html, about.html, ... (19 pages, flat, no build step)
assets/
  css/style.css        one shared stylesheet — the full "Nile Editorial" design
                        system plus the flagship-site components (timeline,
                        impact map, media kit, legal/404 layout, magazine story
                        layout, mobile sticky action bar)
  js/
    main.js             mobile menu + all contact-style form previews
    motion.js            Lenis smooth scroll + GSAP/ScrollTrigger reveals
    preloader.js          the engraved-portrait preloader (Home only — see below)
    archive-filter.js     generic chip-driven filtering (Home's impact teaser,
                            the full Impact Archive)
    impact-map.js          syncs the Impact Archive's SVG map markers with its
                            plain-text place list
    delight.js             count-up animation for already-sourced figures only
  img/                   reference photography, the Foundation logo, and the
                          social-share preview image (og-cover.jpg)
  fonts/
    manrope/              Manrope, 400/500/600/700, WOFF2, SIL OFL
    cormorant-garamond/   Cormorant Garamond, 500/500italic/600/700, WOFF2, SIL OFL
```

Fonts are self-hosted and subset — no external font request. `gsap`,
`ScrollTrigger`, and `lenis` load from their public CDNs (cdnjs /
jsdelivr); everything else is local, and no page uses `fetch()` against a
local file, so the whole zip works by double-clicking `index.html` — no
server required. (This was tested directly: unzip, open `index.html` via
`file://`, click through the site.)

### Why the preloader is Home-only

The engraved-portrait preloader (the hand-drawn line portrait that draws
in, then resolves into the real photo) is a ~230KB inline SVG of 500+
paths. Carrying it on all 19 pages would mean shipping that same 230KB
+19 times over for an intro animation that, by design, only shows once
per browser session anyway (it's `sessionStorage`-gated). It runs on Home,
where a first-time visitor is most likely to land; every other page loads
straight in. If you'd rather it ran site-wide, the SVG markup is in
`site_kit`'s `preloader()` output from the build scripts, or can be copied
from `index.html`'s `<div class="preloader">` block into any other page's
same spot, plus adding `<script src="assets/js/preloader.js" defer></script>`
before `</body>`.

## How the motion holds up without JavaScript or a blocked CDN

Every animated thing on every page is a progressive enhancement over
content that already reads correctly without it:

- If `gsap` / `ScrollTrigger` / `Lenis` fail to load (network policy,
  ad-blocker, offline), `motion.js` and `preloader.js` detect that and
  no-op — content appears at full opacity with no animation, scrolling
  stays native. (This build was tested and screenshotted entirely under
  exactly this condition — a network policy that blocks both CDN hosts —
  and every page reads and works correctly.)
- `prefers-reduced-motion: reduce` skips the preloader outright and
  disables all scroll reveals and the hero entrance the same way.
- The Impact Archive's map and filters, and every form's submit-preview,
  are plain JavaScript with no library dependency — they work identically
  whether GSAP/Lenis load or not.
- The preloader shows once per browser session (`sessionStorage`) and is
  also skipped on a metered connection (`navigator.connection.saveData`).

## Mobile

This build was designed and verified mobile-first at 375/390/430px
(iPhone SE/13/Pro Max widths): full-bleed photography, a fluid type scale,
44–52px minimum tap targets, and a persistent mobile-only sticky action
bar (Contact / Partner with us) so the two things a phone visitor
actually wants to do are always one thumb's reach away, on every page,
without hunting the header. Safe-area insets are respected for iOS
devices with a home indicator.

## Previewing it

Open `index.html` directly in a browser — nothing here depends on a
server. For the closest match to how it'll behave once deployed, serve
the folder instead of double-clicking the file, e.g. from this folder:

```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Design system reference

Colour tokens, type scale, spacing, and component rules are documented in
`07_WEBSITE_PLAN/DESIGN_SYSTEM.md` in the research package this build was
made from; `assets/css/style.css` implements them directly (see the
`:root` block near the top of the file for the token values), plus the
flagship-site additions documented inline in that file's own comments.
