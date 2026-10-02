// PolyJuiceVoice page root. The design-time Tweaks panel from the old standalone repo is gone;
// the accent is fixed to the brand sky blue.
const PJV_ACCENT = '#1da7ff';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <TopNav accent={PJV_ACCENT} />
      <main>
        <Hero accent={PJV_ACCENT} />
        <Marquee />
        <FeatureGrid accent={PJV_ACCENT} />
        <StudioDemo accent={PJV_ACCENT} />
        <Specs />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
