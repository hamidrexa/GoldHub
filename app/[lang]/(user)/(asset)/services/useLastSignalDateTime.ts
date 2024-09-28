'use client';

import useSWR from 'swr';

export function useLastSignalDateTime(condition) {
    const { data, error, isLoading } = useSWR(
        {
            absoluteUrl: condition
                ? `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/tickers/signals/last_signal_datetime`
                : null,
        },
    );

    return {
        lastSignalDateTime: data,
        isLoading,
        error,
    };
}
