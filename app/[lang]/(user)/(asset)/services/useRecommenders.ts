'use client';
import useSWR from 'swr';

export function useRecommenders({ id, options, market }) {
    const { data, error, isLoading } = useSWR({
        url:
            market === 'tse'
                ? `${process.env.NEXT_PUBLIC_API_URL}/v2/core/tickers/${id}/recommenders}`
                : `${process.env.NEXT_PUBLIC_API_URL}/v2/cryptocurrencies/${id}/recommenders}`,
        params: {
            ...options,
            id,
            market,
        },
    });

    return {
        recommenders: data,
        isLoading,
        error,
    };
}
