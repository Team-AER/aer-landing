// Muffliato pages — behaviour. No framework, no build, no inline handlers (CSP: script-src 'self').
// The static HTML is always the finished state; this file only adds motion on top of it, and only
// when the visitor has not asked for reduced motion.
//  1. Hero entrance, then the demo: the model row hears the sentence, a layer sweeps across it,
//     its bars flatten and the transcript scrambles into "[unintelligible]". Plays once in view.
//  2. Scroll reveals ([data-reveal], [data-decay], [data-meter]) and count-ups ([data-count]).
//  3. Sticky nav shadow and a section scroll-spy for the page menu.
//  4. Contact forms compose an email in the visitor's own mail app (the site has no backend
//     and its CSP sets form-action 'none').
(function () {
  'use strict';
  var root = document.documentElement;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = motionQuery.matches;
  var hasIO = 'IntersectionObserver' in window;
  var motion = !reduce && hasIO;

  if (motion) {
    root.classList.add('mf-js');
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-loaded'); }); });
  }

  // ---- Stagger indexes for reveal groups.
  document.querySelectorAll('[data-reveal]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      if (!child.style.getPropertyValue('--i')) child.style.setProperty('--i', String(i));
    });
  });

  // ---- One observer for everything that settles into view once.
  var onceEls = document.querySelectorAll('[data-reveal], [data-decay], [data-meter]');
  function revealAll() { onceEls.forEach(function (el) { el.classList.add('is-in'); }); }
  if (!motion) {
    revealAll();
  } else {
    var once = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); once.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    onceEls.forEach(function (el) { once.observe(el); });
  }

  // ---- Count-ups. data-count="800" or "97-99" (a range), optional data-prefix / data-suffix.
  var counters = document.querySelectorAll('[data-count]');
  function fmt(n, decimals) { return decimals ? n.toFixed(decimals) : String(Math.round(n)); }
  function runCount(el) {
    var spec = el.getAttribute('data-count').split('-');
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    var finalText = el.textContent;
    var ends = spec.map(parseFloat);
    var decimals = (spec[spec.length - 1].split('.')[1] || '').length;
    var start = null, dur = 1400;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + ends.map(function (v) { return fmt(v * e, decimals); }).join('–') + suf;
      if (p < 1) requestAnimationFrame(frame); else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }
  if (motion && counters.length) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countIO.unobserve(en.target); runCount(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  }

  // ---- Sticky nav: a shadow once the page has scrolled under it.
  var nav = document.querySelector('[data-stick]');
  if (nav) {
    var ticking = false;
    var setStuck = function () { nav.classList.toggle('is-stuck', nav.getBoundingClientRect().top <= 0 && window.scrollY > 40); ticking = false; };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(setStuck); } }, { passive: true });
    setStuck();
  }

  // ---- Scroll-spy: mark the menu link for the section in the middle of the viewport.
  var spy = document.querySelector('[data-spy]');
  if (spy && hasIO) {
    var links = {};
    spy.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var sections = Object.keys(links).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        } else if (a.getAttribute('aria-current')) {
          a.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spyIO.observe(s); });
  }

  // ---- Contact forms -> mailto.
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var lines = [];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !el.value) return;
        lines.push(el.name + ': ' + el.value.trim());
      });
      var href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(form.getAttribute('data-subject') || 'Muffliato') +
        '&body=' + encodeURIComponent(lines.join('\n\n'));
      if (status) status.textContent = 'Opening your mail app with this message ready to send.';
      window.location.href = href;
    });
  });

  // ---- Hero demo.
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var quote = demo.querySelector('[data-model-quote]');
  var tag = demo.querySelector('[data-model-tag]');
  var modelWave = demo.querySelector('.wave--model');
  var replay = demo.querySelector('[data-replay]');
  var finalQuote = quote ? quote.textContent : '';
  var sourceQuote = quote ? quote.getAttribute('data-source') : '';
  var finalTag = tag ? tag.textContent : '';
  var timers = [];
  var playing = false;
  var replayHadFocus = false;
  var NOISE = '▒░▓#%&*/\\<>~^=+';

  // Start from the unprotected state so the first view shows the model hearing everything.
  if (motion) {
    demo.classList.add('is-armed');
    if (quote) quote.textContent = sourceQuote;
    if (tag) tag.textContent = 'listening…';
  }

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function settle() {
    clearTimers();
    playing = false;
    demo.classList.remove('is-armed', 'is-sweeping');
    if (quote) quote.textContent = finalQuote;
    if (tag) tag.textContent = finalTag;
    if (replay) {
      replay.hidden = reduce;
      if (replayHadFocus && !reduce) replay.focus();
      replayHadFocus = false;
    }
  }

  function scramble(done) {
    if (!quote) { done(); return; }
    var chars = sourceQuote.split('');
    var order = chars.map(function (_, i) { return i; }).filter(function (i) { return chars[i] !== ' '; });
    for (var k = order.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var tmp = order[k]; order[k] = order[j]; order[j] = tmp; }
    var step = 0, per = Math.ceil(order.length / 14);
    (function tick() {
      for (var n = 0; n < per && step < order.length; n++, step++) {
        chars[order[step]] = NOISE.charAt(Math.floor(Math.random() * NOISE.length));
      }
      quote.textContent = chars.join('');
      if (step < order.length) later(tick, 55); else later(done, 220);
    })();
  }

  function play() {
    if (reduce || playing) return;
    playing = true;
    clearTimers();
    replayHadFocus = !!replay && document.activeElement === replay;
    if (replay) replay.hidden = true;
    demo.classList.remove('is-live');
    void demo.offsetWidth;
    demo.classList.add('is-live');
    demo.classList.remove('is-sweeping');
    demo.classList.add('is-armed');
    if (quote) quote.textContent = sourceQuote;
    if (tag) tag.textContent = 'listening…';
    if (modelWave) demo.style.setProperty('--track', modelWave.clientWidth + 'px');
    later(function () {
      if (tag) tag.textContent = 'protecting';
      void demo.offsetWidth;
      demo.classList.add('is-sweeping');
    }, 1300);
    later(function () { demo.classList.remove('is-armed'); }, 1500);
    later(function () { scramble(settle); }, 1900);
  }

  // Listener bars "talk" only while the demo is on screen.
  var liveIO = hasIO ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { demo.classList.toggle('is-live', en.isIntersecting && !reduce); });
  }) : null;

  if (replay) replay.addEventListener('click', play);

  motionQuery.addEventListener('change', function () {
    reduce = motionQuery.matches;
    if (reduce) {
      root.classList.remove('mf-js');
      demo.classList.remove('is-live');
      revealAll();
      settle();
    }
    if (replay) replay.hidden = reduce || playing;
  });

  if (!motion) { settle(); return; }
  liveIO.observe(demo);
  var startIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { startIO.disconnect(); later(play, 700); }
    });
  }, { threshold: 0.5 });
  startIO.observe(demo);
})();
