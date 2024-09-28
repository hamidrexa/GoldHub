'use client';

import { fetcher } from '@/libs/utils';

export function getChatBot(body: any) {
    return fetcher({
        method: 'POST',
        absoluteUrl: 'https://gptchat.darkube.app/v2/chat_bot',
        body: body,
    });
}
