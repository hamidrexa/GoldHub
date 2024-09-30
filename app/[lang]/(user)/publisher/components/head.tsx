'use client';

import Image from 'next/image';
import { cn, getImage, getLinksLang } from '@/libs/utils';
import { FollowButton } from '@/components/follow-button';
import { ContentTypes } from '@/constants/content-types';
import React, { useEffect, useState } from 'react';
import { VerifiedIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useGlobalContext } from '@/contexts/store';
import Spinner from '@/components/spinner';
import { publisherOwnership } from '@/app/[lang]/(user)/publisher/services/publisherOwnership';
import { getPublisher } from '@/app/[lang]/(user)/publisher/services/getPublisher';
import { usePathname, useRouter } from 'next/navigation';
import { componentFormat } from '@/libs/stringFormatter';
import Link from 'next/link';

export function Head({ dict, lang, id, purePublisher }) {
    const { user } = useGlobalContext();
    const [publisher, setPublisher] = useState(purePublisher);
    const [isLoading, setIsLoading] = useState(false);
    const [claimPageStep, setClaimPageStep] = useState('requesting');
    const router = useRouter();
    const path = usePathname();
    const isChannelClaimed =
        user?.trader.id === publisher.id || publisher.has_owner;
    const userHasTrader =
        user &&
        (!!user.trader.id || user.trader_page_request.id === publisher.id);

    useEffect(() => {
        async function getData() {
            setPublisher(await getPublisher(id));
        }

        getData();
    }, []);

    const requestToClaimPage = async () => {
        if (!user)
            return router.push(`${getLinksLang(lang)}/user/login?url=${path}`);

        setIsLoading(true);
        await publisherOwnership(publisher.id);
        setIsLoading(false);
        setClaimPageStep('sent');
    };

    return (
        <div>
            <div className="flex items-start justify-between md:items-center">
                <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-5">
                    <div className="flex h-16 max-h-16 min-h-16 w-16 min-w-16 max-w-16 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-700 p-1">
                        <Image
                            className="h-full w-full rounded-full object-contain"
                            src={getImage(publisher)}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = `/img/sources/${publisher.account_type}.png`;
                            }}
                            alt={publisher.name}
                            width={64}
                            height={64}
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:gap-2.5">
                        <h1 className="text-base font-medium md:text-3xl md:font-black">
                            {publisher.name}
                            {publisher.has_owner && (
                                <VerifiedIcon
                                    className="inline-block h-5 w-5 md:h-7 md:w-7"
                                    fill="#2830C9"
                                    color="#fff"
                                />
                            )}
                        </h1>
                        <h3
                            className="text-sm font-medium rtl:text-right"
                            dir="ltr"
                        >
                            @{publisher.primary_username}
                        </h3>
                    </div>
                </div>
                <FollowButton
                    dict={dict}
                    lang={lang}
                    defaultValue={publisher.book_marked_by_user}
                    id={publisher.id}
                    type="publisher"
                    typeId={ContentTypes.publisher}
                    name={publisher.name}
                    render={(isLoading, follow) => (
                        <button
                            className={cn(
                                'flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium md:px-6 md:text-sm md:font-bold',
                                follow
                                    ? 'border border-neutral-100 text-neutral-800'
                                    : 'bg-neutral-700 text-white',
                                {
                                    'animate-pulse': isLoading,
                                }
                            )}
                            disabled={isLoading}
                        >
                            <svg
                                className="h-4 w-4 md:h-6 md:w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="none"
                                viewBox="0 0 26 26"
                            >
                                <g filter="url(#filter0_b_2495_8326)">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M10.246 17.674c-4.987 0-9.246.753-9.246 3.773s4.232 3.801 9.246 3.801c4.986 0 9.245-.755 9.245-3.773 0-3.02-4.231-3.801-9.245-3.801z"
                                    ></path>
                                </g>
                                <g filter="url(#filter1_b_2495_8326)">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M10.244 13.366A5.905 5.905 0 0016.17 7.44a5.904 5.904 0 00-5.926-5.926A5.905 5.905 0 004.318 7.44a5.906 5.906 0 005.926 5.926z"
                                    ></path>
                                </g>
                                {!follow && (
                                    <>
                                        <g filter="url(#filter2_b_2495_8326)">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M22.346 9.193v5.202"
                                            ></path>
                                        </g>
                                        <g filter="url(#filter3_b_2495_8326)">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M25 11.794h-5.307"
                                            ></path>
                                        </g>
                                    </>
                                )}
                                <defs>
                                    <filter
                                        id="filter0_b_2495_8326"
                                        width="41.045"
                                        height="30.128"
                                        x="-10.276"
                                        y="6.397"
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
                                            result="effect1_backgroundBlur_2495_8326"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2495_8326"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter1_b_2495_8326"
                                        width="34.404"
                                        height="34.405"
                                        x="-6.958"
                                        y="-9.762"
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
                                            result="effect1_backgroundBlur_2495_8326"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2495_8326"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter2_b_2495_8326"
                                        width="22.553"
                                        height="27.755"
                                        x="11.069"
                                        y="-2.083"
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
                                            result="effect1_backgroundBlur_2495_8326"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2495_8326"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                    <filter
                                        id="filter3_b_2495_8326"
                                        width="27.859"
                                        height="22.553"
                                        x="8.417"
                                        y="0.517"
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
                                            result="effect1_backgroundBlur_2495_8326"
                                        ></feComposite>
                                        <feBlend
                                            in="SourceGraphic"
                                            in2="effect1_backgroundBlur_2495_8326"
                                            result="shape"
                                        ></feBlend>
                                    </filter>
                                </defs>
                            </svg>
                            {follow ? dict.followed : dict.follow}
                        </button>
                    )}
                />
            </div>
            {!isChannelClaimed && !userHasTrader && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="mt-5 flex items-center gap-2.5 rounded-md border border-neutral-700 bg-slate-50/40 px-16 py-2 text-sm font-bold text-neutral-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="19"
                                fill="none"
                                viewBox="0 0 18 19"
                            >
                                <g
                                    stroke="#2830C9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    clipPath="url(#clip0_2495_8342)"
                                >
                                    <path d="M9.165 2.262h-.33a1.5 1.5 0 00-1.5 1.5v.135a1.5 1.5 0 01-.75 1.298l-.323.187a1.5 1.5 0 01-1.5 0l-.112-.06a1.5 1.5 0 00-2.048.548l-.165.285a1.5 1.5 0 00.548 2.047l.112.075a1.5 1.5 0 01.75 1.29v.383a1.5 1.5 0 01-.75 1.305l-.112.067a1.5 1.5 0 00-.548 2.048l.165.285a1.5 1.5 0 002.048.548l.112-.06a1.5 1.5 0 011.5 0l.323.187a1.5 1.5 0 01.75 1.297v.135a1.5 1.5 0 001.5 1.5h.33a1.5 1.5 0 001.5-1.5v-.135a1.5 1.5 0 01.75-1.297l.322-.188a1.5 1.5 0 011.5 0l.113.06a1.5 1.5 0 002.047-.547l.165-.292a1.5 1.5 0 00-.547-2.048l-.113-.06a1.5 1.5 0 01-.75-1.305v-.375a1.5 1.5 0 01.75-1.305l.113-.068a1.5 1.5 0 00.547-2.047l-.165-.285a1.5 1.5 0 00-2.047-.548l-.113.06a1.5 1.5 0 01-1.5 0l-.322-.187a1.5 1.5 0 01-.75-1.298v-.135a1.5 1.5 0 00-1.5-1.5z"></path>
                                    <path d="M9 12.012a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_2495_8342">
                                        <path
                                            fill="#fff"
                                            d="M0 0H18V18H0z"
                                            transform="translate(0 .762)"
                                        ></path>
                                    </clipPath>
                                </defs>
                            </svg>
                            {dict.pageOwner}
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        {claimPageStep === 'requesting' && (
                            <div>
                                <h5 className="mt-6 text-3xl leading-relaxed">
                                    <span className="font-black">
                                        {dict.Authentication}
                                    </span>{' '}
                                    <span className="relative inline-block font-black">
                                        {publisher.name}
                                        <span className="absolute bottom-0 left-0 right-0 top-[22px] -z-10 h-5 bg-neutral-300" />
                                    </span>{' '}
                                    {dict.blueTick}
                                </h5>
                                <button
                                    className="max-w-1/3 no-gap mx-auto mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-neutral-800 px-6 text-lg font-bold text-neutral-300"
                                    onClick={requestToClaimPage}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Spinner height={22} width={22} />
                                    ) : (
                                        dict.Continue
                                    )}
                                </button>
                            </div>
                        )}
                        {claimPageStep === 'sent' && (
                            <div>
                                <h5 className="mt-6 text-3xl font-black leading-relaxed">
                                    {componentFormat(
                                        dict.ownerRequestSuccess,
                                        {},
                                        <span className="bottom-0 left-0 right-0 top-[18px] -z-10 h-5 bg-neutral-300">
                                            {dict.withSuccess}
                                        </span>
                                    )}
                                    <br />
                                    {dict.doFollowing}:
                                </h5>
                                <p className="mt-6 text-xl">
                                    {dict.setTelegramDescription}
                                    <b
                                        className="my-1.5 block text-center"
                                        dir="ltr"
                                    >
                                        {user.id}@sahmeto
                                    </b>
                                    {dict.ownerShipWillCheck}
                                </p>
                                <Link
                                    className="max-w-1/3 no-gap mx-auto mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-neutral-800 px-6 text-lg font-bold text-neutral-300"
                                    href="/profile#trader"
                                >
                                    {dict.Continue}
                                </Link>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
