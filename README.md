# AER Landing

Static landing page for Team AER (`aer.app`). React + Babel are loaded in the
browser from CDN, so the site is plain static assets — no build/compile step.

## Run locally

Any static file server works, e.g.:

```sh
python3 -m http.server 8080
# then open http://127.0.0.1:8080/aer.app.html
```

## Docker deployment

Standalone, hardened, non-root nginx serving over **HTTP only** and bound to
**localhost** (put a TLS-terminating reverse proxy in front for public access).

```sh
docker compose up -d --build
# http://127.0.0.1:8080/aer.app.html
```

Hardening in place:

- `nginxinc/nginx-unprivileged` base — runs as uid 101, listens on 8080, no root.
- Read-only root filesystem, `cap_drop: ALL`, `no-new-privileges`.
- Published port bound to `127.0.0.1` only — not exposed on any external NIC.
- GET/HEAD only, `server_tokens off`, security headers + CSP (see `nginx.conf`).

Tear down:

```sh
docker compose down
```

## CI

`.github/workflows/ci.yml` runs on every push / PR: lints the Dockerfile
(hadolint), builds the image, and smoke-tests that the site serves a 200.
