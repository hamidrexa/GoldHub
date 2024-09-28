'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Locale } from '@/i18n-config';
import { useRecommendedTickers } from '@/services/useRecomTickers';
import { useRecommendedCrypto } from '@/services/useRecomCrypto';
import { Skeleton } from '@/components/ui/skeleton';
import Asset from '@/components/asset';
import { FollowButton } from '@/components/follow-button';
import Cookies from 'js-cookie';
import { useGlobalContext } from '@/contexts/store';
import { cn } from '@/libs/utils';

type Props = {
    dict: any;
    lang: Locale;
};

export function FollowSuggestion({ dict, lang }: Props) {
    const [isOpen, setIsOpen] = useState(false);
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
            ...topCrypto.slice(0, 2).map((coin) => ({
                ...coin,
                href: `/coins/${coin.symbol}`,
                type: 'crypto',
            })),
        ],
        [
            ...topTickers.slice(0, 2).map((ticker) => ({
                ...ticker,
                symbol: ticker.symbol_fa,
                image: `https://sahmeto.com/ticker-images/${ticker.symbol_fa}.jpg`,
                href: `/ticker/${ticker.ticker_index}`,
                type: 'ticker',
            })),
        ],
    ];
    const assetsLoading = [isLoadingCryptoSignals, isLoadingTickerSignals];
    const seenFollowSuggest = Cookies.get('seenFollowSuggest');
    const { user } = useGlobalContext();

    useEffect(() => {
        setTimeout(() => {
            setIsOpen(true);
        }, 10000);
    }, []);

    if (!user || !user.active_plan?.is_active || seenFollowSuggest) return null;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open)
                    Cookies.set('seenFollowSuggest', 'true', {
                        expires: 1,
                    });
            }}
        >
            <DialogContent>
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
                            : topAssets[assetIndex].map((asset, index) => (
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
                                          typeId={
                                              asset.type === 'crypto' ? 68 : 9
                                          }
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
                                                      dict.addToDashboard
                                                  )}
                                              </button>
                                          )}
                                      />
                                  </div>
                              ))}
                    </div>
                ))}
            </DialogContent>
        </Dialog>
    );
}
