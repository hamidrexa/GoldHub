import Cookies from 'js-cookie';

export async function getDetails(id: string, options: any) {
    const queryParams = {
        ...options,
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v2/signals/${id}/watch?${queryString}`,
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
