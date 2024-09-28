import { fetcher } from '@/libs/utils';

export function setUserBrokerToken(body: { broker?: string; api_key: string }) {
    return fetcher({
        method: 'POST',
        url: '/v2/copytrade/brokers',
        body: body,
    });
}
