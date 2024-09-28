import Cookies from 'js-cookie';

export async function getStockPortfolio({ id, duration }) {
    const queryString = new URLSearchParams({
        'date_range': duration,
    }).toString();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/telegram/publishers/${id}/score?${queryString}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch data`);

    return res.json();
}
