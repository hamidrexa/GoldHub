'use client';

import useSWR from 'swr';

export function useSignals(params?: any) {
    const { data, error, isLoading } = useSWR({
        url: '/v2/core/assets/top',
        params,
    });

    return {
        signals: data || [],
        isLoading: isLoading,
        error: error,
    };
}
