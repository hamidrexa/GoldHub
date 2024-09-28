'use client';
import { Locale } from '@/i18n-config';
import SuggestedAsset from '@/app/[lang]/(user)/signals/components/suggested-asset';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/spinner';
import { useLastRun } from '@/app/[lang]/(user)/signals/services/use-last-run';

type wrapperProps = {
    dict: any;
    lang: Locale;
    assets: any;
};

export default function SuggestedAssetsWrapper({
    dict,
    lang,
    assets,
}: wrapperProps) {
    const [nextUpdate, setNextUpdate] = useState(null);
    const [lastUpdate, setLastUpdate] = useState({ last: null, next: null });
    const [updateTime, setUpdateTime] = useState(null);
    const [trigger, setTrigger] = useState(false);
    const { res } = useLastRun(trigger);

    useEffect(() => {
        setNextUpdate(lastUpdate.last);
        setUpdateTime(lastUpdate.next);
    }, [lastUpdate.next]);

    useEffect(() => {
        if (res) {
            setLastUpdate({
                last: res[Object.keys(res)[0]],
                next: res[Object.keys(res)[1]],
            });
        }
    }, [res]);

    useEffect(() => {
        const interval = setInterval(() => {
            setUpdateTime((state) => state - 1);
            setNextUpdate((state) => {
                const newState = state - 1;
                if (!!newState && newState > 0) return newState;
                else setTrigger(!trigger);
            });
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const getTimer = () => {
        return (
            <div className="flex items-center">
                <div>آپدیت بعدی:</div>
                {nextUpdate <= 60 ? (
                    <span>{Math.ceil(nextUpdate)}ثانیه</span>
                ) : (
                    updateTime && (
                        <span>
                            {' '}
                            {Math.ceil(nextUpdate / 60)}
                            دقیقه
                        </span>
                    )
                )}
            </div>
        );
    };

    return (
        <div className="flex w-full flex-col rounded-lg">
            <div className="w-full rounded-lg">
                <div className="flex w-full flex-col items-center justify-center gap-2 rounded-t-lg bg-neutral-400 py-5 text-base font-black text-white md:flex-row md:justify-between md:px-8">
                    <h2>بهترین نماد‌های توصیه شده به خرید از شبکه اجتماعی</h2>
                    <div className="font-normal">
                        {!!nextUpdate ? (
                            getTimer()
                        ) : (
                            <Spinner width={20} height={20} />
                        )}
                    </div>
                </div>
                <h4 className="bg-blue-900 px-8 py-2 text-base text-white">
                    ارز دیجیتال
                </h4>
                {!assets?.crypto?.buy.length && (
                    <div>داده ای برای نمایش وجود ندارد.</div>
                )}
                {assets?.crypto?.buy.map((coin, cryptoBuyIndex) => (
                    <div key={cryptoBuyIndex}>
                        <SuggestedAsset
                            assetType="crypto"
                            buySignal
                            textColor="#FEC925"
                            asset={coin}
                            index={cryptoBuyIndex}
                            dict={dict}
                            lang={lang}
                        />
                    </div>
                ))}
                <h4 className="bg-blue-900 px-8 py-2  text-base text-white">
                    بورس
                </h4>
                {!assets?.ticker?.buy.length && (
                    <div>داده ای برای نمایش وجود ندارد.</div>
                )}
                {assets?.ticker?.buy.map((ticker, tickerBuyIndex) => (
                    <div key={tickerBuyIndex}>
                        <SuggestedAsset
                            assetType="ticker"
                            buySignal
                            textColor="#07BB61"
                            asset={ticker}
                            index={tickerBuyIndex}
                            dict={dict}
                            lang={lang}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-10 w-full rounded-lg">
                <div className="flex w-full flex-col items-center justify-center gap-2 rounded-t-lg bg-neutral-200 py-5 text-base font-black text-white md:flex-row md:justify-between md:px-8">
                    <h2>بهترین نماد‌های توصیه شده به فروش از شبکه اجتماعی</h2>
                    <div className="font-normal">
                        {!!nextUpdate ? (
                            getTimer()
                        ) : (
                            <Spinner width={20} height={20} />
                        )}
                    </div>
                </div>
                <h4 className="bg-neutral-600 px-8 py-2 text-base text-white">
                    ارز دیجیتال
                </h4>
                {!assets?.crypto?.sell.length && (
                    <div>داده ای برای نمایش وجود ندارد.</div>
                )}
                {assets?.crypto?.sell.map((coin, cryptoSellIndex) => (
                    <div key={cryptoSellIndex}>
                        <SuggestedAsset
                            assetType="crypto"
                            textColor="#FEC925"
                            asset={coin}
                            index={cryptoSellIndex}
                            dict={dict}
                            lang={lang}
                        />
                    </div>
                ))}
                <h4 className="w-full bg-neutral-600 px-8 py-2 text-base text-white">
                    بورس
                </h4>
                {!assets?.ticker?.sell.length && (
                    <div className="w-full">داده ای برای نمایش وجود ندارد.</div>
                )}
                {assets?.ticker?.sell.map((ticker, tickerSellIndex) => (
                    <div key={tickerSellIndex}>
                        <SuggestedAsset
                            assetType="ticker"
                            textColor="#07BB61"
                            asset={ticker}
                            index={tickerSellIndex}
                            dict={dict}
                            lang={lang}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
