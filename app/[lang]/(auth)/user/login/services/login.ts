import { fetcher } from '@/libs/utils';

export function login(body: any) {
    return fetcher({
        url: '/v1/auth/login',
        method: 'POST',
        body: body,
        status: true,
    });
}
