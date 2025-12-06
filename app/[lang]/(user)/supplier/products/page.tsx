import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import SupplierProductsClient from './products-client';

interface PageProps {
    params: { lang: Locale };
}

export default async function SupplierProductsPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);
    return <SupplierProductsClient dict={dict} lang={lang} />;
}
