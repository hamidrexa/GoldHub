export async function getChartAsset(market: string, id: string, options: any) {
    const queryParams = {
        ...options,
        ...(options.lang !== 'fa' && { local: options.lang }),
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();

    const res = await fetch(
        market === 'gold' ? `${process.env.NEXT_PUBLIC_API_URL}/v1/asset/${id}/prices?${queryString}` : (
            market === 'tse'
                ? `${process.env.NEXT_PUBLIC_API_URL}/v2/core/tickers/${id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/v1/cryptocurrencies/${id}?${queryString}`)
    );

    return !res.ok ? null : res.json();
}
