'use client';
import useSWR from 'swr';

export function useOpenOrders(id, params) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/core/assets/${id}/open_orders`,
        params: {
            ...params,
            size: 5,
            efficiency: 0,
            have_target: true,
        },
    });

    return {
        openOrders: data || {},
        isLoading,
        error,
    };
}
