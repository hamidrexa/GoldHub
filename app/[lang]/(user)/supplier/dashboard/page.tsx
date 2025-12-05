import { getDictionary } from '@/get-dictionary';
import SupplierDashboardClient from './dashboard';

export default async function SupplierDashboardPage({ params: { lang } }) {
    const dict = await getDictionary(lang);

    return <SupplierDashboardClient dict={dict} />;
}
