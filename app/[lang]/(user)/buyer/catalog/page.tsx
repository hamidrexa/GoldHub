import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import CatalogClient from './catalog-client';

interface PageProps {
    params: { lang: Locale };
}

export default async function CatalogPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);
    return <CatalogClient dict={dict} lang={lang} />;
}
