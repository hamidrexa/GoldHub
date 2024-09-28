'use client';

import { ContentTypes } from '@/constants/content-types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/libs/utils';
import { FollowButton } from '@/components/follow-button';
import React from 'react';
import { useAsset } from '@/app/[lang]/(user)/(asset)/services/useAsset';

export function ServerFollowButton({
    market,
    dict,
    lang,
    serverAsset,
    id,
    nonText = false,
}) {
    const { asset } = useAsset({ market, id, options: {} });
    const displayAsset = asset || serverAsset;

    return (
        <FollowButton
            dict={dict}
            lang={lang}
            defaultValue={displayAsset.bookmarked_by_user}
            id={displayAsset.id}
            type={market === 'tse' ? 'ticker' : 'crypto'}
            name={displayAsset.symbol}
            typeId={
                market !== 'tse'
                    ? ContentTypes.cryptocurrency
                    : ContentTypes.ticker
            }
            render={(isLoading, follow) => (
                <Badge
                    className={cn(
                        'cursor-pointer',
                        {
                            'animate-pulse': isLoading,
                        },
                        !nonText && 'gap-1.5'
                    )}
                    variant={follow ? 'light' : 'outline-blue'}
                    size="md"
                >
                    <svg
                        className="h-4 w-4 md:h-6 md:w-6"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.4919 7.50001C11.9987 9.87439 13.125 10.625 13.125 10.625H1.875C1.875 10.625 3.75 9.37501 3.75 5.00001C3.75001 4.45467 3.86896 3.91589 4.09856 3.42123C4.32816 2.92658 4.66289 2.48795 5.0794 2.13594C5.49592 1.78392 5.9842 1.52699 6.51021 1.38304C7.03621 1.2391 7.58728 1.21162 8.125 1.30251"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8.58047 13.125C8.47059 13.3144 8.31287 13.4717 8.12311 13.581C7.93335 13.6903 7.71821 13.7478 7.49922 13.7478C7.28023 13.7478 7.06509 13.6903 6.87533 13.581C6.68557 13.4717 6.52785 13.3144 6.41797 13.125"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {!follow && (
                            <>
                                <path
                                    d="M11.25 1.25V5"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.125 3.125H9.375"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </>
                        )}
                    </svg>
                    <span>
                        {!nonText &&
                            (follow ? dict.addedDashboard : dict.addDashboard)}
                    </span>
                </Badge>
            )}
        />
    );
}
