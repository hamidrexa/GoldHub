'use client';
import useSWR from 'swr';
import Cookies from 'js-cookie';

export function useOrdersHistory(
    page: number,
    id?: string | number,
    status?: string,
    role?: string,
    pageSize: number = 10
) {
    const params: Record<string, any> = {
        page_size: pageSize,
    };


    if (!!id) {
        params.order_id = id;
    }
    if (!!role) {
        params.role = role;
    }
    if (!!status) {
        params.status = status;
    }

    params.page = page + 1;

    const { data, error, isLoading, mutate } = useSWR({
        url: `/v1/gold_artifacts/orders_history`,
        params,
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
    });

    return {
        history: data?.results,
        count: data?.count,
        next: data?.next,
        previous: data?.previous,
        isLoading,
        error,
        mutate,
    };
}
