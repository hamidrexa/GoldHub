'use client';
import useSWR from 'swr';

export function useLastRun(param) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/core/most-recommended-tickers-last-run`,
    });

    return {
        res: data,
        isLoading,
        error,
    };
}
