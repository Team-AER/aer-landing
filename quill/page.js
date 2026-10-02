// Quill landing — behaviour for the meeting-reader replica. No framework, no build.
// Everything here answers a click (seek by line, chapter or track; filter by speaker chip; tick an
// action item), except one thing: the hero's landing sequence waits until it can be seen.
// The copy button and the nav toggle live in /shared/shell.js.
(function () {
  'use strict';
  // html.js lets style.css hold section children back until shell.js reveals them; without JS nothing hides.
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Action items: the heading counts what is ticked, as the app does ("· 1 of 4 done").
  document.querySelectorAll('[data-done-count]').forEach(function (count) {
    var panel = count.closest('.q-panel');
    var boxes = panel ? Array.prototype.slice.call(panel.querySelectorAll('.q-check')) : [];
    if (!boxes.length) return;
    panel.addEventListener('change', function () {
      var done = boxes.filter(function (b) { return b.checked; }).length;
      count.textContent = '· ' + (done ? done + ' of ' + boxes.length + ' done' : boxes.length);
    });
  });

  // Tab strips scroll sideways on narrow screens, as in the app: keep the selected tab in view and
  // fade whichever edge has more tabs past it, so a cut-off label reads as "scroll", not as a bug.
  var tabStrips = Array.prototype.slice.call(document.querySelectorAll('.q-tabs'));
  function edges(t) {
    var max = t.scrollWidth - t.clientWidth;
    t.classList.toggle('fade-l', max > 1 && t.scrollLeft > 1);
    t.classList.toggle('fade-r', max > 1 && t.scrollLeft < max - 1);
  }
  function showSelected() {
    tabStrips.forEach(function (t) {
      var sel = t.querySelector('.is-sel');
      if (sel && t.scrollWidth > t.clientWidth + 1) {
        var right = sel.offsetLeft + sel.offsetWidth; // .q-tabs is position: relative, so this is within the strip
        t.scrollLeft = right > t.clientWidth - 32 ? right - t.clientWidth + 32 : 0;
      }
      edges(t);
    });
  }
  tabStrips.forEach(function (t) { t.addEventListener('scroll', function () { edges(t); }, { passive: true }); });
  showSelected();
  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(showSelected, 150); });

  // "Copy checklist" copies the list as a Markdown checklist, ticks included, in the app's format.
  document.querySelectorAll('[data-copy-checklist]').forEach(function (btn) {
    var panel = btn.closest('.q-panel'), label = btn.querySelector('span');
    btn.addEventListener('click', function () {
      if (!panel || !navigator.clipboard) return;
      var md = Array.prototype.map.call(panel.querySelectorAll('.q-action'), function (row) {
        var txt = function (sel) { var el = row.querySelector(sel); return el ? el.textContent.trim() : ''; };
        var due = txt('.q-lrow__meta > span:last-child').replace(/^Due /, '');
        return '- [' + (row.querySelector('.q-check').checked ? 'x' : ' ') + '] ' + txt('.q-task') + ' — ' + (row.querySelector('.q-owner') ? row.querySelector('.q-owner').lastChild.textContent.trim() : '') + (due ? ', due ' + due : '') + ' (' + txt('.q-tslink') + ')';
      }).join('\n');
      navigator.clipboard.writeText(md).then(function () {
        if (label) label.textContent = 'Copied';
        btn.setAttribute('data-copied', 'true');
        setTimeout(function () { if (label) label.textContent = 'Copy checklist'; btn.removeAttribute('data-copied'); }, 1400);
      }, function () {});
    });
  });

  var reader = document.querySelector('[data-reader]');
  if (!reader) return;
  var txs = reader.querySelector('.q-txscroll');
  var bar = reader.querySelector('.q-talkbar');

  // The one orchestrated moment is plain CSS and starts on load (no flash, no JS needed). A group that
  // starts fully below the fold (phones, tablets) is held back and plays when it scrolls into view;
  // once played it settles to a static final frame. Reduced motion: final frame at once (style.css).
  var afterLanding = [];
  function settle(el, ms) {
    setTimeout(function () {
      el.classList.add('is-static');
      if (el === txs) afterLanding.forEach(function (fn) { fn(); });
    }, ms);
  }
  // [element that animates, element to watch (the bar's card: the bar itself is clipped while it fills), settle after ms]
  [[txs, txs, 1800 + 9 * 120], [bar, bar && bar.parentNode, 2100]].forEach(function (g) {
    var el = g[0], watch = g[1], ms = g[2];
    if (!el) return;
    if (reduce) { el.classList.add('is-static'); return; }
    if (!('IntersectionObserver' in window) || el.getBoundingClientRect().top < window.innerHeight) { settle(el, ms); return; }
    el.classList.add('is-waiting');
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      el.classList.remove('is-waiting');
      el.classList.add('is-late');
      settle(el, ms);
    }, { threshold: 0.3 });
    io.observe(watch);
  });

  var DUR = parseFloat(reader.getAttribute('data-duration')) || 1;
  var timeEl = reader.querySelector('[data-time]');
  var chapterEl = reader.querySelector('[data-chapter]');
  var chapters = Array.prototype.slice.call(reader.querySelectorAll('.q-chapter'));
  var lines = Array.prototype.slice.call(reader.querySelectorAll('.q-line'));
  var chips = Array.prototype.slice.call(reader.querySelectorAll('[data-spk-chip]'));
  var reset = reader.querySelector('[data-spk-reset]');

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function fmt(s) {
    s = Math.max(0, Math.round(s));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + ':' + pad(m) : String(m)) + ':' + pad(sec);
  }
  function startOf(el) {
    var b = el.hasAttribute('data-seek') ? el : el.querySelector('[data-seek]');
    return b ? parseFloat(b.getAttribute('data-seek')) : -1;
  }
  function currentTime() {
    return (parseFloat(reader.style.getPropertyValue('--pos')) || 0) / 100 * DUR;
  }

  // "Following": keep the active line in view when the transcript is shorter than its lines
  // (it always is on phones), the way the app's follow mode does.
  function follow(line, smooth) {
    if (!txs || !line) return;
    var max = txs.scrollHeight - txs.clientHeight;
    if (max <= 1) return;
    var box = txs.getBoundingClientRect(), r = line.getBoundingClientRect();
    var fade = 56; // the bottom fade in style.css
    if (r.top >= box.top && r.bottom <= box.bottom - fade) return;
    // Land on a whole line: the turn before the active one at the top (for context) when both fit,
    // otherwise the active line itself, so no line is sliced in half under the header.
    var prev = line.previousElementSibling;
    while (prev && prev.hidden) prev = prev.previousElementSibling;
    var anchor = line;
    if (prev && r.bottom - prev.getBoundingClientRect().top <= txs.clientHeight - fade) anchor = prev;
    var top = Math.max(0, Math.min(max, txs.scrollTop + (anchor.getBoundingClientRect().top - box.top)));
    if (smooth && !reduce && txs.scrollTo) txs.scrollTo({ top: top, behavior: 'smooth' });
    else txs.scrollTop = top;
  }

  function seek(t, smooth) {
    t = Math.max(0, Math.min(DUR, t));
    reader.style.setProperty('--pos', (t / DUR * 100).toFixed(2) + '%');
    if (timeEl) timeEl.textContent = fmt(t);

    var cur = null;
    chapters.forEach(function (c) {
      var s = startOf(c);
      if (s <= t && (!cur || s >= startOf(cur))) cur = c;
    });
    chapters.forEach(function (c) { c.classList.toggle('is-cur', c === cur); });
    if (chapterEl) chapterEl.textContent = cur ? cur.textContent.trim() : '';

    var active = null;
    lines.forEach(function (l) {
      var s = startOf(l);
      if (s >= 0 && s <= t && !l.hidden) active = l;
    });
    lines.forEach(function (l) {
      var on = l === active;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
    follow(active, smooth);
  }

  function pressed(chip) { return chip.getAttribute('aria-pressed') === 'true'; }
  function applyChips() {
    var hidden = {}, any = false;
    chips.forEach(function (c) {
      var off = !pressed(c);
      hidden[c.getAttribute('data-spk-chip')] = off;
      if (off) any = true;
    });
    lines.forEach(function (l) { l.hidden = !!hidden[l.getAttribute('data-spk')]; });
    if (reset) reset.hidden = !any;
    seek(currentTime(), true);
  }
  // Same rules as the app: you can hide speakers but never all of them; solo shows only one,
  // and soloing the only visible speaker shows everyone again.
  function toggleSpeaker(chip, solo) {
    var on = pressed(chip);
    if (solo) {
      var othersOff = chips.every(function (c) { return c === chip || !pressed(c); });
      var showAll = on && othersOff;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(showAll || c === chip)); });
    } else {
      var visible = chips.filter(pressed).length;
      if (on && visible <= 1) return;
      chip.setAttribute('aria-pressed', String(!on));
    }
    applyChips();
  }

  reader.addEventListener('click', function (e) {
    var seekBtn = e.target.closest('[data-seek]');
    if (seekBtn) { seek(startOf(seekBtn), true); return; }
    var chip = e.target.closest('[data-spk-chip]');
    if (chip) { toggleSpeaker(chip, e.altKey || e.metaKey); return; }
    if (e.target.closest('[data-spk-reset]')) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'true'); });
      applyChips();
      return;
    }
    var track = e.target.closest('[data-seek-track]');
    if (track) {
      var r = track.getBoundingClientRect();
      if (r.width > 0) seek(((e.clientX - r.left) / r.width) * DUR, true);
    }
  });
  chips.forEach(function (c) {
    c.addEventListener('dblclick', function () { toggleSpeaker(c, true); });
  });

  // Start where the markup says (12:37), with the active line in view.
  seek(currentTime(), false);

  // Once the transcript has landed, the player plays a few seconds at 1.25x and pauses on Jonas's
  // decision at 12:44: the time ticks, the playhead and the map's head move, the active line follows.
  // Only while the reader is on screen, never after the visitor has touched it, never under reduced motion.
  var playBtn = reader.querySelector('[data-play]');
  var playUse = playBtn && playBtn.querySelector('use');
  var touched = false, onScreen = true;
  reader.addEventListener('click', function () { touched = true; }, true);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; }, { threshold: 0.2 }).observe(reader);
  }
  function setPlaying(on) {
    if (!playBtn) return;
    playBtn.classList.toggle('is-playing', on);
    if (playUse) playUse.setAttribute('href', on ? '#i-pause' : '#i-play');
  }
  function playDemo() {
    if (reduce || touched || !onScreen) return;
    var t = Math.round(currentTime()), stop = 764;
    if (t >= stop) return;
    setPlaying(true);
    var tick = setInterval(function () {
      if (touched || !onScreen) { clearInterval(tick); setPlaying(false); return; }
      t += 1;
      seek(t, true);
      if (t >= stop) { clearInterval(tick); setTimeout(function () { setPlaying(false); }, 400); }
    }, 800);
  }
  afterLanding.push(function () { setTimeout(playDemo, 700); });
})();
