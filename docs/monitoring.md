# Error monitoring

Set `GLITCHTIP_DSN`, `SENTRY_ENVIRONMENT`, and `SENTRY_RELEASE` as Docker build arguments (Compose reads them from its environment or `.env`). Rebuild and recreate the container. Configuration is rendered during the build because the production container uses a read-only filesystem. An empty DSN disables reporting.

The official browser SDK is pinned and served locally with its license. Error events exclude request context, users, breadcrumbs, extras and exception text. Tracing, sessions and replay integrations are disabled. The script is installed on every generated HTML page, including the custom 404.

Use `VITE_GLITCHTIP_TUNNEL` for Vite builds, or `GLITCHTIP_TUNNEL` for static site builds, to route browser events through a configured same-origin ingest proxy. This also lets a strict `connect-src self` policy stay in place. Restrict the proxy to the configured project and GlitchTip upstream; strip cookies and authorization headers, and bound request size. The proxy must supply the project public ingest key to GlitchTip when the installed server requires it.
