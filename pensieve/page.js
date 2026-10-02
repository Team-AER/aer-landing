// Pensieve landing page. No framework, no build, no third parties.
// 1. Today's date in the replica's masthead, in the app's format ("Friday, 2 October").
// 2. The page's one orchestrated moment: the paper arrives newest first, the interest bars fill,
//    then the rows sort once into ranked order (FLIP). The caption's toggle replays it on request.
//    Reduced motion: ranked order at once. No JS: style.css settles it without movement.
//    On phones the last story fully inside the frame is then swiped right once and marked read, as in the app.
// 3. On phones the page nav slides away while reading down and returns on the way up, as the app's bars do.
// 4. html.js: lets style.css hold section children back until shell.js reveals them (no JS, nothing hidden).
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var t0 = Date.now();

  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var small = window.matchMedia ? window.matchMedia('(max-width: 899.98px)') : { matches: false };

  // ---- 1. Today's date ----
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var now = new Date();
  var today = DAYS[now.getDay()] + ', ' + now.getDate() + ' ' + MONTHS[now.getMonth()];
  document.querySelectorAll('[data-today]').forEach(function (el) { el.textContent = today; });

  // ---- 2. The paper sort ----
  var list = document.querySelector('[data-paper]');
  var control = document.querySelector('[data-order-control]');
  if (list) {
    var buttons = control ? Array.prototype.slice.call(control.querySelectorAll('[data-order]')) : [];
    var timers = [];
    var userTook = false;

    var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    var press = function (order) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-order') === order)); });
    };
    var rows = function () { return Array.prototype.slice.call(list.children); };

    // FLIP: note where each row is, switch the CSS order, then play each row from its old spot to its new one.
    var reorder = function (order) {
      if (reduce.matches) { list.setAttribute('data-order', order); return; }
      var items = rows();
      var before = items.map(function (el) { return el.getBoundingClientRect().top; });
      list.setAttribute('data-order', order);
      var after = items.map(function (el) { return el.getBoundingClientRect().top; });
      items.forEach(function (el, i) {
        el.style.transition = 'none';
        el.style.transform = 'translateY(' + Math.round(before[i] - after[i]) + 'px)';
      });
      void list.offsetHeight;
      items.forEach(function (el) {
        el.style.transition = '';
        el.style.transform = '';
      });
    };

    // Take over from the CSS fallback in the same state it shows: arrival order, empty bars.
    if (reduce.matches) {
      list.setAttribute('data-order', 'ranked');
      list.setAttribute('data-bars', 'full');
      list.setAttribute('data-swipe', 'done');
      press('ranked');
    } else {
      list.setAttribute('data-order', 'newest');
      list.setAttribute('data-bars', 'empty');
      press('newest');
    }
    if (control) control.hidden = false;

    // While the bars fill, each "N% match" counts up to its figure (from 10, so the width never changes).
    var countUp = function () {
      Array.prototype.forEach.call(list.querySelectorAll('.r-match'), function (m) {
        var bar = m.querySelector('.r-aff i'), n = m.querySelector('.r-aff-n');
        if (!bar || !n || !window.requestAnimationFrame) return;
        var target = Math.round(parseFloat(bar.style.getPropertyValue('--m')) * 100);
        if (!(target >= 10)) return;
        var start = null;
        var step = function (t) {
          if (start === null) start = t;
          var k = Math.min(1, (t - start) / 750);
          if (userTook) k = 1;
          n.textContent = Math.round(10 + (target - 10) * (1 - Math.pow(1 - k, 3))) + '% match';
          if (k < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      });
    };

    var play = function () {
      if (userTook) return;
      // Let the rows finish landing (style.css, about 1.2s after load) before the bars start.
      later(function () {
        if (userTook) return;
        list.setAttribute('data-bars', 'full');
        countUp();
        later(function () {
          if (userTook) return;
          press('ranked');
          reorder('ranked');
          later(function () { if (!userTook) list.setAttribute('data-picked', ''); }, 1000);
          // Phones: the last story fully in the frame is then swiped right, the app's gesture for "mark read".
          later(function () {
            if (userTook || !small.matches) return;
            list.setAttribute('data-swipe', 'play');
            later(function () { list.setAttribute('data-swipe', 'done'); }, 1500);
          }, 1500);
        }, 1100);
      }, Math.max(500, 1300 - (Date.now() - t0)));
    };

    // Desktop lists are short, so the first row in view is enough (a 1280x800 laptop shows about a quarter
    // of the list at load); the phone list is long, so wait until a few rows are on screen.
    var whenSeen = function (el, fn) {
      if (!('IntersectionObserver' in window)) { fn(); return; }
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) { io.disconnect(); fn(); return; }
        }
      }, { threshold: small.matches ? 0.25 : 0.15 });
      io.observe(el);
    };

    // Play it where someone can see it: on screen, in a visible tab.
    var whenVisible = function (fn) {
      if (!document.hidden) { fn(); return; }
      var onVis = function () {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', onVis);
        fn();
      };
      document.addEventListener('visibilitychange', onVis);
    };

    if (!reduce.matches) whenSeen(list, function () { whenVisible(play); });

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var order = b.getAttribute('data-order');
        userTook = true;
        timers.forEach(clearTimeout);
        timers = [];
        list.setAttribute('data-bars', 'full');
        if (list.getAttribute('data-swipe') === 'play') list.setAttribute('data-swipe', 'done');
        press(order);
        if (list.getAttribute('data-order') !== order) reorder(order);
      });
    });
  }

  // ---- 3. Phone nav that gets out of the way ----
  var nav = document.querySelector('[data-pagenav]');
  if (nav && window.matchMedia) {
    var lastY = window.scrollY;
    var ticking = false;
    var update = function () {
      ticking = false;
      var y = window.scrollY;
      var dy = y - lastY;
      var menuOpen = document.documentElement.classList.contains('nav-open');
      if (!small.matches || menuOpen || y < 160) nav.removeAttribute('data-away');
      else if (dy > 6) nav.setAttribute('data-away', '');
      else if (dy < -6) nav.removeAttribute('data-away');
      lastY = y;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    nav.addEventListener('focusin', function () { nav.removeAttribute('data-away'); });
  }
})();
