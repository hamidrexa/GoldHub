'use client';

import { Locale } from '@/i18n-config';
import { cn } from '@/libs/utils';
import React from 'react';
import { Icons } from '@/components/ui/icons';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import Spinner from './spinner';
import Link from 'next/link';

type Props = {
    dict: any;
    lang: Locale;
    className?: string;
    headerIcon?: any,
    headerTitle: string,
    value: string,
    equivalent: string,
    loading: boolean
};

export function FinantialCard({
    dict,
    lang,
    className,
    headerTitle,
    headerIcon,
    value,
    equivalent,
    loading
}: Props) {

    return (
        <div
            className={cn(
                'relative flex flex-col w-full max-w-lg gap-8 rounded-md border border-gray-400 bg-white px-4 py-6 text-black overflow-hidden',
                className
            )}
            style={{
                background: 'linear-gradient(203.56deg, rgba(202, 138, 4, 0.06) -0.28%, rgba(250, 255, 254, 0.1) 24.65%, rgba(250, 255, 254, 0.05) 47.94%, rgba(202, 138, 4, 0.08) 69.11%)'
            }}
        >
            {loading && <div className="absolute inset-0 flex items-center justify-center">
                <div className="z-100000 absolute inset-0 bg-white opacity-50 z-10"></div>
                <Spinner className='z-20' />
            </div>}
            <div className='flex flex-row flex-wrap justify-between items-center z-10'>
                <div className='flex flex-row gap-[10px] text-[22px] font-bold'>
                    {headerIcon ? headerIcon : <Icons.barChart3 stroke="#0C0E3C" />}
                    {headerTitle ? headerTitle : ''}
                </div>
                <div className='cursor-pointer'>
                    <Link href={'/transaction'}>
                        <Button variant='info' className='rounded-[30px] drop-shadow-[0px_2px_5px_rgba(0,_0,_0,_.)] gap-[12px] bg-[#0C0E3C] text-white'>
                            <Plus className='text-[#10EDC5] h-[20px] w-[20px]' />
                            <div>
                                {dict.increase}
                            </div>
                        </Button>
                    </Link>
                </div>
            </div>
            <div className='flex flex-wrap flex-row justify-center items-center gap-[40px] z-10'>
                <div className='flex flex-col gap-[8px] justify-center items-center'>
                    <text className='text-2xl text-[#CA8A04] font-bold	'>
                        {value}
                    </text>
                    <text className='text-[#B3B6C3]'>
                        {equivalent}
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
