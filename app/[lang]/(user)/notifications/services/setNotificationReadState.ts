import { fetcher } from '@/libs/utils';

export function setNotificationReadState(id: any) {
    return fetcher({
        url: `/v1/users/message/${id}`,
        method: 'POST',
    });
}
