import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function addProduct({ body }) {
    return fetcher({
        url: `/v1/gold_artifacts/product_create`,
        body,
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
        method: 'POST',
    });
}

