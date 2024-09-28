'use client';

import { useGlobalContext } from '@/contexts/store';
import React, { useEffect, useRef } from 'react';
import { cn } from '@/libs/utils';
import useScrollSpy from 'react-use-scrollspy';
import { ReadingMode } from '@/components/reading-mode';
import { MessagesWrap } from '@/components/messages-wrap';
import { Box, BoxContent, BoxTitle } from '@/components/box';
import { OpenOrders } from '@/app/[lang]/(user)/publisher/components/open-orders';
import { CloseOrders } from '@/app/[lang]/(user)/publisher/components/close-orders';
import { Portfolio } from '@/app/[lang]/(user)/publisher/components/portfolio';
import { MonthlyPerformance } from '@/app/[lang]/(user)/publisher/components/monthly-performance';
import { Signals } from '@/app/[lang]/(user)/publisher/components/signals';
import { Indicators } from '@/app/[lang]/(user)/publisher/components/indicators';
import { ProfitComparedWithIndex } from '@/app/[lang]/(user)/publisher/components/profit-compared-with-index';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { InfoIcon } from 'lucide-react';

export const Content = ({
    id,
    publisher,
    dict,
    market,
    lang,
    messages,
    isAnalytical,
}) => {
    const { isReadingMode, setBreadcrumbTitle } = useGlobalContext();
    const sectionRefs = [useRef(null), useRef(null), useRef(null)];
    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -230,
    });

    useEffect(() => {
        setBreadcrumbTitle(publisher.name);
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
                    {!isAnalytical && (
                        <>
                            <a
                                className={cn(
                                    'ring-offset-background focus-visible:ring-ring relative flex flex-col items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-800 transition-all after:h-0.5 after:w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:text-xl',
                                    {
                                        'font-black text-neutral-800 after:bg-neutral-300':
                                            activeSection === 0,
                                    }
                                )}
                                href="#basket"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="21"
                                    fill="none"
                                    viewBox="0 0 22 21"
                                >
                                    <g filter="url(#filter0_b_2399_13722)">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M20.275 7.895a8.216 8.216 0 00-7.872-6.894.706.706 0 00-.733.678v.064l.443 6.632c.03.446.413.786.86.76l6.65-.443a.706.706 0 00.652-.76v-.037z"
                                        ></path>
                                    </g>
                                    <g filter="url(#filter1_b_2399_13722)">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M7.797 4.946a.905.905 0 011.032.515.815.815 0 01.081.299c.09 1.285.28 4.099.39 5.619a1.031 1.031 0 001.103.96l5.583-.345a.905.905 0 01.96.905 7.61 7.61 0 01-14.261 3.158 7.239 7.239 0 01-.905-2.769 4.67 4.67 0 01-.054-.905 7.619 7.619 0 016.062-7.437"
                                        ></path>
                                    </g>
                                    <defs>
                                        <filter
                                            id="filter0_b_2399_13722"
                                            width="31.16"
                                            height="30.689"
                                            x="0.394"
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
                                                result="effect1_backgroundBlur_2399_13722"
                                            ></feComposite>
                                            <feBlend
                                                in="SourceGraphic"
                                                in2="effect1_backgroundBlur_2399_13722"
                                                result="shape"
                                            ></feBlend>
                                        </filter>
                                        <filter
                                            id="filter1_b_2399_13722"
                                            width="37.775"
                                            height="37.63"
                                            x="-9.554"
                                            y="-6.354"
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
                                                result="effect1_backgroundBlur_2399_13722"
                                            ></feComposite>
                                            <feBlend
                                                in="SourceGraphic"
                                                in2="effect1_backgroundBlur_2399_13722"
                                                result="shape"
                                            ></feBlend>
                                        </filter>
                                    </defs>
                                </svg>
                                <h2>{dict.basket}</h2>
                            </a>
                            <a
                                className={cn(
                                    'ring-offset-background focus-visible:ring-ring relative flex flex-col items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-800 transition-all after:h-0.5 after:w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:text-xl',
                                    {
                                        'font-black text-neutral-800 after:bg-neutral-300':
                                            activeSection === 1,
                                    }
                                )}
                                href="#performance"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="21"
                                    height="21"
                                    fill="none"
                                    viewBox="0 0 21 21"
                                >
                                    <g filter="url(#filter0_b_2399_13713)">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M6.103 8.792v6.517"
                                        ></path>
                                    </g>
                                    <g filter="url(#filter1_b_2399_13713)">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M10.536 5.673v9.636"
                                        ></path>
                                    </g>
                                    <g filter="url(#filter2_b_2399_13713)">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M14.898 12.236v3.073"
                                        ></path>
                                    </g>
                                    <g filter="url(#filter3_b_2399_13713)">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M14.951 1H6.05C2.945 1 1 3.196 1 6.306v8.388C1 17.804 2.936 20 6.049 20h8.902C18.064 20 20 17.803 20 14.694V6.306C20 3.196 18.064 1 14.951 1z"
                                        ></path>
                                    </g>
                                    <defs>
                                        <filter
                                            id="filter0_b_2399_13713"
                                            width="22.553"
                                            height="29.07"
                                            x="-5.174"
                                            y="-2.485"
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
                                                result="effect1_backgroundBlur_2399_13713"
                                            ></feComposite>
                                            <feBlend
                                                in="SourceGraphic"
                                                in2="effect1_backgroundBlur_2399_13713"
                                                result="shape"
                                            ></feBlend>
                                        </filter>
                                        <filter
                                            id="filter1_b_2399_13713"
                                            width="22.553"
                                            height="32.188"
                                            x="-0.74"
                                            y="-5.603"
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
                                                result="effect1_backgroundBlur_2399_13713"
                                            ></feComposite>
                                            <feBlend
                                                in="SourceGraphic"
                                                in2="effect1_backgroundBlur_2399_13713"
                                                result="shape"
                                            ></feBlend>
                                        </filter>
                                        <filter
                                            id="filter2_b_2399_13713"
                                            width="22.553"
                                            height="25.626"
                                            x="3.621"
                                            y="0.959"
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
                                                result="effect1_backgroundBlur_2399_13713"
                                            ></feComposite>
                                            <feBlend
                                                in="SourceGraphic"
                                                in2="effect1_backgroundBlur_2399_13713"
                                                result="shape"
                                            ></feBlend>
                                        </filter>
                                        <filter
                                            id="filter3_b_2399_13713"
                                            width="41.553"
                                            height="41.553"
                                            x="-10.276"
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
                                                result="effect1_backgroundBlur_2399_13713"
                                            ></feComposite>
                                            <feBlend
                                                in="SourceGraphic"
                                                in2="effect1_backgroundBlur_2399_13713"
                                                result="shape"
                                            ></feBlend>
                                        </filter>
                                    </defs>
                                </svg>
                                <h2>{dict.performance}</h2>
                            </a>
                        </>
                    )}
                    <a
                        className={cn(
                            'ring-offset-background focus-visible:ring-ring relative flex flex-col items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-800 transition-all after:h-0.5 after:w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:text-xl',
                            {
                                'font-black text-neutral-800 after:bg-neutral-300':
                                    activeSection === 2,
                            }
                        )}
                        href="#messages"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="21"
                            fill="none"
                            viewBox="0 0 19 21"
                        >
                            <g filter="url(#filter0_b_2399_13729)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.25 14.905H5.8"
                                ></path>
                            </g>
                            <g filter="url(#filter1_b_2399_13729)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.25 10.585H5.8"
                                ></path>
                            </g>
                            <g filter="url(#filter2_b_2399_13729)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M8.642 6.274H5.8"
                                ></path>
                            </g>
                            <g filter="url(#filter3_b_2399_13729)">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M13.448 1l-7.935.004C2.664 1.022.9 2.896.9 5.754v9.491C.9 18.12 2.678 20 5.55 20l7.936-.003c2.849-.018 4.613-1.893 4.613-4.752v-9.49C18.1 2.88 16.322 1 13.448 1z"
                                ></path>
                            </g>
                            <defs>
                                <filter
                                    id="filter0_b_2399_13729"
                                    width="30.004"
                                    height="22.553"
                                    x="-5.477"
                                    y="3.629"
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
                                        result="effect1_backgroundBlur_2399_13729"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_2399_13729"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter1_b_2399_13729"
                                    width="30.004"
                                    height="22.553"
                                    x="-5.477"
                                    y="-0.692"
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
                                        result="effect1_backgroundBlur_2399_13729"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_2399_13729"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter2_b_2399_13729"
                                    width="25.396"
                                    height="22.553"
                                    x="-5.477"
                                    y="-5.002"
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
                                        result="effect1_backgroundBlur_2399_13729"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_2399_13729"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter3_b_2399_13729"
                                    width="39.752"
                                    height="41.553"
                                    x="-10.376"
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
                                        result="effect1_backgroundBlur_2399_13729"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_2399_13729"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                            </defs>
                        </svg>
                        <h2>{dict.traderMessage}</h2>
                    </a>
                </div>
            </div>
            {!isAnalytical && (
                <>
                    <section
                        className="mb-28 mt-10 px-2.5"
                        id="basket"
                        ref={sectionRefs[0]}
                    >
                        <div className="flex flex-col gap-28">
                            <Box>
                                <BoxTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        fill="none"
                                        viewBox="0 0 22 22"
                                    >
                                        <g clipPath="url(#clip0_2694_13677)">
                                            <path
                                                fill="#0C0E3C"
                                                d="M10.083 1.88v2.768a6.417 6.417 0 104.76 11.491l1.958 1.959a9.166 9.166 0 11-6.718-16.219zM20.12 11.916a9.119 9.119 0 01-2.023 4.884l-1.959-1.958a6.379 6.379 0 001.213-2.926h2.77zM11.918 1.879a9.17 9.17 0 018.204 8.204h-2.77a6.42 6.42 0 00-5.434-5.435v-2.77.001z"
                                            ></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2694_13677">
                                                <path
                                                    fill="#fff"
                                                    d="M0 0H22V22H0z"
                                                ></path>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    {dict.buySuggest}
                                    <Dialog>
                                        <DialogTrigger>
                                            <InfoIcon className="-translate-y-0.5" />
                                        </DialogTrigger>
                                        <DialogContent className="pt-12 leading-relaxed">
                                            نماد‌های این بخش نشان دهنده‌ی سیگنال
                                            هایی است که هنوز معتبر هستند و به
                                            دلیل نظر مخالف تریدر، قدیمی شدن و یا
                                            تغییر شرایط قیمتی منقضی نشده اند.
                                        </DialogContent>
                                    </Dialog>
                                    {/*<QuestionMarkCircledIcon*/}
                                    {/*    width={20}*/}
                                    {/*    height={20}*/}
                                    {/*    color="#2228A9"*/}
                                    {/*/>*/}
                                </BoxTitle>
                                <BoxContent>
                                    <Portfolio
                                        id={id}
                                        dict={dict}
                                        lang={lang}
                                    />
                                    <OpenOrders
                                        id={id}
                                        dict={dict}
                                        lang={lang}
                                        publisher={publisher}
                                        market={market}
                                    />
                                </BoxContent>
                            </Box>
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
                                            stroke="#0C0E3C"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M16 22h2c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"
                                        ></path>
                                        <path
                                            stroke="#0C0E3C"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M14 2v6h6"
                                        ></path>
                                        <path
                                            stroke="#0C0E3C"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 22a6 6 0 100-12 6 6 0 000 12z"
                                        ></path>
                                        <path
                                            stroke="#0C0E3C"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9.5 17.5L8 16.25V14"
                                        ></path>
                                    </svg>
                                    {dict.buyHistory}
                                    <Dialog>
                                        <DialogTrigger>
                                            <InfoIcon className="-translate-y-0.5" />
                                        </DialogTrigger>
                                        <DialogContent className="pt-12 leading-relaxed">
                                            این نماد‌ها در حال حاضر برای سرمایه
                                            گذاری مناسب نیستند و تنها نشان
                                            دهنده‌ی سابقه‌ی سرمایه گذاری تریدر
                                            هستند. با کلیک روی هر نماد میتوانید
                                            جزییات هر تحلیل را مشاهده کنید.
                                        </DialogContent>
                                    </Dialog>
                                </BoxTitle>
                                <BoxContent>
                                    <CloseOrders
                                        id={id}
                                        dict={dict}
                                        lang={lang}
                                        market={market}
                                    />
                                </BoxContent>
                            </Box>
                        </div>
                    </section>
                    <section
                        className="mb-28 px-2.5"
                        id="performance"
                        ref={sectionRefs[1]}
                    >
                        <div className="flex flex-col gap-28">
                            {lang === 'fa' && (
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
                                                d="M13.75 8.422h-5.5c-1.013 0-1.834.821-1.834 1.834v1.833c0 1.013.82 1.833 1.833 1.833h5.5c1.013 0 1.834-.82 1.834-1.833v-1.833c0-1.013-.821-1.834-1.834-1.834zM20.167 18.506H1.834M20.167 3.839H1.834"
                                            ></path>
                                        </svg>
                                        {dict.monthToMonthPerformance}
                                    </BoxTitle>
                                    <BoxContent>
                                        <MonthlyPerformance
                                            id={id}
                                            dict={dict}
                                            lang={lang}
                                            market={market}
                                        />
                                    </BoxContent>
                                </Box>
                            )}
                            <Box>
                                <BoxTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="25"
                                        fill="none"
                                        viewBox="0 0 24 25"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M3 3.376v18h18"
                                        ></path>
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9.376l-5 5-4-4-3 3"
                                        ></path>
                                    </svg>
                                    {dict.traderSignalChart}
                                    {/*<QuestionMarkCircledIcon*/}
                                    {/*    width={20}*/}
                                    {/*    height={20}*/}
                                    {/*    color="#2228A9"*/}
                                    {/*/>*/}
                                </BoxTitle>
                                <BoxContent>
                                    <Signals
                                        dict={dict}
                                        lang={lang}
                                        id={publisher.id}
                                        market={market}
                                    />
                                </BoxContent>
                            </Box>
                            <Box>
                                <BoxTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-ruler"
                                    >
                                        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
                                        <path d="m14.5 12.5 2-2" />
                                        <path d="m11.5 9.5 2-2" />
                                        <path d="m8.5 6.5 2-2" />
                                        <path d="m17.5 15.5 2-2" />
                                    </svg>
                                    معیار‌های ارزیابی عملکرد‌ تریدر
                                </BoxTitle>
                                <BoxContent>
                                    <Indicators publisher={publisher} />
                                </BoxContent>
                            </Box>
                            {process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' && (
                                <Box>
                                    <BoxTitle>
                                        درصد سود تریدر نسبت به شاخص کل
                                    </BoxTitle>
                                    <BoxContent>
                                        <ProfitComparedWithIndex id={id} />
                                    </BoxContent>
                                </Box>
                            )}
                        </div>
                    </section>
                </>
            )}
            <section
                className="mb-28 px-2.5"
                id="messages"
                ref={sectionRefs[2]}
            >
                <div className="flex flex-col">
                    <Box>
                        <BoxTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="21"
                                fill="none"
                                viewBox="0 0 19 21"
                            >
                                <g filter="url(#filter0_b_2399_13729)">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M13.25 14.905H5.8"
                                    ></path>
                                </g>
                                <g filter="url(#filter1_b_2399_13729)">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M13.25 10.585H5.8"
                                    ></path>
                                </g>
                                <g filter="url(#filter2_b_2399_13729)">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M8.642 6.274H5.8"
                                    ></path>
                                </g>
                                <g filter="url(#filter3_b_2399_13729)">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M13.448 1l-7.935.004C2.664 1.022.9 2.896.9 5.754v9.491C.9 18.12 2.678 20 5.55 20l7.936-.003c2.849-.018 4.613-1.893 4.613-4.752v-9.49C18.1 2.88 16.322 1 13.448 1z"
                                    ></path>
                                </g>
                                <defs>
                                    <filter
                                        id="filter0_b_2399_13729"
                                        width="30.004"
                                        height="22.553"
                                        x="-5.477"
                                        y="3.629"
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
                                            result="effect1_backgroundBlur_2399_13729"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2399_13729"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter1_b_2399_13729"
                                        width="30.004"
                                        height="22.553"
                                        x="-5.477"
                                        y="-0.692"
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
                                            result="effect1_backgroundBlur_2399_13729"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2399_13729"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter2_b_2399_13729"
                                        width="25.396"
                                        height="22.553"
                                        x="-5.477"
                                        y="-5.002"
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
                                            result="effect1_backgroundBlur_2399_13729"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2399_13729"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter3_b_2399_13729"
                                        width="39.752"
                                        height="41.553"
                                        x="-10.376"
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
                                            result="effect1_backgroundBlur_2399_13729"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2399_13729"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                </defs>
                            </svg>
                            پیام های تریدر
                        </BoxTitle>
                        <BoxContent className="max-w-none">
                            <ReadingMode />
                            <MessagesWrap
                                follow={false}
                                pureMessages={messages}
                                id={id}
                                publishers={[publisher.id]}
                                showUpdateTime={false}
                                market={market}
                                filtersBox={!isAnalytical}
                                dict={dict}
                                lang={lang}
                            />
                        </BoxContent>
                    </Box>
                </div>
            </section>
        </>
    );
};
