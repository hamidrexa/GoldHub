'use client';

import useSWR from 'swr';

export function useStockPortfolio({ id }) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/telegram/publishers/${id}/stock-portfolio`,
    });

    return {
        portfolio: data,
        isLoading,
        error,
    };
}
