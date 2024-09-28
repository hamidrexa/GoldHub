import { fetcher } from '@/libs/utils';

export function discount(lang, body) {
    return fetcher({
        url: '/v2/transactions/discount',
        method: 'POST',
        body,
        lang,
    });
}
