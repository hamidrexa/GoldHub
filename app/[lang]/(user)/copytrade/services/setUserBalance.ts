import { fetcher } from '@/libs/utils';

export function setUserBalance(body: { publisher: string; balance: string }) {
    return fetcher({
        method: 'POST',
        url: '/v2/copytrade/copies',
        body: body,
    });
}
