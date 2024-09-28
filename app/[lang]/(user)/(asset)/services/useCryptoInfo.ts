'use client';
import useSWR from 'swr';

export function useCryptoInfo(id, condition) {
    const { data, error, isLoading } = useSWR({
        absoluteUrl: condition
            ? `https://hasura.sahmeto.com/api/rest/${id}/crypto-info`
            : null,
    });
    return {
        cryptoInfo: data || [],
        isLoading,
        error,
    };
}
