import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function removeFromCart(body) {
    return fetcher({
        url: `/v1/gold_artifacts/remove_from_cart`,
        body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
        method: 'POST',
    });
}