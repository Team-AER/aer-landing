// motion.jsx — small motion helpers shared by the page sections.
// Loads first, before illustrations.jsx and sections.jsx.
//
//   useBreakpoint()  → { isMobile (<768), isTablet (<1025), width }
//   useInView(opts)  → [ref, inView]; once by default, or live with { once: false }
//   <Reveal i={n}>   → fades/rises its children once they scroll into view, staggered by i (70 ms apart)
//   <Fig>            → wraps an animated illustration; CSS pauses every animation inside until it is on screen
//   REDUCED          → prefers-reduced-motion: reduce (live)
//
// Hidden-initial states are gated on the `js` class added here, so nothing is hidden unless this ran.

document.documentElement.classList.add('js');

const reducedQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
const REDUCED = !!(reducedQuery && reducedQuery.matches);

function useBreakpoint() {
  const [w, setW] = React.useState(() => window.innerWidth);
  React.useEffect(() => {
    let raf = 0;
    const h = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setW(window.innerWidth)); };
    window.addEventListener('resize', h);
    return () => { window.removeEventListener('resize', h); cancelAnimationFrame(raf); };
  }, []);
  return { isMobile: w < 768, isTablet: w < 1025, width: w };
}

function useInView({ once = true, rootMargin = '0px 0px -8% 0px', threshold = 0.12 } = {}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { setInView(true); if (once) io.disconnect(); }
        else if (!once) setInView(false);
      });
    }, { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);
  return [ref, inView];
}

// Entrance reveal. `i` staggers siblings (see .rv in the page CSS).
function Reveal({ as = 'div', i = 0, className = '', style = {}, children, ...rest }) {
  const [ref, inView] = useInView();
  const Tag = as;
  return (
    <Tag ref={ref} className={`rv${inView ? ' in' : ''} ${className}`.trim()} style={{ '--i': i, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

// Figure wrapper: animations inside only run while the figure is on screen.
function Fig({ className = '', style = {}, children, ...rest }) {
  const [ref, inView] = useInView({ once: false, rootMargin: '80px 0px 80px 0px', threshold: 0 });
  return (
    <div ref={ref} className={`fig${inView ? ' fig-in' : ''} ${className}`.trim()} style={style} {...rest}>
      {children}
    </div>
  );
}

Object.assign(window, { REDUCED, useBreakpoint, useInView, Reveal, Fig });
