'use client';

import { useMultiSearch } from '@/services/useMultiSearch';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/libs/utils';
import React from 'react';
import Asset from '@/components/asset';
import { Publisher } from '@/components/publisher';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/empty';

export function Results({ dict, lang, className }) {
    const searchParams = useSearchParams();
    const { data, isLoading } = useMultiSearch(searchParams.get('q'));
    const indexUids = {
        tickers: 'نمادهای بورسی',
        publishers: 'تریدرها',
        cryptocurrencies: 'نمادهای ارزدیجیتالی',
    };
    const sortedSuggestionItems = data.sort((a, b) => {
        const scoreA = a.hits[0]?._rankingScore || 0;
        const scoreB = b.hits[0]?._rankingScore || 0;
        return scoreB - scoreA;
    });

    return (
        <>
            {!data.find((item) => !!item.hits.length) && !isLoading && (
                <Empty>نتیجه ای پیدا نشد.</Empty>
            )}
            <div
                className={cn(
                    'grid grid-cols-1 gap-4 md:grid-cols-2',
                    className
                )}
            >
                {isLoading &&
                    [1, 2, 3].map((_, index) => (
                        <div className="flex flex-col" key={index}>
                            <Skeleton className="mb-4 h-7 w-36" />
                            <div className="flex flex-col gap-6">
                                {[4, 5, 6].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <Skeleton className="h-14 w-14 min-w-14 rounded-full" />
                                        <Skeleton className="h-5 w-36" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                {sortedSuggestionItems.map(
                    (item, index) =>
                        !!item.hits.length && (
                            <div className="flex flex-col" key={index}>
                                <div className="mb-4 text-base font-bold md:text-lg">
                                    {indexUids[item.indexUid]}
                                </div>
                                <div className="flex flex-col gap-6">
                                    {item.hits
                                        .slice(
                                            0,
                                            item.indexUid === 'publishers'
                                                ? 6
                                                : 3
                                        )
                                        .map((hit) => {
                                            const hitLink = () => {
                                                switch (item.indexUid) {
                                                    case 'tickers':
                                                        return `/ticker/${hit.ticker_index}/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${hit.symbol_fa}`;
                                                    case 'cryptocurrencies':
                                                        return `/coins/${hit.symbol}`;
                                                }
                                            };

                                            return item.indexUid ===
                                                'publishers' ? (
                                                <Publisher
                                                    lang={lang}
                                                    key={hit.id}
                                                    dict={dict}
                                                    elements={{
                                                        powerOfAnalytics: false,
                                                    }}
                                                    publisher={hit}
                                                    onClick={() => {
                                                        const searchHistory: any[] =
                                                            JSON.parse(
                                                                localStorage.getItem(
                                                                    'searchHistory'
                                                                ) || '[]'
                                                            );
                                                        const updatedSearchHistory: any[] =
                                                            [
                                                                ...searchHistory,
                                                                {
                                                                    ...hit,
                                                                    type: item.indexUid,
                                                                },
                                                            ];
                                                        localStorage.setItem(
                                                            'searchHistory',
                                                            JSON.stringify(
                                                                updatedSearchHistory
                                                            )
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <Asset
                                                    key={hit.id}
                                                    dict={dict}
                                                    lang={lang}
                                                    asset={{
                                                        ...hit,
                                                        symbol: `${hit.symbol_fa ?? hit.symbol}/${hit.name_fa}`,
                                                        href: hitLink(),
                                                    }}
                                                    onClick={() => {
                                                        const searchHistory: any[] =
                                                            JSON.parse(
                                                                localStorage.getItem(
                                                                    'searchHistory'
                                                                ) || '[]'
                                                            );
                                                        const updatedSearchHistory: any[] =
                                                            [
                                                                ...searchHistory,
                                                                {
                                                                    ...hit,
                                                                    type: item.indexUid,
                                                                },
                                                            ];
                                                        localStorage.setItem(
                                                            'searchHistory',
                                                            JSON.stringify(
                                                                updatedSearchHistory
                                                            )
                                                        );
                                                    }}
                                                />
                                            );
                                        })}
                                </div>
                            </div>
                        )
                )}
            </div>
        </>
    );
}
