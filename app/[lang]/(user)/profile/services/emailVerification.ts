'use client';

import { fetcher } from '@/libs/utils';

export function emailVerification() {
    return fetcher({
        method: 'GET',
        url: '/v2/accounts/emails/verification/',
    });
}
