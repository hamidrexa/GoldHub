'use client';
import useSWR from "swr";

export interface ProductListFilters {
    category?: string;
    title?: string;
    karat?: number;
    min_weight?: number;
    max_weight?: number;
    min_price?: number;
    max_price?: number;
    supplier?: string;
    is_bookmarked?: boolean;
}

export function useProductList(supplierId?: string, filters?: ProductListFilters,isBookMarked=false) {
    // Build params object, only including defined values
    const params: Record<string, any> = {
        page_size: 30,
        supplier: supplierId,
        is_bookmarked: isBookMarked,
    };


    // Add filter params if provided
    if (filters) {
        if (filters.category) params.category = filters.category;
        if (filters.title) params.title = filters.title;
        if (filters.karat !== undefined) params.karat = filters.karat;
        if (filters.min_weight !== undefined) params.min_weight = filters.min_weight;
        if (filters.max_weight !== undefined) params.max_weight = filters.max_weight;
        if (filters.min_price !== undefined) params.min_price = filters.min_price;
        if (filters.max_price !== undefined) params.max_price = filters.max_price;
        if (filters.supplier) params.supplier = filters.supplier;
        if (filters.is_bookmarked !== undefined) params.is_bookmarked = filters.is_bookmarked;
    }

    const { data, error, isLoading,mutate} = useSWR({
        url: `/v1/gold_artifacts/products_list`,
        params
    });

    return {
        products: data?.results,
        isLoading,
        error,
        mutate,
    };
}