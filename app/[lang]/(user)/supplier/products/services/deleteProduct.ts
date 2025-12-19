import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function deleteProduct({ product_id }: { product_id: string }) {
    return fetcher({
        url: `/v1/gold_artifacts/delete_product/${product_id}/`,
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
        method: 'DELETE',
    });
}
