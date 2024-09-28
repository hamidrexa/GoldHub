import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { ProductsNavigator } from '@/components/products-navigator';
import {
    cn,
    convertDateToHumanTime,
    getDirection,
    roundNumber,
} from '@/libs/utils';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { getPublisher } from '@/app/[lang]/(user)/publisher/services/getPublisher';
import { isMobile } from 'react-device-detect';
import Sparkline from '@/components/sparkline';
import { Badge } from '@/components/ui/badge';
import { getRankHistory } from '@/app/[lang]/(user)/publisher/services/getRankHistory';
import Image from 'next/image';
import stringFormatter from '@/libs/stringFormatter';
import { getScore } from '@/app/[lang]/(user)/publisher/services/getScore';
import { getMessages } from '@/app/[lang]/(user)/(asset)/services/getMessages';
import { getMetrics } from '@/app/[lang]/(user)/publisher/services/getMetrics';
import { getCurrentMonthPerformance } from '@/app/[lang]/(user)/publisher/services/getCurrentMonthPerformance';
import { getBookmarksCount } from '@/services/getBookmarksCount';
import { ContentTypes } from '@/constants/content-types';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { notFound } from 'next/navigation';
import { getTopPublishers } from '@/app/[lang]/(user)/leaderboard/services/getTopPublishers';
import { Disclaimer } from '@/components/disclaimer';
import { getMessagesCount } from '@/app/[lang]/(user)/publisher/services/getMessagesCount';
import { Head } from '../components/head';
import { Content } from '@/app/[lang]/(user)/publisher/components/content';
import AnnouncementAlert from '@/components/announcement-alert';

type Props = {
    params: { id: string; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};
type PageProps = {
    params: { id: string; lang: Locale };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(params.lang);
    const publisher = await getPublisher(params.id);
    if (!publisher) return {};
    const seoTitle = `${publisher.name} | ${dict.publisherPageTitle}`;
    const seoDescription = `تحلیل عمکلرد و بازدهی سهام پیشنهادی کانال ${publisher.name} و ارائه سیگنال های خرید و فروش تکنیکالی و بنیادی سهام بورسی به وسیله هوش مصنوعی . اعتبار سنجی و رتبه دهی`;

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
        },
        alternates: {
            canonical: `https://sahmeto.com/publisher/${params.id}`,
        },
    };
}

export const revalidate = 1800;

export default async function PublisherPage({
    params: { id, lang },
}: PageProps) {
    const dir = getDirection(lang);
    const dict = await getDictionary(lang);
    const publisher = await getPublisher(id);
    if (!publisher) notFound();
    const rankHistory = await getRankHistory(id);
    const score = await getScore(id);
    const [publisherFollowerCount] = await getBookmarksCount({
        object_ids: [publisher.id],
        content_type: ContentTypes.publisher,
    });
    const metrics = await getMetrics(id, {
        date_range: 30,
    });
    const messagesCount = await getMessagesCount(id);
    const currentMonthPerformance = await getCurrentMonthPerformance(id);
    const messages = await getMessages(
        {
            publishers: [publisher.id],
            order_by: 'latest',
            assetsignal__values: 'B,S,N',
            page: 1,
            page_size: 10,
        },
        lang
    );
    // const comments = await getComments('publisher', publisher.id);
    const PublisherType = {
        analytical: {
            badgeType: 'light',
            title: 'خبری',
        },
        cryptocurrency: {
            badgeType: 'warning',
            title: 'ارزدیجیتال',
        },
        signal: {
            badgeType: 'default',
            title: dict.tse,
        },
    };
    const rankDiff = score.yesterday_rank && score.yesterday_rank - score.rank;
    const analysisPower = metrics.recommended_tickers.buy_analysis_power * 5;
    const market = publisher.publisher_type === 'signal' ? 'tse' : 'crypto';
    const isAnalytical = publisher.publisher_type === 'analytical';

    return (
        <>
            <AnnouncementAlert dict={dict} lang={lang} page="trader" />
            <main className="main">
                <div className="jumbotron">
                    {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                    <div className="w-full">
                        <div className="flex flex-col gap-6 bg-white p-4 md:gap-5 md:bg-transparent">
                            <Head
                                dict={dict}
                                lang={lang}
                                id={id}
                                purePublisher={publisher}
                            />
                            <div className="order-3 grid w-fit grid-rows-3 gap-6 md:order-1 md:grid-cols-3 md:grid-rows-none md:gap-10 md:rounded-lg md:border md:border-neutral-100 md:bg-white md:px-14 md:py-5">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="19"
                                            height="19"
                                            fill="none"
                                            viewBox="0 0 19 19"
                                        >
                                            <g filter="url(#filter0_b_2495_8380)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M13.193 8.736a3.03 3.03 0 100-6.06"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter1_b_2495_8380)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M14.588 12.029c.5.034.996.105 1.486.214.679.135 1.497.413 1.787 1.022.186.391.186.846 0 1.236-.29.61-1.108.888-1.787 1.028"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter2_b_2495_8380)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M7.286 12.68c3.391 0 6.288.515 6.288 2.567s-2.878 2.584-6.288 2.584C3.896 17.83 1 17.318 1 15.265s2.877-2.584 6.286-2.584z"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter3_b_2495_8380)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M7.286 9.752a4.014 4.014 0 01-4.028-4.03 4.014 4.014 0 014.028-4.028 4.015 4.015 0 014.03 4.028 4.015 4.015 0 01-4.03 4.03z"
                                                ></path>
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_2495_8380"
                                                    width="25.582"
                                                    height="28.612"
                                                    x="1.917"
                                                    y="-8.6"
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
                                                        result="effect1_backgroundBlur_2495_8380"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8380"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter1_b_2495_8380"
                                                    width="25.965"
                                                    height="26.053"
                                                    x="3.312"
                                                    y="0.752"
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
                                                        result="effect1_backgroundBlur_2495_8380"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8380"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter2_b_2495_8380"
                                                    width="35.127"
                                                    height="27.702"
                                                    x="-10.276"
                                                    y="1.405"
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
                                                        result="effect1_backgroundBlur_2495_8380"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8380"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter3_b_2495_8380"
                                                    width="30.611"
                                                    height="30.611"
                                                    x="-8.018"
                                                    y="-9.583"
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
                                                        result="effect1_backgroundBlur_2495_8380"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8380"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                        <span className="text-slate-500 md:hidden">
                                            {dict.followersNumber}:
                                        </span>
                                        {publisherFollowerCount && (
                                            <span className="text-2xl font-bold leading-5">
                                                {publisherFollowerCount.count}
                                            </span>
                                        )}
                                    </div>
                                    <span className="hidden text-slate-500 md:inline-block">
                                        {dict.followersNumber}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="18"
                                            fill="none"
                                            viewBox="0 0 17 18"
                                        >
                                            <g filter="url(#filter0_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M1.674 6.686h14.259"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter1_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M12.352 9.81h.007"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter2_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M8.803 9.81h.008"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter3_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M5.246 9.81h.008"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter4_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M12.352 12.92h.007"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter5_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M8.803 12.92h.008"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter6_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M5.246 12.92h.008"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter7_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M12.035.762v2.633"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter8_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M5.57.762v2.633"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter9_b_2495_8362)">
                                                <path
                                                    stroke="#0C0E3C"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M12.19 2.026H5.416C3.067 2.026 1.6 3.334 1.6 5.74v7.24c0 2.443 1.467 3.782 3.816 3.782h6.767c2.357 0 3.817-1.316 3.817-3.722v-7.3c.007-2.406-1.453-3.714-3.81-3.714z"
                                                ></path>
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_2495_8362"
                                                    width="36.812"
                                                    height="22.553"
                                                    x="-9.602"
                                                    y="-4.591"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter1_b_2495_8362"
                                                    width="22.56"
                                                    height="22.553"
                                                    x="1.075"
                                                    y="-1.466"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter2_b_2495_8362"
                                                    width="22.56"
                                                    height="22.553"
                                                    x="-2.474"
                                                    y="-1.466"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter3_b_2495_8362"
                                                    width="22.56"
                                                    height="22.553"
                                                    x="-6.03"
                                                    y="-1.466"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter4_b_2495_8362"
                                                    width="22.56"
                                                    height="22.553"
                                                    x="1.075"
                                                    y="1.643"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter5_b_2495_8362"
                                                    width="22.56"
                                                    height="22.553"
                                                    x="-2.474"
                                                    y="1.643"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter6_b_2495_8362"
                                                    width="22.56"
                                                    height="22.553"
                                                    x="-6.03"
                                                    y="1.643"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter7_b_2495_8362"
                                                    width="22.553"
                                                    height="25.185"
                                                    x="0.759"
                                                    y="-10.514"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter8_b_2495_8362"
                                                    width="22.553"
                                                    height="25.185"
                                                    x="-5.706"
                                                    y="-10.514"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter9_b_2495_8362"
                                                    width="36.953"
                                                    height="37.289"
                                                    x="-9.677"
                                                    y="-9.251"
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
                                                        result="effect1_backgroundBlur_2495_8362"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2495_8362"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                        <span className="text-slate-500 md:hidden">
                                            {dict.registerDate} :
                                        </span>
                                        <span className="text-sm font-bold leading-5">
                                            {convertDateToHumanTime(
                                                dict,
                                                lang,
                                                publisher.first_signals_datetime.all
                                            )}
                                        </span>
                                    </div>
                                    <span className="hidden text-slate-500 md:inline-block">
                                        {dict.registerDate}
                                    </span>
                                </div>
                                <div className="hidden flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="19"
                                            height="19"
                                            fill="none"
                                            viewBox="0 0 19 19"
                                        >
                                            <path
                                                stroke="#0C0E3C"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M2.85 16.512c2.25 0 5.25-.75 5.25-6v-6c0-.937-.567-1.513-1.5-1.5h-3c-.938 0-1.5.563-1.5 1.48v4.52c0 .938.562 1.5 1.5 1.5.75 0 .75 0 .75.75v.75c0 .75-.75 1.5-1.5 1.5s-.75.006-.75.773v1.477c0 .75 0 .75.75.75zM11.85 16.512c2.25 0 5.25-.75 5.25-6v-6c0-.937-.568-1.513-1.5-1.5h-3c-.938 0-1.5.563-1.5 1.48v4.52c0 .938.562 1.5 1.5 1.5h.562c0 1.688.188 3-2.062 3v2.25c0 .75 0 .75.75.75z"
                                            ></path>
                                        </svg>
                                        <span className="text-slate-500 md:hidden">
                                            نظرات کاربران:
                                        </span>
                                        <span className="text-sm font-bold leading-5">
                                            42 نظر
                                        </span>
                                    </div>
                                    <span className="hidden text-slate-500 md:inline-block">
                                        نظرات کاربران
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="19"
                                            height="19"
                                            fill="none"
                                            viewBox="0 0 19 19"
                                        >
                                            <g
                                                stroke="#0C0E3C"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                clipPath="url(#clip0_2495_8351)"
                                            >
                                                <path d="M9.6 17.262a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM2.1 9.762h15"></path>
                                                <path d="M9.6 2.262a11.475 11.475 0 013 7.5 11.475 11.475 0 01-3 7.5 11.475 11.475 0 01-3-7.5 11.475 11.475 0 013-7.5z"></path>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2495_8351">
                                                    <path
                                                        fill="#fff"
                                                        d="M0 0H18V18H0z"
                                                        transform="translate(.6 .762)"
                                                    ></path>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <span className="text-slate-500 md:hidden">
                                            {dict.traderSocialMedia} :
                                        </span>
                                        <Link
                                            href={publisher.social_link ?? '#'}
                                            target={
                                                publisher.social_link
                                                    ? '_blank'
                                                    : '_self'
                                            }
                                            rel="nofollow"
                                            className="text-sm font-bold leading-5"
                                        >
                                            <Image
                                                className="mx-1 h-4 w-auto"
                                                src={
                                                    dict.messagesSourceType[
                                                        publisher.account_type
                                                    ]?.logo
                                                }
                                                width={100}
                                                height={50}
                                                alt="refrence"
                                            />
                                        </Link>
                                    </div>
                                    <span className="hidden text-slate-500 md:inline-block">
                                        {dict.traderSocialMedia}
                                    </span>
                                </div>
                            </div>
                            <div className="order-2 flex items-center gap-2.5 overflow-auto whitespace-nowrap">
                                <Badge
                                    variant={
                                        PublisherType[publisher.publisher_type]
                                            .badgeType
                                    }
                                >
                                    {
                                        PublisherType[publisher.publisher_type]
                                            .title
                                    }
                                </Badge>
                                {!!score.rank && score.rank <= 100 && (
                                    <Badge variant="light">
                                        {stringFormatter(
                                            dict.amongNTopTraders,
                                            {
                                                rank:
                                                    Math.ceil(score.rank / 10) *
                                                    10,
                                            }
                                        )}
                                    </Badge>
                                )}
                            </div>
                            {!isAnalytical && (
                                <>
                                    <div className="relative order-1 -mx-4 md:order-3 md:mx-0">
                                        <div className="mx-auto max-w-sm">
                                            <div className="absolute left-1/2 top-0 z-30 flex -translate-x-1/2 flex-col items-center justify-center">
                                                <div className="flex items-center justify-center gap-3 text-5xl font-black">
                                                    {score.rank}
                                                    {!!rankDiff && (
                                                        <div
                                                            className={cn(
                                                                'flex items-center gap-0.5 text-sm font-medium',
                                                                rankDiff > 0
                                                                    ? 'text-teal-400'
                                                                    : 'text-pink-600'
                                                            )}
                                                            dir="ltr"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="13"
                                                                height="9"
                                                                viewBox="0 0 13 9"
                                                                fill="none"
                                                            >
                                                                {rankDiff >
                                                                0 ? (
                                                                    <path
                                                                        d="M6.5 0.762207L12.1292 8.26221H0.870835L6.5 0.762207Z"
                                                                        fill="currentColor"
                                                                    />
                                                                ) : (
                                                                    <path
                                                                        d="M6 8L0.370835 0.499999L11.6292 0.5L6 8Z"
                                                                        fill="currentColor"
                                                                    />
                                                                )}
                                                            </svg>
                                                            {rankDiff}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-base font-medium">
                                                    {stringFormatter(
                                                        dict.rankAmong,
                                                        {
                                                            number: score.all_member,
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                            <Sparkline
                                                market={market}
                                                tooltip={false}
                                                name={dict.rank}
                                                lang={lang}
                                                color="#10EDC5"
                                                xDataKey="date"
                                                yDataKey="rank"
                                                data={rankHistory.map(
                                                    (rank) => ({
                                                        ...rank,
                                                        rank:
                                                            score.all_member -
                                                            rank.rank,
                                                    })
                                                )}
                                                width="100%"
                                                height={125}
                                            />
                                        </div>
                                    </div>
                                    <div className="order-4 w-full rounded-lg bg-gradient-to-r from-[#217263] to-[#1F3D89] p-0.5">
                                        <div className="flex h-full w-full flex-col items-center justify-between gap-2 rounded-md bg-white py-6 md:flex-row">
                                            <div className="w-full flex-col items-center justify-center md:w-1/2">
                                                <div className="flex justify-center gap-2.5">
                                                    <Icons.lineChart stroke="#0C0E3C" />
                                                    <span
                                                        className={cn(
                                                            'text-3xl font-bold',
                                                            currentMonthPerformance.performance *
                                                                100 >
                                                                0
                                                                ? 'text-teal-700'
                                                                : 'text-pink-600'
                                                        )}
                                                        dir="ltr"
                                                    >
                                                        {roundNumber(
                                                            currentMonthPerformance.performance *
                                                                100
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="flex justify-center text-lg font-semibold">
                                                    {
                                                        dict.traderMonthPerformance
                                                    }
                                                </div>
                                            </div>
                                            <div className="w-full flex-col items-center justify-center md:w-1/2">
                                                <div className="flex justify-center text-lg text-gray-700">
                                                    <span className="md:invisible">
                                                        (
                                                    </span>
                                                    {
                                                        dict.top100traderMonthPerformance
                                                    }{' '}
                                                    :
                                                    <span
                                                        className="font-bold text-gray-700 md:text-black"
                                                        dir="ltr"
                                                    >
                                                        {roundNumber(
                                                            currentMonthPerformance.top_traders_monthly_performance_average *
                                                                100
                                                        )}
                                                        %
                                                    </span>
                                                    <span className="md:invisible">
                                                        )
                                                    </span>
                                                </div>
                                                <div className="flex justify-center text-lg text-gray-700">
                                                    <span className="md:invisible">
                                                        (
                                                    </span>
                                                    {market === 'tse'
                                                        ? dict.totalIndexMonthPerformance
                                                        : dict.totalBTCMonthPerformance}{' '}
                                                    :
                                                    <span
                                                        className="font-bold text-gray-700 md:text-black"
                                                        dir="ltr"
                                                    >
                                                        {roundNumber(
                                                            currentMonthPerformance.index_monthly_performance_average *
                                                                100
                                                        )}
                                                        %
                                                    </span>
                                                    <span className="md:invisible">
                                                        )
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="order-5 w-full rounded-lg bg-gradient-to-r from-[#217263] to-[#1F3D89] p-0.5">
                                        <div className="flex h-full w-full items-center justify-between rounded-md bg-white py-5">
                                            <div className="order-2 flex w-1/3 items-center justify-center text-center text-base font-bold md:w-1/4">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="19"
                                                    height="33"
                                                    fill="none"
                                                    viewBox="0 0 19 33"
                                                    className="ltr:order-3"
                                                >
                                                    <g clipPath="url(#clip0_2925_10037)">
                                                        <mask
                                                            id="mask0_2925_10037"
                                                            style={{
                                                                maskType:
                                                                    'luminance',
                                                            }}
                                                            width="19"
                                                            height="33"
                                                            x="0"
                                                            y="0"
                                                            maskUnits="userSpaceOnUse"
                                                        >
                                                            <path
                                                                fill="#fff"
                                                                d="M.134.763h18.823v32H.134v-32z"
                                                            ></path>
                                                        </mask>
                                                        <g
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            mask="url(#mask0_2925_10037)"
                                                        >
                                                            <path
                                                                fill="#222"
                                                                d="M3.92 26.18l.662-.963-1.703-.805-.662.962c-1.472 2.14-.759 4.775 1.592 5.887.745.353 1.6.521 2.478.488l.318-.011.074-1.745-.317.012a3.207 3.207 0 01-1.487-.293c-1.41-.668-1.838-2.249-.955-3.533z"
                                                            ></path>
                                                            <path
                                                                fill="#F7F7F7"
                                                                d="M11.085 10.997c-1.757-1.273-2.6-2.747-2.528-4.422.072-1.676 1.044-3.217 2.916-4.625 1.757 1.273 2.6 2.747 2.528 4.423-.071 1.675-1.043 3.217-2.915 4.624z"
                                                            ></path>
                                                            <path
                                                                fill="#222"
                                                                d="M12.214 1.252c-.363-.263-.913-.243-1.3.048C8.87 2.837 7.701 4.612 7.616 6.603c-.085 1.99.935 3.684 2.854 5.074.363.263.913.242 1.3-.048 2.044-1.537 3.213-3.313 3.298-5.303.085-1.99-.935-3.684-2.854-5.074zm-.73 1.879c1.145 1.015 1.627 2.103 1.577 3.27-.05 1.166-.627 2.293-1.862 3.397-1.143-1.015-1.625-2.104-1.575-3.27.05-1.166.626-2.294 1.86-3.397z"
                                                            ></path>
                                                            <path
                                                                fill="#F7F7F7"
                                                                d="M3.729 24.815c1.549-1.7 3.247-2.584 5.096-2.652 1.848-.07 3.477.692 4.885 2.282-1.55 1.7-3.248 2.584-5.096 2.653-1.849.068-3.477-.692-4.885-2.283z"
                                                            ></path>
                                                            <path
                                                                fill="#222"
                                                                d="M14.504 24.941c.297-.326.316-.769.046-1.074-1.53-1.728-3.416-2.672-5.662-2.588-2.245.083-4.218 1.17-5.902 3.017-.297.326-.316.77-.046 1.074 1.531 1.729 3.417 2.672 5.662 2.589 2.246-.084 4.218-1.17 5.902-3.018zm-2.083-.459c-1.235 1.161-2.48 1.685-3.744 1.732-1.265.047-2.468-.386-3.608-1.459 1.235-1.16 2.48-1.684 3.744-1.732 1.265-.046 2.469.387 3.608 1.46z"
                                                            ></path>
                                                            <path
                                                                fill="#F7F7F7"
                                                                d="M8.732 21.467c.463-2.109 1.513-3.612 3.15-4.509 1.636-.897 3.533-1.01 5.688-.336-.463 2.109-1.512 3.612-3.149 4.509-1.637.897-3.533 1.009-5.689.336z"
                                                            ></path>
                                                            <path
                                                                fill="#222"
                                                                d="M18.618 16.707c.088-.405-.153-.788-.582-.922-2.36-.737-4.598-.653-6.579.433-1.972 1.08-3.149 2.858-3.65 5.14-.089.405.153.787.582.921 2.36.737 4.598.654 6.579-.432 1.972-1.081 3.149-2.859 3.65-5.14zm-2.162.521c-.48 1.53-1.326 2.541-2.46 3.163-1.117.612-2.43.8-4.027.446.48-1.53 1.326-2.542 2.46-3.163 1.117-.613 2.43-.8 4.027-.446z"
                                                            ></path>
                                                            <path
                                                                fill="#F7F7F7"
                                                                d="M11.5 16.39c-.746-1.953-.627-3.672.36-5.157.986-1.486 2.642-2.44 4.967-2.865.747 1.953.628 3.672-.358 5.157-.987 1.485-2.643 2.44-4.968 2.864z"
                                                            ></path>
                                                            <path
                                                                fill="#222"
                                                                d="M17.748 8.045c-.149-.389-.605-.607-1.086-.52-2.552.466-4.517 1.551-5.698 3.329-1.175 1.77-1.264 3.762-.454 5.88.15.389.606.608 1.086.52 2.552-.466 4.518-1.55 5.698-3.328 1.175-1.77 1.265-3.763.454-5.88zM16.07 9.424c.398 1.465.192 2.685-.496 3.722-.68 1.023-1.767 1.775-3.386 2.21-.398-1.466-.192-2.686.496-3.723.68-1.023 1.767-1.775 3.386-2.21z"
                                                            ></path>
                                                        </g>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2925_10037">
                                                            <path
                                                                fill="#fff"
                                                                d="M0 0H18.823V32.001H0z"
                                                                transform="translate(.133 .762)"
                                                            ></path>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <span className="text-sm md:text-xl ltr:order-2">
                                                    {dict.analysisPower}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="21"
                                                    height="33"
                                                    fill="none"
                                                    viewBox="0 0 21 33"
                                                    className="ltr:order-1"
                                                >
                                                    <g clipPath="url(#clip0_2925_10022)">
                                                        <mask
                                                            id="mask0_2925_10022"
                                                            style={{
                                                                maskType:
                                                                    'luminance',
                                                            }}
                                                            width="20"
                                                            height="33"
                                                            x="0"
                                                            y="0"
                                                            maskUnits="userSpaceOnUse"
                                                        >
                                                            <path
                                                                fill="#fff"
                                                                d="M19.41.763H.585v32h18.823v-32z"
                                                            ></path>
                                                        </mask>
                                                        <g
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            mask="url(#mask0_2925_10022)"
                                                        >
                                                            <path
                                                                fill="#222"
                                                                d="M15.623 26.18l-.662-.963 1.703-.805.662.962c1.471 2.14.758 4.776-1.593 5.888-.745.352-1.599.52-2.477.488l-.318-.012-.075-1.745.318.012c.527.02 1.04-.081 1.487-.293 1.41-.667 1.838-2.249.955-3.532z"
                                                            ></path>
                                                            <path
                                                                fill="#F7F7F7"
                                                                d="M8.457 10.998c1.758-1.273 2.6-2.748 2.529-4.423-.072-1.676-1.044-3.217-2.916-4.625-1.758 1.273-2.6 2.747-2.529 4.423.072 1.675 1.044 3.217 2.916 4.625z"
                                                            ></path>
                                                            <path
                                                                fill="#222"
                                                                d="M7.328 1.252c.362-.263.913-.243 1.3.048 2.044 1.537 3.212 3.312 3.298 5.303.085 1.99-.935 3.684-2.854 5.074-.363.263-.914.243-1.3-.048-2.045-1.537-3.213-3.312-3.298-5.303-.086-1.99.935-3.684 2.854-5.074zm.729 1.879C6.913 4.146 6.43 5.235 6.48 6.401c.05 1.166.627 2.294 1.861 3.397 1.144-1.015 1.626-2.104 1.576-3.27-.05-1.166-.627-2.294-1.861-3.397z"
                                                            ></path>
                                                            <path
                                                                fill="#F7F7F7"
                                                                d="M15.814 24.816c-1.55-1.7-3.248-2.585-5.097-2.653-1.848-.069-3.477.692-4.885 2.282 1.55 1.7 3.248 2.584 5.096 2.653 1.849.068 3.477-.692 4.886-2.282z"
                                                            ></path>
                                                            <path
                                                                fill="#222"
                                                                d="M5.037 24.941c-.297-.326-.316-.769-.046-1.074 1.53-1.728 3.416-2.671 5.662-2.588 2.246.083 4.218 1.17 5.902 3.018.297.326.316.769.046 1.074-1.53 1.728-3.416 2.671-5.662 2.588-2.246-.084-4.218-1.17-5.902-3.018zm2.083-.459c1.235 1.161 2.48 1.685 3.744 1.732 1.265.047 2.468-.386 3.608-1.459-1.235-1.16-2.48-1.684-3.744-1.731-1.265-.047-2.469.386-3.608 1.458z"
                                                            ></path>
                                                            <path
                                                                fill="#F7F7F7"
                                                                d="M10.809 21.467c-.463-2.109-1.513-3.612-3.15-4.509-1.636-.897-3.533-1.009-5.688-.336.463 2.109 1.512 3.612 3.149 4.509 1.637.897 3.533 1.01 5.689.336z"
                                                            ></path>
                                                            <path
                                                                fill="#222"
                                                                d="M.925 16.707c-.09-.405.152-.788.58-.921 2.361-.737 4.599-.654 6.58.432 1.972 1.081 3.149 2.858 3.65 5.14.089.405-.152.787-.582.921-2.36.738-4.598.654-6.579-.432-1.972-1.081-3.149-2.858-3.65-5.14zm2.161.521c.48 1.53 1.327 2.542 2.46 3.163 1.117.612 2.43.8 4.027.446-.48-1.53-1.326-2.541-2.46-3.163-1.117-.612-2.43-.8-4.027-.446z"
                                                            ></path>
                                                            <path
                                                                fill="#F7F7F7"
                                                                d="M8.042 16.39c.747-1.953.628-3.672-.358-5.157-.987-1.486-2.643-2.44-4.968-2.864-.748 1.952-.628 3.67.358 5.156.986 1.486 2.642 2.44 4.968 2.864z"
                                                            ></path>
                                                            <path
                                                                fill="#222"
                                                                d="M1.793 8.046c.15-.39.606-.608 1.086-.52 2.553.465 4.518 1.55 5.698 3.328 1.176 1.77 1.265 3.763.454 5.88-.149.39-.605.608-1.085.52-2.553-.465-4.518-1.55-5.698-3.328-1.176-1.77-1.265-3.763-.455-5.88zm1.679 1.378c-.398 1.465-.193 2.685.496 3.722.68 1.023 1.766 1.775 3.385 2.21.398-1.466.193-2.685-.496-3.723-.68-1.023-1.766-1.774-3.385-2.21z"
                                                            ></path>
                                                        </g>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2925_10022">
                                                            <path
                                                                fill="#fff"
                                                                d="M0 0H20V32H0z"
                                                                transform="translate(.133 .763)"
                                                            ></path>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <div className="hidden w-0 text-center text-base text-gray-700 md:order-2 md:block md:w-1/4">
                                                {dict.successPercentageAll}
                                            </div>
                                            <div className="border-l-solid order-1 w-1/3 flex-col items-center justify-center border-l-2 border-l-gray-400 text-center text-2xl font-semibold text-neutral-800 md:order-3 md:w-1/4">
                                                <span className="text-md md:text-3xl">
                                                    {roundNumber(analysisPower)}
                                                </span>
                                                <div className="flex items-center justify-center gap-1">
                                                    <svg
                                                        style={{
                                                            color:
                                                                Math.round(
                                                                    analysisPower
                                                                ) > 0
                                                                    ? '#0C0E3C'
                                                                    : '#E0E0E0',
                                                        }}
                                                        width={22}
                                                        height={20}
                                                        className="text-neutral-800"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor"
                                                        viewBox="0 0 22 20"
                                                    >
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>
                                                    <svg
                                                        style={{
                                                            color:
                                                                Math.round(
                                                                    analysisPower
                                                                ) > 1
                                                                    ? '#0C0E3C'
                                                                    : '#E0E0E0',
                                                        }}
                                                        width={22}
                                                        height={20}
                                                        className="text-neutral-800"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor"
                                                        viewBox="0 0 22 20"
                                                    >
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>
                                                    <svg
                                                        style={{
                                                            color:
                                                                Math.round(
                                                                    analysisPower
                                                                ) > 2
                                                                    ? '#0C0E3C'
                                                                    : '#E0E0E0',
                                                        }}
                                                        width={22}
                                                        height={20}
                                                        className="text-gray-300"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor"
                                                        viewBox="0 0 22 20"
                                                    >
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>
                                                    <svg
                                                        style={{
                                                            color:
                                                                Math.round(
                                                                    analysisPower
                                                                ) > 3
                                                                    ? '#0C0E3C'
                                                                    : '#E0E0E0',
                                                        }}
                                                        width={22}
                                                        height={20}
                                                        className="text-gray-300"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor"
                                                        viewBox="0 0 22 20"
                                                    >
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>
                                                    <svg
                                                        style={{
                                                            color:
                                                                Math.round(
                                                                    analysisPower
                                                                ) > 4
                                                                    ? '#0C0E3C'
                                                                    : '#E0E0E0',
                                                        }}
                                                        width={22}
                                                        height={20}
                                                        className="text-gray-300"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor"
                                                        viewBox="0 0 22 20"
                                                    >
                                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="border-r-solid order-4 w-1/3 flex-col items-center justify-center border-r-2 border-r-gray-400 text-center md:w-1/4 md:border-0">
                                                <span className="block text-2xl font-bold text-neutral-800">
                                                    {
                                                        messagesCount
                                                            .message_aggregate
                                                            .aggregate.count
                                                    }
                                                </span>
                                                <span className="block">
                                                    {dict.messageNum}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <Content
                            id={id}
                            publisher={publisher}
                            dict={dict}
                            market={market}
                            lang={lang}
                            messages={messages}
                            isAnalytical={isAnalytical}
                        />
                        <Disclaimer className="mt-5" />
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
                        name: 'مسیریاب | سهمتو',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                item: {
                                    '@id': 'https://sahmeto.com',
                                    name: 'سهمتو',
                                },
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                item: {
                                    '@id': `https://sahmeto.com/publisher/publisher.id`,
                                    name: 'ticker.symbol_fa',
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
                        name: 'راهنما | سهمتو',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                name: 'تحلیل نمودار سهام چه چیزی را نشان می‌دهد؟',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'سهمتو تمام پیام‌های تحلیلگران در شبکه‌های اجتماعی از قبیل کانال تلگرام، سایت رهاورد و سهامیاب را جمع‌اوری می‌کند و بر اساس الگوریتم هوش مصنوعی تعداد سیگنال خرید و فروش هر سهم را شناسایی کرده و در آخر جمع‌بندی نظرات تحلیلگران شبکه‌اجتماعی را در قالب این نمودار نشان می‌دهد.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'عقربه این نمودار چگونه زمان خرید و فروش سهام را مشخص می‌کند؟',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'اگر عقربه این نمودار به سمت خرید باشد یعنی از دید تحلیلگران وقت خرید این سهام است و اگر به سمت فروش باشد یعنی بهتر است به فکر فروش و سیو سود سهم باشید. اگر عقربه در محدوه‌ی خنثی قرار گرفته باشد، سهم نوسانی است و هنوز وقت مناسبی برای خرید یا فروش سهم نیست.',
                                },
                            },
                        ],
                    }),
                }}
            />
        </>
    );
}

export async function generateStaticParams() {
    const publishers = await getTopPublishers({
        limit: 300,
    });
    if (process.env.NEXT_PUBLIC_ISR === 'OFF') return [];
    return publishers.map(({ primary_username }) => ({
        lang: 'fa',
        id: primary_username,
    }));
}
