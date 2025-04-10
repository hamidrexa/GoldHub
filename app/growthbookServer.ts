import {
    configureCache,
    GrowthBook,
    setPolyfills,
} from '@growthbook/growthbook';

export async function configureServerSideGrowthBook() {
    setPolyfills({
        fetch: (url: string, init: RequestInit) =>
            fetch(url, {
                ...init,
                next: {
                    revalidate: 10,
                    tags: ['growthbook'],
                },
            }),
    });
    configureCache({
        disableCache: true,
    });

    const gb = new GrowthBook({
        apiHost:
            process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST ??
            'https://api.growthbook.sahmeto.com',
        clientKey:
            process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY ??
            'sdk-fF7IIVNUAGLLo5S8',
    });
    await gb.init({ timeout: 2000 });

    return gb;
}
