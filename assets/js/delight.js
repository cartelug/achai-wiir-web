/* ============================================================
   Achai Wiir — delight.js
   Counts a handful of already-sourced figures up into view instead of
   letting them appear static — a small, well-established attention and
   memorability device in impact reporting. Deliberately narrow in scope:
   it only touches elements explicitly opted in with data-count-up, never
   infers a number from arbitrary text, and only fires on figures this
   site already sources elsewhere on the page. Skipped outright under
   reduced motion (the final number just renders immediately), and has no
   dependency on GSAP/Lenis — plain IntersectionObserver, so it works
   identically whether the motion CDN loads or not.
   ============================================================ */
(function(){
  function reducedMotion(){
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; }
  }
  var targets = document.querySelectorAll('[data-count-up]');
  if (!targets.length) return;

  function animate(el){
    var raw = el.textContent.trim();
    var match = raw.match(/^(\d[\d,]*)(.*)$/);
    if (!match) return; // no leading number — leave text exactly as authored
    var end = parseInt(match[1].replace(/,/g, ''), 10);
    var suffix = match[2] || '';
    if (reducedMotion() || !window.requestAnimationFrame || isNaN(end)) return; // static number already in the markup
    el.classList.add('count-up');
    var start = null;
    var duration = Math.min(1400, Math.max(700, end * 12));
    function frame(ts){
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic, matches the site's calm-deceleration feel
      var val = Math.round(end * eased);
      el.textContent = val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = end.toLocaleString() + suffix;
    }
    requestAnimationFrame(frame);
  }

  if (!('IntersectionObserver' in window) || reducedMotion()) return; // numbers already show their final value in the HTML
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  targets.forEach(function(el){ io.observe(el); });
})();
