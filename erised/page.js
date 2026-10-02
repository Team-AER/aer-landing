// Erised landing — the mirror reflects.
// 1. Hovering or focusing one of the three opening choices swaps the scene inside the arch, the way the
//    play screen previews a possible path. Leaving restores the base scene.
// 2. The scene drifts a little with the pointer and with scroll (fine pointers only for the pointer part).
//    Scrolling down lets the scene lag behind its frame (it drifts down, as a deeper layer would). The CSS pan
//    overhang (7.1% above, 1.82% below, 9% at the sides) is sized for exactly this range. Positions snap to device
//    pixels so the pixel art stays sharp.
// 3. Once, after arrival, the mirror previews the other two openings and settles (cancelled by any interaction).
// All honour prefers-reduced-motion: the swap becomes instant (base.css kills the transition), drift and preview are off.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mirror = document.querySelector('.hero [data-mirror]');
  if (!mirror) return;

  var pan = mirror.querySelector('.mirror__pan');
  var scenes = Array.prototype.slice.call(mirror.querySelectorAll('.mirror__scene'));
  var base = mirror.getAttribute('data-base') || (scenes[0] && scenes[0].getAttribute('data-scene'));
  var current = base;

  function has(name) {
    return scenes.some(function (img) { return img.getAttribute('data-scene') === name; });
  }
  function show(name) {
    if (!name || name === current || !has(name)) return;
    current = name;
    scenes.forEach(function (img) {
      var on = img.getAttribute('data-scene') === name;
      img.classList.toggle('is-current', on);
      if (on) img.removeAttribute('aria-hidden'); else img.setAttribute('aria-hidden', 'true');
    });
  }

  document.querySelectorAll('.choice[data-scene]').forEach(function (el) {
    var name = el.getAttribute('data-scene');
    el.addEventListener('mouseenter', function () { show(name); });
    el.addEventListener('focus', function () { show(name); });
    el.addEventListener('mouseleave', function () { show(base); });
    el.addEventListener('blur', function () { show(base); });
  });

  // One-shot path preview: once the hero has arrived, the mirror shows where the other two openings lead,
  // lighting each choice row in turn, then settles on the shore. Any interaction cancels it.
  if (!reduce && 'IntersectionObserver' in window) {
    var choiceRows = Array.prototype.slice.call(document.querySelectorAll('.choice[data-scene]'));
    var cancelled = false, timers = [];
    var mark = function (name) { choiceRows.forEach(function (c) { c.classList.toggle('is-preview', !!name && c.getAttribute('data-scene') === name); }); };
    // restore: go back to the base scene (not when the visitor is pointing at or focusing a choice).
    var cancel = function (restore) {
      if (cancelled) return;
      cancelled = true;
      timers.forEach(clearTimeout);
      mark(null);
      if (restore === true) show(base);
    };
    var stop = function () { cancel(true); };
    choiceRows.forEach(function (c) { c.addEventListener('pointerenter', cancel); c.addEventListener('focus', cancel); });
    window.addEventListener('pointerdown', stop, { once: true });
    window.addEventListener('keydown', stop, { once: true });
    var y0 = window.scrollY;
    window.addEventListener('scroll', function () { if (Math.abs(window.scrollY - y0) > 120) stop(); }, { passive: true });
    var pio = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) { cancel(); return; }
      pio.disconnect();
      y0 = window.scrollY;
      var plan = [['frost', 1700], ['ember', 3900], [base, 6100]];
      plan.forEach(function (stepPair) {
        timers.push(setTimeout(function () {
          if (cancelled) return;
          show(stepPair[0]);
          mark(stepPair[0] === base ? null : stepPair[0]);
        }, stepPair[1]));
      });
    }, { threshold: 0.6 });
    pio.observe(mirror);
  }

  if (reduce || !pan) return;

  // Parallax: a target the pointer and scroll set, eased toward with requestAnimationFrame.
  var hero = mirror.closest('.hero') || mirror;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var dpr = window.devicePixelRatio || 1;
  var px = 0, py = 0, tx = 0, ty = 0, raf = 0;
  function snap(v) { return (Math.round(v * dpr) / dpr).toFixed(2); }
  var pointerX = 0, pointerY = 0, scrollShift = 0;

  function frame() {
    raf = 0;
    px += (tx - px) * 0.08;
    py += (ty - py) * 0.08;
    pan.style.transform = 'translate3d(' + snap(px) + 'px,' + snap(py) + 'px,0)';
    if (Math.abs(tx - px) > 0.05 || Math.abs(ty - py) > 0.05) raf = requestAnimationFrame(frame);
  }
  function retarget() {
    tx = pointerX * 16;              // +-16px across
    ty = pointerY * 5 + scrollShift; // -5px up to +17px down
    if (!raf) raf = requestAnimationFrame(frame);
  }

  if (fine) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      pointerX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointerY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      retarget();
    });
    hero.addEventListener('pointerleave', function () { pointerX = 0; pointerY = 0; retarget(); });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      scrollShift = Math.max(0, Math.min(12, window.scrollY * 0.03));
      retarget();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Pass 2 motion: staggered entrances as content arrives, the setup question typing its answer, and the dice
// rolling once. Skipped entirely under reduced motion or without IntersectionObserver (final states stay).
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('ex');

  function each(sel, root, fn) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }
  // Row order inside sheets and lists.
  each('.party, .journal, .carry ul, .stats, .moods, .track', null, function (list) {
    Array.prototype.forEach.call(list.children, function (el, i) { el.style.setProperty('--n', String(i)); });
  });

  // Typing demo for the setup question.
  function typeDesire(fig) {
    var field = fig.querySelector('.desire-replica__input');
    var typed = fig.querySelector('.desire-replica__typed');
    if (!field || !typed) return;
    var text = typed.textContent;
    typed.textContent = '';
    field.classList.add('is-empty');
    fig.classList.add('is-locked', 'is-typing');
    var i = 0;
    var tick = function () {
      i++;
      typed.textContent = text.slice(0, i);
      if (i === 1) field.classList.remove('is-empty');
      if (i < text.length) setTimeout(tick, text.charAt(i - 1) === '.' ? 260 : 58);
      else setTimeout(function () {
        fig.classList.remove('is-locked');
        fig.classList.add('is-ready');
        setTimeout(function () { fig.classList.remove('is-typing'); }, 1600);
      }, 380);
    };
    setTimeout(tick, 1100);
  }

  // The die face tumbles through random values, then lands on the roll the note reports.
  function roll(row, delay) {
    var face = row.querySelector('.dice__die b');
    if (!face) return;
    var final = face.textContent, n = 0;
    setTimeout(function () {
      row.classList.add('is-rolling');
      var t = setInterval(function () {
        face.textContent = String(1 + Math.floor(Math.random() * 20));
        if (++n >= 11) {
          clearInterval(t);
          face.textContent = final;
          row.classList.remove('is-rolling');
          row.classList.add('is-landed');
        }
      }, 65);
    }, delay);
  }

  var sel = [
    '.section__head > *', '.steps > li', '.features > li', '.section .sheet', '.modes .mode', '.dice',
    '.dice-replica .replica__caption', '.replica.mirror', '.moods', '.arcade__frame', '.access__inner > *'
  ].join(',');
  var items = Array.prototype.slice.call(document.querySelectorAll(sel));
  items.forEach(function (el) { el.classList.add('rv'); });
  var io = new IntersectionObserver(function (entries) {
    var d = 0;
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var k = Math.min(d++, 8);
      el.style.setProperty('--d', String(k));
      el.classList.add('is-in');
      io.unobserve(el);
      if (el.classList.contains('desire-replica')) typeDesire(el);
      if (el.classList.contains('dice')) roll(el, 250 + k * 70);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

