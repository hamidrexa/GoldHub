import { fetcher } from '@/libs/utils';

export function updateUserCopytradeBalance({
    id,
    balance,
}: {
    id: number;
    balance: string;
}) {
    return fetcher({
        method: 'PUT',
        url: `/v2/copytrade/copies/${id}`,
        body: {
            balance,
        },
    });
}
