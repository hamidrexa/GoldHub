import Cookies from 'js-cookie';

export async function getMessages(market: string, options: any) {
    const queryParams = {
        ...options,
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();

    let url = market === 'tse'
        ? `${process.env.NEXT_PUBLIC_API_URL}/v1/core/signals?${queryString}`
        : `${process.env.NEXT_PUBLIC_API_URL}/v1/crypto/signals?${queryString}`;
    const res = await fetch(
        url,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

    return res.json();
}
