import { fetcher } from '@/libs/utils';

export function exchange(body, params) {
    return fetcher({
        url: '/v1/wallet/exchange',
        params: params,
        method: 'POST',
        body,
    });
}
