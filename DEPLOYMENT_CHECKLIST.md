# Deployment Checklist

Two categories: items carried over unchanged from V2 (still required,
this pass didn't touch them), and items specific to this V3 pass.

## Carried over from V2 — still required before public launch

1. **Deploy, then replace the placeholder domain.** Every page's
   canonical link, `og:url`, `og:image`, and `twitter:image` currently
   read `https://REPLACE-WITH-YOUR-DOMAIN`. Find-and-replace across all
   19 `.html` files with the real deployed domain, then re-test the
   social-preview card with a fresh (never-shared-before) URL.
2. **Rights clearance on every photograph**, or replace with cleared
   imagery. Every portrait/event photo is still tagged "reference image
   · rights clearance pending."
3. **Sign-off on all "working copy" text** — biography, program
   descriptions, leadership principles, field notes, media-kit bios —
   from Achai and the Foundation before it's presented as final.
4. **Wire the three preview forms** (Home contact, Contact page, News &
   Media enquiry, Partner) to a real inbox/routing system, or keep the
   current "design preview only" notice visible if launching before
   that's ready. Don't remove the notice without wiring the form.
5. **Confirm official social channels** before linking them — the
   footer's "Official channels" column is intentionally empty pending
   that confirmation.
6. **Foundation registration/governance details** — currently absent by
   design (per the excluded-claims list in the original README). Add
   only once the Foundation confirms exact, citable status.
7. **Reconcile the Aweil figure** — the evidence card for Aweil notes an
   earlier plan referenced "100 motorised wheelchairs" against the
   sourced 98 tricycles; resolve which figure/terminology is correct
   with Foundation records before launch.

## Specific to this V3 pass

8. **Do the visual QA this pass couldn't do.** No headless browser was
   available in this environment — nothing in V3 has been screenshotted
   or opened in an actual browser. Before this goes anywhere near a
   client: open all 8 edited pages (`index`, `about`, `foundation`,
   `our-work`, `impact`, `news`, `partner`, `stories`) at minimum 390px,
   768px, 1024px, 1440px, 1920px, and confirm the hero-rail, asymmetric
   hero grid, every `.edit-list` row, and every `mask`/`scale` reveal
   look and move the way `V3_QA_REPORT.md` reasons they should. See that
   file's "What was NOT tested" section for the full list.
9. **Decide whether to extend the V3 pattern to the remaining 11
   pages** — Contact, the three field notes, the two detail templates,
   the four legal pages, and 404 — or ship the 8 already covered as this
   phase's scope. The reusable pieces (`.chapter-num`, `.edit-list`,
   `data-reveal-style`) are built and documented in
   `V3_DESIGN_SYSTEM.md`. Note that several of the untouched pages
   (Contact, the field notes, the two detail templates) are
   single-narrative pages that may not need the chapter-numeral device
   at all — that's a judgement call for whoever extends this, not
   something this checklist should presume.
10. **Confirm the `mask` reveal's `clip-path` tween** specifically on
    About's timeline (`.timeline`) — it's the one place in this pass
    where the new motion vocabulary meets a component (alternating
    left/right timeline items at ≥900px) that wasn't originally designed
    with a clip-path reveal in mind. If it reads oddly at that
    breakpoint, drop that one element back to `data-reveal-style="rise"`
    (or remove the attribute entirely, since `rise` is the default).

## Not required, but worth deciding on purpose

- `.pillar-card`/`.pillar-grid` is no longer used by any of the 19
  pages — every instance (Home, both on Foundation, Our Work's "More
  programs", Partner's "Confirmed priorities") has been converted to
  `.edit-list`. The class pair is still defined in `style.css`; nothing
  breaks by leaving it there, but it's safe to delete in a future
  cleanup pass if it stays unused. Not deleted here since removing CSS
  wasn't this pass's scope and doing it well means re-confirming nothing
  references it under a different page's inline markup first.
