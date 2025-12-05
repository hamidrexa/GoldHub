import { getDictionary } from '@/get-dictionary';
import UsersKycClient from './users-kyc-client';

export default async function UsersKycPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    return <UsersKycClient dict={dict} />;
}
