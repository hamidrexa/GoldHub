import { fetcher } from '@/libs/utils';

export function getSignals(params: any) {
    return fetcher({
        url: '/v2/core/assets/top',
        params,
    });
}
