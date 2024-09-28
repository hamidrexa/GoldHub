'use client';

import useSWR from 'swr';

export function useFeed(params) {
    const { data, error, isLoading, mutate } = useSWR({
        url: `/v3/bookmarks/`,
        params,
    });

    return {
        feed: data
            ? data?.results.map((item) => ({ ...item.content_object, ...item }))
            : [],
        isLoading,
        error,
        mutate,
    };
}
