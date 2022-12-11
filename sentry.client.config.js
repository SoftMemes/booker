import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || 'https://bdfd7ab3fab248929efb0b7cb7d504b0@o4504306537725952.ingest.sentry.io/4504310161932288',
  tracesSampleRate: 1.0,
});
