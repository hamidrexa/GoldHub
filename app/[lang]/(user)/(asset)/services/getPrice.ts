import { fetcher } from '@/libs/utils';

export async function getPrice(id: string) {
    return fetcher({ url: `/v2/core/assets/${id}/price` });
}
