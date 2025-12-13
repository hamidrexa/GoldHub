'use client';
import useSWR from "swr";

export function useOrdersHistory() {
    const { data, error, isLoading } = useSWR({
        url: `/v1/gold_artifacts/orders_history`,
        params: {
            page_size:10,
        },
       headers: {
           Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
       }
    });

    return {
        history: data?.results,
        isLoading,
        error,
    };
}