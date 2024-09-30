'use client';

import { cn, getDirection, roundNumber } from '@/libs/utils';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BarChart } from '@/components/bar-chart';
import { Icons } from '@/components/ui/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { usePerformanceHistory } from '@/app/[lang]/(user)/publisher/services/usePerformanceHistory';
import dayjs from 'dayjs';

export function MonthlyPerformance({ dict, lang, id, market }) {
    const [year, setYear] = useState('1403');
    const [durationFilter, setDurationFilter] = useState('12,month');
    const [duration, durationScale] = durationFilter.split(',');
    const [compare, setCompare] = useState(null);
    const { performanceHistory, isLoading } = usePerformanceHistory(
        id,
        {
            year,
        },
        true
    );
    const {
        performanceHistory: comparePerformanceHistory,
        isLoading: compareIsLoading,
    } = usePerformanceHistory(
        id,
        {
            year,
            chart_type: compare,
        },
        !!compare
    );

    return (
        <>
            <div className="mb-8 flex flex-col items-center justify-center gap-5 md:flex-row">
                <div className="flex w-full items-center justify-between gap-5 md:w-fit md:justify-start">
                    <div className="text-sm font-bold">{dict.year}:</div>
                    <RadioGroup
                        defaultValue={year}
                        dir={getDirection(lang)}
                        className="flex flex-row-reverse items-center gap-3"
                        onValueChange={setYear}
                    >
                        <div>
                            <RadioGroupItem
                                value="1403"
                                id="publisher-monthly-performance-1403"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="publisher-monthly-performance-1403"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                1403
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="1402"
                                id="publisher-monthly-performance-1402"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="publisher-monthly-performance-1402"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                1402
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="1401"
                                id="publisher-monthly-performance-1401"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="publisher-monthly-performance-1401"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                1401
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="1400"
                                id="publisher-monthly-performance-1400"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="publisher-monthly-performance-1400"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                1400
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div
                className={cn('mx-auto max-w-xl', {
                    'blur-md': isLoading || compareIsLoading,
                })}
            >
                <BarChart
                    dict={dict}
                    lang={lang}
                    market={market}
                    xDataKey="month_title"
                    yDataKey={[
                        'performance',
                        ...(compare ? ['comparePerformance'] : []),
                    ]}
                    width="100%"
                    height={200}
                    name={[
                        dict.efficiency,
                        compare === 'top_publishers'
                            ? dict.efficiency100Traders
                            : dict.totalIndexReturn,
                    ]}
                    data={
                        isLoading
                            ? [
                                  {
                                      month: 1,
                                      month_title: 'فروردین',
                                      performance: -4,
                                  },
                                  {
                                      month: 2,
                                      month_title: 'اردیبهشت',
                                      performance: -6,
                                  },
                                  {
                                      month: 3,
                                      month_title: 'خرداد',
                                      performance: 2,
                                  },
                                  {
                                      month: 4,
                                      month_title: 'تیر',
                                      performance: -5,
                                  },
                                  {
                                      month: 5,
                                      month_title: 'مرداد',
                                      performance: -3,
                                  },
                                  {
                                      month: 6,
                                      month_title: 'شهریور',
                                      performance: 3,
                                  },
                                  {
                                      month: 7,
                                      month_title: 'مهر',
                                      performance: null,
                                  },
                                  {
                                      month: 8,
                                      month_title: 'آبان',
                                      performance: 3,
                                  },
                                  {
                                      month: 9,
                                      month_title: 'آذر',
                                      performance: 12,
                                  },
                                  {
                                      month: 10,
                                      month_title: 'دی',
                                      performance: 3,
                                  },
                                  {
                                      month: 11,
                                      month_title: 'بهمن',
                                      performance: null,
                                  },
                                  {
                                      month: 12,
                                      month_title: 'اسفند',
                                      performance: null,
                                  },
                              ]
                            : performanceHistory.chart_result.map(
                                  (item, index) => ({
                                      ...item,
                                      performance:
                                          item.avrage_performance !== null
                                              ? roundNumber(
                                                    item.avrage_performance *
                                                        100,
                                                    2
                                                )
                                              : 'no data',
                                      comparePerformance:
                                          comparePerformanceHistory?.chart_result
                                              ? comparePerformanceHistory
                                                    .chart_result[index]
                                                    .avrage_performance !== null
                                                  ? roundNumber(
                                                        comparePerformanceHistory
                                                            .chart_result[index]
                                                            .avrage_performance *
                                                            100,
                                                        2
                                                    )
                                                  : 'no data'
                                              : null,
                                      //   ? roundNumber(
                                      //         comparePerformanceHistory
                                      //             .chart_result[index]
                                      //             .avrage_performance *
                                      //             100,
                                      //         2
                                      //     )
                                      // : null,
                                      date: dayjs(item.date)
                                          .calendar(
                                              lang === 'fa'
                                                  ? 'jalali'
                                                  : 'gregory'
                                          )
                                          .locale(lang)
                                          .format(
                                              durationFilter.split(',')[1] ===
                                                  'day' ||
                                                  durationFilter.split(
                                                      ','
                                                  )[1] === 'week'
                                                  ? lang === 'fa'
                                                      ? 'YYYY/MM/DD'
                                                      : 'DD MMM'
                                                  : 'MMMM'
                                          ),
                                  })
                              )
                    }
                />
                <div className="mt-5 flex items-center justify-between">
                    <div>
                        <Checkbox
                            id="publisher-monthly-performance-top-publisher"
                            className="peer sr-only"
                            checked={compare === 'top_publishers'}
                            onCheckedChange={(state) =>
                                setCompare(state ? 'top_publishers' : null)
                            }
                        />
                        <Label
                            htmlFor="publisher-monthly-performance-top-publisher"
                            className="flex cursor-pointer items-center gap-2"
                        >
                            {compare === 'top_publishers' ? (
                                <Icons.minusSquare />
                            ) : (
                                <Icons.plusSquare />
                            )}
                            {dict.top100TraderCompare}
                        </Label>
                    </div>
                    <div>
                        <Checkbox
                            id="publisher-monthly-performance-index"
                            className="peer sr-only"
                            checked={compare === 'index'}
                            onCheckedChange={(state) =>
                                setCompare(state ? 'index' : null)
                            }
                        />
                        <Label
                            htmlFor="publisher-monthly-performance-index"
                            className="flex cursor-pointer items-center gap-2"
                        >
                            {compare === 'index' ? (
                                <Icons.minusSquare />
                            ) : (
                                <Icons.plusSquare />
                            )}
                            {dict.totalIndexCompare}
                        </Label>
                    </div>
                </div>
            </div>
        </>
    );
}
