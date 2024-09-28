'use client';

import React, { Fragment, useRef, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useGlobalContext } from '@/contexts/store';
import Link from 'next/link';
import {
    cn,
    convertDateToHumanTime,
    currency,
    getDirection,
    getImage,
    getLinksLang,
} from '@/libs/utils';
import { Locale } from '@/i18n-config';
import stringFormatter from '@/libs/stringFormatter';
import Image from 'next/image';
import { UserSentiment } from '@/components/user-sentiment';
import { useSignalsCount } from '@/app/[lang]/(user)/(asset)/services/useSignalsCount';
import { useLastSignalDateTime } from '@/app/[lang]/(user)/(asset)/services/useLastSignalDateTime';
import { useMessages } from '@/app/[lang]/(user)/(asset)/services/useMessages';
import { SignalValues } from '@/app/[lang]/(user)/(asset)/types/Messages';
import { Empty } from '@/components/empty';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { ChevronsUp, LockIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Message } from '@/components/message';
import { PricingModal } from '@/app/[lang]/(user)/leaderboard/components/pricing-modal';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';

type MessagesWrapParams = {
    pureMessages?: any;
    closeOrders?: any;
    assetStopLossProfitTarget?: any;
    id?: string;
    market: string;
    symbol?: string;
    showSymbol?: boolean;
    dict: any;
    lang: Locale;
    filtersBox?: boolean;
    follow?: boolean;
    assets?: any;
    publishers?: any;
    signalValues?: boolean;
    showLockSection?: boolean;
    showUpdateTime?: boolean;
    showTopTradersFilter?: boolean;
    userBookmarked?: boolean;
};

export function MessagesWrap({
    pureMessages,
    closeOrders,
    assetStopLossProfitTarget,
    id,
    market,
    symbol,
    dict,
    lang,
    filtersBox = true,
    follow = true,
    signalValues = true,
    showSymbol = true,
    assets,
    publishers,
    showLockSection = false,
    showUpdateTime = true,
    showTopTradersFilter,
    userBookmarked,
}: MessagesWrapParams) {
    const router = useRouter();
    const containerRef = useRef(null);
    const path = usePathname();
    const { user, isReadingMode } = useGlobalContext();
    const [value, setValue] = useState('B,S,N' as SignalValues);
    const [messageType, setMessageType] = useState(undefined);
    const [traderType, setTraderType] = useState(undefined);
    const { signalsCount } = useSignalsCount(id, market === 'tse');
    const { lastSignalDateTime } = useLastSignalDateTime(market === 'tse');
    const [filterDialog, setFilterDialog] = useState(false);
    const [showNewMessages, setNewMessages] = useState(false);
    const { messages, isLoading, size, setSize, isReachingEnd } = useMessages(
        {
            ...(assets ? { assets } : {}),
            ...(publishers ? { publishers } : {}),
            ...(messageType ? { publishers: [messageType] } : {}),
            ...(signalValues && !messageType
                ? { assetsignal__values: value }
                : {}),
            ...(traderType ? { publisher__top: true } : {}),
            ...(userBookmarked ? { publisher__is_bookmarked: true } : {}),
            order_by: 'latest',
            page_size: 10,
        },
        lang
    );
    const [dialogContent, setDialogContent] = useState(
        {} as {
            title?: string | React.ReactNode;
            description?: string | React.ReactNode;
        }
    );
    const [openPricingModal, setOpenPricingModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const hasFilter = traderType || value !== 'B,S,N' || messageType;
    const displayMessages =
        hasFilter || userBookmarked || showNewMessages || size !== 1
            ? messages
            : pureMessages?.results;

    const onShowMoreClick = () => {
        if (!user) {
            setDialogContent({
                title: (
                    <>
                        برای نمایش بیشتر پیام ها
                        <br />
                        ثبت نام کنید.
                    </>
                ),
                description:
                    'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
            });
            return setOpenLoginModal(true);
        }
        if (!user.active_plan?.is_active) {
            setDialogContent({
                title: (
                    <>
                        برای نمایش بیشتر پیام ها
                        <br />
                        طرح خود را ارتقا دهید.
                    </>
                ),
            });
            return setOpenPricingModal(true);
        }

        setNewMessages(true);
        setSize(size + 1);
    };
    const onNewMessagesClick = () => {
        setNewMessages(true);
        scrollToTop();
    };
    const scrollToTop = () => {
        setTimeout(() => {
            containerRef.current?.scrollIntoView(true);
        }, 0);
    };

    if (!user && showLockSection && !isLoading)
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-6">
                <LockIcon stroke="#0C0E3C" strokeWidth={2} />
                <h1 className="text-base font-medium">{dict.loginPrompt}</h1>
                <Link
                    href={`${getLinksLang(lang)}/user/login?url=${path}`}
                    className="rounded-lg bg-neutral-800 px-5 py-2.5 text-white"
                >
                    {dict.loginRegister}
                </Link>
            </div>
        );

    return (
        <div
            className="flex w-full flex-col gap-5 md:flex-row md:items-start"
            ref={containerRef}
        >
            {filtersBox && (
                <div className="flex w-full flex-col justify-between md:sticky md:top-52 md:w-80 md:min-w-[20rem]">
                    {market === 'tse' && showUpdateTime && (
                        <div className="mb-4 flex w-full items-center gap-2.5">
                            <div className="relative flex items-center justify-center">
                                <div className="h-5 w-5 animate-ping rounded-full bg-neutral-300/40"></div>
                                <div className="absolute h-2.5 w-2.5 rounded-full bg-neutral-300" />
                            </div>
                            <div className="text-neutral-200">
                                <div className="mb-1 flex items-center gap-2.5">
                                    {dict.lastUpdate}:
                                    {lastSignalDateTime ? (
                                        <span className="font-medium">
                                            {convertDateToHumanTime(
                                                dict,
                                                lang,
                                                lastSignalDateTime.signal[0]
                                                    .message_date
                                            )}
                                        </span>
                                    ) : (
                                        <span
                                            className="inline-flex h-5 animate-pulse rounded-sm bg-gray-200"
                                            style={{ width: '71px' }}
                                        />
                                    )}
                                </div>
                                <div className="flex items-center gap-2.5">
                                    {stringFormatter(dict.todaySignalCount, {
                                        symbol,
                                    })}
                                    :
                                    {signalsCount ? (
                                        <span className="font-medium">
                                            {
                                                signalsCount.signal_aggregate
                                                    .aggregate.count
                                            }{' '}
                                            {dict.message}
                                        </span>
                                    ) : (
                                        <span
                                            className="inline-flex h-5 animate-pulse rounded-sm bg-gray-200"
                                            style={{ width: '71px' }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex w-full items-center md:flex-col">
                        <div className="mb-4 flex w-full flex-col md:rounded-lg md:border md:border-neutral-100 md:bg-white md:p-5">
                            <h3 className="mb-6 flex w-full items-center gap-4 text-base font-black">
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
                                        d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
                                    ></path>
                                </svg>
                                {dict.filter}
                            </h3>
                            <h4 className="mb-2 font-bold">
                                {dict.signalType}
                            </h4>
                            <div
                                className="mb-5 flex w-full items-center justify-center"
                                onClick={() => {
                                    if (!user) {
                                        setDialogContent({
                                            title: (
                                                <>
                                                    برای اعمال فیلتر خرید و فروش
                                                    پیام‌ها
                                                    <br />
                                                    ثبت نام کنید.
                                                </>
                                            ),
                                            description:
                                                'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
                                        });
                                        return setOpenLoginModal(true);
                                    }
                                    if (!user.active_plan?.is_active) {
                                        setDialogContent({
                                            title: (
                                                <>
                                                    برای اعمال فیلتر خرید و فروش
                                                    پیام‌ها
                                                    <br />
                                                    طرح خود را ارتقا دهید.
                                                </>
                                            ),
                                        });
                                        return setOpenPricingModal(true);
                                    }
                                }}
                            >
                                <RadioGroup
                                    disabled={
                                        !user || !user?.active_plan?.is_active
                                    }
                                    defaultValue={value}
                                    dir={getDirection(lang)}
                                    className="flex items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                                    onValueChange={(value: SignalValues) => {
                                        setSize(1);
                                        setValue(value);
                                        setFilterDialog(false);
                                        scrollToTop();
                                    }}
                                >
                                    <div>
                                        <RadioGroupItem
                                            value="B,S,N"
                                            id="messages-wrap-all"
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor="messages-wrap-all"
                                            className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                        >
                                            {dict.all}
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem
                                            value="B"
                                            id="messages-wrap-buy"
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor="messages-wrap-buy"
                                            className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                        >
                                            {dict.buy}
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem
                                            value="S"
                                            id="messages-wrap-sell"
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor="messages-wrap-sell"
                                            className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                        >
                                            {dict.sell}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            {showTopTradersFilter && (
                                <>
                                    <h4 className="mb-2 font-bold">
                                        {dict.traderType}
                                    </h4>
                                    <div
                                        className="mb-5 flex w-full items-center justify-center"
                                        onClick={() => {
                                            if (!user) {
                                                setDialogContent({
                                                    title: (
                                                        <>
                                                            برای فیلتر کردن
                                                            تحلیل‌های 100 تریدر
                                                            برتر
                                                            <br />
                                                            ثبت نام کنید.
                                                        </>
                                                    ),
                                                    description:
                                                        'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
                                                });
                                                return setOpenLoginModal(true);
                                            }
                                            if (!user.active_plan?.is_active) {
                                                setDialogContent({
                                                    title: (
                                                        <>
                                                            برای فیلتر کردن
                                                            تحلیل‌های 100 تریدر
                                                            برتر
                                                            <br />
                                                            طرح خود را ارتقا
                                                            دهید.
                                                        </>
                                                    ),
                                                });
                                                return setOpenPricingModal(
                                                    true
                                                );
                                            }
                                        }}
                                    >
                                        <RadioGroup
                                            disabled={
                                                !user ||
                                                !user?.active_plan?.is_active
                                            }
                                            defaultValue={traderType}
                                            dir={getDirection(lang)}
                                            className="flex items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                                            onValueChange={(value: string) => {
                                                setSize(1);
                                                setTraderType(value);
                                                setFilterDialog(false);
                                                scrollToTop();
                                            }}
                                        >
                                            <div>
                                                <RadioGroupItem
                                                    value={undefined}
                                                    id="messages-wrap-top-all"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-wrap-top-all"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    {dict.all}
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="top"
                                                    id="messages-wrap-top-100"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-wrap-top-100"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    {dict.topOneHundred}
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </>
                            )}
                            {market === 'tse' &&
                                !publishers &&
                                !userBookmarked && (
                                    <>
                                        <h4 className="mb-2 font-bold">
                                            نوع پیام
                                        </h4>
                                        <div className="mb-5 flex w-full items-center justify-center whitespace-nowrap">
                                            <RadioGroup
                                                defaultValue={messageType}
                                                dir={getDirection(lang)}
                                                className="flex items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                                                onValueChange={(
                                                    messageType
                                                ) => {
                                                    setSize(1);
                                                    setMessageType(messageType);
                                                    setFilterDialog(false);
                                                    scrollToTop();
                                                }}
                                            >
                                                <div>
                                                    <RadioGroupItem
                                                        value={undefined}
                                                        id="messages-wrap-all-p"
                                                        className="peer sr-only"
                                                    />
                                                    <Label
                                                        htmlFor="messages-wrap-all-p"
                                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                    >
                                                        {dict.all}
                                                    </Label>
                                                </div>
                                                <div>
                                                    <RadioGroupItem
                                                        value="20092"
                                                        id="messages-wrap-capital-increase"
                                                        className="peer sr-only"
                                                    />
                                                    <Label
                                                        htmlFor="messages-wrap-capital-increase"
                                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                    >
                                                        افزایش سرمایه
                                                    </Label>
                                                </div>
                                                <div>
                                                    <RadioGroupItem
                                                        value="20079"
                                                        id="messages-wrap-fundamental"
                                                        className="peer sr-only"
                                                    />
                                                    <Label
                                                        htmlFor="messages-wrap-fundamental"
                                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                    >
                                                        اطلاعات بنیادی
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </>
                                )}
                        </div>
                        {/*<Dialog*/}
                        {/*    open={filterDialog}*/}
                        {/*    onOpenChange={setFilterDialog}*/}
                        {/*>*/}
                        {/*    <DialogContent className="w-full max-w-[425px]">*/}
                        {/*        <DialogHeader>*/}
                        {/*            <DialogTitle className="text-xl font-black">*/}
                        {/*                {dict.filter}*/}
                        {/*            </DialogTitle>*/}
                        {/*        </DialogHeader>*/}
                        {/*        <h4 className="mb-2 mt-5 font-bold">*/}
                        {/*            {dict.signalType}*/}
                        {/*        </h4>*/}
                        {/*        <div*/}
                        {/*            className="flex w-full items-center justify-center"*/}
                        {/*            onClick={() => {*/}
                        {/*                if (!user) {*/}
                        {/*                    setDialogContent({*/}
                        {/*                        title: (*/}
                        {/*                            <>*/}
                        {/*                                برای اعمال فیلتر خرید و*/}
                        {/*                                فروش پیام‌ها*/}
                        {/*                                <br />*/}
                        {/*                                ثبت نام کنید.*/}
                        {/*                            </>*/}
                        {/*                        ),*/}
                        {/*                        description:*/}
                        {/*                            'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',*/}
                        {/*                    });*/}
                        {/*                    return setOpenLoginModal(true);*/}
                        {/*                }*/}
                        {/*                if (!user.active_plan?.is_active) {*/}
                        {/*                    setDialogContent({*/}
                        {/*                        title: (*/}
                        {/*                            <>*/}
                        {/*                                برای اعمال فیلتر خرید و*/}
                        {/*                                فروش پیام‌ها*/}
                        {/*                                <br />*/}
                        {/*                                طرح خود را ارتقا دهید.*/}
                        {/*                            </>*/}
                        {/*                        ),*/}
                        {/*                    });*/}
                        {/*                    return setOpenPricingModal(true);*/}
                        {/*                }*/}
                        {/*            }}*/}
                        {/*        >*/}
                        {/*            <RadioGroup*/}
                        {/*                disabled={*/}
                        {/*                    !user ||*/}
                        {/*                    !user?.active_plan?.is_active*/}
                        {/*                }*/}
                        {/*                defaultValue={value}*/}
                        {/*                dir={getDirection(lang)}*/}
                        {/*                className="flex items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"*/}
                        {/*                onValueChange={(*/}
                        {/*                    value: SignalValues*/}
                        {/*                ) => {*/}
                        {/*                    setSize(1);*/}
                        {/*                    setValue(value);*/}
                        {/*                    setFilterDialog(false);*/}
                        {/*                    scrollToTop();*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="B,S,N"*/}
                        {/*                        id="messages-wrap-mobile-all"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-wrap-mobile-all"*/}
                        {/*                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        {dict.all}*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="B"*/}
                        {/*                        id="messages-wrap-mobile-buy"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-wrap-mobile-buy"*/}
                        {/*                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        {dict.buy}*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="S"*/}
                        {/*                        id="messages-wrap-mobile-sell"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-wrap-mobile-sell"*/}
                        {/*                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        {dict.sell}*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*            </RadioGroup>*/}
                        {/*        </div>*/}
                        {/*        {showTopTradersFilter && (*/}
                        {/*            <>*/}
                        {/*                <h4 className="mb-2 font-bold">*/}
                        {/*                    {dict.traderType}*/}
                        {/*                </h4>*/}
                        {/*                <div*/}
                        {/*                    className="flex w-full items-center justify-center"*/}
                        {/*                    onClick={() => {*/}
                        {/*                        if (!user) {*/}
                        {/*                            setDialogContent({*/}
                        {/*                                title: (*/}
                        {/*                                    <>*/}
                        {/*                                        برای فیلتر کردن*/}
                        {/*                                        تحلیل‌های 100*/}
                        {/*                                        تریدر برتر*/}
                        {/*                                        <br />*/}
                        {/*                                        ثبت نام کنید.*/}
                        {/*                                    </>*/}
                        {/*                                ),*/}
                        {/*                                description:*/}
                        {/*                                    'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',*/}
                        {/*                            });*/}
                        {/*                            return setOpenLoginModal(*/}
                        {/*                                true*/}
                        {/*                            );*/}
                        {/*                        }*/}
                        {/*                        if (*/}
                        {/*                            !user.active_plan?.is_active*/}
                        {/*                        ) {*/}
                        {/*                            setDialogContent({*/}
                        {/*                                title: (*/}
                        {/*                                    <>*/}
                        {/*                                        برای فیلتر کردن*/}
                        {/*                                        تحلیل‌های 100*/}
                        {/*                                        تریدر برتر*/}
                        {/*                                        <br />*/}
                        {/*                                        طرح خود را ارتقا*/}
                        {/*                                        دهید.*/}
                        {/*                                    </>*/}
                        {/*                                ),*/}
                        {/*                            });*/}
                        {/*                            return setOpenPricingModal(*/}
                        {/*                                true*/}
                        {/*                            );*/}
                        {/*                        }*/}
                        {/*                    }}*/}
                        {/*                >*/}
                        {/*                    <RadioGroup*/}
                        {/*                        disabled={*/}
                        {/*                            !user ||*/}
                        {/*                            !user?.active_plan*/}
                        {/*                                ?.is_active*/}
                        {/*                        }*/}
                        {/*                        defaultValue={traderType}*/}
                        {/*                        dir={getDirection(lang)}*/}
                        {/*                        className="flex items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"*/}
                        {/*                        onValueChange={(*/}
                        {/*                            value: string*/}
                        {/*                        ) => {*/}
                        {/*                            setSize(1);*/}
                        {/*                            setTraderType(value);*/}
                        {/*                            setFilterDialog(false);*/}
                        {/*                            scrollToTop();*/}
                        {/*                        }}*/}
                        {/*                    >*/}
                        {/*                        <div>*/}
                        {/*                            <RadioGroupItem*/}
                        {/*                                value={undefined}*/}
                        {/*                                id="messages-wrap-mobile-top-all"*/}
                        {/*                                className="peer sr-only"*/}
                        {/*                            />*/}
                        {/*                            <Label*/}
                        {/*                                htmlFor="messages-wrap-mobile-top-all"*/}
                        {/*                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                            >*/}
                        {/*                                {dict.all}*/}
                        {/*                            </Label>*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            <RadioGroupItem*/}
                        {/*                                value="top"*/}
                        {/*                                id="messages-wrap-mobile-top-100"*/}
                        {/*                                className="peer sr-only"*/}
                        {/*                            />*/}
                        {/*                            <Label*/}
                        {/*                                htmlFor="messages-wrap-mobile-top-100"*/}
                        {/*                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                            >*/}
                        {/*                                {dict.topOneHundred}*/}
                        {/*                            </Label>*/}
                        {/*                        </div>*/}
                        {/*                    </RadioGroup>*/}
                        {/*                </div>*/}
                        {/*            </>*/}
                        {/*        )}*/}
                        {/*    </DialogContent>*/}
                        {/*</Dialog>*/}
                    </div>
                </div>
            )}
            <div className="w-full">
                {!isLoading &&
                    messages?.[0]?.id !== pureMessages?.results[0]?.id &&
                    !showNewMessages &&
                    !hasFilter &&
                    !userBookmarked && (
                        <div
                            className={cn(
                                'sticky z-50 mb-4 flex justify-center md:top-52',
                                isReadingMode ? 'top-10' : 'top-44'
                            )}
                        >
                            <Button
                                className="py-6 shadow-xl"
                                rounded="pill"
                                onClick={onNewMessagesClick}
                            >
                                {/*<div className="flex items-center">*/}
                                {/*    <Image*/}
                                {/*        className="h-6 w-6 rounded-full object-cover"*/}
                                {/*        width={24}*/}
                                {/*        height={24}*/}
                                {/*        src="https://s3.tradingview.com/userpics/8497512-pUZF_big.png"*/}
                                {/*        alt="publisher"*/}
                                {/*    />*/}
                                {/*    <Image*/}
                                {/*        className="-mx-2.5 h-6 w-6 rounded-full object-cover"*/}
                                {/*        width={24}*/}
                                {/*        height={24}*/}
                                {/*        src="https://s3.tradingview.com/userpics/26798139-6jdY_big.png"*/}
                                {/*        alt="publisher"*/}
                                {/*    />*/}
                                {/*    <Image*/}
                                {/*        className="h-6 w-6 rounded-full object-cover"*/}
                                {/*        width={24}*/}
                                {/*        height={24}*/}
                                {/*        src="https://s3.tradingview.com/userpics/12333776-Naco_big.png"*/}
                                {/*        alt="publisher"*/}
                                {/*    />*/}
                                {/*</div>*/}
                                پیام جدید
                                <ChevronsUp strokeWidth={1.5} />
                            </Button>
                        </div>
                    )}
                {!displayMessages?.length && !isLoading && (
                    <Empty>{dict.noMessageFound}</Empty>
                )}
                {isLoading && (hasFilter || userBookmarked) && (
                    <div className="mb-5 grid grid-cols-1 gap-5">
                        {[1, 2, 3, 4, 5].map((item, index) => (
                            <div
                                key={index}
                                className="h-96 w-full animate-pulse rounded-lg bg-gray-200"
                            />
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-1 gap-5">
                    {displayMessages?.map((message: any, index: number) => (
                        <Fragment
                            key={`${message.id}-${index}-${message.publisher.id}`}
                        >
                            <Message
                                publisher={
                                    message.message?.publisher ||
                                    message.publisher
                                }
                                message={message.message || message}
                                signal={
                                    symbol
                                        ? message.assets_signals.find(
                                              (signal) =>
                                                  signal.asset.symbol === symbol
                                          )
                                        : message.assets_signals?.[0]
                                }
                                symbol={
                                    showSymbol
                                        ? symbol
                                            ? message.assets_signals.find(
                                                  (signal) =>
                                                      signal.asset.symbol ===
                                                      symbol
                                              )?.asset?.symbol
                                            : message.assets_signals?.[0]?.asset
                                                  ?.symbol
                                        : null
                                }
                                dict={dict}
                                lang={lang}
                                market={market}
                                follow={follow}
                            />
                            {symbol && index === 1 && (
                                <Link
                                    href={`${getLinksLang(lang)}/signals`}
                                    className="flex h-11 w-full items-center justify-center rounded-md bg-neutral-300 text-base font-bold text-neutral-800"
                                >
                                    {stringFormatter(
                                        dict.whatSymbolBetterThanSymbol,
                                        { symbol }
                                    )}
                                </Link>
                            )}
                            {closeOrders && index === 4 && market === 'tse' && (
                                <div className="rounded-lg bg-blue-400/10 p-5">
                                    <div>
                                        <h4 className="text-base font-black">
                                            {stringFormatter(
                                                dict.mostProfitfrom,
                                                { symbol }
                                            )}
                                        </h4>
                                        <h5 className="mt-2.5 text-sm">
                                            <span className="font-bold">
                                                {
                                                    closeOrders?.aggregate
                                                        ?.aggregate.count
                                                }{' '}
                                                {dict.trader}
                                            </span>{' '}
                                            {dict.last3Month}
                                            <span className="font-bold">
                                                {dict.profit}
                                            </span>{' '}
                                            {stringFormatter(
                                                dict.profitSymbol,
                                                { symbol }
                                            )}
                                        </h5>
                                    </div>
                                    <div className="mt-5 grid gap-5">
                                        {closeOrders?.orders
                                            ?.slice(0, 2)
                                            ?.map(({ efficiency, signal }) => (
                                                <div
                                                    className="flex w-full items-center justify-between gap-2.5 text-base"
                                                    key={signal.id}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-700 p-1">
                                                            <Image
                                                                className="h-full w-full rounded-full object-cover"
                                                                src={getImage({
                                                                    photo: signal
                                                                        .message
                                                                        .publisher
                                                                        .photo,
                                                                    account_type:
                                                                        signal
                                                                            .message
                                                                            .publisher
                                                                            .account_type,
                                                                })}
                                                                alt=""
                                                                width={48}
                                                                height={48}
                                                            />
                                                        </div>
                                                        <div className="flex items-start justify-start gap-1">
                                                            <div className="font-medium">
                                                                {
                                                                    signal
                                                                        .message
                                                                        .publisher
                                                                        .name
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <b className="leading-[12px]">
                                                                {
                                                                    signal
                                                                        .message
                                                                        .publisher
                                                                        .rank
                                                                }
                                                            </b>
                                                            <div className="text-xs leading-[10px] tracking-[-0.05em] text-neutral-200">
                                                                {
                                                                    dict.traderRank
                                                                }
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={
                                                                efficiency > 0
                                                                    ? 'text-neutral-400'
                                                                    : 'text-neutral-600'
                                                            }
                                                            dir="ltr"
                                                        >
                                                            {(
                                                                efficiency * 100
                                                            ).toFixed(2)}
                                                            %
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                            {assetStopLossProfitTarget &&
                                !!Object.keys(assetStopLossProfitTarget)
                                    .length &&
                                index === 9 &&
                                market === 'tse' &&
                                symbol && (
                                    <div className="rounded-lg bg-blue-400/10 p-5">
                                        <h4 className="text-center text-base font-black">
                                            {stringFormatter(
                                                dict.traderSymbolLimit,
                                                { symbol }
                                            )}
                                            {assetStopLossProfitTarget.length}
                                        </h4>
                                        <div className="mt-5 flex justify-center gap-5 md:gap-10">
                                            <div className="flex flex-col items-center gap-4 text-sm font-medium text-neutral-800">
                                                <div>
                                                    {Math.min(
                                                        ...assetStopLossProfitTarget.map(
                                                            (item) =>
                                                                item.profit_target_price
                                                        )
                                                    ) !== Infinity
                                                        ? currency(
                                                              Math.min(
                                                                  ...assetStopLossProfitTarget.map(
                                                                      (item) =>
                                                                          item.profit_target_price
                                                                  )
                                                              ),
                                                              market,
                                                              lang
                                                          )
                                                        : dict.nonAnnounce}
                                                </div>
                                                <div>
                                                    {dict.nearestProfitLimit}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-4 text-sm font-medium text-neutral-800">
                                                <div>
                                                    {Math.max(
                                                        ...assetStopLossProfitTarget.map(
                                                            (item) =>
                                                                item.stop_loss_price
                                                        )
                                                    ) !== -Infinity
                                                        ? currency(
                                                              Math.max(
                                                                  ...assetStopLossProfitTarget.map(
                                                                      (item) =>
                                                                          item.stop_loss_price
                                                                  )
                                                              ),
                                                              market,
                                                              lang
                                                          )
                                                        : dict.nonAnnounce}
                                                </div>
                                                <div>
                                                    {dict.nearestDamegeLimit}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5">
                                            <UserSentiment
                                                id={id}
                                                dict={dict}
                                                market={market}
                                                symbol={symbol}
                                            />
                                        </div>
                                    </div>
                                )}
                        </Fragment>
                    ))}
                </div>
                {!isReachingEnd && displayMessages?.length && (
                    <div className="mx-auto my-5 w-80">
                        <Button
                            className="w-full"
                            onClick={onShowMoreClick}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Spinner width={25} height={25} />
                            ) : (
                                dict.more
                            )}
                        </Button>
                    </div>
                )}
            </div>
            <PricingModal
                dict={dict}
                lang={lang}
                contents={{
                    title: dialogContent.title,
                }}
                open={openPricingModal}
                setOpen={setOpenPricingModal}
            />
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: dialogContent.title,
                    description: dialogContent.description,
                    button: 'فعال سازی 7 روز رایگان',
                    buttonVariant: 'info',
                    inputLabel: 'ثبت نام سریع',
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
        </div>
    );
}
