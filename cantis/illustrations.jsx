// Cantis illustrations. Thin lines, one blue accent, pink/mint only inside the graphics.
// Motion lives in index.html CSS; everything here is transform/opacity only and pauses
// off screen (wrap animated pieces in <Fig>). Text that has to be read is HTML, not SVG,
// so it keeps its real size on phones.

const C_STROKE = 'rgba(255,255,255,0.85)';
const C_DIM = 'rgba(255,255,255,0.35)';
const C_FAINT = 'rgba(255,255,255,0.15)';

// =================== HERO: record, tonearm and radial FFT ===================
// phase: 'idle' (arm parked) → 'gen' (rendering) → 'play' (arm on the record, disc spins, FFT live)
function IllusVinylHero({ accent = '#1f5cff', phase = 'idle' }) {
  const on = phase === 'play';
  const bars = React.useMemo(
    () => Array.from({ length: 33 }).map((_, i) => 0.4 + Math.abs(Math.sin(i * 0.7) * 0.55 + Math.sin(i * 0.21) * 0.35)),
    []
  );
  return (
    <svg className="c-hero-svg" viewBox="180 50 620 470" preserveAspectRatio="xMidYMid meet" role="img"
      aria-label="A record turning under the tonearm while a radial spectrum meter reacts to the track">
      <defs>
        <radialGradient id="c-vinyl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a1d" />
          <stop offset="60%" stopColor="#0c0c0f" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <linearGradient id="c-fftgrad" gradientUnits="userSpaceOnUse" x1="0" y1="-86" x2="0" y2="-36">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#ff5b9c" />
        </linearGradient>
      </defs>

      {/* platter shadow ring */}
      <circle cx="400" cy="290" r="192" fill="none" stroke={C_FAINT} strokeWidth="1" />

      <g className={`c-disc${on ? ' is-on' : ''}`}>
        <circle cx="400" cy="290" r="180" fill="url(#c-vinyl)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        {[170, 158, 146, 134, 122, 110, 98, 86, 74].map((r) => (
          <circle key={r} cx="400" cy="290" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" />
        ))}
        <circle cx="400" cy="290" r="140" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" strokeDasharray="80 480" />
        <circle cx="400" cy="290" r="110" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="40 320" />
        <circle cx="400" cy="290" r="58" fill={accent} />
        <circle cx="400" cy="290" r="46" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeDasharray="2 3" />
        <path d="M 372 290 L 381 290 L 387 270 L 394 306 L 401 282 L 407 290 L 428 290" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <circle cx="400" cy="290" r="6" fill="#fff" />
        <circle cx="400" cy="290" r="2" fill="#000" />
        <circle cx="400" cy="240" r="3" fill="#fff" />
      </g>

      {/* tonearm: parked off the record until the track is ready */}
      <g className={`c-arm${on ? ' is-on' : ''}`}>
        <circle cx="590" cy="130" r="18" fill="#0c0c0f" stroke={C_STROKE} strokeWidth="1.4" />
        <circle cx="590" cy="130" r="6" fill="rgba(255,255,255,0.4)" />
        <line x1="590" y1="130" x2="430" y2="270" stroke={C_STROKE} strokeWidth="3" strokeLinecap="round" />
        <circle cx="608" cy="112" r="10" fill="#1a1a1d" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <g transform="translate(430 270) rotate(45)">
          <rect x="-12" y="-6" width="26" height="16" rx="2" fill="#1a1a1d" stroke={C_STROKE} strokeWidth="1.2" />
          <circle cx="14" cy="2" r="2.5" fill={accent} />
        </g>
      </g>

      {/* radial spectrum: flat while idle, alive while playing */}
      <g transform="translate(700 190)" className={`c-fft${on ? ' is-on' : ''}`}>
        {bars.map((h, i) => {
          const deg = -90 + (i / 64) * 360;
          const r1 = 36;
          return (
            <g key={i} transform={`rotate(${deg})`}>
              <line x1="0" y1={-r1} x2="0" y2={-(r1 + h * 48)} stroke="url(#c-fftgrad)" strokeWidth="3" strokeLinecap="round"
                style={{ '--d': `${1.3 + (i % 5) * 0.22}s`, '--dl': `${-(i * 0.13).toFixed(2)}s`, transitionDelay: `${i * 18}ms` }} />
            </g>
          );
        })}
        <circle r="30" fill="none" stroke={C_FAINT} />
      </g>
    </svg>
  );
}

// =================== Apple Silicon package with the waveform inside ===================
function IllusChip({ accent = '#1f5cff' }) {
  const bars = React.useMemo(() => Array.from({ length: 24 }).map((_, i) => 0.3 + Math.abs(Math.sin(i * 0.7) * 0.7)), []);
  return (
    <svg viewBox="40 60 420 280" width="100%" style={{ maxWidth: 520 }} aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i}>
          <line x1="60" y1={100 + i * 24} x2="100" y2={100 + i * 24} stroke={C_DIM} strokeWidth="2" />
          <line x1="400" y1={100 + i * 24} x2="440" y2={100 + i * 24} stroke={C_DIM} strokeWidth="2" />
        </g>
      ))}
      <rect x="100" y="80" width="300" height="240" rx="8" fill="#0a0a0d" stroke={C_STROKE} strokeWidth="1.6" />
      <rect x="120" y="100" width="260" height="200" rx="4" fill="none" stroke={C_DIM} strokeWidth="1" />
      <g transform="translate(144 200)">
        {bars.map((h, i) => {
          const x = i * 9;
          const barH = h * 90;
          return (
            <rect key={i} x={x} y={-barH / 2} width="5" height={barH} rx="1"
              fill={i % 6 === 0 ? '#ff5b9c' : i % 4 === 0 ? '#7af0a8' : accent}
              style={{ animation: `cantis-pulse ${1.4 + (i % 3) * 0.3}s ease-in-out ${-(i * 0.11).toFixed(2)}s infinite alternate`, transformBox: 'fill-box', transformOrigin: '50% 50%' }} />
          );
        })}
      </g>
    </svg>
  );
}

// =================== Spectrum analyser ===================
function IllusEQ({ accent = '#1f5cff' }) {
  const bars = React.useMemo(() => Array.from({ length: 32 }).map((_, i) => 0.25 + Math.abs(Math.sin(i * 0.6) * 0.7 + Math.cos(i * 0.31) * 0.3) * (1 - i / 60)), []);
  return (
    <div style={{ width: '100%' }}>
      <svg viewBox="40 60 520 262" width="100%" aria-hidden="true" style={{ display: 'block' }}>
        <rect x="40" y="60" width="520" height="262" rx="6" fill="#0a0a0d" stroke={C_STROKE} strokeWidth="1.2" />
        {[110, 160, 210, 260].map((y) => (
          <line key={y} x1="60" y1={y} x2="540" y2={y} stroke={C_FAINT} strokeWidth="0.6" strokeDasharray="2 4" />
        ))}
        {bars.map((h, i) => {
          const x = 64 + i * 15;
          const barH = Math.min(220, h * 200);
          return (
            <rect key={i} x={x} y={300 - barH} width="10" height={barH}
              fill={i < 8 ? accent : i < 22 ? '#7af0a8' : '#ff5b9c'} opacity="0.85"
              style={{ animation: `cantis-pulse ${0.9 + (i % 4) * 0.25}s ease-in-out ${-(i * 0.07).toFixed(2)}s infinite alternate`, transformBox: 'fill-box', transformOrigin: '50% 100%' }} />
          );
        })}
        <line x1="56" y1="300" x2="544" y2="300" stroke={C_STROKE} strokeWidth="1" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0', font: '11px/1 var(--mono)', color: 'var(--fg-4)' }}>
        <span>60 Hz</span><span>1 kHz</span><span>8 kHz</span><span>20 kHz</span>
      </div>
    </div>
  );
}

// =================== Four generation modes, lit one after another ===================
const MODE_GLYPHS = {
  text2music: (
    <g>
      <path d="M4 10 H34 M4 18 H28 M4 26 H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 18 H52 M49 14 L53 18 L49 22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={60 + i * 6} y={18 - [6, 11, 4, 13, 8, 12, 5, 9][i]} width="3" height={[6, 11, 4, 13, 8, 12, 5, 9][i] * 2} rx="1" fill="currentColor" />)}
    </g>
  ),
  cover: (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={4 + i * 6} y={18 - [5, 10, 7, 12, 6][i]} width="3" height={[5, 10, 7, 12, 6][i] * 2} rx="1" fill="currentColor" opacity="0.5" />)}
      <path d="M40 18 H50 M47 14 L51 18 L47 22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M58 18 C62 6, 66 6, 70 18 S78 30, 82 18 S90 6, 94 18 S102 30, 106 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
  repaint: (
    <g>
      <rect x="40" y="2" width="30" height="32" rx="3" fill="currentColor" opacity="0.16" />
      {Array.from({ length: 17 }).map((_, i) => {
        const h = [5, 9, 6, 12, 7, 10, 4, 13, 9, 11, 6, 8, 12, 5, 9, 7, 10][i];
        const inside = i >= 6 && i <= 10;
        return <rect key={i} x={4 + i * 6} y={18 - h} width="3" height={h * 2} rx="1" fill="currentColor" opacity={inside ? 1 : 0.45} />;
      })}
    </g>
  ),
  extract: (
    <g>
      {[0, 1, 2].map((row) => (
        <path key={row} d={`M4 ${8 + row * 10} ${Array.from({ length: 12 }).map((_, i) => `L ${8 + i * 6} ${8 + row * 10 + (i % 2 ? -3 : 3)}`).join(' ')}`}
          stroke="currentColor" strokeWidth="1.4" fill="none" opacity={row === 1 ? 0.35 : 0.35} />
      ))}
      <path d="M82 18 H92 M89 14 L93 18 L89 22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d={`M96 18 ${Array.from({ length: 3 }).map((_, i) => `L ${99 + i * 3} ${18 + (i % 2 ? -5 : 5)}`).join(' ')}`} stroke="currentColor" strokeWidth="2" fill="none" />
    </g>
  ),
};

function IllusModes() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [lit, setLit] = React.useState(REDUCED ? 0 : -1);
  React.useEffect(() => {
    if (!inView || REDUCED) return undefined;
    const order = [0, 1, 2, 3, 0];
    const ids = order.map((m, k) => setTimeout(() => setLit(m), 250 + k * 650));
    return () => ids.forEach(clearTimeout);
  }, [inView]);
  const modes = ['text2music', 'cover', 'repaint', 'extract'];
  return (
    <div ref={ref} className="c-modes" role="img" aria-label="The four generation modes: text2music, cover, repaint and extract">
      {modes.map((m, i) => (
        <div key={m} className={`c-mode${lit === i ? ' is-lit' : ''}`}>
          <svg viewBox="0 0 112 36" preserveAspectRatio="xMinYMid meet" aria-hidden="true">{MODE_GLYPHS[m]}</svg>
          <span>{m}</span>
        </div>
      ))}
    </div>
  );
}

// =================== History: browse, search, favourite ===================
function IllusHistory() {
  const rows = [
    { t: 'Neon Drive', d: 'Oct 2, 9:12 PM', s: '45s', fav: true },
    { t: 'Late night lofi', d: 'Oct 2, 8:47 PM', s: '30s' },
    { t: 'Cinematic lift', d: 'Oct 1, 11:05 PM', s: '60s', fav: true },
  ];
  return (
    <div className="c-hist" role="img" aria-label="The history list: saved tracks with their date, length and a favourite star">
      <div className="c-hist-search">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" /><path d="M9.5 9.5 L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
        Search history
      </div>
      {rows.map((r, i) => (
        <Reveal key={r.t} i={i + 1} className="c-hist-row">
          <b>{r.t}</b>
          <i>{r.fav && <span className="star" aria-hidden="true">★</span>}{r.s}</i>
          <em>{r.d}</em>
        </Reveal>
      ))}
    </div>
  );
}

// =================== Export: waveform draws in, format lands on WAV ===================
function IllusExport({ accent = '#1f5cff' }) {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const [fmt, setFmt] = React.useState(REDUCED ? 0 : -1);
  React.useEffect(() => {
    if (!inView || REDUCED) return undefined;
    const ids = [2, 1, 0].map((f, k) => setTimeout(() => setFmt(f), 900 + k * 420));
    return () => ids.forEach(clearTimeout);
  }, [inView]);
  const d = React.useMemo(() => {
    let s = 'M0 36';
    for (let i = 1; i <= 120; i++) {
      const amp = 4 + Math.abs(Math.sin(i * 0.37) * 18 + Math.cos(i * 0.13) * 10);
      s += ` L${(i * 2.5).toFixed(1)} ${(36 + (i % 2 ? -amp : amp)).toFixed(1)}`;
    }
    return s;
  }, []);
  return (
    <div ref={ref} className={`c-export${inView ? ' is-in' : ''}`} role="img" aria-label="Export picker with WAV, AAC and ALAC; WAV selected">
      <svg className="c-export-wave" viewBox="0 0 300 72" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="36" x2="300" y2="36" stroke={C_FAINT} />
        <path d={d} pathLength="1" stroke={accent} strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="c-fmt">
        {['WAV', 'AAC', 'ALAC'].map((f, i) => <span key={f} className={fmt === i ? 'is-pick' : ''}>{f}</span>)}
      </div>
      <div className="c-file"><span>neon-drive.wav</span><span>48 kHz</span></div>
    </div>
  );
}

(function injectKeyframes() {
  if (document.getElementById('cantis-anim-kf')) return;
  const s = document.createElement('style');
  s.id = 'cantis-anim-kf';
  s.textContent = '@keyframes cantis-pulse { from { transform: scaleY(0.45); } to { transform: scaleY(1); } }';
  document.head.appendChild(s);
})();

Object.assign(window, { IllusVinylHero, IllusChip, IllusEQ, IllusModes, IllusHistory, IllusExport });
