/* ============================================================
   Achai Wiir — main.js
   Baseline interactive behaviour that does not depend on any external
   library: mobile menu, impact-archive year filter, and the contact
   form's preview confirmation. Works with GSAP/Lenis absent.
   ============================================================ */

(function(){
  var menuBtn = document.getElementById('menuBtn');
  var menu = document.getElementById('mobileMenu');
  function closeMenu(){
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
  }
  function openMenu(){
    menu.classList.add('open');
    menuBtn.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
    /* header.site is normally position:sticky, so at scroll 0 it sits
       below the concept-strip banner rather than at the viewport top —
       the full-screen menu's own top padding assumes a fixed, known
       header height, so pin the header to the very top for as long as
       the menu is open (regardless of where the page had scrolled to)
       instead of trying to predict/match its sticky position. */
    document.body.classList.add('menu-open');
  }
  menuBtn.addEventListener('click', function(){
    var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && menu.classList.contains('open')){ closeMenu(); menuBtn.focus(); }
  });

  /* Swipe-down-to-close: a second, thumb-natural way to dismiss the
     full-screen menu alongside the header's hamburger-to-× toggle and
     Escape. A plain vertical-distance threshold, not a velocity/fling
     detector — simple enough to not need a gesture library, generous
     enough (80px) not to fire on an ordinary scroll-within-the-list tap. */
  var touchStartY = null;
  menu.addEventListener('touchstart', function(e){
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  menu.addEventListener('touchend', function(e){
    if (touchStartY === null) return;
    var dy = e.changedTouches[0].clientY - touchStartY;
    touchStartY = null;
    if (dy > 80) closeMenu();
  }, { passive: true });

  /* Chip-driven filtering (the Home impact-by-place teaser, and the full
     Impact Archive) is handled generically by assets/js/archive-filter.js
     via data-fgroup/data-fvalue/data-filter-card, so every filter group on
     a page works independently instead of one shared, ungrouped handler. */

  var form = document.getElementById('contactForm');
  var confirm = document.getElementById('formConfirm');
  if (form && confirm) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var routeField = document.getElementById('cf-route');
      var route = (routeField && routeField.value) || 'relevant';
      confirm.textContent = 'Thank you — in the live site this reaches the ' + route + ' owner, with a copy to your email and a response within 3–5 working days.';
      confirm.classList.add('show');
    });
  }
})();
