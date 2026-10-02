// PolyJuiceVoice illustrations. Thin lines, one sky-blue accent; mint and pink only inside graphics.
// Motion lives in index.html CSS (transform/opacity only) and pauses off screen inside <Fig>.
// Anything meant to be read is HTML, so it keeps its real size on phones.

const P_STROKE = 'rgba(255,255,255,0.85)';
const P_DIM = 'rgba(255,255,255,0.35)';
const P_FAINT = 'rgba(255,255,255,0.15)';

// speech-shaped bar heights (sentence envelope), deterministic
function speechBars(n, seed = 0, lo = 0.08) {
  return Array.from({ length: n }).map((_, i) => {
    const t = i / (n - 1);
    const env = Math.max(0, Math.sin(t * Math.PI * 1.3) * 0.5 + Math.sin(t * Math.PI * 4.2) * 0.35 + 0.25) * Math.sin(t * Math.PI);
    const noise = Math.abs(Math.sin(i * 0.7 + seed) * 0.5 + Math.sin(i * 0.27 + seed) * 0.4 + Math.cos(i * 1.3) * 0.25);
    return lo + env * (0.35 + noise * 0.75);
  });
}

// =================== HERO: microphone and the waveform it streams ===================
// on=false: flat line, mic idle. on=true: bars stream in left to right (CSS transition delays).
function IllusMicHero({ accent = '#1da7ff', on = false, head = -1 }) {
  const N = 92;
  const bars = React.useMemo(() => speechBars(N, 0, 0.06), []);
  return (
    <svg className="p-hero-svg" viewBox="110 150 660 280" preserveAspectRatio="xMidYMid meet" role="img"
      aria-label="A studio microphone with the speech waveform it produces streaming out to the right">
      <defs>
        <linearGradient id="p-bargrad" x1="290" y1="0" x2="720" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="55%" stopColor={accent} />
          <stop offset="100%" stopColor="#7af0a8" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* microphone */}
      <g>
        <rect x="170" y="210" width="60" height="110" rx="30" fill="#0c0c0f" stroke={P_STROKE} strokeWidth="1.6" />
        {[228, 240, 252, 264, 276, 288, 300].map((y) => <line key={y} x1="180" y1={y} x2="220" y2={y} stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />)}
        {[186, 196, 204, 214].map((x) => <line key={x} x1={x} y1="222" x2={x} y2="308" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />)}
        <path d="M 150 280 Q 150 350 200 350 Q 250 350 250 280" fill="none" stroke={P_STROKE} strokeWidth="1.6" />
        <line x1="200" y1="350" x2="200" y2="395" stroke={P_STROKE} strokeWidth="1.6" />
        <ellipse cx="200" cy="400" rx="40" ry="6" fill="#0c0c0f" stroke={P_STROKE} strokeWidth="1.4" />
        <circle className={`p-led${on ? ' is-on' : ''}`} cx="244" cy="226" r="3.5" fill="#ff5b9c" />
      </g>

      {/* centre line the speech grows from */}
      <line x1="284" y1="290" x2="726" y2="290" stroke={P_FAINT} strokeWidth="1" />

      <g transform="translate(290 290)" className={`p-wave${on ? ' is-on' : ''}`}>
        {bars.map((h, i) => {
          const halfH = h * 112;
          return (
            <rect key={i} x={i * 4.7} y={-halfH} width="2.4" height={halfH * 2} rx="1.2" fill="url(#p-bargrad)"
              style={{ transitionDelay: `${i * 22}ms`, opacity: head >= 0 && i / N > head ? 0.45 : 1 }} />
          );
        })}
      </g>
      {head >= 0 && (
        <line x1={290 + head * N * 4.7} y1="170" x2={290 + head * N * 4.7} y2="410" stroke="#fff" strokeWidth="1.2" opacity="0.85" />
      )}
    </svg>
  );
}

// =================== Apple Silicon package, voice inside ===================
function IllusChip({ accent = '#1da7ff' }) {
  const bars = React.useMemo(() => speechBars(28, 1.2, 0.18), []);
  return (
    <svg viewBox="40 60 420 280" width="100%" style={{ maxWidth: 520 }} aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i}>
          <line x1="60" y1={100 + i * 24} x2="100" y2={100 + i * 24} stroke={P_DIM} strokeWidth="2" />
          <line x1="400" y1={100 + i * 24} x2="440" y2={100 + i * 24} stroke={P_DIM} strokeWidth="2" />
        </g>
      ))}
      <rect x="100" y="80" width="300" height="240" rx="8" fill="#0a0a0d" stroke={P_STROKE} strokeWidth="1.6" />
      <rect x="120" y="100" width="260" height="200" rx="4" fill="none" stroke={P_DIM} strokeWidth="1" />
      <g transform="translate(142 200)">
        {bars.map((h, i) => {
          const x = i * 8;
          const barH = h * 130;
          return (
            <rect key={i} x={x} y={-barH / 2} width="4.5" height={barH} rx="1"
              fill={i % 6 === 0 ? '#ff5b9c' : i % 4 === 0 ? '#7af0a8' : accent}
              style={{ animation: `pjv-pulse ${1.4 + (i % 3) * 0.3}s ease-in-out ${-(i * 0.11).toFixed(2)}s infinite alternate`, transformBox: 'fill-box', transformOrigin: '50% 50%' }} />
          );
        })}
      </g>
    </svg>
  );
}

// =================== Live waveform with a playhead that follows the stream ===================
function IllusWave({ accent = '#1da7ff' }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const N = 56;
  const bars = React.useMemo(() => speechBars(N, 2.1, 0.08), []);
  const on = inView || REDUCED;
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox="40 60 520 280" width="100%" aria-hidden="true" style={{ display: 'block' }}>
        <rect x="40" y="60" width="520" height="280" rx="6" fill="#0a0a0d" stroke={P_STROKE} strokeWidth="1.2" />
        {[110, 160, 240, 290].map((y) => <line key={y} x1="60" y1={y} x2="540" y2={y} stroke={P_FAINT} strokeWidth="0.6" strokeDasharray="2 4" />)}
        <line x1="60" y1="200" x2="540" y2="200" stroke={P_DIM} strokeWidth="0.6" />
        <g className={`p-wave${on ? ' is-on' : ''}`}>
          {bars.map((h, i) => {
            const x = 66 + i * 8.6;
            const halfH = h * 120;
            return <rect key={i} x={x} y={200 - halfH} width="5" height={halfH * 2} rx="1" fill={i < 22 ? accent : 'rgba(255,255,255,0.45)'} style={{ transitionDelay: `${i * 30}ms` }} />;
          })}
        </g>
        <line x1={66 + 22 * 8.6 - 2} y1="80" x2={66 + 22 * 8.6 - 2} y2="320" stroke="#fff" strokeWidth="1.2" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 2px 0', font: '11px/1 var(--mono)', color: 'var(--fg-4)' }}>
        <span>00:00</span><span style={{ color: '#fff' }}>00:01.2</span><span>00:03.1</span>
      </div>
    </div>
  );
}

// =================== Four modes, lit in turn, settling on Speak ===================
const PJV_MODE_ICONS = {
  Speak: <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 12 L3 12 M7 8 L7 16 M11 4 L11 20 M15 8 L15 16 M19 11 L19 13" /></g>,
  Design: <path d="M12 2 L13.8 9.2 L21 11 L13.8 12.8 L12 20 L10.2 12.8 L3 11 L10.2 9.2 Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />,
  Clone: <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"><rect x="8.5" y="2.5" width="7" height="11" rx="3.5" /><path d="M5 11 Q5 18 12 18 Q19 18 19 11 M12 18 L12 22" /></g>,
  Library: <g stroke="currentColor" strokeWidth="1.6" fill="none"><rect x="3" y="3" width="4" height="18" rx="1" /><rect x="9" y="3" width="4" height="18" rx="1" /><rect x="15.5" y="4" width="4" height="17" rx="1" transform="rotate(-10 17.5 12.5)" /></g>,
};

function IllusModes() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [lit, setLit] = React.useState(REDUCED ? 0 : -1);
  React.useEffect(() => {
    if (!inView || REDUCED) return undefined;
    const ids = [0, 1, 2, 3, 0].map((m, k) => setTimeout(() => setLit(m), 250 + k * 650));
    return () => ids.forEach(clearTimeout);
  }, [inView]);
  const modes = [['Speak', 'type and listen'], ['Design', 'describe a voice'], ['Clone', 'record and copy'], ['Library', 'every saved voice']];
  return (
    <div ref={ref} className="p-modes">
      {modes.map(([m, sub], i) => (
        <div key={m} className={`p-mode${lit === i ? ' is-lit' : ''}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{PJV_MODE_ICONS[m]}</svg>
          <b>{m}</b>
          <span>{sub}</span>
        </div>
      ))}
    </div>
  );
}

const MiniWave = ({ seed = 0, color = '#1da7ff', n = 22, className = 'w' }) => {
  const bars = React.useMemo(() => speechBars(n, seed, 0.12), [seed, n]);
  return (
    <svg className={className} viewBox={`0 0 ${n * 6} 28`} preserveAspectRatio="none" aria-hidden="true">
      {bars.map((h, i) => <rect key={i} x={i * 6} y={14 - h * 13} width="3" height={h * 26} rx="1" fill={color} opacity="0.8" />)}
    </svg>
  );
};

// =================== Voice library ===================
function IllusVoiceLibrary() {
  const voices = [
    { name: 'Aurora', kind: 'designed', tone: 'warm, friendly, unhurried', color: '#7af0a8' },
    { name: 'Cobalt', kind: 'cloned', tone: 'from a 9 s recording', color: '#b77cf9' },
    { name: 'Marigold', kind: 'designed', tone: 'bright narrator', color: '#7af0a8' },
    { name: 'Slate', kind: 'cloned', tone: 'from a 12 s recording', color: '#b77cf9' },
  ];
  return (
    <div className="p-lib" role="img" aria-label="The voice library: designed and cloned voices in one searchable list">
      <div className="p-lib-search">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" /><path d="M9.5 9.5 L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
        Search voices
        <em><span className="is-on">All</span><span>Cloned</span><span>Designed</span></em>
      </div>
      {voices.map((v, i) => (
        <Reveal key={v.name} i={i + 1} className="p-lib-row">
          <span className="p-lib-play" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 1 L9 5 L2 9 Z" fill="currentColor" /></svg></span>
          <b>{v.name}<span className="p-type"><span className="p-dot" style={{ background: v.color }} />{v.kind}</span></b>
          <small>{v.tone}</small>
          <MiniWave seed={i * 1.7} color={v.color} />
        </Reveal>
      ))}
    </div>
  );
}

// =================== Design: words in, a voice out ===================
const DESIGN_TEXT = 'A warm female voice with a friendly tone, unhurried cadence.';

function IllusDesign() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [n, setN] = React.useState(REDUCED ? DESIGN_TEXT.length : 0);
  React.useEffect(() => {
    if (!inView || REDUCED) return undefined;
    let k = 0;
    const id = setInterval(() => { k += 1; setN(k); if (k >= DESIGN_TEXT.length) clearInterval(id); }, 34);
    return () => clearInterval(id);
  }, [inView]);
  const done = n >= DESIGN_TEXT.length;
  return (
    <div ref={ref} className="p-flow">
      <div className="p-pane">
        <h4>DESCRIPTION</h4>
        <q>{DESIGN_TEXT.slice(0, n)}</q>{!done && <span className="p-caret" aria-hidden="true" />}
      </div>
      <div className="p-flow-arrow" aria-hidden="true"><svg width="28" height="12" viewBox="0 0 28 12"><path d="M0 6 H22" stroke="currentColor" strokeWidth="1.5" /><path d="M20 1 L26 6 L20 11" stroke="currentColor" strokeWidth="1.5" fill="none" style={{ animation: 'none', strokeDasharray: 'none' }} /></svg></div>
      <div className={`p-pane is-out rv rv-fade${done ? ' in' : ''}`}>
        <h4>GENERATED</h4>
        <div className="p-pane-name">New voice</div>
        <MiniWave seed={3.3} n={30} className="p-pane-wave" />
        <span className="p-pane-btn">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2 V10 M5 7 L8 10 L11 7 M3 13 H13" stroke="currentColor" strokeWidth="1.4" /></svg>
          Save Voice
        </span>
      </div>
    </div>
  );
}

// =================== Clone: a short recording plus its transcript, then new words ===================
function IllusClone() {
  return (
    <div className="p-flow">
      <div className="p-pane" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="p-rec"><i aria-hidden="true" />4.2s</div>
        <MiniWave seed={5} color="#ff5b9c" n={26} className="p-pane-wave" />
        <h4 style={{ margin: '4px 0 0' }}>REFERENCE TRANSCRIPT</h4>
        <q>The rain in Spain stays mainly on the plain.</q>
      </div>
      <div className="p-flow-arrow" aria-hidden="true"><svg width="28" height="12" viewBox="0 0 28 12"><path d="M0 6 H22" stroke="currentColor" strokeWidth="1.5" /><path d="M20 1 L26 6 L20 11" stroke="currentColor" strokeWidth="1.5" fill="none" style={{ animation: 'none', strokeDasharray: 'none' }} /></svg></div>
      <div className="p-pane is-out" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4>SAME VOICE, NEW WORDS</h4>
        <q>Meet me by the old fountain at half past nine.</q>
        <MiniWave seed={5.6} n={26} className="p-pane-wave" />
      </div>
    </div>
  );
}

// =================== Recorder (Clone tab) ===================
function IllusRecorder() {
  return (
    <Fig className="p-recorder" role="img" aria-label="The built-in recorder at 4.2 seconds, with live input levels">
      <span className="p-recbtn" aria-hidden="true"><span /></span>
      <div><b>4.2s</b><small>⌘R to stop</small></div>
      <div className="p-levels" aria-hidden="true">
        {speechBars(26, 4, 0.2).map((h, i) => (
          <span key={i} style={{ height: `${Math.round(h * 100)}%`, '--d': `${0.5 + (i % 4) * 0.15}s`, '--dl': `${-(i * 0.09).toFixed(2)}s` }} />
        ))}
      </div>
    </Fig>
  );
}

// =================== The real model matrix (ModelSnapshot.swift) ===================
function IllusModelMatrix() {
  const cols = ['4', '5', '6', '8', 'bf16'];
  const rows = [
    ['0.6B Base', [1, 1, 1, 1, 1]],
    ['0.6B CustomVoice', [1, 1, 1, 1, 1]],
    ['1.7B Base', [0, 0, 0, 0, 1]],
    ['1.7B CustomVoice', [0, 0, 0, 1, 1]],
    ['1.7B VoiceDesign', [1, 1, 1, 1, 1]],
  ];
  return (
    <table className="p-matrix" aria-label="Qwen3-TTS variants the app can download, by precision">
      <thead><tr><th scope="col">bits</th>{cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
      <tbody>
        {rows.map(([name, has], r) => (
          <Reveal as="tr" key={name} i={r}>
            <td>{name}</td>
            {has.map((y, k) => <td key={k} className={y ? 'y' : ''} aria-label={y ? 'available' : 'not published'}>{y ? '' : '–'}</td>)}
          </Reveal>
        ))}
      </tbody>
    </table>
  );
}

// =================== Export / share ===================
function IllusExport({ accent = '#1da7ff' }) {
  return (
    <div className="p-expcard" role="img" aria-label="A rendered clip ready to export as a WAV file">
      <MiniWave seed={7} n={48} color={accent} className="" />
      <div className="p-expcard-row">
        <span><b>narration_take_03.wav</b>24 kHz · mono · 0:08</span>
        <span className="p-pane-btn">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 10 V2 M5 5 L8 2 L11 5 M3 9 V14 H13 V9" stroke="currentColor" strokeWidth="1.4" /></svg>
          Export
        </span>
      </div>
    </div>
  );
}

(function injectKeyframes() {
  if (document.getElementById('pjv-anim-kf')) return;
  const s = document.createElement('style');
  s.id = 'pjv-anim-kf';
  s.textContent = '@keyframes pjv-pulse { from { transform: scaleY(0.45); } to { transform: scaleY(1); } }';
  document.head.appendChild(s);
})();

Object.assign(window, { speechBars, MiniWave, IllusMicHero, IllusChip, IllusWave, IllusModes, IllusVoiceLibrary, IllusDesign, IllusClone, IllusRecorder, IllusModelMatrix, IllusExport });
