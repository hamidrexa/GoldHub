import Cookies from 'js-cookie';

export async function getRecommenders(
    market: string,
    id: string,
    options: any
) {
    const queryParams = {
        ...options,
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();

    const res = await fetch(
        market === 'tse'
            ? `${process.env.NEXT_PUBLIC_API_URL}/v2/core/tickers/${id}/recommenders?${queryString}`
            : `${process.env.NEXT_PUBLIC_API_URL}/v2/cryptocurrencies/${id}/recommenders?${queryString}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch data`);

    return await res.json();
}
