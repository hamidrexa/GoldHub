import { fetcher } from '@/libs/utils';

export function exchange(body) {
    return fetcher({
        url: '/v1/wallet/exchange',
        method: 'POST',
        body,
    });
}
