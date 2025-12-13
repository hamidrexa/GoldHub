import { fetcher } from '@/libs/utils';

export async function getProfile() {
    console.log('Ostad manam')
    return fetcher({
        url: '/v1/users/profile',
        method: 'GET',
        status: true,
    });
}
