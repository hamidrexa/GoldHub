'use client';

import React, { useState } from 'react';
import { useGlobalContext } from '@/contexts/store';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { Locale } from '@/i18n-config';
import { PricingModal } from '@/app/[lang]/(user)/leaderboard/components/pricing-modal';
import { LockIcon } from 'lucide-react';
import Link from 'next/link';
import { getLinksLang } from '@/libs/utils';

type suggestedAssetProps = {
    lang: Locale;
    dict: any;
    index: number;
    asset: any;
    buySignal?: boolean;
    textColor: string;
    assetType: string;
};

export default function SuggestedAsset({
    dict,
    lang,
    index,
    asset,
    buySignal,
    textColor,
    assetType,
}: suggestedAssetProps) {
    const { user, isUserLoading } = useGlobalContext();

    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [pricingModalOpen, setPricingModalOpen] = useState(false);

    const handleShowLock = (asset) => {
        if (isUserLoading) return true;

        const isPlanActive = user?.active_plan?.is_active;
        const isViewCountExceeded =
            asset.view_count > asset.view_count_capacity;

        if (isViewCountExceeded) {
            return !isPlanActive;
        } else {
            return !isPlanActive;
        }
    };
    return (
        <div
            className=" relative z-20 bg-white duration-200 hover:z-40 hover:cursor-pointer hover:shadow-[0_5px_20px_0_rgba(12,_14,_60,_.07)]"
            key={index}
        >
            <LoginModal
                setOpen={setLoginModalOpen}
                dict={dict}
                lang={lang}
                texts={{
                    title: 'برای استفاده از این قابلیت\n' + 'ثبت نام کنید.',
                    description:
                        'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
                }}
                open={loginModalOpen}
            />
            <PricingModal
                setOpen={setPricingModalOpen}
                dict={dict}
                lang={lang}
                contents={{
                    title: 'برای مشاهده این بخش نیاز به اشتراک دارید.',
                }}
                open={pricingModalOpen}
            />
            <div className="flex min-h-24 items-center justify-between px-8 py-6">
                <div className="flex items-center gap-1 md:gap-16">
                    <span className="text-base font-bold text-neutral-800">
                        {index + 1}
                    </span>
                    {handleShowLock(asset) ? (
                        <div
                            onClick={() => {
                                if (!user) setLoginModalOpen(true);
                                if (!!user && !user.active_plan?.is_active)
                                    setPricingModalOpen(true);
                            }}
                            className="flex w-36 flex-col items-center justify-center gap-2  hover:cursor-pointer"
                        >
                            <div
                                className="absolute text-base font-normal blur-sm"
                                style={{ color: textColor }}
                            >
                                کاربر ویژه
                            </div>
                            <LockIcon />
                            {!!buySignal && (
                                <div className="text-xs font-light">
                                    ظرفیت سیگنال تمام شد
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href={
                                assetType === 'crypto'
                                    ? `${getLinksLang(lang)}/coins/${asset.symbol}`
                                    : `${getLinksLang(lang)}/ticker/${asset.ticker_index}`
                            }
                            className="mx-8 flex items-center text-base font-extrabold"
                            style={{ color: textColor }}
                        >
                            {assetType === 'crypto'
                                ? asset.symbol
                                : `# ${asset.symbol_fa}`}
                        </Link>
                    )}
                </div>
                {!!user && user?.active_plan?.is_active && (
                    <a
                        target="_blank"
                        href={
                            assetType === 'crypto'
                                ? 'https://wallex.ir/signup?ref=ov8ddllm'
                                : 'http://reg.nibi.ir/hoshemali'
                        }
                        className="flex items-center gap-5"
                    >
                        <div className="text-base underline underline-offset-2">
                            خرید آنلاین{' '}
                            {assetType === 'crypto'
                                ? asset.symbol
                                : asset.symbol_fa}
                        </div>
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
                            className="lucide lucide-move-left"
                        >
                            <path d="M6 8L2 12L6 16" />
                            <path d="M2 12H22" />
                        </svg>
                    </a>
                )}
            </div>
        </div>
    );
}
