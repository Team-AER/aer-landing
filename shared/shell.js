// Team AER apps landing — tiny shared behaviours. No framework, no build.
// 1. Mobile nav toggle: any [data-nav-toggle] controls the element named in aria-controls.
// 2. Copy buttons: any [data-copy] copies its own target's text (data-copy="#id" or the button's text).
// 3. One orchestrated reveal: elements with [data-reveal] get .is-in once, when first scrolled into view.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-nav-toggle]').forEach(function (btn) {
    var id = btn.getAttribute('aria-controls');
    var menu = id && document.getElementById(id);
    if (!menu) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
      document.documentElement.classList.toggle('nav-open', !open);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { btn.setAttribute('aria-expanded', 'false'); menu.hidden = true; document.documentElement.classList.remove('nav-open'); }
    });
  });

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sel = btn.getAttribute('data-copy');
      var src = sel && sel !== '' ? document.querySelector(sel) : btn;
      var text = src ? (src.getAttribute('data-copy-text') || src.textContent).trim() : '';
      if (!text || !navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function () {
        var prev = btn.textContent;
        btn.textContent = 'Copied';
        btn.setAttribute('data-copied', 'true');
        setTimeout(function () { btn.textContent = prev; btn.removeAttribute('data-copied'); }, 1400);
      });
    });
  });

  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }
})();
