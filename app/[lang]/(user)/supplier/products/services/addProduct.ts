import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function addProduct({ body, product_id }) {
    return fetcher({
        url: `/api/v1/gold_artifacts/product_create`,
        body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
        method: 'POST',
    });
}
