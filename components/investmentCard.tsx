'use client';

import { Locale } from '@/i18n-config';
import { cn } from '@/libs/utils';
import React from 'react';
import { Icons } from '@/components/ui/icons';
import { Button } from './ui/button';
import { ShoppingBasketIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
    dict: any;
    lang: Locale;
    className?: string;
    headerTitle: string,
};

export function InvestmentCard({
    dict,
    lang,
    className,
    headerTitle
}: Props) {
    return (
        <div
            className={cn(
                'relative flex flex-col w-full md:max-w-lg rounded-md border gap-8 rounded-md  bg-white px-4 py-6 text-black overflow-hidden',
                className
            )}
        >
            <h2 className="mb-6 flex items-center justify-center gap-1 text-center text-xl font-black text-black md:mb-4 md:text-xl">
                {headerTitle}
            </h2>
            <div className='flex gap-[6px] justify-center flex-nowrap'>
                <Link href='/transaction' className='flex w-[60%]'>
                    <Button
                        variant='info'
                        className='flex bg-[#CA8A04] text-white w-full'>
                        <ShoppingBasketIcon />
                        خرید
                    </Button>
                </Link>
                <Link href='/transaction' className='flex w-[40%]'>
                    <Button
                        variant='info'
                        className='flex bg-[#e9e9e9] text-[red] w-full'>
                        فروش
                    </Button>
                </Link>
            </div>
        </div>
    );
}
