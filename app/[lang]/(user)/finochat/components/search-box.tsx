'use client';

import {
    Popover,
    PopoverContentWithoutPortal,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bot, Check, ChevronDown } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import React, { useState } from 'react';
import Spinner from '@/components/spinner';
import { useAssets } from '@/services/useAssets';
import { getChatBot } from '@/app/[lang]/(user)/finochat/services/getChatBot';

export default function SearchBox() {
    const [open, setOpen] = useState(false);
    const [isSearching, setIsSearching] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const { assets: initial, isLoading } = useAssets();

    const assets = !!initial && {
        crypto: !!initial.crypto
            ? initial.crypto.map((coin) => ({
                  ...coin,
                  image: `https://cdn.sahmeto.com/media/${coin.image}`,
                  symbol: coin.symbol + '/' + coin.name_fa,
              }))
            : [],
        ticker: !!initial.ticker
            ? initial.ticker.map((ticker) => ({
                  ...ticker,
                  image: `https://sahmeto.com/ticker-images/${ticker.symbol_fa}.jpg`,
                  symbol: ticker.symbol_fa,
              }))
            : [],
    };

    const handleSelect = (asset) => {
        setSelectedAsset(asset);
        setOpen(false);
    };

    const sendDataToBot = async (asset_id) => {
        const res = await getChatBot({
            asset_id: asset_id,
            query: 'سلام بعنوان یک تحلیلگر بازارهای مالی جمع بندی خود را از سیگنال های زیر ارائه بده',
        })
            .then(() => {
                // console.log(res);
            })
            .catch(() => {
                // console.log('WRONG');
            });
    };
    return (
        <div className="flex w-full items-center justify-center gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-96 justify-between">
                        {selectedAsset?.symbol || 'نمادی انتخاب نشده است'}{' '}
                        <ChevronDown className="h-4 w-4" opacity={0.5} />
                    </Button>
                </PopoverTrigger>
                <PopoverContentWithoutPortal className="z-[90] w-96">
                    {' '}
                    <Command className="w-full">
                        <CommandInput
                            placeholder="نماد خود را پیدا کنید"
                            onInput={(e) => {
                                // @ts-ignore
                                setIsSearching(e.target.value);
                            }}
                        />
                        <CommandEmpty>نمادی یافت نشد</CommandEmpty>
                        <CommandList>
                            {isLoading ? (
                                <Spinner />
                            ) : (
                                <CommandGroup className="h-72 overflow-auto">
                                    {assets.ticker
                                        .slice(
                                            ...(!isSearching ? [0, 10] : [0])
                                        )
                                        .map((asset) => (
                                            <CommandItem
                                                key={asset.symbol_fa}
                                                value={asset.symbol_fa}
                                                onSelect={() =>
                                                    handleSelect(asset)
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <img
                                                        width={30}
                                                        height={30}
                                                        src={asset.image}
                                                        alt="asset image"
                                                        className="h-11 w-11 min-w-11 rounded-full object-cover"
                                                    />
                                                    {selectedAsset?.symbol ===
                                                        asset.symbol && (
                                                        <Check className="ml-2 h-4 w-4 text-green-500" />
                                                    )}
                                                    <span className="ml-2">
                                                        {asset.symbol_fa}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    {assets.crypto
                                        .slice(
                                            ...(!isSearching ? [0, 10] : [0])
                                        )
                                        .map((asset) => (
                                            <CommandItem
                                                key={asset.symbol}
                                                value={asset.symbol}
                                                onSelect={() =>
                                                    handleSelect(asset)
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <img
                                                        width={30}
                                                        height={30}
                                                        src={asset.image}
                                                        alt="asset image"
                                                        className="h-11 w-11 min-w-11 rounded-full object-cover"
                                                    />
                                                    {selectedAsset?.symbol ===
                                                        asset.symbol && (
                                                        <Check className="ml-2 h-4 w-4 text-green-500" />
                                                    )}
                                                    <span className="ml-2">
                                                        {asset.symbol}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContentWithoutPortal>
            </Popover>
            <Button
                onClick={() => {
                    sendDataToBot(selectedAsset.asset_id);
                }}
                variant="default"
                className="flex px-4 py-3 text-white "
            >
                <span>چت</span>
                <Bot />
            </Button>
        </div>
    );
}
