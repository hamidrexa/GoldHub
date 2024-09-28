'use client';

import { fetcher } from '@/libs/utils';

export function phoneActivation(body: any) {
    return fetcher({
        method: 'POST',
        url: '/v2/accounts/phones/activation/',
        body: body,
    });
}
