import { fetcher } from '@/libs/utils';

export function getBalance(brokerId: string | number) {
    return fetcher({
        url: `/v2/copytrade/brokers/${brokerId}/balance`,
    });
}
