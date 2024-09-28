import { fetcher } from '@/libs/utils';

export function payment(body) {
    return fetcher({
        url: '/v1/transactions',
        method: 'POST',
        body,
    });
}
