import { fetcher } from '@/libs/utils';

export async function getMarketsIndex(date) {
    return fetcher({
        absoluteUrl: `${process.env.NEXT_PUBLIC_HASURA_API_URL}/market-index`,
        params: {
            date,
        },
    });
}
