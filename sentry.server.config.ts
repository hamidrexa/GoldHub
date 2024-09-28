// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
    enabled: process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD',
    dsn: 'https://6841e45694e865565686a7c4ba446dc8@sentry.hamravesh.com/6835',
    tracesSampleRate: 1,
    debug: false,
});
