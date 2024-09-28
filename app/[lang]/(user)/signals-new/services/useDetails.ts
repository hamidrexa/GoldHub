'use client';
import useSWR from 'swr';

export function useDetails({ id, options }) {
    const { data, error, isLoading } = useSWR({
        url: `/v2/signals/${id}/watch}`,
        params: {
            id,
            ...options,
        },
    });

    return {
        details: data,
        isLoading,
        error,
    };
}
