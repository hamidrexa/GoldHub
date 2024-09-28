import Cookies from 'js-cookie';

export async function getPublisher(id: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/publishers/${id}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        }
    );

    return !res.ok ? null : res.json();
}
