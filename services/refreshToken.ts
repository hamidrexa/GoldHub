import { fetcher } from '@/libs/utils';

export async function refreshToken(refreshToken: string) {
    return fetcher({
        url: '/v1/auth/refresh/',
        method: 'POST',
        body: {
            refresh: refreshToken,
        },
    });
}
