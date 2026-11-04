// Muffliato landing — page behaviour. No framework, no build, no inline handlers (CSP: script-src 'self').
// The hero's two-listener console:
// 1. Draws the clip's waveform and the added perturbation once, from a seeded pseudo-random sequence,
//    so the picture is identical on every load. The ±tau band is a static rect in the markup.
// 2. A real <button role="switch"> flips Original / Protected. Protected erases the machine column
//    word by word (actual DOM removal, so a screen reader reading the column gets the true state);
//    the human column never changes. A polite live region announces each user-triggered flip.
// 3. The one orchestrated moment: on load the console shows Original, then flips to Protected once
//    when it is in view. Under prefers-reduced-motion it stays on the Protected end state, which is
//    also what the static HTML shows without JavaScript.
(function () {
  'use strict';
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = !!(motionQuery && motionQuery.matches);

  var consoleEl = document.querySelector('[data-console]');
  if (!consoleEl) return;

  /* ---------------- waveform, drawn once ---------------- */
  // mulberry32: small, fast, deterministic.
  function seeded(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var humanEl = consoleEl.querySelector('[data-human]');
  var sentence = humanEl ? humanEl.textContent.trim().replace(/\s+/g, ' ') : '';
  var words = sentence ? sentence.split(' ') : [];

  (function drawWave() {
    var speech = consoleEl.querySelector('[data-speech]');
    var delta = consoleEl.querySelector('[data-delta]');
    if (!speech || !delta || !words.length) return;
    var rnd = seeded(20261105);
    var W = 960, MID = 70, AMP = 62, STEP = 3;
    var lead = 34, trail = 30;
    // Lay words out along the clip, sized by their length, with short gaps and a longer pause at commas.
    var chars = words.reduce(function (n, w) { return n + w.length + 2; }, 0);
    var span = W - lead - trail;
    var gapTotal = 0;
    var gaps = words.map(function (w) { var g = /[,;]$/.test(w) ? 26 : 6 + rnd() * 9; gapTotal += g; return g; });
    var unit = (span - gapTotal) / chars;
    var x = lead, segs = [];
    words.forEach(function (w, i) {
      var len = (w.length + 2) * unit;
      var syl = Math.max(1, (w.toLowerCase().match(/[aeiouy]+/g) || []).length);
      segs.push({ a: x, b: x + len, amp: 0.5 + rnd() * 0.45, syl: syl });
      x += len + gaps[i];
    });
    var d = '', k = 0;
    for (var px = STEP / 2; px < W; px += STEP) {
      while (k < segs.length - 1 && px > segs[k].b) k++;
      var s = segs[k], a;
      if (px >= s.a && px <= s.b) {
        var t = (px - s.a) / (s.b - s.a);
        var env = Math.pow(Math.sin(Math.PI * t), 0.7) * (0.55 + 0.45 * Math.abs(Math.sin(Math.PI * t * s.syl)));
        a = s.amp * env * (0.35 + 0.65 * rnd());
      } else {
        a = 0.012 + 0.02 * rnd();
      }
      d += 'M' + px.toFixed(1) + ' ' + (MID - a * AMP).toFixed(1) + 'V' + (MID + a * AMP).toFixed(1);
    }
    speech.setAttribute('d', d);
    // The perturbation: a small, zero-centred jitter that never leaves the band (band half-height 3).
    var dd = 'M0 ' + MID, sum = 0, ys = [];
    for (var qx = 4; qx <= W; qx += 4) { var y = (rnd() * 2 - 1) * 2.4; ys.push(y); sum += y; }
    var mean = sum / ys.length;
    ys.forEach(function (y, i) {
      var v = Math.max(-2.6, Math.min(2.6, y - mean));
      dd += 'L' + (4 * (i + 1)) + ' ' + (MID + v).toFixed(2);
    });
    delta.setAttribute('d', dd);
  })();

  /* ---------------- the switch ---------------- */
  var sw = consoleEl.querySelector('[data-switch]');
  var machine = consoleEl.querySelector('[data-machine]');
  var badge = consoleEl.querySelector('[data-badge]');
  var live = consoleEl.querySelector('[data-live]');
  if (!sw || !machine || !badge) return;

  var timers = [];
  var later = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
  var stop = function () { timers.forEach(clearTimeout); timers = []; };

  var MSG = {
    protected: 'Protected audio. The human listener still hears every word. The Parakeet TDT 0.6B transcript is empty.',
    original: 'Original audio. Parakeet TDT 0.6B transcribes: ' + sentence
  };

  function wordSpan(w, i) {
    var el = document.createElement('span');
    el.className = 'w';
    el.textContent = i < words.length - 1 ? w + ' ' : w;
    return el;
  }
  function emptyMark(pop) {
    var el = document.createElement('span');
    el.className = 'transcript__empty' + (pop ? ' is-pop' : '');
    el.textContent = '""';
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = ' (empty transcript)';
    el.appendChild(sr);
    return el;
  }
  function setBadge(empty, pop) {
    badge.textContent = empty ? 'raw-empty' : 'transcribed';
    badge.classList.toggle('is-empty', empty);
    badge.classList.remove('is-pop');
    if (pop) { void badge.offsetWidth; badge.classList.add('is-pop'); }
  }
  function setSwitch(state) {
    sw.setAttribute('aria-checked', state === 'protected' ? 'true' : 'false');
    consoleEl.setAttribute('data-state', state);
  }
  function announce(state) { if (live) live.textContent = MSG[state]; }

  // Instant render of a state: reduced motion, and the starting frame of the autoplay.
  function settle(state) {
    stop();
    setSwitch(state);
    machine.textContent = '';
    if (state === 'protected') {
      machine.appendChild(emptyMark(false));
      setBadge(true, false);
    } else {
      words.forEach(function (w, i) { machine.appendChild(wordSpan(w, i)); });
      setBadge(false, false);
    }
  }

  function protect(speak) {
    stop();
    setSwitch('protected');
    // Words still on screen leave one at a time, first to last.
    var left = Array.prototype.filter.call(machine.querySelectorAll('.w'), function (el) { return !el.classList.contains('is-out'); });
    if (!left.length) machine.textContent = '';
    var start = 380, gap = 105, fade = 170;
    left.forEach(function (el, i) {
      later(start + i * gap, function () { el.classList.add('is-out'); });
      later(start + i * gap + fade, function () { if (el.parentNode) el.parentNode.removeChild(el); });
    });
    later(start + left.length * gap + fade + 80, function () {
      machine.textContent = '';
      machine.appendChild(emptyMark(true));
      setBadge(true, true);
      if (speak) announce('protected');
    });
  }

  function restore(speak) {
    stop();
    setSwitch('original');
    setBadge(false, false);
    machine.textContent = '';
    var gap = 45;
    words.forEach(function (w, i) {
      later(120 + i * gap, function () {
        var el = wordSpan(w, i);
        el.classList.add('is-in');
        machine.appendChild(el);
      });
    });
    later(120 + words.length * gap + 60, function () { if (speak) announce('original'); });
  }

  function go(state, speak) {
    if (reduce) { settle(state); if (speak) announce(state); return; }
    if (state === 'protected') protect(speak); else restore(speak);
  }

  sw.addEventListener('click', function () {
    var next = sw.getAttribute('aria-checked') === 'true' ? 'original' : 'protected';
    autoplayDone = true;
    userActed = true;
    if (io) io.disconnect();
    go(next, true);
  });

  /* ---------------- the one orchestrated moment ---------------- */
  var autoplayDone = false;
  var userActed = false;
  var io = null;
  function autoplay() {
    if (autoplayDone) return;
    autoplayDone = true;
    later(900, function () { protect(false); });
  }

  if (reduce || !words.length) {
    settle('protected');
  } else {
    settle('original');
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { io.disconnect(); autoplay(); }
        });
      }, { threshold: 0.35 });
      io.observe(consoleEl);
    } else {
      autoplay();
    }
  }

  if (motionQuery && motionQuery.addEventListener) {
    motionQuery.addEventListener('change', function () {
      reduce = motionQuery.matches;
      if (reduce) {
        autoplayDone = true;
        if (io) io.disconnect();
        // Before the visitor has touched the switch, the settled state is the Protected end state.
        settle(!userActed || sw.getAttribute('aria-checked') === 'true' ? 'protected' : 'original');
      }
    });
  }
})();
