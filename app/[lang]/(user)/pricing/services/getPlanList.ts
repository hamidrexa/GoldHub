import { fetcher } from '@/libs/utils';
import { Locale } from '@/i18n-config';

export function getPlanList(lang?: Locale) {
    return fetcher({
        url: '/v1/transactions/plans',
        lang,
    });
}
