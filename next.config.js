const isProd = process.env.NODE_ENV === 'production';
const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const { withSentryConfig } = require('@sentry/nextjs');
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: !(
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' &&
        process.env.NODE_ENV === 'production'
    ),
    register: true,
    skipWaiting: true,
});

const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};
const sentryOptions = {
    org: 'sahmeto',
    project: 'front',
    sentryUrl: 'https://sentry.hamravesh.com',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: false,
};

module.exports = withPWA(withSentryConfig(nextConfig, sentryOptions));

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: false,
// });
// experimental: {
//     workerThreads: false,
//     cpus: 2,
// },