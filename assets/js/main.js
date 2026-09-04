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
    /* header.site is normally position:sticky — if the page is already
       scrolled when the menu opens, sticky keeps it pinned at the top
       anyway, but the full-screen menu's own top padding assumes a
       fixed, known header height regardless, so this pins the header to
       the true viewport top for as long as the menu is open rather than
       relying on that. */
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

  /* ---------- Intro disclosure modal ----------
     Shows once per browser (localStorage, not sessionStorage — the ask
     was "always on first open," not "once per tab"), first paint of any
     page on the site, not just Home: it's about the whole site's photos,
     not one page's. A visitor who lands directly on an interior page via
     a shared link still sees it before anything else. */
  var introModal = document.getElementById('introModal');
  if (introModal && typeof introModal.showModal === 'function') {
    var INTRO_KEY = 'awf-intro-seen';
    var introOk = document.getElementById('introModalOk');
    var seen = false;
    try { seen = localStorage.getItem(INTRO_KEY) === '1'; } catch(e){}
    function dismissIntro(){
      introModal.close();
      try { localStorage.setItem(INTRO_KEY, '1'); } catch(e){}
    }
    if (!seen) {
      try { introModal.showModal(); } catch(e){}
    }
    if (introOk) introOk.addEventListener('click', dismissIntro);
    /* Clicking the ::backdrop (outside the card) also dismisses it —
       a click whose target is the <dialog> itself, not a descendant,
       only happens on the backdrop area since the card fills the rest. */
    introModal.addEventListener('click', function(e){
      if (e.target === introModal) dismissIntro();
    });
    /* Native Esc-to-close already fires the dialog's 'cancel'/'close'
       events without any listener needed — just persist the flag too. */
    introModal.addEventListener('close', function(){
      try { localStorage.setItem(INTRO_KEY, '1'); } catch(e){}
    });
  }

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
