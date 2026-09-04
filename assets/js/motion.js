/* ============================================================
   Achai Wiir — motion.js
   GSAP/ScrollTrigger reveals, off native scroll. Loaded after the
   gsap / ScrollTrigger CDN <script> tags in index.html, and before
   preloader.js (which dispatches the 'preloader:done' event this file
   listens for to time the hero entrance).

   v6.1: this used to also run Lenis (JS-driven smooth scroll). Removed —
   it was the source of a reported "heavy"/glitchy scroll feel: Lenis
   eases every wheel/touch input through its own virtual scroll position,
   which (a) reads as laggy compared to native scroll on exactly the kind
   of heavier, image-heavy sections this redesign added, and (b) is a
   known source of desync with position:sticky elements (the header,
   meta-card sidebars, the map frame), since sticky positioning is
   computed against native scroll and Lenis's virtual position doesn't
   always land in the same frame. Native scroll plus CSS
   scroll-behavior:smooth (see style.css, already off under reduced
   motion) gives the same "smooth anchor-link jump" without either
   problem, and drops one external CDN dependency in the process.

   Everything here is a progressive enhancement over a page that already
   works and reads correctly without it: reduced motion skips it
   outright, and a blocked CDN (window.gsap undefined) makes every
   function below a silent no-op, leaving plain CSS in charge — see
   README.md for the fallback behaviour this guarantees.
   ============================================================ */
(function(){
  function reducedMotion(){
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; }
  }
  var REDUCED = reducedMotion();
  var hasGSAP = Boolean(window.gsap && window.ScrollTrigger);
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
  }

  /* Anchor links: native scrollIntoView with a manual offset tween isn't
     needed — scroll-behavior:smooth (CSS) already animates the jump;
     this just corrects the landing position for the sticky header's
     height, which a plain #hash jump / scrollIntoView doesn't know
     about. */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    a.addEventListener('click', function(e){
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerEl = document.querySelector('header.site');
      var offset = (headerEl ? headerEl.offsetHeight : 68) + 12;
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Header: scroll-progress + shrink on scroll ---------- */
  var header = document.querySelector('header.site');
  var progress = document.getElementById('scrollProgress');
  function onScroll(){
    var y = window.scrollY || window.pageYOffset || 0;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (progress) {
      var max = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      var pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      progress.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (hasGSAP) ScrollTrigger.addEventListener('refresh', onScroll);
  onScroll();

  /* ---------- Hero entrance ---------- */
  function playHero(){
    var lines = document.querySelectorAll('[data-hero-title] .line-inner');
    var items = document.querySelectorAll('[data-hero-item]');
    var cover = document.querySelector('[data-frame-cover="hero"]');
    if (!hasGSAP || REDUCED) return;
    var tl = gsap.timeline();
    tl.set(lines, { yPercent: 112 })
      .set(items, { opacity: 0, y: 16 })
      .to(lines, { yPercent: 0, duration: 0.6, ease: 'power4.out', stagger: 0.06, clearProps: 'transform' }, 0.05)
      .to(items, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.05, clearProps: 'transform' }, 0.2);
    if (cover) {
      tl.set(cover, { scaleX: 1, transformOrigin: 'left center' }, 0)
        .to(cover, { scaleX: 0, transformOrigin: 'right center', duration: 0.6, ease: 'power3.inOut' }, 0.22);
    }
  }
  window.addEventListener('preloader:done', playHero, { once: true });

  /* ---------- Scroll reveals ----------
     A small vocabulary, not one class applied everywhere: [data-reveal]
     without a style still gets the original "rise" (opacity+translateY);
     [data-reveal-style="mask"] adds a clip-path uncovering for large
     type and pull-quotes; [data-reveal-style="scale"] is a quieter
     opacity+scale settle for photography and evidence/record grids, so
     Home doesn't read as one fade-up class repeated section after
     section. Every variant still degrades to plain, visible content
     under reduced motion or a blocked CDN — only the *how* changes. */
  if (hasGSAP && !REDUCED) {
    document.querySelectorAll('[data-reveal]').forEach(function(el){
      var kids = el.hasAttribute('data-reveal-group') ? Array.prototype.slice.call(el.children) : [el];
      var style = el.getAttribute('data-reveal-style') || 'rise';
      var fromVars, toVars;
      if (style === 'mask') {
        fromVars = { opacity: 0, y: 18, clipPath: 'inset(0% 0% 100% 0%)' };
        toVars   = { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.out' };
      } else if (style === 'scale') {
        fromVars = { opacity: 0, scale: 0.96 };
        toVars   = { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' };
      } else {
        fromVars = { opacity: 0, y: 24 };
        toVars   = { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' };
      }
      gsap.set(kids, fromVars);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function(){
          /* clearProps: once the tween lands, drop the inline transform it
             leaves behind — otherwise that inline style (which beats a
             class selector) would permanently block each card's own
             :hover lift after its one-time reveal finishes.

             fromTo(), not to(): a plain to() must read the CURRENT value
             via getComputedStyle() the moment it fires, and browsers don't
             reliably round-trip clip-path/inset() back through computed
             style in a format GSAP can string-interpolate against a
             hand-written end value — confirmed against GSAP's own
             maintainer guidance (see V3_QA_REPORT.md). fromTo() instead
             feeds GSAP the exact fromVars object already in hand, so
             there's no computed-style round-trip for any variant to trip
             on — not just the mask/clip-path one. */
          var tw = Object.assign({}, toVars, { stagger: 0.06, clearProps: 'transform' });
          gsap.fromTo(kids, fromVars, tw);
        },
      });
    });

    document.querySelectorAll('[data-frame-cover="scroll"]').forEach(function(cover){
      var frame = cover.closest('.media-frame, .story-media');
      if (!frame) return;
      gsap.set(cover, { scaleX: 1, transformOrigin: 'left center' });
      ScrollTrigger.create({
        trigger: frame,
        start: 'top 80%',
        once: true,
        onEnter: function(){
          gsap.to(cover, { scaleX: 0, transformOrigin: 'right center', duration: 0.6, ease: 'power3.inOut' });
        },
      });
    });
  }

  /* ---------- Portrait tone-reveal ----------
     Independent of GSAP on purpose. Every [data-tone-reveal] photo
     is already full-colour in plain CSS (see style.css) — this only ever
     *adds* a brief, reduced-motion-respecting desaturation that resolves
     when the portrait scrolls into view. If this script never runs (blocked
     CDN, JS disabled) or IntersectionObserver isn't available, the class
     below is never applied and the photo simply stays full colour, as it
     always was — never a gate on seeing the image. */
  if (!REDUCED && 'IntersectionObserver' in window) {
    var toneTargets = document.querySelectorAll('[data-tone-reveal]');
    if (toneTargets.length) {
      var toneIO = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.remove('is-toned');
            toneIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });
      toneTargets.forEach(function(el){
        el.classList.add('is-toned');
        toneIO.observe(el);
      });
    }
  }

  /* ---------- PC-only: magnetic primary buttons ----------
     A mousemove listener per button, only ever live while the pointer is
     actually over that one element — not a scroll or global-frame cost,
     the opposite of what made scroll feel heavy before this pass. Gated
     to a real mouse and no-preference motion; a touchscreen (even a wide
     one) never attaches this. Primary CTAs only — restrained on purpose,
     not every button on the page. */
  var wantsMagnetic = !REDUCED
    && window.matchMedia('(hover:hover)').matches
    && window.matchMedia('(pointer:fine)').matches;
  if (wantsMagnetic) {
    document.querySelectorAll('.btn-primary-navy, .btn-primary-ivory').forEach(function(btn){
      function reset(){ btn.style.transform = ''; }
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        /* -2px baked into the y offset so this composes with, rather than
           overrides (inline style beats stylesheet), the existing
           hover:translateY(-2px) lift defined in style.css. */
        btn.style.transform = 'translate(' + (x * 0.18).toFixed(1) + 'px,' + (y * 0.28 - 2).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', reset);
      btn.addEventListener('blur', reset);
    });
  }
})();
