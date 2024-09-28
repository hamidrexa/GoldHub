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
    getDateFromDate,
    getDirection,
} from '@/libs/utils';
import { FollowButton } from '@/components/follow-button';
import { ContentTypes } from '@/constants/content-types';
import React, { useState } from 'react';
import Sparkline from '@/components/sparkline';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGlobalContext } from '@/contexts/store';
import { componentFormat } from '@/libs/stringFormatter';
import { Publisher } from '@/components/publisher';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useCloseOrder } from '@/app/[lang]/(user)/(asset)/services/useCloseOrder';
import { usePriceHistory } from '@/app/[lang]/(user)/(asset)/services/usePriceHistory';

export function CloseOrders({ dict, lang, asset, market }) {
    const { user } = useGlobalContext();
    const [traderCategoryFilter, setTraderCategoryFilter] = useState(undefined);
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { closeOrder, isLoading } = useCloseOrder(asset.asset_id, {
        trader_category: traderCategoryFilter,
        page,
    });
    const { past: from_date } = getDateFromDate(
        30,
        selectedOrder?.opening_signal?.message.date
    );
    const { priceHistory, isLoading: historyIsLoading } = usePriceHistory(
        asset.asset_id,
        {
            from_date,
            to_date: dayjs().format('YYYY-MM-DD'),
        },
        selectedOrder
    );

    return (
        <>
            <div className="mb-8 flex flex-col items-center justify-center gap-5 md:flex-row">
                <div className="flex w-full items-center justify-between gap-5 md:w-fit md:justify-start">
                    <div className="text-sm font-bold">{dict.filter}:</div>
                    <RadioGroup
                        defaultValue={traderCategoryFilter}
                        dir={getDirection(lang)}
                        className="flex items-center gap-3"
                        onValueChange={(val) => {
                            setPage(1);
                            setTraderCategoryFilter(val);
                        }}
                    >
                        <div>
                            <RadioGroupItem
                                value={undefined}
                                id="close-orders-all-trader"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="close-orders-all-trader"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                {dict.allTraders}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="TopTraders"
                                id="close-orders-top-traders"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="close-orders-top-traders"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                {dict.top100Traders}
                            </Label>
                        </div>
                        {/*<div>*/}
                        {/*    <RadioGroupItem*/}
                        {/*        value="MyTraders"*/}
                        {/*        id="close-orders-my-traders"*/}
                        {/*        className="peer sr-only"*/}
                        {/*        disabled={!user}*/}
                        {/*    />*/}
                        {/*    <Label*/}
                        {/*        htmlFor="close-orders-my-traders"*/}
                        {/*        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*    >*/}
                        {/*        {dict.myTraders}*/}
                        {/*    </Label>*/}
                        {/*</div>*/}
                    </RadioGroup>
                </div>
            </div>
            <div className="mx-auto max-w-xl">
                <div className="flex w-full flex-col items-center gap-6">
                    {!isLoading && !closeOrder.results?.length && (
                        <div className="text-center text-base font-medium">
                            تریدری پیدا نشد.
                        </div>
                    )}
                    {isLoading &&
                        [1, 2, 3, 4, 5].map((item) => (
                            <div
                                className="flex w-full justify-between"
                                key={item}
                            >
                                <div className="flex items-center justify-center gap-2.5">
                                    <Skeleton className="inline_flex h-14 w-14 rounded-full" />
                                    <div className="flex flex-col items-start justify-center gap-1">
                                        <Skeleton className="flex-inlile h-6 w-24" />
                                        <Skeleton className="flex-inlile h-5 w-14" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <Skeleton className="flex-inline h-9 w-28" />
                                </div>
                            </div>
                        ))}
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        onValueChange={setSelectedOrder}
                    >
                        {closeOrder.results?.map((order) => (
                            <AccordionItem
                                key={order.opening_signal.id}
                                value={order}
                            >
                                <AccordionTrigger asChild>
                                    <div className="flex w-full cursor-pointer items-center justify-between gap-2.5 text-base [&[data-state=open]>div>svg]:rotate-180">
                                        <div className="flex items-center gap-2.5">
                                            <Publisher
                                                lang={lang}
                                                dict={dict}
                                                elements={{
                                                    powerOfAnalytics: false,
                                                }}
                                                publisher={
                                                    order.opening_signal.message
                                                        .publisher
                                                }
                                            />
                                            <FollowButton
                                                dict={dict}
                                                lang={lang}
                                                defaultValue={
                                                    order.opening_signal.message
                                                        .publisher
                                                        .bookmarked_by_user
                                                }
                                                id={
                                                    order.opening_signal.message
                                                        .publisher.id
                                                }
                                                type="publisher"
                                                name={
                                                    order.opening_signal.message
                                                        .publisher.name
                                                }
                                                typeId={ContentTypes.publisher}
                                                render={(isLoading, follow) => (
                                                    <Button
                                                        className={cn({
                                                            'animate-pulse':
                                                                isLoading,
                                                        })}
                                                        size="sm"
                                                        variant={
                                                            follow
                                                                ? 'outline'
                                                                : 'info'
                                                        }
                                                        rounded="pill"
                                                        disabled={isLoading}
                                                    >
                                                        {follow ? (
                                                            <>
                                                                <span className="block">
                                                                    {
                                                                        dict.followed
                                                                    }
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="18"
                                                                    height="19"
                                                                    fill="none"
                                                                    viewBox="0 0 18 19"
                                                                >
                                                                    <g filter="url(#filter0_b_2813_10345)">
                                                                        <path
                                                                            stroke="#fff"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="1.5"
                                                                            d="M7.164 12.238C3.839 12.238 1 12.74 1 14.754c0 2.012 2.821 2.534 6.164 2.534 3.325 0 6.164-.503 6.164-2.516s-2.821-2.534-6.164-2.534z"
                                                                        ></path>
                                                                    </g>
                                                                    <g filter="url(#filter1_b_2813_10345)">
                                                                        <path
                                                                            stroke="#fff"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="1.5"
                                                                            d="M7.164 9.366a3.937 3.937 0 003.95-3.95 3.936 3.936 0 00-3.95-3.952 3.937 3.937 0 00-3.951 3.951 3.937 3.937 0 003.95 3.95z"
                                                                        ></path>
                                                                    </g>
                                                                    <g filter="url(#filter2_b_2813_10345)">
                                                                        <path
                                                                            stroke="#fff"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="1.5"
                                                                            d="M15.23 6.584v3.468"
                                                                        ></path>
                                                                    </g>
                                                                    <g filter="url(#filter3_b_2813_10345)">
                                                                        <path
                                                                            stroke="#fff"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="1.5"
                                                                            d="M17 8.318h-3.537"
                                                                        ></path>
                                                                    </g>
                                                                    <defs>
                                                                        <filter
                                                                            id="filter0_b_2813_10345"
                                                                            width="34.881"
                                                                            height="27.602"
                                                                            x="-10.276"
                                                                            y="0.961"
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
                                                                                result="effect1_backgroundBlur_2813_10345"
                                                                            ></feComposite>
                                                                            <feBlend
                                                                                in="SourceGraphic"
                                                                                in2="effect1_backgroundBlur_2813_10345"
                                                                                result="shape"
                                                                            ></feBlend>
                                                                        </filter>
                                                                        <filter
                                                                            id="filter1_b_2813_10345"
                                                                            width="30.455"
                                                                            height="30.454"
                                                                            x="-8.063"
                                                                            y="-9.812"
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
                                                                                result="effect1_backgroundBlur_2813_10345"
                                                                            ></feComposite>
                                                                            <feBlend
                                                                                in="SourceGraphic"
                                                                                in2="effect1_backgroundBlur_2813_10345"
                                                                                result="shape"
                                                                            ></feBlend>
                                                                        </filter>
                                                                        <filter
                                                                            id="filter2_b_2813_10345"
                                                                            width="22.553"
                                                                            height="26.021"
                                                                            x="3.954"
                                                                            y="-4.692"
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
                                                                                result="effect1_backgroundBlur_2813_10345"
                                                                            ></feComposite>
                                                                            <feBlend
                                                                                in="SourceGraphic"
                                                                                in2="effect1_backgroundBlur_2813_10345"
                                                                                result="shape"
                                                                            ></feBlend>
                                                                        </filter>
                                                                        <filter
                                                                            id="filter3_b_2813_10345"
                                                                            width="26.09"
                                                                            height="22.553"
                                                                            x="2.187"
                                                                            y="-2.958"
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
                                                                                result="effect1_backgroundBlur_2813_10345"
                                                                            ></feComposite>
                                                                            <feBlend
                                                                                in="SourceGraphic"
                                                                                in2="effect1_backgroundBlur_2813_10345"
                                                                                result="shape"
                                                                            ></feBlend>
                                                                        </filter>
                                                                    </defs>
                                                                </svg>
                                                                <span className="hidden md:block">
                                                                    {
                                                                        dict.follow
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                    'text-3xl font-bold',
                                                    order.efficiency > 0
                                                        ? 'text-neutral-400'
                                                        : 'text-neutral-600'
                                                )}
                                                dir="ltr"
                                            >
                                                {(
                                                    order.efficiency * 100
                                                ).toFixed(2)}
                                                %
                                            </div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="19"
                                                fill="none"
                                                viewBox="0 0 18 19"
                                            >
                                                <g filter="url(#filter0_b_3581_10259)">
                                                    <path
                                                        stroke="#0C0E3C"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        d="M1 9.376a8 8 0 1016 0 8 8 0 00-16 0z"
                                                    ></path>
                                                </g>
                                                <g filter="url(#filter1_b_3581_10259)">
                                                    <path
                                                        stroke="#0C0E3C"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        d="M5.998 8.128L9 11.143l3.002-3.015"
                                                    ></path>
                                                </g>
                                                <defs>
                                                    <filter
                                                        id="filter0_b_3581_10259"
                                                        width="38.553"
                                                        height="38.553"
                                                        x="-10.276"
                                                        y="-9.9"
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
                                                            result="effect1_backgroundBlur_3581_10259"
                                                        ></feComposite>
                                                        <feBlend
                                                            in="SourceGraphic"
                                                            in2="effect1_backgroundBlur_3581_10259"
                                                            result="shape"
                                                        ></feBlend>
                                                    </filter>
                                                    <filter
                                                        id="filter1_b_3581_10259"
                                                        width="28.556"
                                                        height="25.568"
                                                        x="-5.278"
                                                        y="-3.148"
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
                                                            result="effect1_backgroundBlur_3581_10259"
                                                        ></feComposite>
                                                        <feBlend
                                                            in="SourceGraphic"
                                                            in2="effect1_backgroundBlur_3581_10259"
                                                            result="shape"
                                                        ></feBlend>
                                                    </filter>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="rounded-lg border border-neutral-100 bg-neutral-150 px-5 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-pink-600" />
                                        {componentFormat(
                                            dict.traderExitSymbol,
                                            { symbol: asset.symbol },
                                            <span className="mx-0 font-bold">
                                                {dict.exit}
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="mt-5 flex flex-col gap-1">
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
                                                        order.opening_signal
                                                            .message_date ||
                                                            order.opening_signal
                                                                .message.date
                                                    )}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-500">
                                                {dict.openTime}
                                            </span>
                                        </div>
                                        <div className="mt-5 flex flex-col gap-1">
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
                                        <div className="mt-5 flex flex-col gap-1">
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
                                        <div className="mt-5 flex flex-col gap-1">
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
                                    </div>
                                    <div className="-mx-5">
                                        {priceHistory && (
                                            <Sparkline
                                                market={market}
                                                lang={lang}
                                                name={dict.price}
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
                                                                    .message_date ||
                                                                    order
                                                                        .opening_signal
                                                                        .message
                                                                        .date
                                                            )
                                                                ? selectedOrder.opening_price
                                                                : areDatesEqual(
                                                                        item.date,
                                                                        order.closing_datetime
                                                                    )
                                                                  ? selectedOrder.closing_price
                                                                  : item.return_price,
                                                        date: dayjs(item.date)
                                                            .calendar(
                                                                lang === 'fa'
                                                                    ? 'jalali'
                                                                    : 'gregory'
                                                            )
                                                            .locale(lang)
                                                            .format(
                                                                'YYYY/MM/DD'
                                                            ),
                                                        greenPoint:
                                                            areDatesEqual(
                                                                item.date,
                                                                order
                                                                    .opening_signal
                                                                    .message_date ||
                                                                    order
                                                                        .opening_signal
                                                                        .message
                                                                        .date
                                                            ),
                                                        redPoint: areDatesEqual(
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
                </div>
                <Pagination className="mt-8">
                    <PaginationContent>
                        {closeOrder.next && (
                            <PaginationItem>
                                <PaginationPrevious
                                    text="بازدهی کمتر"
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
                                    text="بازدهی بیشتر"
                                    onClick={() => {
                                        setPage(page - 1);
                                    }}
                                    isActive
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}
