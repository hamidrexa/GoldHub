'use client';

import useSWR from 'swr';

export function usePlanList(lang) {
    const { data, error, isLoading, mutate } = useSWR({
        url: `/v1/transactions/plans`,
        lang,
    });

    return {
        plans: data || [],
        isLoading,
        error,
        mutate,
    };
}
