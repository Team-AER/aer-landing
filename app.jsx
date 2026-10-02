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
    projects: ["subtly", "promptmask"],
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
    projects: ["pensieve", "hedwig", "quill", "accio", "erised", "cantis", "polyjuicevoice", "avifors", "athena", "omniocular"],
    funFact: "Has opinions about microphones"
  }
];

// Every app Team AER ships. `page` is the app's own landing page (same origin
// for the newer apps, its own subdomain for Cantis and PolyJuiceVoice);
// `code` is the public repo, absent for private ones. `pal` is the app's own
// palette and drives its mini window: bg, ink, accent, second accent.
const PROJECT_GROUPS = [
  {
    id: "read", num: "01", title: "Read & write", bar: "var(--gr-pink-500)",
    items: [
      { key: "pensieve", title: "Pensieve", page: "/pensieve/", code: "https://github.com/Team-AER/pensieve",
        line: "A feed reader with a daily paper ranked by what you actually read, and a memory of it.",
        meta: ["Self-hosted", "Reeder sync", "MIT"], pal: ["#F3F1EA", "#1B1A17", "#2E5E78", "#3E7C6E"], mini: "pensieve" },
      { key: "hedwig", title: "Hedwig", page: "/hedwig/", code: "https://github.com/Team-AER/hedwig",
        line: "A unified, self-hosted webmail client. Every inbox in one quiet window, mail rendered as sent.",
        meta: ["Self-hosted", "IMAP, Gmail, M365", "AGPL-3.0"], pal: ["#EEF0F3", "#1D1D1F", "#007AFF", "#E0561A"], mini: "hedwig" },
      { key: "quill", title: "Quill", page: "/quill/", code: "https://github.com/Team-AER/quill",
        line: "Meeting transcription for small teams: speakers told apart on CPU, key slides, grounded notes.",
        meta: ["Self-hosted", "CPU only", "MIT"], pal: ["#0D1218", "#E9EEF5", "#007AFF", "#ff9a5c"], mini: "quill", dark: true },
      { key: "accio", title: "Accio", page: "/accio/", private: true,
        line: "A local-first deep-research agent. Seven agents read your files and the web and write a cited report.",
        meta: ["Local-first", "Your own LLM endpoint", "MIT"], pal: ["#050505", "#F2F2F2", "#00F0FF", "#ED1E79"], mini: "accio", dark: true }
    ]
  },
  {
    id: "play", num: "02", title: "Play & make", bar: "var(--gr-gold-500)",
    items: [
      { key: "erised", title: "Erised", page: "/erised/", private: true,
        line: "An illustrated, AI-led adventure for phones and desktops. Tell the mirror what you want.",
        meta: ["Solo or party of four", "Local models"], pal: ["#111D2D", "#DCE6ED", "#C9B78A", "#17283A"], mini: "erised", dark: true },
      { key: "cantis", title: "Cantis", page: "https://cantis.aer.app", site: "cantis.aer.app", code: "https://github.com/Team-AER/Cantis",
        line: "AI music generation as a native macOS app. ACE-Step on Apple Silicon, no Python, no cloud.",
        meta: ["macOS", "On-device", "MIT"], pal: ["#0A0A0E", "#FFFFFF", "#8B7CFF", "#2A2A36"], mini: "cantis", dark: true },
      { key: "polyjuicevoice", title: "PolyJuiceVoice", page: "https://polyjuicevoice.aer.app", site: "polyjuicevoice.aer.app", code: "https://github.com/Team-AER/PolyJuiceVoice",
        line: "Any voice you can describe, clone or imagine. On-device text-to-speech for macOS.",
        meta: ["macOS", "On-device", "MIT"], pal: ["#08080A", "#FFFFFF", "#1DA7FF", "#23232A"], mini: "pjv", dark: true },
      { key: "subtly", title: "Subtly", page: "/subtly/", code: "https://github.com/Team-AER/Subtly",
        line: "Subtitles for your own videos, generated with Whisper on your GPU. Nothing leaves the machine.",
        meta: ["macOS, Windows, Linux", "One Rust binary", "MIT"], pal: ["#0B0F1A", "#F3F4F6", "#F97316", "#38BDF8"], mini: "subtly", dark: true }
    ]
  },
  {
    id: "run", num: "03", title: "Run & secure", bar: "var(--gr-purple-500)",
    items: [
      { key: "avifors", title: "Avifors", page: "/avifors/", code: "https://github.com/Team-AER/avifors",
        line: "Demand-loaded GPU inference: vLLM, image and speech workers share one card under bounded leases.",
        meta: ["Python", "One GPU, many models", "MIT"], pal: ["#121417", "#E6E8EB", "#FFB020", "#2DD4BF"], mini: "avifors", dark: true },
      { key: "athena", title: "Athena Sandbox", page: "/athena/", private: true,
        line: "A local malware-analysis portal: disconnected guests, static tooling, and AI that must cite its evidence.",
        meta: ["Self-hosted", "Linux + Windows guests"], pal: ["#F4F6FB", "#17233F", "#315BD6", "#8050BE"], mini: "athena" },
      { key: "omniocular", title: "Omniocular", page: "/omniocular/", private: true,
        line: "A pocket Wi-Fi auditor on a Pi Zero 2 W, driven over authenticated Bluetooth. Authorized testing only.",
        meta: ["Pi Zero 2 W", "Flutter app", "MIT"], pal: ["#EFEDE6", "#15171A", "#FF6A00", "#0082FC"], mini: "omni" },
      { key: "promptmask", title: "PromptMask", page: "https://github.com/Team-AER/PromptMask-legal", site: "GitHub", code: "https://github.com/Team-AER/PromptMask-legal",
        line: "Mask the sensitive bits of a prompt on-device before any model sees them. Built for legal work.",
        meta: ["Chrome extension", "On-device Gemma", "MIT"], pal: ["#FFFFFF", "#000000", "#23A094", "#D3F3F0"], mini: "mask" }
    ]
  }
];
const ALL_PROJECTS = PROJECT_GROUPS.flatMap(g => g.items);

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
function FloatSticker({ children, top, left, right, bottom, rot = -8, color = "yellow", size = 14, anim = "anim", className = "" }) {
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
      className={`float-sticker float-sticker--${anim} ${className}`}
      aria-hidden="true"
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
      <div className="wrap hero__stickers" aria-hidden="true">
      {stickers !== "none" && (
        <>
          <FloatSticker top="30%" right="32px" rot={8} color="yellow" size={14} anim="anim2" className="float-sticker--hero">made for fun</FloatSticker>
          {stickers === "high" && <>
            <FloatSticker top="58%" right="14%" rot={-6} color="coral" size={13}>shipping</FloatSticker>
            <FloatSticker bottom="8%" right="6%" rot={-12} color="periwinkle" size={13} anim="anim2">3 repos</FloatSticker>
          </>}
        </>
      )}
        <div className="hero__counter">
          ⏱ uptime: 100% · pings: 0
        </div>
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
          <span className="pill">🛠 {ALL_PROJECTS.length} projects</span>
          <span className="pill">🌎 building in public</span>
        </div>

        <p className="lede reveal" style={{ marginTop: 24 }}>
          We're <strong>Nidhi</strong> &amp; <strong>Prakhar</strong> — we have day jobs and an itch.
          AER is where we ship the things our day jobs won't let us.
          Feed readers, mail, meeting notes, AI music on Apple Silicon, voice clones, a GPU scheduler, a malware lab. No roadmap, no investors, no slack channels named #growth.
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
          park weekend builds and the occasional “wait — does this exist yet?” experiment.
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
      {idx === 0 && <FloatSticker top="40px" right="5%" rot={12} color="coral" size={13} className="float-sticker--member">say hi 👋</FloatSticker>}
      {idx === 1 && <FloatSticker top="40px" right="5%" rot={-8} color="periwinkle" size={13} anim="anim2" className="float-sticker--member">voice nerd</FloatSticker>}

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
                <a className="member-card__count" href="#projects">
                  {member.projects.length} project{member.projects.length !== 1 ? "s" : ""} ↓
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- App tiles ----------
// A miniature of each app's real layout, drawn in its own palette.
function Mini({ kind }) {
  const bars = (n, shortAt = []) => Array.from({ length: n }, (_, i) => <b key={i} className={shortAt.includes(i) ? "m-short" : undefined} />);
  switch (kind) {
    case "pensieve": return (
      <div className="mini mini--reader">
        <div className="m-rail"><b /><b /><b /><b /></div>
        <div className="m-list"><div className="m-row m-row--hot" /><div className="m-row" /><div className="m-row" /><div className="m-row m-row--dim" /><div className="m-row" /></div>
        <div className="m-article"><b className="m-h" />{bars(3, [2])}</div>
      </div>);
    case "hedwig": return (
      <div className="mini mini--reader">
        <div className="m-rail m-rail--glass"><b /><b /><b /></div>
        <div className="m-list"><div className="m-row m-row--av" /><div className="m-row m-row--av m-row--sel" /><div className="m-row m-row--av" /><div className="m-row m-row--av" /></div>
        <div className="m-article m-article--sheet"><b className="m-h" />{bars(3, [2])}</div>
      </div>);
    case "quill": return (
      <div className="mini mini--quill">
        {[["#ff9a5c", 2], ["#4cd6a1", 1], ["#c89bff", 2], ["#e3c14a", 1]].map(([c, n], i) => (
          <div key={i} className="m-turn" style={{ "--s": c }}>{bars(n, n === 2 ? [1] : i === 3 ? [0] : [])}</div>
        ))}
        <div className="m-slides"><b /><b /><b /></div>
      </div>);
    case "accio": return (
      <div className="mini mini--accio">
        <div className="m-relay">{[0, 1, 2, 3, 4, 5, 6].map(i => <i key={i} className={i < 3 ? "done" : i === 3 ? "on" : undefined} />)}</div>
        <div className="m-console">{bars(4, [1, 3])}</div>
      </div>);
    case "erised": return (
      <div className="mini mini--erised">
        <div className="m-arch"><span /></div>
        <div className="m-prose">{bars(3, [2])}</div>
        <div className="m-choices"><b /><b /><b /></div>
      </div>);
    case "cantis": return (
      <div className="mini mini--cantis">
        <div className="m-wave">{Array.from({ length: 18 }, (_, i) => <i key={i} />)}</div>
        <div className="m-prose">{bars(2, [1])}</div>
      </div>);
    case "pjv": return (
      <div className="mini mini--pjv">
        <div className="m-mic" />
        <div className="m-wave m-wave--line">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</div>
      </div>);
    case "subtly": return (
      <div className="mini mini--subtly">
        <div className="m-frame"><b className="m-cap" /></div>
        <b className="m-wavebar" />
      </div>);
    case "avifors": return (
      <div className="mini mini--avifors">
        <div className="m-gantt">
          <b style={{ "--l": "4%", "--w": "38%" }} /><b style={{ "--l": "30%", "--w": "30%", "--c": "var(--t-2)" }} />
          <b style={{ "--l": "52%", "--w": "44%" }} /><b style={{ "--l": "10%", "--w": "22%", "--c": "var(--t-2)" }} />
        </div>
      </div>);
    case "athena": return (
      <div className="mini mini--athena">
        <div className="m-tree"><b /><b className="m-ind" /><b className="m-ind m-ind--2" /><b className="m-ind" /></div>
        <div className="m-table"><b /><b /><b className="m-flag" /><b /></div>
      </div>);
    case "omni": return (
      <div className="mini mini--omni">
        <div className="m-board"><i /><i /></div>
        <div className="m-ble" />
        <div className="m-phone">{bars(4, [3])}</div>
      </div>);
    case "mask": return (
      <div className="mini mini--mask">
        <div className="m-prose"><b /><b className="m-redact" /><b /><b className="m-redact m-short" /></div>
      </div>);
    default: return null;
  }
}

function AppTile({ p }) {
  const external = /^https?:/.test(p.page);
  const authors = MEMBERS.filter(m => m.projects.includes(p.key));
  const [bg, ink, acc, two] = p.pal;
  const go = !external ? "View page" : p.site === "GitHub" ? "View on GitHub" : "Visit site";
  return (
    <li className="app-tile" style={{ "--t-bg": bg, "--t-ink": ink, "--t-acc": acc, "--t-2": two }}>
      <div className={`app-win${p.dark ? " app-win--dark" : ""}`} aria-hidden="true">
        <div className="app-win__bar"><i /><i /><i /></div>
        <Mini kind={p.mini} />
      </div>
      {p.private && <span className="app-tile__badge">Private</span>}
      <div className="app-tile__body">
        <h4 className="app-tile__title">
          <a className="app-tile__link" href={p.page} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} data-cursor={external ? "↗" : "open"}>
            {p.title}{external && <span className="sr-only"> (opens {p.site})</span>}
          </a>
        </h4>
        <p className="app-tile__line">{p.line}</p>
        <ul className="app-tile__meta">{p.meta.map(m => <li key={m}>{m}</li>)}</ul>
        <div className="app-tile__foot">
          <span className="app-tile__go" aria-hidden="true">{go} <span className="app-tile__arrow">{external ? "↗" : "→"}</span></span>
          <span className="app-tile__by">
            {authors.map(a => (
              <span key={a.handle} className={`app-tile__av app-tile__av--${a.accent}`} title={`By ${a.name}`}>{a.initials}</span>
            ))}
          </span>
        </div>
      </div>
    </li>
  );
}

function AppGroup({ g }) {
  return (
    <div className="app-group" id={g.id}>
      <div className="app-group__head">
        <h3 className="app-group__title"><span className="app-group__bar" style={{ background: g.bar }}>{g.title}</span></h3>
        <span className="app-group__count">{g.items.length} apps<span className="app-group__swipe" aria-hidden="true"> · swipe →</span></span>
      </div>
      <ul className="app-grid">
        {g.items.map(p => <AppTile key={p.key} p={p} />)}
      </ul>
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
  // The page renders after the browser has already tried to jump to the URL
  // hash (app pages link back to /#projects), so honour it once we exist.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (el) el.scrollIntoView();
  }, []);

  const marqueeItems = ["Two humans", "Twelve projects", "One domain", "Open source", "MIT & chill", "Built for fun", "aer.app", "★ Team AER"];

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
          items={[...ALL_PROJECTS.map(p => p.title), "fork it", "break it", "ship it"]}
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
            Twelve so far. Each one was an itch we couldn’t ignore for a weekend, and each now has a page
            in its own colours showing the real thing. Click in, kick the tires, open an issue — we read everything.
          </p>
          <ul className="apps-facts reveal" aria-label="At a glance">
            <li><strong>{ALL_PROJECTS.length}</strong> projects</li>
            <li><strong>{ALL_PROJECTS.filter(p => p.code).length}</strong> public repos</li>
            <li><strong>{ALL_PROJECTS.filter(p => p.private).length}</strong> private, ask for access</li>
          </ul>

          {PROJECT_GROUPS.map(g => <AppGroup key={g.id} g={g} />)}
        </div>
      </section>

      <Footer />

      <CursorSticker enabled={tweaks.showCursorSticker} />
      <AERTweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
