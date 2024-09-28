'use client';

import { useMostSearched } from '@/app/[lang]/(user)/search/services/useMostSearched';
import { Publisher } from '@/components/publisher';
import React from 'react';
import Asset from '@/components/asset';
import { SearchIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function MostSearched({ dict, lang, className }) {
    const { data, isLoading } = useMostSearched();

    return (
        <div className={className}>
            <div>
                <h2 className="flex items-center gap-5 text-lg font-bold leading-relaxed md:text-[22px]">
                    <SearchIcon />
                    بیشترین نماد جستجو شده
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-4">
                    {data.crypto
                        ?.slice(0, 5)
                        .map((asset) => (
                            <Asset
                                key={asset.id}
                                dict={dict}
                                lang={lang}
                                asset={asset}
                                className="text-neutral-200 transition-colors hover:text-neutral-300"
                            />
                        ))}
                </div>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                    {data.tickers
                        ?.slice(0, 5)
                        .map((asset) => (
                            <Asset
                                key={asset.id}
                                dict={dict}
                                lang={lang}
                                asset={asset}
                                className="text-neutral-200 transition-colors hover:text-neutral-300"
                            />
                        ))}
                </div>
            </div>
            <div className="mt-16">
                <h2 className="flex items-center gap-5 text-lg font-bold leading-relaxed md:text-[22px]">
                    <SearchIcon />
                    بیشترین تریدرهای جستجو شده
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-4">
                    {isLoading &&
                        [1, 2, 3, 4, 5, 6].map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3"
                            >
                                <Skeleton className="h-14 w-14 min-w-14 rounded-full" />
                                <Skeleton className="h-5 w-36" />
                            </div>
                        ))}
                    {data.publishers?.slice(0, 6).map((publisher) => (
                        <Publisher
                            lang={lang}
                            key={publisher.id}
                            dict={dict}
                            elements={{
                                powerOfAnalytics: false,
                            }}
                            publisher={publisher}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
