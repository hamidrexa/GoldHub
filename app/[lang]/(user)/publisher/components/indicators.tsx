'use client';

import { useStatistics } from '@/app/[lang]/(user)/publisher/services/useStatistics';
import { Skeleton } from '@/components/ui/skeleton';
import { daysSegmentation, roundNumber } from '@/libs/utils';
import dayjs from 'dayjs';
import { InfoIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';

type Props = {
    publisher: any;
};

export function Indicators({ publisher }: Props) {
    const { statistics, isLoading } = useStatistics({
        primary_username: publisher.primary_username,
    });
    const diff = dayjs().diff(statistics?.first_signals_datetime.all, 'days');
    return (
        <div className="grid grid-cols-1 grid-rows-4 gap-6 md:grid-cols-2 md:grid-rows-2">
            <div className="order-0 flex items-center gap-1 text-lg font-black">
                <span className="text-base font-semibold text-gray-700">
                    نسبت شارپ :
                </span>{' '}
                {isLoading ? (
                    <Skeleton className="h-6 w-10" />
                ) : (
                    <span dir="ltr">
                        {!!statistics.sharpe_ratio
                            ? roundNumber(statistics.sharpe_ratio, 2)
                            : 'ندارد'}
                    </span>
                )}
                <Dialog>
                    <DialogTrigger asChild>
                        <InfoIcon
                            strokeWidth={1.5}
                            width={20}
                            height={20}
                            className="-translate-y-0.5 hover:cursor-pointer"
                        />
                    </DialogTrigger>
                    <DialogContent className="min-w-xl pt-12">
                        <div className="w-full text-base leading-10 leading-relaxed">
                            نسبت شارپ، یک معیار مالی برای سنجش بازده تریدر نسبت
                            به ریسک آن است.
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="order-1 flex items-center gap-1 text-lg font-black">
                <span className="text-sm font-semibold text-gray-700 md:text-lg">
                    درصد موفقیت:
                </span>{' '}
                {isLoading ? (
                    <Skeleton className="h-6 w-10" />
                ) : !!statistics?.winrate['365d'] ? (
                    roundNumber(statistics?.winrate['365d'] * 100, 2)
                ) : (
                    'ندارد'
                )}{' '}
                %
                <Dialog>
                    <DialogTrigger asChild>
                        <InfoIcon
                            strokeWidth={1.5}
                            width={20}
                            height={20}
                            className="-translate-y-1 hover:cursor-pointer"
                        />
                    </DialogTrigger>
                    <DialogContent className="min-w-xl pt-12">
                        <div className="text-base leading-10">
                            نسبت تعداد سیگنال‌های موفق، به کل سیگنال‌های منتشر
                            شده‌ی یک تریدر ظرف یکسال می‌باشد.
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="order-3 flex items-center gap-1 text-lg font-black md:order-1">
                <span className="text-base font-semibold text-gray-700">
                    مدت عضویت:
                </span>{' '}
                {isLoading ? (
                    <Skeleton className="h-6 w-32" />
                ) : (
                    <div>
                        {daysSegmentation(diff).year > 0
                            ? `${daysSegmentation(diff).year} سال `
                            : ''}
                        {daysSegmentation(diff).month > 0
                            ? `${daysSegmentation(diff).month} ماه `
                            : ''}
                        {daysSegmentation(diff).day > 0
                            ? ` ${daysSegmentation(diff).day}روز `
                            : ''}
                    </div>
                )}
            </div>
            <div className="order-2 flex items-center gap-1 text-lg font-black">
                <span className="text-base font-semibold text-gray-700">
                    تعداد پیام در ۹۰ روز اخیر :
                </span>{' '}
                {isLoading ? (
                    <Skeleton className="h-6 w-8" />
                ) : !!statistics?.signals_count.all?.['90d'] ? (
                    statistics?.signals_count.all?.['90d']
                ) : (
                    'ندارد'
                )}{' '}
                پیام
            </div>
        </div>
    );
}
