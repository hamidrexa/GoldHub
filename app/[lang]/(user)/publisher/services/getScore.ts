import Cookies from 'js-cookie';

export async function getScore(id: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/telegram/publishers/${id}/score${process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' ? '?formula_id=117' : ''}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch data ${res.status}`);

    return res.json();
}
