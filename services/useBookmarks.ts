'use client';
import useSWR from 'swr';

export function useBookmarks({ options }) {
    const { data, error, isLoading } = useSWR({
        url: `/v2/bookmarks`,
        params: {
            ...options,
        },
    });

    return {
        bookmarks: data,
        isLoading,
        error,
    };
}
