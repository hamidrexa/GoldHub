import { fetcher } from '@/libs/utils';

export function updateInfo(body: any) {
    return fetcher({
        url: '/v1/users/update-info',
        method: 'PUT',
        body: body,
    });
}
