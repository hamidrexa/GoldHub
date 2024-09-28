'use client';

import { Skeleton } from '@/components/ui/skeleton';

type barProps = {
    rightSide: { [key: string]: number | string };
    leftSide: { [key: string]: number | string };
    isLoading?: boolean;
};

export function StatusBar({
    rightSide,
    leftSide,
    isLoading = false,
}: barProps) {
    return (
        <div className="relative flex w-full items-center justify-center">
            <div className="w-fit ltr:mr-2.5 rtl:ml-2.5">
                {isLoading ? (
                    <Skeleton className="h-9 w-14 md:w-20" />
                ) : (
                    <div className="text-sm font-bold md:text-3xl">
                        {rightSide.count}{' '}
                        <span className="text-xs text-gray-700">
                            ({rightSide.percent}%)
                        </span>
                    </div>
                )}
                <div className="text-center text-xs text-gray-700">
                    {rightSide.name}
                </div>
            </div>
            {isLoading ? (
                <Skeleton className="h-2 w-48 md:w-72" />
            ) : (
                <div className="relative flex h-fit w-1/2">
                    <div
                        style={{
                            width: `${rightSide.percent}%`,
                            background: `${rightSide.color}`,
                        }}
                        className="h-1.5 ltr:rounded-l-md rtl:rounded-r-md"
                    ></div>
                    <div
                        style={{
                            width: `${leftSide.percent}%`,
                            background: `${leftSide.color}`,
                        }}
                        className="h-1.5 ltr:rounded-r-md rtl:rounded-l-md"
                    ></div>
                </div>
            )}
            <div className="w-fit ltr:ml-2.5 rtl:mr-2.5">
                {isLoading ? (
                    <Skeleton className="h-9 w-14 md:w-20" />
                ) : (
                    <div className="text-sm font-bold md:text-3xl">
                        {leftSide.count}{' '}
                        <span className="text-xs text-gray-700">
                            ({leftSide.percent}%)
                        </span>
                    </div>
                )}
                <div className="text-center text-xs text-gray-700">
                    {leftSide.name}
                </div>
            </div>
        </div>
    );
}
