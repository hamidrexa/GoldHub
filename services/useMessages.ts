'use client';
import useSWR from 'swr';

export function useMessages({ options, market }) {
    const { data, error, isLoading } = useSWR({
        url: market === 'tse' ? `/v1/core/signals` : `/v1/crypto/signals`,
        params: {
            ...options,
            market,
        },
    });

    return {
        messages: data,
        isLoading,
        error,
    };
}
