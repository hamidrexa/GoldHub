import { fetcher } from '@/libs/utils';

export function updateUser(body) {
    return fetcher({
        url: `/v1/users/profile`,
        body,
        method: 'PUT',
    });
}
