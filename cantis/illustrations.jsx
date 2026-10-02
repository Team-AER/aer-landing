// Cantis music-themed illustrations
// Style: thin lines + filled accent + animated motion. Multi-color allowed.
// Anim hooks: keyframes are defined in the host CSS via <style> tag we register here.

(function injectKeyframes() {
  if (document.getElementById('cantis-anim-kf')) return;
  const s = document.createElement('style');
  s.id = 'cantis-anim-kf';
  s.textContent = `
    @keyframes cantis-bar { 0%,100% { transform: scaleY(0.45); } 50% { transform: scaleY(1); } }
    @keyframes cantis-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes cantis-tonearm { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(6deg); } }
    @keyframes cantis-ring { 0% { transform: scale(0.55); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
    @keyframes cantis-pulse { 0%,100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
    @keyframes cantis-rise { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes cantis-shimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
    @keyframes cantis-needle { 0%,100% { transform: rotate(-18deg); } 50% { transform: rotate(-12deg); } }
    @keyframes cantis-cassette { to { transform: rotate(-360deg); } }
    @keyframes cantis-glow { 0%,100% { filter: drop-shadow(0 0 6px currentColor); } 50% { filter: drop-shadow(0 0 18px currentColor); } }
    @keyframes cantis-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -24; } }
  `;
  document.head.appendChild(s);
})();

const STROKE = 'rgba(255,255,255,0.85)';
const STROKE_DIM = 'rgba(255,255,255,0.35)';
const STROKE_FAINT = 'rgba(255,255,255,0.15)';

// =================== HERO: Vinyl turntable, properly centered ===================
function IllusVinylHero({ accent = '#1f5cff' }) {
  // Concentric audio rings that pulse outward
  const ringCount = 4;
  const bars = React.useMemo(
    () => Array.from({ length: 64 }).map((_, i) => 0.4 + Math.abs(Math.sin(i * 0.7) * 0.55 + Math.sin(i * 0.21) * 0.35)),
    []
  );

  return (
    <svg viewBox="0 0 800 560" width="100%" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="vinyl-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a1d" />
          <stop offset="60%" stopColor="#0c0c0f" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <linearGradient id="hero-bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#ff5b9c" />
        </linearGradient>
        <pattern id="hero-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="rgba(255,255,255,0.1)" />
        </pattern>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.04" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="560" fill="url(#hero-dots)" opacity="0.4" />

      {/* Soft accent glow behind record */}
      <circle cx="400" cy="290" r="260" fill="url(#hero-glow)" />

      {/* Sound rings emanating outward */}
      {Array.from({ length: ringCount }).map((_, i) => (
        <circle
          key={i}
          cx="400"
          cy="290"
          r="180"
          fill="none"
          stroke={accent}
          strokeWidth="1"
          opacity="0.4"
          style={{
            transformOrigin: '400px 290px',
            animation: `cantis-ring 3.6s ease-out ${i * 0.9}s infinite`,
          }}
        />
      ))}

      {/* Vinyl record — single transform, single rotation origin */}
      <g style={{ transformOrigin: '400px 290px', animation: 'cantis-spin 6s linear infinite' }}>
        {/* outer disc */}
        <circle cx="400" cy="290" r="180" fill="url(#vinyl-grad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        {/* grooves */}
        {[170, 158, 146, 134, 122, 110, 98, 86, 74].map((r, i) => (
          <circle key={i} cx="400" cy="290" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" />
        ))}
        {/* one bright groove for visible motion */}
        <circle cx="400" cy="290" r="140" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="80 480" />
        <circle cx="400" cy="290" r="110" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="40 320" />

        {/* center label */}
        <circle cx="400" cy="290" r="58" fill={accent} />
        <circle cx="400" cy="290" r="46" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeDasharray="2 3" />
        {/* "CANTIS" curved label text */}
        <g fontFamily="ui-monospace, monospace" fontSize="8" fill="rgba(255,255,255,0.85)" letterSpacing="0.25em">
          <text x="400" y="262" textAnchor="middle">CANTIS</text>
          <text x="400" y="324" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.6)">SIDE A · 33⅓</text>
        </g>
        {/* spindle */}
        <circle cx="400" cy="290" r="6" fill="#fff" />
        <circle cx="400" cy="290" r="2" fill="#000" />
        {/* small marker dot so you can SEE it spinning */}
        <circle cx="400" cy="240" r="3" fill="#fff" />
      </g>

      {/* Tonearm — rotates from pivot at top-right of record */}
      <g style={{ transformOrigin: '590px 130px', animation: 'cantis-tonearm 8s ease-in-out infinite' }}>
        {/* pivot base */}
        <circle cx="590" cy="130" r="18" fill="#0c0c0f" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" />
        <circle cx="590" cy="130" r="6" fill="rgba(255,255,255,0.4)" />
        {/* arm */}
        <line x1="590" y1="130" x2="430" y2="270" stroke="rgba(255,255,255,0.85)" strokeWidth="3" strokeLinecap="round" />
        <line x1="590" y1="130" x2="430" y2="270" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
        {/* counterweight */}
        <circle cx="608" cy="112" r="10" fill="#1a1a1d" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        {/* headshell */}
        <g transform="translate(430 270) rotate(45)">
          <rect x="-12" y="-6" width="26" height="16" rx="2" fill="#1a1a1d" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
          <circle cx="14" cy="2" r="2.5" fill={accent} />
        </g>
      </g>

      {/* Radial waveform — top right.
          Each bar lives in its OWN rotated coord system, so transformOrigin is local
          and scaleY animates cleanly from the inner radius. */}
      <g transform="translate(680 180)">
        {bars.map((h, i) => {
          if (i > 32) return null;
          // angle in degrees: top of arc, sweeping right
          const deg = -90 + (i / 64) * 360;
          const r1 = 40;
          const len = h * 50;
          return (
            <g key={i} transform={`rotate(${deg})`}>
              <line
                x1="0"
                y1={-r1}
                x2="0"
                y2={-(r1 + len)}
                stroke="url(#hero-bar-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transformOrigin: `0px ${-r1}px`,
                  animation: `cantis-bar ${1.4 + (i % 5) * 0.18}s ease-in-out ${i * 0.05}s infinite`,
                }}
              />
            </g>
          );
        })}
      </g>

      {/* Floating note glyphs */}
      <g fill="#fff" opacity="0.55" style={{ animation: 'cantis-shimmer 3s ease-in-out infinite' }}>
        <text x="120" y="120" fontSize="28" fontFamily="serif">♪</text>
        <text x="180" y="490" fontSize="22" fontFamily="serif" fill={accent}>♫</text>
        <text x="700" y="480" fontSize="20" fontFamily="serif">♩</text>
      </g>

      {/* annotation */}
      <g stroke={STROKE_FAINT} strokeWidth="1" fill="none">
        <path d="M 220 290 L 140 290 L 140 240" />
      </g>
      <g fontFamily="ui-monospace, monospace" fontSize="10" fill="rgba(255,255,255,0.5)" letterSpacing="0.08em">
        <text x="135" y="232">33⅓ RPM</text>
        <text x="680" y="280" textAnchor="middle">FFT_OUT</text>
      </g>
    </svg>
  );
}

// =================== Cassette tape with spinning reels ===================
function IllusCassette({ accent = '#1f5cff' }) {
  return (
    <svg viewBox="0 0 600 400" width="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="cas-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1f" />
          <stop offset="100%" stopColor="#0a0a0d" />
        </linearGradient>
      </defs>
      {/* body */}
      <rect x="80" y="100" width="440" height="220" rx="10" fill="url(#cas-body)" stroke={STROKE} strokeWidth="1.4" />
      <rect x="100" y="120" width="400" height="180" rx="6" fill="none" stroke={STROKE_DIM} strokeWidth="1" />
      {/* label area */}
      <rect x="120" y="135" width="360" height="70" rx="2" fill="#fff" />
      <rect x="120" y="135" width="360" height="14" fill={accent} />
      <text x="128" y="146" fontSize="9" fontFamily="ui-monospace, monospace" fill="#fff" letterSpacing="0.12em">CANTIS · SIDE A · 04:18</text>
      <g fontFamily="ui-monospace, monospace" fontSize="10" fill="#000" letterSpacing="0.06em">
        <text x="130" y="170">01. MIDNIGHT_DRIVE</text>
        <text x="130" y="184">02. PAPER_PLANES</text>
        <text x="130" y="198">03. KITCHEN_SESSION</text>
      </g>
      {/* tape window */}
      <rect x="180" y="220" width="240" height="60" rx="4" fill="#000" stroke={STROKE} strokeWidth="1" />
      {/* reels */}
      {[230, 370].map((cx, idx) => (
        <g key={cx} transform={`translate(${cx} 250)`} style={{ animation: `cantis-cassette ${idx ? 4 : 4.2}s linear infinite`, transformOrigin: '0 0' }}>
          <circle r="22" fill="#0a0a0d" stroke={STROKE} strokeWidth="1" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 6}
                y1={Math.sin(a) * 6}
                x2={Math.cos(a) * 18}
                y2={Math.sin(a) * 18}
                stroke={accent}
                strokeWidth="2"
              />
            );
          })}
          <circle r="5" fill="#fff" />
        </g>
      ))}
      {/* tape connecting line */}
      <path d="M 252 250 Q 300 268 348 250" stroke={accent} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// =================== EQ / Spectrum bars ===================
function IllusEQ({ accent = '#1f5cff' }) {
  const bars = React.useMemo(
    () => Array.from({ length: 32 }).map((_, i) => 0.25 + Math.abs(Math.sin(i * 0.6) * 0.7 + Math.cos(i * 0.31) * 0.3)),
    []
  );
  return (
    <svg viewBox="0 0 600 380" width="100%" preserveAspectRatio="xMidYMid meet">
      {/* enclosure */}
      <rect x="40" y="60" width="520" height="280" rx="6" fill="#0a0a0d" stroke={STROKE} strokeWidth="1.2" />
      {/* horizontal grid */}
      {[100, 150, 200, 250, 300].map((y) => (
        <line key={y} x1="60" y1={y} x2="540" y2={y} stroke={STROKE_FAINT} strokeWidth="0.6" strokeDasharray="2 4" />
      ))}
      {/* bars */}
      {bars.map((h, i) => {
        const x = 70 + i * 15;
        const barH = h * 220;
        return (
          <g key={i}>
            <rect
              x={x}
              y={310 - barH}
              width="10"
              height={barH}
              fill={i < 8 ? accent : i < 22 ? '#7af0a8' : '#ff5b9c'}
              opacity="0.85"
              style={{
                animation: `cantis-pulse ${0.8 + (i % 4) * 0.2}s ease-in-out ${i * 0.05}s infinite`,
                transformOrigin: `${x + 5}px 310px`,
              }}
            />
          </g>
        );
      })}
      {/* axis */}
      <line x1="60" y1="310" x2="540" y2="310" stroke={STROKE} strokeWidth="1" />
      {/* freq labels */}
      <g fontFamily="ui-monospace, monospace" fontSize="9" fill={STROKE_DIM} letterSpacing="0.06em">
        <text x="70" y="328">60Hz</text>
        <text x="220" y="328">1k</text>
        <text x="370" y="328">8k</text>
        <text x="500" y="328">20k</text>
      </g>
    </svg>
  );
}

// =================== Synth keys with chord highlight ===================
function IllusSynth({ accent = '#1f5cff' }) {
  const whiteKeys = 14;
  const keyW = 36;
  const totalW = whiteKeys * keyW;
  const startX = 30;
  const blackPattern = [1, 1, 0, 1, 1, 1, 0]; // C D _ F G A _
  const lit = [2, 4, 7, 9]; // chord
  return (
    <svg viewBox="0 0 600 380" width="100%" preserveAspectRatio="xMidYMid meet">
      {/* bg */}
      <rect x="20" y="80" width={totalW + 20} height="240" rx="6" fill="#0a0a0d" stroke={STROKE} strokeWidth="1.2" />
      {/* white keys */}
      {Array.from({ length: whiteKeys }).map((_, i) => {
        const isLit = lit.includes(i);
        return (
          <g key={i}>
            <rect
              x={startX + i * keyW}
              y="100"
              width={keyW - 2}
              height="200"
              rx="2"
              fill={isLit ? accent : '#f4f4f6'}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="0.5"
              style={isLit ? { color: accent, animation: 'cantis-glow 1.6s ease-in-out infinite' } : {}}
            />
            {isLit && (
              <text
                x={startX + i * keyW + keyW / 2 - 1}
                y="285"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                fill="#fff"
                letterSpacing="0.05em"
              >
                {['C', 'D', 'E', 'F', 'G', 'A', 'B'][i % 7]}
              </text>
            )}
          </g>
        );
      })}
      {/* black keys */}
      {Array.from({ length: whiteKeys }).map((_, i) => {
        const has = blackPattern[i % 7];
        if (!has) return null;
        return (
          <rect
            key={i}
            x={startX + i * keyW + keyW - 12}
            y="100"
            width="22"
            height="120"
            rx="2"
            fill="#0c0c10"
            stroke="#000"
          />
        );
      })}
      {/* note flow above */}
      <g stroke={accent} strokeWidth="2" fill="none" strokeDasharray="6 6" style={{ animation: 'cantis-flow 1.2s linear infinite' }}>
        <path d="M 30 70 Q 200 30 400 60 Q 500 80 580 50" />
      </g>
    </svg>
  );
}

// =================== Stems — 4 stacked waveforms (drums/bass/vocals/fx) ===================
function IllusStems({ accent = '#1f5cff' }) {
  const stems = [
    { label: 'DRUMS', color: '#ff5b9c', seed: 1 },
    { label: 'BASS', color: accent, seed: 2 },
    { label: 'VOCALS', color: '#7af0a8', seed: 3 },
    { label: 'FX', color: '#c8a4ff', seed: 4 },
  ];
  return (
    <svg viewBox="0 0 600 400" width="100%" preserveAspectRatio="xMidYMid meet">
      {stems.map((s, idx) => {
        const y = 60 + idx * 80;
        const bars = Array.from({ length: 60 }).map((_, i) =>
          0.2 + Math.abs(Math.sin(i * 0.4 + s.seed) * 0.6 + Math.cos(i * 0.13 + s.seed * 2) * 0.4)
        );
        return (
          <g key={s.label}>
            <text x="30" y={y + 4} fontFamily="ui-monospace, monospace" fontSize="9" fill={STROKE_DIM} letterSpacing="0.1em">{s.label}</text>
            {bars.map((b, i) => {
              const cx = 100 + i * 8;
              const h = b * 50;
              return (
                <rect
                  key={i}
                  x={cx}
                  y={y - h / 2}
                  width="4"
                  height={h}
                  fill={s.color}
                  opacity="0.85"
                  rx="1"
                  style={{
                    animation: `cantis-pulse ${1 + (i % 3) * 0.2}s ease-in-out ${i * 0.03 + idx * 0.1}s infinite`,
                    transformOrigin: `${cx + 2}px ${y}px`,
                  }}
                />
              );
            })}
            {/* center line */}
            <line x1="100" y1={y} x2="580" y2={y} stroke={STROKE_FAINT} strokeWidth="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

// =================== Headphones with sound-rings ===================
function IllusHeadphones({ accent = '#1f5cff' }) {
  return (
    <svg viewBox="0 0 600 380" width="100%" preserveAspectRatio="xMidYMid meet">
      {/* sound rings */}
      {[0, 1, 2].map((i) => (
        <g key={i} style={{ animation: `cantis-shimmer ${1.6 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}>
          <ellipse cx="120" cy="220" rx={70 + i * 24} ry={70 + i * 24} fill="none" stroke={accent} strokeWidth="1" opacity={0.4 - i * 0.1} />
          <ellipse cx="480" cy="220" rx={70 + i * 24} ry={70 + i * 24} fill="none" stroke="#ff5b9c" strokeWidth="1" opacity={0.4 - i * 0.1} />
        </g>
      ))}
      <g stroke={STROKE} strokeWidth="1.6" fill="none">
        <path d="M 120 200 C 120 80 480 80 480 200" />
        <ellipse cx="120" cy="220" rx="38" ry="52" fill="#0a0a0d" />
        <ellipse cx="120" cy="220" rx="26" ry="40" stroke={STROKE_DIM} />
        <ellipse cx="480" cy="220" rx="38" ry="52" fill="#0a0a0d" />
        <ellipse cx="480" cy="220" rx="26" ry="40" stroke={STROKE_DIM} />
      </g>
      <circle cx="120" cy="220" r="6" fill={accent} style={{ color: accent, animation: 'cantis-glow 1.4s ease-in-out infinite' }} />
      <circle cx="480" cy="220" r="6" fill="#ff5b9c" style={{ color: '#ff5b9c', animation: 'cantis-glow 1.4s ease-in-out 0.7s infinite' }} />
    </svg>
  );
}

// =================== Apple Silicon chip with audio waveform inside ===================
function IllusChip({ accent = '#1f5cff' }) {
  const bars = React.useMemo(
    () => Array.from({ length: 24 }).map((_, i) => 0.3 + Math.abs(Math.sin(i * 0.7) * 0.7)),
    []
  );
  return (
    <svg viewBox="0 0 500 400" width="100%" preserveAspectRatio="xMidYMid meet">
      {/* outer pins */}
      {Array.from({ length: 16 }).map((_, i) => {
        const offset = i < 8 ? i : i - 8;
        const y = 100 + offset * 24;
        return (
          <g key={i}>
            {i < 8 ? (
              <line x1="60" y1={y} x2="100" y2={y} stroke={STROKE_DIM} strokeWidth="2" />
            ) : (
              <line x1="400" y1={y} x2="440" y2={y} stroke={STROKE_DIM} strokeWidth="2" />
            )}
          </g>
        );
      })}
      {/* chip body */}
      <rect x="100" y="80" width="300" height="240" rx="8" fill="#0a0a0d" stroke={STROKE} strokeWidth="1.6" />
      <rect x="120" y="100" width="260" height="200" rx="4" fill="none" stroke={STROKE_DIM} strokeWidth="1" />
      {/* label */}
      <text x="250" y="125" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fill="rgba(255,255,255,0.6)" letterSpacing="0.18em">M-SERIES NPU</text>
      {/* internal waveform */}
      <g transform="translate(140 220)">
        {bars.map((h, i) => {
          const x = i * 9;
          const barH = h * 80;
          return (
            <rect
              key={i}
              x={x}
              y={-barH / 2}
              width="5"
              height={barH}
              rx="1"
              fill={i % 6 === 0 ? '#ff5b9c' : i % 4 === 0 ? '#7af0a8' : accent}
              style={{
                animation: `cantis-pulse ${0.9 + (i % 3) * 0.2}s ease-in-out ${i * 0.04}s infinite`,
                transformOrigin: `${x + 2.5}px 0px`,
              }}
            />
          );
        })}
      </g>
      {/* metric tick */}
      <text x="250" y="285" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill={accent} letterSpacing="0.12em">24.3s · 4min track</text>
    </svg>
  );
}

Object.assign(window, {
  IllusVinylHero,
  IllusCassette,
  IllusEQ,
  IllusSynth,
  IllusStems,
  IllusHeadphones,
  IllusChip,
});
