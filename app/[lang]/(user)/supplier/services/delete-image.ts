import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function deleteImage(image_id: number) {

    return fetcher({
        url: `/v1/gold_artifacts/product_delete_image/${image_id}/`,
        method: 'DELETE',
        headers:{
            Authorization: `Bearer ${Cookies.get('token')}`,
        }
    });
}
