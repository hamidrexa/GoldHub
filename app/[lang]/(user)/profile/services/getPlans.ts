import { fetcher } from '@/libs/utils';
import { Locale } from '@/i18n-config';

export function getPlans(lang?: Locale) {
    return fetcher({
        absoluteUrl: `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v3/users/plans`,
        sendToken: true,
        lang,
    });
}
