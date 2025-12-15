import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function updateOrderStatus(body) {
    return fetcher({
        url: `/v1/gold_artifacts/update_order_status`,
        body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
        method: 'POST',
    });
}