'use client';
import useSWR from 'swr';

export function useAsset({ market, id, options }) {
    const { data, error, isLoading } = useSWR({
        url:
            market === 'tse'
                ? `/v2/core/tickers/${id}`
                : `/v1/cryptocurrencies/${id}`,
        params: {
            ...(options.lang !== 'fa' && { local: options.lang }),
        },
    });

    return {
        asset: data,
        isLoading,
        error,
    };
}
