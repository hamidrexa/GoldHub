import Cookies from 'js-cookie';

export async function publisherOwnership(publisherId: string | number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/trader-page-request`, {
        method: 'POST',
        body: JSON.stringify({
            requested_publisher_id: publisherId,
        }),
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch data`);

    return res.json();
}
