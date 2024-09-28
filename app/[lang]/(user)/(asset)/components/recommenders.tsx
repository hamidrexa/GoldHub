'use client';

import { getDirection } from '@/libs/utils';
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { componentFormat } from '@/libs/stringFormatter';
import { getRecommenders } from '@/app/[lang]/(user)/(asset)/services/getRecommenders';
import { useGlobalContext } from '@/contexts/store';

export function Recommenders({
    dict,
    lang,
    market,
    asset,
    id,
    pureRecommenders,
}) {
    const { user } = useGlobalContext();
    const [recommenders, setRecommenders] = useState(pureRecommenders);
    const [traderCategoryFilter, setTraderCategoryFilter] =
        useState('TopTraders');
    const [durationFilter, setDurationFilter] = useState('30');

    useEffect(() => {
        async function getData() {
            setRecommenders(
                await getRecommenders(market, id, {
                    filter_name: traderCategoryFilter,
                    duration: durationFilter,
                })
            );
        }

        getData();
    }, [traderCategoryFilter, durationFilter]);

    return (
        <>
            <div className="mb-8 flex flex-col items-center justify-center gap-5 md:flex-row">
                <div className="flex w-full items-center justify-between gap-5 md:w-fit md:justify-start">
                    <div className="text-sm font-bold">{dict.filter}:</div>
                    <RadioGroup
                        defaultValue={traderCategoryFilter}
                        dir={getDirection(lang)}
                        className="flex items-center gap-3"
                        onValueChange={setTraderCategoryFilter}
                    >
                        <div>
                            <RadioGroupItem
                                value={null}
                                id="asset-recommenders-all-trader"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="asset-recommenders-all-trader"
                                className="cursor-pointer flex flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has[&:has([data-state=checked])]:font-black peer-data-[state=checked]:font-black peer-data-[state=checked]:font-black"
                            >
                                {dict.allTraders}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="TopTraders"
                                id="asset-recommenders-top-traders"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="asset-recommenders-top-traders"
                                className="cursor-pointer flex flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has[&:has([data-state=checked])]:font-black peer-data-[state=checked]:font-black"
                            >
                                {dict.top100Traders}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="MyTraders"
                                id="asset-recommenders-my-traders"
                                className="peer sr-only"
                                disabled={!user}
                            />
                            <Label
                                htmlFor="asset-recommenders-my-traders"
                                className="cursor-pointer flex flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has[&:has([data-state=checked])]:font-black peer-data-[state=checked]:font-black"
                            >
                                {dict.myTraders}
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex w-full items-center justify-between gap-5 md:w-fit md:justify-start">
                    <div className="text-sm font-bold">{dict.timeSlice}:</div>
                    <RadioGroup
                        defaultValue={durationFilter}
                        dir={getDirection(lang)}
                        className="flex items-center gap-3"
                        onValueChange={setDurationFilter}
                    >
                        <div>
                            <RadioGroupItem
                                value="30"
                                id="recommenders-1month"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="recommenders-1month"
                                className="cursor-pointer flex flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has[&:has([data-state=checked])]:font-black peer-data-[state=checked]:font-black"
                            >
                                {dict.oneMonth}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="90"
                                id="recommenders-3month"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="recommenders-3month"
                                className="cursor-pointer flex flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has[&:has([data-state=checked])]:font-black peer-data-[state=checked]:font-black"
                            >
                                {dict.threeMonth}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="180"
                                id="recommenders-6month"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="recommenders-6month"
                                className="cursor-pointer flex flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has[&:has([data-state=checked])]:font-black peer-data-[state=checked]:font-black"
                            >
                                {dict.sixMonth}
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-white p-5">
                <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
                    <div className="text-sm">
                        {componentFormat(
                            dict.buyRecommendation,
                            {
                                assetSymbol: asset.symbol,
                                traderNumbers: recommenders.number_of_traders,
                            },
                            <span className="font-bold">
                                {recommenders.buy_count}
                            </span>,
                            <span className="font-bold">
                                {recommenders.number_of_traders === 100
                                    ? dict.topOneHundred
                                    : `${recommenders.number_of_traders} تریدر`}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-5 text-3xl font-medium">
                        <span>{recommenders.buy_count}</span>
                        <Progress
                            value={recommenders.buy_count}
                            length={recommenders.number_of_traders}
                            className="w-full"
                        />
                        <span>{recommenders.number_of_traders}</span>
                    </div>
                    <div className="text-sm">
                        {componentFormat(
                            dict.sellRecommendation,
                            {
                                assetSymbol: asset.symbol,
                            },
                            <span className="font-bold">
                                {recommenders.sell_count}
                            </span>,
                            <span className="font-bold">
                                {recommenders.number_of_traders === 100
                                    ? dict.topOneHundred
                                    : `${recommenders.number_of_traders} تریدر`}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-5 text-3xl font-medium">
                        <span>{recommenders.sell_count}</span>
                        <Progress
                            variant="destructive"
                            value={recommenders.sell_count}
                            length={recommenders.number_of_traders}
                            className="w-full"
                        />
                        <span>{recommenders.number_of_traders}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
