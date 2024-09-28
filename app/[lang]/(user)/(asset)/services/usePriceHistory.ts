'use client';
import useSWR from 'swr';

export function usePriceHistory(id, params, condition) {
    const { data, error, isLoading } = useSWR({
        url: condition ? `/v1/core/${id}/price_history` : null,
        params,
    });

    return {
        priceHistory: data || [],
        isLoading,
        error,
    };
}
