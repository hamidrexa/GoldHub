'use client';

import useSWR from 'swr';

export function useTarget(id, params) {
    const { data, error, isLoading } = useSWR({
        url: `/v2/assets/${id}/target`,
        params: {
            ...params,
            value: 'B',
        },
    });

    return {
        target: data || {},
        isLoading,
        error,
    };
}
