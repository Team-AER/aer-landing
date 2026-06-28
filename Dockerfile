# AER landing — static site served by hardened, non-root nginx.
# Single stage: the site is plain static assets (React + Babel are loaded
# in-browser from CDN), so there is no compile step — just copy and serve.
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Runs as uid 101 (nginx) and listens on 8080 by default — no root, no setcap.
USER nginx

# Hardened server config (HTTP only, security headers, GET/HEAD only).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static site. .dockerignore keeps dev artifacts and infra files out.
COPY --chown=nginx:nginx . /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["sh", "-c", "wget -q -O /dev/null http://127.0.0.1:8080/aer.app.html || exit 1"]
