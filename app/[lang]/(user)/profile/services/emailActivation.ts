'use client';

import { fetcher } from '@/libs/utils';

export function emailActivation(body: any) {
    return fetcher({
        method: 'POST',
        url: '/v2/accounts/emails/activation/',
        body: body,
    });
}
