/* ============================================================
   Achai Wiir — preloader.js
   Draws the engraved line-portrait in, then resolves it into the real
   (background-removed) photograph. Shows once per browser session;
   skipped outright under reduced motion or a metered connection.
   Fires a 'preloader:done' event on window that motion.js listens for
   to time the hero entrance — see that file.
   ============================================================ */

/* Preloader — draws the engraved portrait in, then resolves it into the
   real (background-removed) photograph. Once per browser session; never
   shown under reduced motion or a metered connection; never blocks a
   no-JS visit since the underlying page is already complete without it. */
(function(){
  var SEEN_KEY = 'aw-intro-seen';
  /* Timings below must stay in sync with the matching CSS transition
     durations in style.css (search "preloader") — this file only
     computes when to swap classes; the CSS is what actually animates.
     Scaled ~0.45x from the original pass: the same draw → resolve →
     fade sequence, same relative rhythm between stages, just no longer
     a ~2.4s forced-minimum wait (with scroll locked via body.is-locked)
     before a first-time visitor could do anything at all — see
     V3_QA_REPORT.md. */
  var ROWS = 149, ROW_DELAY_MS = 2.5, ROW_TRANSITION_MS = 190;
  var DRAW_MS = ROWS * ROW_DELAY_MS + ROW_TRANSITION_MS; // last row's delay + its own transition
  var PHOTO_TIMEOUT_MS = 800;    // generous even though the photo is inlined, not fetched
  var MAX_CAP_MS = 1450;         // hard ceiling from show to resolve, whatever the device is doing
  var RESOLVE_MS = 370;          // matches .preloader__portrait transition
  var FADE_MS = 170;             // matches .preloader opacity transition
  var PHOTO_SRC = 'assets/img/preloader-portrait.webp';

  function reducedMotion(){
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; }
  }
  function saveData(){
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return Boolean(c && c.saveData);
  }
  function alreadySeen(){
    try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch(e){ return false; }
  }
  function markSeen(){
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch(e){ /* private mode — runs once more, harmless */ }
  }
  function timeout(ms, value){
    return new Promise(function(resolve){ window.setTimeout(function(){ resolve(value); }, ms); });
  }
  function loadPhoto(stage){
    var img = new Image();
    img.className = 'preloader__portrait';
    img.alt = '';
    img.decoding = 'async';
    img.src = PHOTO_SRC;
    stage.appendChild(img);
    if (img.decode) {
      return img.decode().then(function(){ return img; }, function(){ img.remove(); return null; });
    }
    return new Promise(function(resolve){
      img.onload = function(){ resolve(img); };
      img.onerror = function(){ img.remove(); resolve(null); };
    });
  }

  function initPreloader(){
    var root = document.querySelector('[data-preloader]');
    var stage = root && root.querySelector('[data-preloader-stage]');
    if (!root || !stage) return;

    if (reducedMotion() || saveData() || alreadySeen()) {
      markSeen();
      window.dispatchEvent(new CustomEvent('preloader:done'));
      return;
    }
    markSeen();

    root.hidden = false;
    document.body.classList.add('is-locked');

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ root.classList.add('is-drawing'); });
    });

    var photo = Promise.race([loadPhoto(stage), timeout(PHOTO_TIMEOUT_MS, null)]);
    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var drawn = timeout(DRAW_MS, null);

    Promise.race([
      Promise.all([fontsReady, drawn, photo]).then(function(vals){ return vals[2]; }),
      timeout(MAX_CAP_MS, null),
    ]).then(function(img){
      if (img) root.classList.add('is-resolving');
      window.setTimeout(function(){
        root.classList.add('is-done');
        window.dispatchEvent(new CustomEvent('preloader:done'));
        window.setTimeout(function(){
          document.body.classList.remove('is-locked');
          root.remove();
        }, FADE_MS);
      }, img ? RESOLVE_MS : 0);
    });
  }

  initPreloader();
})();
