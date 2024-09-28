'use client';

import useSWR from 'swr';

export function useScore(id, params, old, market) {
    const { data, error, isLoading, mutate } = useSWR({
        url: old
            ? `/v1${market === 'tse' ? '/core/ticker' : '/cryptocurrencies'}/${id}/risk_score`
            : `/v1/assets/${id}/score`,
        params,
    });

    return {
        score: data,
        isLoading,
        error,
    };
}
