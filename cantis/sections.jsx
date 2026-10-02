// Cantis landing page sections — music-themed, with real-app-mirroring demo

// =================== Helpers ===================
const Mono = ({ children, dim, className = '', style = {} }) => (
  <span
    className={className}
    style={{
      fontFamily: 'ui-monospace, "JetBrains Mono", "Fira Code", monospace',
      fontSize: 11,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: dim ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)',
      ...style,
    }}
  >
    {children}
  </span>
);

const Arrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M4 12 L12 4 M5 4 L12 4 L12 11" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

// =================== Top Nav ===================
function TopNav({ accent }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', background: 'rgba(8,8,10,0.72)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="c-nav-inner">
        <a href="/cantis/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="0.5" y="0.5" width="21" height="21" rx="4" stroke="#fff" />
            <path d="M5 14 L8 14 L10 6 L12 16 L14 10 L17 10" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: 'Geist, ui-sans-serif, system-ui', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>Cantis</span>
          <Mono className="c-nav-meta" dim style={{ marginLeft: 6 }}>v1.0</Mono>
        </a>
        <nav className="c-nav-links">
          {[
            { label: 'Studio', href: '#studio' },
            { label: 'Models', href: '#models' },
            { label: 'Docs', href: 'https://github.com/Team-AER/Cantis/tree/main/docs' },
            { label: 'Changelog', href: 'https://github.com/Team-AER/Cantis/releases' },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{label}</a>
          ))}
        </nav>
        <a className="c-nav-github" href="https://github.com/Team-AER/Cantis" style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          GITHUB <Arrow size={12} />
        </a>
        <a className="c-nav-download" href="https://apps.apple.com/in/app/cantis/id6764599986?mt=12" target="_blank" rel="noopener" style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 13, fontWeight: 500, color: '#000', background: '#fff', borderRadius: 4, padding: '8px 14px', cursor: 'pointer', flexShrink: 0, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          Download for macOS
        </a>
      </div>
    </header>
  );
}

// =================== Hero ===================
function Hero({ accent }) {
  return (
    <section style={{ position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="c-hero-grid">
        <div className="c-hero-left">
          <Mono>FIG_00 · GENERATIVE_AUDIO</Mono>
          <h1 className="c-hero-h1" style={{ fontFamily: 'Geist, ui-sans-serif, system-ui' }}>
            Generate
            <br />
            music that
            <br />
            <span style={{ fontStyle: 'italic', fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}>actually</span> sounds
            <br />
            like yours.
          </h1>
          <p style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', margin: '40px 0 0', maxWidth: 360 }}>
            Cantis runs ACE-Step v1.5 natively on your Mac. Prompt a track, edit lyrics,
            tune the seed — everything stays on-device. No queue, no cloud, no upload.
          </p>
          <div className="c-hero-cta">
            <a href="https://apps.apple.com/in/app/cantis/id6764599986?mt=12" target="_blank" rel="noopener" style={{ color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: 4 }}>
              Download · 6.7 MB <Arrow size={12} />
            </a>
            <a href="https://github.com/Team-AER/Cantis/tree/main/docs" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Read the docs <Arrow size={12} />
            </a>
          </div>
        </div>
        <div className="c-hero-illus" style={{ position: 'relative', padding: '32px 32px 32px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: 24, left: 24 }}>
            <Mono dim>FIG_01 · NOW_PLAYING</Mono>
          </div>
          <IllusVinylHero accent={accent} />
          <div style={{ position: 'absolute', bottom: 24, right: 32 }}>
            <Mono dim>00:00 / 03:48 · 44.1 KHZ · STEREO</Mono>
          </div>
        </div>
      </div>
    </section>
  );
}

// =================== Marquee ===================
function Marquee() {
  const items = ['ACE-STEP v1.5', 'METAL ACCELERATED', '100% ON-DEVICE', 'OPEN SOURCE', 'LYRICS EDITING', 'STEM EXPORT', '44.1 KHZ STEREO', 'TEXT → MUSIC', 'AUDIO → AUDIO'];
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', padding: '20px 0' }}>
      <div style={{ display: 'flex', gap: 48, animation: 'cantis-marquee 40s linear infinite', whiteSpace: 'nowrap' }}>
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)' }}>
            {it} <span style={{ marginLeft: 48, color: 'rgba(255,255,255,0.15)' }}>♪</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// =================== Feature Grid ===================
function FeatureGrid({ accent }) {
  return (
    <section id="models" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Row 1 — Native to the metal */}
        <div className="c-fg-r1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="c-sep c-pad">
            <Mono>FIG_02</Mono>
            <h2 className="c-fg-h2" style={{ fontFamily: 'Geist, ui-sans-serif' }}>
              Native to<br />the metal.
            </h2>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', margin: '28px 0 0', maxWidth: 320 }}>
              Built in Swift, accelerated by MLX. A 4-minute track renders in under
              30 seconds on M2 Pro. No Python, no Docker, no GPU required.
            </p>
            <div style={{ marginTop: 56 }}>
              <a href="https://github.com/Team-AER/Cantis/blob/main/docs/ARCHITECTURE.md" style={{ color: '#fff', fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                How it is built <Arrow size={12} />
              </a>
            </div>
          </div>
          <div className="c-pad" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 24, left: 24 }}><Mono dim>SILICON_M1 / M2 / M3 / M4</Mono></div>
            <IllusChip accent={accent} />
          </div>
        </div>

        {/* Row 2 — three columns: Spectrum / Generation Modes / Tags & Lyrics */}
        <div className="c-fg-r2">
          <div className="c-sep c-pad" style={{ display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_03</Mono>
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <IllusEQ accent={accent} />
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>FFT analyzer & live waveform</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              Real-time playback with waveform visualization and FFT spectrum
              analysis. Watch low-end, mids, and air shape themselves bar by bar.
            </p>
          </div>

          <div className="c-sep c-pad" style={{ display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_04</Mono>
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <IllusSynth accent={accent} />
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Four ways to generate</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              text2music, cover, repaint, extract. Drop in reference audio for
              the last three; the model rewrites, restyles, or pulls a part out.
            </p>
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['text2music', 'cover', 'repaint', 'extract'].map((m) => (
                <span key={m} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, padding: '3px 8px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.05em' }}>{m}</span>
              ))}
            </div>
          </div>

          <div className="c-pad" style={{ display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_05</Mono>
            <div style={{ height: 220, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', margin: '24px 0 32px', flexDirection: 'column', gap: 14 }}>
              <div style={{ width: '100%', background: '#0c0c10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 14, fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                <div style={{ color: accent }}>[verse]</div>
                <div>City lights blur in the rain</div>
                <div style={{ color: accent, marginTop: 6 }}>[chorus]</div>
                <div>We were never going home</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>[bridge] · lang=en</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {[
                  { t: 'genre · synthwave', c: '#ff5b9c' },
                  { t: 'instr · arp', c: accent },
                  { t: 'mood · neon', c: '#7af0a8' },
                ].map((x) => (
                  <span key={x.t} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: x.c, border: `1px solid ${x.c}33`, letterSpacing: '0.04em' }}>{x.t}</span>
                ))}
              </div>
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Lyrics, tags, structure</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              Verse / chorus / bridge with ISO-639 language hints.
              Layer genre, instrument, and mood tags to steer the model.
            </p>
          </div>
        </div>

        {/* Row 3 — Model variants & DiT knobs */}
        <div className="c-fg-r3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="c-sep c-pad">
            <Mono>FIG_06</Mono>
            <h3 className="c-fg-h3-lg" style={{ fontFamily: 'Geist, ui-sans-serif', lineHeight: 1.1 }}>
              Three model variants.<br />Pick your tradeoff.
            </h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '20px 0 32px', maxWidth: 460 }}>
              Cantis ships three DiT variants downloaded on first launch from HuggingFace.
              Swap them per-render — fast iteration, polished final, or balanced base.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { name: 'Turbo', steps: '8-step', detail: 'CFG-distilled', accent: true },
                { name: 'SFT', steps: '60-step', detail: 'fine-tuned' },
                { name: 'Base', steps: '60-step', detail: 'foundation' },
              ].map((m) => (
                <div key={m.name} style={{ border: `1px solid ${m.accent ? accent : 'rgba(255,255,255,0.08)'}`, borderRadius: 6, padding: 16, background: m.accent ? `${accent}10` : 'transparent' }}>
                  <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 16, fontWeight: 500, color: '#fff' }}>{m.name}</div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: m.accent ? accent : 'rgba(255,255,255,0.55)', marginTop: 6, letterSpacing: '0.06em' }}>{m.steps}</div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.04em' }}>{m.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="c-pad">
            <Mono>FIG_07</Mono>
            <h3 className="c-fg-h3-lg" style={{ fontFamily: 'Geist, ui-sans-serif', lineHeight: 1.1 }}>
              DiT knobs<br />in plain sight.
            </h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '20px 0 24px' }}>
              Steps, schedule shift, and CFG scale — exposed where they matter.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                ['steps', '8 — 100', '60'],
                ['shift', '1.0 / 2.0 / 3.0', '1.0'],
                ['cfg scale', '1 — 20', '15.0'],
                ['variance', '0.0 — 1.0', '0.40'],
                ['seed', 'i32', '3506387122'],
              ].map(([k, range, def]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{k}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{range}</span>
                  <span style={{ color: accent }}>{def}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4 — Audio import / Presets+History / Export */}
        <div className="c-fg-r4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="c-sep c-pad" style={{ display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_08</Mono>
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <div style={{ width: '100%', height: '100%', border: `1.5px dashed ${accent}66`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, background: `${accent}06` }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 6 L16 22 M10 16 L16 22 L22 16 M6 26 L26 26" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: accent, letterSpacing: '0.1em' }}>DROP_REFERENCE_AUDIO</div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>WAV · M4A · MP3</div>
              </div>
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Drop a reference</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              Drag-and-drop source audio for cover, repaint, or extract modes —
              and the model takes it from there.
            </p>
          </div>

          <div className="c-sep c-pad" style={{ display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_09</Mono>
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <IllusCassette accent={accent} />
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Presets & history</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              Save reusable generation configs. Browse, search, and favorite past
              tracks — every render kept locally with its prompt and parameters.
            </p>
          </div>

          <div className="c-pad" style={{ display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_10</Mono>
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <IllusStems accent={accent} />
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Export to your DAW</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              WAV, AAC (.m4a), or ALAC (.m4a) via Apple's encoder. Drag the file
              straight into Logic, Ableton, or Reaper.
            </p>
          </div>
        </div>

        {/* Row 5 — Trust strip */}
        <div className="c-fg-r5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { fig: 'FIG_11', title: 'Sandboxed', body: 'App Sandbox enabled. No Python subprocess, no helper daemons. Cantis is a single signed Mac app.' },
            { fig: 'FIG_12', title: 'Pure Swift / MLX', body: 'On-device inference via mlx-swift. First launch fetches MLX-converted weights from HuggingFace; everything after is offline.' },
            { fig: 'FIG_13', title: 'Log viewer', body: 'A built-in log window for debugging and monitoring renders — no Console.app spelunking.' },
          ].map((it, i, arr) => (
            <div key={it.fig} className={i < arr.length - 1 ? 'c-sep c-pad' : 'c-pad'}>
              <Mono>{it.fig}</Mono>
              <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: '20px 0 0', color: '#fff' }}>{it.title}</h3>
              <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>{it.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// =================== Studio Demo (mirrors real app) ===================
const APP_PRESETS = [
  { id: 'neon', label: 'Neon Drive', sub: 'Retro electronic mo...', genre: 'synthwave', bpm: 124, key: 'F# min', dur: '3:48' },
  { id: 'lofi', label: 'Late Night Lofi', sub: 'Warm vinyl and mail...', genre: 'lo-fi', bpm: 78, key: 'A min', dur: '3:12' },
  { id: 'cine', label: 'Cinematic Lift', sub: 'Wide, emotional trail...', genre: 'orchestral', bpm: 96, key: 'D min', dur: '4:22' },
];

const RECENTS = [
  'synthwave track', 'synthwave track', 'chill lofi piano', 'chill lofi piano', 'chill lofi piano', 'chill lofi piano',
];

function StudioDemo({ accent }) {
  const [tab, setTab] = React.useState('Generate');
  const [preset, setPreset] = React.useState(APP_PRESETS[0]);
  const [prompt, setPrompt] = React.useState('cinematic orchestral build with deep percussion and hopeful climax');
  const [tags, setTags] = React.useState(['cinematic', 'orchestral', 'uplifting']);
  const [duration, setDuration] = React.useState(45);
  const [variance, setVariance] = React.useState(0.4);
  const [steps, setSteps] = React.useState(60);
  const [shift, setShift] = React.useState(1.0);
  const [cfg, setCfg] = React.useState(15);
  const [seed, setSeed] = React.useState('3506387122');
  const [generating, setGenerating] = React.useState(true);
  const [genStep, setGenStep] = React.useState(4);
  const [playing, setPlaying] = React.useState(false);
  const [playhead, setPlayhead] = React.useState(0);
  const [loop, setLoop] = React.useState(true);

  React.useEffect(() => {
    if (!generating) return;
    const id = setInterval(() => {
      setGenStep((s) => {
        if (s >= steps) { setGenerating(false); return steps; }
        return s + 1;
      });
    }, 80);
    return () => clearInterval(id);
  }, [generating, steps]);

  React.useEffect(() => {
    if (!playing) return;
    let raf;
    const start = performance.now() - playhead * 35000;
    const tick = () => {
      let t = ((performance.now() - start) / 35000);
      if (t >= 1) { if (loop) t = 0; else { setPlaying(false); t = 1; } }
      setPlayhead(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, loop]);

  const startGenerate = () => { setGenStep(0); setGenerating(true); setPlaying(false); setPlayhead(0); };
  const cancel = () => { setGenerating(false); };
  const removeTag = (t) => setTags((tt) => tt.filter((x) => x !== t));

  const bars = React.useMemo(() => {
    const seedNum = parseInt(seed.slice(-4), 10) || 1;
    return Array.from({ length: 110 }).map((_, i) => 0.15 + Math.abs(Math.sin(i * 0.32 + seedNum * 0.001) * 0.55 + Math.cos(i * 0.11 + seedNum * 0.002) * 0.4));
  }, [seed]);

  const progressFrac = genStep / steps;
  const minimapBars = bars.slice(0, 80);

  return (
    <section id="studio" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="c-studio-pad" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="c-studio-hdr">
          <div>
            <Mono>FIG_14 · CANTIS_APP</Mono>
            <h2 className="c-studio-h2" style={{ fontFamily: 'Geist, ui-sans-serif' }}>
              The studio,<br />
              in <span style={{ fontStyle: 'italic', fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}>one window</span>.
            </h2>
          </div>
          <div className="c-studio-hint" style={{ textAlign: 'right' }}>
            <Mono dim>TRY_BELOW · CLICK_ANYTHING</Mono>
          </div>
        </div>

        {/* App window — min-width + overflow-x:auto makes it scroll on narrow screens */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: 12 }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, background: '#1c1c1f', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.7)', minWidth: 860 }}>
            {/* Title bar */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#1c1c1f', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ marginLeft: 16, color: 'rgba(255,255,255,0.4)' }}>
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect x="0.5" y="0.5" width="17" height="13" rx="2" stroke="currentColor" /><line x1="6" y1="0" x2="6" y2="14" stroke="currentColor" /></svg>
              </div>
              <div style={{ flex: 1 }} />
            </div>

            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 360px', minHeight: 640, background: '#1c1c1f' }}>
              {/* Sidebar */}
              <div style={{ background: '#1c1c1f', borderRight: '1px solid rgba(255,255,255,0.04)', padding: '14px 12px' }}>
                <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', padding: '0 8px 8px', letterSpacing: '0.02em' }}>Workspace</div>
                {[
                  { name: 'Generate', icon: '✨' },
                  { name: 'History', icon: '⟲' },
                  { name: 'Audio to A...', icon: '♪' },
                  { name: 'Settings', icon: '⚙' },
                ].map((it) => {
                  const active = tab === it.name;
                  return (
                    <button
                      key={it.name}
                      onClick={() => setTab(it.name)}
                      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', marginBottom: 2, borderRadius: 6, background: active ? accent : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.75)', border: 'none', fontFamily: 'Geist, ui-sans-serif', fontSize: 13, cursor: 'pointer' }}
                    >
                      <span style={{ width: 14, fontSize: 12, opacity: active ? 1 : 0.6 }}>{it.icon}</span>
                      {it.name}
                    </button>
                  );
                })}

                <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', padding: '20px 8px 8px' }}>Presets</div>
                {APP_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p)}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 10px', marginBottom: 2, background: 'transparent', border: 'none', borderRadius: 6, color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}
                  >
                    <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 13 }}>{p.label}</div>
                    <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{p.sub}</div>
                  </button>
                ))}

                <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', padding: '20px 8px 8px' }}>Recent</div>
                {RECENTS.map((r, i) => (
                  <div key={i} style={{ padding: '6px 10px', fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    <div>{r}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>Apr 30, 2026 at {3 + (i % 4)}:0{i}…</div>
                  </div>
                ))}
              </div>

              {/* Center column */}
              <div style={{ display: 'flex', flexDirection: 'column', background: '#262629' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 17, fontWeight: 500 }}>{tab}</div>
                  <div style={{ flex: 1 }} />
                  {generating ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button onClick={cancel} style={{ background: '#e5484d', color: '#fff', border: 'none', borderRadius: 16, padding: '5px 12px', fontFamily: 'Geist, ui-sans-serif', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <svg width="9" height="9" viewBox="0 0 9 9"><rect width="9" height="9" rx="1" fill="#fff" /></svg>
                        Cancel
                      </button>
                      <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Step {genStep} / {steps}</div>
                      <div style={{ background: '#1f8a4a', color: '#fff', borderRadius: 16, padding: '5px 12px', fontFamily: 'Geist, ui-sans-serif', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7af0a8', boxShadow: '0 0 8px #7af0a8' }} />
                        Generating
                      </div>
                    </div>
                  ) : (
                    <button onClick={startGenerate} style={{ background: accent, color: '#fff', border: 'none', borderRadius: 16, padding: '6px 14px', fontFamily: 'Geist, ui-sans-serif', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                      Generate
                    </button>
                  )}
                </div>

                <div style={{ padding: '20px 24px', overflow: 'auto', flex: 1 }}>
                  <FieldLabel>Prompt</FieldLabel>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows="4" style={fieldStyle} />

                  <FieldLabel style={{ marginTop: 16 }}>Tags</FieldLabel>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input placeholder="Add genre, instrument, or mood" style={{ ...fieldStyle, padding: '8px 12px' }} />
                    <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', borderRadius: 6, padding: '0 16px', fontFamily: 'Geist, ui-sans-serif', fontSize: 12, cursor: 'not-allowed' }}>Add</button>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {tags.map((t) => (
                      <span key={t} style={chipStyle(accent, true)}>
                        {t}
                        <button onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', padding: '0 0 0 4px', fontSize: 11 }}>✕</button>
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['ambient', 'cinematic', 'lofi', 'electronic', 'jazz', 'piano', 'guitar', 'synth', 'uplifting'].map((s) => (
                      <button key={s} onClick={() => !tags.includes(s) && setTags([...tags, s])} style={chipStyle('transparent', false, tags.includes(s))}>{s}</button>
                    ))}
                  </div>

                  <FieldLabel style={{ marginTop: 16 }}>Lyrics</FieldLabel>
                  <textarea defaultValue={'[verse]\nInstrumental\n[chorus]\nInstrumental'} rows="6" style={{ ...fieldStyle, fontFamily: 'ui-monospace, monospace', fontSize: 12 }} />

                  <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FieldLabel>Parameters</FieldLabel>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontFamily: 'Geist, ui-sans-serif', fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>↺ Reset</button>
                  </div>
                  <ParamRow label="Mode">
                    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '6px 10px', fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
                      Text → Music <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)' }}>⌃⌄</span>
                    </div>
                  </ParamRow>
                  <ParamRow label="Duration" value={`${duration} sec`}>
                    <input type="range" min="15" max="240" value={duration} onChange={(e) => setDuration(+e.target.value)} style={{ ...rangeStyle, accentColor: accent }} />
                  </ParamRow>
                  <ParamRow label="Variance" value={variance.toFixed(2)}>
                    <input type="range" min="0" max="1" step="0.01" value={variance} onChange={(e) => setVariance(+e.target.value)} style={{ ...rangeStyle, accentColor: accent }} />
                  </ParamRow>
                  <ParamRow label="Steps" value={steps}>
                    <input type="range" min="10" max="100" value={steps} onChange={(e) => setSteps(+e.target.value)} style={{ ...rangeStyle, accentColor: accent }} />
                  </ParamRow>
                  <ParamRow label="Shift">
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1.0, 2.0, 3.0].map((v) => (
                        <button key={v} onClick={() => setShift(v)} style={{ background: shift === v ? accent : 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontFamily: 'Geist, ui-sans-serif', fontSize: 12, cursor: 'pointer' }}>{v.toFixed(1)}</button>
                      ))}
                    </div>
                  </ParamRow>
                  <ParamRow label="CFG scale" value={cfg.toFixed(2)}>
                    <input type="range" min="1" max="20" step="0.1" value={cfg} onChange={(e) => setCfg(+e.target.value)} style={{ ...rangeStyle, accentColor: accent }} />
                  </ParamRow>
                  <ParamRow label="Seed">
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input value={seed} onChange={(e) => setSeed(e.target.value)} style={{ ...fieldStyle, padding: '6px 10px', maxWidth: 200 }} />
                      <button onClick={() => setSeed(String(Math.floor(Math.random() * 4_000_000_000)))} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 14 }}>⟳</button>
                    </div>
                  </ParamRow>
                </div>
              </div>

              {/* Right player */}
              <div style={{ background: '#1c1c1f', borderLeft: '1px solid rgba(255,255,255,0.04)', padding: '20px 20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 14, fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>
                  synthwave track with pulsing bass arpeggios and gated snare
                </div>
                <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>Apr 30, 2026 at 3:22 AM</div>

                <div style={{ marginTop: 18, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressFrac * 100}%`, background: accent, transition: 'width 0.2s' }} />
                </div>

                <div style={{ marginTop: 16, background: '#262629', borderRadius: 6, padding: '12px 12px', height: 96, position: 'relative', display: 'flex', alignItems: 'center', gap: 1 }}>
                  {bars.map((b, i) => {
                    const visible = i / bars.length <= progressFrac;
                    const past = i / bars.length <= playhead;
                    return (
                      <div key={i} style={{ flex: 1, height: `${b * 80}%`, background: visible ? (past ? accent : 'rgba(255,255,255,0.55)') : 'rgba(255,255,255,0.08)', borderRadius: 0.5, transition: 'background 0.1s' }} />
                    );
                  })}
                  {progressFrac >= 1 && (
                    <div style={{ position: 'absolute', top: 8, bottom: 8, left: `calc(12px + ${playhead} * (100% - 24px))`, width: 1.5, background: '#fff' }} />
                  )}
                </div>

                <div style={{ marginTop: 8, background: '#262629', borderRadius: 6, padding: '10px 12px', height: 56, position: 'relative', display: 'flex', alignItems: 'center', gap: 1 }}>
                  {minimapBars.map((b, i) => (
                    <div key={i} style={{ flex: 1, height: `${b * 60}%`, background: 'rgba(255,255,255,0.18)', borderRadius: 0.5 }} />
                  ))}
                  <div style={{ position: 'absolute', top: 4, bottom: 4, left: '8%', width: '24%', border: `1px solid ${accent}`, borderRadius: 3, background: `${accent}20` }} />
                </div>

                <div style={{ marginTop: 10, borderTop: '1.5px dashed #7af0a8', opacity: 0.7 }} />

                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <button
                    onClick={() => progressFrac >= 1 && setPlaying((p) => !p)}
                    disabled={progressFrac < 1}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: progressFrac >= 1 ? '#fff' : 'rgba(255,255,255,0.1)', color: progressFrac >= 1 ? '#000' : 'rgba(255,255,255,0.3)', border: 'none', cursor: progressFrac >= 1 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {playing
                      ? <svg width="10" height="10" viewBox="0 0 10 10"><rect x="2" y="1" width="2" height="8" fill="currentColor" /><rect x="6" y="1" width="2" height="8" fill="currentColor" /></svg>
                      : <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 1 L9 5 L2 9 Z" fill="currentColor" /></svg>
                    }
                  </button>
                  <button style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }} title="Export">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2 L8 10 M5 7 L8 10 L11 7 M3 13 L13 13" stroke="currentColor" strokeWidth="1.4" /></svg>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
                    Loop
                    <button onClick={() => setLoop((l) => !l)} style={{ width: 30, height: 17, borderRadius: 9, background: loop ? accent : 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: 2, left: loop ? 15 : 2, width: 13, height: 13, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
                    </button>
                  </div>
                  <div style={{ flex: 1 }} />
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" style={{ color: 'rgba(255,255,255,0.55)' }}><path d="M1 4 L4 4 L7 1 L7 11 L4 8 L1 8 Z M9 3 Q11 6 9 9" stroke="currentColor" strokeWidth="1.2" /></svg>
                  <input type="range" min="0" max="100" defaultValue="80" style={{ width: 70, accentColor: accent }} />
                </div>

                <div style={{ marginTop: 10, fontFamily: 'Geist, ui-sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.45)', textAlign: 'right' }}>
                  {formatTime(playhead * 35)} / 00:35
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>
                  ON-DEVICE · NO DATA LEAVES YOUR MAC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FieldLabel = ({ children, style = {} }) => (
  <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 8, ...style }}>{children}</div>
);

const fieldStyle = {
  width: '100%',
  background: '#1c1c1f',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 6,
  padding: '10px 12px',
  color: '#fff',
  fontFamily: 'Geist, ui-sans-serif',
  fontSize: 13,
  outline: 'none',
  resize: 'vertical',
};

const rangeStyle = { width: '100%' };

const chipStyle = (accent, filled, dimmed) => ({
  background: filled ? '#3a3a3e' : 'transparent',
  color: dimmed ? 'rgba(255,255,255,0.35)' : '#fff',
  border: filled ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.12)',
  borderRadius: 6,
  padding: '4px 10px',
  fontFamily: 'Geist, ui-sans-serif',
  fontSize: 12,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
});

function ParamRow({ label, value, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 60px', alignItems: 'center', gap: 16, padding: '10px 0' }}>
      <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{label}</div>
      <div>{children}</div>
      <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', textAlign: 'right' }}>{value !== undefined ? value : ''}</div>
    </div>
  );
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

// =================== Specs ===================
function Specs({ accent }) {
  return (
    <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="c-specs-outer">
        <div className="c-specs-left">
          <Mono>FIG_15</Mono>
          <h2 className="c-specs-h2" style={{ fontFamily: 'Geist, ui-sans-serif' }}>Specs.</h2>
          <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '24px 0 0', maxWidth: 320 }}>
            What you need to run Cantis. What you get when you do.
          </p>
        </div>
        <div className="c-specs-inner">
          <SpecBlock label="REQUIRES" rows={[['macOS','26 or later'],['chip','Apple Silicon (M1+)'],['memory','16 GB recommended'],['storage','~6 GB for Turbo'],['internet','first model download']]} className="c-spec-sep" />
          <SpecBlock label="DELIVERS" accent={accent} rows={[['format','WAV · AAC · ALAC (.m4a)'],['samplerate','44.1 / 48 kHz'],['inference','mlx-swift'],['models','Turbo · SFT · Base'],['modes','text2music · cover · repaint · extract']]} />
        </div>
      </div>
    </section>
  );
}

function SpecBlock({ label, rows, accent, className = '' }) {
  return (
    <div className={`c-spec-block ${className}`}>
      <Mono style={{ color: accent || 'rgba(255,255,255,0.7)' }}>{label}</Mono>
      <table style={{ marginTop: 24, width: '100%', fontFamily: 'ui-monospace, monospace', fontSize: 13, borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '14px 0', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>{k}</td>
              <td style={{ padding: '14px 0', textAlign: 'right', color: '#fff' }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =================== CTA ===================
function Cta({ accent }) {
  return (
    <section className="c-cta" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <Mono>FIG_16 · BEGIN</Mono>
        <h2 className="c-cta-h2" style={{ fontFamily: 'Geist, ui-sans-serif' }}>
          Make a song<br />
          <span style={{ fontStyle: 'italic', fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}>before</span> your<br />
          coffee gets cold.
        </h2>
        <div style={{ marginTop: 56, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <a href="https://apps.apple.com/in/app/cantis/id6764599986?mt=12" target="_blank" rel="noopener" style={{ background: '#fff', color: '#000', fontFamily: 'Geist, ui-sans-serif', fontSize: 15, fontWeight: 500, padding: '14px 28px', borderRadius: 4, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            ⌘ Download Cantis · Apple Silicon
          </a>
          <Mono dim>6.7 MB · macOS 26+ · MIT-LICENSED</Mono>
        </div>
      </div>
    </section>
  );
}

// =================== Footer ===================
function Footer() {
  return (
    <footer className="c-footer">
      <div className="c-footer-grid">
        <div className="c-footer-brand">
          <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 14, color: '#fff', fontWeight: 500 }}>Cantis</div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8, lineHeight: 1.6 }}>
            Built by Team AER.<br />On-device music, end to end.
          </div>
        </div>
        {[
          ['Product', [['Download for macOS', 'https://apps.apple.com/in/app/cantis/id6764599986?mt=12'], ['Releases', 'https://github.com/Team-AER/Cantis/releases'], ['Source code', 'https://github.com/Team-AER/Cantis']]],
          ['Docs', [['Architecture', 'https://github.com/Team-AER/Cantis/blob/main/docs/ARCHITECTURE.md'], ['Development', 'https://github.com/Team-AER/Cantis/blob/main/docs/DEVELOPMENT.md'], ['Issues', 'https://github.com/Team-AER/Cantis/issues']]],
          ['Team AER', [['aer.app', '/'], ['All apps', '/#projects'], ['hello@aer.app', 'mailto:hello@aer.app']]],
          ['Other apps', [['PolyJuiceVoice', '/polyjuicevoice/'], ['Subtly', '/subtly/'], ['Erised', '/erised/']]],
        ].map(([h, items]) => (
          <div key={h}>
            <Mono dim>{h}</Mono>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(([it, href]) => (
                <a key={it} href={href} style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{it}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1280, margin: '48px auto 0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
        <span>© 2026 TEAM AER</span>
        <span>BUILT_IN_SF · MIT_LICENSE</span>
      </div>
    </footer>
  );
}

Object.assign(window, { TopNav, Hero, Marquee, FeatureGrid, StudioDemo, Specs, Cta, Footer });
