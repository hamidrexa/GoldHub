import { fetcher } from '@/libs/utils';

export function getEvents(id) {
    return fetcher({
        url: `/v1/core/assets/stocks_corporate_action`,
        params: {
            isin: id,
            last_n: 5,
        },
    });
}
