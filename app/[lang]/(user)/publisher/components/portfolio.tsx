'use client';

import React, { useState } from 'react';
import { PieChart } from '@/components/pie-chart';
import { useStockPortfolio } from '@/app/[lang]/(user)/publisher/services/useStockPortfolio';
import { Empty } from '@/components/empty';
import { useGlobalContext } from '@/contexts/store';
import { LockIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { PricingModal } from '@/app/[lang]/(user)/leaderboard/components/pricing-modal';

export function Portfolio({ dict, lang, id }) {
    const { user } = useGlobalContext();
    const { portfolio, isLoading, error } = useStockPortfolio({
        id,
    });
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openPricingModal, setOpenPricingModal] = useState(false);
    const path = usePathname();

    return (
        <div className="relative">
            {isLoading || !user || !user?.active_plan?.is_active ? (
                <>
                    <PieChart
                        className="blur-md"
                        width="100%"
                        height={160}
                        data={[
                            {
                                name: 'BTC',
                                count: 2,
                                value: 100,
                            },
                        ]}
                        dataKey="value"
                    />
                    {(!user || !user?.active_plan?.is_active) && !isLoading && (
                        <button
                            className="w-full h-full absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1.5"
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
                </>
            ) : !portfolio?.stock_portfolio?.length ? (
                <Empty>{dict.portfolioIsEmpty}</Empty>
            ) : (
                <PieChart
                    width="100%"
                    height={160}
                    data={portfolio.stock_portfolio.map((item) => ({
                        ...item,
                        name: item.symbol,
                        value: item.percent ,
                    }))}
                    dataKey="value"
                />
            )}
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: (
                        <>
                            برای مشاهده سبد تریدر
                            <br />
                            ثبت نام کنید.
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
                            برای مشاهده سبد تریدر
                            <br />
                            طرح خود را ارتقا دهید.
                        </>
                    ),
                }}
                open={openPricingModal}
                setOpen={setOpenPricingModal}
            />
        </div>
    );
}
