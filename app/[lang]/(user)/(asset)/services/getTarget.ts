export async function getTarget(id: string, options: any) {
    const queryParams = {
        ...options,
        value: 'B',
    };
    // @ts-ignore
    const queryString = new URLSearchParams(queryParams).toString();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v2/assets/${id}/target?${queryString}`
    );

    if (!res.ok) throw new Error('Failed to fetch data');

    return res.json();
}
