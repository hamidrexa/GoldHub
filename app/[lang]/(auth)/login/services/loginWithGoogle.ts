import { fetcher } from '@/libs/utils';

export function loginWithGoogle(lang, credential: string) {
    return fetcher({
        url: '/v1/auth/login-with-google',
        method: 'POST',
        body: { credential },
        lang,
        status: true,
    });
}
