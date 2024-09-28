export async function getMessageCount() {
    // @ts-ignore
    const res = await fetch(
        "https://api.sahmeto.com/api/v1/telegram/msg-count"
    );

    if (!res.ok) throw new Error('Failed to fetch data');

    return res.json();
}