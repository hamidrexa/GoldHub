'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from './ui/icons';
import Link from 'next/link';

type barProps = {
    icon: any,
    title: string,
    href: string,
    isLoading?: boolean
    target?:string
};

export function LinkBox({
    icon,
    title,
    href,
    isLoading = false,
    target
}: barProps) {
    return (
        <Link target={target} href={href} className="relative flex w-full border border-[#9295E9] bg-[#E1E2FABF] rounded-lg min-h-[60px] items-center justify-between p-[8px]">
            <div className="w-full flex flex-row justify-start items-center gap-[12px] p-2">
                {isLoading ? (
                    <Skeleton className="h-9 w-14 md:w-20" />
                ) : (
                    <div>
                        {icon}
                    </div>
                )}
                {isLoading ? (
                    <Skeleton className="h-2 w-48 md:w-72" />
                ) : (
                    <div className="relative flex h-fit w-1/2 font-bold">
                        {title}
                    </div>
                )}
            </div>

            <div className="w-fit ltr:ml-2.5 rtl:mr-2.5">
                {isLoading ? (
                    <Skeleton className="h-9 w-14 md:w-20" />
                ) : (
                    <div className="text-sm font-bold md:text-3xl">
                        <Icons.chevronLeft stroke='black' />
                    </div>
                )}
            </div>
        </Link>
    );
}
