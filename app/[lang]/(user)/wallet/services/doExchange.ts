import { fetcher } from '@/libs/utils';

export function doExchange({ type }: { type: 'buy' | 'sell' }) {
    return fetcher({
        method: 'POST',
        url: '/v1/wallet/exchange',
        params: {
            type,
        },
    });
}
