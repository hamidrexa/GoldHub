'use client';
import useSWR from 'swr';

export function useCloseOrders(id, params) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/telegram/publishers/${id}/closed_orders`,
        params: {
            ...params,
            efficiency: 0,
            size: 5,
        },
    });

    return {
        closeOrder: data || {},
        isLoading,
        error,
    };
}