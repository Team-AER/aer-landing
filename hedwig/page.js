// Hedwig landing. The why door in the triage example: a reason is a button that opens its popover;
// a scope button inside takes the row out of Needs you and offers Undo. Escape and clicking away
// close it. Also gates the phone nav's CTA on the hero CTA. The hero's composition is CSS; the nav
// toggle and the copy button are shell.js.
(function () {
  'use strict';
  // Honour the OS motion preference: a row leaving Needs you jumps to its final state instead of
  // fading and collapsing. (The hero's composition is CSS and stops itself under the same query.)
  var reduce = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var status = document.querySelector('[data-door-status]');
  var needsCount = document.querySelector('.demo .grp--att span');
  var phone = window.matchMedia ? window.matchMedia('(max-width: 599px)') : null;
  var openBtn = null;

  // The Needs you count follows the rows still in the group.
  function recount() {
    if (needsCount) needsCount.textContent = String(document.querySelectorAll('.demo .row--needs:not(.row--out)').length);
  }

  function closeAll() {
    document.querySelectorAll('[data-door][aria-expanded="true"]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (p) p.hidden = true;
    });
    openBtn = null;
  }

  function setStatus(text, undo) {
    if (!status) return;
    status.textContent = text || '';
    if (undo) {
      var u = document.createElement('button');
      u.type = 'button';
      u.className = 'link';
      u.textContent = 'Undo';
      u.addEventListener('click', undo);
      status.appendChild(u);
      u.focus();
    }
  }

  document.querySelectorAll('[data-door]').forEach(function (btn) {
    var pop = document.getElementById(btn.getAttribute('aria-controls'));
    if (!pop) return;
    var row = btn.closest('.row');
    if (row && reduce) row.style.transition = 'none';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeAll();
      if (open) return;
      btn.setAttribute('aria-expanded', 'true');
      // On phones the door opens in the list, right under its own row; wider, it floats beside it.
      if (row) {
        if (phone && phone.matches) row.insertAdjacentElement('afterend', pop);
        else if (pop.parentElement !== row.closest('.demo')) row.closest('.demo').appendChild(pop);
      }
      pop.hidden = false;
      openBtn = btn;
      var first = pop.querySelector('[data-scope]');
      if (first) first.focus();
    });

    pop.addEventListener('click', function (e) { e.stopPropagation(); });

    pop.querySelectorAll('[data-door-close]').forEach(function (c) {
      c.addEventListener('click', function () { closeAll(); btn.focus(); });
    });

    pop.querySelectorAll('[data-scope]').forEach(function (s) {
      s.addEventListener('click', function () {
        var scope = s.getAttribute('data-scope') || '';
        closeAll();
        if (row) row.classList.add('row--out');
        recount();
        setStatus('Moved out of Needs you (' + scope.charAt(0).toLowerCase() + scope.slice(1) + '). Hedwig keeps the correction as a training label. ', function () {
          if (row) row.classList.remove('row--out');
          recount();
          setStatus('');
          btn.focus();
        });
      });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !openBtn) return;
    var was = openBtn;
    closeAll();
    was.focus();
  });

  document.addEventListener('click', function () { if (openBtn) closeAll(); });

  // On phones the nav's Open Hedwig shows only while neither the hero's nor the closing section's own
  // Open Hedwig is on screen, so no screen shows the same call to action twice. (CSS keeps it hidden
  // on phones until this class arrives; wider layouts always show it.)
  var ctas = document.querySelectorAll('.hero .hero__cta, .cta .hero__cta');
  var root = document.documentElement;
  if (ctas.length && 'IntersectionObserver' in window) {
    var seen = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
      root.classList.toggle('nav-cta-on', seen.size === 0);
    }, { rootMargin: '-60px 0px 0px 0px' });
    ctas.forEach(function (el) { io.observe(el); });
  } else {
    root.classList.add('nav-cta-on');
  }
})();
