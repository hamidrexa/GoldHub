import { fetcher } from '@/libs/utils';

export function sendSignal(body: any) {
    return fetcher({
        url: '/v1/signal/',
        method: 'POST',
        body: body,
    });
}