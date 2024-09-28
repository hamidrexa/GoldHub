'use client';
import useSWR from 'swr';

export function useMessageCount() {
    const { data, error, isLoading } = useSWR({
        url: `/v1/telegram/msg-count`,
    });

    return {
        msgCount: data,
        isLoading,
        error,
    };
}
