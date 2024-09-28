import { Signal } from '@/app/[lang]/(user)/signals-new/types/signal';

export async function getSignals(queryParams): Promise<Array<Signal>> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/v2/core/signals/most-relevant?${new URLSearchParams(queryParams).toString()}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

    return res.json();
}
