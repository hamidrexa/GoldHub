'use client';

import useSWR from 'swr';

export function useTargetV3(id, params) {
    const { data, error, isLoading } = useSWR({
        url: `/v3/assets/${id}/target`,
        params: {
            ...params,
        },
    });

    return {
        target: data || {},
        isLoading,
        error,
    };
}