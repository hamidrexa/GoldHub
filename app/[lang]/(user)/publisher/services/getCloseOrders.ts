import Cookies from 'js-cookie';

export async function getCloseOrders(id: string, options?: any) {
    const queryParams = {
        ...options,
        page: 1,
        size: 10,
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/telegram/publishers/${id}/closed_orders?${queryString}`,
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
