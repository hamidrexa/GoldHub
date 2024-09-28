export async function getAsset(market: string, id: string, options: any) {
    const queryParams = {
        ...(options.lang !== 'fa' && { local: options.lang }),
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();

    const res = await fetch(
        market === 'tse'
            ? `${process.env.NEXT_PUBLIC_API_URL}/v2/core/tickers/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/v1/cryptocurrencies/${id}?${queryString}`
    );

    return !res.ok ? null : res.json();
}
