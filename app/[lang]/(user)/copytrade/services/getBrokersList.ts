import { fetcher } from '@/libs/utils';

export function getBrokersList() {
    return fetcher({
        url: '/v2/copytrade/brokers',
    });
}
