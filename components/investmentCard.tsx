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
                'relative flex flex-col w-full max-w-md rounded-md border gap-8 rounded-md  bg-white px-4 py-6 text-black overflow-hidden',
                className
            )}
        >
            <h2 className="mb-6 flex items-center justify-center gap-1 text-center text-xl font-black text-black md:mb-4 md:text-xl">
                {headerTitle}
            </h2>
            <div className='flex flex-row gap-[8px] justify-center'>
                <Link href='/transaction'>
                    <Button
                        variant='info'
                        className='bg-[#CA8A04] text-white min-w-[200px]'
                        onClick={() => {
                            // Router.push('/transaction')
                        }}
                    >
                        <ShoppingBasketIcon />
                        خرید
                    </Button>
                </Link>
                <Button
                    variant='info'
                    className='bg-[#e9e9e9] text-[#000] min-w-[120px]'>
                    فروش
                </Button>
            </div>
        </div>
    );
}
