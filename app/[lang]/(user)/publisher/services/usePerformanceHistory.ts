'use client';
import useSWR from 'swr';

export function usePerformanceHistory(
    id: string,
    params?: { year?: string; chart_type?: any },
    condition: boolean = true
) {
    const { data, error, isLoading } = useSWR({
        url: condition
            ? `/v1/telegram/publishers/${id}/performance_per_month_chart`
            : null,
        params,
    });

    return {
        performanceHistory: data || {},
        isLoading,
        error,
    };
}
