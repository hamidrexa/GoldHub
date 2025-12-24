import React from 'react';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params: { lang } }: { params: { lang: Locale } },
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.title || 'GoldHub';
    const seoDescription = dict.homepage.SeoDescription || 'The secure platform for buying and selling gold online.';

    return {
        title: {
            default: seoTitle,
            template: `%s | ${seoTitle}`,
        },
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
        },
    };
}

export default async function UserLayout({
    children,
    params: { lang },
}: {
    children: React.ReactNode;
    params: { lang: Locale };
}) {
    const dict = await getDictionary(lang);

    return (
        <DashboardLayout dict={dict} lang={lang}>
            {children}
        </DashboardLayout>
    );
}
