import { fetcher } from '@/libs/utils';

export function forgetPassword(body: any) {
    return fetcher({
        url: '/v1/auth/forgot-password',
        method: 'POST',
        body: body,
    });
}
