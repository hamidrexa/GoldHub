'use client';
import useSWR from 'swr';

export function useMetrics({ id, options }) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/telegram/publishers/${id}/recommended-tickers`,
        params: {
            ...options,
            id,
        },
    });

    return {
        metrics: data,
        isLoading,
        error,
    };
}
