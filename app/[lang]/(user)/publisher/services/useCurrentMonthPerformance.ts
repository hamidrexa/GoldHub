'use client';
import useSWR from 'swr';

export function useCurrentMonthPerformance({ id }) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/telegram/publishers/${id}/performance_risk_chart`,
        params: {
            id,
        },
    });

    return {
        currentMonthPerformance: data,
        isLoading,
        error,
    };
}
