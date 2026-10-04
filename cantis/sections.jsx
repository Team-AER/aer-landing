// Cantis landing page sections. The studio mirrors the real app's Generate screen
// (apps/Cantis/Cantis/Views): sidebar Workspace/Presets/Recent, centre parameters, right player.

const APP_STORE = 'https://apps.apple.com/in/app/cantis/id6764599986?mt=12';
const REPO = 'https://github.com/Team-AER/Cantis';

// =================== Helpers ===================
const Mono = ({ children, dim, className = '', style }) => (
  <span className={`c-mono${dim ? ' dim' : ''} ${className}`.trim()} style={style}>{children}</span>
);

const Arrow = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M4 12 L12 4 M5 4 L12 4 L12 11" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const Logo = ({ accent }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <rect x="0.5" y="0.5" width="21" height="21" rx="4" stroke="#fff" />
    <path d="M5 14 L8 14 L10 6 L12 16 L14 10 L17 10" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

// =================== Top Nav ===================
function TopNav({ accent }) {
  return (
    <header className="c-nav">
      <div className="c-nav-inner">
        <a className="c-brand" href="/cantis/" aria-label="Cantis home">
          <Logo accent="#6b95ff" />
          <span className="c-brand-name">Cantis</span>
          <Mono dim className="c-nav-meta" style={{ marginLeft: 4 }}>v1.0</Mono>
        </a>
        <nav className="c-nav-links" aria-label="Cantis">
          {[
            { label: 'Features', href: '#models' },
            { label: 'Studio', href: '#studio' },
            { label: 'Specs', href: '#specs' },
            { label: 'Changelog', href: `${REPO}/releases` },
          ].map(({ label, href }) => (
            <a key={label} className="c-navlink" href={href}>{label}</a>
          ))}
        </nav>
        <a className="c-link c-nav-gh" href={REPO}>GitHub <Arrow /></a>
        <a className="c-btn" href={APP_STORE} target="_blank" rel="noopener"><span>Download<span className="c-long"> for macOS</span></span></a>
      </div>
      <div className="c-progress" aria-hidden="true" />
    </header>
  );
}

// =================== Hero ===================
// One orchestrated moment: Turbo renders in 8 steps, the arm drops, the record plays the 30 s clip.
const HERO_STEPS = 8;
const HERO_LEN = 30;

function Hero({ accent }) {
  const [ref, visible] = useInView({ once: false, threshold: 0.2 });
  const [phase, setPhase] = React.useState(REDUCED ? 'play' : 'idle');
  const [step, setStep] = React.useState(REDUCED ? HERO_STEPS : 0);
  const [t, setT] = React.useState(0);

  React.useEffect(() => {
    if (REDUCED || !visible || phase !== 'idle') return undefined;
    const id = setTimeout(() => setPhase('gen'), 500);
    return () => clearTimeout(id);
  }, [visible, phase]);

  React.useEffect(() => {
    if (phase !== 'gen') return undefined;
    if (step >= HERO_STEPS) {
      const done = setTimeout(() => setPhase('play'), 350);
      return () => clearTimeout(done);
    }
    const id = setTimeout(() => setStep((s) => s + 1), 260);
    return () => clearTimeout(id);
  }, [phase, step]);

  React.useEffect(() => {
    if (REDUCED || phase !== 'play' || !visible) return undefined;
    const id = setInterval(() => setT((x) => (x >= HERO_LEN ? 0 : x + 0.25)), 250);
    return () => clearInterval(id);
  }, [phase, visible]);

  const generating = phase === 'gen' || phase === 'idle';
  const p = generating ? step / HERO_STEPS : t / HERO_LEN;

  return (
    <section style={{ position: 'relative', borderBottom: '1px solid var(--line)' }}>
      <div className="c-hero-grid">
        <div className="c-hero-left">
          <Reveal i={0}><Mono>FIG_00 · GENERATIVE_AUDIO</Mono></Reveal>
          <Reveal as="h1" i={1} className="c-hero-h1">
            Generate<br />music that<br /><span className="c-serif">actually</span> sounds<br />like yours.
          </Reveal>
          <Reveal as="p" i={2} className="c-hero-lede">
            Cantis runs ACE-Step v1.5 natively on your Mac. Prompt a track, edit the lyrics,
            pin the seed. Everything stays on-device: no queue, no cloud, no upload.
          </Reveal>
          <Reveal i={3} className="c-hero-cta">
            <a className="c-btn" href={APP_STORE} target="_blank" rel="noopener">
              Get it on the Mac App Store <Arrow />
            </a>
            <a className="c-link" href={`${REPO}/tree/main/docs`} target="_blank" rel="noopener">Read the docs <Arrow /></a>
            <Mono dim className="c-hero-meta">macOS 26+ · Apple Silicon · ~6.6 GB model files · MIT</Mono>
          </Reveal>
        </div>
        <div ref={ref} className="c-hero-illus">
          <div className="c-hero-tag"><Mono dim>FIG_01 · NOW_PLAYING</Mono></div>
          <Fig style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <IllusVinylHero accent={accent} phase={phase} />
          </Fig>
          <div className="c-np" aria-live="off">
            <p className="c-np-title">Neon Drive · synthwave, pulsing bass arpeggios, gated snare</p>
            <div className="c-np-row">
              <span>
                <span className={`c-np-dot${generating ? ' is-busy' : ''}`} aria-hidden="true" />
                {generating ? `Generating · step ${step} / ${HERO_STEPS}` : (REDUCED ? 'Ready' : 'Playing')}
              </span>
              <span>{generating ? 'Turbo' : `${formatTime(REDUCED ? HERO_LEN : t)} / ${formatTime(HERO_LEN)}`}</span>
            </div>
            <div className="c-np-bar"><i style={{ '--p': REDUCED ? 1 : p, background: generating ? '#ffb547' : 'var(--accent)' }} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =================== Marquee ===================
function Marquee() {
  const items = ['ACE-STEP v1.5', 'MLX ON METAL', '100% ON-DEVICE', 'OPEN SOURCE · MIT', 'LYRICS + TAGS', 'TEXT → MUSIC', 'COVER · REPAINT · EXTRACT', '48 KHZ', 'WAV · AAC · ALAC'];
  return (
    <Fig className="c-marquee" aria-hidden="true">
      <div className="c-marquee-track">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i}>{it}<b>♪</b></span>
        ))}
      </div>
    </Fig>
  );
}

// =================== Feature Grid ===================
function FeatureCell({ i, fig, title, children, art, sep = true, artStyle }) {
  return (
    <Reveal i={i} className={`c-cell c-pad${sep ? ' c-sep' : ''}`}>
      <Mono>{fig}</Mono>
      <div className="c-figbox" style={artStyle}>{art}</div>
      <h3 className="c-h3">{title}</h3>
      <p className="c-body">{children}</p>
    </Reveal>
  );
}

function FeatureGrid({ accent }) {
  return (
    <section id="models" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="c-wrap">

        {/* Row 1: native */}
        <div className="c-row c-fg-r1">
          <Reveal className="c-sep c-pad">
            <Mono>FIG_02</Mono>
            <h2 className="c-fg-h2">Native to the metal.</h2>
            <p className="c-body" style={{ marginTop: 28, maxWidth: 360 }}>
              Built in Swift and accelerated by MLX on your Mac's GPU. No Python, no Docker,
              no server to babysit: one signed, sandboxed Mac app.
            </p>
            <div style={{ marginTop: 40 }}>
              <a className="c-link c-link--under" href={`${REPO}/blob/main/docs/ARCHITECTURE.md`}>How it is built <Arrow /></a>
            </div>
          </Reveal>
          <Reveal i={1} className="c-pad c-chip-cell">
            <Mono dim>APPLE SILICON · M1 AND LATER</Mono>
            <Fig style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><IllusChip accent={accent} /></Fig>
          </Reveal>
        </div>

        {/* Row 2: spectrum / modes / lyrics */}
        <div className="c-row c-row3">
          <FeatureCell i={0} fig="FIG_03" title="FFT analyser and live waveform" art={<Fig style={{ width: '100%' }}><IllusEQ accent={accent} /></Fig>}>
            Playback draws the waveform and an FFT spectrum as the track plays, so you
            can see the low end, mids and air move bar by bar.
          </FeatureCell>
          <FeatureCell i={1} fig="FIG_04" title="Four ways to generate" art={<IllusModes />}>
            text2music starts from words. Cover, repaint and extract start from your
            audio: restyle it, regenerate a section, or pull one part out.
          </FeatureCell>
          <FeatureCell i={2} sep={false} fig="FIG_05" title="Lyrics, tags, structure" art={
            <div style={{ width: '100%' }}>
              <div className="c-lyrics">
                <div className="t">[verse]</div><div>City lights blur in the rain</div>
                <div className="t" style={{ marginTop: 6 }}>[chorus]</div><div>We were never going home</div>
                <div style={{ color: 'var(--fg-4)', marginTop: 6 }}>[bridge] · lang=en</div>
              </div>
              <div className="c-tags">
                {[{ t: 'genre · synthwave', c: '#ff5b9c' }, { t: 'instr · arp', c: '#6b95ff' }, { t: 'mood · neon', c: '#7af0a8' }].map((x, k) => (
                  <Reveal as="span" key={x.t} i={k + 2} className="c-tag" style={{ color: x.c, border: `1px solid ${x.c}40` }}>{x.t}</Reveal>
                ))}
              </div>
            </div>
          }>
            Verse, chorus and bridge with an ISO-639 language hint. Layer genre,
            instrument and mood tags to steer the model.
          </FeatureCell>
        </div>

        {/* Row 3: variants + knobs */}
        <div className="c-row c-fg-r3">
          <Reveal className="c-sep c-pad">
            <Mono>FIG_06</Mono>
            <h3 className="c-fg-h3-lg">Three model variants. Pick your trade-off.</h3>
            <p className="c-body" style={{ margin: '20px 0 32px', maxWidth: 480 }}>
              The app downloads three DiT variants from Hugging Face. Swap them per render:
              Turbo for fast iteration, SFT and Base for the full 60-step pass.
            </p>
            <div className="c-variants">
              {[
                { name: 'Turbo', steps: '8 steps', detail: 'CFG-distilled', pick: true },
                { name: 'SFT', steps: '60 steps', detail: 'fine-tuned' },
                { name: 'Base', steps: '60 steps', detail: 'foundation' },
              ].map((m, k) => (
                <Reveal key={m.name} i={k + 1} className={`c-variant${m.pick ? ' is-pick' : ''}`}>
                  <b>{m.name}</b><span>{m.steps}</span><span>{m.detail}</span>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal i={1} className="c-pad">
            <Mono>FIG_07</Mono>
            <h3 className="c-fg-h3-lg">DiT knobs in plain sight.</h3>
            <p className="c-body" style={{ margin: '20px 0 20px' }}>
              Steps, schedule shift and CFG scale sit where you need them. Defaults below are for SFT.
            </p>
            <div className="c-knobs">
              {[
                ['steps', '1 – 100', '60'],
                ['shift', '1.0 / 2.0 / 3.0', '1.0'],
                ['cfg scale', '1 – 20', '15.0'],
                ['variance', '0.0 – 1.0', '0.50'],
                ['seed', 'random or fixed', '3506387122'],
              ].map(([k, range, def], n) => (
                <Reveal key={k} i={n + 2} className="c-knob"><span>{k}</span><span>{range}</span><span>{def}</span></Reveal>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Row 4: drop / history / export */}
        <div className="c-row c-row3">
          <FeatureCell i={0} fig="FIG_08" title="Drop a reference" artStyle={{ height: 200 }} art={
            <div className="c-drop">
              <svg className="c-drop-arrow" width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 6 L16 22 M10 16 L16 22 L22 16 M6 26 L26 26" stroke="#6b95ff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <b>Drop audio file here</b>
              <span>for cover · repaint · extract</span>
            </div>
          }>
            Drag source audio onto the Audio to Audio screen and pick a mode. The model
            restyles it, rewrites a section, or pulls a part out.
          </FeatureCell>
          <FeatureCell i={1} fig="FIG_09" title="Presets and history" artStyle={{ height: 200 }} art={<IllusHistory />}>
            Save generation settings as presets. Browse, search and favourite past
            tracks; every render is kept locally with its prompt and parameters.
          </FeatureCell>
          <FeatureCell i={2} sep={false} fig="FIG_10" title="Export to your DAW" artStyle={{ height: 200 }} art={<IllusExport accent={accent} />}>
            WAV, AAC (.m4a) or ALAC (.m4a) through Apple's encoder. Drag the file
            straight into Logic, Ableton or Reaper.
          </FeatureCell>
        </div>

        {/* Row 5: trust */}
        <div className="c-row c-row3 c-trust">
          {[
            { fig: 'FIG_11', title: 'Sandboxed', body: 'App Sandbox on. No Python subprocess, no helper daemons, nothing listening on a port.' },
            { fig: 'FIG_12', title: 'Pure Swift and MLX', body: 'Inference runs through mlx-swift. First launch fetches the MLX weights from Hugging Face; after that, generation is offline.' },
            { fig: 'FIG_13', title: 'Log viewer', body: 'A built-in log window for watching renders and debugging, without digging through Console.app.' },
          ].map((it, k, arr) => (
            <Reveal key={it.fig} i={k} className={`c-cell c-pad${k < arr.length - 1 ? ' c-sep' : ''}`}>
              <Mono>{it.fig}</Mono>
              <h3 className="c-h3" style={{ marginTop: 20 }}>{it.title}</h3>
              <p className="c-body">{it.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== Studio Demo (mirrors the real Generate screen) ===================
const APP_PRESETS = [
  { id: 'neon', label: 'Neon Drive', sub: 'Retro electronic', prompt: 'synthwave track with pulsing bass arpeggios and gated snare', tags: ['electronic', 'synth', 'driving'], dur: 45 },
  { id: 'lofi', label: 'Late Night Lofi', sub: 'Warm vinyl keys', prompt: 'chill lofi piano with warm vinyl crackle and soft brushed drums', tags: ['lofi', 'piano', 'intimate'], dur: 30 },
  { id: 'cine', label: 'Cinematic Lift', sub: 'Wide, emotional strings', prompt: 'cinematic orchestral build with deep percussion and hopeful climax', tags: ['cinematic', 'orchestral', 'uplifting'], dur: 60 },
];

const RECENTS = [
  ['Cinematic lift', 'Oct 2, 2026 at 9:41 PM'],
  ['Neon drive', 'Oct 2, 2026 at 9:12 PM'],
  ['Late night lofi', 'Oct 2, 2026 at 8:47 PM'],
  ['Synthwave sketch', 'Oct 1, 2026 at 11:05 PM'],
];

const SIDE_ICONS = {
  Generate: <path d="M3 13 L10 6 M9 3 L9.6 4.4 L11 5 L9.6 5.6 L9 7 L8.4 5.6 L7 5 L8.4 4.4 Z M12.5 8 L12.9 8.9 L13.8 9.3 L12.9 9.7 L12.5 10.6 L12.1 9.7 L11.2 9.3 L12.1 8.9 Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  History: <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"><path d="M2.5 8 A5.5 5.5 0 1 0 4.2 4" /><path d="M2 2.5 L2.5 5 L5 4.6" /><path d="M8 5 L8 8 L10 9.5" /></g>,
  'Audio to Audio': <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"><path d="M2 8 L2 8 M4 5.5 L4 10.5 M6 3.5 L6 12.5 M8 6 L8 10" /><path d="M11 8 L15 8 M13 6 L13 10" /></g>,
  Settings: <g stroke="currentColor" strokeWidth="1.2" fill="none"><circle cx="8" cy="8" r="2.2" /><path d="M8 1.8 L8 3.4 M8 12.6 L8 14.2 M1.8 8 L3.4 8 M12.6 8 L14.2 8 M3.6 3.6 L4.7 4.7 M11.3 11.3 L12.4 12.4 M3.6 12.4 L4.7 11.3 M11.3 4.7 L12.4 3.6" strokeLinecap="round" /></g>,
};

function StudioDemo({ accent }) {
  const { isMobile } = useBreakpoint();
  const [winRef, winSeen] = useInView({ threshold: 0.25 });
  const [tab, setTab] = React.useState('Generate');
  const [prompt, setPrompt] = React.useState(APP_PRESETS[2].prompt);
  const [tags, setTags] = React.useState(APP_PRESETS[2].tags);
  const [draft, setDraft] = React.useState('');
  const [duration, setDuration] = React.useState(60);
  const [variance, setVariance] = React.useState(0.5);
  const [steps, setSteps] = React.useState(60);
  const [shift, setShift] = React.useState(1.0);
  const [cfg, setCfg] = React.useState(15);
  const [seed, setSeed] = React.useState('3506387122');
  const [generating, setGenerating] = React.useState(false);
  const [genStep, setGenStep] = React.useState(REDUCED ? 60 : 0);
  const [playing, setPlaying] = React.useState(false);
  const [playhead, setPlayhead] = React.useState(0);
  const [loop, setLoop] = React.useState(true);
  const draftRef = React.useRef(null);

  // The first render starts when the window scrolls into view, then the screen settles on "ready".
  React.useEffect(() => { if (winSeen && !REDUCED) setGenerating(true); }, [winSeen]);

  React.useEffect(() => {
    if (!generating) return undefined;
    const id = setInterval(() => {
      setGenStep((s) => {
        if (s >= steps) { setGenerating(false); return steps; }
        return s + 1;
      });
    }, 70);
    return () => clearInterval(id);
  }, [generating, steps]);

  React.useEffect(() => {
    if (!playing) return undefined;
    let raf;
    const len = duration * 1000;
    const start = performance.now() - playhead * len;
    const tick = () => {
      let t = (performance.now() - start) / len;
      if (t >= 1) { if (loop) t = 0; else { setPlaying(false); setPlayhead(1); return; } }
      setPlayhead(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, loop, duration]);

  const startGenerate = () => { setGenStep(0); setGenerating(true); setPlaying(false); setPlayhead(0); };
  const cancel = () => setGenerating(false);
  const removeTag = (t) => setTags((tt) => tt.filter((x) => x !== t));
  const addTag = () => {
    const v = draft.trim().toLowerCase();
    if (!v) { draftRef.current && draftRef.current.focus(); return; }
    if (!tags.includes(v)) setTags([...tags, v]);
    setDraft('');
  };
  const applyPreset = (p) => { setPrompt(p.prompt); setTags(p.tags); setDuration(p.dur); startGenerate(); };

  const bars = React.useMemo(() => {
    const seedNum = parseInt(seed.slice(-4), 10) || 1;
    return Array.from({ length: isMobile ? 64 : 96 }).map((_, i) => 0.15 + Math.abs(Math.sin(i * 0.32 + seedNum * 0.001) * 0.55 + Math.cos(i * 0.11 + seedNum * 0.002) * 0.4));
  }, [seed, isMobile]);

  const progressFrac = Math.min(1, genStep / steps);
  const ready = progressFrac >= 1 && !generating;
  const paramCols = isMobile ? '84px 1fr 48px' : '110px 1fr 60px';

  return (
    <section id="studio" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="c-studio-pad">
        <div className="c-studio-hdr">
          <Reveal>
            <Mono>FIG_14 · CANTIS_APP</Mono>
            <h2 className="c-studio-h2">The studio, in <span className="c-serif">one window</span>.</h2>
          </Reveal>
          <Reveal as="p" i={1} className="c-studio-hint">
            A working copy of the Generate screen. Change the prompt, tags or steps, pick a preset, then press Generate.
          </Reveal>
        </div>

        <Reveal className="c-app" i={1}>
          <div ref={winRef}>
            {/* Title bar */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: 8 }} aria-hidden="true">
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ marginLeft: 16, color: 'rgba(255,255,255,0.4)', display: 'flex' }} aria-hidden="true">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect x="0.5" y="0.5" width="17" height="13" rx="2" stroke="currentColor" /><line x1="6" y1="0" x2="6" y2="14" stroke="currentColor" /></svg>
              </div>
              <span style={{ marginLeft: 'auto', font: '12px/1 var(--sans)', color: 'rgba(255,255,255,0.45)' }}>Cantis</span>
            </div>

            <div className="c-app-body">
              {/* Sidebar */}
              <div className="c-app-side" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', padding: '14px 12px' }}>
                <div style={{ font: '11px/1 var(--sans)', color: 'rgba(255,255,255,0.5)', padding: '0 8px 8px' }}>Workspace</div>
                {Object.keys(SIDE_ICONS).map((name) => {
                  const active = tab === name;
                  return (
                    <button key={name} className={active ? '' : 'c-side-btn'} onClick={() => setTab(name)}
                      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', marginBottom: 2, borderRadius: 6, background: active ? accent : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.78)', border: 'none', font: '13px/1.2 var(--sans)', cursor: 'pointer' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{SIDE_ICONS[name]}</svg>
                      {name}
                    </button>
                  );
                })}

                <div style={{ font: '11px/1 var(--sans)', color: 'rgba(255,255,255,0.5)', padding: '20px 8px 8px' }}>Presets</div>
                {APP_PRESETS.map((p) => (
                  <button key={p.id} className="c-side-btn" onClick={() => applyPreset(p)}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 10px', marginBottom: 2, background: 'transparent', border: 'none', borderRadius: 6, color: 'rgba(255,255,255,0.88)', cursor: 'pointer' }}>
                    <div style={{ font: '13px/1.2 var(--sans)' }}>{p.label}</div>
                    <div style={{ font: '11px/1.2 var(--sans)', color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{p.sub}</div>
                  </button>
                ))}

                <div className="c-app-recent">
                  <div style={{ font: '11px/1 var(--sans)', color: 'rgba(255,255,255,0.5)', padding: '20px 8px 8px' }}>Recent</div>
                  {RECENTS.map(([r, d]) => (
                    <div key={r} style={{ padding: '6px 10px', font: '12px/1.3 var(--sans)', color: 'rgba(255,255,255,0.78)' }}>
                      <div>{r}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Centre */}
              <div style={{ display: 'flex', flexDirection: 'column', background: '#262629', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: isMobile ? '12px 16px' : '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: 56 }}>
                  <div style={{ font: '500 17px/1 var(--sans)' }}>{tab}</div>
                  <div style={{ flex: 1 }} />
                  {generating ? (
                    <React.Fragment>
                      <button onClick={cancel} style={{ background: '#e5484d', color: '#fff', border: 'none', borderRadius: 16, padding: '7px 12px', font: '500 12px/1 var(--sans)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><rect width="9" height="9" rx="1" fill="#fff" /></svg>
                        Cancel
                      </button>
                      <div style={{ font: '12px/1 var(--sans)', color: 'rgba(255,255,255,0.7)', fontVariantNumeric: 'tabular-nums' }}>Step {genStep} / {steps}</div>
                    </React.Fragment>
                  ) : (
                    <button onClick={startGenerate} style={{ background: accent, color: '#fff', border: 'none', borderRadius: 16, padding: '8px 16px', font: '500 12px/1 var(--sans)', cursor: 'pointer' }}>
                      Generate
                    </button>
                  )}
                </div>

                <div style={{ padding: isMobile ? '18px 16px 22px' : '20px 24px' }}>
                  <FieldLabel>Prompt</FieldLabel>
                  <textarea aria-label="Prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={isMobile ? 3 : 4} style={fieldStyle} />

                  <FieldLabel style={{ marginTop: 16 }}>Tags</FieldLabel>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input ref={draftRef} aria-label="Add a tag" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addTag(); }}
                      placeholder="Add genre, instrument, or mood" style={{ ...fieldStyle, padding: '8px 12px', minWidth: 0 }} />
                    <button onClick={addTag} className="c-chipbtn" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 6, padding: '0 16px', font: '12px/1 var(--sans)', cursor: 'pointer' }}>Add</button>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {tags.map((t) => (
                      <span key={t} style={chipStyle(true)}>
                        {t}
                        <button onClick={() => removeTag(t)} aria-label={`Remove ${t}`} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '0 0 0 4px', fontSize: 11 }}>✕</button>
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['ambient', 'cinematic', 'lofi', 'electronic', 'jazz', 'piano', 'guitar', 'synth', 'uplifting'].filter((s) => !tags.includes(s)).slice(0, isMobile ? 6 : 9).map((s) => (
                      <button key={s} className="c-chipbtn" onClick={() => setTags([...tags, s])} style={chipStyle(false)}>+ {s}</button>
                    ))}
                  </div>

                  <div className="c-app-lyrics">
                    <FieldLabel style={{ marginTop: 16 }}>Lyrics</FieldLabel>
                    <textarea aria-label="Lyrics" defaultValue={'[verse]\nInstrumental\n[chorus]\nInstrumental'} rows="5" style={{ ...fieldStyle, fontFamily: 'var(--mono)', fontSize: 12 }} />
                  </div>

                  <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FieldLabel style={{ marginBottom: 0 }}>Parameters</FieldLabel>
                    <button onClick={() => { setDuration(30); setVariance(0.5); setSteps(60); setShift(1); setCfg(15); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', font: '12px/1 var(--sans)', cursor: 'pointer', padding: '8px 0' }}>↺ Reset</button>
                  </div>
                  <ParamRow cols={paramCols} label="Mode">
                    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '6px 10px', font: '12px/1.2 var(--sans)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8, maxWidth: '100%' }}>
                      Text → Music <span style={{ color: 'rgba(255,255,255,0.5)' }} aria-hidden="true">⌃⌄</span>
                    </div>
                  </ParamRow>
                  <ParamRow cols={paramCols} label="Duration" value={`${duration} sec`}>
                    <input aria-label="Duration" type="range" min="10" max="600" value={duration} onChange={(e) => setDuration(+e.target.value)} style={{ width: '100%', accentColor: accent }} />
                  </ParamRow>
                  <ParamRow cols={paramCols} label="Variance" value={variance.toFixed(2)}>
                    <input aria-label="Variance" type="range" min="0" max="1" step="0.01" value={variance} onChange={(e) => setVariance(+e.target.value)} style={{ width: '100%', accentColor: accent }} />
                  </ParamRow>
                  <ParamRow cols={paramCols} label="Steps" value={steps}>
                    <input aria-label="Steps" type="range" min="1" max="100" value={steps} onChange={(e) => setSteps(+e.target.value)} style={{ width: '100%', accentColor: accent }} />
                  </ParamRow>
                  <ParamRow cols={paramCols} label="Shift">
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1.0, 2.0, 3.0].map((v) => (
                        <button key={v} onClick={() => setShift(v)} aria-pressed={shift === v} style={{ background: shift === v ? accent : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 10px', font: '12px/1 var(--sans)', cursor: 'pointer' }}>{v.toFixed(1)}</button>
                      ))}
                    </div>
                  </ParamRow>
                  <ParamRow cols={paramCols} label="CFG scale" value={cfg.toFixed(1)}>
                    <input aria-label="CFG scale" type="range" min="1" max="20" step="0.1" value={cfg} onChange={(e) => setCfg(+e.target.value)} style={{ width: '100%', accentColor: accent }} />
                  </ParamRow>
                  <ParamRow cols={paramCols} label="Seed">
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input aria-label="Seed" value={seed} onChange={(e) => setSeed(e.target.value.replace(/\D/g, '').slice(0, 10))} style={{ ...fieldStyle, padding: '6px 10px', maxWidth: 160, minWidth: 0, fontVariantNumeric: 'tabular-nums' }} />
                      <button onClick={() => setSeed(String(Math.floor(Math.random() * 4_000_000_000)))} aria-label="New random seed" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 15, width: 32, height: 32 }}>⟳</button>
                    </div>
                  </ParamRow>
                </div>
              </div>

              {/* Player */}
              <div className="c-app-player" style={{ background: '#1c1c1f', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: isMobile ? '18px 16px' : 20, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ font: '500 14px/1.4 var(--sans)', color: '#fff', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prompt || 'Untitled'}</div>
                <div style={{ font: '11px/1 var(--sans)', color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>{ready ? 'Oct 2, 2026 at 9:41 PM' : 'Rendering on this Mac…'}</div>

                <div style={{ marginTop: 16, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '100%', background: accent, transformOrigin: '0 50%', transform: `scaleX(${progressFrac})`, transition: 'transform 0.2s linear' }} />
                </div>

                <div style={{ marginTop: 14, background: '#262629', borderRadius: 6, padding: '12px', height: 96, position: 'relative', display: 'flex', alignItems: 'center', gap: 1 }} aria-hidden="true">
                  {bars.map((b, i) => {
                    const done = i / bars.length < progressFrac;
                    const past = ready && i / bars.length <= playhead;
                    return (
                      <div key={i} className="c-wave-bar" style={{ height: `${b * 80}%`, transform: done ? 'none' : 'scaleY(0.12)', background: done ? (past ? accent : 'rgba(255,255,255,0.6)') : 'rgba(255,255,255,0.14)' }} />
                    );
                  })}
                  {ready && (
                    <div style={{ position: 'absolute', top: 8, bottom: 8, left: `calc(12px + ${playhead} * (100% - 24px))`, width: 1.5, background: '#fff' }} />
                  )}
                </div>

                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ position: 'relative', display: 'inline-flex' }}>
                    {!ready && <span className="c-play-ring" style={{ '--p': progressFrac }} aria-hidden="true" />}
                    <button onClick={() => ready && setPlaying((p) => !p)} aria-label={playing ? 'Pause' : ready ? 'Play' : 'Play (available when the render finishes)'}
                      style={{ width: 34, height: 34, borderRadius: '50%', background: ready ? '#fff' : '#2c2c30', color: ready ? '#000' : 'rgba(255,255,255,0.7)', border: 'none', cursor: ready ? 'pointer' : 'progress', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {playing
                        ? <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect x="2" y="1" width="2" height="8" fill="currentColor" /><rect x="6" y="1" width="2" height="8" fill="currentColor" /></svg>
                        : <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1 L9 5 L2 9 Z" fill="currentColor" /></svg>}
                    </button>
                  </span>
                  <button aria-label="Export" title="Export" style={{ background: 'transparent', color: 'rgba(255,255,255,0.75)', border: 'none', cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2 L8 10 M5 7 L8 10 L11 7 M3 13 L13 13" stroke="currentColor" strokeWidth="1.4" /></svg>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '12px/1 var(--sans)', color: 'rgba(255,255,255,0.7)' }}>
                    Loop
                    <button role="switch" aria-checked={loop} aria-label="Loop" onClick={() => setLoop((l) => !l)} style={{ width: 30, height: 18, borderRadius: 9, background: loop ? accent : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', position: 'relative', padding: 0 }}>
                      <span style={{ position: 'absolute', top: 2, left: 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transform: `translateX(${loop ? 12 : 0}px)`, transition: 'transform 0.15s' }} />
                    </button>
                  </div>
                  <div style={{ flex: 1 }} />
                  <span style={{ font: '11px/1 var(--sans)', color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(playhead * duration)} / {formatTime(duration)}
                  </span>
                </div>

                <div style={{ flex: 1 }} />
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', font: '11px/1.4 var(--mono)', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
                  ON-DEVICE · NOTHING LEAVES YOUR MAC
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const FieldLabel = ({ children, style = {} }) => (
  <div style={{ font: '12px/1.2 var(--sans)', color: 'rgba(255,255,255,0.6)', marginBottom: 8, ...style }}>{children}</div>
);

const fieldStyle = {
  width: '100%', background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '10px 12px',
  color: '#fff', fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.45, outline: 'none', resize: 'vertical',
};

const chipStyle = (filled) => ({
  background: filled ? '#3a3a3e' : 'transparent', color: filled ? '#fff' : 'rgba(255,255,255,0.7)',
  border: filled ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.14)', borderRadius: 6,
  padding: '5px 10px', font: '12px/1.2 var(--sans)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
});

function ParamRow({ label, value, children, cols }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', gap: 12, padding: '9px 0' }}>
      <div style={{ font: '12px/1.2 var(--sans)', color: 'rgba(255,255,255,0.75)' }}>{label}</div>
      <div style={{ minWidth: 0 }}>{children}</div>
      <div style={{ font: '12px/1.2 var(--sans)', color: 'rgba(255,255,255,0.6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{value !== undefined ? value : ''}</div>
    </div>
  );
}

// =================== Specs ===================
function Specs() {
  return (
    <section id="specs" style={{ borderBottom: '1px solid var(--line)' }}>
      <div className="c-specs-outer">
        <Reveal className="c-specs-left">
          <Mono>FIG_15</Mono>
          <h2 className="c-specs-h2">Specs.</h2>
          <p className="c-body" style={{ marginTop: 24, maxWidth: 320 }}>What you need to run Cantis, and what you get when you do.</p>
        </Reveal>
        <div className="c-specs-inner">
          <SpecBlock label="REQUIRES" rows={[['macOS', '26 or later'], ['chip', 'Apple Silicon (M1+)'], ['memory', '16 GB recommended'], ['storage', '~6.6 GB for Turbo'], ['internet', 'first model download']]} />
          <SpecBlock label="DELIVERS" accent rows={[['format', 'WAV · AAC · ALAC'], ['sample rate', '48 kHz'], ['inference', 'mlx-swift'], ['models', 'Turbo · SFT · Base'], ['modes', 'text2music · cover · repaint · extract']]} />
        </div>
      </div>
    </section>
  );
}

function SpecBlock({ label, rows, accent }) {
  return (
    <div className="c-spec-block">
      <Mono style={accent ? { color: 'var(--accent-ink)' } : undefined}>{label}</Mono>
      <dl style={{ margin: '20px 0 0' }}>
        {rows.map(([k, v], i) => (
          <Reveal key={k} i={i} className="c-spec"><dt>{k}</dt><dd>{v}</dd></Reveal>
        ))}
      </dl>
    </div>
  );
}

// =================== CTA ===================
function Cta() {
  return (
    <section className="c-cta">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Reveal><Mono>FIG_16 · BEGIN</Mono></Reveal>
        <Reveal as="h2" i={1} className="c-cta-h2">
          Make a song <span className="c-serif">before</span> your coffee gets cold.
        </Reveal>
        <Reveal i={2} className="c-cta-act">
          <a className="c-btn c-btn--lg" href={APP_STORE} target="_blank" rel="noopener">
            Get Cantis on the Mac App Store <Arrow />
          </a>
          <Mono dim>macOS 26+ · ~6.6 GB Turbo model files · MIT licensed</Mono>
        </Reveal>
      </div>
    </section>
  );
}

// =================== Footer ===================
function Footer() {
  const cols = [
    ['Product', [['Mac App Store', APP_STORE], ['Releases', `${REPO}/releases`], ['Source code', REPO]]],
    ['Docs', [['Architecture', `${REPO}/blob/main/docs/ARCHITECTURE.md`], ['Development', `${REPO}/blob/main/docs/DEVELOPMENT.md`], ['Issues', `${REPO}/issues`]]],
    ['Team AER', [['aer.app', '/'], ['All apps', '/#projects'], ['hello@aer.app', 'mailto:hello@aer.app']]],
    ['Other apps', [['PolyJuiceVoice', '/polyjuicevoice/'], ['Subtly', '/subtly/'], ['Erised', '/erised/']]],
  ];
  return (
    <footer className="c-footer">
      <div className="c-footer-grid">
        <Reveal className="c-footer-brand">
          <a className="c-brand" href="/cantis/" style={{ minHeight: 0 }}><Logo accent="#6b95ff" /><span className="c-brand-name">Cantis</span></a>
          <p>On-device music for the Mac. Made by Prakhar Shukla for Team AER.</p>
        </Reveal>
        {cols.map(([h, items], k) => (
          <Reveal key={h} i={k + 1}>
            <Mono dim>{h}</Mono>
            <div className="c-footer-col">
              {items.map(([it, href]) => <a key={it} className="c-flink" href={href}>{it}</a>)}
            </div>
          </Reveal>
        ))}
      </div>
      <div className="c-footer-base">
        <span>© 2026 Prakhar Shukla and contributors. Cantis is MIT licensed.</span>
        <span>No cookies, no analytics on this page.</span>
      </div>
    </footer>
  );
}

Object.assign(window, { TopNav, Hero, Marquee, FeatureGrid, StudioDemo, Specs, Cta, Footer });
