'use client';

import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/libs/utils';
import { Locale } from '@/i18n-config';
import { MessagesParams } from '@/app/[lang]/(user)/(asset)/types/Messages';
import { useEffect } from 'react';
import { preload } from 'swr';

export function useMessages(params: MessagesParams, lang?: Locale) {
    const { data, error, size, setSize } = useSWRInfinite(
        (pageIndex, previousPageData) => {
            if (previousPageData && !previousPageData.results.length)
                return null;

            return {
                url: '/v1/messages',
                params: { ...params, page: pageIndex + 1 },
                lang,
            };
        },
        fetcher,
        { revalidateFirstPage: false }
    );

    useEffect(() => {
        preload(
            {
                url: '/v1/messages',
                params: { ...params, publisher__top: true, page: 1 },
                lang,
            },
            fetcher
        );
        preload(
            {
                url: '/v1/messages',
                params: { ...params, page: 2 },
                lang,
            },
            fetcher
        );
        preload(
            {
                url: '/v1/messages',
                params: { ...params, assetsignal__values: 'B', page: 1 },
                lang,
            },
            fetcher
        );
        preload(
            {
                url: '/v1/messages',
                params: { ...params, assetsignal__values: 'S', page: 1 },
                lang,
            },
            fetcher
        );
    }, []);

    const messages = data
        ? data.reduce((acc, page) => [...acc, ...page.results], [])
        : null;
    const isLoadingInitialData = !data && !error;
    const isLoadingMore =
        isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isEmpty = data?.[0]?.results.length === 0;
    const isReachingEnd =
        isEmpty ||
        (data && data[data.length - 1]?.results.length < params.page_size);

    return {
        messages,
        isLoading: isLoadingInitialData || (isLoadingMore && !error),
        isError: error,
        size,
        setSize,
        isReachingEnd,
    };
}
