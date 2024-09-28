'use client';

import { fetcher } from '@/libs/utils';

export function changePassword(body: any) {
    return fetcher({
        method: 'PUT',
        url: '/v1/auth/change-password',
        body: body,
    });
}
