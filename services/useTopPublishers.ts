'use client';
import useSWR from 'swr';

export function useTopPublishers(params: { type: string; limit: number }) {
    const { data, error, isLoading } = useSWR({
        url: `/v2/publishers/top`,
        params,
    });
    return {
        tops: data,
        isLoading,
        error,
    };
}
