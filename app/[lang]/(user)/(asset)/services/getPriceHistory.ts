import { fetcher } from '@/libs/utils';

export async function getPriceHistory(
    id: string,
    params?: Record<string, any>
) {
    return fetcher({
        url: `/v1/core/${id}/price_history`,
        params: params,
    });
}
