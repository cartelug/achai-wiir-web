/* ============================================================
   Achai Wiir — motion.js
   Lenis smooth scroll + GSAP/ScrollTrigger reveals. Loaded after the
   gsap / ScrollTrigger / lenis CDN <script> tags in index.html, and
   before preloader.js (which dispatches the 'preloader:done' event this
   file listens for to time the hero entrance).

   Everything here is a progressive enhancement over a page that already
   works and reads correctly without it: reduced motion skips it
   outright, and a blocked CDN (window.gsap / window.Lenis undefined)
   makes every function below a silent no-op, leaving plain CSS in
   charge — see README.md for the fallback behaviour this guarantees.
   ============================================================ */

/* Motion layer — Lenis smooth scroll + GSAP/ScrollTrigger reveals.
   Everything here is a progressive enhancement over a page that already
   works and reads correctly without it: reduced motion skips it outright,
   and a blocked CDN (window.gsap/window.Lenis undefined) makes every
   function below a silent no-op, leaving plain CSS in charge. */
(function(){
  function reducedMotion(){
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; }
  }
  var REDUCED = reducedMotion();
  var hasGSAP = Boolean(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (!REDUCED && window.Lenis) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', function(){
      if (window.ScrollTrigger) ScrollTrigger.update();
      onScroll();
    });
    (function raf(time){ lenis.raf(time); requestAnimationFrame(raf); })();
  }

  /* Anchor links scroll through Lenis (when present) so in-page navigation
     matches the rest of the page's feel; falls back to native smooth
     scrolling untouched when Lenis didn't load. */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    a.addEventListener('click', function(e){
      var target = document.querySelector(id);
      if (!target) return;
      if (lenis) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -64, duration: REDUCED ? 0 : 1.0 });
      }
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
  if (!lenis) window.addEventListener('scroll', onScroll, { passive: true });
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
      .to(lines, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.09, clearProps: 'transform' }, 0.05)
      .to(items, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08, clearProps: 'transform' }, 0.25);
    if (cover) {
      tl.set(cover, { scaleX: 1, transformOrigin: 'left center' }, 0)
        .to(cover, { scaleX: 0, transformOrigin: 'right center', duration: 0.85, ease: 'power3.inOut' }, 0.3);
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
        toVars   = { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.out' };
      } else if (style === 'scale') {
        fromVars = { opacity: 0, scale: 0.96 };
        toVars   = { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' };
      } else {
        fromVars = { opacity: 0, y: 24 };
        toVars   = { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' };
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
             :hover lift after its one-time reveal finishes. */
          var tw = Object.assign({}, toVars, { stagger: 0.09, clearProps: 'transform' });
          gsap.to(kids, tw);
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
          gsap.to(cover, { scaleX: 0, transformOrigin: 'right center', duration: 0.9, ease: 'power3.inOut' });
        },
      });
    });
  }

  /* ---------- Portrait tone-reveal ----------
     Independent of GSAP/Lenis on purpose. Every [data-tone-reveal] photo
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
})();
