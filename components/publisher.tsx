'use client';

import Image from 'next/image';
import { cn, getImage, getLinksLang } from '@/libs/utils';
import { VerifiedIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n-config';

export type PublisherProps = {
    lang: Locale;
    dict: any;
    publisher: any;
    elements?: {
        rank?: boolean;
        powerOfAnalytics?: boolean;
    };
    className?: any;
    onClick?: any;
};

export function Publisher({
    dict,
    lang,
    publisher,
    elements = {},
    className,
    onClick,
}: PublisherProps) {
    const displayElements = {
        rank: elements.rank ?? true,
        powerOfAnalytics: elements.powerOfAnalytics ?? true,
    };
    const powerOfAnalytics = publisher.power_of_analysis * 5;
    const getPowerOfAnalyticsBadgeColor = () => {
        if (powerOfAnalytics >= 4.9) return 'bg-green-700/20 text-green-700';
        else if (powerOfAnalytics >= 4.6)
            return 'bg-emerald-600/20 text-emerald-600';
        else if (powerOfAnalytics >= 4.3)
            return 'bg-emerald-500/20 text-emerald-500';
        else if (powerOfAnalytics >= 4) return 'bg-lime-600/20 text-lime-600';
        else if (powerOfAnalytics >= 3.8) return 'bg-lime-500/20 text-lime-500';
        else if (powerOfAnalytics >= 3.2)
            return 'bg-yellow-500/20 text-yellow-500';
        else return 'bg-neutral-200/20 text-neutral-200';
    };

    return (
        <div
            className={cn('flex items-center gap-2.5 text-base', className)}
            onClick={onClick}
        >
            <Link
                href={`${getLinksLang(lang)}/publisher/${publisher.primary_username}`}
                target="_blank"
            >
                <div className="flex h-14 max-h-14 min-h-14 w-14 min-w-14 max-w-14 flex-row items-center justify-center overflow-hidden rounded-full border-2 border-neutral-700 p-1">
                    <Image
                        className="aspect-square h-full w-full rounded-full object-contain"
                        alt={publisher.name}
                        src={
                            typeof publisher.photo === 'string'
                                ? publisher.photo
                                : getImage(publisher)
                        }
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = `/img/sources/${publisher.account_type}.png`;
                        }}
                        width={56}
                        height={56}
                        unoptimized
                    />
                </div>
            </Link>
            <div className="flex flex-col gap-1">
                <h5 className="flex gap-1.5">
                    <Link
                        href={`${getLinksLang(lang)}/publisher/${publisher.primary_username}`}
                        className="max-w-24 truncate font-bold md:max-w-40"
                        target="_blank"
                    >
                        {publisher.name}
                    </Link>
                    {publisher.is_verified && (
                        <VerifiedIcon
                            className="inline-block h-5 w-5"
                            fill="#2830C9"
                            color="#fff"
                        />
                    )}
                </h5>
                {publisher.publisher_type !== 'analytical' && (
                    <div className="flex items-center gap-2">
                        {!!publisher.rank && displayElements.rank && (
                            <Badge
                                variant={
                                    publisher.rank > 100 ? 'light' : 'secondary'
                                }
                                size="sm"
                                rounded="sm"
                            >
                                {dict.rank}: {publisher.rank}
                            </Badge>
                        )}
                        {displayElements.powerOfAnalytics &&
                            !!powerOfAnalytics && (
                                <div className="flex items-center gap-1 font-medium">
                                    <span className="hidden sm:inline">
                                        {dict.powerOfAnalytics}:
                                    </span>
                                    <Badge
                                        className={cn(
                                            'flex items-center gap-1',
                                            getPowerOfAnalyticsBadgeColor()
                                        )}
                                        variant="no-color"
                                        size="sm"
                                        rounded="sm"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            height="10"
                                            fill="none"
                                            viewBox="0 0 10 10"
                                        >
                                            <g filter="url(#filter0_b_1885_7204)">
                                                <path
                                                    fill="currentColor"
                                                    d="M5.375.245l1.219 2.588c.06.13.179.222.316.243l2.728.416c.11.016.21.077.278.17a.445.445 0 01-.045.573l-1.977 2.02c-.1.1-.146.246-.12.389l.474 2.849a.435.435 0 01-.343.495.436.436 0 01-.271-.044l-2.43-1.345a.39.39 0 00-.39 0L2.364 9.95a.416.416 0 01-.567-.183c-.042-.086-.057-.183-.042-.278l.473-2.849a.453.453 0 00-.119-.389L.122 4.234a.454.454 0 01-.001-.618l.001-.002A.47.47 0 01.36 3.49l2.73-.416a.43.43 0 00.315-.243L4.623.245a.422.422 0 01.24-.222.4.4 0 01.322.024.443.443 0 01.19.198z"
                                                ></path>
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_1885_7204"
                                                    width="31.053"
                                                    height="31.053"
                                                    x="-10.526"
                                                    y="-10.526"
                                                    colorInterpolationFilters="sRGB"
                                                    filterUnits="userSpaceOnUse"
                                                >
                                                    <feFlood
                                                        floodOpacity="0"
                                                        result="BackgroundImageFix"
                                                    ></feFlood>
                                                    <feGaussianBlur
                                                        in="BackgroundImageFix"
                                                        stdDeviation="5.263"
                                                    ></feGaussianBlur>
                                                    <feComposite
                                                        in2="SourceAlpha"
                                                        operator="in"
                                                        result="effect1_backgroundBlur_1885_7204"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_1885_7204"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                        {powerOfAnalytics.toFixed(1)}
                                    </Badge>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}
