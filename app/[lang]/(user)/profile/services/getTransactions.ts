import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function getTransactions() {
    return fetcher({
        absoluteUrl: `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/users/transactions`,
        sendToken: true,
    });
}
