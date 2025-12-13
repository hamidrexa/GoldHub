import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function submitOrder() {
    return fetcher({
        url: `/v1/gold_artifacts/submit_order`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
        method: 'POST',
    });
}