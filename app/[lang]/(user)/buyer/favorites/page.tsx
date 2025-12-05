import { getDictionary } from '@/get-dictionary';
import FavoritesClient from './favorites-client';

export default async function FavoritesPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <FavoritesClient dict={dict} />;
}
