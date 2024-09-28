'use client';

import { fetcher } from '@/libs/utils';

export function phoneVerification() {
    return fetcher({
        method: 'GET',
        url: '/v2/accounts/phones/verification/',
    });
}
