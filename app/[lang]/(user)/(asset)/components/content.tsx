'use client';

import { useGlobalContext } from '@/contexts/store';
import stringFormatter from '@/libs/stringFormatter';
import format from '@/libs/stringFormatter';
import React, { useEffect, useRef } from 'react';
import { cn } from '@/libs/utils';
import useScrollSpy from 'react-use-scrollspy';
import { ReadingMode } from '@/components/reading-mode';
import { Descriptions } from '@/app/[lang]/(user)/(asset)/types/Descriptions';
import { MessagesWrap } from '@/components/messages-wrap';
import { Box, BoxContent, BoxTitle } from '@/components/box';
import { PriceSignalChart } from '@/app/[lang]/(user)/(asset)/components/price-signal-chart';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { InfoIcon } from 'lucide-react';
import { OpenOrders } from '@/app/[lang]/(user)/(asset)/components/open-orders';
import { CloseOrders } from '@/app/[lang]/(user)/(asset)/components/close-orders';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import useScrollToHash from '@/libs/useScrollToHash';

export const Content = ({
    id,
    asset,
    dict,
    market,
    lang,
    messages,
    events,
}) => {
    const { isReadingMode, setBreadcrumbTitle } = useGlobalContext();
    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];
    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -230,
    });
    useScrollToHash();

    useEffect(() => {
        setBreadcrumbTitle(asset.symbol_fa || asset.name_fa);
    }, []);

    return (
        <>
            <div
                className={cn(
                    'sticky top-16 z-50 -mt-1.5 rounded-lg bg-white pt-1 shadow-box backdrop-blur-sm transition-transform md:top-28 md:mb-12 md:mt-10',
                    isReadingMode
                        ? '-translate-y-44 md:translate-y-0'
                        : 'translate-y-0'
                )}
            >
                <div className="flex items-center gap-4 overflow-x-auto rounded-md p-4 text-neutral-800 md:justify-start md:gap-8">
                    <a
                        className={cn(
                            'ring-offset-background focus-visible:ring-ring relative flex flex-col items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-800 transition-all after:h-0.5 after:w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:text-xl',
                            {
                                'font-black text-neutral-800 after:bg-neutral-300':
                                    activeSection === 0,
                            }
                        )}
                        href="#analysis"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="22"
                            fill="none"
                            viewBox="0 0 21 22"
                        >
                            <g filter="url(#filter0_b_1945_6408)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M5.396 14.106l2.994-3.89 3.414 2.682 2.929-3.78"
                                ></path>
                            </g>
                            <g filter="url(#filter1_b_1945_6408)">
                                <circle
                                    cx="18.147"
                                    cy="3.525"
                                    r="1.922"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                ></circle>
                            </g>
                            <g filter="url(#filter2_b_1945_6408)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.076 2.445H5.808C2.797 2.445.93 4.578.93 7.59v8.083c0 3.011 1.83 5.135 4.878 5.135h8.604c3.012 0 4.88-2.124 4.88-5.135V8.633"
                                ></path>
                            </g>
                            <defs>
                                <filter
                                    id="filter0_b_1945_6408"
                                    width="31.889"
                                    height="27.541"
                                    x="-5.88"
                                    y="-2.159"
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
                                        result="effect1_backgroundBlur_1945_6408"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6408"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter1_b_1945_6408"
                                    width="26.396"
                                    height="26.397"
                                    x="4.948"
                                    y="-9.673"
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
                                        result="effect1_backgroundBlur_1945_6408"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6408"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter2_b_1945_6408"
                                    width="40.914"
                                    height="40.914"
                                    x="-10.347"
                                    y="-8.831"
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
                                        result="effect1_backgroundBlur_1945_6408"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6408"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                            </defs>
                        </svg>
                        <h2>
                            {stringFormatter(dict.symbolAnalytics, {
                                assetSymbol: asset.symbol,
                            })}
                        </h2>
                    </a>
                    <a
                        className={cn(
                            'ring-offset-background focus-visible:ring-ring relative flex flex-col items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-800 transition-all after:h-0.5 after:w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:text-xl',
                            {
                                'font-black text-neutral-800 after:bg-neutral-300':
                                    activeSection === 1,
                            }
                        )}
                        href="#signals"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="21"
                            fill="none"
                            viewBox="0 0 20 21"
                        >
                            <g filter="url(#filter0_b_1945_6427)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.634 14.474h-7.22"
                                ></path>
                            </g>
                            <g filter="url(#filter1_b_1945_6427)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.634 10.287h-7.22"
                                ></path>
                            </g>
                            <g filter="url(#filter2_b_1945_6427)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M9.17 6.11H6.413"
                                ></path>
                            </g>
                            <g filter="url(#filter3_b_1945_6427)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.826 1l-7.689.004c-2.76.017-4.469 1.833-4.469 4.603v9.196c0 2.784 1.722 4.607 4.506 4.607l7.689-.003c2.76-.017 4.47-1.834 4.47-4.604V5.607C18.333 2.823 16.61 1 13.826 1z"
                                ></path>
                            </g>
                            <defs>
                                <filter
                                    id="filter0_b_1945_6427"
                                    width="29.773"
                                    height="22.553"
                                    x="-4.862"
                                    y="3.197"
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
                                        result="effect1_backgroundBlur_1945_6427"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6427"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter1_b_1945_6427"
                                    width="29.773"
                                    height="22.553"
                                    x="-4.862"
                                    y="-0.989"
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
                                        result="effect1_backgroundBlur_1945_6427"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6427"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter2_b_1945_6427"
                                    width="25.308"
                                    height="22.553"
                                    x="-4.862"
                                    y="-5.166"
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
                                        result="effect1_backgroundBlur_1945_6427"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6427"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter3_b_1945_6427"
                                    width="39.217"
                                    height="40.963"
                                    x="-9.608"
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
                                        result="effect1_backgroundBlur_1945_6427"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6427"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                            </defs>
                        </svg>
                        <h2>
                            {stringFormatter(dict.signalsTab, {
                                assetSymbol: asset.symbol,
                            })}
                        </h2>
                    </a>
                    {market === 'tse' && !!Object.values(events).length && (
                        <a
                            className={cn(
                                'ring-offset-background focus-visible:ring-ring relative flex flex-col items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-800 transition-all after:h-0.5 after:w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:text-xl',
                                {
                                    'font-black text-neutral-800 after:bg-neutral-300':
                                        activeSection === 2,
                                }
                            )}
                            href="#events"
                        >
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
                                            d="M2.75 12.776c0-6.956 2.319-9.274 9.274-9.274 6.956 0 9.275 2.318 9.275 9.274 0 6.956-2.32 9.274-9.275 9.274S2.75 19.732 2.75 12.776z"
                                            clipRule="evenodd"
                                        ></path>
                                        <path d="M3.025 9.324h18.008"></path>
                                        <path d="M16.428 13.261h.01"></path>
                                        <path d="M12.03 13.261h.008"></path>
                                        <path d="M7.621 13.261h.01"></path>
                                        <path d="M16.428 17.113h.01"></path>
                                        <path d="M12.03 17.113h.008"></path>
                                        <path d="M7.621 17.113h.01"></path>
                                        <path d="M16.033 2.05v3.262"></path>
                                        <path d="M8.025 2.05v3.262"></path>
                                    </g>
                                </g>
                            </svg>
                            <h2>رویداد‌های {asset.symbol}</h2>
                        </a>
                    )}
                    {asset.symbol in Descriptions && (
                        <a
                            className={cn(
                                'ring-offset-background focus-visible:ring-ring relative mb-1 flex flex-col items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-800 transition-all after:h-0.5 after:w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:text-xl',
                                {
                                    'font-black text-neutral-800 after:bg-neutral-300':
                                        activeSection === 3,
                                }
                            )}
                            href="#description"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12.4219 9.99994C13.0906 10.6687 13.0906 11.753 12.4219 12.4218C11.7531 13.0906 10.6688 13.0906 9.99998 12.4218C9.33119 11.753 9.33119 10.6687 9.99998 9.99994C10.6688 9.33116 11.7531 9.33116 12.4219 9.99994Z"
                                    fill="#2D264B"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12.4913 2.08112C11.7475 1.94212 10.9497 2.00344 9.65039 2.10331L9.3738 2.12452C7.65993 2.25575 6.61076 2.33609 5.73551 2.71052C4.37565 3.29227 3.29226 4.37565 2.71052 5.7355C2.33609 6.61076 2.25575 7.65993 2.12453 9.37379L2.10331 9.65039C2.00344 10.9497 1.94212 11.7475 2.08112 12.4913C2.29684 13.6457 2.86085 14.7063 3.69733 15.5306C4.2363 16.0618 4.93203 16.457 6.06507 17.1006L8.13654 18.2777C9.13248 18.8438 9.74241 19.1905 10.3611 19.3773C11.0363 19.5812 11.735 19.6568 12.4231 19.6088L13.6375 20.8232C15.6218 22.8075 18.8389 22.8075 20.8232 20.8232C22.8075 18.839 22.8075 15.6218 20.8232 13.6375L19.6088 12.4231C19.6568 11.735 19.5812 11.0364 19.3773 10.3611C19.1905 9.74241 18.8438 9.13249 18.2778 8.13655L17.1006 6.06506C16.457 4.93203 16.0618 4.2363 15.5306 3.69733C14.7063 2.86085 13.6457 2.29684 12.4913 2.08112ZM9.64797 3.60791C11.1017 3.49636 11.6899 3.45734 12.2157 3.55559C13.069 3.71504 13.853 4.13192 14.4622 4.75018C14.8377 5.13118 15.1342 5.64067 15.8545 6.90834L16.9216 8.78618C17.5559 9.90241 17.8094 10.3577 17.9413 10.7947C18.1199 11.386 18.1654 12.0015 18.0834 12.5997C18.0022 13.1929 17.7957 13.769 17.4693 14.2873C17.2261 14.6736 16.8609 15.0453 15.9531 15.9531C15.0453 16.8609 14.6736 17.2261 14.2873 17.4693C13.7689 17.7957 13.1929 18.0022 12.5997 18.0834C12.0014 18.1653 11.386 18.1199 10.7947 17.9413C10.3577 17.8094 9.90241 17.5559 8.78618 16.9216L6.90834 15.8545C5.64067 15.1342 5.13118 14.8377 4.75018 14.4622C4.13192 13.853 3.71504 13.069 3.55559 12.2157C3.45734 11.6899 3.49636 11.1017 3.60791 9.64797C3.75561 7.72323 3.82534 6.94326 4.08963 6.32548C4.2041 6.0579 4.34485 5.8048 4.50874 5.56932L9.46965 10.5302C9.76255 10.8231 10.2374 10.8231 10.5303 10.5302C10.8232 10.2373 10.8232 9.76247 10.5303 9.46957L5.56941 4.50867C5.80486 4.34481 6.05793 4.20408 6.32548 4.08962C6.94326 3.82534 7.72323 3.75561 9.64797 3.60791ZM14.6981 19.7626L14.1503 19.2148C14.4738 19.086 14.7872 18.9271 15.0864 18.7387C15.6334 18.3944 16.1294 17.8983 16.9394 17.0881L17.0881 16.9394C17.8983 16.1294 18.3944 15.6334 18.7387 15.0864C18.9271 14.7872 19.086 14.4738 19.2148 14.1504L19.7625 14.6982C21.161 16.0967 21.161 18.3641 19.7625 19.7626C18.364 21.1611 16.0966 21.1611 14.6981 19.7626Z"
                                    fill="#2D264B"
                                />
                            </svg>
                            {asset.symbol} چیست؟
                        </a>
                    )}
                </div>
            </div>

            <section
                className="mb-28 mt-10 px-2.5"
                id="analysis"
                ref={sectionRefs[0]}
            >
                <div className="flex flex-col gap-28">
                    {asset.symbol in Descriptions && (
                        <div className="flex px-2">
                            <Box>
                                <BoxTitle>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12.4219 9.99994C13.0906 10.6687 13.0906 11.753 12.4219 12.4218C11.7531 13.0906 10.6688 13.0906 9.99998 12.4218C9.33119 11.753 9.33119 10.6687 9.99998 9.99994C10.6688 9.33116 11.7531 9.33116 12.4219 9.99994Z"
                                            fill="#2D264B"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M12.4913 2.08112C11.7475 1.94212 10.9497 2.00344 9.65039 2.10331L9.3738 2.12452C7.65993 2.25575 6.61076 2.33609 5.73551 2.71052C4.37565 3.29227 3.29226 4.37565 2.71052 5.7355C2.33609 6.61076 2.25575 7.65993 2.12453 9.37379L2.10331 9.65039C2.00344 10.9497 1.94212 11.7475 2.08112 12.4913C2.29684 13.6457 2.86085 14.7063 3.69733 15.5306C4.2363 16.0618 4.93203 16.457 6.06507 17.1006L8.13654 18.2777C9.13248 18.8438 9.74241 19.1905 10.3611 19.3773C11.0363 19.5812 11.735 19.6568 12.4231 19.6088L13.6375 20.8232C15.6218 22.8075 18.8389 22.8075 20.8232 20.8232C22.8075 18.839 22.8075 15.6218 20.8232 13.6375L19.6088 12.4231C19.6568 11.735 19.5812 11.0364 19.3773 10.3611C19.1905 9.74241 18.8438 9.13249 18.2778 8.13655L17.1006 6.06506C16.457 4.93203 16.0618 4.2363 15.5306 3.69733C14.7063 2.86085 13.6457 2.29684 12.4913 2.08112ZM9.64797 3.60791C11.1017 3.49636 11.6899 3.45734 12.2157 3.55559C13.069 3.71504 13.853 4.13192 14.4622 4.75018C14.8377 5.13118 15.1342 5.64067 15.8545 6.90834L16.9216 8.78618C17.5559 9.90241 17.8094 10.3577 17.9413 10.7947C18.1199 11.386 18.1654 12.0015 18.0834 12.5997C18.0022 13.1929 17.7957 13.769 17.4693 14.2873C17.2261 14.6736 16.8609 15.0453 15.9531 15.9531C15.0453 16.8609 14.6736 17.2261 14.2873 17.4693C13.7689 17.7957 13.1929 18.0022 12.5997 18.0834C12.0014 18.1653 11.386 18.1199 10.7947 17.9413C10.3577 17.8094 9.90241 17.5559 8.78618 16.9216L6.90834 15.8545C5.64067 15.1342 5.13118 14.8377 4.75018 14.4622C4.13192 13.853 3.71504 13.069 3.55559 12.2157C3.45734 11.6899 3.49636 11.1017 3.60791 9.64797C3.75561 7.72323 3.82534 6.94326 4.08963 6.32548C4.2041 6.0579 4.34485 5.8048 4.50874 5.56932L9.46965 10.5302C9.76255 10.8231 10.2374 10.8231 10.5303 10.5302C10.8232 10.2373 10.8232 9.76247 10.5303 9.46957L5.56941 4.50867C5.80486 4.34481 6.05793 4.20408 6.32548 4.08962C6.94326 3.82534 7.72323 3.75561 9.64797 3.60791ZM14.6981 19.7626L14.1503 19.2148C14.4738 19.086 14.7872 18.9271 15.0864 18.7387C15.6334 18.3944 16.1294 17.8983 16.9394 17.0881L17.0881 16.9394C17.8983 16.1294 18.3944 15.6334 18.7387 15.0864C18.9271 14.7872 19.086 14.4738 19.2148 14.1504L19.7625 14.6982C21.161 16.0967 21.161 18.3641 19.7625 19.7626C18.364 21.1611 16.0966 21.1611 14.6981 19.7626Z"
                                            fill="#2D264B"
                                        />
                                    </svg>
                                    {
                                        Descriptions[asset.symbol].sections[0]
                                            .title
                                    }
                                </BoxTitle>
                                <BoxContent className="flex items-center justify-center md:gap-6">
                                    <div className="overflow-ellipsis text-base font-medium leading-loose md:line-clamp-2">
                                        {Descriptions[asset.symbol].starter}
                                        <a
                                            href="#description"
                                            className="mr-3 font-medium text-neutral-700"
                                        >
                                            مطالعه بیشتر...
                                        </a>
                                    </div>
                                </BoxContent>
                            </Box>
                        </div>
                    )}
                    <Box>
                        <BoxTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="23"
                                fill="none"
                                viewBox="0 0 22 23"
                            >
                                <path
                                    stroke="#0C0E3C"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M2.75 2.922v16.5h16.5"
                                ></path>
                                <path
                                    stroke="#0C0E3C"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16.5 15.756V8.422M11.916 15.756v-11M7.334 15.756v-2.75"
                                ></path>
                            </svg>
                            {format(
                                market === 'tse'
                                    ? dict.priceAdjustedChartTitle
                                    : dict.priceChartTitle,
                                {
                                    assetSymbol:
                                        market === 'tse'
                                            ? asset.symbol_fa
                                            : asset.name_fa,
                                }
                            )}

                            {/*<QuestionMarkCircledIcon*/}
                            {/*    width={20}*/}
                            {/*    height={20}*/}
                            {/*    color="#2228A9"*/}
                            {/*/>*/}
                        </BoxTitle>
                        <BoxContent>
                            <PriceSignalChart
                                dict={dict}
                                lang={lang}
                                market={market}
                                asset={asset}
                            />
                        </BoxContent>
                    </Box>
                    <Box id="openOrders">
                        <BoxTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="25"
                                fill="none"
                                viewBox="0 0 24 25"
                            >
                                <path
                                    stroke="#0C0E3C"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M3 3.376v18h18"
                                ></path>
                                <path
                                    stroke="#0C0E3C"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9.376l-5 5-4-4-3 3"
                                ></path>
                            </svg>
                            {dict.tradesPriceComment}{' '}
                            {market === 'tse' ? asset.symbol_fa : asset.name_fa}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <InfoIcon className="hover:cursor-pointer" />
                                </DialogTrigger>
                                <DialogContent>
                                    <div className="py-6 text-base leading-10">
                                        اطلاعات این بخش در بر گیرنده تحلیلهایی
                                        است که هنوز معتبر هستند. یعنی حد ضرر/
                                        سود آنها فعال نشده است و تاریخ انقضای
                                        آن‌ها نرسیده است.
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </BoxTitle>
                        <BoxContent>
                            <OpenOrders
                                dict={dict}
                                lang={lang}
                                asset={asset}
                                market={market}
                            />
                        </BoxContent>
                    </Box>
                    <Box id="closeOrders">
                        <BoxTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="21"
                                fill="none"
                                viewBox="0 0 26 21"
                            >
                                <g filter="url(#filter0_b_2813_10321)">
                                    <path
                                        stroke="#0C0E3C"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M8.262 13.481c-3.844 0-7.127.581-7.127 2.91 0 2.326 3.262 2.93 7.127 2.93 3.844 0 7.127-.583 7.127-2.91s-3.262-2.93-7.127-2.93z"
                                    ></path>
                                </g>
                                <g filter="url(#filter1_b_2813_10321)">
                                    <path
                                        stroke="#0C0E3C"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M8.261 10.16a4.552 4.552 0 004.568-4.567 4.551 4.551 0 00-4.568-4.568 4.552 4.552 0 00-4.568 4.568 4.553 4.553 0 004.568 4.568z"
                                    ></path>
                                </g>
                                <g filter="url(#filter2_b_2813_10321)">
                                    <path
                                        stroke="#0C0E3C"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M14.135 11.014l2.993-3.89 3.414 2.681 2.93-3.78"
                                    ></path>
                                </g>
                                <path
                                    stroke="#0C0E3C"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M21.135 5.025l3.474-.456.026 3.456"
                                ></path>
                                <defs>
                                    <filter
                                        id="filter0_b_2813_10321"
                                        width="36.806"
                                        height="28.392"
                                        x="-10.142"
                                        y="2.205"
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
                                            result="effect1_backgroundBlur_2813_10321"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2813_10321"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter1_b_2813_10321"
                                        width="31.689"
                                        height="31.689"
                                        x="-7.583"
                                        y="-10.251"
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
                                            result="effect1_backgroundBlur_2813_10321"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2813_10321"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter2_b_2813_10321"
                                        width="31.889"
                                        height="27.541"
                                        x="2.858"
                                        y="-5.251"
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
                                            result="effect1_backgroundBlur_2813_10321"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2813_10321"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                </defs>
                            </svg>
                            {stringFormatter(dict.assetMostProfit, {
                                symbol:
                                    market === 'tse'
                                        ? asset.symbol_fa
                                        : asset.name_fa,
                            })}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <InfoIcon className="-translate-y-0.5 hover:cursor-pointer" />
                                </DialogTrigger>
                                <DialogContent>
                                    <div className=" py-6 text-base leading-10">
                                        کلیه تریدرهایی که در 6 ماه گذشته موفق به
                                        کسب سود از این نماد شده اند در این لیست
                                        نمایش داده شده‌اند
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </BoxTitle>
                        <BoxContent>
                            <CloseOrders
                                dict={dict}
                                lang={lang}
                                asset={asset}
                                market={market}
                            />
                        </BoxContent>
                    </Box>
                </div>
            </section>
            <section className="mb-28 px-2.5" id="signals" ref={sectionRefs[1]}>
                <Box>
                    <BoxTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="21"
                            fill="none"
                            viewBox="0 0 20 21"
                        >
                            <g filter="url(#filter0_b_1945_6427)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.634 14.474h-7.22"
                                ></path>
                            </g>
                            <g filter="url(#filter1_b_1945_6427)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.634 10.287h-7.22"
                                ></path>
                            </g>
                            <g filter="url(#filter2_b_1945_6427)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M9.17 6.11H6.413"
                                ></path>
                            </g>
                            <g filter="url(#filter3_b_1945_6427)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.826 1l-7.689.004c-2.76.017-4.469 1.833-4.469 4.603v9.196c0 2.784 1.722 4.607 4.506 4.607l7.689-.003c2.76-.017 4.47-1.834 4.47-4.604V5.607C18.333 2.823 16.61 1 13.826 1z"
                                ></path>
                            </g>
                            <defs>
                                <filter
                                    id="filter0_b_1945_6427"
                                    width="29.773"
                                    height="22.553"
                                    x="-4.862"
                                    y="3.197"
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
                                        result="effect1_backgroundBlur_1945_6427"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6427"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter1_b_1945_6427"
                                    width="29.773"
                                    height="22.553"
                                    x="-4.862"
                                    y="-0.989"
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
                                        result="effect1_backgroundBlur_1945_6427"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6427"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter2_b_1945_6427"
                                    width="25.308"
                                    height="22.553"
                                    x="-4.862"
                                    y="-5.166"
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
                                        result="effect1_backgroundBlur_1945_6427"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6427"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter3_b_1945_6427"
                                    width="39.217"
                                    height="40.963"
                                    x="-9.608"
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
                                        result="effect1_backgroundBlur_1945_6427"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_1945_6427"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                            </defs>
                        </svg>
                        سیگنال‌های{' '}
                        {market === 'tse' ? asset.symbol_fa : asset.name_fa}
                    </BoxTitle>
                    <BoxContent className="max-w-none">
                        <ReadingMode />
                        <div className="flex flex-col gap-4 text-sm">
                            <MessagesWrap
                                id={id}
                                market={market}
                                dict={dict}
                                lang={lang}
                                symbol={asset.symbol}
                                showSymbol={false}
                                pureMessages={messages}
                                assets={[asset.asset_id]}
                                showTopTradersFilter
                            />
                        </div>
                    </BoxContent>
                </Box>
            </section>
            {market === 'tse' && !!Object.values(events).length && (
                <section
                    className="mb-28 px-2.5"
                    id="events"
                    ref={sectionRefs[2]}
                >
                    <div className="flex flex-col gap-28">
                        {events.capitalraise && (
                            <Box>
                                <BoxTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M13.05 16.25h-1.88c-1.33 0-2.42-1.12-2.42-2.5 0-.41.34-.75.75-.75s.75.34.75.75c0 .55.41 1 .92 1h1.88c.39 0 .7-.35.7-.78 0-.54-.15-.62-.49-.74l-3.01-1.05c-.64-.22-1.5-.69-1.5-2.16 0-1.25.99-2.28 2.2-2.28h1.88c1.33 0 2.42 1.12 2.42 2.5 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.55-.41-1-.92-1h-1.88c-.39 0-.7.35-.7.78 0 .54.15.62.49.74l3.01 1.05c.64.22 1.5.69 1.5 2.16 0 1.26-.99 2.28-2.2 2.28z"
                                        ></path>
                                        <path
                                            fill="currentColor"
                                            d="M12 17.25c-.41 0-.75-.34-.75-.75v-9c0-.41.34-.75.75-.75s.75.34.75.75v9c0 .41-.34.75-.75.75z"
                                        ></path>
                                        <path
                                            fill="currentColor"
                                            d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12S6.07 1.25 12 1.25c.41 0 .75.34.75.75s-.34.75-.75.75C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25c0-.41.34-.75.75-.75s.75.34.75.75c0 5.93-4.82 10.75-10.75 10.75z"
                                        ></path>
                                        <path
                                            fill="currentColor"
                                            d="M21 7.75h-4c-.41 0-.75-.34-.75-.75V3c0-.41.34-.75.75-.75s.75.34.75.75v3.25H21c.41 0 .75.34.75.75s-.34.75-.75.75z"
                                        ></path>
                                        <path
                                            fill="currentColor"
                                            d="M17 7.75c-.19 0-.38-.07-.53-.22a.754.754 0 010-1.06l5-5c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-5 5c-.15.15-.34.22-.53.22z"
                                        ></path>
                                    </svg>
                                    افزایش سرمایه{' '}
                                    {market === 'tse'
                                        ? asset.symbol_fa
                                        : asset.name_fa}
                                </BoxTitle>
                                <BoxContent>
                                    <Table className="rounded-md bg-white shadow-box">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">
                                                    تاریخ
                                                </TableHead>
                                                <TableHead>
                                                    نوع افزایش سرمایه
                                                </TableHead>
                                                <TableHead>
                                                    درصد افزایش سرمایه
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {events.capitalraise?.map(
                                                (item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.date}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                item.capitalRaiseType
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.perc}%
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </BoxContent>
                            </Box>
                        )}
                        {events.dividend && (
                            <Box>
                                <BoxTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <g>
                                            <g>
                                                <path
                                                    fill="currentColor"
                                                    fillRule="evenodd"
                                                    d="M8.982 6.304a.395.395 0 00-.096.012c-2.97.73-5.386 3.949-5.386 7.173 0 4.056 3.3 7.356 7.357 7.356 3.658 0 6.713-2.605 7.268-6.195.003-.03.017-.117-.064-.214a.44.44 0 00-.332-.145c-1.412 0-2.488.032-3.33.056-2.035.06-2.877.084-3.71-.533-1.254-.93-1.36-2.525-1.36-7.22a.256.256 0 00-.108-.21.386.386 0 00-.239-.08zm1.876 16.04C5.973 22.345 2 18.373 2 13.49c0-3.872 2.928-7.744 6.527-8.63a1.913 1.913 0 011.62.345c.434.34.682.847.682 1.39 0 4.386.148 5.566.753 6.015.397.293.941.29 2.774.239.853-.025 1.943-.057 3.373-.057.57 0 1.107.244 1.47.669.338.395.486.91.409 1.419-.669 4.325-4.349 7.466-8.75 7.466z"
                                                    clipRule="evenodd"
                                                ></path>
                                                <g>
                                                    <mask
                                                        id="mask0_33437_4338"
                                                        style={{
                                                            maskType:
                                                                'luminance',
                                                        }}
                                                        width="11"
                                                        height="11"
                                                        x="12"
                                                        y="1"
                                                        maskUnits="userSpaceOnUse"
                                                    >
                                                        <path
                                                            fill="#fff"
                                                            fillRule="evenodd"
                                                            d="M12.474 1h10.42v10.29h-10.42V1z"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </mask>
                                                    <g mask="url(#mask0_33437_4338)">
                                                        <path
                                                            fill="currentColor"
                                                            fillRule="evenodd"
                                                            d="M14.01 2.502c-.11 2.519.054 5.773.13 7.062a.14.14 0 00.136.137c1.028.059 4.57.223 7.117-.152.006-1.404-.955-3.308-2.402-4.754-1.484-1.482-3.24-2.293-4.958-2.293h-.022zm3.305 8.788a56.02 56.02 0 01-3.126-.091 1.645 1.645 0 01-1.546-1.548c-.078-1.322-.247-4.681-.127-7.28a1.425 1.425 0 011.389-1.368c2.137-.062 4.342.93 6.146 2.73 1.758 1.758 2.874 4.067 2.842 5.884a1.44 1.44 0 01-1.223 1.406c-1.358.205-2.948.267-4.355.267z"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </g>
                                                </g>
                                            </g>
                                            <path
                                                fill="currentColor"
                                                d="M17.16 8.364V4.727h.232v3.637h-.233zm.783-2.546a.446.446 0 00-.207-.335.796.796 0 00-.446-.12.848.848 0 00-.338.063.54.54 0 00-.225.172.412.412 0 00-.024.449c.038.055.086.1.145.138.059.036.12.065.185.09.064.022.123.04.177.055l.296.08c.075.019.16.046.253.081.093.036.183.083.268.144a.664.664 0 01.297.575c0 .157-.041.3-.124.426a.842.842 0 01-.358.303 1.31 1.31 0 01-.57.112c-.208 0-.388-.033-.54-.1a.862.862 0 01-.358-.282.802.802 0 01-.147-.419h.364c.01.11.046.2.11.273a.6.6 0 00.248.159 1 1 0 00.324.05.953.953 0 00.362-.064.621.621 0 00.254-.185.438.438 0 00.094-.278.341.341 0 00-.081-.236.594.594 0 00-.213-.148 2.234 2.234 0 00-.286-.1l-.357-.102a1.333 1.333 0 01-.54-.28.614.614 0 01-.2-.475c0-.163.045-.305.133-.426a.878.878 0 01.358-.285c.15-.068.319-.102.504-.102.188 0 .354.034.5.101a.864.864 0 01.347.273.679.679 0 01.136.393h-.34z"
                                            ></path>
                                        </g>
                                    </svg>
                                    تقسیم سود{' '}
                                    {market === 'tse'
                                        ? asset.symbol_fa
                                        : asset.name_fa}
                                </BoxTitle>
                                <BoxContent>
                                    <Table className="rounded-md bg-white shadow-box">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">
                                                    تاریخ
                                                </TableHead>
                                                <TableHead>مقدار سود</TableHead>
                                                <TableHead>
                                                    درصد تقسیم سود
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {events.dividend?.map(
                                                (item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.date}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.dps}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.payout}%
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </BoxContent>
                            </Box>
                        )}
                        {events.assemblyinvitation && (
                            <Box>
                                <BoxTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <g>
                                            <g>
                                                <g fill="currentColor">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M11.86 13.138h.027c2.52 0 4.569-2.05 4.569-4.569A4.574 4.574 0 0011.886 4 4.573 4.573 0 007.32 8.566a4.518 4.518 0 001.322 3.226 4.52 4.52 0 003.219 1.346zM8.819 8.57A3.072 3.072 0 0111.887 5.5a3.073 3.073 0 013.069 3.07 3.072 3.072 0 01-3.07 3.068h-.024a3.036 3.036 0 01-2.157-.903 3.032 3.032 0 01-.886-2.166z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                    <path d="M17.145 11.5a.75.75 0 00.846.64 3.642 3.642 0 003.12-3.584 3.611 3.611 0 00-3.035-3.576.75.75 0 00-.244 1.48 2.115 2.115 0 011.779 2.094 2.133 2.133 0 01-1.827 2.1.75.75 0 00-.64.847zM20.16 18.048a.75.75 0 00.968.434c1.43-.545 1.644-1.538 1.644-2.082 0-.89-.509-2.029-2.932-2.392a.755.755 0 00-.854.63.752.752 0 00.631.854c1.098.164 1.655.47 1.655.908 0 .137 0 .422-.678.68a.75.75 0 00-.434.968z"></path>
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M11.887 20.791c-1.66 0-6.71 0-6.71-3.195 0-3.182 5.05-3.182 6.71-3.182 1.659 0 6.708 0 6.708 3.2 0 3.177-4.873 3.177-6.708 3.177zm0-4.877c-2.376 0-5.21.292-5.21 1.682 0 1.401 2.834 1.695 5.21 1.695s5.208-.29 5.208-1.678c0-1.404-2.832-1.699-5.208-1.699z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                    <path d="M5.886 12.147a.737.737 0 01-.104-.007 3.641 3.641 0 01-3.12-3.582A3.612 3.612 0 015.699 4.98a.75.75 0 01.244 1.48 2.116 2.116 0 00-1.78 2.096 2.132 2.132 0 001.827 2.098.75.75 0 01-.103 1.493zM2.645 18.482a.75.75 0 00.534-1.402c-.679-.259-.679-.543-.679-.68 0-.438.557-.744 1.655-.908a.752.752 0 00.631-.854.755.755 0 00-.853-.63C1.51 14.371 1 15.51 1 16.4c0 .543.214 1.536 1.645 2.082z"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                    مجامع{' '}
                                    {market === 'tse'
                                        ? asset.symbol_fa
                                        : asset.name_fa}
                                </BoxTitle>
                                <BoxContent>
                                    <Table className="rounded-md bg-white shadow-box">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">
                                                    تاریخ
                                                </TableHead>
                                                <TableHead>نوع مجامع</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {events.assemblyinvitation?.map(
                                                (item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.date}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.assemblyTitle}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </BoxContent>
                            </Box>
                        )}
                    </div>
                </section>
            )}
            {asset.symbol in Descriptions && (
                <section
                    className="text-justify"
                    id="description"
                    ref={sectionRefs[3]}
                >
                    <Box className="px-2">
                        <BoxTitle>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12.4219 9.99994C13.0906 10.6687 13.0906 11.753 12.4219 12.4218C11.7531 13.0906 10.6688 13.0906 9.99998 12.4218C9.33119 11.753 9.33119 10.6687 9.99998 9.99994C10.6688 9.33116 11.7531 9.33116 12.4219 9.99994Z"
                                    fill="#2D264B"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12.4913 2.08112C11.7475 1.94212 10.9497 2.00344 9.65039 2.10331L9.3738 2.12452C7.65993 2.25575 6.61076 2.33609 5.73551 2.71052C4.37565 3.29227 3.29226 4.37565 2.71052 5.7355C2.33609 6.61076 2.25575 7.65993 2.12453 9.37379L2.10331 9.65039C2.00344 10.9497 1.94212 11.7475 2.08112 12.4913C2.29684 13.6457 2.86085 14.7063 3.69733 15.5306C4.2363 16.0618 4.93203 16.457 6.06507 17.1006L8.13654 18.2777C9.13248 18.8438 9.74241 19.1905 10.3611 19.3773C11.0363 19.5812 11.735 19.6568 12.4231 19.6088L13.6375 20.8232C15.6218 22.8075 18.8389 22.8075 20.8232 20.8232C22.8075 18.839 22.8075 15.6218 20.8232 13.6375L19.6088 12.4231C19.6568 11.735 19.5812 11.0364 19.3773 10.3611C19.1905 9.74241 18.8438 9.13249 18.2778 8.13655L17.1006 6.06506C16.457 4.93203 16.0618 4.2363 15.5306 3.69733C14.7063 2.86085 13.6457 2.29684 12.4913 2.08112ZM9.64797 3.60791C11.1017 3.49636 11.6899 3.45734 12.2157 3.55559C13.069 3.71504 13.853 4.13192 14.4622 4.75018C14.8377 5.13118 15.1342 5.64067 15.8545 6.90834L16.9216 8.78618C17.5559 9.90241 17.8094 10.3577 17.9413 10.7947C18.1199 11.386 18.1654 12.0015 18.0834 12.5997C18.0022 13.1929 17.7957 13.769 17.4693 14.2873C17.2261 14.6736 16.8609 15.0453 15.9531 15.9531C15.0453 16.8609 14.6736 17.2261 14.2873 17.4693C13.7689 17.7957 13.1929 18.0022 12.5997 18.0834C12.0014 18.1653 11.386 18.1199 10.7947 17.9413C10.3577 17.8094 9.90241 17.5559 8.78618 16.9216L6.90834 15.8545C5.64067 15.1342 5.13118 14.8377 4.75018 14.4622C4.13192 13.853 3.71504 13.069 3.55559 12.2157C3.45734 11.6899 3.49636 11.1017 3.60791 9.64797C3.75561 7.72323 3.82534 6.94326 4.08963 6.32548C4.2041 6.0579 4.34485 5.8048 4.50874 5.56932L9.46965 10.5302C9.76255 10.8231 10.2374 10.8231 10.5303 10.5302C10.8232 10.2373 10.8232 9.76247 10.5303 9.46957L5.56941 4.50867C5.80486 4.34481 6.05793 4.20408 6.32548 4.08962C6.94326 3.82534 7.72323 3.75561 9.64797 3.60791ZM14.6981 19.7626L14.1503 19.2148C14.4738 19.086 14.7872 18.9271 15.0864 18.7387C15.6334 18.3944 16.1294 17.8983 16.9394 17.0881L17.0881 16.9394C17.8983 16.1294 18.3944 15.6334 18.7387 15.0864C18.9271 14.7872 19.086 14.4738 19.2148 14.1504L19.7625 14.6982C21.161 16.0967 21.161 18.3641 19.7625 19.7626C18.364 21.1611 16.0966 21.1611 14.6981 19.7626Z"
                                    fill="#2D264B"
                                />
                            </svg>
                            {asset.name_fa} چیست؟
                        </BoxTitle>
                        <BoxContent>
                            <div className="flex flex-col gap-6 px-2.5 text-base md:px-1">
                                {Descriptions[asset.symbol].sections.map(
                                    (section, index) => (
                                        <div
                                            className="flex flex-col gap-1"
                                            key={index}
                                        >
                                            <h2 className="text-lg font-black">
                                                {section.title}
                                            </h2>
                                            <div className="leading-relaxed">
                                                {section.text}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </BoxContent>
                    </Box>
                </section>
            )}
        </>
    );
};
