import { redirect } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

type Props = {
    params: { lang: Locale };
};

export async function generateMetadata({ params: { lang } }: Props, parent?: ResolvingMetadata): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.admin.title || 'Admin';
    const seoDescription = dict.marketplace.admin.description || 'Admin section for GoldHub marketplace.';
    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/admin`,
        },
    };
}

export default async function AdminPage({ params: { lang } }: Props) {
    // Redirect to dashboard
    redirect(`/${lang}/admin/dashboard`);
}
