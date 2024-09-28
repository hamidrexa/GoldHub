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
            'default-src \'self\'; script-src \'none\'; sandbox;',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/dashboard',
                destination: '/feed',
                permanent: true,
            },
            {
                source: '/extension',
                destination:
                    'https://chromewebstore.google.com/detail/%D8%A7%D9%81%D8%B2%D9%88%D9%86%D9%87-%D8%A8%D9%88%D8%B1%D8%B3-%D8%B3%D9%87%D9%85%D8%AA%D9%88-sahmeto/mnnkkdhkjbcnjljenmicbmlojmnpmaaf',
                permanent: true,
            },
            {
                source: '/coins/TONCOIN',
                destination: '/coins/TON',
                permanent: true,
            },
            {
                source: '/coins/MATIC',
                destination: '/coins/POL',
                permanent: true,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/ticker-images/:path*',
                destination:
                    'https://cdn.sahamyab.com/guest/image/symbol/:path*',
            },
        ];
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