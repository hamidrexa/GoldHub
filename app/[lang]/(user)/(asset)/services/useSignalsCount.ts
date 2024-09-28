'use client';

import useSWR from 'swr';

export function useSignalsCount(id, condition) {
    const { data, error, isLoading } = useSWR(
        {
            absoluteUrl: condition ? `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/tickers/${id}/signals/today_count` : null,
        }
    );

    return {
        signalsCount: data,
        isLoading,
        error,
    };
}
