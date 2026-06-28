// AER landing — main React app
const { useState, useEffect, useRef } = React;

// ---------- Tweakable defaults ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroBg": "cream",
  "stickerDensity": "medium",
  "marqueeSpeed": 28,
  "showCursorSticker": true,
  "memberAccent": "mixed",
  "showMarquee": true
}/*EDITMODE-END*/;

// ---------- Data ----------
const MEMBERS = [
  {
    name: "Nidhi Bharani",
    handle: "nidhibharani",
    role: "Builder · Researcher",
    blurb: "Likes shipping fast, breaking expectations slower. Splits time between making things people use and writing about why they should.",
    accent: "pink",
    initials: "NB",
    linkedin: "https://www.linkedin.com/in/nidhibharani/",
    github: "https://github.com/nidhibharani",
    projects: ["Subtly", "PromptMask-legal"],
    funFact: "Turns coffee into commits"
  },
  {
    name: "Prakhar Shukla",
    handle: "prakharshukla",
    role: "Tinkerer · Engineer",
    blurb: "Obsessed with the seams between things — voice, language, models. If it talks back, he probably wants to clone it.",
    accent: "yellow",
    initials: "PS",
    linkedin: "https://www.linkedin.com/in/prakharshukla/",
    github: "https://github.com/prafiles",
    projects: ["PolyJuiceVoice", "Cantis"],
    funFact: "Has opinions about microphones"
  }
];

const PROJECTS = {
  "Subtly": {
    title: "Subtly",
    tagline: "Subtitle Generator for all",
    body: "Auto-generate clean subtitles for any video. Drop a file, get burned-in or sidecar captions. Built so creators don't have to babysit Premiere.",
    lang: "JavaScript",
    color: "var(--gr-purple-500)",
    glyph: "Sb",
    url: "https://github.com/Team-AER/Subtly",
    sticker: "OPEN SOURCE"
  },
  "PolyJuiceVoice": {
    title: "PolyJuiceVoice",
    tagline: "Clone your voice. Responsibly. Mostly.",
    body: "A fun project to clone your voice on-device — Swift-native, surprisingly fast, and a little eerie when it works. Made for tinkerers, not deepfakers.",
    lang: "Swift",
    color: "var(--gr-pink-500)",
    glyph: "PJ",
    url: "https://github.com/Team-AER/PolyJuiceVoice",
    releases: "https://github.com/Team-AER/PolyJuiceVoice/releases",
    sticker: "NEW"
  },
  "PromptMask-legal": {
    title: "PromptMask",
    tagline: "Mask sensitive bits before the model sees them",
    body: "A privacy-preserving prompt layer for legal contexts — strip and re-stitch identifying info around LLM calls so confidential stays confidential.",
    lang: "HTML",
    color: "var(--gr-green-500)",
    glyph: "PM",
    url: "https://github.com/Team-AER/PromptMask-legal",
    sticker: "PRIVACY"
  },
  "Cantis": {
    title: "Cantis",
    tagline: "AI music generation. Native. On-device. No cloud.",
    body: "A full macOS app running ACE-Step v1.5 entirely on Apple Silicon. Text-to-music, lyrics, genre tags, waveform viz, multi-format export — pure Swift, no Python, no servers.",
    lang: "Swift",
    color: "var(--gr-orange-500)",
    glyph: "Ca",
    url: "https://github.com/Team-AER/Cantis",
    releases: "https://github.com/Team-AER/Cantis/releases",
    sticker: "NEW"
  }
};

// ---------- Reveal-on-scroll hook ----------
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// ---------- Cursor sticker ----------
function CursorSticker({ enabled }) {
  const ref = useRef(null);
  const [text, setText] = useState("hi 👋");
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      if (!ref.current) return;
      ref.current.style.left = e.clientX + "px";
      ref.current.style.top = (e.clientY - 24) + "px";
      ref.current.classList.add("visible");
    };
    const onLeave = () => ref.current && ref.current.classList.remove("visible");
    const onOver = (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) setText(t.dataset.cursor);
      else setText("hi 👋");
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);
  if (!enabled) return null;
  return <div ref={ref} className="cursor-sticker">{text}</div>;
}

// ---------- Floating sticker ----------
function FloatSticker({ children, top, left, right, bottom, rot = -8, color = "yellow", size = 14, anim = "anim" }) {
  const bg = {
    yellow: "var(--gr-yellow-500)",
    pink: "var(--gr-pink-500)",
    green: "var(--gr-green-500)",
    coral: "var(--gr-orange-500)",
    periwinkle: "var(--gr-purple-500)",
    gold: "var(--gr-gold-500)",
    white: "var(--gr-white)"
  }[color] || color;
  return (
    <div
      className={`float-sticker float-sticker--${anim}`}
      style={{
        top, left, right, bottom,
        "--r": `${rot}deg`,
        background: bg,
        color: color === "green" || color === "coral" ? "#fff" : "#000",
        border: "2px solid #000",
        padding: "8px 14px",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: `${size}px`,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        boxShadow: "4px 4px 0 0 #000",
        transform: `rotate(${rot}deg)`
      }}
    >
      {children}
    </div>
  );
}

// ---------- Marquee ----------
function Marquee({ items, speed = 28, variant = "" }) {
  const content = [...items, ...items, ...items];
  return (
    <div className={`marquee ${variant}`}>
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {content.map((item, i) => (
          <React.Fragment key={i}>
            <span>{item}</span>
            <span className="marquee__dot" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ---------- Nav ----------
function Nav() {
  return (
    <nav className="nav">
      <a href="#top" className="nav__logo">
        <span className="nav__badge">A</span>
        <span className="nav__wordmark-aer">aer</span>
        <span className="nav__wordmark-dot">.</span>
        <span className="nav__wordmark-app">app</span>
      </a>
      <div className="nav__links">
        <a className="nav__link" href="#team">Team</a>
        <a className="nav__link" href="#projects">Projects</a>
        <a className="nav__link" href="https://github.com/Team-AER" target="_blank" rel="noreferrer">GitHub ↗</a>
      </div>
    </nav>
  );
}

// ---------- Hero ----------
function Hero({ tweaks }) {
  const heroBg = {
    cream: "var(--gr-light-body)",
    pink: "var(--gr-pink-200)",
    yellow: "var(--gr-gold-200)",
    white: "var(--gr-white)"
  }[tweaks.heroBg] || "var(--gr-light-body)";

  const stickers = tweaks.stickerDensity;

  return (
    <section className="hero" id="top" style={{ background: heroBg }}>
      {stickers !== "none" && (
        <>
          <FloatSticker top="28%" right="9%" rot={8} color="yellow" size={14} anim="anim2">made for fun</FloatSticker>
          {stickers === "high" && <>
            <FloatSticker top="58%" right="14%" rot={-6} color="coral" size={13}>shipping</FloatSticker>
            <FloatSticker bottom="8%" right="6%" rot={-12} color="periwinkle" size={13} anim="anim2">3 repos</FloatSticker>
          </>}
        </>
      )}

      <div className="hero__counter">
        ⏱ uptime: 100% · pings: 0
      </div>

      <div className="wrap">
        <div className="kicker reveal" style={{ marginBottom: 20 }}>
          ✦ Team AER · est. 2025 · open source on the side
        </div>
        <h1 className="mega hero__title reveal" data-cursor="hover :)">
          <span className="word">Two</span>{" "}
          <span className="word">humans,</span>
          <br/>
          <span className="word"><span className="hero__pinkbar">passion</span></span>{" "}
          <span className="word">projects,</span>
          <br/>
          <span className="word">one</span>{" "}
          <span className="word"><span className="hero__yellowbar">domain</span>.</span>
        </h1>

        <div className="hero__sub reveal">
          <span className="pill">⚡ aer.app</span>
          <span className="pill">🛠 4 OSS repos</span>
          <span className="pill">🌎 building in public</span>
        </div>

        <p className="lede reveal" style={{ marginTop: 24 }}>
          We're <strong>Nidhi</strong> &amp; <strong>Prakhar</strong> — we have day jobs and an itch.
          AER is where we ship the things our day jobs won't let us.
          Subtitle generators, voice clones, AI music on Apple Silicon, prompt-mask layers. No roadmap, no investors, no slack channels named #growth.
        </p>

        <div className="hero__cta-row reveal">
          <a className="btn" href="#team" data-cursor="meet us">Meet the team →</a>
          <a className="btn btn--ghost" href="#projects" data-cursor="see code">See the projects</a>
          <a className="btn btn--black" href="https://github.com/Team-AER" target="_blank" rel="noreferrer" data-cursor="↗">GitHub</a>
        </div>
      </div>
    </section>
  );
}

// ---------- About / values ----------
function About() {
  return (
    <section className="section block-cream">
      <div className="wrap">
        <div className="kicker reveal">// what we're about</div>
        <h2 className="huge reveal" style={{ marginTop: 12, maxWidth: "16ch" }}>
          We make small things, with care, in our spare time.
        </h2>
        <p className="lede reveal" style={{ marginTop: 24 }}>
          AER isn't a startup. It's not a studio either. It's the GitHub org where two friends
          park weekend builds and the occasional "wait — does this exist yet?" experiment.
          Nothing here is monetized. Most of it is MIT.
        </p>

        <div className="values-grid reveal" style={{ marginTop: 48 }}>
          <div className="value">
            <div className="value__num">01 / passion</div>
            <h3 className="value__title">Builds, not blogs</h3>
            <p className="value__body">If we wrote about it, we built it first. Every repo is a working artifact, not a thought piece.</p>
          </div>
          <div className="value">
            <div className="value__num">02 / open</div>
            <h3 className="value__title">MIT &amp; chill</h3>
            <p className="value__body">Public by default. Fork it, break it, ship it under your name — we genuinely don't mind.</p>
          </div>
          <div className="value">
            <div className="value__num">03 / fun</div>
            <h3 className="value__title">No roadmap rules</h3>
            <p className="value__body">We work on what makes us laugh on a Sunday. The throughline is curiosity, not category.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Member section (bio only, no projects) ----------
function MemberSection({ member, idx }) {
  const accentBg = {
    pink: "var(--gr-pink-500)",
    yellow: "var(--gr-gold-500)",
    periwinkle: "var(--gr-purple-500)",
    green: "var(--gr-green-500)"
  }[member.accent];

  return (
    <section className={`section ${idx % 2 === 0 ? "block-cream" : ""}`} style={{ position: "relative", overflow: "hidden" }}>
      {idx === 0 && <FloatSticker top="8%" right="6%" rot={12} color="coral" size={13}>say hi 👋</FloatSticker>}
      {idx === 1 && <FloatSticker top="12%" left="4%" rot={-12} color="periwinkle" size={13} anim="anim2">voice nerd</FloatSticker>}

      <div className="wrap">
        <div className="kicker reveal" style={{ marginBottom: 16 }}>
          ✦ team member 0{idx + 1} of 0{MEMBERS.length}
        </div>
        <div
          className="member-card reveal"
          style={{ background: accentBg, color: member.accent === "green" ? "#fff" : "#000" }}
        >
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div className="avatar-blob" style={{ background: "var(--gr-white)", color: "#000" }}>
              {member.initials}
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span className="kicker">{member.role}</span>
                <span className="sticker-badge sticker-badge--periwinkle" style={{ fontSize: 11 }}>
                  {member.funFact}
                </span>
              </div>
              <h2 className="huge" style={{ marginTop: 8, fontSize: "clamp(40px, 7vw, 88px)" }}>
                {member.name}.
              </h2>
              <p className="lede" style={{ marginTop: 16, color: "inherit" }}>
                {member.blurb}
              </p>
              <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <a className="btn btn--black" href={member.linkedin} target="_blank" rel="noreferrer" data-cursor="linkedin">
                  LinkedIn ↗
                </a>
                <a className="btn btn--ghost" href={member.github} target="_blank" rel="noreferrer" data-cursor="github">
                  GitHub ↗
                </a>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, opacity: 0.6 }}>
                  {member.projects.length} project{member.projects.length !== 1 ? "s" : ""} ↓
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Enhanced project card ----------
function ProjectCard({ p, projKey, index }) {
  const [hovered, setHovered] = useState(false);

  const darkColors = ["var(--gr-green-500)", "var(--gr-orange-500)"];
  const textColor = darkColors.includes(p.color) ? "#fff" : "#000";

  const authors = MEMBERS.filter(m => m.projects.includes(projKey));

  return (
    <div
      className="proj-card reveal"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Colored header band */}
      <div className="proj-card__head" style={{ background: p.color, color: textColor }}>
        <div className="proj-card__glyph">{p.glyph}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.75
            }}>▸ {p.lang}</span>
            <span style={{
              background: "rgba(0,0,0,0.15)",
              border: `1.5px solid ${textColor}`,
              padding: "2px 8px",
              fontFamily: "var(--font-mono)",
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: 2
            }}>{p.sticker}</span>
          </div>
          <h3 className="proj-card__title">{p.title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="proj-card__body">
        <p className="proj-card__tagline">{p.tagline}</p>
        <p className="proj-card__desc">{p.body}</p>

        {/* Author chips */}
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
          {authors.map(a => (
            <span key={a.handle} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--gr-light-body)",
              border: "1.5px solid var(--gr-black)",
              borderRadius: 9999,
              padding: "4px 10px",
              fontFamily: "var(--font-mono)",
              fontSize: 11, fontWeight: 700
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                background: a.accent === "pink" ? "var(--gr-pink-500)" : "var(--gr-gold-500)",
                border: "1.5px solid #000",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 800
              }}>{a.initials}</span>
              {a.name.split(" ")[0]}
            </span>
          ))}
        </div>

        <div className="proj-card__cta-row">
          <a href={p.url} target="_blank" rel="noreferrer" className="proj-card__cta" onClick={e => e.stopPropagation()}>
            View on GitHub <span style={{ display: "inline-block", transition: "transform 200ms", transform: hovered ? "translateX(4px)" : "translateX(0)" }}>→</span>
          </a>
          {p.releases && (
            <a href={p.releases} target="_blank" rel="noreferrer" className="proj-card__download" onClick={e => e.stopPropagation()}>
              ↓ Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="footer" id="contact">
      <FloatSticker top="14%" right="8%" rot={-10} color="yellow" size={13}>say hi.</FloatSticker>
      <div className="wrap" style={{ position: "relative" }}>
        <div className="kicker" style={{ color: "var(--gr-pink-500)" }}>// /etc/contact</div>
        <h2 className="footer__big">aer.app</h2>
        <p className="lede" style={{ marginTop: 24, color: "var(--gr-white)", maxWidth: "60ch" }}>
          That's the whole site. If you got this far, you should probably{" "}
          <a href="https://github.com/Team-AER" target="_blank" rel="noreferrer">star a repo</a>{" "}
          or just tell us hi on LinkedIn. We promise to write back.
        </p>

        <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn btn--yellow" href="https://github.com/Team-AER" target="_blank" rel="noreferrer">★ Star us on GitHub</a>
          <a className="btn" href="mailto:hello@aer.app">hello@aer.app</a>
        </div>

        <div className="footer__row">
          <span>© {new Date().getFullYear()} Team AER · Built with affection &amp; hard shadows.</span>
          <span>
            <a href="https://www.linkedin.com/in/nidhibharani/" target="_blank" rel="noreferrer">Nidhi</a>
            {" · "}
            <a href="https://www.linkedin.com/in/prakharshukla/" target="_blank" rel="noreferrer">Prakhar</a>
            {" · "}
            <a href="https://github.com/Team-AER" target="_blank" rel="noreferrer">GitHub</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ---------- Tweaks panel ----------
function AERTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Hero">
        <TweakSelect
          label="Hero background"
          value={tweaks.heroBg}
          onChange={(v) => setTweak("heroBg", v)}
          options={[
            { value: "cream", label: "Cream (default)" },
            { value: "pink", label: "Soft pink" },
            { value: "yellow", label: "Soft gold" },
            { value: "white", label: "White" }
          ]}
        />
        <TweakRadio
          label="Sticker density"
          value={tweaks.stickerDensity}
          onChange={(v) => setTweak("stickerDensity", v)}
          options={[
            { value: "none", label: "None" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "Lots" }
          ]}
        />
      </TweakSection>
      <TweakSection title="Motion">
        <TweakSlider
          label="Marquee speed (s)"
          min={10} max={60} step={1}
          value={tweaks.marqueeSpeed}
          onChange={(v) => setTweak("marqueeSpeed", v)}
        />
        <TweakToggle
          label="Cursor sticker"
          value={tweaks.showCursorSticker}
          onChange={(v) => setTweak("showCursorSticker", v)}
        />
        <TweakToggle
          label="Show marquee"
          value={tweaks.showMarquee}
          onChange={(v) => setTweak("showMarquee", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// ---------- App ----------
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  const marqueeItems = ["Two humans", "Four repos", "One domain", "Open source", "MIT &amp; chill", "Built for fun", "aer.app", "★ Team AER"];

  return (
    <>
      <Nav />
      <Hero tweaks={tweaks} />

      {tweaks.showMarquee && (
        <Marquee
          items={marqueeItems}
          speed={tweaks.marqueeSpeed}
          variant="marquee--black"
        />
      )}

      <About />

      <div className="divider" />

      <section className="section--sm block-pink" style={{ borderTop: "2px solid #000", borderBottom: "2px solid #000", padding: "48px 0", position: "relative", overflow: "hidden" }}>
        <div className="wrap">
          <h2 className="huge" style={{ textAlign: "center" }}>
            Meet the cast.
          </h2>
          <p className="lede" style={{ textAlign: "center", margin: "16px auto 0", color: "#000" }}>
            Two people. Different timezones. Same group chat.
          </p>
        </div>
      </section>

      <div id="team" />
      {MEMBERS.map((m, i) => (
        <MemberSection key={m.handle} member={m} idx={i} />
      ))}

      {tweaks.showMarquee && (
        <Marquee
          items={["Subtly", "PolyJuiceVoice", "PromptMask", "Cantis", "fork it", "break it", "ship it"]}
          speed={tweaks.marqueeSpeed + 6}
          variant="marquee--yellow marquee--reverse"
        />
      )}

      <section className="section block-cream" id="projects">
        <div className="wrap">
          <div className="kicker reveal">// the lab notebook</div>
          <h2 className="huge reveal" style={{ marginTop: 12, maxWidth: "16ch" }}>
            All the projects, in one place.
          </h2>
          <p className="lede reveal" style={{ marginTop: 20 }}>
            Four repos so far. Each one was an itch we couldn't ignore for a weekend.
            Click in, kick the tires, open an issue — we read everything.
          </p>

          <div className="proj-cards-grid" style={{ marginTop: 48 }}>
            {Object.entries(PROJECTS).map(([key, p], i) => (
              <ProjectCard key={key} p={p} projKey={key} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <CursorSticker enabled={tweaks.showCursorSticker} />
      <AERTweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
