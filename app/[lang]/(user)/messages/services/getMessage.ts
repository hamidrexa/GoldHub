export async function getMessage(market: string, id: string, options: any) {
    const queryParams = {
        ...(options.lang !== 'fa' && { language: options.lang }),
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();

    let url =
        market === 'tse'
            ? `${process.env.NEXT_PUBLIC_API_URL}/v1/tickers/signals/${id}?${queryString}`
            : `${process.env.NEXT_PUBLIC_API_URL}/v1/crypto/signals/${id}/light`;
    const res = await fetch(url, {
        method: 'GET',
    });

    return !res.ok ? null : res.json();
}
