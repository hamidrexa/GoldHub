'use client';

import { Locale } from '@/i18n-config';
import { cn, currency } from '@/libs/utils';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';

// Import Swiper styles
import 'swiper/css';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { title } from 'process';
import { PieChart } from './pie-chart';
import SparkLine from './sparkline';

type IdsYpe = {
    value: any,
    title: string,
    key: string
}
type Props = {
    dict: any;
    lang: Locale;
    className?: string;
    ids: IdsYpe[];
    headerIcon?: any,
    headerTitle: string,
    yourInventory: number,
    measurementTitle: string,
    price: number,
    percentage: number
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
    percentage
}: Props) {

    const items = [
        { title: 'روز', value: 'day' },
        { title: 'ماه', value: 'mounth' },
        { title: 'سال', value: 'year' },

    ]
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
                <div className="flex w-full flex-row justify-between gap-[12px]">
                    <div className='flex flex-row gap-[5px] items-center justify-center'>
                        <Label
                            className="flex text-gray-900"
                        >
                            سود ماه اخیر:
                        </Label>
                        <Label className="flex text-[green] font-black">
                            %
                        </Label>
                        <Label
                            className="flex text-[green] text-lg"
                        >
                            {percentage}  {percentage >= 0 ? '+' : '-'}
                        </Label>
                    </div>
                    <div className='flex min-w-20'>
                        <Select
                            dir="rtl"
                            // defaultValue={signalIndex}
                            onValueChange={(index) => {
                                // setSignalIndex(null);
                                // setSignalIndex(index);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="انتخاب نماد" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {items.map((item, index) => (
                                        <SelectItem
                                            key={index}
                                            value={item.value}
                                        >
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 ">
                    <SparkLine
                        market={'tse'}
                        tooltip={true}
                        name={dict.rank}
                        lang={lang}
                        color="#10EDC5"
                        xDataKey="date"
                        yDataKey="rank"
                        data={[  { rank: 3, date: '2024-09-30' },
                            { rank: 3, date: '2024-10-01' },
                            { rank: 3, date: '2024-10-02' },
                            { rank: 3, date: '2024-10-03' },
                            { rank: 3, date: '2024-10-04' },
                            { rank: 3, date: '2024-10-05' },
                            { rank: 2, date: '2024-10-06' },
                            { rank: 1, date: '2024-10-07' },
                            { rank: 1, date: '2024-10-08' },
                            { rank: 1, date: '2024-10-09' },
                            { rank: 1, date: '2024-10-10' },
                            { rank: 1, date: '2024-10-11' },
                            { rank: 1, date: '2024-10-12' },
                            { rank: 1, date: '2024-10-13' },
                            { rank: 1, date: '2024-10-14' },
                            { rank: 1, date: '2024-10-15' },
                            { rank: 1, date: '2024-10-16' },
                            { rank: 1, date: '2024-10-17' },
                            { rank: 1, date: '2024-10-18' },
                            { rank: 1, date: '2024-10-19' },
                            { rank: 1, date: '2024-10-20' },
                            { rank: 1, date: '2024-10-21' },
                            { rank: 1, date: '2024-10-22' },
                            { rank: 1, date: '2024-10-23' },
                            { rank: 1, date: '2024-10-24' },
                            { rank: 2, date: '2024-10-25' },
                            { rank: 2, date: '2024-10-26' },
                            { rank: 2, date: '2024-10-27' },
                            { rank: 2, date: '2024-10-28' },
                            { rank: 2, date: '2024-10-29' },
                            { rank: 2, date: '2024-10-30' },
                            { rank: 2, date: '2024-10-30' }].map(
                            (rank) => ({
                                ...rank,
                                // rank:
                                //     score.all_member -
                                //     rank.rank,
                            })
                        )}
                        width="100%"
                        height={125}
                    />
                </div>
            </div >
        </>
    );
}
