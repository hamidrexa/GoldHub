'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    CommandDialog,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import Spinner from '@/components/spinner';
import { getImage, getLinksLang, getUniqueArray } from '@/libs/utils';
import { Command } from 'cmdk';
import Image from 'next/image';
import { HistoryIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMultiSearch } from '@/services/useMultiSearch';
import useDebounce from '@/libs/useDebounce';
import { useRouter } from 'next-nprogress-bar';

export function Suggestion({ dict, lang, open, setOpen }) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const debouncedSearch = useDebounce(search, 300);
    const { data: suggestionItems, isLoading } =
        useMultiSearch(debouncedSearch);

    const indexUids = {
        tickers: 'نمادهای بورسی',
        publishers: 'تریدرها',
        cryptocurrencies: 'نمادهای ارزدیجیتالی',
    };
    const sortedSuggestionItems = suggestionItems.sort((a, b) => {
        const scoreA = a.hits[0]?._rankingScore || 0;
        const scoreB = b.hits[0]?._rankingScore || 0;
        return scoreB - scoreA;
    });

    useEffect(() => {
        const searchHistory: any[] = JSON.parse(
            localStorage.getItem('searchHistory')
        );
        setSearchHistory(searchHistory ? getUniqueArray(searchHistory) : []);
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder={dict.searchPlaceholder}
                value={search}
                onValueChange={setSearch}
                className="pl-10"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        router.push(`/search/?q=${encodeURIComponent(search)}`);
                        setOpen((open) => !open);
                    }
                }}
            />
            <CommandList>
                {isLoading && (
                    <Command.Loading className="flex w-full items-center justify-center py-4">
                        <Spinner />
                    </Command.Loading>
                )}
                {!!searchHistory.length && !isLoading && !search && (
                    <CommandGroup
                        heading={
                            <div className="flex items-center gap-2">
                                <HistoryIcon strokeWidth={1.5} />
                                آخرین جستجوهای شما
                            </div>
                        }
                    >
                        {searchHistory
                            .reverse()
                            .slice(0, 4)
                            .map((hit) => (
                                <CommandItem
                                    key={hit.id}
                                    className="cursor-pointer gap-2"
                                    onSelect={(value) => {
                                        switch (hit.type) {
                                            case 'tickers':
                                                router.push(
                                                    `${getLinksLang(lang)}/ticker/${hit.ticker_index}/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${hit.symbol_fa}`
                                                );
                                                break;
                                            case 'cryptocurrencies':
                                                router.push(
                                                    `${getLinksLang(lang)}/coins/${hit.symbol}`
                                                );
                                                break;
                                            case 'publishers':
                                                router.push(
                                                    `${getLinksLang(lang)}/publisher/${hit.primary_username}`
                                                );
                                                break;
                                        }
                                        setOpen((open) => !open);
                                    }}
                                >
                                    <div className="rounded-full border border-neutral-700 p-0.5">
                                        <Image
                                            className="h-8 w-8 min-w-8 rounded-full object-cover"
                                            width={32}
                                            height={32}
                                            src={getImage(hit)}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src =
                                                    hit.type === 'publishers'
                                                        ? `/img/sources/${hit.account_type}.png`
                                                        : '/img/no-image.jpg';
                                            }}
                                            alt=""
                                            unoptimized
                                        />
                                    </div>
                                    {hit.type !== 'publishers'
                                        ? `${hit.symbol_fa ?? hit.symbol}/${hit.name_fa}`
                                        : hit.name}
                                </CommandItem>
                            ))}
                    </CommandGroup>
                )}
                {sortedSuggestionItems.map(
                    (item, index) =>
                        !!item.hits.length && (
                            <CommandGroup
                                heading={
                                    <div className="flex items-center gap-2">
                                        {indexUids[item.indexUid]}
                                    </div>
                                }
                                key={index}
                            >
                                <div className="flex flex-col">
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
                                                        return `${getLinksLang(lang)}/ticker/${hit.ticker_index}/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${hit.symbol_fa}`;
                                                    case 'cryptocurrencies':
                                                        return `${getLinksLang(lang)}/coins/${hit.symbol}`;
                                                    case 'publishers':
                                                        return `${getLinksLang(lang)}/publisher/${hit.primary_username}`;
                                                }
                                            };

                                            return (
                                                <CommandItem
                                                    key={hit.id}
                                                    className="cursor-pointer gap-2"
                                                    value={hit.id}
                                                    onSelect={(value) => {
                                                        router.push(hitLink());
                                                        setOpen(
                                                            (open) => !open
                                                        );
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
                                                >
                                                    <div className="rounded-full border border-neutral-700 p-0.5">
                                                        <Image
                                                            className="h-8 w-8 min-w-8 rounded-full object-cover"
                                                            width={32}
                                                            height={32}
                                                            src={getImage(hit)}
                                                            onError={({
                                                                currentTarget,
                                                            }) => {
                                                                currentTarget.onerror =
                                                                    null;
                                                                currentTarget.src =
                                                                    item.indexUid ===
                                                                    'publishers'
                                                                        ? `/img/sources/${hit.account_type}.png`
                                                                        : '/img/no-image.jpg';
                                                            }}
                                                            alt=""
                                                            unoptimized
                                                        />
                                                    </div>
                                                    {item.indexUid !==
                                                    'publishers'
                                                        ? `${hit.symbol_fa ?? hit.symbol}/${hit.name_fa}`
                                                        : hit.name}
                                                </CommandItem>
                                            );
                                        })}
                                </div>
                            </CommandGroup>
                        )
                )}
            </CommandList>
            {!isLoading && (
                <div className="bg-blue-700 px-4 py-2.5 text-base text-white">
                    مشاهده بیشتر نتایج با
                    <Badge
                        className="font-sans"
                        variant="no-color"
                        rounded="md"
                    >
                        ↵ ENTER
                    </Badge>
                </div>
            )}
        </CommandDialog>
    );
}
