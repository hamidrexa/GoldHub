'use client';

import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useGlobalContext } from '@/contexts/store';
import React, { useEffect, useState } from 'react';
import { componentFormat } from '@/libs/stringFormatter';
import { usePathname, useRouter } from 'next/navigation';

export function UserSentiment({
    market,
    id,
    dict,
    symbol,
}: {
    market: string;
    id: string;
    dict: any;
    symbol: string;
}) {
    const { user } = useGlobalContext();
    const [sentiment, setSentiment] = useState(null);
    const [step, setStep] = useState('voting');
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        getSentiment();
    }, []);
    useEffect(() => {
        if (sentiment?.voted) setStep('voted');
    }, [sentiment]);

    const getSentiment = async () => {
        let url =
            market === 'tse'
                ? `${process.env.NEXT_PUBLIC_API_URL}/v1/core/ticker/${id}/sentiments`
                : `${process.env.NEXT_PUBLIC_API_URL}/v1/cryptocurrencies/${id}/sentiments`;
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        });

        if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

        setSentiment(await res.json());
    };
    const onSubmit = async (value) => {
        if (!user)
            return toast.info(dict.loginPrompt, {
                action: {
                    label: dict.login,
                    onClick: () => router.push(`/login?url=${path}`),
                },
            });
        let url =
            market === 'tse'
                ? `${process.env.NEXT_PUBLIC_API_URL}/v1/core/ticker/${id}/sentiments`
                : `${process.env.NEXT_PUBLIC_API_URL}/v1/cryptocurrencies/${id}/sentiments`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({
                value,
            }),
        });

        if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

        const data = await res.json();
        setSentiment(data);
        toast(dict.commentSuccessfullSubmit);
        setStep('voted');
    };

    return (
        <div>
            {step === 'voting' && (
                <div className="flex w-full items-center justify-evenly gap-10 py-4">
                    <div className="flex flex-col gap-1.5">
                        <h3 className="w-full whitespace-nowrap text-center text-sm text-slate-900">
                            {componentFormat(
                                dict.yourCommentAboutSymbol,
                                {},
                                <span className="text-base font-extrabold">
                                    {' '}
                                    {symbol}
                                </span>
                            )}
                        </h3>
                        <button
                            className="underline underline-offset-2"
                            onClick={() => setStep('see-votes')}
                        >
                            {dict.showUsersComments}
                            {sentiment && (
                                <span className="font-bold ltr:ml-1 rtl:mr-1">
                                    {sentiment.count} {dict.opinion}
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => onSubmit('B')}
                            className="flex h-[55px] items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-400 bg-neutral-400/5 px-5 text-neutral-400"
                        >
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 19 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M17 5.75L10.625 12.125L6.875 8.375L2 13.25"
                                    stroke="#07BB61"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12.5 5.75H17V10.25"
                                    stroke="#07BB61"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="font-extrabold">{dict.buy}</div>
                        </button>
                        <button
                            onClick={() => onSubmit('S')}
                            className="flex h-[55px] items-center justify-center gap-2 rounded-full border-2 border-solid border-neutral-600 bg-neutral-600/5 px-5 text-neutral-600"
                        >
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 19 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M17 13.25L10.625 6.875L6.875 10.625L2 5.75"
                                    stroke="#F31616"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12.5 13.25H17V8.75"
                                    stroke="#F31616"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="font-extrabold">{dict.sell}</div>
                        </button>
                    </div>
                </div>
            )}
            {step === 'see-votes' && (
                <div className="flex w-full items-center justify-evenly gap-10 py-4">
                    <div className="flex flex-col gap-1.5">
                        <button
                            className="underline underline-offset-2"
                            onClick={() => setStep('voting')}
                        >
                            {dict.backToSubmitComment}
                        </button>
                    </div>
                    {sentiment && (
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex w-52 items-center overflow-hidden rounded-lg">
                                {sentiment.result.buy > 0 && (
                                    <div
                                        className="flex h-10 items-center justify-center bg-neutral-400 text-white"
                                        style={{
                                            width: `${sentiment.result.buy}%`,
                                        }}
                                    >
                                        {sentiment.result.buy}%
                                    </div>
                                )}
                                {sentiment.result.sell > 0 && (
                                    <div
                                        className="flex h-10 items-center justify-center bg-neutral-600 text-white"
                                        style={{
                                            width: `${sentiment.result.sell}%`,
                                        }}
                                    >
                                        {sentiment.result.sell}%
                                    </div>
                                )}
                            </div>
                            <div className="mt-2">
                                {componentFormat(
                                    dict.commentsOfUsersAboutSymbol,
                                    {
                                        symbol,
                                    },
                                    <span className="inline-flex font-bold">
                                        {dict.users}
                                    </span>
                                )}
                                {sentiment && (
                                    <span className="inline-block font-bold ltr:ml-1 rtl:mr-1">
                                        {sentiment.count} {dict.opinion}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {step === 'voted' && (
                <div className="flex w-full items-center justify-evenly gap-10 py-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="text-center">
                            {dict.commentSuccessfullSubmit}
                        </div>
                        <div className="mt-2">
                            {componentFormat(
                                dict.usersCanCommentJustOnceInDay,
                                {},
                                <span className="inline-flex font-bold underline underline-offset-2">
                                    {dict.once}
                                </span>
                            )}
                        </div>
                    </div>
                    {sentiment && (
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex w-52 items-center overflow-hidden rounded-lg">
                                {sentiment.result.buy > 0 && (
                                    <div
                                        className="flex h-10 items-center justify-center bg-neutral-400 text-white"
                                        style={{
                                            width: `${sentiment.result.buy}%`,
                                        }}
                                    >
                                        {sentiment.result.buy}%
                                    </div>
                                )}
                                {sentiment.result.sell > 0 && (
                                    <div
                                        className="flex h-10 items-center justify-center bg-neutral-600 text-white"
                                        style={{
                                            width: `${sentiment.result.sell}%`,
                                        }}
                                    >
                                        {sentiment.result.sell}%
                                    </div>
                                )}
                            </div>
                            <div className="mt-2">
                                {componentFormat(
                                    dict.commentsOfUsersAboutSymbol,
                                    {
                                        symbol,
                                    },
                                    <span className="inline-flex font-bold">
                                        {dict.users}
                                    </span>
                                )}
                                {sentiment && (
                                    <span className="inline-block font-bold ltr:ml-1 rtl:mr-1">
                                        {sentiment.count} {dict.opinion}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
