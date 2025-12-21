'use client';
import useSWR from 'swr';
import Cookies from 'js-cookie';

export function useOrdersHistory(page?:number,id?: string | number , status?:string) {
    const params: Record<string, any> = {
        page_size: 5,
    };

    if (!!id) {
        params.order_id = id;
    }
    if (!!page) {
        params.page = page;
    }
    if (!!status) {
        params.status = status;
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
        count:data?.count,
        next:data?.next,
        previous:data?.previous,
        isLoading,
        error,
        mutate,
    };
}
