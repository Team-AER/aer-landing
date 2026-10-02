// PolyJuiceVoice voice-themed illustrations
// Style: thin lines + filled accent + animated motion, multi-color allowed.

(function injectKeyframes() {
  if (document.getElementById('pjv-anim-kf')) return;
  const s = document.createElement('style');
  s.id = 'pjv-anim-kf';
  s.textContent = `
    @keyframes pjv-bar { 0%,100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }
    @keyframes pjv-pulse { 0%,100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
    @keyframes pjv-ring { 0% { transform: scale(0.55); opacity: 0.55; } 100% { transform: scale(1.5); opacity: 0; } }
    @keyframes pjv-rise { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes pjv-shimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
    @keyframes pjv-glow { 0%,100% { filter: drop-shadow(0 0 6px currentColor); } 50% { filter: drop-shadow(0 0 18px currentColor); } }
    @keyframes pjv-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -24; } }
    @keyframes pjv-blink { 0%, 60%, 100% { opacity: 1; } 70%, 95% { opacity: 0.15; } }
    @keyframes pjv-scan { 0% { transform: translateY(-4px); opacity: 0; } 30%,70% { opacity: 1; } 100% { transform: translateY(60px); opacity: 0; } }
    @keyframes pjv-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  `;
  document.head.appendChild(s);
})();

const STROKE = 'rgba(255,255,255,0.85)';
const STROKE_DIM = 'rgba(255,255,255,0.35)';
const STROKE_FAINT = 'rgba(255,255,255,0.15)';

// =================== HERO: Microphone with radiating speech waveform ===================
function IllusMicHero({ accent = '#a855f7' }) {
  // Mirrored speech waveform — thin to fat to thin (utterance shape)
  const N = 96;
  const bars = React.useMemo(
    () => Array.from({ length: N }).map((_, i) => {
      const t = i / (N - 1);
      // bell-shaped envelope — like a spoken sentence
      const env = Math.sin(t * Math.PI);
      const noise = Math.abs(Math.sin(i * 0.7) * 0.5 + Math.sin(i * 0.27) * 0.4 + Math.cos(i * 1.3) * 0.25);
      return 0.08 + env * (0.3 + noise * 0.7);
    }),
    []
  );

  return (
    <svg viewBox="0 0 800 560" width="100%" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="hero-bar-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="50%" stopColor={accent} stopOpacity="1" />
          <stop offset="100%" stopColor="#7af0a8" stopOpacity="0.4" />
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

      {/* Glow pad */}
      <ellipse cx="400" cy="290" rx="320" ry="200" fill="url(#hero-glow)" />

      {/* Sound rings emanating from mic capsule */}
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx="200"
          cy="290"
          rx="80"
          ry="80"
          fill="none"
          stroke={accent}
          strokeWidth="1"
          opacity="0.45"
          style={{
            transformOrigin: '200px 290px',
            animation: `pjv-ring 3.6s ease-out ${i * 1.2}s infinite`,
          }}
        />
      ))}

      {/* Microphone — left side */}
      <g style={{ animation: 'pjv-float 4s ease-in-out infinite' }}>
        {/* mic capsule body */}
        <rect x="170" y="220" width="60" height="100" rx="30" fill="#0c0c0f" stroke={STROKE} strokeWidth="1.6" />
        {/* mic mesh — horizontal bars */}
        {[235, 245, 255, 265, 275, 285, 295, 305].map((y) => (
          <line key={y} x1="180" y1={y} x2="220" y2={y} stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
        ))}
        {/* mic mesh — vertical bars */}
        {[185, 195, 205, 215].map((x) => (
          <line key={x} x1={x} y1="230" x2={x} y2="310" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
        ))}
        {/* glowing accent ring at top */}
        <circle cx="200" cy="220" r="30" fill="none" stroke={accent} strokeWidth="2" style={{ color: accent, animation: 'pjv-glow 1.8s ease-in-out infinite' }} />
        {/* yoke */}
        <path d="M 150 290 Q 150 350 200 350 Q 250 350 250 290" fill="none" stroke={STROKE} strokeWidth="1.6" />
        {/* stand */}
        <line x1="200" y1="350" x2="200" y2="395" stroke={STROKE} strokeWidth="1.6" />
        <ellipse cx="200" cy="400" rx="40" ry="6" fill="#0c0c0f" stroke={STROKE} strokeWidth="1.4" />
        {/* live red dot */}
        <circle cx="245" cy="240" r="3" fill="#ff5b9c" style={{ animation: 'pjv-blink 1.4s ease-in-out infinite' }} />
      </g>

      {/* Speech waveform — flows OUT to the right */}
      <g transform="translate(290 290)">
        {bars.map((h, i) => {
          const x = i * 4.6;
          const halfH = h * 110;
          return (
            <rect
              key={i}
              x={x}
              y={-halfH}
              width="2.2"
              height={halfH * 2}
              rx="1.1"
              fill="url(#hero-bar-grad)"
              style={{
                transformOrigin: `${x + 1.1}px 0px`,
                animation: `pjv-bar ${1.4 + (i % 5) * 0.16}s ease-in-out ${i * 0.025}s infinite`,
              }}
            />
          );
        })}
      </g>

      {/* annotation lines */}
      <g stroke={STROKE_FAINT} strokeWidth="1" fill="none">
        <path d="M 200 195 L 200 150 L 130 150" />
        <path d="M 740 290 L 740 240" />
      </g>
      <g fontFamily="ui-monospace, monospace" fontSize="10" fill="rgba(255,255,255,0.5)" letterSpacing="0.08em">
        <text x="125" y="142" textAnchor="end">REF_INPUT</text>
        <text x="740" y="232" textAnchor="middle">ON-DEVICE TTS</text>
      </g>

      {/* phoneme glyphs floating */}
      <g fontFamily="ui-monospace, monospace" fontSize="11" fill={accent} opacity="0.6" letterSpacing="0.1em" style={{ animation: 'pjv-shimmer 3s ease-in-out infinite' }}>
        <text x="380" y="100">/h ə ˈl oʊ/</text>
        <text x="540" y="470" fill="#7af0a8">/w ɜːr l d/</text>
      </g>
    </svg>
  );
}

// =================== Apple Silicon chip with voice waveform inside ===================
function IllusChip({ accent = '#a855f7' }) {
  const bars = React.useMemo(
    () => Array.from({ length: 28 }).map((_, i) => {
      const t = i / 27;
      const env = Math.sin(t * Math.PI);
      return 0.18 + env * (0.4 + Math.abs(Math.sin(i * 0.7) * 0.45));
    }),
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
      {/* corner notch */}
      <circle cx="118" cy="98" r="3" fill={accent} style={{ color: accent, animation: 'pjv-glow 1.6s ease-in-out infinite' }} />
      {/* label */}
      <text x="250" y="125" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fill="rgba(255,255,255,0.6)" letterSpacing="0.18em">METAL · MLX</text>
      {/* internal voice waveform */}
      <g transform="translate(140 220)">
        {bars.map((h, i) => {
          const x = i * 8;
          const barH = h * 80;
          return (
            <rect
              key={i}
              x={x}
              y={-barH / 2}
              width="4.5"
              height={barH}
              rx="1"
              fill={i % 6 === 0 ? '#ff5b9c' : i % 4 === 0 ? '#7af0a8' : accent}
              style={{
                animation: `pjv-pulse ${0.9 + (i % 3) * 0.2}s ease-in-out ${i * 0.04}s infinite`,
                transformOrigin: `${x + 2.25}px 0px`,
              }}
            />
          );
        })}
      </g>
      {/* metric tick */}
      <text x="250" y="285" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill={accent} letterSpacing="0.12em">1.4× realtime · 1.7B-q4</text>
    </svg>
  );
}

// =================== Live waveform analyzer ===================
function IllusWave({ accent = '#a855f7' }) {
  const bars = React.useMemo(() => {
    const N = 56;
    return Array.from({ length: N }).map((_, i) => {
      const t = i / (N - 1);
      // speech-shaped envelope, two syllables
      const env1 = Math.sin(t * Math.PI * 2.2);
      const env = Math.max(0.1, env1);
      const noise = Math.abs(Math.sin(i * 0.7) * 0.6 + Math.cos(i * 0.31) * 0.3);
      return 0.15 + env * noise;
    });
  }, []);
  return (
    <svg viewBox="0 0 600 380" width="100%" preserveAspectRatio="xMidYMid meet">
      {/* enclosure */}
      <rect x="40" y="60" width="520" height="280" rx="6" fill="#0a0a0d" stroke={STROKE} strokeWidth="1.2" />
      {/* timeline grid */}
      {[100, 150, 200, 250, 300].map((y) => (
        <line key={y} x1="60" y1={y} x2="540" y2={y} stroke={STROKE_FAINT} strokeWidth="0.6" strokeDasharray="2 4" />
      ))}
      {/* center axis */}
      <line x1="60" y1="200" x2="540" y2="200" stroke={STROKE_DIM} strokeWidth="0.6" />
      {/* mirrored bars */}
      {bars.map((h, i) => {
        const x = 70 + i * 8.6;
        const halfH = h * 110;
        const color = i < 14 ? accent : i < 38 ? '#7af0a8' : '#ff5b9c';
        return (
          <rect
            key={i}
            x={x}
            y={200 - halfH}
            width="5"
            height={halfH * 2}
            rx="1"
            fill={color}
            opacity="0.85"
            style={{
              animation: `pjv-pulse ${0.9 + (i % 4) * 0.2}s ease-in-out ${i * 0.04}s infinite`,
              transformOrigin: `${x + 2.5}px 200px`,
            }}
          />
        );
      })}
      {/* playhead */}
      <line x1="280" y1="80" x2="280" y2="320" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
      {/* time labels */}
      <g fontFamily="ui-monospace, monospace" fontSize="9" fill={STROKE_DIM} letterSpacing="0.06em">
        <text x="70" y="335">00:00</text>
        <text x="270" y="335">00:01.2</text>
        <text x="500" y="335">00:02.4</text>
      </g>
    </svg>
  );
}

// =================== Four modes — visual icon cluster ===================
function IllusModes({ accent = '#a855f7' }) {
  const modes = [
    { label: 'SPEAK', color: accent, icon: 'speak' },
    { label: 'DESIGN', color: '#7af0a8', icon: 'design' },
    { label: 'CLONE', color: '#ff5b9c', icon: 'clone' },
    { label: 'LIBRARY', color: '#c8a4ff', icon: 'library' },
  ];
  return (
    <svg viewBox="0 0 600 380" width="100%" preserveAspectRatio="xMidYMid meet">
      {modes.map((m, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 80 + col * 240;
        const y = 70 + row * 140;
        return (
          <g key={m.label} transform={`translate(${x} ${y})`}>
            <rect x="0" y="0" width="200" height="110" rx="6" fill="#0a0a0d" stroke={STROKE_DIM} strokeWidth="1" />
            <rect x="0" y="0" width="3" height="110" fill={m.color} />
            {/* icon */}
            <g transform="translate(20 26)" stroke={m.color} strokeWidth="1.6" fill="none" strokeLinecap="round">
              {m.icon === 'speak' && (
                <>
                  <rect x="6" y="0" width="14" height="22" rx="7" />
                  <path d="M 0 16 Q 0 28 13 28 Q 26 28 26 16" />
                  <line x1="13" y1="28" x2="13" y2="36" />
                </>
              )}
              {m.icon === 'design' && (
                <>
                  <circle cx="13" cy="18" r="14" />
                  <path d="M 6 12 Q 13 4 20 12" />
                  <path d="M 6 24 Q 13 32 20 24" />
                  <circle cx="13" cy="18" r="3" fill={m.color} />
                </>
              )}
              {m.icon === 'clone' && (
                <>
                  <circle cx="9" cy="14" r="6" />
                  <path d="M 1 30 Q 1 22 9 22 Q 17 22 17 30" />
                  <circle cx="22" cy="14" r="6" strokeDasharray="2 2" />
                  <path d="M 14 30 Q 14 22 22 22 Q 30 22 30 30" strokeDasharray="2 2" />
                </>
              )}
              {m.icon === 'library' && (
                <>
                  <rect x="0" y="2" width="5" height="34" rx="1" />
                  <rect x="8" y="2" width="5" height="34" rx="1" />
                  <rect x="16" y="6" width="5" height="30" rx="1" transform="rotate(8 18.5 21)" />
                  <rect x="24" y="2" width="5" height="34" rx="1" />
                </>
              )}
            </g>
            {/* label */}
            <text x="70" y="40" fontFamily="ui-monospace, monospace" fontSize="11" fill="#fff" letterSpacing="0.14em">{m.label}</text>
            {/* mini bars */}
            <g transform="translate(70 56)">
              {Array.from({ length: 14 }).map((_, i) => {
                const h = 4 + Math.abs(Math.sin(i * 0.7 + idx) * 18);
                return (
                  <rect
                    key={i}
                    x={i * 8}
                    y={-h / 2}
                    width="3"
                    height={h}
                    rx="1"
                    fill={m.color}
                    opacity="0.7"
                    style={{
                      animation: `pjv-pulse ${1 + (i % 3) * 0.2}s ease-in-out ${i * 0.06 + idx * 0.15}s infinite`,
                      transformOrigin: `${i * 8 + 1.5}px 0px`,
                    }}
                  />
                );
              })}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

// =================== Voice cards stack — library ===================
function IllusVoiceCards({ accent = '#a855f7' }) {
  const voices = [
    { name: 'Aurora',     tag: 'designed', tone: 'warm · female · friendly', color: accent },
    { name: 'Cobalt',     tag: 'cloned',   tone: 'gravelly · male · slow',   color: '#7af0a8' },
    { name: 'Marigold',   tag: 'designed', tone: 'bright · narration',       color: '#ff5b9c' },
    { name: 'Slate',      tag: 'cloned',   tone: 'baritone · neutral',       color: '#c8a4ff' },
  ];
  return (
    <svg viewBox="0 0 600 400" width="100%" preserveAspectRatio="xMidYMid meet">
      {voices.map((v, idx) => {
        const y = 30 + idx * 80;
        const N = 22;
        return (
          <g key={v.name}>
            <rect x="40" y={y} width="520" height="64" rx="6" fill="#0a0a0d" stroke={STROKE_DIM} strokeWidth="1" />
            {/* color stripe */}
            <rect x="40" y={y} width="3" height="64" fill={v.color} />
            {/* play icon */}
            <circle cx="76" cy={y + 32} r="14" fill="none" stroke={STROKE} strokeWidth="1" />
            <path d={`M ${72} ${y + 26} L ${82} ${y + 32} L ${72} ${y + 38} Z`} fill={v.color} />
            {/* name */}
            <text x="106" y={y + 28} fontFamily="ui-sans-serif, system-ui" fontWeight="500" fontSize="14" fill="#fff">{v.name}</text>
            {/* type chip */}
            <rect x="180" y={y + 17} width="58" height="14" rx="3" fill="none" stroke={`${v.color}66`} strokeWidth="1" />
            <text x="209" y={y + 27} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill={v.color} letterSpacing="0.1em">{v.tag.toUpperCase()}</text>
            {/* tone meta */}
            <text x="106" y={y + 47} fontFamily="ui-monospace, monospace" fontSize="10" fill="rgba(255,255,255,0.45)" letterSpacing="0.06em">{v.tone}</text>
            {/* mini wave */}
            <g transform={`translate(380 ${y + 32})`}>
              {Array.from({ length: N }).map((_, i) => {
                const t = i / (N - 1);
                const env = Math.sin(t * Math.PI);
                const h = 4 + env * Math.abs(Math.sin(i * 0.7 + idx) * 24);
                return (
                  <rect
                    key={i}
                    x={i * 7}
                    y={-h / 2}
                    width="3"
                    height={h}
                    rx="1"
                    fill={v.color}
                    opacity="0.75"
                    style={{
                      animation: `pjv-pulse ${0.9 + (i % 3) * 0.2}s ease-in-out ${i * 0.05 + idx * 0.1}s infinite`,
                      transformOrigin: `${i * 7 + 1.5}px 0px`,
                    }}
                  />
                );
              })}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

// =================== Voice Design — text describing voice morphs into wave ===================
function IllusDesign({ accent = '#a855f7' }) {
  return (
    <svg viewBox="0 0 600 380" width="100%" preserveAspectRatio="xMidYMid meet">
      {/* prompt box */}
      <rect x="40" y="80" width="240" height="220" rx="8" fill="#0a0a0d" stroke={STROKE_DIM} strokeWidth="1" />
      <text x="56" y="106" fontFamily="ui-monospace, monospace" fontSize="9" fill={accent} letterSpacing="0.12em">DESCRIPTION</text>
      <g fontFamily="ui-monospace, monospace" fontSize="11" fill="rgba(255,255,255,0.78)">
        <text x="56" y="138">a warm female voice</text>
        <text x="56" y="158">with a friendly tone,</text>
        <text x="56" y="178">unhurried cadence,</text>
        <text x="56" y="198">slight rasp on the</text>
        <text x="56" y="218">low end.</text>
      </g>
      {/* cursor */}
      <rect x="120" y="225" width="6" height="14" fill={accent} style={{ animation: 'pjv-blink 1.1s ease-in-out infinite' }} />

      {/* arrow */}
      <g stroke={accent} strokeWidth="1.5" fill="none" strokeDasharray="4 4" style={{ animation: 'pjv-flow 1.2s linear infinite' }}>
        <path d="M 290 190 L 340 190" />
      </g>
      <path d="M 340 184 L 350 190 L 340 196 Z" fill={accent} />

      {/* generated voice preview */}
      <rect x="360" y="80" width="200" height="220" rx="8" fill="#0a0a0d" stroke={accent} strokeWidth="1" />
      <text x="376" y="106" fontFamily="ui-monospace, monospace" fontSize="9" fill={accent} letterSpacing="0.12em">GENERATED</text>
      <text x="376" y="130" fontFamily="ui-sans-serif, system-ui" fontSize="14" fontWeight="500" fill="#fff">Voice 04</text>
      <text x="376" y="148" fontFamily="ui-monospace, monospace" fontSize="9" fill={STROKE_DIM}>3.2s sample</text>

      {/* mirrored wave */}
      <g transform="translate(376 210)">
        {Array.from({ length: 22 }).map((_, i) => {
          const t = i / 21;
          const env = Math.sin(t * Math.PI);
          const h = 6 + env * Math.abs(Math.sin(i * 0.8) * 38 + Math.cos(i * 0.3) * 18);
          return (
            <rect
              key={i}
              x={i * 8}
              y={-h / 2}
              width="3"
              height={h}
              rx="1"
              fill={accent}
              opacity="0.85"
              style={{
                animation: `pjv-pulse ${0.9 + (i % 3) * 0.2}s ease-in-out ${i * 0.04}s infinite`,
                transformOrigin: `${i * 8 + 1.5}px 0px`,
              }}
            />
          );
        })}
      </g>

      <rect x="376" y="252" width="80" height="22" rx="3" fill="none" stroke={STROKE_DIM} strokeWidth="1" />
      <text x="416" y="267" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="11" fill={STROKE} letterSpacing="0.04em">Save voice</text>
    </svg>
  );
}

// =================== Clone — record waveform → reference transcript → cloned wave ===================
function IllusClone({ accent = '#a855f7' }) {
  return (
    <svg viewBox="0 0 600 380" width="100%" preserveAspectRatio="xMidYMid meet">
      {/* recording panel */}
      <rect x="40" y="60" width="220" height="100" rx="6" fill="#0a0a0d" stroke={STROKE_DIM} strokeWidth="1" />
      <circle cx="68" cy="110" r="9" fill="#ff5b9c" style={{ animation: 'pjv-blink 1.4s ease-in-out infinite' }} />
      <text x="86" y="114" fontFamily="ui-monospace, monospace" fontSize="11" fill="#fff" letterSpacing="0.06em">REC · 00:04.2</text>
      <g transform="translate(60 138)">
        {Array.from({ length: 28 }).map((_, i) => {
          const t = i / 27;
          const env = Math.sin(t * Math.PI);
          const h = 3 + env * Math.abs(Math.sin(i * 0.7) * 14 + Math.cos(i * 0.3) * 8);
          return (
            <rect
              key={i}
              x={i * 7}
              y={-h / 2}
              width="3"
              height={h}
              rx="1"
              fill="#ff5b9c"
              opacity="0.9"
              style={{
                animation: `pjv-pulse ${0.9 + (i % 3) * 0.2}s ease-in-out ${i * 0.04}s infinite`,
                transformOrigin: `${i * 7 + 1.5}px 0px`,
              }}
            />
          );
        })}
      </g>

      {/* reference transcript */}
      <rect x="40" y="190" width="220" height="120" rx="6" fill="#0a0a0d" stroke={STROKE_DIM} strokeWidth="1" />
      <text x="56" y="212" fontFamily="ui-monospace, monospace" fontSize="9" fill={STROKE_DIM} letterSpacing="0.12em">REF_TRANSCRIPT</text>
      <g fontFamily="ui-monospace, monospace" fontSize="10" fill="rgba(255,255,255,0.7)">
        <text x="56" y="236">"the rain in Spain</text>
        <text x="56" y="252">stays mainly on</text>
        <text x="56" y="268">the plain."</text>
      </g>

      {/* arrow with phoneme glyphs */}
      <g stroke={accent} strokeWidth="1.5" fill="none" strokeDasharray="4 4" style={{ animation: 'pjv-flow 1.2s linear infinite' }}>
        <path d="M 280 180 L 320 180" />
      </g>
      <path d="M 320 174 L 330 180 L 320 186 Z" fill={accent} />
      <text x="300" y="166" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill={accent} letterSpacing="0.1em">Qwen3-TTS</text>

      {/* cloned output */}
      <rect x="340" y="60" width="220" height="250" rx="6" fill="#0a0a0d" stroke={accent} strokeWidth="1" />
      <text x="356" y="84" fontFamily="ui-monospace, monospace" fontSize="9" fill={accent} letterSpacing="0.12em">CLONED · NEW TEXT</text>
      <g fontFamily="ui-monospace, monospace" fontSize="10" fill="rgba(255,255,255,0.78)">
        <text x="356" y="110">"meet me by the</text>
        <text x="356" y="126">old fountain at</text>
        <text x="356" y="142">half past nine."</text>
      </g>
      <g transform="translate(356 220)">
        {Array.from({ length: 28 }).map((_, i) => {
          const t = i / 27;
          const env = Math.sin(t * Math.PI);
          const h = 3 + env * Math.abs(Math.sin(i * 0.7 + 1.3) * 18 + Math.cos(i * 0.3) * 10);
          return (
            <rect
              key={i}
              x={i * 7}
              y={-h / 2}
              width="3"
              height={h}
              rx="1"
              fill={accent}
              opacity="0.9"
              style={{
                animation: `pjv-pulse ${0.9 + (i % 3) * 0.2}s ease-in-out ${i * 0.04 + 0.4}s infinite`,
                transformOrigin: `${i * 7 + 1.5}px 0px`,
              }}
            />
          );
        })}
      </g>
      <text x="450" y="288" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#7af0a8" letterSpacing="0.1em">SAME VOICE · NEW WORDS</text>
    </svg>
  );
}

// =================== Reference recording dropzone ===================
function IllusDropzone({ accent = '#a855f7' }) {
  return (
    <div style={{ width: '100%', height: '100%', border: `1.5px dashed ${accent}66`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, background: `${accent}06` }}>
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="16" y="6" width="12" height="20" rx="6" stroke={accent} strokeWidth="1.6" fill={`${accent}10`} />
        <path d="M 10 22 Q 10 32 22 32 Q 34 32 34 22" stroke={accent} strokeWidth="1.6" fill="none" />
        <line x1="22" y1="32" x2="22" y2="40" stroke={accent} strokeWidth="1.6" />
        <line x1="14" y1="40" x2="30" y2="40" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: accent, letterSpacing: '0.1em' }}>DROP_REFERENCE_AUDIO</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>WAV · M4A · MP3 · 3-30s</div>
    </div>
  );
}

// =================== Phoneme/IPA glyph cluster ===================
function IllusPhonemes({ accent = '#a855f7' }) {
  const phonemes = [
    { sym: '/p/',  c: '#fff' },
    { sym: '/oʊ/', c: accent },
    { sym: '/l/',  c: '#fff' },
    { sym: '/i/',  c: accent },
    { sym: '/dʒ/', c: '#7af0a8' },
    { sym: '/uː/', c: '#fff' },
    { sym: '/s/',  c: accent },
  ];
  return (
    <svg viewBox="0 0 600 380" width="100%" preserveAspectRatio="xMidYMid meet">
      {/* horizontal axis */}
      <line x1="40" y1="220" x2="560" y2="220" stroke={STROKE_DIM} strokeWidth="0.6" strokeDasharray="2 4" />
      {phonemes.map((p, i) => {
        const x = 70 + i * 70;
        return (
          <g key={i}>
            <circle cx={x} cy="220" r="34" fill="#0a0a0d" stroke={p.c} strokeWidth="1.2" opacity="0.9" />
            <text x={x} y="226" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="14" fill={p.c} letterSpacing="0.04em">{p.sym}</text>
            {/* tick to label */}
            <line x1={x} y1="186" x2={x} y2="170" stroke={STROKE_FAINT} strokeWidth="0.8" />
            <text x={x} y="160" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill={STROKE_DIM}>t={i * 80}ms</text>
          </g>
        );
      })}
      {/* underlying wave */}
      <g transform="translate(40 300)">
        {Array.from({ length: 70 }).map((_, i) => {
          const t = i / 69;
          const env = Math.sin(t * Math.PI);
          const h = 4 + env * Math.abs(Math.sin(i * 0.7) * 22 + Math.cos(i * 0.3) * 12);
          return (
            <rect
              key={i}
              x={i * 7.5}
              y={-h / 2}
              width="3"
              height={h}
              rx="1"
              fill={accent}
              opacity="0.55"
              style={{
                animation: `pjv-pulse ${0.9 + (i % 3) * 0.2}s ease-in-out ${i * 0.025}s infinite`,
                transformOrigin: `${i * 7.5 + 1.5}px 0px`,
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}

Object.assign(window, {
  IllusMicHero,
  IllusChip,
  IllusWave,
  IllusModes,
  IllusVoiceCards,
  IllusDesign,
  IllusClone,
  IllusDropzone,
  IllusPhonemes,
});
