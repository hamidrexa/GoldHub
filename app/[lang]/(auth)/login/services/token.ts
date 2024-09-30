import { fetcher } from '@/libs/utils';

export function token(body: any) {
    return fetcher({
        url: '/v2/accounts/token/',
        method: 'POST',
        body: body,
    });
}
