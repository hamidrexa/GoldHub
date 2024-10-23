'use client';
import Asset from '@/components/asset';
import { useRecommendedTickers } from '@/services/useRecomTickers';
import { useRecommendedCrypto } from '@/services/useRecomCrypto';
import { Locale } from '@/i18n-config';
import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { Publisher } from '@/components/publisher';
import { useTopPublishers } from '@/services/useTopPublishers';
import { FollowButton } from '@/components/follow-button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getLinksLang } from '@/libs/utils';
import { useGlobalContext } from '@/contexts/store';
import Link from 'next/link';

type wizardProps = {
    dict: any;
    lang: Locale;
    onEnd: any;
};

export default function FollowWizard({ dict, lang, onEnd }: wizardProps) {
    const { user } = useGlobalContext();
    const follow = false;
    const [step, setStep] = useState('asset');
    const { tops: crypto } = useTopPublishers({
        type: 'cryptocurrency',
        limit: 3,
    });
    const { tops: ticker } = useTopPublishers({ type: 'signal', limit: 3 });
    const suggestedPublisher =
        crypto && ticker ? [[...crypto], [...ticker]] : [];
    const { tickers: tickerSignals, isLoading: isLoadingTickerSignals } =
        useRecommendedTickers();
    const { crypto: cryptoSignals, isLoading: isLoadingCryptoSignals } =
        useRecommendedCrypto();
    const topTickers = tickerSignals
        ? [...tickerSignals.buy, ...tickerSignals.sell]
        : [];
    const topCrypto = cryptoSignals
        ? [...cryptoSignals.buy, ...cryptoSignals.sell]
        : [];
    const topAssets = [
        [
            ...topCrypto.slice(0, 3).map((coin) => ({
                ...coin,
                href: `/coins/${coin.symbol}`,
                type: 'crypto',
            })),
        ],
        [
            ...topTickers.slice(0, 3).map((ticker) => ({
                ...ticker,
                symbol: ticker.symbol_fa,
                image: `https://sahmeto.com/ticker-images/${ticker.symbol_fa}.jpg`,
                href: `/ticker/${ticker.ticker_index}`,
                type: 'ticker',
            })),
        ],
    ];
    const assetsLoading = [isLoadingCryptoSignals, isLoadingTickerSignals];

    return (
        <div className="h-1/2 w-full">
            {step === 'asset' ? (
                <>
                    <h4 className="mb-2 mt-4 text-xl font-black">
                        {dict.addBest.asset.title}
                    </h4>
                    <p className="mb-4">{dict.addBest.asset.text}</p>
                    <div className="h-96 overflow-auto">
                        {[1, 2].map((assetType, assetIndex) => (
                            <div key={assetIndex} className="flex flex-col">
                                <h3 className="mx-2 my-2.5 flex bg-gray-200 px-3 text-base font-semibold text-black ">
                                    {assetIndex === 1 ? dict.tse : dict.crypto}
                                </h3>
                                {assetsLoading[assetIndex]
                                    ? [1, 2, 3].map((loadingKey) => (
                                          <div
                                              key={loadingKey}
                                              className="my-2.5 flex justify-between px-3"
                                          >
                                              <Skeleton className="h-10 w-24" />
                                              <Skeleton className="h-10 w-32" />
                                          </div>
                                      ))
                                    : topAssets[assetIndex].map(
                                          (asset, index) => (
                                              <div
                                                  key={index}
                                                  className="flex h-20 w-full items-center justify-between p-2"
                                              >
                                                  <Asset
                                                      dict={dict}
                                                      lang={lang}
                                                      asset={asset}
                                                      color={
                                                          asset.type == 'tse'
                                                              ? '#FACC15'
                                                              : '#16A34A'
                                                      }
                                                  />
                                                  <FollowButton
                                                      dict={dict}
                                                      lang={lang}
                                                      defaultValue={
                                                          asset.bookmarked_by_user
                                                      }
                                                      id={asset.id}
                                                      type={asset.type}
                                                      name={asset.symbol}
                                                      typeId={
                                                          asset.type ===
                                                          'crypto'
                                                              ? 68
                                                              : 9
                                                      }
                                                      render={(
                                                          isLoading,
                                                          follow
                                                      ) => (
                                                          <button
                                                              className={cn(
                                                                  'flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-bold',
                                                                  follow
                                                                      ? 'bg-blue-700 text-white'
                                                                      : 'border border-neutral-700 bg-blue-50 text-neutral-700',
                                                                  {
                                                                      'animate-pulse':
                                                                          isLoading,
                                                                  }
                                                              )}
                                                              disabled={
                                                                  isLoading
                                                              }
                                                          >
                                                              {follow ? (
                                                                  <>
                                                                      <svg
                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                          width="20"
                                                                          height="20"
                                                                          fill="none"
                                                                          viewBox="0 0 20 20"
                                                                      >
                                                                          <path
                                                                              stroke="#fff"
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth="1.5"
                                                                              d="M13.333 17.5v-1.667A3.333 3.333 0 0010 12.5H5a3.333 3.333 0 00-3.333 3.333V17.5M7.5 9.167a3.333 3.333 0 100-6.667 3.333 3.333 0 000 6.667zM13.333 9.167L15 10.833 18.333 7.5"
                                                                          ></path>
                                                                      </svg>
                                                                      {
                                                                          dict.followed
                                                                      }
                                                                  </>
                                                              ) : (
                                                                  dict.addToDashboard
                                                              )}
                                                          </button>
                                                      )}
                                                  />
                                              </div>
                                          )
                                      )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex items-end justify-between ">
                        <div className="text-md flex w-24">مرحله 1 از 3</div>
                        <Button
                            className={cn(
                                buttonVariants({
                                    variant: 'outline',
                                }),
                                'mt-8 hover:bg-blue-50 hover:text-neutral-700'
                            )}
                            onClick={() => setStep('publisher')}
                        >
                            {dict.next}
                            <ChevronLeft
                                width={18}
                                height={18}
                                className="ltr:rotate-180"
                            />
                        </Button>
                    </div>
                </>
            ) : step === 'publisher' ? (
                <>
                    <h4 className="mb-2 mt-4 text-xl font-black">
                        {dict.addBest.trader.title}
                    </h4>
                    <p className="mb-4">{dict.addBest.trader.text}</p>
                    <div className="my-5 h-96 overflow-auto md:my-0">
                        {[1, 2].map((publisherType, typeIndex) => (
                            <div key={typeIndex} className="flex flex-col">
                                <h3 className="mx-2 my-2.5 flex bg-gray-200 px-3 text-base font-semibold text-black">
                                    {typeIndex === 1 ? dict.tse : dict.crypto}
                                </h3>
                                {suggestedPublisher[typeIndex].map(
                                    (item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex w-full items-center justify-between p-2"
                                        >
                                            <Publisher
                                                lang={lang}
                                                dict={dict}
                                                publisher={item}
                                            />
                                            <FollowButton
                                                dict={dict}
                                                lang={lang}
                                                defaultValue={
                                                    item.bookmarked_by_user
                                                }
                                                id={item.id}
                                                name={item.name}
                                                type="publisher"
                                                typeId={23}
                                                render={(isLoading, follow) => (
                                                    <button
                                                        className={cn(
                                                            'flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-bold',
                                                            follow
                                                                ? 'bg-blue-700 text-white'
                                                                : 'border border-neutral-700 bg-blue-50 text-neutral-700',
                                                            {
                                                                'animate-pulse':
                                                                    isLoading,
                                                            }
                                                        )}
                                                        disabled={isLoading}
                                                    >
                                                        {follow ? (
                                                            <>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="20"
                                                                    height="20"
                                                                    fill="none"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        stroke="#fff"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="1.5"
                                                                        d="M13.333 17.5v-1.667A3.333 3.333 0 0010 12.5H5a3.333 3.333 0 00-3.333 3.333V17.5M7.5 9.167a3.333 3.333 0 100-6.667 3.333 3.333 0 000 6.667zM13.333 9.167L15 10.833 18.333 7.5"
                                                                    ></path>
                                                                </svg>
                                                                {dict.followed}
                                                            </>
                                                        ) : (
                                                            dict.follow
                                                        )}
                                                    </button>
                                                )}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex items-end justify-between ">
                        <div className="text-md flex w-24">مرحله 2 از 3</div>
                        <Button
                            className={cn(
                                buttonVariants({
                                    variant: 'outline',
                                }),
                                'mt-8 hover:bg-blue-50 hover:text-neutral-700'
                            )}
                            onClick={() => setStep('bot')}
                        >
                            {dict.next}
                            <ChevronLeft
                                width={18}
                                height={18}
                                className="ltr:rotate-180"
                            />
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <h4 className="mb-2 mt-4 text-xl font-black">
                        فعال سازی هشدار
                    </h4>
                    <p className="mb-4 leading-relaxed">
                        برای با‌خبر شدن از آخرین اتفاقات بازار بورس و
                        ارزدیجیتال، به ربات تلگرام طلانو متصل شوید.
                    </p>
                    <div className="flex min-h-48 w-full items-center justify-center">
                        {!!user.telegram_chat_id ? (
                            <div
                                className={cn(
                                    buttonVariants({
                                        variant: 'outline',
                                    }),
                                    'h-14 w-full hover:cursor-auto'
                                )}
                            >
                                شما به بات طلانو متصل شده اید.
                            </div>
                        ) : (
                            <a
                                target="_blank"
                                className={cn(
                                    buttonVariants({
                                        variant: 'default',
                                    }),
                                    'h-14 w-full'
                                )}
                                href={user?.telegram_bot_url}
                            >
                                اتصال به ربات تلگرام
                            </a>
                        )}
                    </div>

                    <div className="flex items-end justify-between md:mt-6">
                        <div className="w-22 text-md flex items-center justify-center">
                            مرحله 3 از 3
                        </div>
                        <div className="flex items-end gap-1.5">
                            <Button
                                onClick={() => {
                                    onEnd(true);
                                }}
                                className={cn(
                                    buttonVariants({
                                        variant: 'ghost',
                                    }),
                                    'mt-8 text-gray-900 hover:bg-white hover:text-black'
                                )}
                            >
                                بستن
                            </Button>
                            <Link
                                target="_blank"
                                href={`${getLinksLang(lang)}/`}
                                className={cn(
                                    buttonVariants({ variant: 'outline' }),
                                    'mt-8 hover:cursor-pointer hover:bg-blue-50 hover:text-neutral-700'
                                )}
                                onClick={() => {
                                    setStep('bot');
                                }}
                            >
                                {dict.goToFeed}
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
