// Omniocular landing — page behaviour. No framework. CSP: script-src 'self'.
// 1. The authorized-use gate: a real role="switch" that arms the phone replica's transmit panel.
// 2. A cosmetic long-press demo on the replica's "Hold to start authorized transmit" button,
//    mirroring the app's onLongPress confirmation. Purely illustrative; it transmits nothing.
(function () {
  'use strict';

  var sw = document.querySelector('[data-gate-switch]');
  var phone = document.querySelector('[data-phone]');
  var state = document.querySelector('[data-gate-state]');
  var lockpill = document.querySelector('[data-lockpill]');

  var LOCKED = 'Transmit is locked. Flip the gate to arm the app, the way the in-app authorized-use acknowledgement does.';
  var ARMED = 'Transmit is <strong>armed</strong>. In the phone, the Expert panel unlocks its 30\u2011second window and long-press confirmation.';

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
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var HOLD_MS = reduce ? 200 : 900;
    var raf = null, start = 0, done = false, resetT = null;
    var LABEL = 'Hold to start authorized transmit';

    function armedNow() { return phone && phone.classList.contains('is-armed'); }

    function reset() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      done = false;
      fill.style.width = '0';
      holdText.textContent = LABEL;
    }

    function tick(now) {
      if (!start) start = now;
      var p = Math.min(1, (now - start) / HOLD_MS);
      fill.style.width = (p * 100) + '%';
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
})();
