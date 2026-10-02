// Athena Sandbox landing — page behaviour. No framework, no build, no inline handlers.
// 1. The hero's one orchestrated moment: the workspace fills in static -> dynamic -> report.
//    Default CSS is the finished state; this script adds .ws--play to hide the [data-t] parts,
//    then .is-in on each part's schedule. Reduced motion never enters play.
// 2. Citations: hovering or focusing a `ev NNNN` chip lights the evidence row it names; clicking
//    one elsewhere on the page jumps to the row and lights it for two seconds.
// 3. Defang: swaps every indicator between its exact and defanged form.
// 4. Wide tables: when a table scrolls sideways, its head shows a cue and the clipped edge fades;
//    the fade follows the scroll position so it never hides the last column once you get there.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ws = document.getElementById('ws');
  var timers = [];

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function play() {
    if (!ws || reduce) return;
    clearTimers();
    var parts = Array.prototype.slice.call(ws.querySelectorAll('[data-t]'));
    var stages = parts.filter(function (el) { return el.classList.contains('stage'); });
    var replay = ws.querySelector('[data-replay]');
    if (replay) replay.hidden = true;
    ws.classList.remove('ws--done');
    parts.forEach(function (el) { el.classList.remove('is-in', 'is-run'); });
    ws.querySelectorAll('.is-cited').forEach(function (el) { el.classList.remove('is-cited'); });
    ws.classList.add('ws--play');
    void ws.offsetWidth; // commit the hidden state before the first transition

    var end = 0;
    parts.forEach(function (el) {
      var at = parseInt(el.getAttribute('data-t'), 10) || 0;
      if (at > end) end = at;
      timers.push(setTimeout(function () {
        el.classList.add('is-in');
        el.classList.remove('is-run');
        if (el.classList.contains('stage')) {
          var next = stages[stages.indexOf(el) + 1];
          if (next) next.classList.add('is-run');
        }
        var cites = el.getAttribute('data-cites');
        if (cites) cites.split(/\s+/).forEach(function (id) {
          var row = document.getElementById(id);
          if (row) row.classList.add('is-cited');
        });
      }, at));
    });
    if (stages[0]) stages[0].classList.add('is-run');
    timers.push(setTimeout(function () {
      ws.classList.add('ws--done');
      if (replay) replay.hidden = false;
    }, end + 420));
  }

  if (ws) {
    var replayBtn = ws.querySelector('[data-replay]');
    if (replayBtn) replayBtn.addEventListener('click', play);
    // Desktop: start now (deferred script, so before first paint). Phones: the workspace sits
    // below the fold, so hide it now and play once it is actually on screen.
    var box = ws.getBoundingClientRect();
    if (reduce || box.top < window.innerHeight * 0.85 || !('IntersectionObserver' in window)) {
      play();
    } else {
      ws.classList.add('ws--play');
      var wio = new IntersectionObserver(function (en) {
        if (en.some(function (e) { return e.isIntersecting; })) { wio.disconnect(); play(); }
      }, { threshold: 0.2 });
      wio.observe(ws);
    }
  }

  // Staggered section entrances: children rise in sequence once their group scrolls in.
  // CSS hides them only under html.js + no-preference, so no JS (or reduced motion) = final state.
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    var groups = document.querySelectorAll('.sec__grid, .stages, .stat-grid, .toc');
    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in'); gio.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    groups.forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', Math.min(i, 9)); });
      g.setAttribute('data-stagger', '');
      gio.observe(g);
    });
  }

  // Citations light the row they name.
  function rowFor(el) { return document.getElementById(el.getAttribute('data-cite') || ''); }
  document.querySelectorAll('[data-cite]').forEach(function (chip) {
    function on() { var row = rowFor(chip); if (row) row.classList.add('is-hl'); }
    function off() { var row = rowFor(chip); if (row) row.classList.remove('is-hl'); }
    chip.addEventListener('mouseenter', on);
    chip.addEventListener('mouseleave', off);
    chip.addEventListener('focus', on);
    chip.addEventListener('blur', off);
    chip.addEventListener('click', function () {
      var row = rowFor(chip);
      if (!row) return;
      row.classList.add('is-flash');
      setTimeout(function () { row.classList.remove('is-flash'); }, 2000);
    });
  });

  // Wide tables: cue and edge fades follow the real overflow, not a breakpoint guess.
  document.querySelectorAll('.table-wrap').forEach(function (wrap) {
    var head = wrap.previousElementSibling;
    var cue = head && head.querySelector('.scroll-cue');
    function sync() {
      var over = wrap.scrollWidth - wrap.clientWidth > 2;
      wrap.classList.toggle('is-over', over);
      wrap.classList.toggle('is-moved', over && wrap.scrollLeft > 2);
      wrap.classList.toggle('is-end', over && wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2);
      if (cue) cue.hidden = !over;
    }
    wrap.addEventListener('scroll', sync, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(sync).observe(wrap);
    else window.addEventListener('resize', sync);
    sync();
    // The mono web font lands after first layout and widens the tables.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
  });

  // Defang toggle: exact values by default, bracketed forms on request.
  var defang = document.querySelector('[data-defang]');
  if (defang) {
    defang.addEventListener('click', function () {
      var on = defang.getAttribute('aria-pressed') === 'true';
      defang.setAttribute('aria-pressed', String(!on));
      document.querySelectorAll('[data-exact]').forEach(function (cell) {
        cell.textContent = cell.getAttribute(on ? 'data-exact' : 'data-defanged');
      });
    });
  }
})();
