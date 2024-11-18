import { fetcher } from '@/libs/utils';

export function updateCart(body) {
    return fetcher({
        url: `/v1/users/cart`,
        body,
        method: 'PATCH',
    });
}
