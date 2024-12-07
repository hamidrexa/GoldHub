'use client';

import { cn, getDirection } from '@/libs/utils';
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { AreaBarComposedChart } from '@/components/area-bar-composed-chart';
import dayjs from 'dayjs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useChartAssets } from '@/services/useChartAssets';

type Props = {
    dict: any,
    lang: any,
    asset?: string,
    market: string
}

export function PriceSignalChart(props: Props) {
    const dir = getDirection(props.lang);
    const [durationFilter, setDurationFilter] = useState('daily');
    const [durationFilterTitle, setDurationFilterTitle] = useState('روز اخیر');
    const [signalTypeFilter, setSignalTypeFilter] = useState('buy');

    const { assets, isLoading } = useChartAssets({
        id: 1,
        filter: durationFilter
    });

    useEffect(() => {
        setDurationFilterTitle((items.find((item) => item.value === durationFilter))?.title)
    }, [durationFilter])
    const items = [
        { title: 'روز اخیر', value: 'daily' },
        { title: 'هفته اخیر', value: 'weekly' },
        { title: 'ماه اخیر', value: 'monthly' },
    ]

    const formatDate = (datetime, filter, lang) => {
        if (filter === 'daily') {
            return 'HH:MM';
        } else if (filter === 'weekly') {
            return 'dddd';
        } else if (filter === 'monthly') {
            return 'DD MMMM';
        }
        return datetime;
    };

    const percentageChange = (assets[assets.length - 1]?.price && assets[0]?.price) ? Number(((assets[assets.length - 1]?.price / assets[0]?.price - 1) * 100).toFixed(2)) : 0
    return (
        <div className='flex w-full flex-col p-[10px]'>
            <div className="flex w-full flex-row justify-between gap-[8px]">
                <div className='flex flex-row gap-[5px] items-center justify-center'>
                    <h5
                        className="flex text-gray-900"
                    >
                        تغییرات قیمت :
                    </h5>
                    <Label className={`flex text-[${Number(percentageChange) > 0 ? 'green' : 'red'}] font-black text-[28px]`}>
                        %
                    </Label>
                    <Label
                        className={`flex text-[green] font-black text-lg text-[28px] text-[${Number(percentageChange) > 0 ? 'green' : 'red'}]`}
                    >
                        {Math.abs(Number(percentageChange))}  {Number(percentageChange) >= 0 ? '+' : '-'}
                    </Label>
                </div>
                <div className='flex min-w-20'>
                    <Select
                        defaultValue={durationFilter}
                        onValueChange={setDurationFilter}
                        dir='rtl'
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="انتخاب بازه" />
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
            <div
                className={cn('-mx-2.5 md:-mx-0', {
                    'blur-md': isLoading,
                })}
            >
                <AreaBarComposedChart
                    dot
                    barChart={false}
                    lang={props.lang}
                    market={props.market}
                    dir={dir}
                    xDataKey="datetime"
                    yDataKey="price"
                    name={`قیمت`}
                    color={signalTypeFilter === 'buy' ? '#10EDC5' : '#DB2777'}
                    barDataKey={
                        // signalTypeFilter === 'buy'
                        // ? 
                        'price'
                        // : 'sell_signals_count'
                    }
                    barColor={
                        signalTypeFilter === 'buy' ? '#10EDC5' : '#DB2777'
                    }
                    barName={
                        signalTypeFilter === 'buy'
                            ? props.dict.price
                            : props.dict.price
                    }
                    interval="preserveEnd"
                    isAnimationActive={!isLoading}
                    data={
                        isLoading
                            ? [
                                {
                                    datetime: '2023-08-25',
                                    buy_signals_count: 244,
                                    sell_signals_count: 204,
                                    neutral_signals_count: 19,
                                    price: 25963.804954529245,
                                },
                                {
                                    datetime: '2023-09-01',
                                    buy_signals_count: 243,
                                    sell_signals_count: 161,
                                    neutral_signals_count: 17,
                                    price: 25620.79046354503,
                                },
                                {
                                    datetime: '2023-09-08',
                                    buy_signals_count: 198,
                                    sell_signals_count: 158,
                                    neutral_signals_count: 12,
                                    price: 25877.797012952156,
                                },
                                {
                                    datetime: '2023-09-15',
                                    buy_signals_count: 225,
                                    sell_signals_count: 172,
                                    neutral_signals_count: 18,
                                    price: 26412.655517371426,
                                },
                                {
                                    datetime: '2023-09-22',
                                    buy_signals_count: 184,
                                    sell_signals_count: 139,
                                    neutral_signals_count: 18,
                                    price: 26537.82083309501,
                                },
                                {
                                    datetime: '2023-09-29',
                                    buy_signals_count: 171,
                                    sell_signals_count: 175,
                                    neutral_signals_count: 7,
                                    price: 26928.47418718301,
                                },
                                {
                                    datetime: '2023-10-06',
                                    buy_signals_count: 278,
                                    sell_signals_count: 173,
                                    neutral_signals_count: 13,
                                    price: 27975.150590423098,
                                },
                                {
                                    datetime: '2023-10-13',
                                    buy_signals_count: 222,
                                    sell_signals_count: 214,
                                    neutral_signals_count: 11,
                                    price: 26769.852774850617,
                                },
                                {
                                    datetime: '2023-10-20',
                                    buy_signals_count: 278,
                                    sell_signals_count: 203,
                                    neutral_signals_count: 20,
                                    price: 29556.928834950508,
                                },
                                {
                                    datetime: '2023-10-27',
                                    buy_signals_count: 398,
                                    sell_signals_count: 297,
                                    neutral_signals_count: 20,
                                    price: 33673.01384438189,
                                },
                                {
                                    datetime: '2023-11-03',
                                    buy_signals_count: 338,
                                    sell_signals_count: 175,
                                    neutral_signals_count: 10,
                                    price: 34585.470175809365,
                                },
                                {
                                    datetime: '2023-11-10',
                                    buy_signals_count: 303,
                                    sell_signals_count: 211,
                                    neutral_signals_count: 7,
                                    price: 37246.84750569102,
                                },
                                {
                                    datetime: '2023-11-17',
                                    buy_signals_count: 281,
                                    sell_signals_count: 202,
                                    neutral_signals_count: 16,
                                    price: 36325.581244256515,
                                },
                                {
                                    datetime: '2023-11-24',
                                    buy_signals_count: 295,
                                    sell_signals_count: 227,
                                    neutral_signals_count: 17,
                                    price: 37787.603687667804,
                                },
                                {
                                    datetime: '2023-12-01',
                                    buy_signals_count: 266,
                                    sell_signals_count: 232,
                                    neutral_signals_count: 17,
                                    price: 38784.25383466603,
                                },
                                {
                                    datetime: '2023-12-08',
                                    buy_signals_count: 552,
                                    sell_signals_count: 320,
                                    neutral_signals_count: 28,
                                    price: 43963.713808031745,
                                },
                                {
                                    datetime: '2023-12-15',
                                    buy_signals_count: 398,
                                    sell_signals_count: 270,
                                    neutral_signals_count: 12,
                                    price: 43093.143661035,
                                },
                                {
                                    datetime: '2023-12-22',
                                    buy_signals_count: 286,
                                    sell_signals_count: 228,
                                    neutral_signals_count: 6,
                                    price: 43560.083618675606,
                                },
                                {
                                    datetime: '2023-12-29',
                                    buy_signals_count: 310,
                                    sell_signals_count: 205,
                                    neutral_signals_count: 17,
                                    price: 42011.40037528156,
                                },
                                {
                                    datetime: '2024-01-05',
                                    buy_signals_count: 375,
                                    sell_signals_count: 263,
                                    neutral_signals_count: 21,
                                    price: 44104.58951927037,
                                },
                                {
                                    datetime: '2024-01-12',
                                    buy_signals_count: 417,
                                    sell_signals_count: 301,
                                    neutral_signals_count: 55,
                                    price: 42778.49582759031,
                                },
                                {
                                    datetime: '2024-01-19',
                                    buy_signals_count: 342,
                                    sell_signals_count: 329,
                                    neutral_signals_count: 22,
                                    price: 41581.90279608383,
                                },
                                {
                                    datetime: '2024-01-26',
                                    buy_signals_count: 315,
                                    sell_signals_count: 251,
                                    neutral_signals_count: 19,
                                    price: 41816.87284400344,
                                },
                                {
                                    datetime: '2024-02-02',
                                    buy_signals_count: 259,
                                    sell_signals_count: 211,
                                    neutral_signals_count: 4,
                                    price: 43185.85943223562,
                                },
                                {
                                    datetime: '2024-02-04',
                                    buy_signals_count: 35,
                                    sell_signals_count: 21,
                                    neutral_signals_count: 0,
                                    price: 42875.28304930308,
                                },
                            ]
                            : assets.map((signal, index) => ({
                                ...signal,
                                datetime: dayjs(signal.datetime)
                                    .calendar(
                                        props.lang === 'fa' ? 'jalali' : 'gregory'
                                    )
                                    .locale(props.lang)
                                    .format(
                                        formatDate(signal.datetime, durationFilter, props.lang)
                                    ),
                                viewPoint:
                                    index === assets?.length - 1,
                            }))
                    }
                />
            </div>
        </div>
    );
}
