import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== 'jbxJcFA6Ft')
        return Response.json({ message: 'You have no access.' });
    if (!url)
        return Response.json({
            revalidated: false,
            now: Date.now(),
            message: 'Missing path to revalidate',
        });

    revalidatePath(url);
    return Response.json({ revalidated: true, now: Date.now() });
}
