export async function getSignalsCount(id: string) {
    let url = `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/tickers/${id}/signals/today_count`;
    const res = await fetch(url, {
        method: 'GET',
    });

    if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

    return res.json();
}
