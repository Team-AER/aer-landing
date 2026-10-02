# aer.app

The Team AER site: the team page at `/` and a landing page for each app
(`/pensieve/`, `/hedwig/`, `/quill/`, `/accio/`, `/erised/`, `/cantis/`,
`/polyjuicevoice/`, `/subtly/`, `/avifors/`, `/athena/`, `/omniocular/`).
This repo is the only home for Team AER landing pages. Plain static files, no
build step.

## Layout

| Path | What it is |
|---|---|
| `aer.app.html`, `app.jsx`, `tweaks-panel.jsx` | Team page. React + Babel load from unpkg and JSX is transpiled in the browser. The app catalogue (`#projects`) is `PROJECT_GROUPS` in `app.jsx`. |
| `styles/tokens.css`, `styles/site.css` | Team page design tokens and styles (Gumroad-style hard shadows). |
| `styles/apps.css` | The app catalogue: tiles, each app's mini window in its own palette, tablet and phone layouts, reduced motion. |
| `<app>/index.html`, `style.css`, `page.js`, `assets/` | One self-contained landing page per app, themed in that app's own colours. Plain HTML, first-party scripts only. |
| `cantis/`, `polyjuicevoice/` | React + Babel pages (`index.html`, `sections.jsx`, `illustrations.jsx`), formerly the separate cantis-landing and polyjuicevoice-landing repos. They get the team page's CSP. |
| `shared/base.css`, `shared/shell.js` | Shell shared by every app page: Team AER strip, footer, skip link, nav toggle, copy buttons, reveal on scroll. |
| `404.html` | Not-found page for any unknown path. |
| `docs/APP-PAGES-DESIGN.md` | Design direction and quality floor for the app pages. Not served. |

## Run locally

Any static file server works; the team page is `aer.app.html`.

```sh
python3 -m http.server 8080
# http://127.0.0.1:8080/aer.app.html and http://127.0.0.1:8080/pensieve/
```

## Docker deployment

Standalone, hardened, non-root nginx serving over **HTTP only** and bound to
**localhost** (put a TLS-terminating reverse proxy in front for public access).

```sh
docker compose up -d --build
# http://127.0.0.1:8080/
```

Hardening in place:

- `nginxinc/nginx-unprivileged` base — runs as uid 101, listens on 8080, no root.
- Read-only root filesystem, `cap_drop: ALL`, `no-new-privileges`.
- Published port bound to `127.0.0.1` only — not exposed on any external NIC.
- GET/HEAD only, `server_tokens off`, security headers. Two CSPs (see
  `nginx.conf`): the team page and the Cantis and PolyJuiceVoice pages may
  load React/Babel from unpkg and eval; every other app page is limited to
  first-party scripts. Both allow Google Fonts.
- Clean URLs (`/pensieve` → `/pensieve/`), custom 404, `docs/` not served.

Tear down:

```sh
docker compose down
```

## Adding an app

1. Create `<slug>/index.html`, `style.css` and `page.js` (copy an existing page
   for the shell: strip, footer, skip link, `/shared/base.css`,
   `/shared/shell.js`). No inline scripts or `on*=` handlers.
2. Add it to `PROJECT_GROUPS` in `app.jsx` with its palette and a mini window
   (add a `case` to `Mini` and its styles to `styles/apps.css`).
3. Add it to the footer app list on the other app pages.

## Deploy

aer.app runs this repo's container on the aer.app host (`~/aer-landing`, a git
checkout of `main`, published on 127.0.0.1:8080 behind the host's nginx, which
terminates TLS):

```sh
ssh ubuntu@aer.app 'cd ~/aer-landing && git pull --ff-only && docker compose up -d --build && docker image prune -f'
```

## CI

`.github/workflows/ci.yml` runs on every push / PR: lints the Dockerfile
(hadolint), builds the image, and smoke-tests that every page serves, clean
URLs redirect, unknown paths 404, `docs/` is hidden and each page gets the
right CSP.
