import { fetcher } from '@/libs/utils';

export function setUserCopytradeBalance({
    publisherId,
    balance,
}: {
    publisherId: string;
    balance: string;
}) {
    return fetcher({
        method: 'POST',
        url: '/v2/copytrade/copies',
        body: {
            publisher: publisherId,
            balance,
        },
    });
}
