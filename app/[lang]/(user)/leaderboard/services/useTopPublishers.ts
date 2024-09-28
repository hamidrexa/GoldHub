'use client';
import useSWR from 'swr';

export function useTopPublishers({ options }) {
    const { data, error, isLoading } = useSWR({
        url: `/v2/publishers/top`,
        params: {
            ...options,
        },
    });

    return {
        topPublishers: data,
        isLoading,
        error,
    };
}
