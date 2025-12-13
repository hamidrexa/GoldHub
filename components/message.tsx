'use client';

import { Badge } from '@/components/ui/badge';
import { ReadMore } from '@/components/read-more';
import React, { useEffect, useState } from 'react';
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import dayjs from 'dayjs';
import useShare from '@/libs/useShare';
import {
    cn,
    convertDateToHumanTime,
    currency,
    fetcher,
    formatDuration,
    getDirection,
    getImageUrl,
    getLinksLang,
} from '@/libs/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useGlobalContext } from '@/contexts/store';
import stringFormatter from '@/libs/stringFormatter';
import { FollowButton } from '@/components/follow-button';
import { ContentTypes } from '@/constants/content-types';
import { Publisher } from '@/components/publisher';
import { Countries } from '@/constants/countries';
import { EditIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import durationPlugin from 'dayjs/plugin/duration';
import { toast } from 'sonner';
import { EditSignalForm } from './edit-signal-form';

dayjs.extend(durationPlugin);

interface MessageProps {
    publisher: any;
    message: any;
    signal?: any;
    symbol?: any;
    dict: any;
    lang: any;
    market: any;
    follow?: boolean;
    className?: any;
}

export function Message({
    publisher,
    message,
    signal = {},
    symbol,
    dict,
    lang,
    market,
    follow = true,
    className,
}: MessageProps) {
    const { user } = useGlobalContext();
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [reportProblemStatus, setReportProblemStatus] = useState(false);
    const [reportProblemLoading, setReportProblemLoading] = useState(false);
    const [showTranslate, setShowTranslate] = useState(true);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSupported, shareContent] = useShare();
    const [photoThumbnail, setPhotoThumbnail] = useState(
        message.photo && getImageUrl(message.photo.thumbnail)
    );
    const [photo, setPhoto] = useState(
        message.photo && getImageUrl(message.photo.image)
    );
    const powerOfAnalytics = publisher.power_of_analysis * 5;
    const messageImageAlt = signal.value
        ? `${
              signal.value !== 'N' ? dict.bargainTypes[signal.value].title : ''
          }${symbol ?? ''}${
              signal.type && signal.type !== 'N'
                  ? `،${dict.analysisTypes[signal.type].title}`
                  : ''
          }${publisher.name ? `،${publisher.name}` : ''}`
        : '';
    const canEdit =
        (user?.trader.primary_username === publisher.primary_username &&
            dayjs().diff(message.date, 'hour') <= 24) ||
        user?.is_superuser;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const handleHashChange = (hash) => {
            if (window.location.hash !== '#photo-view') setVisible(false);
        };
        setIsMounted(true);

        window.addEventListener('hashchange', handleHashChange, false);
        return () => {
            window.removeEventListener('hashchange', handleHashChange, false);
        };
    }, []);

    const getMessage = (message, showTranslate) => {
        if (showTranslate)
            return (
                message?.translated_html ||
                message?.html_message ||
                message?.text
            );

        return message?.html_message || message?.text;
    };
    const reportProblem = async () => {
        setReportProblemLoading(true);
        await fetcher({
            absoluteUrl:
                'https://strapi-sahmeto.darkube.app/api/message-reports',
            method: 'POST',
            body: {
                data: {
                    messageId: message.id,
                },
            },
        });
        toast.info(dict.viewpointSubmitted);
        setReportProblemLoading(false);
        setReportProblemStatus(true);
    };

    const handlePhotoViewHash = (state) => {
        if (state) window.location.hash = '#photo-view';
        else window.history.back();
    };

    return (
        <div
            className={cn(
                'flex w-full flex-col items-start justify-between overflow-hidden rounded-lg border border-neutral-100 bg-white',
                className
            )}
            style={{
                boxShadow: '0px 0px 18px 0px rgba(12, 14, 60, 0.15)',
            }}
        >
            <div className="flex w-full items-center justify-between border-b border-b-neutral-100 p-5">
                <Publisher lang={lang} publisher={publisher} dict={dict} />
                <FollowButton
                    dict={dict}
                    lang={lang}
                    defaultValue={publisher.bookmarked_by_user}
                    id={publisher.id}
                    type="publisher"
                    typeId={23}
                    name={publisher.name}
                    render={(isLoading, follow) => (
                        <button
                            className={cn(
                                'flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-bold',
                                follow
                                    ? 'bg-blue-700 text-white'
                                    : 'border border-neutral-100 text-neutral-800',
                                { 'animate-pulse': isLoading }
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
            <div className="h-full w-full">
                <div className="flex flex-col gap-4 self-stretch p-5 text-sm md:text-base">
                    {message.photo && (
                        <>
                            <Image
                                className="h-52 w-full cursor-pointer rounded-lg object-cover"
                                src={photoThumbnail}
                                width={500}
                                height={208}
                                alt={messageImageAlt}
                                unoptimized
                                onClick={() => {
                                    setVisible(true);
                                    handlePhotoViewHash(true);
                                }}
                                onError={() => {
                                    setPhotoThumbnail(
                                        getImageUrl(message.photo.fallback)
                                    );
                                    setPhoto(
                                        getImageUrl(message.photo.fallback)
                                    );
                                }}
                            />
                            <PhotoSlider
                                className="z-[999]"
                                maskOpacity={0.5}
                                images={[
                                    {
                                        src: photo,
                                        key: message.id,
                                    },
                                ]}
                                visible={visible}
                                onClose={() => {
                                    handlePhotoViewHash(false);
                                }}
                                index={index}
                                onIndexChange={setIndex}
                                toolbarRender={({
                                    onScale,
                                    scale,
                                    rotate,
                                    onRotate,
                                }) => {
                                    return (
                                        <>
                                            <svg
                                                width={44}
                                                height={44}
                                                className="PhotoView-Slider__toolbarIcon"
                                                fill="#fff"
                                                viewBox="0 0 768 768"
                                                onClick={() =>
                                                    onScale(scale + 1)
                                                }
                                            >
                                                <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM415.5 223.5v129h129v63h-129v129h-63v-129h-129v-63h129v-129h63z"></path>
                                            </svg>
                                            <svg
                                                width={44}
                                                height={44}
                                                fill="#fff"
                                                viewBox="0 0 768 768"
                                                className="PhotoView-Slider__toolbarIcon"
                                                onClick={() =>
                                                    onScale(scale - 1)
                                                }
                                            >
                                                <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM223.5 352.5h321v63h-321v-63z"></path>
                                            </svg>
                                            <svg
                                                width={44}
                                                height={44}
                                                fill="#fff"
                                                viewBox="0 0 768 768"
                                                className="PhotoView-Slider__toolbarIcon"
                                                onClick={() =>
                                                    onRotate(rotate + 90)
                                                }
                                            >
                                                <path d="M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z"></path>
                                            </svg>
                                        </>
                                    );
                                }}
                            />
                        </>
                    )}
                    <ReadMore
                        lines={3}
                        className="rendered-html font-medium"
                        more={dict.showFullText}
                        dict={dict}
                        dir={
                            !!showTranslate && !!message.translated_html
                                ? getDirection(lang)
                                : message.message_language !== 'fa'
                                  ? 'auto'
                                  : 'rtl'
                        }
                        text={getMessage(message, showTranslate)}
                    />
                    <div className="flex items-center justify-between gap-2 text-xs">
                        <div
                            className={cn('flex items-center gap-2', {
                                invisible:
                                    message.account_type !== 'tradingview' &&
                                    !message.translated_html,
                            })}
                        >
                            <svg
                                className="h-6 w-6"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 8L11 14"
                                    stroke="#84859C"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4 14L10 8L12 5"
                                    stroke="#84859C"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M2 5H14"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M7 2H8"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M22 22L17 12L12 22"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M14 18H20"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {dict.translatedFrom}:{' '}
                            {Countries[message.message_language]}
                            <span className="h-4 border-r-2 border-r-slate-300" />
                            <div
                                className="cursor-pointer underline underline-offset-2"
                                onClick={() => setShowTranslate(!showTranslate)}
                            >
                                {dict.showOriginalMessage}
                            </div>
                        </div>
                        {!reportProblemStatus && (
                            <button
                                className="flex items-center gap-2 underline underline-offset-2"
                                onClick={reportProblem}
                                disabled={reportProblemLoading}
                            >
                                {dict.issueReport}
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
                                        d="M16.297 13.672l-6-10.5a1.5 1.5 0 00-2.61 0l-6 10.5A1.5 1.5 0 003 15.922h12a1.499 1.499 0 001.297-2.25zM9 6.922v3"
                                    ></path>
                                    <path
                                        stroke="#000"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M9 12.922h.008"
                                    ></path>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-3 self-stretch p-5 text-center text-xs text-neutral-700">
                    {symbol && (
                        <div className="flex flex-row flex-wrap items-center gap-2 self-stretch">
                            <Badge size="sm" variant="outline-blue" rel="tag">
                                {symbol}
                            </Badge>
                        </div>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-neutral-800">
                        {signal.value && (
                            <Badge
                                variant={
                                    dict.bargainTypes[signal.value].variant
                                }
                            >
                                {dict.signalType}:{' '}
                                {dict.bargainTypes[signal.value].title}
                            </Badge>
                        )}
                        <Badge variant="light" className="gap-2">
                            {isMounted &&
                                convertDateToHumanTime(
                                    dict,
                                    lang,
                                    message.date
                                )}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                fill="none"
                                viewBox="0 0 20 21"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M17.584 10.5a7.583 7.583 0 11-15.167 0 7.583 7.583 0 0115.167 0z"
                                ></path>
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M10 5.5v5l-3.333 1.667"
                                ></path>
                            </svg>
                        </Badge>
                    </div>
                    <div className="flex gap-2 text-neutral-800">
                        <Badge variant="light">
                            <span className="whitespace-nowrap">
                                {dict.source} {dict.message}:
                            </span>
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
                            {message.reference && (
                                <>
                                    {publisher.account_type !== 'rahavard' ? (
                                        <a
                                            href={message.reference}
                                            className="line-clamp-1 font-medium underline underline-offset-2"
                                            rel="nofollow"
                                            target="_blank"
                                        >
                                            {stringFormatter(
                                                dict.seeOriginalMessageInSource,
                                                {
                                                    source: dict
                                                        .messagesSourceType[
                                                        publisher.account_type
                                                    ].title,
                                                }
                                            )}
                                        </a>
                                    ) : (
                                        <span className="line-clamp-1 font-medium">
                                            {
                                                dict.messagesSourceType[
                                                    publisher.account_type
                                                ].title
                                            }
                                        </span>
                                    )}
                                </>
                            )}
                        </Badge>
                    </div>
                    <div className="flex gap-2 overflow-auto text-sm">
                        {!!signal.timeframe && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">
                                    {dict.timeframe}:
                                </div>
                                <b className="text-neutral-800">
                                    {dict.timeframes[signal.timeframe] ??
                                        `${formatDuration(signal.timeframe)}`}
                                </b>
                            </div>
                        )}
                        {!!signal.timeout && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">
                                    {dict.timeout}:
                                </div>
                                <b className="text-neutral-800">
                                    {dayjs(signal.timeout).diff(
                                        signal.message_date,
                                        'day'
                                    )}{' '}
                                    {dict.day}
                                </b>
                            </div>
                        )}
                        {!!signal.entry_point_price && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">
                                    {dict.entryPoint}:
                                </div>
                                <b className="text-neutral-800">
                                    {currency(
                                        signal.entry_point_price,
                                        market,
                                        lang
                                    )}
                                </b>
                            </div>
                        )}
                        {!!signal.profit_target_price && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">
                                    {dict.profitPrice}:
                                </div>
                                <b className="text-neutral-800">
                                    {currency(
                                        signal.profit_target_price,
                                        market,
                                        lang
                                    )}
                                </b>
                            </div>
                        )}
                        {!!signal.stop_loss_price && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">
                                    {dict.stopLossPrice}
                                </div>
                                <b className="text-neutral-800">
                                    {currency(
                                        signal.stop_loss_price,
                                        market,
                                        lang
                                    )}
                                </b>
                            </div>
                        )}
                        {!!signal?.support_price && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">
                                    {dict.supportPrice}:
                                </div>
                                <b className="text-neutral-800">
                                    {currency(
                                        signal.support_price,
                                        market,
                                        lang
                                    )}
                                </b>
                            </div>
                        )}
                        {!!signal.resistance_price && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">
                                    {dict.resistancePrice}:
                                </div>
                                <b className="text-neutral-800">
                                    {currency(
                                        signal.resistance_price,
                                        market,
                                        lang
                                    )}
                                </b>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 overflow-auto text-sm">
                        {!!signal.price && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">
                                    {dict.publishPrice}:
                                </div>
                                <b className="text-neutral-800">
                                    {currency(signal.price, market, lang)}
                                </b>
                            </div>
                        )}
                    </div>
                    {canEdit && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <div className="flex w-full items-center justify-between rounded-md bg-slate-50/40 p-3 text-base">
                                    در صورتی که داده ارائه شده اشتباه است، لطفا
                                    اصلاح نمایید
                                    <Button variant="outline">
                                        <EditIcon strokeWidth={1.2} />
                                        اصلاح
                                    </Button>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="w-full overflow-y-scroll px-8 md:max-w-5xl">
                                <EditSignalForm
                                    setOpen={setOpen}
                                    message={message}
                                    dict={dict}
                                    lang={lang}
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
            <div className="flex w-full items-center justify-between gap-1.5 border-t border-t-neutral-100 p-5">
                <div
                    className="flex cursor-pointer items-center gap-4 p-2"
                    onClick={() => {
                        const shareOptions = {
                            title: message.title,
                            text: message.text,
                            url: `https://sahmeto.com/message/${signal.id}`,
                        };
                        // @ts-ignore
                        shareContent(shareOptions);
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
                            stroke="#0C0E3C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
                            stroke="#0C0E3C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
                            stroke="#0C0E3C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8.58984 13.51L15.4198 17.49"
                            stroke="#0C0E3C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M15.4098 6.51001L8.58984 10.49"
                            stroke="#0C0E3C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <b className="relative">{dict.share}</b>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href={`${getLinksLang(lang)}/message/${signal.id}`}
                        target="_blank"
                        className="flex cursor-pointer items-center gap-4"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                                stroke="#0C0E3C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 12L18 12"
                                stroke="#0C0E3C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M6 8L18 8"
                                stroke="#0C0E3C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                    <FollowButton
                        dict={dict}
                        lang={lang}
                        defaultValue={message.bookmarked_by_user}
                        id={message.id}
                        type="message"
                        typeId={ContentTypes.telegramCollectMessage}
                        render={(isLoading, follow) => (
                            <button
                                className={cn(
                                    'flex cursor-pointer items-center gap-4',
                                    { 'animate-pulse': isLoading }
                                )}
                                disabled={isLoading}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill={follow ? '#0C0E3C' : 'none'}
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4.5 16.5C3 17.76 2.5 21.5 2.5 21.5C2.5 21.5 6.24 21 7.5 19.5C8.21 18.66 8.2 17.37 7.41 16.59C7.02131 16.219 6.50929 16.0047 5.97223 15.988C5.43516 15.9714 4.91088 16.1538 4.5 16.5Z"
                                        stroke="#0C0E3C"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 15L9 12C9.53214 10.6194 10.2022 9.29607 11 8.05C12.1652 6.18699 13.7876 4.65305 15.713 3.5941C17.6384 2.53514 19.8027 1.98637 22 2C22 4.72 21.22 9.5 16 13C14.7369 13.7987 13.3968 14.4687 12 15Z"
                                        stroke="#0C0E3C"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9 12H4C4 12 4.55 8.96999 6 7.99999C7.62 6.91999 11 7.99999 11 7.99999"
                                        stroke="#0C0E3C"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 15V20C12 20 15.03 19.45 16 18C17.08 16.38 16 13 16 13"
                                        stroke="#0C0E3C"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
