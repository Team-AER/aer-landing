// AER landing — main React app
const { useState, useEffect, useRef } = React;

// Motion is opt-in: the hidden "before" states only apply under html.motion,
// so reduced-motion visitors (and anything that fails before this line) get
// every final state immediately.
const MOTION = !window.matchMedia || !matchMedia("(prefers-reduced-motion: reduce)").matches;
if (MOTION) document.documentElement.classList.add("motion");

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
// People. Who built what lives on each project (`authors`), never here, so a
// member's project list and count are always derived from the catalogue.
const MEMBERS = [
  {
    id: "nidhi",
    name: "Nidhi Bharani",
    first: "Nidhi",
    role: "Builder · Researcher",
    blurb: "Likes shipping fast, breaking expectations slower. Splits time between making things people use and writing about why they should.",
    accent: "pink",
    initials: "NB",
    linkedin: "https://www.linkedin.com/in/nidhibharani/",
    github: "https://github.com/nidhibharani",
    funFact: "Turns coffee into commits"
  },
  {
    id: "prakhar",
    name: "Prakhar Shukla",
    first: "Prakhar",
    role: "Tinkerer · Engineer",
    blurb: "Obsessed with the seams between things — voice, language, models. If it talks back, he probably wants to clone it.",
    accent: "yellow",
    initials: "PS",
    linkedin: "https://www.linkedin.com/in/prakharshukla/",
    github: "https://github.com/prafiles",
    funFact: "Has opinions about microphones"
  }
];
const MEMBER_BY_ID = Object.fromEntries(MEMBERS.map(m => [m.id, m]));

// Every app Team AER ships. `page` is the app's own landing page (same origin
// for every project, including Cantis and PolyJuiceVoice);
// `code` is the public repo, absent for private ones. `authors` are MEMBERS
// ids in commit-authorship order. `credit` names upstream work a project is
// built on. `pal` is the app's own palette and drives its mini window: bg,
// ink, accent, second accent.
const PROJECT_GROUPS = [
  {
    id: "read", num: "01", title: "Read & write", bar: "var(--gr-pink-500)",
    items: [
      { key: "pensieve", title: "Pensieve", page: "/pensieve/", code: "https://github.com/Team-AER/pensieve", authors: ["prakhar"],
        line: "A feed reader with a daily paper ranked by what you actually read, and a memory of it.",
        meta: ["Self-hosted", "Reeder sync", "MIT"], pal: ["#F3F1EA", "#1B1A17", "#2E5E78", "#3E7C6E"], mini: "pensieve" },
      { key: "hedwig", title: "Hedwig", page: "/hedwig/", code: "https://github.com/Team-AER/hedwig", authors: ["prakhar"],
        credit: { what: "Fork of MailFlow", by: "@maathimself", href: "https://github.com/maathimself/mailflow" },
        line: "A unified, self-hosted webmail client. Every inbox in one quiet window, mail rendered as sent.",
        meta: ["Self-hosted", "IMAP, Gmail, M365", "AGPL-3.0"], pal: ["#EEF0F3", "#1D1D1F", "#007AFF", "#E0561A"], mini: "hedwig" },
      { key: "quill", title: "Quill", page: "/quill/", code: "https://github.com/Team-AER/quill", authors: ["prakhar"],
        line: "Meeting transcription for small teams: speakers told apart on CPU, key slides, grounded notes.",
        meta: ["Self-hosted", "CPU diarization", "MIT"], pal: ["#0D1218", "#E9EEF5", "#007AFF", "#ff9a5c"], mini: "quill", dark: true },
      { key: "accio", title: "Accio", page: "/accio/", private: true, authors: ["prakhar"],
        line: "A local-first deep-research agent. Seven agents read your files and the web and write a cited report.",
        meta: ["Local-first", "Your own LLM endpoint", "MIT"], pal: ["#050505", "#F2F2F2", "#00F0FF", "#ED1E79"], mini: "accio", dark: true }
    ]
  },
  {
    id: "play", num: "02", title: "Play & make", bar: "var(--gr-gold-500)",
    items: [
      { key: "erised", title: "Erised", page: "/erised/", private: true, authors: ["prakhar"],
        line: "An illustrated, AI-led adventure for phones and desktops. Tell the mirror what you want.",
        meta: ["Solo or party of four", "Self-hosted"], pal: ["#111D2D", "#DCE6ED", "#C9B78A", "#17283A"], mini: "erised", dark: true },
      { key: "cantis", title: "Cantis", page: "/cantis/", code: "https://github.com/Team-AER/Cantis", authors: ["prakhar"],
        line: "AI music generation as a native macOS app. ACE-Step on Apple Silicon, no Python, no cloud.",
        meta: ["macOS", "On-device", "MIT"], pal: ["#08080A", "#FFFFFF", "#1F5CFF", "#FF5B9C"], mini: "cantis", dark: true },
      { key: "polyjuicevoice", title: "PolyJuiceVoice", page: "/polyjuicevoice/", code: "https://github.com/Team-AER/PolyJuiceVoice", authors: ["prakhar"],
        line: "Any voice you can describe, clone or imagine. On-device text-to-speech for macOS.",
        meta: ["macOS", "On-device", "MIT"], pal: ["#08080A", "#FFFFFF", "#1DA7FF", "#23232A"], mini: "pjv", dark: true },
      { key: "subtly", title: "Subtly", page: "/subtly/", code: "https://github.com/Team-AER/Subtly", authors: ["prakhar"],
        line: "Subtitles for your own videos, generated with Whisper on your GPU. Nothing leaves the machine.",
        meta: ["macOS, Windows, Linux", "One Rust binary", "MIT"], pal: ["#0B0F1A", "#F3F4F6", "#F97316", "#38BDF8"], mini: "subtly", dark: true }
    ]
  },
  {
    id: "run", num: "03", title: "Run & secure", bar: "var(--gr-purple-500)",
    items: [
      { key: "avifors", title: "Avifors", page: "/avifors/", code: "https://github.com/Team-AER/avifors", authors: ["prakhar"],
        line: "Demand-loaded GPU inference: vLLM, image and speech workers share one card under bounded leases.",
        meta: ["Python", "One GPU, many models", "MIT"], pal: ["#121417", "#E6E8EB", "#FFB020", "#2DD4BF"], mini: "avifors", dark: true },
      { key: "athena", title: "Athena Sandbox", page: "/athena/", private: true, authors: ["prakhar"],
        line: "A local malware-analysis portal: disconnected guests, static tooling, and AI that must cite its evidence.",
        meta: ["Self-hosted", "Linux + Windows guests"], pal: ["#F4F6FB", "#17233F", "#315BD6", "#8050BE"], mini: "athena" },
      { key: "omniocular", title: "Omniocular", page: "/omniocular/", private: true, authors: ["prakhar"],
        line: "A pocket Wi-Fi auditor on a Pi Zero 2 W, driven over authenticated Bluetooth. Authorized testing only.",
        meta: ["Pi Zero 2 W", "Flutter app", "MIT"], pal: ["#EFEDE6", "#15171A", "#FF6A00", "#0082FC"], mini: "omni" },
      { key: "promptmask", title: "PromptMask", page: "/promptmask/", private: true, authors: ["nidhi"],
        line: "Masks names, emails and ID numbers in your prompt on-device, before ChatGPT, Claude or Gemini sees it.",
        meta: ["Chrome extension", "On-device Gemma 4", "5 chat sites"], pal: ["#FFFFFF", "#000000", "#23A094", "#D3F3F0"], mini: "mask" }
    ]
  }
];
const ALL_PROJECTS = PROJECT_GROUPS.flatMap(g => g.items);
const PUBLIC_COUNT = ALL_PROJECTS.filter(p => p.code).length;
const PRIVATE_COUNT = ALL_PROJECTS.filter(p => p.private).length;
const projectsBy = (id) => ALL_PROJECTS.filter(p => p.authors.includes(id));
const authorsOf = (p) => p.authors.map(id => MEMBER_BY_ID[id]).filter(Boolean);
const NUM_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];
const numWord = (n) => NUM_WORDS[n] || String(n);
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
// "Prakhar", "Nidhi & Prakhar", "Nidhi, Prakhar & 1 more"
const firstNames = (ms) => ms.length <= 2 ? ms.map(m => m.first).join(" & ") : `${ms[0].first}, ${ms[1].first} & ${ms.length - 2} more`;
const fullNames = (ms) => ms.length <= 1 ? (ms[0] ? ms[0].name : "") : ms.slice(0, -1).map(m => m.name).join(", ") + " and " + ms[ms.length - 1].name;

// ---------- Reveal-on-scroll ----------
// Anything with .rise gets .is-in once it is on screen. Elements that arrive in
// the same observer batch are staggered (--d), so a row of tiles or a run of
// headings comes in as a sequence rather than all at once.
function useReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll(".rise:not(.is-in), .reveal:not(.is-in)")];
    if (!MOTION || !("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      const hits = entries.filter(e => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left));
      hits.forEach((e, k) => {
        if (!e.target.style.getPropertyValue("--d")) e.target.style.setProperty("--d", `${Math.min(k, 6) * 80}ms`);
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// Counts up to `to` once visible. The real number is always what renders
// first, so no-JS, reduced motion and screen readers read the final value.
function CountUp({ to }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!MOTION || !el || !("IntersectionObserver" in window) || to < 2) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 700;
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      el.textContent = "0";
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.textContent = to; };
  }, [to]);
  return <strong ref={ref}>{to}</strong>;
}

// ---------- Cursor sticker ----------
function CursorSticker({ enabled }) {
  const ref = useRef(null);
  const [text, setText] = useState("hi :)");
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      if (!ref.current || e.pointerType === "touch") return;
      ref.current.style.left = e.clientX + "px";
      ref.current.style.top = (e.clientY - 24) + "px";
      ref.current.classList.add("visible");
    };
    const onLeave = () => ref.current && ref.current.classList.remove("visible");
    const onOver = (e) => {
      const t = e.target.closest("[data-cursor]");
      setText(t ? t.dataset.cursor : "hi :)");
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);
  if (!enabled) return null;
  return <div ref={ref} className="cursor-sticker" aria-hidden="true">{text}</div>;
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
// Two identical halves, each padded by one gap, so translateX(-50%) lands
// exactly on the seam. Pauses while off screen.
function Marquee({ items, speed = 28, variant = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-off", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const half = [...items, ...items];
  const group = (k) => (
    <div className="marquee__group" key={k}>
      {half.map((item, i) => (
        <React.Fragment key={i}>
          <span className="marquee__item">{item}</span>
          <span className="marquee__dot" />
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div ref={ref} className={`marquee ${variant}`} aria-hidden="true">
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {group("a")}{group("b")}
      </div>
    </div>
  );
}

// ---------- Nav ----------
function Nav() {
  return (
    <nav className="nav" aria-label="Main">
      <a href="#top" className="nav__logo">
        <img className="nav__badge" src="/assets/brand/icon-192-20261010.png" width="44" height="44" alt="" />
        <span className="nav__wordmark-aer">aer</span>
        <span className="nav__wordmark-dot">.</span>
        <span className="nav__wordmark-app">app</span>
      </a>
      <div className="nav__links">
        <a className="nav__link" href="#team">Team</a>
        <a className="nav__link" href="#projects">Projects</a>
        <a className="nav__link" href="https://github.com/Team-AER" target="_blank" rel="noreferrer">GitHub ↗</a>
      </div>
      <span className="nav__progress" aria-hidden="true" />
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
  let w = 0; // word index for the headline stagger
  const word = (children) => <span className="word" style={{ "--i": w++ }}>{children}</span>;

  return (
    <section className="hero" id="top" style={{ background: heroBg }}>
      <div className="wrap hero__stickers" aria-hidden="true">
      {stickers !== "none" && (
        <>
          <FloatSticker top="30%" right="32px" rot={8} color="yellow" size={14} anim="anim2" className="float-sticker--hero">made for fun</FloatSticker>
          {stickers === "high" && <>
            <FloatSticker top="58%" right="14%" rot={-6} color="coral" size={13}>shipping</FloatSticker>
            <FloatSticker bottom="8%" right="6%" rot={-12} color="periwinkle" size={13} anim="anim2">{plural(PUBLIC_COUNT, "repo")}</FloatSticker>
          </>}
        </>
      )}
        <div className="hero__counter">
          <i className="hero__live" /> uptime: 100% · pings: 0
        </div>
      </div>

      <div className="wrap">
        <div className="kicker hero__kicker rise" style={{ "--d": "0ms" }}>
          ✦ Team AER · est. 2025 · open source on the side
        </div>
        <h1 className="mega hero__title" data-cursor="hover :)">
          {word("Two")}{" "}
          {word("humans,")}
          <br/>
          {word(<span className="hero__pinkbar">passion</span>)}{" "}
          {word("projects,")}
          <br/>
          {word("one")}{" "}
          {word(<><span className="hero__yellowbar">domain</span>.</>)}
        </h1>

        <ul className="hero__sub rise" aria-label="At a glance" style={{ "--d": "520ms" }}>
          <li className="pill" style={{ "--i": 0 }}><i className="pill__dot" style={{ background: "var(--gr-pink-500)" }} />{plural(ALL_PROJECTS.length, "project")}</li>
          <li className="pill" style={{ "--i": 1 }}><i className="pill__dot" style={{ background: "var(--gr-gold-500)" }} />{PUBLIC_COUNT} public repos</li>
          <li className="pill pill--extra" style={{ "--i": 2 }}><i className="pill__dot" style={{ background: "var(--gr-green-500)" }} />building in public</li>
        </ul>

        <p className="lede rise" style={{ marginTop: 24, "--d": "620ms" }}>
          We're <strong>Nidhi</strong> &amp; <strong>Prakhar</strong> — we have day jobs and an itch.
          AER is where we ship the things our day jobs won't let us.
          Feed readers, mail, meeting notes, AI music on Apple Silicon, voice clones, a GPU scheduler, a malware lab. No roadmap, no investors, no slack channels named #growth.
        </p>

        <div className="hero__cta-row rise" style={{ "--d": "720ms" }}>
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
  const values = [
    ["01 / passion", "Builds, not blogs", "If we wrote about it, we built it first. Every repo is a working artifact, not a thought piece."],
    ["02 / open", "MIT & chill", "Public by default. Fork it, break it, ship it under your name — we genuinely don't mind."],
    ["03 / fun", "No roadmap rules", "We work on what makes us laugh on a Sunday. The throughline is curiosity, not category."]
  ];
  return (
    <section className="section section--about block-cream">
      <div className="wrap">
        <div className="kicker rise">// what we're about</div>
        <h2 className="huge rise" style={{ marginTop: 12, maxWidth: "16ch" }}>
          We make small things, with care, in our spare time.
        </h2>
        <p className="lede rise" style={{ marginTop: 24 }}>
          AER isn't a startup. It's not a studio either. It's the GitHub org where two friends
          park weekend builds and the occasional “wait — does this exist yet?” experiment.
          Nothing here is monetized. Most of it is MIT.
        </p>

        <div className="values-grid rise">
          {values.map(([num, title, body], i) => (
            <div className="value" key={num} style={{ "--i": i }}>
              <div className="value__num">{num}</div>
              <h3 className="value__title">{title}</h3>
              <p className="value__body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Overlapping avatar stack ----------
function AvatarStack({ people, size = "sm" }) {
  return (
    <span className={`avstack avstack--${size}`} title={`By ${fullNames(people)}`}>
      {people.map((a, i) => (
        <span key={a.id} className={`avstack__av avstack__av--${a.accent}`} style={{ "--k": i, zIndex: people.length - i }} aria-hidden="true">{a.initials}</span>
      ))}
    </span>
  );
}

// ---------- Cast intro band ----------
function CastBand() {
  return (
    <section className="cast block-pink">
      <div className="wrap">
        <div className="cast__stack rise" aria-hidden="true">
          {MEMBERS.map((m, i) => (
            <span key={m.id} className={`cast__av cast__av--${m.accent}`} style={{ "--k": i, "--side": i % 2 ? 1 : -1 }}>{m.initials}</span>
          ))}
        </div>
        <h2 className="huge cast__title rise">Meet the cast.</h2>
        <p className="lede cast__lede rise">
          {numWord(MEMBERS.length)} people. Different timezones. Same group chat.
        </p>
      </div>
    </section>
  );
}

// ---------- Member section ----------
function MemberSection({ member, idx }) {
  const accentBg = {
    pink: "var(--gr-pink-500)",
    yellow: "var(--gr-gold-500)",
    periwinkle: "var(--gr-purple-500)",
    green: "var(--gr-green-500)"
  }[member.accent];
  const mine = projectsBy(member.id);
  const one = mine.length === 1 ? mine[0] : null;

  return (
    <section className={`section section--member ${idx % 2 === 0 ? "block-cream" : ""}`} id={`member-${member.id}`}>
      {idx === 0 && <FloatSticker top="40px" right="5%" rot={12} color="coral" size={13} className="float-sticker--member">say hi</FloatSticker>}
      {idx === 1 && <FloatSticker top="40px" right="5%" rot={-8} color="periwinkle" size={13} anim="anim2" className="float-sticker--member">voice nerd</FloatSticker>}

      <div className="wrap">
        <div className="kicker rise" style={{ marginBottom: 16 }}>
          ✦ team member 0{idx + 1} of 0{MEMBERS.length}
        </div>
        <article
          className={`member-card member-card--${idx % 2 ? "r" : "l"} rise`}
          style={{ background: accentBg, color: member.accent === "green" ? "#fff" : "#000" }}
        >
          <div className="avatar-blob member-card__av" aria-hidden="true">{member.initials}</div>
          <div className="member-card__meta">
            <span className="kicker">{member.role}</span>
            <span className="sticker-badge sticker-badge--periwinkle member-card__fact">{member.funFact}</span>
          </div>
          <h2 className="huge member-card__name">{member.name}.</h2>
          <p className="lede member-card__blurb">{member.blurb}</p>
          <div className="member-card__actions">
            <a className="btn btn--black" href={member.linkedin} target="_blank" rel="noreferrer" data-cursor="linkedin">
              LinkedIn ↗
            </a>
            <a className="btn btn--ghost" href={member.github} target="_blank" rel="noreferrer" data-cursor="github">
              GitHub ↗
            </a>
            <a className="member-card__count" href={one ? `#app-${one.key}` : "#projects"}
               title={mine.map(p => p.title).join(", ")} data-cursor="jump">
              <span className="member-card__count-text">{plural(mine.length, "project")}{one ? ` · ${one.title}` : ""}</span> <span aria-hidden="true">↓</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

// ---------- App tiles ----------
// A miniature of each app's real layout, drawn in its own palette. Under
// html.motion each one plays a short demo once its tile is on screen.
function Mini({ kind }) {
  const bars = (n, shortAt = []) => Array.from({ length: n }, (_, i) => <b key={i} className={shortAt.includes(i) ? "m-short" : undefined} />);
  const wave = (n) => Array.from({ length: n }, (_, i) => <i key={i} style={{ "--k": i }} />);
  switch (kind) {
    case "pensieve": return (
      <div className="mini mini--reader">
        <div className="m-rail"><b /><b /><b /><b /></div>
        <div className="m-list"><div className="m-row m-row--hot" /><div className="m-row" /><div className="m-row" /><div className="m-row m-row--dim" /><div className="m-row" /></div>
        <div className="m-article"><b className="m-h" />{bars(3, [2])}</div>
      </div>);
    case "hedwig": return (
      <div className="mini mini--reader mini--hedwig">
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
        <div className="m-relay">{[0, 1, 2, 3, 4, 5, 6].map(i => <i key={i} style={{ "--k": i }} className={i < 3 ? "done" : i === 3 ? "on" : undefined} />)}</div>
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
        <div className="m-wave">{wave(18)}</div>
        <div className="m-prose">{bars(2, [1])}</div>
      </div>);
    case "pjv": return (
      <div className="mini mini--pjv">
        <div className="m-mic" />
        <div className="m-wave m-wave--line">{wave(14)}</div>
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
  const authors = authorsOf(p);
  const [bg, ink, acc, two] = p.pal;
  const go = !external ? "View page" : p.site === "GitHub" ? "View on GitHub" : "Visit site";
  return (
    <li className="app-tile rise" id={`app-${p.key}`} style={{ "--t-bg": bg, "--t-ink": ink, "--t-acc": acc, "--t-2": two }}>
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
        {p.credit && (
          <a className="app-tile__credit" href={p.credit.href} target="_blank" rel="noreferrer" data-cursor="upstream ↗">
            <span>{p.credit.what} by <b>{p.credit.by}</b><span className="sr-only"> (opens GitHub)</span></span>
          </a>
        )}
        <ul className="app-tile__meta">{p.meta.map(m => <li key={m}>{m}</li>)}</ul>
        <div className="app-tile__foot">
          <span className="app-tile__go" aria-hidden="true">{go} <span className="app-tile__arrow">{external ? "↗" : "→"}</span></span>
          <span className="app-tile__by">
            <AvatarStack people={authors} />
            <span className="app-tile__names"><span className="sr-only">Built by </span>{firstNames(authors)}</span>
          </span>
        </div>
      </div>
    </li>
  );
}

function AppGroup({ g }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const ul = ref.current;
    if (!ul || !ul.firstElementChild) return;
    const step = ul.firstElementChild.getBoundingClientRect().width + 16;
    const atEnd = ul.scrollLeft >= ul.scrollWidth - ul.clientWidth - 4;
    const i = atEnd ? g.items.length - 1 : Math.round(ul.scrollLeft / step);
    if (i !== active) setActive(i);
  };
  return (
    <div className="app-group" id={g.id}>
      <div className="app-group__head rise">
        <h3 className="app-group__title"><span className="app-group__bar" style={{ background: g.bar }}>{g.title}</span></h3>
        <span className="app-group__count">{plural(g.items.length, "app")}<span className="app-group__swipe" aria-hidden="true"> · swipe <span className="app-group__nudge">→</span></span></span>
      </div>
      <ul className="app-grid" ref={ref} onScroll={onScroll}>
        {g.items.map(p => <AppTile key={p.key} p={p} />)}
      </ul>
      <div className="app-dots" aria-hidden="true">
        {g.items.map((p, i) => <i key={p.key} className={i === active ? "on" : undefined} />)}
      </div>
    </div>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap" style={{ position: "relative" }}>
        <div className="kicker" style={{ color: "var(--gr-pink-500)" }}>// /etc/contact</div>
        <div className="footer__mark rise">
          <h2 className="footer__big">aer.app</h2>
          <FloatSticker rot={-10} color="yellow" size={13} className="footer__sticker">say hi.</FloatSticker>
        </div>
        <p className="lede footer__lede">
          That's the whole site. If you got this far, you should probably{" "}
          <a href="https://github.com/Team-AER" target="_blank" rel="noreferrer">star a repo</a>{" "}
          or just tell us hi on LinkedIn. We promise to write back.
        </p>

        <div className="footer__ctas">
          <a className="btn btn--yellow" href="https://github.com/Team-AER" target="_blank" rel="noreferrer">★ Star us on GitHub</a>
          <a className="btn" href="mailto:hello@aer.app">hello@aer.app</a>
        </div>

        <div className="footer__row">
          <span className="footer__made">
            <AvatarStack people={MEMBERS} />
            <span>© {new Date().getFullYear()} Team AER · Built with affection &amp; hard shadows.</span>
          </span>
          <span className="footer__links">
            {MEMBERS.map(m => (
              <a key={m.id} href={m.linkedin} target="_blank" rel="noreferrer">{m.first}</a>
            ))}
            <a href="https://github.com/Team-AER" target="_blank" rel="noreferrer">GitHub</a>
            <a href="#top">Top ↑</a>
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

  const marqueeItems = [`${numWord(MEMBERS.length)} humans`, `${numWord(ALL_PROJECTS.length)} projects`, "One domain", "Open source", "MIT & chill", "Built for fun", "aer.app", "★ Team AER"];

  return (
    <>
      <Nav />
      <main>
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

        <CastBand />

        <div id="team" />
        {MEMBERS.map((m, i) => (
          <MemberSection key={m.id} member={m} idx={i} />
        ))}

        {tweaks.showMarquee && (
          <Marquee
            items={[...ALL_PROJECTS.map(p => p.title), "fork it", "break it", "ship it"]}
            speed={tweaks.marqueeSpeed + 6}
            variant="marquee--yellow marquee--reverse"
          />
        )}

        <section className="section section--projects block-cream" id="projects">
          <div className="wrap">
            <div className="kicker rise">// the lab notebook</div>
            <h2 className="huge rise" style={{ marginTop: 12, maxWidth: "16ch" }}>
              All the projects, in one place.
            </h2>
            <p className="lede rise" style={{ marginTop: 20 }}>
              {numWord(ALL_PROJECTS.length)} so far. Each one was an itch we couldn’t ignore for a weekend, and each now has a page
              in its own colours showing the real thing. Click in, kick the tires, open an issue — we read everything.
            </p>
            <ul className="apps-facts rise" aria-label="At a glance">
              <li><CountUp to={ALL_PROJECTS.length} /> <span>projects</span></li>
              <li><CountUp to={PUBLIC_COUNT} /> <span>public repos</span></li>
              <li><CountUp to={PRIVATE_COUNT} /> <span>private, ask for access</span></li>
            </ul>

            {PROJECT_GROUPS.map(g => <AppGroup key={g.id} g={g} />)}
          </div>
        </section>
      </main>

      <Footer />

      <CursorSticker enabled={tweaks.showCursorSticker} />
      <AERTweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
