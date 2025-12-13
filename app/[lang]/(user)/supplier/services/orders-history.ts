'use client';
import useSWR from "swr";
import Cookies from 'js-cookie';

export function useOrdersHistory() {
    const { data, error, isLoading } = useSWR({
        url: `/v1/gold_artifacts/orders_history`,
        params: {
            page_size:10,
        },
       headers: {
           Authorization: `Bearer ${Cookies.get('token')}`,
       }
    });

    return {
        history: data?.results,
        isLoading,
        error,
    };
}