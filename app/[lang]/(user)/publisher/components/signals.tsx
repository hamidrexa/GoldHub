'use client';

import { cn, getDirection } from '@/libs/utils';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import dayjs from 'dayjs';
import { AreaBarComposedChart } from '@/components/area-bar-composed-chart';
import jalaliday from 'jalaliday';
import { useSignalsSummery } from '@/services/useSignalsSummery';
import { Empty } from '@/components/empty';
import { useGlobalContext } from '@/contexts/store';

dayjs.extend(jalaliday);

export function Signals({ dict, lang, id, market }) {
    const dir = getDirection(lang);
    const { user } = useGlobalContext();
    const [year, setYear] = useState('1403');
    const { signalsSummery, isLoading } = useSignalsSummery({
        duration: 12,
        year,
        duration_scale: 'month',
        publisher_id: id,
    });
    const buySignalSum = signalsSummery
        .map((item) => {
            return item.buy_signals_count;
        })
        .reduce((acc, cur) => {
            return acc + cur;
        }, 0);

    return (
        <>
            <div className="mb-8 flex flex-col items-center justify-center gap-5 md:flex-row">
                <div className="flex w-full items-center justify-between gap-5 md:w-fit md:justify-start">
                    <div className="text-sm font-bold">{dict.year}:</div>
                    <RadioGroup
                        defaultValue={year}
                        dir={getDirection(lang)}
                        className="flex flex-row-reverse items-center gap-3"
                        onValueChange={(value) => {
                            setYear(value);
                        }}
                    >
                        <div>
                            <RadioGroupItem
                                value="1403"
                                id="signals-1403"
                                className="peer sr-only"
                                disabled={!user}
                            />
                            <Label
                                htmlFor="signals-1403"
                                className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white"
                            >
                                1403
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="1402"
                                id="signals-1402"
                                className="peer sr-only"
                                disabled={!user}
                            />
                            <Label
                                htmlFor="signals-1402"
                                className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white"
                            >
                                1402
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="1401"
                                id="signals-1401"
                                className="peer sr-only"
                                disabled={!user}
                            />
                            <Label
                                htmlFor="signals-1401"
                                className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white"
                            >
                                1401
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="1400"
                                id="signals-1400"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="signals-1400"
                                className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white"
                            >
                                1400
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className={cn('mx-auto max-w-xl', { 'blur-md': isLoading })}>
                {!isLoading && buySignalSum > 0 ? (
                    <AreaBarComposedChart
                        lang={lang}
                        dir={dir}
                        market={market}
                        xDataKey="date"
                        color="#10EDC5"
                        name="سیگنال"
                        barDataKey="buy_signals_count"
                        barColor="#10EDC5"
                        interval={0}
                        barName={dict.buySignals}
                        data={
                            isLoading
                                ? [
                                      {
                                          date: '2024-01-07',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 3,
                                      },
                                      {
                                          date: '2024-01-08',
                                          buy_signals_count: 12,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 5,
                                      },
                                      {
                                          date: '2024-01-09',
                                          buy_signals_count: 4,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 5,
                                      },
                                      {
                                          date: '2024-01-10',
                                          buy_signals_count: 1,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 7,
                                      },
                                      {
                                          date: '2024-01-11',
                                          buy_signals_count: 6,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 0,
                                      },
                                      {
                                          date: '2024-01-12',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 0,
                                      },
                                      {
                                          date: '2024-01-13',
                                          buy_signals_count: 2,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 5,
                                      },
                                      {
                                          date: '2024-01-14',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 7,
                                      },
                                      {
                                          date: '2024-01-15',
                                          buy_signals_count: 5,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 11,
                                      },
                                      {
                                          date: '2024-01-16',
                                          buy_signals_count: 2,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 3,
                                      },
                                      {
                                          date: '2024-01-17',
                                          buy_signals_count: 7,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 14,
                                      },
                                      {
                                          date: '2024-01-18',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 8,
                                      },
                                      {
                                          date: '2024-01-19',
                                          buy_signals_count: 1,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 3,
                                      },
                                      {
                                          date: '2024-01-20',
                                          buy_signals_count: 5,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 25,
                                      },
                                      {
                                          date: '2024-01-21',
                                          buy_signals_count: 2,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 2,
                                      },
                                      {
                                          date: '2024-01-22',
                                          buy_signals_count: 5,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 10,
                                      },
                                      {
                                          date: '2024-01-23',
                                          buy_signals_count: 3,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 17,
                                      },
                                      {
                                          date: '2024-01-24',
                                          buy_signals_count: 5,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 5,
                                      },
                                      {
                                          date: '2024-01-25',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 0,
                                      },
                                      {
                                          date: '2024-01-26',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 0,
                                      },
                                      {
                                          date: '2024-01-27',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 2,
                                      },
                                      {
                                          date: '2024-01-28',
                                          buy_signals_count: 3,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 26,
                                      },
                                      {
                                          date: '2024-01-29',
                                          buy_signals_count: 6,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 15,
                                      },
                                      {
                                          date: '2024-01-30',
                                          buy_signals_count: 4,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 14,
                                      },
                                      {
                                          date: '2024-01-31',
                                          buy_signals_count: 4,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 12,
                                      },
                                      {
                                          date: '2024-02-01',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 10,
                                      },
                                      {
                                          date: '2024-02-02',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 0,
                                      },
                                      {
                                          date: '2024-02-03',
                                          buy_signals_count: 3,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 6,
                                      },
                                      {
                                          date: '2024-02-04',
                                          buy_signals_count: 4,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 2,
                                      },
                                      {
                                          date: '2024-02-05',
                                          buy_signals_count: 0,
                                          sell_signals_count: 0,
                                          neutral_signals_count: 2,
                                      },
                                  ]
                                : signalsSummery.map((signal) => ({
                                      ...signal,
                                      date: dayjs(signal.date)
                                          .calendar(
                                              lang === 'fa'
                                                  ? 'jalali'
                                                  : 'gregory'
                                          )
                                          .locale(lang)
                                          .subtract(1, 'day')
                                          .format('MMMM'),
                                  }))
                        }
                    />
                ) : (
                    <Empty>{dict.noSignalToShow}</Empty>
                )}
            </div>
        </>
    );
}
