'use client';
import useSWR from 'swr';

export function useCloseOrder(id, params) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/core/assets/${id}/closed_orders`,
        params: {
            size: 5,
            efficiency: 0,
            ...params
        },
    });

    return {
        closeOrder: data || {},
        isLoading,
        error,
    };
}
