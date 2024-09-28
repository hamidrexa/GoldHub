'use client';

import useSWR from 'swr';
import Cookies from 'js-cookie';
import { Locale } from '@/i18n-config';

export function usePlans(lang?: Locale) {
    const { data, error, isLoading } = useSWR({
        absoluteUrl: `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v3/users/plans`,
        sendToken: true,
        lang,
    });

    return {
        plans: data,
        isLoading,
        error,
    };
}
