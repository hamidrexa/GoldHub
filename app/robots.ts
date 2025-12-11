import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/system/health-check',
        },
        host: 'https://goldhub.com',
        sitemap: [
            'https://goldhub.com/sitemap.xml',
        ],
    };
}
