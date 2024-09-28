'use client';

import * as React from 'react';
import { useState } from 'react';
import { componentFormat } from '@/libs/stringFormatter';
import { Gauge } from '@/components/gauge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn, getDirection } from '@/libs/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useScore } from '@/app/[lang]/(user)/(asset)/services/useScore';
import { useGlobalContext } from '@/contexts/store';
import { LockIcon } from 'lucide-react';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { PricingModal } from '@/app/[lang]/(user)/leaderboard/components/pricing-modal';
import { usePathname } from 'next/navigation';

export function Score({
    dict,
    lang,
    asset,
    id,
    market,
    serverScore,
    formulaId,
}) {
    const { user } = useGlobalContext();
    const [traderCategoryFilter, setTraderCategoryFilter] = useState(null);
    const [durationFilter, setDurationFilter] = useState('');
    const {
        score: clientScore,
        isLoading,
        error,
    } = useScore(
        asset.asset_id,
        {
            ...(durationFilter && { duration: durationFilter }),
            ...(traderCategoryFilter && {
                trader_category: traderCategoryFilter,
            }),
            ...(process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' && {
                formula_id: formulaId,
            }),
        },
        false,
        market
    );
    const score = clientScore || serverScore;
    const displayScore = Math.round(
        score ? score.cross_relative_score * 100 : null
    );
    const isInsufficientData = score
        ? score.buy_count + score.sell_count <= 1
        : false;
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openPricingModal, setOpenPricingModal] = useState(false);
    const path = usePathname();

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-5 md:flex-row">
                <div className="flex items-center justify-between gap-4 md:justify-start">
                    <div className="flex items-center gap-2.5 text-base font-bold md:text-3xl">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="none"
                            viewBox="0 0 28 28"
                        >
                            <path
                                stroke="url(#paint0_linear_2637_8128)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M14 17.5l4.083-4.084"
                            ></path>
                            <path
                                stroke="url(#paint1_linear_2637_8128)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M23.683 21c.467-1.167.817-2.567.817-3.967C24.5 11.433 19.833 7 14 7S3.5 11.433 3.5 17.033c0 1.4.35 2.8.817 3.967"
                            ></path>
                            <defs>
                                <linearGradient
                                    id="paint0_linear_2637_8128"
                                    x1="13"
                                    x2="20.5"
                                    y1="17.737"
                                    y2="16.237"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#217263"></stop>
                                    <stop offset="1" stopColor="#1F3D89"></stop>
                                </linearGradient>
                                <linearGradient
                                    id="paint1_linear_2637_8128"
                                    x1="5"
                                    x2="25"
                                    y1="20.237"
                                    y2="10.237"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#217263"></stop>
                                    <stop offset="1" stopColor="#1F3D89"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                        {dict.opinionSummary}
                    </div>
                    {/*<Select*/}
                    {/*    dir={getDirection(lang)}*/}
                    {/*    defaultValue={traderCategoryFilter}*/}
                    {/*    onValueChange={setTraderCategoryFilter}*/}
                    {/*>*/}
                    {/*    <SelectTrigger className="w-44">*/}
                    {/*        <SelectValue />*/}
                    {/*    </SelectTrigger>*/}
                    {/*    <SelectContent>*/}
                    {/*        <SelectItem value={null}>*/}
                    {/*            {dict.allTraders}*/}
                    {/*        </SelectItem>*/}
                    {/*        <SelectItem value="TopTraders">*/}
                    {/*            {dict.top100Traders}*/}
                    {/*        </SelectItem>*/}
                    {/*    </SelectContent>*/}
                    {/*</Select>*/}
                </div>
                <div className="hidden items-center justify-between gap-4 md:justify-start">
                    <span className="text-base font-bold md:text-3xl">
                        {dict.inRange}:
                    </span>
                    <RadioGroup
                        defaultValue={durationFilter}
                        dir={getDirection(lang)}
                        className="flex items-center gap-0"
                        onValueChange={setDurationFilter}
                    >
                        <div>
                            <RadioGroupItem
                                value=""
                                id="asset-score-all"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="asset-score-all"
                                className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100  [&:has([data-state=checked])]:bg-white"
                            >
                                {dict.all}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="short"
                                id="asset-score-1m"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="asset-score-1m"
                                className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100  [&:has([data-state=checked])]:bg-white"
                            >
                                {dict.shortTime}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="long"
                                id="asset-score-3m"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="asset-score-3m"
                                className="[&:has[&:has([data-state=checked])]:font-black flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100  [&:has([data-state=checked])]:bg-white"
                            >
                                {dict.longTime}
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className="mt-8 flex flex-col-reverse items-center justify-evenly gap-3 md:flex-row">
                <div className="flex flex-col items-center gap-2 md:gap-5">
                    <div className="hidden text-base text-neutral-800 md:block">
                        {!score ? (
                            <Skeleton className="h-8 w-64" />
                        ) : isInsufficientData ? (
                            `داده کافی برای تعیین وضعیت نماد ${asset.symbol} وجود ندارد.`
                        ) : (
                            componentFormat(
                                dict.assetRecommendation,
                                {
                                    assetSymbol: asset.symbol,
                                },
                                displayScore >= 30 ? (
                                    <>
                                        {dict.goodChange}
                                        {!user ||
                                        !user?.active_plan?.is_active ? (
                                            <button
                                                className="relative top-1 mx-2 inline-block"
                                                onClick={() => {
                                                    if (!user)
                                                        return setOpenLoginModal(
                                                            true
                                                        );
                                                    if (
                                                        !user.active_plan
                                                            ?.is_active
                                                    )
                                                        setOpenPricingModal(
                                                            true
                                                        );
                                                }}
                                            >
                                                <LockIcon
                                                    stroke="#0C0E3C"
                                                    strokeWidth={2}
                                                />
                                            </button>
                                        ) : (
                                            <span className="mx-0.5 inline-block text-3xl font-black text-teal-600">
                                                {dict.buy}
                                            </span>
                                        )}
                                    </>
                                ) : displayScore <= -30 ? (
                                    <>
                                        {dict.goodChange}
                                        {!user ||
                                        !user?.active_plan?.is_active ? (
                                            <button
                                                className="relative top-1 mx-2 inline-block"
                                                onClick={() => {
                                                    if (!user)
                                                        return setOpenLoginModal(
                                                            true
                                                        );
                                                    if (
                                                        !user.active_plan
                                                            ?.is_active
                                                    )
                                                        setOpenPricingModal(
                                                            true
                                                        );
                                                }}
                                            >
                                                <LockIcon
                                                    stroke="#0C0E3C"
                                                    strokeWidth={2}
                                                />
                                            </button>
                                        ) : (
                                            <span className="mx-0.5 inline-block text-3xl font-black text-pink-600">
                                                {dict.sell}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {dict.inStatus}
                                        {!user ||
                                        !user?.active_plan?.is_active ? (
                                            <button
                                                className="relative top-1 mx-2 inline-block"
                                                onClick={() => {
                                                    if (!user)
                                                        return setOpenLoginModal(
                                                            true
                                                        );
                                                    if (
                                                        !user.active_plan
                                                            ?.is_active
                                                    )
                                                        setOpenPricingModal(
                                                            true
                                                        );
                                                }}
                                            >
                                                <LockIcon
                                                    stroke="#0C0E3C"
                                                    strokeWidth={2}
                                                />
                                            </button>
                                        ) : (
                                            <span className="mx-0.5 inline-block text-3xl font-black text-neutral-200">
                                                {dict.neutral}
                                            </span>
                                        )}
                                    </>
                                )
                            )
                        )}
                    </div>
                    <div className="flex items-center gap-5">
                        {isLoading ? (
                            <Skeleton className="h-9 w-80" />
                        ) : (
                            <>
                                <div className="flex items-center gap-1.5 text-sm font-bold leading-none text-teal-400 md:text-base">
                                    {dict.buy}:{' '}
                                    <span className="text-sm md:text-3xl">
                                        {score.buy_count}
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <g>
                                            <g
                                                fillRule="evenodd"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                clipRule="evenodd"
                                            >
                                                <path
                                                    strokeWidth="2.5"
                                                    d="M11.985 15.346c-3.868 0-7.17.585-7.17 2.927s3.281 2.948 7.17 2.948c3.867 0 7.17-.586 7.17-2.927s-3.282-2.948-7.17-2.948z"
                                                ></path>
                                                <path
                                                    strokeWidth="2.5"
                                                    d="M11.985 12.006A4.596 4.596 0 107.389 7.41a4.58 4.58 0 004.563 4.596h.033z"
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                {/*<div className="flex items-center gap-1.5 text-sm font-bold leading-none text-neutral-200 md:text-base">*/}
                                {/*    <svg*/}
                                {/*        xmlns="http://www.w3.org/2000/svg"*/}
                                {/*        width="24"*/}
                                {/*        height="24"*/}
                                {/*        fill="none"*/}
                                {/*        viewBox="0 0 24 24"*/}
                                {/*    >*/}
                                {/*        <g>*/}
                                {/*            <g*/}
                                {/*                fillRule="evenodd"*/}
                                {/*                stroke="currentColor"*/}
                                {/*                strokeLinecap="round"*/}
                                {/*                strokeLinejoin="round"*/}
                                {/*                clipRule="evenodd"*/}
                                {/*            >*/}
                                {/*                <path*/}
                                {/*                    strokeWidth="2.5"*/}
                                {/*                    d="M11.985 15.346c-3.868 0-7.17.585-7.17 2.927s3.281 2.948 7.17 2.948c3.867 0 7.17-.586 7.17-2.927s-3.282-2.948-7.17-2.948z"*/}
                                {/*                ></path>*/}
                                {/*                <path*/}
                                {/*                    strokeWidth="2.5"*/}
                                {/*                    d="M11.985 12.006A4.596 4.596 0 107.389 7.41a4.58 4.58 0 004.563 4.596h.033z"*/}
                                {/*                ></path>*/}
                                {/*            </g>*/}
                                {/*        </g>*/}
                                {/*    </svg>*/}
                                {/*    {dict.neutral}:{' '}*/}
                                {/*    <span className="text-sm md:text-3xl">*/}
                                {/*        {score.neutral_count}*/}
                                {/*    </span>*/}
                                {/*</div>*/}
                                <div className="flex items-center gap-1.5 text-sm font-bold leading-none text-pink-600 md:text-base">
                                    {dict.sell}:{' '}
                                    <span className="text-sm md:text-3xl">
                                        {score.sell_count}
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <g>
                                            <g
                                                fillRule="evenodd"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                clipRule="evenodd"
                                            >
                                                <path
                                                    strokeWidth="2.5"
                                                    d="M11.985 15.346c-3.868 0-7.17.585-7.17 2.927s3.281 2.948 7.17 2.948c3.867 0 7.17-.586 7.17-2.927s-3.282-2.948-7.17-2.948z"
                                                ></path>
                                                <path
                                                    strokeWidth="2.5"
                                                    d="M11.985 12.006A4.596 4.596 0 107.389 7.41a4.58 4.58 0 004.563 4.596h.033z"
                                                ></path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="relative">
                    <div
                        className={cn({
                            'blur-[7px]':
                                !user || !user?.active_plan?.is_active,
                        })}
                    >
                        <Gauge
                            dict={dict}
                            percentage={
                                isInsufficientData ? null : displayScore
                            }
                            loading={!score}
                        />
                    </div>
                    {(!user || !user?.active_plan?.is_active) && (
                        <button
                            className="absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1.5"
                            onClick={() => {
                                if (!user) return setOpenLoginModal(true);
                                if (!user.active_plan?.is_active)
                                    setOpenPricingModal(true);
                            }}
                        >
                            <LockIcon stroke="#0C0E3C" strokeWidth={2} />
                            نیاز به اشتراک دارد
                        </button>
                    )}
                </div>
            </div>
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: (
                        <>
                            برای مشاهده جمع بندی نظر تریدرها در مورد{' '}
                            {asset.symbol} ثبت نام کنید.
                        </>
                    ),
                    description:
                        'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
                    button: dict.traderLoginModal.button,
                    buttonVariant: 'info',
                    inputLabel: dict.traderLoginModal.inputLabel,
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
            <PricingModal
                dict={dict}
                lang={lang}
                contents={{
                    title: (
                        <>
                            برای مشاهده جمع بندی نظر تریدرها در مورد{' '}
                            {asset.symbol} طرح خود را ارتقا دهید.
                        </>
                    ),
                }}
                open={openPricingModal}
                setOpen={setOpenPricingModal}
            />
        </>
    );
}
