import { cookies } from 'next/headers';

export async function getOrdersHistory(id?: string) {
    const token = cookies().get('token')?.value;

    const params = new URLSearchParams({
        page_size: '10',
    });

    if (id) {
        params.set('id', id);
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/gold_artifacts/orders_history?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store', // important for fresh data
        }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch orders history');
    }

    return res.json();
}
