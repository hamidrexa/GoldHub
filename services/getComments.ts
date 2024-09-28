export async function getComments(entity : string , id : number) {
    // @ts-ignore
    const res = await fetch(
        `https://strapi-sahmeto.darkube.app/api/comments/api::${entity}.${entity}:${id}`
    );

    if (!res.ok) throw new Error('Failed to fetch data');

    return res.json();
}