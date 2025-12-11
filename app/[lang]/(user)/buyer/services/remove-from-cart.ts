import { fetcher } from '@/libs/utils';

export function removeFromCart(body) {
    return fetcher({
        url: `/v1/gold_artifacts/remove_from_cart`,
        body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
        },
        method: 'POST',
    });
}