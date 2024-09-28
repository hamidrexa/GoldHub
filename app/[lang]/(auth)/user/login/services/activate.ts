import { fetcher } from '@/libs/utils';

export function activate(body: any) {
    return fetcher({
        url: '/v1/auth/activate',
        method: 'POST',
        body: body,
    });
}
