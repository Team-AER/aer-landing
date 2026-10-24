// The homepage's miniature workshop is an authored illustration, never an API client.
// All mutable example state stays inside this component; no audio, models or user data.
const WORKSHOP_MARKUP = `<section class="ws-hero" id="top">
<div class="ws-wrap ws-hero-grid">
<div class="ws-hero-copy">
<div class="ws-kicker ws-mono" style="--delay:0s">Two humans · open source on the side</div>
<h1 style="--delay:.08s">Passion<br>
<span class="ws-pink">projects,</span>
<br>one <span class="ws-yellow">domain.</span>
</h1>
<p style="--delay:.16s">Small tools for the things we love.<br>Built by Nidhi &amp; Prakhar, with care and a little spare time.</p>
<div class="ws-actions" style="--delay:.24s">
<a class="ws-btn" href="#projects">See the projects <span>↗</span>
</a>
<a class="ws-text-link" href="#team">Meet the team ↗</a>
</div>
<div class="ws-aside ws-mono">
<span data-project-count>12</span> projects. One very busy weekend.</div>
</div>
<div class="ws-workshop">
<div class="ws-stamp" aria-hidden="true">pick a tool. play a little. ↙</div>
<div class="ws-tool-tabs" role="tablist" aria-label="Try a miniature tool">
<button class="ws-tool-tab" id="ws-tab-paper" role="tab" aria-selected="true" aria-controls="ws-paper" style="--color:#eee9dc" data-panel="paper">
<span>
</span>Pensieve</button>
<button class="ws-tool-tab" id="ws-tab-voice" role="tab" aria-selected="false" aria-controls="ws-voice" tabindex="-1" style="--color:#9cd5f9" data-panel="voice">
<span>
</span>Voice</button>
<button class="ws-tool-tab" id="ws-tab-trace" role="tab" aria-selected="false" aria-controls="ws-trace" tabindex="-1" style="--color:#90a8ed" data-panel="trace">
<span>
</span>Avifors</button>
</div>
<div class="ws-stack">
<div class="ws-back" aria-hidden="true">
</div>
<div class="ws-back ws-second" aria-hidden="true">
</div>
<div class="ws-window" id="ws-window">
<div class="ws-chrome" aria-hidden="true">
<i>
</i>
<i>
</i>
<i>
</i>
<span class="ws-window-label" id="ws-window-label">Pensieve · today's reading</span>
<span class="ws-window-tag">ILLUSTRATION</span>
</div>
<div class="ws-scene ws-paper ws-active" id="ws-paper" role="tabpanel" aria-labelledby="ws-tab-paper">
<div class="ws-paper-top">The Daily Pensieve <small>DAILY EDITION</small>
</div>
<div class="ws-paper-body">
<div class="ws-paper-cover">
<h3>A little less<br>noise.<br>A lot more<br>curiosity.</h3>
<p>A reading desk that finds the stories worth your time.</p>
<button class="ws-scene-action" id="ws-rank">Rank by interest ↗</button>
</div>
<div id="ws-paper-list">
<div class="ws-paper-row" data-score="72">
<b>01</b> City in bloom <em>72</em>
</div>
<div class="ws-paper-row" data-score="98">
<b>02</b> The quiet web <em>98</em>
</div>
<div class="ws-paper-row" data-score="86">
<b>03</b> Notes on type <em>86</em>
</div>
<div class="ws-paper-row" data-score="64">
<b>04</b> A good detour <em>64</em>
</div>
</div>
</div>
</div>
<div class="ws-scene ws-voice" id="ws-voice" role="tabpanel" aria-labelledby="ws-tab-voice" hidden>
<header>PolyJuiceVoice <span>TEXT → VOICE</span>
</header>
<div class="ws-voice-input">“Every good idea starts with<br>
<mark>a voice of its own.</mark>”</div>
<div class="ws-wave" id="ws-wave" aria-hidden="true">
</div>
<button class="ws-scene-action" id="ws-voice-play">Animate the phrase ▷</button>
<span class="ws-mono" style="font-size:8px;margin-left:10px;color:#8da398">visual demo · no audio</span>
</div>
<div class="ws-scene ws-trace ws-done" id="ws-trace" role="tabpanel" aria-labelledby="ws-tab-trace" hidden>
<header>
<b>Avifors</b>
<span>one GPU. many possibilities.</span>
</header>
<div class="ws-trace-grid">
<div class="ws-trace-row">
<span>text-chat</span>
<div class="ws-track">
<b style="--left:0%;--width:42%">
</b>
</div>
</div>
<div class="ws-trace-row">
<span>embed</span>
<div class="ws-track">
<b style="--left:44%;--width:24%">
</b>
</div>
</div>
<div class="ws-trace-row">
<span>voice</span>
<div class="ws-track">
<b style="--left:71%;--width:27%">
</b>
</div>
</div>
<div class="ws-cursor" id="ws-cursor">
</div>
</div>
<div class="ws-trace-bottom">
<button class="ws-scene-action" id="ws-trace-play">Replay the handoff ↻</button>
<output id="ws-trace-status">voice ready</output>
</div>
</div>
</div>
</div>
<div class="ws-demo-caption">
<strong id="ws-caption">Make a little room for what matters.</strong>
<a class="ws-tool-link" id="ws-tool-link" href="/pensieve/">Open Pensieve overview ↗</a>
<span>Interactive illustrations · no connected apps or audio</span>
</div>
</div>
</div>
</section>
<div class="ws-strip" aria-hidden="true">
<span>Made for curiosity.</span>
<span>✦</span>
<span>Open source on the side.</span>
<span>✦</span>
<span>Built for fun.</span>
<span>✦</span>
<span>Made for curiosity.</span>
</div>
<section class="ws-collection ws-wrap" id="ws-collection">
<div class="ws-section-heading">
<h2>A small tool.<br>A whole new rabbit hole.</h2>
<p>Follow an interest, not a feature list.<br>There’s a little bit of everything here.</p>
</div>
<div class="ws-collection-grid">
<article class="ws-index-card" style="--card:#FF90E8">
<h3>Read.<br>Think.<br>Make room.</h3>
<p>Pensieve, Hedwig &amp; Quill.<br>For the things worth keeping.</p>
<a href="#read">Explore everyday tools ↗</a>
<span class="ws-big-n" aria-hidden="true">01</span>
</article>
<article class="ws-index-card" style="--card:#FFC900">
<h3>Make<br>some noise.</h3>
<p>Music, voice &amp; captions.<br>Ideas that sound like you.</p>
<a href="#play">Explore creative tools ↗</a>
<span class="ws-big-n" aria-hidden="true">02</span>
</article>
<article class="ws-index-card" style="--card:#E9EEFA">
<h3>Look<br>under the hood.</h3>
<p>Models, hardware &amp; research.<br>A few very good rabbit holes.</p>
<a href="#run">Explore the systems ↗</a>
<span class="ws-big-n" aria-hidden="true">03</span>
</article>
</div>
</section>`;
function Workshop({ motionEnabled, projectCount, heroBg, stickerDensity }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const root = ref.current;
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
    if (moving()) { root.classList.add('ws-intro'); introTimer = setTimeout(() => root.classList.remove('ws-intro'), 1600); }
    return () => { settle(); controller.abort(); if (observer) observer.disconnect(); one('#ws-wave').replaceChildren(); };
  }, []);
  React.useLayoutEffect(() => { ref.current.dispatchEvent(new Event('workshop-motion-change')); }, [motionEnabled]);
  React.useLayoutEffect(() => { ref.current.querySelector('[data-project-count]').textContent = projectCount; }, [projectCount]);
  return <div ref={ref} className="ws-root ws-ambient" style={{ "--ws-hero-bg": heroBg }} data-stickers={stickerDensity} data-motion={motionEnabled ? 'on' : 'off'} dangerouslySetInnerHTML={{ __html: WORKSHOP_MARKUP }} />;
}
