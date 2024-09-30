import { fetcher } from '@/libs/utils';

export function getMessagesCount(primaryUsername) {
    return fetcher({
        absoluteUrl: `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/core/publishers/${primaryUsername}/message_count`,
    });
}
