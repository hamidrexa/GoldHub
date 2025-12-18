'use client';
import useSWR from 'swr';
import Cookies from 'js-cookie';

export function useOrdersHistory(id?: string | number) {
    const params: Record<string, any> = {
        page_size: 10,
    };

    if (!!id) {
        params.order_id = id;
    }

    const { data, error, isLoading,mutate } = useSWR({
        url: `/v1/gold_artifacts/orders_history`,
        params,
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
    });

    return {
        history: data?.results,
        isLoading,
        error,
        mutate,
    };
}
