import { fetcher } from '@/libs/utils';

export async function getProfile() {
    return fetcher({
        url: '/v1/users/profile',
        method: 'GET',
        status: true,
    });
}
