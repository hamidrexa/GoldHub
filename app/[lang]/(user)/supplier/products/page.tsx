import { getDictionary } from '@/get-dictionary';
import SupplierProductsClient from './products-client';

export default async function SupplierProductsPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <SupplierProductsClient dict={dict} />;
}
