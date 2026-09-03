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
  }
  function openMenu(){
    menu.classList.add('open');
    menuBtn.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
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
