import { getDictionary } from '@/get-dictionary';
import OrdersClient from './orders-client';

export default async function OrdersPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <OrdersClient dict={dict} />;
}
