import { getDictionary } from '@/get-dictionary';
import CatalogClient from './catalog-client';

export default async function CatalogPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <CatalogClient dict={dict} />;
}
