'use client';

import useSWR from 'swr';

export function useNotifications(condition) {
    const { data, error, isLoading, mutate } = useSWR({
        url: condition ? `/v1/users/message/list` : null,
    });

    return {
        notifications: data?.results || [],
        isLoading,
        error,
        mutate,
    };
}
