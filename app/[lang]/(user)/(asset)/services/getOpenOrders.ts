import Cookies from 'js-cookie';

export async function getOpenOrders(id: string, options?: any) {
    const queryParams = {
        ...options,
        size: 5,
        efficiency: 0,
        have_target: true,
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/core/assets/${id}/open_orders?${queryString}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        }
    );

    if (!res.ok) throw new Error('Failed to fetch data');

    return await res.json();
}
