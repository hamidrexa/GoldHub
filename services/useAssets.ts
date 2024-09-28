'use client';
import useSWR from 'swr';

export function useAssets() {
    const { data, error, isLoading } = useSWR({
        absoluteUrl: `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/core/assets`,
    });

    return {
        assets: data || {},
        isLoading,
        error,
    };
}
