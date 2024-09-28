export async function getSignalsSummery(options: any) {
    const queryParams = {
        ...options,
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v2/core/signals/summery?${queryString}`
    );

    if (!res.ok) throw new Error(`Failed to fetch data`);

    return res.json();
}
