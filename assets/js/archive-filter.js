/* ============================================================
   Achai Wiir — archive-filter.js
   Generic, vanilla-JS, client-side filtering for chip groups driving
   a card grid — used on the Impact Archive (year / location / status)
   and reusable anywhere the same data-fgroup/data-fvalue/data-filters
   pattern is used. No backend, no build step; works with GSAP/Lenis
   entirely absent since it touches no motion library.
   ============================================================ */
(function(){
  var groups = {};
  document.querySelectorAll('[data-fgroup]').forEach(function(chip){
    var g = chip.getAttribute('data-fgroup');
    groups[g] = groups[g] || [];
    groups[g].push(chip);
  });
  if (!Object.keys(groups).length) return;

  var state = {};
  Object.keys(groups).forEach(function(g){ state[g] = 'all'; });

  var cards = document.querySelectorAll('[data-filter-card]');
  var empty = document.querySelector('.archive-empty');

  function apply(){
    var visibleCount = 0;
    cards.forEach(function(card){
      var visible = true;
      Object.keys(state).forEach(function(g){
        if (state[g] === 'all') return;
        if (card.getAttribute('data-' + g) !== state[g]) visible = false;
      });
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });
    if (empty) empty.classList.toggle('show', visibleCount === 0);
  }

  Object.keys(groups).forEach(function(g){
    groups[g].forEach(function(chip){
      chip.addEventListener('click', function(){
        groups[g].forEach(function(c){ c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        state[g] = chip.getAttribute('data-fvalue');
        apply();
      });
    });
  });

  apply();
})();
