import { fetcher } from '@/libs/utils';

export function updateSignal(body: any, id: number) {
    return fetcher({
        url: `/v2/core/signals/${id}`,
        method: 'PUT',
        body: body,
    });
}
