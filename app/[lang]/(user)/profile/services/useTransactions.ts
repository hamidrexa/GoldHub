'use client';

import useSWR from 'swr';

export function useTransactions() {
    const { data, error, isLoading } = useSWR({
        absoluteUrl: `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/users/transactions`,
        sendToken: true,
    });

    return {
        transactions: data,
        isLoading,
        error,
    };
}
