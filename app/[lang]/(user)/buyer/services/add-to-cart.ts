import { fetcher } from '@/libs/utils';

export function addToCart(body) {
    return fetcher({
        url: `/api/v1/gold_artifacts/add_to_cart`,
        body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
        },
        method: 'POST',
    });
}