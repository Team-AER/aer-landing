// PromptMask landing — page behaviour. No framework, no build, no inline handlers (CSP: script-src 'self').
// 1. The hero's one orchestrated moment: a prompt is typed into a chat composer, Enter is caught,
//    the extension's own notices appear ("Redacting...", then "Redacted — press Enter to send"),
//    the whole message is swapped for its redacted version, and a second Enter sends it. It plays
//    once when the demo is in view, then settles. The static HTML is the finished state, which is
//    what reduced-motion and no-JS visitors see.
// 2. The rebuilt popup: category switches flip their values in the sample between placeholder and
//    original; site switches drive the Active / Paused pill the way popup.js does.
// 3. Small things: stagger indexes for [data-reveal] children (the shell adds .is-in), a fallback
//    for the scroll-linked rail in "How it works", and key rows that light their placeholders.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('pm-js');

  // Stagger indexes for the shell's reveal contract.
  document.querySelectorAll('[data-reveal]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) { el.style.setProperty('--i', i); });
  });

  /* ---------------- hero demo ---------------- */
  var SEG = [
    ['Draft a reply to '], ['Priya Nair', '[NAME 1]'], [' about case '], ['TCK-556201', '[CASE_ID 1]'],
    [' and copy '], ['Neha Kulkarni', '[NAME 2]'], ['. '], ['Priya Nair', '[NAME 1]'],
    ['’s email is '], ['priya.nair17@example.com', '[EMAIL 1]'], [', phone '],
    ['+91 98765 43210', '[PHONE 1]'], ['.']
  ];
  var ORIGINAL = SEG.map(function (s) { return s[0]; }).join('');

  var demo = document.querySelector('[data-demo]');
  if (demo && !reduce) {
    var textEl = demo.querySelector('[data-text]');
    var composer = demo.querySelector('[data-composer]');
    var send = demo.querySelector('[data-send]');
    var bubble = demo.querySelector('[data-bubble]');
    var sent = demo.querySelector('[data-sent]');
    var spinner = demo.querySelector('[data-spinner]');
    var toast = demo.querySelector('[data-toast]');
    var toastText = demo.querySelector('[data-toast-text]');
    var toastOk = demo.querySelector('[data-toast-ok]');
    var replay = demo.querySelector('[data-replay]');
    var steps = demo.querySelectorAll('[data-step]');
    var timers = [];
    var raf = 0;

    var later = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    var stop = function () { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); };
    var caret = function () { var c = document.createElement('span'); c.className = 'caret'; return c; };
    var placeholder = function () {
      textEl.textContent = '';
      var p = document.createElement('span');
      p.className = 'composer__ph';
      p.textContent = 'Message';
      textEl.appendChild(p);
    };
    var setStep = function (n) {
      steps.forEach(function (s) {
        var k = +s.getAttribute('data-step');
        s.classList.toggle('is-on', k === n);
        s.classList.toggle('is-done', k < n);
      });
    };
    var press = function (n) {
      var kbd = steps[n - 1] && steps[n - 1].querySelector('kbd');
      [kbd, send].forEach(function (el) {
        if (!el) return;
        el.classList.remove('is-press');
        void el.offsetWidth;
        el.classList.add('is-press');
      });
      later(260, function () { send.classList.remove('is-press'); });
    };
    var showToast = function (msg, ok) {
      toastText.textContent = msg;
      if (ok) toastOk.removeAttribute('hidden'); else toastOk.setAttribute('hidden', '');
      toast.classList.add('is-on');
    };

    var arm = function () {
      stop();
      demo.classList.add('is-armed');
      bubble.classList.remove('is-on');
      sent.classList.remove('is-on');
      spinner.classList.remove('is-on');
      toast.classList.remove('is-on');
      composer.classList.remove('is-busy');
      replay.hidden = true;
      setStep(0);
      placeholder();
    };

    var type = function (done) {
      var node = document.createTextNode('');
      textEl.textContent = '';
      textEl.appendChild(node);
      textEl.appendChild(caret());
      var dur = 2300, t0 = performance.now();
      var tick = function (now) {
        var k = Math.min(1, (now - t0) / dur);
        node.data = ORIGINAL.slice(0, Math.round(k * ORIGINAL.length));
        if (k < 1) raf = requestAnimationFrame(tick); else done();
      };
      raf = requestAnimationFrame(tick);
    };

    var writeRedacted = function () {
      textEl.textContent = '';
      var n = 0;
      SEG.forEach(function (s) {
        if (s.length === 1) { textEl.appendChild(document.createTextNode(s[0])); return; }
        var ph = document.createElement('span');
        ph.className = 'ph is-new';
        ph.style.setProperty('--i', n++);
        ph.textContent = s[1];
        textEl.appendChild(ph);
      });
    };

    var play = function () {
      arm();
      later(350, function () {
        setStep(1);
        type(function () {
          later(520, function () {
            // Enter is caught before the site sees it: composer busy, spinner, "Redacting...".
            press(2);
            setStep(2);
            var c = textEl.querySelector('.caret');
            if (c) c.remove();
            composer.classList.add('is-busy');
            spinner.classList.add('is-on');
            showToast('Redacting...', false);
            later(1800, function () {
              // The model's output replaces the whole message; the user reviews it.
              composer.classList.remove('is-busy');
              spinner.classList.remove('is-on');
              writeRedacted();
              showToast('Redacted — press Enter to send', true);
              setStep(3);
              later(2300, function () {
                // Second Enter: the site's own handler sends the redacted text.
                press(3);
                toast.classList.remove('is-on');
                placeholder();
                bubble.classList.add('is-on');
                sent.classList.add('is-on');
                later(700, function () {
                  setStep(4);
                  replay.hidden = false;
                });
              });
            });
          });
        });
      });
    };

    replay.addEventListener('click', play);

    // Arm now (the script is deferred, so this lands before the hero's fade-in finishes) and play
    // the first time the demo is properly in view.
    arm();
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { io.disconnect(); play(); }
        });
      }, { threshold: 0.45 });
      io.observe(demo);
    } else {
      play();
    }
  }

  /* ---------------- the popup's switches ---------------- */
  var sample = document.querySelector('[data-sample]');
  var count = document.querySelector('[data-count]');
  var marks = sample ? Array.prototype.slice.call(sample.querySelectorAll('.m')) : [];
  marks.forEach(function (m) { m.setAttribute('data-p', m.textContent); });

  var recount = function () {
    var n = marks.filter(function (m) { return !m.classList.contains('is-off'); }).length;
    if (count) count.textContent = n === 0 ? 'Nothing masked' : n + (n === 1 ? ' detail masked' : ' details masked');
  };

  document.querySelectorAll('[data-cat]').forEach(function (input) {
    input.addEventListener('change', function () {
      var k = input.getAttribute('data-cat');
      var on = input.checked;
      marks.forEach(function (m) {
        if (m.getAttribute('data-k') !== k) return;
        m.textContent = on ? m.getAttribute('data-p') : m.getAttribute('data-o');
        m.classList.toggle('is-off', !on);
        if (!reduce) { m.classList.remove('is-flip'); void m.offsetWidth; m.classList.add('is-flip'); }
      });
      document.querySelectorAll('.keys__row[data-k="' + k + '"]').forEach(function (row) {
        row.classList.toggle('is-off', !on);
      });
      recount();
    });
  });

  var pill = document.querySelector('[data-pill]');
  var sites = document.querySelectorAll('[data-site]');
  sites.forEach(function (input) {
    input.addEventListener('change', function () {
      var any = Array.prototype.some.call(sites, function (s) { return s.checked; });
      if (!pill) return;
      pill.textContent = any ? 'Active' : 'Paused';
      pill.classList.toggle('is-paused', !any);
    });
  });

  // Pointing at a row of placeholder keys lights its values in the sample.
  document.querySelectorAll('.keys__row').forEach(function (row) {
    var k = row.getAttribute('data-k');
    var set = function (on) {
      marks.forEach(function (m) { if (m.getAttribute('data-k') === k) m.classList.toggle('is-hl', on); });
    };
    row.addEventListener('mouseenter', function () { set(true); });
    row.addEventListener('mouseleave', function () { set(false); });
  });

  /* ---------------- rail fallback ---------------- */
  var path = document.querySelector('[data-path]');
  var scrollTimelines = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (path && !reduce && !scrollTimelines && 'IntersectionObserver' in window) {
    path.style.setProperty('--fill', '0');
    path.classList.add('is-armed');
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { path.style.setProperty('--fill', '1'); pio.disconnect(); }
      });
    }, { threshold: 0.35 });
    pio.observe(path);
  }
})();
