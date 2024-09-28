import { fetcher } from '@/libs/utils';

export async function getMostRecommendedCrypto() {
    return fetcher({
        url: '/v3/crypto/most-recommended?n_top_trader=0',
    });
}
