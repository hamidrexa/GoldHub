export async function getStopLossProfitTarget(market: string, id: string) {
    let url =
        market === 'tse'
            ? `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/ticker/${id}/stop_loss_and_profit_target`
            : `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/crypto/${id}/stop_loss_and_profit_target`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

    const data = await res.json();
    return data.core_asset?.[0]?.tickers?.[0].signals || {};
}
