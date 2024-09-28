'use client';

import { cn, getDirection } from '@/libs/utils';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AreaBarComposedChart } from '@/components/area-bar-composed-chart';
import dayjs from 'dayjs';
import { useSignalsSummery } from '@/services/useSignalsSummery';
import { useGlobalContext } from '@/contexts/store';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { PricingModal } from '@/app/[lang]/(user)/leaderboard/components/pricing-modal';
import { usePathname } from 'next/navigation';

export function PriceSignalChart({ dict, lang, asset, market }) {
    const dir = getDirection(lang);
    const { user } = useGlobalContext();
    const [durationFilter, setDurationFilter] = useState('30,day');
    const [signalTypeFilter, setSignalTypeFilter] = useState('buy');
    const [duration, durationScale] = durationFilter.split(',');
    const { signalsSummery, isLoading, error } = useSignalsSummery({
        duration,
        duration_scale: durationScale,
        asset_id: asset.asset_id,
    });
    const [openPricingModal, setOpenPricingModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();

    return (
        <>
            <div className="mb-5 flex flex-col flex-wrap items-center justify-between gap-5 md:flex-row">
                <div className="flex w-full items-center justify-between gap-5 md:w-fit md:justify-start">
                    <div className="text-sm font-bold">{dict.timeSlice}:</div>
                    <div
                        onClick={() => {
                            if (!user) return setOpenLoginModal(true);
                            if (!user.active_plan?.is_active)
                                return setOpenPricingModal(true);
                        }}
                    >
                        <RadioGroup
                            disabled={!user || !user?.active_plan?.is_active}
                            defaultValue={durationFilter}
                            dir={getDirection(lang)}
                            className="flex items-center gap-3"
                            onValueChange={setDurationFilter}
                        >
                            <div>
                                <RadioGroupItem
                                    value="30,day"
                                    id="asset-price-signal-1month"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="asset-price-signal-1month"
                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.oneMonth}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="90,day"
                                    id="asset-price-signal-3month"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="asset-price-signal-3month"
                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.threeMonth}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="25,week"
                                    id="asset-price-signal-6month"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="asset-price-signal-6month"
                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.sixMonth}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="12,month"
                                    id="asset-price-signal-1year"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="asset-price-signal-1year"
                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.oneYear}
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="flex w-full items-center justify-between gap-5 md:w-fit md:justify-start">
                    <div className="text-sm font-bold">{dict.signalType}:</div>
                    <RadioGroup
                        defaultValue={signalTypeFilter}
                        dir={getDirection(lang)}
                        className="flex items-center gap-3"
                        onValueChange={setSignalTypeFilter}
                    >
                        <div>
                            <RadioGroupItem
                                value="buy"
                                id="signal-type-buy"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="signal-type-buy"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                {dict.buy}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="sell"
                                id="signal-type-sell"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="signal-type-sell"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                {dict.sell}
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div
                className={cn('-mx-2.5 md:-mx-0', {
                    'blur-md': isLoading,
                })}
            >
                <AreaBarComposedChart
                    dot
                    lang={lang}
                    market={market}
                    dir={dir}
                    xDataKey="date"
                    yDataKey="return_price"
                    name={`${dict.price} ${market === 'tse' ? 'تعدیلی' : ''} ${
                        market === 'tse' ? asset.symbol : asset.name
                    }`}
                    color="#84859C"
                    barDataKey={
                        signalTypeFilter === 'buy'
                            ? 'buy_signals_count'
                            : 'sell_signals_count'
                    }
                    barColor={
                        signalTypeFilter === 'buy' ? '#10EDC5' : '#DB2777'
                    }
                    barName={
                        signalTypeFilter === 'buy'
                            ? dict.buySignals
                            : dict.sellSignals
                    }
                    interval="preserveEnd"
                    isAnimationActive={!isLoading}
                    data={
                        isLoading
                            ? [
                                  {
                                      date: '2023-08-25',
                                      buy_signals_count: 244,
                                      sell_signals_count: 204,
                                      neutral_signals_count: 19,
                                      return_price: 25963.804954529245,
                                  },
                                  {
                                      date: '2023-09-01',
                                      buy_signals_count: 243,
                                      sell_signals_count: 161,
                                      neutral_signals_count: 17,
                                      return_price: 25620.79046354503,
                                  },
                                  {
                                      date: '2023-09-08',
                                      buy_signals_count: 198,
                                      sell_signals_count: 158,
                                      neutral_signals_count: 12,
                                      return_price: 25877.797012952156,
                                  },
                                  {
                                      date: '2023-09-15',
                                      buy_signals_count: 225,
                                      sell_signals_count: 172,
                                      neutral_signals_count: 18,
                                      return_price: 26412.655517371426,
                                  },
                                  {
                                      date: '2023-09-22',
                                      buy_signals_count: 184,
                                      sell_signals_count: 139,
                                      neutral_signals_count: 18,
                                      return_price: 26537.82083309501,
                                  },
                                  {
                                      date: '2023-09-29',
                                      buy_signals_count: 171,
                                      sell_signals_count: 175,
                                      neutral_signals_count: 7,
                                      return_price: 26928.47418718301,
                                  },
                                  {
                                      date: '2023-10-06',
                                      buy_signals_count: 278,
                                      sell_signals_count: 173,
                                      neutral_signals_count: 13,
                                      return_price: 27975.150590423098,
                                  },
                                  {
                                      date: '2023-10-13',
                                      buy_signals_count: 222,
                                      sell_signals_count: 214,
                                      neutral_signals_count: 11,
                                      return_price: 26769.852774850617,
                                  },
                                  {
                                      date: '2023-10-20',
                                      buy_signals_count: 278,
                                      sell_signals_count: 203,
                                      neutral_signals_count: 20,
                                      return_price: 29556.928834950508,
                                  },
                                  {
                                      date: '2023-10-27',
                                      buy_signals_count: 398,
                                      sell_signals_count: 297,
                                      neutral_signals_count: 20,
                                      return_price: 33673.01384438189,
                                  },
                                  {
                                      date: '2023-11-03',
                                      buy_signals_count: 338,
                                      sell_signals_count: 175,
                                      neutral_signals_count: 10,
                                      return_price: 34585.470175809365,
                                  },
                                  {
                                      date: '2023-11-10',
                                      buy_signals_count: 303,
                                      sell_signals_count: 211,
                                      neutral_signals_count: 7,
                                      return_price: 37246.84750569102,
                                  },
                                  {
                                      date: '2023-11-17',
                                      buy_signals_count: 281,
                                      sell_signals_count: 202,
                                      neutral_signals_count: 16,
                                      return_price: 36325.581244256515,
                                  },
                                  {
                                      date: '2023-11-24',
                                      buy_signals_count: 295,
                                      sell_signals_count: 227,
                                      neutral_signals_count: 17,
                                      return_price: 37787.603687667804,
                                  },
                                  {
                                      date: '2023-12-01',
                                      buy_signals_count: 266,
                                      sell_signals_count: 232,
                                      neutral_signals_count: 17,
                                      return_price: 38784.25383466603,
                                  },
                                  {
                                      date: '2023-12-08',
                                      buy_signals_count: 552,
                                      sell_signals_count: 320,
                                      neutral_signals_count: 28,
                                      return_price: 43963.713808031745,
                                  },
                                  {
                                      date: '2023-12-15',
                                      buy_signals_count: 398,
                                      sell_signals_count: 270,
                                      neutral_signals_count: 12,
                                      return_price: 43093.143661035,
                                  },
                                  {
                                      date: '2023-12-22',
                                      buy_signals_count: 286,
                                      sell_signals_count: 228,
                                      neutral_signals_count: 6,
                                      return_price: 43560.083618675606,
                                  },
                                  {
                                      date: '2023-12-29',
                                      buy_signals_count: 310,
                                      sell_signals_count: 205,
                                      neutral_signals_count: 17,
                                      return_price: 42011.40037528156,
                                  },
                                  {
                                      date: '2024-01-05',
                                      buy_signals_count: 375,
                                      sell_signals_count: 263,
                                      neutral_signals_count: 21,
                                      return_price: 44104.58951927037,
                                  },
                                  {
                                      date: '2024-01-12',
                                      buy_signals_count: 417,
                                      sell_signals_count: 301,
                                      neutral_signals_count: 55,
                                      return_price: 42778.49582759031,
                                  },
                                  {
                                      date: '2024-01-19',
                                      buy_signals_count: 342,
                                      sell_signals_count: 329,
                                      neutral_signals_count: 22,
                                      return_price: 41581.90279608383,
                                  },
                                  {
                                      date: '2024-01-26',
                                      buy_signals_count: 315,
                                      sell_signals_count: 251,
                                      neutral_signals_count: 19,
                                      return_price: 41816.87284400344,
                                  },
                                  {
                                      date: '2024-02-02',
                                      buy_signals_count: 259,
                                      sell_signals_count: 211,
                                      neutral_signals_count: 4,
                                      return_price: 43185.85943223562,
                                  },
                                  {
                                      date: '2024-02-04',
                                      buy_signals_count: 35,
                                      sell_signals_count: 21,
                                      neutral_signals_count: 0,
                                      return_price: 42875.28304930308,
                                  },
                              ]
                            : signalsSummery.map((signal, index) => ({
                                  ...signal,
                                  date: dayjs(signal.date)
                                      .calendar(
                                          lang === 'fa' ? 'jalali' : 'gregory'
                                      )
                                      .locale(lang)
                                      .format(
                                          durationFilter.split(',')[1] ===
                                              'day' ||
                                              durationFilter.split(',')[1] ===
                                                  'week'
                                              ? lang === 'fa'
                                                  ? 'DD MMMM'
                                                  : 'DD MMM'
                                              : 'MMMM'
                                      ),
                                  viewPoint:
                                      index === signalsSummery.length - 1,
                              }))
                    }
                />
            </div>
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: (
                        <>
                            برای استفاده از این قابلیت
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
                            برای استفاده از این قابلیت
                            <br />
                            طرح خود را ارتقا دهید.
                        </>
                    ),
                }}
                open={openPricingModal}
                setOpen={setOpenPricingModal}
            />
        </>
    );
}
