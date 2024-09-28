'use client';
import { Signal } from '@/app/[lang]/(user)/signals-new/types/signal';
import useSWR from 'swr';

export function useMarketIndex(): {
    marketIndex: Promise<Array<Signal>>;
    isLoading: boolean;
    error: any;
} {
    const { data, error, isLoading } = useSWR({
        url: `/rest/v1/core/markets/index`,
    });

    return {
        marketIndex: data,
        isLoading,
        error,
    };
}
