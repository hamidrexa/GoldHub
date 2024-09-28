'use client';

import Asset from '@/components/asset';
import { useRecommendedTickers } from '@/services/useRecomTickers';
import { useRecommendedCrypto } from '@/services/useRecomCrypto';
import React from 'react';
import { Locale } from '@/i18n-config';
import { Skeleton } from '@/components/ui/skeleton';
import { currency, roundNumber } from '@/libs/utils';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import { usePrice } from '@/app/[lang]/(user)/(asset)/services/usePrice';

type Props = {
    lang: Locale;
    dict: any;
};

export function TopAssetBox({ lang, dict }: Props) {
    const { tickers: tickerSignals, isLoading: isLoadingTickerSignals } =
        useRecommendedTickers();
    const { crypto: cryptoSignals, isLoading: isLoadingCryptoSignals } =
        useRecommendedCrypto();
    const cryptoAll =
        !!cryptoSignals &&
        (cryptoSignals.buy.length > 0 || cryptoSignals.sell.length > 0)
            ? [cryptoSignals.buy[0] || cryptoSignals.sell[0]]
            : [];
    const tickerAll =
        !!tickerSignals &&
        (tickerSignals.buy.length > 0 || tickerSignals.sell.length > 0)
            ? [tickerSignals.buy[0] || tickerSignals.sell[0]]
            : [];
    const cryptoFirst =
        !!cryptoAll && cryptoAll.length > 0
            ? cryptoAll.map((coin) => ({
                  href: `/coins/${coin.symbol}`,
                  ...coin,
              }))
            : [];
    const tickerFirst =
        !!tickerAll && tickerAll.length > 0
            ? tickerAll.map((ticker) => ({
                  ...ticker,
                  href: `/ticker/${ticker?.ticker_index}`,
                  symbol: ticker?.symbol_fa,
                  image: `https://sahmeto.com/ticker-images/${ticker?.symbol_fa}.jpg`,
              }))
            : [];
    const { price: cryptoInfo, isLoading: cryptoInfoLoading } = usePrice({
        id: cryptoFirst[0]?.asset_id,
        condition: !!cryptoFirst && cryptoFirst.length > 0,
    });
    const { price: tickerInfo, isLoading: tickerInfoLoading } = usePrice({
        id: tickerFirst[0]?.asset_id,
        condition: !!tickerFirst && tickerFirst.length > 0,
    });

    return (
        <div className="md:flex-clo flex flex-col items-start justify-between gap-4 md:flex-col md:gap-8">
            {isLoadingCryptoSignals ? (
                <div className="flex min-w-32 items-center justify-between gap-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <Skeleton className="h-6 min-w-16" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <Skeleton className="h-6 min-w-32" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            ) : (
                cryptoFirst.length > 0 && (
                    <div className="flex min-w-48 items-center justify-between gap-4 whitespace-nowrap">
                        <Asset
                            asset={cryptoFirst[0]}
                            dict={dict}
                            lang={lang}
                            color="#2930CE"
                        />
                        <div className="flex gap-3">
                            <div>
                                {cryptoInfoLoading ? (
                                    <Skeleton className="h-6 min-w-16" />
                                ) : (
                                    currency(
                                        cryptoInfo.price?.USD,
                                        'crypto',
                                        lang
                                    )
                                )}
                            </div>
                            {cryptoInfoLoading ? (
                                <Skeleton className="h-6 min-w-32" />
                            ) : (
                                <div
                                    dir="ltr"
                                    className="flex gap-2"
                                    style={{
                                        color:
                                            cryptoInfo.change_24h?.USD > 0
                                                ? 'green'
                                                : 'red',
                                    }}
                                >
                                    {cryptoInfo.change_24h?.USD > 0 ? (
                                        <ChevronsUp />
                                    ) : (
                                        <ChevronsDown />
                                    )}{' '}
                                    {roundNumber(cryptoInfo.change_24h?.USD, 2)}
                                    %
                                </div>
                            )}
                        </div>
                    </div>
                )
            )}

            {isLoadingTickerSignals ? (
                <div className="flex items-center justify-center gap-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <Skeleton className="h-6 min-w-16" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <Skeleton className="h-6 min-w-32" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            ) : (
                tickerFirst.length > 0 && (
                    <div className="flex items-center justify-center gap-4 whitespace-nowrap">
                        <Asset
                            asset={tickerFirst[0]}
                            dict={dict}
                            lang={lang}
                            color="#2930CE"
                        />
                        <div className="flex gap-3">
                            <div>
                                {tickerInfoLoading ? (
                                    <Skeleton className="h-6 w-10" />
                                ) : (
                                    currency(
                                        tickerInfo.price?.TOMAN,
                                        'tse',
                                        lang
                                    )
                                )}
                            </div>
                            {tickerInfoLoading ? (
                                <Skeleton className="h-6 min-w-32" />
                            ) : (
                                <div
                                    dir="ltr"
                                    className="flex gap-2"
                                    style={{
                                        color:
                                            tickerInfo.change_24h?.TOMAN > 0
                                                ? 'green'
                                                : 'red',
                                    }}
                                >
                                    {tickerInfo.change_24h?.TOMAN > 0 ? (
                                        <ChevronsUp />
                                    ) : (
                                        <ChevronsDown />
                                    )}{' '}
                                    {roundNumber(
                                        tickerInfo.change_24h?.TOMAN,
                                        2
                                    )}
                                    %
                                </div>
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default TopAssetBox;
