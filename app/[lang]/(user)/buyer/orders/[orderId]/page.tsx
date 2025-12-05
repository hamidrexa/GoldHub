import { getDictionary } from '@/get-dictionary';
import OrderDetailClient from './order-detail-client';

export default async function OrderDetailPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <OrderDetailClient dict={dict} />;
}
