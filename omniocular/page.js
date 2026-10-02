// Omniocular landing — page behaviour. No framework. CSP: script-src 'self'.
// 0. html.js gates every hide-then-reveal state, so the page is complete without this file.
// 1. The survey demo: once the phone replica is on screen it connects, hops channels and
//    fills its access-point list once, then settles. Reduced motion skips straight to the end.
// 2. The authorized-use gate: a real role="switch" that arms the replica's transmit panel.
// 3. A cosmetic long-press on the replica's "Hold to start authorized transmit" button,
//    mirroring the app's onLongPress confirmation. Purely illustrative; it transmits nothing.
// 4. The control-path diagram: a scroll cue and edge fade only when it really overflows.
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- survey demo -----
  var phone = document.querySelector('[data-phone]');
  var stage = phone && phone.closest('.hero__stage');
  (function demo() {
    if (!phone || reduce) { if (stage) stage.classList.add('is-done'); return; }
    var rows = phone.querySelectorAll('.aplist .ap');
    var plab = phone.querySelector('[data-plab]');
    var count = phone.querySelector('[data-ap-count]');
    var link = phone.querySelector('[data-link-text]');
    if (!rows.length || !plab) return;
    var PLAB = plab.textContent;
    var COUNT = count ? count.textContent : '';
    var timers = [];
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function hop(ch) { plab.innerHTML = 'Surveying <span class="plab__ch">ch ' + ch + '</span>'; }

    function play() {
      timers.forEach(clearTimeout); timers = [];
      phone.classList.remove('is-connected', 'is-done');
      if (stage) stage.classList.remove('is-done');
      rows.forEach(function (r) { r.classList.remove('is-in'); });
      phone.classList.add('is-playing', 'is-connecting');
      if (link) link.textContent = 'Connecting';
      if (count) count.textContent = '';
      plab.textContent = 'Waiting for the device';
      void phone.offsetWidth;
      at(700, function () { phone.classList.remove('is-connecting'); phone.classList.add('is-connected'); if (link) link.textContent = 'Connected'; });
      at(1000, function () { hop(1); });
      at(1300, function () { rows[0] && rows[0].classList.add('is-in'); if (count) count.textContent = '1 access point'; });
      at(1700, function () { hop(6); });
      at(2000, function () { rows[1] && rows[1].classList.add('is-in'); if (count) count.textContent = '2 access points'; });
      at(2300, function () { rows[2] && rows[2].classList.add('is-in'); if (count) count.textContent = '3 access points'; });
      at(2600, function () { hop(11); });
      at(2900, function () { rows[3] && rows[3].classList.add('is-in'); if (count) count.textContent = COUNT; });
      at(3500, function () { plab.textContent = PLAB; phone.classList.remove('is-playing'); phone.classList.add('is-done'); if (stage) stage.classList.add('is-done'); });
    }

    // Hide the rows before first paint (this script is deferred, so the DOM is parsed), but
    // only start once the replica is actually in view: on phones it sits below the fold.
    phone.classList.add('is-playing');
    rows.forEach(function (r) { r.classList.remove('is-in'); });
    var box = phone.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.85 && box.bottom > 0) {
      play();
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); play(); }
      }, { threshold: 0.3 });
      io.observe(phone);
    } else {
      play();
    }
  })();

  // ----- the gate -----
  var sw = document.querySelector('[data-gate-switch]');
  var state = document.querySelector('[data-gate-state]');
  var lockpill = document.querySelector('[data-lockpill]');

  var LOCKED = 'Transmit is locked. Flip the gate to arm the app, the way the in-app authorized-use acknowledgement does.';
  var ARMED = 'Transmit is <strong>armed</strong>. In the phone, the Expert panel unlocks its 30‑second window and long-press confirmation.';

  function setGate(on) {
    if (sw) sw.setAttribute('aria-checked', String(on));
    if (phone) phone.classList.toggle('is-armed', on);
    if (lockpill) lockpill.textContent = on ? 'armed' : 'locked';
    if (state) {
      state.innerHTML = on ? ARMED : LOCKED;
      state.setAttribute('data-armed', String(on));
    }
  }

  if (sw) {
    state && state.setAttribute('aria-live', 'polite');
    sw.addEventListener('click', function () {
      setGate(sw.getAttribute('aria-checked') !== 'true');
    });
  }

  // ----- cosmetic long-press on the replica's transmit button -----
  var hold = document.querySelector('[data-hold]');
  var fill = document.querySelector('[data-hold-fill]');
  var holdText = document.querySelector('[data-hold-text]');
  if (hold && fill && holdText) {
    var HOLD_MS = reduce ? 200 : 900;
    var raf = null, start = 0, done = false, resetT = null;
    var LABEL = 'Hold to start authorized transmit';

    function armedNow() { return phone && phone.classList.contains('is-armed'); }

    function reset() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      done = false;
      fill.style.transform = 'scaleX(0)';
      holdText.textContent = LABEL;
    }

    function tick(now) {
      if (!start) start = now;
      var p = Math.min(1, (now - start) / HOLD_MS);
      fill.style.transform = 'scaleX(' + p + ')';
      if (p >= 1) {
        done = true;
        holdText.textContent = 'Authorized window confirmed (demo)';
        resetT = setTimeout(reset, 1400);
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    function begin(e) {
      if (!armedNow() || done) return;
      e.preventDefault();
      if (resetT) { clearTimeout(resetT); resetT = null; }
      start = 0;
      raf = requestAnimationFrame(tick);
    }
    function end() {
      if (done) return;
      reset();
    }

    hold.addEventListener('pointerdown', begin);
    hold.addEventListener('pointerup', end);
    hold.addEventListener('pointerleave', end);
    hold.addEventListener('pointercancel', end);
  }

  // ----- control-path diagram: cue + edge fade follow the real overflow -----
  var arch = document.querySelector('.arch');
  if (arch) {
    function sync() {
      var over = arch.scrollWidth - arch.clientWidth > 2;
      arch.classList.toggle('is-over', over);
      arch.classList.toggle('is-end', over && arch.scrollLeft + arch.clientWidth >= arch.scrollWidth - 2);
    }
    arch.addEventListener('scroll', sync, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(sync).observe(arch); else window.addEventListener('resize', sync);
    sync();
  }
})();
