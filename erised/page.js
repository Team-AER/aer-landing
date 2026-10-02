// Erised landing — the mirror reflects.
// 1. Hovering or focusing one of the three opening choices swaps the scene inside the arch, the way the
//    play screen previews a possible path. Leaving restores the base scene.
// 2. The scene drifts a little with the pointer and with scroll (fine pointers only for the pointer part).
//    Scrolling down lets the scene lag behind its frame (it drifts down, as a deeper layer would). The CSS pan
//    overhang (7.1% above, 1.82% below, 9% at the sides) is sized for exactly this range. Positions snap to device
//    pixels so the pixel art stays sharp.
// Both honour prefers-reduced-motion: the swap becomes instant (base.css kills the transition) and the drift is off.
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
