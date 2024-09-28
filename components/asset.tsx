'use client';
import { Locale } from '@/i18n-config';
import { cn } from '@/libs/utils';
import React from 'react';
import Link from 'next/link';

export type AssetProps = {
    asset: any;
    dict: any;
    lang: Locale;
    color?: string;
    className?: string;
    onClick?: any;
};

const Asset = ({
    asset,
    dict,
    lang,
    color,
    className,
    onClick,
}: AssetProps) => {
    return (
        <Link
            target="_blank"
            href={asset.href}
            className={cn('flex items-center gap-3', className)}
            style={{ color: color }}
            onClick={onClick}
        >
            {!!asset.image && (
                <div className="rounded-full border-2 border-neutral-700 p-1">
                    <img
                        width={60}
                        height={60}
                        src={asset.image ?? '/img/no-image.jpg'}
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = '/img/no-image.jpg';
                        }}
                        alt="asset image"
                        className="h-11 w-11 min-w-11 rounded-full object-cover"
                    />
                </div>
            )}
            <div className="flex flex-col text-base font-bold">
                <div>{asset.symbol}</div>
            </div>
        </Link>
    );
};
export default Asset;
