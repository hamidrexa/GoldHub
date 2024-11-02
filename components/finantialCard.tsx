'use client';

import { Locale } from '@/i18n-config';
import { cn, currency } from '@/libs/utils';
import React from 'react';
import { Icons } from '@/components/ui/icons';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

type Props = {
    dict: any;
    lang: Locale;
    className?: string;
    headerIcon?: any,
    headerTitle: string,
    value: string,
    equivalent: number
};

export function FinantialCard({
    dict,
    lang,
    className,
    headerTitle,
    headerIcon,
    value,
    equivalent
}: Props) {

    return (
        <div
            className={cn(
                'relative flex flex-col gap-8 rounded-md border border-gray-400 bg-white px-4 py-6 text-black overflow-hidden',
                className
            )}
            style={{
                background: 'linear-gradient(203.56deg, rgba(202, 138, 4, 0.06) -0.28%, rgba(250, 255, 254, 0.1) 24.65%, rgba(250, 255, 254, 0.05) 47.94%, rgba(202, 138, 4, 0.08) 69.11%)'
            }}
        >
            {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-transparent opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-red-500 to-transparent opacity-50"></div> */}
            <div className='flex flex-row flex-wrap justify-between items-center z-10'>
                <div className='flex flex-row gap-[10px]'>
                    {headerIcon ? headerIcon : <Icons.lineChart stroke="#0C0E3C" />}
                    {headerTitle ? headerTitle : 'خرید و فروش طلا از طلانو'}
                </div>
                <div className='cursor-pointer'>
                    <Button className='rounded-[30px] gap-[12px] bg-[#0C0E3C] text-white'>
                        <Plus className='text-[#10EDC5] h-[20px] w-[20px]' />
                        <div>
                            {dict.increase}
                        </div>
                    </Button>
                </div>
            </div>
            <div className='flex flex-wrap flex-row justify-center items-center gap-[40px] z-10'>
                <div className='flex flex-col gap-[8px] justify-center items-center'>
                    <text className='text-2xl text-[#CA8A04] font-bold	'>
                        {value}
                    </text>
                    <text className='text-[#B3B6C3]'>
                        معادل {currency(equivalent, 'tse', lang)}
                    </text>
                </div>
                <div>
                    <Icons.gold fill='black' stroke='black' />
                </div>
            </div>
            <div className='absolute left-[-10px] bottom-[-20px]' >
                <Icons.gold className='flex w-[40px] h-[40px]' width='120' height='120' fill='#fff' stroke='#fff' />
            </div>
        </div>
    );
}
