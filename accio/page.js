// Accio landing — page behaviours (shell.js handles the nav toggle and the copy button).
// 1. The docked relay in the nav lights the agents that own the section you are reading.
// 2. On phones the screenshots sit in sideways scrollers that open on the useful part of the screen.
// 3. The report screenshots switch between terminal and magazine views, like the app's own toggle.
// 4. Motion (skipped under reduced motion): staggered entrances, the console's one-shot demo, and
//    the phone nav CTA stepping aside while a page CTA is on screen.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 1. relay scroll-spy ----
  // Section index -> nav stage. -1 is the hero (nothing lit); 5 (access) means the run is complete.
  var SECTIONS = [['hero', -1], ['pipeline', 0], ['sources', 1], ['claims', 2], ['report', 3], ['machine', 4], ['access', 5]];
  // Which nav stage each of the seven progress segments belongs to (PLN | SCH RDR | ANL SYN CRT | WRT).
  var SEG_STAGE = [0, 1, 1, 2, 2, 2, 3];

  var items = Array.prototype.slice.call(document.querySelectorAll('.relay-nav__list > li'));
  var segs = Array.prototype.slice.call(document.querySelectorAll('.nav__progress i'));
  var current = null;

  function setStage(stage) {
    if (stage === current) return;
    current = stage;
    items.forEach(function (li, i) {
      var link = li.querySelector('a');
      li.classList.toggle('is-done', stage >= 0 && i < stage);
      li.classList.toggle('is-current', i === stage);
      if (link) {
        if (i === stage) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    });
    segs.forEach(function (seg, i) {
      var s = SEG_STAGE[i];
      seg.classList.toggle('is-done', stage >= 0 && s < stage);
      seg.classList.toggle('is-current', s === stage);
    });
  }

  var watched = [];
  SECTIONS.forEach(function (pair) {
    var el = pair[0] === 'hero' ? document.querySelector('.hero') : document.getElementById(pair[0]);
    if (el) { el.setAttribute('data-stage', String(pair[1])); watched.push(el); }
  });

  if (items.length && watched.length && 'IntersectionObserver' in window) {
    // A thin band a little above the middle of the viewport decides which section is "being read".
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setStage(parseInt(en.target.getAttribute('data-stage'), 10));
      });
    }, { rootMargin: '-38% 0px -58% 0px', threshold: 0 });
    watched.forEach(function (el) { io.observe(el); });
  }

  // ---- 2. phone screenshot scrollers start on the part of the screen worth reading ----
  // (data-focus is the fraction of the hidden width to skip; it only applies while the image overflows.)
  var scrollers = Array.prototype.slice.call(document.querySelectorAll('.shot__scroll[data-focus]'));
  function focusScrollers() {
    scrollers.forEach(function (el) {
      if (el.getAttribute('data-touched')) return;
      var extra = el.scrollWidth - el.clientWidth;
      if (extra > 0) el.scrollLeft = Math.round(extra * parseFloat(el.getAttribute('data-focus')));
    });
  }
  scrollers.forEach(function (el) {
    el.addEventListener('scroll', function () { if (el.scrollWidth > el.clientWidth) el.setAttribute('data-touched', '1'); }, { passive: true });
  });
  if (scrollers.length) {
    focusScrollers();
    window.addEventListener('resize', focusScrollers);
    window.addEventListener('load', focusScrollers);
  }

  // ---- 3. report view switch ----
  var views = document.querySelector('[data-views]');
  if (views) {
    var sw = views.querySelector('[data-views-switch]');
    var buttons = sw ? Array.prototype.slice.call(sw.querySelectorAll('[data-view]')) : [];
    var panels = Array.prototype.slice.call(views.querySelectorAll('[data-view-panel]'));
    if (sw && buttons.length && panels.length) {
      var show = function (name) {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === name)); });
        panels.forEach(function (p) { p.hidden = p.getAttribute('data-view-panel') !== name; });
        focusScrollers();
      };
      buttons.forEach(function (b) {
        b.addEventListener('click', function () { show(b.getAttribute('data-view')); });
      });
      sw.hidden = false;
      views.classList.add('views--js');
      show('terminal');
    }
  }

  // ---- 4. motion ----
  var root = document.documentElement;

  // 4a. Phone nav CTA tucks away while the hero or closing CTAs are visible (no duplicate buttons).
  var barCta = document.querySelector('.nav__cta--bar');
  var zones = Array.prototype.slice.call(document.querySelectorAll('.hero .hero__ctas, .section--access .hero__ctas'));
  if (barCta && zones.length && 'IntersectionObserver' in window) {
    var seen = new Set();
    var zio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
      barCta.classList.toggle('is-tucked', seen.size > 0);
    }, { rootMargin: '-64px 0px 0px 0px' });
    zones.forEach(function (z) { zio.observe(z); });
  }

  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('ax');

  // 4b. Staggered entrances. Items that arrive in the same frame play in DOM order, 70ms apart.
  var groups = [
    '.section .rail', '.section__title', '.lede', '.step', '.fact', '.shot', '.claim', '.rules li',
    '.sub-title:not(.sub-title--flush)', '.mode', '.views__switch', '.files li', '.run', '.section .note', '.section--access .hero__ctas'
  ];
  var rvs = Array.prototype.slice.call(document.querySelectorAll(groups.join(',')));
  rvs.forEach(function (el) { el.classList.add('rv'); });
  var rio = new IntersectionObserver(function (entries) {
    var d = 0;
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.style.setProperty('--d', String(Math.min(d++, 8)));
      en.target.classList.add('is-in');
      rio.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  rvs.forEach(function (el) { rio.observe(el); });

  // 4c. The console plays one short stretch of a run when it first scrolls into view.
  var con = document.querySelector('.console');
  if (con) {
    var index = function (sel) {
      var n = 0;
      Array.prototype.forEach.call(con.querySelectorAll(sel), function (el) {
        if (el.offsetParent !== null) el.style.setProperty('--n', String(n++));
      });
    };
    var count = function (el, from, to, suffix, ms, delay) {
      if (!el) return;
      var t0 = null;
      var step = function (t) {
        if (t0 === null) t0 = t + delay;
        var k = Math.max(0, Math.min(1, (t - t0) / ms));
        var e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(from + (to - from) * e) + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      el.textContent = from + suffix;
      requestAnimationFrame(step);
    };
    var cio = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      cio.disconnect();
      index('.cx-cell'); index('.cx-plan__list li'); index('.cx-log p'); index('.cx-src');
      var kv = con.querySelectorAll('.cx-kvs .v');
      count(kv[0], 28, 46, '%', 2200, 500);
      count(kv[2], 19, 31, '', 2200, 500);
      con.classList.add('is-live');
    }, { threshold: 0.25 });
    cio.observe(con);
  }
})();
