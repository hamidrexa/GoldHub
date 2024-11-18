'use client';

import useSWR from 'swr';

export function useCart() {
    const { data, error, isLoading,mutate } = useSWR({
        url: `/v1/users/cart`
    }
    );
    return {
        data: [data],
        isLoading,
        error,
        mutate
    };
}
