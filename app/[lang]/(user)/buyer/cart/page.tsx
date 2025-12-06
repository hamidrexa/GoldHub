import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import CartClient from './cart-client';

interface PageProps {
    params: { lang: Locale };
}

export default async function CartPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);
    return <CartClient dict={dict} lang={lang} />;
}
