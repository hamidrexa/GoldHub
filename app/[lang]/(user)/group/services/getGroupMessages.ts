import Cookies from 'js-cookie';

export async function getGroupMessages() {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/v2/signals?group_id=1&market_country=ir`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

    return res.json();
}
