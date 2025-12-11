import { fetcher } from '@/libs/utils';

export function addProduct({ body, product_id }) {
    return fetcher({
        url: `/v1/gold_artifacts/product_create`,
        body,
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
        },
        method: 'POST',
    });
}

