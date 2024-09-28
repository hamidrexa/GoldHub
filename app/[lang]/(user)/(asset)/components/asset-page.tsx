import { cn, getDirection, getLinksLang } from '@/libs/utils';
import React from 'react';
import Image from 'next/image';
import { Price } from '@/app/[lang]/(user)/(asset)/components/price';
import { getDictionary } from '@/get-dictionary';
import { getAsset } from '@/app/[lang]/(user)/(asset)/services/getAsset';
import { Locale } from '@/i18n-config';
import { transformAssetData } from '@/libs/dataTransformers';
import { getMessages } from '@/app/[lang]/(user)/(asset)/services/getMessages';
import { ProductsNavigator } from '@/components/products-navigator';
import { isMobile } from 'react-device-detect';
import { notFound, redirect } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getBookmarksCount } from '@/services/getBookmarksCount';
import { ContentTypes } from '@/constants/content-types';
import { getPrice } from '@/app/[lang]/(user)/(asset)/services/getPrice';
import { getScore } from '@/app/[lang]/(user)/(asset)/services/getScore';
import { Disclaimer } from '@/components/disclaimer';
import { Content } from '@/app/[lang]/(user)/(asset)/components/content';
import { configureServerSideGrowthBook } from '@/app/growthbookServer';
import { getEvents } from '@/app/[lang]/(user)/(asset)/services/getEvents';
import { ServerFollowButton } from '@/app/[lang]/(user)/(asset)/components/server-follow-button';
import { Score } from '@/app/[lang]/(user)/(asset)/components/score';

type PageProps = {
    params: { id: string; lang: Locale; slugs?: string[] };
    market: string;
};

export async function AssetPage({
    params: { id, lang, slugs },
    market,
}: PageProps) {
    const dict = await getDictionary(lang);
    const dir = getDirection(lang);
    const asset = transformAssetData(await getAsset(market, id, { lang }));

    if (!asset) return notFound();
    if (market === 'tse' && !slugs[1])
        return redirect(
            `${getLinksLang(lang)}/ticker/${id}/${encodeURI(`نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${asset.symbol_fa.replace(/ /g, '-')}`)}`
        );
    if (market === 'tse' && /undefined$/.test(slugs[1]))
        return redirect(
            `${getLinksLang(lang)}/ticker/${id}/${encodeURI(`نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${asset.symbol_fa.replace(/ /g, '-')}`)}`
        );
    if (market === 'tse' && slugs[1].includes('%20'))
        return redirect(
            `${getLinksLang(lang)}/ticker/${id}/${encodeURI(`نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${asset.symbol_fa.replace(/ /g, '-')}`)}`
        );
    if (market === 'tse' && slugs[1].includes('%60'))
        return redirect(
            `${getLinksLang(lang)}/ticker/${id}/${encodeURI(`نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${asset.symbol_fa.replace(/ /g, '-')}`)}`
        );

    const messages = await getMessages(
        {
            assets: [asset.asset_id],
            order_by: 'latest',
            assetsignal__values: 'B,S,N',
            page: 1,
            page_size: 10,
        },
        lang
    );
    const [followerCount] = await getBookmarksCount({
        object_ids: [asset.id],
        content_type:
            market === 'tse'
                ? ContentTypes.ticker
                : ContentTypes.cryptocurrency,
    });
    const price = await getPrice(asset.asset_id);
    const gb = await configureServerSideGrowthBook();
    const formulaId = gb.getFeatureValue('asset-formula', null);
    const score = await getScore(
        asset.asset_id,
        {
            ...(process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' && {
                formula_id: formulaId,
            }),
        },
        false,
        market
    );
    const { result: events } =
        market === 'tse' ? await getEvents(id) : { result: null };
    return (
        <>
            <link
                rel="preload"
                href="https://api-gateway.sahmeto.com/api/v1/messages?assets=8042&assetsignal__values=B%2CS%2CN&order_by=latest&page_size=10&publisher__top=true&page=1"
                as="fetch"
                crossOrigin="anonymous"
            />
            <main className="main mb-10 md:mt-10">
                <div className="jumbotron !mt-0 p-0">
                    {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                    <div className="w-full">
                        <div className="relative z-40 flex flex-col items-center justify-start gap-8 bg-white px-4 pt-8 md:bg-transparent md:px-0 md:pt-0">
                            <div
                                className={cn(
                                    'flex w-full flex-col items-start justify-between gap-6 text-base md:flex-row'
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col gap-7">
                                        <div className="flex items-center gap-4 text-neutral-800">
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    className="flex h-7 w-7 rounded-full object-contain md:h-14 md:w-14"
                                                    src={
                                                        asset.image ??
                                                        '/img/no-image.jpg'
                                                    }
                                                    alt={asset.symbol}
                                                    width={56}
                                                    height={56}
                                                    unoptimized
                                                />
                                                <h1 className="text-2xl font-black md:text-3xl">
                                                    {asset.symbol}
                                                </h1>
                                            </div>
                                            <h2 className="hidden whitespace-nowrap text-sm leading-none text-neutral-200 md:block">
                                                {asset.name}
                                            </h2>
                                        </div>
                                        <Price
                                            serverPrice={price}
                                            market={market}
                                            id={asset.asset_id}
                                            dict={dict}
                                            lang={lang}
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full items-end justify-center gap-2.5 md:w-fit md:flex-col md:gap-5">
                                    <ServerFollowButton
                                        dict={dict}
                                        lang={lang}
                                        serverAsset={asset}
                                        id={id}
                                        market={market}
                                    />
                                    {market === 'tse' ? (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div
                                                    className="flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-full border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-xs font-bold text-white md:px-5 md:text-base"
                                                    style={{
                                                        boxShadow:
                                                            '0px 2px 8px 2px rgba(27, 31, 133, 0.30)',
                                                    }}
                                                >
                                                    {dict.buyFromBroker}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="34"
                                                        height="11"
                                                        fill="none"
                                                        viewBox="0 0 34 11"
                                                        className="ltr:rotate-180"
                                                    >
                                                        <g filter="url(#filter0_b_1754_8456)">
                                                            <path
                                                                stroke="#10EDC5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.5"
                                                                d="M5 9.5l-4-4 4-4"
                                                            ></path>
                                                        </g>
                                                        <g filter="url(#filter1_b_1754_8456)">
                                                            <path
                                                                stroke="#10EDC5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.5"
                                                                d="M32.3 5.5H2"
                                                            ></path>
                                                        </g>
                                                        <defs>
                                                            <filter
                                                                id="filter0_b_1754_8456"
                                                                width="26.553"
                                                                height="30.553"
                                                                x="-10.276"
                                                                y="-9.776"
                                                                colorInterpolationFilters="sRGB"
                                                                filterUnits="userSpaceOnUse"
                                                            >
                                                                <feFlood
                                                                    floodOpacity="0"
                                                                    result="BackgroundImageFix"
                                                                ></feFlood>
                                                                <feGaussianBlur
                                                                    in="BackgroundImageFix"
                                                                    stdDeviation="5.263"
                                                                ></feGaussianBlur>
                                                                <feComposite
                                                                    in2="SourceAlpha"
                                                                    operator="in"
                                                                    result="effect1_backgroundBlur_1754_8456"
                                                                ></feComposite>
                                                                <feBlend
                                                                    in="SourceGraphic"
                                                                    in2="effect1_backgroundBlur_1754_8456"
                                                                    result="shape"
                                                                ></feBlend>
                                                            </filter>
                                                            <filter
                                                                id="filter1_b_1754_8456"
                                                                width="52.853"
                                                                height="22.553"
                                                                x="-9.276"
                                                                y="-5.776"
                                                                colorInterpolationFilters="sRGB"
                                                                filterUnits="userSpaceOnUse"
                                                            >
                                                                <feFlood
                                                                    floodOpacity="0"
                                                                    result="BackgroundImageFix"
                                                                ></feFlood>
                                                                <feGaussianBlur
                                                                    in="BackgroundImageFix"
                                                                    stdDeviation="5.263"
                                                                ></feGaussianBlur>
                                                                <feComposite
                                                                    in2="SourceAlpha"
                                                                    operator="in"
                                                                    result="effect1_backgroundBlur_1754_8456"
                                                                ></feComposite>
                                                                <feBlend
                                                                    in="SourceGraphic"
                                                                    in2="effect1_backgroundBlur_1754_8456"
                                                                    result="shape"
                                                                ></feBlend>
                                                            </filter>
                                                        </defs>
                                                    </svg>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <ul>
                                                    <li>
                                                        ✅پرداخت اعتبار سالانه
                                                        تا ۳۰ درصد در بدو ورود
                                                    </li>
                                                    <li>
                                                        ✅پرداخت اعتبار روزانه
                                                        با سود صفر درصد
                                                    </li>
                                                    <li>
                                                        ✅پنل بسیار قوی و پر
                                                        سرعت
                                                    </li>
                                                    <li>
                                                        ✅قابلیت استفاده از
                                                        سامانه پر سرعت استیشن
                                                    </li>
                                                    <li>
                                                        🎁 35 درصد تخفیف سهمتو
                                                        برای تمام طرحها پس از
                                                        تغییر کارگزار
                                                    </li>
                                                </ul>
                                                <a
                                                    rel="nofollow"
                                                    target="_blank"
                                                    href="http://reg.nibi.ir/hoshemali"
                                                    className="flex items-center justify-between gap-3 whitespace-nowrap rounded-md border border-neutral-800 bg-neutral-800 px-3 py-2 text-xs font-bold text-white md:px-5 md:text-base"
                                                    style={{
                                                        boxShadow:
                                                            '0px 2px 8px 2px rgba(27, 31, 133, 0.30)',
                                                    }}
                                                >
                                                    {market === 'tse'
                                                        ? dict.buyFromBroker
                                                        : dict.buyFromExchange}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="34"
                                                        height="11"
                                                        fill="none"
                                                        viewBox="0 0 34 11"
                                                        className="ltr:rotate-180"
                                                    >
                                                        <g filter="url(#filter0_b_1754_8456)">
                                                            <path
                                                                stroke="#10EDC5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.5"
                                                                d="M5 9.5l-4-4 4-4"
                                                            ></path>
                                                        </g>
                                                        <g filter="url(#filter1_b_1754_8456)">
                                                            <path
                                                                stroke="#10EDC5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.5"
                                                                d="M32.3 5.5H2"
                                                            ></path>
                                                        </g>
                                                        <defs>
                                                            <filter
                                                                id="filter0_b_1754_8456"
                                                                width="26.553"
                                                                height="30.553"
                                                                x="-10.276"
                                                                y="-9.776"
                                                                colorInterpolationFilters="sRGB"
                                                                filterUnits="userSpaceOnUse"
                                                            >
                                                                <feFlood
                                                                    floodOpacity="0"
                                                                    result="BackgroundImageFix"
                                                                ></feFlood>
                                                                <feGaussianBlur
                                                                    in="BackgroundImageFix"
                                                                    stdDeviation="5.263"
                                                                ></feGaussianBlur>
                                                                <feComposite
                                                                    in2="SourceAlpha"
                                                                    operator="in"
                                                                    result="effect1_backgroundBlur_1754_8456"
                                                                ></feComposite>
                                                                <feBlend
                                                                    in="SourceGraphic"
                                                                    in2="effect1_backgroundBlur_1754_8456"
                                                                    result="shape"
                                                                ></feBlend>
                                                            </filter>
                                                            <filter
                                                                id="filter1_b_1754_8456"
                                                                width="52.853"
                                                                height="22.553"
                                                                x="-9.276"
                                                                y="-5.776"
                                                                colorInterpolationFilters="sRGB"
                                                                filterUnits="userSpaceOnUse"
                                                            >
                                                                <feFlood
                                                                    floodOpacity="0"
                                                                    result="BackgroundImageFix"
                                                                ></feFlood>
                                                                <feGaussianBlur
                                                                    in="BackgroundImageFix"
                                                                    stdDeviation="5.263"
                                                                ></feGaussianBlur>
                                                                <feComposite
                                                                    in2="SourceAlpha"
                                                                    operator="in"
                                                                    result="effect1_backgroundBlur_1754_8456"
                                                                ></feComposite>
                                                                <feBlend
                                                                    in="SourceGraphic"
                                                                    in2="effect1_backgroundBlur_1754_8456"
                                                                    result="shape"
                                                                ></feBlend>
                                                            </filter>
                                                        </defs>
                                                    </svg>
                                                </a>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <a
                                            rel="nofollow"
                                            target="_blank"
                                            href="https://wallex.ir/signup?ref=ov8ddllm"
                                            className="flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-full border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-xs font-bold text-white md:px-5 md:text-base"
                                            style={{
                                                boxShadow:
                                                    '0px 2px 8px 2px rgba(27, 31, 133, 0.30)',
                                            }}
                                        >
                                            {dict.buyFromExchange}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="34"
                                                height="11"
                                                fill="none"
                                                viewBox="0 0 34 11"
                                                className="ltr:rotate-180"
                                            >
                                                <g filter="url(#filter0_b_1754_8456)">
                                                    <path
                                                        stroke="#10EDC5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        d="M5 9.5l-4-4 4-4"
                                                    ></path>
                                                </g>
                                                <g filter="url(#filter1_b_1754_8456)">
                                                    <path
                                                        stroke="#10EDC5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        d="M32.3 5.5H2"
                                                    ></path>
                                                </g>
                                                <defs>
                                                    <filter
                                                        id="filter0_b_1754_8456"
                                                        width="26.553"
                                                        height="30.553"
                                                        x="-10.276"
                                                        y="-9.776"
                                                        colorInterpolationFilters="sRGB"
                                                        filterUnits="userSpaceOnUse"
                                                    >
                                                        <feFlood
                                                            floodOpacity="0"
                                                            result="BackgroundImageFix"
                                                        ></feFlood>
                                                        <feGaussianBlur
                                                            in="BackgroundImageFix"
                                                            stdDeviation="5.263"
                                                        ></feGaussianBlur>
                                                        <feComposite
                                                            in2="SourceAlpha"
                                                            operator="in"
                                                            result="effect1_backgroundBlur_1754_8456"
                                                        ></feComposite>
                                                        <feBlend
                                                            in="SourceGraphic"
                                                            in2="effect1_backgroundBlur_1754_8456"
                                                            result="shape"
                                                        ></feBlend>
                                                    </filter>
                                                    <filter
                                                        id="filter1_b_1754_8456"
                                                        width="52.853"
                                                        height="22.553"
                                                        x="-9.276"
                                                        y="-5.776"
                                                        colorInterpolationFilters="sRGB"
                                                        filterUnits="userSpaceOnUse"
                                                    >
                                                        <feFlood
                                                            floodOpacity="0"
                                                            result="BackgroundImageFix"
                                                        ></feFlood>
                                                        <feGaussianBlur
                                                            in="BackgroundImageFix"
                                                            stdDeviation="5.263"
                                                        ></feGaussianBlur>
                                                        <feComposite
                                                            in2="SourceAlpha"
                                                            operator="in"
                                                            result="effect1_backgroundBlur_1754_8456"
                                                        ></feComposite>
                                                        <feBlend
                                                            in="SourceGraphic"
                                                            in2="effect1_backgroundBlur_1754_8456"
                                                            result="shape"
                                                        ></feBlend>
                                                    </filter>
                                                </defs>
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="flex w-full items-center justify-center gap-14 px-10 md:justify-start">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-3xl font-bold">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="none"
                                            viewBox="0 0 19 18"
                                        >
                                            <g filter="url(#filter0_b_2625_10246)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M13.193 7.975a3.03 3.03 0 100-6.06"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter1_b_2625_10246)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M14.587 11.267c.5.034.996.105 1.486.214.679.135 1.497.413 1.787 1.023.186.39.186.845 0 1.236-.29.609-1.108.887-1.787 1.027"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter2_b_2625_10246)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M7.286 11.919c3.391 0 6.288.514 6.288 2.566 0 2.053-2.878 2.584-6.288 2.584-3.39 0-6.286-.513-6.286-2.566s2.877-2.584 6.286-2.584z"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter3_b_2625_10246)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M7.286 8.99a4.014 4.014 0 01-4.028-4.03A4.014 4.014 0 017.286.932a4.015 4.015 0 014.03 4.028 4.015 4.015 0 01-4.03 4.03z"
                                                ></path>
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_2625_10246"
                                                    width="25.582"
                                                    height="28.612"
                                                    x="1.917"
                                                    y="-9.361"
                                                    colorInterpolationFilters="sRGB"
                                                    filterUnits="userSpaceOnUse"
                                                >
                                                    <feFlood
                                                        floodOpacity="0"
                                                        result="BackgroundImageFix"
                                                    ></feFlood>
                                                    <feGaussianBlur
                                                        in="BackgroundImageFix"
                                                        stdDeviation="5.263"
                                                    ></feGaussianBlur>
                                                    <feComposite
                                                        in2="SourceAlpha"
                                                        operator="in"
                                                        result="effect1_backgroundBlur_2625_10246"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2625_10246"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter1_b_2625_10246"
                                                    width="25.965"
                                                    height="26.053"
                                                    x="3.311"
                                                    y="-0.01"
                                                    colorInterpolationFilters="sRGB"
                                                    filterUnits="userSpaceOnUse"
                                                >
                                                    <feFlood
                                                        floodOpacity="0"
                                                        result="BackgroundImageFix"
                                                    ></feFlood>
                                                    <feGaussianBlur
                                                        in="BackgroundImageFix"
                                                        stdDeviation="5.263"
                                                    ></feGaussianBlur>
                                                    <feComposite
                                                        in2="SourceAlpha"
                                                        operator="in"
                                                        result="effect1_backgroundBlur_2625_10246"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2625_10246"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter2_b_2625_10246"
                                                    width="35.127"
                                                    height="27.703"
                                                    x="-10.276"
                                                    y="0.643"
                                                    colorInterpolationFilters="sRGB"
                                                    filterUnits="userSpaceOnUse"
                                                >
                                                    <feFlood
                                                        floodOpacity="0"
                                                        result="BackgroundImageFix"
                                                    ></feFlood>
                                                    <feGaussianBlur
                                                        in="BackgroundImageFix"
                                                        stdDeviation="5.263"
                                                    ></feGaussianBlur>
                                                    <feComposite
                                                        in2="SourceAlpha"
                                                        operator="in"
                                                        result="effect1_backgroundBlur_2625_10246"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2625_10246"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter3_b_2625_10246"
                                                    width="30.611"
                                                    height="30.611"
                                                    x="-8.018"
                                                    y="-10.345"
                                                    colorInterpolationFilters="sRGB"
                                                    filterUnits="userSpaceOnUse"
                                                >
                                                    <feFlood
                                                        floodOpacity="0"
                                                        result="BackgroundImageFix"
                                                    ></feFlood>
                                                    <feGaussianBlur
                                                        in="BackgroundImageFix"
                                                        stdDeviation="5.263"
                                                    ></feGaussianBlur>
                                                    <feComposite
                                                        in2="SourceAlpha"
                                                        operator="in"
                                                        result="effect1_backgroundBlur_2625_10246"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2625_10246"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                        {followerCount?.count || 0}
                                    </div>
                                    <span className="text-xs font-medium text-slate-500">
                                        {dict.followers}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-5 w-full rounded-lg border border-neutral-100 bg-white px-2.5 py-8 md:px-5">
                                <Score
                                    dict={dict}
                                    lang={lang}
                                    asset={asset}
                                    id={id}
                                    market={market}
                                    serverScore={score}
                                    formulaId={formulaId}
                                />
                            </div>
                        </div>
                        <Content
                            id={id}
                            asset={asset}
                            dict={dict}
                            market={market}
                            lang={lang}
                            messages={messages}
                            events={events}
                        />
                        <Disclaimer />
                    </div>
                </div>
            </main>
            <script
                id="breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org/',
                        '@type': 'BreadcrumbList',
                        name: dict.breadcrumbTitle,
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                item: {
                                    '@id': 'https://sahmeto.com',
                                    name: dict.sahmeto,
                                },
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                item: {
                                    '@id':
                                        market === 'tse'
                                            ? `https://sahmeto.com${getLinksLang(lang)}/ticker/${asset.ticker_index}/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${asset.symbol}`
                                            : `https://sahmeto.com${getLinksLang(
                                                  lang
                                              )}/coins/${asset.symbol}`,
                                    name: asset.symbol,
                                },
                            },
                        ],
                    }),
                }}
            />
            <script
                id="faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        name: dict.faqTitle,
                        mainEntity: [
                            {
                                '@type': 'Question',
                                name: dict.faqQuestion1,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: dict.faqAnswer1,
                                },
                            },
                            {
                                '@type': 'Question',
                                name: dict.faqQuestion2,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: dict.faqAnswer2,
                                },
                            },
                        ],
                    }),
                }}
            />
        </>
    );
}
