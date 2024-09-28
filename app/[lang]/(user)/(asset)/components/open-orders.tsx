'use client';

import {
    cn,
    currency,
    formatPrice,
    getDirection,
    getLinksLang,
    roundNumber,
} from '@/libs/utils';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGlobalContext } from '@/contexts/store';
import { componentFormat } from '@/libs/stringFormatter';
import { Skeleton } from '@/components/ui/skeleton';
import { Publisher } from '@/components/publisher';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useTarget } from '@/app/[lang]/(user)/(asset)/services/useTarget';
import { useOpenOrders } from '@/app/[lang]/(user)/(asset)/services/useOpenOrders';
import { LockIcon } from 'lucide-react';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { PricingModal } from '@/app/[lang]/(user)/leaderboard/components/pricing-modal';
import { usePathname } from 'next/navigation';
import { Empty } from '@/components/empty';
import { NewDragSlider } from '@/components/new-range-chart';
import { useTargetV3 } from '@/app/[lang]/(user)/(asset)/services/useTargetV3';

export function OpenOrders({ dict, lang, asset, market }) {
    const { user } = useGlobalContext();
    const [traderCategoryFilter, setTraderCategoryFilter] = useState(undefined);
    const [page, setPage] = useState(1);
    const { target, isLoading: targetIsLoading } = useTarget(asset.asset_id, {
        ...(traderCategoryFilter && {
            trader_category: traderCategoryFilter,
        }),
    });
    const { target: pTarget, isLoading: pTargetIsLoading } = useTargetV3(
        asset.asset_id,
        {
            ...(traderCategoryFilter && {
                trader_category: traderCategoryFilter,
            }),
        }
    );
    const { openOrders, isLoading } = useOpenOrders(asset.asset_id, {
        trader_category: traderCategoryFilter,
        page,
    });
    const suggestStopLoss = pTarget.average_target
        ? roundNumber((pTarget.average_target / pTarget.price - 1) * 100)
        : 0;
    const suggestProfitTarget = pTarget.average_target
        ? roundNumber((pTarget.average_target / pTarget.price - 1) * 100)
        : 0;
    const suggestAverage = pTarget.average_target
        ? roundNumber((pTarget.average_target / pTarget.price - 1) * 100)
        : 0;
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openPricingModal, setOpenPricingModal] = useState(false);
    const [contents, setContents] = useState({
        title: '',
        description: '',
    } as {
        title: string | React.ReactNode;
        description?: string | React.ReactNode;
    });
    const path = usePathname();

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-5 md:flex-row">
                <div className="flex w-full items-center justify-between gap-5 md:w-fit md:justify-start">
                    <div className="text-sm font-bold">{dict.filter}:</div>
                    <div
                        onClick={() => {
                            if (!user) {
                                setContents({
                                    title: `برای مشاهده نظر 100 تریدر برتر در مورد ${asset.symbol} ثبت نام کنید.`,
                                    description:
                                        'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
                                });
                                return setOpenLoginModal(true);
                            }
                            if (!user.active_plan?.is_active) {
                                setContents({
                                    title: `برای مشاهده نظر 100 تریدر برتر در مورد ${asset.symbol} طرح خود را ارتقا دهید.`,
                                });
                                setOpenPricingModal(true);
                            }
                        }}
                    >
                        <RadioGroup
                            disabled={!user || !user?.active_plan?.is_active}
                            defaultValue={traderCategoryFilter}
                            dir={getDirection(lang)}
                            className="flex items-center gap-3"
                            onValueChange={setTraderCategoryFilter}
                        >
                            <div>
                                <RadioGroupItem
                                    value={undefined}
                                    id="open-orders-all-trader"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="open-orders-all-trader"
                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.allTraders}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="TopTraders"
                                    id="open-orders-top-traders"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="open-orders-top-traders"
                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-disabled:cursor-pointer peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.top100Traders}
                                </Label>
                            </div>
                            {/*<div>*/}
                            {/*    <RadioGroupItem*/}
                            {/*        value="MyTraders"*/}
                            {/*        id="open-orders-my-traders"*/}
                            {/*        className="peer sr-only"*/}
                            {/*        disabled={!user}*/}
                            {/*    />*/}
                            {/*    <Label*/}
                            {/*        htmlFor="open-orders-my-traders"*/}
                            {/*        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                            {/*    >*/}
                            {/*        {dict.myTraders}*/}
                            {/*    </Label>*/}
                            {/*</div>*/}
                        </RadioGroup>
                    </div>
                </div>
            </div>
            {(!!Object.keys(pTarget).length || pTargetIsLoading) && (
                <div
                    className={cn(
                        'mx-2 mb-32 mt-12 flex flex-col items-center gap-32 md:mx-0 md:my-12 md:gap-0',
                        !!pTarget?.top_trader_target
                            ? 'justify-between'
                            : 'justify-center'
                    )}
                >
                    <div className="items-center gap-1 text-base text-neutral-800 md:flex">
                        {targetIsLoading ? (
                            <Skeleton className="inline-flex h-9 w-80" />
                        ) : (
                            !!pTarget?.top_trader_target &&
                            componentFormat(
                                pTarget.price < pTarget.average_target
                                    ? dict.tradersProfitPrediction
                                    : dict.tradersLossPrediction,
                                { symbol: asset.symbol },
                                !user || !user?.active_plan?.is_active ? (
                                    <button
                                        className="relative -top-1 mx-2 inline-block"
                                        onClick={() => {
                                            if (!user) {
                                                setContents({
                                                    title: `برای مشاهده پیش بینی سود تریدرها از ${asset.symbol} ثبت نام کنید.`,
                                                    description:
                                                        'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
                                                });
                                                return setOpenLoginModal(true);
                                            }
                                            if (!user.active_plan?.is_active) {
                                                setContents({
                                                    title: `برای مشاهده پیش بینی سود تریدرها از ${asset.symbol} طرح خود را ارتقا دهید.`,
                                                });
                                                setOpenPricingModal(true);
                                            }
                                        }}
                                    >
                                        <LockIcon
                                            stroke="#0C0E3C"
                                            strokeWidth={2}
                                        />
                                    </button>
                                ) : (
                                    <span
                                        className={cn(
                                            'inline-flex text-3xl font-black',
                                            pTarget.price <
                                                pTarget.average_target
                                                ? 'text-teal-600'
                                                : 'text-pink-600'
                                        )}
                                        dir="ltr"
                                    >
                                        {pTarget.price < pTarget.average_target
                                            ? suggestProfitTarget
                                            : Math.abs(suggestStopLoss)}
                                        %
                                    </span>
                                )
                            )
                        )}
                    </div>
                    <div className="mx-auto my-16 min-w-72 -rotate-90 md:min-w-96 md:rotate-0">
                        {!pTargetIsLoading && (
                            <NewDragSlider
                                className="mt-24 -translate-y-14"
                                min={
                                    !!pTarget.min_target
                                        ? pTarget.min_target
                                        : 0.5 * pTarget.price
                                }
                                max={
                                    !!pTarget.max_target
                                        ? pTarget.max_target
                                        : 1.5 * pTarget.price
                                }
                                curr={pTarget.price}
                                average={
                                    !!pTarget.average_target
                                        ? pTarget.average_target
                                        : pTarget.price
                                }
                                items={{
                                    [!!pTarget.min_target
                                        ? pTarget.min_target
                                        : 0.5 * pTarget.price]: (
                                        <>
                                            <span className="absolute -bottom-3.5 right-2 hidden items-center justify-center gap-0.5 text-sm font-semibold md:flex">
                                                <div className="h-[1px] w-6 bg-gray-600"></div>
                                                <div className=" flex flex-col">
                                                    <div>کف احتمالی قیمت</div>
                                                    <div>
                                                        {!!pTarget.min_target
                                                            ? currency(
                                                                  formatPrice(
                                                                      pTarget.min_target
                                                                  ),
                                                                  market,
                                                                  lang
                                                              )
                                                            : '-'}
                                                    </div>
                                                </div>
                                            </span>
                                            <span className="absolute -bottom-7 -right-1 flex rotate-90 flex-col items-center justify-center gap-0.5 text-sm font-semibold md:hidden ">
                                                <div className="h-6 w-[1px] bg-gray-600"></div>
                                                <div>کف احتمالی قیمت</div>
                                                <div>
                                                    {!!pTarget.min_target
                                                        ? currency(
                                                              formatPrice(
                                                                  pTarget.min_target
                                                              ),
                                                              market,
                                                              lang
                                                          )
                                                        : '-'}
                                                </div>
                                            </span>
                                        </>
                                    ),
                                    [!!pTarget.average_target
                                        ? Math.min(
                                              pTarget.price,
                                              pTarget.average_target
                                          )
                                        : pTarget.price]:
                                        pTarget.price >
                                        pTarget.average_target ? (
                                            <span className="flex flex-col items-center justify-center gap-3 text-base font-bold md:gap-0">
                                                <div className="h-10 w-[1px] bg-gray-600"></div>
                                                <div className="rotate-90 md:rotate-0">
                                                    <div className="text-pink-600">
                                                        {!!pTarget.average_target
                                                            ? currency(
                                                                  formatPrice(
                                                                      pTarget.average_target
                                                                  ),
                                                                  market,
                                                                  lang
                                                              )
                                                            : 'داده ناکافی'}
                                                    </div>
                                                    <div>هدف اول قیمتی</div>
                                                </div>
                                            </span>
                                        ) : (
                                            <span className="flex -translate-y-[100%] flex-col items-center justify-center gap-4 text-base font-bold md:gap-0">
                                                <div className="rotate-90 md:rotate-0">
                                                    <div>قیمت فعلی</div>
                                                    <div>
                                                        {currency(
                                                            formatPrice(
                                                                pTarget.price
                                                            ),
                                                            market,
                                                            lang
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="h-10 w-[1px] bg-gray-600"></div>
                                            </span>
                                        ),
                                    [!!pTarget.average_target
                                        ? Math.max(
                                              pTarget.price,
                                              pTarget.average_target
                                          )
                                        : pTarget.price]:
                                        pTarget.price <
                                        pTarget.average_target ? (
                                            <span className="flex flex-col items-center justify-center gap-4 text-base font-bold md:gap-0">
                                                <div className="h-10 w-[1px] bg-gray-600"></div>
                                                <div className="rotate-90 md:rotate-0">
                                                    <div className="text-teal-200">
                                                        {!!pTarget.average_target
                                                            ? currency(
                                                                  formatPrice(
                                                                      pTarget.average_target
                                                                  ),
                                                                  market,
                                                                  lang
                                                              )
                                                            : 'داده ناکافی'}
                                                    </div>
                                                    <div>هدف اول قیمتی</div>
                                                </div>
                                            </span>
                                        ) : (
                                            <span className="flex -translate-y-[100%] flex-col items-center justify-center gap-3 text-base font-bold md:gap-0">
                                                <div className="rotate-90 md:rotate-0">
                                                    <div>قیمت فعلی</div>
                                                    <div>
                                                        {currency(
                                                            formatPrice(
                                                                pTarget.price
                                                            ),
                                                            market,
                                                            lang
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="h-10 w-[1px] bg-gray-600"></div>
                                            </span>
                                        ),
                                    [!!pTarget.max_target
                                        ? pTarget.max_target
                                        : 1.5 * pTarget.price]: (
                                        <>
                                            <span className="absolute -bottom-3.5 left-2 hidden flex-row-reverse items-center justify-center gap-0.5 text-sm font-semibold md:flex">
                                                <div className="h-[1px] w-6 bg-gray-600"></div>
                                                <div className="flex flex-col">
                                                    <div>
                                                        بالاترین هدف قیمتی
                                                    </div>
                                                    <div>
                                                        {!!pTarget.max_target
                                                            ? currency(
                                                                  formatPrice(
                                                                      pTarget.max_target
                                                                  ),
                                                                  market,
                                                                  lang
                                                              )
                                                            : '-'}
                                                    </div>
                                                </div>
                                            </span>
                                            <span className="absolute -bottom-7 -left-2.5 flex rotate-90 flex-col items-center justify-center gap-0.5 text-sm font-semibold md:hidden ">
                                                <div>بالاترین هدف قیمتی</div>
                                                <div>
                                                    {!!pTarget.max_target
                                                        ? currency(
                                                              formatPrice(
                                                                  pTarget.max_target
                                                              ),
                                                              market,
                                                              lang
                                                          )
                                                        : '-'}
                                                </div>
                                                <div className="h-6 w-[1px] bg-gray-600"></div>
                                            </span>
                                        </>
                                    ),
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
            <div className="mx-auto max-w-xl">
                <div className="flex w-full flex-col items-center gap-6">
                    {!isLoading && !openOrders.results?.length && (
                        <div className="pt-4 text-center text-base font-medium">
                            <Empty>تریدری پیدا نشد.</Empty>
                        </div>
                    )}
                    {isLoading &&
                        [1, 2, 3, 4, 5].map((item) => (
                            <div
                                className="flex w-full flex-col items-start justify-between gap-2 md:flex-row"
                                key={item}
                            >
                                <div className="flex items-center justify-center gap-2.5">
                                    <Skeleton className="inline_flex h-14 w-14 rounded-full" />
                                    <div className="flex flex-col items-start justify-center gap-1">
                                        <Skeleton className="flex-inlile h-6 w-24" />
                                        <Skeleton className="flex-inlile h-5 w-14" />
                                    </div>
                                </div>
                                <div className="flex w-full justify-between md:w-[unset] md:justify-end md:gap-5">
                                    <Skeleton className="flex-inline h-14 w-20" />
                                    <Skeleton className="flex-inline  h-14 w-20" />
                                    <Skeleton className="flex-inline  h-14 w-20" />
                                </div>
                            </div>
                        ))}
                    <div className="flex w-full flex-col gap-6 text-base">
                        {openOrders.results?.map(
                            (
                                { publisher, opening_signal: signal },
                                index,
                                array
                            ) => (
                                <div
                                    className="flex flex-col gap-3.5 md:flex-row"
                                    key={signal.id}
                                >
                                    <Publisher
                                        lang={lang}
                                        className="w-full"
                                        publisher={publisher}
                                        dict={dict}
                                    />
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex min-w-[90px] flex-col items-center justify-center text-xl font-bold md:text-3xl">
                                            {(!user ||
                                                !user.active_plan?.is_active) &&
                                            index <
                                                (array.length <= 1 ? 0 : 3) ? (
                                                <button
                                                    className="relative -top-1 mx-2 inline-block"
                                                    onClick={() => {
                                                        if (!user) {
                                                            setContents({
                                                                title: `برای مشاهده پیش بینی سود تریدرها از ${asset.symbol} ثبت نام کنید.`,
                                                                description:
                                                                    'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
                                                            });
                                                            return setOpenLoginModal(
                                                                true
                                                            );
                                                        }
                                                        if (
                                                            !user.active_plan
                                                                ?.is_active
                                                        ) {
                                                            setContents({
                                                                title: `برای مشاهده پیش بینی سود تریدرها از ${asset.symbol} طرح خود را ارتقا دهید.`,
                                                            });
                                                            setOpenPricingModal(
                                                                true
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <LockIcon
                                                        stroke="#0C0E3C"
                                                        strokeWidth={2}
                                                    />
                                                </button>
                                            ) : signal.profit_target_price ? (
                                                currency(
                                                    signal.profit_target_price,
                                                    market,
                                                    lang
                                                )
                                            ) : (
                                                <span className="text-base leading-9">
                                                    {dict.nonAnnounce}
                                                </span>
                                            )}
                                            <span className="text-xs text-neutral-200 md:text-base">
                                                {dict.profitLimit}
                                            </span>
                                        </div>
                                        <div className="flex min-w-[90px] flex-col items-center justify-center text-xl font-bold md:text-3xl">
                                            {(!user ||
                                                !user.active_plan?.is_active) &&
                                            index <
                                                (array.length <= 1 ? 0 : 3) ? (
                                                <button
                                                    className="relative -top-1 mx-2 inline-block"
                                                    onClick={() => {
                                                        if (!user) {
                                                            setContents({
                                                                title: `برای مشاهده پیش بینی سود تریدرها از ${asset.symbol} ثبت نام کنید.`,
                                                                description:
                                                                    'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
                                                            });
                                                            return setOpenLoginModal(
                                                                true
                                                            );
                                                        }
                                                        if (
                                                            !user.active_plan
                                                                ?.is_active
                                                        ) {
                                                            setContents({
                                                                title: `برای مشاهده پیش بینی سود تریدرها از ${asset.symbol} طرح خود را ارتقا دهید.`,
                                                            });
                                                            setOpenPricingModal(
                                                                true
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <LockIcon
                                                        stroke="#0C0E3C"
                                                        strokeWidth={2}
                                                    />
                                                </button>
                                            ) : signal.stop_loss_price ? (
                                                currency(
                                                    signal.stop_loss_price,
                                                    market,
                                                    lang
                                                )
                                            ) : (
                                                <span className="text-base leading-9">
                                                    {dict.nonAnnounce}
                                                </span>
                                            )}
                                            <span className="text-xs text-neutral-200 md:text-base">
                                                {dict.damageLimit}
                                            </span>
                                        </div>
                                        <button
                                            className="flex flex-col items-center justify-center gap-2 text-sm underline underline-offset-2"
                                            onClick={(e) => {
                                                if (
                                                    !user &&
                                                    index <
                                                        (array.length <= 1
                                                            ? 0
                                                            : 3)
                                                ) {
                                                    setContents({
                                                        title: `برای مشاهده پیش بینی سود تریدرها از ${asset.symbol} ثبت نام کنید.`,
                                                        description:
                                                            'با ثبت نام در سهمتو، 7 روز اشتراک رایگان هدیه بگیرید.',
                                                    });
                                                    return setOpenLoginModal(
                                                        true
                                                    );
                                                }
                                                if (
                                                    !user?.active_plan
                                                        ?.is_active &&
                                                    index <
                                                        (array.length <= 1
                                                            ? 0
                                                            : 3)
                                                ) {
                                                    setContents({
                                                        title: `برای مشاهده پیش بینی سود تریدرها از ${asset.symbol} طرح خود را ارتقا دهید.`,
                                                    });
                                                    return setOpenPricingModal(
                                                        true
                                                    );
                                                }

                                                window.open(
                                                    `${getLinksLang(lang)}/message/${signal.id}`
                                                );
                                            }}
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
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <Pagination className="mt-8">
                    <PaginationContent>
                        {openOrders.next && (
                            <PaginationItem>
                                <PaginationPrevious
                                    text="قدیمی تر"
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
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: contents.title,
                    description: contents.description,
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
                    title: contents.title,
                }}
                open={openPricingModal}
                setOpen={setOpenPricingModal}
            />
        </>
    );
}
