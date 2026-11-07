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
<button class="ws-tool-tab" disabled id="ws-tab-paper" role="tab" aria-selected="true" aria-controls="ws-paper" style="--color:#eee9dc" data-panel="paper">
<span>
</span>Pensieve</button>
<button class="ws-tool-tab" disabled id="ws-tab-voice" role="tab" aria-selected="false" aria-controls="ws-voice" tabindex="-1" style="--color:#9cd5f9" data-panel="voice">
<span>
</span>Voice</button>
<button class="ws-tool-tab" disabled id="ws-tab-trace" role="tab" aria-selected="false" aria-controls="ws-trace" tabindex="-1" style="--color:#90a8ed" data-panel="trace">
<span>
</span>Avifors</button>
</div>
<div class="ws-stack">
<div class="ws-back" aria-hidden="true">
</div>
<div class="ws-back ws-second" aria-hidden="true">
</div>
<div class="ws-window" id="ws-window" aria-busy="false">
<div class="ws-loading" aria-hidden="true"><h3>The Daily Pensieve</h3><p>A reading desk for the curious.</p><div class="ws-loading-lines"><i></i><i></i><i></i></div><span class="ws-loading-stamp">TOOLS UNPACKING</span></div>
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
<div class="ws-load-status"><span role="status" aria-live="polite">Setting out the tools…</span><button type="button" class="ws-retry" hidden>Try opening the demo ↻</button></div>
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
function Workshop({ projectCount, heroBg, stickerDensity }) {
  const markup = WORKSHOP_MARKUP.replace('<span data-project-count>12</span>', `<span data-project-count>${projectCount}</span>`);
  return <div className="ws-root ws-ambient" style={{ "--ws-hero-bg": heroBg }} data-stickers={stickerDensity} data-motion="off" data-load-state="loading" dangerouslySetInnerHTML={{ __html: markup }} />;
}
