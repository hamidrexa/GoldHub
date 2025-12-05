import { getDictionary } from '@/get-dictionary';
import SupplierOrdersClient from './orders-client';

export default async function SupplierOrdersPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <SupplierOrdersClient dict={dict} />;
}
