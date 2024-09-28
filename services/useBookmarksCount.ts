'use client';
import useSWR from 'swr';

export function useBookmarksCount({ params, condition }) {
    const { data, error, isLoading } = useSWR({
        url: condition ? `/v2/bookmarks` : null,
        params,
    });

    return {
        bookmarksCount: data || {},
        isLoading,
        error,
    };
}
