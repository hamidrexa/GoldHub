'use client';
import { Signal } from '@/app/[lang]/(user)/signals-new/types/signal';
import useSWR from 'swr';

export function useSignals(): {
    signals: Promise<Array<Signal>>;
    isLoading: boolean;
    error: any;
} {
    const { data, error, isLoading } = useSWR({
        url: `/v2/core/signals/most-relevant`,
    });

    return {
        signals: data,
        isLoading,
        error,
    };
}
