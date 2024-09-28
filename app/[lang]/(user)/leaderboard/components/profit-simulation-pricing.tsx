'use client';

import { cn, getLinksLang } from '@/libs/utils';
import { buttonVariants } from '@/components/ui/button';
import React from 'react';
import { useGlobalContext } from '@/contexts/store';
import Link from 'next/link';

export function ProfitSimulationPricing(lang) {
    const { user } = useGlobalContext();

    if (user?.active_plan?.is_active) return <div></div>;

    return (
        <div className="flex flex-row items-center justify-center gap-4 md:flex-col">
            <p className="text-right text-sm font-medium md:text-center">
                دسترسی لحظه ای به سیگنال های تریدرهای برتر نیاز به اشتراک دارد.
            </p>
            <Link
                href={`${getLinksLang(lang.lang)}/pricing`}
                className={cn(buttonVariants(), 'w-8/12')}
            >
                خرید اشتراک
            </Link>
        </div>
    );
}
