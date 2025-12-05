import { getDictionary } from '@/get-dictionary';
import CartClient from './cart-client';

export default async function CartPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <CartClient dict={dict} />;
}
