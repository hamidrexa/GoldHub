export async function getBookmarksCount(options: any) {
    // @ts-ignore
    const queryString = new URLSearchParams(options).toString();

    let url = `${process.env.NEXT_PUBLIC_API_URL}/v2/bookmarks/count/?${queryString}`;
    const res = await fetch(url, {
        method: 'GET',
    });

    if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

    return res.json();
}
