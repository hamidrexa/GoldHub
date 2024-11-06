'use client';

import { fetcher } from '@/libs/utils';

export function natiionalCodeVerification() {
    return fetcher({
        method: 'GET',
        url: '/v2/accounts/nationalCode/verification/',
    });
}
