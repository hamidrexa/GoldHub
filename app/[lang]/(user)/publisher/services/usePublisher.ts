'use client';
import useSWR from 'swr';

export function usePublisher({ id }) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/publishers/${id}`,
        params: {
            id,
        },
    });

    return {
        publisher: data,
        isLoading,
        error,
    };
}
