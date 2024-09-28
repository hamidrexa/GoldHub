'use client';
import useSWR from 'swr';

export function useRecommendedCrypto() {
    const { data, error, isLoading } = useSWR({
        url: `/v3/crypto/most-recommended`,
    });
    return {
        crypto: data,
        isLoading,
        error,
    };
}
