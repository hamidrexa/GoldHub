import { fetcher } from '@/libs/utils';

export function Logout(userId: number | string) {
    return fetcher({
        url: '/v1/auth/logout',
        method: 'POST',
        body: {
            user_id:userId
        },
    });
}
