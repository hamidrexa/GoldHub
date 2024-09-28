'use client';
import useSWR from 'swr';

export function useRecommendedTickers() {
    const { data, error, isLoading } = useSWR({
        url: `/v3/core/most-recom-tickers`,
    });
    return {
        tickers: data,
        isLoading,
        error,
    };
}
