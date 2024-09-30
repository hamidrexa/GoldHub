'use client';
import useSWR from 'swr';

export function useRankHistory({ id }) {
    const { data, error, isLoading } = useSWR({
        url: `/api/v1/publishers/${id}/rank_history`,
        params: {
            id,
        },
    });

    return {
        rankHistory: data,
        isLoading,
        error,
    };
}
