// Muffliato landing — page behaviour. No framework, no build, no inline handlers (CSP: script-src 'self').
// 1. The hero's one orchestrated moment: the perturbation is drawn over the waveform, then the
//    recogniser's transcript lines are struck out one by one and the decoded result reads "" (0 tokens).
//    It plays once when the demo is in view, then settles. The static HTML is the finished state,
//    which is what reduced-motion and no-JS visitors see.
// 2. Stagger indexes for [data-reveal] children (the shell adds .is-in).
(function () {
  'use strict';
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = motionQuery.matches;
  if (reduce) document.documentElement.classList.add('mf-motion-settled');
  if (!reduce) document.documentElement.classList.add('mf-js');

  document.querySelectorAll('[data-reveal]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--i', String(i));
    });
  });

  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var delta = demo.querySelector('[data-delta]');
  var lines = Array.prototype.slice.call(demo.querySelectorAll('.line'));
  var result = demo.querySelector('[data-result]');
  var earTag = demo.querySelector('[data-ear-tag]');
  var steps = Array.prototype.slice.call(demo.querySelectorAll('.steps__i'));
  var replay = demo.querySelector('[data-replay]');
  var timers = [];
  var playing = false;

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function setStep(n) {
    steps.forEach(function (s, i) {
      s.classList.toggle('is-on', i === n - 1);
      s.classList.toggle('is-done', i < n - 1);
    });
  }

  function settle() {
    clearTimers();
    playing = false;
    demo.classList.remove('is-armed');
    if (delta) delta.classList.remove('is-on');
    lines.forEach(function (l) { l.classList.add('is-gone'); });
    if (result) result.classList.add('is-on');
    if (earTag) earTag.textContent = 'same words';
    steps.forEach(function (s) { s.classList.remove('is-on'); s.classList.add('is-done'); });
    if (replay) replay.hidden = false;
  }

  function arm() {
    demo.classList.add('is-armed');
    if (delta) delta.classList.remove('is-on');
    lines.forEach(function (l) { l.classList.remove('is-gone'); });
    if (result) result.classList.remove('is-on');
    if (earTag) earTag.textContent = 'listening';
    steps.forEach(function (s) { s.classList.remove('is-on', 'is-done'); });
    if (replay) replay.hidden = true;
  }

  function play() {
    if (reduce || playing) return;
    playing = true;
    arm();
    // Force a style flush so the armed state is painted before transitions start.
    void demo.offsetWidth;
    later(function () { setStep(1); }, 200);
    later(function () {
      setStep(2);
      if (delta) delta.classList.add('is-on');
      if (earTag) earTag.textContent = 'same words';
    }, 1100);
    later(function () { setStep(3); }, 2300);
    lines.forEach(function (l, i) {
      later(function () { l.classList.add('is-gone'); }, 2500 + i * 420);
    });
    later(function () {
      if (result) result.classList.add('is-on');
    }, 2500 + lines.length * 420 + 200);
    later(settle, 2500 + lines.length * 420 + 900);
  }

  if (replay) {
    replay.disabled = reduce;
    replay.addEventListener('click', function () { if (!playing) play(); });
  }

  motionQuery.addEventListener('change', function () {
    reduce = motionQuery.matches;
    if (reduce) {
      document.documentElement.classList.add('mf-motion-settled');
      document.documentElement.classList.remove('mf-js');
      settle();
    } else {
      document.documentElement.classList.remove('mf-motion-settled');
      document.documentElement.classList.add('mf-js');
    }
    if (replay) replay.disabled = reduce;
  });

  if (reduce || !('IntersectionObserver' in window)) { settle(); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { io.disconnect(); later(play, 500); }
    });
  }, { threshold: 0.4 });
  io.observe(demo);
})();
