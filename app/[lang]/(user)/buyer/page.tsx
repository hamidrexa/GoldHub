import { getDictionary } from '@/get-dictionary';
import BuyerDashboard from './dashboard/dashboard';

export default async function BuyerPage({ params: { lang } }) {
    const dict = await getDictionary(lang);

    return <BuyerDashboard dict={dict} />;
}
