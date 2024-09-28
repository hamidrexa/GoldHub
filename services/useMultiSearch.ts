'use client';

import useSWR from 'swr';

export function useMultiSearch(q) {
    const { data, error, isLoading } = useSWR({
        absoluteUrl: 'https://search-v2.sahmeto.com/multi-search',
        method: 'POST',
        body: {
            queries: [
                {
                    indexUid: 'cryptocurrencies',
                    q,
                    limit: 5,
                    showRankingScore: true,
                },
                {
                    indexUid: 'tickers',
                    q,
                    limit: 5,
                    showRankingScore: true,
                },
                {
                    indexUid: 'publishers',
                    q,
                    limit: 5,
                    showRankingScore: true,
                },
            ],
        },
        headers: {
            Authorization:
                'Bearer gsZxS3GYXKyhAAEnLG1pzpRhGZDQ7LyI0rsasqYRoq4Qwe0p',
        },
    });

    return {
        data: data?.results || [],
        isLoading,
        error,
    };
}
