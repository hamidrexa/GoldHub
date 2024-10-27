'use client';

import useSWR from 'swr';

export function usePrice({ id, condition = true }) {
    const { data, error, isLoading } = useSWR({
        absoluteUrl: condition ? `https://api-gateway.sahmeto.com/api/v2/core/assets/${id}/price` : null,
    },
        {refreshInterval : 60000}
        );
    return {
        price: data?.price || data || {},
        isLoading,
        error,
    };
}
