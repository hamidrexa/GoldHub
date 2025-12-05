import { getDictionary } from '@/get-dictionary';
import BuyerOrdersClient from './orders-client';

export default async function BuyerOrdersPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <BuyerOrdersClient dict={dict} />;
}
