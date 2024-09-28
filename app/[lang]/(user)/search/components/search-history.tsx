'use client';

import React, { useEffect, useState } from 'react';
import { Publisher } from '@/components/publisher';
import Asset from '@/components/asset';
import { HistoryIcon } from 'lucide-react';
import { getLinksLang, getUniqueArray } from '@/libs/utils';

export function SearchHistory({ dict, lang, className }) {
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        const searchHistory: any[] = JSON.parse(
            localStorage.getItem('searchHistory')
        );
        setSearchHistory(searchHistory ? getUniqueArray(searchHistory) : []);
    }, []);

    return (
        !!searchHistory.length && (
            <>
                <h2 className="flex items-center gap-5 text-lg font-bold leading-relaxed md:text-[22px]">
                    <HistoryIcon />
                    آخرین جستجوهای شما
                </h2>
                <div className="mb-16 mt-5 flex flex-col gap-6">
                    {searchHistory
                        .reverse()
                        .slice(0, 4)
                        .map((hit) => {
                            const hitLink = () => {
                                switch (hit.type) {
                                    case 'tickers':
                                        return `${getLinksLang(lang)}/ticker/${hit.ticker_index}/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${hit.symbol_fa}`;
                                    case 'cryptocurrencies':
                                        return `${getLinksLang(lang)}/coins/${hit.symbol}`;
                                }
                            };

                            return hit.type === 'publishers' ? (
                                <Publisher
                                    lang={lang}
                                    key={hit.id}
                                    dict={dict}
                                    elements={{
                                        powerOfAnalytics: false,
                                    }}
                                    publisher={hit}
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
                                />
                            );
                        })}
                </div>
            </>
        )
    );
}
