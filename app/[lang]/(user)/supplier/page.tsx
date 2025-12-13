import { redirect } from 'next/navigation';
import { getDictionary } from '@/get-dictionary';
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
    const seoTitle = dict.marketplace.common.dashboard || 'Supplier Dashboard';
    const seoDescription = dict.marketplace.supplier.welcomeMessage || 'Access your supplier dashboard on GoldHub.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/supplier`,
        },
    };
}

export default function SupplierPage({ params: { lang } }: PageProps) {
    redirect(`/${lang}/supplier/dashboard`);
}
