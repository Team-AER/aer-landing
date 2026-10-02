// Avifors page: replays the hero lease trace once, then holds the final state.
// The static SVG in index.html *is* the final state (and the reduced-motion view);
// this script reads each mark's data-t0 / data-t1 / data-at / data-dl and rewinds it.
(function () {
  'use strict';

  var svg = document.getElementById('timeline');
  if (!svg) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var X0 = +svg.getAttribute('data-x0');
  var PPS = +svg.getAttribute('data-pps');
  var TMAX = +svg.getAttribute('data-tmax');
  var NOW = +svg.getAttribute('data-now');
  var VIEW_W = 1200;
  var LABEL_W = +svg.getAttribute('data-label-w') || 176;
  var PARK_T = +svg.getAttribute('data-park') || 444;

  function X(t) { return X0 + Math.min(t, TMAX) * PPS; }
  function num(v) { return v === 'inf' ? Infinity : +v; }
  function each(sel, fn) { return Array.prototype.map.call(svg.querySelectorAll(sel), fn); }

  var grows = each('.tl-grow', function (el) {
    return { el: el, t0: +el.getAttribute('data-t0'), t1: +el.getAttribute('data-t1'), line: el.tagName.toLowerCase() === 'line', shown: true };
  });
  var marks = each('.tl-at', function (el) { return { el: el, at: +el.getAttribute('data-at') }; });
  var leases = each('.tl-lease', function (g) {
    return {
      t0: +g.getAttribute('data-t0'), t1: num(g.getAttribute('data-t1')), dl: +g.getAttribute('data-dl'),
      used: g.querySelector('.tl-lease-used'), left: g.querySelector('.tl-lease-left'), tick: g.querySelector('.tl-deadline')
    };
  });
  var reveal = document.getElementById('tl-vram-reveal');
  var nowG = document.getElementById('tl-now');
  var nowText = document.getElementById('tl-now-text');
  var labels = document.getElementById('tl-labels');
  var statusEls = each('[data-status-row]', function (el) { return el; });
  var out = {};
  Array.prototype.forEach.call(document.querySelectorAll('[data-readout]'), function (el) { out[el.getAttribute('data-readout')] = el; });
  var replayBtn = document.querySelector('[data-replay]');
  var scroller = svg.parentElement;

  // What GET /admin/state would report along this illustrative trace: [from, state, resident row, queued].
  var STATES = [
    [0, 'loading', 0, 1], [24, 'ready', 0, 0], [84, 'draining', 0, 1], [100, 'releasing', 0, 1],
    [106, 'loading', 1, 1], [112, 'ready', 1, 0], [150, 'releasing', 1, 1],
    [154, 'loading', 0, 1], [158, 'ready', 0, 0], [290, 'draining', 0, 1], [454, 'releasing', 0, 1],
    [463, 'loading', 2, 1], [468, 'ready', 2, 0], [478, 'draining', 2, 1], [493, 'releasing', 2, 1],
    [497, 'loading', 3, 1], [515, 'ready', 3, 0]
  ];
  var NAMES = ['text-chat', 'embed', 'flux2-klein', 'aer-stt-v1'];
  // Ownership periods: [row, start, deadline]. max_hold starts before activation.
  var EPOCHS = [[0, 0, 300], [1, 106, 406], [0, 154, 454], [2, 463, 763], [3, 497, 797]];
  var ASLEEP = [106, 154];

  // Real time (ms) to trace time (s): quick through routine handoffs, slow while the lease runs out.
  var WARP = [[0, 0], [3600, 280], [6000, 400], [9200, 462], [11000, NOW]];
  var DURATION = WARP[WARP.length - 1][0];
  function traceAt(ms) {
    for (var i = 1; i < WARP.length; i++) {
      if (ms <= WARP[i][0]) {
        var a = WARP[i - 1], b = WARP[i];
        return a[1] + (b[1] - a[1]) * (ms - a[0]) / (b[0] - a[0]);
      }
    }
    return NOW;
  }

  function lastAt(list, t) {
    var found = null;
    for (var i = 0; i < list.length; i++) { if (list[i][list === STATES ? 0 : 1] <= t) found = list[i]; }
    return found;
  }
  function mmss(t) { var s = Math.floor(t); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }
  function show(el, on) {
    if (on) el.removeAttribute('visibility'); else el.setAttribute('visibility', 'hidden');
  }

  function render(T) {
    grows.forEach(function (g) {
      var on = T >= g.t0;
      if (on !== g.shown) { show(g.el, on); g.shown = on; }
      if (!on) return;
      var end = X(Math.min(T, g.t1));
      if (g.line) g.el.setAttribute('x2', end.toFixed(2));
      else g.el.setAttribute('width', Math.max(0, end - X(g.t0)).toFixed(2));
    });

    marks.forEach(function (m) { m.el.classList.toggle('is-off', T < m.at); });

    leases.forEach(function (l) {
      var started = T >= l.t0;
      show(l.used, started);
      if (started) l.used.setAttribute('width', Math.max(0, X(Math.min(T, l.t1)) - X(l.t0)).toFixed(2));
      var holding = started && T < l.t1;
      show(l.left, holding);
      if (holding) {
        // The remaining lease: from now to the deadline. It is eaten from the left as time passes.
        l.left.setAttribute('x', X(T).toFixed(2));
        l.left.setAttribute('width', Math.max(0, X(Math.min(l.dl, TMAX)) - X(T)).toFixed(2));
      }
      var expired = l.t1 === l.dl && T >= l.dl;
      show(l.tick, (holding && l.dl <= TMAX) || expired);
    });

    if (reveal) reveal.setAttribute('width', Math.max(0, X(T) - X0).toFixed(2));
    if (nowG) nowG.setAttribute('transform', 'translate(' + X(T).toFixed(2) + ',0)');
    setText(nowText, mmss(T));

    var st = lastAt(STATES, T);
    var ep = null;
    for (var i = 0; i < EPOCHS.length; i++) { if (EPOCHS[i][1] <= T && EPOCHS[i][0] === st[2]) ep = EPOCHS[i]; }
    var left = ep ? Math.max(0, Math.ceil(ep[2] - T)) : 0;

    setText(out.state, st[1]);
    setText(out.resident, NAMES[st[2]]);
    setText(out.queued, String(st[3]));
    setText(out.lease, String(left));

    statusEls.forEach(function (el, row) {
      var txt = 'unloaded', isLease = false;
      if (row === st[2]) { txt = 'lease ' + left + ' s'; isLease = true; }
      else if (row === 0 && T >= ASLEEP[0] && T < ASLEEP[1]) txt = 'asleep';
      setText(el, txt);
      el.classList.toggle('is-lease', isLease);
    });
  }

  // ---- phones: the timeline scrolls sideways; worker names stay pinned and the view follows "now" ----
  var following = true;
  function scale() { return (svg.getBoundingClientRect().width || VIEW_W) / VIEW_W; }
  function overflowing() { return scroller.scrollWidth > scroller.clientWidth + 1; }
  function pinLabels() {
    if (labels) labels.setAttribute('transform', 'translate(' + (scroller.scrollLeft / scale()).toFixed(2) + ',0)');
  }
  // Show the track from trace x-coordinate `left` (in SVG units) at the edge of the pinned label column.
  function viewFrom(left) {
    scroller.scrollLeft = Math.max(0, (left - LABEL_W) * scale());
  }
  function visibleUnits() { return (scroller.clientWidth - LABEL_W * scale()) / scale(); }
  // The camera: keep "now" at 62% of the visible track, then, as the lease runs out, pan ahead so the
  // expiry and what follows (error event, reset, memory freed, the next model loading) sit in view and
  // hold there. The pan runs from 20 s before the deadline to 14 s after it.
  var PAN_FROM = 444, PAN_TO = 468;
  function follow(T) {
    if (!overflowing()) return;
    var ahead = X(T) - visibleUnits() * 0.62;
    var park = X(PARK_T);
    var left;
    if (T <= PAN_FROM) left = ahead;
    else if (T >= PAN_TO) left = park;
    else { var k = (T - PAN_FROM) / (PAN_TO - PAN_FROM); k = k * k * (3 - 2 * k); left = ahead + (park - ahead) * k; }
    viewFrom(left);
  }
  function setupScroller() {
    if (overflowing()) {
      scroller.setAttribute('tabindex', '0');
      scroller.setAttribute('role', 'region');
      scroller.setAttribute('aria-label', 'Lease timeline, scrolls sideways');
    } else {
      scroller.removeAttribute('tabindex');
      scroller.removeAttribute('role');
      scroller.removeAttribute('aria-label');
    }
    pinLabels();
  }
  scroller.addEventListener('scroll', pinLabels, { passive: true });
  ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(function (type) {
    scroller.addEventListener(type, function () { following = false; }, { passive: true });
  });
  window.addEventListener('resize', setupScroller);
  setupScroller();

  // ---- sideways scrollers (the timeline, code blocks): fade the clipped edge until scrolled to the end ----
  var edges = [scroller].concat(Array.prototype.slice.call(document.querySelectorAll('.code pre')));
  function markEdge(el) {
    var over = el.scrollWidth > el.clientWidth + 1;
    el.classList.toggle('is-overflow', over);
    el.classList.toggle('is-end', !over || el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }
  edges.forEach(function (el) {
    el.addEventListener('scroll', function () { markEdge(el); }, { passive: true });
    markEdge(el);
  });
  window.addEventListener('resize', function () { edges.forEach(markEdge); });

  // ---- playback ----
  var raf = 0, elapsed = 0, last = null;
  function frame(ts) {
    if (last === null) last = ts;
    elapsed += Math.min(ts - last, 64); // a hidden tab pauses the trace instead of skipping it
    last = ts;
    var T = traceAt(elapsed);
    render(T);
    if (following) follow(T);
    if (elapsed < DURATION) { raf = window.requestAnimationFrame(frame); }
    else { svg.setAttribute('data-play', 'done'); if (replayBtn) replayBtn.disabled = false; }
  }
  function play() {
    window.cancelAnimationFrame(raf);
    elapsed = 0; last = null; following = true;
    render(0);
    svg.setAttribute('data-play', 'running');
    if (replayBtn) replayBtn.disabled = true;
    window.setTimeout(function () { raf = window.requestAnimationFrame(frame); }, 450);
  }

  if (reduce) {
    render(NOW);
    svg.setAttribute('data-play', 'done');
    if (overflowing()) viewFrom(X(PARK_T));
    return;
  }

  if (replayBtn) {
    replayBtn.hidden = false;
    replayBtn.addEventListener('click', play);
  }

  // Start once the panel is on screen (a deep link to #install should not burn the one play).
  render(0);
  svg.setAttribute('data-play', 'running');
  var box = svg.getBoundingClientRect();
  if (box.top < window.innerHeight && box.bottom > 0) {
    play();
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); play(); }
    }, { threshold: 0.25 });
    io.observe(svg);
  } else {
    play();
  }
})();

// Staggered section entrances (pass 2): children rise in sequence once their group scrolls in.
// CSS hides them only under html.js + no-preference, so no JS or reduced motion = final state.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');
  var groups = document.querySelectorAll('.steps, .facts, .kinds, .split, .install');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in'); io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  groups.forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', Math.min(i, 9)); });
    g.setAttribute('data-stagger', '');
    io.observe(g);
  });
})();
