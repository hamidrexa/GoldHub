import { Signal } from '@/app/[lang]/(user)/signals-new/types/signal';

export async function getMarketsIndex(): Promise<Array<Signal>> {
    let url = `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/core/markets/index`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

    return res.json();
}
