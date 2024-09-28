import { fetcher } from '@/libs/utils';

export function updateUserBrokerToken({
    id,
    api_key,
}: {
    id?: number | string;
    api_key: string;
}) {
    return fetcher({
        method: 'PUT',
        url: `/v2/copytrade/brokers/${id}`,
        body: { api_key },
    });
}
