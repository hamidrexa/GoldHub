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
    getLinksLang,
    roundNumber,
} from '@/libs/utils';
import React, { useState } from 'react';
import { ChevronDownCircle } from 'lucide-react';
import { FollowButton } from '@/components/follow-button';
import { ContentTypes } from '@/constants/content-types';
import Sparkline from '@/components/sparkline';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { usePriceHistory } from '@/app/[lang]/(user)/(asset)/services/usePriceHistory';
import { useOpenOrders } from '@/app/[lang]/(user)/publisher/services/useOpenOrders';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import Link from 'next/link';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);

export function OpenOrders({ dict, lang, publisher, id, market }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [page, setPage] = useState(1);
    const { past: from_date } = getDateFromDate(
        30,
        selectedOrder?.order_info?.message_date
    );
    const { openOrders, isLoading } = useOpenOrders(id, {
        page,
    });
    const { priceHistory, isLoading: historyLoading } = usePriceHistory(
        selectedOrder?.asset_info?.asset_id,
        {
            from_date,
            to_date: dayjs().format('YYYY-MM-DD'),
        },
        selectedOrder
    );

    return (
        <>
            <div className="mx-auto flex max-w-xl flex-col gap-6">
                <div className="flex w-full flex-col items-center gap-6">
                    {isLoading ? (
                        [1, 2, 3, 4, 5].map((item) => (
                            <div
                                className="my-3 flex w-full justify-between"
                                key={item}
                            >
                                <div className="flex gap-10 md:gap-16">
                                    <Skeleton className="h-9 w-32" />
                                    <Skeleton className="h-9 w-20" />
                                </div>
                                <Skeleton className="h-9 w-24" />
                            </div>
                        ))
                    ) : (
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                            onValueChange={setSelectedOrder}
                        >
                            {openOrders.results?.map((order, index) => (
                                <AccordionItem
                                    value={order}
                                    key={order.order_info.id}
                                >
                                    <AccordionTrigger asChild>
                                        <div className="flex w-full cursor-pointer items-center justify-between gap-2.5 text-base [&[data-state=open]>div>div>svg]:rotate-180">
                                            <div className="flex items-center gap-16">
                                                <div className="flex items-center gap-2.5">
                                                    <ChevronDownCircle
                                                        width={24}
                                                        height={24}
                                                        strokeWidth={1.5}
                                                        color="#0C0E3C"
                                                    />
                                                    <span className="text-3xl font-bold">
                                                        {order.asset_info
                                                            .symbol_fa ||
                                                            order.asset_info
                                                                .symbol}
                                                    </span>
                                                </div>
                                                <div>
                                                    {convertDateToHumanTime(
                                                        dict,
                                                        lang,
                                                        order.order_info
                                                            .message_date
                                                    )}
                                                </div>
                                            </div>
                                            <FollowButton
                                                dict={dict}
                                                lang={lang}
                                                defaultValue={
                                                    order.asset_info
                                                        .is_bookmarked_by_user
                                                }
                                                id={order.asset_info.asset_id}
                                                type="asset"
                                                typeId={ContentTypes.asset}
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
                                                    >
                                                        {follow ? (
                                                            <>
                                                                <Icons.paperNegative />
                                                                {dict.followed}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Icons.paperPlus />
                                                                {dict.follow}
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            />
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="rounded-lg border border-neutral-100 bg-neutral-150 px-5 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-300" />
                                            <div className="text-sm font-bold text-neutral-800">
                                                {dict.presentProfit}:
                                                <span
                                                    className={cn(
                                                        'mx-1 text-3xl',
                                                        order.order_info
                                                            .efficiency > 0
                                                            ? 'text-teal-400'
                                                            : 'text-pink-600'
                                                    )}
                                                    dir="ltr"
                                                >
                                                    {roundNumber(
                                                        order.order_info
                                                            .efficiency * 100
                                                    )}
                                                    %
                                                </span>
                                            </div>
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
                                                            order.order_info
                                                                .message_date
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
                                                            order.order_info
                                                                .opening_price,
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
                                                        width="20"
                                                        height="21"
                                                        fill="none"
                                                        viewBox="0 0 20 21"
                                                    >
                                                        <path
                                                            stroke="#0C0E3C"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.5"
                                                            d="M18.333 6.006l-7.084 7.083-4.166-4.166-5.417 5.416"
                                                        ></path>
                                                        <path
                                                            stroke="#0C0E3C"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.5"
                                                            d="M13.334 6.006h5v5"
                                                        ></path>
                                                    </svg>
                                                    <span
                                                        className="text-sm font-bold"
                                                        dir="ltr"
                                                    >
                                                        {order.order_info
                                                            .profit_target_price
                                                            ? currency(
                                                                  order
                                                                      .order_info
                                                                      .profit_target_price,
                                                                  market,
                                                                  lang
                                                              )
                                                            : dict.nonAnnounce}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {dict.profitLimit}
                                                </span>
                                            </div>
                                            <div className="mt-5 flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="21"
                                                        height="21"
                                                        fill="none"
                                                        viewBox="0 0 21 21"
                                                    >
                                                        <path
                                                            stroke="#0C0E3C"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.5"
                                                            d="M18.833 14.34l-7.084-7.084-4.166 4.167-5.417-5.417"
                                                        ></path>
                                                        <path
                                                            stroke="#0C0E3C"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.5"
                                                            d="M13.834 14.34h5v-5"
                                                        ></path>
                                                    </svg>
                                                    <span
                                                        className="text-sm font-bold"
                                                        dir="ltr"
                                                    >
                                                        {order.order_info
                                                            .stop_loss_price
                                                            ? currency(
                                                                  order
                                                                      .order_info
                                                                      .stop_loss_price,
                                                                  market,
                                                                  lang
                                                              )
                                                            : dict.nonAnnounce}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {dict.damageLimit}
                                                </span>
                                            </div>
                                            <div className="mt-5 flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="21"
                                                        fill="none"
                                                        viewBox="0 0 20 21"
                                                    >
                                                        <path
                                                            stroke="#0C0E3C"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.5"
                                                            d="M8.334 1.84h3.333M10 11.84l2.5-2.5M10 18.506a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333z"
                                                        ></path>
                                                    </svg>
                                                    <span className="text-sm font-bold">
                                                        {convertDateToHumanTime(
                                                            dict,
                                                            lang,
                                                            order.order_info
                                                                .timeout
                                                        )}{' '}
                                                        {dict.remain}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {dict.timeout}
                                                </span>
                                            </div>
                                            <Link
                                                className="mt-5 flex flex-col gap-1"
                                                target="_blank"
                                                href={`${getLinksLang(lang)}/message/${order.order_info.id}`}
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
                                        <div className="-mx-5 mt-4">
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
                                                                        .order_info
                                                                        .message_date
                                                                )
                                                                    ? selectedOrder
                                                                          .order_info
                                                                          .opening_price
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
                                                                .locale(lang)
                                                                .format(
                                                                    'YYYY/MM/DD'
                                                                ),
                                                            greenPoint:
                                                                areDatesEqual(
                                                                    item.date,
                                                                    order
                                                                        .order_info
                                                                        .message_date
                                                                ),
                                                            redPoint:
                                                                areDatesEqual(
                                                                    item.date,
                                                                    order
                                                                        .order_info
                                                                        .timeout
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
                <Pagination>
                    <PaginationContent>
                        {openOrders.next && (
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
                        {openOrders.previous && (
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
            </div>
        </>
    );
}
