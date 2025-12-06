import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import SupplierPricingClient from './pricing-client';

interface PageProps {
    params: { lang: Locale };
}

export default async function SupplierPricingPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);
    return <SupplierPricingClient dict={dict} lang={lang} />;
}
