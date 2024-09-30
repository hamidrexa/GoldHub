'use client';
import useSWR from 'swr';

export function useScore({ id }) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/telegram/publishers/${id}/score`,
        params: {
            id,
        },
    });

    return {
        score: data,
        isLoading,
        error,
    };
}
