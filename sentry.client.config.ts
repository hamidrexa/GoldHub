import * as Sentry from '@sentry/nextjs';

Sentry.init({
    enabled: process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD',
    dsn: 'https://6841e45694e865565686a7c4ba446dc8@sentry.hamravesh.com/6835',
    tracesSampleRate: 1,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],
});
