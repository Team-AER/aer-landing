// PolyJuiceVoice landing page sections. The studio mirrors the real Speak tab
// (apps/PolyJuiceVoice docs/screenshots/speak.png and Features/Synthesis/Views/SynthesisView.swift).

const RELEASE = 'https://github.com/Team-AER/PolyJuiceVoice/releases/latest';
const REPO = 'https://github.com/Team-AER/PolyJuiceVoice';

// =================== Helpers ===================
const Mono = ({ children, dim, className = '', style }) => (
  <span className={`p-mono${dim ? ' dim' : ''} ${className}`.trim()} style={style}>{children}</span>
);

const Arrow = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M4 12 L12 4 M5 4 L12 4 L12 11" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const Logo = ({ accent = '#1da7ff' }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <rect x="0.5" y="0.5" width="21" height="21" rx="4" stroke="#fff" />
    <path d="M5 11 L7 11 L7 8 L9 8 L9 14 L11 14 L11 5 L13 5 L13 17 L15 17 L15 9 L17 9" stroke={accent} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

// =================== Top Nav ===================
function TopNav() {
  return (
    <header className="p-nav">
      <div className="p-nav-inner">
        <a className="p-brand" href="/polyjuicevoice/" aria-label="PolyJuiceVoice home">
          <Logo />
          <span className="p-brand-name">PolyJuiceVoice</span>
          <Mono dim className="p-nav-meta" style={{ marginLeft: 4 }}>v1.0</Mono>
        </a>
        <nav className="p-nav-links" aria-label="PolyJuiceVoice">
          {[
            { label: 'Voices', href: '#voices' },
            { label: 'Speak', href: '#speak' },
            { label: 'Models', href: '#models' },
            { label: 'Docs', href: `${REPO}/tree/main/docs` },
          ].map(({ label, href }) => <a key={label} className="p-navlink" href={href}>{label}</a>)}
        </nav>
        <a className="p-link p-nav-gh" href={REPO}>GitHub <Arrow /></a>
        <a className="p-btn" href={RELEASE}><span>Download<span className="p-long"> for macOS</span></span></a>
      </div>
      <div className="p-progress" aria-hidden="true" />
    </header>
  );
}

// =================== Hero ===================
// One orchestrated moment: the line types itself, Speak streams the waveform, the clip plays once and settles.
const HERO_LINE = 'Hello! This voice was made on a Mac, offline.';
const HERO_LEN = 8;

function Hero({ accent }) {
  const [ref, visible] = useInView({ once: false, threshold: 0.2 });
  const [typed, setTyped] = React.useState(REDUCED ? HERO_LINE.length : 0);
  const [phase, setPhase] = React.useState(REDUCED ? 'done' : 'idle'); // idle → type → stream → play → done
  const [t, setT] = React.useState(REDUCED ? HERO_LEN : 0);

  React.useEffect(() => {
    if (REDUCED || !visible || phase !== 'idle') return undefined;
    const id = setTimeout(() => setPhase('type'), 400);
    return () => clearTimeout(id);
  }, [visible, phase]);

  React.useEffect(() => {
    if (phase !== 'type') return undefined;
    if (typed >= HERO_LINE.length) { const id = setTimeout(() => setPhase('stream'), 300); return () => clearTimeout(id); }
    const id = setTimeout(() => setTyped((n) => n + 1), 38);
    return () => clearTimeout(id);
  }, [phase, typed]);

  React.useEffect(() => {
    if (phase !== 'stream') return undefined;
    const id = setTimeout(() => setPhase('play'), 2200);
    return () => clearTimeout(id);
  }, [phase]);

  React.useEffect(() => {
    if (phase !== 'play' || !visible) return undefined;
    const id = setInterval(() => setT((x) => {
      if (x + 0.1 >= HERO_LEN) { setPhase('done'); return HERO_LEN; }
      return x + 0.1;
    }), 100);
    return () => clearInterval(id);
  }, [phase, visible]);

  const streaming = phase === 'stream';
  const on = phase === 'stream' || phase === 'play' || phase === 'done';
  const head = phase === 'play' ? t / HERO_LEN : -1;
  const status = phase === 'idle' || phase === 'type' ? 'Ryan · English' : streaming ? 'Speaking…' : phase === 'play' ? 'Playing' : 'Ready';
  const bar = phase === 'play' || phase === 'done' ? t / HERO_LEN : 0;

  return (
    <section style={{ position: 'relative', borderBottom: '1px solid var(--line)' }}>
      <div className="p-hero-grid">
        <div className="p-hero-left">
          <Reveal i={0}><Mono>FIG_00 · ON_DEVICE_TTS</Mono></Reveal>
          <Reveal as="h1" i={1} className="p-hero-h1">
            Any voice<br />you can<br /><span className="p-serif">describe</span>, clone,<br />or imagine.
          </Reveal>
          <Reveal as="p" i={2} className="p-hero-lede">
            PolyJuiceVoice runs Qwen3-TTS natively on your Mac. Speak text in preset voices,
            design new ones from a description, or clone yours from a few seconds of audio.
            Synthesis runs locally on Metal. Optional iCloud sync shares saved voices with your private iCloud storage.
          </Reveal>
          <Reveal i={3} className="p-hero-cta">
            <a className="p-btn" href={RELEASE}>Download for macOS <Arrow /></a>
            <a className="p-link" href={`${REPO}/tree/main/docs`}>Read the docs <Arrow /></a>
            <Mono dim className="p-hero-meta">8.5 MB · macOS 26+ · Apple silicon · MIT</Mono>
          </Reveal>
        </div>
        <div ref={ref} className="p-hero-illus">
          <div className="p-hero-tag"><Mono dim>FIG_01 · NOW_SPEAKING</Mono></div>
          <IllusMicHero accent={accent} on={on} head={head} />
          <div className="p-np">
            <p className="p-np-title">{HERO_LINE.slice(0, typed)}{phase === 'type' || phase === 'idle' ? <span className="p-caret" aria-hidden="true" /> : null}{typed === 0 && <span style={{ color: 'var(--fg-4)' }}>Text to speak</span>}</p>
            <div className="p-np-row">
              <span><span className={`p-np-dot${streaming ? ' is-busy' : ''}`} aria-hidden="true" />{status}</span>
              <span>{phase === 'done' || phase === 'play' ? `${formatTime(t)} / ${formatTime(HERO_LEN)}` : '24 kHz · mono'}</span>
            </div>
            <div className="p-np-bar"><i style={{ '--p': bar }} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =================== Marquee ===================
function Marquee() {
  const items = ['QWEN3-TTS', 'MLX ON METAL', '100% ON-DEVICE', 'OPEN SOURCE · MIT', 'VOICE CLONING', 'VOICE DESIGN', 'MACOS · IOS', '4-BIT → BF16', 'STYLE INSTRUCTIONS', 'PRESET VOICES'];
  return (
    <Fig className="p-marquee" aria-hidden="true">
      <div className="p-marquee-track">
        {[...items, ...items, ...items].map((it, i) => <span key={i}>{it}<b>◆</b></span>)}
      </div>
    </Fig>
  );
}

// =================== Feature Grid ===================
function FeatureCell({ i, fig, title, children, art, sep = true, artStyle }) {
  return (
    <Reveal i={i} className={`p-cell p-pad${sep ? ' p-sep' : ''}`}>
      <Mono>{fig}</Mono>
      <div className="p-figbox" style={artStyle}>{art}</div>
      <h3 className="p-h3">{title}</h3>
      <p className="p-body">{children}</p>
    </Reveal>
  );
}

function FeatureGrid({ accent }) {
  return (
    <section id="voices" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="p-wrap">

        {/* Row 1: native */}
        <div className="p-row p-fg-r1">
          <Reveal className="p-sep p-pad">
            <Mono>FIG_02</Mono>
            <h2 className="p-fg-h2">Native to the metal.</h2>
            <p className="p-body" style={{ marginTop: 28, maxWidth: 380 }}>
              Built in Swift and accelerated by MLX on Metal. No Python, no Docker, no server.
              Apple silicon only: MLX needs a real Metal device, so the iOS Simulator can't run it.
            </p>
            <div style={{ marginTop: 40 }}>
              <a className="p-link p-link--under" href={`${REPO}/blob/main/docs/BUILD_AND_RUN.md`}>Build and run <Arrow /></a>
            </div>
          </Reveal>
          <Reveal i={1} className="p-pad p-chip-cell">
            <Mono dim>APPLE SILICON · METAL · MLX</Mono>
            <Fig style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><IllusChip accent={accent} /></Fig>
          </Reveal>
        </div>

        {/* Row 2: wave / modes / style */}
        <div className="p-row p-row3">
          <FeatureCell i={0} fig="FIG_03" title="Live waveform and scrubber" art={<IllusWave accent={accent} />}>
            Audio starts playing while it is still being generated. Scrub the waveform,
            skip back or forward ten seconds, and export the result.
          </FeatureCell>
          <FeatureCell i={1} fig="FIG_04" title="Four working modes" art={<IllusModes />}>
            Speak, Design, Clone and Library. Each mode uses the model suited to its
            job, and the library feeds every voice picker.
          </FeatureCell>
          <FeatureCell i={2} sep={false} fig="FIG_05" title="Style in plain English" art={
            <div style={{ width: '100%' }}>
              <div className="p-styleblk">
                <div className="t">style instruction</div><div>calm and warm</div>
                <div className="t" style={{ marginTop: 6 }}>style instruction</div><div>excited, fast pace</div>
                <div className="n">preset voices only</div>
              </div>
              <div className="p-tags">
                {[{ t: 'tone · warm', c: '#1da7ff' }, { t: 'pace · slow', c: '#7af0a8' }, { t: 'mood · friendly', c: '#ff5b9c' }].map((x, k) => (
                  <Reveal as="span" key={x.t} i={k + 2} className="p-tag" style={{ color: x.c, border: `1px solid ${x.c}40` }}>{x.t}</Reveal>
                ))}
              </div>
            </div>
          }>
            With a preset voice, add a short instruction like "calm and warm" and the
            model colours the delivery. Saved voices keep their own character.
          </FeatureCell>
        </div>

        {/* Row 3: library */}
        <div className="p-row p-fg-lib">
          <Reveal className="p-sep p-pad">
            <Mono>FIG_06</Mono>
            <h3 className="p-fg-h3-lg">One library for every voice you keep.</h3>
            <p className="p-body" style={{ margin: '20px 0 32px', maxWidth: 400 }}>
              Designed and cloned voices land in the same place. Search by name, filter
              by type, rename, delete. Pick one and it is ready in Speak.
            </p>
            <div className="p-kinds">
              <Reveal i={1} className="p-kind"><b><span className="p-dot" style={{ background: '#b77cf9' }} />Cloned</b><span>from your recording</span></Reveal>
              <Reveal i={2} className="p-kind"><b><span className="p-dot" style={{ background: '#7af0a8' }} />Designed</b><span>from a description</span></Reveal>
            </div>
          </Reveal>
          <Reveal i={1} className="p-pad p-lib-cell"><IllusVoiceLibrary /></Reveal>
        </div>

        {/* Row 4: design / clone */}
        <div className="p-row p-row2">
          <Reveal className="p-cell p-pad p-sep">
            <Mono>FIG_07</Mono>
            <h3 className="p-fg-h3-lg" style={{ fontSize: 28 }}>Design a voice from words.</h3>
            <p className="p-body" style={{ margin: '14px 0 28px', maxWidth: 460 }}>
              Describe what you want, such as "gravelly older man, slow cadence", and the
              model reads your text back in that voice. Iterate until it fits, then save it.
            </p>
            <IllusDesign />
          </Reveal>
          <Reveal i={1} className="p-cell p-pad">
            <Mono>FIG_08</Mono>
            <h3 className="p-fg-h3-lg" style={{ fontSize: 28 }}>Clone from a few seconds.</h3>
            <p className="p-body" style={{ margin: '14px 0 28px', maxWidth: 460 }}>
              Record a short reference (⌘R), type what you said word for word, then write
              what the voice should say next. Same voice, new words, all on your Mac.
            </p>
            <IllusClone />
          </Reveal>
        </div>

        {/* Row 5: record / models / export */}
        <div className="p-row p-row3">
          <FeatureCell i={0} fig="FIG_09" title="Record in the app" artStyle={{ height: 200 }} art={<IllusRecorder />}>
            The Clone tab has its own recorder; microphone access is asked for once.
            A few seconds of clean speech is enough. Longer is fine, not required.
          </FeatureCell>
          <FeatureCell i={1} fig="FIG_10" title="Built on Qwen3-TTS" artStyle={{ height: 200 }} art={<IllusModelMatrix />}>
            Two model families, 0.6B and 1.7B, in every precision Hugging Face publishes,
            from 4-bit to bf16. Pick the trade-off that fits your Mac.
          </FeatureCell>
          <FeatureCell i={2} sep={false} fig="FIG_11" title="Export and share" artStyle={{ height: 200 }} art={<IllusExport accent={accent} />}>
            Every render is a 24 kHz WAV. Export it or hand it to the share sheet, then
            drop it into Logic, Final Cut or your podcast editor.
          </FeatureCell>
        </div>

        {/* Row 6: trust */}
        <div className="p-row p-row3 p-trust">
          {[
            { fig: 'FIG_12', title: 'Sandboxed', body: 'App Sandbox on. Microphone access is granted explicitly for Clone and stays scoped to the app.' },
            { fig: 'FIG_13', title: 'Pure Swift and MLX', body: 'Inference runs through mlx-swift. First launch downloads the weights; after that, everything works offline.' },
            { fig: 'FIG_14', title: 'Debug log', body: 'A built-in log viewer for watching renders and downloads, without digging through Console.app.' },
          ].map((it, k, arr) => (
            <Reveal key={it.fig} i={k} className={`p-cell p-pad${k < arr.length - 1 ? ' p-sep' : ''}`}>
              <Mono>{it.fig}</Mono>
              <h3 className="p-h3" style={{ marginTop: 20 }}>{it.title}</h3>
              <p className="p-body">{it.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== Studio Demo (mirrors the real Speak tab) ===================
const PRESET_VOICES = [
  { id: 'ryan', label: 'Ryan', type: 'preset' },
  { id: 'vivian', label: 'Vivian', type: 'preset' },
  { id: 'aiden', label: 'Aiden', type: 'preset' },
  { id: 'serena', label: 'Serena', type: 'preset' },
];
const YOUR_VOICES = [{ id: 'prakhar', label: 'Prakhar', type: 'cloned' }];
const LANGS = ['English', 'Chinese', 'Japanese', 'Korean', 'Spanish', 'French', 'German'];
const CLIP = 14;

const SIDE = {
  Speak: <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 7 L2 7 M4.5 4.5 L4.5 9.5 M7 2 L7 12 M9.5 4.5 L9.5 9.5 M12 6 L12 8" /></g>,
  Design: <path d="M7 1 L8.2 5.5 L12.5 7 L8.2 8.5 L7 13 L5.8 8.5 L1.5 7 L5.8 5.5 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />,
  Clone: <g stroke="currentColor" strokeWidth="1.2" fill="none"><rect x="5" y="1.5" width="4" height="7" rx="2" /><path d="M3 7 Q3 11 7 11 Q11 11 11 7 M7 11 L7 13" /></g>,
  Library: <g stroke="currentColor" strokeWidth="1.2" fill="none"><rect x="2" y="2" width="2.5" height="10" /><rect x="5.5" y="2" width="2.5" height="10" /><rect x="9" y="3" width="2.5" height="9" transform="rotate(-12 10.25 7.5)" /></g>,
  Settings: <g stroke="currentColor" strokeWidth="1.2" fill="none"><circle cx="7" cy="7" r="2" /><path d="M7 1.5 L7 3 M7 11 L7 12.5 M1.5 7 L3 7 M11 7 L12.5 7 M3 3 L4 4 M10 10 L11 11 M3 11 L4 10 M10 4 L11 3" strokeLinecap="round" /></g>,
};

function StudioDemo({ accent }) {
  const { isMobile } = useBreakpoint();
  const [winRef, winSeen] = useInView({ threshold: 0.3 });
  const [tab, setTab] = React.useState('Speak');
  const [voice, setVoice] = React.useState(YOUR_VOICES[0]);
  const [style, setStyle] = React.useState('calm and warm');
  const [prompt, setPrompt] = React.useState('Hello world! PolyJuiceVoice is on-device text-to-speech for macOS, with voice cloning and voice design. Everything runs locally over Metal.');
  const [lang, setLang] = React.useState(0);
  const [gen, setGen] = React.useState(REDUCED ? 1 : 0); // 0..1 streamed
  const [streaming, setStreaming] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [playhead, setPlayhead] = React.useState(0);

  const speak = () => { setPlaying(false); setPlayhead(0); setGen(0); setStreaming(true); };

  // First Speak happens when the window scrolls into view; the clip plays once, then the screen settles.
  React.useEffect(() => { if (winSeen && !REDUCED) speak(); }, [winSeen]);

  React.useEffect(() => {
    if (!streaming) return undefined;
    const id = setInterval(() => setGen((g) => {
      if (g >= 1) { setStreaming(false); setPlaying(true); return 1; }
      return Math.min(1, g + 0.04);
    }), 60);
    return () => clearInterval(id);
  }, [streaming]);

  React.useEffect(() => {
    if (!playing) return undefined;
    let raf;
    const start = performance.now() - playhead * CLIP * 1000;
    const tick = () => {
      const t = (performance.now() - start) / (CLIP * 1000);
      if (t >= 1) { setPlayhead(1); setPlaying(false); return; }
      setPlayhead(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const bars = React.useMemo(() => speechBars(isMobile ? 64 : 110, voice.id.length), [voice, isMobile]);
  const isPreset = voice.type === 'preset';
  const skip = (d) => setPlayhead((p) => Math.max(0, Math.min(1, p + d / CLIP)));

  const chip = (active, color) => ({
    background: active ? (color === 'p' ? '#9333ea' : 'rgba(29,167,255,0.2)') : (color === 'p' ? 'rgba(168,85,247,0.12)' : '#222226'),
    border: `1px solid ${active ? (color === 'p' ? '#9333ea' : 'rgba(29,167,255,0.7)') : (color === 'p' ? 'rgba(168,85,247,0.45)' : 'rgba(255,255,255,0.1)')}`,
    color: '#fff', padding: '7px 14px', borderRadius: 999, font: `${active ? 500 : 400} 13px/1 var(--sans)`, cursor: 'pointer',
  });
  const ctl = { background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', width: isMobile ? 36 : 40, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <section id="speak" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="p-studio-pad">
        <div className="p-studio-hdr">
          <Reveal>
            <Mono>FIG_15 · POLYJUICEVOICE_APP</Mono>
            <h2 className="p-studio-h2">Four modes, one <span className="p-serif">quiet</span> window.</h2>
          </Reveal>
          <Reveal as="p" i={1} className="p-studio-hint">
            A working copy of the Speak tab. Pick a voice, edit the text, press Speak.
          </Reveal>
        </div>

        <Reveal className="p-app" i={1}>
          <div ref={winRef} style={{ background: '#0f0f10' }}>
            {/* Title bar */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: 8 }} aria-hidden="true">
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ marginLeft: 18, color: 'rgba(255,255,255,0.45)', display: 'flex' }} aria-hidden="true">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect x="0.5" y="0.5" width="17" height="13" rx="2" stroke="currentColor" /><line x1="6" y1="0" x2="6" y2="14" stroke="currentColor" /></svg>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <button title="Debug log" aria-label="Debug log" style={{ ...ctl, width: 32, height: 28 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><ellipse cx="7" cy="8" rx="3" ry="4" stroke="currentColor" strokeWidth="1.2" /><path d="M5 3.5 L4 2 M9 3.5 L10 2 M1.5 7 L4 7 M10 7 L12.5 7 M2 11 L4.2 10 M12 11 L9.8 10 M7 4 L7 12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
                </button>
                <button title="Models" aria-label="Models" style={{ ...ctl, width: 32, height: 28 }}>
                  <svg width="15" height="13" viewBox="0 0 16 13" fill="none" aria-hidden="true"><path d="M2 7 L4 2 H12 L14 7 V11 H2 Z M2 7 H14" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><circle cx="11.5" cy="9" r="0.8" fill="currentColor" /></svg>
                </button>
              </div>
            </div>

            <div className="p-app-body">
              {/* Sidebar */}
              <div className="p-app-side" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', padding: '12px 10px' }}>
                {Object.keys(SIDE).map((name) => {
                  const active = tab === name;
                  return (
                    <button key={name} className={active ? '' : 'p-side-btn'} onClick={() => setTab(name)} aria-pressed={active}
                      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 2, borderRadius: 6, background: active ? 'rgba(255,255,255,0.1)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.75)', border: 'none', font: '13px/1.2 var(--sans)', cursor: 'pointer' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ flexShrink: 0 }}>{SIDE[name]}</svg>
                      {name}
                    </button>
                  );
                })}
              </div>

              {/* Main */}
              <div style={{ display: 'flex', flexDirection: 'column', background: '#161618', minWidth: 0 }}>
                <div style={{ padding: isMobile ? '16px 16px 0' : '16px 28px 0', font: '600 17px/1.2 var(--sans)' }}>{tab}</div>
                <div style={{ padding: isMobile ? '16px' : '18px 28px 24px' }}>
                  <div style={{ font: '12px/1 var(--sans)', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Voice</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="p-dot" style={{ background: '#1da7ff', width: 6, height: 6 }} />
                    <span style={{ font: '600 11px/1 var(--mono)', letterSpacing: '0.12em', color: '#1da7ff' }}>PRESETS</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {PRESET_VOICES.map((v) => <button key={v.id} onClick={() => setVoice(v)} aria-pressed={voice.id === v.id} style={chip(voice.id === v.id, 'b')}>{v.label}</button>)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="p-dot" style={{ background: '#b77cf9', width: 6, height: 6 }} />
                    <span style={{ font: '600 11px/1 var(--mono)', letterSpacing: '0.12em', color: '#b77cf9' }}>YOUR VOICES</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {YOUR_VOICES.map((v) => <button key={v.id} onClick={() => setVoice(v)} aria-pressed={voice.id === v.id} style={chip(voice.id === v.id, 'p')}>{v.label}</button>)}
                  </div>

                  {isPreset && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ font: '12px/1 var(--sans)', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Style instruction</div>
                      <input aria-label="Style instruction" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="e.g. calm and warm"
                        style={{ width: '100%', background: '#0f0f10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', color: '#fff', font: '14px/1.3 var(--sans)', outline: 'none' }} />
                    </div>
                  )}

                  <div style={{ font: '12px/1 var(--sans)', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Text to speak</div>
                  <textarea aria-label="Text to speak" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={isMobile ? 5 : 3}
                    style={{ width: '100%', background: '#0f0f10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 14px', color: '#fff', font: '14px/1.55 var(--sans)', outline: 'none', resize: 'vertical' }} />

                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ font: '12px/1 var(--sans)', color: 'rgba(255,255,255,0.6)' }}>Language</div>
                    <button onClick={() => setLang((l) => (l + 1) % LANGS.length)} aria-label={`Language: ${LANGS[lang]}. Click to change.`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '7px 10px 7px 12px', borderRadius: 6, font: '13px/1 var(--sans)', cursor: 'pointer' }}>
                      {LANGS[lang]}
                      <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden="true"><path d="M2 4 L4.5 1.5 L7 4 M2 7 L4.5 9.5 L7 7" stroke="currentColor" strokeWidth="1.2" /></svg>
                    </button>
                  </div>

                  {/* Playback card */}
                  <div style={{ marginTop: 18, background: '#0f0f10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 14 }}>
                    <div style={{ height: isMobile ? 80 : 100, display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }} aria-hidden="true">
                      {bars.map((b, i) => {
                        const t = i / bars.length;
                        const made = t < gen;
                        const past = t <= playhead && gen >= 1;
                        return <div key={i} className="p-wave-bar" style={{ height: `${b * 100}%`, transform: made ? 'none' : 'scaleY(0.04)', background: past ? '#1da7ff' : '#2f6fa8' }} />;
                      })}
                      {gen >= 1 && <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${playhead * 100}%`, width: 1.5, background: '#fff' }} />}
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => skip(-10)} aria-label="Skip back 10 seconds" style={ctl}>
                        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M11 4 A7 7 0 1 1 4 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M4 4 L4 8 L8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                      </button>
                      <button onClick={() => { if (gen < 1) return; if (playhead >= 1) setPlayhead(0); setPlaying((p) => !p); }} aria-label={playing ? 'Pause' : 'Play'} style={ctl}>
                        {playing
                          ? <svg width="14" height="14" viewBox="0 0 22 22" aria-hidden="true"><rect x="6" y="4" width="3.5" height="14" fill="currentColor" /><rect x="12.5" y="4" width="3.5" height="14" fill="currentColor" /></svg>
                          : <svg width="14" height="14" viewBox="0 0 22 22" aria-hidden="true"><path d="M6 4 L17 11 L6 18 Z" fill="currentColor" /></svg>}
                      </button>
                      <button onClick={() => skip(10)} aria-label="Skip forward 10 seconds" style={ctl}>
                        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M11 4 A7 7 0 1 0 18 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M18 4 L18 8 L14 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                      </button>
                      <span style={{ marginLeft: 4, font: '12px/1 var(--sans)', color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        {streaming ? 'Speaking…' : `${formatTime(playhead * CLIP)} / ${formatTime(CLIP)}`}
                      </span>
                      <div style={{ flex: 1 }} />
                      <button aria-label="Export" style={{ ...ctl, width: 'auto', padding: isMobile ? '0 10px' : '0 12px', gap: 6, font: '13px/1 var(--sans)' }}>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 10 V2 M5 5 L8 2 L11 5 M3 9 V14 H13 V9" stroke="currentColor" strokeWidth="1.4" /></svg>
                        {!isMobile && 'Export'}
                      </button>
                    </div>
                  </div>

                  <button onClick={speak} className="p-speak" style={{ marginTop: 18, width: '100%', background: 'var(--speak)', color: '#fff', border: 'none', borderRadius: 10, minHeight: 48, font: '500 15px/1 var(--sans)', cursor: 'pointer' }}>
                    {streaming ? 'Speaking…' : 'Speak'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Caption row */}
        <div className="p-captions">
          {[
            ['VOICE', `${voice.label} · ${isPreset ? 'preset' : 'cloned'}`, isPreset ? 'Preset voices take a style instruction.' : 'Cloned voices keep their own character; style instructions apply to presets.'],
            ['MODEL', 'Qwen3-TTS · bf16 on Mac', 'Models download on first run. Pick a precision per model in Settings.'],
            ['PRIVACY', 'On-device · optional sync', 'Synthesis stays local. Opt-in iCloud sync uploads saved voice metadata, recordings and embeddings; export/share sends audio where you choose.'],
          ].map(([k, v, sub], i) => (
            <Reveal key={k} i={i}>
              <Mono dim>{k}</Mono>
              <div style={{ font: '15px/1.3 var(--sans)', color: '#fff', marginTop: 8 }}>{v}</div>
              <p className="p-body" style={{ marginTop: 6 }}>{sub}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== Specs ===================
function Specs() {
  return (
    <section id="models" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="p-specs-outer">
        <Reveal className="p-specs-left">
          <Mono>FIG_16</Mono>
          <h2 className="p-specs-h2">Specs.</h2>
          <p className="p-body" style={{ marginTop: 24, maxWidth: 320 }}>What you need to run PolyJuiceVoice, and what you get when you do.</p>
        </Reveal>
        <div className="p-specs-inner">
          <SpecBlock label="REQUIRES" rows={[['macOS', '26+ (primary)'], ['iOS', '26+ (device only)'], ['chip', 'Apple silicon'], ['Xcode', '26+ to build'], ['simulator', 'not supported']]} />
          <SpecBlock label="DELIVERS" accent rows={[['models', 'Qwen3-TTS 0.6B / 1.7B'], ['precisions', '4 · 5 · 6 · 8-bit · bf16'], ['inference', 'mlx-swift on Metal'], ['audio', '24 kHz mono WAV'], ['modes', 'speak · design · clone · library']]} />
        </div>
      </div>
    </section>
  );
}

function SpecBlock({ label, rows, accent }) {
  return (
    <div className="p-spec-block">
      <Mono style={accent ? { color: 'var(--accent)' } : undefined}>{label}</Mono>
      <dl style={{ margin: '20px 0 0' }}>
        {rows.map(([k, v], i) => <Reveal key={k} i={i} className="p-spec"><dt>{k}</dt><dd>{v}</dd></Reveal>)}
      </dl>
    </div>
  );
}

// =================== CTA ===================
function Cta() {
  return (
    <section className="p-cta">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Reveal><Mono>FIG_17 · BEGIN</Mono></Reveal>
        <Reveal as="h2" i={1} className="p-cta-h2">
          Speak in any <span className="p-serif">voice</span> without leaving your Mac.
        </Reveal>
        <Reveal i={2} className="p-cta-act">
          <a className="p-btn p-btn--lg" href={RELEASE}>Download PolyJuiceVoice <Arrow /></a>
          <Mono dim>8.5 MB · macOS 26+ · MIT licensed</Mono>
        </Reveal>
      </div>
    </section>
  );
}

// =================== Footer ===================
function Footer() {
  const cols = [
    ['Product', [['Download', RELEASE], ['Source code', REPO], ['Licence (MIT)', `${REPO}/blob/main/LICENSE`]]],
    ['Docs', [['Build and run', `${REPO}/blob/main/docs/BUILD_AND_RUN.md`], ['Privacy policy', `${REPO}/blob/main/docs/PRIVACY_POLICY.md`], ['Issues', `${REPO}/issues`]]],
    ['Team AER', [['aer.app', '/'], ['All apps', '/#projects'], ['hello@aer.app', 'mailto:hello@aer.app']]],
    ['Other apps', [['Cantis', '/cantis/'], ['Subtly', '/subtly/'], ['Quill', '/quill/']]],
  ];
  return (
    <footer className="p-footer">
      <div className="p-footer-grid">
        <Reveal className="p-footer-brand">
          <a className="p-brand" href="/polyjuicevoice/" style={{ minHeight: 0 }}><Logo /><span className="p-brand-name">PolyJuiceVoice</span></a>
          <p>On-device speech for the Mac. Made by Prakhar Shukla for Team AER.</p>
        </Reveal>
        {cols.map(([h, items], k) => (
          <Reveal key={h} i={k + 1}>
            <Mono dim>{h}</Mono>
            <div className="p-footer-col">{items.map(([it, href]) => <a key={it} className="p-flink" href={href}>{it}</a>)}</div>
          </Reveal>
        ))}
      </div>
      <div className="p-footer-base">
        <span>© 2026 Prakhar Shukla. PolyJuiceVoice is MIT licensed.</span>
        <span>No cookies, no analytics on this page.</span>
      </div>
    </footer>
  );
}

Object.assign(window, { TopNav, Hero, Marquee, FeatureGrid, StudioDemo, Specs, Cta, Footer });
