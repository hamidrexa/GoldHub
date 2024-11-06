'use client';
import useSWR from 'swr';

export function useChartAssets(params) {
    const { data, error, isLoading } = useSWR({
        absoluteUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/asset/${params.id}/prices`,
        params
    });

    return {
        assets: data || [],
        isLoading,
        error,
    };
}
