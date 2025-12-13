import { getDictionary } from '@/get-dictionary';
import BuyerDashboard from './dashboard/dashboard';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
    params: { lang: Locale };
}

export async function generateMetadata(
    { params: { lang } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.buyer.welcomeBack || 'Buyer Dashboard';
    const seoDescription = dict.marketplace.buyer.browseDescription || 'Access your buyer dashboard on GoldHub.';

    return {
        title: `${seoTitle} | GoldHub`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle} | GoldHub`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/buyer`,
        },
    };
}

export default async function BuyerPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);

    return <BuyerDashboard dict={dict} />;
}
