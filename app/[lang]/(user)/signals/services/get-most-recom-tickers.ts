import { fetcher } from '@/libs/utils';

export async function getMostRecommendedTicker() {
    return fetcher({
        url: '/v3/core/most-recom-tickers?n_top_trader=0&market_index_effect=false',
    });
}
