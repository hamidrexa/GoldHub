import { removeObjectFalsyValues } from '@/libs/utils';
import Cookies from 'js-cookie';

export async function getTopPublishers(options: any) {
    // @ts-ignore
    const queryString = new URLSearchParams(
        removeObjectFalsyValues(options)
    ).toString();

    let url = `${process.env.NEXT_PUBLIC_API_URL}/v2/publishers/top?${queryString}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

    return res.json();
}
