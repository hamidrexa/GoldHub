'use client';

import { ReadMore } from '@/components/read-more';
import React, { useState } from 'react';
import 'react-photo-view/dist/react-photo-view.css';
import dayjs from 'dayjs';
import {
    cn,
    convertDateToHumanTime,
    getCompanySize,
    getDirection,
    getImage,
    getImageUrl,
    roundNumber,
} from '@/libs/utils';
import Image from 'next/image';
import { FollowButton } from '@/components/follow-button';
import { Publisher } from '@/components/publisher';
import durationPlugin from 'dayjs/plugin/duration';
import { useRouter } from 'next/navigation';
import { getStringRoa } from '@/components/roi';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Message } from '@/components/message';

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

const market = {
    crypto: '',
};

export function MessageCompact({
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
    const router = useRouter();
    const [photoThumbnail, setPhotoThumbnail] = useState(
        message.photo && getImageUrl(message.photo.thumbnail)
    );
    const [photo, setPhoto] = useState(
        message.photo && getImageUrl(message.photo.image)
    );
    const [isOpen, setIsOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(true);

    const getMessage = (message, showTranslate) => {
        if (showTranslate)
            return (
                message?.translated_html ||
                message?.html_message ||
                message?.text
            );

        return message?.html_message || message?.text;
    };
    const getValue = (message) => {
        return message.assets_signals[0].value === 'B' ? ' خرید ' : ' فروش ';
    };

    return (
        <>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isLocked) setIsOpen(true);
                }}
                className={cn(
                    'flex w-full cursor-pointer flex-col items-start justify-between space-y-6 overflow-hidden rounded-lg border-2 bg-white p-5 text-sm shadow-[0px_0px_18px_0px_rgba(12,_14,_60,_0.15)]',
                    className,
                    getStringRoa(signal.value, {
                        colors: {
                            loss: 'border-neutral-600',
                            profit: 'border-neutral-300',
                            neutral: '',
                        },
                    })
                )}
            >
                <div className="flex w-full items-center justify-between">
                    <Publisher publisher={publisher} lang={lang} dict={dict} />
                    <FollowButton
                        dict={dict}
                        lang={lang}
                        defaultValue={publisher.bookmarked_by_user}
                        id={publisher.id}
                        type="publisher"
                        typeId={23}
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
                {message.signals.length > 1 && (
                    <div className="flex items-center text-base font-semibold">
                        <div className="ml-4 md:ml-4">
                            +{message.signals.length - 1} تریدر دیگر
                        </div>
                        {message.signals.slice(1, 5).map((signal, index) => (
                            <div
                                key={index}
                                style={{ zIndex: 10 * index }}
                                className="-mx-3 inline-block items-center rounded-full border-2 border-neutral-700 bg-transparent bg-white p-0.5 first:-mx-2 last:-mx-1"
                            >
                                <Image
                                    className="rounded-full"
                                    width={30}
                                    height={30}
                                    src={getImage({
                                        photo: signal.publisher.photo,
                                        account_type:
                                            signal.publisher.account_type,
                                    })}
                                    alt="publisher_avarat"
                                />
                            </div>
                        ))}
                        <div className="mr-1 md:mr-4">
                            <span className="hidden md:inline-block">
                                این نماد{' '}
                            </span>
                            را توصیه به
                            {getValue(message)}
                            کرده اند.
                        </div>
                    </div>
                )}
                <div className="relative grid w-full grid-cols-2 gap-2">
                    <div className="flex flex-col justify-end gap-2.5">
                        {symbol && <div>{symbol}</div>}
                        <div>
                            {convertDateToHumanTime(dict, lang, message.date)}
                        </div>
                        {signal.value && (
                            <div>
                                {dict.signalType}:{' '}
                                <span className="font-bold">
                                    {dict.bargainTypes[signal.value].title}
                                </span>
                            </div>
                        )}
                    </div>
                    {message.photo && (
                        <Image
                            className="h-[102px] w-full cursor-pointer rounded-lg border border-gray-200 object-cover md:h-[140px]"
                            src={photoThumbnail}
                            width={200}
                            height={102}
                            alt=""
                            unoptimized
                            onError={() => {
                                setPhotoThumbnail(
                                    getImageUrl(message.photo.fallback)
                                );
                                setPhoto(getImageUrl(message.photo.fallback));
                            }}
                        />
                    )}
                    {isLocked && (
                        <div
                            className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center rounded-lg bg-blue-600/20 backdrop-blur-3xl"
                            onClick={() => setIsLocked(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="20"
                                fill="none"
                                viewBox="0 0 17 20"
                            >
                                <g filter="url(#filter0_b_4339_12310)">
                                    <path
                                        fill="#200E32"
                                        d="M4.542 20A4.547 4.547 0 010 15.458v-4.289a4.55 4.55 0 013.052-4.291v-1.6A5.3 5.3 0 018.372 0a5.302 5.302 0 015.297 5.082l.004.22v1.576a4.55 4.55 0 013.052 4.291v4.289A4.547 4.547 0 0112.183 20h-7.64zM1.5 11.17v4.288A3.045 3.045 0 004.542 18.5h7.641a3.045 3.045 0 003.042-3.042v-4.289a3.046 3.046 0 00-3.042-3.042h-7.64A3.046 3.046 0 001.5 11.17zm10.673-4.543V5.3c0-2.099-1.702-3.8-3.804-3.8a3.8 3.8 0 00-3.811 3.585l-.006.195v1.346h7.621zm-4.554 7.9l-.006-.103v-2.22a.75.75 0 011.493-.103l.007.102v2.221a.75.75 0 01-1.494.102z"
                                    ></path>
                                </g>
                                <defs>
                                    <filter
                                        id="filter0_b_4339_12310"
                                        width="36.688"
                                        height="39.963"
                                        x="-9.981"
                                        y="-9.981"
                                        colorInterpolationFilters="sRGB"
                                        filterUnits="userSpaceOnUse"
                                    >
                                        <feFlood
                                            floodOpacity="0"
                                            result="BackgroundImageFix"
                                        ></feFlood>
                                        <feGaussianBlur
                                            in="BackgroundImageFix"
                                            stdDeviation="4.991"
                                        ></feGaussianBlur>
                                        <feComposite
                                            in2="SourceAlpha"
                                            operator="in"
                                            result="effect1_backgroundBlur_4339_12310"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_4339_12310"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                </defs>
                            </svg>
                            <div className="mt-2.5 font-bold">
                                برای مشاهده نماد کلیک کنید
                            </div>
                            <div className="flex items-center gap-2.5 text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M1.666 10s2.5-5.833 8.333-5.833c5.834 0 8.334 5.833 8.334 5.833s-2.5 5.833-8.334 5.833C4.166 15.833 1.666 10 1.666 10z"
                                    ></path>
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                                    ></path>
                                </svg>
                                <span>56</span>
                                بار دیده شده
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full">
                    <ReadMore
                        lines={1}
                        className="rendered-html font-medium"
                        dict={dict}
                        showButton={false}
                        dir={
                            message.translated_html
                                ? getDirection(lang)
                                : 'auto'
                        }
                        text={getMessage(message, true)}
                    />
                </div>
                <div className="w-full">
                    <div className="flex gap-2 overflow-auto text-sm">
                        {!!message.market && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">بازار</div>
                                <b className="text-neutral-800">
                                    {dict.markets[message.market].name}
                                </b>
                            </div>
                        )}
                        {!!message.asset_score && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">امتیاز نماد</div>
                                <b className="text-neutral-800">
                                    {roundNumber(message.asset_score) * 10} از
                                    10
                                </b>
                            </div>
                        )}
                        {!!signal.estimated_order_duration && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">مدت اعتبار</div>
                                <b className="text-neutral-800">
                                    {signal.estimated_order_duration} روز
                                </b>
                            </div>
                        )}
                        {!!signal.estimated_profit_ratio && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">حد سود</div>
                                <b className="text-neutral-800">
                                    {roundNumber(
                                        (signal.estimated_profit_ratio - 1) *
                                            100
                                    )}
                                    %
                                </b>
                            </div>
                        )}
                        {!!message.market_cap && (
                            <div className="flex min-w-[90px] flex-col items-start gap-1.5 rounded-lg bg-slate-50/30 p-2">
                                <div className="font-medium">اندازه شرکت</div>
                                <b className="text-neutral-800">
                                    {getCompanySize(dict, message.market_cap)}
                                </b>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-full w-full overflow-auto md:max-h-[calc(100%-20px)]">
                    {message.signals.map((signal, index) => (
                        <Message
                            key={index}
                            publisher={signal.publisher}
                            message={signal}
                            signal={signal.assets_signals[0]}
                            dict={dict}
                            lang={lang}
                            market={message.market}
                        />
                    ))}
                </DialogContent>
            </Dialog>
        </>
    );
}
