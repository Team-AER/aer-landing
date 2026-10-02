// Subtly landing page behaviour. No framework, no build, no inline scripts (CSP: script-src 'self').
// 1. The hero's one orchestrated moment: a playhead crosses the waveform, each speech burst
//    lights up and its cue types into the frame, while the app window's progress card counts up
//    the way Subtly's engine reports it (end of the latest recognised segment / file length).
//    Static HTML is the final state, which is what reduced-motion and no-JS visitors see.
// 2. The GPU frame's platform switch (motion only in answer to a click).
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- hero ---------------- */
  var CUES = [
    { s: 0.8, e: 2.9, t: 'The last ferry leaves at ten.' },
    { s: 3.4, e: 5.3, t: 'Then we still have time.' },
    { s: 6.0, e: 7.4, t: 'Time for what?' },
    { s: 8.1, e: 10.6, t: 'To say it properly, this time.' }
  ];
  var TOTAL = 11.5;          // media seconds
  var PACE = 0.78;           // wall-clock seconds per media second
  var IN_PATH = '/Users/you/Movies/harbour-at-dusk.mkv';
  var OUT_PATH = '/Users/you/Movies/harbour-at-dusk.srt';

  var wave = document.querySelector('[data-wave]');
  if (wave) {
    var svg = wave.querySelector('.wave__svg');
    var bars = svg.querySelectorAll('.b');
    var spans = svg.querySelectorAll('.c');
    var head = svg.querySelector('[data-head]');
    var tcEl = wave.querySelector('[data-tc]');
    var ctl = wave.querySelector('[data-wave-ctl]');
    var cueEl = document.querySelector('[data-cue-text]');
    var pctEl = document.querySelector('[data-pct]');
    var phaseEl = document.querySelector('[data-phase]');
    var barEl = document.querySelector('[data-progress]');
    var logEl = document.querySelector('[data-log]');
    var detEl = document.querySelector('[data-detected]');
    var appEl = document.querySelector('[data-app]');
    var W = 920, barDur = TOTAL / bars.length;
    var state = 'done', media = TOTAL, t0 = 0, raf = 0;
    var lastPlayed = -1, lastText = null, lastPct = -1, lastTc = '';

    var pad = function (n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; };
    var fmt = function (sec) {
      var ms = Math.max(0, Math.round(sec * 1000));
      return '00:' + pad(Math.floor(ms / 60000), 2) + ':' + pad(Math.floor(ms / 1000) % 60, 2) + ',' + pad(ms % 1000, 3);
    };

    var render = function (m) {
      var i, played = Math.min(bars.length, Math.floor(m / barDur));
      if (played !== lastPlayed) {
        for (i = 0; i < bars.length; i++) bars[i].classList.toggle('is-played', i < played);
        lastPlayed = played;
      }
      for (i = 0; i < spans.length; i++) spans[i].classList.toggle('is-played', m >= CUES[i].s);
      var x = (m / TOTAL) * W;
      head.setAttribute('x1', x.toFixed(1));
      head.setAttribute('x2', x.toFixed(1));

      var tc = fmt(Math.min(m, TOTAL));
      if (tc !== lastTc) { tcEl.textContent = tc; lastTc = tc; }

      // Current cue, typed in over the first part of its duration.
      var text = '';
      for (i = 0; i < CUES.length; i++) {
        var c = CUES[i];
        if ((m >= c.s && m < c.e) || (i === CUES.length - 1 && m >= TOTAL)) {
          var typeFor = Math.min((c.e - c.s) * 0.55, c.t.length * 0.05);
          var n = m >= TOTAL ? c.t.length : Math.ceil(Math.min(1, (m - c.s) / typeFor) * c.t.length);
          text = c.t.slice(0, n);
        }
      }
      if (text !== lastText) { cueEl.textContent = text; lastText = text; }

      // Progress the way the engine reports it: end of the newest finished segment / length.
      var pct = 0;
      for (i = 0; i < CUES.length; i++) if (m >= CUES[i].e) pct = Math.round((CUES[i].e * 100) / TOTAL);
      if (m >= TOTAL) pct = 100;
      if (pct !== lastPct) {
        pctEl.textContent = pct + '%';
        barEl.style.width = pct + '%';
        lastPct = pct;
      }
      // The card's status line uses the engine's own phases; the card itself goes away when the
      // job finishes and the Generate button returns, as in the real Workspace.
      phaseEl.textContent = m < CUES[0].s ? 'Initializing…' : 'Transcribing';
      logEl.textContent = m >= TOTAL ? 'Wrote: ' + OUT_PATH : 'Processing ' + IN_PATH;
      detEl.hidden = m < CUES[0].s;
      appEl.classList.toggle('is-done', m >= TOTAL);
    };

    var finish = function () {
      state = 'done';
      media = TOTAL;
      wave.classList.remove('is-playing');
      ctl.textContent = 'Replay';
    };
    var tick = function (now) {
      if (state !== 'play') return;
      var m = Math.max(0, (now - t0) / 1000 / PACE);
      if (m >= TOTAL) { render(TOTAL); finish(); return; }
      media = m;
      render(m);
      raf = requestAnimationFrame(tick);
    };
    var play = function (from) {
      state = 'play';
      wave.classList.add('is-playing');
      ctl.textContent = 'Pause';
      t0 = performance.now() - from * PACE * 1000;
      render(from);
      raf = requestAnimationFrame(tick);
    };
    var pause = function () {
      state = 'paused';
      cancelAnimationFrame(raf);
      ctl.textContent = 'Play';
    };

    ctl.addEventListener('click', function () {
      if (state === 'play') pause();
      else if (state === 'paused') play(media);
      else play(0);
    });

    if (!reduce) {
      wave.classList.add('is-playing');
      render(0);
      ctl.textContent = 'Pause';
      state = 'play';
      // Let the page settle (fonts, layout) before the one moment starts.
      window.setTimeout(function () { if (state === 'play') play(0); }, 600);
    }
  }

  /* ---------------- GPU platform switch ---------------- */
  var PLATFORMS = {
    macos: {
      backend: 'Metal',
      devices: [['Apple M2 Pro', 'Metal', 'IntegratedGpu']],
      flash: 'Flash attention (Metal)', flashOn: true
    },
    windows: {
      backend: 'Vulkan',
      devices: [
        ['NVIDIA GeForce RTX 4070', 'Vulkan', 'DiscreteGpu'],
        ['Intel(R) UHD Graphics 770', 'Vulkan', 'IntegratedGpu'],
        ['NVIDIA GeForce RTX 4070', 'Dx12', 'DiscreteGpu'],
        ['Microsoft Basic Render Driver', 'Dx12', 'Cpu']
      ],
      flash: 'Flash attention (unavailable on this platform)', flashOn: false
    },
    linux: {
      backend: 'Vulkan',
      devices: [
        ['AMD Radeon RX 7800 XT (RADV NAVI32)', 'Vulkan', 'DiscreteGpu'],
        ['llvmpipe (LLVM 17.0.6, 256 bits)', 'Vulkan', 'Cpu']
      ],
      flash: 'Flash attention (unavailable on this platform)', flashOn: false
    }
  };
  var GPU_BACKENDS = ['vulkan', 'metal'];

  var rt = document.querySelector('[data-rt]');
  var segBtns = document.querySelectorAll('[data-platform]');
  if (rt && segBtns.length) {
    var listEl = rt.querySelector('[data-rt-list]');
    var el = function (tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text) n.textContent = text;
      return n;
    };
    // Subtly's own heuristic: discrete GPU on a GPU backend, then integrated, then anything.
    var pickBest = function (devs) {
      var isGpu = function (d) { return GPU_BACKENDS.indexOf(d[1].toLowerCase()) !== -1; };
      var types = ['DiscreteGpu', 'IntegratedGpu'];
      for (var t = 0; t < types.length; t++) {
        for (var i = 0; i < devs.length; i++) if (devs[i][2] === types[t] && isGpu(devs[i])) return devs[i];
      }
      return devs[0];
    };
    var show = function (key) {
      var p = PLATFORMS[key];
      if (!p) return;
      segBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-platform') === key)); });
      var best = pickBest(p.devices);
      rt.querySelector('[data-rt-backend]').textContent = p.backend;
      rt.querySelector('[data-rt-selected]').textContent = best[0];
      listEl.textContent = '';
      p.devices.forEach(function (d) {
        var li = el('li', d === best ? 'is-on' : '');
        li.appendChild(el('span', 'rt__radio'));
        li.appendChild(el('span', 'rt__name', d[0]));
        li.appendChild(el('span', 'rt__tag' + (GPU_BACKENDS.indexOf(d[1].toLowerCase()) !== -1 ? ' rt__tag--gpu' : ''), d[1]));
        li.appendChild(el('span', 'rt__tag', d[2]));
        listEl.appendChild(li);
      });
      rt.querySelector('[data-rt-flash]').textContent = p.flash;
      rt.querySelector('[data-rt-check]').classList.toggle('is-on', p.flashOn);
      rt.querySelector('[data-rt-log]').textContent = 'Smoke test ok on ' + p.devices[0][0] + ' (' + p.devices[0][1] + ')';
    };
    segBtns.forEach(function (b) {
      b.addEventListener('click', function () { show(b.getAttribute('data-platform')); });
    });
  }
})();
