// PolyJuiceVoice landing page sections — voice/TTS-themed, mirrors the real app

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

// =================== Responsive Hook ===================
function useBreakpoint() {
  const [w, setW] = React.useState(() => window.innerWidth);
  React.useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return { isMobile: w < 768, isTablet: w < 1024, width: w };
}

// =================== Top Nav ===================
function TopNav({ accent }) {
  const [open, setOpen] = React.useState(false);
  const { isMobile } = useBreakpoint();
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', background: 'rgba(8,8,10,0.72)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '12px 20px' : '14px 32px', display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 32 }}>
        <a href="/polyjuicevoice/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="0.5" y="0.5" width="21" height="21" rx="4" stroke="#fff" />
            {/* mirrored speech wave glyph */}
            <path d="M5 11 L7 11 L7 8 L9 8 L9 14 L11 14 L11 5 L13 5 L13 17 L15 17 L15 9 L17 9" stroke={accent} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: 'Geist, ui-sans-serif, system-ui', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>PolyJuiceVoice</span>
          {!isMobile && <Mono dim style={{ marginLeft: 6 }}>v1.0</Mono>}
        </a>

        {!isMobile && (
          <nav style={{ display: 'flex', gap: 24, marginLeft: 'auto' }}>
            {[
              { label: 'Speak',  href: '#speak' },
              { label: 'Voices', href: '#voices' },
              { label: 'Models', href: '#models' },
              { label: 'Docs',   href: 'https://github.com/Team-AER/PolyJuiceVoice/tree/main/docs' },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{label}</a>
            ))}
          </nav>
        )}
        {!isMobile && (
          <React.Fragment>
            <a href="https://github.com/Team-AER/PolyJuiceVoice" style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              GITHUB <Arrow size={12} />
            </a>
            <a href="https://github.com/Team-AER/PolyJuiceVoice/releases/latest" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center',  fontFamily: 'Geist, ui-sans-serif', fontSize: 13, fontWeight: 500, color: '#000', background: '#fff', border: 'none', borderRadius: 4, padding: '8px 14px', cursor: 'pointer' }}>
              Download for macOS
            </a>
          </React.Fragment>
        )}

        {isMobile && (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <line x1="4" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="4" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}
      </div>

      {isMobile && open && (
        <nav style={{ background: 'rgba(8,8,10,0.98)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '8px 20px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { label: 'Speak',  href: '#speak' },
            { label: 'Voices', href: '#voices' },
            { label: 'Models', href: '#models' },
            { label: 'Docs',   href: 'https://github.com/Team-AER/PolyJuiceVoice/tree/main/docs' },
          ].map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setOpen(false)} style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px 8px', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{label}</a>
          ))}
          <a href="https://github.com/Team-AER/PolyJuiceVoice" onClick={() => setOpen(false)} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '10px 8px' }}>
            GITHUB <Arrow size={12} />
          </a>
          <div style={{ paddingTop: 8 }}>
            <a href="https://github.com/Team-AER/PolyJuiceVoice/releases/latest" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center',  fontFamily: 'Geist, ui-sans-serif', fontSize: 14, fontWeight: 500, color: '#000', background: '#fff', border: 'none', borderRadius: 4, padding: '10px 14px', cursor: 'pointer', width: '100%' }}>
              Download for macOS
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

// =================== Hero ===================
function Hero({ accent }) {
  const { isMobile } = useBreakpoint();
  return (
    <section style={{ position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', minHeight: isMobile ? 'auto' : 620 }}>
        <div style={{ padding: isMobile ? '48px 24px 44px' : '88px 56px 56px', borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
          <Mono>FIG_00 · ON_DEVICE_TTS</Mono>
          <h1 style={{ fontFamily: 'Geist, ui-sans-serif, system-ui', fontSize: isMobile ? 52 : 76, lineHeight: 0.96, letterSpacing: '-0.035em', fontWeight: 500, margin: '32px 0 0', color: '#fff' }}>
            Any voice
            <br />
            you can
            <br />
            <span style={{ fontStyle: 'italic', fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}>describe</span>, clone,
            <br />
            or imagine.
          </h1>
          <p style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', margin: '36px 0 0', maxWidth: 360 }}>
            PolyJuiceVoice runs Qwen3-TTS natively on your Mac. Speak text in
            preset voices, design new ones from a description, or clone yours
            from a few seconds of audio — all on Metal, none of it leaves the device.
          </p>
          <div style={{ marginTop: isMobile ? 36 : 'auto', paddingTop: isMobile ? 0 : 56, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <a href="https://github.com/Team-AER/PolyJuiceVoice/releases/latest" style={{ color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: 4 }}>
              Download · 8.5 MB <Arrow size={12} />
            </a>
            <a href="https://github.com/Team-AER/PolyJuiceVoice/tree/main/docs" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Read the docs <Arrow size={12} />
            </a>
          </div>
        </div>
        <div style={{ position: 'relative', padding: isMobile ? '28px 24px' : '32px 32px 32px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? 240 : 'auto' }}>
          {!isMobile && (
            <div style={{ position: 'absolute', top: 24, left: 24 }}>
              <Mono dim>FIG_01 · NOW_SPEAKING</Mono>
            </div>
          )}
          <IllusMicHero accent={accent} />
          {!isMobile && (
            <div style={{ position: 'absolute', bottom: 24, right: 32 }}>
              <Mono dim>00:02 / 00:08 · 24 KHZ · MONO</Mono>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// =================== Marquee ===================
function Marquee() {
  const items = ['QWEN3-TTS', 'METAL ACCELERATED', '100% ON-DEVICE', 'OPEN SOURCE', 'VOICE CLONING', 'VOICE DESIGN', 'macOS · iOS', 'Q4 → bf16', 'STYLE INSTRUCTIONS', 'PRESET VOICES'];
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', padding: '20px 0' }}>
      <div style={{ display: 'flex', gap: 48, animation: 'cantis-marquee 40s linear infinite', whiteSpace: 'nowrap' }}>
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)' }}>
            {it} <span style={{ marginLeft: 48, color: 'rgba(255,255,255,0.15)' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// =================== Feature Grid ===================
function FeatureGrid({ accent }) {
  const { isMobile, isTablet } = useBreakpoint();
  const P = isMobile ? '28px 20px' : 48;
  const col2 = isMobile ? '1fr' : '1fr 1fr';
  const col3 = isMobile ? '1fr' : (isTablet ? '1fr 1fr' : '1fr 1fr 1fr');
  const br = isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)';

  return (
    <section id="voices" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Row 1 — Native to the metal */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.6fr', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: P, borderRight: br }}>
            <Mono>FIG_02</Mono>
            <h2 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: isMobile ? 32 : 44, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 500, margin: '32px 0 0', color: '#fff' }}>
              Native to<br />the metal.
            </h2>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', margin: '28px 0 0', maxWidth: 320 }}>
              Built in Swift, accelerated by MLX. Real-time speech on M-series silicon.
              No Python, no Docker, no GPU required — and the iOS Simulator
              is not invited (Metal hardware only).
            </p>
            <div style={{ marginTop: isMobile ? 28 : 56 }}>
              <a href="https://github.com/Team-AER/PolyJuiceVoice/blob/main/docs/BUILD_AND_RUN.md" style={{ color: '#fff', fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Build and run <Arrow size={12} />
              </a>
            </div>
          </div>
          <div style={{ position: 'relative', padding: P, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? 200 : 'auto' }}>
            {!isMobile && <div style={{ position: 'absolute', top: 24, left: 24 }}><Mono dim>SILICON_M1 / M2 / M3 / M4</Mono></div>}
            <IllusChip accent={accent} />
          </div>
        </div>

        {/* Row 2 — three columns: Wave / Modes / Style */}
        <div style={{ display: 'grid', gridTemplateColumns: col3 }}>
          <div style={{ padding: P, borderRight: br, display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_03</Mono>
            <div style={{ height: isMobile ? 160 : 220, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <IllusWave accent={accent} />
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Live waveform & scrubber</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              Render plays back as it streams. Scrub the timeline, replay phrases,
              and export the rendered audio in a single click.
            </p>
          </div>

          <div style={{ padding: P, borderRight: br, display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_04</Mono>
            <div style={{ height: isMobile ? 160 : 220, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <IllusModes accent={accent} />
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Four working modes</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              Speak, Design, Clone, Library. Each mode pairs the right model with
              the right task — and your library bridges all of them.
            </p>
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['speak', 'design', 'clone', 'library'].map((m) => (
                <span key={m} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, padding: '3px 8px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.05em' }}>{m}</span>
              ))}
            </div>
          </div>

          <div style={{ padding: P, display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_05</Mono>
            <div style={{ height: isMobile ? 160 : 220, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', margin: '24px 0 32px', flexDirection: 'column', gap: 14 }}>
              {/* Style instruction block */}
              <div style={{ width: '100%', background: '#0c0c10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 14, fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                <div style={{ color: accent }}>style:</div>
                <div>"calm and warm, slow"</div>
                <div style={{ color: accent, marginTop: 6 }}>style:</div>
                <div>"excited, fast pace"</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>style: &lt;preset voices only&gt;</div>
              </div>
              {/* Tone chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {[
                  { t: 'tone · warm',    c: accent },
                  { t: 'pace · slow',    c: '#7af0a8' },
                  { t: 'mood · friendly', c: '#ff5b9c' },
                ].map((x) => (
                  <span key={x.t} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: x.c, border: `1px solid ${x.c}33`, letterSpacing: '0.04em' }}>{x.t}</span>
                ))}
              </div>
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Style in plain English</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              For preset voices, type a short instruction like "calm and warm" —
              the model uses it to color the delivery.
            </p>
          </div>
        </div>

        {/* Row 3 — Voice library card preview */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: P, borderRight: br }}>
            <Mono>FIG_06</Mono>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: isMobile ? 26 : 32, fontWeight: 500, letterSpacing: '-0.02em', margin: '24px 0 0', color: '#fff' }}>
              One library<br />for every voice<br />you keep.
            </h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '20px 0 32px', maxWidth: 360 }}>
              Designed and cloned voices land in the same place. Search by name,
              filter by type, rename, delete. Anywhere a voice picker exists,
              your library is right there.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 360 }}>
              {[
                { name: 'Cloned',   detail: 'from your audio',   accent: true },
                { name: 'Designed', detail: 'from a description' },
              ].map((m) => (
                <div key={m.name} style={{ border: `1px solid ${m.accent ? accent : 'rgba(255,255,255,0.08)'}`, borderRadius: 6, padding: 14, background: m.accent ? `${accent}10` : 'transparent' }}>
                  <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 15, fontWeight: 500, color: '#fff' }}>{m.name}</div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: m.accent ? accent : 'rgba(255,255,255,0.55)', marginTop: 6, letterSpacing: '0.06em' }}>{m.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: P, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? 200 : 'auto' }}>
            <IllusVoiceCards accent={accent} />
          </div>
        </div>

        {/* Row 4 — Design / Clone walkthroughs */}
        <div style={{ display: 'grid', gridTemplateColumns: col2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: P, borderRight: br, display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_07</Mono>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: isMobile ? 22 : 28, fontWeight: 500, letterSpacing: '-0.02em', margin: '20px 0 0', color: '#fff' }}>Design a voice from words.</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '14px 0 24px', maxWidth: 460 }}>
              Describe what you want — "gravelly older man, slow cadence" — and
              the model reads your text back in that voice. Iterate until it
              clicks. Save it to the library.
            </p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? 160 : 'auto' }}>
              <IllusDesign accent={accent} />
            </div>
          </div>
          <div style={{ padding: P, display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_08</Mono>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: isMobile ? 22 : 28, fontWeight: 500, letterSpacing: '-0.02em', margin: '20px 0 0', color: '#fff' }}>Clone from a few seconds.</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '14px 0 24px', maxWidth: 460 }}>
              Record a short reference (⌘R), type its transcript word-for-word,
              then write whatever you want said next. Same voice, new words —
              everything stays on your Mac.
            </p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? 160 : 'auto' }}>
              <IllusClone accent={accent} />
            </div>
          </div>
        </div>

        {/* Row 5 — Reference upload / Phonemes / Export */}
        <div style={{ display: 'grid', gridTemplateColumns: col3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: P, borderRight: br, display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_09</Mono>
            <div style={{ height: isMobile ? 140 : 200, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <IllusDropzone accent={accent} />
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Drop or record</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              Use the built-in recorder or drag an existing clip. A few seconds
              of clean speech is enough — longer is fine but not required.
            </p>
          </div>

          <div style={{ padding: P, borderRight: br, display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_10</Mono>
            <div style={{ height: isMobile ? 140 : 200, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <IllusPhonemes accent={accent} />
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Built on Qwen3-TTS</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              Two model families (0.6B & 1.7B) across precisions from 4-bit to
              bf16. Pick the trade-off that fits your machine.
            </p>
          </div>

          <div style={{ padding: P, display: 'flex', flexDirection: 'column' }}>
            <Mono>FIG_11</Mono>
            <div style={{ height: isMobile ? 140 : 200, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 32px' }}>
              <ExportIllus accent={accent} />
            </div>
            <h3 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, color: '#fff' }}>Export & share</h3>
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '12px 0 0' }}>
              Render anything to WAV, AAC, or ALAC. Drag straight into Logic,
              Final Cut, or your podcast editor of choice.
            </p>
          </div>
        </div>

        {/* Row 6 — Trust strip */}
        <div style={{ display: 'grid', gridTemplateColumns: col3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { fig: 'FIG_12', title: 'Sandboxed', body: 'App Sandbox enabled. Microphone access is granted explicitly for Clone and stays scoped to the app.' },
            { fig: 'FIG_13', title: 'Pure Swift / MLX', body: 'On-device inference via mlx-swift. First launch downloads weights; everything after is fully offline.' },
            { fig: 'FIG_14', title: 'Debug log', body: 'Built-in log viewer for monitoring renders and downloads — no Console.app spelunking needed.' },
          ].map((it, i) => (
            <div key={it.fig} style={{ padding: P, borderRight: (!isMobile && i < 2) ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
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

// Small SVG export icon for FIG_11
function ExportIllus({ accent }) {
  return (
    <svg viewBox="0 0 600 380" width="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="60" y="80" width="480" height="220" rx="6" fill="#0a0a0d" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
      {/* file rows */}
      {['voice_clone_aurora.wav', 'narration_take_03.m4a', 'audiobook_ch01.m4a (alac)'].map((name, i) => (
        <g key={i}>
          <rect x="80" y={110 + i * 60} width="440" height="44" rx="4" fill="#0c0c10" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <rect x="80" y={110 + i * 60} width="3" height="44" fill={i === 0 ? accent : i === 1 ? '#7af0a8' : '#ff5b9c'} />
          <text x="100" y={132 + i * 60} fontFamily="ui-monospace, monospace" fontSize="11" fill="#fff" letterSpacing="0.04em">{name}</text>
          {/* mini wave */}
          <g transform={`translate(380 ${132 + i * 60})`}>
            {Array.from({ length: 14 }).map((_, j) => {
              const h = 4 + Math.abs(Math.sin(j * 0.7 + i) * 14);
              return <rect key={j} x={j * 6} y={-h / 2} width="2.5" height={h} rx="1" fill="rgba(255,255,255,0.5)" />;
            })}
          </g>
          <text x="492" y={140 + i * 60} fontFamily="ui-monospace, monospace" fontSize="9" fill="rgba(255,255,255,0.4)">⇣</text>
        </g>
      ))}
    </svg>
  );
}

// =================== Studio Demo (mirrors real PolyJuiceVoice app) ===================
const PRESET_VOICES = [
  { id: 'ryan',    label: 'Ryan',    sub: 'preset · neutral male',     type: 'preset' },
  { id: 'vivian',  label: 'Vivian',  sub: 'preset · warm female',      type: 'preset' },
  { id: 'aiden',   label: 'Aiden',   sub: 'preset · bright male',      type: 'preset' },
  { id: 'serena',  label: 'Serena',  sub: 'preset · narrator',         type: 'preset' },
];

const YOUR_VOICES = [
  { id: 'prakhar', label: 'Prakhar', sub: 'cloned · 12s sample',       type: 'cloned' },
];

function StudioDemo({ accent }) {
  const { isMobile } = useBreakpoint();
  const [tab, setTab] = React.useState('Speak');
  const [voice, setVoice] = React.useState(YOUR_VOICES[0]);
  const [prompt, setPrompt] = React.useState("Hello World! PolyJuiceVoice is an on-device text-to-speech for macOS (and iOS) with voice cloning and voice design, powered by Apple's MLX and the Qwen3-TTS family of models. Everything runs locally over Metal — no audio, transcripts, or recordings ever leave the device.");
  const [language, setLanguage] = React.useState('English');
  const [generating, setGenerating] = React.useState(false);
  const [genFrac, setGenFrac] = React.useState(1);
  const [playing, setPlaying] = React.useState(true);
  const [playhead, setPlayhead] = React.useState(0);

  // generation tick
  React.useEffect(() => {
    if (!generating) return;
    const id = setInterval(() => {
      setGenFrac((f) => {
        if (f >= 1) { setGenerating(false); return 1; }
        return Math.min(1, f + 0.02);
      });
    }, 80);
    return () => clearInterval(id);
  }, [generating]);

  // playhead — 14s clip
  React.useEffect(() => {
    if (!playing) return;
    let raf;
    const dur = 14000;
    const start = performance.now() - playhead * dur;
    const tick = () => {
      let t = ((performance.now() - start) / dur);
      if (t >= 1) { t = 0; }
      setPlayhead(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // waveform bars — speech-shaped (sentence envelope)
  const bars = React.useMemo(() => {
    const N = 110;
    return Array.from({ length: N }).map((_, i) => {
      const t = i / (N - 1);
      const env = Math.max(0.08, Math.sin(t * Math.PI * 1.3) * 0.5 + Math.sin(t * Math.PI * 4.2) * 0.4 + 0.2);
      const noise = Math.abs(Math.sin(i * 0.7 + voice.id.length) * 0.55 + Math.cos(i * 0.31) * 0.4);
      return 0.1 + Math.max(0, env) * noise;
    });
  }, [voice]);

  const isPreset = voice.type === 'preset';

  return (
    <section id="speak" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '48px 20px' : '88px 32px' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: isMobile ? 28 : 48, gap: isMobile ? 12 : 0 }}>
          <div>
            <Mono>FIG_15 · POLYJUICEVOICE_APP</Mono>
            <h2 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: isMobile ? 36 : 56, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 500, margin: '20px 0 0', color: '#fff', maxWidth: 700 }}>
              Four modes,<br />
              one <span style={{ fontStyle: 'italic', fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}>quiet</span> window.
            </h2>
          </div>
          {!isMobile && (
            <div style={{ textAlign: 'right' }}>
              <Mono dim>FROM_THE_REAL_APP · v1.0</Mono>
            </div>
          )}
        </div>

        {/* App window */}
        <div style={{ borderRadius: 14, background: '#0f0f10', overflow: 'hidden', boxShadow: '0 80px 160px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)' }}>
          {/* Title bar */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#0f0f10', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            </div>
            <div style={{ marginLeft: 18, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect x="0.5" y="0.5" width="17" height="13" rx="2" stroke="currentColor" /><line x1="6" y1="0" x2="6" y2="14" stroke="currentColor" /></svg>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ width: 28, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Debug">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.2" /><line x1="7" y1="2" x2="7" y2="4.5" stroke="currentColor" strokeWidth="1.2" /><line x1="3.5" y1="3.5" x2="5" y2="5" stroke="currentColor" strokeWidth="1.2" /><line x1="10.5" y1="3.5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.2" /><line x1="2" y1="7.5" x2="4" y2="7.5" stroke="currentColor" strokeWidth="1.2" /><line x1="10" y1="7.5" x2="12" y2="7.5" stroke="currentColor" strokeWidth="1.2" /></svg>
              </button>
              <button style={{ width: 28, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Appearance">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M7 3 A4 4 0 0 1 7 11 Z" fill="currentColor" /></svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '180px 1fr', minHeight: isMobile ? 'auto' : 640, background: '#0f0f10' }}>
            {/* Sidebar — hidden on mobile */}
            {!isMobile && (
              <div style={{ background: '#0f0f10', borderRight: '1px solid rgba(255,255,255,0.04)', padding: '12px 10px' }}>
                {[
                  { name: 'Speak',    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="2" y1="7" x2="2" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="4.5" y1="4.5" x2="4.5" y2="9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="9.5" y1="4.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="12" y1="6" x2="12" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg> },
                  { name: 'Design',   icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1 L8.2 5.5 L12.5 7 L8.2 8.5 L7 13 L5.8 8.5 L1.5 7 L5.8 5.5 Z" stroke="currentColor" strokeWidth="1.2" /></svg> },
                  { name: 'Clone',    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="5" y="2" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.2" /><path d="M3 7 Q3 11 7 11 Q11 11 11 7 M7 11 L7 13" stroke="currentColor" strokeWidth="1.2" /></svg> },
                  { name: 'Library',  icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="2.5" height="10" stroke="currentColor" strokeWidth="1.2" /><rect x="5.5" y="2" width="2.5" height="10" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="3" width="2.5" height="9" stroke="currentColor" strokeWidth="1.2" transform="rotate(-12 10.25 7.5)" /></svg> },
                  { name: 'Settings', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" /><path d="M7 1.5 L7 3 M7 11 L7 12.5 M1.5 7 L3 7 M11 7 L12.5 7 M3 3 L4 4 M10 10 L11 11 M3 11 L4 10 M10 4 L11 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg> },
                ].map((it) => {
                  const active = tab === it.name;
                  return (
                    <button
                      key={it.name}
                      onClick={() => setTab(it.name)}
                      style={{
                        width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', marginBottom: 2, borderRadius: 6,
                        background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                        color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                        border: 'none', fontFamily: 'Geist, ui-sans-serif', fontSize: 13, cursor: 'pointer',
                      }}
                    >
                      <span style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: active ? 1 : 0.7 }}>{it.icon}</span>
                      {it.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main column */}
            <div style={{ display: 'flex', flexDirection: 'column', background: '#161618', position: 'relative' }}>
              {/* Mode title */}
              <div style={{ padding: '14px 28px 0' }}>
                <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 17, fontWeight: 600, color: '#fff' }}>{tab}</div>
              </div>

              <div style={{ padding: isMobile ? '20px 20px 100px' : '20px 28px 100px', overflow: 'auto', flex: 1 }}>
                {/* Voice */}
                <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>Voice</div>

                {/* Presets row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1da7ff' }} />
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', color: '#1da7ff', fontWeight: 600 }}>PRESETS</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {PRESET_VOICES.map((v) => {
                    const active = voice.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setVoice(v)}
                        style={{
                          background: active ? 'rgba(29,167,255,0.18)' : '#1c1c1f',
                          border: `1px solid ${active ? 'rgba(29,167,255,0.6)' : 'rgba(255,255,255,0.08)'}`,
                          color: '#fff', padding: '5px 14px', borderRadius: 999,
                          fontFamily: 'Geist, ui-sans-serif', fontSize: 13, cursor: 'pointer',
                        }}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>

                {/* Your voices row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7' }} />
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.14em', color: '#a855f7', fontWeight: 600 }}>YOUR VOICES</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {YOUR_VOICES.map((v) => {
                    const active = voice.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setVoice(v)}
                        style={{
                          background: active ? '#a855f7' : 'rgba(168,85,247,0.12)',
                          border: `1px solid ${active ? '#a855f7' : 'rgba(168,85,247,0.4)'}`,
                          color: '#fff', padding: '5px 14px', borderRadius: 999,
                          fontFamily: 'Geist, ui-sans-serif', fontSize: 13,
                          fontWeight: active ? 500 : 400, cursor: 'pointer',
                        }}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                  <button
                    style={{
                      background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.5)', padding: '5px 14px', borderRadius: 999,
                      fontFamily: 'Geist, ui-sans-serif', fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    + Clone or design
                  </button>
                </div>

                {/* Text to speak */}
                <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>Text to speak</div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows="4"
                  style={{
                    width: '100%', background: '#0f0f10', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8, padding: '14px 16px', color: '#fff',
                    fontFamily: 'Geist, ui-sans-serif', fontSize: 14, lineHeight: 1.55,
                    outline: 'none', resize: 'vertical',
                  }}
                />

                {/* Language */}
                <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Language</div>
                  <button
                    onClick={() => setLanguage((l) => l === 'English' ? 'Spanish' : l === 'Spanish' ? 'Mandarin' : 'English')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff',
                      padding: '6px 10px 6px 12px', borderRadius: 6,
                      fontFamily: 'Geist, ui-sans-serif', fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    {language}
                    <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><path d="M2 4 L4.5 1.5 L7 4 M2 7 L4.5 9.5 L7 7" stroke="currentColor" strokeWidth="1.2" /></svg>
                  </button>
                </div>

                {/* Waveform card */}
                <div style={{ marginTop: 22, background: '#0f0f10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 16 }}>
                  <div style={{ height: 110, display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
                    {bars.map((b, i) => {
                      const t = i / bars.length;
                      const past = t <= playhead;
                      return (
                        <div key={i} style={{
                          flex: 1, height: `${b * 100}%`,
                          background: past ? '#1da7ff' : '#1976d2',
                          opacity: past ? 1 : 0.55, borderRadius: 0,
                        }} />
                      );
                    })}
                  </div>
                  {/* Transport */}
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', padding: 4, display: 'flex' }} title="Skip back 10s">
                      <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 4 A7 7 0 1 1 4 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M4 4 L4 8 L8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><text x="11" y="14" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill="currentColor">10</text></svg>
                    </button>
                    <button
                      onClick={() => setPlaying((p) => !p)}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 4, display: 'flex' }}
                    >
                      {playing ? (
                        <svg width="20" height="20" viewBox="0 0 22 22"><rect x="6" y="4" width="3.5" height="14" fill="currentColor" /><rect x="12.5" y="4" width="3.5" height="14" fill="currentColor" /></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 22 22"><path d="M6 4 L17 11 L6 18 Z" fill="currentColor" /></svg>
                      )}
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', padding: 4, display: 'flex' }} title="Skip forward 10s">
                      <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 4 A7 7 0 1 0 18 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M18 4 L18 8 L14 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><text x="11" y="14" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill="currentColor">10</text></svg>
                    </button>
                    <div style={{ flex: 1 }} />
                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4, fontFamily: 'Geist, ui-sans-serif', fontSize: 13 }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2 L8 10 M5 7 L8 10 L11 7 M3 13 L13 13" stroke="currentColor" strokeWidth="1.4" /></svg>
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Speak CTA */}
              <div style={{ position: 'absolute', left: isMobile ? 12 : 24, right: isMobile ? 12 : 24, bottom: 24 }}>
                <button
                  onClick={() => { setGenFrac(1); setPlaying(true); setPlayhead(0); }}
                  style={{
                    width: '100%', background: accent, color: '#fff', border: 'none',
                    borderRadius: 10, padding: '14px 0',
                    fontFamily: 'Geist, ui-sans-serif', fontSize: 15, fontWeight: 500,
                    cursor: 'pointer', boxShadow: `0 12px 28px ${accent}33`,
                  }}
                >
                  Speak
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Caption row */}
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 20 : 24 }}>
          {[
            ['VOICE', voice.label + (isPreset ? ' · preset' : ' · cloned'), 'Cloned voices have their character baked in. Style instructions only apply to presets.'],
            ['MODEL', 'Qwen3-TTS 1.7B · q4', 'Models load on first run; switch precision in Settings.'],
            ['PRIVACY', 'On-device · Metal', 'No audio, transcripts, or recordings ever leave the device.'],
          ].map(([k, v, sub]) => (
            <div key={k}>
              <Mono dim>{k}</Mono>
              <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 14, color: '#fff', marginTop: 6 }}>{v}</div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4, lineHeight: 1.6 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FieldLabel = ({ children, style = {} }) => (
  <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 8, ...style }}>{children}</div>
);

const fieldStyle = {
  width: '100%', background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 6, padding: '10px 12px', color: '#fff',
  fontFamily: 'Geist, ui-sans-serif', fontSize: 13, outline: 'none', resize: 'vertical',
};

function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

// =================== Specs ===================
function Specs({ accent }) {
  const { isMobile } = useBreakpoint();
  return (
    <section id="models" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr' }}>
        <div style={{ padding: isMobile ? '32px 24px' : 56, borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)', borderBottom: isMobile ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
          <Mono>FIG_16</Mono>
          <h2 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: isMobile ? 32 : 44, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 500, margin: '24px 0 0', color: '#fff' }}>Specs.</h2>
          <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: '24px 0 0', maxWidth: 320 }}>
            What you need to run PolyJuiceVoice. What you get when you do.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
          <SpecBlock label="REQUIRES" isMobile={isMobile} rows={[
            ['macOS', '26+ (primary)'],
            ['iOS', '26+ (device only)'],
            ['chip', 'Apple Silicon'],
            ['xcode', '17+ to build'],
            ['simulator', 'not supported'],
          ]} />
          <SpecBlock label="DELIVERS" accent={accent} isMobile={isMobile} rows={[
            ['models', 'Qwen3-TTS 0.6B / 1.7B'],
            ['precisions', 'q4 · q6 · q8 · bf16'],
            ['inference', 'mlx-swift on Metal'],
            ['modes', 'speak · design · clone · library'],
            ['format', 'WAV · AAC · ALAC'],
          ]} />
        </div>
      </div>
    </section>
  );
}

function SpecBlock({ label, rows, accent, isMobile }) {
  return (
    <div style={{ padding: isMobile ? '28px 24px' : 56, borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: isMobile ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
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
  const { isMobile } = useBreakpoint();
  return (
    <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: isMobile ? '72px 24px' : '120px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <Mono>FIG_17 · BEGIN</Mono>
        <h2 style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: isMobile ? 52 : 96, lineHeight: isMobile ? 1.05 : 0.95, letterSpacing: '-0.04em', fontWeight: 500, margin: '32px 0 0', color: '#fff' }}>
          Speak in any<br />
          <span style={{ fontStyle: 'italic', fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}>voice</span> — without<br />
          ever leaving your Mac.
        </h2>
        <div style={{ marginTop: isMobile ? 40 : 56, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: isMobile ? '100%' : 'auto' }}>
          <a href="https://github.com/Team-AER/PolyJuiceVoice/releases/latest" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center',  background: '#fff', border: 'none', color: '#000', fontFamily: 'Geist, ui-sans-serif', fontSize: 15, fontWeight: 500, padding: '14px 28px', borderRadius: 4, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
            ⌘ Download PolyJuiceVoice · Apple Silicon
          </a>
          <Mono dim>8.5 MB · macOS 26+ · MIT-LICENSED</Mono>
        </div>
      </div>
    </section>
  );
}

// =================== Footer ===================
function Footer() {
  const { isMobile, isTablet } = useBreakpoint();
  const cols = isMobile ? '1fr 1fr' : (isTablet ? '1fr 1fr 1fr' : '2fr 1fr 1fr 1fr 1fr');
  return (
    <footer style={{ padding: isMobile ? '40px 20px 24px' : '48px 32px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: cols, gap: isMobile ? 28 : 32, alignItems: 'start' }}>
        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <div style={{ fontFamily: 'Geist, ui-sans-serif', fontSize: 14, color: '#fff', fontWeight: 500 }}>PolyJuiceVoice</div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8, lineHeight: 1.6 }}>
            Built by Team AER.<br />On-device speech, end to end.
          </div>
        </div>
        {[
          ['Product', [['Download', 'https://github.com/Team-AER/PolyJuiceVoice/releases/latest'], ['Source code', 'https://github.com/Team-AER/PolyJuiceVoice'], ['Licence (MIT)', 'https://github.com/Team-AER/PolyJuiceVoice/blob/main/LICENSE']]],
          ['Docs', [['Build and run', 'https://github.com/Team-AER/PolyJuiceVoice/blob/main/docs/BUILD_AND_RUN.md'], ['Privacy policy', 'https://github.com/Team-AER/PolyJuiceVoice/blob/main/docs/PRIVACY_POLICY.md'], ['Issues', 'https://github.com/Team-AER/PolyJuiceVoice/issues']]],
          ['Team AER', [['aer.app', '/'], ['All apps', '/#projects'], ['hello@aer.app', 'mailto:hello@aer.app']]],
          ['Other apps', [['Cantis', '/cantis/'], ['Subtly', '/subtly/'], ['Quill', '/quill/']]],
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
      <div style={{ maxWidth: 1280, margin: '48px auto 0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>
        <div>© 2026 TEAM AER · ALL ON-DEVICE, ALL THE TIME</div>
        <div>v1.0 · QWEN3-TTS · MLX-SWIFT</div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  TopNav, Hero, Marquee, FeatureGrid, StudioDemo, Specs, Cta, Footer,
});
