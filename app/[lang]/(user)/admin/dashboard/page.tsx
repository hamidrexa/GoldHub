import { getDictionary } from '@/get-dictionary';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage({ params: { lang } }) {
    const dict = await getDictionary(lang);

    return <DashboardClient dict={dict} />;
}
