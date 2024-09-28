import Cookies from 'js-cookie';

export async function getRankHistory(id: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/publishers/${id}/rank_history${process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' ? '?formula_id=117' : ''}`,
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
