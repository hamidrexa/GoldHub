import { getDictionary } from '@/get-dictionary';
import SupplierPricingClient from './pricing-client';

export default async function SupplierPricingPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <SupplierPricingClient dict={dict} />;
}
