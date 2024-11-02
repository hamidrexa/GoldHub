'use client';

import { Locale } from '@/i18n-config';
import { cn, currency, getDirection } from '@/libs/utils';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { Icons } from '@/components/ui/icons';

// Import Swiper styles
import 'swiper/css';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSignalsSummery } from '@/services/useSignalsSummery';
import { transformAssetData } from '@/libs/dataTransformers';
import { getAsset } from '@/app/[lang]/(user)/(asset)/services/getAsset';
import { BoxContent } from './box';
import { PriceSignalChart } from './price-signal-chart';

type IdsYpe = {
    value: any,
    title: string,
    key: string
}
type Props = {
    dict: any;
    lang: Locale;
    className?: string;
    ids?: IdsYpe[];
    headerIcon?: any,
    headerTitle?: string,
    yourInventory?: number,
    measurementTitle: string,
    price: number,
    percentage: number,
    market?: string,
    id: string
};

export default function ChartBox({
    dict,
    lang,
    className,
    ids,
    headerTitle,
    headerIcon,
    yourInventory,
    measurementTitle,
    price,
    percentage,
    market,
    id
}: Props) {
    const dir = getDirection(lang);
    const [year, setYear] = useState('1403');
    const [signalTypeFilter, setSignalTypeFilter] = useState('buy');
    const [durationFilter, setDurationFilter] = useState('30,day');
    const asset = transformAssetData(getAsset(market, id, { lang }));
    const [duration, durationScale] = durationFilter.split(',');

    return (
        <>
            <div
                className={cn(
                    'relative flex flex-col gap-8 rounded-md border border-gray-400 bg-white px-4 py-6 text-black',
                    className
                )}
            >
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-[10px]'>
                        {headerIcon ? headerIcon : <Icons.lineChart stroke="#0C0E3C" />}
                        {headerTitle}
                    </div>
                    <div className='cursor-pointer'>
                        <Icons.question />
                    </div>
                </div>
                <div className="flex w-full flex-col justify-center gap-2.5  md:items-center">
                    <div className="flex w-full flex-col gap-[12px]">
                        <div className='w-full flex flex-row justify-center gap-[4px]'>
                            <Label
                                className="flex text-gray-700"
                            >
                                {measurementTitle}
                            </Label>
                            <Label
                                className="flex text-neutral-800"
                            >
                                {currency(price, 'tse', lang)}
                            </Label>
                            <Label
                                className="flex text-gray-700"
                            >
                                {lang === 'fa' ? dict.toman : 'USD'}
                            </Label>
                        </div>
                    </div>

                </div>
                <div className="flex flex-col w-full items-center justify-center">
                    <div className='flex w-full'>
                        <PriceSignalChart
                            dict={dict}
                            lang={lang}
                            market={market}
                            asset={asset}
                        />
                    </div>
                </div>
            </div >
        </>
    );
}
