'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { cn, getLinksLang } from '@/libs/utils';

export function ProductsNavigator({ dict, lang }) {
    const pathname = usePathname();
    const menuItems = [
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="29"
                    height="28"
                    fill="none"
                    viewBox="0 0 29 28"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M10.417 16.917A2.917 2.917 0 0013.334 14c0-1.61-.583-2.333-1.167-3.5-1.25-2.5-.261-4.73 2.334-7 .583 2.917 2.333 5.717 4.666 7.583 2.334 1.867 3.5 4.084 3.5 6.417a8.166 8.166 0 11-16.333 0c0-1.345.505-2.676 1.167-3.5a2.917 2.917 0 002.916 2.917z"
                    ></path>
                </svg>
            ),
            url: `/signals`,
            name: dict.productNav.signals,
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="19"
                    fill="none"
                    viewBox="0 0 25 19"
                >
                    <g filter="url(#filter0_b_2495_10033)">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M18.564 8.234a3.113 3.113 0 100-6.224"
                        ></path>
                    </g>
                    <g filter="url(#filter1_b_2495_10033)">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M19.994 11.617c.513.035 1.024.108 1.526.22.698.137 1.538.424 1.837 1.05.19.401.19.868 0 1.27-.298.627-1.139.912-1.837 1.055"
                        ></path>
                    </g>
                    <g filter="url(#filter2_b_2495_10033)">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M6.437 8.234a3.113 3.113 0 110-6.224"
                        ></path>
                    </g>
                    <g filter="url(#filter3_b_2495_10033)">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M5.006 11.617c-.514.035-1.024.108-1.526.22-.699.137-1.538.424-1.836 1.05a1.475 1.475 0 000 1.27c.297.627 1.137.912 1.836 1.055"
                        ></path>
                    </g>
                    <g filter="url(#filter4_b_2495_10033)">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12.493 12.286c3.483 0 6.458.527 6.458 2.636s-2.956 2.655-6.458 2.655c-3.483 0-6.458-.527-6.458-2.636s2.956-2.655 6.458-2.655z"
                        ></path>
                    </g>
                    <g filter="url(#filter5_b_2495_10033)">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12.496 9.278a4.124 4.124 0 01-4.139-4.14A4.124 4.124 0 0112.496 1a4.124 4.124 0 014.138 4.139 4.124 4.124 0 01-4.138 4.139z"
                        ></path>
                    </g>
                    <defs>
                        <filter
                            id="filter0_b_2495_10033"
                            width="25.666"
                            height="28.777"
                            x="7.288"
                            y="-9.266"
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
                                result="effect1_backgroundBlur_2495_10033"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10033"
                                result="shape"
                            ></feBlend>
                        </filter>
                        <filter
                            id="filter1_b_2495_10033"
                            width="26.058"
                            height="26.149"
                            x="8.718"
                            y="0.34"
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
                                result="effect1_backgroundBlur_2495_10033"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10033"
                                result="shape"
                            ></feBlend>
                        </filter>
                        <filter
                            id="filter2_b_2495_10033"
                            width="25.666"
                            height="28.777"
                            x="-7.952"
                            y="-9.266"
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
                                result="effect1_backgroundBlur_2495_10033"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10033"
                                result="shape"
                            ></feBlend>
                        </filter>
                        <filter
                            id="filter3_b_2495_10033"
                            width="26.058"
                            height="26.149"
                            x="-9.776"
                            y="0.34"
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
                                result="effect1_backgroundBlur_2495_10033"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10033"
                                result="shape"
                            ></feBlend>
                        </filter>
                        <filter
                            id="filter4_b_2495_10033"
                            width="35.469"
                            height="27.844"
                            x="-5.241"
                            y="1.01"
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
                                result="effect1_backgroundBlur_2495_10033"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10033"
                                result="shape"
                            ></feBlend>
                        </filter>
                        <filter
                            id="filter5_b_2495_10033"
                            width="30.83"
                            height="30.831"
                            x="-2.919"
                            y="-10.276"
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
                                result="effect1_backgroundBlur_2495_10033"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10033"
                                result="shape"
                            ></feBlend>
                        </filter>
                    </defs>
                </svg>
            ),
            url: `/leaderboard`,
            name: dict.productNav.bestTraders,
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    fill="none"
                    viewBox="0 0 21 21"
                >
                    <g filter="url(#filter0_b_2495_10044)">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M10.261 19.43a34.84 34.84 0 01-6.022-4.688 11.99 11.99 0 01-2.866-4.57c-1.076-3.345.18-7.174 3.698-8.307a5.978 5.978 0 015.425.914 5.987 5.987 0 015.425-.914c3.517 1.133 4.783 4.962 3.707 8.307a11.99 11.99 0 01-2.866 4.57 34.84 34.84 0 01-6.022 4.689l-.235.146-.244-.146z"
                        ></path>
                    </g>
                    <g filter="url(#filter1_b_2495_10044)">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M14.238 5.63a2.782 2.782 0 011.917 2.422"
                        ></path>
                    </g>
                    <defs>
                        <filter
                            id="filter0_b_2495_10044"
                            width="41.545"
                            height="40.553"
                            x="-10.272"
                            y="-9.699"
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
                                result="effect1_backgroundBlur_2495_10044"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10044"
                                result="shape"
                            ></feBlend>
                        </filter>
                        <filter
                            id="filter1_b_2495_10044"
                            width="24.469"
                            height="24.975"
                            x="2.962"
                            y="-5.646"
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
                                result="effect1_backgroundBlur_2495_10044"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10044"
                                result="shape"
                            ></feBlend>
                        </filter>
                    </defs>
                </svg>
            ),
            url: `/feed`,
            name: dict.productNav.feeds,
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="22"
                    fill="none"
                    viewBox="0 0 21 22"
                >
                    <g filter="url(#filter0_b_2495_10059)">
                        <circle
                            cx="10.106"
                            cy="10.566"
                            r="8.989"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                        ></circle>
                    </g>
                    <g filter="url(#filter1_b_2495_10059)">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M16.357 17.284l3.524 3.515"
                        ></path>
                    </g>
                    <defs>
                        <filter
                            id="filter0_b_2495_10059"
                            width="40.529"
                            height="40.53"
                            x="-10.159"
                            y="-9.699"
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
                                result="effect1_backgroundBlur_2495_10059"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10059"
                                result="shape"
                            ></feBlend>
                        </filter>
                        <filter
                            id="filter1_b_2495_10059"
                            width="26.076"
                            height="26.067"
                            x="5.081"
                            y="6.008"
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
                                result="effect1_backgroundBlur_2495_10059"
                            ></feComposite>
                            <feBlend
                                in="SourceGraphic"
                                in2="effect1_backgroundBlur_2495_10059"
                                result="shape"
                            ></feBlend>
                        </filter>
                    </defs>
                </svg>
            ),
            url: `/search`,
            name: dict.search,
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <g>
                        <g
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 17.848c5.64 0 8.248-.724 8.5-3.627 0-2.902-1.819-2.716-1.819-6.276C18.681 5.165 16.045 2 12 2S5.319 5.164 5.319 7.945c0 3.56-1.819 3.374-1.819 6.276.253 2.914 2.862 3.627 8.5 3.627z"
                                clipRule="evenodd"
                            />
                            <path d="M14.389 20.857c-1.364 1.515-3.492 1.533-4.87 0" />
                        </g>
                    </g>
                </svg>
            ),
            url: `/notifications`,
            name: dict.productNav.notifications,
        },
    ];

    return (
        <div className="sticky top-32 hidden !h-fit min-w-[100px] flex-col items-center gap-5 md:flex">
            {menuItems.map((item, index) => (
                <Link
                    key={index}
                    className={cn(
                        'relative flex w-full flex-col items-center gap-1.5 whitespace-nowrap text-base',
                        item.url === pathname ||
                            `${getLinksLang(lang)}${item.url}` === pathname
                            ? 'font-bold text-neutral-800 before:absolute before:top-0 before:h-full before:w-0.5 before:rounded-full before:bg-neutral-300 ltr:before:-left-2 rtl:before:-right-2'
                            : 'font-medium text-gray-800'
                    )}
                    href={`${getLinksLang(lang)}${item.url}`}
                >
                    {item.icon}
                    {item.name}
                </Link>
            ))}
        </div>
    );
}
