export async function getScore(id, params, old, market) {
    const res = await fetch(
        old
            ? `${process.env.NEXT_PUBLIC_API_URL}/v1${market === 'tse' ? '/core/ticker' : '/cryptocurrencies'}/${id}/risk_score`
            : `${process.env.NEXT_PUBLIC_API_URL}/v1/assets/${id}/score`
    );

    if (!res.ok) throw new Error(`Failed to fetch data`);

    return await res.json();
}
