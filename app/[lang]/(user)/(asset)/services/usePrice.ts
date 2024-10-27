'use client';

import useSWR from 'swr';

export function usePrice({ id, condition = true }) {
    const { data, error, isLoading } = useSWR({
        url: condition ? `/v2/core/assets/${id}/price` : null,
    }
        );
    return {
        price: data?.price || data || {},
        isLoading,
        error,
    };
}
