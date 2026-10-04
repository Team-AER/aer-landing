# Team AER apps — design direction

Working direction for the canonical Team AER landing pages at `https://aer.app`. Most
project pages use static HTML, CSS and vanilla JS. The hub, Cantis and PolyJuiceVoice use
React and Babel in the browser; there is no compiled build step. These notes describe design
intent, not a guarantee that every existing page satisfies each target below.

## What every page must do (quality floor)

- **Hero in 50 ms.** Headline ≤ 10 words, benefit-led, 48–72 px desktop / 36–42 px mobile. One
  subheadline ≤ 25 words. One primary CTA that says what happens ("Open Pensieve", "Get the code"),
  one quiet secondary. Everything above the fold without scrolling on a laptop.
- **Show the real app.** The hero visual is a hand-built HTML/CSS replica of the product's actual
  screen (a "product-in-browser" hero), built from the app's real component code, not stock art and
  not screenshots of live accounts (no personal mail, feeds or campaigns on a public page).
- **Features as outcomes.** 6–8 features, each a bold label + one concrete sentence with real
  specifics (model names, formats, limits). Pair the three most important with a visual.
- **How it works** is a real sequence, so numbering is allowed there and nowhere else.
- **Install / run block** with a copy button (Docker or `git clone`) when the project is self-hosted.
- **Closing CTA + shared AER footer** (`shared/base.css` `.aer-footer`). Thin AER strip on top of
  every page linking back to `aer.app` and `/`.
- **Responsive to 360 px**, 16 px side gutter, no horizontal scroll, 44 px tap targets.
- **Accessible:** semantic landmarks, skip link, visible focus (`:focus-visible` from base.css),
  WCAG AA contrast, `prefers-reduced-motion` respected, alt text on meaningful SVG (`role="img"` +
  `aria-label`), decorative SVG `aria-hidden="true"`.
- **Performance target for vanilla pages:** no third-party scripts, Google Fonts only (preconnect, `display=swap`,
  ≤ 2 families, subsetted weights), inline SVG, total page ≤ 300 KB.
- **Dark/light:** each page picks ONE native scheme from its product and commits to it; declare
  `color-scheme` on `:root`.
- **CSP for vanilla pages:** nginx allows `script-src 'self'` only — no inline `<script>` handlers; put behaviour in
  `/<slug>/page.js` + `/shared/shell.js`. Inline `<style>` is allowed. The hub, Cantis and
  PolyJuiceVoice have a separate CSP allowing pinned React/Babel from unpkg and runtime JSX.

## What every page must avoid (generic-AI tells)

- No cream-and-terracotta-serif look, no near-black-with-acid-green look, no broadsheet hairlines.
- No identical rounded "SaaS cards" with the same soft shadow everywhere; borders and radii encode
  hierarchy or they're cut.
- No ALL-CAPS tracked eyebrow above every heading; no "A · B · C" meta strings; no "→" glued onto
  every link; no single italic/colored word inside a headline.
- No fade-slide-up on every section. One orchestrated moment per page (the hero), and motion that
  answers a user action elsewhere.
- No gradient blobs as decoration. If a gradient exists it is the subject (Erised's dusk sky).
- No numbering unless the content is a sequence.
- Copy: sentence case, plain verbs, specific nouns. No "seamless", "powerful", "revolutionary".

## Shared shell

- Top: `.aer-strip` (36 px) with the pink "A" mark, "Team AER" link to https://aer.app, and links
  to `/` ("All apps") and GitHub. Pages tint it via `--shell-bg` / `--shell-fg`.
- Then the page's own nav (brand mark + 3–4 anchors + CTA), sticky or not per theme.
- Bottom: `.aer-footer` with three columns — about this app (repo, license, live link), Team AER
  (aer.app, all apps, GitHub org), other apps (4 sibling links). Pages tint via `--footer-bg/fg`.

## Hub (`/`) direction

Light, warm off-white (`#F4F4F0`) from aer.app so the hub reads as part of the parent site, but
with the sticker/marker energy toned down. Grid of app tiles; each tile carries the app's own
palette and mark so the hub previews the sub-page's personality. Type: Space Grotesk (display,
already on aer.app) + system sans body. One memorable thing: tiles are "app windows" with each
product's real UI miniature inside.

## Per-project art direction

(Filled in below from the project briefs. Each entry: mood, palette (4–6 hex), type pair, hero
concept, the one memorable thing, section plan, and the real UI the hero must mirror.)

### Pensieve — `/pensieve/`  (RSS reader with a daily paper and a memory)
- **Mood:** a calm morning read, in the product's own editorial-paper idiom. Light scheme.
- **Palette (product tokens):** paper `#F3F1EA`, ink `#1B1A17`, accent teal-blue `#2E5E78`, AI green
  `#3E7C6E` (AI features only), star `#D9A441` (saved/starred only). Dark theme not used on the page.
- **Type (product):** Fraunces (display, variable optical size) + Instrument Sans (body), from Google
  Fonts. Mono only inside the sync-API/OPML/compose code blocks.
- **Hero concept:** the reader itself — three panes (folders / list / article) on desktop, collapsing
  to the phone layout at ≤900 px like the app. The list shows today's paper: ranked stories,
  "N sources" merge chips, a "safe to skip" row. Headline idea: "Read what matters first. Skip the
  rest with a clear conscience."
- **The one memorable thing:** the interest ranking — on load the story list sorts once from
  chronological into ranked order and the percentile chips settle. Nothing else moves.
- **Must mirror:** `apps/pensieve/pensieve/web/templates/*.html` + `static/app.css` (pane layout, row
  anatomy, masthead), phone bars behaviour (document scrolls, bars slide away, swipe gestures).
- **Sections:** hero → "Your paper" (ranking, front page, per-feed daily limits, safe to skip) → "A
  reader that remembers" (summaries, tags, clustering, related-in-your-reading; AI is optional and
  bring-your-own gateway) → Reeder/NetNewsWire sync (Google Reader + Fever APIs) + OPML/Pocket/
  Instapaper imports → Saved links & page archive (bookmarklet, share sheet, Shortcut, extension;
  isolated headless Chromium; Garage S3) → household accounts + hardening → self-host (docker
  compose) → closing CTA (Open Pensieve / Get the code).
- **Avoid:** hairline broadsheet grids; terracotta; claiming AI works with zero setup.

### Quill — `/quill/`  (meeting transcription and grounded notes)
- **Mood:** the notes write themselves while people talk. The product's "AER glass" language in its
  dark variant (the live sign-in is dark): system font stack, glass rails, ONE blue accent.
- **Palette (product tokens):** ink `#0D1218`, sheet `#151C26`, glass `rgba(255,255,255,.06)`, text
  `#E9EEF5`, blue `#007AFF`, paused-orange `#E0561A` (only for "paused"), failure red `#D70015` (only
  for failures). Speaker hues: read `--spk-0..7` from `apps/quill/frontend/src/styles/app.css` and
  use them exactly; they are data (avatars, timeline lanes, talk-time), not decoration.
- **Type:** system stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial`).
  No Google Fonts. JetBrains Mono is NOT used; timestamps use `font-variant-numeric: tabular-nums`.
- **Hero concept:** the meeting reader — custom player with chapter ticks, the meeting map (speaker
  lanes + key-frame thumbnails), the follow-along transcript with speaker-coloured turns appearing
  one by one (the single orchestrated moment), and the Notes panel (TL;DR, decisions, action items
  each with a timestamp). Headline idea: "Record the meeting. Keep the decisions."
- **The one memorable thing:** speaker colour as the page's colour system.
- **Must mirror:** `apps/quill/frontend/src` (meeting list: cover, gist, speakers, action count;
  meeting page) and `apps/quill/frontend/DESIGN.md`.
- **Sections:** hero → "What you get from one upload" (speaker-attributed transcript, key slides
  with readable on-screen text, grounded notes, action items, ⌘K + full-text search) → "How it
  works" (resumable 10 GB tus upload → CPU diarization, Nemotron-3, up to 8 speakers → transcription
  per turn → vision on key frames → notes; every stage checkpoints and can pause) → exports
  (Markdown, TXT, SRT, VTT, JSON, RTTM) → team accounts & link invites → self-host (CPU app side,
  bring-your-own OpenAI-compatible gateway with STT + vision) → CTA.
- **Avoid:** waveform clichés; claiming GPU or zero-backend transcription.

### Hedwig — `/hedwig/`  (unified webmail, Apple-Mail idiom)
- **Mood:** a professional glass mail reader. Light frosted glass over a soft blue-grey field. The
  user explicitly rejected serif/editorial for this product (2026-09-24): system font stack only, no
  Google Fonts on this page, one blue accent, orange reserved for attention.
- **Palette (product tokens, per DESIGN-AUDIT-2026-09-24):** paper `#EEF0F3`, light field `#9DB4D6` at 18%
  blurred 120px behind the glass rail only, glass `rgba(248,248,250,.72)`, ink `#1D1D1F`, muted `#5E5E63`,
  blue `#007AFF` (buttons `#0062CC`), attention `#E0561A` / `#A8420F`.
- **Type:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
  Display 700 at −0.02em; body 400; 14 px sheet copy / 13 px list meta like the app.
- **Hero concept:** the full three-pane window — glass rail with account dots, message list rows
  (36 px avatar, sender, subject, preview, time), opaque reader sheet with an HTML mail rendered as
  sent, a collapsed quoted-history pill and the remote-images banner. A "Needs you" group header
  with an honest "why is this here?" line. Headline idea: "Every inbox. One quiet window."
- **The one memorable thing:** the rail's glass over the field is the only translucency; everything
  else is crisp and opaque, exactly like the app's contract.
- **Must mirror:** `apps/hedwig/docs/hedwig/design/DESIGN-AUDIT-2026-09-24.md` and
  `REDESIGN-BUILD-2026-09-24.md`; `apps/hedwig/frontend/src` for row/toolbar anatomy. Do NOT use
  the upstream MailFlow screenshots in `apps/hedwig/media/`.
- **Sections:** hero → unified inbox (IMAP/SMTP, Gmail, iCloud, Microsoft 365 via OAuth2) → "Only
  what needs you" (rules → learned classifier → local model; Needs you / Waiting on; why-is-this-
  here) → context engine (people merged across accounts, commitments, cited answers, daily brief)
  → "An assistant that asks first" (agents and automations read everything, change nothing without
  approval; never auto-sends or deletes) → plugins (Receipts, Newsletter digest, Pensieve bridge,
  Send guard) → client (WYSIWYG compose, threads, PWA, push, 2FA, SSO) → self-host (Docker Compose,
  GHCR images; AGPL-3.0 + commercial licence) → CTA.
- **Avoid:** Google Fonts, italic reasons, 26 px radii, mono in chrome, folder/label claims, the
  spear-phishing/decision layer (branch only).

### Erised — `/erised/`  (illustrated, AI-led adventure game)
- **Mood:** dusk, a mirror, a storybook. Quiet and literary; the dusk gradient IS the subject.
- **Palette (product tokens):** midnight `#111D2D`, deep water `#17283A`, mirror silver `#DCE6ED`,
  mist `#9DADBF`, aged gold `#C9B78A`, danger rose `#EAA5A5` (dice failures only).
- **Type (product):** Fraunces (display) + Newsreader (prose, line-height 1.6) from Google Fonts;
  system sans for controls; Silkscreen only inside the 8-bit arcade section.
- **Hero concept:** an arched "mirror" frame holding an illustrated scene — copy one of the tracked
  scene paintings from `apps/erised/frontend/public/arcade-art/v1/` (coast/citadel/cavern/ember/
  frost/meadow) into `/erised/assets/` — with story prose beneath and the three opening choices as
  the CTA cluster. Headline idea: "Tell the mirror what you want. Then step through."
- **The one memorable thing:** the mirror reflects — slow pointer/scroll parallax on the scene inside
  the arch (off under reduced motion). Everything else is still.
- **Must mirror:** the journey screen (scene, narration, suggested choices + freeform action, dice
  card, character sheet drawer, journal). Generic backdrops are shared; private portraits and character-focused illustrations are supported separately.
- **Sections:** hero → "Play alone or with four" (invites, rotating turns, shared campaigns) → "Your
  kind of story" (Journey vs Dice & destiny; original worlds and fan-fiction presets with era/place/
  canon) → "A world that remembers" (journal, lore, recaps, Markdown export, pause/resume) → "Painted
  while you play" (async illustrations, eight moods, administrator-configured local or hosted image providers) → "8-bit
  interludes" (Platformer / Explorer, Silkscreen) → "The private mirror" (six-category reflection,
  evidence-linked, not clinical) → access (invite-only; CTA = live site + "Ask for an invitation"
  mailto:hello@aer.app). Private repo: no "Get the code".
- **Avoid:** fantasy-poster bombast, drop caps everywhere, fake dice physics.

### Accio — `/accio/`  (local-first deep-research agent)
- **Mood:** the product's own lab-terminal cyberpunk, disciplined. Black page, cyan accent, agents
  colour-coded. The product's design bundle wins over the generic "avoid black + neon" rule, but
  spend it in one place: the agent relay. No scanline overlays on the whole page, no glitch text.
- **Palette (product tokens):** bg `#050505`, panel `#0E0E10`, text `#F2F2F2`, cyan `#00F0FF`,
  magenta `#ED1E79`, yellow `#F8EF00`, red `#FF003C`, purple `#9747FF`. Agent colours: read
  `apps/accio/docs/design-bundle/accio.css` and use the same mapping (Planner yellow, Critic red…).
- **Type (product):** Tomorrow (display + body) with Barlow for micro labels and JetBrains Mono inside
  the console/citation views, from Google Fonts.
- **Hero concept:** the seven-agent relay (Planner → Searcher → Reader → Analyst → Synthesizer →
  Critic → Writer) as a horizontal track; on load one token travels the track once, lighting each
  agent in its colour (the single orchestrated moment). Below it the real Agent Console (SSE event
  lines, agent matrix, source pane). Headline idea: "Ask one question. Get a cited report."
- **The one memorable thing:** the relay track doubles as section navigation.
- **Must mirror:** the real screenshots in `apps/accio/docs/verification/*.png` (copy the best 2–3
  into `/accio/assets/` as WebP/PNG ≤ 250 KB each, and ALSO rebuild the console in HTML/CSS for the
  hero). Screens: New Session, Agent Console, Report (terminal + magazine), Library.
- **Sections:** hero → how the seven agents work (a true sequence: numbers allowed) → "Your files
  and the web" (library formats, hybrid retrieval, SearXNG/Tavily/Brave, trust lists) → "Every claim,
  quoted" (verbatim quotes, critic loops, modes Quick/Standard/Deep with their source counts) →
  report views + the six artifacts → "Your machine, your model" (any OpenAI-compatible endpoint,
  nothing hosted) → access (private repo; CTA "Ask for access" mailto:hello@aer.app).
- **Avoid:** "AI magic" copy; a hosted-demo CTA (there is none).

### Avifors — `/avifors/`  (demand-loaded GPU inference with bounded leases)
- **Mood:** a control room for one scarce GPU. Dark, industrial, honest. No UI exists; the page
  invents the product's visual language, and it should look like instrumentation, not marketing.
- **Palette:** graphite `#121417`, panel `#1B1F24`, grid `#2A3038`, text `#E6E8EB`, VRAM amber
  `#FFB020`, lease cyan `#2DD4BF`, idle grey `#5C6670`. Two accents because they are two data
  series (memory vs leases).
- **Type:** IBM Plex Sans (display + body) and IBM Plex Mono (model ids, ports, timings) from
  Google Fonts.
- **Hero concept:** a lease timeline — rows per worker (a vLLM chat model, an sdapi image worker,
  an STT worker, an HTTP worker), bars showing activate / serve / lease expiry / stop across one GPU
  as requests arrive from several users. On load the timeline plays once, then holds. Headline
  idea: "One GPU. Every model. No one waits forever."
- **The one memorable thing:** the bounded lease — a bar that visibly shrinks to zero and frees
  VRAM for the next model.
- **Sections:** hero → "Load on demand, unload on time" (activate/stop/sleep, VRAM accounting,
  sleep mode level 1) → "Fair to many users" (latency / fifo / fair / throughput; per-user keys and
  allowlists; pending limits; keys never forwarded) → "Leases, not hopes" (max_hold, max_runtime
  300 s default, hard cancellation, streamed timeouts emit an error never a fake finish) → "Chat,
  images, speech" (vLLM text, sdapi images, STT jobs, FLUX.2 Klein profiles, HTTP workers) →
  "Drop-in behind your gateway" (OpenAI-compatible routes; keeps your engines; does not download
  models) → install (Python 3.14+ broker, YAML workers, Docker or native systemd) → CTA (GitHub).
- **Avoid:** GPU-render-farm imagery. Decision/System One workers are implemented; describe their
  separate CPU lane when including them.

### Athena Sandbox — `/athena/`  (local malware-analysis portal and auditable AI harness)
- **Mood:** an evidence workbench. Clear, not dramatic; the AI is bounded and the guests are
  disconnected — the page should feel audited.
- **Palette (product tokens):** paper `#F4F6FB`, navy `#17233F`, cobalt `#315BD6`, slate
  `#586780`, violet `#8050BE`, iris accent `#5B5BD6`. Telemetry colours as data: process blue,
  file gold `#C9962B`, network teal `#1F8A8A`, memory violet, signals rose `#C94F6D`.
- **Type (product):** system stack (Avenir Next / Segoe UI / -apple-system) + JetBrains Mono for
  hashes, PIDs, rule names (Google Fonts for the mono only).
- **Hero concept:** the investigation workspace — sample header (name, SHA-256, family claim
  awaiting review, "disconnected guest" badge), process tree with descendants, event timeline
  coloured by telemetry type, an evidence table that fills in during the single orchestrated load
  moment (static → dynamic → report). Headline idea: "Detonate safely. Keep every receipt."
- **The one memorable thing:** the audit journal — every AI claim points at an evidence row.
- **Must mirror:** `infra/malware-lab/athena-sandbox/ui/src` (Lab screen, workspace, library, audit
  journal, ten-section report) and `docs/DESIGN.md`.
- **Sections:** hero → "Seven Linux profiles, one Windows worker" (x86-64, i386, ARMv7 sf/hf,
  AArch64, MIPS LE/BE; Windows x64/x86 via Xen/DRAKVUF; no external network for guests) → static
  stage (YARA, capa, FLOSS, Ghidra, TLSH/ssdeep, entropy, strings/IOCs, in a disposable offline VM)
  → "AI that must cite" (evidence-bounded local LLM, typed tools, budgets, pause/takeover, model
  exchanges visible; Ghidra chat + read-only MCP) → observed C2 indicators & cross-sample
  correlation → Lab admission control & audit journal → ten-section report → access (private;
  CTA "Request access" mailto:hello@aer.app; defensive, authorized analysis only).
- **Avoid:** skulls, hex rain, hacker green; claiming ANY.RUN parity or arbitrary-sample execution.

### Omniocular — `/omniocular/`  (BLE-controlled wireless assessment device on a Pi Zero 2 W)
- **Mood:** a field kit. Hardware you can hold, a phone app that drives it, an ethics gate that is
  part of the product. Tactile and rugged. No brand exists; invent it.
- **Palette:** bone `#EFEDE6`, case orange `#FF6A00`, slate `#2B2F33`, ink `#15171A`, BLE blue
  `#0082FC` (the link only).
- **Type:** Barlow Condensed (display) + Barlow (body) from Google Fonts; `ui-monospace` only for
  the CBOR/HMAC spec lines.
- **Hero concept:** the device as a flat SVG (Pi Zero 2 W outline) on the left, a BLE arc, and the
  Flutter app in a phone frame on the right: AP survey list filling in, capture controls, the
  long-press transmit confirmation. Headline idea: "A pocket Wi-Fi auditor you talk to over Bluetooth."
- **The one memorable thing:** the authorized-use gate rendered as a physical switch in the hero —
  flip it and the transmit controls unlock (user-triggered motion).
- **Must mirror:** `apps/omniocular/mobile/lib` (Flutter screens) and `docs/architecture.md`.
- **Sections:** hero → "Built for the Pi Zero 2 W" (Nexmon monitor/injection driver, power overlays,
  BLE LE-only, per-device images with verified base digest) → "Authenticated control" (CBOR v1,
  HMAC-SHA256, replay protection, bonded-peer admission, unprivileged gateway + capability-bounded
  root RF worker) → "Every aireplay-ng mode, typed and bounded" → "Survey and capture" (AP
  snapshots, channel-hop schedules, validated .hc22000 artifacts) → authorized use + security docs →
  status: software complete, hardware qualification pending (say it plainly) → access (private repo;
  CTA "Ask about Omniocular" mailto:hello@aer.app).
- **Avoid:** anything reading as "hack your neighbour"; radar-sweep clichés; claiming working RF.

### Subtly — `/subtly/`  (GPU-accelerated subtitles on your desktop)
- **Correction (2026-10-02):** the local `apps/Subtly` checkout is stale (v0.1 Electron + sidecar).
  GitHub `main` and the v2.0 release are a single Rust binary with an Iced UI, whisper-rs (Metal /
  Vulkan), in-process audio (symphonia, rubato, ebur128), a Models tab and bundled Silero VAD. The
  page describes v2.0 and links the real installers; ignore the Electron/sidecar/ffmpeg lines below.
- **Mood:** the cinema, letterboxed, in the product's dark "plasma" palette. Captions are the hero
  because captions are the product. Honest about being early.
- **Palette (product tokens):** base `#0B0F1A`, panel `#111827`, raised `#1B1F2B`, text `#F3F4F6`,
  dim `#9CA3AF`, orange `#F97316` / `#FB923C` (captions + CTA), plasma blue `#38BDF8` (GPU/runtime
  only).
- **Type (product):** Space Grotesk (display) + IBM Plex Sans (body) from Google Fonts.
- **Hero concept:** a 2.39:1 letterboxed frame with an abstract SVG scene; captions type in cue by
  cue in sync with a thin waveform under the frame (one orchestrated moment). Beside it the app's
  real panel: file picker, GPU device dropdown (Metal / Vulkan), model path, progress. Headline idea:
  "Subtitles for every video you own, made on your GPU."
- **The one memorable thing:** section titles appear as caption cues at the bottom of each
  section's frame.
- **Must mirror:** `apps/Subtly/src` (Electron + React + Tailwind UI) for the real workflow.
- **Sections:** hero → "Pick a file, get an .srt" (mp4/mkv/mov/wav/mp3/m4a; whisper.cpp large-v3 +
  Silero VAD; .srt beside the input) → "Your GPU, isolated" (Rust + wgpu sidecar over JSON-RPC;
  Vulkan on Windows/Linux, Metal on macOS; a driver crash can't take the window down) → platforms &
  installers (.dmg, NSIS .exe, AppImage/.deb; all-in-one bundle option) → "Early, and honest about
  it" (v0.1, what you bring: ffmpeg, whisper-cli, models — or the AIO bundle) → open source (MIT) →
  CTA (GitHub releases).
- **Avoid:** film-reel kitsch; claiming it is turnkey; linking subtly.aer.app (not live).
