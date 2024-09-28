'use client';
import useSWR from 'swr';

export function useMessages({ id, options }) {
    const { data, error, isLoading } = useSWR({
        url: `/v1/telegram/publishers/${id}/messages}`,
        params: {
            ...(options.filter !== 'all' && { value: options.filter }),
            page: options.page,
            page_size: 20,
            ...(options.lang !== 'fa' && { language: options.lang }),
            ...(options.publisherId && { publisher: options.publisherId }),
        },
    });

    return {
        messages: data,
        isLoading,
        error,
    };
}
