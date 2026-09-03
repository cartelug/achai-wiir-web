/* ============================================================
   Achai Wiir — impact-map.js
   Syncs the decorative inline-SVG map markers on the Impact Archive
   page with the real, always-visible list of places beside/below it.
   The map is enhancement only: every marker's information already
   exists as plain text in .map-list before this file runs, so a
   blocked script, or JS disabled entirely, leaves the page fully
   informative — this only adds the pointing-and-highlighting layer.
   ============================================================ */
(function(){
  var markers = document.querySelectorAll('.map-marker');
  var items = document.querySelectorAll('.map-list-item');
  if (!markers.length || !items.length) return;

  function clear(){
    markers.forEach(function(m){ m.classList.remove('is-active'); });
    items.forEach(function(i){ i.classList.remove('is-active'); });
  }
  function activate(place){
    clear();
    markers.forEach(function(m){ if (m.getAttribute('data-place') === place) m.classList.add('is-active'); });
    items.forEach(function(i){ if (i.getAttribute('data-place') === place) i.classList.add('is-active'); });
  }

  markers.forEach(function(m){
    m.setAttribute('tabindex', '0');
    m.setAttribute('role', 'button');
    var place = m.getAttribute('data-place');
    if (!m.hasAttribute('aria-label')) m.setAttribute('aria-label', 'Highlight ' + place + ' in the list below');
    m.addEventListener('click', function(){ activate(place); });
    m.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(place); }
    });
    m.addEventListener('mouseenter', function(){ activate(place); });
  });
  items.forEach(function(i){
    var place = i.getAttribute('data-place');
    i.addEventListener('mouseenter', function(){ activate(place); });
    i.addEventListener('focusin', function(){ activate(place); });
  });
})();
