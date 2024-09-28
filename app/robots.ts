import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/system/health-check',
        },
        host: 'https://sahmeto.com',
        sitemap: [
            'https://sahmeto.com/sitemap.xml',
            'https://sahmeto.com/blog/post-sitemap.xml',
            'https://sahmeto.com/blog/docs-sitemap.xml',
            'https://sahmeto.com/publisher-messages.xml',
            'https://blog.sahmeto.com/post-sitemap.xml',
        ],
    };
}
