// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? "development";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment,
  sendDefaultPii: false,
  dataCollection: { userInfo: false, httpBodies: [] },
  tracesSampleRate: environment === "production" ? 0.05 : 0,
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
