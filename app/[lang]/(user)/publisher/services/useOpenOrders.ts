'use client';
import useSWR from 'swr';

export function useOpenOrders(id, params, condition = true) {
    const { data, error, isLoading } = useSWR({
        url: condition ? `/v2/telegram/publishers/${id}/open_orders` : null,
        params: {
            size: 5,
            ...params,
        },
    });

    return {
        openOrders: data || {},
        isLoading,
        error,
    };
}
