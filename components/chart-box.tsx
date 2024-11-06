'use client';

import { Locale } from '@/i18n-config';
import { cn, currency } from '@/libs/utils';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Icons } from '@/components/ui/icons';

// Import Swiper styles
import 'swiper/css';
import { PriceSignalChart } from './price-signal-chart';
import Spinner from './spinner';

type Props = {
    dict: any;
    lang: Locale;
    className?: string;
    headerIcon?: any,
    headerTitle?: string,
    yourInventory?: number,
    measurementTitle: string,
    price: number,
    percentage: number,
    market?: string,
    id: string,
    loading: boolean
};

export default function ChartBox({
    dict,
    lang,
    className,
    headerTitle,
    headerIcon,
    measurementTitle,
    price,
    market,
    id,
    loading
}: Props) {

    return (
        <>
            <div
                className={cn(
                    'relative flex flex-col gap-2 rounded-md border border-gray-400 bg-white px-4 py-6 text-black',
                    className
                )}
            >
                {loading && <div className="absolute inset-0 flex items-center justify-center">
                    <div className="z-100000 absolute inset-0 bg-white opacity-50 z-10"></div>
                    <Spinner className='z-20' />
                </div>}
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-[10px] text-[22px] font-bold'>
                        {headerIcon ? headerIcon : <Icons.barChart3 stroke="#0C0E3C" />}
                        {headerTitle}
                    </div>
                    <div className='cursor-pointer'>
                        <Icons.question />
                    </div>
                </div>
                <div className="flex w-full flex-col justify-center gap-2.5 mt-4  md:items-center">
                    <div className="flex w-full flex-col gap-[12px]">
                        <div className='w-full flex flex-row justify-center items-center gap-[4px]'>
                            <Label
                                className="flex text-gray-700 text-[16px]"
                            >
                                {measurementTitle}
                            </Label>
                            <Label
                                className="flex text-neutral-800 text-[28px] font-bold"
                            >
                                {currency(price, 'tse', lang)}
                            </Label>
                            <Label
                                className="flex text-gray-700 text-[16px]"
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
                        />
                    </div>
                </div>
            </div >
        </>
    );
}
