import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/system/health-check',
        },
        host: 'https://talanow.ir',
        sitemap: [
            'https://talanow.ir/sitemap.xml',
        ],
    };
}
