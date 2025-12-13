import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function unlikeProduct(id:number) {
    return fetcher({
        url: `/v2/bookmarks/${id}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
        method: 'DELETE',
    });
}