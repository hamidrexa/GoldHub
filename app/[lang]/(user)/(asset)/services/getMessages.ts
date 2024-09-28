import { MessagesParams } from '@/app/[lang]/(user)/(asset)/types/Messages';
import { Locale } from '@/i18n-config';
import { fetcher } from '@/libs/utils';

export function getMessages(params?: MessagesParams, lang?: Locale) {
    return fetcher({
        url: '/v1/messages',
        params: { ...params },
        lang,
    });
}
