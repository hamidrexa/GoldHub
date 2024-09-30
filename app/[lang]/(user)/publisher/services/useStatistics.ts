'use client';

import useSWR from 'swr';

export function useStatistics({ primary_username }) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/publishers/${primary_username}/statistics`,
    });

    return {
        statistics: data,
        isLoading,
        error,
    };
}
