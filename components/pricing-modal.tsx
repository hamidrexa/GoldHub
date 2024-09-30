'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn, getLinksLang } from '@/libs/utils';
import { formatCurrency } from '@coingecko/cryptoformat';
import { toast } from 'sonner';
import { payment } from '@/app/[lang]/(user)/pricing/services/payment';
import { PaymentMethods } from '@/constants/payment-methods';
import { Icons } from '@/components/ui/icons';
import { usePlanList } from '@/app/[lang]/(user)/pricing/services/usePlanList';
import { Locale } from '@/i18n-config';

export function PricingModal({
    dict,
    lang,
    contents,
    open,
    setOpen,
    closeable = true,
}: {
    dict: any;
    lang: Locale;
    contents: {
        title: string | React.ReactNode;
    };
    open: any;
    setOpen?: any;
    closeable?: boolean;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { plans } = usePlanList(lang);
    const silverPlan = plans.find(({ id }) => id === 2) || {};
    const payMethod = 'irr';
    const displayPlan = {
        ...silverPlan,
        discounted_price:
            payMethod === 'irr'
                ? silverPlan.discounted_price / 10
                : silverPlan.discounted_price_usdt,
        discounted_price_final:
            payMethod === 'irr'
                ? (silverPlan.discounted_price / 10) * (silverPlan.days / 30)
                : silverPlan.discounted_price_usdt * (silverPlan.days / 30),
    };

    const onPaymentClick = async () => {
        setIsLoading(true);
        toast.info('در حال انتقال به پرداخت');
        try {
            const res = await payment({
                plan: displayPlan.id,
                bank_type: PaymentMethods[payMethod],
            });
            location.replace(
                `${process.env.NEXT_PUBLIC_API_URL_}/transaction/payment/${res.id}`
            );
        } catch (e) {
            toast.error(e?.error?.messages?.discount_code?.[0]);
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen || undefined}>
            <DialogContent
                closeable={closeable}
                className="w-full max-w-md gap-6 text-sm text-neutral-800"
            >
                <div className="text-center">
                    <h2 className="text-base font-bold">{contents.title}</h2>
                    <h3 className="mt-2 text-neutral-200">
                        {dict.planNeed.noPlan}
                    </h3>
                </div>
                <div className="space-y-1.5">
                    <div className="flex flex-col gap-4 rounded-md border border-gray-400 px-3 py-2">
                        <div className="flex items-center justify-between">
                            <div className="font-medium">
                                {displayPlan.name}
                            </div>
                            <div className="flex items-center gap-2">
                                {displayPlan.days / 30} {dict.monthly}
                                <Badge size="sm">
                                    {displayPlan.off}% {dict.discount.discount}
                                </Badge>
                            </div>
                        </div>
                        <div className="text-center text-xs">
                            <span className="text-base font-black leading-none">
                                {formatCurrency(
                                    displayPlan.discounted_price,
                                    payMethod === 'irr' ? 'ت' : 'USD',
                                    lang,
                                    false,
                                    {
                                        decimalPlaces:
                                            displayPlan.discounted_price >= 1
                                                ? 2
                                                : 15,
                                        significantFigures:
                                            displayPlan.discounted_price >= 1
                                                ? 10
                                                : 5,
                                    }
                                )}
                            </span>
                            /{dict.monthly}
                        </div>
                    </div>
                    <Link
                        href={`${getLinksLang(lang)}/pricing`}
                        className="flex items-center justify-end gap-2.5"
                    >
                        {dict.planNeed.seeMore}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="34"
                            height="10"
                            fill="none"
                            viewBox="0 0 34 10"
                        >
                            <g filter="url(#filter0_b_4224_11497)">
                                <path
                                    stroke="#0C0E3C"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M5 9L1 5l4-4"
                                ></path>
                            </g>
                            <g filter="url(#filter1_b_4224_11497)">
                                <path
                                    stroke="#0C0E3C"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M32.3 5H2"
                                ></path>
                            </g>
                            <defs>
                                <filter
                                    id="filter0_b_4224_11497"
                                    width="26.553"
                                    height="30.553"
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
                                        result="effect1_backgroundBlur_4224_11497"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_4224_11497"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                                <filter
                                    id="filter1_b_4224_11497"
                                    width="52.853"
                                    height="22.553"
                                    x="-9.276"
                                    y="-6.276"
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
                                        result="effect1_backgroundBlur_4224_11497"
                                    ></feComposite>
                                    <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_4224_11497"
                                        result="shape"
                                    ></feBlend>
                                </filter>
                            </defs>
                        </svg>
                    </Link>
                </div>
                <Button
                    className="w-full"
                    variant="info"
                    onClick={onPaymentClick}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Icons.spinner className="h-5 w-5 animate-spin" />
                    ) : (
                        'پرداخت'
                    )}
                </Button>
                <div>
                    <div className="mb-2.5 text-sm font-medium">
                        {dict.priceModal.otherAdvantage}:
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2.5 px-6">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.5 14.5C9.16304 14.5 9.79893 14.2366 10.2678 13.7678C10.7366 13.2989 11 12.663 11 12C11 10.62 10.5 10 10 9C8.928 6.857 9.776 4.946 12 3C12.5 5.5 14 7.9 16 9.5C18 11.1 19 13 19 15C19 15.9193 18.8189 16.8295 18.4672 17.6788C18.1154 18.5281 17.5998 19.2997 16.9497 19.9497C16.2997 20.5998 15.5281 21.1154 14.6788 21.4672C13.8295 21.8189 12.9193 22 12 22C11.0807 22 10.1705 21.8189 9.32122 21.4672C8.47194 21.1154 7.70026 20.5998 7.05025 19.9497C6.40024 19.2997 5.88463 18.5281 5.53284 17.6788C5.18106 16.8295 5 15.9193 5 15C5 13.847 5.433 12.706 6 12C6 12.663 6.26339 13.2989 6.73223 13.7678C7.20107 14.2366 7.83696 14.5 8.5 14.5Z"
                                    stroke="#484A6C"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {dict.priceModal.topAsset}
                        </div>
                        <div className="flex items-center gap-2.5 px-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="22"
                                fill="none"
                                viewBox="0 0 21 22"
                            >
                                <g filter="url(#filter0_b_4224_11526)">
                                    <path
                                        stroke="#200E32"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M19.998 8.365a8.311 8.311 0 00-7.964-6.975.714.714 0 00-.741.687v.064l.448 6.71c.03.451.418.794.87.768l6.728-.448a.714.714 0 00.659-.77v-.036z"
                                    ></path>
                                </g>
                                <g filter="url(#filter1_b_4224_11526)">
                                    <path
                                        stroke="#200E32"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M7.375 5.381a.915.915 0 011.044.522.824.824 0 01.082.302c.091 1.3.284 4.147.394 5.684a1.044 1.044 0 001.116.97l5.648-.347a.915.915 0 01.97.915 7.698 7.698 0 01-14.426 3.195 7.323 7.323 0 01-.915-2.801 4.724 4.724 0 01-.055-.916 7.707 7.707 0 016.133-7.524"
                                    ></path>
                                </g>
                                <defs>
                                    <filter
                                        id="filter0_b_4224_11526"
                                        width="31.26"
                                        height="30.783"
                                        x="0.017"
                                        y="-9.886"
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
                                            result="effect1_backgroundBlur_4224_11526"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_4224_11526"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter1_b_4224_11526"
                                        width="37.952"
                                        height="37.805"
                                        x="-10.046"
                                        y="-5.919"
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
                                            result="effect1_backgroundBlur_4224_11526"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_4224_11526"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                </defs>
                            </svg>
                            {dict.priceModal.portfolio}
                        </div>
                        <div className="flex items-center gap-2.5 px-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="22"
                                fill="none"
                                viewBox="0 0 19 22"
                            >
                                <g filter="url(#filter0_b_4224_11522)">
                                    <path
                                        stroke="#200E32"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M1 12.787v-.219a3.6 3.6 0 01.602-1.818 4.87 4.87 0 001.194-2.314c0-.667 0-1.343.058-2.009C3.154 3.218 6.327 1 9.46 1h.078c3.133 0 6.306 2.218 6.617 5.427.058.667 0 1.343.048 2.009a4.955 4.955 0 001.193 2.323c.365.538.573 1.164.602 1.81v.209c.022.87-.278 1.719-.844 2.39a4.505 4.505 0 01-2.853 1.37c-3.195.343-6.419.343-9.614 0a4.554 4.554 0 01-2.853-1.37 3.604 3.604 0 01-.834-2.38z"
                                    ></path>
                                </g>
                                <g filter="url(#filter1_b_4224_11522)">
                                    <path
                                        stroke="#200E32"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M7.055 19.852a3.088 3.088 0 004.288.505c.196-.146.372-.316.524-.505"
                                    ></path>
                                </g>
                                <defs>
                                    <filter
                                        id="filter0_b_4224_11522"
                                        width="39.553"
                                        height="38.348"
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
                                            result="effect1_backgroundBlur_4224_11522"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_4224_11522"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter1_b_4224_11522"
                                        width="27.365"
                                        height="23.701"
                                        x="-4.221"
                                        y="8.575"
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
                                            result="effect1_backgroundBlur_4224_11522"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_4224_11522"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                </defs>
                            </svg>
                            {dict.priceModal.lastAnalysis}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <Link
                        href={`${getLinksLang(lang)}/pricing`}
                        className={cn(
                            buttonVariants({ variant: 'link' }),
                            'underline'
                        )}
                    >
                        {dict.planNeed.seeMore}
                    </Link>
                    <Button
                        variant="info"
                        onClick={onPaymentClick}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Icons.spinner className="h-5 w-5 animate-spin" />
                        ) : (
                            'پرداخت'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
