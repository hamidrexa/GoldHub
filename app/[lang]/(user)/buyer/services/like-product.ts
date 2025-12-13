import { fetcher } from '@/libs/utils';
import Cookies from 'js-cookie';

export function likeProduct(body) {
    return fetcher({
        url: `/v2/bookmarks/`,
        body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
        method: 'POST',
    });
}