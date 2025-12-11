import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function updateProduct({ body, product_id }) {
    return fetcher({
        url: `/v1/gold_artifacts/product_update/${product_id}/`,
        body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
        method: 'PATCH',
    });
}
