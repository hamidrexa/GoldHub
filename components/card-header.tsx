'use client';
import { cn} from '@/libs/utils';
import React from 'react';
import { Icons } from '@/components/ui/icons';


type Props = {
    className?: string;
    headerIcon?: any,
    headerTitle?: string,
};

export default function CardHeader({
    className,
    headerTitle,
    headerIcon
}: Props) {

    return (
        <>
            <div
                className={cn(
                    'relative flex flex-col gap-2 rounded-md bg-white text-black',
                    className
                )}
            >
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-[10px] text-[22px] font-bold items-center '>
                        {headerIcon ? headerIcon : <Icons.barChart3 stroke="#0C0E3C" />}
                        {headerTitle}
                    </div>
                    <div className='cursor-pointer'>
                        <Icons.question />
                    </div>
                </div>
            </div>
        </>
    );
}
