'use client';

import useSWR from 'swr';

export function useSignalsSummery(params) {
    const { data, error, isLoading } = useSWR({
        url: `/v2/core/signals/summery`,
        params
    });

    return {
        signalsSummery: data || [],
        isLoading,
        error,
    };
}
