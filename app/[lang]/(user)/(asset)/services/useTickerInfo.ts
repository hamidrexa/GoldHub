'use client';
import useSWR from 'swr';

export function useTickerInfo(index, condition) {
    const { data, error, isLoading } = useSWR({
        absoluteUrl: condition
            ? `https://hasura.sahmeto.com/api/rest/${index}/ticker-info`
            : null,
    });
    return {
        tickerInfo: data || [],
        isLoading,
        error,
    };
}
