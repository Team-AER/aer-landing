// Accio landing — page behaviours (shell.js handles the nav toggle and the copy button).
// 1. The docked relay in the nav lights the agents that own the section you are reading.
// 2. On phones the screenshots sit in sideways scrollers that open on the useful part of the screen.
// 3. The report screenshots switch between terminal and magazine views, like the app's own toggle.
(function () {
  'use strict';

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

})();
