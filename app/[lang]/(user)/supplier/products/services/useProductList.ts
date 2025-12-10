'use client';
import useSWR from "swr";

export function useProductList(supplierId: string) {
    const { data, error, isLoading } = useSWR({
        url: `/api/v1/gold_artifacts/products_list`,
        params: {
            page_size : 30,
            supplierId
        },
    });

    return {
        products: data?.results,
        isLoading,
        error,
    };
}