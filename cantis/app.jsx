// Cantis page root. The design-time Tweaks panel from the old standalone repo is gone;
// the accent is fixed to the brand blue.
const CANTIS_ACCENT = '#1f5cff';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <TopNav accent={CANTIS_ACCENT} />
      <main>
        <Hero accent={CANTIS_ACCENT} />
        <Marquee />
        <FeatureGrid accent={CANTIS_ACCENT} />
        <StudioDemo accent={CANTIS_ACCENT} />
        <Specs />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
