(() => {
  const config = window.AER_MONITORING || {};
  if (!config.dsn || !window.Sentry) return;
  Sentry.init({
    dsn: config.dsn,
    tunnel: config.tunnel || undefined,
    environment: config.environment || 'production',
    release: config.release,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    integrations: defaults => defaults.filter(i => ['GlobalHandlers', 'InboundFilters', 'BrowserApiErrors', 'Dedupe'].includes(i.name)),
    beforeSend(event) {
      delete event.request;
      delete event.user;
      delete event.breadcrumbs;
      delete event.extra;
      for (const value of event.exception?.values || []) value.value = value.type || 'Error';
      return event;
    }
  });
})();
