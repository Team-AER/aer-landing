// Loaded independently after the static workshop enters the viewport.
export function initWorkshop(root) {
    const one = (s) => root.querySelector(s);
    const all = (s) => [...root.querySelectorAll(s)];
    const moving = () => root.dataset.motion === 'on';
    const animations = new Set();
    const controller = new AbortController();
    const listen = (el, name, fn) => el.addEventListener(name, fn, { signal: controller.signal });
    let voiceTimer = 0, introTimer = 0, traceFrame = 0, traceStart = 0, traceElapsed = 0, traceRunning = false, ranked = false;
    const titles = {
      paper: ["Pensieve · today's reading", 'Make a little room for what matters.', '/pensieve/', 'Pensieve'],
      voice: ['PolyJuiceVoice · a voice of your own', 'A good idea deserves a voice.', '/polyjuicevoice/', 'PolyJuiceVoice'],
      trace: ['Avifors · a shared GPU', 'Let every model have its moment.', '/avifors/', 'Avifors']
    };
    function animate(el, frames, options) {
      if (!moving() || !el.animate) return;
      const animation = el.animate(frames, options);
      animations.add(animation);
      animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    }
    function cancelAnimations() { animations.forEach(a => a.cancel()); animations.clear(); }
    function stopVoice() {
      clearTimeout(voiceTimer);
      one('#ws-wave').classList.remove('ws-is-playing');
      one('#ws-voice-play').textContent = 'Animate the phrase ▷';
    }
    function settleTrace() {
      cancelAnimationFrame(traceFrame); traceFrame = 0; traceRunning = false; traceElapsed = 0;
      one('#ws-trace').classList.add('ws-done');
      all('.ws-track b').forEach(b => b.style.transform = '');
      one('#ws-cursor').style.left = '';
      one('#ws-trace-play').textContent = 'Replay the handoff ↻';
      one('#ws-trace-status').textContent = 'voice ready';
    }
    function settle() {
      cancelAnimations(); stopVoice(); settleTrace();
      clearTimeout(introTimer); root.classList.remove('ws-intro');
    }
    function select(id, focus) {
      const from = getComputedStyle(one('#ws-window')).transform;
      settle();
      const panel = one('#ws-' + id);
      all('.ws-scene').forEach(x => { x.hidden = x !== panel; x.classList.toggle('ws-active', x === panel); });
      all('.ws-tool-tab').forEach(x => {
        const on = x.dataset.panel === id;
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        if (on && focus) x.focus();
      });
      const title = titles[id];
      one('#ws-window-label').textContent = title[0]; one('#ws-caption').textContent = title[1];
      one('#ws-tool-link').href = title[2]; one('#ws-tool-link').textContent = 'Open ' + title[3] + ' overview ↗';
      animate(one('#ws-window'), [{transform:from},{transform:'rotate(1.8deg) translateY(-9px)',offset:.35},{transform:'rotate(-1deg)'}], {duration:520,easing:'cubic-bezier(.2,.8,.2,1)'});
      animate(panel, [{opacity:.3,transform:'translateX(18px)'},{opacity:1,transform:'none'}], {duration:400,easing:'cubic-bezier(.2,.8,.2,1)'});
    }
    all('.ws-tool-tab').forEach((button, i, tabs) => {
      listen(button, 'click', () => select(button.dataset.panel, false));
      listen(button, 'keydown', e => {
        let index;
        if (e.key === 'ArrowRight') index = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
        if (e.key === 'Home') index = 0;
        if (e.key === 'End') index = tabs.length - 1;
        if (index !== undefined) { e.preventDefault(); select(tabs[index].dataset.panel, true); }
      });
    });
    listen(one('#ws-rank'), 'click', () => {
      const list = one('#ws-paper-list'), rows = [...list.children];
      const before = new Map(rows.map(row => [row, row.getBoundingClientRect().top]));
      cancelAnimations();
      rows.sort((a,b) => ranked ? Number(a.querySelector('b').textContent) - Number(b.querySelector('b').textContent) : Number(b.dataset.score) - Number(a.dataset.score));
      rows.forEach(row => list.append(row));
      rows.forEach((row,i) => animate(row, [{transform:'translateY(' + (before.get(row) - row.getBoundingClientRect().top) + 'px)',background:'#FFC900'},{transform:'none',background:'transparent'}], {duration:620,delay:i*35,easing:'cubic-bezier(.2,.8,.2,1)'}));
      ranked = !ranked; one('#ws-rank').textContent = ranked ? 'Restore reading order ↻' : 'Rank by interest ↗';
    });
    for (let i = 0; i < 35; i++) {
      const bar = document.createElement('i');
      bar.style.setProperty('--h', (10 + Math.sin(i*.57)**2*45) + 'px'); bar.style.setProperty('--i', i);
      one('#ws-wave').append(bar);
    }
    listen(one('#ws-voice-play'), 'click', () => {
      if (one('#ws-wave').classList.contains('ws-is-playing')) { stopVoice(); return; }
      if (!moving()) { one('#ws-voice-play').textContent = 'Phrase ready · visual only'; return; }
      one('#ws-wave').classList.add('ws-is-playing'); one('#ws-voice-play').textContent = 'Pause phrase Ⅱ';
      voiceTimer = setTimeout(stopVoice, 2600);
    });
    function traceTick(now) {
      if (!moving()) { settleTrace(); return; }
      const progress = Math.min(1, (now - traceStart) / 3200); traceElapsed = progress * 3200;
      one('#ws-cursor').style.left = (22 + progress * 72) + '%';
      all('.ws-track b').forEach((bar,i) => bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, (progress-i*.3)/.3)) + ')');
      one('#ws-trace-status').textContent = progress < .31 ? 'text-chat ready' : progress < .65 ? 'handoff → embed' : progress < .98 ? 'handoff → voice' : 'voice ready';
      if (progress < 1) traceFrame = requestAnimationFrame(traceTick); else settleTrace();
    }
    listen(one('#ws-trace-play'), 'click', () => {
      if (!moving()) { settleTrace(); return; }
      if (traceRunning) { cancelAnimationFrame(traceFrame); traceRunning = false; one('#ws-trace-play').textContent = 'Resume handoff ▷'; return; }
      one('#ws-trace').classList.remove('ws-done'); traceStart = performance.now() - traceElapsed; traceRunning = true;
      one('#ws-trace-play').textContent = 'Pause handoff Ⅱ'; traceFrame = requestAnimationFrame(traceTick);
    });
    listen(root, 'workshop-motion-change', () => { if (!moving()) settle(); });
    listen(document, 'visibilitychange', () => { if (document.hidden) settle(); });
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      root.dataset.visible = String(entries[0].isIntersecting);
      if (!entries[0].isIntersecting) { stopVoice(); settleTrace(); }
    }) : null;
    if (observer) observer.observe(root);

    return () => { settle(); controller.abort(); if (observer) observer.disconnect(); one('#ws-wave').replaceChildren(); };
}
