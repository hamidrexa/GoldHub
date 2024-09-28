'use client';
import useSWR from 'swr';

export function useGroupMessages({ options }) {
    const { data, error, isLoading } = useSWR({
        url: `/v2/signals?group_id=1&market_country=ir`,
    });

    return {
        groupMessages: data,
        isLoading,
        error,
    };
}
