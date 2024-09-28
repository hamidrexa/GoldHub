import { fetcher } from '@/libs/utils';

export async function getTopPublishersV2() {
    return fetcher({
        absoluteUrl: `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v2/toptraderperformances`,
    });
}
