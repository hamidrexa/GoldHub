'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    areDatesEqual,
    cn,
    convertDateToHumanTime,
    currency,
    getDirection,
    getLinksLang,
    roundNumber,
} from '@/libs/utils';
import React, { useState } from 'react';
import Sparkline from '@/components/sparkline';
import stringFormatter from '@/libs/stringFormatter';
import { useGlobalContext } from '@/contexts/store';
import { StatusBar } from '@/components/status-bar';
import dayjs from 'dayjs';
import { useCloseOrders } from '@/app/[lang]/(user)/publisher/services/useCloseOrders';
import { usePriceHistory } from '@/app/[lang]/(user)/(asset)/services/usePriceHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDownCircle } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Empty } from '@/components/empty';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ClosingWay = {
    RISK_REWARD: 'حد سود و ضرر',
    TIME_LIMIT: 'تمام شدن زمان',
    OPPOSITE_SIGNAL: 'سیگنال فروش تریدر',
    REAL_PROFIT: 'حد سود',
    REAL_LOSS: 'حد ضرر',
    ESTIMATED_PROFIT: 'حد سود تخمینی',
    ESTIMATED_LOSS: 'حد ضرر تخمینی',
    REAL_TIME_LIMIT: 'پایان مدت اعتبار',
    ESTIMATED_TIME_LIMIT: 'پایان مدت اعتبار تخمینی',
};

export function CloseOrders({ dict, lang, id, market }) {
    const { user } = useGlobalContext();
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [year, setYear] = useState('1403');
    const { closeOrder, isLoading } = useCloseOrders(id, {
        page,
        year,
    });
    const { priceHistory, isLoading: historyLoading } = usePriceHistory(
        selectedOrder?.opening_signal?.asset?.id,
        {
            from_date: dayjs(selectedOrder?.opening_signal?.message_date)
                .subtract(30, 'day')
                .format('YYYY-MM-DD'),
            to_date: dayjs(selectedOrder?.closing_datetime)
                .add(30, 'day')
                .format('YYYY-MM-DD'),
        },
        selectedOrder
    );
    return (
        <>
            <div className="mx-auto max-w-xl">
                <div className="mb-8 flex flex-col items-center justify-center gap-5 md:flex-row">
                    <div className="flex w-full items-center justify-between gap-5 md:w-fit md:justify-start">
                        <div className="text-sm font-bold">{dict.filter}:</div>
                        <RadioGroup
                            defaultValue={year}
                            dir={getDirection(lang)}
                            className="flex flex-row-reverse items-center gap-3"
                            onValueChange={(value) => {
                                setPage(1);
                                setYear(value);
                            }}
                        >
                            <div>
                                <RadioGroupItem
                                    value="1403"
                                    id="close-orders-1403"
                                    className="peer sr-only"
                                    disabled={!user}
                                />
                                <Label
                                    htmlFor="close-orders-1403"
                                    className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white"
                                >
                                    1403
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="1402"
                                    id="close-orders-1402"
                                    className="peer sr-only"
                                    disabled={!user}
                                />
                                <Label
                                    htmlFor="close-orders-1402"
                                    className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white"
                                >
                                    1402
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="1401"
                                    id="close-orders-1401"
                                    className="peer sr-only"
                                    disabled={!user}
                                />
                                <Label
                                    htmlFor="close-orders-1401"
                                    className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white"
                                >
                                    1401
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="1400"
                                    id="close-orders-1400"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="close-orders-1400"
                                    className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white"
                                >
                                    1400
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                {closeOrder.count !== 0 && (
                    <>
                        <div className="flex w-full flex-col items-center gap-6">
                            <div className="w-full rounded-lg border border-neutral-100 bg-white py-6">
                                <StatusBar
                                    rightSide={{
                                        count: closeOrder.positive_orders,
                                        percent: roundNumber(
                                            closeOrder.positive_percentage * 100
                                        ),
                                        name: stringFormatter(
                                            dict.statusBarRightName,
                                            {}
                                        ),
                                        color: '#10EDC5',
                                    }}
                                    leftSide={{
                                        count: closeOrder.negative_orders,
                                        percent: roundNumber(
                                            closeOrder.negative_percentage * 100
                                        ),
                                        name: stringFormatter(
                                            dict.statusBarLeftName,
                                            {}
                                        ),
                                        color: '#DB2777',
                                    }}
                                    isLoading={isLoading}
                                />
                            </div>
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map((item) => (
                                    <div
                                        className="my-2 flex w-full justify-between"
                                        key={item}
                                    >
                                        <Skeleton className="h-6 w-14" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                ))
                            ) : (
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                    onValueChange={(order) => {
                                        setSelectedOrder(order);
                                    }}
                                >
                                    {closeOrder?.results?.map((order) => (
                                        <AccordionItem
                                            key={order.opening_signal.id}
                                            value={order}
                                        >
                                            <AccordionTrigger asChild>
                                                <div className="flex w-full items-center justify-between gap-2.5 text-base hover:cursor-pointer [&[data-state=open]>div>svg]:rotate-180">
                                                    <div className="flex items-center gap-2.5">
                                                        <ChevronDownCircle
                                                            strokeWidth={1.5}
                                                        />
                                                        <span>
                                                            {
                                                                order
                                                                    .opening_signal
                                                                    .asset
                                                                    ?.symbol
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <div
                                                            className={cn(
                                                                'text-3xl font-bold',
                                                                order.efficiency >
                                                                    0
                                                                    ? 'text-neutral-400'
                                                                    : 'text-neutral-600'
                                                            )}
                                                            dir="ltr"
                                                        >
                                                            {(
                                                                order.efficiency *
                                                                100
                                                            ).toFixed(2)}
                                                            %
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="rounded-lg border border-neutral-100 bg-neutral-150 px-5 py-4">
                                                <div className="mb-3 grid grid-cols-2 gap-5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                fill="none"
                                                                viewBox="0 0 18 18"
                                                            >
                                                                <g filter="url(#filter0_b_2905_9123)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M12.748 1.172H5.251C2.638 1.172 1 3.022 1 5.64v7.064c0 2.618 1.63 4.468 4.25 4.468h7.498c2.62 0 4.252-1.85 4.252-4.468V5.64c0-2.618-1.631-4.468-4.252-4.468z"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter1_b_2905_9123)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M11.933 10.917L9 9.167V5.397"
                                                                    ></path>
                                                                </g>
                                                                <defs>
                                                                    <filter
                                                                        id="filter0_b_2905_9123"
                                                                        width="38.553"
                                                                        height="38.553"
                                                                        x="-10.276"
                                                                        y="-10.104"
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
                                                                            result="effect1_backgroundBlur_2905_9123"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9123"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter1_b_2905_9123"
                                                                        width="25.486"
                                                                        height="28.074"
                                                                        x="-2.276"
                                                                        y="-5.88"
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
                                                                            result="effect1_backgroundBlur_2905_9123"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9123"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                </defs>
                                                            </svg>
                                                            <span className="text-sm font-bold">
                                                                {convertDateToHumanTime(
                                                                    dict,
                                                                    lang,
                                                                    order
                                                                        .opening_signal
                                                                        .message_date
                                                                )}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            {dict.openTime}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="19"
                                                                height="18"
                                                                fill="none"
                                                                viewBox="0 0 19 18"
                                                            >
                                                                <g filter="url(#filter0_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M5.797 7.734v5.488"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter1_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M9.531 5.107v8.115"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter2_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M13.203 10.634v2.588"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter3_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M13.249 1.172H5.75C3.138 1.172 1.5 3.022 1.5 5.64v7.064c0 2.619 1.63 4.468 4.251 4.468h7.498c2.62 0 4.251-1.85 4.251-4.468V5.64c0-2.618-1.63-4.468-4.251-4.468z"
                                                                    ></path>
                                                                </g>
                                                                <defs>
                                                                    <filter
                                                                        id="filter0_b_2905_9132"
                                                                        width="22.553"
                                                                        height="28.041"
                                                                        x="-5.479"
                                                                        y="-3.542"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter1_b_2905_9132"
                                                                        width="22.553"
                                                                        height="30.667"
                                                                        x="-1.745"
                                                                        y="-6.169"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter2_b_2905_9132"
                                                                        width="22.553"
                                                                        height="25.14"
                                                                        x="1.927"
                                                                        y="-0.643"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter3_b_2905_9132"
                                                                        width="38.553"
                                                                        height="38.553"
                                                                        x="-9.776"
                                                                        y="-10.104"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                </defs>
                                                            </svg>
                                                            <span
                                                                className="text-sm font-bold"
                                                                dir="ltr"
                                                            >
                                                                {currency(
                                                                    order.opening_price,
                                                                    market,
                                                                    lang
                                                                )}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            {dict.openPrice}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                fill="none"
                                                                viewBox="0 0 18 18"
                                                            >
                                                                <g filter="url(#filter0_b_2905_9123)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M12.748 1.172H5.251C2.638 1.172 1 3.022 1 5.64v7.064c0 2.618 1.63 4.468 4.25 4.468h7.498c2.62 0 4.252-1.85 4.252-4.468V5.64c0-2.618-1.631-4.468-4.252-4.468z"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter1_b_2905_9123)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M11.933 10.917L9 9.167V5.397"
                                                                    ></path>
                                                                </g>
                                                                <defs>
                                                                    <filter
                                                                        id="filter0_b_2905_9123"
                                                                        width="38.553"
                                                                        height="38.553"
                                                                        x="-10.276"
                                                                        y="-10.104"
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
                                                                            result="effect1_backgroundBlur_2905_9123"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9123"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter1_b_2905_9123"
                                                                        width="25.486"
                                                                        height="28.074"
                                                                        x="-2.276"
                                                                        y="-5.88"
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
                                                                            result="effect1_backgroundBlur_2905_9123"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9123"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                </defs>
                                                            </svg>
                                                            <span className="text-sm font-bold">
                                                                {convertDateToHumanTime(
                                                                    dict,
                                                                    lang,
                                                                    order.closing_datetime
                                                                )}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            {dict.closeTime}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="19"
                                                                height="18"
                                                                fill="none"
                                                                viewBox="0 0 19 18"
                                                            >
                                                                <g filter="url(#filter0_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M5.797 7.734v5.488"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter1_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M9.531 5.107v8.115"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter2_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M13.203 10.634v2.588"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter3_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M13.249 1.172H5.75C3.138 1.172 1.5 3.022 1.5 5.64v7.064c0 2.619 1.63 4.468 4.251 4.468h7.498c2.62 0 4.251-1.85 4.251-4.468V5.64c0-2.618-1.63-4.468-4.251-4.468z"
                                                                    ></path>
                                                                </g>
                                                                <defs>
                                                                    <filter
                                                                        id="filter0_b_2905_9132"
                                                                        width="22.553"
                                                                        height="28.041"
                                                                        x="-5.479"
                                                                        y="-3.542"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter1_b_2905_9132"
                                                                        width="22.553"
                                                                        height="30.667"
                                                                        x="-1.745"
                                                                        y="-6.169"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter2_b_2905_9132"
                                                                        width="22.553"
                                                                        height="25.14"
                                                                        x="1.927"
                                                                        y="-0.643"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter3_b_2905_9132"
                                                                        width="38.553"
                                                                        height="38.553"
                                                                        x="-9.776"
                                                                        y="-10.104"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                </defs>
                                                            </svg>
                                                            <span
                                                                className="text-sm font-bold"
                                                                dir="ltr"
                                                            >
                                                                {currency(
                                                                    order.closing_price,
                                                                    market,
                                                                    lang
                                                                )}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            {dict.closePrice}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="19"
                                                                height="18"
                                                                fill="none"
                                                                viewBox="0 0 19 18"
                                                            >
                                                                <g filter="url(#filter0_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M5.797 7.734v5.488"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter1_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M9.531 5.107v8.115"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter2_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M13.203 10.634v2.588"
                                                                    ></path>
                                                                </g>
                                                                <g filter="url(#filter3_b_2905_9132)">
                                                                    <path
                                                                        stroke="#0C0E3C"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M13.249 1.172H5.75C3.138 1.172 1.5 3.022 1.5 5.64v7.064c0 2.619 1.63 4.468 4.251 4.468h7.498c2.62 0 4.251-1.85 4.251-4.468V5.64c0-2.618-1.63-4.468-4.251-4.468z"
                                                                    ></path>
                                                                </g>
                                                                <defs>
                                                                    <filter
                                                                        id="filter0_b_2905_9132"
                                                                        width="22.553"
                                                                        height="28.041"
                                                                        x="-5.479"
                                                                        y="-3.542"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter1_b_2905_9132"
                                                                        width="22.553"
                                                                        height="30.667"
                                                                        x="-1.745"
                                                                        y="-6.169"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter2_b_2905_9132"
                                                                        width="22.553"
                                                                        height="25.14"
                                                                        x="1.927"
                                                                        y="-0.643"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                    <filter
                                                                        id="filter3_b_2905_9132"
                                                                        width="38.553"
                                                                        height="38.553"
                                                                        x="-9.776"
                                                                        y="-10.104"
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
                                                                            result="effect1_backgroundBlur_2905_9132"
                                                                        ></feComposite>
                                                                        <feBlend
                                                                            in="SourceGraphic"
                                                                            in2="effect1_backgroundBlur_2905_9132"
                                                                            result="shape"
                                                                        ></feBlend>
                                                                    </filter>
                                                                </defs>
                                                            </svg>
                                                            <span
                                                                className="text-sm font-bold"
                                                                dir="rtl md:ltr"
                                                            >
                                                                {order.closing_way in
                                                                ClosingWay
                                                                    ? ClosingWay[
                                                                          order
                                                                              .closing_way
                                                                      ]
                                                                    : 'نا‌مشخص'}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            دلیل خروج
                                                        </span>
                                                    </div>
                                                    <Link
                                                        className="flex items-center gap-2 text-sm underline underline-offset-2"
                                                        target="_blank"
                                                        href={`${getLinksLang(lang)}/message/${order.opening_signal.id}`}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="18"
                                                            height="19"
                                                            fill="none"
                                                            viewBox="0 0 18 19"
                                                        >
                                                            <path
                                                                stroke="#0C0E3C"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.5"
                                                                d="M9.75 4.876h4.5a1.5 1.5 0 011.5 1.5v8.25a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-4.5M2.25 7.126v-4.5h4.5M10.5 10.876l-8.25-8.25"
                                                            ></path>
                                                        </svg>
                                                        {dict.goToMassage}
                                                    </Link>
                                                </div>
                                                <div className="-mx-5">
                                                    {priceHistory && (
                                                        <Sparkline
                                                            market={market}
                                                            name={dict.price}
                                                            lang={lang}
                                                            color="#2830C9"
                                                            xDataKey="date"
                                                            yDataKey="return_price"
                                                            data={priceHistory.map(
                                                                (item) => ({
                                                                    ...item,
                                                                    return_price:
                                                                        areDatesEqual(
                                                                            item.date,
                                                                            order
                                                                                .opening_signal
                                                                                .message_date
                                                                        )
                                                                            ? selectedOrder.opening_price
                                                                            : areDatesEqual(
                                                                                    item.date,
                                                                                    order.closing_datetime
                                                                                )
                                                                              ? selectedOrder.closing_price
                                                                              : item.return_price,
                                                                    date: dayjs(
                                                                        item.date
                                                                    )
                                                                        .calendar(
                                                                            lang ===
                                                                                'fa'
                                                                                ? 'jalali'
                                                                                : 'gregory'
                                                                        )
                                                                        .locale(
                                                                            lang
                                                                        )
                                                                        .format(
                                                                            'YYYY/MM/DD'
                                                                        ),
                                                                    greenPoint:
                                                                        areDatesEqual(
                                                                            item.date,
                                                                            order
                                                                                .opening_signal
                                                                                .message_date
                                                                        ),
                                                                    redPoint:
                                                                        areDatesEqual(
                                                                            item.date,
                                                                            order.closing_datetime
                                                                        ),
                                                                })
                                                            )}
                                                            width="100%"
                                                            height={160}
                                                        />
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </div>
                        <Pagination className="mt-8">
                            <PaginationContent>
                                {closeOrder.next && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            text="قدیمی‌تر"
                                            onClick={() => {
                                                setPage(page + 1);
                                            }}
                                            isActive
                                        />
                                    </PaginationItem>
                                )}
                                {closeOrder.previous && (
                                    <PaginationItem>
                                        <PaginationNext
                                            text="جدید‌تر"
                                            onClick={() => {
                                                setPage(page - 1);
                                            }}
                                            isActive
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </>
                )}
            </div>
            {closeOrder.count === 0 && <Empty> {dict.buyHistoryIsEmpty}</Empty>}
        </>
    );
}
